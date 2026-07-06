import { SourceResult } from "../types";

type Props = {
  sources: SourceResult[];
};

export default function SourcesList({ sources }: Props) {
  if (sources.length === 0) {
    return (
      <div className="result-card">
        <div className="card-label">🌐 Found On These Pages</div>
        <div className="no-results-box">
          ℹ️ No matching pages found via reverse search. Try the external
          search buttons below.
        </div>
      </div>
    );
  }

  return (
    <div className="result-card">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div className="card-label" style={{ marginBottom: 0 }}>
          🌐 Found On These Pages
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#4ade80",
            background: "rgba(74,222,128,0.1)",
            border: "1px solid rgba(74,222,128,0.25)",
            padding: "3px 10px",
            borderRadius: 999,
          }}
        >
          {sources.length} sources
        </span>
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {sources.map((source, i) => (
          <div key={i} className="source-item">
            <div className="source-num">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              {/* Fixed: Added the missing 'a' tag here */}
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="source-link"
              >
                {source.title || source.url}
              </a>
              {source.title && (
                <p
                  style={{
                    fontSize: 11,
                    color: "#334155",
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {source.url}
                </p>
              )}
            </div>
            
            {/* Fixed: Added the missing 'a' tag here */}
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(96,165,250,0.08)",
                border: "1px solid rgba(96,165,250,0.2)",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 13,
                color: "#60a5fa",
                opacity: 0.5,
                transition: "opacity 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.background = "rgba(96,165,250,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.5";
                e.currentTarget.style.background = "rgba(96,165,250,0.08)";
              }}
            >
              &rarr;
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}