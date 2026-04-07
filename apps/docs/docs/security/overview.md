---
sidebar_position: 1
---

# Security Overview

Security is not an add-on in Azmara — it is baked into every layer from the ground up.

## Threat model

| Threat | Where | Mitigation |
|---|---|---|
| SQL injection | `@azmara/db` | Parameterised queries only; identifier validation |
| Path traversal | `@azmara/db`, `@azmara/ai` | `assertSafePath()` on all file operations |
| Eval / code injection | `@azmara/ai` | No `eval`; AI code runs in V8 isolate (isolated-vm) |
| XSS | `@azmara/ui` | React JSX escaping; no `dangerouslySetInnerHTML` |
| Reactive infinite loops | `@azmara/core` | Effect depth limit (100) with descriptive error |
| Log tampering | `@azmara/security` | SHA-256 hash chain — any modification breaks chain |
| Missing secrets | All | `validateEnv()` fails fast at startup |
| Dependency attacks | Root | `pnpm.onlyBuiltDependencies` allowlist; `pnpm audit` |

## OWASP Top 10 alignment

| OWASP Risk | Status | Implementation |
|---|---|---|
| A01 Broken Access Control | 🔲 Phase 3 | JWT auth skeleton planned |
| A02 Cryptographic Failures | 🔲 Phase 3 | Column encryption planned |
| A03 Injection | ✅ Done | Parameterised queries, no eval, identifier validation |
| A04 Insecure Design | ✅ Done | Threat-modelled from day one |
| A05 Security Misconfiguration | ✅ Done | WAL/secure_delete PRAGMAs, env validation |
| A06 Vulnerable Components | ✅ Done | `onlyBuiltDependencies`, `pnpm audit` |
| A08 Software & Data Integrity | ✅ Done | V8 isolate sandbox for all AI code |
| A09 Logging & Monitoring | ✅ Done | Hash-chained tamper-evident audit log |
| A10 SSRF | 🔲 Phase 3 | URL allowlisting planned for AI fetch |

## Security layers

```
┌─────────────────────────────────┐
│  @azmara/security               │  ← Validation, audit log, sanitisation
├─────────────────────────────────┤
│  @azmara/db                     │  ← Parameterised SQL, identifier guards
├─────────────────────────────────┤
│  @azmara/ai                     │  ← V8 isolate sandbox (isolated-vm)
├─────────────────────────────────┤
│  @azmara/core                   │  ← Effect depth guard
└─────────────────────────────────┘
```
