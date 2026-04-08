/**
 * Renders an array of objects as an ASCII table for terminal output.
 */
export function renderTable(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "  (no rows returned)";

  const cols = Object.keys(rows[0]!);
  const widths = cols.map((col) =>
    Math.max(col.length, ...rows.map((r) => String(r[col] ?? "").length)),
  );

  const sep = "+" + widths.map((w) => "-".repeat(w + 2)).join("+") + "+";
  const header =
    "|" + cols.map((c, i) => ` ${c.padEnd(widths[i]!)} `).join("|") + "|";
  const dataRows = rows.map(
    (row) =>
      "|" +
      cols
        .map((c, i) => ` ${String(row[c] ?? "").padEnd(widths[i]!)} `)
        .join("|") +
      "|",
  );

  return [sep, header, sep, ...dataRows, sep].join("\n");
}
