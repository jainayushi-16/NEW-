import api from "../services/api.js";

export const login = (data) => {
  return api.post("/auth/login", data);
};

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
};

export const resetPassword = (token, data) => {
  return api.post(`/auth/reset-password/${token}`, data);
};

export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    // Backend expects body tokenValue for logout.
    // If your backend is different, adjust payload here.
    if (refreshToken) {
      await api.post("/auth/logout", { tokenValue: refreshToken });
    } else {
      await api.post("/auth/logout");
    }
  } catch {
    // Ignore network errors and always clear local session.
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
  }
};
