import axios from "axios";

export const API_BASE_URL = "http://localhost:8081";
export const POST_LOGIN_REDIRECT_KEY = "post_login_redirect";

const api = axios.create({
  baseURL: API_BASE_URL,
});

function normalizeUser(user) {
  if (!user) {
    return user;
  }

  const normalizedId = user._id || user.id || null;
  return {
    ...user,
    _id: normalizedId,
    id: normalizedId,
  };
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function storeAuth({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(normalizeUser(user)));
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
}

export function getStoredUser() {
  const value = localStorage.getItem("user");
  return value ? normalizeUser(JSON.parse(value)) : null;
}

export function syncStoredUser(user) {
  localStorage.setItem("user", JSON.stringify(normalizeUser(user)));
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export default api;
