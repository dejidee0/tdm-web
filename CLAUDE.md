# TBM Web — working agreement

Next.js 16 (App Router, Turbopack) + React 19, Tailwind v4, TanStack Query v5.
JavaScript, migrating to TypeScript from the API boundary inward — see below.
The backend is a separate .NET API. This app never talks to it from the browser.

`npm run lint:arch` is the gate. It fails on architecture violations and nothing
else. Run it, plus `npm run typecheck`, before you call any task done.

---

## The one rule that explains most of the others

**The browser never learns the backend URL, and never holds a token.**

Everything below follows from that. A `NEXT_PUBLIC_*` var is inlined into the
client bundle at build time, so it is published to every visitor. A cookie
without `httpOnly` is readable by any script on the page, so one XSS is account
takeover — including admin.

## How a request actually flows

```
browser
  └─ fetch("/api/v1/<path>")          ← relative URL, no host, no token
       └─ next.config.mjs rewrite → /api/proxy/v1/<path>
            └─ lib/proxy.js
                 · reads the httpOnly cookie
                 · sets Authorization: Bearer <token>
                 · forwards to API_URL (from lib/env.js)
                 · never logs the response body
```

- `lib/env.js` is the **only** place that reads `process.env.API_URL`. It throws
  when the variable is missing, so a misconfigured deploy fails the build
  instead of silently pointing at a placeholder domain.
- `lib/proxy.js` mounts twice, and each mount names the cookie it trusts:
  `/api/proxy/v1` → `authToken`, `vendorAuthToken`; `/api/proxy/admin` →
  `adminAuthToken`. An admin route must never authenticate with a shopper's
  token.
- The client's own `Authorization` header is **not** forwarded. Auth is derived
  server-side, always.

### Adding a backend call

1. **Default:** call `/api/v1/<path>` from the client. No new files. The rewrite
   and proxy handle auth, headers, and error shape.
2. **Only if you must transform** the request or response (rename query params,
   reshape a payload) write a route handler in `app/api/`, and import `API_URL`
   from `@/lib/env`.
3. **Never** `fetch("https://<backend>/...")` from a client component.

## Auth: one query, derived everywhere

`GET /api/auth/session` is the single auth request in the app. It decodes the
httpOnly JWT server-side and answers `{ role, user }` — always `200`, because an
anonymous visitor is a valid answer, not an error.

```
hooks/use-session.js  ── useSession()          ← the only auth query
  ├─ useIsAuthenticated()   (hooks/use-auth.js)
  ├─ useAdminUser()         (hooks/use-admin-auth.js)
  ├─ useVendorUser()        (hooks/use-vendor-auth.js)
  └─ useCurrentUser()       full profile; gated on the session
```

- Need identity or role? `useSession()`. It costs nothing after first load.
- Need `phoneNumber`, `emailVerified`, addresses? `useCurrentUser()` /
  `useProfile()` — both gated so an anonymous visitor never hits the backend.
- **Do not add a second `/me` endpoint or a second auth query.** The navbar once
  fired five in parallel on the public landing page. Lint enforces this.
- Deriving "is this a guest?" from a profile fetch is a bug: the profile resolves
  a beat after the session, and that gap will submit a signed-in user's order as
  a guest. Read `isAuthenticated` from `useSession()`.

Route protection lives in root `proxy.js` (Next 16's renamed `middleware`
convention — unrelated to `lib/proxy.js`). It gates `/admin`, `/vendor`,
`/dashboard` on cookie presence and JWT `exp`. It is a **gate, not an
authorisation decision**: signatures are verified by the backend.

## Logging

Response bodies carry tokens and PII. Use `lib/log.js`:

- `redact(obj)` blanks token/password/secret/otp keys, recursively.
- `safeBody(text)` — redacted JSON, or `[non-JSON body omitted]`.
- `safeUrl(url)` — redacts sensitive query params.
- `isDev` — bodies are echoed **only** in development, redacted even there.

In production a log line is: method, URL, status. Nothing else.
`console.log(JSON.stringify(response))` is a lint error.

## Data fetching

- TanStack Query for anything server-owned. `staleTime` is 2 min by default
  (`components/common/providers/QueryProvider.js`).
- Gate queries that require auth with `enabled: isAuthenticated`. An anonymous
  visitor should not spend a request to be told 401.
- Don't fetch just to render a zero. The cart badge used to mint a guest cart
  row — and a tracking cookie — for every bot that loaded the homepage.
- One query key, one fetcher. `useCurrentUser` and `useAuthGuard` once shared
  `["auth","user"]` with *different* `queryFn`s; whichever mounted first won.

## Components

- Providers are mounted **once**, in `app/layout.js`. Nested layouts must not
  re-wrap: a second `QueryClientProvider` gives that subtree its own cache.
- Prefer a server component that fetches, wrapping a thin `"use client"` child
  that renders. `components/shared/home/trending.jsx` is the reference.
- Client components may not import `@/lib/env`.

## Request payloads — look them up, don't recall them

`docs/api/tbm-backend-api.md` is the checked-in reference for everything the
backend accepts: all 266 operations with their path and query parameters, and all
84 request schemas with typed fields. It is generated from the backend's OpenAPI
document, snapshotted beside it at `docs/api/swagger.snapshot.json`.

**Before writing, reviewing, or answering a question about any request that sends
a body or a parameter, read that file.** Find the endpoint under its tag, follow
the `Body` link to the schema, and take the field names from the table. Do not
reconstruct a payload from memory, and do not copy one from a neighbouring call
site. Sibling DTOs differ in ways that look like typos but aren't:
`CreateProductDto` carries `brandType` and `productType`; `UpdateProductDto`
carries neither, and adds `isActive`. `UpdateMeRequest` and
`UpdateProfileRequest` differ by the single field `email`.

It covers **requests only**. Response shapes are below, in `lib/api/types.ts`:
the spec declares every operation as a bare `200: OK` with no body type, which is
why those types had to be derived by calling the live API.

Three traps the tables cannot spell out for you:

- **`?` means "the spec is silent", not "safe to omit".** Exactly one of the 93
  schemas declares a `required` list, and nearly every property is
  `nullable: true`. Absence of `required` is missing information, not permission.
- **A bare `integer` may be an unnamed enum.** `CreateProductDto.brandType` and
  `.productType` are typed `integer` with no link to any value set, and the
  enums that *are* declared list values (`OrderStatus: 0–7`) without names.
  Check the backend's `TBM.Core.Enums` before sending a number.
- **The security block carries no information.** All 266 operations claim
  `Bearer`, yet `GET /api/v1/Products` and `GET /api/v1/Cart` answer `200`
  anonymously. It cannot tell you what needs auth.

When the backend changes, re-download the spec from the URL in the doc's header
and regenerate. A stale snapshot is worse than none.

## TypeScript

The migration is **incremental and inward-out**, starting at the API boundary.

- `allowJs: true`, `checkJs: false` — the existing `.js`/`.jsx` tree compiles
  untouched and is not type-checked. Files converted to `.ts` are checked
  **strictly** (`strict`, `noUncheckedIndexedAccess`).
- `lib/api/types.ts` holds the backend's response shapes. They were derived by
  calling the live API and reading what came back — **not** invented. Fields that
  were null in every observed response are typed `unknown` on purpose: guessing
  `string[]` would be a lie the compiler then enforces. Widen them when you see
  real data.
- Converted so far: `lib/api/types.ts`, `lib/api/products.ts`.
- `npm run typecheck` must pass. CI runs it.

### Backend response shapes — there are three, not one

Do not assume an endpoint is enveloped. This bit people:

| Endpoint | Shape |
|---|---|
| most of `/api/v1/*` | `ApiEnvelope<T>` = `{ success, message, data, errors }` |
| `/products`, `/materials` | `ApiEnvelope<Paged<Product>>` — `data.items` |
| `/products/featured`, `/products/{id}/related` | `ApiEnvelope<Product[]>` — a bare array, **no `.items`** |
| `/flooring` | **no envelope**: `{ products, pagination, filters }` |
| `/materials/list` | **no envelope**, and **not** `Product[]`: `{ materials: MaterialSummary[], pagination, filters }` |

The two un-enveloped endpoints also use different pagination field names
(`page`/`limit`/`total`/`hasMore`). `ListPagination`, not `Paged`.

**Pricing is a discriminated union.** `price` is `null` exactly when
`showPrice === false` (quote-only products, `priceDisplay: "Request Price"`).
The type makes `p.price` unreachable until you narrow on `p.showPrice`. Render
`priceDisplay` when in doubt — it is always a string.

## Known debt — don't add to it

- **No tests.** There is no safety net; verify changes by running the app.
- **Mock fixtures are imported by 11 production call sites** (`lib/mock/*`).
  They ship in the bundle. Lint warns; move them behind MSW rather than adding
  more.
- **~40 legacy React warnings** (`set-state-in-effect`, `refs`,
  `no-unescaped-entities`). Demoted to warnings in `eslint.guardrails.mjs` so the
  gate stays meaningful. Fix them as you touch the files, and raise the rule back
  to `error` when the last one goes.
- **48 bespoke route handlers** in `app/api/` mostly duplicate what
  `lib/proxy.js` already does. Prefer `/api/v1/*`; don't add more.

## Verifying

There is no test suite, so "it compiles" is not evidence.

```bash
npm run lint:arch     # the gate
npm run typecheck     # strict, but only over converted .ts files
npm run build         # fails loudly if API_URL / ADMIN_API_URL is unset
npx next start -p 3010 &
curl -s localhost:3010/api/auth/session          # {"role":null,"user":null}
curl -o /dev/null -w "%{http_code}" localhost:3010/admin/dashboard   # 307
```

Check the client bundle never contains the backend host:

```bash
grep -rl "$(grep '^API_URL=' .env.local | sed -E 's#.*//([^/]+).*#\1#')" .next/static | wc -l   # must be 0
```
