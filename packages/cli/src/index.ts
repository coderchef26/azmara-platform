#!/usr/bin/env node
import { sanitiseForLog } from "@azmara/security";

const [, , command, ...args] = process.argv;

const COMMANDS: Record<string, () => void | Promise<void>> = {
  version() {
    console.log("azmara v0.0.1");
  },
  help() {
    console.log(`
Azmara CLI

Usage:
  azmara <command> [options]

Commands:
  version    Print CLI version
  help       Show this help message

Coming soon:
  init       Scaffold a new Azmara app
  fix        Run AI auto-fix on a file (requires OPENAI_API_KEY)
  db:query   Query a local SQLite database
`);
  },
};

async function main() {
  if (!command) {
    COMMANDS["help"]?.();
    process.exit(0);
  }

  const handler = COMMANDS[command];
  if (!handler) {
    console.error(`Unknown command: "${sanitiseForLog(command)}"\nRun "azmara help" for usage.`);
    process.exit(1);
  }

  await handler();
}

main().catch((err) => {
  console.error("[azmara] Fatal error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
