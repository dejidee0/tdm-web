// lib/api/profile.js

async function apiFetch(path, options = {}) {
  const res = await fetch(path, options);
  if (res.status === 401)
    throw Object.assign(new Error("UNAUTHORIZED"), { status: 401 });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `API error ${res.status}`;
    try {
      message = JSON.parse(text)?.message || message;
    } catch {}
    throw Object.assign(new Error(message), { status: res.status });
  }
  const text = await res.text();
  return text ? JSON.parse(text) : { success: true };
}

/**
 * /account/me response shape:
 * { success, data: { profile, addresses, notifications, security, roles, access } }
 */
async function getMe() {
  const res = await apiFetch("/api/account/me");
  return res.data ?? res;
}

export const profileApi = {
  // ── Profile ──────────────────────────────────────────────────────────────
  // Returns the full data object: { profile, addresses, notifications, security, roles, access }
  getMe,

  updateMe: (data) =>
    apiFetch("/api/account/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  // ── Addresses ─────────────────────────────────────────────────────────────
  // Reuse the /me response — addresses live inside data.addresses
  getAddresses: async () => {
    const data = await getMe();
    return data.addresses ?? [];
  },

  createAddress: (data) =>
    apiFetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  updateAddress: (addressId, data) =>
    apiFetch(`/api/account/addresses/${addressId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deleteAddress: (addressId) =>
    apiFetch(`/api/account/addresses/${addressId}`, { method: "DELETE" }),

  // ── Password (OTP flow) ───────────────────────────────────────────────────
  requestPasswordOtp: (currentPassword) =>
    apiFetch("/api/account/password/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword }),
    }),

  verifyPasswordOtp: (otpCode) =>
    apiFetch("/api/account/password/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otpCode: String(otpCode) }),
    }),

  changePassword: (data) =>
    apiFetch("/api/account/password/otp/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  // ── Notifications ─────────────────────────────────────────────────────────
  // Reuse /me response — notifications live inside data.notifications
  getNotifications: async () => {
    const data = await getMe();
    return data.notifications ?? {};
  },

  updateNotifications: (prefs) =>
    apiFetch("/api/account/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    }),

  // ── Security ──────────────────────────────────────────────────────────────
  // Reuse /me response — security lives inside data.security
  getSecurity: async () => {
    const data = await getMe();
    return data.security ?? {};
  },

  update2fa: (enabled) =>
    apiFetch("/api/account/security/2fa", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    }),

  // ── Deactivate ────────────────────────────────────────────────────────────
  deactivateAccount: () =>
    apiFetch("/api/account/deactivate", { method: "POST" }),
};
