const uiHelper = require('../uiHelper');
const util = require('../util');
const collectionLib = require('../collection');
const tamagotchiLib = require('../tamagotchi');

const profileCollectionShellThumbnail = require('../templates/profileCollectionShellThumbnail');

const init = () => {
  uiHelper.showLoadingSpinner('#profileCollectionPanelBody');
};

// UI Functions
const showEmptyState = () => {
  $('#profileCollectionContent').toggleClass('hidden', true);
  $('#profileCollectionEmptyStatePrivate').toggleClass('hidden', false);
  uiHelper.hideLoadingSpinner('#profileCollectionPanelBody');
};

const showCollectionTab = (tab) => {
  // Mark the right tab as active.
  $('.tab').toggleClass('active', false);
  $(`#profileCollection${tab}Tab`).toggleClass('active', true);
  // Hide the content of inactive tabs and show the active tabs content
  $('.profileCollectionContent').toggleClass('hidden', true);
  $(`#profileCollection${tab}Content`).toggleClass('hidden', false);
};

const showCollection = (collection) => {
  // Contains the html for the collected, wanted and favorite tab.
  const html = {
    collected: '<div class="row">',
    wanted: '<div class="row">',
    favorite: '<div class="row">',
  };

  // Contains the amount of shells that are in the respective groups.
  const count = {
    collected: 0,
    wanted: 0,
    favorite: 0,
  };

  /* Cycle throuh the collection object to find all shells
   * a user has in his collection.
   */
  util.cycleObjectProperties(collection, (versionId, version) => {
    util.cycleObjectProperties(version, (releaseId, release) => {
      util.cycleObjectProperties(release, (shellId, shellStatus) => {
        const shellData = {
          versionId,
          releaseId,
          shellId,
        };

        /* The shellStatus object has optional keys
         * - collected
         * - wanted
         * - favorite
         * which indicate that the shell is in the respective collection group.
         * Cycle through it and add the thumbnail templates in the appropiated
         * html strings.
         */
        util.cycleObjectProperties(shellStatus, (collectionType) => {
          count[collectionType] += 1;
          // Display a placeholder and update it once getShell resolves.
          shellData.type = collectionType;
          html[collectionType] += profileCollectionShellThumbnail(shellData);

          tamagotchiLib.getShell(releaseId, shellId, (shellSnapshot) => {
            const shell = shellSnapshot.val();

            $(`#shellImg${collectionType}${shellId}`).attr('src', shell.thumbnail);
          });
        });
      });
    });
  });

  html.collected += '<div>';
  html.wanted += '<div>';
  html.favorite += '<div>';

  // Show the collections
  $('#profileCollectionCollectedContent').html(html.collected);
  $('#profileCollectionWantedContent').html(html.wanted);
  $('#profileCollectionFavoriteContent').html(html.favorite);

  // Show the collection, wanted and favorite count.
  $('#profileColectionCollectedCount').html(count.collected);
  $('#profileCollectionWantedCount').html(count.wanted);
  $('#profileCollectionFavoriteCount').html(count.favorite);

  uiHelper.hideLoadingSpinner('#profileCollectionPanelBody');
};


const setUserId = (userId) => {
  collectionLib.listenOnUserCollection(userId, (collectionSnapshot) => {
    const collection = collectionSnapshot.val();

    showCollection(collection);
  }, showEmptyState);
};

const onCollectionTabClick = (e) => {
  e.preventDefault();

  const tabType = $(e.currentTarget).data().type;

  showCollectionTab(tabType);
};

const bindEvents = () => {
  $('#profileCollectionCollectedTab').on('click', onCollectionTabClick);
  $('#profileCollectionWantedTab').on('click', onCollectionTabClick);
  $('#profileCollectionFavoriteTab').on('click', onCollectionTabClick);
};


exports.init = init;
exports.bindEvents = bindEvents;
exports.setUserId = setUserId;
