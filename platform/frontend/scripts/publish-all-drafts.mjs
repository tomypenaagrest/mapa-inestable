#!/usr/bin/env node
/**
 * publish-all-drafts.mjs
 *
 * Marks agent daily drafts as `publicado-en-sitio` so they appear on the site.
 *
 * Usage:
 *   node scripts/publish-all-drafts.mjs            — interactive numbered selection
 *   node scripts/publish-all-drafts.mjs --all       — promote all `borrador` drafts
 *   node scripts/publish-all-drafts.mjs --dry-run   — preview without writing
 *   node scripts/publish-all-drafts.mjs --unpublish <filename>  — revert to borrador
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Running from platform/frontend/ — vault is two levels up
const VAULT = join(__dirname, '..', '..', '..');
const DAILY_DIR = join(VAULT, '60-Borradores', 'diario');

const args = process.argv.slice(2);
const FLAG_ALL     = args.includes('--all');
const FLAG_DRY_RUN = args.includes('--dry-run');
const unpublishIdx = args.indexOf('--unpublish');
const FLAG_UNPUBLISH = unpublishIdx !== -1 ? args[unpublishIdx + 1] : null;

function getFmValue(raw, key) {
  const m = raw.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!m) return null;
  return m[1].trim().replace(/^["']|["']$/g, '');
}

function promoteToPublished(raw, ts) {
  let updated = raw.replace(/^(estado:\s*)borrador(\s*)$/m, `$1publicado-en-sitio$2`);
  if (!updated.includes('published_in_site_at:')) {
    // Insert before the closing --- of the frontmatter block
    const secondDash = updated.indexOf('\n---', 3);
    if (secondDash !== -1) {
      updated =
        updated.slice(0, secondDash) +
        `\npublished_in_site_at: ${ts}` +
        updated.slice(secondDash);
    }
  }
  return updated;
}

function unpublishDraft(raw) {
  let updated = raw.replace(/^(estado:\s*)publicado-en-sitio(\s*)$/m, `$1borrador$2`);
  updated = updated.replace(/^published_in_site_at:.*\n/m, '');
  return updated;
}

function loadDrafts() {
  if (!existsSync(DAILY_DIR)) {
    console.error(`[ERROR] Directorio no encontrado: ${DAILY_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(DAILY_DIR).filter(f => f.endsWith('.md'));
  const results = [];

  for (const filename of files) {
    const filepath = join(DAILY_DIR, filename);
    try {
      const raw = readFileSync(filepath, 'utf-8');
      const estado  = getFmValue(raw, 'estado');
      const country = getFmValue(raw, 'country');
      const title   = getFmValue(raw, 'title');
      const fecha   = getFmValue(raw, 'fecha');

      if (!estado || !title) {
        console.warn(`[SKIP] ${filename}: frontmatter incompleto (faltan estado o title)`);
        continue;
      }

      results.push({ filename, filepath, raw, estado, country: country ?? '?', title, fecha: fecha ?? '' });
    } catch (e) {
      console.warn(`[SKIP] ${filename}: ${e.message}`);
    }
  }

  return results.sort((a, b) => a.fecha.localeCompare(b.fecha));
}

async function interactiveSelect(eligible) {
  if (eligible.length === 0) {
    console.log('No hay borradores con estado: borrador');
    return [];
  }

  console.log('\nBorradores disponibles:\n');
  eligible.forEach((d, i) => {
    console.log(`  ${String(i + 1).padStart(2)}. [${d.fecha}] ${d.country} — ${d.title}`);
  });

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise(resolve => {
    rl.question('\n¿Cuáles publicar? (números separados por coma, "all", o "q" para cancelar): ', answer => {
      rl.close();
      const trimmed = answer.trim().toLowerCase();

      if (trimmed === 'q' || trimmed === '') { resolve([]); return; }
      if (trimmed === 'all') { resolve(eligible); return; }

      const nums    = trimmed.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      const selected = nums.filter(n => n >= 1 && n <= eligible.length).map(n => eligible[n - 1]);
      resolve(selected);
    });
  });
}

async function main() {
  const drafts = loadDrafts();
  const ts = new Date().toISOString();

  // ── --unpublish ──────────────────────────────────────────────────────────────
  if (FLAG_UNPUBLISH) {
    const draft = drafts.find(d => d.filename === FLAG_UNPUBLISH);
    if (!draft) {
      console.error(`[ERROR] Archivo no encontrado: ${FLAG_UNPUBLISH}`);
      process.exit(1);
    }
    const updated = unpublishDraft(draft.raw);
    if (!FLAG_DRY_RUN) writeFileSync(draft.filepath, updated, 'utf-8');
    console.log(`${FLAG_DRY_RUN ? '[DRY-RUN] ' : ''}Revertido a borrador: ${FLAG_UNPUBLISH}`);
    return;
  }

  // ── Select drafts to promote ─────────────────────────────────────────────────
  const eligible = drafts.filter(d => d.estado === 'borrador');
  let toPublish;

  if (FLAG_ALL) {
    toPublish = eligible;
    if (toPublish.length === 0) { console.log('No hay borradores con estado: borrador'); return; }
    console.log(`Publicando ${toPublish.length} borradores...`);
  } else {
    toPublish = await interactiveSelect(eligible);
    if (toPublish.length === 0) { console.log('Ningún borrador seleccionado.'); return; }
  }

  // ── Promote ──────────────────────────────────────────────────────────────────
  let ok = 0, skipped = 0;

  for (const draft of toPublish) {
    try {
      const updated = promoteToPublished(draft.raw, ts);
      if (!FLAG_DRY_RUN) writeFileSync(draft.filepath, updated, 'utf-8');
      console.log(`${FLAG_DRY_RUN ? '[DRY-RUN] ' : ''}✓  ${draft.country} — ${draft.title}`);
      ok++;
    } catch (e) {
      console.warn(`[SKIP] ${draft.filename}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\nResumen: ${ok} publicados${skipped > 0 ? `, ${skipped} saltados` : ''}.`);
  if (FLAG_DRY_RUN) console.log('(modo dry-run: no se modificaron archivos)');
}

main().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
