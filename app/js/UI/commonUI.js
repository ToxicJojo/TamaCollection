var signupUI = require('./signupUI');
var headerUI = require('./headerUI');

function bindEvents() {
  signupUI.bindEvents();
}

function handleAuthState() {
  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    headerUI.showUser(user);
  } else {

  }
});
}


exports.bindEvents = bindEvents;
exports.handleAuthState = handleAuthState;
