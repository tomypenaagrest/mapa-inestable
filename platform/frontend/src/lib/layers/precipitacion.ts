// Spec 42 — Capa Precipitación: crecimiento económico
// Implementación real. Reemplaza el stub de Spec 39.

import type { Layer, LayerPeriod, LayerValue, LayerSubIndicator, LayerQuality } from "../layers";
import type { MacroCountryData, MacroDataPoint } from "../macro-indicators";
import { getIndicator, getByCountry } from "../macro-indicators";

const PRINCIPAL = "a2-crecimiento-pbi";
const SUBINDICADORES = [
  { slug: "a6-inflacion-ipc",        label: "Inflación",     unit: "%",      invertGood: true  },
  { slug: "a5-inversion-pbi",        label: "Inversión",     unit: "% PBI",  invertGood: false },
  { slug: "b6-deuda-pbi",            label: "Deuda",         unit: "% PBI",  invertGood: true  },
  { slug: "a4-productividad-laboral", label: "Productividad", unit: "índice", invertGood: false },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function quarterEndDate(year: number, quarter: number): string {
  const monthEnd = [3, 6, 9, 12][quarter - 1];
  const lastDay = new Date(year, monthEnd, 0).getDate();
  return `${year}-${String(monthEnd).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

export function magnitudBucket(pbi: number): number {
  const abs = Math.abs(pbi);
  if (abs <= 0.5) return 0;
  if (abs <= 1.5) return 1;
  if (abs <= 3)   return 2;
  if (abs <= 6)   return 3;
  return 4;
}

export function direction(pbi: number): "crecimiento" | "recesion" | "neutro" {
  if (Math.abs(pbi) <= 0.5) return "neutro";
  return pbi >= 0 ? "crecimiento" : "recesion";
}

export function formatPbi(value: number): string {
  const dir = direction(value);
  const sign = value >= 0 ? "+" : "";
  const pct = `${sign}${value.toFixed(1)}%`;
  if (dir === "neutro") return `${pct} sin cambio`;
  return `${pct} ${dir}`;
}

function findDatapointByPeriod(country: MacroCountryData, period: LayerPeriod): MacroDataPoint | null {
  if (period.key.includes("-Q")) {
    const [yearStr, qStr] = period.key.split("-Q");
    const year = Number(yearStr);
    const quarter = Number(qStr);
    const dp = country.series_trimestral?.find(d => d.year === year && d.quarter === quarter);
    return dp ? { year: dp.year, value: dp.value, quality: dp.quality } : null;
  }
  const year = Number(period.key);
  return country.series.find(d => d.year === year) ?? null;
}

function deltaVsPrev(country: MacroCountryData, period: LayerPeriod): number | undefined {
  if (period.key.includes("-Q")) return undefined;
  const year = Number(period.key);
  const curr = country.series.find(d => d.year === year);
  const prev = country.series.find(d => d.year === year - 1);
  if (!curr || !prev) return undefined;
  return Math.round((curr.value - prev.value) * 10) / 10;
}

// ── Construcción de períodos ──────────────────────────────────────────────────

function buildPeriods(): LayerPeriod[] {
  const principal = getIndicator(PRINCIPAL);
  const countries = Object.values(principal.by_country);
  if (countries.length === 0) return [];

  const hasTrimestral = countries.some(c => c.series_trimestral && c.series_trimestral.length > 0);
  if (hasTrimestral) {
    const base = countries.find(c => c.series_trimestral && c.series_trimestral.length > 0)!;
    return base.series_trimestral!.map(dp => ({
      key: `${dp.year}-Q${dp.quarter}`,
      date: quarterEndDate(dp.year, dp.quarter),
      label: `Q${dp.quarter} ${dp.year}`,
    }));
  }

  // Fallback anual — usar el primer país (todos tienen las mismas series de años)
  return countries[0].series.map(dp => ({
    key: String(dp.year),
    date: `${dp.year}-12-31`,
    label: String(dp.year),
  }));
}

// ── Subindicadores ────────────────────────────────────────────────────────────

function makeSubIndicator(
  slug: string,
  label: string,
  unit: string,
  invertGood: boolean,
): LayerSubIndicator {
  return {
    slug,
    label,
    unit,
    invertGood,
    getValueForCountry(countrySlug, period) {
      const country = getByCountry(slug, countrySlug);
      if (!country) return null;
      // Subindicadores son siempre anuales
      const year = Number(period.key.slice(0, 4));
      const dp = country.series.find(d => d.year === year);
      if (!dp) return null;
      return {
        raw: dp.value,
        formatted: `${dp.value.toFixed(1)}${unit.startsWith("%") ? "%" : ""}`,
        bucketIndex: 0,
        quality: dp.quality,
      };
    },
    getSeries(countrySlug) {
      const country = getByCountry(slug, countrySlug);
      if (!country) return [];
      return country.series.slice(-8).map(dp => ({
        key: String(dp.year),
        value: dp.value,
        quality: dp.quality as LayerQuality,
      }));
    },
  };
}

// ── Textos editoriales piloto (AR, BR, CL) ───────────────────────────────────

const EDITORIAL: Record<string, string> = {
  ar: "Argentina 2024: −1.3% — el tercer año consecutivo de contracción o estancamiento. El ciclo 2022–2024 muestra el patrón clásico argentino: un boom de +6% seguido de ajuste brusco. La inflación estructural (subindicador) se mueve en dirección contraria al PBI, presionando la capacidad de consumo. La deuda/PBI sigue alta. Leer los subindicadores como sistema: cuando la inversión cae con la inflación disparada, el rebote posterior es frágil.",
  br: "Brasil 2024: +3.4% — tercer año consecutivo de crecimiento estable en la banda 3–3.5%. La consistencia es el rasgo distintivo: sin boom ni colapso. La inflación bajó desde el pico pos-pandemia y la inversión/PBI se mantiene moderada. El subindicador de productividad laboral muestra una mejora gradual. Brasil funciona como el ancla de estabilidad macroeconómica de la región en la serie 2022–2024.",
  cl: "Chile 2024: +2.6% — recuperación tras el frenazo de 2023 (+0.5%). El ciclo post-pandemia chileno tuvo un boom en 2021 (+11.7%) seguido de consolidación. La magnitud modesta del crecimiento reciente oculta una economía que ajustó sin caer en recesión. La inflación cedió. La deuda/PBI se mantuvo contenida. Chile valida el bucket 'moderado' de la escala: un PBI de +2.6% con estos subindicadores es una señal de estabilidad, no de dinamismo.",
};

// ── Layer ─────────────────────────────────────────────────────────────────────

const PERIODS = buildPeriods();

export const precipitacionLayer: Layer = {
  id: "precipitacion",
  label: "Precipitación · crecimiento económico",
  shortLabel: "Precipitación",
  glyphSrc: "/mapa/glyphs/precipitacion.svg",
  category: "macro",
  description: "Estado del crecimiento económico. Lluvia abundante = crecimiento sostenido; sequía = estancamiento o recesión.",
  unit: "% variación anual del PBI",
  cadence: "trimestral",
  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "sin cambio",  color: "var(--mi-precipitacion-0)", rangeDescription: "|PBI| ≤ 0.5%" },
      { bucketIndex: 1, label: "leve",        color: "var(--mi-precipitacion-1)", rangeDescription: "0.5% < |PBI| ≤ 1.5%" },
      { bucketIndex: 2, label: "moderado",    color: "var(--mi-precipitacion-2)", rangeDescription: "1.5% < |PBI| ≤ 3%" },
      { bucketIndex: 3, label: "fuerte",      color: "var(--mi-precipitacion-3)", rangeDescription: "3% < |PBI| ≤ 6%" },
      { bucketIndex: 4, label: "extremo",     color: "var(--mi-precipitacion-4)", rangeDescription: "|PBI| > 6%" },
    ],
    noDataColor: "var(--mi-precipitacion-nodata, #5C6638)",
    qualityFlagColor: "var(--mi-precipitacion-stale, #C8B894)",
  },
  source: {
    name: "Banco Mundial (NY.GDP.MKTP.KD.ZG) — pipeline macro-v1.1.0",
    url: "https://data.worldbank.org/indicator/NY.GDP.MKTP.KD.ZG",
    publishedDate: "2026-05-19",
    lastFetched: "2026-05-19",
  },
  periods: PERIODS,
  defaultPeriod: PERIODS[PERIODS.length - 1],

  getValueForCountry(countrySlug, period) {
    const country = getByCountry(PRINCIPAL, countrySlug);
    if (!country) return null;
    const dp = findDatapointByPeriod(country, period);
    if (!dp) return null;
    return {
      raw: dp.value,
      formatted: formatPbi(dp.value),
      bucketIndex: magnitudBucket(dp.value),
      delta: deltaVsPrev(country, period),
      quality: dp.quality,
    };
  },

  getLastPeriodBefore(date) {
    const sorted = [...PERIODS].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(p => p.date <= date) ?? null;
  },

  readingGuideSlug: "precipitacion",

  subIndicators: SUBINDICADORES.map(s =>
    makeSubIndicator(s.slug, s.label, s.unit, s.invertGood)
  ),

  editorialByCountry: EDITORIAL,

  legendMicrocopy: "El color codifica magnitud · la dirección crecimiento/recesión aparece en el tooltip y en la sección Dirección.",
  shortIntro: "El crecimiento del PBI es la precipitación: lluvia abundante corresponde a expansión, sequía a recesión. La metáfora describe el sistema sin asignarle valor moral. El color codifica solo la magnitud del cambio — no distingue si llueve o si hay sequía. Esa distinción aparece en el tooltip y en el drawer.",
};
