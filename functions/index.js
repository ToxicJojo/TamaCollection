const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// When a username is written, we need to save it in /usernames/$username
// We also need to remove the old username if one is present so the name becomes
// avaiable again.
exports.saveUsernameToList = functions.database.ref('/users/{userID}/username')
    .onWrite(event => {
      var updates = {};

      // Get the new and old value for the username.
      const newUsername = event.data.val();
      const oldUsername = event.data.previous.val();

      const uID = event.params.userID;
      // Check if the user had a previous name.
      if(event.data.previous.exists()) {
        // Remove that name from /usernames
        updates['/usernames/' + oldUsername] = null;
      }

      // Add the new username to /usernames
      updates['/usernames/' + newUsername] = uID;

      return admin.database().ref().update(updates);
    });
