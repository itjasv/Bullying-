"use client";

import { useRef, useEffect } from "react";
import styles from "./BullyingWeb.module.css";

const NODES = [
  { label: "Physical", x: 0.12, y: 0.15, rotate: -3 },
  { label: "Cyber", x: 0.82, y: 0.10, rotate: 2 },
  { label: "Verbal", x: 0.05, y: 0.55, rotate: 1.5 },
  { label: "Threats", x: 0.88, y: 0.48, rotate: -2 },
  { label: "Exclusion", x: 0.18, y: 0.85, rotate: -1 },
  { label: "Discrimination", x: 0.75, y: 0.82, rotate: 3 },
  { label: "Harassment", x: 0.42, y: 0.08, rotate: -2.5 },
  { label: "Stalking", x: 0.90, y: 0.72, rotate: -1.5 },
  { label: "Rumours", x: 0.08, y: 0.38, rotate: 2.5 },
];

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawScribbleLine(ctx, x1, y1, x2, y2, rng) {
  const passes = 4 + Math.floor(rng() * 4); // 4-7 overlapping strokes (messier)
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const chaos = dist * 0.35; // 35% deviation (more chaotic)

  for (let p = 0; p < passes; p++) {
    ctx.beginPath();
    const sx = x1 + (rng() - 0.5) * 8;
    const sy = y1 + (rng() - 0.5) * 8;
    const ex = x2 + (rng() - 0.5) * 8;
    const ey = y2 + (rng() - 0.5) * 8;
    ctx.moveTo(sx, sy);

    const segments = 3 + Math.floor(rng() * 3);
    for (let s = 0; s < segments; s++) {
      const t = (s + 1) / (segments + 1);
      const midX = x1 + dx * t + (rng() - 0.5) * chaos;
      const midY = y1 + dy * t + (rng() - 0.5) * chaos;

      if (s === segments - 1) {
        ctx.quadraticCurveTo(midX, midY, ex, ey);
      } else {
        const nextT = (s + 2) / (segments + 1);
        const nextX = x1 + dx * nextT + (rng() - 0.5) * 15;
        const nextY = y1 + dy * nextT + (rng() - 0.5) * 15;
        ctx.quadraticCurveTo(midX, midY, nextX, nextY);
      }
    }
    ctx.stroke();
  }
}

export default function BullyingWeb() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";

      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cx = rect.width * 0.5;
      const cy = rect.height * 0.5;

      ctx.strokeStyle = "rgba(91, 154, 139, 0.10)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const rng = mulberry32(42);

      // Draw chaotic lines from center to each node
      NODES.forEach((node) => {
        const nx = node.x * rect.width;
        const ny = node.y * rect.height;
        drawScribbleLine(ctx, cx, cy, nx, ny, rng);
      });

      // Extra chaotic scribbles near center for that messy feel
      for (let i = 0; i < 6; i++) {
        const angle = rng() * Math.PI * 2;
        const r = 30 + rng() * 60;
        const ex = cx + Math.cos(angle) * r;
        const ey = cy + Math.sin(angle) * r;
        ctx.beginPath();
        ctx.moveTo(cx + (rng() - 0.5) * 20, cy + (rng() - 0.5) * 20);
        const cp1x = cx + (rng() - 0.5) * 80;
        const cp1y = cy + (rng() - 0.5) * 80;
        ctx.quadraticCurveTo(cp1x, cp1y, ex, ey);
        ctx.stroke();
      }
    };

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.outer}>
        <div className={styles.sideText}>
          <p className={styles.sideMessage}>
            It happens in hallways,<br />
            in group chats,<br />
            in silence.
          </p>
          <p className={styles.sideMessage}>
            Sometimes it is obvious.<br />
            Sometimes only you know.
          </p>
          <p className={styles.sideMessage}>
            Either way, it is not okay.
          </p>
        </div>

        <div className={styles.webContainer} ref={containerRef}>
          <canvas ref={canvasRef} className={styles.canvas} />

          {/* Center word — broken/damaged style */}
          <div className={styles.centerWord}>
            <span className={styles.glitchChar}>b</span>
            <span className={styles.glitchChar}>u</span>
            <span className={styles.glitchChar}>l</span>
            <span className={styles.glitchChar}>l</span>
            <span className={styles.glitchChar}>y</span>
            <span className={styles.glitchChar}>i</span>
            <span className={styles.glitchChar}>n</span>
            <span className={styles.glitchChar}>g</span>
          </div>

          {NODES.map((node) => (
            <div
              key={node.label}
              className={styles.node}
              style={{
                left: `${node.x * 100}%`,
                top: `${node.y * 100}%`,
                transform: `translate(-50%, -50%) rotate(${node.rotate}deg)`,
              }}
            >
              {node.label}
            </div>
          ))}
        </div>

        <div className={styles.sideText}>
          <p className={styles.sideMessage}>
            Reporting does not make<br />
            you a snitch.
          </p>
          <p className={styles.sideMessage}>
            It makes the world safer<br />
            for everyone.
          </p>
          <p className={styles.sideMessage}>
            One report can change<br />
            everything.
          </p>
        </div>
      </div>
    </section>
  );
}
