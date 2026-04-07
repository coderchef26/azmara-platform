# @azmara/query

FoxPro-inspired chainable query builder over arrays or reactive Signals.

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
```

## With a Signal

```typescript
import { Signal } from "@azmara/core";
import { query } from "@azmara/query";

const data = new Signal(customers);

const active = query(data)
  .where(c => c.balance > 0)
  .select();
```

## API

| Method | Description |
|---|---|
| `.where(fn)` | Filter rows — predicate must be a function |
| `.orderBy(fn)` | Sort rows with a comparator function |
| `.limit(n)` | Return at most `n` rows |
| `.offset(n)` | Skip first `n` rows |
| `.select()` | Execute and return results array |
| `.count()` | Return count of matching rows |
| `.first()` | Return first matching row or `undefined` |

## Security

All predicates must be TypeScript functions — string-based queries are rejected. This prevents eval injection at the type level.
