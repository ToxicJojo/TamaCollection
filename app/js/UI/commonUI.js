var signUpUI = require('./signUpUI');
var signInUI = require('./signInUI');
var headerUI = require('./headerUI');

function bindEvents() {
  signUpUI.bindEvents();
  signInUI.bindEvents();
  headerUI.bindEvents();
}

function authStateListener(user) {
  headerUI.authStateListener(user);
}


exports.bindEvents = bindEvents;
exports.authStateListener = authStateListener;
