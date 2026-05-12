#!/usr/bin/env node
/**
 * promote-agenda.mjs
 * Promueve un borrador de agenda (60-Borradores/agendas/<slug>.md) a live (15-Países/agendas/<slug>.md).
 *
 * Spec 28 §5 — flujo de promote.
 *
 * Uso interactivo: npm run promote-agenda
 * Uso CLI:         npm run promote-agenda -- <slug>
 * Force (sin prompt confirmacion cuando live > borrador): anadir --force
 * Dry-run:         anadir --dry-run
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'
import matter from 'gray-matter'

// Paths

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const VAULT = join(__dirname, '..')

const DRAFTS_DIR  = join(VAULT, '60-Borradores', 'agendas')
const ARCHIVE_DIR = join(DRAFTS_DIR, '_archive')
const LIVE_DIR    = join(VAULT, '15-Paises', 'agendas')
// Note: el directorio real es "15-Paises" en sistemas con tilde Unicode normalizada distinto.
// Si tu vault usa "15-Países" (con tilde), corrige la linea anterior.

const VALID_SLUGS = ['ar', 'bo', 'br', 'cl', 'co', 'ec', 'py', 'pe', 'uy', 've']
const COUNTRY_NAMES = {
  ar: 'Argentina', bo: 'Bolivia', br: 'Brasil', cl: 'Chile', co: 'Colombia',
  ec: 'Ecuador', py: 'Paraguay', pe: 'Peru', uy: 'Uruguay', ve: 'Venezuela',
}
const COUNTRY_FLAGS = {
  ar: '\u{1F1E6}\u{1F1F7}', bo: '\u{1F1E7}\u{1F1F4}', br: '\u{1F1E7}\u{1F1F7}',
  cl: '\u{1F1E8}\u{1F1F1}', co: '\u{1F1E8}\u{1F1F4}', ec: '\u{1F1EA}\u{1F1E8}',
  py: '\u{1F1F5}\u{1F1FE}', pe: '\u{1F1F5}\u{1F1EA}', uy: '\u{1F1FA}\u{1F1FE}',
  ve: '\u{1F1FB}\u{1F1EA}',
}

// Detect correct path for 15-Paises (Windows vs Linux mount may differ)
function resolveLiveDir() {
  const candidates = [
    join(VAULT, '15-Paises', 'agendas'),
    join(VAULT, '15-Países', 'agendas'),
  ]
  for (const p of candidates) {
    if (existsSync(p) || existsSync(join(p, '..'))) {
      return p
    }
  }
  return candidates[1] // default a la version con tilde
}

const LIVE_DIR_RESOLVED = resolveLiveDir()

// Helpers

function readline(prompt) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(prompt, ans => { rl.close(); resolve(ans.trim()) }))
}

function toIsoDate(val) {
  if (!val) return ''
  if (val instanceof Date) {
    const y = val.getUTCFullYear()
    const m = String(val.getUTCMonth() + 1).padStart(2, '0')
    const d = String(val.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return String(val)
}

function today() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isoWeek(date = new Date()) {
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  const firstThursday = target.valueOf()
  target.setMonth(0, 1)
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7)
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000)
}

function isoYear(date = new Date()) {
  const target = new Date(date.valueOf())
  const dayNr = (date.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNr + 3)
  return target.getFullYear()
}

function parseArgs() {
  const args = process.argv.slice(2)
  let slug = null
  const flags = { force: false, dryRun: false }
  for (const a of args) {
    if (a === '--force')   flags.force = true
    else if (a === '--dry-run') flags.dryRun = true
    else if (VALID_SLUGS.includes(a)) slug = a
  }
  return { slug, flags }
}

function listAvailableDrafts() {
  if (!existsSync(DRAFTS_DIR)) return []
  return readdirSync(DRAFTS_DIR)
    .filter(name => name.endsWith('.md') && !name.startsWith('_') && name !== 'README.md')
    .map(name => name.replace(/\.md$/, ''))
    .filter(slug => VALID_SLUGS.includes(slug))
}

// Main

async function main() {
  const { slug: cliSlug, flags } = parseArgs()

  let slug = cliSlug
  if (!slug) {
    const available = listAvailableDrafts()
    if (available.length === 0) {
      console.error('No hay borradores de agenda disponibles en', DRAFTS_DIR)
      process.exit(1)
    }
    console.log('\nBorradores disponibles:')
    available.forEach((s, i) => console.log(`  ${i + 1}. ${COUNTRY_FLAGS[s]} ${COUNTRY_NAMES[s]} (${s})`))
    const choice = await readline('\nElegi el numero o el slug: ')
    const asNum = parseInt(choice, 10)
    if (!isNaN(asNum) && asNum >= 1 && asNum <= available.length) {
      slug = available[asNum - 1]
    } else if (VALID_SLUGS.includes(choice)) {
      slug = choice
    } else {
      console.error('Seleccion invalida:', choice)
      process.exit(1)
    }
  }

  const draftPath = join(DRAFTS_DIR, `${slug}.md`)
  const livePath  = join(LIVE_DIR_RESOLVED, `${slug}.md`)

  if (!existsSync(draftPath)) {
    console.error(`No existe borrador en ${draftPath}`)
    process.exit(1)
  }

  const raw = readFileSync(draftPath, 'utf-8')
  let parsed
  try {
    parsed = matter(raw)
  } catch (e) {
    console.error(`Borrador con frontmatter malformado: ${e.message}`)
    process.exit(1)
  }

  const data = parsed.data
  const required = ['country_slug', 'country_name', 'agendas']
  const missing = required.filter(k => !data[k])
  if (missing.length > 0) {
    console.error(`Borrador con campos faltantes: ${missing.join(', ')}`)
    process.exit(1)
  }

  if (data.country_slug !== slug) {
    console.error(`Inconsistencia: filename slug=${slug} vs frontmatter country_slug=${data.country_slug}`)
    process.exit(1)
  }

  if (data.estado && data.estado !== 'borrador') {
    console.error(`Borrador con estado=${data.estado} (esperado: borrador). Esta ya promovido?`)
    process.exit(1)
  }

  if (!Array.isArray(data.agendas) || data.agendas.length < 2) {
    console.error(`Borrador con agendas invalidas (minimo 2 requeridas).`)
    process.exit(1)
  }

  if (existsSync(livePath) && !flags.force) {
    const liveRaw = readFileSync(livePath, 'utf-8')
    const liveParsed = matter(liveRaw)
    const liveUpdated = toIsoDate(liveParsed.data.updated)
    const draftUpdated = toIsoDate(data.updated)

    if (liveUpdated && draftUpdated && liveUpdated > draftUpdated) {
      console.log(`\nAdvertencia: el live (${livePath}) tiene updated=${liveUpdated}`)
      console.log(`  y el borrador tiene updated=${draftUpdated}.`)
      const ans = await readline('\nSobreescribir el live con el borrador? (y/N): ')
      if (ans.toLowerCase() !== 'y' && ans.toLowerCase() !== 'yes') {
        console.log('Cancelado.')
        process.exit(0)
      }
    }
  }

  const now = new Date()
  const newData = {
    ...data,
    estado: 'publicada',
    updated: today(),
    week: isoWeek(now),
    year: isoYear(now),
  }

  delete newData.agent_run_id
  delete newData.agent_version

  const newContent = matter.stringify(parsed.content, newData)

  if (!existsSync(LIVE_DIR_RESOLVED)) {
    mkdirSync(LIVE_DIR_RESOLVED, { recursive: true })
  }

  if (flags.dryRun) {
    console.log('\n[DRY-RUN] Escribiria a:', livePath)
    return
  }

  writeFileSync(livePath, newContent, 'utf-8')
  console.log(`OK ${COUNTRY_FLAGS[slug]} ${COUNTRY_NAMES[slug]} promovido a live`)
  console.log(`   ${livePath}`)

  // Archivar borrador
  try {
    if (!existsSync(ARCHIVE_DIR)) {
      mkdirSync(ARCHIVE_DIR, { recursive: true })
    }
    const archivePath = join(ARCHIVE_DIR, `${slug}-${today()}.md`)
    writeFileSync(archivePath, raw, 'utf-8')
    console.log(`   Borrador archivado en ${archivePath}`)
  } catch (e) {
    console.log(`   No se pudo archivar el borrador (${e.code || e.message})`)
  }

  // Intentar eliminar borrador original (puede fallar en OneDrive — no es bloqueante)
  try {
    unlinkSync(draftPath)
  } catch (e) {
    console.log(`   No se pudo eliminar el borrador original (${e.code || e.message}). El live ya esta promovido — borralo manualmente cuando puedas.`)
  }

  // Marcar el bloque del pais en el resumen semanal
  const week = isoWeek(now)
  const year = isoYear(now)
  const weekStr = String(week).padStart(2, '0')
  const summaryPath = join(DRAFTS_DIR, `_resumen-${year}-W${weekStr}.md`)

  if (existsSync(summaryPath)) {
    let summary = readFileSync(summaryPath, 'utf-8')
    const flag = COUNTRY_FLAGS[slug]
    const name = COUNTRY_NAMES[slug]
    const pattern = new RegExp(
      `(## ${flag} ${name}\\s*\\n\\s*)\\*\\*Status:\\*\\* borrador listo · pendiente de promote`,
      'g'
    )
    const replacement = `$1**Status:** OK promovido ${today()} · live en \`15-Países/agendas/${slug}.md\``
    const updated = summary.replace(pattern, replacement)
    if (updated !== summary) {
      writeFileSync(summaryPath, updated, 'utf-8')
      console.log(`   Resumen marcado como promovido`)
    } else {
      console.log(`   No se encontro el bloque del pais en el resumen — revisalo manualmente`)
    }
  } else {
    console.log(`   No existe resumen semanal en ${summaryPath}`)
  }

  console.log(`\nEl sitio refleja la nueva agenda en el proximo build/revalidate.`)
}

main().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
