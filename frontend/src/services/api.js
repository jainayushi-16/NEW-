import axios from "axios";

const api = axios.create({
  // Keep backend mount prefix consistent with backend app.js: /api/${API_VERSION}
  // Use relative URL so Vite proxy can forward to backend.
  baseURL: "/api/v1",
});

// Always send JSON & auth; also log request URL for debugging connectivity issues.
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers.Accept = config.headers.Accept || "application/json";

  const token = localStorage.getItem("token");

  // Ensure we always attach the auth header expected by backend middleware.
  // Backend expects: Authorization: Bearer <accessToken>
  if (token && typeof token === "string" && token.trim().length > 0) {
    config.headers.Authorization = `Bearer ${token.trim()}`;
  } else {
    delete config.headers.Authorization;
  }

  // Additional context headers (some backend code expects org/branch context)
  const organizationId = localStorage.getItem("organizationId");
  const organizationName = localStorage.getItem("organizationName");
  const branchId = localStorage.getItem("branchId");

  if (organizationId) config.headers["X-Organization-Id"] = organizationId;
  else delete config.headers["X-Organization-Id"];

  if (organizationName) config.headers["X-Organization-Name"] = organizationName;
  else delete config.headers["X-Organization-Name"];

  if (branchId) config.headers["X-Branch-Id"] = branchId;
  else delete config.headers["X-Branch-Id"];

  // Debug: shows the exact URL being called.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.log(
      "[API]",
      config.method?.toUpperCase(),
      `${config.baseURL || ""}${config.url || ""}`
    );

    // If the app is calling misspelled endpoints (organisation vs organization),
    // highlight it immediately in console.
    if (`${config.url || ""}`.includes("/organisation/")) {
      // eslint-disable-next-line no-console
      console.warn("[API] Detected misspelled path: /organisation/ . Use /organization/ instead.");
    }
  }

  // Extra safety: don't send an obviously invalid token.
  // (Helps prevent backend "Invalid access token" cascades when localStorage is stale.)
  if (config.headers.Authorization) {
    const token = config.headers.Authorization.replace('Bearer ', '').trim();
    // JWTs are normally 2 dots => 3 parts.
    const dotCount = (token.match(/\./g) || []).length;
    if (!token || dotCount < 2) {
      delete config.headers.Authorization;
      if (typeof window !== 'undefined') {
        console.warn('[API] Not sending invalid JWT token from localStorage');
      }
    }
  }

  // If backend rejects token, clear it so user re-logins instead of looping 401s.
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;

