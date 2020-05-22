export default function({ store, route, redirect }) {
  const jwt = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId");
  if (jwt && userId) {
    store.commit("setUserId", userId);
    store.commit("addJwt", jwt);
  }
}
