// Creates a new user account, with the given username, email and password.
// If the account creation was not successfull errorCallback will be called with
// the returned error.
function createNewAccount(username, email, password, errorCallback) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch(errorCallback)
  .then((user) => {
    if (user) {
      const database = firebase.database();

      const updates = {};
      // Save the username in /users/$UID/username
      updates[`/users/${user.uid}`] = { username };

      database.ref().update(updates).then(() => {
        // After the account has been created switch to the welcome page.
        window.location = 'welcome';
      });
    }
  });
}

// Tries to sign in the user with the given email and password.
// When the login fails, errorCallback is called..
function signIn(email, password, errorCallback) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(errorCallback);
}

function signOut() {
  firebase.auth().signOut();
}

// Checks if the given username is not yet in use.
// Once the databse lookup resolves the callback function is called with
// -true : The name is not used yet.
// -false: The name is already in use.
function isUsernameAvaiable(username, callback) {
  // Check if the the path /usernames/$username exists.
  firebase.database().ref(`/usernames/${username}`).once('value', (snapshot) => {
    // If the value at the path is null there is no user with the name $username
    if (snapshot.val() === null) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

// This holds a colection of functions that listen for the authentication state
const authStateListeners = [];

function addAuthStateListener(authStateListener) {
  authStateListeners.push(authStateListener);
}

function registerAuthStateListeners() {
  firebase.auth().onAuthStateChanged((user) => {
    // Loop through all registerd listeners and invoke them.
    for (let i = 0; i < authStateListeners.length; i++) {
      authStateListeners[i](user);
    }
  });
}

exports.createNewAccount = createNewAccount;
exports.signIn = signIn;
exports.signOut = signOut;
exports.isUsernameAvaiable = isUsernameAvaiable;
exports.addAuthStateListener = addAuthStateListener;
exports.registerAuthStateListeners = registerAuthStateListeners;
