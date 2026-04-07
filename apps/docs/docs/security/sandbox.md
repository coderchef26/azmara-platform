---
sidebar_position: 3
---

# AI Sandbox

All AI-generated code runs inside a secure V8 isolate before being applied to any file.

## Why not vm2?

`vm2` was the standard choice for years but was [officially deprecated in 2023](https://github.com/patriksimek/vm2/issues/533) with multiple unfixed sandbox escape CVEs. Azmara uses `isolated-vm` which creates a true **V8 isolate** — a completely separate heap with no shared memory or prototype chain.

## Sandbox constraints

| Property | Value |
|---|---|
| Node.js API access | ❌ None |
| File system access | ❌ None |
| Network access | ❌ None |
| Memory limit | 64 MB |
| Execution timeout | 5 seconds |
| Globals exposed | None |

## Usage

```typescript
import { runInSandbox } from "@azmara/ai";

const result = await runInSandbox(`
  const nums = [1, 2, 3, 4, 5];
  nums.reduce((a, b) => a + b, 0);
`);

if (result.success) {
  console.log(result.output); // 15
}
```

## Auto-fix pipeline

When `autoFix()` is called:

```
1. Validate file path (assertSafePath)
2. Read original file
3. Request AI suggestion (OpenAI API)
4. Run suggestion through V8 isolate sandbox
5. If sandbox passes → apply to file
6. If sandbox fails → revert, log error
7. Write audit log entry regardless of outcome
```

:::info Manual approval
`autoApprove` defaults to `false`. The fix is shown for review before being applied. Set `autoApprove: true` only in trusted CI environments.
:::
