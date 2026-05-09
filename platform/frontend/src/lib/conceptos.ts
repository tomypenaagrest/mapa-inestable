import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const VAULT_ROOT =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "src", "content")
    : path.join(process.cwd(), "..", "..");

const CONCEPTOS_DIR = path.join(VAULT_ROOT, "35-Conceptos-clave");
const AUTORES_DIR = path.join(VAULT_ROOT, "30-Autores");
const SKIP_CONCEPTOS = new Set(["Conceptos clave - MOC.md"]);

const EJE_NUM_TO_SLUG: Record<string, string> = {
  "01": "deculturacion",
  "02": "erosion-de-mediaciones",
  "03": "desrepresentacion",
  "04": "estetizacion",
  "05": "desorientacion-epistemologica",
  "06": "atencion",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function safeMatter(raw: string) {
  try {
    return matter(raw);
  } catch {
    const stripped = raw.replace(/^---[\s\S]*?---\n/, "");
    return { data: {} as Record<string, unknown>, content: stripped };
  }
}

function getPublishedAutorSlugs(): Set<string> {
  const slugs = new Set<string>();
  if (!fs.existsSync(AUTORES_DIR)) return slugs;
  for (const file of fs.readdirSync(AUTORES_DIR)) {
    if (!file.endsWith(".md") || file === "Autores - MOC.md") continue;
    try {
      const { data } = safeMatter(fs.readFileSync(path.join(AUTORES_DIR, file), "utf-8"));
      if (data.publicar === true) {
        slugs.add(
          typeof data.slug === "string" ? data.slug : slugify(file.replace(".md", ""))
        );
      }
    } catch { /* skip */ }
  }
  return slugs;
}

function resolveWikilinks(text: string, publishedAutorSlugs: Set<string>): string {
  return text.replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
    const pipeIdx = inner.indexOf("|");
    const ref = pipeIdx >= 0 ? inner.slice(0, pipeIdx) : inner;
    const display = pipeIdx >= 0 ? inner.slice(pipeIdx + 1) : null;
    const lastPart = ref.split("/").pop() || ref;
    const displayText = display || lastPart.replace(/^\d{2}\s*-\s*/, "");

    if (ref.includes("10-Ejes")) {
      const m = lastPart.match(/^(\d{2})/);
      if (m && EJE_NUM_TO_SLUG[m[1]]) {
        return `[${displayText}](/ejes/${EJE_NUM_TO_SLUG[m[1]]})`;
      }
    }

    if (ref.includes("30-Autores")) {
      const autorSlug = slugify(lastPart);
      if (publishedAutorSlugs.has(autorSlug)) {
        return `[${displayText}](/autor/${autorSlug})`;
      }
      return displayText;
    }

    return displayText;
  });
}

function sectionHtml(markdown: string, publishedAutorSlugs: Set<string>): string {
  return marked.parse(resolveWikilinks(markdown, publishedAutorSlugs)) as string;
}

function extractTitle(content: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}

function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = content.split(/\n(?=## )/);

  sections["__intro__"] = (parts[0] || "").trim().replace(/^#\s+.+\n?/, "").trim();

  for (const part of parts.slice(1)) {
    const firstNewline = part.indexOf("\n");
    if (firstNewline < 0) {
      sections[part.replace(/^##\s+/, "").trim().toLowerCase()] = "";
    } else {
      const heading = part.slice(0, firstNewline).replace(/^##\s+/, "").trim().toLowerCase();
      const body = part.slice(firstNewline + 1).trim();
      sections[heading] = body;
    }
  }

  return sections;
}

function extractDefinicion(introBody: string): string {
  const lines = introBody.split("\n");
  const bqLines: string[] = [];
  let inBq = false;
  for (const line of lines) {
    if (line.startsWith("> ")) {
      inBq = true;
      bqLines.push(line);
    } else if (inBq) {
      break;
    }
  }
  return bqLines.length > 0 ? bqLines.join("\n") : introBody.split("\n\n")[0] || "";
}

function extractDefinicionPlain(introBody: string): string {
  return extractDefinicion(introBody)
    .replace(/^>\s*/gm, "")
    .trim();
}

function extractEjesFromFrontmatter(ejesRelacionados: unknown[]): string[] {
  const slugs: string[] = [];
  for (const item of ejesRelacionados) {
    if (typeof item !== "string") continue;
    const m = item.match(/\[\[(\d{2})\s*-/);
    if (m && EJE_NUM_TO_SLUG[m[1]]) {
      const slug = EJE_NUM_TO_SLUG[m[1]];
      if (!slugs.includes(slug)) slugs.push(slug);
    }
  }
  return slugs;
}

export interface ConceptoMeta {
  slug: string;
  name: string;
  definicion: string;
  autores: string[];
  autorSlugs: string[];
  autorPrincipalSlug: string | null;
  obra: string;
  ano: number | null;
  ejesRelacionados: string[];
}

export interface Concepto extends ConceptoMeta {
  definicionHtml: string;
  argumentoHtml: string;
  citaHtml: string;
  aplicabilidadHtml: string;
  fuenteHtml: string;
  web_intro: string | null;
}

function parseConceptoFile(
  filename: string,
  publishedAutorSlugs: Set<string>
): Concepto | null {
  const filePath = path.join(CONCEPTOS_DIR, filename);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = safeMatter(raw);

  if (data.publicar !== true) return null;

  const slug =
    typeof data.slug === "string" ? data.slug : slugify(filename.replace(".md", ""));
  const autoresList: string[] = Array.isArray(data.autores)
    ? (data.autores as string[])
    : [];
  const autorSlugs = autoresList.map(slugify);
  const autorPrincipalSlug =
    autorSlugs[0] && publishedAutorSlugs.has(autorSlugs[0]) ? autorSlugs[0] : null;

  const ejesRelacionados = Array.isArray(data.ejes_relacionados)
    ? extractEjesFromFrontmatter(data.ejes_relacionados as unknown[])
    : [];

  const sections = extractSections(content);

  return {
    slug,
    name: extractTitle(content),
    definicion: extractDefinicionPlain(sections["__intro__"] ?? ""),
    autores: autoresList,
    autorSlugs,
    autorPrincipalSlug,
    obra: typeof data.obra === "string" ? data.obra : "",
    ano: typeof data.ano === "number" ? data.ano : null,
    ejesRelacionados,
    definicionHtml: sectionHtml(
      extractDefinicion(sections["__intro__"] ?? ""),
      publishedAutorSlugs
    ),
    argumentoHtml: sectionHtml(sections["argumento"] ?? "", publishedAutorSlugs),
    citaHtml: sectionHtml(sections["cita"] ?? "", publishedAutorSlugs),
    aplicabilidadHtml: sectionHtml(
      sections["aplicabilidad sudamericana"] ?? "",
      publishedAutorSlugs
    ),
    fuenteHtml: sectionHtml(sections["fuente"] ?? "", publishedAutorSlugs),
    web_intro: typeof data.web_intro === "string" ? data.web_intro : null,
  };
}

let _cache: Concepto[] | null = null;

export function getAllConceptos(): Concepto[] {
  if (_cache) return _cache;
  if (!fs.existsSync(CONCEPTOS_DIR)) return [];

  const publishedAutorSlugs = getPublishedAutorSlugs();
  const results: Concepto[] = [];

  for (const file of fs.readdirSync(CONCEPTOS_DIR)) {
    if (!file.endsWith(".md") || SKIP_CONCEPTOS.has(file)) continue;
    const concepto = parseConceptoFile(file, publishedAutorSlugs);
    if (concepto) results.push(concepto);
  }

  _cache = results.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return _cache;
}

export function getConceptoBySlug(slug: string): Concepto | null {
  return getAllConceptos().find((c) => c.slug === slug) ?? null;
}

export function getConceptosByEje(ejeSlug: string): ConceptoMeta[] {
  return getAllConceptos().filter((c) => c.ejesRelacionados.includes(ejeSlug));
}

export function getConceptosByAutor(autorSlug: string): ConceptoMeta[] {
  return getAllConceptos().filter((c) => c.autorSlugs.includes(autorSlug));
}
