import fs from "node:fs";
import path from "node:path";
import { assertSafePath, createAuditLogger, validateEnv } from "@azmara/security";
import { runInSandbox } from "./sandbox.js";

const audit = createAuditLogger("ai:fix");

export interface FixResult {
  applied: boolean;
  reason: string;
  original?: string;
}

/**
 * AI Auto-Fix pipeline.
 *
 * Security model:
 * 1. File path is validated against allowed base directory (no traversal)
 * 2. AI suggestion is sandboxed before applying (isolated-vm)
 * 3. Sandbox failure reverts the change automatically
 * 4. Every fix attempt is written to the audit log with approval status
 * 5. Manual approval gate — auto-apply is off by default
 */
export async function autoFix(
  filePath: string,
  allowedBase: string,
  options: { autoApprove?: boolean } = {},
): Promise<FixResult> {
  validateEnv(["OPENAI_API_KEY"]);

  const resolved = path.resolve(filePath);
  assertSafePath(resolved, allowedBase);

  const original = fs.readFileSync(resolved, "utf-8");
  audit.log("fix:start", { file: resolved });

  // Placeholder — real AI call wired in phase 2
  const suggestion = await analyzeWithAI(original);

  if (!options.autoApprove) {
    audit.log("fix:pending-approval", { file: resolved });
    return {
      applied: false,
      reason: "Awaiting manual approval — set autoApprove: true to apply automatically",
      original,
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

/** Stub — replaced with real OpenAI call in phase 2. */
async function analyzeWithAI(code: string): Promise<string> {
  // TODO: wire OpenAI API with structured output + retry logic
  void code;
  throw new Error("[azmara/ai] AI analysis not yet implemented — coming in phase 2");
}
