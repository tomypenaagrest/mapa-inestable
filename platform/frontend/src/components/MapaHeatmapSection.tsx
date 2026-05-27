"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  // Slug being rendered in the panel — updated after cross-fade starts
  const [panelSlug, setPanelSlug] = useState<string | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const crossFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const countBySlug: Record<string, number> = {};
  for (const c of cards) {
    if (c.countrySlug) countBySlug[c.countrySlug] = (countBySlug[c.countrySlug] ?? 0) + 1;
  }

  // Spec 49 §8 — cross-fade between countries, panel persists
  const openPanel = useCallback((slug: string) => {
    if (crossFadeRef.current) clearTimeout(crossFadeRef.current);

    if (panelSlug && panelSlug !== slug) {
      // Cross-fade: briefly fade out, swap content, fade in
      setPanelVisible(false);
      crossFadeRef.current = setTimeout(() => {
        setPanelSlug(slug);
        setPanelVisible(true);
      }, 150);
    } else {
      setPanelSlug(slug);
      setPanelVisible(true);
    }
  }, [panelSlug]);

  const closePanel = useCallback(() => {
    if (crossFadeRef.current) clearTimeout(crossFadeRef.current);
    setPanelVisible(false);
    crossFadeRef.current = setTimeout(() => {
      setPanelSlug(null);
      setSelectedCountry(null);
    }, 200);
  }, []);

  const handleTap = useCallback((slug: string) => {
    if (selectedCountry === slug) {
      // Tap same country — close panel
      closePanel();
    } else {
      setSelectedCountry(slug);
      openPanel(slug);
    }
  }, [selectedCountry, openPanel, closePanel]);

  const handleClick = useCallback((slug: string) => {
    if (isMobile) return; // mobile uses handleTap via onCountryTap
    setSelectedCountry(prev => prev === slug ? null : slug);
  }, [isMobile]);

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
            selectedSlug={selectedCountry}
            onCountryTap={isMobile ? handleTap : undefined}
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

      {/* Panel inline debajo del mapa — solo mobile, Spec 49 §7-8 */}
      {isMobile && panelSlug && (
        <div
          className="mi-mapa-panel-inline"
          style={{
            opacity: panelVisible ? 1 : 0,
            transition: "opacity 150ms ease-out",
            overflow: "hidden",
          }}
        >
          <CountryPreviewPanel
            countrySlug={panelSlug}
            weeklyCountries={weeklyCountries}
            agendaSummary={agendasByCountry?.[panelSlug]}
            onClose={closePanel}
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
