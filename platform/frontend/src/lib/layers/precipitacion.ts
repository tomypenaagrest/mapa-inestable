// Spec 39 — Stub de capa Precipitación (crecimiento económico)
// Datos sintéticos. Spec 42 reemplaza con implementación real.

import type { Layer, LayerPeriod, LayerValue } from "../layers";

// Datos sintéticos por país × año
// 0=recesión 1=estancamiento 2=crecimiento moderado 3=expansión
const SYNTHETIC: Record<string, Record<string, number>> = {
  ar: { "2021": 1, "2022": 2, "2023": 3, "2024": 3 },
  bo: { "2021": 1, "2022": 2, "2023": 1, "2024": 1 },
  br: { "2021": 2, "2022": 2, "2023": 2, "2024": 2 },
  cl: { "2021": 3, "2022": 2, "2023": 1, "2024": 1 },
  co: { "2021": 2, "2022": 3, "2023": 2, "2024": 2 },
  ec: { "2021": 1, "2022": 1, "2023": 1, "2024": 0 },
  pe: { "2021": 3, "2022": 2, "2023": 1, "2024": 1 },
  py: { "2021": 1, "2022": 1, "2023": 2, "2024": 2 },
  uy: { "2021": 2, "2022": 2, "2023": 2, "2024": 2 },
  ve: { "2021": 0, "2022": 0, "2023": 0, "2024": 0 },
};

const FORMATTED: Record<number, string> = {
  0: "< −1% (recesión)",
  1: "−1% a 1% (estancamiento)",
  2: "1% a 3% (moderado)",
  3: "> 3% (expansión)",
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

export const precipitacionLayer: Layer = {
  id: "precipitacion",
  label: "Precipitación · crecimiento económico",
  shortLabel: "Precipitación",
  glyphSrc: "/mapa/glyphs/precipitacion.svg",
  category: "macro",
  description: "Cuánto llueve capital en cada economía. El crecimiento del PBI como primer indicador del estado macroeconómico estructural.",
  unit: "% variación anual del PBI",
  cadence: "anual",
  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Recesión",              color: "#8A4A55", rangeDescription: "PBI < −1% anual" },
      { bucketIndex: 1, label: "Estancamiento",          color: "#C8993E", rangeDescription: "−1% a 1% anual" },
      { bucketIndex: 2, label: "Crecimiento moderado",  color: "#4A7A4A", rangeDescription: "1% a 3% anual" },
      { bucketIndex: 3, label: "Expansión",             color: "#2D6B4A", rangeDescription: "> 3% anual" },
    ],
    noDataColor: "#C8B894",
  },
  source: {
    name: "World Bank (datos sintéticos — Spec 42 implementa real)",
    url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG",
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
      raw: [-1.5, 0.3, 2.1, 4.2][bucket],
      formatted: FORMATTED[bucket],
      bucketIndex: bucket,
      delta: prevBucket !== undefined ? bucket - prevBucket : undefined,
      quality: "estimado",
    };
  },
  getLastPeriodBefore,
  readingGuideSlug: "precipitacion",
};
