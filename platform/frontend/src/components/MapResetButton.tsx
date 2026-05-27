"use client";

interface MapResetButtonProps {
  visible: boolean;
  scale: number;
  onReset: () => void;
}

export default function MapResetButton({ visible, scale, onReset }: MapResetButtonProps) {
  if (!visible) return null;

  return (
    <>
      {/* Zoom indicator — top-left */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          zIndex: 20,
          background: "rgba(31,42,18,0.85)",
          color: "var(--mi-accent-gold)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          padding: "3px 7px",
          pointerEvents: "none",
          animation: "mi-fade-in 150ms ease-out",
        }}
      >
        Zoom {scale.toFixed(1)}×
      </div>

      {/* Reset button — bottom-right, 44×44 touch target */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 8,
          zIndex: 20,
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <button
          onClick={onReset}
          aria-label="Restablecer zoom del mapa"
          style={{
            background: "var(--mi-ink)",
            color: "var(--mi-bg-paper)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            padding: "4px 8px",
            border: "1.5px solid var(--mi-bg-paper)",
            cursor: "pointer",
            whiteSpace: "nowrap",
            animation: "mi-fade-in 150ms ease-out",
          }}
        >
          Reset ⟲
        </button>
      </div>
    </>
  );
}
