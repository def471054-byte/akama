"use client";

import { useEffect, useState } from "react";

type Phase = "loading" | "success";

export default function CloudflareVerification() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [dotAngle, setDotAngle] = useState(0);

  useEffect(() => {
    // Spin the dots while loading
    let animFrame: number;
    const spin = () => {
      setDotAngle((a) => a + 2.5);
      animFrame = requestAnimationFrame(spin);
    };
    animFrame = requestAnimationFrame(spin);

    // After 3s → success
    const timer = setTimeout(() => {
      cancelAnimationFrame(animFrame);
      setPhase("success");
    }, 3000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      {/* Main card */}
      <div style={styles.card}>
        {/* Left: status area */}
        <div style={styles.left}>
          {phase === "loading" ? (
            <SpinningDots angle={dotAngle} className="green" />
          ) : (
            <SuccessCheckmark />
          )}
          <span style={styles.label}>
            {phase === "loading" ? "Verifying..." : "Success!"}
          </span>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Right: Cloudflare branding */}
        <div style={styles.right}>
          <CloudflareIcon />
          <span style={styles.cfText}>Cloudflare</span>
          <span style={styles.cfSub}>Privacy · Terms</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Spinning dots (12 dots arranged in a circle, fading) ─── */
function SpinningDots({ angle, className }: { angle: number; className?: string }) {
  const total = 12;
  const radius = 12;
  const cx = 16;
  const cy = 16;

  return (
    <svg width={32} height={32} viewBox="0 0 32 32" className={className}>
      {Array.from({ length: total }).map((_, i) => {
        const deg = (360 / total) * i + angle;
        const rad = (deg * Math.PI) / 180;
        const x = cx + radius * Math.cos(rad);
        const y = cy + radius * Math.sin(rad);
        // Dots further "behind" the rotation are more transparent
        const opacity = 0.15 + (i / (total - 1)) * 0.85;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={1.8}
            fill="#2eb54b"
            opacity={opacity}
          />
        );
      })}
    </svg>
  );
}

/* ─── Animated success checkmark ─── */
function SuccessCheckmark() {
  return (
    <div style={styles.checkCircle}>
      <svg
        width={22}
        height={22}
        viewBox="0 0 22 22"
        fill="none"
        style={styles.checkSvg}
      >
        <polyline
          points="4,11 9,16 18,6"
          stroke="#fff"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={styles.checkPath}
        />
      </svg>
    </div>
  );
}

/* ─── Cloudflare orange flame icon (simplified SVG) ─── */
function CloudflareIcon() {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      {/* Orange cloud/flame shape approximation */}
      <path
        d="M65.5 51.5c.3-1 .4-2 .4-3.1 0-8.2-6.6-14.8-14.8-14.8-6.1 0-11.3 3.7-13.6 9a8.25 8.25 0 0 0-4.4-1.3c-4.6 0-8.3 3.7-8.3 8.3 0 .3 0 .6.1.9C21 51.8 18 55.2 18 59.3c0 4.6 3.7 8.3 8.3 8.3h37.9c4.1 0 7.4-3.3 7.4-7.4 0-3.7-2.7-6.8-6.1-7.4v-.3z"
        fill="#f6821f"
      />
      <path
        d="M55.7 67.6H26.3c-4.6 0-8.3-3.7-8.3-8.3 0-4.1 3-7.5 6.9-8.2-.1-.3-.1-.6-.1-.9 0-4.6 3.7-8.3 8.3-8.3 1.6 0 3.1.5 4.4 1.3 2.3-5.3 7.5-9 13.6-9 8.2 0 14.8 6.6 14.8 14.8 0 1.1-.1 2.1-.4 3.1 3.4.6 6.1 3.7 6.1 7.4 0 4.1-3.3 7.4-7.4 7.4l-8.5-.3z"
        fill="#fbad41"
      />
    </svg>
  );
}

/* ─── Styles ─── */
const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "120px 0",
    position: "relative",
    zIndex: 50,
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    // backgroundColor:"red"
  },
  card: {
    display: "flex",
    alignItems: "center",
    background: "#2d2d2d",
    border: "1px solid #3d3d3d",
    borderRadius: 6,
    padding: "10px 14px",
    gap: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    width: 260,
    minHeight: 60,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#d6d6d6",
    fontWeight: 400,
    letterSpacing: 0.1,
    userSelect: "none",
  },
  divider: {
    width: 1,
    height: 36,
    background: "#4a4a4a",
    flexShrink: 0,
  },
  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 1,
    minWidth: 64,
  },
  cfText: {
    fontSize: 11,
    fontWeight: 600,
    color: "#e0e0e0",
    letterSpacing: 0.3,
    lineHeight: 1.3,
    userSelect: "none",
  },
  cfSub: {
    fontSize: 9,
    color: "#7a7a7a",
    letterSpacing: 0.2,
    userSelect: "none",
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "#2eb54b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: "popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
    flexShrink: 0,
  },
  checkSvg: {
    display: "block",
  },
  checkPath: {
    strokeDasharray: 28,
    strokeDashoffset: 0,
    animation: "drawCheck 0.4s ease 0.2s both",
  },
};

// Inject keyframes once
if (typeof document !== "undefined") {
  const styleId = "cf-verify-styles";
  if (!document.getElementById(styleId)) {
    const s = document.createElement("style");
    s.id = styleId;
    s.textContent = `
      @keyframes popIn {
        0%   { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes drawCheck {
        0%   { stroke-dashoffset: 28; }
        100% { stroke-dashoffset: 0; }
      }
    `;
    document.head.appendChild(s);
  }
}