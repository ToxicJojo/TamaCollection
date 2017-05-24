const util = require('./util');

const listenOnShellImages = (shellId, successCallback) => {
  firebase.database().ref(`/shellImages/${shellId}`).on('value', successCallback);
};

const updateShellImage = (shellId, shellImageId, shellImageData) => {
  return firebase.database().ref(`/shellImages/${shellId}/user/${shellImageId}`).update(shellImageData);
};

const uploadShellImage = (shellId, file) => {
  const database = firebase.database();

  const newShellImageRef = database.ref('/shellImages/').push();

  return new Promise((resolve) => {
    util.uploadFileToFirebase(file, `/images/shells/${shellId}/userImages/${newShellImageRef.key}.png`, (snapshot) => {
      const shellImageData = {
        img: snapshot.downloadURL,
        timestamp: new Date().getTime(),
        uploader: firebase.auth().currentUser.uid,
      };

      updateShellImage(shellId, newShellImageRef.key, shellImageData)
        .then(resolve());
    });
  });
};

exports.listenOnShellImages = listenOnShellImages;
exports.updateShellImage = updateShellImage;
exports.uploadShellImage = uploadShellImage;
