---
sidebar_position: 2
---

# @azmara/query

FoxPro-inspired chainable query builder over arrays or reactive Signals.

## Installation

```bash
pnpm add @azmara/query @azmara/core
```

## Basic usage

```typescript
import { query } from "@azmara/query";

const customers = [
  { name: "Aroha", balance: 150 },
  { name: "Tane", balance: 0 },
  { name: "Mere", balance: 320 },
];

const result = query(customers)
  .where(c => c.balance > 0)
  .orderBy((a, b) => b.balance - a.balance)
  .limit(10)
  .select();
// → [{ name: "Mere", balance: 320 }, { name: "Aroha", balance: 150 }]
```

## With a reactive Signal

```typescript
import { Signal } from "@azmara/core";
import { query } from "@azmara/query";

const data = new Signal(customers);

const active = query(data)
  .where(c => c.balance > 0)
  .select();
```

## API Reference

| Method | Description |
|---|---|
| `.where(fn)` | Filter rows — predicate must be a function |
| `.orderBy(fn)` | Sort with a comparator `(a, b) => number` |
| `.limit(n)` | Return at most `n` rows |
| `.offset(n)` | Skip first `n` rows |
| `.select()` | Execute and return results array |
| `.count()` | Return count of matching rows |
| `.first()` | Return first match or `undefined` |

## Security

All predicates must be TypeScript functions — string-based queries throw a `TypeError`. This prevents eval injection at the type and runtime level.

```typescript
// ✅ Safe — TypeScript function
query(data).where(c => c.balance > 0)

// ❌ Throws TypeError — string predicates rejected
query(data).where("balance > 0" as any)
```
