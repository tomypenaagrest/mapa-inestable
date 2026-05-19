// Spec 39 — Stub de capa Viento (orientación político-económica)
// Datos sintéticos. Spec 44 reemplaza con implementación real.
// Escala diverging: negativo = pro-estado, positivo = pro-mercado, 0 = neutro

import type { Layer, LayerPeriod, LayerValue } from "../layers";

const SYNTHETIC: Record<string, Record<string, number>> = {
  ar: { "2021": -2, "2022": -2, "2023": -2, "2024": 1 },
  bo: { "2021": -2, "2022": -2, "2023": -1, "2024": -1 },
  br: { "2021": 1,  "2022": 1,  "2023": -1, "2024": -1 },
  cl: { "2021": 0,  "2022": -1, "2023": -1, "2024": 0 },
  co: { "2021": 0,  "2022": 1,  "2023": 1,  "2024": 1 },
  ec: { "2021": 0,  "2022": 0,  "2023": 2,  "2024": 2 },
  pe: { "2021": -1, "2022": 0,  "2023": 0,  "2024": 0 },
  py: { "2021": 1,  "2022": 1,  "2023": 1,  "2024": 1 },
  uy: { "2021": -1, "2022": -1, "2023": -1, "2024": 0 },
  ve: { "2021": -2, "2022": -2, "2023": -2, "2024": -2 },
};

const BUCKET_MAP: Record<number, { label: string; color: string; range: string }> = {
  [-2]: { label: "Muy pro-estado",   color: "#2D4A6B", range: "Orientación estatista fuerte" },
  [-1]: { label: "Pro-estado",       color: "#4A6B8A", range: "Orientación estatista moderada" },
  [0]:  { label: "Mixto",            color: "#C8B894", range: "Sin orientación dominante clara" },
  [1]:  { label: "Pro-mercado",      color: "#B47A4A", range: "Orientación pro-mercado moderada" },
  [2]:  { label: "Muy pro-mercado",  color: "#8A4A1A", range: "Orientación pro-mercado fuerte" },
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

export const vientoLayer: Layer = {
  id: "viento",
  label: "Viento · orientación político-económica",
  shortLabel: "Viento",
  glyphSrc: "/mapa/glyphs/viento.svg",
  category: "editorial",
  description: "Hacia dónde sopla el viento institucional. Orientación dominante del régimen político-económico en un eje pro-estado / pro-mercado.",
  unit: "escala −2 (pro-estado) a +2 (pro-mercado)",
  cadence: "anual",
  legend: {
    type: "diverging",
    buckets: Object.entries(BUCKET_MAP).map(([k, v]) => ({
      bucketIndex: Number(k),
      label: v.label,
      color: v.color,
      rangeDescription: v.range,
    })).sort((a, b) => a.bucketIndex - b.bucketIndex),
    noDataColor: "#C8B894",
  },
  source: {
    name: "Coding editorial Mapa Inestable (datos sintéticos — Spec 44 implementa real)",
    url: "https://mapainestable.substack.com",
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
      raw: bucket,
      formatted: BUCKET_MAP[bucket]?.label ?? String(bucket),
      bucketIndex: bucket,
      delta: prevBucket !== undefined ? bucket - prevBucket : undefined,
      quality: "estimado",
    };
  },
  getLastPeriodBefore,
  readingGuideSlug: "viento",
};
