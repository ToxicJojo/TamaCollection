const util = require('./util');

function addTo(group, versionId, releaseId, shellId, successCallback) {
  const database = firebase.database();

  const updates = {};

  updates[`/collections/${firebase.auth().currentUser.uid}/${versionId}/${releaseId}/${shellId}/${group}`] = true;

  // If a shell is added to the colection, remove it from the wanted list.
  if (group === 'collected') {
    updates[`/collections/${firebase.auth().currentUser.uid}/${versionId}/${releaseId}/${shellId}/wanted`] = null;
  }

  database.ref().update(updates)
    .then(successCallback);
}

function removeFrom(group, versionId, releaseId, shellId, successCallback) {
  const database = firebase.database();

  const updates = {};

  updates[`/collections/${firebase.auth().currentUser.uid}/${versionId}/${releaseId}/${shellId}/${group}`] = null;

  database.ref().update(updates)
    .then(successCallback);
}

function isItemIn(collection, group, versionId, releaseId, shellId) {
  if (collection[versionId]) {
    if (collection[versionId][releaseId]) {
      if (collection[versionId][releaseId][shellId]) {
        if (collection[versionId][releaseId][shellId][group]) {
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

function getCollectionList(collection) {
  const collectionList = {
    collected: [],
    wanted: [],
    favorite: [],
  };

  util.cycleObjectProperties(collection, (versionId, version) => {
    util.cycleObjectProperties(version, (releaseId, release) => {
      util.cycleObjectProperties(release, (shellId, shell) => {
        const collectionItem = {
          versionId,
          releaseId,
          shellId,
        };

        if (shell.collected) {
          collectionList.collected.push(collectionItem);
        }

        if (shell.wanted) {
          collectionList.wanted.push(collectionItem);
        }

        if (shell.favorite) {
          collectionList.favorite.push(collectionItem);
        }
      });
    });
  });

  return collectionList;
}


function listenOnCollection(collectionListener) {
  const database = firebase.database();

  database.ref(`/collections/${firebase.auth().currentUser.uid}`).on('value', collectionListener);
}

function listenOnUserCollection(userId, collectionListener) {
  const database = firebase.database();

  database.ref(`/collections/${userId}`).on('value', collectionListener);
}

exports.addTo = addTo;
exports.removeFrom = removeFrom;
exports.isItemIn = isItemIn;

exports.isItemInCollection = isItemInCollection;
exports.isItemInWanted = isItemInWanted;
exports.isItemInFavorite = isItemInFavorite;

exports.getCollectionList = getCollectionList;

exports.listenOnCollection = listenOnCollection;
exports.listenOnUserCollection = listenOnUserCollection;
