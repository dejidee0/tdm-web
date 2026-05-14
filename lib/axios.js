import axios from "axios";
import { logApiError, getFriendlyMessage } from "@/lib/errors";

// Point at the local Next.js proxy routes so the real backend URL
// is never exposed to the browser (it lives in server-side env vars only).
const API_URL = "/api/proxy/v1";
const ADMIN_API_URL = "/api/proxy/admin";

// Reads the appropriate non-httpOnly Bearer token cookie based on current path
function getBearerToken() {
  if (typeof document === "undefined") return null;
  const path = window.location.pathname;
  const name = path.startsWith("/admin")
    ? "adminBearerToken"
    : path.startsWith("/vendor")
      ? "vendorBearerToken"
      : "authBearerToken";
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function attachRequestInterceptor(instance) {
  instance.interceptors.request.use((config) => {
    const token = getBearerToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

// Shared response interceptor — handles 401 redirects and normalizes error messages
function attachResponseInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const data = error.response?.data;
      const url = error.config?.url || "unknown";

      if (status === 401 && typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else if (currentPath.startsWith("/vendor")) {
          window.location.href = "/vendor/login";
        } else {
          window.location.href = "/sign-in";
        }
      }

      if (status) {
        const backendMessage = data?.message || data?.title || error.message;
        logApiError(url, status, data);
        error.backendMessage = backendMessage;
        error.message = getFriendlyMessage(status, backendMessage);
      } else if (!error.response) {
        // Network-level failure (no response received)
        logApiError(url, 0, error.message);
        error.message = "Unable to connect. Please check your internet connection.";
      }

      return Promise.reject(error);
    },
  );
}

// Default client — user/vendor routes (/api/v1)
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
attachRequestInterceptor(apiClient);
attachResponseInterceptor(apiClient);

// Admin client — admin routes (/api)
const adminApiClient = axios.create({
  baseURL: ADMIN_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
attachRequestInterceptor(adminApiClient);
attachResponseInterceptor(adminApiClient);

export { adminApiClient };
export default apiClient;
