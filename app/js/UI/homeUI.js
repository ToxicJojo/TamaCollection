var commonUI = require('./commonUI');
var auth = require('../auth');

$(function() {
  commonUI.bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();
});
