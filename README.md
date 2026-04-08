# Azmara Platform

> A data-native application runtime — build reactive, local-first apps with zero boilerplate.

The Azmara Platform is a TypeScript monorepo that brings back the simplicity of data-first development. Define your data once, and everything else — UI, logic, queries, persistence — derives from it reactively.

```typescript
import { Signal, computed } from "@azmara/core";
import { query } from "@azmara/query";
import { SQLiteAdapter } from "@azmara/db";

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
| [`@azmara/core`](packages/core) | Reactive signals, effects, and computed values | 0.0.1 |
| [`@azmara/query`](packages/query) | Chainable, type-safe query builder | 0.0.1 |
| [`@azmara/security`](packages/security) | Validation, audit logging, env guards | 0.0.1 |
| [`@azmara/db`](packages/db) | Secure SQLite persistence adapter | 0.0.1 |
| [`@azmara/ui`](packages/ui) | React components wired to Signals | 0.0.1 |
| [`@azmara/cli`](packages/cli) | CLI — scaffold apps, query databases | 0.0.1 |

---

## Quick Start

### Scaffold a new app

```bash
npx @azmara/cli init my-app
cd my-app
pnpm install
pnpm dev
```

### Install individual packages

```bash
pnpm add @azmara/core @azmara/query
pnpm add @azmara/db          # SQLite — requires node-gyp
pnpm add @azmara/ui          # React components
pnpm add -g @azmara/cli      # CLI tool
```

---

## Architecture

```
@azmara/security          ← foundation — no internal deps
    ↑
@azmara/core              ← Signal reactive engine
@azmara/db                ← SQLite adapter (depends: security)
@azmara/query             ← query builder (depends: core)
@azmara/ui                ← React components (depends: core)
@azmara/cli               ← CLI (depends: core, db, security)
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
pnpm --filter @azmara/playground dev

# Visual browser playground (localhost:5173)
pnpm --filter @azmara/playground web
```

### Run docs locally

```bash
pnpm --filter @azmara/docs start
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
