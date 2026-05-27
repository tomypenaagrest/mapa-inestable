import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const VAULT_PORTADAS = process.env.VAULT_ROOT
  ? join(process.env.VAULT_ROOT, '90-Portadas')
  : join(__dirname, '..', '..', '..', '90-Portadas')

const FRONTEND_COVERS = join(__dirname, '..', 'public', 'covers')

function walkAndCopy(src, dst) {
  if (!existsSync(src)) return
  mkdirSync(dst, { recursive: true })
  for (const entry of readdirSync(src)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue
    const s = join(src, entry)
    const d = join(dst, entry)
    if (statSync(s).isDirectory()) walkAndCopy(s, d)
    else if (/\.(png|jpe?g|webp)$/i.test(entry)) copyFileSync(s, d)
  }
}

if (existsSync(VAULT_PORTADAS)) {
  if (existsSync(FRONTEND_COVERS)) rmSync(FRONTEND_COVERS, { recursive: true, force: true })
  walkAndCopy(VAULT_PORTADAS, FRONTEND_COVERS)
}

const diarioDir = join(FRONTEND_COVERS, 'diario')
const copied = existsSync(diarioDir)
  ? readdirSync(diarioDir).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).length
  : 0
console.log(`[sync-covers] OK — ${copied} imagen(es) en covers/diario/`)
