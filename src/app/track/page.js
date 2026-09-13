"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { STATUSES } from "@/lib/constants/statuses";
import { CATEGORIES, SEVERITIES } from "@/lib/constants/categories";
import styles from "./track.module.css";

export default function TrackPage() {
  const [reportId, setReportId] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [data?.messages?.length]);


  const handleTrack = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId.trim(), passphrase }),
      });
      const result = await res.json();
      if (res.ok) setData(result);
      else setError(result.error || "Invalid Report ID or passphrase");
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !data) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: data.report.id, content: message.trim() }),
      });
      if (res.ok) {
        const result = await res.json();
        setData((prev) => ({ ...prev, messages: [...prev.messages, result.message] }));
        setMessage("");
      }
    } catch { /* silent */ }
    finally { setSending(false); }
  };

  // ======== LOOKUP ========
  if (!data) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>

          <div className={styles.container}>
            <p className={styles.soulText}>find your report</p>
            <h1 className={styles.heading}>Track Your Report</h1>
            <p className={styles.desc}>
              Enter your Report ID and the passphrase you created.
            </p>

            <form onSubmit={handleTrack} className={styles.lookupCard}>
              <div className="form-group">
                <label className="label">Report ID</label>
                <input
                  className="input mono"
                  placeholder="RPT-2026-XXXXXXXXXXXX"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="form-group">
                <label className="label">Passphrase</label>
                <div className={styles.passWrap}>
                  <input
                    type={showPass ? "text" : "password"}
                    className="input"
                    placeholder="Enter your passphrase"
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                  />
                  <button type="button" className={styles.passToggle} onClick={() => setShowPass(!showPass)}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && <p className="form-error">{error}</p>}

              <button
                type="submit"
                className={`btn btn-primary ${styles.trackBtn}`}
                disabled={loading || !reportId.trim() || !passphrase}
              >
                {loading ? "Searching…" : "Track Report"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ======== RESULT ========
  const { report, status_history, public_notes, messages: msgs } = data;
  const statusInfo = STATUSES[report.status] || {};
  const catInfo = CATEGORIES[report.type] || {};
  const sevInfo = SEVERITIES[report.severity] || {};

  return (
    <>
      <Navbar />
      <div className={styles.page}>

        <div className={styles.container}>
          {/* Header */}
          <div className={styles.resultHeader}>
            <div>
              <p className={styles.soulText}>your report</p>
              <p className={styles.resultId}>{report.report_id}</p>
            </div>
            <span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span>
          </div>

          {/* Detail card */}
          <div className={styles.detailCard}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Type</span>
              <span className={styles.detailValue}>{catInfo.label}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Severity</span>
              <span className={styles.detailValue}>{sevInfo.label}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Submitted</span>
              <span className={styles.detailValue}>
                {new Date(report.created_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </span>
            </div>
            {report.is_archived && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue} style={{ color: "var(--text-low)", fontStyle: "italic" }}>
                  Case resolved and archived
                </span>
              </div>
            )}
            {report.evidence_purged_at && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Evidence</span>
                <span className={styles.detailValue} style={{ color: "var(--text-low)", fontStyle: "italic" }}>
                  Purged per retention policy
                </span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <h3 className={styles.sectionTitle}>Timeline</h3>
          <div className={styles.timeline}>
            {status_history.map((entry, i) => (
              <div key={entry.id} className={styles.timelineItem} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.timelineDot} />
                {i < status_history.length - 1 && <div className={styles.timelineLine} />}
                <div className={styles.timelineContent}>
                  <p className={styles.timelineStatus}>{STATUSES[entry.new_status]?.label || entry.new_status}</p>
                  {entry.note && <p className={styles.timelineNote}>{entry.note}</p>}
                  <p className={styles.timelineDate}>
                    {new Date(entry.changed_at).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          {public_notes.length > 0 && (
            <>
              <h3 className={styles.sectionTitle}>Notes from admin</h3>
              {public_notes.map((note) => (
                <div key={note.id} className={styles.noteCard}>
                  <p className={styles.noteContent}>{note.content}</p>
                  <p className={styles.noteDate}>
                    {new Date(note.created_at).toLocaleString("en-IN", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </>
          )}

          {/* Messages */}
          <h3 className={styles.sectionTitle}>Messages</h3>
          <div className={styles.messageThread} ref={threadRef}>
            {msgs.length === 0 && <p className={styles.noMessages}>No messages yet.</p>}
            {msgs.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageBubble} ${msg.sender_role === "reporter" ? styles.messageReporter : styles.messageAdmin}`}
              >
                <p className={styles.messageSender}>{msg.sender_name}</p>
                <p className={styles.messageContent}>{msg.content}</p>
                <p className={styles.messageTime}>
                  {new Date(msg.created_at).toLocaleString("en-IN", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>

          {!report.is_archived ? (
            <div className={styles.messageInput}>
              <textarea className="input textarea" placeholder="Type a message to the admin…" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
              <button className={`btn btn-primary ${styles.sendBtn}`} onClick={handleSendMessage} disabled={sending || !message.trim()}>
                {sending ? "Sending…" : "Send Message"}
              </button>
            </div>
          ) : (
            <div className={styles.archivedNotice}><p>This case is closed. No further messages can be sent.</p></div>
          )}

          <button className={`btn btn-ghost ${styles.backBtn}`} onClick={() => { setData(null); setError(null); setReportId(""); setPassphrase(""); }}>
            ← Look up another report
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
