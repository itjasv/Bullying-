import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h1 className={styles.headline}>
            Nobody should have to go through this alone.
          </h1>
          <p className={styles.subline}>
            If you are being bullied, or you have seen someone being bullied,
            this is a safe, anonymous place to report it. No names. No accounts.
            No one will know it was you.
          </p>
          <div className={styles.actions}>
            <Link href="/report" className={`btn btn-primary btn-lg ${styles.cta}`}>
              Report a concern
              <ArrowRight size={16} />
            </Link>
            <Link href="/track" className="btn btn-ghost">
              Track existing report
            </Link>
          </div>
        </div>

        <div className={styles.reassurance}>
          <div className={`${styles.note} ${styles.note1}`}>It is not your fault.</div>
          <div className={`${styles.note} ${styles.note2}`}>What you are feeling is valid.</div>
          <div className={`${styles.note} ${styles.note3}`}>You do not have to explain everything.</div>
          <div className={`${styles.note} ${styles.note4}`}>This stays between you and the system.</div>
          <div className={`${styles.note} ${styles.note5}`}>It takes courage to speak up.</div>
          <div className={`${styles.note} ${styles.noteHighlight}`}>You are safe here.</div>
          <div className={`${styles.note} ${styles.note6}`}>No one is watching you read this.</div>
          <div className={`${styles.note} ${styles.note7}`}>You can leave anytime. No pressure.</div>
          <div className={`${styles.note} ${styles.note8}`}>Someone will listen.</div>
        </div>
      </div>
    </section>
  );
}
