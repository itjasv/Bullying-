import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "../privacy/privacy.module.css";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.soul}>ground rules</p>
          <h1 className={styles.heading}>Terms of Service</h1>
          <p className={styles.updated}>Last updated: September 2026</p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.body}>
              By accessing or using RagRaksha ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Platform.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Purpose of the Platform</h2>
            <p className={styles.body}>
              RagRaksha is an anonymous bullying reporting platform designed to help students report incidents of bullying safely and confidentially. The Platform connects reporters with trained administrators who review and act on reports.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Acceptable Use</h2>
            <p className={styles.body}>You agree to use the Platform only for its intended purpose. You must not:</p>
            <ul className={styles.list}>
              <li>Submit <span className={styles.emphasis}>false or fabricated reports</span> with the intent to harm, defame, or harass another person.</li>
              <li>Use the Platform to <span className={styles.emphasis}>threaten, intimidate, or bully</span> others.</li>
              <li>Upload <span className={styles.emphasis}>illegal, obscene, or harmful</span> content as evidence.</li>
              <li>Attempt to <span className={styles.emphasis}>identify anonymous reporters</span> or breach the confidentiality of reports.</li>
              <li>Attempt to <span className={styles.emphasis}>circumvent</span> rate limiting, security measures, or access controls.</li>
              <li>Use automated tools (bots, scrapers) to <span className={styles.emphasis}>spam</span> or abuse the Platform.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Reports and Anonymity</h2>
            <ul className={styles.list}>
              <li>Reports can be submitted <span className={styles.emphasis}>with or without</span> an account.</li>
              <li>Anonymous reports have <span className={styles.emphasis}>no identifying information</span> linked to the submitter.</li>
              <li>If you are signed in, your report is linked to your account and visible in your dashboard.</li>
              <li>You may <span className={styles.emphasis}>withdraw</span> a report at any time if submitted while logged in.</li>
              <li>Administrators cannot see your identity on anonymous reports.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Evidence and Content</h2>
            <ul className={styles.list}>
              <li>You retain ownership of any content (images, videos, audio) you upload as evidence.</li>
              <li>By uploading evidence, you grant RagRaksha a <span className={styles.emphasis}>limited license</span> to store and process it solely for the purpose of investigating the report.</li>
              <li>All evidence is <span className={styles.emphasis}>automatically deleted</span> 30 days after case resolution.</li>
              <li>Evidence is stored in private, encrypted storage and is accessible only to authorized administrators.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Accounts and Authentication</h2>
            <ul className={styles.list}>
              <li>Account creation is <span className={styles.emphasis}>optional</span>. You can use the Platform fully without signing in.</li>
              <li>If you create an account via Google OAuth, we store your name, email, and profile picture.</li>
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You may delete your account and all associated data at any time from the dashboard.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Administrator Responsibilities</h2>
            <p className={styles.body}>
              Administrators are authorized individuals who review reports, update statuses, communicate with reporters, and take appropriate action. Administrators agree to:
            </p>
            <ul className={styles.list}>
              <li>Treat all reports with <span className={styles.emphasis}>confidentiality and seriousness</span>.</li>
              <li>Not disclose reporter identities or report details outside the Platform.</li>
              <li>Act on reports in a <span className={styles.emphasis}>timely and fair</span> manner.</li>
              <li>Follow the Platform&apos;s code of conduct and ethical guidelines.</li>
            </ul>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Limitation of Liability</h2>
            <p className={styles.body}>
              RagRaksha is provided "as is" without warranties of any kind. While we strive to ensure the Platform operates reliably and securely, we cannot guarantee uninterrupted service. RagRaksha is not a substitute for emergency services. If you are in immediate danger, contact local authorities (112) or the Childline helpline (1098).
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Modifications</h2>
            <p className={styles.body}>
              We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the updated terms. Significant changes will be communicated through the Platform.
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Governing Law</h2>
            <p className={styles.body}>
              These terms are governed by the laws of India. Any disputes arising from the use of RagRaksha will be subject to the jurisdiction of Indian courts.
            </p>
          </div>

          <div className={styles.contactNote}>
            <p>
              Questions about these terms? Reach out at <a href="/contact">ragraksha.in/contact</a> or email the admin team directly.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
