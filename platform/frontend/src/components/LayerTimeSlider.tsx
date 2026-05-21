"use client";

import type { Layer, LayerPeriod } from "@/lib/layers";

interface LayerTimeSliderProps {
  layer: Layer;
  activePeriod: LayerPeriod | null;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function LayerTimeSlider({
  layer,
  activePeriod,
  onPrevPeriod,
  onNextPeriod,
  hasPrev,
  hasNext,
}: LayerTimeSliderProps) {
  const firstPeriod = layer.periods[0];
  const lastPeriod  = layer.periods[layer.periods.length - 1];

  return (
    <div>
      {/* Navigator */}
      <div style={{
        display: "flex",
        alignItems: "center",
        border: "2px solid var(--mi-ink)",
      }}>
        <button
          onClick={onPrevPeriod}
          disabled={!hasPrev}
          aria-label="Período anterior"
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 16,
            lineHeight: 1,
            background: "transparent",
            border: "none",
            color: hasPrev ? "var(--mi-ink)" : "var(--mi-rule-soft)",
            cursor: hasPrev ? "pointer" : "default",
            padding: "6px 10px",
            flexShrink: 0,
          }}
        >
          ‹
        </button>

        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "var(--mi-ink)",
          textAlign: "center",
          flex: 1,
          userSelect: "none",
        }}>
          {activePeriod ? activePeriod.label : "—"}
        </span>

        <button
          onClick={onNextPeriod}
          disabled={!hasNext}
          aria-label="Período siguiente"
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 16,
            lineHeight: 1,
            background: "transparent",
            border: "none",
            color: hasNext ? "var(--mi-ink)" : "var(--mi-rule-soft)",
            cursor: hasNext ? "pointer" : "default",
            padding: "6px 10px",
            flexShrink: 0,
          }}
        >
          ›
        </button>
      </div>

      {/* Range labels */}
      {firstPeriod && lastPeriod && firstPeriod.key !== lastPeriod.key && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 8,
            color: "var(--mi-ink-mute)",
            letterSpacing: "0.04em",
          }}>
            {firstPeriod.label}
          </span>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 8,
            color: "var(--mi-ink-mute)",
            letterSpacing: "0.04em",
          }}>
            {lastPeriod.label}
          </span>
        </div>
      )}
    </div>
  );
}
