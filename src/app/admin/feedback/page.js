"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "../dashboard.module.css";

export default function AdminFeedbackContact() {
  const [tab, setTab] = useState("feedback");
  const [feedback, setFeedback] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: fb } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setFeedback(fb || []);

      const { data: ct } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      setContacts(ct || []);

      setLoading(false);
    }
    load();
  }, []);

  const markContactResolved = async (id) => {
    const supabase = createClient();
    await supabase.from("contact_submissions").update({ is_resolved: true }).eq("id", id);
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, is_resolved: true } : c));
  };

  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Feedback & Contact</h1>
        <p className={styles.subtitle}>User feedback and contact form submissions.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)" }}>
        <button className={`btn ${tab === "feedback" ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={() => setTab("feedback")}>
          Feedback ({feedback.length})
        </button>
        <button className={`btn ${tab === "contact" ? "btn-primary" : "btn-ghost"} btn-sm`} onClick={() => setTab("contact")}>
          Contact ({contacts.length})
        </button>
      </div>

      {loading ? (
        <p className={styles.loadingText}>Loading...</p>
      ) : tab === "feedback" ? (
        feedback.length === 0 ? (
          <div className={styles.emptyState}><p className={styles.emptyText}>No feedback yet.</p></div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Category</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((f) => (
                  <tr key={f.id}>
                    <td style={{ color: "var(--warning)", letterSpacing: 2 }}>{stars(f.rating)}</td>
                    <td style={{ textTransform: "capitalize" }}>{f.category || "-"}</td>
                    <td style={{ maxWidth: 300, whiteSpace: "pre-wrap", fontSize: 13 }}>{f.comment || "-"}</td>
                    <td className={styles.dateCell}>{new Date(f.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        contacts.length === 0 ? (
          <div className={styles.emptyState}><p className={styles.emptyText}>No contact submissions.</p></div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td><code className={styles.mono}>{c.email}</code></td>
                    <td>{c.subject || "-"}</td>
                    <td style={{ maxWidth: 250, whiteSpace: "pre-wrap", fontSize: 13 }}>{c.message}</td>
                    <td>{c.is_resolved ? <span style={{ color: "#34d399" }}>Resolved</span> : <span style={{ color: "var(--warning)" }}>Open</span>}</td>
                    <td className={styles.dateCell}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      {!c.is_resolved && (
                        <button className="btn btn-ghost btn-sm" onClick={() => markContactResolved(c.id)} style={{ fontSize: 11 }}>
                          Resolve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
