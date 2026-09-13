"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CATEGORIES, SEVERITIES } from "@/lib/constants/categories";
import { createClient } from "@/lib/supabase/client";
import { generateIdempotencyKey } from "@/lib/utils/idempotency";
import styles from "./report.module.css";

const STEPS = ["type", "details", "evidence", "security", "review"];

const STEP_SOULS = [
  "naming it is the first step",
  "say what you need to say",
  "proof helps, but words are enough",
  "this key is yours alone",
  "one more breath, then press submit",
];

const MAX_FILES = 5;
const MAX_SIZES = { image: 5, video: 25, audio: 10 };

function getMediaType(file) {
  const t = file.type.split("/")[0];
  if (t === "video") return "video";
  if (t === "audio") return "audio";
  return "image";
}

function getMediaIcon(type) {
  if (type === "video") return "[VID]";
  if (type === "audio") return "[AUD]";
  return "[IMG]";
}

export default function ReportPage() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [errors, setErrors] = useState({});
  const [idemKey] = useState(() => generateIdempotencyKey());

  const [form, setForm] = useState({
    type: "", severity: "", description: "", location: "",
    incident_date: "", involved_parties: "", witness_info: "",
    passphrase: "", confirm_passphrase: "", is_anonymous: true,
  });

  const [files, setFiles] = useState([]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };


  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.type) e.type = "Please select an incident type";
      if (!form.severity) e.severity = "Please select a severity level";
    }
    if (step === 1) {
      if (form.description.length < 50) e.description = "Description must be at least 50 characters";
    }
    if (step === 3) {
      if (form.passphrase.length < 6) e.passphrase = "Passphrase must be at least 6 characters";
      if (form.passphrase !== form.confirm_passphrase) e.confirm_passphrase = "Passphrases do not match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const uploadEvidenceInBackground = async (recordId, externalReportId, filesToUpload) => {
    try {
      const supabase = createClient();
      for (const file of filesToUpload) {
        const ext = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "dat";
        const randomSuffix = Math.random().toString(36).substring(2, 10);
        const storagePath = `${externalReportId}/${Date.now()}_${randomSuffix}.${ext}`;

        // Direct upload to Supabase Storage
        const { error: uploadErr } = await supabase.storage
          .from("evidence")
          .upload(storagePath, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadErr) {
          console.error("Supabase Storage error:", uploadErr);
          continue;
        }

        // Insert metadata into the evidence table
        const { error: insertErr } = await supabase.from("evidence").insert({
          report_id: recordId,
          file_url: storagePath,
          file_name: storagePath.split("/").pop(),
          file_type: file.type || "application/octet-stream",
          media_type: getMediaType(file),
          file_size_bytes: file.size,
          original_file_name: file.name
        });

        if (insertErr) {
          console.error("Evidence metadata error:", insertErr);
        }
      }
    } catch (err) {
      console.error("Background evidence upload failed:", err);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type, severity: form.severity,
          description: form.description, location: form.location,
          incident_date: form.incident_date, involved_parties: form.involved_parties,
          witness_info: form.witness_info, passphrase: form.passphrase,
          is_anonymous: form.is_anonymous, idempotency_key: idemKey,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Kick off evidence upload in the background (fire and forget)
        if (files.length > 0 && data.id) {
          uploadEvidenceInBackground(data.id, data.report_id, files);
        }
        
        setReportId(data.report_id);
        setSubmitted(true);
      } else {
        setErrors({ submit: data.error || "Submission failed" });
      }
    } catch {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.successStage}>
            <div className={styles.successCenter}>
              <p className={styles.successSoul}>your voice has been heard</p>
              <div className={styles.idCard}>
                <p className={styles.idLabel}>Report ID</p>
                <p className={styles.idValue}>{reportId}</p>
                <button className="btn btn-secondary btn-sm" onClick={() => navigator.clipboard.writeText(reportId)}>
                  Copy to clipboard
                </button>
              </div>
              <div className={styles.warningBox}>
                <p>Save this ID and your passphrase somewhere safe.</p>
                <p>They are your <em>only</em> key to track your report.</p>
              </div>
              <div className={styles.successActions}>
                <a href="/track" className="btn btn-primary">Track Your Report</a>
                <a href="/" className="btn btn-ghost">Return Home</a>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>

        <div className={styles.container}>
          <div className={styles.anonNotice}>
            <span className={styles.anonDot} />
            <p className={styles.anonText}>This report is <strong>completely anonymous</strong>. We do not collect your name, IP address, or any identifying information.</p>
          </div>

          <div className={styles.progress}>
            <div className={styles.progressFill} style={{ width: ((step + 1) / STEPS.length * 100) + "%" }} />
          </div>

          <p className={styles.stepSoul} key={step}>{STEP_SOULS[step]}</p>
          <p className={styles.stepLabel}>Step {step + 1} of {STEPS.length}</p>

          {step === 0 && (
            <div className={styles.stepContent}>
              <h1 className={styles.stepTitle}>What happened?</h1>
              <p className={styles.stepDesc}>Select the type of incident you want to report.</p>

              <div className={styles.typeGrid}>
                {Object.entries(CATEGORIES).map(([key, cat], i) => (
                  <button key={key} className={`${styles.typeCard} ${form.type === key ? styles.typeCardActive : ""}`}
                    onClick={() => update("type", key)} style={{ animationDelay: i * 0.05 + "s" }}>
                    <span className={styles.typeLabel}>{cat.label}</span>
                    <span className={styles.typeDesc}>{cat.description}</span>
                  </button>
                ))}
              </div>
              {errors.type && <p className="form-error">{errors.type}</p>}

              <h3 className={styles.subTitle}>How severe?</h3>
              <div className={styles.severityGrid}>
                {Object.entries(SEVERITIES).map(([key, sev]) => (
                  <button key={key} className={`${styles.sevCard} ${form.severity === key ? styles.sevCardActive : ""}`}
                    onClick={() => update("severity", key)}>
                    <span className={styles.sevLabel}>{sev.label}</span>
                    <span className={styles.sevDesc}>{sev.description}</span>
                  </button>
                ))}
              </div>
              {errors.severity && <p className="form-error">{errors.severity}</p>}
            </div>
          )}

          {step === 1 && (
            <div className={styles.stepContent}>
              <h1 className={styles.stepTitle}>Tell us more</h1>
              <p className={styles.stepDesc}>The more detail you provide, the better we can help. Take your time.</p>

              <div className="form-group">
                <label className="label">What happened? *</label>
                <textarea className={`input textarea ${errors.description ? "input-error" : ""}`}
                  placeholder="Describe the incident in your own words..." value={form.description}
                  onChange={(e) => update("description", e.target.value)} rows={6} />
                <p className="form-hint">{form.description.length} / 50 minimum</p>
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>

              <div className="form-group">
                <label className="label">Where did it happen?</label>
                <input className="input" placeholder="Location (optional)" value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>

              <div className="form-group">
                <label className="label">When did it happen?</label>
                <input 
                  type="text" 
                  placeholder="Date (optional)"
                  onFocus={(e) => { 
                    e.target.type = "date";
                    try { e.target.showPicker(); } catch (err) {} 
                  }}
                  onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                  className={`input ${styles.dateInput}`} 
                  value={form.incident_date} 
                  onChange={(e) => update("incident_date", e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label className="label">Who was involved?</label>
                <textarea className="input textarea" placeholder="Names or descriptions (optional)" value={form.involved_parties} onChange={(e) => update("involved_parties", e.target.value)} rows={3} />
              </div>

              <div className="form-group">
                <label className="label">Any witnesses?</label>
                <textarea className="input textarea" placeholder="Names or details of witnesses (optional)" value={form.witness_info} onChange={(e) => update("witness_info", e.target.value)} rows={3} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.stepContent}>
              <h1 className={styles.stepTitle}>Evidence</h1>
              <p className={styles.stepDesc}>Upload screenshots, videos, or audio recordings if you have them. This is completely optional.</p>

              <div className={styles.limitsGrid}>
                <div className={styles.limitItem}><span className={styles.limitLabel}>Images</span><span className={styles.limitValue}>PNG, JPG, WebP - Max 5 MB each</span></div>
                <div className={styles.limitItem}><span className={styles.limitLabel}>Videos</span><span className={styles.limitValue}>MP4, WebM - Max 25 MB each</span></div>
                <div className={styles.limitItem}><span className={styles.limitLabel}>Audio</span><span className={styles.limitValue}>MP3, WAV, OGG - Max 10 MB each</span></div>
                <div className={styles.limitItem}><span className={styles.limitLabel}>Total</span><span className={styles.limitValue}>Up to 5 files</span></div>
              </div>

              <div className={styles.uploadZone}>
                <input type="file"
                  accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,audio/mpeg,audio/wav,audio/ogg"
                  multiple className={styles.fileInput} id="evidence-upload"
                  onChange={(e) => {
                    const incoming = Array.from(e.target.files || []);
                    const valid = incoming.filter((f) => {
                      const mt = getMediaType(f);
                      const maxMB = MAX_SIZES[mt] || 5;
                      if (f.size > maxMB * 1024 * 1024) {
                        setErrors((prev) => ({ ...prev, evidence: f.name + " exceeds " + maxMB + " MB limit" }));
                        return false;
                      }
                      return true;
                    });
                    const allowed = valid.slice(0, MAX_FILES - files.length);
                    setFiles((prev) => [...prev, ...allowed].slice(0, MAX_FILES));
                    if (valid.length > 0) setErrors((prev) => ({ ...prev, evidence: null }));
                    e.target.value = "";
                  }}
                />
                <label htmlFor="evidence-upload" className={styles.uploadLabel}>
                  <span className={styles.uploadIcon}>+</span>
                  <span>Click to upload</span>
                  <span className={styles.uploadHint}>Images, Videos, or Audio - Up to 5 files</span>
                </label>
              </div>

              {errors.evidence && <p className="form-error" style={{ marginTop: 8 }}>{errors.evidence}</p>}

              {files.length > 0 && (
                <div className={styles.fileList}>
                  {files.map((f, i) => {
                    const mt = getMediaType(f);
                    const icon = getMediaIcon(mt);
                    const sizeMB = (f.size / 1024 / 1024).toFixed(1);
                    return (
                      <div key={i} className={styles.fileItem}>
                        <span className={styles.fileIcon}>{icon}</span>
                        <span className={styles.fileName}>{f.name}</span>
                        <span className={styles.fileSize}>{sizeMB} MB</span>
                        <button className={styles.fileRemove} onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}>x</button>
                      </div>
                    );
                  })}
                </div>
              )}

              <p className={styles.evidenceNote}>your words are enough</p>
            </div>
          )}

          {step === 3 && (
            <div className={styles.stepContent}>
              <h1 className={styles.stepTitle}>Secure your report</h1>
              <p className={styles.stepDesc}>Create a passphrase, like a password, to access your report later. We cannot recover it for you.</p>

              <div className="form-group">
                <label className="label">Passphrase *</label>
                <input type="password" className={`input ${errors.passphrase ? "input-error" : ""}`} placeholder="At least 6 characters" value={form.passphrase} onChange={(e) => update("passphrase", e.target.value)} />
                {form.passphrase.length > 0 && (
                  <div className={styles.strengthBar}>
                    <div className={styles.strengthFill} style={{ width: Math.min(100, (form.passphrase.length / 12) * 100) + "%" }} />
                  </div>
                )}
                {errors.passphrase && <p className="form-error">{errors.passphrase}</p>}
              </div>

              <div className="form-group">
                <label className="label">Confirm Passphrase *</label>
                <input type="password" className={`input ${errors.confirm_passphrase ? "input-error" : ""}`} placeholder="Type it again" value={form.confirm_passphrase} onChange={(e) => update("confirm_passphrase", e.target.value)} />
                {errors.confirm_passphrase && <p className="form-error">{errors.confirm_passphrase}</p>}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className={styles.stepContent}>
              <h1 className={styles.stepTitle}>Review</h1>
              <p className={styles.stepDesc}>Confirm everything looks correct before submitting.</p>

              <div className={styles.reviewCard}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Type</span>
                  <span className={styles.reviewValue}>{CATEGORIES[form.type]?.label}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Severity</span>
                  <span className={styles.reviewValue}>{SEVERITIES[form.severity]?.label}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Description</span>
                  <span className={styles.reviewValue}>{form.description.slice(0, 120)}{form.description.length > 120 ? "..." : ""}</span>
                </div>
                {form.location && (
                  <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Location</span>
                    <span className={styles.reviewValue}>{form.location}</span>
                  </div>
                )}
                {form.incident_date && (
                  <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Date</span>
                    <span className={styles.reviewValue}>{form.incident_date}</span>
                  </div>
                )}
                {files.length > 0 && (
                  <div className={styles.reviewRow}>
                    <span className={styles.reviewLabel}>Evidence</span>
                    <span className={styles.reviewValue}>{files.length} file(s)</span>
                  </div>
                )}
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Anonymous</span>
                  <span className={styles.reviewValue}>Yes</span>
                </div>
              </div>
              {errors.submit && <p className="form-error" style={{ marginTop: 16 }}>{errors.submit}</p>}
            </div>
          )}

          <div className={styles.nav}>
            {step > 0 && <button className="btn btn-ghost" onClick={prev}>Back</button>}
            <div className={styles.navSpacer} />
            {step < STEPS.length - 1 ? (
              <button className="btn btn-primary" onClick={next}>Continue</button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
