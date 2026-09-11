import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./privacy.module.css";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.soul}>your data, your rights</p>
          <h1 className={styles.heading}>Privacy Policy</h1>
          <p className={styles.updated}>Last updated: September 2026</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. What We Collect</h2>
            <p className={styles.body}>
              RagRaksha is built on a foundation of privacy. We collect only the minimum data necessary to process bullying reports and provide you with a safe experience.
            </p>
            <ul className={styles.list}>
              <li><span className={styles.emphasis}>Report data:</span> Type, severity, description, location, incident date, and evidence files you voluntarily submit.</li>
              <li><span className={styles.emphasis}>Passphrase:</span> A one-way hashed version of your tracking passphrase. We cannot read or recover it.</li>
              <li><span className={styles.emphasis}>Account data (if signed in):</span> Google profile name, email, and avatar from OAuth. Used for authentication only.</li>
              <li><span className={styles.emphasis}>Messages:</span> Content exchanged between reporters and admins through the secure messaging system.</li>
              <li><span className={styles.emphasis}>Feedback &amp; contact:</span> Ratings, comments, and contact form submissions.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. What We Do NOT Collect</h2>
            <ul className={styles.list}>
              <li>IP addresses are <span className={styles.emphasis}>not stored</span> in any database table.</li>
              <li>Browser fingerprints are <span className={styles.emphasis}>not collected</span>.</li>
              <li>We do <span className={styles.emphasis}>not use</span> cookies for tracking, analytics, or advertising.</li>
              <li>We do <span className={styles.emphasis}>not share</span> any data with third-party advertisers or data brokers.</li>
              <li>Anonymous reports have <span className={styles.emphasis}>no link</span> to any user identity.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Use Your Data</h2>
            <ul className={styles.list}>
              <li>To process, investigate, and resolve bullying reports.</li>
              <li>To enable two-way communication between reporters and administrators.</li>
              <li>To generate anonymized platform statistics (total reports, resolution rates).</li>
              <li>To send email notifications about report status changes (admin only).</li>
              <li>To improve the platform based on feedback submissions.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Retention &amp; Destruction</h2>
            <p className={styles.body}>
              We take data minimization seriously. Our automated systems enforce strict retention policies:
            </p>
            <ul className={styles.list}>
              <li><span className={styles.emphasis}>Evidence files</span> (images, videos, audio) are permanently deleted from storage 30 days after a case reaches terminal status (resolved, closed, or dismissed).</li>
              <li><span className={styles.emphasis}>Archived reports</span> are automatically archived 7 days after reaching terminal status.</li>
              <li><span className={styles.emphasis}>Soft-deleted data</span> is permanently and irreversibly purged 90 days after deletion.</li>
              <li><span className={styles.emphasis}>Admin audit logs</span> older than 6 months are automatically rotated.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Data Security</h2>
            <ul className={styles.list}>
              <li>All data is encrypted in transit (TLS/HTTPS) and at rest (AES-256 via Supabase).</li>
              <li>Passphrases are stored as irreversible cryptographic hashes (SHA-256).</li>
              <li>Row-Level Security (RLS) policies enforce access control at the database level.</li>
              <li>Admin access requires Google OAuth with email whitelist verification.</li>
              <li>API endpoints are protected by rate limiting and honeypot anti-spam measures.</li>
              <li>Evidence files are stored in a private, non-public storage bucket.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Your Rights</h2>
            <ul className={styles.list}>
              <li>You can <span className={styles.emphasis}>withdraw</span> any report you submitted while logged in.</li>
              <li>You can <span className={styles.emphasis}>export</span> all your data from the dashboard.</li>
              <li>You can <span className={styles.emphasis}>delete your account</span> and all associated data at any time.</li>
              <li>You can submit reports <span className={styles.emphasis}>anonymously</span> without creating an account.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Third-Party Services</h2>
            <ul className={styles.list}>
              <li><span className={styles.emphasis}>Supabase:</span> Database hosting and authentication (PostgreSQL, encrypted at rest).</li>
              <li><span className={styles.emphasis}>Vercel:</span> Application hosting and edge delivery.</li>
              <li><span className={styles.emphasis}>Google OAuth:</span> Authentication provider (only for optional sign-in).</li>
              <li><span className={styles.emphasis}>Resend:</span> Transactional email delivery (admin notifications only).</li>
            </ul>
            <p className={styles.body}>
              None of these services receive report content or evidence files. They process only what is necessary for their function.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Children&apos;s Privacy</h2>
            <p className={styles.body}>
              RagRaksha is designed to be used by students of all ages. We do not knowingly collect personally identifiable information from children under 13 beyond what is voluntarily submitted in reports. All reports can be submitted anonymously.
            </p>
          </div>

          <div className={styles.contactNote}>
            <p>
              Questions about this policy? Reach out at <a href="/contact">ragraksha.in/contact</a> or email the admin team directly.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
