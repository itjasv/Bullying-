import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./ClosingCTA.module.css";

export default function ClosingCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.handwritten}>you deserve to feel safe</p>
        <h2 className={styles.heading}>
          Ready when you are. No pressure. No rush.
        </h2>
        <p className={styles.desc}>
          You can come back anytime. This page is not going anywhere.
          When you are ready, it takes about 2 minutes.
        </p>
        <div className={styles.actions}>
          <Link href="/report" className="btn btn-primary btn-lg">
            Report a concern
            <ArrowRight size={16} />
          </Link>
          <Link href="/resources" className="btn btn-ghost">
            Browse resources first
          </Link>
        </div>
      </div>
    </section>
  );
}
