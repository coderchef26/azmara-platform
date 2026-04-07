# Installation

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- For `@azmara/ai` (isolated-vm): Visual Studio 2022 with "Desktop development with C++" workload

## Clone & install

```bash
git clone https://github.com/coderchef26/azmara-platform.git
cd azmara-platform
pnpm install
```

## Environment setup

```bash
cp .env.example .env
# Fill in AZMARA_ENCRYPTION_KEY and OPENAI_API_KEY
```

Generate an encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Build all packages

```bash
pnpm build
```

## Run the playground

```bash
pnpm --filter @azmara/playground dev
```

## Native module note (isolated-vm)

`@azmara/ai` requires native compilation. On Windows:

1. Install **Visual Studio 2022** with "Desktop development with C++" workload
2. Run: `pnpm rebuild isolated-vm`
