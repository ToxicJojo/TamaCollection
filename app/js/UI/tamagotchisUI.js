const commonUI = require('./commonUI');
const auth = require('../auth');
const tamagotchi = require('../tamagotchi');
const util = require('../util');
const collection = require('../collection');

const versionCommentsUI = require('../components/versionCommentsUI');
const tamagotchiInfoUI = require('../components/tamagotchiInfoUI');

$(() => {
  commonUI.bindEvents();
  versionCommentsUI.bindEvents();
  tamagotchiInfoUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);
  auth.addAuthStateListener(tamagotchiInfoUI.authStateListener);
  auth.addAuthStateListener(authStateListener);

  auth.registerAuthStateListeners();

  loadVersions();
});


// Version

let versions = {};
let releases = {};
let shells = {};

// The default path.
const oldPath = ['', 'tamagotchis'];

// Functions to read values from the current url.
// The versionId, releaseId and shellId are saved in the url to allow users
// to send links that directily display a version/release/shell.
function getCurrentVersionId() {
  // The path looks like /tamagotchis/$versionId
  const path = window.location.pathname.split('/');

  return path[2];
}

function getCurrentVersion() {
  return versions[getCurrentVersionId()];
}

function getOldVersionId() {
  return oldPath[2];
}

// Release

function getCurrentReleaseId() {
  // The path looks like /tamagotchis/$versionId/$releaseId
  const path = window.location.pathname.split('/');

  return path[3];
}

function getCurrentRelease() {
  return releases[getCurrentReleaseId()];
}

function getOldReleaseId() {
  return oldPath[3];
}

// Shell

function getCurrentShellId() {
  // The path looks like /tamagotchis/$versionId/$releaseId/$shellId
  const path = window.location.pathname.split('/');

  return path[4];
}

function getCurrentShell() {
  return shells[getCurrentShellId()];
}

function getOldShellId() {
  return oldPath[4];
}


// Is called whenever the url changes.
// Detects which parts of the url changed
// and loads the appropiated version/release/shell.
// The url looks like /tamagotchis/$versionId/$releaseId/$shellId
function handleLocationChange() {
  const versionId = getCurrentVersionId();

  // Check if a versionId is present and if it changed.
  if (versionId && (getOldVersionId() !== versionId)) {
    handleVersionChange();
    // Save the oldPath. We can reset the versionId ([3]) and shellId ([4])
    // because a versions change means the release/shell changed aswell or are
    // not present.
    oldPath[2] = versionId;
    oldPath[3] = '';
    oldPath[4] = '';
  } else {
    const releaseId = getCurrentReleaseId();
    // Check if a releaseId is present and if it changed
    if (releaseId && getOldReleaseId() !== releaseId) {
      handleReleaseChange();
      // Save the oldPath. We can reset the shellId ([4])
      // because a versions change means the shell changed aswell or is
      // not present.
      oldPath[3] = releaseId;
      oldPath[4] = '';
    } else {
      const shellId = getCurrentShellId();
      // Check if a shellId is present and if it changed
      if (shellId && getOldShellId() !== shellId) {
        handleShellChange();
        oldPath[4] = shellId;
      }
    }
  }
}

// Gets a snapshot of the versions from the database and saves it in 'versions'.
function loadVersions() {
  commonUI.showLoadingSpinner('#versionSelect');

  tamagotchi.getVersions((versionSnapshot) => {
    versions = versionSnapshot.val();
    showVersions();
    // After loading the versions check the url
    // if we need to display a specific version.
    handleLocationChange();
  });
}

// Shows the list of versions in the righthand menue.
function showVersions() {
  const versionSelect = $('#versionSelect');

  // Reset the old versionlist.
  versionSelect.html('<option selected disabled val="">Select a Version</option>');

  util.cycleObjectProperties(versions, (versionId, version) => {
    versionSelect.append(`<option value="${versionId}">${version.name}</option>`);
  });

  versionSelect.LoadingOverlay('hide');
}

function showVersion(version) {
  tamagotchiInfoUI.setVersion(version, getCurrentVersionId());
}


function changeVersion(e) {
  e.preventDefault();

  const versionId = $(this).val();

  history.pushState({}, '', `/tamagotchis/${versionId}`);

  handleLocationChange();
}


function handleVersionChange() {
  const versionId = getCurrentVersionId();

  $('#versionSelect').val(versionId);

  $('#emptyReleases').toggleClass('hidden', true);
  $('#emptyShells').toggleClass('hidden', true);
  $('#emptyVersion').toggleClass('hidden', true);

  showVersion(getCurrentVersion());
  loadReleases(versionId);
  loadComments();
}

function loadReleases(versionId) {
  commonUI.showLoadingSpinner('#releaseNav');

  tamagotchi.getReleases(versionId, (releaseSnapshot) => {
    releases = releaseSnapshot.val();
    showReleases();

    handleLocationChange();
  });
}

function showReleases() {
  const releaseNav = $('#releaseNav');
  releaseNav.html('');

  const releaseContent = $('#releaseContent');
  releaseContent.html('');

  // Check if there are releases for the version.
  if (releases) {
    util.cycleObjectProperties(releases, (releaseId, release) => {
      const releaseData = release;
      releaseData.id = releaseId;

      const templateData = {
        release: releaseData,
      };

      releaseNav.append(releasetabTemplate(templateData));
      releaseContent.append(releasetabcontentTemplate(templateData));
    });
  } else {
    // If there are no releases show the empty state.
    $('#emptyReleases').toggleClass('hidden', false);
  }

  releaseNav.LoadingOverlay('hide');

  $('.tab').on('click', releaseNavClickHandler);

  // Only open the first release if no release is present in the url.
  if (releaseNav.children()[0] && !getCurrentReleaseId()) {
    releaseNav.children()[0].click();
  }
}

function handleReleaseChange() {
  const releaseId = getCurrentReleaseId();

  $('.tab').toggleClass('active', false);
  $(`#releaseNav${releaseId}`).toggleClass('active', true);

  $('.release-content').toggleClass('hidden', true);
  $(`#releaseContent${releaseId}`).toggleClass('hidden', false);

  $('#emptyShells').toggleClass('hidden', true);

  showRelease(getCurrentRelease());
  loadShells(getCurrentReleaseId());
}

function showRelease(release) {
  tamagotchiInfoUI.setRelease(release, getCurrentReleaseId());
}

function releaseNavClickHandler(e) {
  e.preventDefault();

  const releaseId = $(this).data().releaseid;

  history.pushState({}, '', `/tamagotchis/${getCurrentVersionId()}/${releaseId}`);
  handleLocationChange();
}

function loadShells(releaseId) {
  commonUI.showLoadingSpinner('#releaseContent');

  tamagotchi.getShells(releaseId, (shellsSnapshot) => {
    shells = shellsSnapshot.val();
    showShells();
    handleLocationChange();
  });
}

function showShells() {
  const releaseContent = $(`#releaseContent${getCurrentReleaseId()}`);

  releaseContent.html('');

  if (shells) {
    let html = '<div class="row">';

    util.cycleObjectProperties(shells, (shellId, shell) => {
      const shellData = shell;
      shellData.id = shellId;

      const templateData = {
        shell: shellData,
      };

      html += (shellthumbnailTemplate(templateData));
    });

    html += '</div>';
    releaseContent.html(html);
  } else {
    $('#emptyShells').toggleClass('hidden', false);
  }

  $('#releaseContent').LoadingOverlay('hide');

  if (firebase.auth().currentUser) {
    showThumbnailCollectionStatus();
  }

  $('.shellThumbnail').on('click', shellThumbnailClickHandler);
}

function shellThumbnailClickHandler(e) {
  e.preventDefault();

  const shellId = $(this).data().shellid;

  history.pushState({}, '', `/tamagotchis/${getCurrentVersionId()}/${getCurrentReleaseId()}/${shellId}`);
  handleLocationChange();
}

function handleShellChange() {
  showShell(getCurrentShell());
}

function showShell(shell) {
  tamagotchiInfoUI.setShell(shell, getCurrentShellId());
}

let userCollection = {};

function showThumbnailCollectionStatus() {
  const versionId = getCurrentVersionId();
  const releaseId = getCurrentReleaseId();

  $('.thumbnail-label').toggleClass('invisible', true);

  if (userCollection[versionId]) {
    const collectionShells = userCollection[versionId][releaseId];

    util.cycleObjectProperties(collectionShells, (shellId, shell) => {
      if (collection.isItemInCollection(userCollection, versionId, releaseId, shellId)) {
        $(`#labelCollected${shellId}`).toggleClass('invisible', false);
      }

      if (collection.isItemInWanted(userCollection, versionId, releaseId, shellId)) {
        $(`#labelWanted${shellId}`).toggleClass('invisible', false);
      }

      if (collection.isItemInFavorite(userCollection, versionId, releaseId, shellId)) {
        $(`#labelFavorite${shellId}`).toggleClass('invisible', false);
      }
    });
  }
}

function collectionListener(collectionSnapshot) {
  userCollection = collectionSnapshot.val();
  // If the user has no items in his collection set it to an empty object to
  // avoid null exceptions.
  if (!userCollection) {
    userCollection = {};
  }

  showThumbnailCollectionStatus();
}

function authStateListener(user) {
  if (user) {
    collection.listenOnCollection(collectionListener);
  }
}


function loadComments() {
  versionCommentsUI.init();
  versionCommentsUI.setVersionId(getCurrentVersionId());
}

function bindEvents() {
  window.onpopstate = handleLocationChange;

  $('#versionSelect').on('change', changeVersion);
}
