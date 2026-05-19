"use client";
// Spec 39 — Time slider full-width debajo del mapa. Solo visible con capa activa.

import { useCallback, useId } from "react";
import type { Layer, LayerPeriod } from "@/lib/layers";

interface LayerTimeSliderProps {
  layer: Layer;
  sliderDate: string;      // ISO YYYY-MM-DD
  activePeriod: LayerPeriod | null;
  onSliderChange: (date: string) => void;
  globalStart: string;     // "2021-01-01"
  globalEnd: string;       // today
}

function dateToMs(iso: string): number {
  return new Date(iso).getTime();
}

function msToDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function formatIso(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { year: "numeric", month: "short" });
}

export default function LayerTimeSlider({
  layer,
  sliderDate,
  activePeriod,
  onSliderChange,
  globalStart,
  globalEnd,
}: LayerTimeSliderProps) {
  const sliderId = useId();
  const startMs  = dateToMs(globalStart);
  const endMs    = dateToMs(globalEnd);
  const currentMs = dateToMs(sliderDate);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const ms   = Number(e.target.value);
    const date = msToDate(ms);
    onSliderChange(date);
  }, [onSliderChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const STEP_WEEK  = 7 * 24 * 60 * 60 * 1000;
    const STEP_MONTH = 30 * 24 * 60 * 60 * 1000;
    let delta = 0;
    if (e.key === "ArrowLeft")  delta = -STEP_WEEK;
    if (e.key === "ArrowRight") delta = STEP_WEEK;
    if (e.key === "PageUp")     delta = -STEP_MONTH;
    if (e.key === "PageDown")   delta = STEP_MONTH;
    if (e.key === "Home") { onSliderChange(globalStart); return; }
    if (e.key === "End")  { onSliderChange(globalEnd);   return; }
    if (delta !== 0) {
      e.preventDefault();
      const next = Math.max(startMs, Math.min(endMs, currentMs + delta));
      onSliderChange(msToDate(next));
    }
  }, [currentMs, startMs, endMs, globalStart, globalEnd, onSliderChange]);

  // Marks cada 6 meses, label cada año
  const marks = buildMarks(globalStart, globalEnd, startMs, endMs);

  const isStale = layer.periods.length > 0 &&
    activePeriod &&
    dateToMs(activePeriod.date) < dateToMs(sliderDate) - (2 * 365 * 24 * 60 * 60 * 1000);

  return (
    <div style={{
      padding: "var(--mi-space-3) var(--mi-space-4) var(--mi-space-2)",
      background: "var(--mi-bg-paper)",
      borderTop: "var(--mi-border-bold)",
    }}>

      {/* Slider track */}
      <div style={{ position: "relative", marginBottom: "var(--mi-space-1)" }}>
        <input
          id={sliderId}
          type="range"
          min={startMs}
          max={endMs}
          value={currentMs}
          step={24 * 60 * 60 * 1000}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            width: "100%",
            height: 4,
            appearance: "none",
            background: `linear-gradient(to right, var(--mi-ink) 0%, var(--mi-ink) ${((currentMs - startMs) / (endMs - startMs)) * 100}%, var(--mi-rule-soft) ${((currentMs - startMs) / (endMs - startMs)) * 100}%, var(--mi-rule-soft) 100%)`,
            outline: "none",
            cursor: "pointer",
          }}
          aria-label="Período temporal de la capa analítica"
          aria-valuetext={sliderDate}
        />
        {/* Year marks */}
        <div style={{ position: "relative", height: 16 }}>
          {marks.map(m => (
            <span
              key={m.label}
              style={{
                position: "absolute",
                left: `${m.pct}%`,
                transform: "translateX(-50%)",
                fontFamily: "var(--mi-font-mono)",
                fontSize: 9,
                color: "var(--mi-ink-mute)",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Context line */}
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: 9,
        color: "var(--mi-ink-mute)",
        letterSpacing: "0.04em",
      }}>
        Mostrando:{" "}
        <span style={{ color: "var(--mi-ink)", fontWeight: 700 }}>
          {activePeriod ? activePeriod.label : "sin dato disponible"}
        </span>
        {activePeriod && sliderDate !== activePeriod.date && (
          <span> · dato ≤ {formatIso(sliderDate)}</span>
        )}
        {isStale && (
          <span style={{ color: "var(--mi-accent-warn)" }}> · ⚠ dato congelado</span>
        )}
        {!activePeriod && (
          <span> · sin datos antes de {layer.periods[0]?.label ?? "—"}</span>
        )}
      </div>
    </div>
  );
}

function buildMarks(
  globalStart: string,
  globalEnd: string,
  startMs: number,
  endMs: number,
): { label: string; pct: number }[] {
  const marks: { label: string; pct: number }[] = [];
  const startYear = new Date(globalStart).getFullYear();
  const endYear   = new Date(globalEnd).getFullYear();
  const total     = endMs - startMs;

  for (let y = startYear; y <= endYear; y++) {
    const ms = new Date(`${y}-01-01`).getTime();
    if (ms < startMs || ms > endMs) continue;
    marks.push({ label: String(y), pct: ((ms - startMs) / total) * 100 });
  }
  return marks;
}
