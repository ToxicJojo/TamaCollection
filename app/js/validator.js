// A valid username needs to be non empty.
function validateUsername(username) {
  return (username.length > 0);
}

// A valid email address needs to contain an '@'.
function validateEmail(email) {
  return (email.indexOf('@') !== -1);
}

// A valid password must be at least 6 characters long.
function validatePassword(password) {
  return (password.length > 5);
}


exports.validateUsername = validateUsername;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
