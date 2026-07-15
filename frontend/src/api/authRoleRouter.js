import api from "../services/api.js";

/**
 * Role-aware auth client helpers.
 *
 * Backend permissions appear to be enforced server-side by JWT + middleware.
 * This module does NOT try to bypass authorization; it only provides a clean
 * place to use role metadata when calling auth-related endpoints.
 */

export function loginWithRole(data, role) {
  // The backend /auth/login should validate credentials; role is informational.
  return api.post("/auth/login", { ...data, role });
}

export function forgotPasswordWithRole(data, role) {
  return api.post("/auth/forgot-password", { ...data, role });
}

export function resetPasswordWithRole(token, data, role) {
  return api.post(`/auth/reset-password/${token}`, { ...data, role });
}

export function logoutClient() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

