// User interface for the header.

var auth = require('../auth');

function showUser(userSnapshot) {
  var user = userSnapshot.val();

  $('#headerUserName').text(user.username);

  hideSignInUp();
  showUserInfo();
}

// Shows the user dropdown in the top right.
function showUserInfo() {
  $('#headerUserInfo').toggleClass('hidden', false);
}


// Hides the user dropdown in the top right.
function hideUserInfo() {
  $('#headerUserInfo').toggleClass('hidden', true);
}

function hideUser() {
  hideUserInfo();
  showSignInUp();
}

// Hides the signIn/Up UI elements.
function hideSignInUp() {
  $('#headerSignIn').toggleClass('hidden', true);
  $('#headerSignUp').toggleClass('hidden', true);
}

// Shows the signIn/Up UI elements.
function showSignInUp() {
  $('#headerSignIn').toggleClass('hidden', false);
  $('#headerSignUp').toggleClass('hidden', false);
}

function bindEvents() {
  $('#headerSignOut').on('click', auth.signOut);
}

function authStateListener(user) {
  if (user) {
    // Hide the sign in modal after successfull login.
    $('#modalSignIn').modal('hide');
    // Listen for changes on the logged in user.
    firebase.database().ref('/users/' + user.uid).on('value', showUser);
  } else {
    hideUser();
  }
}

exports.showUser = showUser;
exports.hideUser = hideUser;
exports.bindEvents = bindEvents;
exports.authStateListener = authStateListener;
