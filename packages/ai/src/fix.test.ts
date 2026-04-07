import { describe, expect, it, vi, beforeEach } from "vitest";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";

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

describe("autoFix — path validation", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("rejects paths outside allowed base", async () => {
    const { autoFix } = await import("./fix.js");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-ai-test-"));

    await expect(
      autoFix(path.join(dir, "../../etc/passwd"), dir),
    ).rejects.toThrow();

    fs.rmSync(dir, { recursive: true });
  });

  it("rejects path with null byte", async () => {
    const { autoFix } = await import("./fix.js");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-ai-test-"));

    await expect(
      autoFix(path.join(dir, "file\0.ts"), dir),
    ).rejects.toThrow();

    fs.rmSync(dir, { recursive: true });
  });

  it("rejects when OPENAI_API_KEY is missing", async () => {
    const { autoFix } = await import("./fix.js");
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-ai-test-"));
    const file = path.join(dir, "test.ts");
    fs.writeFileSync(file, "const x = 1;");

    const prev = process.env["OPENAI_API_KEY"];
    delete process.env["OPENAI_API_KEY"];

    await expect(autoFix(file, dir)).rejects.toThrow("OPENAI_API_KEY");

    if (prev !== undefined) process.env["OPENAI_API_KEY"] = prev;
    fs.rmSync(dir, { recursive: true });
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
