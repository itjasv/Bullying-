/**
 * Report status definitions and valid transitions.
 * Status can only move forward, never backward.
 */

export const STATUSES = {
  submitted: {
    label: "Submitted",
    color: "status-submitted",
    description: "Report has been submitted and is awaiting admin review",
  },
  received: {
    label: "Received",
    color: "status-received",
    description: "Admin has acknowledged the report",
  },
  under_review: {
    label: "Under Review",
    color: "status-under_review",
    description: "Report is being reviewed by the admin team",
  },
  investigation: {
    label: "Investigation",
    color: "status-investigation",
    description: "Report has been escalated to a formal investigation",
  },
  action_taken: {
    label: "Action Taken",
    color: "status-action_taken",
    description: "Corrective action has been performed",
  },
  resolved: {
    label: "Resolved",
    color: "status-resolved",
    description: "Case has been resolved positively",
  },
  closed: {
    label: "Closed",
    color: "status-closed",
    description: "Case has been closed",
  },
  dismissed: {
    label: "Dismissed",
    color: "status-dismissed",
    description: "Report was determined to be not actionable",
  },
};

/**
 * Valid forward-only status transitions.
 * Key = current status, Value = array of allowed next statuses.
 */
export const STATUS_TRANSITIONS = {
  submitted: ["received"],
  received: ["under_review", "closed"],
  under_review: ["investigation", "resolved", "closed", "dismissed"],
  investigation: ["action_taken", "dismissed"],
  action_taken: ["resolved", "closed"],
  resolved: [],
  closed: [],
  dismissed: [],
};

/**
 * Terminal statuses (trigger archival after 7 days).
 */
export const TERMINAL_STATUSES = ["resolved", "closed", "dismissed"];

/**
 * Check if a status transition is valid.
 */
export function isValidTransition(currentStatus, newStatus) {
  const allowed = STATUS_TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(newStatus);
}

/**
 * Status display order for timeline rendering.
 */
export const STATUS_ORDER = [
  "submitted",
  "received",
  "under_review",
  "investigation",
  "action_taken",
  "resolved",
  "closed",
  "dismissed",
];
