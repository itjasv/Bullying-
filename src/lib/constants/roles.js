/**
 * User role definitions and permissions.
 */
export const ROLES = {
  user: {
    label: "User",
    description: "Standard user who can submit and track reports",
    permissions: ["submit_report", "track_report", "view_own_reports", "send_messages"],
  },
  admin: {
    label: "Admin",
    description: "Case manager with access to all reports and communications",
    permissions: [
      "submit_report",
      "track_report",
      "view_all_reports",
      "update_status",
      "send_messages",
      "add_notes",
      "flag_reports",
      "merge_reports",
      "soft_delete",
      "view_analytics",
      "manage_feedback",
      "manage_contacts",
      "view_logs",
    ],
  },
  super_admin: {
    label: "Super Admin",
    description: "Full access including user management and permanent deletion",
    permissions: [
      "submit_report",
      "track_report",
      "view_all_reports",
      "update_status",
      "send_messages",
      "add_notes",
      "flag_reports",
      "merge_reports",
      "soft_delete",
      "permanent_delete",
      "view_analytics",
      "manage_feedback",
      "manage_contacts",
      "manage_users",
      "manage_admins",
      "view_logs",
      "manage_settings",
      "view_job_logs",
    ],
  },
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role, permission) {
  const roleDef = ROLES[role];
  if (!roleDef) return false;
  return roleDef.permissions.includes(permission);
}

/**
 * Admin-level roles.
 */
export const ADMIN_ROLES = ["admin", "super_admin"];
