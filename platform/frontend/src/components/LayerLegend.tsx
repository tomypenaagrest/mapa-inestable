"use client";
// Spec 39 — Leyenda flotante en esquina superior derecha del mapa.

import { useState } from "react";
import Image from "next/image";
import type { Layer, LayerPeriod } from "@/lib/layers";

interface LayerLegendProps {
  layer: Layer;
  period: LayerPeriod;
  sliderDate: string;
  onOpenReadingGuide: () => void;
}

export default function LayerLegend({ layer, period, sliderDate, onOpenReadingGuide }: LayerLegendProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isStale = checkStale(layer, period);

  return (
    <div style={{
      position: "absolute",
      top: "var(--mi-space-3)",
      right: "var(--mi-space-3)",
      zIndex: 10,
      background: "var(--mi-bg-paper)",
      border: "var(--mi-border-bold)",
      boxShadow: "4px 4px 0 var(--mi-ink)",
      minWidth: collapsed ? 0 : 220,
      maxWidth: 260,
    }}>

      {/* Header — siempre visible */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--mi-space-1)",
          padding: "var(--mi-space-2) var(--mi-space-2)",
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <Image
          src={layer.glyphSrc}
          alt=""
          width={14}
          height={14}
          style={{ flexShrink: 0 }}
        />
        <span style={{
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          letterSpacing: "0.04em",
          color:         "var(--mi-ink)",
          fontWeight:    700,
          flex: 1,
        }}>
          {layer.shortLabel}
        </span>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: 9,
          color: "var(--mi-ink-mute)",
        }}>
          {collapsed ? "▼" : "▲"}
        </span>
      </button>

      {!collapsed && (
        <div style={{ borderTop: "1px solid var(--mi-rule-soft)" }}>

          {/* Período */}
          <div style={{
            padding: "var(--mi-space-1) var(--mi-space-2)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-mute)",
            letterSpacing: "0.04em",
          }}>
            {period.label}
            {sliderDate !== period.date && (
              <span> · dato ≤ {formatSliderDate(sliderDate)}</span>
            )}
            {isStale && (
              <span style={{ color: "var(--mi-accent-warn)" }}> · ⚠ congelado</span>
            )}
          </div>

          {/* Unidad */}
          <div style={{
            padding: "0 var(--mi-space-2) var(--mi-space-1)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-mute)",
          }}>
            {layer.unit}
          </div>

          {/* Buckets */}
          <div style={{
            padding: "var(--mi-space-1) var(--mi-space-2)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}>
            {layer.legend.buckets.map(b => (
              <div key={b.bucketIndex} style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-1)" }}>
                <span style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  background: b.color,
                  flexShrink: 0,
                  border: "1px solid rgba(31,42,18,0.2)",
                }} />
                <span style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: 9,
                  color: "var(--mi-ink-soft)",
                  lineHeight: 1.3,
                }}>
                  {b.label}
                </span>
              </div>
            ))}
            {/* Sin dato */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-1)" }}>
              <span style={{
                display: "inline-block",
                width: 12,
                height: 12,
                background: layer.legend.noDataColor ?? "#C8B894",
                flexShrink: 0,
                border: "1px solid rgba(31,42,18,0.2)",
              }} />
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 9,
                color: "var(--mi-ink-mute)",
              }}>
                Sin dato
              </span>
            </div>
          </div>

          {/* Fuente */}
          <div style={{
            padding: "var(--mi-space-1) var(--mi-space-2)",
            borderTop: "1px solid var(--mi-rule-soft)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-mute)",
          }}>
            {layer.source.name.split("(")[0].trim()} · {layer.source.lastFetched}
          </div>

          {/* Acciones */}
          <div style={{
            padding: "var(--mi-space-1) var(--mi-space-2) var(--mi-space-2)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}>
            <button
              onClick={onOpenReadingGuide}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 9,
                color: "var(--mi-ink)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              ⓘ Leer guía de lectura
            </button>
            <a
              href={`/mapa/capas/${layer.id}`}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 9,
                color: "var(--mi-ink-mute)",
                textDecoration: "underline",
              }}
            >
              ↗ Documentación completa
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function formatSliderDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const w = getISOWeek(d);
  return `sem ${w} · ${y}`;
}

function getISOWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function checkStale(layer: Layer, period: LayerPeriod): boolean {
  const lastPeriod = layer.periods[layer.periods.length - 1];
  if (!lastPeriod) return false;
  // Considera stale si el período más reciente de la capa es anterior al último en > 2 períodos
  const idx = layer.periods.findIndex(p => p.key === period.key);
  return idx >= 0 && idx < layer.periods.length - 3;
}
