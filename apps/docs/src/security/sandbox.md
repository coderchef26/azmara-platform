# AI Sandbox

All AI-generated code in `@azmr/ai` is executed inside a secure sandbox before being applied.

## Why isolated-vm, not vm2

`vm2` was the common choice but was [officially deprecated](https://github.com/patriksimek/vm2/issues/533) due to multiple unfixed sandbox escape CVEs. Azmara uses `isolated-vm` which creates a true **V8 isolate** — a completely separate V8 heap with no shared memory.

## Sandbox constraints

| Property | Value |
|---|---|
| Node.js API access | None |
| File system access | None |
| Network access | None |
| Memory limit | 64 MB |
| Execution timeout | 5 seconds |
| Globals exposed | None (`global` reference only) |

## Usage

```typescript
import { runInSandbox } from "@azmr/ai";

const result = await runInSandbox(`
  const x = 1 + 1;
  x;
`);

if (result.success) {
  console.log(result.output); // 2
} else {
  console.error(result.error);
}
```

## Installation note

`isolated-vm` is a native module. Requires:
- **Windows**: Visual Studio 2022 with "Desktop development with C++" workload
- **macOS**: Xcode Command Line Tools
- **Linux**: `build-essential` + Python
