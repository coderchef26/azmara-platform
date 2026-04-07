---
sidebar_position: 3
---

# @azmara/db

Secure SQLite persistence adapter built on `better-sqlite3`.

## Installation

```bash
pnpm add @azmara/db
```

## Usage

```typescript
import { SQLiteAdapter } from "@azmara/db";

const db = new SQLiteAdapter(".azmara/db/app.db", ".azmara/db");

db.createTable("customers", {
  name: "string",
  balance: "number",
  active: "boolean",
});

db.insert("customers", { name: "Aroha", balance: 150, active: 1 });
db.insertMany("customers", [
  { name: "Tane", balance: 0, active: 0 },
  { name: "Mere", balance: 320, active: 1 },
]);

const all = db.getAll<{ name: string; balance: number }>("customers");
```

## Security features

:::warning
All table and column names are validated against `[a-zA-Z_][a-zA-Z0-9_]*` before any SQL is executed. Unsafe identifiers throw immediately.
:::

| Feature | Detail |
|---|---|
| Parameterised queries | No string concatenation — ever |
| Identifier validation | Table/column names regex-validated before SQL |
| Path containment | `allowedBase` prevents path traversal |
| WAL journal mode | Write-ahead logging for integrity and performance |
| `secure_delete` | Deleted data overwritten with zeros |
| `foreign_keys ON` | Referential integrity enforced |
| Audit log | Every mutation written to hash-chained tamper-evident log |

## API Reference

| Method | Description |
|---|---|
| `createTable(name, schema)` | Create table if not exists |
| `insert(name, row)` | Insert a single row (parameterised) |
| `insertMany(name, rows)` | Insert multiple rows in a transaction |
| `getAll<T>(name)` | Return all rows typed as `T[]` |
| `deleteWhere(name, condition, params)` | Delete rows — condition must be developer-authored |
| `close()` | Close the database connection |
| `db.path` | Resolved path to the database file |

## Column types

| Schema type | SQLite type |
|---|---|
| `"string"` | `TEXT NOT NULL` |
| `"number"` | `REAL NOT NULL` |
| `"boolean"` | `INTEGER NOT NULL` |
