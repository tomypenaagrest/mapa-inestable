// Sincroniza paises-poligonos.json del vault al frontend.
// Uso: node scripts/sync-polygons.mjs
// Se ejecuta automáticamente antes de `next dev` y `next build` via predev/prebuild.
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, chmodSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const VAULT_JSON = process.env.VAULT_ROOT
  ? join(process.env.VAULT_ROOT, "70-Producto", "design-system", "mapa", "paises-poligonos.json")
  : join(__dirname, "..", "..", "..", "70-Producto", "design-system", "mapa", "paises-poligonos.json");

const DEST_DIR  = join(__dirname, "..", "src", "data");
const DEST_JSON = join(DEST_DIR, "paises-poligonos.json");

if (!existsSync(VAULT_JSON)) {
  console.warn(`[sync-polygons] No encontrado: ${VAULT_JSON} — se usa la copia existente`);
  process.exit(0);
}

mkdirSync(DEST_DIR, { recursive: true });
const content = readFileSync(VAULT_JSON, "utf-8");
// Elimina primero si existe y es de solo lectura (puede ocurrir en entornos OneDrive/Windows)
if (existsSync(DEST_JSON)) {
  try { chmodSync(DEST_JSON, 0o644); } catch { /* ignore */ }
}
writeFileSync(DEST_JSON, content, { encoding: "utf-8", mode: 0o644 });
console.log(`[sync-polygons] OK — ${DEST_JSON}`);
