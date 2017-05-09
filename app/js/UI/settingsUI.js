const commonUI = require('./commonUI');
const auth = require('../auth');
const validator = require('../validator');
const userLib = require('../user');

$(() => {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);
  auth.addAuthStateListener(authStateListener);
  auth.registerAuthStateListeners();

  $('#profileCol').LoadingOverlay('show', {
    image: '',
    fontawesome: 'fa fa-spinner fa-spin',
  });
});


let oldUsername;

function showUser(userSnapshot) {
  const user = userSnapshot.val();
  oldUsername = user.username;

  $('#inputUsernameSettings').val(user.username);
  $('#inputUsernameSettings').change();

  $('#textareaBioSettings').val(user.bio);
  $('#textareaBioSettings').change();

  if (user.social) {
    $('#inputInstagramSettings').val(user.social.instagram);
    $('#inputInstagramSettings').change();

    $('#inputFacebookSettings').val(user.social.facebook);
    $('#inputFacebookSettings').change();

    $('#inputTwitterSettings').val(user.social.twitter);
    $('#inputTwitterSettings').change();
  }

  $('#inputPrivateCollection').prop('checked', user.privateCollection);

  if (user.profileImg) {
    $('#imgProfilePicture').attr('src', user.profileImg);
  }

  $('#profileCol').LoadingOverlay('hide');
}

function authStateListener(user) {
  if (user) {
    firebase.database().ref(`/users/${user.uid}`).on('value', showUser);
  } else {
    window.location = '/';
  }
}


function updateProfile() {
  $('#buttonUpdateProfile').button('loading');
  $('#updateProfileAlert').toggleClass('hidden', true);

  const username = $('#inputUsernameSettings').val();
  const bio = $('#textareaBioSettings').val();

  // Social
  const instagram = $('#inputInstagramSettings').val();
  const facebook = $('#inputFacebookSettings').val();
  const twitter = $('#inputTwitterSettings').val();

  // Privacy
  const privateCollection = $('#inputPrivateCollection').prop('checked');

  // TODO basic validation of the social links.
  const social = {
    instagram,
    facebook,
    twitter,
  };

  let validationSuccess = true;

  auth.isUsernameAvaiable(username, (nameAvaiable) => {
    // Check if the name is avaiable if we changed it.
    if (!nameAvaiable && oldUsername !== username) {
      showInputError('Username');
      validationSuccess = false;
    } else {
      clearInputError('Username');
    }

    if (!validator.validateBio(bio)) {
      showInputError('Bio');
      validationSuccess = false;
    } else {
      clearInputError('Bio');
    }

    if (validationSuccess) {
      const userData = {
        username,
        bio,
        social,
        privateCollection,
      };

      userLib.updateUserData(userData, profileUpdateSuccessCallback);
    } else {
      $('#buttonUpdateProfile').button('reset');
    }
  });
}

function uploadProfilePicture(e) {
  e.preventDefault();
  $('#buttonUploadPicture').button('loading');

  const file = document.getElementById('inputFileProfilePicture').files[0];

  // Check if a file was selcted and it is a valid image file.
  if (file && validator.validateImage(file)) {
    clearInputError('ProfilePicture');

    userLib.updateProfilePicture(file, () => {
      $('#buttonUploadPicture').button('reset');
    });
  } else {
    showInputError('ProfilePicture');
    $('#buttonUploadPicture').button('reset');
  }
}


function profileUpdateSuccessCallback() {
  $('#buttonUpdateProfile').button('reset');
  $('#updateProfileAlert').toggleClass('hidden', false);
}

function showInputError(group) {
  $(`#formGroupSettings${group}`).toggleClass('is-focused');
  $(`#formGroupSettings${group}`).toggleClass('has-error', true);
  $(`#helpBlockSettings${group}`).toggleClass('hidden', false);
}

function clearInputError(group) {
  $(`#formGroupSettings${group}`).toggleClass('has-error', false);
  $(`#helpBlockSettings${group}`).toggleClass('hidden', true);
}

function bindEvents() {
  $('#buttonUpdateProfile').on('click', updateProfile);
  $('#buttonUploadPicture').on('click', uploadProfilePicture);
}
