"use client";
import { useCallback, useState } from "react";
import MapaTorresGarcia from "./MapaTorresGarcia";
import CountryModalPanel from "./CountryModalPanel";
import AnalisisColumn from "./AnalisisColumn";
import { COUNTRY_NAMES } from "@/lib/country-data";
import type { WeeklyCountryData } from "@/components/MapaCentrico";
import type { CountryAgenda } from "@/lib/agendas";
import type { PublicationMeta } from "@/lib/content";

interface Props {
  weeklyCountries:   WeeklyCountryData[];
  agendasByCountry?: Record<string, CountryAgenda>;
  cards:             PublicationMeta[];
}

export default function MapaHeatmapSection({ weeklyCountries, agendasByCountry, cards }: Props) {
  const [hoveredCountry, setHoveredCountry]   = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Count analyses per country for tooltip
  const countBySlug: Record<string, number> = {};
  for (const c of cards) {
    if (c.countrySlug) countBySlug[c.countrySlug] = (countBySlug[c.countrySlug] ?? 0) + 1;
  }

  const handleClick = useCallback((slug: string) => {
    setSelectedCountry(slug);
  }, []);

  const handleHover = useCallback((slug: string | null) => {
    setHoveredCountry(slug);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div style={{
      border:        "var(--mi-border-bold)",
      boxShadow:     "var(--mi-shadow-card)",
      marginBottom:  "var(--mi-space-5)",
      background:    "var(--mi-bg-paper)",
      position:      "relative",
    }}>
      {/* Mapa + columna análisis */}
      <div
        style={{
          display:  "flex",
          height:   "var(--mi-mapa-max-h, calc(100vh - 100px))",
          overflow: "hidden",
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Mapa Torres García — height-driven, ancho derivado del aspect ratio */}
        <div style={{
          flexShrink:  0,
          aspectRatio: "1280 / 1380",
          height:      "100%",
          overflow:    "hidden",
        }}>
          <MapaTorresGarcia
            variant="home"
            onCountryClick={handleClick}
            onCountryHover={handleHover}
          />
        </div>

        {/* Columna estática de últimos análisis */}
        <AnalisisColumn cards={cards} />
      </div>

      {/* Tooltip hover — sigue el cursor, se renderiza solo si hay hover */}
      {hoveredCountry && (
        <div
          aria-hidden="true"
          style={{
            position:      "fixed",
            left:          mousePos.x + 16,
            top:           mousePos.y - 40,
            background:    "var(--mi-bg-paper)",
            border:        "var(--mi-border-thick)",
            padding:       "4px 10px",
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "12px",
            color:         "var(--mi-ink)",
            pointerEvents: "none",
            zIndex:        150,
            whiteSpace:    "nowrap",
          }}
        >
          {COUNTRY_NAMES[hoveredCountry] ?? hoveredCountry}
          {countBySlug[hoveredCountry] !== undefined
            ? ` · ${countBySlug[hoveredCountry]} análisis`
            : ""}
        </div>
      )}

      {/* Modal preview de país */}
      {selectedCountry && (
        <CountryModalPanel
          countrySlug={selectedCountry}
          weeklyCountries={weeklyCountries}
          agendaSummary={agendasByCountry?.[selectedCountry]}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
