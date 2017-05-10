// Username
const USERNAME_MIN_LENGTH = 1;
const USERNAME_REASON_MIN_LENGTH = 'Your username must be non empty.';

// Bio
const BIO_MAX_LENGTH = 300;
const BIO_REASON_MAX_LENGTH = 'Your bio may only be 300 characters long.';

const FILE_TYPE_PNG = 'image/png';
const FILE_TYPE_JPG = 'image/jpeg';

const validationSuccess = () => {
  return {
    success: true,
  };
};

const validationFailure = (reason) => {
  return {
    success: false,
    reason,
  };
};

// A valid username needs to be non empty.
function validateUsername(username) {
  if (username.length >= USERNAME_MIN_LENGTH) {
    return validationSuccess();
  }

  return validationFailure(USERNAME_REASON_MIN_LENGTH);
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
  if (bio.length < BIO_MAX_LENGTH) {
    return validationSuccess();
  }

  return validationFailure(BIO_REASON_MAX_LENGTH);
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
