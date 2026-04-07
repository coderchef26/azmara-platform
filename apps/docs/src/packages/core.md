# @azmara/core

Reactive engine — signals, effects, and computed values.

## Signal

A reactive value container. Any effect that reads `.get()` while active will re-run when the value changes.

```typescript
import { Signal } from "@azmara/core";

const count = new Signal(0);
count.set(1);
console.log(count.get()); // 1
```

## effect

Runs a function immediately and re-runs whenever any Signal read inside it changes.

```typescript
import { Signal, effect } from "@azmara/core";

const name = new Signal("Aroha");

effect(() => {
  console.log(`Hello, ${name.get()}`);
});
// → Hello, Aroha

name.set("Tane");
// → Hello, Tane
```

## computed

A read-only Signal whose value is derived from other Signals.

```typescript
import { Signal, computed } from "@azmara/core";

const price = new Signal(100);
const gst = computed(() => price.get() * 0.15);

console.log(gst.get()); // 15
price.set(200);
console.log(gst.get()); // 30
```

## Safety

Effects are protected against infinite loops — an error is thrown if the effect call depth exceeds 100.
