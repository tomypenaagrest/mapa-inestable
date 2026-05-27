// Spec 55 §2 — Sistema "Aparece en" build-time.
// Escanea 50-Publicaciones/ buscando wikilinks que referencian conceptos o autores.
// Clave del índice: slug slugificado del último segmento del wikilink.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { VAULT_ROOT } from "./content";

export interface AparenceRef {
  title: string;
  href: string;
  fecha: string;
}

const PUBLICATIONS_SKIP = new Set(["Publicaciones - MOC.md"]);

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
  return m ? m[1].trim() : fallback;
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

// Índice en memoria: slug → [AparenceRef]
// Se construye una sola vez por proceso (SSG), luego se reutiliza.
let _index: Map<string, AparenceRef[]> | null = null;

function buildIndex(): Map<string, AparenceRef[]> {
  if (_index) return _index;
  _index = new Map<string, AparenceRef[]>();

  const PUBLICATIONS_DIR = path.join(VAULT_ROOT, "50-Publicaciones");
  if (!fs.existsSync(PUBLICATIONS_DIR)) return _index;

  const files = fs
    .readdirSync(PUBLICATIONS_DIR)
    .filter((f) => f.endsWith(".md") && !PUBLICATIONS_SKIP.has(f));

  for (const filename of files) {
    try {
      const raw = fs.readFileSync(path.join(PUBLICATIONS_DIR, filename), "utf-8");

      let data: Record<string, unknown>;
      let content: string;
      try {
        const parsed = matter(raw);
        data = parsed.data as Record<string, unknown>;
        content = parsed.content;
      } catch {
        data = {};
        content = raw.replace(/^---[\s\S]*?---\n/, "");
      }

      if (data.tipo === "nota-disparador") continue;

      const fecha = fmDate(data.fecha);
      if (!fecha || fecha === "undefined") continue;

      const pubSlug = slugify(filename.replace(".md", ""));
      const title = extractTitle(content, filename.replace(".md", ""));
      const ref: AparenceRef = { title, href: `/publicaciones/${pubSlug}`, fecha };

      // Extraer todos los wikilinks [[...]] del texto completo del archivo
      const wikilinkPattern = /\[\[([^\]]+)\]\]/g;
      let m: RegExpExecArray | null;
      const seen = new Set<string>();

      while ((m = wikilinkPattern.exec(raw)) !== null) {
        const inner = m[1];
        // Último segmento de ruta (ignorar prefijos como ../35-Conceptos-clave/)
        const lastPart = inner.split("/").pop() || inner;
        // Ignorar alias: [[Ruta|Alias]] → usar solo Ruta
        const pipeIdx = lastPart.indexOf("|");
        const refName = (pipeIdx >= 0 ? lastPart.slice(0, pipeIdx) : lastPart).trim();
        if (!refName) continue;

        const key = slugify(refName);
        if (!key || seen.has(key)) continue;
        seen.add(key);

        if (!_index!.has(key)) _index!.set(key, []);
        _index!.get(key)!.push(ref);
      }
    } catch {
      // skip archivos con errores de parseo
    }
  }

  return _index;
}

/**
 * Devuelve hasta `limit` publicaciones que referencian la entidad (concepto o autor)
 * identificada por su slug. Las más recientes primero.
 */
export function getAparece(entitySlug: string, limit = 6): AparenceRef[] {
  const index = buildIndex();
  const refs = index.get(entitySlug) ?? [];
  return refs
    .slice()
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, limit);
}

/**
 * Cuenta el total de publicaciones que referencian la entidad (sin límite).
 */
export function getApareceTotalCount(entitySlug: string): number {
  const index = buildIndex();
  return (index.get(entitySlug) ?? []).length;
}
