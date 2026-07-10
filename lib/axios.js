import axios from "axios";
import { logApiError, getFriendlyMessage } from "@/lib/errors";

// Point at the local Next.js proxy routes so the real backend URL
// is never exposed to the browser (it lives in server-side env vars only).
const API_URL = "/api/proxy/v1";
const ADMIN_API_URL = "/api/proxy/admin";

// No request interceptor, and no token in the browser.
// `withCredentials` sends the httpOnly cookie; lib/proxy.js turns it into the
// Authorization header server-side. Do not reintroduce a readable token cookie
// here — it would put a live JWT within reach of any XSS on the page.

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
attachResponseInterceptor(apiClient);

// Admin client — admin routes (/api)
const adminApiClient = axios.create({
  baseURL: ADMIN_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
attachResponseInterceptor(adminApiClient);

export { adminApiClient };
export default apiClient;
