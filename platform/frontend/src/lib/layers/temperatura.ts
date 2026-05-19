// Spec 39 — Stub de capa Temperatura (salario real)
// Datos sintéticos. Spec 43 reemplaza con implementación real.

import type { Layer, LayerPeriod, LayerValue } from "../layers";

const SYNTHETIC: Record<string, Record<string, number>> = {
  ar: { "2021": 0, "2022": 0, "2023": 0, "2024": 1 },
  bo: { "2021": 1, "2022": 1, "2023": 1, "2024": 1 },
  br: { "2021": 1, "2022": 1, "2023": 2, "2024": 2 },
  cl: { "2021": 2, "2022": 1, "2023": 1, "2024": 2 },
  co: { "2021": 1, "2022": 1, "2023": 1, "2024": 1 },
  ec: { "2021": 1, "2022": 1, "2023": 1, "2024": 1 },
  pe: { "2021": 2, "2022": 1, "2023": 1, "2024": 1 },
  py: { "2021": 2, "2022": 2, "2023": 2, "2024": 2 },
  uy: { "2021": 2, "2022": 2, "2023": 3, "2024": 3 },
  ve: { "2021": 0, "2022": 0, "2023": 0, "2024": 0 },
};

const FORMATTED: Record<number, string> = {
  0: "Caída sostenida",
  1: "Estancado",
  2: "Recuperación moderada",
  3: "Crecimiento sostenido",
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

export const temperaturaLayer: Layer = {
  id: "temperatura",
  label: "Temperatura · salario real",
  shortLabel: "Temperatura",
  glyphSrc: "/mapa/glyphs/temperatura.svg",
  category: "macro",
  description: "El calor de la economía en la vida cotidiana. Salario real como termómetro del poder adquisitivo estructural.",
  unit: "índice de salario real (base 2015=100)",
  cadence: "anual",
  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Caída sostenida",        color: "#8A4A55", rangeDescription: "Salario real en caída continua" },
      { bucketIndex: 1, label: "Estancado",               color: "#C8993E", rangeDescription: "Sin variación real sostenida" },
      { bucketIndex: 2, label: "Recuperación moderada",   color: "#4A7A4A", rangeDescription: "Crecimiento real 1-3% anual" },
      { bucketIndex: 3, label: "Crecimiento sostenido",   color: "#2D6B4A", rangeDescription: "Crecimiento real > 3% anual" },
    ],
    noDataColor: "#C8B894",
  },
  source: {
    name: "OIT / CEPAL (datos sintéticos — Spec 43 implementa real)",
    url: "https://ilostat.ilo.org/topics/wages/",
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
      raw: [85, 97, 108, 118][bucket],
      formatted: FORMATTED[bucket],
      bucketIndex: bucket,
      delta: prevBucket !== undefined ? bucket - prevBucket : undefined,
      quality: "estimado",
    };
  },
  getLastPeriodBefore,
  readingGuideSlug: "temperatura",
};
