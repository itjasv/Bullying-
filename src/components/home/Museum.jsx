"use client";

import styles from "./Museum.module.css";

const FRAGMENTS = [
  { text: "it was not a joke", x: 8, y: 14, size: 18, r: -3 },
  { text: "they laughed", x: 72, y: 10, size: 15, r: 2 },
  { text: "nobody asked if I was okay", x: 15, y: 30, size: 16, r: -1 },
  { text: "I stopped eating lunch there", x: 65, y: 28, size: 14, r: 3 },
  { text: "I told a teacher once", x: 5, y: 65, size: 17, r: 1.5 },
  { text: "nothing changed", x: 70, y: 68, size: 20, r: -2 },
  { text: "I pretended I was sick", x: 20, y: 80, size: 14, r: 2 },
  { text: "every single day", x: 75, y: 82, size: 15, r: -1.5 },
  { text: "I deleted the app", x: 12, y: 90, size: 13, r: 1 },
  { text: "they said I was overreacting", x: 78, y: 18, size: 14, r: -2.5 },
];

export default function Museum() {
  return (
    <section className={styles.section}>
      {/* Scattered confessional fragments, twinkling */}
      {FRAGMENTS.map((f, i) => (
        <p
          key={i}
          className={`${styles.fragment} ${styles.fragmentVisible}`}
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontSize: `${f.size}px`,
            transform: `rotate(${f.r}deg)`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${3 + (i % 4) * 1.2}s`,
          }}
        >
          {f.text}
        </p>
      ))}

      {/* Center piece */}
      <div className={`${styles.piece} ${styles.pieceVisible}`}>
        <p className={styles.word}>enough.</p>
        <p className={styles.caption}>every student who stayed silent</p>
      </div>
    </section>
  );
}
