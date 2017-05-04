const commonUI = require('./commonUI');
const auth = require('../auth');
const userLib = require('../user');
const collection = require('../collection');
const tamagotchi = require('../tamagotchi');
const util = require('../util');

$(() => {
  commonUI.bindEvents();
  bindEvents();

  auth.addAuthStateListener(commonUI.authStateListener);

  auth.registerAuthStateListeners();

  loadUser();
});


function getUserId() {
  // The path looks like /profile/$uid
  const path = window.location.pathname.split('/');

  return path[2];
}

function loadUser() {
  const userId = getUserId();
  commonUI.showLoadingSpinner('#profileInfoPanel');

  userLib.getUser(userId, (userSnapshot) => {
    const user = userSnapshot.val();

    if (user) {
      showUser(user);
      commonUI.hideLoadingSpinner('#profileInfoPanel');
    } else {
      /* TODO User does not exists or got deleted
       * Display a error to the user
       */
    }
  });

  collection.listenOnUserCollection(userId, (collectionSnapshot) => {
    const userCollection = collectionSnapshot.val();

    showCollection(userCollection);
  });
}

function showCollection(userCollection) {
  // Contains the html for the collected, wanted and favorite tab.
  const html = {
    collected: '<div class="row">',
    wanted: '<div class="row">',
    favorite: '<div class="row">',
  };

  /* Cycle throuh the collection object to find all shells
   * a user has in his collection.
   */
  util.cycleObjectProperties(userCollection, (versionId, version) => {
    util.cycleObjectProperties(version, (releaseId, release) => {
      util.cycleObjectProperties(release, (shellId, shellStatus) => {
        const shellData = {
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
          // Display a placeholder and update it once getShell resolves.
          shellData.type = collectionType;
          html[collectionType] += placeholdershellthumbnailTemplate(shellData);


          tamagotchi.getShell(releaseId, shellId, (shellSnapshot) => {
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

  $('#profileCollectedContent').html(html.collected);
  $('#profileWantedContent').html(html.wanted);
  $('#profileFavoriteContent').html(html.favorite);
}

function showCollectionTab(tab) {
  // Mark the right tab as active.
  $('.tab').toggleClass('active', false);
  $(`#profile${tab}Tab`).toggleClass('active', true);
  // Hide the content of inactive tabs and show the active tabs content
  $('.profileCollectionContent').toggleClass('hidden', true);
  $(`#profile${tab}Content`).toggleClass('hidden', false);
}

function onCollectionTabClick(e) {
  e.preventDefault();

  const tabType = $(this).data().type;

  showCollectionTab(tabType);
}

function showUser(user) {
  $('#profileUsername').text(user.username);
  $('#profileUserBio').text(user.bio);

  // Check  if the social link is present and non-empty.
  if (user.social) {
    if (user.social.instagram !== '') {
      showSocial('Instagram', `https://www.instagram.com/${user.social.instagram}`);
    }

    if (user.social.facebook !== '') {
      showSocial('Facebook', user.social.facebook);
    }

    if (user.social.twitter !== '') {
      showSocial('Twitter', `https://twitter.com/${user.social.twitter}`);
    }
  }

  if (user.profileImg) {
    $('#profileUserImage').attr('src', user.profileImg);
  }
}

function showSocial(socialType, socialLink) {
  $(`#profileSocial${socialType}`).toggleClass('hidden', false);
  $(`#profileSocial${socialType}`).attr('href', socialLink);
}


function bindEvents() {
  $('#profileCollectedTab').on('click', onCollectionTabClick);
  $('#profileWantedTab').on('click', onCollectionTabClick);
  $('#profileFavoriteTab').on('click', onCollectionTabClick);
}
