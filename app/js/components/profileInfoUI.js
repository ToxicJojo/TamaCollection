const uiHelper = require('../uiHelper');
const userLib = require('../user');

const init = () => {
  uiHelper.showLoadingSpinner('#profileInfoPanelBody');
};


// UI Functions
const showSocial = (socialType, socialLink) => {
  $(`#profileInfoSocial${socialType}`).toggleClass('hidden', false);
  $(`#profileInfoSocial${socialType}`).attr('href', socialLink);
};

const showEmptyState = () => {
  $('#profileInfoPanelBodyContent').toggleClass('hidden', true);
  $('#profileInfoEmptyStateUser').toggleClass('hidden', false);
};

const showUser = (user) => {
  $('#profileInfoUsername').text(user.username);
  $('#profileInfoBio').text(user.bio);

  // Only change the image if the user has a profileImg.
  if (user.profileImg) {
    $('#profileInfoProfileImg').attr('src', user.profileImg);
  }

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
};

// Logic
const setUserId = (userId) => {
  userLib.getUser(userId, (userSnapshot) => {
    const user = userSnapshot.val();

    // If the user exists display it. Otherwise show the empty state.
    if (user) {
      showUser(user);
    } else {
      showEmptyState();
    }

    uiHelper.hideLoadingSpinner('#profileInfoPanelBody');
  });
};


exports.init = init;
exports.setUserId = setUserId;
