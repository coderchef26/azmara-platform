import ivm from "isolated-vm";
import { createAuditLogger } from "@azmara/security";

const SANDBOX_TIMEOUT_MS = 5_000;
const SANDBOX_MEMORY_MB = 64;

const audit = createAuditLogger("ai:sandbox");

export interface SandboxResult {
  success: boolean;
  output?: unknown;
  error?: string;
}

/**
 * Executes untrusted code inside a V8 Isolate — a true sandbox with:
 * - Separate V8 heap (memory limit enforced)
 * - No access to Node.js APIs, file system, or network
 * - Hard execution timeout
 * - Audit log entry for every run
 *
 * This replaces the insecure `vm2` approach from the design doc.
 * vm2 has known sandbox escape CVEs. isolated-vm uses actual V8 isolate boundaries.
 */
export async function runInSandbox(code: string): Promise<SandboxResult> {
  const codePreview = code.slice(0, 80).replace(/\n/g, " ");
  const isolate = new ivm.Isolate({ memoryLimit: SANDBOX_MEMORY_MB });

  try {
    const context = await isolate.createContext();
    const jail = context.global;

    // Expose nothing to the sandbox — least privilege
    await jail.set("global", jail.derefInto());

    const script = await isolate.compileScript(code);
    const output = await script.run(context, { timeout: SANDBOX_TIMEOUT_MS });

    audit.log("sandbox:run:success", { preview: codePreview });
    return { success: true, output };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    audit.log("sandbox:run:failure", { preview: codePreview, error: message });
    return { success: false, error: message };
  } finally {
    isolate.dispose();
  }
}
