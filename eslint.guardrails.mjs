/**
 * Architecture guardrails — the hard gate.
 *
 * Every rule here encodes a bug that actually reached this codebase. They are
 * the only ERROR-level rules in the project, so `npm run lint:arch`
 * (`eslint . --quiet`) fails on exactly these and nothing else. That is what CI
 * blocks on. To break one, use an inline eslint-disable with a reason — that
 * turns a silent violation into a reviewable decision.
 *
 * The design invariants these cannot express live in CLAUDE.md.
 */
export const guardrails = [
  {
    // NEXT_PUBLIC_* is substituted into the client bundle at build time, so a
    // backend URL or key here is published to every visitor.
    selector:
      'MemberExpression[object.object.name="process"][object.property.name="env"][property.name=/^NEXT_PUBLIC_/]:not([property.name="NEXT_PUBLIC_SITE_LIVE"])',
    message:
      "NEXT_PUBLIC_* is inlined into the client bundle. Server code: import API_URL from @/lib/env. Client code: call the local /api/v1 proxy.",
  },
  {
    // The backend URL has one source of truth, and it throws when unset.
    selector:
      'MemberExpression[object.object.name="process"][object.property.name="env"][property.name=/^(API_URL|ADMIN_API_URL)$/]',
    message:
      "Read the backend URL from @/lib/env, not process.env — lib/env.js fails the build when it is missing.",
  },
  {
    // A token readable by document.cookie is one XSS away from account
    // takeover. lib/proxy.js turns the httpOnly cookie into a Bearer header.
    selector: 'Property[key.name="httpOnly"][value.value=false]',
    message:
      "Auth cookies must stay httpOnly. The proxy attaches Authorization server-side; the browser never needs the token.",
  },
  {
    selector: 'MemberExpression[object.name="document"][property.name="cookie"]',
    message:
      "document.cookie must never touch an auth token. If you are reading a non-sensitive flag, disable this rule inline and say why.",
  },
  {
    // `|| "https://api.yourbackend.com"` meant a missing env var silently sent
    // Authorization headers to a domain nobody here owns.
    selector: "Literal[value=/yourbackend\\.com|jtempurl\\.com/]",
    message:
      "Placeholder host fallback. lib/env.js throws on a missing variable instead — do not reintroduce a default.",
  },
  {
    // Response bodies carry tokens and PII. lib/log.js redacts, and stays
    // silent in production.
    selector:
      'CallExpression[callee.object.name="console"] CallExpression[callee.object.name="JSON"][callee.property.name="stringify"]',
    message:
      "Never log a serialised response body — it carries tokens and PII. Use safeBody()/redact() from @/lib/log.",
  },
];

// One auth query in the whole app; everything else derives from useSession().
// Reintroducing a second /me probe is how the navbar ended up firing five —
// hand-rolled `useEffect(() => fetch("/api/account/me"))` was one of them.
// This bans *naming* any auth endpoint outside the few modules that own them.
const singleSessionQuery = {
  selector:
    'Literal[value=/^\\/api\\/(auth\\/|account\\/me|proxy\\/v1\\/auth\\/)/]',
  message:
    "Do not fetch an auth endpoint directly. Identity and role come from useSession() (@/hooks/use-session); profile fields from useProfile()/useCurrentUser(). Adding a second auth query is how the navbar ended up firing five on the landing page.",
};

// Covers .ts/.tsx as well as .js/.jsx: the TypeScript migration must not open a
// hole in the guardrails by moving a file to a new extension.
const SOURCE = [
  "app/**/*.{js,jsx,ts,tsx}",
  "lib/**/*.{js,ts}",
  "hooks/**/*.{js,ts}",
  "components/**/*.{js,jsx,ts,tsx}",
  "proxy.js",
];

// Providers mount exactly once, in the root layout. A nested layout that
// re-wraps gives its subtree a second QueryClientProvider — its own cache — and
// renders LoadingScreen and TBMToaster twice. Three nested layouts had done it:
// (user), dashboard, and (auth). Expressed as a selector rather than
// no-restricted-imports so it does not collide with the lib/mock rule below;
// two config blocks defining the same rule name silently override each other.
const providersMountedOnce = {
  selector: 'ImportDeclaration[source.value="@/components/common/providers"]',
  message:
    "Providers mount once, in app/layout.js. Nesting a second QueryClientProvider gives this subtree its own cache — a user signing in would land on a dashboard that cannot see the session just written.",
};

// The modules that own an auth endpoint — they are allowed to name one.
// Everything else derives from useSession(). Keep this list short.
const SESSION_OWNERS = [
  "hooks/use-session.js", // the single session query
  "hooks/use-auth.js", // useCurrentUser(), gated on the session
  "lib/api/profile.js", // /account/me — full profile
  "lib/api/user-dashboard.js", // /account/me — dashboard profile
  "app/api/auth/session/route.js",
];

// The one file allowed to mount Providers.
const ROOT_LAYOUT = "app/layout.js";

// Each file must match exactly one of the three blocks below: ESLint's flat
// config lets a later block silently replace an earlier one's rule of the same
// name, so these scopes are partitioned, not layered.
export const guardrailConfig = [
  {
    // Everything else.
    files: SOURCE,
    ignores: [...SESSION_OWNERS, ROOT_LAYOUT],
    rules: {
      "no-restricted-syntax": [
        "error",
        ...guardrails,
        singleSessionQuery,
        providersMountedOnce,
      ],
    },
  },
  {
    // May name an auth endpoint; may not mount Providers.
    files: SESSION_OWNERS,
    rules: {
      "no-restricted-syntax": ["error", ...guardrails, providersMountedOnce],
    },
  },
  {
    // May mount Providers; may not name an auth endpoint.
    files: [ROOT_LAYOUT],
    rules: {
      "no-restricted-syntax": ["error", ...guardrails, singleSessionQuery],
    },
  },
  {
    // lib/env.js is the one place allowed to read the raw env vars.
    files: ["lib/env.js", "lib/env.ts"],
    rules: { "no-restricted-syntax": "off" },
  },
  {
    // Route handlers run on the server: a stray console.log prints straight
    // into the production log stream.
    files: ["app/api/**/*.{js,ts}"],
    rules: { "no-console": ["error", { allow: ["error", "warn"] }] },
  },
  {
    // Fixtures must not be reachable from product code. Eleven call sites still
    // import them, so this is a warning until they move behind MSW — at which
    // point it becomes an error.
    files: [
      "app/**/*.{js,jsx,ts,tsx}",
      "hooks/**/*.{js,ts}",
      "components/**/*.{js,jsx,ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["@/lib/mock/*", "**/lib/mock/*"],
              message:
                "Mock fixtures must not ship in the client bundle. Serve them from MSW in tests instead.",
            },
          ],
        },
      ],
    },
  },

  {
    // ── Legacy debt ───────────────────────────────────────────────────────
    // These are real React bugs (cascading renders, refs read during render),
    // but ~40 of them predate this config. Demoted to warnings so that
    // `eslint --quiet` gates cleanly on the guardrails above rather than
    // drowning in pre-existing noise. Raise each back to "error" as its
    // last violation is fixed — do not delete the block.
    files: ["app/**/*.{js,jsx}", "components/**/*.{js,jsx}", "hooks/**/*.js"],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/static-components": "warn",
      "react-hooks/purity": "warn",
      "react/no-unescaped-entities": "warn",
    },
  },
];
