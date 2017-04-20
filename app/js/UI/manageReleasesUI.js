var commonUI = require('./commonUI');
var auth = require('../auth');
var util = require('../util');
var tamagotchi = require('../tamagotchi');

$(function() {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();
  loadVersions();
});

var versions;
var currentVersionId;

function loadVersions() {
  commonUI.showLoadingSpinner('#editReleasePanel');
  tamagotchi.getVersions(function (versionSnapshot) {
    versions = versionSnapshot.val();
    showVersions();
  });
}

function showVersions() {
  var versionSelect = $('#selectVersion');

  versionSelect.html('');

  util.cycleObjectProperties(versions, function(versionId, version) {
    versionSelect.append('<option value="' + versionId + '">' + version.name + '</option>');
  });

  commonUI.hideLoadingSpinner('#editReleasePanel');

  currentVersionId = $('#selectVersion').val();
  loadReleases(currentVersionId);
}

function changeVersion(e) {
  e.preventDefault();

  commonUI.showLoadingSpinner('#selectRelease');

  currentVersionId = $(this).val();
  currentReleaseId = null;

  loadReleases(currentVersionId);
}

var releases;
var currentReleaseId;

function loadReleases(versionId) {
  tamagotchi.listenOnReleases(versionId, function (releasesSnapshot) {
    releases = releasesSnapshot.val();

    showReleases();
  })
}

function showReleases() {
  var versionSelect = $('#selectRelease');

  versionSelect.html('');

  util.cycleObjectProperties(releases, function(releaseId, release) {
    versionSelect.append('<option value="' + releaseId + '">' + release.name + '</option>');
  });

  if(currentReleaseId) {
    $('#selectRelease').val(currentReleaseId);
  } else if(releases) {
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
  var release = releases[releaseId];

  $('#inputReleaseName').val(release.name);
  $('#inputReleaseDate').val(release.date);
  $('#inputReleasePrice').val(release.price);
}

function updateRelease(e) {
  e.preventDefault();

  $('#buttonUpdateRelease').button('loading');

  var releaseName = $('#inputReleaseName').val();
  var releaseDate = $('#inputReleaseDate').val();
  var releasePrice = $('#inputReleasePrice').val();

  var release = {
    name: releaseName,
    date: releaseDate,
    price: releasePrice
  };

  if(currentReleaseId && currentVersionId) {
    tamagotchi.updateRelease(currentVersionId, currentReleaseId, release, function() {
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

  tamagotchi.addRelease(currentVersionId, function() {
    $('#buttonAddRelease').button('reset');
  });
}

function deleteRelease(e) {
  e.preventDefault();

  $('#buttonDeleteRelease').button('loading');

  if(currentVersionId && currentReleaseId) {
    tamagotchi.deleteRelease(currentVersionId, currentReleaseId, function() {
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
