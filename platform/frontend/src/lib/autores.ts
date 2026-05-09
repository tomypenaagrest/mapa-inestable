import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const VAULT_ROOT =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "src", "content")
    : path.join(process.cwd(), "..", "..");

const AUTORES_DIR = path.join(VAULT_ROOT, "30-Autores");
const SKIP_FILES = new Set(["Autores - MOC.md"]);

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

function resolveWikilinks(text: string): string {
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

    return displayText;
  });
}

function sectionHtml(markdown: string): string {
  return marked.parse(resolveWikilinks(markdown)) as string;
}

function safeMatter(raw: string) {
  try {
    return matter(raw);
  } catch {
    const stripped = raw.replace(/^---[\s\S]*?---\n/, "");
    return { data: {} as Record<string, unknown>, content: stripped };
  }
}

function extractTitle(content: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "";
}

function extractSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};
  const parts = content.split(/\n(?=## )/);

  const introRaw = (parts[0] || "").trim();
  sections["__intro__"] = introRaw.replace(/^#\s+.+\n?/, "").trim();

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

function extractDescripcion(introBody: string): string {
  const para = introBody.split(/\n\n/)[0]?.trim() || "";
  return para
    .replace(/\[\[([^\]]+)\]\]/g, (_, inner) => {
      const pipeIdx = inner.indexOf("|");
      return pipeIdx >= 0
        ? inner.slice(pipeIdx + 1)
        : (inner.split("/").pop()?.replace(/^\d{2}\s*-\s*/, "") ?? inner);
    })
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

function extractEjesSlugs(conexionesText: string): string[] {
  const slugs: string[] = [];
  const pattern = /\[\[([^\]]*10-Ejes[^\]]*)\]\]/g;
  let m;
  while ((m = pattern.exec(conexionesText)) !== null) {
    const lastPart = (m[1].split("/").pop() || "").trim();
    const numMatch = lastPart.match(/^(\d{2})/);
    if (numMatch && EJE_NUM_TO_SLUG[numMatch[1]]) {
      const slug = EJE_NUM_TO_SLUG[numMatch[1]];
      if (!slugs.includes(slug)) slugs.push(slug);
    }
  }
  return slugs;
}

export interface AutorMeta {
  slug: string;
  name: string;
  descripcion: string;
  nacionalidad: string;
  disciplina: string;
  ejes: string[];
}

export interface Autor extends AutorMeta {
  obraClaveHtml: string;
  tesisCentralesHtml: string | null;
  citasHtml: string | null;
  porQueImportaHtml: string | null;
  web_intro: string | null;
  web_image: string | null;
}

function parseAutorFile(filename: string): Autor | null {
  const filePath = path.join(AUTORES_DIR, filename);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = safeMatter(raw);

  if (data.publicar !== true) return null;

  const slug =
    typeof data.slug === "string" ? data.slug : slugify(filename.replace(".md", ""));
  const sections = extractSections(content);

  const obraKey =
    Object.keys(sections).find((k) => k.startsWith("obra clave")) ?? "";
  const obraClaveRaw = sections[obraKey] || "";

  const tesisCentralesRaw = sections["tesis centrales relevantes"] ?? null;
  const hasTesis =
    tesisCentralesRaw !== null && !tesisCentralesRaw.startsWith("*Pendiente");

  const citasRaw = sections["citas registradas"] ?? null;
  const hasCitas =
    citasRaw !== null &&
    citasRaw.trim().length > 0 &&
    !citasRaw.startsWith("— pendiente");

  const porQueImportaRaw =
    sections["por qué importa para mapa inestable"] ?? null;

  const conexionesText = sections["conexiones con ejes"] ?? "";
  const ejes = extractEjesSlugs(conexionesText);

  return {
    slug,
    name: extractTitle(content),
    descripcion: extractDescripcion(sections["__intro__"] ?? ""),
    nacionalidad: typeof data.nacionalidad === "string" ? data.nacionalidad : "",
    disciplina: typeof data.disciplina === "string" ? data.disciplina : "",
    obraClaveHtml: sectionHtml(obraClaveRaw),
    tesisCentralesHtml: hasTesis ? sectionHtml(tesisCentralesRaw!) : null,
    citasHtml: hasCitas ? sectionHtml(citasRaw!) : null,
    porQueImportaHtml: porQueImportaRaw ? sectionHtml(porQueImportaRaw) : null,
    ejes,
    web_intro: typeof data.web_intro === "string" ? data.web_intro : null,
    web_image: typeof data.web_image === "string" ? data.web_image : null,
  };
}

let _cache: Autor[] | null = null;

export function getAllAutores(): Autor[] {
  if (_cache) return _cache;
  if (!fs.existsSync(AUTORES_DIR)) return [];

  const results: Autor[] = [];
  for (const file of fs.readdirSync(AUTORES_DIR)) {
    if (!file.endsWith(".md") || SKIP_FILES.has(file)) continue;
    const autor = parseAutorFile(file);
    if (autor) results.push(autor);
  }

  _cache = results.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return _cache;
}

export function getAutorBySlug(slug: string): Autor | null {
  return getAllAutores().find((a) => a.slug === slug) ?? null;
}

export function getAutoresByEje(ejeSlug: string): AutorMeta[] {
  return getAllAutores().filter((a) => a.ejes.includes(ejeSlug));
}
