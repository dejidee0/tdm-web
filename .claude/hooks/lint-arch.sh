#!/usr/bin/env bash
# PostToolUse hook: run the architecture guardrails on the file just written.
#
# Guardrails are the only error-level ESLint rules in this repo (see
# eslint.guardrails.mjs), so `eslint --quiet` reports exactly them. Violations
# are fed back as context rather than blocking the tool call — the point is to
# surface a mistake at the moment it is made, not to halt the loop.
#
# Reads the PostToolUse payload on stdin. Always exits 0.
set -uo pipefail

file=$(jq -r '.tool_input.file_path // .tool_response.filePath // empty')
[ -n "$file" ] || exit 0

case "$file" in
  *.js | *.jsx | *.ts | *.tsx) ;;
  *) exit 0 ;;
esac

[ -f "$file" ] || exit 0

# Guardrail failures exit non-zero; everything else (warnings) is silent.
if out=$(npx eslint --quiet "$file" 2>/dev/null); then
  exit 0
fi

context=$(printf 'Architecture guardrail violation in %s — fix before continuing.\nSee eslint.guardrails.mjs and CLAUDE.md.\n\n%s' "$file" "$out" | jq -Rs .)
printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":%s}}\n' "$context"
exit 0
