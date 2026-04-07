# Audit Logging

`@azmara/security` provides a tamper-evident audit logger used across all platform packages.

## How it works

Each log entry contains:
- `timestamp` — ISO 8601 UTC
- `context` — which package logged it (e.g. `db`, `ai:sandbox`)
- `action` — what happened (e.g. `insert`, `sandbox:run:success`)
- `meta` — structured data (never passwords, tokens, or PII)
- `prevHash` — SHA-256 hash of the previous entry
- `hash` — SHA-256 hash of this entry's content + prevHash

Modifying any entry changes its hash, breaking the chain from that point forward — making tampering detectable.

## Usage

```typescript
import { createAuditLogger } from "@azmara/security";

const audit = createAuditLogger("my-service");

audit.log("user:login", { userId: "abc123" });
audit.log("data:export", { table: "customers", rowCount: 42 });
```

## Log location

Default: `.azmara/audit.log`

Override with environment variable:
```
AZMARA_AUDIT_LOG=/var/log/azmara/audit.log
```

## Important: what NOT to log

- Passwords or password hashes
- API keys or tokens
- Full PII (names + email + address together)
- Session tokens or JWTs
