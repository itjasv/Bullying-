/**
 * Admin email whitelist.
 * These emails get admin/super_admin role on Google OAuth signup.
 * Also checked in middleware for admin route access.
 */

export const ADMIN_EMAILS = [
  "shreya22012006@gmail.com",
  "aggarwalpoorvi05@gmail.com",
  "rituraj2004.sharma@gmail.com",
  "lohanutkarsh289@gmail.com",
  "stejasvi817@gmail.com",
];

export const SUPER_ADMIN_EMAILS = [
  "aggarwalpoorvi05@gmail.com",
  "stejasvi817@gmail.com",
];

export function isAdminEmail(email) {
  return ADMIN_EMAILS.includes(email?.toLowerCase());
}

export function isSuperAdminEmail(email) {
  return SUPER_ADMIN_EMAILS.includes(email?.toLowerCase());
}
