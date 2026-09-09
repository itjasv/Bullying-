import crypto from "crypto";

/**
 * Generates a cryptographically unique, human-readable report ID.
 * Format: RPT-YYYY-XXXXXXXXXXXX (12 random hex chars)
 * Yields ~281 trillion unique combinations per year.
 */
export function generateReportId() {
  const year = new Date().getUTCFullYear();
  const randomPart = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `RPT-${year}-${randomPart}`;
}
