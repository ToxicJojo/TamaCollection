const commentsLib = require('../comments');
const userLib = require('../user');
const util = require('../util');
const comments = require('../comments');

const commentCardTemplate = require('../templates/commentCard');

let commentDiv;
let currentVersionId;

const init = () => {
  $('#versionComments').toggleClass('hidden', false);
  commentDiv = $('#versionCommentsCommentsDiv');
};

const clearComments = () => {
  commentDiv.html('');
};


const showComment = (comment) => {
  const commentData = {
    comment,
  };

  commentDiv.append(commentCardTemplate(commentData));

  userLib.getUser(comment.owner, (userSnapshot) => {
    const user = userSnapshot.val();

    $(`#commentPicture${comment.id}`).attr('src', user.profileImg);
    $(`#commentUserLink${comment.id}`).attr('href', `/profile/${user.username}`);
    $(`#commentUsername${comment.id}`).text(user.username);
  });
};

const setVersionId = (versionId) => {
  currentVersionId = versionId;
  commentsLib.listenOnComments(currentVersionId, clearComments, (commentSnapshot) => {
    const comment = commentSnapshot.val();
    comment.id = commentSnapshot.key;
    comment.date = new Date(comment.timestamp);

    showComment(comment);
  });
};

const postVersionCommentClick = (e) => {
  e.preventDefault();

  const commentText = $('#versionCommentsTextareaComment').val();

  if (commentText !== '') {
    $('#versionCommentsButtonPost').button('loading');
    $('#versionCommentsTextareaComment').val('');
    comments.postVersionComment(currentVersionId, commentText, () => {
      $('#versionCommentsButtonPost').button('reset');
    });
  }
};

const bindEvents = () => {
  $('#versionCommentsButtonPost').on('click', postVersionCommentClick);
};

exports.init = init;
exports.setVersionId = setVersionId;
exports.bindEvents = bindEvents;
