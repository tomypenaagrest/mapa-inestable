// Spec 39 — Lee los reading guides de capas desde el vault (server-side only).
import fs   from "node:fs";
import path from "node:path";
import { marked } from "marked";
import matter from "gray-matter";
import type { LayerId } from "./layers";

// En dev: vault real. En prod: src/content/ (pobrado por copy-content.js).
const VAULT_ROOT =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "src", "content")
    : path.join(process.cwd(), "..", "..");

const GUIDES_DIR = path.join(VAULT_ROOT, "70-Producto", "lecturas-capas");

function readGuide(slug: string): string {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return "";
  try {
    const raw     = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);
    return marked.parse(content) as string;
  } catch {
    return "";
  }
}

export type ReadingGuides = Record<LayerId, string>;

export function getReadingGuides(): ReadingGuides {
  return {
    precipitacion: readGuide("precipitacion"),
    temperatura:   readGuide("temperatura"),
    viento:        readGuide("viento"),
    presion:       readGuide("presion"),
  };
}
