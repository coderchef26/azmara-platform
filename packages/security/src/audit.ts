import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

interface AuditEntry {
  timestamp: string;
  context: string;
  action: string;
  meta: Record<string, unknown>;
  prevHash: string;
  hash: string;
}

/**
 * Creates a tamper-evident audit logger.
 * Each entry includes a SHA-256 hash of its content chained to the previous entry's hash.
 * Any modification to a log entry breaks the chain, making tampering detectable.
 *
 * IMPORTANT: Never log passwords, tokens, or PII in `meta`.
 */
export function createAuditLogger(context: string) {
  const logPath = path.resolve(process.env.AZMARA_AUDIT_LOG ?? ".azmara/audit.log");
  fs.mkdirSync(path.dirname(logPath), { recursive: true });

  let lastHash = "";

  return {
    log(action: string, meta: Record<string, unknown> = {}): void {
      const base: Omit<AuditEntry, "hash"> = {
        timestamp: new Date().toISOString(),
        context,
        action,
        meta,
        prevHash: lastHash,
      };
      const hash = crypto.createHash("sha256").update(JSON.stringify(base)).digest("hex");
      lastHash = hash;
      const line = `${JSON.stringify({ ...base, hash } satisfies AuditEntry)}\n`;
      fs.appendFileSync(logPath, line, { encoding: "utf-8" });
    },
  };
}

export type AuditLogger = ReturnType<typeof createAuditLogger>;
