import { describe, expect, it } from "vitest";
import { createJWT } from "./jwt.js";

const SECRET = "super-secret-key-at-least-32-chars!!";

describe("createJWT", () => {
  it("throws if secret is too short", () => {
    expect(() => createJWT("short")).toThrow("at least 32 characters");
  });

  it("signs and verifies a token", () => {
    const jwt = createJWT(SECRET);
    const token = jwt.sign({ sub: "user-123" });
    const payload = jwt.verify(token);
    expect(payload.sub).toBe("user-123");
    expect(payload.iat).toBeTypeOf("number");
    expect(payload.exp).toBeTypeOf("number");
  });

  it("includes custom claims", () => {
    const jwt = createJWT(SECRET);
    const token = jwt.sign({ sub: "user-123", role: "admin" });
    const payload = jwt.verify(token);
    expect(payload.role).toBe("admin");
  });

  it("rejects a tampered payload", () => {
    const jwt = createJWT(SECRET);
    const token = jwt.sign({ sub: "user-123" });
    const [header, , sig] = token.split(".");
    const tampered = Buffer.from(JSON.stringify({ sub: "attacker", iat: 0, exp: 9999999999 })).toString("base64url");
    expect(() => jwt.verify(`${header}.${tampered}.${sig}`)).toThrow("Invalid JWT signature");
  });

  it("rejects a token signed with a different secret", () => {
    const jwt1 = createJWT(SECRET);
    const jwt2 = createJWT("different-secret-key-at-least-32-chars");
    const token = jwt1.sign({ sub: "user-123" });
    expect(() => jwt2.verify(token)).toThrow("Invalid JWT signature");
  });

  it("rejects an expired token", () => {
    const jwt = createJWT(SECRET);
    const token = jwt.sign({ sub: "user-123" }, { expiresInMs: -1000 });
    expect(() => jwt.verify(token)).toThrow("expired");
  });

  it("rejects a malformed token", () => {
    const jwt = createJWT(SECRET);
    expect(() => jwt.verify("not.a.valid.jwt.format")).toThrow("Invalid JWT format");
  });
});
