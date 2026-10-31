/**
 * Password Hashing & Verification
 * Built with Node.js crypto using PBKDF2 with SHA-512 and random 16-byte salt.
 * Timing-safe comparison protects against side-channel timing attacks.
 */

import { randomBytes, pbkdf2Sync, timingSafeEqual } from "crypto";

const ITERATIONS = 100_000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";

/**
 * Hashes a plaintext password and returns `salt:hash` hex string.
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plaintext password against a stored `salt:hash` string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const parts = storedHash.split(":");
    if (parts.length !== 2) return false;

    const [salt, originalHash] = parts;
    const derivedKey = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
    const originalBuffer = Buffer.from(originalHash, "hex");

    if (derivedKey.length !== originalBuffer.length) return false;

    return timingSafeEqual(derivedKey, originalBuffer);
  } catch (err) {
    console.error("[verifyPassword] Error:", err);
    return false;
  }
}
