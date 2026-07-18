/**
 * A resolve hook so plain Node can import the project's .ts/.js modules the way
 * the app does — with `@/` path aliases and extensionless relative imports.
 *
 * The app's tsconfig uses `moduleResolution: "bundler"`, under which both
 * `@/lib/x` and `import { y } from "./z"` are correct — Next resolves the alias
 * and the extension. Node's ESM resolver does neither, so it fails on the same
 * imports. This hook maps `@/` to the project root and appends `.ts`/`.js` when
 * a relative specifier has no extension. Node strips types natively from there.
 *
 * Synchronous, for registerHooks(). Used only by scripts/; never by the app.
 */
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export function resolveTs(specifier, context, nextResolve) {
  // `@/lib/x` → <root>/lib/x, trying real extensions.
  if (specifier.startsWith("@/")) {
    const base = join(ROOT, specifier.slice(2));
    for (const ext of ["", ".ts", ".js", ".mjs", "/index.ts", "/index.js"]) {
      if (existsSync(base + ext)) {
        return nextResolve(pathToFileURL(base + ext).href, context);
      }
    }
  }
  // Extensionless relative import → try `.ts` then fall through to `.js`, etc.
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    try {
      return nextResolve(`${specifier}.ts`, context);
    } catch {
      // Fall through: may be a .js module or a directory index.
    }
  }
  return nextResolve(specifier, context);
}
