import { makeProxyHandlers } from "@/lib/proxy";

// Proxies /api/proxy/v1/** → backend /api/v1/**
// Uses private env var — backend URL is never sent to the browser.
const { GET, POST, PUT, PATCH, DELETE } = makeProxyHandlers(process.env.API_URL);

export { GET, POST, PUT, PATCH, DELETE };
