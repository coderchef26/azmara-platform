# @azmara/ui

React components wired to reactive Signals. The `Grid` component re-renders automatically when its Signal changes — no state management needed.

## Install

```bash
pnpm add @azmara/ui @azmara/core react react-dom
# or
npm install @azmara/ui @azmara/core react react-dom
```

## Grid

```tsx
import { Signal } from "@azmara/core";
import { Grid } from "@azmara/ui";

const customers = new Signal([
  { name: "Aroha", balance: 150 },
  { name: "Mere",  balance: 320 },
]);

function App() {
  return (
    <Grid
      signal={customers}
      labels={{ name: "Customer", balance: "Balance ($)" }}
    />
  );
}

// Grid updates automatically
customers.set([...customers.peek(), { name: "Tane", balance: 0 }]);
```

## useSignal

Hook to subscribe any React component to a Signal.

```tsx
import { useSignal } from "@azmara/ui";

function Counter({ count }: { count: Signal<number> }) {
  const value = useSignal(count); // push-based, no polling
  return <span>{value}</span>;
}
```

## Grid Props

| Prop | Type | Description |
|---|---|---|
| `signal` | `Signal<T[]>` | Reactive data source |
| `columns` | `(keyof T)[]` | Optional column order |
| `labels` | `Partial<Record<keyof T, string>>` | Optional column label overrides |
| `emptyMessage` | `string` | Message shown when Signal is empty |

All cell values are rendered through React's JSX escaping — `dangerouslySetInnerHTML` is never used.

## Requirements

- Node.js ≥ 18
- React 18 or 19
- TypeScript ≥ 5 (types included)

## Documentation

Full docs at [docs.azmara.io](https://docs.azmara.io)

## License

MIT © [Azmara Technologies](https://azmara.io)
