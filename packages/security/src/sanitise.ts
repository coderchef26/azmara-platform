/**
 * Sanitise a value to a safe string for use in logging (not for HTML output).
 * Strips null bytes and limits length to prevent log injection.
 */
export function sanitiseForLog(value: unknown, maxLength = 200): string {
  const str = String(value)
    .replace(/\0/g, "") // strip null bytes
    .replace(/[\r\n]/g, " "); // flatten newlines (prevent log injection)
  return str.length > maxLength ? str.slice(0, maxLength) + "…" : str;
}

/**
 * Validates that a string is a safe SQL/DB identifier (table or column name).
 * Allows only alphanumeric characters and underscores, must start with a letter or underscore.
 * Throws if the identifier fails validation.
 */
const SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]{0,63}$/;

export function assertSafeIdentifier(value: string, context = "identifier"): void {
  if (!SAFE_IDENTIFIER.test(value)) {
    throw new Error(
      `[azmara/security] Unsafe ${context}: "${sanitiseForLog(value)}" — only alphanumeric and underscores allowed`,
    );
  }
}

/**
 * Validates that a file path stays within an allowed base directory.
 * Prevents path traversal attacks.
 */
import path from "node:path";

export function assertSafePath(filePath: string, allowedBase: string): void {
  if (filePath.includes("\0")) {
    throw new Error(
      `[azmara/security] Null byte detected in path: "${sanitiseForLog(filePath)}"`,
    );
  }
  const resolved = path.resolve(filePath);
  const base = path.resolve(allowedBase);
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    throw new Error(
      `[azmara/security] Path traversal attempt detected: "${sanitiseForLog(filePath)}"`,
    );
  }
}
