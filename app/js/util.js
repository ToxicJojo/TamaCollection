function cycleObjectProperties(object, callbackFunction) {
  if (object) {
    Object.entries(object).forEach(([key, value]) => {
      callbackFunction(key, value);
    });
  }
}

function uploadFileToFirebase(file, path, callbackFunction) {
  const storageRef = firebase.storage().ref().child(path);

  const uploadTask = storageRef.put(file);

  uploadTask.on('state_changed', null, null, () => {
    callbackFunction(uploadTask.snapshot);
  });
}

exports.cycleObjectProperties = cycleObjectProperties;
exports.uploadFileToFirebase = uploadFileToFirebase;
