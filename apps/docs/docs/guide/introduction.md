---
sidebar_position: 1
---

# Introduction

Azmara Platform is a modern, data-first application runtime where your data layer is a first-class citizen, not an afterthought.

## What it is

Unlike modern stacks that bolt a database onto the side of a framework, Azmara puts data at the centre:

```
[ Reactive Signals ] → [ Query Engine ] → [ SQLite Persistence ] → [ React UI ]
                                ↑
                        [ AI Auto-Fix ]
```

## Core principles

- **Data-first** — your data layer is integrated, not external
- **Reactive by default** — UI updates automatically when data changes
- **Secure by design** — parameterised queries, sandboxed AI, tamper-evident logs
- **Type-safe throughout** — TypeScript with strict mode across all packages

## Packages

| Package | Purpose |
|---|---|
| `@azmara/core` | Reactive signals, effects, computed values |
| `@azmara/query` | Chainable, data-first query builder |
| `@azmara/db` | Secure SQLite adapter |
| `@azmara/ui` | React components wired to signals |
| `@azmara/ai` | AI auto-fix with isolated-vm sandbox |
| `@azmara/security` | Validation, audit logging, sanitisation |
| `@azmara/cli` | Command-line tooling |
