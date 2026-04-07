import { z } from "zod";

export { z };

/**
 * Validates `data` against `schema` and returns the parsed, typed result.
 * Throws a structured error on failure — never leaks raw input to error messages.
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    throw new Error(`[azmara/security] Validation failed:\n  ${issues.join("\n  ")}`);
  }
  return result.data;
}

/**
 * Asserts that all required environment variables are present at startup.
 * Call this once at the entry point of each app/service.
 */
export function validateEnv(required: string[]): void {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `[azmara/security] Missing required environment variables: ${missing.join(", ")}\n` +
        `  Copy .env.example to .env and fill in the missing values.`,
    );
  }
}
