"use client";
// Spec 39 — Leyenda flotante en esquina superior derecha del mapa.
// Spec 46 r2 — badge de calidad, microcopy, accordion "Cómo se lee", botón onboarding.

import { useState } from "react";
import Image from "next/image";
import type { Layer, LayerPeriod, LayerQuality } from "@/lib/layers";

interface LayerLegendProps {
  layer: Layer;
  period: LayerPeriod;
  sliderDate: string;
  onOpenReadingGuide: () => void;
  onOpenOnboarding: () => void;
}

export default function LayerLegend({
  layer,
  period,
  sliderDate,
  onOpenReadingGuide,
  onOpenOnboarding,
}: LayerLegendProps) {
  const [collapsed,     setCollapsed]     = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);

  const isStale = checkStale(layer, period);
  const qualityBadge = resolveQualityBadge(layer, period, isStale);

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
          </div>

          {/* Badge de calidad — Spec 46 §4.1 */}
          {qualityBadge && (
            <div style={{
              margin: "0 var(--mi-space-2) var(--mi-space-1)",
              padding: "3px 6px",
              background: qualityBadge.bg,
              border: `1px solid ${qualityBadge.border}`,
              fontFamily: "var(--mi-font-mono)",
              fontSize: 8,
              color: qualityBadge.color,
              lineHeight: 1.4,
            }}
            title={qualityBadge.tooltip}
            >
              ⚑ {qualityBadge.label}
            </div>
          )}

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
                  {b.rangeDescription && (
                    <span style={{ color: "var(--mi-ink-mute)" }}> · {b.rangeDescription}</span>
                  )}
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

          {/* Dirección — B.4: solo para capas continuous */}
          {layer.legend.type === "continuous" && (
            <div style={{
              padding: "var(--mi-space-1) var(--mi-space-2)",
              borderTop: "1px solid var(--mi-rule-soft)",
            }}>
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 8,
                color: "var(--mi-ink-mute)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 3,
              }}>
                Dirección
              </div>
              {layer.id === "viento" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 9, color: "var(--mi-ink-soft)" }}>
                    ← pro-estado · glyph voltea izquierda
                  </span>
                  <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 9, color: "var(--mi-ink-mute)" }}>
                    — neutro · glyph dashes estáticos
                  </span>
                  <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 9, color: "var(--mi-ink-soft)" }}>
                    → pro-mercado · glyph apunta derecha
                  </span>
                  <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 8, color: "var(--mi-ink-mute)", marginTop: 1 }}>
                    color = magnitud del cambio semanal
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 9, color: "var(--mi-ink-soft)" }}>
                    + crecimiento · color = magnitud
                  </span>
                  <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 9, color: "var(--mi-ink-mute)" }}>
                    − recesión · mismo color · ver tooltip
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Microcopy — Spec 46 §4.2 */}
          {layer.legendMicrocopy && (
            <div style={{
              padding: "var(--mi-space-1) var(--mi-space-2)",
              borderTop: "1px solid var(--mi-rule-soft)",
              fontFamily: "var(--mi-font-mono)",
              fontSize: 8,
              color: "var(--mi-ink-mute)",
              lineHeight: 1.5,
              fontStyle: "italic",
            }}>
              {layer.legendMicrocopy}
            </div>
          )}

          {/* Accordion "Cómo se lee esta capa" — Spec 46 §4.3 */}
          {layer.shortIntro && (
            <div style={{ borderTop: "1px solid var(--mi-rule-soft)" }}>
              <button
                onClick={() => setAccordionOpen(o => !o)}
                aria-expanded={accordionOpen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  width: "100%",
                  padding: "var(--mi-space-1) var(--mi-space-2)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: 9,
                  color: "var(--mi-ink)",
                }}
              >
                <span style={{ fontSize: 8 }}>{accordionOpen ? "▲" : "▼"}</span>
                Cómo se lee esta capa
              </button>
              {accordionOpen && (
                <div style={{
                  padding: "0 var(--mi-space-2) var(--mi-space-2)",
                  fontFamily: "var(--mi-font-body)",
                  fontSize: 10,
                  color: "var(--mi-ink-soft)",
                  lineHeight: 1.55,
                  borderTop: "1px solid var(--mi-rule-soft)",
                  paddingTop: "var(--mi-space-2)",
                }}>
                  <p style={{ margin: "0 0 8px" }}>{layer.shortIntro}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={onOpenReadingGuide}
                      style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: 9,
                        color: "var(--mi-ink)",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        textDecoration: "underline",
                      }}
                    >
                      Leer guía completa →
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
                      Documentación ↗
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* Acciones — Spec 46 §4.4: botón onboarding + guía de lectura */}
          <div style={{
            padding: "var(--mi-space-1) var(--mi-space-2) var(--mi-space-2)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}>
            {!layer.shortIntro && (
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
            )}
            {!layer.shortIntro && (
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
            )}
            <button
              onClick={onOpenOnboarding}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 9,
                color: "var(--mi-ink-mute)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              ⓘ Cómo se lee este mapa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  const idx = layer.periods.findIndex(p => p.key === period.key);
  return idx >= 0 && idx < layer.periods.length - 3;
}

interface QualityBadge {
  label: string;
  tooltip: string;
  bg: string;
  border: string;
  color: string;
}

function resolveQualityBadge(layer: Layer, period: LayerPeriod, isStale: boolean): QualityBadge | null {
  // Detecta si hay algún país con quality !== "oficial" para este período
  // Heurística: si el período está marcado stale, asumimos "congelado"
  if (isStale) {
    const lastPeriod = layer.periods[layer.periods.length - 1];
    return {
      label: `Dato congelado · sin actualización desde ${formatMonthYear(lastPeriod?.date ?? "")} (${layer.source.name.split("(")[0].trim()})`,
      tooltip: "La fuente no publicó datos más recientes para este período.",
      bg: "#FFF3CD",
      border: "#E8C58A",
      color: "#B45729",
    };
  }
  // Busca si el período actual coincide con el defaultPeriod — si no tiene datos recientes, estimado
  // Sin más info en el contrato, no renderizamos badge para "estimado" (se deja a futura extensión)
  return null;
}

function formatMonthYear(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}
