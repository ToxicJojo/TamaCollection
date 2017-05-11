const commonUI = require('./commonUI');
const auth = require('../auth');
const userLib = require('../user');

const profileInfoUI = require('../components/profileInfoUI');
const profileCollectionUI = require('../components/profileCollectionUI');

$(() => {
  commonUI.bindEvents();
  profileCollectionUI.bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();


  loadUser();
  profileInfoUI.init();
  profileCollectionUI.init();
});


const getUserId = (callback) => {
  // The path looks like /profile/$uid
  const path = window.location.pathname.split('/');
  const username = path[2];

  userLib.getUserIdFromName(username, callback);
};

const loadUser = () => {
  commonUI.showLoadingSpinner('#profileInfoPanel');
  getUserId((userIdSnapshot) => {
    const userId = userIdSnapshot.val();

    profileInfoUI.setUserId(userId);
    profileCollectionUI.setUserId(userId);
  });
};
