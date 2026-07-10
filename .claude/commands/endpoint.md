---
description: Wire up a backend endpoint the way this project does it — proxy by default, route handler only when the request or response must be transformed.
argument-hint: <METHOD> <backend path> [what it's for]
---

Wire up: **$ARGUMENTS**

This repo has two ways to reach the backend, and picking the wrong one is how it
accumulated 48 near-duplicate route handlers. Decide before you write anything.

## Decide

**Default — no new files.** Call `/api/v1/<path>` from the client. The
`next.config.mjs` rewrite sends it to `lib/proxy.js`, which reads the httpOnly
cookie, sets `Authorization`, forwards to `API_URL`, and never logs the body.
Auth, headers, and error shape are already handled.

**Route handler — only if** you must genuinely transform the request or response:
rename query params the backend spells differently, reshape a payload, merge two
upstream calls. "I need auth" is not a reason. "I need a different base URL" is
not a reason.

State which one you picked and why, in one sentence, before writing code.

## If you write a route handler

- `import { API_URL } from "@/lib/env"` — never `process.env`, never a fallback
  string. A missing variable must fail the build.
- Read the token from the httpOnly cookie server-side (`cookies()`); never trust
  a client-supplied `Authorization` header.
- Do not `console.log` the response. Route handlers print straight into the
  production log stream, and bodies carry tokens and PII. Use `@/lib/log` if you
  must log at all.

## If you call it from the client

- Relative URL only: `fetch("/api/v1/...")`. A client component that names the
  backend host puts it in the bundle for every visitor.
- Wrap it in a TanStack Query hook, not a bare `useEffect`.
- If the endpoint requires a session, gate it: `enabled: isAuthenticated` from
  `useSession()`. An anonymous visitor must not spend a request to be told 401.
- Do not add a second auth query. Role and identity come from `useSession()`.

## Before you call it done

```bash
npm run lint:arch     # guardrails; must exit 0
npm run build
```

Then exercise it for real — start the app and hit the endpoint, signed out and
signed in. There is no test suite, so "it compiles" is not evidence. Report the
status codes you actually observed.

Read `CLAUDE.md` if any of the above is unclear.
