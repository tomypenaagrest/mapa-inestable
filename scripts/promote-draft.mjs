#!/usr/bin/env node
/**
 * promote-draft.mjs
 * Promueve un borrador (60-Borradores/) a publicación del Substack (50-Publicaciones/).
 * Soporta borradores del agente (Spec 23, ejes como slugs) y borradores manuales (ejes como [[links de Obsidian]]).
 *
 * Uso interactivo: npm run promote-draft
 * Uso CLI:         npm run promote-draft -- --draft "60-Borradores/diario/Archivo.md" --substack-url "https://mapainestable.substack.com/p/slug"
 * Dry-run:         añadir --dry-run
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'
import matter from 'gray-matter'

// ─── Paths ────────────────────────────────────────────────────────────────────

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const VAULT = join(__dirname, '..')

const DRAFTS_DIR = join(VAULT, '60-Borradores', 'diario')
const PUBS_DIR   = join(VAULT, '50-Publicaciones')
const MOC_PATH   = join(PUBS_DIR, 'Publicaciones - MOC.md')

// ─── Mapa de ejes (slugs → metadata) ─────────────────────────────────────────

const EJE_MAP = {
  deculturacion:    { num: '01', name: 'Deculturación',               alias: 'Deculturación',     file: '01 - Deculturación' },
  mediaciones:      { num: '02', name: 'Erosión de mediaciones',       alias: 'Mediaciones',       file: '02 - Erosión de mediaciones' },
  desrepresentacion:{ num: '03', name: 'Desrepresentación',            alias: 'Desrepresentación', file: '03 - Desrepresentación' },
  estetizacion:     { num: '04', name: 'Estetización de la cultura',   alias: 'Estetización',      file: '04 - Estetización de la cultura' },
  desorientacion:   { num: '05', name: 'Desorientación epistemológica',alias: 'Desorientación',    file: '05 - Desorientación epistemológica' },
  atencion:         { num: '06', name: 'Atención',                     alias: 'Atención',          file: '06 - Atención' },
}

// ─── Meses en español ─────────────────────────────────────────────────────────

const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** gray-matter parsea fechas YAML como objetos Date — convierte a YYYY-MM-DD con UTC para evitar desfase. */
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

function formatDateEs(isoDate) {
  if (!isoDate) return '?'
  const [y, m, d] = isoDate.split('-').map(Number)
  return `${d} ${MONTHS_ES[m - 1]} ${y}`
}

function normalizeSubstackUrl(url) {
  try {
    const u = new URL(url)
    return `${u.origin}${u.pathname}`
  } catch {
    return url
  }
}

function validateUrl(url) {
  return /^https:\/\/mapainestable\.substack\.com\/p\/.+$/.test(url)
}

// ─── Parseo de frontmatter con soporte para Obsidian [[links]] ────────────────

/**
 * Lee un archivo y parsea el frontmatter tolerando [[links]] de Obsidian.
 * gray-matter falla con valores como: ejes: [[02 - Erosión]], [[03 - X]]
 * Solucion: entrecomillamos las líneas con [[...]] antes de parsear.
 * Retorna { data, raw } donde raw es el contenido original sin modificar.
 */
function readDraftFile(filePath) {
  const raw = readFileSync(filePath, 'utf8')

  // Si no hay frontmatter, parsear directamente
  if (!raw.startsWith('---')) { const p = matter(raw); return { data: p.data, content: p.content, raw } }

  const fmEnd = raw.indexOf('\n---', 4)
  if (fmEnd === -1) { const p = matter(raw); return { data: p.data, content: p.content, raw } }

  const fmText = raw.slice(4, fmEnd)
  const rest   = raw.slice(fmEnd)

  // Entrecomilla los valores de líneas que contienen [[...]] pero que no están ya entre comillas
  const fixedFm = fmText.replace(
    /^(\s*[\w-]+:\s*)(.+\[\[.+)$/gm,
    (_, key, value) => {
      if (value.trimStart().startsWith('"')) return _ // ya está entre comillas
      return key + '"' + value.replace(/"/g, '\\"') + '"'
    }
  )

  try {
    const parsed = matter('---\n' + fixedFm + rest)
    return { data: parsed.data, content: parsed.content, raw }
  } catch {
    // Si aún falla, devuelve datos vacíos con advertencia
    console.warn('⚠️  No se pudo parsear el frontmatter — algunos campos quedarán vacíos.')
    return { data: {}, content: raw, raw }
  }
}

/**
 * Normaliza el objeto data para que tenga los campos que usa el script
 * sin importar si viene de un borrador del agente (Spec 23) o un borrador manual.
 */
function normalizeDraftData(data, filePath) {
  return {
    title:          data.title || basename(filePath, '.md'),
    fecha:          toIsoDate(data.fecha || data['fecha-borrador']),
    lede:           data.lede || data.subtítulo || '',
    eje_principal:  data.eje_principal || null,
    // ejes puede ser array de slugs (agente) o string "[[x]], [[y]]" (manual)
    ejes:           parseEjesField(data.ejes),
    disparador:     data.disparador || null,
    country:        data.country || data.país || '',
    estado:         data.estado || '',
    tipo:           data.tipo || '',
    published_url:  data.published_url || null,
    autores:        parseAutoresField(data.autores),
  }
}

/** Convierte el campo `ejes` a un array normalizado de strings. */
function parseEjesField(ejes) {
  if (!ejes) return []
  if (Array.isArray(ejes)) return ejes.map(String)
  if (typeof ejes === 'string') {
    // Puede ser "[[02 - Erosión]], [[05 - X]]" o un slug simple
    const links = [...ejes.matchAll(/\[\[([^\]]+)\]\]/g)]
    if (links.length > 0) return links.map(m => `[[${m[1]}]]`)
    return [ejes] // slug simple
  }
  return []
}

function parseAutoresField(autores) {
  if (!autores) return []
  if (Array.isArray(autores)) return autores.map(String)
  if (typeof autores === 'string') {
    const links = [...autores.matchAll(/\[\[([^\]]+)\]\]/g)]
    return links.map(m => `[[${m[1]}]]`)
  }
  return []
}

// ─── Funciones de link de eje (soportan slugs y [[links de Obsidian]]) ─────────

function isObsidianLink(v) {
  return typeof v === 'string' && v.startsWith('[[')
}

/** Link de eje para el cuerpo de la publicación (path relativo a 10-Ejes/). */
function ejeBodyLink(eje) {
  if (isObsidianLink(eje)) {
    const inner = eje.slice(2, -2) // "02 - Erosión de las mediaciones"
    return `[[../10-Ejes/${inner}]]`
  }
  const e = EJE_MAP[eje]
  return e ? `[[../10-Ejes/${e.file}]]` : `[[ENN - ${eje}]]`
}

/** Link de eje para el frontmatter (sin ruta relativa, formato Obsidian simple). */
function ejeFrontmatterLink(eje) {
  if (isObsidianLink(eje)) {
    const inner = eje.slice(2, -2)
    // Normaliza el número si empieza con dígito (ej: "02 - Erosión..." → "[[02 - Erosión...]]")
    return `[[${inner}]]`
  }
  const e = EJE_MAP[eje]
  return e ? `[[${e.num} - ${e.name}]]` : `[[ENN - ${eje}]]`
}

/** Link de eje para la tabla del MOC (\| para escapar el pipe en Markdown). */
function ejeMocLink(eje) {
  if (isObsidianLink(eje)) {
    const inner = eje.slice(2, -2)
    // Extrae el alias: todo lo que viene después del primer " - "
    const dashIdx = inner.indexOf(' - ')
    const alias   = dashIdx !== -1 ? inner.slice(dashIdx + 3) : inner
    return `[[../10-Ejes/${inner}\\|${alias}]]`
  }
  const e = EJE_MAP[eje]
  return e ? `[[../10-Ejes/${e.file}\\|${e.alias}]]` : `[[ENN - ${eje}]]`
}

// ─── Borradores disponibles (menú interactivo) ────────────────────────────────

function getDrafts() {
  const files = readdirSync(DRAFTS_DIR).filter(f => f.endsWith('.md'))
  return files
    .map(f => {
      const path     = join(DRAFTS_DIR, f)
      const { data }  = readDraftFile(path)
      const norm      = normalizeDraftData(data, path)
      return { file: f, path, norm }
    })
    .filter(d => d.norm.estado === 'borrador')
}

// ─── Construcción del archivo de publicación ──────────────────────────────────

function buildPublicationFile(norm, draftContent, substackUrl) {
  const { title, fecha, lede, eje_principal, ejes, disparador, country, autores } = norm

  // Ejes completos: principal primero, resto después
  const allEjes = eje_principal
    ? [eje_principal, ...ejes.filter(e => e !== eje_principal)]
    : ejes
  const ejesFm = allEjes.map(ejeFrontmatterLink).join(', ')

  // Sección "Ejes activados"
  const ejesLines = []
  if (eje_principal) {
    ejesLines.push(`- ${ejeBodyLink(eje_principal)} — eje principal`)
  }
  for (const e of ejes) {
    if (e !== eje_principal) ejesLines.push(`- ${ejeBodyLink(e)} *(parcial)*`)
  }
  if (ejesLines.length === 0) ejesLines.push('<!-- TODO: agregar ejes activados -->')

  // Sección "Disparadores"
  let disparadorSection
  if (disparador?.url) {
    const titulo = disparador.titulo || disparador.url
    const medio  = disparador.medio  || ''
    const fdp    = toIsoDate(disparador.fecha_publicacion) || ''
    disparadorSection = `- [${titulo}](${disparador.url})${medio ? ` — ${medio}` : ''}${fdp ? `, ${fdp}` : ''}`
  } else {
    disparadorSection = `<!-- TODO: agregar disparador -->`
  }

  // Sección "Autores citados"
  let autoresSection
  if (autores.length > 0) {
    autoresSection = autores.map(a => `- ${a}`).join('\n')
  } else {
    autoresSection = `*(Sin citas directas a autores en este texto.)*`
  }

  // Notas de contenido — extrae headings ## del cuerpo del borrador
  const headings   = [...draftContent.matchAll(/^## (.+)$/gm)].map(m => m[1])
  const notasLines = headings.length > 0
    ? headings.map((h, i) => `${i + 1}. **${h}** — `)
    : ['<!-- TODO: agregar notas de contenido (una línea por sección del texto) -->']

  const countryLine = country ? `\npaís: ${country.toLowerCase()}` : ''

  const frontmatter = `---
tags: [publicación]
tipo: publicación
estado: publicada${countryLine}
ejes: ${ejesFm}
fecha: ${fecha}
url: ${substackUrl}
título-completo: "${title}"
subtítulo: "${lede.replace(/"/g, '\\"')}"
---`

  const body = `
# ${title}

> *${lede || 'TODO: lede'}*

## Tesis principal

${lede || '<!-- TODO: tesis principal -->'}

## Ejes activados

${ejesLines.join('\n')}

## Disparadores

${disparadorSection}

## Autores citados

${autoresSection}

## Notas de contenido

El texto:
${notasLines.join('\n')}

## Preguntas que dejó abiertas

<!-- TODO: agregar preguntas abiertas -->

## Citas que pueden reaparecer

<!-- TODO: agregar citas reusables -->

## Diálogos posibles con otras publicaciones

<!-- TODO: agregar diálogos -->
`

  return frontmatter + '\n' + body
}

// ─── Marcar borrador como promovido ──────────────────────────────────────────

function markDraftPromoted(draftPath, substackUrl) {
  let raw = readFileSync(draftPath, 'utf8')

  // Reemplaza cualquier valor de `estado:` en el frontmatter → promovido
  raw = raw.replace(/^(estado:\s*)\S+(\s*)$/m, '$1promovido$2')

  // Agrega published_url si no existe
  if (!raw.includes('published_url:')) {
    raw = raw.replace(
      /^(estado:\s*promovido.*)$/m,
      `$1\npublished_url: ${substackUrl}`
    )
  }

  writeFileSync(draftPath, raw, 'utf8')
}

// ─── Actualizar MOC ───────────────────────────────────────────────────────────

function updateMOC(title, fecha, ejePrincipal, ejes) {
  const raw   = readFileSync(MOC_PATH, 'utf8')
  const lines = raw.split('\n')

  let lastTableIdx = -1
  let inTable = false
  for (let i = 0; i < lines.length; i++) {
    if (!inTable && lines[i].startsWith('| #')) { inTable = true }
    if (inTable && lines[i].startsWith('|'))    { lastTableIdx = i }
    if (inTable && !lines[i].startsWith('|') && lastTableIdx !== -1) break
  }

  if (lastTableIdx === -1) {
    console.warn('⚠️  No se encontró la tabla en el MOC — agregar la fila manualmente.')
    return
  }

  const rowCount = lines.filter(l => /^\| \d+/.test(l)).length
  const nextNum  = rowCount + 1

  let ejeLinkStr
  if (ejePrincipal) {
    ejeLinkStr = ejeMocLink(ejePrincipal)
    const resto = ejes.filter(e => e !== ejePrincipal)
    if (resto.length > 0) ejeLinkStr += ' / ' + resto.map(ejeMocLink).join(' / ')
  } else if (ejes.length > 0) {
    ejeLinkStr = ejes.map(ejeMocLink).join(' / ')
  } else {
    ejeLinkStr = '*sin eje*'
  }

  const newRow = `| ${nextNum} | ${formatDateEs(fecha)} | [[${title}]] | publicación | ${ejeLinkStr} |`
  lines.splice(lastTableIdx + 1, 0, newRow)

  writeFileSync(MOC_PATH, lines.join('\n'), 'utf8')
  console.log(`✅ MOC actualizado — fila #${nextNum} agregada`)
}

// ─── Readline helper ──────────────────────────────────────────────────────────

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => {
    rl.question(question, answer => { rl.close(); resolve(answer.trim()) })
  })
}

// ─── Promote ──────────────────────────────────────────────────────────────────

async function promote(draftPath, substackUrl, dryRun = false) {
  if (!existsSync(draftPath)) {
    console.error(`❌ El borrador no existe: ${draftPath}`)
    process.exit(1)
  }

  const { data, content, raw } = readDraftFile(draftPath)
  const norm = normalizeDraftData(data, draftPath)

  if (norm.tipo !== 'borrador-agente') {
    console.warn('⚠️  Borrador manual (no del agente) — algunos placeholders quedarán vacíos.')
  }

  if (norm.estado === 'promovido') {
    console.error(`❌ Este borrador ya fue promovido (estado: promovido).\n   URL publicada: ${norm.published_url || '(sin URL registrada)'}`)
    process.exit(1)
  }

  const url = normalizeSubstackUrl(substackUrl)
  if (!validateUrl(url)) {
    console.error(`❌ URL inválida. Debe ser https://mapainestable.substack.com/p/<slug>\n   Recibido: ${substackUrl}`)
    process.exit(1)
  }

  const title   = norm.title
  const outPath = join(PUBS_DIR, `${title}.md`)

  if (existsSync(outPath)) {
    console.warn(`⚠️  Ya existe un archivo en 50-Publicaciones/ con ese título:\n   ${outPath}`)
    const resp = await ask('¿Sobrescribir? [s/N] ')
    if (resp.toLowerCase() !== 's') { console.log('Cancelado.'); process.exit(0) }
  }

  if (!norm.fecha || !norm.lede) {
    console.warn('⚠️  Frontmatter incompleto — fecha o lede vacíos. Editá el archivo generado.')
  }

  const pubContent = buildPublicationFile(norm, content, url)

  if (dryRun) {
    console.log('\n─── DRY RUN: contenido que se crearía en 50-Publicaciones/ ───\n')
    console.log(pubContent)
    console.log('\n─── DRY RUN: no se escribió nada ───')
    return
  }

  writeFileSync(outPath, pubContent, 'utf8')
  console.log(`✅ Publicación creada: 50-Publicaciones/${title}.md`)

  markDraftPromoted(draftPath, url)
  console.log(`✅ Borrador marcado como promovido: ${basename(draftPath)}`)

  updateMOC(title, norm.fecha, norm.eje_principal, norm.ejes)

  console.log('\n─────────────────────────────────────────')
  console.log(`📄 Publicación  → 50-Publicaciones/${title}.md`)
  console.log(`🔗 URL Substack → ${url}`)
  console.log(`📂 Borrador     → ${basename(draftPath)} (estado: promovido)`)
  console.log('─────────────────────────────────────────')
  console.log('Abrí el archivo nuevo para completar:')
  console.log('  • Tesis principal (reescribir el lede en 1 frase)')
  console.log('  • Notas de contenido (sección por sección)')
  console.log('  • Preguntas abiertas y citas reusables')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args      = process.argv.slice(2)
  const dryRun    = args.includes('--dry-run')
  const draftFlag = args.indexOf('--draft')
  const urlFlag   = args.indexOf('--substack-url')

  if (draftFlag !== -1 && urlFlag !== -1) {
    const draftArg  = args[draftFlag + 1]
    const urlArg    = args[urlFlag + 1]
    const draftPath = /^([A-Z]:|\/)/.test(draftArg) ? draftArg : join(VAULT, draftArg)
    await promote(draftPath, urlArg, dryRun)
    return
  }

  // Modo interactivo — solo lista los de 60-Borradores/diario/
  const drafts = getDrafts()
  if (drafts.length === 0) {
    console.log('No hay borradores con estado: borrador en 60-Borradores/diario/')
    process.exit(0)
  }

  console.log('\n📄 Borradores disponibles:\n')
  drafts.forEach((d, i) => {
    const { title, fecha, country } = d.norm
    console.log(`  ${i + 1}. [${fecha || '?'}] ${country ? country + ' — ' : ''}${title}`)
  })

  const pick = await ask('\nElegí un número (Enter para cancelar): ')
  if (!pick) { console.log('Cancelado.'); process.exit(0) }

  const idx = parseInt(pick, 10) - 1
  if (isNaN(idx) || idx < 0 || idx >= drafts.length) {
    console.error('❌ Número inválido.')
    process.exit(1)
  }

  const chosen   = drafts[idx]
  console.log(`\n→ ${chosen.norm.title}`)

  const urlInput = await ask('URL de Substack (https://mapainestable.substack.com/p/<slug>): ')
  if (!urlInput) { console.log('Cancelado.'); process.exit(0) }

  await promote(chosen.path, urlInput, dryRun)
}

main().catch(e => { console.error('Error inesperado:', e.message); process.exit(1) })
