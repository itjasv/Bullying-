"use client";

import { useState, useEffect } from "react";
import styles from "./TextCycle.module.css";

const FAST_WORDS = [
  "ignored", "laughed at", "pushed around", "excluded",
  "threatened", "humiliated", "mocked", "isolated",
  "harassed", "targeted", "intimidated", "silenced",
  "ridiculed", "cornered", "belittled", "dismissed",
];

const SLOW_MESSAGES = [
  "you are being bullied.",
  "someone you know is being bullied.",
  "it has been going on for too long.",
  "you do not know who to tell.",
  "you are afraid no one will believe you.",
];

export default function TextCycle() {
  const [text, setText] = useState(FAST_WORDS[0]);
  const [phase, setPhase] = useState("fast");
  const [leftTrail, setLeftTrail] = useState([]);
  const [rightTrail, setRightTrail] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let fastIdx = 0;
    let count = 0;
    let running = true;

    const runCycle = () => {
      if (!running) return;

      setPhase("fast");
      setLeftTrail([]);
      setRightTrail([]);

      const fastInterval = setInterval(() => {
        fastIdx = (fastIdx + 1) % FAST_WORDS.length;
        const word = FAST_WORDS[fastIdx];
        setText(word);
        count++;
        setCounter(count);

        // Alternate adding to left and right trails
        if (count % 2 === 0) {
          setLeftTrail((prev) => {
            const next = [word, ...prev];
            return next.slice(0, 6);
          });
        } else {
          setRightTrail((prev) => {
            const next = [word, ...prev];
            return next.slice(0, 6);
          });
        }
      }, 120);

      setTimeout(() => {
        clearInterval(fastInterval);
        if (!running) return;

        setPhase("slow");
        let slowIdx = 0;

        const showSlow = () => {
          if (!running) return;
          setText(SLOW_MESSAGES[slowIdx]);
          slowIdx++;

          if (slowIdx < SLOW_MESSAGES.length) {
            setTimeout(showSlow, 2400);
          } else {
            setTimeout(() => {
              if (running) runCycle();
            }, 3500);
          }
        };
        showSlow();
      }, 3500);
    };

    runCycle();
    return () => { running = false; };
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Left trail — words dissipating upward */}
        <div className={styles.trail}>
          {phase === "fast" && leftTrail.map((word, i) => (
            <span
              key={`l-${word}-${i}`}
              className={styles.trailWord}
              style={{ opacity: 0.15 - i * 0.02, transform: `translateY(${-i * 4}px)` }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Center stage */}
        <div className={styles.center}>
          <p className={styles.maybe}>Maybe</p>

          <p className={`${styles.word} ${phase === "fast" ? styles.wordFast : styles.wordSlow}`} key={text}>
            {text}
          </p>

          {phase === "slow" && (
            <div className={styles.underline} key={`line-${text}`} />
          )}

          <p className={`${styles.follow} ${phase === "slow" ? styles.followVisible : ""}`}>
            This is for you.
          </p>
        </div>

        {/* Right trail — words dissipating upward */}
        <div className={styles.trail}>
          {phase === "fast" && rightTrail.map((word, i) => (
            <span
              key={`r-${word}-${i}`}
              className={styles.trailWord}
              style={{ opacity: 0.15 - i * 0.02, transform: `translateY(${-i * 4}px)` }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
