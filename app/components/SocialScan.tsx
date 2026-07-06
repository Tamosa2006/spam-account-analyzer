"use client";
import { useState } from "react";
import { SocialScanResult, SocialResult } from "../types";
import FaceCropper from "./FaceCropper";

type Props = {
  imageUrl: string;
  imageBase64: string;
};

const platformConfig = {
  Instagram: {
    color: "#e1306c",
    bg: "rgba(225,48,108,0.08)",
    border: "rgba(225,48,108,0.25)",
    icon: "📸",
    label: "Instagram",
  },
  X: {
    color: "#1d9bf0",
    bg: "rgba(29,155,240,0.08)",
    border: "rgba(29,155,240,0.25)",
    icon: "✖",
    label: "X / Twitter",
  },
  Facebook: {
    color: "#1877f2",
    bg: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.25)",
    icon: "👤",
    label: "Facebook",
  },
  Pinterest: {
    color: "#e60023",
    bg: "rgba(230,0,35,0.08)",
    border: "rgba(230,0,35,0.25)",
    icon: "📌",
    label: "Pinterest",
  },
  Other: {
    color: "#94a3b8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.25)",
    icon: "🌐",
    label: "Other",
  },
};

function MatchBar({ score }: { score: number }) {
  const color = score >= 90 ? "#4ade80" : score >= 75 ? "#fbbf24" : "#f87171";
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{
          fontSize: 10, color: "#475569", fontWeight: 600,
          textTransform: "uppercase", letterSpacing: "0.08em",
        }}>
          Match Score
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}%</span>
      </div>
      <div style={{
        height: 4, background: "rgba(255,255,255,0.06)",
        borderRadius: 999, overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${score}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 999, transition: "width 1s ease",
        }} />
      </div>
    </div>
  );
}

function ResultCard({ item }: { item: SocialResult }) {
  const cfg = platformConfig[item.platform] || platformConfig.Other;
  const score = item.matchScore || 75;
  return (
    <div
      className="social-result-item"
      style={{
        borderColor: item.isProfile
          ? "rgba(74,222,128,0.35)"
          : score >= 90
          ? "rgba(74,222,128,0.2)"
          : "var(--border)",
        background: item.isProfile
          ? "rgba(74,222,128,0.04)"
          : "var(--card)",
      }}
    >
      {/* Thumbnail */}
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt="match"
          style={{
            width: 64, height: 64, borderRadius: item.isProfile ? "50%" : 8,
            objectFit: "cover", flexShrink: 0,
            border: `2px solid ${item.isProfile
              ? "rgba(74,222,128,0.5)"
              : cfg.border}`,
          }}
        />
      ) : (
        <div style={{
          width: 64, height: 64,
          borderRadius: item.isProfile ? "50%" : 8,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 28, flexShrink: 0,
        }}>
          {item.isProfile ? "👤" : cfg.icon}
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{
          display: "flex", alignItems: "center",
          gap: 6, marginBottom: 4, flexWrap: "wrap",
        }}>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: cfg.color, background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            padding: "2px 8px", borderRadius: 999,
          }}>
            {cfg.icon} {cfg.label}
          </span>
          {item.isProfile && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#4ade80",
              background: "rgba(74,222,128,0.12)",
              border: "1px solid rgba(74,222,128,0.3)",
              padding: "2px 8px", borderRadius: 999,
            }}>
              👤 Profile Page
            </span>
          )}
          {score >= 90 && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#4ade80",
              background: "rgba(74,222,128,0.1)",
              border: "1px solid rgba(74,222,128,0.25)",
              padding: "2px 8px", borderRadius: 999,
            }}>
              ✓ Exact Match
            </span>
          )}
        </div>

        <p style={{
          fontSize: 13, color: "#e2e8f0", fontWeight: 600,
          overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap", marginBottom: 2,
        }}>
          {item.title}
        </p>

        {item.snippet && (
          <p style={{
            fontSize: 11,
            color: item.isProfile ? "#4ade80" : "#475569",
            lineHeight: 1.4, marginBottom: 4,
          }}>
            {item.snippet}
          </p>
        )}

        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: 11, color: cfg.color,
            textDecoration: "none", display: "block",
            overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {item.url}
        </a>

        <MatchBar score={score} />
      </div>

      {/* View Button */}
      <a
        href={item.url}
        target="_blank"
        rel="noreferrer"
        style={{
          flexShrink: 0, padding: "8px 12px",
          background: item.isProfile
            ? "rgba(74,222,128,0.12)"
            : cfg.bg,
          border: `1px solid ${item.isProfile
            ? "rgba(74,222,128,0.35)"
            : cfg.border}`,
          borderRadius: 8, fontSize: 12,
          color: item.isProfile ? "#4ade80" : cfg.color,
          fontWeight: 700, textDecoration: "none",
          whiteSpace: "nowrap", alignSelf: "center",
        }}
      >
        {item.isProfile ? "View Profile" : "View Post"}
      </a>
    </div>
  );
}

export default function SocialScan({ imageUrl, imageBase64 }: Props) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<SocialScanResult | null>(null);
  const [activeTab, setActiveTab] = useState("Profiles");
  const [faceCroppedBase64, setFaceCroppedBase64] = useState<string | null>(null);
  const [faceStatus, setFaceStatus] = useState<"pending" | "found" | "notfound">("pending");
  const [faceUploadedUrl, setFaceUploadedUrl] = useState<string | null>(null);

  const tabs = ["Profiles", "All Posts", "Instagram", "X", "Facebook", "Pinterest"];

  const handleFaceCropped = async (base64: string) => {
    setFaceCroppedBase64(base64);
    setFaceStatus("found");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      setFaceUploadedUrl(data.url);
    } catch (err) {
      console.error("Face upload failed:", err);
    }
  };

  const handleNoFace = () => setFaceStatus("notfound");

  const handleScan = async () => {
    setScanning(true);
    setResult(null);
    const searchUrl = faceUploadedUrl || imageUrl;
    try {
      const res = await fetch("/api/social-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: searchUrl,
          searchMode: faceUploadedUrl ? "face" : "full",
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.totalProfiles > 0) setActiveTab("Profiles");
      else setActiveTab("All Posts");
    } catch (err) {
      console.error("Social scan failed:", err);
    } finally {
      setScanning(false);
    }
  };

  const getTabResults = (): SocialResult[] => {
    if (!result) return [];
    if (activeTab === "Profiles") return result.profiles || [];
    if (activeTab === "All Posts") return result.posts || [];
    return (result.allFound || []).filter((r) => r.platform === activeTab);
  };

  const countTab = (tab: string): number => {
    if (!result) return 0;
    if (tab === "Profiles") return result.profiles?.length || 0;
    if (tab === "All Posts") return result.posts?.length || 0;
    return (result.allFound || []).filter((r) => r.platform === tab).length;
  };

  const encoded = encodeURIComponent(faceUploadedUrl || imageUrl);
  const manualUrls: Record<string, string> = {
    Instagram: `https://www.google.com/searchbyimage?image_url=${encoded}&q=site:instagram.com`,
    X: `https://www.google.com/searchbyimage?image_url=${encoded}&q=site:x.com`,
    Facebook: `https://www.google.com/searchbyimage?image_url=${encoded}&q=site:facebook.com`,
    Pinterest: `https://www.pinterest.com/search/pins/?q=${encoded}`,
  };

  const previewSrc = imageBase64
    ? `data:image/jpeg;base64,${imageBase64}`
    : imageUrl;

  return (
    <div className="result-card">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div className="card-label">🛡️ Social Media Face Search</div>
        <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7 }}>
          Detects the <strong style={{ color: "#4ade80" }}>face</strong> from
          your image and searches for that person&apos;s actual{" "}
          <strong style={{ color: "#a78bfa" }}>profile pages</strong> — not
          random posts or boards.
        </p>
      </div>

      {/* Face Detection */}
      <div style={{ marginBottom: 16 }}>
        <FaceCropper
          imageSrc={previewSrc}
          onFaceCropped={handleFaceCropped}
          onNoFace={handleNoFace}
        />
      </div>

      {/* Face Preview */}
      {faceCroppedBase64 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 16px",
          background: "rgba(74,222,128,0.05)",
          border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: 12, marginBottom: 16,
        }}>
          <img
            src={`data:image/jpeg;base64,${faceCroppedBase64}`}
            alt="Detected face"
            style={{
              width: 64, height: 64, borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid rgba(74,222,128,0.5)",
              flexShrink: 0,
            }}
          />
          <div>
            <p style={{ fontSize: 13, color: "#4ade80", fontWeight: 700, marginBottom: 4 }}>
              ✓ Face Detected &amp; Ready
            </p>
            <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
              Searching by face using Google Lens + Yandex for best accuracy.
            </p>
          </div>
        </div>
      )}

      {/* How it works */}
      <div style={{
        background: "rgba(96,165,250,0.05)",
        border: "1px solid rgba(96,165,250,0.15)",
        borderRadius: 10, padding: "12px 16px",
        marginBottom: 16, display: "flex", gap: 10,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>🔬</span>
        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.8 }}>
          <strong style={{ color: "#60a5fa" }}>3-engine search:</strong>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 4 }}>
            <span>🔍 <strong style={{ color: "#fff" }}>Google Lens</strong> — visual face matching</span>
            <span>🔍 <strong style={{ color: "#fff" }}>Yandex Images</strong> — best for non-famous people</span>
            <span>🔍 <strong style={{ color: "#fff" }}>Google Search</strong> — profile page detection</span>
          </div>
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 2 }}>
            <span><strong style={{ color: "#4ade80" }}>90–99%</strong> — Exact match</span>
            <span><strong style={{ color: "#fbbf24" }}>75–89%</strong> — High similarity</span>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div style={{
        background: "rgba(251,191,36,0.05)",
        border: "1px solid rgba(251,191,36,0.15)",
        borderRadius: 10, padding: "12px 16px",
        marginBottom: 20, display: "flex", gap: 10,
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
        <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>
          <strong style={{ color: "#fbbf24" }}>Private accounts:</strong>{" "}
          If the person&apos;s profile is private or they use a different
          profile photo, they may not appear. Use manual search buttons as
          a fallback.
        </p>
      </div>

      {/* Scan Button */}
      {!result && !scanning && (
        <button
          onClick={handleScan}
          disabled={faceStatus === "pending"}
          style={{
            width: "100%", padding: "14px",
            background: faceStatus === "pending"
              ? "transparent"
              : faceStatus === "found"
              ? "linear-gradient(135deg,rgba(74,222,128,0.1),rgba(96,165,250,0.1))"
              : "linear-gradient(135deg,rgba(225,48,108,0.1),rgba(29,155,240,0.1))",
            border: "1px solid",
            borderColor: faceStatus === "pending"
              ? "var(--border)"
              : faceStatus === "found"
              ? "rgba(74,222,128,0.4)"
              : "rgba(225,48,108,0.4)",
            color: faceStatus === "pending"
              ? "var(--muted)"
              : faceStatus === "found"
              ? "#4ade80"
              : "#e1306c",
            fontFamily: "'DM Sans','Segoe UI',sans-serif",
            fontSize: 15, fontWeight: 700, borderRadius: 12,
            cursor: faceStatus === "pending" ? "not-allowed" : "pointer",
            opacity: faceStatus === "pending" ? 0.5 : 1,
            transition: "all 0.3s",
          }}
        >
          {faceStatus === "pending"
            ? "⏳ Detecting face..."
            : faceStatus === "found"
            ? "🔍 Find This Person's Profiles"
            : "🔍 Search by Full Image"}
        </button>
      )}

      {/* Scanning */}
      {scanning && (
        <div style={{ textAlign: "center", padding: "28px 0" }}>
          <div style={{
            display: "flex", justifyContent: "center",
            gap: 12, marginBottom: 16,
          }}>
            {(["Instagram", "X", "Facebook", "Pinterest"] as const).map((p, i) => (
              <div key={p} style={{
                width: 44, height: 44, borderRadius: 12,
                background: platformConfig[p].bg,
                border: `1px solid ${platformConfig[p].border}`,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 22,
                animation: `pulse-social ${0.5 + i * 0.15}s ease-in-out infinite`,
              }}>
                {platformConfig[p].icon}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>
            Running Google Lens + Yandex + Google Search...
          </p>
          <p style={{ fontSize: 11, color: "#334155" }}>
            Looking for profile pages specifically
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div>
          <div style={{
            padding: "14px 16px", marginBottom: 16,
            background: result.totalProfiles > 0
              ? "rgba(248,113,113,0.07)"
              : "rgba(74,222,128,0.07)",
            border: `1px solid ${result.totalProfiles > 0
              ? "rgba(248,113,113,0.25)"
              : "rgba(74,222,128,0.25)"}`,
            borderRadius: 10,
          }}>
            {result.totalProfiles > 0 ? (
              <p style={{ fontSize: 15, fontWeight: 700, color: "#f87171", marginBottom: 6 }}>
                ⚠️ Found {result.totalProfiles} profile{result.totalProfiles > 1 ? "s" : ""} matching this face!
              </p>
            ) : (
              <p style={{ fontSize: 15, fontWeight: 700, color: "#4ade80", marginBottom: 6 }}>
                ✅ No profile pages found for this face
              </p>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "Profiles", val: result.totalProfiles, color: "#4ade80" },
                { label: "Posts", val: result.posts?.length || 0, color: "#a78bfa" },
                { label: "Total", val: result.totalAll, color: "#60a5fa" },
              ].map((s) => (
                <div key={s.label} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${s.color}22`,
                  borderRadius: 8, padding: "4px 10px",
                }}>
                  <span style={{ fontSize: 11, color: "#475569" }}>{s.label}:</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>
                    {s.val}
                  </span>
                </div>
              ))}
              <button
                onClick={() => { setResult(null); setActiveTab("Profiles"); }}
                style={{
                  marginLeft: "auto", fontSize: 11,
                  color: "#475569", background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                }}
              >
                Rescan
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>
              Scanned at {new Date(result.scannedAt).toLocaleTimeString()}
              {faceStatus === "found" && (
                <span style={{
                  marginLeft: 8, color: "#4ade80",
                  background: "rgba(74,222,128,0.1)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  borderRadius: 999, padding: "1px 6px", fontSize: 10,
                }}>
                  Face search
                </span>
              )}
            </p>
          </div>

          <div style={{
            display: "flex", gap: 6,
            marginBottom: 14, flexWrap: "wrap",
          }}>
            {tabs.map((tab) => {
              const count = countTab(tab);
              if (count === 0 && tab !== "Profiles" && tab !== "All Posts") return null;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`social-tab ${activeTab === tab ? "active" : ""}`}
                  style={{
                    background: tab === "Profiles" && activeTab === tab
                      ? "rgba(74,222,128,0.12)"
                      : undefined,
                    borderColor: tab === "Profiles" && activeTab === tab
                      ? "rgba(74,222,128,0.5)"
                      : undefined,
                  }}
                >
                  {tab === "Profiles" && "👤 "}
                  {tab}
                  {count > 0 && (
                    <span style={{ marginLeft: 4 }}>({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {getTabResults().length === 0 ? (
              <div className="no-results-box">
                {activeTab === "Profiles"
                  ? "No profile pages found. Try 'All Posts' tab or manual search below."
                  : "No results for this filter. Try another tab."}
              </div>
            ) : (
              getTabResults().map((item, i) => (
                <ResultCard key={i} item={item} />
              ))
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            <p style={{
              fontSize: 11, color: "#334155", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 10,
            }}>
              Manual Search — Search Each Platform Directly
            </p>
            <div className="social-grid">
              {(["Instagram", "X", "Facebook", "Pinterest"] as const).map((p) => {
                const cfg = platformConfig[p];
                return (
                  <a
                    key={p}
                    href={manualUrls[p]}
                    target="_blank"
                    rel="noreferrer"
                    className="social-btn"
                    style={{
                      color: cfg.color,
                      borderColor: cfg.border,
                      background: cfg.bg,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                    Search {p}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}