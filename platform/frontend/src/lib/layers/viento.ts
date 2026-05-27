// Spec 44 — Capa Viento: orientación pro-mercado / pro-estado
// Reemplaza el stub sintético de Spec 39.
// Indicador principal: rank entero -3..+3 del coding manual editorial (Spec 41).
// Cadencia: semanal. 4 buckets de magnitud. Glyph orientado sobre el mapa (mecánica V3).

import type { Layer, LayerPeriod, LayerValue, LayerChipFormat } from "../layers";
import {
  VIENTO_DATA,
  getLastVientoBeforeWeek,
  getAvailableWeeks,
  getEventsForCountry as getEventsHelper,
  getJustificativoForCountry as getJustificativoHelper,
} from "../viento";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Último día ISO (domingo) de la semana ISO dada. */
function isoWeekEndDate(year: number, week: number): string {
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Day = (jan4.getUTCDay() + 6) % 7; // 0 = lunes
  const mondayWeek1 = new Date(jan4.getTime() - jan4Day * 86400000);
  const sunday = new Date(mondayWeek1.getTime() + ((week - 1) * 7 + 6) * 86400000);
  return sunday.toISOString().slice(0, 10);
}

export function magnitudBucket(rank: number): number {
  return Math.abs(rank); // 0, 1, 2, 3
}

export function direction(rank: number): "pro-estado" | "neutro" | "pro-mercado" {
  if (rank > 0) return "pro-mercado";
  if (rank < 0) return "pro-estado";
  return "neutro";
}

export function formatViento(rank: number): string {
  const sign = rank > 0 ? "+" : rank < 0 ? "−" : "";
  return `${sign}${Math.abs(rank)} ${direction(rank)}`;
}

// ── Construcción de períodos ──────────────────────────────────────────────────

function buildPeriods(): LayerPeriod[] {
  const weeks = getAvailableWeeks();
  if (weeks.length === 0) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const week = 1;
    return [{
      key: `${year}-W${String(week).padStart(2, "0")}`,
      date: isoWeekEndDate(year, week),
      label: `Sem ${week} · ${year}`,
    }];
  }
  return weeks.map(w => ({
    key: `${w.year}-W${String(w.week).padStart(2, "0")}`,
    date: isoWeekEndDate(w.year, w.week),
    label: `Sem ${w.week} · ${w.year}`,
  }));
}

// ── Textos editoriales piloto (solo AR en r1) ─────────────────────────────────

const EDITORIAL: Record<string, string> = {
  ar: "Argentina lleva dos semanas consecutivas con orientación pro-mercado (W18 rank +3, W19 rank +1). El ciclo actual combina un ancla institucional fuerte (acuerdo FMI, superávit primario) con calma normativa entre semanas. La magnitud del movimiento bajó de W18 a W19 — el gobierno no introdujo medidas nuevas de desregulación pero la orientación dominante se mantiene. Lectura cruzada: el viento pro-mercado convive con restricciones cambiarias parciales aún vigentes — la coherencia del régimen es alta en los ejes macro/fiscal, más débil en el eje regulatorio cotidiano.",
};

// ── Layer ─────────────────────────────────────────────────────────────────────

const PERIODS = buildPeriods();

export const vientoLayer: Layer = {
  id: "viento",
  label: "Viento · orientación pro-mercado / pro-estado",
  shortLabel: "Viento",
  glyphSrc: "/mapa/glyphs/viento.svg",
  category: "editorial",
  description: "Dirección y velocidad del cambio político-económico en la semana. Coding editorial manual: rank −3 (pro-estado) a +3 (pro-mercado). El color codifica la magnitud; el glyph orientado sobre el país codifica la dirección.",
  unit: "rank −3 (pro-estado) a +3 (pro-mercado)",
  cadence: "semanal",

  legend: {
    type: "continuous",
    buckets: [
      { bucketIndex: 0, label: "Neutro",   color: "var(--mi-viento-0)", rangeDescription: "|rank| = 0 · sin movimiento direccional" },
      { bucketIndex: 1, label: "leve",     color: "var(--mi-viento-1)", rangeDescription: "|rank| = 1" },
      { bucketIndex: 2, label: "moderado", color: "var(--mi-viento-2)", rangeDescription: "|rank| = 2" },
      { bucketIndex: 3, label: "fuerte",   color: "var(--mi-viento-3)", rangeDescription: "|rank| = 3" },
    ],
    noDataColor: "var(--mi-viento-nodata, #5C6638)",
    qualityFlagColor: "var(--mi-viento-stale, #C8B894)",
  },

  source: {
    name: "Coding editorial Mapa Inestable (Spec 41) — viento-v1.0.0",
    url: "/mapa/capas/viento",
    publishedDate: VIENTO_DATA.computed_at,
    lastFetched: VIENTO_DATA.computed_at,
  },

  periods: PERIODS,
  defaultPeriod: PERIODS[PERIODS.length - 1],

  getValueForCountry(countrySlug, period): LayerValue | null {
    const match = period.key.match(/^(\d{4})-W(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const week = Number(match[2]);
    const entry = getLastVientoBeforeWeek(countrySlug, year, week);
    if (!entry) return null;
    return {
      raw: entry.rank,
      formatted: formatViento(entry.rank),
      bucketIndex: magnitudBucket(entry.rank),
      delta: undefined,
      quality: "oficial",
      intensidad: entry.intensidad,
    };
  },

  getLastPeriodBefore(date): LayerPeriod | null {
    const sorted = [...PERIODS].sort((a, b) => b.date.localeCompare(a.date));
    return sorted.find(p => p.date <= date) ?? null;
  },

  readingGuideSlug: "viento",

  editorialByCountry: EDITORIAL,

  getEventsForCountry(slug, period) {
    return getEventsHelper(slug, period.key);
  },

  getJustificativoForCountry(slug, period) {
    return getJustificativoHelper(slug, period.key);
  },

  legendMicrocopy: "El color codifica magnitud · el glyph sobre cada país codifica dirección (pro-mercado ↔ pro-estado).",
  shortIntro: "El viento político sopla hacia el mercado o hacia el estado: hacia la derecha indica orientación pro-mercado, hacia la izquierda pro-estado, dashes neutros sin orientación dominante. El color codifica la magnitud del cambio semanal — cuán fuerte sopla — no su dirección.",

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formatCrossLayerChip(_value: LayerValue): LayerChipFormat {
    return { shortChipLabel: "Vient.", tone: "neutral", useOrientedGlyph: true };
  },
};
