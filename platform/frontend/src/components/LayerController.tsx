"use client";
// Spec 39 — Rail izquierdo de /mapa: toggle de capas + filtros país/eje.

import Image from "next/image";
import { LAYER_IDS, LAYERS } from "@/lib/layers";
import type { LayerId } from "@/lib/layers";


interface LayerControllerProps {
  activeLayerId: LayerId | null;
  onLayerChange: (id: LayerId | null) => void;
}

const LABEL_STYLE: React.CSSProperties = {
  fontFamily:    "var(--mi-font-mono)",
  fontSize:      "var(--mi-text-xs)",
  textTransform: "uppercase",
  letterSpacing: "var(--mi-tracking-widest)",
  color:         "var(--mi-ink-mute)",
  marginBottom:  "var(--mi-space-2)",
};

export default function LayerController({ activeLayerId, onLayerChange }: LayerControllerProps) {
  return (
    <div style={{
      width: 240,
      flexShrink: 0,
      borderRight: "var(--mi-border-bold)",
      background: "var(--mi-bg-paper)",
      padding: "var(--mi-space-4) var(--mi-space-3)",
      overflowY: "auto",
      height: "100%",
    }}>

      <div style={LABEL_STYLE}>Capas</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>

        <LayerOption
          isActive={activeLayerId === null}
          onClick={() => onLayerChange(null)}
          label="Sin capa"
          subLabel="Navegación editorial"
          glyphSrc={null}
        />

        {LAYER_IDS.map(id => {
          const layer = LAYERS[id];
          return (
            <LayerOption
              key={id}
              isActive={activeLayerId === id}
              onClick={() => onLayerChange(id)}
              label={layer.shortLabel}
              subLabel={layer.description.split(".")[0]}
              glyphSrc={layer.glyphSrc}
            />
          );
        })}
      </div>
    </div>
  );
}

// ── Opción de capa individual ──────────────────────────────────────────────

function LayerOption({
  isActive,
  onClick,
  label,
  subLabel,
  glyphSrc,
}: {
  isActive: boolean;
  onClick: () => void;
  label: string;
  subLabel: string;
  glyphSrc: string | null;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--mi-space-2)",
        padding: "var(--mi-space-2) var(--mi-space-2)",
        border: `2px solid ${isActive ? "var(--mi-ink)" : "var(--mi-rule-soft)"}`,
        background: isActive ? "var(--mi-bg-cream)" : "transparent",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "border-color 120ms, background 120ms",
      }}
    >
      {/* Radio indicator */}
      <span style={{
        width: 12,
        height: 12,
        borderRadius: "50%",
        border: `2px solid ${isActive ? "var(--mi-ink)" : "var(--mi-rule-soft)"}`,
        background: isActive ? "var(--mi-ink)" : "transparent",
        flexShrink: 0,
        marginTop: 2,
        transition: "background 120ms, border-color 120ms",
      }} />

      {/* Glyph */}
      {glyphSrc ? (
        <Image
          src={glyphSrc}
          alt=""
          width={16}
          height={16}
          style={{
            flexShrink: 0,
            marginTop: 1,
            opacity: isActive ? 1 : 0.5,
            filter: isActive ? "none" : "grayscale(1)",
          }}
        />
      ) : (
        <span style={{ width: 16, height: 16, flexShrink: 0 }} />
      )}

      {/* Labels */}
      <div>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "0.04em",
          color: isActive ? "var(--mi-ink)" : "var(--mi-ink-soft)",
          fontWeight: isActive ? 700 : 400,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: 9,
          color: "var(--mi-ink-mute)",
          letterSpacing: "0.03em",
          marginTop: 2,
          lineHeight: 1.3,
        }}>
          {subLabel.length > 48 ? subLabel.slice(0, 48) + "…" : subLabel}
        </div>
      </div>
    </button>
  );
}
