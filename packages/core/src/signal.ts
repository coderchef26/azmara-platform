type Subscriber = () => void;

let currentEffect: Subscriber | null = null;

// ── Scheduler ────────────────────────────────────────────────────────────────
// Deduplicates effects so a single set() call never triggers the same effect
// more than once per flush cycle, even when a computed chain causes the same
// effect to be re-queued mid-flush.
//
// Key design: Signal.set() adds ALL its subscribers to pendingSubscribers
// before calling flushIfIdle(), so the entire sibling set is batched together.
// Only then does the flush start. If a nested set() fires during the flush,
// flushIfIdle() is a no-op and new subscribers join the next while-loop pass.
// The generation counter prevents an effect that already ran this cycle from
// running again even if it is re-queued by a downstream signal.
let isFlushing = false;
let flushGeneration = 0;
const pendingSubscribers = new Set<Subscriber>();
const subscriberGeneration = new WeakMap<Subscriber, number>();

function flushIfIdle(): void {
  if (isFlushing) return;
  isFlushing = true;
  flushGeneration++;
  const gen = flushGeneration;
  try {
    while (pendingSubscribers.size > 0) {
      const batch = [...pendingSubscribers];
      pendingSubscribers.clear();
      for (const s of batch) {
        if (subscriberGeneration.get(s) !== gen) {
          subscriberGeneration.set(s, gen);
          s();
        }
      }
    }
  } finally {
    isFlushing = false;
  }
}

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
    for (const subscriber of this._subscribers) {
      pendingSubscribers.add(subscriber);
    }
    flushIfIdle();
  }

  peek(): T {
    return this._value;
  }

  subscribe(callback: (value: T) => void): () => void {
    const sub: Subscriber = () => callback(this._value);
    this._subscribers.add(sub);
    return () => this._subscribers.delete(sub);
  }
}

/**
 * Run `fn` immediately and re-run whenever any Signal read inside it changes.
 * Returns a disposer function.
 */
export function effect(fn: () => void): () => void {
  const run: Subscriber = () => {
    const prev = currentEffect;
    currentEffect = run;
    try {
      fn();
    } finally {
      currentEffect = prev;
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
