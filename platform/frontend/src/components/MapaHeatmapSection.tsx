"use client";
import { useCallback, useEffect, useState } from "react";
import MapaTorresGarcia from "./MapaTorresGarcia";
import CountryModalPanel from "./CountryModalPanel";
import CountryPreviewPanel from "./CountryPreviewPanel";
import AnalisisColumn from "./AnalisisColumn";
import { COUNTRY_NAMES } from "@/lib/country-data";
import type { WeeklyCountryData } from "@/components/MapaCentrico";
import type { CountryAgenda } from "@/lib/agendas";
import type { PublicationMeta, AgentDraftMeta } from "@/lib/content";

interface Props {
  weeklyCountries:   WeeklyCountryData[];
  agendasByCountry?: Record<string, CountryAgenda>;
  cards:             PublicationMeta[];
  latestDrafts:      AgentDraftMeta[];
}

export default function MapaHeatmapSection({ weeklyCountries, agendasByCountry, cards, latestDrafts }: Props) {
  const [hoveredCountry, setHoveredCountry]   = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Count analyses per country for tooltip
  const countBySlug: Record<string, number> = {};
  for (const c of cards) {
    if (c.countrySlug) countBySlug[c.countrySlug] = (countBySlug[c.countrySlug] ?? 0) + 1;
  }

  const handleClick = useCallback((slug: string) => {
    setSelectedCountry(prev => prev === slug ? null : slug);
  }, []);

  const handleHover = useCallback((slug: string | null) => {
    setHoveredCountry(slug);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="mi-mapa-section"
      style={{
        border:       "var(--mi-border-bold)",
        boxShadow:    "var(--mi-shadow-card)",
        marginBottom: "var(--mi-space-5)",
        background:   "var(--mi-bg-paper)",
        position:     "relative",
      }}
    >
      {/* Mapa + columna análisis */}
      <div
        className="mi-mapa-row"
        onMouseMove={handleMouseMove}
      >
        {/* Mapa Torres García */}
        <div className="mi-mapa-container">
          <MapaTorresGarcia
            variant="home"
            onCountryClick={handleClick}
            onCountryHover={handleHover}
          />
        </div>

        {/* Columna estática de últimos análisis — oculta en mobile */}
        <div className="mi-analisis-col-responsive">
          <AnalisisColumn drafts={latestDrafts} />
        </div>
      </div>

      {/* Hint editorial — solo mobile */}
      <div className="mi-mapa-editorial-hint" aria-hidden="true">
        El sur arriba · tap en país
      </div>

      {/* Panel inline debajo del mapa — solo mobile */}
      {isMobile && selectedCountry && (
        <div className="mi-mapa-panel-inline">
          <CountryPreviewPanel
            countrySlug={selectedCountry}
            weeklyCountries={weeklyCountries}
            agendaSummary={agendasByCountry?.[selectedCountry]}
            onClose={() => setSelectedCountry(null)}
          />
        </div>
      )}

      {/* Tooltip hover — sigue el cursor, solo desktop */}
      {!isMobile && hoveredCountry && (
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

      {/* Modal de país — solo desktop */}
      {!isMobile && selectedCountry && (
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
