"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Phase = "idle" | "enter" | "granted" | "exit";

export default function VerifyingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const t0 = setTimeout(() => setPhase("enter"),   80);
    const t1 = setTimeout(() => setPhase("granted"), 2000);
    const t2 = setTimeout(() => setPhase("exit"),    3000);
    const t3 = setTimeout(() => router.replace("/admin"), 3600);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [router]);

  const isIn      = phase === "enter" || phase === "granted";
  const isGranted = phase === "granted" || phase === "exit";
  const isOut     = phase === "exit";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        @keyframes shimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0;  }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0);   }
        }

        .badge-enter {
          opacity: 0;
          transform: translateY(18px) scale(0.93);
        }
        .badge-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: opacity 0.6s ease, transform 0.65s cubic-bezier(0.34,1.56,0.64,1);
        }
        .fade-out {
          opacity: 0 !important;
          transform: translateY(-8px) scale(0.97) !important;
          transition: opacity 0.55s ease, transform 0.55s ease !important;
        }
      `}</style>

      {/* Page */}
      <div style={{
        position: "fixed", inset: 0,
        background: "#ffffff",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 36,
        fontFamily: "'Inter', Arial, sans-serif",
        opacity: isOut ? 0 : 1,
        transition: "opacity 0.55s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* ── Badge card ─────────────────────────────────── */}
        <div className={`${isIn ? "badge-visible" : "badge-enter"} ${isOut ? "fade-out" : ""}`}
          style={{
            display: "flex", alignItems: "center", gap: 28,
            padding: "36px 56px",
            borderRadius: 28,
            background: "#f8f9fc",
            border: "1px solid #eaeef5",
            boxShadow: isGranted
              ? "0 8px 48px rgba(14,18,255,0.12), 0 2px 12px rgba(0,0,0,0.05)"
              : "0 2px 24px rgba(0,0,0,0.06)",
            transition: "box-shadow 0.6s ease",
          }}
        >
          {/* Icon area */}
          <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>

            {/* Shield box */}
            <div style={{
              width: 90, height: 90,
              borderRadius: 22,
              background: isGranted
                ? "linear-gradient(135deg, #0e12ff 0%, #1a2744 100%)"
                : "#1a2744",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: isGranted ? "0 6px 24px rgba(14,18,255,0.3)" : "none",
              transition: "background 0.6s ease, box-shadow 0.6s ease",
              position: "relative", overflow: "hidden",
            }}>
              {/* Shimmer overlay on granted */}
              {isGranted && (
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 50%, transparent 80%)",
                  backgroundSize: "200% auto",
                  animation: "shimmer 1.8s linear infinite",
                }} />
              )}

              {/* Shield SVG */}
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                {/* Checkmark draws in on granted */}
                {isGranted && (
                  <polyline
                    points="9,12 11,14 15,10"
                    strokeWidth="2"
                    strokeDasharray="40"
                    strokeDashoffset="0"
                    style={{ animation: "checkDraw 0.4s ease 0.1s both" }}
                  />
                )}
              </svg>
            </div>
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#1a2744",
              letterSpacing: "-0.5px",
            }}>
              ICT Admin
            </span>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#8c9bba",
              letterSpacing: "3.5px",
              textTransform: "uppercase",
              marginTop: 10,
            }}>
              Control Center
            </span>
          </div>
        </div>

        {/* ── Status row ─────────────────────────────────── */}
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: 14,
          opacity: isIn ? 1 : 0,
          transition: "opacity 0.4s ease 0.35s",
        }}>

          {/* Status label */}
          <span style={{
            fontSize: 13.5,
            fontWeight: 500,
            color: isGranted ? "#16a34a" : "#8c9bba",
            letterSpacing: "0.3px",
            transition: "color 0.5s ease",
            animation: isGranted ? "floatUp 0.4s ease both" : undefined,
          }}>
            {isGranted ? "✓  Access granted — redirecting" : "Verifying credentials"}
          </span>

          {/* Progress bar */}
          <div style={{
            width: 260, height: 4,
            borderRadius: 99,
            background: "#eaeef5",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              borderRadius: 99,
              backgroundImage: isGranted
                ? "linear-gradient(90deg, #16a34a, #22c55e)"
                : "linear-gradient(90deg, #eaeef5 0%, #1a2744 40%, #0e12ff 60%, #eaeef5 100%)",
              backgroundSize: "300% auto",
              animation: isGranted ? undefined : "shimmer 1.6s linear infinite",
              width: isGranted ? "100%" : "100%",
              transition: "background-image 0.5s ease, width 0.8s ease",
            }} />
          </div>
        </div>

      </div>
    </>
  );
}
