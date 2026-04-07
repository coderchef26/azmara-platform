# @azmara/db

Secure SQLite persistence adapter built on `better-sqlite3`.

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

const all = db.getAll("customers");
```

## Security features

- **Parameterised queries only** — no string concatenation ever
- **Identifier validation** — table/column names validated against `[a-zA-Z_][a-zA-Z0-9_]*` before any SQL
- **Path containment** — `allowedBase` parameter prevents path traversal
- **WAL journal mode** — write-ahead logging for integrity and performance
- **`secure_delete` PRAGMA** — deleted data is overwritten with zeros
- **Audit log** — every mutation written to tamper-evident hash-chained log

## API

| Method | Description |
|---|---|
| `createTable(name, schema)` | Create table if not exists |
| `insert(name, row)` | Insert a single row |
| `insertMany(name, rows)` | Insert multiple rows in a transaction |
| `getAll(name)` | Return all rows |
| `deleteWhere(name, condition, params)` | Delete rows — condition must be developer-authored |
| `close()` | Close the database connection |
