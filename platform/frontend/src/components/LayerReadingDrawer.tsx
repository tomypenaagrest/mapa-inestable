"use client";
// Spec 39 / 42 — Drawer derecho.
// Sin capa activa: guía de lectura genérica (HTML del vault).
// Con capa + país seleccionado: layout A.4 — header PBI + lectura + subindicadores.

import { useEffect, type ReactNode } from "react";
import type { LayerId, Layer, LayerPeriod, LayerSubIndicator } from "@/lib/layers";
import type { ReadingGuides } from "@/lib/reading-guides";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ActiveCountryForLayer {
  layer: Layer;
  countrySlug: string;
  countryName: string;
  period: LayerPeriod;
}

interface LayerReadingDrawerProps {
  layerId: LayerId;
  readingGuides: ReadingGuides;
  onClose: () => void;
  /** Spec 42 A.4 — cuando se abre desde click en país con capa activa. */
  activeCountry?: ActiveCountryForLayer;
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({
  series,
  invertGood,
  width = 72,
  height = 24,
}: {
  series: Array<{ key: string; value: number }>;
  invertGood?: boolean;
  width?: number;
  height?: number;
}) {
  if (series.length < 2) return null;
  const values = series.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = height - pad - ((v - min) / range) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  // Tendencia: último vs primero
  const first = values[0];
  const last  = values[values.length - 1];
  const trendUp = last > first;
  const goodTrend = invertGood ? !trendUp : trendUp;
  const color = goodTrend ? "var(--mi-ink-soft)" : "var(--mi-precipitacion-3)";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Dot en el último valor */}
      {(() => {
        const lastPt = points.split(" ").pop()!.split(",");
        return (
          <circle
            cx={lastPt[0]}
            cy={lastPt[1]}
            r="2"
            fill={color}
          />
        );
      })()}
    </svg>
  );
}

// ── Subindicador fila ─────────────────────────────────────────────────────────

function SubIndicatorRow({
  sub,
  countrySlug,
  period,
}: {
  sub: LayerSubIndicator;
  countrySlug: string;
  period: LayerPeriod;
}) {
  const value  = sub.getValueForCountry(countrySlug, period);
  const series = sub.getSeries(countrySlug);
  const firstYear = series[0]?.key;
  const lastYear  = series[series.length - 1]?.key;

  return (
    <div style={{
      padding: "var(--mi-space-1) 0",
      borderBottom: "1px solid var(--mi-rule-soft)",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: "var(--mi-space-2)",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}>
            {sub.label}
          </div>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-mute)",
          }}>
            {value
              ? `${value.raw >= 0 ? "+" : ""}${value.raw.toFixed(1)}${sub.unit.startsWith("%") ? "%" : " " + sub.unit}`
              : "sin dato"}
            {value?.quality === "estimado" && (
              <span style={{ color: "var(--mi-accent-warn)" }}> est.</span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <Sparkline series={series} invertGood={sub.invertGood} />
          {firstYear && lastYear && (
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: 7,
              color: "var(--mi-ink-mute)",
              letterSpacing: "0.04em",
              display: "flex",
              justifyContent: "space-between",
              width: 72,
            }}>
              <span>{firstYear}</span>
              <span>{lastYear}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Layout A.4 — país seleccionado con capa activa ───────────────────────────

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{
      fontFamily: "var(--mi-font-mono)",
      fontSize: 9,
      color: "var(--mi-ink-mute)",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "var(--mi-space-2)",
      paddingBottom: "var(--mi-space-1)",
      borderBottom: "1px solid var(--mi-rule-soft)",
    }}>
      {children}
    </div>
  );
}

function CountryLayerContent({ ac }: { ac: ActiveCountryForLayer }) {
  const { layer, countrySlug, countryName, period } = ac;
  const value = layer.getValueForCountry(countrySlug, period);
  const editorial = layer.editorialByCountry?.[countrySlug];
  const events = layer.getEventsForCountry?.(countrySlug, period) ?? null;
  const justificativo = layer.getJustificativoForCountry?.(countrySlug, period) ?? null;

  return (
    <div style={{ padding: "var(--mi-space-3) var(--mi-space-4) var(--mi-space-6)" }}>

      {/* Encabezado */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--mi-space-3)",
        marginBottom: "var(--mi-space-3)",
        paddingBottom: "var(--mi-space-3)",
        borderBottom: "var(--mi-border-bold)",
      }}>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "var(--mi-ink)",
          background: "var(--mi-rule-soft)",
          padding: "4px 8px",
          flexShrink: 0,
          lineHeight: 1,
        }}>
          {countrySlug.toUpperCase()}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-lg)",
            color: "var(--mi-ink)",
            lineHeight: 1.1,
            marginBottom: 2,
          }}>
            {countryName}
          </div>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-mute)",
            letterSpacing: "0.06em",
          }}>
            {period.label} · {layer.shortLabel}
          </div>
        </div>
      </div>

      {/* Valor principal — layer-genérico via value.formatted */}
      {value ? (
        <div style={{ marginBottom: "var(--mi-space-3)" }}>
          <div style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-3xl)",
            lineHeight: 1,
            color: "var(--mi-ink)",
            letterSpacing: "-0.02em",
          }}>
            {value.formatted}
          </div>
          {value.quality === "estimado" && (
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: 10,
              color: "var(--mi-accent-warn)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginTop: 2,
            }}>
              estimado
            </div>
          )}
        </div>
      ) : (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-3)",
        }}>
          Sin dato para este período.
        </div>
      )}

      {/* Bloque Lectura editorial */}
      <div style={{ marginBottom: "var(--mi-space-4)" }}>
        <SectionLabel>Lectura editorial</SectionLabel>
        {editorial ? (
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-soft)",
            lineHeight: "var(--mi-leading-relaxed)",
            margin: 0,
          }}>
            {editorial}
          </p>
        ) : (
          <p style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-mute)",
            margin: 0,
            lineHeight: 1.5,
          }}>
            Lectura editorial pendiente — ver introducción de la capa en la guía de lectura.
          </p>
        )}
      </div>

      {/* Spec 44 — Bloque Eventos clave (solo cuando la capa expone eventos) */}
      {events && events.length > 0 && (
        <div style={{ marginBottom: "var(--mi-space-4)" }}>
          <SectionLabel>Eventos clave</SectionLabel>
          <ul style={{
            margin: 0,
            paddingLeft: "var(--mi-space-3)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            {events.map((ev, i) => (
              <li key={i} style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-xs)",
                color: "var(--mi-ink-soft)",
                lineHeight: "var(--mi-leading-normal)",
              }}>
                {ev}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Spec 44 — Bloque Justificativo (solo cuando la capa lo expone) */}
      {justificativo && (
        <div style={{ marginBottom: "var(--mi-space-4)" }}>
          <SectionLabel>Justificativo</SectionLabel>
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            lineHeight: "var(--mi-leading-relaxed)",
            margin: 0,
            fontStyle: "italic",
          }}>
            {justificativo}
          </p>
        </div>
      )}

      {/* Bloque Subindicadores */}
      {layer.subIndicators && layer.subIndicators.length > 0 && (
        <div>
          <SectionLabel>Subindicadores</SectionLabel>
          {layer.subIndicators.map(sub => (
            <SubIndicatorRow
              key={sub.slug}
              sub={sub}
              countrySlug={countrySlug}
              period={period}
            />
          ))}
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 8,
            color: "var(--mi-ink-mute)",
            marginTop: "var(--mi-space-2)",
          }}>
            Años bajo cada gráfico = rango disponible. Trazo oscuro = tendencia favorable.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function LayerReadingDrawer({
  layerId,
  readingGuides,
  onClose,
  activeCountry,
}: LayerReadingDrawerProps) {
  const html = readingGuides[layerId] ?? "";

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const title = activeCountry
    ? `${activeCountry.countryName} · ${activeCountry.layer.shortLabel}`
    : "Guía de lectura";

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(31,42,18,0.25)",
          zIndex: 40,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: "100vw",
          background: "var(--mi-bg-paper)",
          borderLeft: "var(--mi-border-bold)",
          overflowY: "auto",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--mi-space-3) var(--mi-space-4)",
          borderBottom: "var(--mi-border-bold)",
          background: "var(--mi-bg-paper)",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}>
          <span style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "var(--mi-text-xs)",
            textTransform: "uppercase",
            letterSpacing: "var(--mi-tracking-widest)",
            color:         "var(--mi-ink-mute)",
          }}>
            {activeCountry ? activeCountry.layer.shortLabel : "Guía de lectura"}
          </span>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize:   "var(--mi-text-xs)",
              background: "transparent",
              border:     "2px solid var(--mi-ink)",
              color:      "var(--mi-ink)",
              cursor:     "pointer",
              padding:    "4px 10px",
              letterSpacing: "0.06em",
            }}
          >
            Cerrar ×
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {activeCountry ? (
            <CountryLayerContent ac={activeCountry} />
          ) : html ? (
            <div style={{ padding: "var(--mi-space-4) var(--mi-space-4) var(--mi-space-6)" }}>
              <div
                className="mi-reading-guide"
                dangerouslySetInnerHTML={{ __html: html }}
                style={{
                  fontFamily:  "var(--mi-font-body)",
                  fontSize:    "var(--mi-text-sm)",
                  lineHeight:  "var(--mi-leading-relaxed)",
                  color:       "var(--mi-ink-soft)",
                }}
              />
            </div>
          ) : (
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize:   "var(--mi-text-xs)",
              color:      "var(--mi-ink-mute)",
              textAlign:  "center",
              padding:    "var(--mi-space-6) var(--mi-space-4)",
            }}>
              Guía de lectura en preparación.
              <br /><br />
              La documentación editorial de esta capa<br />
              se publica junto con la implementación real<br />
              (Specs 42–45).
            </div>
          )}
        </div>
      </div>
    </>
  );
}
