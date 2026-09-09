"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "../dashboard.module.css";

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 30;

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from("admin_logs")
        .select("*, users:admin_id(email, display_name)")
        .order("created_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      setLogs(data || []);
      setLoading(false);
    }
    load();
  }, [page]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Activity Logs</h1>
        <p className={styles.subtitle}>Immutable audit trail of all admin actions.</p>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Loading logs...</p>
      ) : logs.length === 0 ? (
        <div className={styles.emptyState}><p className={styles.emptyText}>No activity logs yet.</p></div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Admin</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td className={styles.dateCell}>{new Date(l.created_at).toLocaleString()}</td>
                    <td>{l.users?.display_name || l.users?.email || "System"}</td>
                    <td style={{ textTransform: "capitalize" }}>{l.action?.replace(/_/g, " ")}</td>
                    <td><code className={styles.mono}>{l.target_type}: {l.target_id?.slice(0, 8) || "-"}</code></td>
                    <td style={{ fontSize: 12, maxWidth: 200, whiteSpace: "pre-wrap" }}>{l.details ? JSON.stringify(l.details, null, 0) : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-4)", marginTop: "var(--space-6)" }}>
            <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span style={{ fontSize: 13, color: "var(--text-mid)", fontFamily: "var(--font-mono)" }}>Page {page + 1}</span>
            <button className="btn btn-ghost btn-sm" disabled={logs.length < PAGE_SIZE} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}
