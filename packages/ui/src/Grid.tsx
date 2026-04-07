import type { Signal } from "@azmara/core";
import { useSignal } from "./useSignal.js";

interface GridProps<T extends Record<string, unknown>> {
  signal: Signal<T[]>;
  /** Optional column order. Defaults to keys from first row. */
  columns?: (keyof T)[];
  /** Optional label overrides per column key. */
  labels?: Partial<Record<keyof T, string>>;
  emptyMessage?: string;
}

/**
 * A reactive data grid that automatically re-renders when the Signal updates.
 * All cell values are rendered via React's JSX escaping — no dangerouslySetInnerHTML.
 */
export function Grid<T extends Record<string, unknown>>({
  signal,
  columns,
  labels,
  emptyMessage = "No records found.",
}: GridProps<T>) {
  const data = useSignal(signal);

  if (data.length === 0) {
    return <p style={{ color: "#888", fontStyle: "italic" }}>{emptyMessage}</p>;
  }

  const cols = (columns ?? Object.keys(data[0]!)) as (keyof T)[];

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {cols.map((col) => (
            <th
              key={String(col)}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                borderBottom: "2px solid #e2e8f0",
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
              }}
            >
              {labels?.[col] ?? String(col)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: row has no guaranteed unique ID at this layer
          <tr
            key={rowIndex}
            style={{ backgroundColor: rowIndex % 2 === 0 ? "#fff" : "#f9fafb" }}
          >
            {cols.map((col) => (
              <td
                key={String(col)}
                style={{
                  padding: "8px 12px",
                  borderBottom: "1px solid #e2e8f0",
                  fontSize: "0.875rem",
                  color: "#1f2937",
                }}
              >
                {/* React escapes this — safe against XSS */}
                {String(row[col] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
