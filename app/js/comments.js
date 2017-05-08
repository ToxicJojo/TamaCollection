const util = require('./util');

function postVersionComment(versionId, comment, successCallback) {
  const database = firebase.database();

  const newCommentId = database.ref('/versionComments').push().key;
  const userId = firebase.auth().currentUser.uid;

  // TODO Timestamp should be generated on the server via a function
  const commentData = {
    text: comment,
    owner: userId,
    version: versionId,
    timestamp: new Date().getTime(),
  };

  const updates = {};

  updates[`/versionComments/${newCommentId}/`] = commentData;
  updates[`/versions/${versionId}/comments/${newCommentId}`] = true;
  updates[`/users/${userId}/versionComments/${newCommentId}`] = true;


  database.ref().update(updates)
    .then(successCallback);
}

function listenOnComments(versionId, commentsChangeCallback, singleCommentCallback) {
  firebase.database().ref(`/versions/${versionId}/comments`).on('value', (commentListSnapshot) => {
    commentsChangeCallback();
    util.cycleObjectProperties(commentListSnapshot.val(), (commentId) => {
      firebase.database().ref(`/versionComments/${commentId}`).once('value', singleCommentCallback);
    });
  });
}

exports.postVersionComment = postVersionComment;
exports.listenOnComments = listenOnComments;
