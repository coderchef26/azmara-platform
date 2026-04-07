---
sidebar_position: 4
---

# Input Validation

All data entering the platform from external sources is validated with [Zod](https://zod.dev) before being processed.

## The rule

**Never trust input at the boundary.** Validate at the edge — API routes, CLI arguments, env vars — not deep inside business logic.

## validate()

```typescript
import { validate, z } from "@azmara/security";

const CreateCustomerSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  balance: z.number().nonnegative(),
});

// In an API route / server action:
const customer = validate(CreateCustomerSchema, req.body);
// customer is fully typed as { name: string, email: string, balance: number }
```

On failure, `validate()` throws with structured field-level errors — never leaking raw input back to the caller.

## validateEnv()

```typescript
import { validateEnv } from "@azmara/security";

// Call once at app startup — fails fast with a clear message
validateEnv([
  "OPENAI_API_KEY",
  "AZMARA_ENCRYPTION_KEY",
  "AZMARA_DB_PATH",
]);
```

## assertSafeIdentifier()

Used internally by `@azmara/db` before any SQL is built. Only allows `[a-zA-Z_][a-zA-Z0-9_]{0,63}`.

```typescript
import { assertSafeIdentifier } from "@azmara/security";

assertSafeIdentifier("customers");         // ✅ passes
assertSafeIdentifier("1invalid");          // ❌ throws
assertSafeIdentifier("users; DROP TABLE"); // ❌ throws
```

## assertSafePath()

Prevents path traversal — ensures a resolved path stays within an allowed base directory.

```typescript
import { assertSafePath } from "@azmara/security";

assertSafePath("/data/user.db", "/data");       // ✅ passes
assertSafePath("/data/../etc/passwd", "/data"); // ❌ throws
```
