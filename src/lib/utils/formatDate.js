/**
 * Format a UTC timestamp to the user's local timezone.
 * Uses Intl.DateTimeFormat for browser-native locale handling.
 */

/**
 * Format date as "Sep 7, 2026, 11:30 PM"
 * @param {string|Date} date - ISO date string or Date object
 * @param {object} options - Intl.DateTimeFormat options override
 * @returns {string} Formatted date string in user's locale
 */
export function formatDate(date, options = {}) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...options,
  }).format(d);
}

/**
 * Format date as "Sep 7, 2026" (no time)
 */
export function formatDateShort(date) {
  return formatDate(date, {
    hour: undefined,
    minute: undefined,
    hour12: undefined,
  });
}

/**
 * Format as relative time: "2 hours ago", "3 days ago"
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const now = new Date();
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}w ago`;

  return formatDateShort(date);
}
