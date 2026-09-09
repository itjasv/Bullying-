/**
 * Generate a UUID v4 idempotency key for form submissions.
 * Prevents duplicate submissions from double-clicks or network retries.
 * Generated client-side and sent with each submission.
 */
export function generateIdempotencyKey() {
  return crypto.randomUUID();
}
