"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { type CountrySummary, COUNTRY_NAMES, AXIS_COLORS, AXIS_LABELS, type Axis } from "@/lib/api";

interface Props {
  summaries: CountrySummary[];
  onCountryClick: (country: string) => void;
  selectedCountry: string | null;
}

// Mapeo ISO alpha-2 → nombre en GeoJSON Natural Earth
const ISO_TO_GEO: Record<string, string> = {
  AR: "Argentina",
  BR: "Brazil",
  CL: "Chile",
  CO: "Colombia",
  BO: "Bolivia",
  PE: "Peru",
  UY: "Uruguay",
  PY: "Paraguay",
  EC: "Ecuador",
  VE: "Venezuela",
};

function getDominantAxis(summary: CountrySummary): Axis | null {
  if (!summary.active_axes.length) return null;
  return summary.active_axes[0].axis;
}

function getCountryColor(summary: CountrySummary | undefined): string {
  if (!summary || !summary.active_axes.length) return "#1e1e1e";
  const axis = getDominantAxis(summary)!;
  return AXIS_COLORS[axis] + "99"; // semi-transparent
}

export default function MapaSudamerica({ summaries, onCountryClick, selectedCountry }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    country: string;
    summary: CountrySummary | undefined;
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth || 700;
    const height = 700;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const summaryByCountry = Object.fromEntries(
      summaries.map((s) => [s.country, s])
    );

    // Proyección invertida — sur arriba (Torres García)
    const projection = d3
      .geoMercator()
      .center([-60, -15])
      .scale(750)
      .translate([width / 2, height / 2])
      .rotate([0, 0, 180]); // rotación 180° sobre eje Z invierte norte/sur

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    fetch("/geo/south-america.json")
      .then((r) => r.json())
      .then((geojson) => {
        g.selectAll("path")
          .data(geojson.features)
          .join("path")
          .attr("d", path as never)
          .attr("fill", (d: unknown) => {
            const feat = d as GeoJSON.Feature;
            const geoName = (feat.properties as Record<string, string>)?.name || "";
            const iso = Object.keys(ISO_TO_GEO).find(
              (k) => ISO_TO_GEO[k] === geoName
            );
            if (!iso) return "#1e1e1e";
            return getCountryColor(summaryByCountry[iso]);
          })
          .attr("stroke", (d: unknown) => {
            const feat = d as GeoJSON.Feature;
            const geoName = (feat.properties as Record<string, string>)?.name || "";
            const iso = Object.keys(ISO_TO_GEO).find(
              (k) => ISO_TO_GEO[k] === geoName
            );
            return iso === selectedCountry ? "var(--accent)" : "#333";
          })
          .attr("stroke-width", (d: unknown) => {
            const feat = d as GeoJSON.Feature;
            const geoName = (feat.properties as Record<string, string>)?.name || "";
            const iso = Object.keys(ISO_TO_GEO).find(
              (k) => ISO_TO_GEO[k] === geoName
            );
            return iso === selectedCountry ? 2 : 0.5;
          })
          .style("cursor", "pointer")
          .on("mouseenter", function (event: MouseEvent, d: unknown) {
            const feat = d as GeoJSON.Feature;
            const geoName = (feat.properties as Record<string, string>)?.name || "";
            const iso = Object.keys(ISO_TO_GEO).find(
              (k) => ISO_TO_GEO[k] === geoName
            );
            if (!iso) return;
            d3.select(this).attr("fill", "#3a3a3a");
            const rect = svgRef.current!.getBoundingClientRect();
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              country: iso,
              summary: summaryByCountry[iso],
            });
          })
          .on("mouseleave", function (_: MouseEvent, d: unknown) {
            const feat = d as GeoJSON.Feature;
            const geoName = (feat.properties as Record<string, string>)?.name || "";
            const iso = Object.keys(ISO_TO_GEO).find(
              (k) => ISO_TO_GEO[k] === geoName
            );
            d3.select(this).attr(
              "fill",
              iso ? getCountryColor(summaryByCountry[iso]) : "#1e1e1e"
            );
            setTooltip(null);
          })
          .on("click", (_: MouseEvent, d: unknown) => {
            const feat = d as GeoJSON.Feature;
            const geoName = (feat.properties as Record<string, string>)?.name || "";
            const iso = Object.keys(ISO_TO_GEO).find(
              (k) => ISO_TO_GEO[k] === geoName
            );
            if (iso) onCountryClick(iso);
          });
      })
      .catch(() => {
        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .attr("fill", "#6b6660")
          .text("GeoJSON no disponible — colocar south-america.json en /public/geo/");
      });
  }, [summaries, selectedCountry, onCountryClick]);

  return (
    <div style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        width="100%"
        height={700}
        style={{ display: "block" }}
      />
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x + 12,
            top: tooltip.y - 10,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            padding: "0.75rem 1rem",
            borderRadius: 6,
            pointerEvents: "none",
            minWidth: 200,
            fontSize: "0.85rem",
          }}
        >
          <strong style={{ display: "block", marginBottom: 6 }}>
            {COUNTRY_NAMES[tooltip.country] || tooltip.country}
          </strong>
          {tooltip.summary ? (
            <>
              <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>
                {tooltip.summary.event_count} eventos · {tooltip.summary.analysis_count} análisis
              </div>
              {tooltip.summary.active_axes.slice(0, 3).map((a) => (
                <div
                  key={a.axis}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 3,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: AXIS_COLORS[a.axis],
                      display: "inline-block",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: "var(--text)" }}>
                    {AXIS_LABELS[a.axis]}
                  </span>
                  <span style={{ color: "var(--text-muted)", marginLeft: "auto" }}>
                    {a.count}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <span style={{ color: "var(--text-muted)" }}>Sin datos esta semana</span>
          )}
        </div>
      )}

      {/* Leyenda de ejes */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          padding: "0.75rem",
          borderRadius: 6,
          fontSize: "0.75rem",
        }}
      >
        <div style={{ color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Ejes activos
        </div>
        {(Object.keys(AXIS_COLORS) as Axis[]).map((axis) => (
          <div key={axis} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: AXIS_COLORS[axis],
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ color: "var(--text)" }}>{AXIS_LABELS[axis]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
