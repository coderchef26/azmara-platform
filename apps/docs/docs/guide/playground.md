---
sidebar_position: 3
---

# Playground

The `apps/playground` app is a runnable demo that exercises `@azmr/core`, `@azmr/query`, and `@azmr/db` together.

## Run it

```bash
pnpm --filter @azmr/playground dev
```

## What it demonstrates

### 1. Reactive engine

```typescript
const count = new Signal(0);
const doubled = computed(() => count.get() * 2);

effect(() => {
  console.log(`count=${count.get()}  doubled=${doubled.get()}`);
});

count.set(1); // → count=1  doubled=2
count.set(5); // → count=5  doubled=10
```

### 2. Query engine

```typescript
const active = query(customers)
  .where(c => c.balance > 0)
  .orderBy((a, b) => b.balance - a.balance)
  .select();
```

### 3. SQLite persistence

```typescript
const db = new SQLiteAdapter(".azmara/playground.db", ".azmara");

db.createTable("products", { name: "string", price: "number", inStock: "boolean" });
db.insertMany("products", [...]);

const available = query(db.getAll("products"))
  .where(p => p.inStock === 1)
  .select();
```
