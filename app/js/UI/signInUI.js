var auth = require('../auth');

var USER_DISABLED_ERROR_MESSAGE = "This account is temporarily disabled.";
var WRONG_EMAIL_PASSWORD_MESSAGE = "Wrong email/password combination. Please try again.";

function signInUser() {
  $('#buttonSignIn').button('loading');
  hideSignInError();

  // Get the form values.
  var email = $('#inputEmailSignIn').val();
  var password = $('#inputPasswordSignIn').val();

  // Try to sign in the user.
  auth.signIn(email, password, handleSignInError);
}

function handleSignInError(error) {
  $('#buttonSignIn').button('reset');

  // Check if the account is disabled otherwise the email/password combination
  // was wrong.
  if(error.code === "auth/user-disabled") {
    showSignInError(USER_DISABLED_ERROR_MESSAGE);
  } else {
    showSignInError(WRONG_EMAIL_PASSWORD_MESSAGE);
  }
}

function showSignInError(errorMessage) {
  $('#signInErrorMessage').html(errorMessage);
  $('#signInAlert').toggleClass('hidden', false);
}

function hideSignInError() {
  $('#signInAlert').toggleClass('hidden', true);
}

function clearSignInModal() {
  $('#inputEmailSignIn').val('');
  $('#inputPasswordSignIn').val('');

  hideSignInError();
}


function bindEvents() {
  $('#buttonSignIn').on('click', signInUser);
  $('#modalSignIn').on('hidden.bs.modal', clearSignInModal);
}

exports.bindEvents = bindEvents;
