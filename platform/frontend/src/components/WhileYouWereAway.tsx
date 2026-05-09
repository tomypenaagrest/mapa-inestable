"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useReaderState } from "@/hooks/useReaderState";

interface Slide {
  slug: string;
  countrySlug: string;
  country: string;
  axisKey: string;
  axisName: string;
  publishedIso: string;
}

interface Props {
  slides: Slide[];
  year: number;
  week: number;
}

export default function WhileYouWereAway({ slides, year, week }: Props) {
  const { state, touchLastVisit } = useReaderState();
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !state || dismissed) return null;
  if (!state.lastVisit) return null;

  const daysDiff = Math.floor((Date.now() - new Date(state.lastVisit).getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 14) return null;

  const lastVisitDate = new Date(state.lastVisit);
  const missedSlides = slides.filter(s => new Date(s.publishedIso) > lastVisitDate);
  const missedCount = missedSlides.length;
  const weeksAway = Math.floor(daysDiff / 7);

  const countryCounts = missedSlides.reduce<Record<string, number>>((acc, s) => {
    acc[s.country] = (acc[s.country] ?? 0) + 1;
    return acc;
  }, {});
  const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0];

  const axisCounts = missedSlides.reduce<Record<string, number>>((acc, s) => {
    acc[s.axisName] = (acc[s.axisName] ?? 0) + 1;
    return acc;
  }, {});
  const topAxis = Object.entries(axisCounts).sort((a, b) => b[1] - a[1])[0];

  function dismiss() {
    setDismissed(true);
    touchLastVisit();
  }

  return (
    <div className="mi-grain" style={{
      background: "var(--mi-bg-cream)",
      borderBottom: "var(--mi-border-thick)",
      padding: "var(--mi-space-4) var(--mi-space-5)",
      position: "relative",
    }}>
      <button
        onClick={dismiss}
        aria-label="Cerrar"
        style={{
          position: "absolute",
          top: "var(--mi-space-3)",
          right: "var(--mi-space-4)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-sm)",
          color: "var(--mi-ink-mute)",
        }}
      >
        ×
      </button>

      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-widest)",
        textTransform: "uppercase",
        color: "var(--mi-accent-warn)",
        marginBottom: "var(--mi-space-2)",
      }}>
        Mientras estuviste fuera · {weeksAway} {weeksAway === 1 ? "semana" : "semanas"}, {missedCount} {missedCount === 1 ? "análisis" : "análisis"}
      </div>

      {(topCountry || topAxis) && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-ink-soft)",
          marginBottom: "var(--mi-space-3)",
        }}>
          Lo más activo:{" "}
          {topCountry && <><strong style={{ color: "var(--mi-ink)" }}>{topCountry[0].toUpperCase()}</strong> ({topCountry[1]})</>}
          {topCountry && topAxis && " · "}
          {topAxis && <><strong style={{ color: "var(--mi-ink)" }}>{topAxis[0].toUpperCase()}</strong> ({topAxis[1]})</>}
        </div>
      )}

      <div style={{ display: "flex", gap: "var(--mi-space-4)", flexWrap: "wrap" }}>
        <Link
          href={`/despachos/${year}/${week}`}
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            textDecoration: "underline",
          }}
        >
          Ver despachos perdidos →
        </Link>
        <button
          onClick={dismiss}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Ir al home →
        </button>
      </div>
    </div>
  );
}
