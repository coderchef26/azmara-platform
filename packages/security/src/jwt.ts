import crypto from "node:crypto";

export interface JWTPayload {
  /** Subject — typically a user ID. */
  sub: string;
  /** Issued-at (Unix seconds). */
  iat: number;
  /** Expiry (Unix seconds). */
  exp: number;
  [key: string]: unknown;
}

export interface JWTOptions {
  /** Token lifetime in milliseconds. Defaults to 15 minutes. */
  expiresInMs?: number;
}

/**
 * Minimal HMAC-SHA256 JWT implementation using Node's built-in crypto.
 * No third-party dependencies — no supply chain surface.
 *
 * Security properties:
 * - Signatures verified with `crypto.timingSafeEqual` (timing-safe comparison)
 * - Short-lived tokens by default (15 min)
 * - Expiry enforced on every verify call
 *
 * Limitations:
 * - HS256 only — suitable for single-service use where the signing key stays server-side
 * - No key rotation built-in — rotate by changing the secret and invalidating existing sessions
 */
export function createJWT(secret: string) {
  if (!secret || secret.length < 32) {
    throw new Error("[azmara/security] JWT secret must be at least 32 characters");
  }

  const key = Buffer.from(secret, "utf-8");

  function sign(
    payload: Omit<JWTPayload, "iat" | "exp">,
    options: JWTOptions = {},
  ): string {
    const { expiresInMs = 15 * 60 * 1000 } = options;
    const now = Math.floor(Date.now() / 1000);

    // biome-ignore lint/suspicious/noExplicitAny: spread of Omit<JWTPayload> + iat/exp is always a valid JWTPayload
    const fullPayload = { ...payload, iat: now, exp: now + Math.floor(expiresInMs / 1000) } as JWTPayload;

    const header = toBase64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const body = toBase64url(JSON.stringify(fullPayload));
    const sig = toBase64url(
      crypto.createHmac("sha256", key).update(`${header}.${body}`).digest(),
    );

    return `${header}.${body}.${sig}`;
  }

  function verify(token: string): JWTPayload {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("[azmara/security] Invalid JWT format");
    }

    const [header, body, sig] = parts as [string, string, string];
    const expected = toBase64url(
      crypto.createHmac("sha256", key).update(`${header}.${body}`).digest(),
    );

    const sigBuf = Buffer.from(sig, "base64url");
    const expBuf = Buffer.from(expected, "base64url");

    if (
      sigBuf.length !== expBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expBuf)
    ) {
      throw new Error("[azmara/security] Invalid JWT signature");
    }

    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf-8"),
    ) as JWTPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error("[azmara/security] JWT expired");
    }

    return payload;
  }

  return { sign, verify };
}

function toBase64url(input: string | Buffer): string {
  const buf = typeof input === "string" ? Buffer.from(input, "utf-8") : input;
  return buf.toString("base64url");
}

export type JWT = ReturnType<typeof createJWT>;
