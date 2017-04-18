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

function loadVersions() {
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
}

function changeVersion(e) {
  e.preventDefault();

  var versionId = $(this).val();

  loadReleases(versionId);
}

var releases;

function loadReleases(versionId) {
  tamagotchi.getReleases(versionId, function (releasesSnapshot) {
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
}


function bindEvents() {
  $('#selectVersion').on('change', changeVersion);
}
