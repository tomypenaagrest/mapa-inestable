"use client";
// Spec 47 — Tooltip enriquecido extraído de MapaTorresGarcia.
// Muestra: header país + bloque capa activa (A.4 heredado) + bloque "Otras capas" (3 chips).
// En mobile (touch device) no se renderiza — tap → drawer directo.

import Image from "next/image";
import type { Layer, LayerPeriod, LayerId } from "@/lib/layers";
import { getCrossLayerSnapshotMemo } from "@/lib/cross-layer";

export interface TooltipState {
  slug: string;
  name: string;
  x: number;
  y: number;
}

interface LayerTooltipProps {
  tooltip: TooltipState;
  activeLayer: { layer: Layer; period: LayerPeriod };
  sliderDate: string;
  onPinCountry: (slug: string) => void;
  /** Si true, no renderiza (mobile: tap → drawer directo) */
  hidden?: boolean;
}

const LEFT_OFFSET = 12;
const TOP_OFFSET  = -60;

export default function LayerTooltip({
  tooltip,
  activeLayer,
  sliderDate,
  onPinCountry,
  hidden,
}: LayerTooltipProps) {
  if (hidden) return null;

  const { layer, period } = activeLayer;
  const value = layer.getValueForCountry(tooltip.slug, period);
  const snapshot = getCrossLayerSnapshotMemo(tooltip.slug, sliderDate);

  // Chips de capas no-activas
  const otherChips = snapshot.chips.filter(c => c.layerId !== layer.id);

  return (
    <div
      role="tooltip"
      id={`tooltip-${tooltip.slug}`}
      style={{
        position: "absolute",
        left: tooltip.x + LEFT_OFFSET,
        top: tooltip.y + TOP_OFFSET,
        width: 320,
        background: "var(--mi-bg-paper)",
        border: "var(--mi-border-bold)",
        boxShadow: "4px 4px 0 var(--mi-ink)",
        padding: "var(--mi-space-2) var(--mi-space-3)",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {/* ── Header: sello + nombre ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-1)", marginBottom: 4 }}>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.1em",
          color: "var(--mi-ink)",
          background: "var(--mi-rule-soft)",
          padding: "2px 5px",
        }}>
          {tooltip.slug.toUpperCase()}
        </span>
        <span style={{
          fontFamily: "var(--mi-font-display)",
          fontSize: "var(--mi-text-sm)",
          color: "var(--mi-ink)",
          lineHeight: 1.1,
        }}>
          {tooltip.name}
        </span>
      </div>

      {/* ── Bloque capa activa (heredado A.4) ── */}
      <div style={{
        borderTop: "1px solid var(--mi-rule-soft)",
        paddingTop: "var(--mi-space-1)",
        marginBottom: "var(--mi-space-1)",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--mi-space-1)",
          marginBottom: 3,
        }}>
          <Image src={layer.glyphSrc} alt="" width={14} height={14} style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 8,
            color: "var(--mi-ink-mute)",
            letterSpacing: "0.06em",
          }}>
            {layer.shortLabel} · {period.label}
          </span>
        </div>
        {value ? (
          <>
            <div style={{
              fontFamily: "var(--mi-font-display)",
              fontSize: "var(--mi-text-xl)",
              lineHeight: 1,
              color: "var(--mi-ink)",
            }}>
              {value.formatted}
            </div>
            {value.quality === "congelado" && (
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 8,
                color: "#B45729",
                background: "#FFF3CD",
                padding: "1px 4px",
                marginTop: 2,
                display: "inline-block",
              }}>
                ⚠ congelado
              </span>
            )}
          </>
        ) : (
          <div style={{ fontFamily: "var(--mi-font-mono)", fontSize: 9, color: "var(--mi-ink-mute)" }}>
            Sin dato
          </div>
        )}
      </div>

      {/* ── Bloque "Otras capas" ── */}
      <div style={{
        borderTop: "1px solid var(--mi-rule-soft)",
        paddingTop: "var(--mi-space-1)",
      }}>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: 8,
          color: "var(--mi-ink-mute)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: "var(--mi-space-1)",
        }}>
          Otras capas
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {otherChips.map(chip => (
            <CrossLayerChipRow
              key={chip.layerId}
              chip={chip}
            />
          ))}
        </div>
      </div>

      {/* ── Micro-acción: Pinear ── */}
      <div style={{
        borderTop: "1px solid var(--mi-rule-soft)",
        paddingTop: "var(--mi-space-1)",
        marginTop: "var(--mi-space-1)",
        pointerEvents: "auto",
      }}>
        <button
          onClick={() => onPinCountry(tooltip.slug)}
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-soft)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            letterSpacing: "0.04em",
          }}
        >
          📌 Pinear lectura de este país
        </button>
      </div>
    </div>
  );
}

// ── Chip de capa no-activa ────────────────────────────────────────────────────

interface CrossLayerChipRowProps {
  chip: ReturnType<typeof getCrossLayerSnapshotMemo>["chips"][number];
}

function CrossLayerChipRow({ chip }: CrossLayerChipRowProps) {
  const { layer, period, value, chipFormat } = chip;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "20px 1fr auto",
      alignItems: "center",
      gap: "var(--mi-space-1)",
    }}>
      {/* Mini-glyph */}
      <VientoOrRegularGlyph
        layer={layer}
        layerId={chip.layerId}
        value={value}
        useOrientedGlyph={chipFormat.useOrientedGlyph}
      />

      {/* Label + período */}
      <div>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: 8,
          color: "var(--mi-ink-soft)",
          lineHeight: 1.2,
        }}>
          {chipFormat.shortChipLabel}
          {period && (
            <span style={{ color: "var(--mi-ink-mute)" }}> · {period.label}</span>
          )}
        </div>
        {value ? (
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink)",
            lineHeight: 1.2,
          }}>
            {value.formatted}
          </div>
        ) : (
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 8,
            color: "var(--mi-ink-mute)",
            fontStyle: "italic",
          }}>
            {period ? "sin dato" : "sin lectura disponible"}
          </div>
        )}
      </div>

      {/* Indicador: delta o calidad */}
      <ChipIndicator value={value} layerId={chip.layerId} />
    </div>
  );
}

// ── Glyph del chip (regular o viento orientado V3) ───────────────────────────

function VientoOrRegularGlyph({
  layer,
  layerId,
  value,
  useOrientedGlyph,
}: {
  layer: Layer;
  layerId: LayerId;
  value: ReturnType<typeof getCrossLayerSnapshotMemo>["chips"][number]["value"];
  useOrientedGlyph: boolean;
}) {
  if (useOrientedGlyph && layerId === "viento" && value) {
    const rank = value.raw;
    const isNeutro   = rank === 0;
    const isProEstado = rank < 0;
    const glyphSrc = isNeutro ? "/mapa/glyphs/viento-neutro.svg" : "/mapa/glyphs/viento.svg";
    return (
      <div style={{
        width: 20,
        height: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <Image
          src={glyphSrc}
          alt=""
          width={18}
          height={18}
          style={{
            transform: isProEstado ? "scaleX(-1)" : undefined,
            flexShrink: 0,
          }}
        />
      </div>
    );
  }
  return (
    <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Image src={layer.glyphSrc} alt="" width={18} height={18} style={{ flexShrink: 0 }} />
    </div>
  );
}

// ── Indicador de delta o calidad al lado derecho del chip ────────────────────

function ChipIndicator({
  value,
  layerId,
}: {
  value: ReturnType<typeof getCrossLayerSnapshotMemo>["chips"][number]["value"];
  layerId: LayerId;
}) {
  if (!value) return <span />;

  if (value.quality === "congelado") {
    return (
      <span style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: 8,
        color: "#B45729",
      }}>
        ⚠
      </span>
    );
  }

  // Viento orientado: el glyph ya carga la dirección — no duplicamos delta
  if (layerId === "viento") return <span />;

  if (value.delta !== undefined) {
    const up = value.delta > 0;
    return (
      <span style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: 10,
        color: "var(--mi-ink-mute)",
      }}>
        {up ? "↗" : "↘"}
      </span>
    );
  }

  return <span />;
}
