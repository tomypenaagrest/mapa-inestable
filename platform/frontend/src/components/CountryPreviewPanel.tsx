"use client";
import Link from "next/link";
import { COUNTRY_NAMES, COUNTRY_EJES } from "@/lib/country-data";
import type { WeeklyCountryData } from "@/components/MapaCentrico";

interface Props {
  countrySlug: string;
  weeklyCountries?: WeeklyCountryData[];
  onClose?: () => void;
}

export default function CountryPreviewPanel({ countrySlug, weeklyCountries = [], onClose }: Props) {
  const countryName = countrySlug ? (COUNTRY_NAMES[countrySlug] ?? countrySlug) : "";
  const ejes = countrySlug ? (COUNTRY_EJES[countrySlug] ?? []) : [];
  const topEjes = ejes.filter(e => e.intensity >= 3).slice(0, 3);
  const weeklyData = weeklyCountries.filter(c => c.slug === countrySlug);

  return (
    <div
      role="complementary"
      aria-label={`Vista previa de ${countryName}`}
      style={{
        width: "100%",
        height: "100%",
        background: "var(--mi-bg-paper)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "var(--mi-space-3) var(--mi-space-4)",
        borderBottom: "var(--mi-border-bold)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "var(--mi-space-2)",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-xl)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--mi-ink)",
            lineHeight: 1,
          }}>
            {countryName}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar panel"
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            padding: "2px 4px",
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--mi-space-3) var(--mi-space-4)" }}>

        {/* Active axes */}
        {topEjes.length > 0 && (
          <div style={{ marginBottom: "var(--mi-space-4)" }}>
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              textTransform: "uppercase",
              letterSpacing: "var(--mi-tracking-widest)",
              color: "var(--mi-ink-mute)",
              marginBottom: "var(--mi-space-2)",
            }}>
              Ejes crónicos
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--mi-space-1)" }}>
              {topEjes.map(e => (
                <span
                  key={e.key}
                  className="mi-axis-pill"
                  style={{ background: `var(--mi-axis-${e.key})`, fontSize: 10 }}
                >
                  {e.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Latest analyses this week */}
        {weeklyData.length > 0 ? (
          <div style={{ marginBottom: "var(--mi-space-4)" }}>
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              textTransform: "uppercase",
              letterSpacing: "var(--mi-tracking-widest)",
              color: "var(--mi-ink-mute)",
              marginBottom: "var(--mi-space-2)",
            }}>
              Esta semana
            </div>
            {weeklyData.map(w => (
              w.lastTitle && w.lastSlug ? (
                <Link
                  key={w.slug}
                  href={`/analisis/${w.slug}/${w.lastSlug}`}
                  style={{
                    display: "block",
                    marginBottom: "var(--mi-space-2)",
                    padding: "var(--mi-space-2)",
                    border: "var(--mi-border-soft)",
                  }}
                >
                  <div style={{
                    fontFamily: "var(--mi-font-title)",
                    fontWeight: 600,
                    fontSize: "var(--mi-text-sm)",
                    lineHeight: "var(--mi-leading-snug)",
                    color: "var(--mi-ink)",
                    marginBottom: 4,
                  }}>
                    {w.lastTitle}
                  </div>
                  {w.lastAxis && (
                    <span
                      className="mi-axis-pill"
                      style={{ background: `var(--mi-axis-${w.axisKey})`, fontSize: 9 }}
                    >
                      {w.lastAxis}
                    </span>
                  )}
                </Link>
              ) : null
            ))}
          </div>
        ) : (
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-sm)",
            color: "var(--mi-ink-mute)",
            lineHeight: "var(--mi-leading-normal)",
            marginBottom: "var(--mi-space-4)",
          }}>
            Sin análisis publicados esta semana.
          </p>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        padding: "var(--mi-space-3) var(--mi-space-4)",
        borderTop: "var(--mi-border-bold)",
      }}>
        <Link
          href={countrySlug ? `/pais/${countrySlug}` : "#"}
          className="mi-btn"
          style={{ display: "block", textAlign: "center" }}
        >
          Ver ficha completa →
        </Link>
      </div>
    </div>
  );
}
