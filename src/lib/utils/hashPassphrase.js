import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hash a plaintext passphrase using bcrypt.
 * @param {string} passphrase - The plaintext passphrase (min 6 chars)
 * @returns {Promise<string>} The bcrypt hash
 */
export async function hashPassphrase(passphrase) {
  return bcrypt.hash(passphrase, SALT_ROUNDS);
}

/**
 * Verify a plaintext passphrase against a bcrypt hash.
 * @param {string} passphrase - The plaintext passphrase to check
 * @param {string} hash - The stored bcrypt hash
 * @returns {Promise<boolean>} True if they match
 */
export async function verifyPassphrase(passphrase, hash) {
  return bcrypt.compare(passphrase, hash);
}
