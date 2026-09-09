"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "../dashboard.module.css";
import astyles from "./analytics.module.css";

export default function AdminAnalytics() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30); // days

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - range);

      const { data } = await supabase
        .from("reports")
        .select("id, type, severity, status, created_at")
        .eq("is_deleted", false)
        .gte("created_at", cutoff.toISOString())
        .order("created_at", { ascending: true });

      setReports(data || []);
      setLoading(false);
    }
    load();
  }, [range]);

  // Compute distributions
  const byType = {};
  const bySeverity = {};
  const byStatus = {};
  const byDay = {};

  reports.forEach((r) => {
    byType[r.type] = (byType[r.type] || 0) + 1;
    bySeverity[r.severity] = (bySeverity[r.severity] || 0) + 1;
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    const day = new Date(r.created_at).toLocaleDateString();
    byDay[day] = (byDay[day] || 0) + 1;
  });

  const maxPerDay = Math.max(...Object.values(byDay), 1);

  const SEV_COLORS = { low: "#34d399", medium: "#fbbf24", high: "#fb923c", critical: "#ef4444" };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Analytics</h1>
        <div className={astyles.rangePicker}>
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              className={`${astyles.rangeBtn} ${range === d ? astyles.rangeBtnActive : ""}`}
              onClick={() => { setRange(d); setLoading(true); }}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Loading analytics...</p>
      ) : reports.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No reports in the last {range} days.</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Total ({range}d)</p>
              <p className={styles.statValue}>{reports.length}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Avg / Day</p>
              <p className={styles.statValue}>{(reports.length / range).toFixed(1)}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Critical</p>
              <p className={styles.statValue} style={{ color: "#ef4444" }}>{bySeverity.critical || 0}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Resolved</p>
              <p className={styles.statValue} style={{ color: "#34d399" }}>{byStatus.resolved || 0}</p>
            </div>
          </div>

          {/* Reports per day bar chart */}
          <div className={astyles.chartSection}>
            <h3 className={styles.sectionTitle}>Reports Over Time</h3>
            <div className={astyles.barChart}>
              {Object.entries(byDay).map(([day, count]) => (
                <div key={day} className={astyles.barCol}>
                  <div className={astyles.bar} style={{ height: (count / maxPerDay * 100) + "%" }} />
                  <span className={astyles.barLabel}>{day.split("/").slice(0, 2).join("/")}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution grids */}
          <div className={astyles.distRow}>
            <div className={astyles.distCard}>
              <h3 className={styles.sectionTitle}>By Type</h3>
              <div className={astyles.distList}>
                {Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                  <div key={k} className={astyles.distItem}>
                    <span className={astyles.distLabel}>{k}</span>
                    <div className={astyles.distBarWrap}>
                      <div className={astyles.distBar} style={{ width: (v / reports.length * 100) + "%" }} />
                    </div>
                    <span className={astyles.distCount}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={astyles.distCard}>
              <h3 className={styles.sectionTitle}>By Severity</h3>
              <div className={astyles.distList}>
                {Object.entries(bySeverity).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                  <div key={k} className={astyles.distItem}>
                    <span className={astyles.distLabel}>{k}</span>
                    <div className={astyles.distBarWrap}>
                      <div className={astyles.distBar} style={{ width: (v / reports.length * 100) + "%", background: SEV_COLORS[k] || "var(--primary)" }} />
                    </div>
                    <span className={astyles.distCount}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
