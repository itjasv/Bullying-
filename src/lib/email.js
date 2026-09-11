import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = "RagRaksha <notifications@ragraksha.in>";

/**
 * Send email notification. Fails silently if Resend is not configured.
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
async function send(to, subject, html) {
  if (!resend) return;
  try {
    await resend.emails.send({ from: FROM, to, subject, html });
  } catch (err) {
    console.error("[Email] Failed to send:", err.message);
  }
}

/**
 * Notify admins about a new report submission.
 */
export async function notifyNewReport(reportId, type, severity) {
  const adminEmails = [
    "shreya22012006@gmail.com",
    "aggarwalpoorvi05@gmail.com",
    "rituraj2004.sharma@gmail.com",
    "lohanutkarsh289@gmail.com",
    "stejasvi817@gmail.com",
  ];

  const sevColor = {
    low: "#34d399", medium: "#fbbf24", high: "#fb923c", critical: "#ef4444",
  };

  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0E1011; color: #fff; border-radius: 8px;">
      <h2 style="font-size: 20px; margin-bottom: 8px; color: #f2f2f2;">New Report Submitted</h2>
      <table style="width: 100%; font-size: 14px; color: rgba(255,255,255,0.7);">
        <tr><td style="padding: 6px 0;">Report ID</td><td style="font-family: monospace; color: #5B9A8B;">${reportId}</td></tr>
        <tr><td style="padding: 6px 0;">Type</td><td style="text-transform: capitalize;">${type}</td></tr>
        <tr><td style="padding: 6px 0;">Severity</td><td style="color: ${sevColor[severity] || "#fff"}; text-transform: capitalize;">${severity}</td></tr>
      </table>
      <p style="margin-top: 16px; font-size: 13px; color: rgba(255,255,255,0.4);">
        Log in to the admin panel to review this report.
      </p>
    </div>
  `;

  for (const email of adminEmails) {
    await send(email, `[RagRaksha] New ${severity} report: ${reportId}`, html);
  }
}

/**
 * Notify admins about a status change.
 */
export async function notifyStatusChange(reportId, oldStatus, newStatus, changedBy) {
  const adminEmails = [
    "shreya22012006@gmail.com",
    "aggarwalpoorvi05@gmail.com",
    "rituraj2004.sharma@gmail.com",
    "lohanutkarsh289@gmail.com",
    "stejasvi817@gmail.com",
  ];

  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0E1011; color: #fff; border-radius: 8px;">
      <h2 style="font-size: 20px; margin-bottom: 8px; color: #f2f2f2;">Report Status Updated</h2>
      <table style="width: 100%; font-size: 14px; color: rgba(255,255,255,0.7);">
        <tr><td style="padding: 6px 0;">Report ID</td><td style="font-family: monospace; color: #5B9A8B;">${reportId}</td></tr>
        <tr><td style="padding: 6px 0;">Previous</td><td style="text-transform: capitalize;">${oldStatus.replace(/_/g, " ")}</td></tr>
        <tr><td style="padding: 6px 0;">New Status</td><td style="text-transform: capitalize; color: #5B9A8B;">${newStatus.replace(/_/g, " ")}</td></tr>
      </table>
      <p style="margin-top: 16px; font-size: 13px; color: rgba(255,255,255,0.4);">
        Updated by: ${changedBy || "System"}
      </p>
    </div>
  `;

  for (const email of adminEmails) {
    await send(email, `[RagRaksha] Status update: ${reportId}`, html);
  }
}

/**
 * Send a daily digest summary to admins.
 */
export async function notifyDailyDigest(stats) {
  const adminEmails = [
    "shreya22012006@gmail.com",
    "stejasvi817@gmail.com",
  ];

  const html = `
    <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #0E1011; color: #fff; border-radius: 8px;">
      <h2 style="font-size: 20px; margin-bottom: 12px; color: #f2f2f2;">Daily Digest</h2>
      <table style="width: 100%; font-size: 14px; color: rgba(255,255,255,0.7);">
        <tr><td style="padding: 6px 0;">New reports (24h)</td><td style="font-family: monospace;">${stats.newReports}</td></tr>
        <tr><td style="padding: 6px 0;">Pending review</td><td style="font-family: monospace;">${stats.pendingReview}</td></tr>
        <tr><td style="padding: 6px 0;">Critical</td><td style="font-family: monospace; color: #ef4444;">${stats.critical}</td></tr>
        <tr><td style="padding: 6px 0;">Resolved (24h)</td><td style="font-family: monospace; color: #34d399;">${stats.resolved}</td></tr>
      </table>
      <p style="margin-top: 16px; font-size: 13px; color: rgba(255,255,255,0.4);">
        RagRaksha Admin Panel
      </p>
    </div>
  `;

  for (const email of adminEmails) {
    await send(email, `[RagRaksha] Daily Digest - ${new Date().toLocaleDateString("en-IN")}`, html);
  }
}
