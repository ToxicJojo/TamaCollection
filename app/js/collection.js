function addTo(group, versionId, releaseId, shellId, successCallback) {
  var database = firebase.database();

  var updates = {};

  updates['/collections/' + firebase.auth().currentUser.uid + '/' + versionId + '/' + releaseId + '/' + shellId + '/' + group] = true;

  // If a shell is added to the colection, remove it from the wanted list.
  if(group === 'collected') {
    updates['/collections/' + firebase.auth().currentUser.uid + '/' + versionId + '/' + releaseId + '/' + shellId + '/wanted'] = null;
  }

  database.ref().update(updates)
    .then(successCallback);
}

function removeFrom(group, versionId, releaseId, shellId, successCallback) {
  var database = firebase.database();

  var updates = {};
  updates['/collections/' + firebase.auth().currentUser.uid + '/' + versionId + '/' + releaseId + '/' + shellId + '/' + group] = null;

  database.ref().update(updates)
    .then(successCallback);
}

function isItemIn(collection, group, versionId, releaseId, shellId) {
  if(collection[versionId]) {
    if(collection[versionId][releaseId]) {
      if(collection[versionId][releaseId][shellId]) {
        if(collection[versionId][releaseId][shellId][group]){
          return true;
        }
      }
    }
  }
  return false;
}

function isItemInCollection(collection, versionId, releaseId, shellId) {
  return isItemIn(collection, 'collected', versionId, releaseId, shellId);
}

function isItemInWanted(collection, versionId, releaseId, shellId) {
  return isItemIn(collection, 'wanted', versionId, releaseId, shellId);
}

function isItemInFavorite(collection, versionId, releaseId, shellId) {
  return isItemIn(collection, 'favorite', versionId, releaseId, shellId);
}



function listenOnCollection(collectionListener) {
  var database = firebase.database();

  database.ref('/collections/' + firebase.auth().currentUser.uid).on('value', collectionListener);
}

exports.addTo = addTo;
exports.removeFrom = removeFrom;
exports.isItemIn = isItemIn;

exports.isItemInCollection = isItemInCollection;
exports.isItemInWanted = isItemInWanted;
exports.isItemInFavorite = isItemInFavorite;

exports.listenOnCollection = listenOnCollection;
