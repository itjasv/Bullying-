"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./dashboard.module.css";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();
        setUser(userData);

        const { data: userReports } = await supabase
          .from("reports")
          .select("id, report_id, type, severity, status, created_at, updated_at, description")
          .eq("submitted_by", authUser.id)
          .eq("is_deleted", false)
          .order("created_at", { ascending: false })
          .limit(20);
        setReports(userReports || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleWithdraw = async (report) => {
    if (!window.confirm(`Withdraw report ${report.report_id}? This will mark it as closed and cannot be undone.`)) return;
    setWithdrawing(report.id);
    const supabase = createClient();
    await supabase.from("reports").update({
      status: "closed",
      updated_at: new Date().toISOString(),
    }).eq("id", report.id);

    await supabase.from("status_history").insert({
      report_id: report.id,
      old_status: report.status,
      new_status: "closed",
      changed_by: (await supabase.auth.getUser()).data.user?.id,
      note: "Withdrawn by reporter",
    });

    setReports((prev) => prev.map((r) => r.id === report.id ? { ...r, status: "closed" } : r));
    setWithdrawing(null);
  };

  const handleExport = () => {
    const data = {
      account: {
        email: user.email,
        display_name: user.display_name,
        role: user.role,
        joined: user.created_at,
      },
      reports: reports.map((r) => ({
        report_id: r.report_id,
        type: r.type,
        severity: r.severity,
        status: r.status,
        description: r.description,
        submitted: r.created_at,
        last_updated: r.updated_at,
      })),
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ragraksha-data-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you absolutely sure? This will permanently delete your account and all associated data. This action cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    const userId = (await supabase.auth.getUser()).data.user?.id;

    // Soft-delete user reports
    await supabase.from("reports").update({ is_deleted: true }).eq("submitted_by", userId);

    // Delete user record
    await supabase.from("users").delete().eq("id", userId);

    // Sign out
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const statusColor = (s) => {
    const map = {
      submitted: "#94a3b8", received: "#60a5fa", under_review: "#fbbf24",
      investigation: "#fb923c", action_taken: "#818cf8", resolved: "#34d399",
      closed: "#94a3b8", dismissed: "#ef4444",
    };
    return map[s] || "var(--text-low)";
  };

  const canWithdraw = (status) => ["submitted", "received", "under_review"].includes(status);

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.soul}>welcome back</p>
          <h1 className={styles.heading}>Dashboard</h1>

          {loading ? (
            <p className={styles.loadingText}>Loading...</p>
          ) : user ? (
            <>
              {/* Profile Card */}
              <div className={styles.profileCard}>
                <div className={styles.profileRow}>
                  <span className={styles.profileLabel}>Email</span>
                  <span>{user.email}</span>
                </div>
                <div className={styles.profileRow}>
                  <span className={styles.profileLabel}>Name</span>
                  <span>{user.display_name || "Not set"}</span>
                </div>
                <div className={styles.profileRow}>
                  <span className={styles.profileLabel}>Role</span>
                  <span style={{ textTransform: "capitalize" }}>{user.role?.replace("_", " ")}</span>
                </div>
                <div className={styles.profileRow}>
                  <span className={styles.profileLabel}>Joined</span>
                  <span>{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {(user.role === "admin" || user.role === "super_admin") && (
                <a href="/admin" className="btn btn-primary" style={{ marginTop: 16 }}>
                  Go to Admin Panel
                </a>
              )}

              {/* Report History */}
              <div className={styles.historySection}>
                <h2 className={styles.historyTitle}>Your Reports</h2>
                <p className={styles.historyDesc}>
                  Reports you submitted while signed in appear here. Anonymous reports are tracked separately using Report ID and passphrase.
                </p>

                {reports.length === 0 ? (
                  <div className={styles.emptyHistory}>
                    <p className={styles.emptyText}>No reports submitted from this account yet.</p>
                    <p className={styles.emptyHint}>
                      You can submit anonymously without signing in, or sign in first to keep a record here.
                    </p>
                  </div>
                ) : (
                  <div className={styles.reportList}>
                    {reports.map((r) => (
                      <div key={r.report_id} className={styles.reportCard}>
                        <div className={styles.reportHeader}>
                          <code className={styles.reportId}>{r.report_id}</code>
                          <span className={styles.reportStatus} style={{ color: statusColor(r.status), borderColor: statusColor(r.status) }}>
                            {r.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className={styles.reportMeta}>
                          <span style={{ textTransform: "capitalize" }}>{r.type}</span>
                          <span className={styles.reportDot} />
                          <span style={{ textTransform: "capitalize" }}>{r.severity}</span>
                          <span className={styles.reportDot} />
                          <span>{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                        {r.updated_at !== r.created_at && (
                          <p className={styles.reportUpdated}>
                            Last updated: {new Date(r.updated_at).toLocaleDateString()}
                          </p>
                        )}
                        {canWithdraw(r.status) && (
                          <button
                            className={styles.withdrawBtn}
                            onClick={() => handleWithdraw(r)}
                            disabled={withdrawing === r.id}
                          >
                            {withdrawing === r.id ? "Withdrawing..." : "Withdraw Report"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <a href="/report" className="btn btn-secondary">Submit a Report</a>
                <a href="/track" className="btn btn-secondary">Track a Report</a>
                <button className="btn btn-ghost" onClick={handleExport}>Export My Data</button>
                <button className="btn btn-ghost" onClick={handleLogout}>Sign Out</button>
              </div>

              {/* Danger Zone */}
              <div className={styles.dangerZone}>
                <h3 className={styles.dangerTitle}>Danger Zone</h3>
                <p className={styles.dangerDesc}>
                  Permanently delete your account and all associated data. This action cannot be reversed.
                </p>
                {!confirmDelete ? (
                  <button className={styles.dangerBtn} onClick={() => setConfirmDelete(true)}>
                    Delete My Account
                  </button>
                ) : (
                  <div className={styles.dangerConfirm}>
                    <p className={styles.dangerWarn}>This is permanent. All your data will be deleted.</p>
                    <div style={{ display: "flex", gap: "var(--space-2)" }}>
                      <button className={styles.dangerBtn} onClick={handleDeleteAccount} disabled={deleting}>
                        {deleting ? "Deleting..." : "Yes, Delete Everything"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className={styles.loadingText}>Could not load user data.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
