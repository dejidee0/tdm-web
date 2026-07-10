import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import { guardrailConfig } from "./eslint.guardrails.mjs";

// `npm run lint`      — everything, including ~40 warnings of legacy React debt.
// `npm run lint:arch` — errors only. The guardrails are the only error-level
//                       rules, so this is the gate CI blocks on.
//                       See eslint.guardrails.mjs.
const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  ...guardrailConfig,
]);

export default eslintConfig;
