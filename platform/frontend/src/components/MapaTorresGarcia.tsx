"use client";
import { useCallback, useRef, useState } from "react";
import polygonsJson from "@/data/paises-poligonos.json";
import type { Layer, LayerPeriod } from "@/lib/layers";

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

// Polígonos leídos del vault JSON (SSOT: 70-Producto/design-system/mapa/paises-poligonos.json)
const HOTZONES: Record<string, [number, number][]> = polygonsJson as unknown as Record<string, [number, number][]>;

function pointsAttr(slug: string): string {
  const poly = HOTZONES[slug];
  if (!poly) return "";
  return poly.map(([x, y]) => `${x},${y}`).join(" ");
}

// Analysis counts (placeholder — replace with real corpus data)
const DEFAULT_ANALYSIS_COUNTS: Record<string, number> = {
  ar: 18, bo: 6, br: 15, cl: 12, co: 14,
  ec: 4,  pe: 8, py: 3,  uy: 5,  ve: 9,
};

// ── Types ────────────────────────────────────────────────────────────────────

export interface ActiveLayerProps {
  layer: Layer;
  period: LayerPeriod;
}

export interface MapaTorresGarciaProps {
  variant: "home" | "explorer";
  filters?: {
    pais?: string[];
    eje?: string[];
  };
  countryAnalysisCounts?: Record<string, number>;
  activeLayer?: ActiveLayerProps;
  onCountryClick?: (slug: string) => void;
  onCountryHover?: (slug: string | null) => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MapaTorresGarcia({
  variant,
  filters,
  countryAnalysisCounts = DEFAULT_ANALYSIS_COUNTS,
  activeLayer,
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

  // Computa fill y opacity de cada hotzone
  function getHotzoneStyle(slug: string): React.CSSProperties {
    const hovered = hoveredSlug === slug;
    const active  = isActive(slug);
    const empty   = isEmpty(slug);

    // Con capa activa: fill viene del bucket de la capa
    if (activeLayer) {
      const value = activeLayer.layer.getValueForCountry(slug, activeLayer.period);
      if (value !== null) {
        const bucket = activeLayer.layer.legend.buckets.find(b => b.bucketIndex === value.bucketIndex);
        const fillColor = bucket?.color ?? (activeLayer.layer.legend.noDataColor ?? "#C8B894");
        return {
          fill: fillColor,
          fillOpacity: 0.55,
          opacity: 1,
          transition: "fill 250ms cubic-bezier(0.2,0,0,1), opacity 150ms",
        };
      }
      // Sin dato
      return {
        fill: activeLayer.layer.legend.noDataColor ?? "#C8B894",
        fillOpacity: 0.3,
        opacity: 1,
        transition: "fill 250ms cubic-bezier(0.2,0,0,1), opacity 150ms",
      };
    }

    // Sin capa activa: comportamiento original
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

  function getCapitalStroke(slug: string): string {
    if (hoveredSlug === slug) return "var(--mi-accent-gold)";
    if (isActive(slug)) return "var(--mi-accent-gold)";
    return "#c0532e";
  }

  function getCapitalBg(slug: string): string {
    if (isActive(slug)) return "var(--mi-accent-gold)";
    return "transparent";
  }

  const slugOrder = ["br", "ar", "cl", "pe", "co", "bo", "ve", "py", "ec", "uy"] as const;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
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

        {/* Filtro Gaussian blur — aplicado al fill de capa solo cuando hay capa activa.
            Difumina fronteras para respetar el carácter simbólico del dibujo Torres García.
            stdDeviation 18: fronteras se difuminan sin que países chicos desaparezcan. */}
        {activeLayer && (
          <defs>
            <filter id="capa-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
        )}

        {/* Hot-zone polygons — large countries first (lower Z), small last (higher Z) */}
        <g id="hotzones">
          {slugOrder.map((slug) => {
            const country = COUNTRIES.find(c => c.slug === slug)!;
            const count   = countryAnalysisCounts[slug] ?? 0;
            const pts     = pointsAttr(slug);
            if (!pts) return null;
            return (
              <polygon
                key={slug}
                id={`hot-${slug}`}
                points={pts}
                style={{
                  ...getHotzoneStyle(slug),
                  cursor: "pointer",
                  stroke: hoveredSlug === slug || isActive(slug) ? "rgba(192,83,46,0.4)" : "transparent",
                  strokeWidth: 1.5,
                  outline: "none",
                  // Aplica blur al fill de capa; NO en hover/active sin capa ni en home
                  filter: activeLayer ? "url(#capa-blur)" : undefined,
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

        {/* Interactive capital markers — siempre encima de cualquier capa */}
        <g id="capitals-interactive" aria-hidden="true">
          {COUNTRIES.map((c) => {
            const empty   = isEmpty(c.slug);
            const active  = isActive(c.slug);
            const hovered = hoveredSlug === c.slug;
            const stroke  = getCapitalStroke(c.slug);
            const bg      = getCapitalBg(c.slug);

            return (
              <g
                key={c.slug}
                transform={`translate(${c.cx} ${c.cy})`}
                style={{ opacity: empty ? 0.5 : 1, transition: "opacity 150ms" }}
              >
                {(active || hovered) && (
                  <rect
                    x="-20" y="-20"
                    width="40" height="40"
                    fill={bg}
                    style={{ transition: "fill 150ms" }}
                  />
                )}
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
