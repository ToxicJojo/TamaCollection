function updateUserData(userData, successCallback) {
  var updates = {};

  console.log(userData);
  updates['/users/' + firebase.auth().currentUser.uid] = userData;

  firebase.database().ref().update(updates)
    .then(successCallback);
}

exports.updateUserData = updateUserData;
