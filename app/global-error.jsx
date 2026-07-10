"use client";

import { useEffect } from "react";

/**
 * Last resort: the root layout itself threw, so nothing above this exists —
 * not Providers, not the font variables, not even <body>. This file must supply
 * its own <html> and <body>, and must not import anything that depends on
 * context (no ErrorState: it renders inside the app shell's font/theme tokens).
 *
 * Keep it dependency-free and inline-styled. If this screen is broken, there is
 * nothing left to catch it.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[error-boundary] global:", error?.digest ?? error?.name);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <div
            style={{
              height: 1,
              width: 96,
              margin: "0 auto 2rem",
              background:
                "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: "0 0 .75rem" }}>
            Something went wrong
          </h1>
          <p
            style={{
              fontSize: ".95rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,.5)",
              margin: "0 0 2rem",
            }}
          >
            The page failed to load. Reloading usually fixes it.
          </p>
          <button
            onClick={reset}
            style={{
              padding: ".75rem 1.5rem",
              borderRadius: 8,
              border: "none",
              background: "#D4AF37",
              color: "#000",
              fontSize: ".875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          {error?.digest && (
            <p
              style={{
                marginTop: "2.5rem",
                fontSize: ".7rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.2)",
              }}
            >
              Reference {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
