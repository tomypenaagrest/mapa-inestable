#!/usr/bin/env node
/**
 * build_viento.mjs — Compila el JSON de coding viento desde los .md del vault.
 *
 * Uso:
 *   node platform/data/coding-viento/build_viento.mjs [--dry-run]
 *
 * Lee:  70-Producto/datos-viento/<slug>/YYYY-W##.md  (solo estado: publicada)
 * Escribe:
 *   70-Producto/datos-viento/_compilado/viento.json  (fuente canónica)
 *   platform/frontend/src/data/coding-viento/viento.json  (copia para el frontend)
 *   70-Producto/datos-viento/_compilado/_log-<YYYY-W##>.md  (log de la corrida)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

// ── Paths ────────────────────────────────────────────────────────────────────

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Desde platform/data/coding-viento/ subimos 3 niveles a la raíz del repo
const REPO_ROOT    = path.resolve(__dirname, "..", "..", "..");
const VAULT_DIR    = path.join(REPO_ROOT, "70-Producto", "datos-viento");
const OUTPUT_VAULT = path.join(VAULT_DIR, "_compilado", "viento.json");
const OUTPUT_FE    = path.join(REPO_ROOT, "platform", "frontend", "src", "data", "coding-viento", "viento.json");

const COUNTRY_SLUGS = ["ar", "bo", "br", "cl", "co", "ec", "pe", "py", "uy", "ve"];

const COUNTRY_NAMES = {
  ar: "Argentina", bo: "Bolivia",  br: "Brasil",   cl: "Chile",
  co: "Colombia",  ec: "Ecuador",  pe: "Perú",     py: "Paraguay",
  uy: "Uruguay",   ve: "Venezuela",
};

const VALID_RANKS     = new Set([-3, -2, -1, 0, 1, 2, 3]);
const VALID_ESTADOS   = new Set(["borrador", "publicada"]);
const WEEK_FILE_RE    = /^(\d{4})-W(\d{2})\.md$/;

const DRY_RUN = process.argv.includes("--dry-run");

// ── Helpers ───────────────────────────────────────────────────────────────────

function isoWeek() {
  const now  = new Date();
  const jan4 = new Date(Date.UTC(now.getUTCFullYear(), 0, 4));
  const w1   = new Date(jan4.getTime() - ((jan4.getUTCDay() + 6) % 7) * 86400000);
  return {
    year: now.getUTCFullYear(),
    week: Math.max(1, Math.floor((now.getTime() - w1.getTime()) / (7 * 86400000)) + 1),
  };
}

function rankToDirection(rank) {
  if (rank < 0) return "pro-estado";
  if (rank > 0) return "pro-mercado";
  return "neutro";
}

/** Extrae secciones markdown del body del .md. Divide por líneas "# Título". */
function extractSections(content) {
  // Dividir el contenido en secciones por encabezados H1
  const sections = {};
  const parts = content.split(/\n(?=# )/);
  for (const part of parts) {
    const m = part.match(/^# (.+?)\s*\n([\s\S]*)/);
    if (!m) continue;
    sections[m[1].trim()] = m[2].trim();
  }

  const justificativo = sections["Justificativo"] ?? "";
  const eventosBlock  = sections["Eventos clave de la semana"] ?? "";
  const eventos = eventosBlock
    .split("\n")
    .map(l => l.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);

  return { justificativo, eventos };
}

// ── Parser + Validador ────────────────────────────────────────────────────────

function parseFile(filePath, slug, year, week) {
  const raw = fs.readFileSync(filePath, "utf-8");
  let data, content;
  try {
    ({ data, content } = matter(raw));
  } catch (e) {
    return { ok: false, error: `YAML parse error: ${e.message}` };
  }

  // Validaciones que bloquean
  if (!data.country_slug)
    return { ok: false, error: "Falta country_slug" };
  if (String(data.country_slug) !== slug)
    return { ok: false, error: `country_slug "${data.country_slug}" no coincide con carpeta "${slug}"` };
  if (data.rank === undefined || data.rank === null)
    return { ok: false, error: "Falta rank" };

  const rank = Number(data.rank);
  if (!Number.isInteger(rank) || !VALID_RANKS.has(rank))
    return { ok: false, error: `rank inválido: ${data.rank} (debe ser entero -3..+3)` };

  if (data.week === undefined || data.week === null)
    return { ok: false, error: "Falta week" };
  if (Number(data.week) !== week)
    return { ok: false, error: `week ${data.week} no coincide con nombre de archivo W${String(week).padStart(2,"0")}` };

  const estado = String(data.estado ?? "borrador");
  if (!VALID_ESTADOS.has(estado))
    return { ok: false, error: `estado inválido: "${estado}"` };

  // Validación de intensidad (no bloqueante)
  let intensidad;
  const warnings = [];
  if (data.intensidad !== undefined && data.intensidad !== null) {
    intensidad = Number(data.intensidad);
    if (isNaN(intensidad) || intensidad < 0 || intensidad > 1) {
      warnings.push(`intensidad ${data.intensidad} fuera de rango [0,1] — se ignora`);
      intensidad = undefined;
    }
  }

  // Validaciones de contenido (warnings, no bloquean)
  const { justificativo, eventos } = extractSections(content);
  if (!justificativo)
    warnings.push("Falta sección '# Justificativo' — se incluye con string vacío");
  if (eventos.length === 0)
    warnings.push("Sección '# Eventos clave de la semana' vacía o ausente");

  return {
    ok: true,
    estado,
    warnings,
    entry: {
      year,
      week,
      rank,
      direccion: rankToDirection(rank),
      ...(intensidad !== undefined ? { intensidad } : {}),
      justificativo,
      eventos,
      codificador: String(data.codificador ?? "tomas"),
      fecha_coding: data.fecha_coding instanceof Date
        ? data.fecha_coding.toISOString().slice(0, 10)
        : String(data.fecha_coding ?? ""),
    },
  };
}

// ── Comparador de semanas ─────────────────────────────────────────────────────

function weekLt(a, b) {
  return a.year < b.year || (a.year === b.year && a.week < b.week);
}

// ── Build principal ───────────────────────────────────────────────────────────

function build() {
  const startedAt = new Date().toISOString();
  const currentWeek = isoWeek();
  const logLines = [`# Build viento · ${startedAt}`, ""];

  const byCountry = {};
  let totalFiles = 0;
  let totalWarnings = 0;
  let totalSkipped = 0;

  for (const slug of COUNTRY_SLUGS) {
    const countryDir = path.join(VAULT_DIR, slug);
    if (!fs.existsSync(countryDir)) {
      logLines.push(`## ${slug}: directorio no encontrado — sin datos`);
      continue;
    }

    const files = fs.readdirSync(countryDir).filter(f => WEEK_FILE_RE.test(f));
    const series = [];

    for (const filename of files) {
      const m = filename.match(WEEK_FILE_RE);
      if (!m) continue;
      const year = parseInt(m[1], 10);
      const week = parseInt(m[2], 10);
      const filePath = path.join(countryDir, filename);

      const result = parseFile(filePath, slug, year, week);

      if (!result.ok) {
        logLines.push(`  ⚠ ${slug}/${filename}: ${result.error} — IGNORADO`);
        totalSkipped++;
        continue;
      }

      if (result.estado !== "publicada") {
        totalSkipped++;
        continue;
      }

      for (const w of result.warnings) {
        logLines.push(`  ⚠ ${slug}/${filename}: ${w}`);
        totalWarnings++;
      }

      series.push(result.entry);
      totalFiles++;
    }

    // Ordenar cronológicamente
    series.sort((a, b) => (a.year !== b.year ? a.year - b.year : a.week - b.week));

    if (series.length === 0) continue;

    const latest = series[series.length - 1];
    byCountry[slug] = {
      name: COUNTRY_NAMES[slug] ?? slug,
      series_semanal: series,
      latest,
    };
  }

  // Calcular range
  let startWeek = null;
  let endWeek   = null;
  for (const { series_semanal } of Object.values(byCountry)) {
    if (series_semanal.length === 0) continue;
    const first = series_semanal[0];
    const last  = series_semanal[series_semanal.length - 1];
    if (!startWeek || weekLt(first, startWeek)) startWeek = { year: first.year, week: first.week };
    if (!endWeek   || weekLt(endWeek,  last))   endWeek   = { year: last.year,  week: last.week };
  }

  const output = {
    version:     "viento-v1.0.0",
    computed_at: startedAt,
    range: {
      start_week: startWeek ?? currentWeek,
      end_week:   endWeek   ?? currentWeek,
    },
    by_country: byCountry,
  };

  // ── Verificar cambios respecto al JSON anterior ───────────────────────────
  let changed = true;
  if (fs.existsSync(OUTPUT_VAULT)) {
    try {
      const prev = JSON.parse(fs.readFileSync(OUTPUT_VAULT, "utf-8"));
      const prevWithoutMeta = { ...prev, computed_at: null };
      const currWithoutMeta = { ...output, computed_at: null };
      if (JSON.stringify(prevWithoutMeta) === JSON.stringify(currWithoutMeta)) {
        changed = false;
      }
    } catch { /* si no se puede parsear, asumimos cambio */ }
  }

  const summary = [
    `Países con datos: ${Object.keys(byCountry).length}/10`,
    `Archivos compilados: ${totalFiles}`,
    `Skipped (borrador/inválido): ${totalSkipped}`,
    `Warnings: ${totalWarnings}`,
    changed ? "Estado: JSON actualizado" : "Estado: sin cambios respecto a corrida anterior",
  ].join("\n");

  logLines.push("", "## Resumen", summary);

  if (DRY_RUN) {
    console.log("[build_viento] DRY RUN — no se escriben archivos");
    console.log(summary);
    return;
  }

  // ── Escribir outputs ─────────────────────────────────────────────────────
  const jsonStr = JSON.stringify(output, null, 2);

  fs.writeFileSync(OUTPUT_VAULT, jsonStr, "utf-8");
  fs.writeFileSync(OUTPUT_FE,    jsonStr, "utf-8");

  // Log de corrida con semana actual
  const logFilename = `_log-${currentWeek.year}-W${String(currentWeek.week).padStart(2, "0")}.md`;
  const logPath = path.join(VAULT_DIR, "_compilado", logFilename);
  fs.writeFileSync(logPath, logLines.join("\n"), "utf-8");

  console.log(`[build_viento] ${summary}`);
  console.log(`[build_viento] → ${OUTPUT_VAULT}`);
  console.log(`[build_viento] → ${OUTPUT_FE}`);
  console.log(`[build_viento] → ${logPath}`);
}

build();
