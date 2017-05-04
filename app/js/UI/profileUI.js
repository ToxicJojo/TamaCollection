const commonUI = require('./commonUI');
const auth = require('../auth');
const userLib = require('../user');

$(() => {
  commonUI.bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();

  loadUser();
});


function getUserId() {
  // The path looks like /profile/$uid
  const path = window.location.pathname.split('/');

  return path[2];
}

function loadUser() {
  const userId = getUserId();
  commonUI.showLoadingSpinner('#profileInfoPanel');

  userLib.getUser(userId, (userSnapshot) => {
    const user = userSnapshot.val();

    if (user) {
      showUser(user);
      commonUI.hideLoadingSpinner('#profileInfoPanel');
    } else {
      /* TODO User does not exists or got deleted
       * Display a error to the user
       */
    }
  });
}

function showUser(user) {
  $('#profileUsername').text(user.username);
  $('#profileUserBio').text(user.bio);

  if (user.profileImg) {
    $('#profileUserImage').attr('src', user.profileImg);
  }
}
