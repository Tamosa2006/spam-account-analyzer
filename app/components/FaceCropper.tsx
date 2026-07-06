"use client";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";

type Props = {
  imageSrc: string;
  onFaceCropped: (faceCroppedBase64: string) => void;
  onNoFace: () => void;
};

export default function FaceCropper({ imageSrc, onFaceCropped, onNoFace }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "found" | "notfound" | "idle">("idle");

  useEffect(() => {
    if (!imageSrc) return;

    const detect = async () => {
      setStatus("loading");
      try {
        // Load models from public folder
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageSrc;
        await new Promise((res) => (img.onload = res));

        // Detect face
        const detection = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks();

        if (!detection) {
          setStatus("notfound");
          onNoFace();
          return;
        }

        // Crop just the face with padding
        const box = detection.detection.box;
        const padding = 40;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const x = Math.max(0, box.x - padding);
        const y = Math.max(0, box.y - padding);
        const w = Math.min(img.width - x, box.width + padding * 2);
        const h = Math.min(img.height - y, box.height + padding * 2);

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

        const faceCroppedBase64 = canvas
          .toDataURL("image/jpeg", 0.92)
          .split(",")[1];

        setStatus("found");
        onFaceCropped(faceCroppedBase64);
      } catch (err) {
        console.error("Face detection error:", err);
        setStatus("notfound");
        onNoFace();
      }
    };

    detect();
  }, [imageSrc]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {status === "loading" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px",
          background: "rgba(96,165,250,0.08)",
          border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: 8, fontSize: 12, color: "#60a5fa",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#60a5fa",
            animation: "pulse-green 1s ease-in-out infinite",
          }} />
          Detecting face in image...
        </div>
      )}
      {status === "found" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px",
          background: "rgba(74,222,128,0.08)",
          border: "1px solid rgba(74,222,128,0.2)",
          borderRadius: 8, fontSize: 12, color: "#4ade80",
        }}>
          ✓ Face detected — will search by face, not outfit
        </div>
      )}
      {status === "notfound" && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 14px",
          background: "rgba(251,191,36,0.08)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: 8, fontSize: 12, color: "#fbbf24",
        }}>
          ⚠ No face detected — searching by full image
        </div>
      )}
    </div>
  );
}