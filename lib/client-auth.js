/**
 * Simple client-side token storage using localStorage
 */

export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    // Check current path to determine which token to retrieve
    const currentPath = window.location.pathname;

    if (currentPath.startsWith("/admin")) {
      return localStorage.getItem("adminToken");
    } else if (currentPath.startsWith("/vendor")) {
      return localStorage.getItem("vendorToken");
    }

    return localStorage.getItem("authToken");
  }
  return null;
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
}
