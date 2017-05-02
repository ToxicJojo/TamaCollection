function updateUserData(userData, successCallback) {
  const updates = {};

  updates[`/users/${firebase.auth().currentUser.uid}`] = userData;

  firebase.database().ref().update(updates)
    .then(successCallback);
}

exports.updateUserData = updateUserData;
