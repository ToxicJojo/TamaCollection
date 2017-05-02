
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
  commonUI.showLoadingSpinner('#editShellPanel');

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
let currentShellId;

function changeVersion(e) {
  e.preventDefault();

  commonUI.showLoadingSpinner('#selectRelease');

  currentVersionId = $(this).val();
  currentReleaseId = null;
  currentShellId = null;

  loadReleases(currentVersionId);
}

function loadReleases(versionId) {
  tamagotchi.listenOnReleases(versionId, (releasesSnapshot) => {
    releases = releasesSnapshot.val();

    showReleases();
  });
}

function showReleases() {
  const releaseSelect = $('#selectRelease');

  releaseSelect.html('');

  util.cycleObjectProperties(releases, (releaseId, release) => {
    releaseSelect.append(`<option value="${releaseId}">${release.name}</option>`);
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

let shells;

function loadShells(releaseId) {
  commonUI.showLoadingSpinner('#selectShell');

  tamagotchi.listenOnShells(releaseId, (shellsSnapshot) => {
    shells = shellsSnapshot.val();

    showShells();
  });
}

function showShells() {
  const shellSelect = $('#selectShell');

  shellSelect.html('');

  util.cycleObjectProperties(shells, (shellId, shell) => {
    shellSelect.append(`<option value="${shellId}">${shell.color}</option>`);
  });

  if (currentShellId) {
    $('#selectShell').val(currentShellId);
    showShell(currentShellId);
  } else if (shells) {
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
  const shell = shells[shellId];

  $('#inputShellColor').val(shell.color);
  $('#shellImage').attr('src', shell.img);
}

function updateShell(e) {
  e.preventDefault();

  $('#buttonUpdateShell').button('loading');

  const shellColor = $('#inputShellColor').val();

  const file = document.getElementById('inputShellImageFile').files[0];

  const shell = {
    color: shellColor,
  };

  if (file) {
    const imageRef = firebase.storage().ref().child(`/images/shells/${currentShellId}/shellImage.png`);

    const uploadTask = imageRef.put(file);

    uploadTask.on('state_changed',
      (snapshot) => {
        shell.img = snapshot.downloadURL;
        shell.thumbnail = snapshot.downloadURL;

        tamagotchi.updateShell(currentReleaseId, currentShellId, shell, () => {
          $('#buttonUpdateShell').button('reset');
          $('#inputShellImageFile').val('');
        });
      });
  } else {
    tamagotchi.updateShell(currentReleaseId, currentShellId, shell, () => {
      $('#buttonUpdateShell').button('reset');
    });
  }
}

function addShell(e) {
  e.preventDefault();

  $('#buttonAddShell').button('loading');

  tamagotchi.addShell(currentReleaseId, () => {
    $('#buttonAddShell').button('reset');
  });
}

function deleteShell(e) {
  e.preventDefault();

  $('#buttonDeleteShell').button('loading');

  if (currentReleaseId && currentShellId) {
    const deleteShellId = currentShellId;
    // We need to set the currentShellId to null so we don't try to load the shell right
    // after it was deleted.
    currentShellId = null;

    tamagotchi.deleteShell(currentReleaseId, deleteShellId, () => {
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
