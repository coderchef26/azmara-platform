# Security Overview

Security is not an add-on in Azmara — it is baked into every layer.

## Threat model

| Threat | Mitigation |
|---|---|
| SQL injection | Parameterised queries only; identifier validation |
| Path traversal | `assertSafePath()` checks all file operations |
| Eval / code injection | No `eval`, no string predicates; AI code runs in V8 isolate |
| XSS | React JSX escaping; no `dangerouslySetInnerHTML` |
| Infinite loops | Effect depth limit (100) in `@azmara/core` |
| Log tampering | SHA-256 hash chain in audit log |
| Secrets exposure | `validateEnv()` fails fast; `.env` never committed |
| Dependency attacks | `pnpm audit` in CI; `onlyBuiltDependencies` allowlist |

## Audit logging

Every mutation in `@azmara/db` and every AI fix attempt is written to a tamper-evident log. Each entry contains a SHA-256 hash of its content chained to the previous entry — modifying any entry breaks the chain.

See [Audit Logging](/security/audit-logging) for details.

## AI sandbox

AI-generated code is executed inside a **V8 isolate** via `isolated-vm` before being applied. The sandbox has:
- No access to Node.js APIs
- No file system or network access
- Memory limit: 64 MB
- Execution timeout: 5 seconds

See [Sandbox](/security/sandbox) for details.

## OWASP alignment

| OWASP Risk | Status |
|---|---|
| A03 Injection | Parameterised queries, no eval |
| A05 Security Misconfiguration | Strict PRAGMAs, env validation |
| A09 Logging & Monitoring | Hash-chained audit log |
| A08 Software & Data Integrity | V8 isolate sandbox for AI code |
