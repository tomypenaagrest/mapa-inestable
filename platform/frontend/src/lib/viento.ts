import VIENTO_DATA_RAW from "@/data/coding-viento/viento.json";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type VientoDireccion = "pro-estado" | "neutro" | "pro-mercado";

export interface VientoWeekEntry {
  year:          number;
  week:          number;
  rank:          number;          // entero -3..+3
  direccion:     VientoDireccion;
  intensidad?:   number;          // 0-1, opcional
  justificativo: string;
  eventos:       string[];
  codificador:   string;
  fecha_coding:  string;          // YYYY-MM-DD
}

export interface VientoCountryData {
  name:            string;
  series_semanal:  VientoWeekEntry[];
  latest?:         VientoWeekEntry;
}

export interface VientoWeekRef {
  year: number;
  week: number;
}

export interface VientoData {
  version:     string;
  computed_at: string;
  range: {
    start_week: VientoWeekRef;
    end_week:   VientoWeekRef;
  };
  by_country: Record<string, VientoCountryData>;
}

// ── Datos ─────────────────────────────────────────────────────────────────────

export const VIENTO_DATA = VIENTO_DATA_RAW as VientoData;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Devuelve los datos completos de un país, o null si no existe. */
export function getCountryViento(slug: string): VientoCountryData | null {
  return VIENTO_DATA.by_country[slug] ?? null;
}

/** Devuelve el último entry publicado de cada país como mapa slug → entry. */
export function getLatestByCountry(): Record<string, VientoWeekEntry> {
  const result: Record<string, VientoWeekEntry> = {};
  for (const [slug, country] of Object.entries(VIENTO_DATA.by_country)) {
    if (country.latest) result[slug] = country.latest;
  }
  return result;
}

/** Devuelve el entry de un país para una semana específica, o null. */
export function getVientoForWeek(
  slug: string,
  year: number,
  week: number,
): VientoWeekEntry | null {
  const country = VIENTO_DATA.by_country[slug];
  if (!country) return null;
  return country.series_semanal.find(e => e.year === year && e.week === week) ?? null;
}

/**
 * Devuelve el último entry publicado de un país antes o en la fecha dada.
 * Usado por la capa viento (Spec 44) para el modelo de tiempo "último disponible".
 */
export function getLastVientoBeforeWeek(
  slug: string,
  year: number,
  week: number,
): VientoWeekEntry | null {
  const country = VIENTO_DATA.by_country[slug];
  if (!country) return null;

  let best: VientoWeekEntry | null = null;
  for (const entry of country.series_semanal) {
    if (entry.year > year || (entry.year === year && entry.week > week)) break;
    best = entry;
  }
  return best;
}

/** Lista todas las semanas únicas que tienen al menos 1 país codificado. */
export function getAvailableWeeks(): VientoWeekRef[] {
  const seen = new Set<string>();
  const weeks: VientoWeekRef[] = [];

  for (const country of Object.values(VIENTO_DATA.by_country)) {
    for (const entry of country.series_semanal) {
      const key = `${entry.year}-${entry.week}`;
      if (!seen.has(key)) {
        seen.add(key);
        weeks.push({ year: entry.year, week: entry.week });
      }
    }
  }

  return weeks.sort((a, b) => a.year !== b.year ? a.year - b.year : a.week - b.week);
}
