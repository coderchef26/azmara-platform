import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ModelAdapter } from "./fix.js";

// Mock isolated-vm so tests run without native compilation
vi.mock("isolated-vm", () => ({
  default: class Isolate {
    createContext() {
      return Promise.resolve({
        global: { set: vi.fn(), derefInto: vi.fn() },
      });
    }
    compileScript() {
      return Promise.resolve({ run: vi.fn().mockResolvedValue(undefined) });
    }
    dispose() {}
  },
}));

/** Minimal adapter stub — never called in path-validation tests */
const stubAdapter: ModelAdapter = {
  suggest: vi.fn().mockResolvedValue("const x = 1;"),
};

describe("autoFix — path validation", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("rejects paths outside allowed base", async () => {
    const { autoFix } = await import("./fix.js");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-ai-test-"));

    await expect(autoFix(path.join(dir, "../../etc/passwd"), dir, stubAdapter)).rejects.toThrow();

    fs.rmSync(dir, { recursive: true });
  });

  it("rejects path with null byte", async () => {
    const { autoFix } = await import("./fix.js");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-ai-test-"));

    await expect(autoFix(path.join(dir, "file\0.ts"), dir, stubAdapter)).rejects.toThrow();

    fs.rmSync(dir, { recursive: true });
  });
});

describe("buildContext — primitive detection", () => {
  it("detects Signal usage", async () => {
    const { buildContext } = await import("./fix.js");
    const ctx = buildContext("test.ts", "const count = new Signal(0);");
    expect(ctx.primitives).toContain("Signal");
  });

  it("detects multiple primitives", async () => {
    const { buildContext } = await import("./fix.js");
    const ctx = buildContext("test.ts", "const q = query(data); effect(() => {});");
    expect(ctx.primitives).toContain("query");
    expect(ctx.primitives).toContain("effect");
  });

  it("returns empty primitives for plain code", async () => {
    const { buildContext } = await import("./fix.js");
    const ctx = buildContext("test.ts", "const x = 1 + 2;");
    expect(ctx.primitives).toHaveLength(0);
  });
});

// Sandbox tests — uncomment once isolated-vm native module is compiled:
// (VS2022 "Desktop development with C++" workload required)
//
// describe("runInSandbox", () => {
//   it("executes simple expressions safely", async () => {
//     const { runInSandbox } = await import("./sandbox.js");
//     const result = await runInSandbox("1 + 1");
//     expect(result.success).toBe(true);
//     expect(result.output).toBe(2);
//   });
//   it("blocks access to Node.js process", async () => {
//     const { runInSandbox } = await import("./sandbox.js");
//     const result = await runInSandbox("process.env");
//     expect(result.success).toBe(false);
//   });
//   it("enforces timeout", async () => {
//     const { runInSandbox } = await import("./sandbox.js");
//     const result = await runInSandbox("while(true){}");
//     expect(result.success).toBe(false);
//   });
// });
