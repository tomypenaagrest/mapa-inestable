import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

// Dev: lee directamente del vault de Obsidian (cambios reflejados de inmediato).
// Prod (Vercel): lee de src/content/, que el script prebuild popula antes del build.
const VAULT_ROOT =
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
/* viven en `60-Borradores/diario/`. El filename sigue el patrón:              */
/*   `<País> - <Título de la pieza> - YYYY-MM-DD.md`                           */
/*                                                                            */
/* Estos archivos son borradores: no están publicados en Substack ni se les    */
/* aplica el formato 4-pasos rígido. La página los muestra como tales con      */
/* banner "BORRADOR — generado por agente diario" y robots:noindex.            */

const AGENT_DAILY_DIR = path.join(VAULT_ROOT, "60-Borradores", "diario");

/** Mapeo país (filename) → countrySlug. */
const COUNTRY_TO_SLUG: Record<string, string> = {
  "Argentina":  "ar",
  "Bolivia":    "bo",
  "Brasil":     "br",
  "Chile":      "cl",
  "Colombia":   "co",
  "Ecuador":    "ec",
  "Paraguay":   "py",
  "Perú":       "pe",
  "Peru":       "pe",
  "Uruguay":    "uy",
  "Venezuela":  "ve",
};

export interface AgentDraftMeta {
  /** slug compuesto: <countrySlug>/<slug-pieza> — único por archivo */
  slug:        string;
  /** Sólo la parte de pieza, sin país */
  pieceSlug:   string;
  countrySlug: string;
  country:     string;
  title:       string;
  lede:        string;
  date:        string;     // YYYY-MM-DD
  filename:    string;
}

export interface AgentDraft extends AgentDraftMeta {
  html: string;
}

const AGENT_FILENAME_RE = /^(.+?) - (.+?) - (\d{4}-\d{2}-\d{2})\.md$/;

function parseAgentFilename(filename: string): {
  country: string;
  countrySlug: string;
  title: string;
  date: string;
} | null {
  const m = filename.match(AGENT_FILENAME_RE);
  if (!m) return null;
  const [, countryRaw, title, date] = m;
  const country = countryRaw.trim();
  const countrySlug = COUNTRY_TO_SLUG[country];
  if (!countrySlug) return null;
  return { country, countrySlug, title: title.trim(), date };
}

/** Lista todos los borradores del agente, más recientes primero. */
export function getAllAgentDrafts(): AgentDraftMeta[] {
  if (!fs.existsSync(AGENT_DAILY_DIR)) return [];

  const files = fs
    .readdirSync(AGENT_DAILY_DIR)
    .filter(f => f.endsWith(".md"));

  const out: AgentDraftMeta[] = [];
  for (const filename of files) {
    const parsed = parseAgentFilename(filename);
    if (!parsed) continue;
    const raw = fs.readFileSync(path.join(AGENT_DAILY_DIR, filename), "utf-8");
    const { content } = safeMatter(raw);
    const lede = extractLede(content);
    const pieceSlug = slugify(parsed.title);
    out.push({
      slug:        `${parsed.countrySlug}/${pieceSlug}`,
      pieceSlug,
      countrySlug: parsed.countrySlug,
      country:     parsed.country,
      title:       parsed.title,
      lede,
      date:        parsed.date,
      filename,
    });
  }

  // Más recientes primero
  out.sort((a, b) => b.date.localeCompare(a.date));
  return out;
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
