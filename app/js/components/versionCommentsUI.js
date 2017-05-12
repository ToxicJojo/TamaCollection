const commentsLib = require('../comments');
const userLib = require('../user');
const util = require('../util');

const commentCardTemplate = require('../templates/commentCard');

let commentDiv;

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
  commentsLib.listenOnComments(versionId, clearComments, (commentSnapshot) => {
    const comment = commentSnapshot.val();
    comment.id = commentSnapshot.key;
    comment.date = new Date(comment.timestamp);

    showComment(comment);
  });
};


exports.init = init;
exports.setVersionId = setVersionId;
