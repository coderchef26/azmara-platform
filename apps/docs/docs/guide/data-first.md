---
sidebar_position: 5
---

# Data-First Philosophy

Azmara is built around a single idea: **your data layer should not be an external dependency — it should be the foundation**.

## The FoxPro insight

Microsoft FoxPro was ahead of its time. In the 1990s it gave developers:
- A built-in database engine (no separate DB to install)
- A query language tightly integrated with the app
- A UI system that was directly coupled to data

Modern stacks fragmented this. You now wire together a database driver, an ORM, a state management library, a UI framework, and an API layer — just to show a list of records.

## What Azmara restores

```
FoxPro (1990s)          Azmara (now)
──────────────          ────────────
Built-in DB engine  →   @azmara/db (SQLite, zero config)
xBase query syntax  →   @azmara/query (type-safe, chainable)
Reactive forms/UI   →   @azmara/core + @azmara/ui (Signals → React)
All-in-one IDE      →   @azmara/cli (scaffolding + tooling)
```

## The difference from FoxPro

Azmara is not FoxPro reimplemented. It takes the philosophy — data first — and applies it to the modern TypeScript ecosystem:

- Type-safe throughout (FoxPro was loosely typed)
- Secure by design (FoxPro had no concept of injection attacks)
- Cloud-ready (FoxPro was desktop-only)
- React-compatible (modern UI layer)
- AI-augmented (self-improving code)
