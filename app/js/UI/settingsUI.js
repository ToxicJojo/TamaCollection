var commonUI = require('./commonUI');
var auth = require('../auth');
var validator = require('../validator');
var user = require('../user');

$(function() {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);
  auth.addAuthStateListener(authStateListener);
  auth.registerAuthStateListeners();

  $('#profileCol').LoadingOverlay('show', {
    image: "",
    fontawesome: 'fa fa-spinner fa-spin'
  });
});

var old_username;

function authStateListener(user) {
  if(user) {
    firebase.database().ref('/users/' + user.uid).on('value', showUser);
  } else {
    window.location = '/';
  }
}

function showUser(userSnapshot) {
  var user = userSnapshot.val();
  old_username = user.username;

  $('#inputUsernameSettings').val(user.username);
  $('#textareaBioSettings').val(user.bio);

  $('#profileCol').LoadingOverlay('hide');
}

function updateProfile() {
  $('#buttonUpdateProfile').button('loading');
  $('#updateProfileAlert').toggleClass('hidden', true);

  var username = $('#inputUsernameSettings').val();
  var bio = $('#textareaBioSettings').val();

  var validationSuccess = true;

  auth.isUsernameAvaiable(username, function(nameAvaiable) {
    // Check if the name is avaiable if we changed it.
    if(!nameAvaiable && old_username !== username) {
      showInputError("Username");
      validationSuccess = false;
    } else {
      clearInputError("Username");
    }

    if(!validator.validateBio(bio)) {
      showInputError("Bio");
      validationSuccess = false;
    } else {
      clearInputError("Bio");
    }

    if(validationSuccess) {
      var userData = {
        username: username,
        bio: bio
      };

      user.updateUserData(userData, profileUpdateSuccessCallback);
    } else {
      $('#buttonUpdateProfile').button('reset');
    }
  });
}

function profileUpdateSuccessCallback() {
  $('#buttonUpdateProfile').button('reset');
  $('#updateProfileAlert').toggleClass('hidden', false);
}

function showInputError(group) {
  $('#formGroupSettings' + group).toggleClass('has-error', true);
  $('#helpBlockSettings' + group).toggleClass('hidden', false);
}

function clearInputError(group) {
  $('#formGroupSettings' + group).toggleClass('has-error', false);
  $('#helpBlockSettings' + group).toggleClass('hidden', true);
}



function bindEvents() {
  $('#buttonUpdateProfile').on('click', updateProfile);
}
