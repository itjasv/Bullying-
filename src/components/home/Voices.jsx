"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./Voices.module.css";

const WHISPERS = [
  "I did not think anyone would take it seriously. They did.",
  "I was scared they would find out it was me. They never did.",
  "It took me three weeks to press submit. I wish I had done it sooner.",
  "I reported for someone else. They thanked me later without knowing it was me.",
  "The hardest part was admitting it was bullying. After that, the form was easy.",
  "I checked my report status every day. When it changed to resolved, I cried.",
];

export default function Voices() {
  // All cards revealed + fully typed from the start
  const allRevealed = WHISPERS.map((_, i) => i);
  const allTyped = {};
  WHISPERS.forEach((text, i) => { allTyped[i] = text; });

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {WHISPERS.map((text, i) => (
            <div
              key={i}
              className={`${styles.whisper} ${styles[`w${i}`]} ${styles.revealed}`}
            >
              <div className={styles.pin} />
              <p className={styles.text}>{text}</p>
            </div>
          ))}
        </div>

        <div className={`${styles.centerElement} ${styles.centerVisible}`}>
          <p className={styles.centerText}>
            {"someone listened".split("").map((char, i) => (
              <span
                key={i}
                className={styles.waveLetter}
                style={{ animationDelay: (i * 0.08) + "s" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
