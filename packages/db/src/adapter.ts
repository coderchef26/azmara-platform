import path from "node:path";
import Database from "better-sqlite3";
import { assertSafeIdentifier, assertSafePath, createAuditLogger } from "@azmara/security";

export type ColumnType = "string" | "number" | "boolean";
export type ColumnSchema = Record<string, ColumnType>;

const TYPE_MAP: Record<ColumnType, string> = {
  string: "TEXT",
  number: "REAL",
  boolean: "INTEGER",
};

/**
 * Secure SQLite adapter.
 *
 * Security properties:
 * - All table/column names validated as safe identifiers before use
 * - All values inserted via parameterised statements (never string-concatenated)
 * - WAL journal mode for integrity and performance
 * - foreign_keys and secure_delete PRAGMAs enabled
 * - DB path validated to stay within allowed base directory
 * - All mutations written to tamper-evident audit log
 */
export class SQLiteAdapter {
  private readonly db: Database.Database;
  private readonly audit = createAuditLogger("db");
  private readonly dbPath: string;

  constructor(dbPath: string, allowedBase?: string) {
    const resolved = path.resolve(dbPath);

    if (allowedBase) {
      assertSafePath(resolved, allowedBase);
    }

    this.dbPath = resolved;
    this.db = new Database(resolved);

    // Security & integrity PRAGMAs
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("foreign_keys = ON");
    this.db.pragma("secure_delete = ON");
    this.db.pragma("trusted_schema = OFF");
  }

  createTable(name: string, schema: ColumnSchema): void {
    assertSafeIdentifier(name, "table name");
    const columns = Object.entries(schema)
      .map(([col, type]) => {
        assertSafeIdentifier(col, "column name");
        return `"${col}" ${TYPE_MAP[type]} NOT NULL`;
      })
      .join(", ");

    this.db.prepare(`CREATE TABLE IF NOT EXISTS "${name}" (${columns})`).run();
    this.audit.log("createTable", { table: name });
  }

  insert<T extends Record<string, unknown>>(name: string, row: T): void {
    assertSafeIdentifier(name, "table name");

    const keys = Object.keys(row);
    for (const key of keys) assertSafeIdentifier(key, "column name");

    const cols = keys.map((k) => `"${k}"`).join(", ");
    const placeholders = keys.map(() => "?").join(", ");
    const values = Object.values(row);

    this.db.prepare(`INSERT INTO "${name}" (${cols}) VALUES (${placeholders})`).run(values);
    this.audit.log("insert", { table: name, rowCount: 1 });
  }

  insertMany<T extends Record<string, unknown>>(name: string, rows: T[]): void {
    assertSafeIdentifier(name, "table name");
    if (rows.length === 0) return;

    const keys = Object.keys(rows[0]!);
    for (const key of keys) assertSafeIdentifier(key, "column name");

    const cols = keys.map((k) => `"${k}"`).join(", ");
    const placeholders = keys.map(() => "?").join(", ");
    const stmt = this.db.prepare(`INSERT INTO "${name}" (${cols}) VALUES (${placeholders})`);

    const insertAll = this.db.transaction((data: T[]) => {
      for (const row of data) stmt.run(Object.values(row));
    });

    insertAll(rows);
    this.audit.log("insertMany", { table: name, rowCount: rows.length });
  }

  getAll<T = unknown>(name: string): T[] {
    assertSafeIdentifier(name, "table name");
    return this.db.prepare(`SELECT * FROM "${name}"`).all() as T[];
  }

  /**
   * Execute a raw SELECT statement. Only SELECT is permitted — any other
   * statement type throws immediately. Params are passed through
   * better-sqlite3's parameterised binding so values are never concatenated.
   *
   * Note: `sql` must be developer-authored (e.g. CLI input), not end-user input.
   */
  rawSelect<T = unknown>(sql: string, params: unknown[] = []): T[] {
    if (!/^\s*SELECT\b/i.test(sql)) {
      throw new Error("[azmara/db] rawSelect only accepts SELECT statements");
    }
    return this.db.prepare(sql).all(params) as T[];
  }

  truncateTable(name: string): void {
    assertSafeIdentifier(name, "table name");
    this.db.prepare(`DELETE FROM "${name}"`).run();
    this.audit.log("truncateTable", { table: name });
  }

  deleteWhere(name: string, condition: string, params: unknown[]): number {
    // condition must be a trusted, developer-authored string — never user input
    assertSafeIdentifier(name, "table name");
    const result = this.db.prepare(`DELETE FROM "${name}" WHERE ${condition}`).run(params);
    this.audit.log("deleteWhere", { table: name, changes: result.changes });
    return result.changes;
  }

  close(): void {
    this.db.close();
  }

  get path(): string {
    return this.dbPath;
  }
}
