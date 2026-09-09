import styles from "./PrivacyLedger.module.css";

export default function PrivacyLedger() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Your privacy is the architecture, not a feature</h2>
          <p className={styles.desc}>
            This platform was built from the ground up so that identifying you
            is structurally impossible. Not a policy choice. A technical one.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.cardNum}>01</span>
            <h3 className={styles.cardTitle}>No identity collected</h3>
            <p className={styles.cardDesc}>
              No email. No phone. No login. No cookies tracking who you are.
              You exist in this system only as a randomized Report ID.
            </p>
          </div>

          <div className={styles.card}>
            <span className={styles.cardNum}>02</span>
            <h3 className={styles.cardTitle}>No connection data stored</h3>
            <p className={styles.cardDesc}>
              Your <span className={styles.system}>IP address</span> and
              device metadata are never written to the database. There is no
              technical path from a report back to you.
            </p>
          </div>

          <div className={styles.card}>
            <span className={styles.cardNum}>03</span>
            <h3 className={styles.cardTitle}>Passphrase only you know</h3>
            <p className={styles.cardDesc}>
              You set a secret passphrase to access your report later.
              It is hashed with <span className={styles.system}>bcrypt</span> before
              storage. Admins cannot see it or recover it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
