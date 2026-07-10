---
description: Audit the working diff against the architecture invariants ESLint cannot express — duplicate auth queries, provider nesting, client/server boundary, ungated queries.
argument-hint: [path or git ref to scope the audit, e.g. main...]
allowed-tools: Bash(npm run lint:arch), Bash(git diff:*), Bash(git status:*)
---

First run the mechanical gate, so the agent doesn't waste effort on what a linter
already covers:

- Guardrails: !`npm run lint:arch 2>&1 | tail -5`
- Scope: !`git diff --stat HEAD 2>/dev/null | tail -20`

Now dispatch the `frontend-architect` subagent to review **$ARGUMENTS** (default:
the current working diff) against the design invariants in `CLAUDE.md`.

Give it the lint result above so it does not re-report mechanical violations.
Ask it specifically for:

1. Any second auth query, or auth state derived from a profile fetch rather than
   `useSession()`.
2. `useQuery` calls that hit authenticated endpoints without
   `enabled: isAuthenticated`.
3. Any `queryKey` shared by two different `queryFn`s.
4. Providers mounted in a nested layout when the root layout already mounts them.
5. `"use client"` files importing `@/lib/env` or naming the backend host.
6. New route handlers under `app/api/` that only forward without transforming.

Relay its findings to me directly — file, line, the invariant broken, the
concrete failure, and the smallest fix. If it found nothing, say what it checked.

This is a design review. For correctness bugs use `/code-review`; for
vulnerabilities use `/security-review`.
