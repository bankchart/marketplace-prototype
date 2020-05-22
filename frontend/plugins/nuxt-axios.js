import axios from "axios";

export default (ctx, inject) => {
  const backendCaller = axios.create({
    baseURL: ctx.$axios.defaults.baseURL,
    validateStatus: status => status <= 500
  });
  inject("backend", backendCaller);
};
