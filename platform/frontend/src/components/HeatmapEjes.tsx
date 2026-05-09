"use client";
import { useState } from "react";
import Link from "next/link";
import { EJES } from "@/lib/ejes";

export interface HeatmapCell {
  axisKey: string;
  week: number;
  year: number;
  count: number;
}

export interface WeekLabel {
  week: number;
  year: number;
  label: string;
}

function cellBg(count: number): string {
  if (count === 0) return "var(--mi-bg-paper)";
  if (count === 1) return "#DBA87A";
  if (count === 2) return "#CA7A4E";
  return "var(--mi-bg)";
}

export default function HeatmapEjes({
  data,
  weeks,
}: {
  data: HeatmapCell[];
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

  const cols = `64px repeat(${weeks.length}, 1fr)`;

  return (
    <div style={{ padding: "var(--mi-space-3)", position: "relative", height: "100%" }}>
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
        marginBottom: "var(--mi-space-3)",
      }}>
        Ejes × Semanas
      </div>

      {/* Week labels */}
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 2, marginBottom: 2 }}>
        <div />
        {weeks.map(w => (
          <div key={`${w.week}-${w.year}`} style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "9px",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            textAlign: "center",
          }}>
            {w.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      {EJES.map(eje => (
        <div key={eje.axisKey} style={{
          display: "grid",
          gridTemplateColumns: cols,
          gap: 2,
          marginBottom: 2,
        }}>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "9px",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }} title={eje.name}>
            {eje.name.split(" ")[0]}
          </div>

          {weeks.map(w => {
            const count = lkp.get(`${eje.axisKey}-${w.week}-${w.year}`) ?? 0;
            return (
              <Link
                key={`${w.week}-${w.year}`}
                href={`/analisis?eje=${eje.slug}&semana=${w.week}&ano=${w.year}`}
                style={{
                  display: "block",
                  height: 20,
                  background: cellBg(count),
                  border: "1px solid var(--mi-rule-soft)",
                }}
                onMouseEnter={e => {
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setTooltip({
                    text: `${eje.name} · Sem ${w.week} · ${count} análisis`,
                    x: r.left + r.width / 2,
                    y: r.top,
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
                title={`${eje.name} · Semana ${w.week} · ${count} análisis`}
              />
            );
          })}
        </div>
      ))}

      {tooltip && (
        <div style={{
          position: "fixed",
          left: tooltip.x,
          top: tooltip.y - 8,
          transform: "translate(-50%, -100%)",
          background: "var(--mi-ink)",
          color: "var(--mi-bg-paper)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          padding: "4px 10px",
          pointerEvents: "none",
          zIndex: 100,
          whiteSpace: "nowrap",
        }}>
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
