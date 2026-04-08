#!/usr/bin/env node
import { sanitiseForLog } from "@azmara/security";
import { init } from "./commands/init.js";
import { dbQuery } from "./commands/db-query.js";

const [, , command, ...args] = process.argv;

const COMMANDS: Record<string, (args: string[]) => void | Promise<void>> = {
  version(_args) {
    console.log("azmara v0.0.1");
  },

  help(_args) {
    console.log(`
  Azmara CLI

  Usage:
    azmara <command> [options]

  Commands:
    init <name>              Scaffold a new Azmara app
    db:query <db> "<sql>"    Run a SELECT query against a local SQLite database
    version                  Print CLI version
    help                     Show this help message

  Coming soon:
    fix <file>               AI-assisted code fix (requires API key)
    audit:verify             Verify audit log chain integrity

  Examples:
    azmara init my-app
    azmara db:query .azmara/app.db "SELECT * FROM customers"
    azmara db:query .azmara/app.db "SELECT name, balance FROM customers WHERE balance > 0"
`);
  },

  init,
  "db:query": dbQuery,
};

async function main() {
  if (!command) {
    COMMANDS["help"]!([]);
    process.exit(0);
  }

  const handler = COMMANDS[command];
  if (!handler) {
    console.error(
      `\n  Unknown command: "${sanitiseForLog(command)}"\n  Run "azmara help" for usage.\n`,
    );
    process.exit(1);
  }

  await handler(args);
}

main().catch((err) => {
  console.error(
    "\n  [azmara] Fatal error:",
    err instanceof Error ? err.message : String(err),
    "\n",
  );
  process.exit(1);
});
