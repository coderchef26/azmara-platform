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
 * Verifies the integrity of an Azmara audit log file.
 *
 * Each entry's hash is recomputed and checked against the stored value.
 * The prevHash chain is also verified — any insertion, deletion, or
 * modification of entries will break the chain and be reported.
 *
 * Usage:
 *   azmara audit:verify                        # uses AZMARA_AUDIT_LOG or .azmara/audit.log
 *   azmara audit:verify path/to/audit.log
 */
export function auditVerify(args: string[]): void {
  const logPath = path.resolve(args[0] ?? process.env.AZMARA_AUDIT_LOG ?? ".azmara/audit.log");

  if (!fs.existsSync(logPath)) {
    console.error(`\n  [audit:verify] Log file not found: ${logPath}\n`);
    process.exit(1);
  }

  const raw = fs.readFileSync(logPath, "utf-8").trim();
  if (!raw) {
    console.log("\n  [audit:verify] Log is empty — nothing to verify\n");
    return;
  }

  const lines = raw.split("\n").filter(Boolean);
  let prevHash = "";
  let valid = 0;
  const errors: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let entry: AuditEntry;

    try {
      entry = JSON.parse(lines[i] as string) as AuditEntry;
    } catch {
      errors.push(`  Entry ${i + 1}: parse error — line is not valid JSON`);
      continue;
    }

    const { hash, ...base } = entry;
    const expected = crypto.createHash("sha256").update(JSON.stringify(base)).digest("hex");

    if (hash !== expected) {
      errors.push(
        `  Entry ${i + 1} [${entry.timestamp}]: hash mismatch — content may have been modified`,
      );
    } else if (base.prevHash !== prevHash) {
      errors.push(
        `  Entry ${i + 1} [${entry.timestamp}]: chain broken — entry may have been inserted or deleted`,
      );
    } else {
      valid++;
    }

    prevHash = hash;
  }

  console.log(`\n  Audit log: ${logPath}`);
  console.log(`  Entries:   ${lines.length}`);
  console.log(`  Valid:     ${valid}`);

  if (errors.length > 0) {
    console.error(`  Invalid:   ${errors.length}\n`);
    for (const e of errors) console.error(e);
    console.error("\n  ✗ Audit log integrity check FAILED — log may have been tampered with\n");
    process.exit(1);
  }

  console.log("\n  ✓ Chain intact — no tampering detected\n");
}
