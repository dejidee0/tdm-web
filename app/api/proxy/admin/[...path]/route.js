import { makeProxyHandlers } from "@/lib/proxy";
import { ADMIN_API_URL } from "@/lib/env";

// Proxies /api/proxy/admin/** → backend /api/**
// Uses private env var — backend URL is never sent to the browser.
//
// Only the admin cookie authenticates here. A signed-in shopper hitting this
// mount stays anonymous to the backend rather than being silently upgraded.
const { GET, POST, PUT, PATCH, DELETE } = makeProxyHandlers(ADMIN_API_URL, {
  tokenCookies: ["adminAuthToken"],
});

export { GET, POST, PUT, PATCH, DELETE };
