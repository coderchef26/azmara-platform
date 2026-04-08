import { describe, expect, it } from "vitest";
import { validate, validateEnv, z } from "./validate.js";

describe("validate", () => {
  const Schema = z.object({
    name: z.string().min(1),
    age: z.number().nonnegative(),
  });

  it("returns parsed data on valid input", () => {
    const result = validate(Schema, { name: "Aroha", age: 25 });
    expect(result).toEqual({ name: "Aroha", age: 25 });
  });

  it("throws on missing required field", () => {
    expect(() => validate(Schema, { name: "Aroha" })).toThrow("Validation failed");
  });

  it("throws on wrong type", () => {
    expect(() => validate(Schema, { name: "Aroha", age: "old" })).toThrow("Validation failed");
  });

  it("throws on empty string when min(1)", () => {
    expect(() => validate(Schema, { name: "", age: 25 })).toThrow("Validation failed");
  });

  it("throws on negative number when nonnegative()", () => {
    expect(() => validate(Schema, { name: "Aroha", age: -1 })).toThrow("Validation failed");
  });

  it("does not leak raw input in error message", () => {
    const secret = "sk_live_supersecretkey";
    let errorMsg = "";
    try {
      validate(Schema, { name: secret, age: "not-a-number" });
    } catch (e) {
      errorMsg = (e as Error).message;
    }
    // Error should describe the field issue, not echo back the value
    expect(errorMsg).not.toContain(secret);
  });
});

describe("validateEnv", () => {
  it("passes when all required vars are set", () => {
    process.env.TEST_VAR_A = "value";
    expect(() => validateEnv(["TEST_VAR_A"])).not.toThrow();
    process.env.TEST_VAR_A = undefined;
  });

  it("throws listing missing vars", () => {
    process.env.MISSING_VAR_X = undefined;
    expect(() => validateEnv(["MISSING_VAR_X"])).toThrow("MISSING_VAR_X");
  });

  it("throws only for missing vars, not present ones", () => {
    process.env.PRESENT_VAR = "set";
    process.env.ABSENT_VAR = undefined;
    expect(() => validateEnv(["PRESENT_VAR", "ABSENT_VAR"])).toThrow("ABSENT_VAR");
    process.env.PRESENT_VAR = undefined;
  });
});
