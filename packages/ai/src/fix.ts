import fs from "node:fs";
import path from "node:path";
import { assertSafePath, createAuditLogger } from "@azmr/security";
import { runInSandbox } from "./sandbox.js";

const audit = createAuditLogger("ai:fix");

export interface FixResult {
  applied: boolean;
  reason: string;
  original?: string;
}

/**
 * Model-agnostic adapter interface.
 * Implement this to plug in any backend — Ollama, a local Llama model,
 * or a user-supplied cloud API. The platform does not provide a default.
 */
export interface ModelAdapter {
  suggest(context: AzmaraContext): Promise<string>;
}

/**
 * Structured context extracted from an Azmara source file.
 * Passed to ModelAdapter.suggest() — gives the model everything it needs
 * to understand the file without raw string prompting.
 */
export interface AzmaraContext {
  filePath: string;
  source: string;
  /** Detected Azmara primitives in the file (signals, queries, tables, effects) */
  primitives: string[];
}

/**
 * AI Auto-Fix pipeline.
 *
 * Security model:
 * 1. File path is validated against allowed base directory (no traversal)
 * 2. Suggestion is sandboxed before applying (isolated-vm)
 * 3. Sandbox failure reverts the change automatically
 * 4. Every fix attempt is written to the audit log
 * 5. Manual approval gate — auto-apply is off by default
 *
 * @param adapter - Your ModelAdapter implementation. The platform does not
 *                  supply one — bring your own (Ollama, etc).
 */
export async function autoFix(
  filePath: string,
  allowedBase: string,
  adapter: ModelAdapter,
  options: { autoApprove?: boolean } = {},
): Promise<FixResult> {
  const resolved = path.resolve(filePath);
  assertSafePath(resolved, allowedBase);

  const source = fs.readFileSync(resolved, "utf-8");
  audit.log("fix:start", { file: resolved });

  const context = buildContext(resolved, source);
  const suggestion = await adapter.suggest(context);

  if (!options.autoApprove) {
    audit.log("fix:pending-approval", { file: resolved });
    return {
      applied: false,
      reason: "Awaiting manual approval — set autoApprove: true to apply automatically",
      original: source,
    };
  }

  const sandboxResult = await runInSandbox(suggestion);
  if (!sandboxResult.success) {
    audit.log("fix:sandbox-rejected", { file: resolved, error: sandboxResult.error });
    return {
      applied: false,
      reason: `Sandbox check failed: ${sandboxResult.error}`,
    };
  }

  fs.writeFileSync(resolved, suggestion, "utf-8");
  audit.log("fix:applied", { file: resolved });

  return { applied: true, reason: "Fix applied and passed sandbox check" };
}

/**
 * Builds structured context from an Azmara source file.
 * Detects usage of platform primitives so the model understands what it's looking at.
 */
export function buildContext(filePath: string, source: string): AzmaraContext {
  const primitives: string[] = [];

  if (/new Signal\(/.test(source)) primitives.push("Signal");
  if (/computed\(/.test(source)) primitives.push("computed");
  if (/effect\(/.test(source)) primitives.push("effect");
  if (/query\(/.test(source)) primitives.push("query");
  if (/defineTable\(/.test(source)) primitives.push("defineTable");
  if (/createAuditLogger\(/.test(source)) primitives.push("auditLogger");

  return { filePath, source, primitives };
}
