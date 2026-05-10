"use client";
import { useCallback, useRef, useState } from "react";

// ── Data ────────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { slug: "ar", name: "Argentina", capital: "Buenos Aires",    cx: 572.1,  cy: 465.2 },
  { slug: "bo", name: "Bolivia",   capital: "La Paz / Sucre", cx: 759.4,  cy: 775.8 },
  { slug: "br", name: "Brasil",    capital: "Brasília",        cx: 459.7,  cy: 824.2 },
  { slug: "cl", name: "Chile",     capital: "Santiago",        cx: 754.7,  cy: 551.0 },
  { slug: "co", name: "Colombia",  capital: "Bogotá",          cx: 967.0,  cy: 1164.5 },
  { slug: "ec", name: "Ecuador",   capital: "Quito",           cx: 1038.8, cy: 1123.9 },
  { slug: "pe", name: "Perú",      capital: "Lima",            cx: 1009.2, cy: 858.5 },
  { slug: "py", name: "Paraguay",  capital: "Asunción",        cx: 565.9,  cy: 690.0 },
  { slug: "uy", name: "Uruguay",   capital: "Montevideo",      cx: 530.0,  cy: 502.6 },
  { slug: "ve", name: "Venezuela", capital: "Caracas",         cx: 795.3,  cy: 1166.0 },
] as const;

// Hot-zone polygons — approximate regions in 1280×1380 SVG space.
// Order: large countries first (lower Z-index), small countries last (higher Z-index).
// These are editorially calibrated approximations; use herramienta-hotzones.html to refine.
const HOTZONES: Record<string, string> = {
  br: "100,680 680,700 730,680 730,820 700,960 640,1070 560,1140 430,1160 290,1130 180,1050 130,940 100,820",
  ar: "130,50 730,50 800,100 830,250 830,420 810,480 780,540 740,620 680,695 620,740 565,760 475,755 390,720 310,655 240,565 180,455 145,315 130,150",
  cl: "680,50 1100,50 1150,200 1160,400 1150,650 1120,850 1060,980 960,1040 840,1040 760,1010 720,900 730,700 730,500 700,300 680,100",
  pe: "870,720 1160,720 1220,800 1210,1050 1180,1100 1080,1130 970,1100 930,1030 890,930 870,820",
  co: "640,1030 980,1030 1040,1060 1065,1130 1040,1195 965,1240 875,1250 785,1225 720,1175 650,1115 625,1050",
  bo: "680,670 920,670 970,730 975,850 930,950 850,990 760,995 695,955 668,860 668,760",
  ve: "680,1100 960,1085 1070,1120 1060,1210 960,1265 835,1275 720,1230 675,1180",
  py: "450,620 720,620 745,685 735,800 655,840 550,845 445,795 425,720",
  ec: "945,1050 1160,1050 1200,1100 1190,1210 1070,1260 945,1200 920,1130",
  uy: "460,455 565,455 580,495 565,555 460,550",
};

// Analysis counts (0 = no analyses published → muted state)
// These are placeholder values; replace with real data from the corpus.
const DEFAULT_ANALYSIS_COUNTS: Record<string, number> = {
  ar: 18, bo: 6, br: 15, cl: 12, co: 14,
  ec: 4,  pe: 8, py: 3,  uy: 5,  ve: 9,
};

// ── Types ────────────────────────────────────────────────────────────────────

export interface MapaTorresGarciaProps {
  variant: "home" | "explorer";
  filters?: {
    pais?: string[];
    eje?: string[];
  };
  countryAnalysisCounts?: Record<string, number>;
  onCountryClick?: (slug: string) => void;
  onCountryHover?: (slug: string | null) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MapaTorresGarcia({
  variant,
  filters,
  countryAnalysisCounts = DEFAULT_ANALYSIS_COUNTS,
  onCountryClick,
  onCountryHover,
}: MapaTorresGarciaProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activePais = filters?.pais ?? [];

  const isActive = (slug: string) => activePais.includes(slug);
  const isEmpty   = (slug: string) => (countryAnalysisCounts[slug] ?? 0) === 0;

  const handleMouseEnter = useCallback((slug: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredSlug(slug);
      onCountryHover?.(slug);
    }, 200);
  }, [onCountryHover]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoveredSlug(null);
    onCountryHover?.(null);
  }, [onCountryHover]);

  const handleClick = useCallback((slug: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    onCountryClick?.(slug);
  }, [onCountryClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, slug: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onCountryClick?.(slug);
    }
  }, [onCountryClick]);

  // Fill color for hot-zones based on current state
  function getHotzoneStyle(slug: string): React.CSSProperties {
    const hovered = hoveredSlug === slug;
    const active  = isActive(slug);
    const empty   = isEmpty(slug);

    const BASE_OPACITY = empty ? "0.06" : "0";
    const HOVER_HOME   = "rgba(192,83,46,0.15)";
    const HOVER_EXPL   = "rgba(192,83,46,0.20)";
    const ACTIVE_FILL  = "rgba(192,83,46,0.30)";
    const AXIS_FILL    = filters?.eje?.[0]
      ? `var(--mi-axis-${filters.eje[0]})` : undefined;

    let fill: string;
    if (active && AXIS_FILL) {
      fill = AXIS_FILL;
    } else if (active) {
      fill = ACTIVE_FILL;
    } else if (hovered) {
      fill = variant === "home" ? HOVER_HOME : HOVER_EXPL;
    } else {
      fill = empty ? `rgba(31,42,18,${BASE_OPACITY})` : "transparent";
    }

    return {
      fill,
      fillOpacity: (active && AXIS_FILL) ? "0.40" : undefined,
      opacity: empty ? 0.5 : 1,
      transition: "fill 150ms cubic-bezier(0.2,0,0,1), opacity 150ms",
    };
  }

  // Capital cross color
  function getCapitalStroke(slug: string): string {
    if (hoveredSlug === slug) return "var(--mi-accent-gold)";
    if (isActive(slug)) return "var(--mi-accent-gold)";
    return "#c0532e";
  }

  // Capital cross background (only for active state)
  function getCapitalBg(slug: string): string {
    if (isActive(slug)) return "var(--mi-accent-gold)";
    return "transparent";
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1280 / 1380",
        overflow: "hidden",
      }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Skip link for a11y */}
      <a
        href="#paises-lista"
        style={{
          position: "absolute",
          left: "-9999px",
          top: 4,
          zIndex: 100,
          background: "var(--mi-bg-dark)",
          color: "var(--mi-bg-paper)",
          padding: "4px 8px",
          fontFamily: "var(--mi-font-mono)",
          fontSize: 11,
        }}
        onFocus={(e) => { (e.currentTarget as HTMLElement).style.left = "4px"; }}
        onBlur={(e) => { (e.currentTarget as HTMLElement).style.left = "-9999px"; }}
      >
        Saltar al listado de países
      </a>

      {/* Static artwork: Torres García SVG */}
      {/* aria-hidden because the overlay SVG carries all semantic content */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mapa/mapa-torres-garcia.svg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          pointerEvents: "none",
        }}
      />

      {/* Interactive overlay SVG */}
      <svg
        viewBox="0 0 1280 1380"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
        role="img"
        aria-label="Mapa interactivo de Sudamérica invertido"
      >
        <title>Mapa de Sudamérica invertido con las 10 capitales — referencia a Torres García, América Invertida (1943)</title>

        {/* Hot-zone polygons — large countries first (lower Z), small last (higher Z) */}
        <g id="hotzones">
          {(["br", "ar", "cl", "pe", "co", "bo", "ve", "py", "ec", "uy"] as const).map((slug) => {
            const country = COUNTRIES.find(c => c.slug === slug)!;
            const count = countryAnalysisCounts[slug] ?? 0;
            return (
              <polygon
                key={slug}
                id={`hot-${slug}`}
                points={HOTZONES[slug]}
                style={{
                  ...getHotzoneStyle(slug),
                  cursor: "pointer",
                  stroke: hoveredSlug === slug || isActive(slug) ? "rgba(192,83,46,0.4)" : "transparent",
                  strokeWidth: 1.5,
                  outline: "none",
                }}
                tabIndex={0}
                role="button"
                aria-label={`${country.name}${count > 0 ? `, ${count} análisis publicados` : ", sin análisis publicados"}`}
                onMouseEnter={() => handleMouseEnter(slug)}
                onClick={() => handleClick(slug)}
                onKeyDown={(e) => handleKeyDown(e, slug)}
                onFocus={() => {
                  setHoveredSlug(slug);
                  onCountryHover?.(slug);
                }}
                onBlur={() => {
                  setHoveredSlug(null);
                  onCountryHover?.(null);
                }}
              />
            );
          })}
        </g>


        {/* Interactive capital markers — overlay on top of static SVG capitals */}
        <g id="capitals-interactive" aria-hidden="true">
          {COUNTRIES.map((c) => {
            const empty = isEmpty(c.slug);
            const active = isActive(c.slug);
            const hovered = hoveredSlug === c.slug;
            const stroke = getCapitalStroke(c.slug);
            const bg = getCapitalBg(c.slug);

            return (
              <g
                key={c.slug}
                transform={`translate(${c.cx} ${c.cy})`}
                style={{ opacity: empty ? 0.5 : 1, transition: "opacity 150ms" }}
              >
                {/* Active state background */}
                {(active || hovered) && (
                  <rect
                    x="-20" y="-20"
                    width="40" height="40"
                    fill={bg}
                    style={{ transition: "fill 150ms" }}
                  />
                )}
                {/* New-analysis dot (top-right) — placeholder, hook up to lastVisit logic */}
                {/* Followed dot (bottom-left) — placeholder, hook up to localStorage */}

                {/* Cross lines — rendered on top of the static SVG crosses */}
                <line
                  x1="-14" y1="-14" x2="14" y2="14"
                  stroke={stroke}
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ transition: "stroke 150ms" }}
                />
                <line
                  x1="-14" y1="14" x2="14" y2="-14"
                  stroke={stroke}
                  strokeWidth="5"
                  strokeLinecap="round"
                  style={{ transition: "stroke 150ms" }}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
