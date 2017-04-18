function getVersions(successCallback) {
  var database = firebase.database();

  database.ref('/versions/').once('value', successCallback);
}

function getReleases(versionId, successCallback) {
  var database = firebase.database();

  database.ref('/releases/' + versionId).once('value', successCallback);
}

function getShells(releaseId, successCallback) {
  var database = firebase.database();

  database.ref('/shells/' + releaseId).once('value', successCallback);
}

function listenOnVerions(versionsListener) {
  var database = firebase.database();

  database.ref('/versions/').on('value', versionsListener);
}


function updateVersion(versionId, version, successCallback) {
  var database = firebase.database();

  var updates  = {};

  updates['/versions/' + versionId] = version;

  database.ref().update(updates)
    .then(successCallback);
}

function addVersion(successCallback) {
  var database = firebase.database();

  var newVersionRef = database.ref('/versions/').push();

  newVersionRef.set({
    name: 'New Version',
    description: 'New Version Description',
    shorthand: 'NV'
  }).then(successCallback);
}

function deleteVersion(versionId, successCallback) {
  var database = firebase.database();
  database.ref('/versions/' + versionId).remove()
    .then(successCallback);
}

exports.getVersions = getVersions;
exports.getReleases = getReleases
exports.getShells = getShells;

exports.listenOnVerions = listenOnVerions;

exports.updateVersion = updateVersion;

exports.addVersion = addVersion;

exports.deleteVersion = deleteVersion;
