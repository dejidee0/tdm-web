/**
 * Installs the resolve hook from ./ts-resolve.mjs so plain Node can import the
 * project's .ts schema modules. See that file for why.
 *
 * Uses registerHooks() (synchronous, in-thread) rather than register(), which
 * is deprecated in current Node and prints a DeprecationWarning on every run.
 */
import { registerHooks } from "node:module";
import { resolveTs } from "./ts-resolve.mjs";

registerHooks({ resolve: resolveTs });
