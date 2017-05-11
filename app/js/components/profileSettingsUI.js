const userLib = require('../user');
const uiHelper = require('../uiHelper');
const validator = require('../validator');
const auth = require('../auth');

// We need to remember the current username, so we know if the user tries
// to change it.
let currentUsername;

const init = () => {
  uiHelper.showLoadingSpinner('#profileSettingsWell');
};

// UI Functions
const showInputError = (group, message) => {
  $(`#profileSettingsFormGroup${group}`).toggleClass('is-focused', true);
  $(`#profileSettingsFormGroup${group}`).toggleClass('has-error', true);
  $(`#profileSettingsHelpBlock${group}`).toggleClass('hidden', false);

  if (message) {
    $(`#profileSettingsHelpBlock${group}`).text(message);
  }
};

const clearInputError = (group) => {
  $(`#profileSettingsFormGroup${group}`).toggleClass('has-error', false);
  $(`#profileSettingsHelpBlock${group}`).toggleClass('hidden', true);
};

const showUpdateSuccessful = () => {
  $('#profileSettingsButtonUpdateProfile').button('reset');
  $('#profileSettingsAlert').toggleClass('hidden', false);
};

const showUser = (userSnapshot) => {
  const user = userSnapshot.val();
  currentUsername = user.username;

  uiHelper.changeInputValue('#profileSettingsInputUsername', user.username);
  uiHelper.changeInputValue('#profileSettingsTextareaBio', user.bio);

  if (user.social) {
    uiHelper.changeInputValue('#profileSettingsInputInstagram', user.social.instagram);
    uiHelper.changeInputValue('#profileSettingsInputFacebook', user.social.facebook);
    uiHelper.changeInputValue('#profileSettingsInputTwitter', user.social.twitter);
  }

  $('#profileSettingsInputPrivateCollection').prop('checked', user.privateCollection);

  if (user.profileImg) {
    $('#profileSettingsImgProfileImg').attr('src', user.profileImg);
  }

  uiHelper.hideLoadingSpinner('#profileSettingsWell');
};

// Logic

const validateData = (userData, succesCallback, failureCallback) => {
  let validationSuccess = true;

  auth.isUsernameAvaiable(userData.username, (nameAvaiable) => {
    // Check if the username is avaiable, if it got changed.
    if (!nameAvaiable && currentUsername !== userData.username) {
      showInputError('Username', auth.USERNAME_ALREADY_TAKEN);
      validationSuccess = false;
    } else {
      clearInputError('Username');
    }

    const usernameValidation = validator.validateUsername(userData.username);
    const bioValidation = validator.validateBio(userData.bio);

    if (!usernameValidation.success) {
      showInputError('Username', usernameValidation.reason);
      validationSuccess = false;
    } else {
      clearInputError('Username');
    }

    if (!bioValidation.success) {
      showInputError('Bio', bioValidation.reason);
      validationSuccess = false;
    } else {
      clearInputError('Bio');
    }

    if (validationSuccess) {
      succesCallback();
    } else {
      failureCallback();
    }
  });
};

const getFormData = () => {
  const username = $('#profileSettingsInputUsername').val();
  const bio = $('#profileSettingsTextareaBio').val();

  // Social
  const instagram = $('#profileSettingsInputInstagram').val();
  const facebook = $('#profileSettingsInputFacebook').val();
  const twitter = $('#profileSettingsInputTwitter').val();

  // Privacy
  const privateCollection = $('#profileSettingsInputPrivateCollection').prop('checked');

  const social = {
    instagram,
    facebook,
    twitter,
  };

  // Construct the final data object.
  const userData = {
    username,
    bio,
    social,
    privateCollection,
  };

  return userData;
};

const updateProfile = (succesCallback, validationFailureCallback) => {
  const userData = getFormData();

  validateData(userData, () => {
    userLib.updateUserData(userData, succesCallback);
  }, validationFailureCallback);
};


// UI Handlers
const buttonUpdateProfileClick = (e) => {
  e.preventDefault();

  $('#profileSettingsButtonUpdateProfile').button('loading');

  updateProfile(showUpdateSuccessful, () => {
    $('#profileSettingsButtonUpdateProfile').button('reset');
  });
};

const buttonUploadPictureClick = (e) => {
  e.preventDefault();

  $('#profileSettingsButtonUploadPicture').button('loading');

  const file = document.getElementById('profileSettingsInputFileProfileImg').files[0];

  // Check if a file was selcted and it is a valid image file.
  if (file && validator.validateImage(file)) {
    clearInputError('ProfileImg');

    userLib.updateProfilePicture(file, () => {
      $('#profileSettingsButtonUploadPicture').button('reset');
    });
  } else {
    showInputError('ProfileImg');
    $('#profileSettingsButtonUploadPicture').button('reset');
  }
};


const bindEvents = () => {
  $('#profileSettingsButtonUpdateProfile').on('click', buttonUpdateProfileClick);
  $('#profileSettingsButtonUploadPicture').on('click', buttonUploadPictureClick);
};

const authStateListener = (user) => {
  if (user) {
    userLib.listenOnUser(user.uid, showUser);
  }
};


module.exports.init = init;
module.exports.bindEvents = bindEvents;
module.exports.authStateListener = authStateListener;
