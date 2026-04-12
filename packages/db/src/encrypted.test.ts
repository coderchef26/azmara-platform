import { describe, expect, it } from "vitest";
import { createColumnEncryption } from "./encrypted.js";

const SECRET = "test-encryption-secret-16chars!!";

describe("createColumnEncryption", () => {
  it("throws if secret is too short", () => {
    expect(() => createColumnEncryption("short")).toThrow("at least 16 characters");
  });

  it("encrypts and decrypts a string", () => {
    const enc = createColumnEncryption(SECRET);
    const plain = "sensitive value";
    expect(enc.decrypt(enc.encrypt(plain))).toBe(plain);
  });

  it("produces different ciphertexts for the same input (random IV)", () => {
    const enc = createColumnEncryption(SECRET);
    const c1 = enc.encrypt("hello");
    const c2 = enc.encrypt("hello");
    expect(c1).not.toBe(c2);
  });

  it("round-trips unicode and special characters", () => {
    const enc = createColumnEncryption(SECRET);
    const values = ["café", "صلاح الدين", "日本語", "100%<>&\"'"];
    for (const v of values) {
      expect(enc.decrypt(enc.encrypt(v))).toBe(v);
    }
  });

  it("throws on tampered ciphertext", () => {
    const enc = createColumnEncryption(SECRET);
    const cipher = enc.encrypt("secret");
    const buf = Buffer.from(cipher, "base64");
    // biome-ignore lint/style/noNonNullAssertion: buf is non-empty, last byte always exists
    buf[buf.length - 1]! ^= 0xff;
    expect(() => enc.decrypt(buf.toString("base64"))).toThrow();
  });

  it("throws on wrong secret", () => {
    const enc1 = createColumnEncryption(SECRET);
    const enc2 = createColumnEncryption("different-secret-16chars!!!!!!!!");
    expect(() => enc2.decrypt(enc1.encrypt("secret"))).toThrow();
  });

  it("throws on truncated data", () => {
    const enc = createColumnEncryption(SECRET);
    expect(() => enc.decrypt(Buffer.from("short").toString("base64"))).toThrow(
      "data too short",
    );
  });
});
