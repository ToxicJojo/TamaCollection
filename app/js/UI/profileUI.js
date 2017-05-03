const commonUI = require('./commonUI');
const auth = require('../auth');

$(() => {
  commonUI.bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();
});
