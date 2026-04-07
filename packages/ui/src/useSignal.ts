import { useEffect, useState } from "react";
import type { Signal } from "@azmara/core";

/**
 * React hook that subscribes to a Signal and triggers re-renders on change.
 * Uses a polling interval as a simple bridge — a proper subscription adapter
 * will be wired in a future pass once @azmara/core exposes a subscribe API.
 */
export function useSignal<T>(signal: Signal<T>): T {
  const [value, setValue] = useState<T>(() => signal.get());

  useEffect(() => {
    // Polling bridge — interval kept short for snappy UI
    // TODO: replace with signal.subscribe() once available
    const id = setInterval(() => {
      const current = signal.get();
      setValue((prev) => (Object.is(prev, current) ? prev : current));
    }, 16); // ~60fps

    return () => clearInterval(id);
  }, [signal]);

  return value;
}
