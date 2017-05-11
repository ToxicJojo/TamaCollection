const commonUI = require('./commonUI');
const auth = require('../auth');
const profileSettingsUI = require('../components/profileSettingsUI');


$(() => {
  commonUI.bindEvents();
  profileSettingsUI.bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);
  auth.addAuthStateListener(profileSettingsUI.authStateListener);
  auth.addAuthStateListener(authStateListener);
  auth.registerAuthStateListeners();

  profileSettingsUI.init();
});


function authStateListener(user) {
  if (!user) {
    // When not logged in go to the landing page.
    window.location = '/';
  }
}
