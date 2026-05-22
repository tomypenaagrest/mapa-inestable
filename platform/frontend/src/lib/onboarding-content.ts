// Spec 46 — Carga server-side del contenido editorial del onboarding.
// Parsea _onboarding.md por headers H1 y devuelve secciones.
import fs   from "node:fs";
import path from "node:path";
import { marked } from "marked";
import matter from "gray-matter";

const VAULT_ROOT =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "src", "content")
    : path.join(process.cwd(), "..", "..");

const GUIDES_DIR = path.join(VAULT_ROOT, "70-Producto", "lecturas-capas");

export interface OnboardingSection {
  title: string;
  html: string;
}

export interface OnboardingContent {
  panels: OnboardingSection[]; // Pantalla 1–4
  glossary: OnboardingSection | null;
}

export function getOnboardingContent(): OnboardingContent {
  const filePath = path.join(GUIDES_DIR, "_onboarding.md");
  const fallback: OnboardingContent = { panels: [], glossary: null };
  if (!fs.existsSync(filePath)) return fallback;

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { content } = matter(raw);

    // Split por H1 (líneas que empiezan con "# ")
    const parts = content.split(/^(?=# )/m).filter(s => s.trim());
    const sections: OnboardingSection[] = parts.map(part => {
      const firstNewline = part.indexOf("\n");
      const titleLine = firstNewline >= 0 ? part.slice(0, firstNewline).trim() : part.trim();
      const body = firstNewline >= 0 ? part.slice(firstNewline + 1) : "";
      const title = titleLine.replace(/^#+\s*/, "");
      const html = marked.parse(body) as string;
      return { title, html };
    });

    const glossaryIndex = sections.findIndex(s => s.title.startsWith("Glosario"));
    const glossary = glossaryIndex >= 0 ? sections[glossaryIndex] : null;
    const panels = sections.filter(s => !s.title.startsWith("Glosario"));

    return { panels, glossary };
  } catch {
    return fallback;
  }
}
