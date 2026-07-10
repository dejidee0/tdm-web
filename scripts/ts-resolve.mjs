/**
 * A resolve hook so plain Node can import the project's .ts schema modules.
 *
 * The app's tsconfig uses `moduleResolution: "bundler"`, under which
 * `import { x } from "./common"` is correct — Next resolves the extension.
 * Node's ESM resolver does not, so it fails on the same import.
 *
 * Rather than set `allowImportingTsExtensions` and rewrite every import to
 * carry a `.ts` suffix (which would be noise in the app, and wrong under
 * bundler resolution), this hook appends the extension at resolve time. Node
 * strips the types natively from there.
 *
 * Synchronous, for registerHooks(). Used only by scripts/; never by the app.
 */
export function resolveTs(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    try {
      return nextResolve(`${specifier}.ts`, context);
    } catch {
      // Fall through: may be a .js module or a directory index.
    }
  }
  return nextResolve(specifier, context);
}
