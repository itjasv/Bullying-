import styles from "./AfterReport.module.css";

export default function AfterReport() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <h2 className={styles.heading}>
            After you submit, it does not disappear into nothing.
          </h2>
          <p className={styles.desc}>
            Your report goes directly to trained administrators who review
            every submission. You can check status anytime using your
            Report ID and passphrase.
          </p>
        </div>

        <div className={styles.timeline}>
          <div className={styles.event}>
            <div className={styles.eventDot} />
            <div className={styles.eventContent}>
              <span className={styles.eventTime}>Immediately</span>
              <p className={styles.eventText}>
                Your report is received and logged. Admins are notified.
              </p>
            </div>
          </div>

          <div className={styles.eventLine} />

          <div className={styles.event}>
            <div className={styles.eventDot} />
            <div className={styles.eventContent}>
              <span className={styles.eventTime}>Within 24 hours</span>
              <p className={styles.eventText}>
                An admin reviews the report and begins assessment.
                Status changes to under review.
              </p>
            </div>
          </div>

          <div className={styles.eventLine} />

          <div className={styles.event}>
            <div className={styles.eventDot} />
            <div className={styles.eventContent}>
              <span className={styles.eventTime}>Ongoing</span>
              <p className={styles.eventText}>
                Admins can leave notes on your report. Check back with
                your ID and passphrase to read updates.
              </p>
            </div>
          </div>

          <div className={styles.eventLine} />

          <div className={styles.event}>
            <div className={styles.eventDot} />
            <div className={styles.eventContent}>
              <span className={styles.eventTime}>Resolution</span>
              <p className={styles.eventText}>
                When action has been taken, the report is marked resolved.
                You will see the outcome when you check status.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
