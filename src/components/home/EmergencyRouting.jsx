import styles from "./EmergencyRouting.module.css";

export default function EmergencyRouting() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h3 className={styles.heading}>Immediate danger?</h3>
          <p className={styles.desc}>
            If you or someone else is at risk of physical harm right now, do
            not use this form. Contact emergency services directly.
          </p>
          <div className={styles.routes}>
            <a href="tel:112" className={styles.route}>
              <span className={styles.routeLabel}>Emergency</span>
              <span className={styles.routeValue}>Call 112</span>
            </a>
            <span className={styles.divider} />
            <a href="tel:1098" className={styles.route}>
              <span className={styles.routeLabel}>Childline India</span>
              <span className={styles.routeValue}>Call 1098</span>
            </a>
            <span className={styles.divider} />
            <a href="tel:9152987821" className={styles.route}>
              <span className={styles.routeLabel}>iCall Helpline</span>
              <span className={styles.routeValue}>9152987821</span>
            </a>
            <span className={styles.divider} />
            <a href="tel:08046110007" className={styles.route}>
              <span className={styles.routeLabel}>Vandrevala Foundation</span>
              <span className={styles.routeValue}>1860-2662-345</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
