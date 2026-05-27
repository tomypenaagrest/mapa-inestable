import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const VAULT_PORTADAS = process.env.VAULT_ROOT
  ? join(process.env.VAULT_ROOT, '90-Portadas')
  : join(__dirname, '..', '..', '..', '90-Portadas')

const FRONTEND_COVERS = join(__dirname, '..', 'public', 'covers')

// Intenta cargar sharp para conversión PNG→WebP (quality 80, ~50% menos peso)
let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  // sharp no disponible, conversión WebP omitida
}

async function walkAndCopy(src, dst) {
  if (!existsSync(src)) return
  mkdirSync(dst, { recursive: true })
  for (const entry of readdirSync(src)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue
    const s = join(src, entry)
    const d = join(dst, entry)
    if (statSync(s).isDirectory()) {
      await walkAndCopy(s, d)
    } else if (/\.(png|jpe?g|webp)$/i.test(entry)) {
      copyFileSync(s, d)
      if (sharp && /\.png$/i.test(entry)) {
        const webpDest = d.replace(/\.png$/i, '.webp')
        await sharp(s).webp({ quality: 80 }).toFile(webpDest)
      }
    }
  }
}

if (existsSync(VAULT_PORTADAS)) {
  if (existsSync(FRONTEND_COVERS)) rmSync(FRONTEND_COVERS, { recursive: true, force: true })
  await walkAndCopy(VAULT_PORTADAS, FRONTEND_COVERS)
}

const diarioDir = join(FRONTEND_COVERS, 'diario')
const pngCount = existsSync(diarioDir)
  ? readdirSync(diarioDir).filter(f => /\.(png|jpe?g)$/i.test(f)).length
  : 0
const webpCount = existsSync(diarioDir)
  ? readdirSync(diarioDir).filter(f => /\.webp$/i.test(f)).length
  : 0
const suffix = sharp ? ` + ${webpCount} WebP` : ' (sharp no disponible, WebP omitido)'
console.log(`[sync-covers] OK — ${pngCount} PNG(s) en covers/diario/${suffix}`)
