var commonUI = require('./commonUI');
var auth = require('../auth');
var tamagotchi = require('../tamagotchi');
var util = require('../util');
var collection = require('../collection');

$(function() {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);
  auth.addAuthStateListener(authStateListener);

  auth.registerAuthStateListeners();

  loadVersions();
});

 // Functions to read values from the current url.
 // The versionId, releaseId and shellId are saved in the url to allow users
 // to send links that directily display a version/release/shell.

// Version

function getCurrentVersionId() {
  // The path looks like /tamagotchis/$versionId
  var path = window.location.pathname.split('/');

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
  var path = window.location.pathname.split('/');

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
  var path = window.location.pathname.split('/');

  return path[4];
}

function getCurrentShell() {
  return shells[getCurrentShellId()];
}

function getOldShellId() {
  return oldPath[4];
}


// The default path.
var oldPath = ['', 'tamagotchis'];


// Is called whenever the url changes.
// Detects which parts of the url changed
// and loads the appropiated version/release/shell.
// The url looks like /tamagotchis/$versionId/$releaseId/$shellId
function handleLocationChange() {
  var location = window.location;

  var versionId = getCurrentVersionId();

  // Check if a versionId is present and if it changed.
  if(versionId && (getOldVersionId() !== versionId)) {
    handleVersionChange();
    // Save the oldPath. We can reset the versionId ([3]) and shellId ([4])
    // because a versions change means the release/shell changed aswell or are
    // not present.
    oldPath[2] = versionId;
    oldPath[3] = '';
    oldPath[4] = '';
  } else {
    var releaseId = getCurrentReleaseId();
    // Check if a releaseId is present and if it changed
    if(releaseId && getOldReleaseId() !== releaseId) {
        handleReleaseChange();
        // Save the oldPath. We can reset the shellId ([4])
        // because a versions change means the shell changed aswell or is
        // not present.
        oldPath[3] = releaseId;
        oldPath[4] = '';
    } else {
      var shellId = getCurrentShellId();
      // Check if a shellId is present and if it changed
      if(shellId && getOldShellId() !== shellId) {
        handleShellChange();
        oldPath[4] = shellId;
      } else {
        hideShell();
      }
    }
  }
}


var versions = {};

// Gets a snapshot of the versions from the database and saves it in 'versions'.
function loadVersions() {
  commonUI.showLoadingSpinner('#versionNav');

  tamagotchi.getVersions(function(versionSnapshot) {
    versions = versionSnapshot.val();
    showVersions();
    // After loading the versions check the url
    // if we need to display a specific version.
    handleLocationChange();
  });
}

// Shows the list of versions in the righthand menue.
function showVersions() {
  var versionNav = $('#versionNav');

  // Reset the old versionlist.
  versionNav.html('');

  util.cycleObjectProperties(versions, function(versionId, version) {
    version.id = versionId;

    var templateData = {
      version: version
    };

    versionNav.append(versionlistTemplate(templateData));
  });

  versionNav.LoadingOverlay('hide');

  $('.version-nav-li').on('click', versionNavClickHandler);
}

function showVersion(version) {
    $('#versionInfoName').html(version.name);
    $('#versionInfoDescription').html(version.description);
    $('#versionInfoShorthand').html(version.shorthand);

    hideRelease();
}


function versionNavClickHandler(e) {
  e.preventDefault();

  var versionId = $(this).data().versionid;

  history.pushState({}, '', '/tamagotchis/' + versionId);

  handleLocationChange();
}


function handleVersionChange() {
  var versionId = getCurrentVersionId();
  $('.version-nav-li').toggleClass('active', false);
  $('#versionNav' + versionId).toggleClass('active', true);


  showVersion(getCurrentVersion());
  loadReleases(versionId);
}



var releases;

function loadReleases(versionId) {
  commonUI.showLoadingSpinner('#releaseNav');

  tamagotchi.getReleases(versionId, function(releaseSnapshot) {
    releases = releaseSnapshot.val();
    showReleases();

    handleLocationChange();
  });
}

function showReleases() {
  var releaseNav =  $('#releaseNav');
  releaseNav.html('');

  var releaseContent = $('#releaseContent');
  releaseContent.html('');

  util.cycleObjectProperties(releases, function(releaseId, release) {
    release.id = releaseId;

    var templateData = {
      release: release
    };

    releaseNav.append(releasetabTemplate(templateData));
    releaseContent.append(releasetabcontentTemplate(templateData));
  });

  releaseNav.LoadingOverlay('hide');

  $('.tab').on('click', releaseNavClickHandler);
}

function handleReleaseChange() {
  var releaseId = getCurrentReleaseId();

  $('.tab').toggleClass('active', false);
  $('#releaseNav' + releaseId).toggleClass('active', true);

  $('.release-content').toggleClass('hidden', true);
  $('#releaseContent' + releaseId).toggleClass('hidden', false);

  showRelease(getCurrentRelease());
  loadShells(getCurrentReleaseId());
}

function showRelease(release) {
  $('#releaseInfoName').html(release.name);
  $('#releaseInfoDate').html(release.date);
  $('#releaseInfoPrice').html(release.price);

  $('#releaseInfo').toggleClass('hidden', false);
  hideShell();
}

function hideRelease() {
  $('#releaseInfo').toggleClass('hidden', true);
  hideShell();
}

function releaseNavClickHandler(e) {
  e.preventDefault();

  var releaseId = $(this).data().releaseid;

  history.pushState({}, '', '/tamagotchis/' + getCurrentVersionId() + '/' + releaseId);
  handleLocationChange();
}



var shells;

function loadShells(releaseId) {
  commonUI.showLoadingSpinner('#releaseContent');

  tamagotchi.getShells(releaseId, function(shellsSnapshot) {
    shells = shellsSnapshot.val();
    showShells();
    handleLocationChange();
  });
}

function showShells() {
  var releaseContent = $('#releaseContent' + getCurrentReleaseId());

  releaseContent.html('');

  var html = '<div class="row">'

  util.cycleObjectProperties(shells, function(shellId, shell) {
    shell.id = shellId;

    var templateData = {
      shell: shell
    };

    html += (shellthumbnailTemplate(templateData));
  });

  html += '</div>';
  releaseContent.html(html);

  $('#releaseContent').LoadingOverlay('hide');

  if(firebase.auth().currentUser) {
    showThumbnailCollectionStatus();
  }

  $('.shellThumbnail').on('click', shellThumbnailClickHandler);
}

function shellThumbnailClickHandler(e) {
  e.preventDefault();

  var shellId = $(this).data().shellid;

  history.pushState({}, '', '/tamagotchis/' + getCurrentVersionId() + '/' + getCurrentReleaseId() + '/' + shellId);
  handleLocationChange();
}

function handleShellChange() {
  showShell(getCurrentShell());
}

function showShell(shell) {
  $('#shellImage').attr('src', shell.img);
  $('#shellInfoColor').html(shell.color);
  $('#shellInfo').toggleClass('hidden', false);

  // If the user is logged in show the collectionButtons
  if(firebase.auth().currentUser) {
    showCollectionStatus();
    $('#collectionStatus').toggleClass('hidden', false);
  } else {
    $('#collectionStatus').toggleClass('hidden', true);
  }
}

function hideShell() {
  $('#shellInfo').toggleClass('hidden', true);
  $('#collectionStatus').toggleClass('hidden', true);
}


var userCollection = {};

function addCurrentShellTo(group) {
  $('#buttonAddTo' + group.toUpperCase()).button('loading');

  var versionId = getCurrentVersionId();
  var releaseId = getCurrentReleaseId();
  var shellId = getCurrentShellId();

  collection.addTo(group, versionId, releaseId, shellId, function() {
    $('#buttonAddTo' + group.toUpperCase()).button('reset');
  });
}

function removeCurrentShellFrom(group) {
  $('#buttonRemoveFrom' + group.toUpperCase()).button('loading');

  var versionId = getCurrentVersionId();
  var releaseId = getCurrentReleaseId();
  var shellId = getCurrentShellId();

  collection.removeFrom(group, versionId, releaseId, shellId, function() {
    $('#buttonRemoveFrom' + group.toUpperCase()).button('reset');
  });
}


function addToCollectionClickHandler(e) {
  e.preventDefault();

  addCurrentShellTo('collected');
}

function removeFromCollectionClickHandler(e) {
  e.preventDefault();

  removeCurrentShellFrom('collected');
}

function addToWantedClickHandler(e) {
  e.preventDefault();

  addCurrentShellTo('wanted');
}

function removeFromWantedClickHandler(e) {
  e.preventDefault();

  removeCurrentShellFrom('wanted');
}

function addToFavoriteClickHandler(e) {
  e.preventDefault();

  addCurrentShellTo('favorite');
}

function removeFromFavoriteClickHandler(e) {
  e.preventDefault();

  removeCurrentShellFrom('favorite');
}


function showThumbnailCollectionStatus() {
  var versionId = getCurrentVersionId();
  var releaseId = getCurrentReleaseId();

  $('.thumbnail-label').toggleClass('invisible', true);

  if(userCollection[versionId]) {

    var collectionShells = userCollection[versionId][releaseId];

    util.cycleObjectProperties(collectionShells, function(shellId, shell) {
      if(collection.isItemInCollection(userCollection, versionId, releaseId, shellId)) {
        $('#labelCollected' + shellId).toggleClass('invisible', false);
      }

      if(collection.isItemInWanted(userCollection, versionId, releaseId, shellId)) {
        $('#labelWanted' + shellId).toggleClass('invisible', false);
      }

      if(collection.isItemInFavorite(userCollection, versionId, releaseId, shellId)) {
        $('#labelFavorite' + shellId).toggleClass('invisible', false);
      }
    });

  }
}

function showCollectionStatus() {
  var versionId = getCurrentVersionId();
  var releaseId = getCurrentReleaseId();
  var shellId = getCurrentShellId();

  if(collection.isItemInCollection(userCollection, versionId, releaseId, shellId)) {
    $('#buttonAddToCollected').toggleClass('hidden', true);
    $('#buttonRemoveFromCollected').toggleClass('hidden', false);
    $('#buttonAddToWanted').toggleClass('hidden', true);
    $('#buttonRemoveFromWanted').toggleClass('hidden', true);
  } else {
    $('#buttonAddToCollected').toggleClass('hidden', false);
    $('#buttonRemoveFromCollected').toggleClass('hidden', true);

    if(collection.isItemInWanted(userCollection, versionId, releaseId, shellId)) {
      $('#buttonAddToWanted').toggleClass('hidden', true);
      $('#buttonRemoveFromWanted').toggleClass('hidden', false);
    } else {
      $('#buttonAddToWanted').toggleClass('hidden', false);
      $('#buttonRemoveFromWanted').toggleClass('hidden', true);
    }
  }

  if(collection.isItemInFavorite(userCollection, versionId, releaseId, shellId)) {
    $('#buttonAddToFavorite').toggleClass('hidden', true);
    $('#buttonRemoveFromFavorite').toggleClass('hidden', false);
  } else {
    $('#buttonAddToFavorite').toggleClass('hidden', false);
    $('#buttonRemoveFromFavorite').toggleClass('hidden', true);
  }

}

function collectionListener(collectionSnapshot) {
  userCollection = collectionSnapshot.val();
  // If the user has no items in his collection set it to an empty object to
  // avoid null exceptions.
  if(!userCollection) {
    userCollection = {};
  }

  showThumbnailCollectionStatus();
  showCollectionStatus();
}

function authStateListener(user) {
  if(user) {
    collection.listenOnCollection(collectionListener);
  }
}


function bindEvents() {
  window.onpopstate = handleLocationChange;
  $('#buttonAddToCollected').on('click', addToCollectionClickHandler);
  $('#buttonRemoveFromCollected').on('click', removeFromCollectionClickHandler);
  $('#buttonAddToWanted').on('click', addToWantedClickHandler);
  $('#buttonRemoveFromWanted').on('click', removeFromWantedClickHandler);
  $('#buttonAddToFavorite').on('click', addToFavoriteClickHandler);
  $('#buttonRemoveFromFavorite').on('click', removeFromFavoriteClickHandler);
}
