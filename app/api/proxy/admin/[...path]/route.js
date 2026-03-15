import { makeProxyHandlers } from "@/lib/proxy";

// Proxies /api/proxy/admin/** → backend /api/**
// Uses private env var — backend URL is never sent to the browser.
const { GET, POST, PUT, PATCH, DELETE } = makeProxyHandlers(process.env.ADMIN_API_URL);

export { GET, POST, PUT, PATCH, DELETE };
