import api from "./axios.js";

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

export const resetPassword = (token, data) => {
  return api.post(`/auth/reset-password/${token}`, data);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};