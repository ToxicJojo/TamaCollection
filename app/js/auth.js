// Creates a new user account, with the given username, email and password.
// If the account creation was not successfull errorCallback will be called with
// the returned error.
function createNewAccount(username, email, password, errorCallback) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(errorCallback)
  .then(function(user) {
    if(user) {
      var database = firebase.database();

      var updates = {};
      // Save the username in /users/$UID/username
      updates['/users/' + user.uid] = { username: username};

      database.ref().update(updates).then(function() {
        // After the account has been created switch to the welcome page.
        window.location = "welcome";
      });
    }
  });
}

// Checks if the given username is not yet in use.
// Once the databse lookup resolves the callback function is called with
// -true : The name is not used yet.
// -false: The name is already in use.
function isUsernameAvaiable(username, callback) {
  // Check if the the path /usernames/$username exists.
  firebase.database().ref('/usernames/' + username).once('value', function(snapshot) {
    // If the value at the path is null there is no user with the name $username
    if(snapshot.val() === null) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

exports.createNewAccount = createNewAccount;
exports.isUsernameAvaiable = isUsernameAvaiable;
