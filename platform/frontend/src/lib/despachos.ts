import { getAllPublications, getPublicationBySlug, type PublicationMeta } from "./content";

// ============================================================
// Tipos
// ============================================================

export interface DispatchMeta {
  slug:          string;
  filename:      string;
  /** Número ordinal en la serie, derivado del orden cronológico si el
   *  frontmatter no tiene campo `despacho:`. */
  number:        number;
  week:          number;
  year:          number;
  title:         string;
  subtitle?:     string;
  ejesActivados: string[];
  fecha:         string;      // YYYY-MM-DD
  published_at:  string;      // "9 jun 2025"
  url?:          string;
}

export interface Dispatch extends DispatchMeta {
  html: string;
}

// ============================================================
// Helpers
// ============================================================

function pubToMeta(pub: PublicationMeta, number: number): DispatchMeta {
  return {
    slug:          pub.slug,
    filename:      pub.filename,
    number,
    week:          pub.week,
    year:          pub.year,
    title:         pub.title,
    subtitle:      pub.subtitle,
    ejesActivados: pub.ejes,
    fecha:         pub.fecha,
    published_at:  pub.published_at,
    url:           pub.url,
  };
}

// ============================================================
// Funciones públicas
// ============================================================

/**
 * Lista todos los despachos del vault, ordenados descendente por número
 * (más reciente primero). Los números se asignan cronológicamente (el
 * despacho más antiguo = 1).
 *
 * NOTA SEMÁNTICA: el vault distingue dos tipos en el frontmatter
 * `tipo: despacho` (integración semanal de varios temas) y
 * `tipo: publicación` (análisis individual de fondo). En el sitio
 * ambos aparecen unificados en /despachos. La distinción se preserva
 * en el frontmatter para uso interno del vault de Obsidian y para
 * eventual diferenciación visual futura. Las `nota-disparador` quedan
 * excluidas porque no se publicaron de forma autónoma.
 */
export function getAllDispatches(): DispatchMeta[] {
  const pubs = getAllPublications()
    .filter(p => p.tipo === "despacho" || p.tipo === "publicacion")
    .sort((a, b) => a.fecha.localeCompare(b.fecha)); // asc para numeración

  return pubs
    .map((p, i) => pubToMeta(p, i + 1))
    .reverse(); // desc para listado
}

/** Busca un despacho por año ISO y semana ISO. Null si no existe. */
export function getDispatchBySemana(year: number, week: number): Dispatch | null {
  const meta = getAllDispatches().find(d => d.year === year && d.week === week);
  if (!meta) return null;

  const pub = getPublicationBySlug(meta.slug);
  if (!pub) return null;

  return { ...meta, html: pub.html };
}

/** El despacho más reciente del vault, o null si no hay ninguno. */
export function getLatestDispatch(): DispatchMeta | null {
  const all = getAllDispatches();
  return all.length > 0 ? all[0] : null;
}
