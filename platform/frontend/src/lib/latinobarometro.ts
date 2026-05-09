import raw from "@/data/latinobarometro-2024/indicators.json";

/* === TIPOS ======================================================= */

export interface IndicatorCountryData {
  name: string;
  value: number;
  n: number;
  rank: number;
}

export interface Indicator {
  id: string;
  label: string;
  axis: string;
  section_pdf: string;
  page_pdf: number;
  questionnaire_var: string;
  question_text: string;
  compute: string;
  unit: string;
  regional_value: number;
  regional_n: number;
  by_country: Record<string, IndicatorCountryData>;
}

/* === METADATA ==================================================== */

export const LB_META = {
  version: raw.version,
  computed_at: raw.computed_at,
  wave_year: 2024,
  wave_label: "Latinobarómetro 2024",
  citation:
    "Corporación Latinobarómetro (2024). Informe Latinobarómetro 2024: La democracia resiliente. Santiago de Chile.",
  codebook_url: "https://www.latinobarometro.org/latContents.jsp",
  n_total: raw.n_total,
  fieldwork: "2024",
} as const;

/* === DATOS ======================================================= */

export const INDICATORS: Indicator[] = raw.indicators as Indicator[];

/* Los 10 países cubiertos por Mapa Inestable (slugs en minúsculas) */
export const COVERED_COUNTRIES = [
  "ar", "bo", "br", "cl", "co", "ec", "py", "pe", "uy", "ve",
] as const;

/* Mapeo entre el axis_key del JSON y el axisKey del sistema de ejes */
export const AXIS_KEY_MAP: Record<string, string> = {
  "desrepresentacion":             "desrepresentacion",
  "erosion-mediaciones":           "mediaciones",
  "desorientacion-epistemologica": "desorientacion",
  "deculturacion":                 "deculturacion",
  "atencion":                      "atencion",
  "contexto":                      "contexto",
};

/* === FUNCIONES =================================================== */

export function getIndicatorsByAxis(axisKey: string): Indicator[] {
  return INDICATORS.filter(ind => AXIS_KEY_MAP[ind.axis] === axisKey);
}

export function getCountryData(
  indicator: Indicator,
  countrySlug: string
): IndicatorCountryData | null {
  return indicator.by_country[countrySlug.toUpperCase()] ?? null;
}

export function getCountryIndicators(
  countrySlug: string
): Array<Indicator & { country: IndicatorCountryData }> {
  const slug = countrySlug.toUpperCase();
  return INDICATORS.flatMap(ind => {
    const country = ind.by_country[slug];
    return country ? [{ ...ind, country }] : [];
  });
}

export function formatValue(indicator: Indicator, value: number): string {
  if (indicator.unit === "%") return `${value.toFixed(1)}%`;
  if (indicator.unit === "escala 0-10") return value.toFixed(2);
  return String(value);
}

export function axisDisplayKey(rawAxis: string): string {
  return AXIS_KEY_MAP[rawAxis] ?? rawAxis;
}
