// GET Functions

function getVersions(successCallback) {
  const database = firebase.database();

  database.ref('/versions/').once('value', successCallback);
}

function getReleases(versionId, successCallback) {
  const database = firebase.database();

  database.ref(`/releases/${versionId}`).once('value', successCallback);
}

function getShells(releaseId, successCallback) {
  const database = firebase.database();

  database.ref(`/shells/${releaseId}`).once('value', successCallback);
}

// Listen Functions

function listenOnVerions(versionsListener) {
  const database = firebase.database();

  database.ref('/versions/').on('value', versionsListener);
}

function listenOnReleases(versionId, releasesListener) {
  const database = firebase.database();

  database.ref(`/releases/${versionId}`).on('value', releasesListener);
}

function listenOnShells(releaseId, shellsListener) {
  const database = firebase.database();

  database.ref(`/shells${releaseId}/`).on('value', shellsListener);
}


// Update Functions

function updateVersion(versionId, version, successCallback) {
  const database = firebase.database();

  const updates = {};

  updates[`/versions/${versionId}`] = version;

  database.ref().update(updates)
    .then(successCallback);
}

function updateRelease(versionId, releaseId, release, successCallback) {
  const database = firebase.database();

  const updates = {};

  updates[`/releases/${versionId}/${releaseId}`] = release;

  database.ref().update(updates)
    .then(successCallback);
}

function updateShell(releaseId, shellId, shell, successCallback) {
  const database = firebase.database();

  database.ref(`/shells/${releaseId}/${shellId}`).update(shell)
    .then(successCallback);
}

// Add functions

function addVersion(successCallback) {
  const database = firebase.database();

  const newVersionRef = database.ref('/versions/').push();

  newVersionRef.set({
    name: 'New Version',
    description: 'New Version Description',
    shorthand: 'NV',
  }).then(successCallback);
}

function addRelease(versionId, successCallback) {
  const database = firebase.database();

  const newReleaseRef = database.ref(`/releases/${versionId}`).push();

  newReleaseRef.set({
    name: 'New Release',
    date: '01.01.2000',
    price: '1‎¥',
  }).then(successCallback);
}

function addShell(releaseId, successCallback) {
  const database = firebase.database();

  const newShellRef = database.ref(`/shells/${releaseId}`).push();

  newShellRef.set({
    color: 'New Color',
    img: '/img/sampleShell.jpg',
    thumbnail: '/img/sampleShell.jpg',
  }).then(successCallback);
}

// Delete Functions

function deleteVersion(versionId, successCallback) {
  const database = firebase.database();
  database.ref(`/versions/${versionId}`).remove()
    .then(successCallback);
}

function deleteRelease(versionId, releaseId, successCallback) {
  const database = firebase.database();

  database.ref(`/releases/${versionId}/${releaseId}`).remove()
    .then(successCallback);
}

function deleteShell(releaseId, shellId, successCallback) {
  const database = firebase.database();

  database.ref(`/shells/${releaseId}/${shellId}`).remove()
    .then(successCallback);
}

exports.getVersions = getVersions;
exports.getReleases = getReleases;
exports.getShells = getShells;

exports.listenOnVerions = listenOnVerions;
exports.listenOnReleases = listenOnReleases;
exports.listenOnShells = listenOnShells;

exports.updateVersion = updateVersion;
exports.updateRelease = updateRelease;
exports.updateShell = updateShell;

exports.addVersion = addVersion;
exports.addRelease = addRelease;
exports.addShell = addShell;

exports.deleteVersion = deleteVersion;
exports.deleteRelease = deleteRelease;
exports.deleteShell = deleteShell;
