"use client";
import { useState } from "react";
import Link from "next/link";
import { EJES } from "@/lib/ejes";
import type { HeatmapCell, WeekLabel } from "@/components/HeatmapEjes";
import "@/styles/country-page.css";

const AXIS_ABBR: Record<string, string> = {
  deculturacion:    "DECULT.",
  mediaciones:      "MEDIAC.",
  desrepresentacion:"DESREP.",
  estetizacion:     "ESTETIZ.",
  desorientacion:   "DESORIENT.",
  atencion:         "ATENCIÓN",
};

const AXIS_SLUG: Record<string, string> = {
  deculturacion:    "deculturacion",
  mediaciones:      "erosion-de-mediaciones",
  desrepresentacion:"desrepresentacion",
  estetizacion:     "estetizacion",
  desorientacion:   "desorientacion-epistemologica",
  atencion:         "atencion",
};

function cellBg(axisKey: string, count: number): string {
  if (count === 0) return "var(--mi-bg-cream)";
  const color = `var(--mi-axis-${axisKey})`;
  if (count === 1) return `color-mix(in srgb, ${color} 35%, var(--mi-bg-cream))`;
  if (count === 2) return `color-mix(in srgb, ${color} 65%, var(--mi-bg-cream))`;
  return color;
}

export default function HeatmapAxisTime({
  data,
  weeks,
}: {
  data:  HeatmapCell[];
  weeks: WeekLabel[];
}) {
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const lkp = new Map<string, number>(
    data.map(c => [`${c.axisKey}-${c.week}-${c.year}`, c.count])
  );

  const displayWeeks = weeks.slice(-12);

  return (
    <div className="heatmap-mobile">
      {EJES.map(eje => (
        <div key={eje.axisKey} className="heatmap-mobile-row">
          <div className="heatmap-axis-label">
            <span
              className="heatmap-axis-dot"
              style={{ background: `var(--mi-axis-${eje.axisKey})` }}
            />
            {AXIS_ABBR[eje.axisKey] ?? eje.name.split(" ")[0].toUpperCase()}
          </div>

          <div className="heatmap-cell-row">
            {displayWeeks.map(w => {
              const count = lkp.get(`${eje.axisKey}-${w.week}-${w.year}`) ?? 0;
              const slug  = AXIS_SLUG[eje.axisKey] ?? eje.slug;
              return (
                <Link
                  key={`${w.week}-${w.year}`}
                  href={`/analisis?eje=${slug}&semana=${w.week}&ano=${w.year}`}
                  className="heatmap-cell"
                  style={{ background: cellBg(eje.axisKey, count) }}
                  title={`${AXIS_ABBR[eje.axisKey] ?? eje.name} · Sem ${w.week} · ${count} análisis`}
                  onMouseEnter={e => {
                    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      text: `${AXIS_ABBR[eje.axisKey] ?? eje.name} · S${w.week} · ${count}`,
                      x:   r.left + r.width / 2,
                      y:   r.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div className="heatmap-legend">
        sin actividad → + análisis = celda más oscura · {displayWeeks.length} sem.
      </div>

      {tooltip && (
        <div style={{
          position:      "fixed",
          left:          tooltip.x,
          top:           tooltip.y - 8,
          transform:     "translate(-50%, -100%)",
          background:    "var(--mi-ink)",
          color:         "var(--mi-bg-paper)",
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          padding:       "4px 10px",
          pointerEvents: "none",
          zIndex:        100,
          whiteSpace:    "nowrap",
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
