"use client";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import UploadZone from "./components/UploadZone";
import AnalysisCard from "./components/AnalysisCard";
import SourcesList from "./components/SourcesList";
import ExternalSearch from "./components/ExternalSearch";
import SocialScan from "./components/SocialScan";
import ParticleCanvas from "./components/ParticleCanvas";
import { AnalysisResult, SourceResult } from "./types";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [sources, setSources] = useState<SourceResult[] | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const analysisRef = useRef<HTMLDivElement>(null);
  const sourcesRef = useRef<HTMLDivElement>(null);
  const externalRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);

  // ── Custom Cursor ──
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const trail = document.getElementById("cursor-trail");
    const onMove = (e: MouseEvent) => {
      if (cursor) {
        cursor.style.left = e.clientX - 6 + "px";
        cursor.style.top = e.clientY - 6 + "px";
      }
      setTimeout(() => {
        if (trail) {
          trail.style.left = e.clientX - 15 + "px";
          trail.style.top = e.clientY - 15 + "px";
        }
      }, 80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Entrance Animations ──
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(headerRef.current, {
      opacity: 0, y: 50, duration: 1, ease: "power3.out",
    })
      .from(uploadRef.current, {
        opacity: 0, y: 30, duration: 0.7, ease: "power2.out",
      }, "-=0.5")
      .from(".scan-btn", {
        opacity: 0, y: 20, duration: 0.6, ease: "power2.out",
      }, "-=0.4");
  }, []);

  // ── ScrollTrigger for Results ──
  useEffect(() => {
    if (!analysis) return;

    const sections = [
      analysisRef.current,
      sourcesRef.current,
      externalRef.current,
      socialRef.current,
    ].filter(Boolean);

    sections.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [analysis, sources]);

  // ── File Handler ──
  const handleFile = (b64: string, prev: string) => {
    setBase64(b64);
    setPreview(prev);
    setAnalysis(null);
    setSources(null);
    setImageUrl(null);
  };

  // ── Analyze ──
  const handleAnalyze = async () => {
    if (!base64) return;
    setLoading(true);
    try {
      // Step 1: Upload to ImgBB
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const { url } = await uploadRes.json();
      setImageUrl(url);

      // Step 2: Groq Vision Analysis
      const describeRes = await fetch("/api/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const analysisData = await describeRes.json();
      setAnalysis(analysisData);

      // Step 3: Reverse Image Search
      const reverseRes = await fetch("/api/reverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      const reverseData = await reverseRes.json();
      setSources(reverseData?.results || []);

    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Fixed Elements */}
      <div id="cursor" />
      <div id="cursor-trail" />
      <div className="hud-tl" />
      <div className="hud-br" />
      <ParticleCanvas />

      <main
        style={{ position: "relative", zIndex: 10 }}
        className="min-h-screen flex flex-col items-center px-6"
      >
        {/* ── Hero Section ── */}
        <section
          className="w-full max-w-2xl flex flex-col items-center
                     justify-center min-h-screen py-20 space-y-6"
        >
          <div ref={headerRef} className="text-center w-full">

            {/* Floating Icon */}
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              margin: "0 auto 24px",
              background: "linear-gradient(135deg,rgba(74,222,128,0.15),rgba(167,139,250,0.15))",
              border: "1px solid rgba(74,222,128,0.25)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 32,
              animation: "float 4s ease-in-out infinite",
            }}>
              🔍
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'DM Sans','Segoe UI',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(34px,6vw,56px)",
              lineHeight: 1.05, letterSpacing: "-0.02em",
              background: "linear-gradient(135deg,#4ade80 0%,#a78bfa 50%,#60a5fa 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-shift 5s ease infinite",
              marginBottom: 14,
            }}>
              Image Source Finder
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 15, color: "#64748b",
              lineHeight: 1.7, marginBottom: 24,
            }}>
              Upload any image &middot; AI analyzes it in depth
              <br />
              and finds every place it appears online
            </p>

            {/* Divider */}
            <div style={{
              height: 1, marginBottom: 8,
              background: "linear-gradient(90deg,transparent,rgba(74,222,128,0.3),rgba(167,139,250,0.3),transparent)",
            }} />
          </div>

          {/* Upload Zone */}
          <div ref={uploadRef} className="w-full">
            <UploadZone preview={preview} onFile={handleFile} />
          </div>

          {/* Scan Button */}
          <button
            className="scan-btn"
            onClick={handleAnalyze}
            disabled={!base64 || loading}
            style={{
              width: "100%", padding: "16px",
              background: !base64 || loading
                ? "transparent"
                : "linear-gradient(135deg,rgba(74,222,128,0.1),rgba(167,139,250,0.1))",
              border: "1px solid",
              borderColor: !base64 || loading ? "var(--border)" : "rgba(74,222,128,0.5)",
              color: !base64 || loading ? "var(--muted)" : "#4ade80",
              fontFamily: "'DM Sans','Segoe UI',sans-serif",
              fontSize: 16, fontWeight: 700, letterSpacing: "0.04em",
              borderRadius: 14,
              cursor: !base64 || loading ? "not-allowed" : "pointer",
              opacity: !base64 || loading ? 0.45 : 1,
              transition: "all 0.3s ease",
            }}
          >
            {loading ? "⏳ Scanning..." : "🔍 Find Image Sources"}
          </button>

          {/* Loading Indicator */}
          {loading && (
            <div style={{
              width: "100%", textAlign: "center", padding: "20px",
              background: "rgba(74,222,128,0.04)",
              border: "1px solid rgba(74,222,128,0.12)",
              borderRadius: 12,
            }}>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 14 }}>
                Uploading &rarr; Analyzing with Groq Vision &rarr; Reverse searching...
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                {[
                  { color: "#4ade80", label: "Upload" },
                  { color: "#a78bfa", label: "Analyze" },
                  { color: "#60a5fa", label: "Search" },
                ].map((step, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${step.color}30`,
                    borderRadius: 8, padding: "6px 14px",
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: step.color,
                      animation: `pulse-green ${0.8 + i * 0.2}s ease-in-out infinite`,
                    }} />
                    <span style={{ fontSize: 12, color: step.color }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Results Section ── */}
        {analysis && (
          <section className="w-full max-w-2xl space-y-8 pb-24">

            {/* Scan Complete Badge */}
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "8px 20px",
                background: "rgba(74,222,128,0.06)",
                border: "1px solid rgba(74,222,128,0.2)",
                borderRadius: 999,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4ade80",
                  animation: "pulse-green 1.5s ease-in-out infinite",
                }} />
                <span style={{
                  fontSize: 12, color: "#4ade80", fontWeight: 700,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                }}>
                  Scan Complete
                </span>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#4ade80",
                  animation: "pulse-green 1.5s ease-in-out infinite",
                }} />
              </div>
            </div>

            {/* Analysis Card */}
            <div ref={analysisRef} style={{ opacity: 0 }}>
              <AnalysisCard analysis={analysis} />
            </div>

            {/* Sources List */}
            {sources !== null && (
              <div ref={sourcesRef} style={{ opacity: 0 }}>
                <SourcesList sources={sources} />
              </div>
            )}

            {/* External Search */}
            {imageUrl && (
              <div ref={externalRef} style={{ opacity: 0 }}>
                <ExternalSearch imageUrl={imageUrl} />
              </div>
            )}

            {/* ✅ Social Media Face Search */}
            {imageUrl && base64 && (
              <div ref={socialRef} style={{ opacity: 0 }}>
                <SocialScan
                  imageUrl={imageUrl}
                  imageBase64={base64}
                />
              </div>
            )}

          </section>
        )}
      </main>
    </>
  );
}