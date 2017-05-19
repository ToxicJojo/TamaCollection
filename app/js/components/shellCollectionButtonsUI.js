const collection = require('../collection');


let currentVersionId;
let currentReleaseId;
let currentShellId;
let userCollection;

const addCurrentShellTo = (group) => {
  $(`#buttonAddTo${group.toUpperCase()}`).button('loading');

  collection.addTo(group, currentVersionId, currentReleaseId, currentShellId, () => {
    $(`#buttonAddTo${group.toUpperCase()}`).button('reset');
  });
};

const removeCurrentShellFrom = (group) => {
  $(`#buttonRemoveFrom${group.toUpperCase()}`).button('loading');

  collection.removeFrom(group, currentVersionId, currentReleaseId, currentShellId, () => {
    $(`#buttonRemoveFrom${group.toUpperCase()}`).button('reset');
  });
};


const addToCollectionClickHandler = (e) => {
  e.preventDefault();

  addCurrentShellTo('collected');
};

const removeFromCollectionClickHandler = (e) => {
  e.preventDefault();

  removeCurrentShellFrom('collected');
};

const addToWantedClickHandler = (e) => {
  e.preventDefault();

  addCurrentShellTo('wanted');
};

const removeFromWantedClickHandler = (e) => {
  e.preventDefault();

  removeCurrentShellFrom('wanted');
};

const addToFavoriteClickHandler = (e) => {
  e.preventDefault();

  addCurrentShellTo('favorite');
};

const removeFromFavoriteClickHandler = (e) => {
  e.preventDefault();

  removeCurrentShellFrom('favorite');
};

const showCollectionStatus = () => {
  if (collection.isItemInCollection(userCollection, currentVersionId, currentReleaseId, currentShellId)) {
    $('#shellCollectionButtonAddToCollected').toggleClass('hidden', true);
    $('#shellCollectionButtonRemoveFromCollected').toggleClass('hidden', false);
    $('#shellCollectionButtonAddToWanted').toggleClass('hidden', true);
    $('#shellCollectionButtonRemoveFromWanted').toggleClass('hidden', true);
  } else {
    $('#shellCollectionButtonAddToCollected').toggleClass('hidden', false);
    $('#shellCollectionButtonRemoveFromCollected').toggleClass('hidden', true);

    if (collection.isItemInWanted(userCollection, currentVersionId, currentReleaseId, currentShellId)) {
      $('#shellCollectionButtonAddToWanted').toggleClass('hidden', true);
      $('#shellCollectionButtonRemoveFromWanted').toggleClass('hidden', false);
    } else {
      $('#shellCollectionButtonAddToWanted').toggleClass('hidden', false);
      $('#shellCollectionButtonRemoveFromWanted').toggleClass('hidden', true);
    }
  }

  if (collection.isItemInFavorite(userCollection, currentVersionId, currentReleaseId, currentShellId)) {
    $('#shellCollectionButtonAddToFavorite').toggleClass('hidden', true);
    $('#shellCollectionButtonRemoveFromFavorite').toggleClass('hidden', false);
  } else {
    $('#shellCollectionButtonAddToFavorite').toggleClass('hidden', false);
    $('#shellCollectionButtonRemoveFromFavorite').toggleClass('hidden', true);
  }
};

const collectionListener = (collectionSnapshot) => {
  userCollection = collectionSnapshot.val();
  // If the user has no items in his collection set it to an empty object to
  // avoid null exceptions.
  if (!userCollection) {
    userCollection = {};
  }

  showCollectionStatus();
};

const authStateListener = (user) => {
  if (user) {
    collection.listenOnCollection(collectionListener);
  }
};


const setIds = (versionId, releaseId, shellId) => {
  [currentVersionId, currentReleaseId, currentShellId] = [versionId, releaseId, shellId];

  showCollectionStatus();
};


const bindEvents = () => {
  $('#shellCollectionButtonAddToCollected').on('click', addToCollectionClickHandler);
  $('#shellCollectionButtonRemoveFromCollected').on('click', removeFromCollectionClickHandler);
  $('#shellCollectionButtonAddToWanted').on('click', addToWantedClickHandler);
  $('#shellCollectionButtonRemoveFromWanted').on('click', removeFromWantedClickHandler);
  $('#shellCollectionButtonAddToFavorite').on('click', addToFavoriteClickHandler);
  $('#shellCollectionButtonRemoveFromFavorite').on('click', removeFromFavoriteClickHandler);
};


exports.setIds = setIds;
exports.bindEvents = bindEvents;
exports.authStateListener = authStateListener;
