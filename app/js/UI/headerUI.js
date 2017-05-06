// User interface for the header.
const auth = require('../auth');
const userLib = require('../user');

// Hides the user dropdown in the top right.
function hideUserInfo() {
  $('#headerUserInfo').toggleClass('hidden', true);
}

// Shows the user dropdown in the top right.
function showUserInfo() {
  $('#headerUserInfo').toggleClass('hidden', false);
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

function showUser(userSnapshot) {
  const user = userSnapshot.val();

  $('#headerUserName').text(user.username);

  if (user.profileImg) {
    $('#imgHeaderProfilePicture').attr('src', user.profileImg);
  }

  hideSignInUp();
  showUserInfo();
}

function gotoUserProfile(e) {
  e.preventDefault();

  const uid = firebase.auth().currentUser.uid;
  userLib.getUser(uid, (userSnapshot) => {
    window.location = `/profile/${userSnapshot.val().username}`;
  });
}

function bindEvents() {
  $('#headerSignOut').on('click', auth.signOut);
  $('#headerGotoProfile').on('click', gotoUserProfile);
}

function authStateListener(user) {
  if (user) {
    // Hide the sign in modal after successfull login.
    $('#modalSignIn').modal('hide');
    // Listen for changes on the logged in user.
    firebase.database().ref(`/users/${user.uid}`).on('value', showUser);
  } else {
    hideUserInfo();
    showSignInUp();
  }
}

exports.bindEvents = bindEvents;
exports.authStateListener = authStateListener;
