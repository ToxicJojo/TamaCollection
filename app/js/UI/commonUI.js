var signUpUI = require('./signUpUI');
var signInUI = require('./signInUI');
var headerUI = require('./headerUI');

function bindEvents() {
  signUpUI.bindEvents();
  signInUI.bindEvents();
}

function handleAuthState() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Hide the sign in modal after successfull login.
    $('#modalSignIn').modal('hide')
    headerUI.showUser(user);
  } else {

  }
});
}


exports.bindEvents = bindEvents;
exports.handleAuthState = handleAuthState;
