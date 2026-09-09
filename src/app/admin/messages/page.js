"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import styles from "./messages.module.css";
import dstyles from "../dashboard.module.css";

export default function AdminMessages() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const endRef = useRef(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("id, report_id, status, type, created_at")
        .eq("is_deleted", false)
        .order("updated_at", { ascending: false })
        .limit(50);
      setReports(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const loadMessages = async (report) => {
    setSelected(report);
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("report_id", report.id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    // Mark as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("report_id", report.id)
      .eq("sender_role", "reporter");
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !selected) return;
    setSending(true);

    const supabase = createClient();
    const user = (await supabase.auth.getUser()).data.user;
    const { data: userData } = await supabase
      .from("users")
      .select("display_name")
      .eq("id", user.id)
      .single();

    await supabase.from("messages").insert({
      report_id: selected.id,
      sender_id: user.id,
      sender_role: "admin",
      sender_name: userData?.display_name || "Admin",
      content: newMsg.trim().slice(0, 2000),
    });

    setNewMsg("");
    loadMessages(selected);
    setSending(false);
  };

  return (
    <div className={dstyles.page}>
      <div className={dstyles.header}>
        <h1 className={dstyles.heading}>Messages</h1>
        <p className={dstyles.subtitle}>Communicate with reporters securely.</p>
      </div>

      <div className={styles.chatShell}>
        {/* Left: Report list */}
        <div className={styles.threadList}>
          {loading ? (
            <p className={styles.emptyChat}>Loading...</p>
          ) : reports.length === 0 ? (
            <p className={styles.emptyChat}>No reports yet.</p>
          ) : (
            reports.map((r) => (
              <button
                key={r.id}
                className={`${styles.threadItem} ${selected?.id === r.id ? styles.threadActive : ""}`}
                onClick={() => loadMessages(r)}
              >
                <code className={styles.threadId}>{r.report_id}</code>
                <span className={styles.threadMeta}>{r.type} / {r.status.replace(/_/g, " ")}</span>
              </button>
            ))
          )}
        </div>

        {/* Right: Chat */}
        <div className={styles.chatPane}>
          {!selected ? (
            <div className={styles.chatEmpty}>
              <p>Select a report to view messages</p>
            </div>
          ) : (
            <>
              <div className={styles.chatHeader}>
                <code className={styles.chatHeaderId}>{selected.report_id}</code>
                <span className={styles.chatHeaderStatus}>{selected.status.replace(/_/g, " ")}</span>
              </div>

              <div className={styles.chatBody}>
                {messages.length === 0 ? (
                  <p className={styles.emptyChat}>No messages yet. Start the conversation.</p>
                ) : (
                  messages.map((m) => (
                    <div key={m.id} className={`${styles.msg} ${m.sender_role === "admin" ? styles.msgAdmin : styles.msgReporter}`}>
                      <p className={styles.msgSender}>{m.sender_name}</p>
                      <p className={styles.msgText}>{m.content}</p>
                      <p className={styles.msgTime}>{new Date(m.created_at).toLocaleString()}</p>
                    </div>
                  ))
                )}
                <div ref={endRef} />
              </div>

              <div className={styles.chatInput}>
                <textarea
                  className="input textarea"
                  placeholder="Type a message (max 2000 characters)..."
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value.slice(0, 2000))}
                  rows={2}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                />
                <button className="btn btn-primary btn-sm" onClick={sendMessage} disabled={sending || !newMsg.trim()}>
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
