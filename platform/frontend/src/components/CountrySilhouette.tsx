"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ISO_TO_GEO: Record<string, string> = {
  ar: "Argentina", br: "Brazil", cl: "Chile", co: "Colombia",
  bo: "Bolivia",   pe: "Peru",   uy: "Uruguay", py: "Paraguay",
  ec: "Ecuador",   ve: "Venezuela",
};

// Module-level cache — shared across all instances
let cachedGeo: GeoJSON.FeatureCollection | null = null;
let pendingGeo: Promise<GeoJSON.FeatureCollection> | null = null;

function getGeo(): Promise<GeoJSON.FeatureCollection> {
  if (cachedGeo) return Promise.resolve(cachedGeo);
  if (pendingGeo) return pendingGeo;
  pendingGeo = fetch("/geo/south-america.json")
    .then(r => r.json())
    .then(d => { cachedGeo = d; return d; });
  return pendingGeo;
}

interface Props {
  country: string;   // ISO alpha-2 lowercase ("co", "ar", …)
  height?: number;
  color?: string;
}

export default function CountrySilhouette({
  country,
  height = 100,
  color = "var(--mi-ink)",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef  = useRef<SVGSVGElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const geoName = ISO_TO_GEO[country.toLowerCase()];
    if (!geoName) return;

    getGeo().then(geo => {
      if (!svgRef.current || !wrapRef.current) return;

      const feature = geo.features.find(
        f => (f.properties as Record<string, string>)?.name === geoName
      );
      if (!feature) return;

      const w   = wrapRef.current.clientWidth || 120;
      const h   = height;
      const pad = Math.min(w, h) * 0.06;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Normal (north-up) projection fitted to this specific feature
      const proj = d3.geoMercator().fitExtent(
        [[pad, pad], [w - pad, h - pad]],
        feature as GeoJSON.Feature
      );
      const pathGen = d3.geoPath().projection(proj);

      // Flip Y axis → south-up (Torres García orientation)
      const g = svg.append("g").attr("transform", `translate(0,${h}) scale(1,-1)`);
      g.append("path")
        .datum(feature)
        .attr("d", pathGen as never)
        .attr("fill", color)
        .attr("stroke", "none");

      setReady(true);
    }).catch(() => {/* GeoJSON not available */});
  }, [country, height, color]);

  return (
    <div ref={wrapRef} style={{ height, width: "100%" }}>
      <svg
        ref={svgRef}
        width="100%"
        height={height}
        style={{ display: "block", opacity: ready ? 1 : 0, transition: "opacity 0.3s" }}
      />
    </div>
  );
}
