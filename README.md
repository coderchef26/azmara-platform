# Azmara Platform

> A data-native application runtime — build reactive, local-first apps with zero boilerplate.

The Azmara Platform is a TypeScript monorepo that brings back the simplicity of data-first development. Define your data once, and everything else — UI, logic, queries, persistence — derives from it reactively.

```typescript
import { Signal, computed } from "@azmr/core";
import { query } from "@azmr/query";
import { SQLiteAdapter } from "@azmr/db";

// Define reactive data
const products = new Signal([
  { name: "Widget A", price: 29.99, inStock: true },
  { name: "Widget B", price: 49.99, inStock: false },
]);

// Query it
const available = query(products)
  .where(p => p.inStock)
  .orderBy((a, b) => a.price - b.price)
  .select();

// Persist it
const db = new SQLiteAdapter(".azmara/app.db");
db.createTable("products", { name: "string", price: "number", inStock: "boolean" });
db.insertMany("products", available.map(p => ({ ...p, inStock: 1 })));
```

---

## Packages

| Package | Description | Version |
|---|---|---|
| [`@azmr/core`](packages/core) | Reactive signals, effects, and computed values | 0.0.1 |
| [`@azmr/query`](packages/query) | Chainable, type-safe query builder | 0.0.1 |
| [`@azmr/security`](packages/security) | Validation, audit logging, env guards | 0.0.1 |
| [`@azmr/db`](packages/db) | Secure SQLite persistence adapter | 0.0.1 |
| [`@azmr/ui`](packages/ui) | React components wired to Signals | 0.0.1 |
| [`@azmr/cli`](packages/cli) | CLI — scaffold apps, query databases | 0.0.1 |

---

## Quick Start

### Scaffold a new app

```bash
npx @azmr/cli init my-app
cd my-app
pnpm install
pnpm dev
```

### Install individual packages

```bash
pnpm add @azmr/core @azmr/query
pnpm add @azmr/db          # SQLite — requires node-gyp
pnpm add @azmr/ui          # React components
pnpm add -g @azmr/cli      # CLI tool
```

---

## Architecture

```
@azmr/security          ← foundation — no internal deps
    ↑
@azmr/core              ← Signal reactive engine
@azmr/db                ← SQLite adapter (depends: security)
@azmr/query             ← query builder (depends: core)
@azmr/ui                ← React components (depends: core)
@azmr/cli               ← CLI (depends: core, db, security)
```

---

## Development

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Setup

```bash
git clone https://github.com/coderchef26/azmara-platform.git
cd azmara-platform
pnpm install
pnpm build
pnpm test
```

### Run the playground

```bash
# Node.js console demo
pnpm --filter @azmr/playground dev

# Visual browser playground (localhost:5173)
pnpm --filter @azmr/playground web
```

### Run docs locally

```bash
pnpm --filter @azmr/docs start
```

### Commands

| Command | Description |
|---|---|
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint with Biome |
| `pnpm check` | Lint + format fix |
| `pnpm check-types` | TypeScript type check |
| `pnpm audit:deps` | Security audit |

---

## Documentation

Full documentation at **[docs.azmara.io](https://docs.azmara.io)**

---

## License

MIT © [Azmara Technologies](https://azmara.io) — built in New Zealand 🇳🇿
