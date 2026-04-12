# @azmr/security

## 0.1.0

### Minor Changes

- 0a51a60: Phase 3 security hardening

  - `@azmr/security`: add `createRateLimiter` — sliding-window in-memory rate limiter with per-key tracking
  - `@azmr/security`: add `createJWT` — HMAC-SHA256 JWT using Node built-in crypto, timing-safe verification, 15-min default expiry
  - `@azmr/db`: add `createColumnEncryption` — AES-256-GCM column-level encryption with scrypt key derivation and GCM auth tag tamper detection
  - `@azmr/cli`: add `audit:verify` command — recomputes SHA-256 hashes and validates prevHash chain integrity of audit log files
