var auth = require('../auth');

function showUser(userSnapshot) {
  var user = userSnapshot.val();
  console.log(user);

  $('#headerUserName').html(user.username);

  hideSignInUp();
  showUserInfo();

}

function showUserInfo() {
  $('#headerUserInfo').toggleClass('hidden', false);
}

function hideUserInfo() {
  $('#headerUserInfo').toggleClass('hidden', true);
}

function hideUser() {
  hideUserInfo();
  showSignInUp();
}

function hideSignInUp() {
  $('#headerSignIn').toggleClass('hidden', true);
  $('#headerSignUp').toggleClass('hidden', true);
}

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
    firebase.database().ref('/users/' + user.uid).on('value', showUser);
  } else {
    hideUser();
  }
}

exports.showUser = showUser;
exports.hideUser = hideUser;
exports.bindEvents = bindEvents;
exports.authStateListener = authStateListener;
