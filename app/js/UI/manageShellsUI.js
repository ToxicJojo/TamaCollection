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
  commonUI.showLoadingSpinner('#editShellPanel');

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
  currentShellId = null;

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
  var releaseSelect = $('#selectRelease');

  releaseSelect.html('');

  util.cycleObjectProperties(releases, function(releaseId, release) {
    releaseSelect.append('<option value="' + releaseId + '">' + release.name + '</option>');
  });

  currentReleaseId = releaseSelect.val();
  loadShells(currentReleaseId);

  commonUI.hideLoadingSpinner('#selectRelease');
}

function changeRelease(e) {
  e.preventDefault();

  currentReleaseId = $(this).val();
  currentShellId = null;


  loadShells(currentReleaseId);
}

var shells;
var currentShellId;

function loadShells(releaseId) {
  commonUI.showLoadingSpinner('#selectShell');

  tamagotchi.listenOnShells(releaseId, function(shellsSnapshot) {
    shells = shellsSnapshot.val();

    showShells();
  });
}

function showShells() {
  var shellSelect = $('#selectShell');

  shellSelect.html('');

  util.cycleObjectProperties(shells, function(shellId, shell) {
    shellSelect.append('<option value="' + shellId + '">' + shell.color + '</option>');
  });

  if(currentShellId) {
    $('#selectShell').val(currentShellId);
    showShell(currentShellId);
  } else if(shells) {
    currentShellId = $('#selectShell').val();
    showShell(currentShellId);
  }

  commonUI.hideLoadingSpinner('#editShellPanel');
  commonUI.hideLoadingSpinner('#selectShell');
}

function changeShell(e) {
  e.preventDefault();

  currentShellId = $(this).val();

  showShell(currentShellId);
}

function showShell(shellId) {
  var shell = shells[shellId];

  console.log(shell);

  $('#inputShellColor').val(shell.color);
  $('#shellImage').attr('src', shell.img);
}

function updateShell(e) {
  e.preventDefault();

  $('#buttonUpdateShell').button('loading');

  var shellColor = $('#inputShellColor').val();

  var file = document.getElementById('inputShellImageFile').files[0];

  var shell = {
    color: shellColor
  };

  if(file) {
    var imageRef = firebase.storage().ref().child('/images/shells/' + currentShellId + '/shellImage.png');

    var uploadTask = imageRef.put(file);

    uploadTask.on('state_changed',
      function complete(snapshot) {
        shell.img = snapshot.downloadURL;
        shell.thumbnail = snapshot.downloadURL;

        tamagotchi.updateShell(currentReleaseId, currentShellId, shell, function() {
          $('#buttonUpdateShell').button('reset');
          $('#inputShellImageFile').val('');
          //loadShells(currentReleaseId);
        });
    });
  } else {
    tamagotchi.updateShell(currentReleaseId, currentShellId, shell, function() {
      $('#buttonUpdateShell').button('reset');
      //loadShells(currentReleaseId);
    });
  }
}

function addShell(e) {
  e.preventDefault();

  $('#buttonAddShell').button('loading');

  tamagotchi.addShell(currentReleaseId, function() {
    $('#buttonAddShell').button('reset');
    //loadShells();
  });
}

function deleteShell(e) {
  e.preventDefault();

  $('#buttonDeleteShell').button('loading');

  if(currentReleaseId && currentShellId) {
    var deleteShellId = currentShellId;
    // We need to set the currentShellId to null so we don't try to load the shell right
    // after it was deleted.
    currentShellId = null;
    
    tamagotchi.deleteShell(currentReleaseId, deleteShellId, function() {
      $('#buttonDeleteShell').button('reset');

      $('#selectRelease').prop('selectedIndex', 0);
    });
  } else {
    alert('Please select a shell.');
  }
}


function bindEvents() {
  $('#selectVersion').on('change', changeVersion);
  $('#selectRelease').on('change', changeRelease);
  $('#selectShell').on('change', changeShell);

  $('#buttonUpdateShell').on('click', updateShell);
  $('#buttonAddShell').on('click', addShell);
  $('#buttonDeleteShell').on('click', deleteShell);
}
