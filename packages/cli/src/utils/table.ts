/**
 * Renders an array of objects as an ASCII table for terminal output.
 */
export function renderTable(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "  (no rows returned)";

  // biome-ignore lint/style/noNonNullAssertion: rows.length === 0 checked above
  const cols = Object.keys(rows[0]!);
  const widths = cols.map((col) =>
    Math.max(col.length, ...rows.map((r) => String(r[col] ?? "").length)),
  );

  const sep = `+${widths.map((w) => "-".repeat(w + 2)).join("+")}+`;
  // biome-ignore lint/style/noNonNullAssertion: widths is same length as cols — constructed from cols above
  const header = `|${cols.map((c, i) => ` ${c.padEnd(widths[i]!)} `).join("|")}|`;
  const dataRows = rows.map(
    // biome-ignore lint/style/noNonNullAssertion: widths is same length as cols — constructed from cols above
    (row) => `|${cols.map((c, i) => ` ${String(row[c] ?? "").padEnd(widths[i]!)} `).join("|")}|`,
  );

  return [sep, header, sep, ...dataRows, sep].join("\n");
}
