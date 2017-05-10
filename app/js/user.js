const util = require('./util');

function updateUserData(userData, successCallback) {
  firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`).update(userData)
    .then(successCallback);
}

function updateProfilePicture(file, successCallback) {
  util.uploadFileToFirebase(file, `/images/users/${firebase.auth().currentUser.uid}/profileImage.png`, (snapshot) => {
    const userData = {
      profileImg: snapshot.downloadURL,
    };

    updateUserData(userData, successCallback);
  });
}

function getUser(uid, successCallback, errorCallback) {
  firebase.database().ref(`/users/${uid}/`).once('value', successCallback, errorCallback);
}

function listenOnUser(uid, successCallback) {
  firebase.database().ref(`/users/${uid}`).on('value', successCallback);
}

function getUserIdFromName(name, successCallback) {
  firebase.database().ref(`/usernames/${name}`).once('value', successCallback);
}

exports.updateUserData = updateUserData;
exports.updateProfilePicture = updateProfilePicture;
exports.getUser = getUser;
exports.listenOnUser = listenOnUser;
exports.getUserIdFromName = getUserIdFromName;
