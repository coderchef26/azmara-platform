# @azmr/core

Reactive engine for the Azmara platform — signals, effects, and computed values with a batch scheduler that eliminates double-firing.

## Install

```bash
pnpm add @azmr/core
# or
npm install @azmr/core
```

## Usage

```typescript
import { Signal, computed, effect } from "@azmr/core";

const count = new Signal(0);
const doubled = computed(() => count.get() * 2);

effect(() => {
  console.log(`count: ${count.get()}, doubled: ${doubled.get()}`);
});
// → count: 0, doubled: 0

count.set(5);
// → count: 5, doubled: 10
```

## Subscribe (for React / external bridges)

```typescript
const unsub = count.subscribe((value) => {
  console.log("changed:", value);
});

count.set(10); // → changed: 10
unsub();        // stop listening
```

## API

| Export | Description |
|---|---|
| `Signal<T>` | Reactive value container |
| `Signal.get()` | Read value, subscribe current effect |
| `Signal.set(value)` | Update value, notify subscribers |
| `Signal.peek()` | Read value without subscribing |
| `Signal.subscribe(fn)` | Push-based subscription, returns unsubscribe |
| `effect(fn)` | Run `fn` reactively, returns disposer |
| `computed(fn)` | Read-only derived Signal |

## Requirements

- Node.js ≥ 18
- TypeScript ≥ 5 (types included)

## Documentation

Full docs at [docs.azmara.io](https://docs.azmara.io)

## License

MIT © [Azmara Technologies](https://azmara.io)
