import axios from "axios";

export default (ctx, inject) => {
  const backendCaller = axios.create({
    baseURL: ctx.$axios.defaults.baseURL
  });
  inject("backend", backendCaller);
};
