"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/report", label: "Report" },
  { href: "/track", label: "Track" },
  { href: "/resources", label: "Resources" },
  { href: "/promise", label: "Our Promise" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Check auth state
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
      } catch {
        // Supabase not configured, ignore
      }
      setAuthChecked(true);
    }
    checkAuth();
  }, []);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            RagRaksha
          </Link>

          <div className={styles.links}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className={styles.right}>
            {authChecked && (
              user ? (
                <Link href="/dashboard" className={styles.authBtn}>
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className={styles.authBtn}>
                  Sign In
                </Link>
              )
            )}
            <button
              className={styles.toggle}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.mobileSheet} onClick={(e) => e.stopPropagation()}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ""}`}
              >
                {link.label}
              </Link>
            ))}
            <div className={styles.mobileDivider} />
            {user ? (
              <Link href="/dashboard" className={styles.mobileLink}>
                Dashboard
              </Link>
            ) : (
              <Link href="/login" className={styles.mobileLink}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
