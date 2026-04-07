---
sidebar_position: 6
---

# @azmara/security

Shared security utilities — validation, audit logging, sanitisation, and env guards.

## Installation

```bash
pnpm add @azmara/security
```

## Validation

```typescript
import { validate, z } from "@azmara/security";

const UserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  balance: z.number().nonnegative(),
});

const user = validate(UserSchema, req.body);
// Throws structured error on failure — never leaks raw input
```

## Environment guard

Call once at startup to fail fast if required env vars are missing.

```typescript
import { validateEnv } from "@azmara/security";

validateEnv(["OPENAI_API_KEY", "AZMARA_ENCRYPTION_KEY"]);
```

## Audit logger

```typescript
import { createAuditLogger } from "@azmara/security";

const audit = createAuditLogger("my-service");
audit.log("user:login", { userId: "abc123" });
```

See [Audit Logging](/docs/security/audit-logging) for full details.

## Sanitisation

```typescript
import { assertSafeIdentifier, assertSafePath, sanitiseForLog } from "@azmara/security";

assertSafeIdentifier("customers");       // passes
assertSafeIdentifier("users; DROP TABLE"); // throws

assertSafePath("/data/user.db", "/data"); // passes
assertSafePath("../../etc/passwd", "/data"); // throws

sanitiseForLog(userInput); // strips null bytes, flattens newlines, truncates
```

## API Reference

| Export | Description |
|---|---|
| `validate(schema, data)` | Zod parse with structured error |
| `validateEnv(keys)` | Assert env vars present at startup |
| `createAuditLogger(context)` | Hash-chained tamper-evident logger |
| `assertSafeIdentifier(value)` | Validate SQL identifier |
| `assertSafePath(path, base)` | Prevent path traversal |
| `sanitiseForLog(value)` | Safe string for log output |
| `z` | Re-exported Zod instance |
