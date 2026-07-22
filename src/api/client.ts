import axios from "axios";
import { getToken } from "../auth/token";
import { AUTH_LOGOUT_EVENT } from "../auth/event";

export const api = axios.create({
  timeout: 10000,
});

const emitLogOut = () => {
  window.dispatchEvent(
    new CustomEvent(AUTH_LOGOUT_EVENT)
  )
}

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      emitLogOut()
    }
    return Promise.reject(error);
  }
);