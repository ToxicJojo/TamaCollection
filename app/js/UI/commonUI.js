// Defines UI interaction that are used by most pages.

const signUpUI = require('./signUpUI');
const signInUI = require('./signInUI');
const headerUI = require('./headerUI');

function bindEvents() {
  signUpUI.bindEvents();
  signInUI.bindEvents();
  headerUI.bindEvents();
}

function authStateListener(user) {
  headerUI.authStateListener(user);
}

function showLoadingSpinner(jquerySelector) {
  $(jquerySelector).LoadingOverlay('show', {
    image: '',
    fontawesome: 'fa fa-spinner fa-spin',
  });
}

function hideLoadingSpinner(jquerySelector) {
  $(jquerySelector).LoadingOverlay('hide');
}

exports.bindEvents = bindEvents;
exports.authStateListener = authStateListener;

exports.showLoadingSpinner = showLoadingSpinner;
exports.hideLoadingSpinner = hideLoadingSpinner;
