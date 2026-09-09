"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "D" },
  { href: "/admin/reports", label: "Reports", icon: "R" },
  { href: "/admin/messages", label: "Messages", icon: "M" },
  { href: "/admin/users", label: "Users", icon: "U" },
  { href: "/admin/feedback", label: "Feedback", icon: "F" },
  { href: "/admin/analytics", label: "Analytics", icon: "A" },
  { href: "/admin/logs", label: "Logs", icon: "L" },
  { href: "/admin/settings", label: "Settings", icon: "S" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.brand}>
            {collapsed ? "SV" : "SafeVoice"}
          </Link>
          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? ">" : "<"}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navActive : ""}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navItem}>
            <span className={styles.navIcon}>H</span>
            {!collapsed && <span className={styles.navLabel}>Back to Site</span>}
          </Link>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
