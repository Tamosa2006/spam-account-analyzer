type Props = {
  imageUrl: string;
};

export default function ExternalSearch({ imageUrl }: Props) {
  const encoded = encodeURIComponent(imageUrl);

  const buttons = [
    {
      label: "Google Lens",
      icon: "🔴",
      href: `https://lens.google.com/uploadbyurl?url=${encoded}`,
      className: "google",
      desc: "Best for exact matches",
    },
    {
      label: "TinEye",
      icon: "🟣",
      href: `https://tineye.com/search?url=${encoded}`,
      className: "tineye",
      desc: "Reverse image search",
    },
    {
      label: "Yandex",
      icon: "🟡",
      href: `https://yandex.com/images/search?url=${encoded}&rpt=imageview`,
      className: "yandex",
      desc: "Great for faces & objects",
    },
    {
      label: "Bing Visual",
      icon: "🔵",
      href: `https://www.bing.com/images/search?q=imgurl:${encoded}&view=detailv2&iss=sbi`,
      className: "bing",
      desc: "Good for screenshots",
    },
  ];

  return (
    <div className="result-card">
      <div className="card-label">🔗 Search Externally</div>
      <p
        style={{
          fontSize: 13,
          color: "#64748b",
          marginBottom: 20,
          lineHeight: 1.6,
        }}
      >
        Didn&apos;t find enough results? Try these search engines directly
        for additional sources.
      </p>

      <div className="ext-grid">
        {buttons.map((btn) => (
          /* Fixed: Added the missing 'a' tag here */
          <a
            key={btn.label}
            href={btn.href}
            target="_blank"
            rel="noreferrer"
            className={`ext-btn ${btn.className}`}
            style={{ 
              display: "flex", // Added display flex to make flexDirection work
              flexDirection: "column", 
              gap: 6, 
              padding: "18px 12px",
              textDecoration: "none", // Common for anchor buttons
              color: "inherit"        // Maintain text color
            }}
          >
            <span style={{ fontSize: 24 }}>{btn.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{btn.label}</span>
            <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 400 }}>
              {btn.desc}
            </span>
          </a>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: "14px 16px",
          background: "rgba(96,165,250,0.05)",
          border: "1px solid rgba(96,165,250,0.15)",
          borderRadius: 10,
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7 }}>
          <strong style={{ color: "#60a5fa" }}>Pro Tip: </strong>
          Google Lens and TinEye are best for exact matches. Yandex is
          excellent for faces and objects. Bing works well for product
          images and screenshots.
        </p>
      </div>
    </div>
  );
}