"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./dashboard.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      // Fetch counts by status
      const { data: reports } = await supabase
        .from("reports")
        .select("id, status, severity, created_at, type, report_id")
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

      if (reports) {
        const counts = { total: reports.length, submitted: 0, received: 0, under_review: 0, investigation: 0, action_taken: 0, resolved: 0, closed: 0, dismissed: 0 };
        reports.forEach((r) => { counts[r.status] = (counts[r.status] || 0) + 1; });
        setStats(counts);
        setRecent(reports.slice(0, 10));
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Dashboard</h1>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    );
  }

  const STAT_CARDS = [
    { label: "Total Reports", value: stats?.total || 0, color: "var(--text-high)" },
    { label: "Pending", value: (stats?.submitted || 0) + (stats?.received || 0), color: "var(--warning)" },
    { label: "In Progress", value: (stats?.under_review || 0) + (stats?.investigation || 0), color: "var(--primary)" },
    { label: "Action Taken", value: stats?.action_taken || 0, color: "#60a5fa" },
    { label: "Resolved", value: stats?.resolved || 0, color: "#34d399" },
    { label: "Dismissed", value: stats?.dismissed || 0, color: "var(--text-low)" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Dashboard</h1>
        <p className={styles.subtitle}>Overview of all reports and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card, i) => (
          <div key={i} className={styles.statCard}>
            <p className={styles.statLabel}>{card.label}</p>
            <p className={styles.statValue} style={{ color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Reports</h2>
        {recent.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No reports yet. All clear.</p>
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id}>
                    <td><code className={styles.mono}>{r.report_id}</code></td>
                    <td>{r.type}</td>
                    <td><span className={`${styles.badge} ${styles["sev_" + r.severity]}`}>{r.severity}</span></td>
                    <td><span className={`${styles.badge} ${styles["st_" + r.status]}`}>{r.status.replace("_", " ")}</span></td>
                    <td className={styles.dateCell}>{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
