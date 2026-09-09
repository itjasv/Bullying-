import styles from "./Mechanism.module.css";

const LEFT_STEPS = [
  {
    num: 1,
    title: "Describe what happened",
    desc: "Select a category, write a description, and optionally attach images, videos, or audio. All fields are validated before you can submit.",
    active: true,
  },
  {
    num: 2,
    title: "Set a tracking passphrase",
    desc: "Choose a secret phrase only you know. Combined with your Report ID, this lets you check status and communicate with admins later.",
  },
  {
    num: 3,
    title: "Get your Report ID",
    desc: "After submitting, you receive a unique ID like RPT-2026-A3F29B1C. Save it somewhere safe. This is your only way to access your report.",
    hasCode: true,
  },
];

const RIGHT_STEPS = [
  {
    num: 4,
    title: "Admin reviews your report",
    desc: "A real person reads every report within 24 to 48 hours. They assess severity, gather context, and begin the resolution process.",
  },
  {
    num: 5,
    title: "Track progress and communicate",
    desc: "Use your Report ID and passphrase to check status updates, read admin notes, and send messages. All without revealing who you are.",
  },
];

export default function Mechanism() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>Five steps. Then it is out of your hands.</h2>
          <p className={styles.desc}>
            The process takes about 2 minutes. After you submit, administrators
            are notified and begin review. You can check status anytime.
          </p>
        </div>

        <div className={styles.columns}>
          {/* Left column: Your steps */}
          <div className={styles.steps}>
            {LEFT_STEPS.map((s, i) => (
              <div key={s.num}>
                <div className={`${styles.step} ${s.active ? styles.stepActive : ""}`}>
                  <div className={styles.stepMarker}>
                    <span className={styles.stepNum}>{s.num}</span>
                  </div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepDesc}>
                      {s.hasCode ? (
                        <>
                          After submitting, you receive a unique ID like{" "}
                          <span className={styles.system}>RPT-2026-A3F29B1C</span>.
                          Save it somewhere safe. This is your only way to access your report.
                        </>
                      ) : s.desc}
                    </p>
                  </div>
                </div>
                {i < LEFT_STEPS.length - 1 && <div className={styles.connector} />}
              </div>
            ))}
          </div>

          {/* Right column: What happens next (desktop only) */}
          <div className={styles.steps}>
            {RIGHT_STEPS.map((s, i) => (
              <div key={s.num}>
                <div className={styles.step}>
                  <div className={styles.stepMarker}>
                    <span className={styles.stepNum}>{s.num}</span>
                  </div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{s.title}</h3>
                    <p className={styles.stepDesc}>{s.desc}</p>
                  </div>
                </div>
                {i < RIGHT_STEPS.length - 1 && <div className={styles.connector} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
