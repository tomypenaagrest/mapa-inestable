"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import MapaCentrico, { type WeeklyCountryData } from "./MapaCentrico";
import HeatmapEjes, { type HeatmapCell, type WeekLabel } from "./HeatmapEjes";
import { COUNTRY_NAMES } from "@/lib/country-data";

interface Props {
  weeklyCountries: WeeklyCountryData[];
  heatmapData: HeatmapCell[];
  weeks: WeekLabel[];
}

export default function MapaHeatmapSection({ weeklyCountries, heatmapData, weeks }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const selectedData = selected
    ? weeklyCountries.find(c => c.slug === selected) ?? null
    : null;

  const handleClick = useCallback((iso: string) => {
    setSelected(prev => prev === iso ? null : iso);
  }, []);

  const countryName = selected ? (COUNTRY_NAMES[selected] || selected) : "";

  return (
    <div className="mi-mapa-heatmap-grid" style={{
      border: "var(--mi-border-bold)",
      boxShadow: "var(--mi-shadow-card)",
      marginBottom: "var(--mi-space-5)",
      background: "var(--mi-bg-paper)",
      minHeight: 400,
    }}>
      {/* Mapa */}
      <div style={{ borderRight: "var(--mi-border-thick)" }}>
        <MapaCentrico
          weeklyCountries={weeklyCountries}
          selectedCountry={selected}
          onCountryClick={handleClick}
          height={400}
        />
      </div>

      {/* Panel derecho: heatmap o country panel */}
      <div style={{ overflow: "hidden" }}>
        {selectedData ? (
          <div style={{
            padding: "var(--mi-space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--mi-space-3)",
            height: "100%",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span className="mi-country-tag">{countryName}</span>
              <button
                onClick={() => setSelected(null)}
                aria-label="Cerrar panel"
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  color: "var(--mi-ink-mute)",
                  padding: 4,
                }}
              >
                ✕
              </button>
            </div>

            {selectedData.lastTitle ? (
              <>
                <div style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  textTransform: "uppercase",
                  letterSpacing: "var(--mi-tracking-wide)",
                  color: "var(--mi-ink-mute)",
                }}>
                  Última pieza
                </div>
                <h3 style={{
                  fontFamily: "var(--mi-font-title)",
                  fontWeight: 600,
                  fontSize: "var(--mi-text-lg)",
                  lineHeight: "var(--mi-leading-snug)",
                  color: "var(--mi-ink)",
                }}>
                  {selectedData.lastTitle}
                </h3>
                {selectedData.lastAxis && (
                  <span
                    className="mi-axis-pill"
                    style={{
                      background: `var(--mi-axis-${selectedData.axisKey})`,
                      alignSelf: "flex-start",
                    }}
                  >
                    {selectedData.lastAxis}
                  </span>
                )}
                <Link
                  href={`/analisis/${selectedData.slug}/${selectedData.lastSlug}`}
                  style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wider)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink)",
                    borderBottom: "2px solid var(--mi-ink)",
                    paddingBottom: 4,
                    alignSelf: "flex-start",
                  }}
                >
                  Leer análisis →
                </Link>
              </>
            ) : (
              <p style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-sm)",
                color: "var(--mi-ink-mute)",
              }}>
                Sin análisis publicados esta semana.
              </p>
            )}

            <Link
              href={`/pais/${selectedData.slug}`}
              className="mi-btn"
              style={{ marginTop: "auto", textAlign: "center" }}
            >
              Ver país →
            </Link>
          </div>
        ) : (
          <HeatmapEjes data={heatmapData} weeks={weeks} />
        )}
      </div>
    </div>
  );
}
