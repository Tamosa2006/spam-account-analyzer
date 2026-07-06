"use client";
import { useRef } from "react";

type Props = {
  preview: string | null;
  onFile: (base64: string, preview: string) => void;
};

export default function UploadZone({ preview, onFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onFile(result.split(",")[1], result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onFile(result.split(",")[1], result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="upload-zone"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {!preview ? (
        <>
          <div
            style={{
              width: 56,
              height: 56,
              margin: "0 auto 14px",
              background:
                "linear-gradient(135deg,rgba(74,222,128,0.1),rgba(167,139,250,0.1))",
              border: "1px solid rgba(74,222,128,0.2)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            🖼️
          </div>
          <h3>Click to upload an image</h3>
          <p style={{ marginTop: 4 }}>PNG &middot; JPG &middot; JPEG &middot; WEBP</p>
          <p style={{ marginTop: 10, fontSize: 11, color: "rgba(167,139,250,0.6)" }}>
            or drag and drop here
          </p>
        </>
      ) : (
        <div style={{ position: "relative" }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxHeight: 280,
              width: "100%",
              objectFit: "contain",
              borderRadius: 10,
              border: "1px solid rgba(74,222,128,0.2)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(74,222,128,0.3)",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 11,
              color: "#4ade80",
            }}
          >
            Click to change
          </div>
        </div>
      )}
    </div>
  );
}