import { makeProxyHandlers } from "@/lib/proxy";
import { API_URL } from "@/lib/env";

// Proxies /api/proxy/v1/** → backend /api/v1/**
// Uses private env var — backend URL is never sent to the browser.
//
// A vendor who signs in through /sign-in gets both cookies; one who signs in
// through /vendor/login gets only vendorAuthToken. Accept either here.
const { GET, POST, PUT, PATCH, DELETE } = makeProxyHandlers(API_URL, {
  tokenCookies: ["authToken", "vendorAuthToken"],
});

export { GET, POST, PUT, PATCH, DELETE };
