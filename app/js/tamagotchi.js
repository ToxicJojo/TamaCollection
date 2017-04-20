// GET Functions

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

// Listen Functions

function listenOnVerions(versionsListener) {
  var database = firebase.database();

  database.ref('/versions/').on('value', versionsListener);
}

function listenOnReleases(versionId, releasesListener) {
  var database = firebase.database();

  database.ref('/releases/' + versionId).on('value', releasesListener);
}


// Update Functions

function updateVersion(versionId, version, successCallback) {
  var database = firebase.database();

  var updates  = {};

  updates['/versions/' + versionId] = version;

  database.ref().update(updates)
    .then(successCallback);
}

function updateRelease(versionId, releaseId, release, successCallback) {
  var database = firebase.database();

  var updates = {};

  updates['/releases/' + versionId + '/' + releaseId] = release;

  database.ref().update(updates)
    .then(successCallback);
}

// Add functions

function addVersion(successCallback) {
  var database = firebase.database();

  var newVersionRef = database.ref('/versions/').push();

  newVersionRef.set({
    name: 'New Version',
    description: 'New Version Description',
    shorthand: 'NV'
  }).then(successCallback);
}

function addRelease(versionId, successCallback) {
  var database = firebase.database();

  var newReleaseRef = database.ref('/releases/' + versionId).push();

  newReleaseRef.set({
    name: 'New Release',
    date: '01.01.2000',
    price: '1‎¥'
  }).then(successCallback);
}

// Delete Functions

function deleteVersion(versionId, successCallback) {
  var database = firebase.database();
  database.ref('/versions/' + versionId).remove()
    .then(successCallback);
}

function deleteRelease(versionId, releaseId, successCallback) {
  var database = firebase.database();

  database.ref('/releases/' + versionId + '/' + releaseId).remove()
    .then(successCallback);
}

exports.getVersions = getVersions;
exports.getReleases = getReleases
exports.getShells = getShells;

exports.listenOnVerions = listenOnVerions;
exports.listenOnReleases = listenOnReleases;

exports.updateVersion = updateVersion;
exports.updateRelease = updateRelease;

exports.addVersion = addVersion;
exports.addRelease = addRelease;

exports.deleteVersion = deleteVersion;
exports.deleteRelease = deleteRelease;
