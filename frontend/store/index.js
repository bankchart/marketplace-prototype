export const state = () => ({
  jwt: null,
  showCreateGroupModal: false,
  showCreatePostModal: false,
  userId: null
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
  }
};
