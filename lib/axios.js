import axios from "axios";

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

// Shared response interceptor — handles 401 redirects
function attachResponseInterceptor(instance) {
  instance.interceptors.response.use(
    (response) => {
      console.log("✅ Response:", response.config.url, response.status);
      return response;
    },
    (error) => {
      console.log("❌ Error Response:", {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });

      if (error.response?.status === 401 && typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/admin")) {
          window.location.href = "/admin/login";
        } else if (currentPath.startsWith("/vendor")) {
          window.location.href = "/vendor/login";
        } else {
          window.location.href = "/sign-in";
        }
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
