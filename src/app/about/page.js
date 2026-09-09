import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./about.module.css";

export const metadata = {
  title: "About SafeVoice",
  description: "Learn about SafeVoice, our mission to end bullying through anonymous reporting, and the team behind the platform.",
};

const TEAM = [
  { name: "Shreya Aggarwal", role: "Project Lead" },
  { name: "Poorvi Aggarwal", role: "Lead Administrator" },
  { name: "Rituraj Sharma", role: "Administrator" },
  { name: "Utkarsh Lohan", role: "Administrator" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.soul}>why we built this</p>
          <h1 className={styles.heading}>About SafeVoice</h1>

          <div className={styles.mission}>
            <p className={styles.missionText}>
              SafeVoice was born from a simple truth: too many students suffer in silence because they have nowhere safe to speak.
            </p>
            <p className={styles.missionBody}>
              We built this platform to give every student a way to report bullying without fear. No names. No judgment. No risk of retaliation. Just a secure channel between someone who needs help and someone who can provide it.
            </p>
            <p className={styles.missionBody}>
              Every report is read by a real person. Every case is tracked from submission to resolution. Every piece of evidence is permanently destroyed after the case is closed.
            </p>
            <p className={styles.missionBody}>
              This is not a product. This is a promise.
            </p>
          </div>

          <div className={styles.values}>
            <h2 className={styles.subHeading}>What we believe</h2>
            <div className={styles.valueList}>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>Privacy is non-negotiable</h3>
                <p className={styles.valueDesc}>We do not track, fingerprint, or identify anyone who submits a report anonymously. Period.</p>
              </div>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>Every voice matters</h3>
                <p className={styles.valueDesc}>Whether it happened once or a hundred times, whether it was physical or digital, your experience is valid.</p>
              </div>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>Action, not awareness</h3>
                <p className={styles.valueDesc}>We do not just raise awareness. We built a system that moves from report to resolution.</p>
              </div>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>Transparency with reporters</h3>
                <p className={styles.valueDesc}>You can track your report at any time. You will know what is happening, every step of the way.</p>
              </div>
            </div>
          </div>

          <div className={styles.team}>
            <h2 className={styles.subHeading}>The team</h2>
            <div className={styles.teamGrid}>
              {TEAM.map((t, i) => (
                <div key={i} className={styles.teamCard}>
                  <p className={styles.teamName}>{t.name}</p>
                  <p className={styles.teamRole}>{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
