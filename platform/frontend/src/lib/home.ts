import { getAllPublications, getAllAgentDrafts, type PublicationMeta, type AgentDraftMeta } from "./content";
import { getLatestDispatch, type DispatchMeta } from "./despachos";
import { EJES, AXIS_KEY_TO_SLUG, type AxisKey } from "./ejes";

// ============================================================
// Types
// ============================================================

export interface HomeWeekStrip {
  ejeKey:      AxisKey;
  ejeName:     string;
  ejeSlug:     string;
  activations: number;
  total:       number;
  week:        number;
  year:        number;
}

export interface HomeHeatmapCell {
  axisKey: string;
  week:    number;
  year:    number;
  count:   number;
}

export interface HomeWeekLabel {
  week:  number;
  year:  number;
  label: string;
}

export interface HomeWeeklyCountry {
  slug:       string;
  axisKey:    string;
  lastTitle?: string;
  lastSlug?:  string;
  lastAxis?:  string;
}

export interface HomeData {
  thisWeek:        HomeWeekStrip | null;
  cards:           PublicationMeta[];
  latestDrafts:    AgentDraftMeta[];
  heatmap:         HomeHeatmapCell[];
  heatmapWeeks:    HomeWeekLabel[];
  weeklyCountries: HomeWeeklyCountry[];
  latestDispatch:  DispatchMeta | null;
  currentWeek:     number;
  currentYear:     number;
}

// ============================================================
// ISO week helpers — misma lógica que pubWeek() en content.ts
// ============================================================

function isoWeekNum(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00Z");
  const jan4 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const startW1 = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86400000);
  return Math.max(1, Math.floor((d.getTime() - startW1.getTime()) / (7 * 86400000)) + 1);
}

function todayIsoStr(): string {
  const t = new Date();
  return [
    t.getFullYear(),
    String(t.getMonth() + 1).padStart(2, "0"),
    String(t.getDate()).padStart(2, "0"),
  ].join("-");
}

function prevWeek(week: number, year: number): { week: number; year: number } {
  if (week > 1) return { week: week - 1, year };
  // Dec 28 siempre cae en la última semana ISO del año anterior
  return { week: isoWeekNum(`${year - 1}-12-28`), year: year - 1 };
}

function last12Weeks(currentWeek: number, currentYear: number): HomeWeekLabel[] {
  const weeks: HomeWeekLabel[] = [];
  let w = currentWeek;
  let y = currentYear;
  for (let i = 0; i < 12; i++) {
    weeks.unshift({ week: w, year: y, label: `S${w}` });
    ({ week: w, year: y } = prevWeek(w, y));
  }
  return weeks;
}

// ============================================================
// Constantes
// ============================================================

const AXIS_ORDER: AxisKey[] = [
  "deculturacion", "mediaciones", "desrepresentacion",
  "estetizacion",  "desorientacion", "atencion",
];

// ============================================================
// getHomeData
// ============================================================

export function getHomeData(): HomeData {
  const today = todayIsoStr();
  const currentWeek = isoWeekNum(today);
  const currentYear = new Date().getFullYear();

  // Solo publicaciones (no despachos, no nota-disparador — filtrado ya en getAllPublications)
  const pubs = getAllPublications().filter(p => p.tipo === "publicacion");

  // ---- Cards: top 5 más recientes ----
  const cards = pubs.slice(0, 5);

  // ---- Borradores diarios: top 5 más recientes, sin promovidos ----
  const latestDrafts = getAllAgentDrafts()
    .filter(d => d.estado !== "promovido" && d.estado !== "publicado-en-sitio")
    .slice(0, 5);

  // ---- Strip "Esta semana" ----
  const thisWeekPubs = pubs.filter(p => p.week === currentWeek && p.year === currentYear);
  let thisWeek: HomeWeekStrip | null = null;

  if (thisWeekPubs.length > 0) {
    const counts = new Map<string, number>();
    for (const p of thisWeekPubs) {
      if (!p.ejePrincipal) continue;
      counts.set(p.ejePrincipal, (counts.get(p.ejePrincipal) ?? 0) + 1);
    }
    const maxCount = Math.max(...counts.values());
    // Desempate: primer eje en AXIS_ORDER con el count máximo
    const dominantKey = AXIS_ORDER.find(k => counts.get(k) === maxCount);
    if (dominantKey) {
      const eje = EJES.find(e => e.axisKey === dominantKey);
      if (eje) {
        thisWeek = {
          ejeKey:      dominantKey,
          ejeName:     eje.name,
          ejeSlug:     eje.slug,
          activations: counts.get(dominantKey) ?? 0,
          total:       thisWeekPubs.length,
          week:        currentWeek,
          year:        currentYear,
        };
      }
    }
  }

  // ---- Heatmap: 6 ejes × 12 semanas ----
  const heatmapWeeks = last12Weeks(currentWeek, currentYear);
  const heatmap: HomeHeatmapCell[] = [];
  for (const axisKey of AXIS_ORDER) {
    for (const w of heatmapWeeks) {
      const count = pubs.filter(
        p => p.ejePrincipal === axisKey && p.week === w.week && p.year === w.year
      ).length;
      if (count > 0) {
        heatmap.push({ axisKey, week: w.week, year: w.year, count });
      }
    }
  }

  // ---- Weekly countries: última publicación por país ----
  // pubs está ordenado desc por fecha, así que el primer match por país es el más reciente
  const byCountry = new Map<string, PublicationMeta>();
  for (const p of pubs) {
    if (!p.countrySlug) continue;
    if (!byCountry.has(p.countrySlug)) byCountry.set(p.countrySlug, p);
  }
  const weeklyCountries: HomeWeeklyCountry[] = [];
  for (const [slug, p] of byCountry.entries()) {
    const eje = EJES.find(e => e.axisKey === p.ejePrincipal);
    weeklyCountries.push({
      slug,
      axisKey:   p.ejePrincipal,
      lastTitle: p.title,
      lastSlug:  p.slug,
      lastAxis:  eje?.name,
    });
  }

  return {
    thisWeek,
    cards,
    latestDrafts,
    heatmap,
    heatmapWeeks,
    weeklyCountries,
    latestDispatch: getLatestDispatch(),
    currentWeek,
    currentYear,
  };
}
