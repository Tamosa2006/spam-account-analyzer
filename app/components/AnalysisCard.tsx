import { AnalysisResult } from "../types";

type Props = {
  analysis: AnalysisResult;
};

const riskColor = {
  Low: {
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.25)",
    text: "#4ade80",
  },
  Medium: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.25)",
    text: "#fbbf24",
  },
  High: {
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.25)",
    text: "#f87171",
  },
};

export default function AnalysisCard({ analysis }: Props) {
  const risk = riskColor[analysis.usageRisk] ?? riskColor["Low"];

  return (
    <div
      className="result-card"
      style={{ display: "flex", flexDirection: "column", gap: 20 }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div className="card-label">🤖 AI Analysis &middot; Groq Vision</div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#f0f4ff",
              letterSpacing: "-0.01em",
              marginBottom: 8,
            }}
          >
            {analysis.title}
          </h2>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#a78bfa",
              background: "rgba(167,139,250,0.1)",
              border: "1px solid rgba(167,139,250,0.2)",
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            {analysis.category}
          </span>
        </div>

        {/* Risk Badge */}
        <div
          style={{
            background: risk.bg,
            border: `1px solid ${risk.border}`,
            borderRadius: 12,
            padding: "12px 18px",
            textAlign: "center",
            minWidth: 90,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: risk.text,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Risk Level
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: risk.text }}>
            {analysis.usageRisk}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg,rgba(74,222,128,0.2),rgba(167,139,250,0.2),transparent)",
        }}
      />

      {/* Description */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#475569",
            marginBottom: 10,
          }}
        >
          Description
        </div>
        <p className="desc-text">{analysis.description}</p>
      </div>

      {/* Two Column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Colors */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#475569",
              marginBottom: 10,
            }}
          >
            Dominant Colors
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {analysis.dominantColors?.map((color) => (
              <div
                key={color}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: color.startsWith("#")
                      ? color
                      : "rgba(167,139,250,0.5)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{color}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detected Text */}
        <div
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#475569",
              marginBottom: 10,
            }}
          >
            Detected Text
          </div>
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color:
                analysis.detectedText === "None detected"
                  ? "#475569"
                  : "#60a5fa",
              fontStyle:
                analysis.detectedText === "None detected"
                  ? "italic"
                  : "normal",
            }}
          >
            {analysis.detectedText}
          </p>
        </div>
      </div>

      {/* Labels */}
      {analysis.labels?.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#475569",
              marginBottom: 10,
            }}
          >
            Detected Labels
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {analysis.labels.map((label) => (
              <span key={label} className="tag">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Misuse */}
      {analysis.possibleMisuse && (
        <div className="misuse-alert">
          ⚠️ <strong>Possible Misuse Detected</strong>
          <p style={{ marginTop: 6, opacity: 0.85, lineHeight: 1.6 }}>
            {analysis.misuseReason}
          </p>
        </div>
      )}
    </div>
  );
}