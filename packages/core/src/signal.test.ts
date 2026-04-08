import { describe, expect, it, vi } from "vitest";
import { Signal, computed, effect } from "./signal.js";

describe("Signal", () => {
  it("returns initial value", () => {
    const s = new Signal(42);
    expect(s.get()).toBe(42);
  });

  it("updates value on set", () => {
    const s = new Signal(0);
    s.set(10);
    expect(s.get()).toBe(10);
  });

  it("does not notify when value is unchanged", () => {
    const s = new Signal(5);
    const fn = vi.fn(() => s.get());
    effect(fn);
    fn.mockClear();
    s.set(5); // same value
    expect(fn).not.toHaveBeenCalled();
  });
});

describe("effect", () => {
  it("runs immediately", () => {
    const fn = vi.fn();
    effect(fn);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("re-runs when a read signal changes", () => {
    const s = new Signal(1);
    const fn = vi.fn(() => s.get());
    effect(fn);
    expect(fn).toHaveBeenCalledTimes(1);
    s.set(2);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("does not run unboundedly when an effect writes its own signal", () => {
    // The scheduler's generation guard allows at most one re-run per flush
    // cycle when an effect both reads and writes the same signal.
    const s = new Signal(0);
    const fn = vi.fn(() => {
      s.get();
      s.set(s.peek() + 1);
    });
    effect(fn);
    // Initial run + one re-run from the queued set — then deduplicated. Never unbounded.
    expect(fn.mock.calls.length).toBeLessThanOrEqual(3);
    expect(s.peek()).toBeGreaterThan(0);
  });
});

describe("computed", () => {
  it("derives value from signal", () => {
    const price = new Signal(100);
    const doubled = computed(() => price.get() * 2);
    expect(doubled.get()).toBe(200);
    price.set(50);
    expect(doubled.get()).toBe(100);
  });
});
