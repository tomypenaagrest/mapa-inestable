// Spec 39 — Stub de capa Presión (confianza institucional)
// Datos sintéticos de Latinobarómetro. Spec 45 reemplaza con implementación real.

import type { Layer, LayerPeriod, LayerValue } from "../layers";

const SYNTHETIC: Record<string, Record<string, number>> = {
  ar: { "2021": 1, "2022": 1, "2023": 0, "2024": 0 },
  bo: { "2021": 1, "2022": 1, "2023": 1, "2024": 1 },
  br: { "2021": 1, "2022": 2, "2023": 2, "2024": 2 },
  cl: { "2021": 0, "2022": 0, "2023": 1, "2024": 1 },
  co: { "2021": 1, "2022": 1, "2023": 1, "2024": 1 },
  ec: { "2021": 1, "2022": 1, "2023": 0, "2024": 0 },
  pe: { "2021": 0, "2022": 0, "2023": 0, "2024": 0 },
  py: { "2021": 2, "2022": 2, "2023": 2, "2024": 2 },
  uy: { "2021": 3, "2022": 3, "2023": 3, "2024": 3 },
  ve: { "2021": 0, "2022": 0, "2023": 0, "2024": 0 },
};

const FORMATTED: Record<number, string> = {
  0: "Confianza muy baja (< 20%)",
  1: "Confianza baja (20–35%)",
  2: "Confianza media (35–50%)",
  3: "Confianza alta (> 50%)",
};

const PERIODS: LayerPeriod[] = [
  { key: "2021", date: "2021-12-31", label: "2021" },
  { key: "2022", date: "2022-12-31", label: "2022" },
  { key: "2023", date: "2023-12-31", label: "2023" },
  { key: "2024", date: "2024-12-31", label: "2024" },
];

function getLastPeriodBefore(date: string): LayerPeriod | null {
  const sorted = [...PERIODS].sort((a, b) => b.date.localeCompare(a.date));
  return sorted.find(p => p.date <= date) ?? null;
}

export const presionLayer: Layer = {
  id: "presion",
  label: "Presión · confianza institucional",
  shortLabel: "Presión",
  glyphSrc: "/mapa/glyphs/presion.svg",
  category: "institucional",
  description: "La presión que ejercen las instituciones sobre la vida colectiva. Confianza ciudadana en partidos, parlamento y gobierno como barómetro de densidad institucional.",
  unit: "% de confianza en instituciones (Latinobarómetro)",
  cadence: "anual",
  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Muy baja",  color: "#8A4A55", rangeDescription: "< 20% de confianza institucional" },
      { bucketIndex: 1, label: "Baja",      color: "#C8993E", rangeDescription: "20–35% de confianza institucional" },
      { bucketIndex: 2, label: "Media",     color: "#4A7A4A", rangeDescription: "35–50% de confianza institucional" },
      { bucketIndex: 3, label: "Alta",      color: "#2D6B4A", rangeDescription: "> 50% de confianza institucional" },
    ],
    noDataColor: "#C8B894",
  },
  source: {
    name: "Latinobarómetro (datos sintéticos — Spec 45 implementa real)",
    url: "https://www.latinobarometro.org/",
    publishedDate: "2024-12-31",
    lastFetched: "2025-01-01",
  },
  periods: PERIODS,
  defaultPeriod: PERIODS[PERIODS.length - 1],
  getValueForCountry(countrySlug, period) {
    const yearData = SYNTHETIC[countrySlug];
    if (!yearData) return null;
    const year = period.key.slice(0, 4);
    const bucket = yearData[year];
    if (bucket === undefined) return null;
    const prevYear = String(Number(year) - 1);
    const prevBucket = yearData[prevYear];
    return {
      raw: [15, 28, 42, 58][bucket],
      formatted: FORMATTED[bucket],
      bucketIndex: bucket,
      delta: prevBucket !== undefined ? bucket - prevBucket : undefined,
      quality: "estimado",
    };
  },
  getLastPeriodBefore,
  readingGuideSlug: "presion",
};
