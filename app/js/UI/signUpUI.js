const validator = require('../validator');
const auth = require('../auth');


function signupButtonClick() {
  $('#buttonSignUp').button('loading');

  // Get the form values.
  const username = $('#inputUsernameSignUp').val();
  const email = $('#inputEmailSignUp').val();
  const password = $('#inputPasswordSignUp').val();

  // Indicates whether or not the inputs where successfully validated.
  // Will be set to false if one or more validations fail.
  let validationSuccess = true;

  // Check if the username is avaiable
  auth.isUsernameAvaiable(username, (nameAvaiable) => {
    if (!nameAvaiable) {
      showInputError('Username');
      validationSuccess = false;
    } else {
      clearInputError('Username');
    }

    // Validate the email address.
    if (!validator.validateEmail(email)) {
      $('#helpBlockEmail').html('A valid Email address is required.');
      showInputError('Email');
      validationSuccess = false;
    } else {
      clearInputError('Email');
    }

    // Validate the password.
    if (!validator.validatePassword(password)) {
      showInputError('Password');
      validationSuccess = false;
    } else {
      clearInputError('Password');
    }

    // Only create a new account, when all validations where successfull.
    if (validationSuccess) {
      auth.createNewAccount(username, email, password, handleCreateNewAccountError);
    } else {
      $('#buttonSignUp').button('reset');
    }
  });
}

// Clears the modal from inputs and error messages.
function clearModal() {
  // Clear the input fields.
  $('#inputUsernameSignUp').val('');
  $('#inputEmailSignUp').val('');
  $('#inputPasswordSignUp').val('');
  // Clear all error messages.
  clearInputError('Username');
  clearInputError('Email');
  clearInputError('Password');
}

// When the creation of a new account fails, this will be called to display the
// error feedback to the user.
function handleCreateNewAccountError(error) {
  $('#buttonSignUp').button('reset');

  if (error.code === 'auth/email-already-in-use') {
    $('#helpBlockEmail').html(error.message);
    showInputError('Email');
  }
}

// Hides the error message for a specific formGroup.
function clearInputError(group) {
  $(`#formGroup${group}`).toggleClass('has-error', false);
  $(`#helpBlock${group}`).toggleClass('hidden', true);
}

// Shows the error message for a specific formGroup.
function showInputError(group) {
  $(`#formGroup${group}`).toggleClass('is-focused', true);
  $(`#formGroup${group}`).toggleClass('has-error', true);
  $(`#helpBlock${group}`).toggleClass('hidden', false);
}

// Handles the 'change' event for the username field.
// It checks whether the usename in the field is avaiable and displays an error
// to the user if the name is not avaiable.
function inputUsernameChange() {
  const username = $('#inputUsernameSignUp').val();

  auth.isUsernameAvaiable(username, (nameAvaiable) => {
    if (!nameAvaiable) {
      showInputError('Username');
    } else {
      clearInputError('Username');
    }
  });
}


function bindEvents() {
  $('#buttonSignUp').on('click', signupButtonClick);
  $('#inputUsernameSignUp').on('change', inputUsernameChange);

  $('#modalSignUp').on('hidden.bs.modal', clearModal);
  $('#modalSignUp').on('shown.bs.modal', () => {
    $('#inputUsernameSignUp').focus();
  });
}


exports.bindEvents = bindEvents;
