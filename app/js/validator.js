const BIO_MAX_LENGTH = 300;

const FILE_TYPE_PNG = 'image/png';
const FILE_TYPE_JPG = 'image/jpeg';

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

function validateBio(bio) {
  return (bio.length <= BIO_MAX_LENGTH);
}

// A valid image must be either a png or a jpeg file.that is smaller than 5MB
function validateImage(file) {
  if (file.type === FILE_TYPE_PNG || file.type === FILE_TYPE_JPG) {
    if (file.size < 5 * 1024 * 1024) {
      return true;
    }
  }
  return false;
}

exports.validateUsername = validateUsername;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateBio = validateBio;
exports.validateImage = validateImage;
