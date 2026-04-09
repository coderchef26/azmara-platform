import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const TAG_BYTES = 16;
const KEY_BYTES = 32;
const SALT = "azmara-db-v1";

/**
 * AES-256-GCM column-level encryption helper.
 *
 * Derives a 256-bit key from the provided secret using scrypt (salt is
 * deterministic and version-tagged — rotate SALT if key derivation needs
 * to change). Each encrypt call uses a fresh random IV so identical
 * plaintexts produce different ciphertexts.
 *
 * Security properties:
 * - AES-256-GCM: authenticated encryption — detects tampering
 * - scrypt key derivation — memory-hard, resists brute-force
 * - Random IV per encrypt call — no IV reuse
 *
 * Usage:
 *   const enc = createColumnEncryption(process.env.DB_ENCRYPTION_KEY!)
 *   const cipher = enc.encrypt(sensitiveValue)   // store this in DB
 *   const plain  = enc.decrypt(cipher)           // restore on read
 *
 * IMPORTANT: Never log the secret or the plaintext of encrypted columns.
 */
export function createColumnEncryption(secret: string) {
  if (!secret || secret.length < 16) {
    throw new Error("[azmara/db] Encryption secret must be at least 16 characters");
  }

  const key = crypto.scryptSync(secret, SALT, KEY_BYTES);

  return {
    encrypt(plaintext: string): string {
      const iv = crypto.randomBytes(IV_BYTES);
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
      const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf-8"),
        cipher.final(),
      ]);
      const tag = cipher.getAuthTag();
      // Layout: [iv (12)] [tag (16)] [ciphertext]
      return Buffer.concat([iv, tag, encrypted]).toString("base64");
    },

    decrypt(ciphertext: string): string {
      const buf = Buffer.from(ciphertext, "base64");

      if (buf.length < IV_BYTES + TAG_BYTES) {
        throw new Error("[azmara/db] Invalid encrypted column — data too short");
      }

      const iv = buf.subarray(0, IV_BYTES);
      const tag = buf.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
      const encrypted = buf.subarray(IV_BYTES + TAG_BYTES);

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);

      return (
        decipher.update(encrypted, undefined, "utf-8") +
        decipher.final("utf-8")
      );
    },
  };
}

export type ColumnEncryption = ReturnType<typeof createColumnEncryption>;
