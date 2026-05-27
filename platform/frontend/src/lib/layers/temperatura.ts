// Spec 43 — Capa Temperatura: salario real como termómetro del poder adquisitivo
// Reemplaza el stub sintético de Spec 39.

import type { Layer, LayerPeriod, LayerValue, LayerSubIndicator, LayerQuality, LayerChipFormat } from "../layers";
import { getIndicator, getByCountry } from "../macro-indicators";

const PRINCIPAL = "c7-salario-real-mensual";
const SUBINDICADORES = [
  { slug: "c1-desempleo",      label: "Desempleo",      unit: "%",       invertGood: true  },
  { slug: "c2-informalidad",   label: "Informalidad",   unit: "%",       invertGood: true  },
  { slug: "d3-gini",           label: "Desigualdad",    unit: "Gini",    invertGood: true  },
  { slug: "a1-pbi-pc-ppp",     label: "PBI per cápita", unit: "USD PPP", invertGood: false },
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function quarterEndDate(year: number, quarter: number): string {
  const monthEnd = [3, 6, 9, 12][quarter - 1];
  const lastDay = new Date(year, monthEnd, 0).getDate();
  return `${year}-${String(monthEnd).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

export function magnitudBucket(deltaPct: number): number {
  const abs = Math.abs(deltaPct);
  if (abs <= 0.5) return 0;
  if (abs <= 1.5) return 1;
  if (abs <= 3)   return 2;
  if (abs <= 6)   return 3;
  return 4;
}

export function direction(deltaPct: number): "mejora" | "caida" | "estancado" {
  if (Math.abs(deltaPct) <= 0.5) return "estancado";
  return deltaPct >= 0 ? "mejora" : "caida";
}

export function formatTemperatura(deltaPct: number): string {
  const dir = direction(deltaPct);
  const sign = deltaPct >= 0 ? "+" : "";
  const pct = `${sign}${deltaPct.toFixed(1)}%`;
  if (dir === "estancado") return `${pct} estancado`;
  return `${pct} ${dir}`;
}

function worstQuality(qs: LayerQuality[]): LayerQuality {
  if (qs.includes("congelado")) return "congelado";
  if (qs.includes("estimado"))  return "estimado";
  return "oficial";
}

/** Agrega serie mensual a trimestral por promedio simple de los 3 meses del trimestre.
 *  Trimestres con <2 meses de dato se descartan (base estadística débil). */
export function aggregateMensualToTrimestral(
  mensual: Array<{ year: number; month: number; value: number; quality: LayerQuality }>
): Array<{ year: number; quarter: number; value: number; quality: LayerQuality }> {
  const map = new Map<string, { year: number; quarter: number; values: number[]; qualities: LayerQuality[] }>();
  for (const dp of mensual) {
    const quarter = Math.ceil(dp.month / 3);
    const key = `${dp.year}-Q${quarter}`;
    const slot = map.get(key) ?? { year: dp.year, quarter, values: [], qualities: [] };
    slot.values.push(dp.value);
    slot.qualities.push(dp.quality);
    map.set(key, slot);
  }
  return [...map.values()]
    .filter(s => s.values.length >= 2)
    .map(s => ({
      year: s.year,
      quarter: s.quarter,
      value: s.values.reduce((a, b) => a + b, 0) / s.values.length,
      quality: worstQuality(s.qualities),
    }));
}

/** Variación interanual (YoY): trimestre actual vs mismo trimestre del año anterior. */
export function variacionInteranual(
  trimestres: Array<{ year: number; quarter: number; value: number }>,
  year: number,
  quarter: number
): number | null {
  const curr = trimestres.find(t => t.year === year && t.quarter === quarter);
  const prev = trimestres.find(t => t.year === year - 1 && t.quarter === quarter);
  if (!curr || !prev || prev.value === 0) return null;
  return ((curr.value - prev.value) / prev.value) * 100;
}

// ── Construcción de períodos ──────────────────────────────────────────────────

function buildPeriods(): LayerPeriod[] {
  const principal = getIndicator(PRINCIPAL);
  const countriesWithMensual = Object.values(principal.by_country)
    .filter(c => c.series_mensual && c.series_mensual.length > 0);

  if (countriesWithMensual.length > 0) {
    const trimestres = aggregateMensualToTrimestral(
      countriesWithMensual[0].series_mensual! as Array<{ year: number; month: number; value: number; quality: LayerQuality }>
    );
    return trimestres.map(t => ({
      key: `${t.year}-Q${t.quarter}`,
      date: quarterEndDate(t.year, t.quarter),
      label: `Q${t.quarter} ${t.year}`,
    }));
  }

  // Fallback soft: pipeline no hidratado. Períodos anuales desde c1-desempleo (10/10).
  const fallbackInd = getIndicator(SUBINDICADORES[0].slug);
  const anyCountry = Object.values(fallbackInd.by_country)[0];
  return (anyCountry?.series ?? []).map(dp => ({
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
      const year = Number(period.key.slice(0, 4));
      const dp = country.series.find(d => d.year === year);
      if (!dp) return null;
      let formatted: string;
      if (unit === "Gini") {
        formatted = dp.value.toFixed(1);
      } else if (unit === "USD PPP") {
        formatted = `$${Math.round(dp.value).toLocaleString("es-AR")}`;
      } else {
        formatted = `${dp.value.toFixed(1)}%`;
      }
      return {
        raw: dp.value,
        formatted,
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
  ar: "<TEXTO CURADO — pendiente de redacción editorial cuando c7 esté hidratado. Estructura: fase actual del salario real, lectura cruzada con desempleo e informalidad, comentario sobre Gini argentino, comentario sobre PBI per cápita relativo a la región.>",
  br: "<TEXTO CURADO — Brasil suele mostrar estabilidad. Estructura: salario real con rumbo estable, baja informalidad relativa para la región, Gini alto históricamente, PBI per cápita medio. Tensión interpretativa: crecimiento sin redistribución.>",
  cl: "<TEXTO CURADO — Chile como ancla de estabilidad económica. Estructura: salario real recuperando post-pandemia, informalidad baja (21%), Gini medio-alto, PBI per cápita líder. Tensión interpretativa: estabilidad con desigualdad estructural.>",
};

// ── Layer ─────────────────────────────────────────────────────────────────────

const PERIODS = buildPeriods();

export const temperaturaLayer: Layer = {
  id: "temperatura",
  label: "Temperatura · salario real",
  shortLabel: "Temperatura",
  glyphSrc: "/mapa/glyphs/temperatura.svg",
  category: "macro",
  description: "El calor del poder adquisitivo. Salario real subiendo = clima cálido; cayendo = clima frío; estancado = sensación térmica que no se mueve.",
  unit: "% variación interanual del salario real (índice base 2021=100)",
  cadence: "trimestral",
  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Estancado", color: "var(--mi-temperatura-0)", rangeDescription: "|Δ%| ≤ 0.5%" },
      { bucketIndex: 1, label: "leve",      color: "var(--mi-temperatura-1)", rangeDescription: "0.5% < |Δ%| ≤ 1.5%" },
      { bucketIndex: 2, label: "moderado",  color: "var(--mi-temperatura-2)", rangeDescription: "1.5% < |Δ%| ≤ 3%" },
      { bucketIndex: 3, label: "fuerte",    color: "var(--mi-temperatura-3)", rangeDescription: "3% < |Δ%| ≤ 6%" },
      { bucketIndex: 4, label: "extremo",   color: "var(--mi-temperatura-4)", rangeDescription: "|Δ%| > 6%" },
    ],
    noDataColor: "var(--mi-temperatura-nodata, #5C6638)",
    qualityFlagColor: "var(--mi-temperatura-stale, #C8B894)",
  },
  source: {
    name: "OIT ILOSTAT (EAR_4MTH_SEX_ECO_CUR_NB_M) — pipeline macro-v1.1.0",
    url: "https://ilostat.ilo.org/topics/wages/",
    publishedDate: "2026-05-19",
    lastFetched: "2026-05-19",
  },
  periods: PERIODS,
  defaultPeriod: PERIODS[PERIODS.length - 1],

  getValueForCountry(countrySlug, period) {
    const country = getByCountry(PRINCIPAL, countrySlug);
    if (!country || !country.series_mensual || country.series_mensual.length === 0) return null;
    if (!period.key.includes("-Q")) return null;
    const [yearStr, qStr] = period.key.split("-Q");
    const year = Number(yearStr);
    const quarter = Number(qStr);
    const trimestres = aggregateMensualToTrimestral(
      country.series_mensual as Array<{ year: number; month: number; value: number; quality: LayerQuality }>
    );
    const variacion = variacionInteranual(trimestres, year, quarter);
    if (variacion === null) return null;
    const currT = trimestres.find(t => t.year === year && t.quarter === quarter);
    return {
      raw: variacion,
      formatted: formatTemperatura(variacion),
      bucketIndex: magnitudBucket(variacion),
      delta: undefined,
      quality: currT?.quality ?? "oficial",
    };
  },

  getLastPeriodBefore(date) {
    const sorted = [...PERIODS].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(p => p.date <= date) ?? null;
  },

  readingGuideSlug: "temperatura",

  subIndicators: SUBINDICADORES.map(s =>
    makeSubIndicator(s.slug, s.label, s.unit, s.invertGood)
  ),

  editorialByCountry: EDITORIAL,

  legendMicrocopy: "El color codifica magnitud · variación interanual del salario real.",
  shortIntro: "El salario real es el termómetro del poder adquisitivo: cuando sube, el bienestar material mejora; cuando baja, el poder de compra se erosiona. El color codifica solo la magnitud del cambio — no distingue si subió o bajó. La dirección aparece en el tooltip y en el drawer.",

  formatCrossLayerChip(value: LayerValue): LayerChipFormat {
    const dir = Math.abs(value.raw) <= 0.5 ? "estancado" : value.raw >= 0 ? "mejora" : "caida";
    const tone: LayerChipFormat["tone"] =
      dir === "mejora" && value.bucketIndex >= 2 ? "positive" :
      dir === "caida"  && value.bucketIndex >= 2 ? "negative" :
      "neutral";
    return { shortChipLabel: "Temp.", tone, useOrientedGlyph: false };
  },
};
