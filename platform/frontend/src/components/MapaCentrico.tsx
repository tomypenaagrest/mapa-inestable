"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ISO_TO_GEO: Record<string, string> = {
  AR: "Argentina", BR: "Brazil",   CL: "Chile",    CO: "Colombia",
  BO: "Bolivia",   PE: "Peru",     UY: "Uruguay",  PY: "Paraguay",
  EC: "Ecuador",   VE: "Venezuela",
};

const AXIS_COLORS: Record<string, string> = {
  deculturacion:     "#6B4A38",
  mediaciones:       "#4A5C30",
  desrepresentacion: "#8A4A55",
  estetizacion:      "#B45729",
  desorientacion:    "#2D4A6B",
  atencion:          "#C8993E",
};

export interface WeeklyCountryData {
  slug: string;
  axisKey: string;
  lastTitle?: string;
  lastSlug?: string;
  lastAxis?: string;
}

interface TooltipState {
  x: number;
  y: number;
  name: string;
}

interface Props {
  weeklyCountries: WeeklyCountryData[];
  selectedCountry: string | null;
  onCountryClick: (iso: string) => void;
  height?: number;
}

// Module-level cache — persists across re-renders within the same page session
let geoCache: GeoJSON.FeatureCollection | null = null;

function loadGeo(): Promise<GeoJSON.FeatureCollection> {
  if (geoCache) return Promise.resolve(geoCache);
  return fetch("/geo/south-america.json")
    .then(r => r.json())
    .then(geo => { geoCache = geo as GeoJSON.FeatureCollection; return geoCache; });
}

export default function MapaCentrico({
  weeklyCountries,
  selectedCountry,
  onCountryClick,
  height = 400,
}: Props) {
  const svgRef       = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Stable ref for the click callback — prevents it from appearing in Effect 1 deps
  const onClickRef   = useRef(onCountryClick);
  // Ref to drawn paths so Effect 2 can update strokes without a full redraw
  const pathsRef     = useRef<d3.Selection<SVGPathElement, GeoJSON.Feature, SVGGElement, unknown> | null>(null);
  // Ref to current selection for use inside D3 event handlers (avoids stale closures)
  const selectedRef  = useRef(selectedCountry);

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Keep callback and selection refs in sync on every render
  useEffect(() => { onClickRef.current = onCountryClick; });
  useEffect(() => { selectedRef.current = selectedCountry; }, [selectedCountry]);

  const weekly = Object.fromEntries(weeklyCountries.map(c => [c.slug.toUpperCase(), c]));

  // ── Effect 1: full draw (runs on data/size change, NOT on selection change) ──
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    let cancelled = false;

    const draw = (geo: GeoJSON.FeatureCollection) => {
      if (cancelled) return;
      const container = containerRef.current;
      const w = container
        ? (container.getBoundingClientRect().width || container.clientWidth || 500)
        : el.clientWidth || 500;
      const h = height;

      const svg = d3.select(el);
      svg.selectAll("*").remove();
      pathsRef.current = null;

      const proj = d3.geoMercator()
        .center([-60, -15])
        .scale(w * 1.1)
        .translate([w / 2, h / 2])
        .rotate([0, 0, 180]);

      const path = d3.geoPath().projection(proj);
      const g    = svg.append("g");

      const paths = g.selectAll<SVGPathElement, GeoJSON.Feature>("path")
        .data(geo.features)
        .join("path")
        .attr("d", path as never)
        .attr("fill", (d) => {
          const name = (d.properties as Record<string, string>)?.name || "";
          const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
          if (!iso) return "var(--mi-bg-paper)";
          const wc = weekly[iso];
          if (!wc) return "var(--mi-bg-cream)";
          return (AXIS_COLORS[wc.axisKey] ?? "var(--mi-bg-paper)") + "BB";
        })
        .attr("stroke", "var(--mi-ink)")
        .attr("stroke-width", (d) => {
          const name = (d.properties as Record<string, string>)?.name || "";
          const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
          return iso && iso.toLowerCase() === selectedRef.current ? 2.5 : 0.5;
        })
        .style("cursor", "pointer")
        .on("mouseenter", (event: MouseEvent, d) => {
          if (cancelled) return;
          const name = (d.properties as Record<string, string>)?.name || "";
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (!containerRect) return;
          setTooltip({
            x: event.clientX - containerRect.left + 12,
            y: event.clientY - containerRect.top - 8,
            name,
          });
          d3.select(event.currentTarget as SVGPathElement)
            .attr("stroke-width", 2)
            .attr("opacity", 0.85);
        })
        .on("mousemove", (event: MouseEvent) => {
          if (cancelled) return;
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (!containerRect) return;
          setTooltip(prev => prev ? {
            ...prev,
            x: event.clientX - containerRect.left + 12,
            y: event.clientY - containerRect.top - 8,
          } : null);
        })
        .on("mouseleave", (event: MouseEvent, d) => {
          if (cancelled) return;
          const name = (d.properties as Record<string, string>)?.name || "";
          const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
          setTooltip(null);
          d3.select(event.currentTarget as SVGPathElement)
            .attr("stroke-width", iso && iso.toLowerCase() === selectedRef.current ? 2.5 : 0.5)
            .attr("opacity", 1);
        })
        .on("click", (_: MouseEvent, d) => {
          if (cancelled) return;
          const name = (d.properties as Record<string, string>)?.name || "";
          const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
          if (iso) onClickRef.current(iso.toLowerCase());
        });

      pathsRef.current = paths;
    };

    loadGeo()
      .then(geo => { if (!cancelled) draw(geo); })
      .catch(() => {
        if (cancelled) return;
        const container = containerRef.current;
        const w = container ? container.getBoundingClientRect().width : 500;
        d3.select(el)
          .append("text")
          .attr("x", w / 2).attr("y", height / 2)
          .attr("text-anchor", "middle")
          .attr("fill", "var(--mi-ink-mute)")
          .attr("font-family", "var(--mi-font-mono)")
          .attr("font-size", 11)
          .text("Colocar south-america.json en /public/geo/");
      });

    const ro = new ResizeObserver(() => {
      if (!cancelled && geoCache) draw(geoCache);
    });
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelled = true;
      pathsRef.current = null;
      ro.disconnect();
    };
  // selectedCountry and onCountryClick intentionally excluded — handled via refs / Effect 2
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyCountries, height]);

  // ── Effect 2: update selection stroke widths only (no SVG clear/redraw) ──
  useEffect(() => {
    const paths = pathsRef.current;
    if (!paths) return;
    paths.attr("stroke-width", (d) => {
      const name = (d.properties as Record<string, string>)?.name || "";
      const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
      return iso && iso.toLowerCase() === selectedCountry ? 2.5 : 0.5;
    });
  }, [selectedCountry]);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ display: "block", background: "var(--mi-bg-paper)" }}
      />
      {tooltip && (
        <div style={{
          position: "absolute",
          left: tooltip.x,
          top: tooltip.y,
          pointerEvents: "none",
          background: "var(--mi-bg-dark)",
          color: "var(--mi-bg-paper)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "11px",
          letterSpacing: "0.06em",
          padding: "4px 8px",
          border: "1px solid var(--mi-ink)",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}>
          {tooltip.name}
        </div>
      )}
    </div>
  );
}
