"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./feedback.module.css";

const CATEGORIES = ["UI/UX", "Report Process", "Speed", "Communication", "Other"];

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag) => {
    setTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, category: tags.join(", "), comment }),
      });
      if (res.ok) setSubmitted(true);
    } catch { /* silently handle */ }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.container}>
          <p className={styles.soul}>help us do better</p>
          <h1 className={styles.heading}>Feedback</h1>
          <p className={styles.desc}>
            Your feedback is anonymous. No login required. Tell us what is working and what is not.
          </p>

          {submitted ? (
            <div className={styles.successCard}>
              <p className={styles.successSoul}>thank you</p>
              <p className={styles.successText}>
                Your feedback has been recorded. It helps us improve this platform for everyone.
              </p>
              <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setRating(0); setTags([]); setComment(""); }}>
                Submit more feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {/* Star Rating */}
              <div className={styles.ratingSection}>
                <label className="label">How would you rate your experience?</label>
                <div className={styles.stars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`${styles.star} ${(hoverRating || rating) >= star ? styles.starFilled : ""}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {rating > 0 && <p className={styles.ratingLabel}>{["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}</p>}
              </div>

              {/* Category Tags */}
              <div className="form-group">
                <label className="label">What area does your feedback cover?</label>
                <div className={styles.tagGrid}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`${styles.tag} ${tags.includes(cat) ? styles.tagActive : ""}`}
                      onClick={() => toggleTag(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="form-group">
                <label className="label">Comments</label>
                <textarea
                  className="input textarea"
                  placeholder="Tell us more... (optional, max 2000 characters)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 2000))}
                  rows={5}
                />
                <p className="form-hint">{comment.length} / 2000</p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting || rating === 0} style={{ width: "100%" }}>
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
