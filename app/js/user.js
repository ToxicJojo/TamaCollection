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

exports.updateUserData = updateUserData;
exports.updateProfilePicture = updateProfilePicture;
