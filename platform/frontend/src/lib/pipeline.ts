import fs from "fs";
import path from "path";
import matter from "gray-matter";

const VAULT_ROOT =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "src", "content")
    : path.join(process.cwd(), "..", "..");

const AGENT_DAILY_DIR  = path.join(VAULT_ROOT, "60-Borradores", "diario");
const PUBLICATIONS_DIR = path.join(VAULT_ROOT, "50-Publicaciones");

export type PieceState = "agente" | "en-edicion" | "promovido" | "publicado" | "archivado";

export interface PipelinePiece {
  state:        PieceState;
  countrySlug:  string;
  country:      string;
  title:        string;
  ejePrincipal: string;
  ejes:         string[];
  date:         string;          // YYYY-MM-DD
  daysInState:  number;
  detailHref:   string;
  substackUrl?: string;
  source:       "draft" | "publication";
  filename:     string;
}

export interface PipelineMetrics {
  total:       number;
  leadTimeAvg: number | null;
  stalled:     PipelinePiece[];
}

const COUNTRY_TO_SLUG: Record<string, string> = {
  argentina:  "ar",
  brasil:     "br",
  chile:      "cl",
  colombia:   "co",
  bolivia:    "bo",
  "perú":     "pe",
  peru:       "pe",
  uruguay:    "uy",
  paraguay:   "py",
  ecuador:    "ec",
  venezuela:  "ve",
};

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

// Maps [[NN - ...]] Obsidian refs to axis keys used in the design system
const EJE_NUM_TO_KEY: Record<string, string> = {
  "01": "deculturacion",
  "02": "mediaciones",
  "03": "desrepresentacion",
  "04": "estetizacion",
  "05": "desorientacion",
  "06": "atencion",
};

function safeMatter(raw: string): { data: Record<string, unknown>; content: string } {
  try {
    return matter(raw) as { data: Record<string, unknown>; content: string };
  } catch {
    const stripped = raw.replace(/^---[\s\S]*?---\n/, "");
    return { data: {}, content: stripped };
  }
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

function daysFrom(dateStr: string, today: Date): number {
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const then = new Date(parts[0], parts[1] - 1, parts[2]);
  return Math.max(0, Math.floor((today.getTime() - then.getTime()) / 86_400_000));
}

function parseObsidianEjes(raw: unknown): string[] {
  if (!raw) return [];
  const items = Array.isArray(raw) ? raw : [raw];
  return items.flatMap((item) => {
    const m = String(item).match(/\[\[(\d{2})/);
    return m && EJE_NUM_TO_KEY[m[1]] ? [EJE_NUM_TO_KEY[m[1]]] : [];
  });
}

function extractH1(content: string): string {
  const m = content.match(/^# (.+)$/m);
  return m ? m[1].trim() : "";
}

function readDrafts(today: Date): PipelinePiece[] {
  if (!fs.existsSync(AGENT_DAILY_DIR)) return [];

  return fs
    .readdirSync(AGENT_DAILY_DIR)
    .filter((f) => f.endsWith(".md"))
    .flatMap((filename) => {
      const raw = fs.readFileSync(path.join(AGENT_DAILY_DIR, filename), "utf-8");
      const { data } = safeMatter(raw);

      const required = ["country", "country_slug", "title", "slug", "fecha", "eje_principal"] as const;
      const missing = required.filter((k) => !data[k]);
      if (missing.length > 0) {
        console.warn(`[pipeline] Skipping draft ${filename}: missing ${missing.join(", ")}`);
        return [];
      }

      const estadoRaw = String(data.estado ?? "borrador");
      let state: PieceState;
      if      (estadoRaw === "en-edicion") state = "en-edicion";
      else if (estadoRaw === "promovido")  state = "promovido";
      else                                 state = "agente";

      const countrySlug  = String(data.country_slug);
      const pieceSlug    = String(data.slug);
      const date         = fmDate(data.fecha);
      const ejePrincipal = String(data.eje_principal);
      const ejes         = Array.isArray(data.ejes) ? (data.ejes as string[]) : [ejePrincipal];

      return [{
        state,
        countrySlug,
        country:      String(data.country),
        title:        String(data.title),
        ejePrincipal,
        ejes,
        date,
        daysInState:  daysFrom(date, today),
        detailHref:   `/analisis/borradores/${countrySlug}/${pieceSlug}`,
        source:       "draft" as const,
        filename,
      }];
    });
}

const SKIP_PUB_TIPOS   = new Set(["MOC", "nota-disparador"]);
const SKIP_PUB_ESTADOS = new Set(["incluida-en-despacho"]);

function readPublications(today: Date): PipelinePiece[] {
  if (!fs.existsSync(PUBLICATIONS_DIR)) return [];

  return fs
    .readdirSync(PUBLICATIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .flatMap((filename) => {
      const raw = fs.readFileSync(path.join(PUBLICATIONS_DIR, filename), "utf-8");
      const { data, content } = safeMatter(raw);

      if (SKIP_PUB_TIPOS.has(String(data.tipo ?? ""))) return [];

      const estado = String(data.estado ?? "");
      if (!estado || SKIP_PUB_ESTADOS.has(estado)) return [];

      let state: PieceState;
      if      (estado === "archivada") state = "archivado";
      else if (estado === "publicada") state = "publicado";
      else {
        console.warn(`[pipeline] Skipping publication ${filename}: unknown estado "${estado}"`);
        return [];
      }

      const paisRaw     = String(data["país"] ?? data.pais ?? "").toLowerCase().trim();
      const countrySlug = COUNTRY_TO_SLUG[paisRaw] ?? "";
      const country     = countrySlug ? (SLUG_TO_COUNTRY[countrySlug] ?? paisRaw) : "—";

      const title =
        String(data["título-completo"] ?? data.titulo ?? "").trim() ||
        extractH1(content) ||
        filename.replace(".md", "");

      const date         = fmDate(data.fecha);
      const ejes         = parseObsidianEjes(data.ejes);
      const ejePrincipal = ejes[0] ?? "";

      const url = data.url ? String(data.url).trim() : undefined;
      if (state === "publicado" && !url) {
        console.warn(`[pipeline] Publication without URL: ${filename}`);
      }

      return [{
        state,
        countrySlug,
        country,
        title,
        ejePrincipal,
        ejes,
        date,
        daysInState:  daysFrom(date, today),
        detailHref:   url ?? "#",
        substackUrl:  url,
        source:       "publication" as const,
        filename,
      }];
    });
}

export function getAllPipelinePieces(): PipelinePiece[] {
  const today        = new Date();
  const drafts       = readDrafts(today);
  const publications = readPublications(today);
  return [...drafts, ...publications].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPipelineMetrics(pieces: PipelinePiece[]): PipelineMetrics {
  const stalled = pieces.filter(
    (p) => (p.state === "agente" || p.state === "en-edicion") && p.daysInState > 14,
  );
  return { total: pieces.length, leadTimeAvg: null, stalled };
}
