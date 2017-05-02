const commonUI = require('./commonUI');
const auth = require('../auth');
const util = require('../util');
const tamagotchi = require('../tamagotchi');

$(() => {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();
  loadVersions();
});

let versions;
let currentVersionId;

function loadVersions() {
  commonUI.showLoadingSpinner('#editReleasePanel');
  tamagotchi.getVersions((versionSnapshot) => {
    versions = versionSnapshot.val();
    showVersions();
  });
}

function showVersions() {
  const versionSelect = $('#selectVersion');

  versionSelect.html('');

  util.cycleObjectProperties(versions, (versionId, version) => {
    versionSelect.append(`<option value="${versionId}">${version.name}</option>`);
  });

  commonUI.hideLoadingSpinner('#editReleasePanel');

  currentVersionId = $('#selectVersion').val();
  loadReleases(currentVersionId);
}


let releases;
let currentReleaseId;

function changeVersion(e) {
  e.preventDefault();

  commonUI.showLoadingSpinner('#selectRelease');

  currentVersionId = $(this).val();
  currentReleaseId = null;

  loadReleases(currentVersionId);
}


function loadReleases(versionId) {
  tamagotchi.listenOnReleases(versionId, (releasesSnapshot) => {
    releases = releasesSnapshot.val();

    showReleases();
  });
}

function showReleases() {
  const versionSelect = $('#selectRelease');

  versionSelect.html('');

  util.cycleObjectProperties(releases, (releaseId, release) => {
    versionSelect.append(`<option value="${releaseId}">${release.name}</option>`);
  });

  if (currentReleaseId) {
    $('#selectRelease').val(currentReleaseId);
  } else if (releases) {
    currentReleaseId = $('#selectRelease').val();
    showRelease(currentReleaseId);
  }

  commonUI.hideLoadingSpinner('#selectRelease');
}

function changeRelease(e) {
  e.preventDefault();

  currentReleaseId = $(this).val();


  showRelease(currentReleaseId);
}

function showRelease(releaseId) {
  const release = releases[releaseId];

  $('#inputReleaseName').val(release.name);
  $('#inputReleaseDate').val(release.date);
  $('#inputReleasePrice').val(release.price);
}

function updateRelease(e) {
  e.preventDefault();

  $('#buttonUpdateRelease').button('loading');

  const releaseName = $('#inputReleaseName').val();
  const releaseDate = $('#inputReleaseDate').val();
  const releasePrice = $('#inputReleasePrice').val();

  const release = {
    name: releaseName,
    date: releaseDate,
    price: releasePrice,
  };

  if (currentReleaseId && currentVersionId) {
    tamagotchi.updateRelease(currentVersionId, currentReleaseId, release, () => {
      $('#buttonUpdateRelease').button('reset');
    });
  } else {
    alert('Choose a release to edit.');
    $('#buttonUpdateRelease').button('reset');
  }
}

function addRelease(e) {
  e.preventDefault();

  $('#buttonAddRelease').button('loading');

  tamagotchi.addRelease(currentVersionId, () => {
    $('#buttonAddRelease').button('reset');
  });
}

function deleteRelease(e) {
  e.preventDefault();

  $('#buttonDeleteRelease').button('loading');

  if (currentVersionId && currentReleaseId) {
    tamagotchi.deleteRelease(currentVersionId, currentReleaseId, () => {
      $('#buttonDeleteRelease').button('reset');

      $('#selectRelease').prop('selectedIndex', 0);
    });
  } else {
    alert('Please choose a version and a release');
    $('#buttonDeleteRelease').button('reset');
  }
}


function bindEvents() {
  $('#selectVersion').on('change', changeVersion);
  $('#selectRelease').on('change', changeRelease);

  $('#buttonUpdateRelease').on('click', updateRelease);
  $('#buttonAddRelease').on('click', addRelease);
  $('#buttonDeleteRelease').on('click', deleteRelease);
}
