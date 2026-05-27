"use client";
import { useCallback, useRef, useState } from "react";
import polygonsJson from "@/data/paises-poligonos.json";
import type { Layer, LayerPeriod } from "@/lib/layers";
import LayerTooltip, { type TooltipState } from "@/components/LayerTooltip";
import { useMapGestures } from "@/hooks/useMapGestures";
import MapResetButton from "@/components/MapResetButton";

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

const HOTZONES: Record<string, [number, number][]> = polygonsJson as unknown as Record<string, [number, number][]>;

function pointsAttr(slug: string): string {
  const poly = HOTZONES[slug];
  if (!poly) return "";
  return poly.map(([x, y]) => `${x},${y}`).join(" ");
}

// Hit area expansion for UY and EC — 20px outward in SVG units per vertex
// These are hand-calibrated expanded bounding polygons
const HIT_AREA_EXPAND: Record<string, [number, number][]> = {
  uy: [
    [489, 459], [562, 453], [582, 490], [572, 535], [529, 548], [492, 524], [482, 487],
  ],
  ec: [
    [988, 1087], [1080, 1087], [1095, 1150], [1065, 1188], [995, 1185], [978, 1148],
  ],
};

function hitPointsAttr(slug: string): string {
  const poly = HIT_AREA_EXPAND[slug];
  if (!poly) return "";
  return poly.map(([x, y]) => `${x},${y}`).join(" ");
}

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
  sliderDate?: string;
  onPinCountry?: (slug: string) => void;
  onCountryClick?: (slug: string) => void;
  onCountryHover?: (slug: string | null) => void;
  /** Spec 49 — slug del país con panel inline abierto (anillo dorado en la cruz) */
  selectedSlug?: string | null;
  /** Spec 49 — callback touch (reemplaza nav directa de Spec 22 §16.1) */
  onCountryTap?: (slug: string) => void;
}

// ── SVG viewBox dimensions (used for hit-test coordinate mapping)
const VIEWBOX_W = 1280;
const VIEWBOX_H = 1380;

// ── Component ────────────────────────────────────────────────────────────────

export default function MapaTorresGarcia({
  variant,
  filters,
  countryAnalysisCounts = DEFAULT_ANALYSIS_COUNTS,
  activeLayer,
  sliderDate,
  onPinCountry,
  onCountryClick,
  onCountryHover,
  selectedSlug,
  onCountryTap,
}: MapaTorresGarciaProps) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const activePais = filters?.pais ?? [];
  const isActive = (slug: string) => activePais.includes(slug);
  const isEmpty  = (slug: string) => (countryAnalysisCounts[slug] ?? 0) === 0;

  // Hit-test: given container px coords, return country slug or null
  const hitTest = useCallback((px: number, py: number): string | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    // Map to SVG viewBox coords, accounting for current transform
    const inner = svg.querySelector<SVGGElement>("[data-map-inner]");
    let mx = (px / rect.width)  * VIEWBOX_W;
    let my = (py / rect.height) * VIEWBOX_H;
    if (inner) {
      // Account for transform
      const t = new DOMMatrix(inner.style.transform);
      const svgScale = rect.width / VIEWBOX_W;
      const innerTx = t.m41 / svgScale;
      const innerTy = t.m42 / svgScale;
      const innerS  = t.a; // scale
      mx = (mx - innerTx) / innerS;
      my = (my - innerTy) / innerS;
    }
    // Check hit areas first (UY, EC), then regular polygons
    const orderedSlugs = ["uy", "ec", "py", "ar", "cl", "bo", "pe", "co", "ve", "br"];
    for (const slug of orderedSlugs) {
      const poly = HIT_AREA_EXPAND[slug] ?? HOTZONES[slug];
      if (!poly) continue;
      if (pointInPolygon(mx, my, poly)) return slug;
    }
    return null;
  }, []);

  const { containerRef, gestureState, isZoomed, resetView } = useMapGestures({
    onCountryTap: onCountryTap ?? onCountryClick,
    hitTest,
  });

  const handleMouseEnter = useCallback((slug: string, e: React.MouseEvent) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    const country = COUNTRIES.find(c => c.slug === slug);
    const rect = (e.currentTarget as Element).closest("[data-map-container]")?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top  : e.clientY;
    hoverTimerRef.current = setTimeout(() => {
      setHoveredSlug(slug);
      if (activeLayer && country) {
        setTooltip({ slug, name: country.name, x, y });
      }
      onCountryHover?.(slug);
    }, 200);
  }, [onCountryHover, activeLayer]);

  const handleMouseMove = useCallback((slug: string, e: React.MouseEvent) => {
    if (!activeLayer) return;
    const rect = (e.currentTarget as Element).closest("[data-map-container]")?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : e.clientX;
    const y = rect ? e.clientY - rect.top  : e.clientY;
    setTooltip(prev => prev?.slug === slug ? { ...prev, x, y } : prev);
  }, [activeLayer]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoveredSlug(null);
    setTooltip(null);
    onCountryHover?.(null);
  }, [onCountryHover]);

  const handleClick = useCallback((slug: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    onCountryClick?.(slug);
  }, [onCountryClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, slug: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      (onCountryTap ?? onCountryClick)?.(slug);
    }
  }, [onCountryClick, onCountryTap]);

  function getHotzoneStyle(slug: string): React.CSSProperties {
    const hovered = hoveredSlug === slug;
    const active  = isActive(slug);
    const empty   = isEmpty(slug);

    if (activeLayer) {
      const value = activeLayer.layer.getValueForCountry(slug, activeLayer.period);
      if (value !== null) {
        const bucket = activeLayer.layer.legend.buckets.find(b => b.bucketIndex === value.bucketIndex);
        const fillColor = bucket?.color ?? (activeLayer.layer.legend.noDataColor ?? "#C8B894");
        const fillOpacity = (activeLayer.layer.id === "viento" && value.intensidad !== undefined)
          ? 0.7 + 0.3 * value.intensidad
          : 0.55;
        return {
          fill: fillColor,
          fillOpacity,
          opacity: 1,
          transition: "fill 250ms cubic-bezier(0.2,0,0,1), opacity 150ms",
        };
      }
      return {
        fill: activeLayer.layer.legend.noDataColor ?? "#C8B894",
        fillOpacity: 0.3,
        opacity: 1,
        transition: "fill 250ms cubic-bezier(0.2,0,0,1), opacity 150ms",
      };
    }

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
    if (selectedSlug === slug) return "var(--mi-accent-gold)";
    if (hoveredSlug === slug) return "var(--mi-accent-gold)";
    if (isActive(slug)) return "var(--mi-accent-gold)";
    return "#c0532e";
  }

  function getCapitalBg(slug: string): string {
    if (selectedSlug === slug) return "var(--mi-accent-gold)";
    if (isActive(slug)) return "var(--mi-accent-gold)";
    return "transparent";
  }

  function getCapitalRing(slug: string): React.ReactElement | null {
    if (selectedSlug !== slug) return null;
    // Anillo dorado alrededor de la cruz — Spec 49 §7
    return (
      <rect
        x="-22" y="-22"
        width="44" height="44"
        fill="none"
        stroke="var(--mi-accent-gold)"
        strokeWidth="1.5"
        style={{ transition: "opacity 200ms" }}
      />
    );
  }

  const slugOrder = ["br", "ar", "cl", "pe", "co", "bo", "ve", "py", "ec", "uy"] as const;

  return (
    <div
      ref={containerRef as React.RefObject<HTMLDivElement>}
      data-map-container
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

      {/* Inner wrapper — receives transform from useMapGestures via data-map-inner */}
      <div
        data-map-inner
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "0 0",
          // Initial transform — hook overrides inline via direct DOM writes for 60fps
        }}
      >
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
            objectFit: variant === "explorer" ? "contain" : undefined,
          }}
        />

        {/* Interactive overlay SVG */}
        <svg
          ref={svgRef}
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
          {activeLayer && (
            <defs>
              <filter id="capa-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
          )}

          {/* Hot-zone polygons */}
          <g id="hotzones">
            {slugOrder.map((slug) => {
              const country = COUNTRIES.find(c => c.slug === slug)!;
              const count   = countryAnalysisCounts[slug] ?? 0;
              const pts     = pointsAttr(slug);
              if (!pts) return null;

              const hasHitArea = slug in HIT_AREA_EXPAND;

              return (
                <g key={slug}>
                  {/* Expanded invisible hit area for UY and EC */}
                  {hasHitArea && (
                    <polygon
                      points={hitPointsAttr(slug)}
                      fill="transparent"
                      stroke="none"
                      style={{ cursor: "pointer" }}
                      tabIndex={-1}
                      aria-hidden="true"
                      onMouseEnter={(e) => handleMouseEnter(slug, e)}
                      onMouseMove={(e) => handleMouseMove(slug, e)}
                      onClick={() => handleClick(slug)}
                    />
                  )}
                  {/* Visual polygon */}
                  <polygon
                    id={`hot-${slug}`}
                    points={pts}
                    style={{
                      ...getHotzoneStyle(slug),
                      cursor: "pointer",
                      stroke: hoveredSlug === slug || isActive(slug) ? "rgba(192,83,46,0.4)" : "transparent",
                      strokeWidth: 1.5,
                      outline: "none",
                      filter: activeLayer ? "url(#capa-blur)" : undefined,
                      // For countries with expanded hit area, disable pointer events on visual
                      pointerEvents: hasHitArea ? "none" : undefined,
                    }}
                    tabIndex={hasHitArea ? -1 : 0}
                    role={hasHitArea ? undefined : "button"}
                    aria-label={hasHitArea ? undefined : `${country.name}${count > 0 ? `, ${count} análisis publicados` : ", sin análisis publicados"}`}
                    onMouseEnter={hasHitArea ? undefined : (e) => handleMouseEnter(slug, e)}
                    onMouseMove={hasHitArea ? undefined : (e) => handleMouseMove(slug, e)}
                    onClick={hasHitArea ? undefined : () => handleClick(slug)}
                    onKeyDown={hasHitArea ? undefined : (e) => handleKeyDown(e, slug)}
                    onFocus={hasHitArea ? undefined : () => {
                      setHoveredSlug(slug);
                      onCountryHover?.(slug);
                    }}
                    onBlur={hasHitArea ? undefined : () => {
                      setHoveredSlug(null);
                      onCountryHover?.(null);
                    }}
                  />
                  {/* Accessible element for countries with hit area */}
                  {hasHitArea && (
                    <polygon
                      points={hitPointsAttr(slug)}
                      fill="transparent"
                      stroke="none"
                      tabIndex={0}
                      role="button"
                      aria-label={`${country.name}${count > 0 ? `, ${count} análisis publicados` : ", sin análisis publicados"}`}
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(e) => handleMouseEnter(slug, e)}
                      onMouseMove={(e) => handleMouseMove(slug, e)}
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
                  )}
                </g>
              );
            })}
          </g>

          {/* Viento glyphs — Spec 44 */}
          {activeLayer?.layer.id === "viento" && (
            <g id="viento-glyphs" aria-hidden="true">
              {COUNTRIES.map((c) => {
                const value = activeLayer.layer.getValueForCountry(c.slug, activeLayer.period);
                if (!value) return null;
                const rank = value.raw;
                const GLYPH_SIZE = 28;
                const halfSize = GLYPH_SIZE / 2;
                const isNeutro = rank === 0;
                const isProEstado = rank < 0;
                return (
                  <g key={c.slug} style={{ pointerEvents: "none" }}>
                    {isNeutro ? (
                      <image
                        href="/mapa/glyphs/viento-neutro.svg"
                        x={c.cx - halfSize} y={c.cy - halfSize}
                        width={GLYPH_SIZE} height={GLYPH_SIZE}
                        style={{ color: "var(--mi-viento-glyph-stroke)" }}
                      />
                    ) : isProEstado ? (
                      <g transform={`translate(${c.cx}, ${c.cy}) scale(-1, 1) translate(${-c.cx}, ${-c.cy})`}>
                        <image
                          href="/mapa/glyphs/viento.svg"
                          x={c.cx - halfSize} y={c.cy - halfSize}
                          width={GLYPH_SIZE} height={GLYPH_SIZE}
                          style={{ color: "var(--mi-viento-glyph-stroke)" }}
                        />
                      </g>
                    ) : (
                      <image
                        href="/mapa/glyphs/viento.svg"
                        x={c.cx - halfSize} y={c.cy - halfSize}
                        width={GLYPH_SIZE} height={GLYPH_SIZE}
                        style={{ color: "var(--mi-viento-glyph-stroke)" }}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Capital markers */}
          <g id="capitals-interactive" aria-hidden="true">
            {COUNTRIES.map((c) => {
              const empty   = isEmpty(c.slug);
              const stroke  = getCapitalStroke(c.slug);
              const bg      = getCapitalBg(c.slug);
              const selected = selectedSlug === c.slug;
              const hovered  = hoveredSlug === c.slug;
              const active   = isActive(c.slug);

              return (
                <g
                  key={c.slug}
                  transform={`translate(${c.cx} ${c.cy})`}
                  style={{ opacity: empty ? 0.5 : 1, transition: "opacity 150ms" }}
                >
                  {(active || hovered || selected) && (
                    <rect
                      x="-20" y="-20"
                      width="40" height="40"
                      fill={bg}
                      style={{ transition: "fill 150ms" }}
                    />
                  )}
                  {/* Spec 49 §7 — anillo dorado cuando selected */}
                  {getCapitalRing(c.slug)}
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

      {/* Zoom indicator + RESET button — Spec 49 §4 + §5 */}
      <MapResetButton
        visible={isZoomed}
        scale={gestureState.scale}
        onReset={resetView}
      />

      {/* Tooltip — Spec 47 */}
      {tooltip && activeLayer && (
        <LayerTooltip
          tooltip={tooltip}
          activeLayer={activeLayer}
          sliderDate={sliderDate ?? activeLayer.period.date}
          onPinCountry={onPinCountry ?? (() => {})}
        />
      )}
    </div>
  );
}

// ── Utilities ────────────────────────────────────────────────────────────────

function pointInPolygon(x: number, y: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
