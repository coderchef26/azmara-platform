import { describe, expect, it, vi } from "vitest";
import { sanitiseForLog } from "@azmara/security";

describe("CLI — sanitiseForLog (used for safe arg handling)", () => {
  it("sanitises unknown command before displaying", () => {
    const malicious = "help; rm -rf /";
    const safe = sanitiseForLog(malicious);
    expect(safe).not.toContain("\n");
    expect(safe.length).toBeLessThanOrEqual(202);
  });

  it("passes safe command names through unchanged", () => {
    expect(sanitiseForLog("version")).toBe("version");
    expect(sanitiseForLog("help")).toBe("help");
  });
});
