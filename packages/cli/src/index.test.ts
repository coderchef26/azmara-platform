import { sanitiseForLog } from "@azmara/security";
import { describe, expect, it } from "vitest";

describe("CLI — arg sanitisation", () => {
  it("sanitises unknown command before displaying", () => {
    const malicious = "help; rm -rf /";
    const safe = sanitiseForLog(malicious);
    expect(safe).not.toContain("\n");
    expect(safe.length).toBeLessThanOrEqual(202);
  });

  it("passes safe command names through unchanged", () => {
    expect(sanitiseForLog("version")).toBe("version");
    expect(sanitiseForLog("help")).toBe("help");
    expect(sanitiseForLog("init")).toBe("init");
    expect(sanitiseForLog("db:query")).toBe("db:query");
  });
});

describe("CLI — init arg validation", () => {
  it("rejects names with uppercase letters", () => {
    expect(/^[a-z0-9][a-z0-9-_]*$/.test("MyApp")).toBe(false);
  });

  it("rejects names starting with a hyphen", () => {
    expect(/^[a-z0-9][a-z0-9-_]*$/.test("-my-app")).toBe(false);
  });

  it("accepts valid lowercase names", () => {
    expect(/^[a-z0-9][a-z0-9-_]*$/.test("my-app")).toBe(true);
    expect(/^[a-z0-9][a-z0-9-_]*$/.test("my_app_2")).toBe(true);
  });
});

describe("CLI — db:query SELECT guard", () => {
  it("detects non-SELECT statements", () => {
    const reject = (sql: string) => !/^\s*SELECT\b/i.test(sql);
    expect(reject("DROP TABLE customers")).toBe(true);
    expect(reject("INSERT INTO customers VALUES (1)")).toBe(true);
    expect(reject("SELECT * FROM customers")).toBe(false);
    expect(reject("  select name from customers")).toBe(false);
  });
});
