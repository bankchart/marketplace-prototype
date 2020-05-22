export const state = () => ({
  jwt: null,
  showCreateGroupModal: false,
  showCreatePostModal: false,
  showEditPostModal: false,
  showEditCommentModal: false,
  showConfirmDeletePostModal: false,
  showConfirmDeleteCommentModal: false,
  userId: null,
  forceLoadPost: false,
  propsModal: {
    confirmDeletePost: {
      postId: null,
      postName: null,
      groupId: null
    },
    confirmDeleteComment: {
      commentId: null,
      commentContent: null
    },
    editPost: {
      postId: null,
      postName: null,
      postDetail: null,
      groupId: null
    },
    editComment: {
      commentId: null,
      commentContent: null
    }
  }
});

export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn;
  },

  loggedInUser(state) {
    return state.auth.user;
  },

  userId(state) {
    return state.userId;
  },

  jwtToken(state) {
    return state.jwt;
  },

  isShowCreateGroupModal(state) {
    return state.showCreateGroupModal;
  },

  isShowCreatePostModal(state) {
    return state.showCreatePostModal;
  },

  isShowConfirmDeletePostModal(state) {
    return state.showConfirmDeletePostModal;
  },

  isShowEditPostModal(state) {
    return state.showEditPostModal;
  },

  isShowEditCommentModal(state) {
    return state.showEditCommentModal;
  },

  isShowConfirmDeleteCommentModal(state) {
    return state.showConfirmDeleteCommentModal;
  },

  propsConfirmDeletePostModal(state) {
    return state.propsModal.confirmDeletePost;
  },

  propsConfirmDeleteCommentModal(state) {
    return state.propsModal.confirmDeleteComment;
  },

  propsEditPostModal(state) {
    return state.propsModal.editPost;
  },

  propsEditCommentModal(state) {
    return state.propsModal.editComment;
  }
};

export const mutations = {
  setUserId(state, userId) {
    state.userId = userId;
  },

  addJwt(state, jwt) {
    state.jwt = jwt;
  },

  setShowCreateGroupModal(state, show) {
    state.showCreateGroupModal = show;
  },

  setShowCreatePostModal(state, show) {
    state.showCreatePostModal = show;
  },

  setShowEditPostModal(state, show) {
    state.showEditPostModal = show;
  },

  setShowEditCommentModal(state, show) {
    state.showEditCommentModal = show;
  },

  setShowConfirmDeletePostModal(state, show) {
    state.showConfirmDeletePostModal = show;
  },

  setShowConfirmDeleteCommentModal(state, show) {
    state.showConfirmDeleteCommentModal = show;
  },

  setForceLoadPost(state, status) {
    state.forceLoadPost = status;
  },

  resetPropsConfirmDeletePost(state) {
    state.propsModal.confirmDeletePost = {
      postId: null,
      postName: null,
      groupId: null
    };
  },

  resetPropsConfirmDeleteComment(state) {
    state.propsModal.confirmDeleteComment = {
      commentId: null,
      commentContent: null
    };
  },

  resetPropsEditPost(state) {
    state.propsModal.editPost = {
      postId: null,
      postName: null,
      postDetail: null,
      groupId: null
    };
  },

  resetPropsEditComment(state) {
    state.propsModal.editComment = {
      commentId: null,
      commentContent: null
    };
  },

  setPropsConfirmDeletePost(state, { postId, postName, groupId }) {
    state.propsModal.confirmDeletePost = {
      postId,
      postName,
      groupId
    };
  },

  setPropsConfirmDeleteComment(state, { commentId, commentContent }) {
    state.propsModal.confirmDeleteComment = {
      commentId,
      commentContent
    };
  },

  setPropsEditPost(state, { postId, postName, postDetail, groupId }) {
    state.propsModal.editPost = {
      postId,
      postName,
      postDetail,
      groupId
    };
  },

  setPropsEditComment(state, { commentId, commentContent }) {
    state.propsModal.editComment = {
      commentId,
      commentContent
    };
  }
};
