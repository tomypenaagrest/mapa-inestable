import raw from "@/data/indicators-macro/indicators-macro.json";

/* === TIPOS ======================================================= */

export type Quality = "oficial" | "estimado" | "congelado";

export interface MacroDataPoint {
  year: number;
  value: number;
  quality: Quality;
}

/** Spec 40 — datapoint trimestral (series_trimestral opcional). */
export interface MacroTrimestralDataPoint {
  year: number;
  quarter: number;
  value: number;
  quality: Quality;
}

/** Spec 40 — datapoint mensual (series_mensual opcional). */
export interface MacroMensualDataPoint {
  year: number;
  month: number;
  value: number;
  quality: Quality;
}

export interface MacroCountryData {
  name: string;
  series: MacroDataPoint[];
  /** Spec 40 — opcional, solo en indicadores con cadencia trimestral. */
  series_trimestral?: MacroTrimestralDataPoint[];
  /** Spec 40 — opcional, solo en indicadores con cadencia mensual. */
  series_mensual?: MacroMensualDataPoint[];
  latest?: MacroDataPoint;
  notes?: string;
}

export interface MacroSource {
  name: string;
  code: string;
  url: string;
  pulled_at: string;
}

export interface MacroIndicator {
  id: string;
  label: string;
  family: "riqueza" | "comercio" | "empleo" | "sociales";
  family_label: string;
  axis_primary: string | null;
  axis_secondary: string[];
  unit: string;
  source: MacroSource;
  methodology: string;
  n_countries_covered: number;
  by_country: Record<string, MacroCountryData>;
  /** Opcional: agrupa sub-indicadores (A3 sectorial) */
  group?: string;
  group_label?: string;
}

/* === METADATA ==================================================== */

export const MACRO_META = {
  version:        raw.version,
  computed_at:    raw.computed_at,
  year_start:     raw.year_start,
  year_end:       raw.year_end,
  stubs:          raw.stubs as string[],
  // Spec 40 — campos opcionales (presentes a partir de macro-v1.1.0)
  quarter_start:  (raw as any).quarter_start as number | undefined,
  quarter_end:    (raw as any).quarter_end as number | undefined,
  month_start:    (raw as any).month_start as number | undefined,
  month_end:      (raw as any).month_end as number | undefined,
  priority_stubs: (raw as any).priority_stubs as string[] | undefined,
};

/* === DATOS ======================================================= */

export const MACRO_INDICATORS: MacroIndicator[] =
  raw.indicators as MacroIndicator[];

export const MACRO_FAMILIES = [
  { key: "riqueza",  label: "Generación de riqueza e industrias" },
  { key: "comercio", label: "Vínculos de comercio exterior" },
  { key: "empleo",   label: "Empleo y estructura del trabajo" },
  { key: "sociales", label: "Índices sociales" },
] as const;

/* === FUNCIONES =================================================== */

export function getMacroByFamily(
  family: MacroIndicator["family"]
): MacroIndicator[] {
  return MACRO_INDICATORS.filter(i => i.family === family);
}

export function getCountryMacro(
  countrySlug: string
): Array<MacroIndicator & { country: MacroCountryData }> {
  const iso2 = countrySlug.toUpperCase();
  return MACRO_INDICATORS.flatMap(ind => {
    const country = ind.by_country[iso2];
    if (!country || !country.series.length) return [];
    return [{ ...ind, country }];
  });
}

/** Delta entre el último valor y el valor de hace N años (positivo = subió). */
export function delta(series: MacroDataPoint[], yearsBack = 5): number | null {
  if (!series.length) return null;
  const latest = series[series.length - 1];
  const targetYear = latest.year - yearsBack;
  const ref = series.find(p => p.year === targetYear)
    ?? series.find(p => p.year <= targetYear);
  if (!ref) return null;
  return round2(latest.value - ref.value);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Formatea un valor con la unidad del indicador. */
export function formatMacroValue(ind: MacroIndicator, value: number): string {
  const dec = ind.unit === "USD" ? 0 : 1;
  const formatted = value.toLocaleString("es-AR", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
  switch (ind.unit) {
    case "USD":      return `USD ${formatted}`;
    case "%":        return `${formatted}%`;
    case "pp":       return `${formatted} pp`;
    case "por mil":  return `${formatted}‰`;
    case "por 100k": return `${formatted}`;
    default:         return formatted;
  }
}

/** Devuelve true si el indicador tiene datos para el país. */
export function hasData(ind: MacroIndicator, iso2: string): boolean {
  return (ind.by_country[iso2]?.series?.length ?? 0) > 0;
}

/** Devuelve un indicador por su id (lanza si no existe). */
export function getIndicator(id: string): MacroIndicator {
  const ind = MACRO_INDICATORS.find(i => i.id === id);
  if (!ind) throw new Error(`Indicador no encontrado: ${id}`);
  return ind;
}

/** Devuelve los datos de un país para un indicador dado (slug en minúsculas → ISO2 mayúsculas). */
export function getByCountry(indicatorId: string, countrySlug: string): MacroCountryData | null {
  const ind = getIndicator(indicatorId);
  const iso2 = countrySlug.toUpperCase();
  return ind.by_country[iso2] ?? null;
}
