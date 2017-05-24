const shellImages = require('../shellImages');
const validator = require('../validator');
const util = require('../util');

const shellImagesThumbnailTemplate = require('../templates/shellImagesThumbnail');

let currentShellId;
let uploadButton;

const init = () => {
  uploadButton = $('#shellImagesButtonUpload');
};

const showImages = (shellImagesSnapshot) => {
  const images = shellImagesSnapshot.val();

  const shellImagesUser = $('#shellImagesUser');
  shellImagesUser.html('');

  util.cycleObjectProperties(images.user, (imageId, imageData) => {
    const templateData = {
      imageId,
      imageData,
    };

    shellImagesUser.append(shellImagesThumbnailTemplate(templateData));
    console.log(templateData);
  });
};

const setShellId = (shellId) => {
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
exports.setShellId = setShellId;
exports.bindEvents = bindEvents;
