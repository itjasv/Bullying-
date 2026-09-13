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
  {
    href: "https://www.instagram.com/ragraksha?stkn=azBkcW94ODBsaXUx",
    label: "Instagram",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
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
