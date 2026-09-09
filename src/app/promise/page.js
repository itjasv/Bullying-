import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./promise.module.css";

export const metadata = {
  title: "Our Promise",
  description: "The promises we make to every person who uses this platform.",
};

const PROMISES = [
  {
    vow: "We will never know who you are.",
    detail: "No IP addresses. No device fingerprints. No cookies that track you. When you submit anonymously, you are invisible. Even to us.",
  },
  {
    vow: "Your words will be read by a real person.",
    detail: "Not an algorithm. Not a bot. A human being who cares. Every single report is reviewed personally by our team.",
  },
  {
    vow: "We will act.",
    detail: "Your report does not disappear into a void. It enters a system designed to move from submission to resolution. We track every step.",
  },
  {
    vow: "We will never share your report.",
    detail: "Your information stays between you and the admin team. It will never be shared with anyone else without a legal requirement.",
  },
  {
    vow: "Your evidence will be destroyed.",
    detail: "30 days after your case is resolved, all uploaded files (images, videos, audio) are permanently purged from our servers. Gone forever.",
  },
  {
    vow: "You can speak freely.",
    detail: "There is no wrong way to report. Your words don't need to be perfect. Say it however it comes out. We will understand.",
  },
  {
    vow: "You can come back anytime.",
    detail: "Your Report ID and passphrase are yours. Use them to check status, send messages, or just see that someone is working on it.",
  },
  {
    vow: "We will not judge you.",
    detail: "Whether it happened once or a hundred times. Whether you fought back or stayed silent. Whether you're reporting for yourself or someone else. We are here.",
  },
];

export default function PromisePage() {
  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          {/* Opening */}
          <div className={styles.opening}>
            <p className={styles.soul}>before you begin</p>
            <h1 className={styles.heading}>The promises we make to you.</h1>
          </div>

          {/* Promise cards — staggered, handwritten feel */}
          <div className={styles.promiseList}>
            {PROMISES.map((p, i) => (
              <div key={i} className={styles.promiseCard}>
                <p className={styles.promiseNum}>{String(i + 1).padStart(2, "0")}</p>
                <div>
                  <p className={styles.vow}>{p.vow}</p>
                  <p className={styles.detail}>{p.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing */}
          <div className={styles.closing}>
            <p className={styles.closingSoul}>this is not a product.</p>
            <p className={styles.closingSoul}>this is a promise.</p>
            <div className={styles.closingLine} />
            <p className={styles.closingNote}>The SafeVoice Team</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
