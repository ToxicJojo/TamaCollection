var commonUI = require('./commonUI');
var auth = require('../auth');
var tamagotchi = require('../tamagotchi');
var util = require('../util');

$(function() {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();

  commonUI.showLoadingSpinner('#editVersionPanel');
  tamagotchi.listenOnVerions(versionsListener);

});


var versions;
var currentVersionId;

function versionsListener(versionSnapshot) {
  commonUI.hideLoadingSpinner('#editVersionPanel');
  versions = versionSnapshot.val();

  showVersions();
}


function showVersions() {
  var versionSelect = $('#selectVersion');

  versionSelect.html('');

  util.cycleObjectProperties(versions, function(versionId, version) {
    versionSelect.append('<option value="' + versionId + '">' + version.name + '</option>');
  });

  if(currentVersionId) {
    versionSelect.val(currentVersionId);
  } else {
    versionSelect.change();
  }
}

function changeVersion(e) {
  e.preventDefault();

  var versionId = $(this).val();

  var version = versions[versionId];
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

  var versionName = $('#inputVersionName').val();
  var versionDescription = $('#inputDescription').val();
  var versionShorthand = $('#inputShorthand').val();

  var version = {
    name: versionName,
    description: versionDescription,
    shorthand: versionShorthand
  };

  tamagotchi.updateVersion(currentVersionId, version, function() {
    $('#buttonUpdateVersion').button('reset');
  });
}

function addVersion(e) {
  e.preventDefault();
  $('#buttonAddVersion').button('loading');

  currentVersionId = 0;

  tamagotchi.addVersion(function () {
    $('#buttonAddVersion').button('reset');
  });
}

function deleteVersion(e) {
  e.preventDefault();

  $('#buttonDeleteVersion').button('loading');

  if(currentVersionId) {
    tamagotchi.deleteVersion(currentVersionId, function() {
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
