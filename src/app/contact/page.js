"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./contact.module.css";

const TEAM = [
  { name: "Poorvi Aggarwal", role: "Super Admin" },
  { name: "Shreya Aggarwal", role: "Admin" },
  { name: "Utkarsh Lohan", role: "Admin" },
  { name: "Rituraj Sharma", role: "Admin" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const update = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) setSubmitted(true);
      else setError(data.error || "Something went wrong");
    } catch { setError("Network error. Please try again."); }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Left: Form */}
            <div>
              <p className={styles.soul}>we are here</p>
              <h1 className={styles.heading}>Contact Us</h1>
              <p className={styles.desc}>
                Have a question, suggestion, or concern? Reach out and we will get back to you.
              </p>

              {submitted ? (
                <div className={styles.successCard}>
                  <p className={styles.successSoul}>message received</p>
                  <p className={styles.successText}>
                    Thank you for reaching out. We will review your message and respond as soon as possible.
                  </p>
                  <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}>
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className="form-group">
                    <label className="label">Name *</label>
                    <input className="input" placeholder="Your name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Email *</label>
                    <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Subject</label>
                    <input className="input" placeholder="What is this about? (optional)" value={form.subject} onChange={(e) => update("subject", e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">Message *</label>
                    <textarea className="input textarea" placeholder="Your message..." value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} required />
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: "100%" }}>
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Right: Team + Info */}
            <div className={styles.sidebar}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>The Team</h3>
                <div className={styles.teamList}>
                  {TEAM.map((t, i) => (
                    <div key={i} className={styles.teamMember}>
                      <p className={styles.teamName}>{t.name}</p>
                      <p className={styles.teamRole}>{t.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Response Time</h3>
                <p className={styles.infoText}>We typically respond within 24–48 hours. For urgent matters, please use the helplines on our Resources page.</p>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Report an Incident</h3>
                <p className={styles.infoText}>This form is for general inquiries only. To report a bullying incident, please use the Report page.</p>
                <a href="/report" className="btn btn-secondary btn-sm" style={{ marginTop: 12 }}>Go to Report</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
