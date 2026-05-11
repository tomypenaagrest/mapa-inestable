import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// Dev: lee directamente del vault de Obsidian (cambios reflejados de inmediato).
// Prod (Vercel): lee de src/content/, que el script prebuild popula antes del build.
export const VAULT_ROOT =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "src", "content")
    : path.join(process.cwd(), "..", "..");

function safeMatter(raw: string): { data: Record<string, unknown>; content: string } {
  try {
    return matter(raw) as { data: Record<string, unknown>; content: string };
  } catch {
    // Frontmatter contains invalid YAML (e.g. Obsidian [[links]]) — strip it and treat as plain content
    const stripped = raw.replace(/^---[\s\S]*?---\n/, "");
    return { data: {}, content: stripped };
  }
}

const SLUG_TO_COUNTRY: Record<string, string> = {
  ar: "Argentina",
  br: "Brasil",
  cl: "Chile",
  co: "Colombia",
  bo: "Bolivia",
  pe: "Perú",
  uy: "Uruguay",
  py: "Paraguay",
  ec: "Ecuador",
  ve: "Venezuela",
};

const SKIP_SECTIONS = new Set([
  "Fuentes de referencia",
  "Ver también",
  "Fuentes",
]);

export interface CountrySection {
  heading: string;
  html: string;
}

function cleanObsidianLinks(text: string): string {
  return text
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, (_, ref) => ref.split("/").pop()?.replace(/^\d+\s*-\s*/, "") ?? ref);
}

function sectionHtml(markdown: string): string {
  return marked.parse(cleanObsidianLinks(markdown)) as string;
}

export function getCountrySections(slug: string): CountrySection[] | null {
  const name = SLUG_TO_COUNTRY[slug];
  if (!name) return null;

  const filePath = path.join(VAULT_ROOT, "15-Países", `${name}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = safeMatter(raw);

  const sections: CountrySection[] = [];
  const parts = content.split(/\n(?=## )/);

  for (const part of parts) {
    const m = part.match(/^## (.+)\n/);
    if (!m) continue;
    const heading = m[1].trim();
    if (SKIP_SECTIONS.has(heading)) continue;
    const body = part.replace(/^## .+\n/, "");
    sections.push({ heading, html: sectionHtml(body) });
  }

  return sections;
}

export function findSection(sections: CountrySection[], keywords: string[]): CountrySection | undefined {
  return sections.find(s => keywords.some(k => s.heading.toLowerCase().includes(k.toLowerCase())));
}

export function otherSections(sections: CountrySection[], skipKeywords: string[]): CountrySection[] {
  return sections.filter(s => !skipKeywords.some(k => s.heading.toLowerCase().includes(k.toLowerCase())));
}

/* === ENSAYOS ==================================================== */

const DRAFTS_DIR = path.join(VAULT_ROOT, "60-Borradores");
const SKIP_FILES = new Set(["Borradores - MOC.md", "Plantilla de borrador.md"]);

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractTitle(content: string, fallback: string): string {
  const m = content.match(/^# (.+)$/m);
  return m ? m[1] : fallback;
}

function extractLede(content: string): string {
  const m = content.match(/^\*([^*\n]+)\*/m);
  return m ? m[1] : "";
}

export interface EssayMeta {
  slug: string;
  title: string;
  lede: string;
  filename: string;
}

export interface Essay extends EssayMeta {
  html: string;
}

export function getAllEssays(): EssayMeta[] {
  if (!fs.existsSync(DRAFTS_DIR)) return [];

  const files = fs
    .readdirSync(DRAFTS_DIR)
    .filter(f => f.endsWith(".md") && !SKIP_FILES.has(f));

  return files
    .map(filename => {
      const raw = fs.readFileSync(path.join(DRAFTS_DIR, filename), "utf-8");
      const { content } = safeMatter(raw);
      return {
        slug: slugify(filename.replace(".md", "")),
        title: extractTitle(content, filename.replace(".md", "")),
        lede: extractLede(content),
        filename,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "es"));
}

export function getEssayBySlug(slug: string): Essay | null {
  if (!fs.existsSync(DRAFTS_DIR)) return null;

  const files = fs
    .readdirSync(DRAFTS_DIR)
    .filter(f => f.endsWith(".md") && !SKIP_FILES.has(f));

  for (const filename of files) {
    if (slugify(filename.replace(".md", "")) !== slug) continue;

    const raw = fs.readFileSync(path.join(DRAFTS_DIR, filename), "utf-8");
    const { content } = safeMatter(raw);
    const clean = cleanObsidianLinks(content);

    return {
      slug,
      title: extractTitle(clean, filename.replace(".md", "")),
      lede: extractLede(clean),
      filename,
      html: marked.parse(clean) as string,
    };
  }

  return null;
}

/* ========================================================================== */
/* === Borradores del agente diario =========================================  */
/* ========================================================================== */
/* Los .md producidos por el scheduled task `mapa-inestable-borrador-diario`   */
/* viven en `60-Borradores/diario/`. Cada archivo abre con frontmatter YAML    */
/* estructurado (país, eje, lede, disparador). El filename se mantiene legible */
/* en el vault pero el sitio lee todo desde el frontmatter.                    */

const AGENT_DAILY_DIR = path.join(VAULT_ROOT, "60-Borradores", "diario");

export interface AgentDraftMeta {
  /** slug compuesto: <countrySlug>/<slug-pieza> — único por archivo */
  slug:         string;
  /** Sólo la parte de pieza, sin país */
  pieceSlug:    string;
  countrySlug:  string;
  country:      string;
  title:        string;
  lede:         string;
  date:         string;     // YYYY-MM-DD
  ejePrincipal: string;
  ejes:         string[];
  disparador?:  { url: string; medio?: string; titulo?: string; fecha_publicacion?: string };
  filename:     string;
}

export interface AgentDraft extends AgentDraftMeta {
  html: string;
}

function fmDate(val: unknown): string {
  if (val instanceof Date) {
    return [
      val.getUTCFullYear(),
      String(val.getUTCMonth() + 1).padStart(2, "0"),
      String(val.getUTCDate()).padStart(2, "0"),
    ].join("-");
  }
  return String(val ?? "");
}

/** Lista todos los borradores del agente, más recientes primero. */
export function getAllAgentDrafts(): AgentDraftMeta[] {
  if (!fs.existsSync(AGENT_DAILY_DIR)) return [];

  const files = fs
    .readdirSync(AGENT_DAILY_DIR)
    .filter(f => f.endsWith(".md"));

  const out: (AgentDraftMeta | null)[] = [];
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(AGENT_DAILY_DIR, filename), "utf-8");
    const { data } = safeMatter(raw);

    const required = ["country", "country_slug", "title", "slug", "fecha", "eje_principal", "lede"] as const;
    const missing = required.filter(k => !data[k]);
    if (missing.length > 0) {
      console.warn(`[agent-drafts] Skipping ${filename}: missing frontmatter: ${missing.join(", ")}`);
      out.push(null);
      continue;
    }

    const countrySlug = String(data.country_slug);
    const pieceSlug   = String(data.slug);
    const dis = data.disparador as Record<string, unknown> | undefined;

    out.push({
      slug:         `${countrySlug}/${pieceSlug}`,
      pieceSlug,
      countrySlug,
      country:      String(data.country),
      title:        String(data.title),
      lede:         String(data.lede),
      date:         fmDate(data.fecha),
      ejePrincipal: String(data.eje_principal),
      ejes:         Array.isArray(data.ejes) ? (data.ejes as string[]) : [String(data.eje_principal)],
      disparador:   dis?.url ? {
        url:               String(dis.url),
        medio:             dis.medio             ? String(dis.medio)             : undefined,
        titulo:            dis.titulo            ? String(dis.titulo)            : undefined,
        fecha_publicacion: dis.fecha_publicacion ? fmDate(dis.fecha_publicacion) : undefined,
      } : undefined,
      filename,
    });
  }

  return (out.filter(Boolean) as AgentDraftMeta[]).sort((a, b) => b.date.localeCompare(a.date));
}

/** Borradores del agente para un país específico, más recientes primero. */
export function getAgentDraftsByCountry(countrySlug: string): AgentDraftMeta[] {
  return getAllAgentDrafts().filter(d => d.countrySlug === countrySlug);
}

/** Carga el detalle de un borrador. Devuelve null si no existe. */
export function getAgentDraft(countrySlug: string, pieceSlug: string): AgentDraft | null {
  const meta = getAllAgentDrafts().find(d => d.countrySlug === countrySlug && d.pieceSlug === pieceSlug);
  if (!meta) return null;
  const raw = fs.readFileSync(path.join(AGENT_DAILY_DIR, meta.filename), "utf-8");
  const { content } = safeMatter(raw);
  const clean = cleanObsidianLinks(content);
  return {
    ...meta,
    html: marked.parse(clean) as string,
  };
}

/* ========================================================================== */
/* === Publicaciones del vault (50-Publicaciones/) ===========================  */
/* ========================================================================== */

const PUBLICATIONS_DIR = path.join(VAULT_ROOT, "50-Publicaciones");

const PUBLICATIONS_SKIP = new Set([
  "Publicaciones - MOC.md",
]);

const COUNTRY_NAME_TO_SLUG: Record<string, string> = {
  argentina: "ar",
  brasil:    "br",
  chile:     "cl",
  colombia:  "co",
  bolivia:   "bo",
  peru:      "pe",
  perú:      "pe",
  uruguay:   "uy",
  paraguay:  "py",
  ecuador:   "ec",
  venezuela: "ve",
};

function obsidianEjeToAxisKey(link: string): string {
  const n = link.trim();
  if (n.startsWith("01")) return "deculturacion";
  if (n.startsWith("02")) return "mediaciones";
  if (n.startsWith("03")) return "desrepresentacion";
  if (n.startsWith("04")) return "estetizacion";
  if (n.startsWith("05")) return "desorientacion";
  if (n.startsWith("06")) return "atencion";
  return "";
}

function parseObsidianEjes(raw: string): string[] {
  const match = raw.match(/^ejes:\s*(.+)$/m);
  if (!match) return [];
  const links = [...match[1].matchAll(/\[\[([^\]]+)\]\]/g)];
  return links.map(m => obsidianEjeToAxisKey(m[1])).filter(Boolean);
}

function sanitizeForPubMatter(raw: string): string {
  return raw
    .replace(/^ejes:.*$/m, "ejes: []")
    .replace(/^parte-de:.*$/m, 'parte-de: ""')
    .replace(/\[\[([^\]]*)\]\]/g, (_, inner) => JSON.stringify(inner));
}

function parsePublicationMatter(raw: string): { data: Record<string, unknown>; content: string; ejes: string[] } {
  const ejes = parseObsidianEjes(raw);
  const sanitized = sanitizeForPubMatter(raw);
  try {
    const { data, content } = matter(sanitized) as { data: Record<string, unknown>; content: string };
    return { data, content, ejes };
  } catch {
    const content = raw.replace(/^---[\s\S]*?---\n/, "");
    return { data: {}, content, ejes };
  }
}

function inferCountrySlug(pais: unknown, title: string): string | undefined {
  if (pais && typeof pais === "string") {
    const norm = pais.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    return COUNTRY_NAME_TO_SLUG[norm];
  }
  const titleNorm = title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const [name, slug] of Object.entries(COUNTRY_NAME_TO_SLUG)) {
    const re = new RegExp(`\\b${name}\\b`);
    if (re.test(titleNorm)) return slug;
  }
  return undefined;
}

function pubWeek(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00Z");
  const jan4 = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const startW1 = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86400000);
  return Math.max(1, Math.floor((d.getTime() - startW1.getTime()) / (7 * 86400000)) + 1);
}

function pubFormatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
}

export interface PublicationMeta {
  slug:         string;
  filename:     string;
  title:        string;
  subtitle?:    string;
  tipo:         "publicacion" | "despacho";
  estado:       string;
  fecha:        string;       // YYYY-MM-DD
  year:         number;
  week:         number;
  published_at: string;       // "1 jun 2025"
  url?:         string;
  ejes:         string[];     // axisKey[]
  ejePrincipal: string;
  countrySlug?: string;
  country?:     string;
}

export interface Publication extends PublicationMeta {
  html:   string;
  thesis: string;
}

export function getAllPublications(): PublicationMeta[] {
  if (!fs.existsSync(PUBLICATIONS_DIR)) return [];

  const files = fs
    .readdirSync(PUBLICATIONS_DIR)
    .filter(f => f.endsWith(".md") && !PUBLICATIONS_SKIP.has(f));

  const out: (PublicationMeta | null)[] = [];

  for (const filename of files) {
    try {
      const raw = fs.readFileSync(path.join(PUBLICATIONS_DIR, filename), "utf-8");
      const { data, content, ejes } = parsePublicationMatter(raw);

      if (data.tipo === "nota-disparador") continue;

      const tipo: "publicacion" | "despacho" = data.tipo === "despacho" ? "despacho" : "publicacion";
      const fecha = fmDate(data.fecha);
      if (!fecha || fecha === "undefined") {
        console.warn(`[publications] Skipping ${filename}: missing or invalid fecha`);
        continue;
      }

      const title = extractTitle(cleanObsidianLinks(content), filename.replace(".md", ""));
      const countrySlug = inferCountrySlug(data["país"] ?? data["pais"], title);

      out.push({
        slug:         slugify(filename.replace(".md", "")),
        filename,
        title,
        subtitle:     data["subtítulo"] ? String(data["subtítulo"]) : undefined,
        tipo,
        estado:       String(data.estado ?? "publicada"),
        fecha,
        year:         parseInt(fecha.slice(0, 4), 10),
        week:         pubWeek(fecha),
        published_at: pubFormatDate(fecha),
        url:          data.url ? String(data.url) : undefined,
        ejes,
        ejePrincipal: ejes[0] ?? "",
        countrySlug,
        country:      countrySlug ? SLUG_TO_COUNTRY[countrySlug] : undefined,
      });
    } catch (e) {
      console.warn(`[publications] Error parsing ${filename}:`, e);
    }
  }

  return (out.filter(Boolean) as PublicationMeta[]).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function getPublicationBySlug(slug: string): Publication | null {
  if (!fs.existsSync(PUBLICATIONS_DIR)) return null;

  const files = fs
    .readdirSync(PUBLICATIONS_DIR)
    .filter(f => f.endsWith(".md") && !PUBLICATIONS_SKIP.has(f));

  for (const filename of files) {
    if (slugify(filename.replace(".md", "")) !== slug) continue;

    try {
      const raw = fs.readFileSync(path.join(PUBLICATIONS_DIR, filename), "utf-8");
      const { data, content, ejes } = parsePublicationMatter(raw);

      if (data.tipo === "nota-disparador") return null;

      const tipo: "publicacion" | "despacho" = data.tipo === "despacho" ? "despacho" : "publicacion";
      const fecha = fmDate(data.fecha);
      if (!fecha || fecha === "undefined") return null;

      const clean = cleanObsidianLinks(content);
      const title = extractTitle(clean, filename.replace(".md", ""));
      const countrySlug = inferCountrySlug(data["país"] ?? data["pais"], title);

      const thesisMatch = clean.match(/## Tesis principal\n+([\s\S]*?)(?=\n## |\s*$)/);
      const thesis = thesisMatch ? thesisMatch[1].trim() : "";

      return {
        slug,
        filename,
        title,
        subtitle:     data["subtítulo"] ? String(data["subtítulo"]) : undefined,
        tipo,
        estado:       String(data.estado ?? "publicada"),
        fecha,
        year:         parseInt(fecha.slice(0, 4), 10),
        week:         pubWeek(fecha),
        published_at: pubFormatDate(fecha),
        url:          data.url ? String(data.url) : undefined,
        ejes,
        ejePrincipal: ejes[0] ?? "",
        countrySlug,
        country:      countrySlug ? SLUG_TO_COUNTRY[countrySlug] : undefined,
        html:         marked.parse(clean) as string,
        thesis,
      };
    } catch (e) {
      console.warn(`[publications] Error parsing ${filename}:`, e);
      return null;
    }
  }

  return null;
}

export function getPublicationsByCountry(countrySlug: string): PublicationMeta[] {
  return getAllPublications().filter(p => p.countrySlug === countrySlug);
}
