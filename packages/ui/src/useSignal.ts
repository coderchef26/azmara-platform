import { useEffect, useState } from "react";
import type { Signal } from "@azmara/core";

/**
 * React hook that subscribes to a Signal and triggers re-renders on change.
 */
export function useSignal<T>(signal: Signal<T>): T {
  const [value, setValue] = useState<T>(() => signal.get());

  useEffect(() => {
    setValue(signal.get());
    return signal.subscribe(setValue);
  }, [signal]);

  return value;
}
