var commonUI = require('./commonUI');
var auth = require('../auth');
var tamagotchi = require('../tamagotchi');
var util = require('../util');

$(function() {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();

  loadVersions();
});

var versions = [];


function getCurrentVersionId() {
  var path = window.location.pathname.split('/');

  return path[2];
}

function getCurrentVersion() {
  return versions[getCurrentVersionId()];
}

function getCurrentReleaseId() {
  var path = window.location.pathname.split('/');

  return path[3];
}

function getOldReleaseId() {
  return oldPath[3];
}

function getCurrentRelease() {
  return releases[getCurrentReleaseId()];
}

function getCurrentShellId() {
  var path = window.location.pathname.split('/');

  return path[4];
}

function getOldShellId() {
  return oldPath[4];
}

function getCurrentShell() {
  return shells[getCurrentShellId()];
}


function loadVersions() {
  $('#versionNav').LoadingOverlay('show', {
    image: "",
    fontawesome: 'fa fa-spinner fa-spin'
  });

  tamagotchi.getVersions(function(versionSnapshot) {
    versions = versionSnapshot.val();
    showVersions();
    handleLocationChange();
  });
}

function showVersions() {
  var versionNav = $('#versionNav');

  versionNav.html('');

  util.cycleObjectProperties(versions, function(versionId, version) {
    versionNav.append(getVersionNavTemplate(versionId, version));
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
  var version = versions[versionId];


  history.pushState({}, '', '/tamagotchis/' + versionId);
  console.log(version);
  //handleVersionChange(versionId);
  handleLocationChange();
}


function getVersionNavTemplate(versionId, version) {
  var html = '<li role="presentation"  data-versionid="' + versionId + '" id="versionNav' + versionId + '" class="version-nav-li">';
  html += '<a href="#">' + version.shorthand + "</a>"

  return html;
}

var oldPath = ['', 'tamagotchis'];

function handleLocationChange() {
  var location = window.location;

  var path = location.pathname.split('/');
  var versionId = path[2];


  if(versionId && oldPath[2] !== versionId) {
    handleVersionChange();
    oldPath[2] = versionId;
    oldPath[3] = '';
    oldPath[4] = '';
  } else {
    var releaseId = getCurrentReleaseId();

    if(releaseId && getOldReleaseId() !== releaseId) {
        handleReleaseChange();
        oldPath[3] = releaseId;
        oldPath[4] = '';
    } else {
      var shellId = getCurrentShellId();

      if(shellId && getOldShellId() !== shellId) {
        handleShellChange();
        oldPath[4] = shellId;
      }
    }
  }

  //oldPath = path;
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
  $('#releaseNav').LoadingOverlay('show', {
    image: "",
    fontawesome: 'fa fa-spinner fa-spin'
  });

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
    releaseNav.append(getReleaseTabTemplate(releaseId, release));
    releaseContent.append(getReleaseContentTemplate(releaseId));
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


function getReleaseTabTemplate(releaseId, release) {
  var html = '<li role="presentation" class="tab" id="releaseNav' + releaseId + '" data-releaseId="' + releaseId + '">';
  html += '<a href="#">' + release.name;
  html += '</a></li>';

  return html;
}

function getReleaseContentTemplate(releaseId) {
  var html = '<div class="hidden release-content" id="releaseContent' + releaseId + '">'
  html += '</div>';

  return html;
}

var shells;

function loadShells(releaseId) {
  $('#releaseContent').LoadingOverlay('show', {
    image: "",
    fontawesome: 'fa fa-spinner fa-spin'
  });

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
    html += (getShellTemplate(shellId, shell));
  });

  html += '</div>';
  releaseContent.html(html);

  $('#releaseContent').LoadingOverlay('hide');

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
}

function hideShell() {
  $('#shellInfo').toggleClass('hidden', true);
}


function getShellTemplate(shellId, shell) {
  var html = '<div class="col-md-4">';
  html += '<a href="#" class="thumbnail shellThumbnail" id="shell' + shellId + '" data-shellid="' + shellId + '">';
  html += '<img src="' + shell.thumbnail + '">';
  html += '</a></div>';

  return html;
}




function bindEvents() {
  window.onpopstate = handleLocationChange;
}
