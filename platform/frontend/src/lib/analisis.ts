export type FootnoteType = "autor" | "concepto" | "fuente" | "estadistica" | "analisis";

export interface Footnote {
  id: string;
  type: FootnoteType;
  stepKey: "step_disparador" | "step_desplazamiento" | "step_conceptualizacion" | "step_apertura";
  paraIndex?: number;     // 0-indexed within the step, defaults to 0
  // Autor
  nombre?: string;
  obra?: string;
  year?: number;
  slug?: string;
  // Concepto
  definicion?: string;
  acunadoPor?: string;
  conceptoSlug?: string;
  // Fuente
  url?: string;
  medio?: string;
  fecha?: string;
  autorNota?: string;
  // Estadistica
  indicador?: string;
  valor?: string;
  fuenteNombre?: string;
  indicadorSlug?: string;
  // Analisis previo
  titulo?: string;
  semana?: number;
  countrySlugRef?: string;
  analisisSlug?: string;
}

export const FOOTNOTE_SYMBOLS: Record<FootnoteType, string | null> = {
  autor:       null,   // sequential superscript number
  concepto:    null,   // sequential superscript number
  fuente:      "›",
  estadistica: "■",
  analisis:    "⌖",
};

export function computeFootnoteMarks(footnotes: Footnote[]): Map<string, string> {
  const marks = new Map<string, string>();
  const sup = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  let seq = 0;
  for (const fn of footnotes) {
    const symbol = FOOTNOTE_SYMBOLS[fn.type];
    if (symbol === null) {
      seq++;
      marks.set(fn.id, String(seq).split("").map(d => sup[+d]).join(""));
    } else {
      marks.set(fn.id, symbol);
    }
  }
  return marks;
}

export interface AnalisisEntry {
  slug: string;
  countrySlug: string;
  country: string;
  axisSlug: string;
  axisKey: string;
  axisName: string;
  title: string;
  lede: string;
  published_at: string;
  published_iso: string;
  year: number;
  week: number;
  step_disparador: string;
  step_desplazamiento: string;
  step_conceptualizacion: string;
  step_apertura: string;
  footnotes?: Footnote[];
  substackUrl?: string;
  tipo?: "publicacion" | "despacho" | "analisis";
}

export const PAISES_LIST = [
  { slug: "ar", name: "Argentina" },
  { slug: "br", name: "Brasil" },
  { slug: "cl", name: "Chile" },
  { slug: "co", name: "Colombia" },
  { slug: "bo", name: "Bolivia" },
  { slug: "pe", name: "Perú" },
  { slug: "uy", name: "Uruguay" },
  { slug: "py", name: "Paraguay" },
  { slug: "ec", name: "Ecuador" },
  { slug: "ve", name: "Venezuela" },
] as const;

// El sitio ya no incluye análisis fixture/inventados. Los análisis reales del proyecto
// se producen mediante el agente automatizado `mapa-inestable-borrador-diario` (scheduled
// task de Cowork) y quedan en el vault en `60-Borradores/diario/` hasta que pasan al
// flujo de producción. Cuando un análisis se publique en Substack, se carga acá con sus
// datos reales (URL, fecha, ledes, pasos del método).
export const ANALISIS_ALL: AnalisisEntry[] = [];

/* === SORT (desc por fecha) ====================================== */
ANALISIS_ALL.sort((a, b) => b.published_iso.localeCompare(a.published_iso));

/* === TIPOS COMPARTIDOS ========================================== */

export interface AnalysisSummary {
  slug:         string;
  title:        string;
  axis:         string;
  axisKey:      string;
  date:         string;
  week:         number;
  year:         number;
  substackUrl?: string;
  tipo?:        "publicacion" | "despacho" | "analisis";
}

export function getAnalysesByCountry(slug: string): AnalysisSummary[] {
  return ANALISIS_ALL
    .filter(a => a.countrySlug === slug)
    .map(a => ({
      slug:    a.slug,
      title:   a.title,
      axis:    a.axisName,
      axisKey: a.axisKey,
      date:    a.published_at,
      week:    a.week,
      year:    a.year,
    }));
}

/* === UTILIDADES ================================================= */

function searchMatches(a: AnalisisEntry, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    a.title.toLowerCase().includes(lower) ||
    a.lede.toLowerCase().includes(lower) ||
    a.step_disparador.toLowerCase().includes(lower) ||
    a.step_desplazamiento.toLowerCase().includes(lower) ||
    a.step_conceptualizacion.toLowerCase().includes(lower) ||
    a.step_apertura.toLowerCase().includes(lower)
  );
}

function countBy(arr: AnalisisEntry[], key: (a: AnalisisEntry) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const a of arr) {
    const k = key(a);
    result[k] = (result[k] ?? 0) + 1;
  }
  return result;
}

export interface AnalisisFacets {
  countryFacets: Record<string, number>;
  ejeFacets: Record<string, number>;
  yearFacets: Record<number, number>;
  allYears: number[];
}

export function filterAndFacet(
  all: AnalisisEntry[],
  q: string,
  selectedCountries: string[],
  selectedEjes: string[],
  selectedYears: number[],
): { results: AnalisisEntry[] } & AnalisisFacets {
  const afterText = q.trim() ? all.filter(a => searchMatches(a, q.trim())) : all;

  // Facet counts exclude each dimension's own filter (proper faceted search)
  const forCountry = afterText.filter(a =>
    (selectedEjes.length === 0    || selectedEjes.includes(a.axisSlug)) &&
    (selectedYears.length === 0   || selectedYears.includes(a.year))
  );
  const forEje = afterText.filter(a =>
    (selectedCountries.length === 0 || selectedCountries.includes(a.countrySlug)) &&
    (selectedYears.length === 0     || selectedYears.includes(a.year))
  );
  const forYear = afterText.filter(a =>
    (selectedCountries.length === 0 || selectedCountries.includes(a.countrySlug)) &&
    (selectedEjes.length === 0      || selectedEjes.includes(a.axisSlug))
  );

  const countryFacets = countBy(forCountry, a => a.countrySlug);
  const ejeFacets     = countBy(forEje,     a => a.axisSlug);

  const allYears = [...new Set(all.map(a => a.year))].sort((a, b) => b - a);
  const yearFacets: Record<number, number> = {};
  for (const a of forYear) yearFacets[a.year] = (yearFacets[a.year] ?? 0) + 1;

  const results = afterText.filter(a =>
    (selectedCountries.length === 0 || selectedCountries.includes(a.countrySlug)) &&
    (selectedEjes.length === 0      || selectedEjes.includes(a.axisSlug)) &&
    (selectedYears.length === 0     || selectedYears.includes(a.year))
  );

  return { results, countryFacets, ejeFacets, yearFacets, allYears };
}
