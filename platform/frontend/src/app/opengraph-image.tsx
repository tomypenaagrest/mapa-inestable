import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mapa Inestable — Cartografía política del sur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#C5663A",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          gap: 24,
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontFamily: "serif",
            fontSize: 96,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "#F4E9D2",
            lineHeight: 0.9,
            textAlign: "center",
          }}
        >
          Mapa Inestable
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 18,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#E8C58A",
          }}
        >
          Cartografía política del sur
        </div>

        {/* Regla decorativa */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#E8C58A",
            marginTop: 8,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
