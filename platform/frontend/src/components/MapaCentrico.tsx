"use client";
import { useEffect, useRef } from "react";
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

interface Props {
  weeklyCountries: WeeklyCountryData[];
  selectedCountry: string | null;   // ISO lowercase or null
  onCountryClick: (iso: string) => void;
  height?: number;
}

export default function MapaCentrico({
  weeklyCountries,
  selectedCountry,
  onCountryClick,
  height = 400,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const weekly = Object.fromEntries(weeklyCountries.map(c => [c.slug.toUpperCase(), c]));

  useEffect(() => {
    if (!svgRef.current) return;
    const el = svgRef.current;
    const w   = el.clientWidth || 500;
    const h   = height;

    const svg = d3.select(el);
    svg.selectAll("*").remove();

    const proj = d3.geoMercator()
      .center([-60, -15])
      .scale(w * 1.1)
      .translate([w / 2, h / 2])
      .rotate([0, 0, 180]);

    const path = d3.geoPath().projection(proj);
    const g    = svg.append("g");

    fetch("/geo/south-america.json")
      .then(r => r.json())
      .then(geo => {
        g.selectAll("path")
          .data(geo.features)
          .join("path")
          .attr("d", path as never)
          .attr("fill", (d: unknown) => {
            const name = ((d as GeoJSON.Feature).properties as Record<string, string>)?.name || "";
            const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
            if (!iso) return "var(--mi-bg-paper)";
            const wc = weekly[iso];
            if (!wc) return "var(--mi-bg-cream)";
            return (AXIS_COLORS[wc.axisKey] ?? "var(--mi-bg-paper)") + "BB";
          })
          .attr("stroke", "var(--mi-ink)")
          .attr("stroke-width", (d: unknown) => {
            const name = ((d as GeoJSON.Feature).properties as Record<string, string>)?.name || "";
            const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
            return iso && iso.toLowerCase() === selectedCountry ? 2.5 : 0.5;
          })
          .style("cursor", "pointer")
          .on("click", (_: MouseEvent, d: unknown) => {
            const name = ((d as GeoJSON.Feature).properties as Record<string, string>)?.name || "";
            const iso  = Object.keys(ISO_TO_GEO).find(k => ISO_TO_GEO[k] === name);
            if (iso) onCountryClick(iso.toLowerCase());
          });
      })
      .catch(() => {
        svg.append("text")
          .attr("x", w / 2).attr("y", h / 2)
          .attr("text-anchor", "middle")
          .attr("fill", "var(--mi-ink-mute)")
          .attr("font-family", "var(--mi-font-mono)")
          .attr("font-size", 11)
          .text("Colocar south-america.json en /public/geo/");
      });
  // Re-render when country selection or data changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeklyCountries, selectedCountry, height]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      style={{ display: "block", background: "var(--mi-bg-paper)" }}
    />
  );
}
