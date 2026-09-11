"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { STATUSES, STATUS_TRANSITIONS, isValidTransition } from "@/lib/constants/statuses";
import styles from "../dashboard.module.css";
import rstyles from "./reports.module.css";

const PAGE_SIZE = 20;

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", severity: "", type: "", search: "" });
  const [selected, setSelected] = useState(null);
  const [statusNote, setStatusNote] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [page, setPage] = useState(0);

  const [evidence, setEvidence] = useState([]);
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  async function fetchReports() {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("reports")
      .select("*")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (filters.status) query = query.eq("status", filters.status);
    if (filters.severity) query = query.eq("severity", filters.severity);
    if (filters.type) query = query.eq("type", filters.type);
    if (filters.search) query = query.ilike("report_id", `%${filters.search}%`);

    const { data } = await query;
    setReports(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchReports(); }, [page, filters.status, filters.severity, filters.type]);

  const openReport = async (r) => {
    setSelected(r);
    setNewStatus("");
    setStatusNote("");
    setEvidence([]);
    setEvidenceLoading(true);

    try {
      const res = await fetch(`/api/admin/reports/${r.id}/evidence`);
      if (res.ok) {
        const data = await res.json();
        setEvidence(data.evidence || []);
      }
    } catch (err) {
      console.error("Failed to load evidence:", err);
    } finally {
      setEvidenceLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus || !statusNote.trim()) return;
    if (!isValidTransition(selected.status, newStatus)) return;

    setUpdating(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("reports")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", selected.id);

    if (!error) {
      // Log the status change
      await supabase.from("status_history").insert({
        report_id: selected.id,
        old_status: selected.status,
        new_status: newStatus,
        changed_by: (await supabase.auth.getUser()).data.user?.id,
        note: statusNote,
      });

      setSelected(null);
      setNewStatus("");
      setStatusNote("");
      fetchReports();
    }
    setUpdating(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Reports</h1>
        <p className={styles.subtitle}>Manage and review all submitted reports.</p>
      </div>

      {/* Filters */}
      <div className={rstyles.filters}>
        <input
          className="input"
          placeholder="Search by Report ID..."
          value={filters.search}
          onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && fetchReports()}
          style={{ maxWidth: 260 }}
        />
        <select className="input" value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}>
          <option value="">All Statuses</option>
          {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select className="input" value={filters.severity} onChange={(e) => setFilters((p) => ({ ...p, severity: e.target.value }))}>
          <option value="">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select className="input" value={filters.type} onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}>
          <option value="">All Types</option>
          <option value="verbal">Verbal</option>
          <option value="physical">Physical</option>
          <option value="cyber">Cyber</option>
          <option value="social">Social</option>
          <option value="sexual">Sexual</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p className={styles.loadingText}>Loading reports...</p>
      ) : reports.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>No reports match your filters.</p>
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
                <th>Flagged</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className={r.is_flagged ? rstyles.flaggedRow : ""}>
                  <td><code className={styles.mono}>{r.report_id}</code></td>
                  <td style={{ textTransform: "capitalize" }}>{r.type}</td>
                  <td><span className={`${styles.badge} ${styles["sev_" + r.severity]}`}>{r.severity}</span></td>
                  <td><span className={`${styles.badge} ${styles["st_" + r.status]}`}>{r.status.replace(/_/g, " ")}</span></td>
                  <td>{r.is_flagged ? "!" : ""}</td>
                  <td className={styles.dateCell}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => openReport(r)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className={rstyles.pagination}>
        <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
        <span className={rstyles.pageLabel}>Page {page + 1}</span>
        <button className="btn btn-ghost btn-sm" disabled={reports.length < PAGE_SIZE} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className={rstyles.overlay} onClick={() => setSelected(null)}>
          <div className={rstyles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={rstyles.modalHeader}>
              <h2 className={rstyles.modalTitle}>Report Detail</h2>
              <button className={rstyles.modalClose} onClick={() => setSelected(null)}>x</button>
            </div>

            <div className={rstyles.detailGrid}>
              <div className={rstyles.detailRow}><span className={rstyles.detailLabel}>Report ID</span><code className={styles.mono}>{selected.report_id}</code></div>
              <div className={rstyles.detailRow}><span className={rstyles.detailLabel}>Type</span><span style={{ textTransform: "capitalize" }}>{selected.type}</span></div>
              <div className={rstyles.detailRow}><span className={rstyles.detailLabel}>Severity</span><span className={`${styles.badge} ${styles["sev_" + selected.severity]}`}>{selected.severity}</span></div>
              <div className={rstyles.detailRow}><span className={rstyles.detailLabel}>Status</span><span className={`${styles.badge} ${styles["st_" + selected.status]}`}>{selected.status.replace(/_/g, " ")}</span></div>
              <div className={rstyles.detailRow}><span className={rstyles.detailLabel}>Submitted</span><span>{new Date(selected.created_at).toLocaleString()}</span></div>
              {selected.location && <div className={rstyles.detailRow}><span className={rstyles.detailLabel}>Location</span><span>{selected.location}</span></div>}
              {selected.incident_date && <div className={rstyles.detailRow}><span className={rstyles.detailLabel}>Incident Date</span><span>{new Date(selected.incident_date).toLocaleDateString()}</span></div>}
            </div>

            <div className={rstyles.descriptionBox}>
              <p className={rstyles.detailLabel}>Description</p>
              <p className={rstyles.descText}>{selected.description}</p>
            </div>

            {selected.involved_parties && (
              <div className={rstyles.descriptionBox}>
                <p className={rstyles.detailLabel}>Involved Parties</p>
                <p className={rstyles.descText}>{selected.involved_parties}</p>
              </div>
            )}

            {/* Evidence Section */}
            <div className={rstyles.evidenceSection}>
              <div className={rstyles.evidenceHeader}>
                <p className={rstyles.detailLabel}>Attached Evidence</p>
                <span className={rstyles.evidenceCount}>
                  {evidenceLoading ? "Loading..." : `${evidence.length} file${evidence.length === 1 ? "" : "s"}`}
                </span>
              </div>

              {evidenceLoading ? (
                <div className={rstyles.evidenceLoading}>
                  <span>Fetching evidence files securely...</span>
                </div>
              ) : evidence.length === 0 ? (
                <div className={rstyles.noEvidence}>
                  <p>No evidence files were attached to this report.</p>
                </div>
              ) : (
                <div className={rstyles.evidenceGrid}>
                  {evidence.map((item) => (
                    <div key={item.id} className={rstyles.evidenceCard}>
                      <div className={rstyles.evidenceMediaWrap}>
                        {item.purged ? (
                          <div className={rstyles.purgedNotice}>
                            <span>File purged per retention policy</span>
                          </div>
                        ) : item.media_type === "video" ? (
                          <video
                            src={item.signed_url}
                            controls
                            className={rstyles.evidenceVideo}
                            preload="metadata"
                          />
                        ) : item.media_type === "audio" ? (
                          <div className={rstyles.audioWrapper}>
                            <audio src={item.signed_url} controls className={rstyles.evidenceAudio} />
                          </div>
                        ) : (
                          <a href={item.signed_url} target="_blank" rel="noopener noreferrer" className={rstyles.imageLink}>
                            <img
                              src={item.signed_url}
                              alt={item.original_file_name || "Evidence"}
                              className={rstyles.evidenceImage}
                              loading="lazy"
                            />
                            <span className={rstyles.imageOverlay}>Open Full Image ↗</span>
                          </a>
                        )}
                      </div>
                      <div className={rstyles.evidenceInfo}>
                        <span className={rstyles.evidenceName} title={item.original_file_name || item.file_name}>
                          {item.original_file_name || item.file_name}
                        </span>
                        <div className={rstyles.evidenceMeta}>
                          <span className={rstyles.evidenceBadge}>{item.media_type.toUpperCase()}</span>
                          <span className={rstyles.evidenceSize}>
                            {(item.file_size_bytes / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          {item.signed_url && (
                            <a
                              href={item.signed_url}
                              download={item.original_file_name || "evidence"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={rstyles.downloadBtn}
                            >
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Update */}
            {STATUS_TRANSITIONS[selected.status]?.length > 0 && (
              <div className={rstyles.statusUpdate}>
                <p className={rstyles.detailLabel}>Update Status</p>
                <select className="input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="">Select new status</option>
                  {STATUS_TRANSITIONS[selected.status].map((s) => (
                    <option key={s} value={s}>{STATUSES[s]?.label}</option>
                  ))}
                </select>
                {newStatus && (
                  <>
                    <textarea className="input textarea" placeholder="Note explaining this status change (required)" value={statusNote} onChange={(e) => setStatusNote(e.target.value)} rows={3} />
                    <button className="btn btn-primary btn-sm" onClick={handleStatusUpdate} disabled={updating || !statusNote.trim()}>
                      {updating ? "Updating..." : "Update Status"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
