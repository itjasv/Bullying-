import Link from "next/link";
import styles from "./Footer.module.css";

const QUICK_LINKS = [
  { href: "/report", label: "Report" },
  { href: "/track", label: "Track" },
  { href: "/resources", label: "Resources" },
  { href: "/feedback", label: "Feedback" },
];

const INFO_LINKS = [
  { href: "/about", label: "About" },
  { href: "/promise", label: "Our Promise" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const SOCIAL = [
  { href: "https://instagram.com/ragraksha", label: "Instagram", icon: "IG" },
  { href: "https://x.com/ragraksha", label: "X (Twitter)", icon: "X" },
  { href: "https://linkedin.com/company/ragraksha", label: "LinkedIn", icon: "LI" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brandCol}>
            <span className={styles.brand}>RagRaksha</span>
            <p className={styles.tagline}>
              A safer tomorrow, together.
            </p>
            <div className={styles.socials}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linkCol}>
            <p className={styles.colTitle}>Platform</p>
            <nav className={styles.colNav}>
              {QUICK_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Info Links */}
          <div className={styles.linkCol}>
            <p className={styles.colTitle}>Information</p>
            <nav className={styles.colNav}>
              {INFO_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <span className={styles.copy}>&copy; {new Date().getFullYear()} RagRaksha. All rights reserved.</span>
          <span className={styles.legalLinks}>
            <Link href="/privacy">Privacy</Link>
            <span className={styles.dot}>&middot;</span>
            <Link href="/terms">Terms</Link>
          </span>
          <span className={styles.legal}>
            This platform does not store IP addresses or browser fingerprints.
          </span>
        </div>
      </div>
    </footer>
  );
}
