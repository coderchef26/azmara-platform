import { describe, expect, it, afterEach } from "vitest";
import { SQLiteAdapter } from "./adapter.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

function tmpDb(): { db: SQLiteAdapter; dir: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-test-"));
  const db = new SQLiteAdapter(path.join(dir, "test.db"), dir);
  return { db, dir };
}

describe("SQLiteAdapter — createTable / insert / getAll", () => {
  it("creates a table and inserts a row", () => {
    const { db, dir } = tmpDb();
    db.createTable("users", { name: "string", age: "number" });
    db.insert("users", { name: "Aroha", age: 25 });
    const rows = db.getAll<{ name: string; age: number }>("users");
    expect(rows).toHaveLength(1);
    expect(rows[0]?.name).toBe("Aroha");
    db.close();
    fs.rmSync(dir, { recursive: true });
  });

  it("insertMany inserts all rows in a transaction", () => {
    const { db, dir } = tmpDb();
    db.createTable("products", { name: "string", price: "number" });
    db.insertMany("products", [
      { name: "Widget A", price: 9.99 },
      { name: "Widget B", price: 19.99 },
      { name: "Widget C", price: 4.99 },
    ]);
    expect(db.getAll("products")).toHaveLength(3);
    db.close();
    fs.rmSync(dir, { recursive: true });
  });

  it("createTable is idempotent", () => {
    const { db, dir } = tmpDb();
    db.createTable("items", { label: "string" });
    expect(() => db.createTable("items", { label: "string" })).not.toThrow();
    db.close();
    fs.rmSync(dir, { recursive: true });
  });
});

describe("SQLiteAdapter — identifier injection protection", () => {
  it("blocks SQL injection in table name", () => {
    const { db, dir } = tmpDb();
    expect(() =>
      db.createTable("users; DROP TABLE users; --", { name: "string" }),
    ).toThrow();
    db.close();
    fs.rmSync(dir, { recursive: true });
  });

  it("blocks SQL injection in column name", () => {
    const { db, dir } = tmpDb();
    expect(() =>
      db.createTable("safe", { "col; DROP TABLE safe; --": "string" }),
    ).toThrow();
    db.close();
    fs.rmSync(dir, { recursive: true });
  });

  it("blocks empty table name", () => {
    const { db, dir } = tmpDb();
    expect(() => db.createTable("", { name: "string" })).toThrow();
    db.close();
    fs.rmSync(dir, { recursive: true });
  });

  it("blocks table name starting with a number", () => {
    const { db, dir } = tmpDb();
    expect(() => db.createTable("1invalid", { name: "string" })).toThrow();
    db.close();
    fs.rmSync(dir, { recursive: true });
  });
});

describe("SQLiteAdapter — path traversal protection", () => {
  it("blocks path traversal outside allowed base", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-test-"));
    expect(() =>
      new SQLiteAdapter(path.join(dir, "../../etc/evil.db"), dir),
    ).toThrow();
    fs.rmSync(dir, { recursive: true });
  });

  it("blocks null byte in path", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "azmara-test-"));
    expect(() =>
      new SQLiteAdapter(path.join(dir, "file\0.db"), dir),
    ).toThrow();
    fs.rmSync(dir, { recursive: true });
  });
});
