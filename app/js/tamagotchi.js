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


exports.getVersions = getVersions;
exports.getReleases = getReleases
exports.getShells = getShells;
