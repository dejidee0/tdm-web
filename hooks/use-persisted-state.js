// hooks/use-persisted-state.js
"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useState that mirrors its value to web storage so it survives refreshes
 * and navigation. Defaults to sessionStorage (per-tab, cleared when the tab
 * closes) which suits transient, sensitive flows like checkout.
 *
 * Hydration is done in an effect (not the initializer) so the first client
 * render matches the server render and there is no hydration mismatch.
 *
 * @param {string} key
 * @param {*} initialValue
 * @param {{ storage?: "session" | "local" }} [opts]
 * @returns {[value, setValue, hydrated]}
 */
export function usePersistedState(key, initialValue, { storage = "session" } = {}) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);
  // Avoid writing back the initial value before hydration has run.
  const didHydrate = useRef(false);

  const getStore = () => {
    if (typeof window === "undefined") return null;
    return storage === "local" ? window.localStorage : window.sessionStorage;
  };

  // Hydrate once on mount (client only).
  useEffect(() => {
    try {
      const raw = getStore()?.getItem(key);
      if (raw != null) setValue(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    }
    didHydrate.current = true;
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Persist on change, after hydration.
  useEffect(() => {
    if (!didHydrate.current) return;
    try {
      const store = getStore();
      if (!store) return;
      if (value == null || value === "") store.removeItem(key);
      else store.setItem(key, JSON.stringify(value));
    } catch {
      // ignore quota/availability errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue, hydrated];
}

/** Remove keys from sessionStorage (and optionally localStorage). */
export function clearPersistedState(keys, { storage = "session" } = {}) {
  if (typeof window === "undefined") return;
  const store = storage === "local" ? window.localStorage : window.sessionStorage;
  for (const k of [].concat(keys)) {
    try {
      store.removeItem(k);
    } catch {
      // ignore
    }
  }
}

// Shared key namespace so page + form components stay in sync.
export const CHECKOUT_KEYS = {
  step: "tbm_checkout_step",
  delivery: "tbm_checkout_delivery",
  payment: "tbm_checkout_payment",
  promoCode: "tbm_checkout_promo_code",
  promoDiscount: "tbm_checkout_promo_discount",
  form: "tbm_checkout_form", // live (uncommitted) delivery form fields
};
