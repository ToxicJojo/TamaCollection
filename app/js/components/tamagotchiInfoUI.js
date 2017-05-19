const shellCollectionButtonsUI = require('./shellCollectionButtonsUI');

let currentVersionId;
let currentReleaseId;
let currentShellId;

const authStateListener = (user) => {
  shellCollectionButtonsUI.authStateListener(user);
};

const hideEmptyState = () => {
  $('#tamagotchiInfoEmptyState').toggleClass('hidden', true);
  $('#tamagotchiInfoPanel').toggleClass('hidden', false);
};

const hideShell = () => {
  $('#tamagotchiInfoShellPanel').toggleClass('hidden', true);

  $('#tamagotchiInfoShellImg').attr('src', '/img/sampleShell.jpg');
};

const hideRelease = () => {
  $('#tamagotchiInfoReleasePanel').toggleClass('hidden', true);
  hideShell();
};

const showVersion = (version) => {
  $('#tamagotchiInfoVersionName').text(version.name);
  $('#tamagotchiInfoVersionDescription').text(version.description);
  $('#tamagotchiInfoVersionShorthand').text(version.shorthand);

  $('#tamagotchiInfoVersionPanel').toggleClass('hidden', false);
  hideRelease();
};

const showRelease = (release) => {
  $('#tamagotchiInfoReleaseName').text(release.name);
  $('#tamagotchiInfoReleaseDate').text(release.date);
  $('#tamagotchiInfoReleasePrice').text(release.price);

  $('#tamagotchiInfoReleasePanel').toggleClass('hidden', false);
  hideShell();
};


const showShell = (shell) => {
  $('#tamagotchiInfoShellImg').attr('src', shell.img);
  $('#tamagotchiInfoShellColor').text(shell.color);

  $('#tamagotchiInfoShellPanel').toggleClass('hidden', false);
};


const setVersion = (version, versionId) => {
  currentVersionId = versionId;
  hideEmptyState();

  showVersion(version);
};

const setRelease = (release, releaseId) => {
  currentReleaseId = releaseId;
  showRelease(release);
};

const setShell = (shell, shellId) => {
  currentShellId = shellId;
  showShell(shell);
  // If the user is logged in show the collectionButtons
  if (firebase.auth().currentUser) {
    shellCollectionButtonsUI.setIds(currentVersionId, currentReleaseId, currentShellId);
    $('#collectionStatus').toggleClass('hidden', false);
  } else {
    $('#collectionStatus').toggleClass('hidden', true);
  }
};

const bindEvents = () => {
  shellCollectionButtonsUI.bindEvents();
};

exports.bindEvents = bindEvents;
exports.authStateListener = authStateListener;
exports.setVersion = setVersion;
exports.setRelease = setRelease;
exports.setShell = setShell;
