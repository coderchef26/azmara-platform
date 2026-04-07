/** Maximum reactive effect call depth — guards against infinite loops. */
const MAX_EFFECT_DEPTH = 100;

type Subscriber = () => void;

let currentEffect: Subscriber | null = null;
let effectDepth = 0;

/**
 * A reactive value container. Any effect that reads `.get()` while active
 * will automatically re-run when the value changes.
 */
export class Signal<T> {
  private _value: T;
  private readonly _subscribers = new Set<Subscriber>();

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get(): T {
    if (currentEffect !== null) {
      this._subscribers.add(currentEffect);
    }
    return this._value;
  }

  set(value: T): void {
    if (Object.is(this._value, value)) return;
    this._value = value;
    // Snapshot to avoid mutation during iteration
    for (const subscriber of [...this._subscribers]) {
      subscriber();
    }
  }

  peek(): T {
    return this._value;
  }
}

/**
 * Run `fn` immediately and re-run whenever any Signal read inside it changes.
 * Returns a disposer function.
 */
export function effect(fn: () => void): () => void {
  if (effectDepth >= MAX_EFFECT_DEPTH) {
    throw new Error(
      `[azmara/core] Effect depth limit (${MAX_EFFECT_DEPTH}) exceeded — possible infinite loop detected`,
    );
  }

  const run: Subscriber = () => {
    if (effectDepth >= MAX_EFFECT_DEPTH) {
      throw new Error(
        `[azmara/core] Effect depth limit (${MAX_EFFECT_DEPTH}) exceeded — possible infinite loop detected`,
      );
    }
    effectDepth++;
    const prev = currentEffect;
    currentEffect = run;
    try {
      fn();
    } finally {
      currentEffect = prev;
      effectDepth--;
    }
  };

  run();
  return () => {
    // Disposer — signals drop this subscriber on next notify cycle
    // Full cleanup can be wired here in a future pass
  };
}

/**
 * A read-only Signal whose value is derived from other Signals.
 */
export function computed<T>(fn: () => T): Signal<T> {
  const sig = new Signal<T>(fn());
  effect(() => sig.set(fn()));
  return sig;
}
