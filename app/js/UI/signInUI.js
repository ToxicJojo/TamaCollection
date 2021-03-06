const auth = require('../auth');

const USER_DISABLED_ERROR_MESSAGE = 'This account is temporarily disabled.';
const WRONG_EMAIL_PASSWORD_MESSAGE = 'Wrong email/password combination. Please try again.';

function signInUser() {
  $('#buttonSignIn').button('loading');
  hideSignInError();

  // Get the form values.
  const email = $('#inputEmailSignIn').val();
  const password = $('#inputPasswordSignIn').val();

  // Try to sign in the user.
  auth.signIn(email, password, handleSignInError);
}

function handleSignInError(error) {
  $('#buttonSignIn').button('reset');

  // Check if the account is disabled otherwise the email/password combination
  // is wrong.
  if (error.code === 'auth/user-disabled') {
    showSignInError(USER_DISABLED_ERROR_MESSAGE);
  } else {
    showSignInError(WRONG_EMAIL_PASSWORD_MESSAGE);
  }
}

// Shows an error message above the login form.
function showSignInError(errorMessage) {
  $('#signInErrorMessage').html(errorMessage);
  $('#signInAlert').toggleClass('hidden', false);
}

function hideSignInError() {
  $('#signInAlert').toggleClass('hidden', true);
}

// Resets the UI of the modal.
// Clears the input elements and resets the button state.
function clearSignInModal() {
  $('#buttonSignIn').button('reset');

  $('#inputEmailSignIn').val('');
  $('#inputPasswordSignIn').val('');

  hideSignInError();
}


function bindEvents() {
  $('#buttonSignIn').on('click', signInUser);

  $('#modalSignIn').on('hidden.bs.modal', clearSignInModal);
  $('#modalSignIn').on('shown.bs.modal', () => {
    $('#inputEmailSignIn').focus();
  });
}

exports.bindEvents = bindEvents;
