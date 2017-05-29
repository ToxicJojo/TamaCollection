const shellImages = require('../shellImages');
const validator = require('../validator');
const util = require('../util');
const uiHelper = require('../uiHelper');

const shellImagesThumbnailTemplate = require('../templates/shellImagesThumbnail');

let currentShellId;

let uploadButton;
let emptyStateDiv;
let shellImagesRow;

const init = () => {
  uploadButton = $('#shellImagesButtonUpload');
  emptyStateDiv = $('#shellImagesEmptyState');
  shellImagesRow = $('#shellImagesRow');
};

const showEmptyState = () => {
  emptyStateDiv.toggleClass('hidden', false);
};

const hideEmptyState = () => {
  emptyStateDiv.toggleClass('hidden', true);
};

const hide = () => {
  shellImagesRow.toggleClass('hidden', true);
};

const showImages = (shellImagesSnapshot) => {
  shellImagesRow.toggleClass('hidden', false);
  const images = shellImagesSnapshot.val();

  const shellImagesUser = $('#shellImagesUser');
  shellImagesUser.html('');

  if (images) {
    hideEmptyState();

    util.cycleObjectProperties(images.user, (imageId, imageData) => {
      const templateData = {
        imageId,
        imageData,
      };

      shellImagesUser.append(shellImagesThumbnailTemplate(templateData));
    });
  } else {
    showEmptyState();
  }

  uiHelper.hideLoadingSpinner('#shellImagesPanelBody');
};

const setShellId = (shellId) => {
  // If we already were listening for changes on a shell we need to remove that listener
  if (currentShellId) {
    shellImages.removeShellImageListener(currentShellId);
  }

  uiHelper.showLoadingSpinner('#shellImagesPanelBody');

  currentShellId = shellId;
  shellImages.listenOnShellImages(currentShellId, showImages);
};

const uploadButtonClick = (e) => {
  e.preventDefault();

  $('#shellImagesInputFile').trigger('click');
};

const uploadShellImage = (e) => {
  e.preventDefault();

  uploadButton.button('loading');

  const file = document.getElementById('shellImagesInputFile').files[0];

  // Check if a file was selcted and it is a valid image file.
  if (file && validator.validateImage(file)) {
    shellImages.uploadShellImage(currentShellId, file)
      .then(() => {
        uploadButton.button('reset');
      });
  } else {
    uploadButton.button('reset');
  }
};

const bindEvents = () => {
  uploadButton.on('click', uploadButtonClick);
  $('#shellImagesInputFile').on('change', uploadShellImage);
};

exports.init = init;
exports.hide = hide;
exports.setShellId = setShellId;
exports.bindEvents = bindEvents;
