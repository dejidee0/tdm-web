import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_API_URL = process.env.NEXT_PUBLIC_API_URL_WV1;

// Shared response interceptor — handles 401 redirects only
// No Bearer header construction: JWTs travel via httpOnly cookies + withCredentials
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
