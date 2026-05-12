import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { VAULT_ROOT } from "./content";
import type { AxisKey } from "./ejes";

export type AgendaTendencia = "subiendo" | "estable" | "bajando";

export interface Agenda {
  rank: number;
  slug: string;
  title: string;
  description: string;
  tendencia: AgendaTendencia;
  eje?: AxisKey;
  query: string;
}

export interface CountryAgenda {
  countrySlug: string;
  countryName: string;
  updated: string;        // ISO date YYYY-MM-DD, or "" if missing/invalid
  week: number;
  year: number;
  googleNewsGl: string;
  googleNewsCeid: string;
  googleNewsHl: string;
  agendas: Agenda[];
}

const VALID_TENDENCIAS = new Set<string>(["subiendo", "estable", "bajando"]);
const VALID_EJES = new Set<AxisKey>([
  "deculturacion", "mediaciones", "desrepresentacion",
  "estetizacion",  "desorientacion", "atencion",
]);

const AGENDAS_DIR = path.join(VAULT_ROOT, "15-Países", "agendas");

export function getCountryAgenda(slug: string): CountryAgenda | null {
  const filePath = path.join(AGENDAS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf-8");
  } catch {
    console.warn(`[agendas] Cannot read ${filePath}`);
    return null;
  }

  let data: Record<string, unknown>;
  try {
    data = (matter(raw) as { data: Record<string, unknown> }).data;
  } catch {
    console.warn(`[agendas] Malformed YAML in ${filePath} — skipping`);
    return null;
  }

  // Validate country_slug matches filename
  if (data.country_slug && String(data.country_slug) !== slug) {
    console.warn(`[agendas] country_slug mismatch in ${filePath}`);
  }

  // Filter non-published states (post-Spec-28 addition)
  const estado = data.estado ? String(data.estado) : "publicada";
  if (estado !== "publicada") return null;

  // Normalize updated date (gray-matter may parse bare dates as Date objects)
  let updated = "";
  if (data.updated instanceof Date) {
    updated = data.updated.toISOString().slice(0, 10);
  } else if (data.updated) {
    updated = String(data.updated);
  }
  if (updated && !/^\d{4}-\d{2}-\d{2}$/.test(updated)) {
    console.warn(`[agendas] Non-ISO date in ${filePath}: "${updated}"`);
    updated = "";
  }

  const base = {
    countrySlug:     slug,
    countryName:     String(data.country_name ?? ""),
    updated,
    week:            Number(data.week ?? 0),
    year:            Number(data.year ?? 0),
    googleNewsGl:    String(data.google_news_gl   ?? ""),
    googleNewsCeid:  String(data.google_news_ceid ?? ""),
    googleNewsHl:    String(data.google_news_hl   ?? ""),
  };

  const rawAgendas = Array.isArray(data.agendas)
    ? (data.agendas as Record<string, unknown>[])
    : [];

  if (rawAgendas.length === 0) {
    return { ...base, agendas: [] };
  }

  if (rawAgendas.length > 7) {
    console.warn(`[agendas] ${filePath} has ${rawAgendas.length} agendas (max 7) — truncating display to 5`);
  }

  const agendas: Agenda[] = rawAgendas.slice(0, 5).map((a) => {
    let tendencia: AgendaTendencia = "estable";
    const rawTend = String(a.tendencia ?? "");
    if (VALID_TENDENCIAS.has(rawTend)) {
      tendencia = rawTend as AgendaTendencia;
    } else if (rawTend) {
      console.warn(`[agendas] Invalid tendencia "${rawTend}" in ${filePath} — using "estable"`);
    }

    let eje: AxisKey | undefined;
    if (a.eje) {
      const rawEje = String(a.eje) as AxisKey;
      if (VALID_EJES.has(rawEje)) {
        eje = rawEje;
      } else {
        console.warn(`[agendas] Unknown eje "${a.eje}" in ${filePath} — ignoring`);
      }
    }

    const query = a.query ? String(a.query) : "";
    if (!query) {
      console.warn(`[agendas] Missing query for "${a.slug ?? "?"}" in ${filePath} — button will be hidden`);
    }

    return {
      rank:        Number(a.rank ?? 0),
      slug:        String(a.slug ?? ""),
      title:       String(a.title ?? ""),
      description: String(a.description ?? "").trim(),
      tendencia,
      eje,
      query,
    };
  });

  return { ...base, agendas };
}

export function buildGoogleNewsUrl(agenda: Agenda, ca: CountryAgenda): string {
  return (
    `https://news.google.com/search?q=${encodeURIComponent(agenda.query)}` +
    `&hl=${ca.googleNewsHl}&gl=${ca.googleNewsGl}&ceid=${ca.googleNewsCeid}`
  );
}

const COUNTRY_SLUGS = ["ar", "bo", "br", "cl", "co", "ec", "pe", "py", "uy", "ve"] as const;

export function getAllCountryAgendas(): Record<string, CountryAgenda> {
  const result: Record<string, CountryAgenda> = {};
  for (const slug of COUNTRY_SLUGS) {
    const agenda = getCountryAgenda(slug);
    if (!agenda || agenda.agendas.length === 0) continue;
    if (!agenda.googleNewsGl || !agenda.googleNewsCeid) {
      console.warn(`[agendas] Missing gl/ceid for ${slug} — omitting from map panel`);
      continue;
    }
    result[slug] = agenda;
  }
  return result;
}
