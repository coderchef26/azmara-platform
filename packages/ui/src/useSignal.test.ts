import { describe, expect, it } from "vitest";
import { Signal } from "@azmara/core";

// useSignal is a React hook — full render tests go in a future pass
// with @testing-library/react. These tests cover the Signal interaction layer.

describe("useSignal — Signal contract", () => {
  it("Signal initial value is readable", () => {
    const sig = new Signal(42);
    expect(sig.get()).toBe(42);
  });

  it("Signal update is reflected on next get", () => {
    const sig = new Signal<string[]>(["a", "b"]);
    sig.set(["a", "b", "c"]);
    expect(sig.get()).toHaveLength(3);
  });

  it("Signal with object array does not mutate on set", () => {
    const original = [{ id: 1 }, { id: 2 }];
    const sig = new Signal(original);
    const updated = [{ id: 1 }, { id: 2 }, { id: 3 }];
    sig.set(updated);
    expect(original).toHaveLength(2);
    expect(sig.get()).toHaveLength(3);
  });
});
