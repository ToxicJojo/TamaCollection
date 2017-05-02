const commonUI = require('./commonUI');
const auth = require('../auth');
const tamagotchi = require('../tamagotchi');
const util = require('../util');

$(() => {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();

  commonUI.showLoadingSpinner('#editVersionPanel');
  tamagotchi.listenOnVerions(versionsListener);
});


let versions;
let currentVersionId;

function versionsListener(versionSnapshot) {
  commonUI.hideLoadingSpinner('#editVersionPanel');
  versions = versionSnapshot.val();

  showVersions();
}


function showVersions() {
  const versionSelect = $('#selectVersion');

  versionSelect.html('');

  util.cycleObjectProperties(versions, (versionId, version) => {
    versionSelect.append(`<option value="${versionId}">${version.name}</option>`);
  });

  if (currentVersionId) {
    versionSelect.val(currentVersionId);
  } else {
    versionSelect.change();
  }
}

function changeVersion(e) {
  e.preventDefault();

  const versionId = $(this).val();

  const version = versions[versionId];
  currentVersionId = versionId;
  showVersion(version);
}

function showVersion(version) {
  $('#inputVersionName').val(version.name);
  $('#inputDescription').val(version.description);
  $('#inputShorthand').val(version.shorthand);
}

function updateVersion(e) {
  e.preventDefault();

  $('#buttonUpdateVersion').button('loading');

  const versionName = $('#inputVersionName').val();
  const versionDescription = $('#inputDescription').val();
  const versionShorthand = $('#inputShorthand').val();

  const version = {
    name: versionName,
    description: versionDescription,
    shorthand: versionShorthand,
  };

  tamagotchi.updateVersion(currentVersionId, version, () => {
    $('#buttonUpdateVersion').button('reset');
  });
}

function addVersion(e) {
  e.preventDefault();
  $('#buttonAddVersion').button('loading');

  currentVersionId = 0;

  tamagotchi.addVersion(() => {
    $('#buttonAddVersion').button('reset');
  });
}

function deleteVersion(e) {
  e.preventDefault();

  $('#buttonDeleteVersion').button('loading');

  if (currentVersionId) {
    tamagotchi.deleteVersion(currentVersionId, () => {
      $('#buttonDeleteVersion').button('reset');
      $('#selectVersion').prop('selectedIndex', 0);
    });
  }
}


function bindEvents() {
  $('#selectVersion').on('change', changeVersion);
  $('#buttonUpdateVersion').on('click', updateVersion);
  $('#buttonAddVersion').on('click', addVersion);
  $('#buttonDeleteVersion').on('click', deleteVersion);
}
