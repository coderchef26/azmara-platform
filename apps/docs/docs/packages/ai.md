---
sidebar_position: 5
---

# @azmara/ai

AI auto-fix system with true V8 isolate sandboxing.

## Installation

```bash
pnpm add @azmara/ai
```

:::info Native module
`@azmara/ai` uses `isolated-vm` which requires compilation. See [Installation](/docs/guide/installation#native-module-note).
:::

## Sandbox

Run untrusted code inside a V8 isolate with no access to Node.js, the file system, or the network.

```typescript
import { runInSandbox } from "@azmara/ai";

const result = await runInSandbox(`
  const x = [1, 2, 3].reduce((a, b) => a + b, 0);
  x;
`);

if (result.success) {
  console.log(result.output); // 6
} else {
  console.error(result.error);
}
```

## Auto-Fix

AI-powered file improvement pipeline with mandatory sandbox check before applying.

```typescript
import { autoFix } from "@azmara/ai";

const result = await autoFix(
  "src/index.ts",
  "src",              // allowedBase — prevents path traversal
  { autoApprove: false } // manual review by default
);
```

:::warning
`OPENAI_API_KEY` must be set. The fix is sandboxed and logged to the audit trail before being applied.
:::

## API Reference

### `runInSandbox(code)`

| Property | Value |
|---|---|
| Memory limit | 64 MB |
| Timeout | 5 seconds |
| Node.js API access | None |
| File system access | None |

Returns `{ success: boolean, output?: unknown, error?: string }`.

### `autoFix(filePath, allowedBase, options)`

| Option | Default | Description |
|---|---|---|
| `autoApprove` | `false` | Apply fix automatically after sandbox check |
