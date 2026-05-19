// Copia archivos del vault a src/content/ para el build de produccion.
// Se ejecuta automaticamente antes de `next build` via el script "prebuild".
//
// Comportamiento:
// - Recurre subdirectorios (necesario para 15-Paises/agendas/, 60-Borradores/diario/, etc.)
// - Solo copia archivos .md
// - Skipea archivos/carpetas que empiezan con "_" para no contaminar el sitio publico
const fs = require("fs");
const path = require("path");

const VAULT = path.join(__dirname, "..", "..", "..");
const OUT = path.join(__dirname, "..", "src", "content");

const DIRS = ["15-Países", "60-Borradores", "30-Autores", "35-Conceptos-clave", "50-Publicaciones", "70-Producto/lecturas-capas"];

function copyMdRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy-content] No encontrado: ${src}`);
    return 0;
  }
  fs.mkdirSync(dest, { recursive: true });

  let count = 0;
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith("_")) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyMdRecursive(srcPath, destPath);
    } else if (entry.name.endsWith(".md")) {
      fs.copyFileSync(srcPath, destPath);
      count += 1;
    }
  }
  return count;
}

for (const dir of DIRS) {
  const src = path.join(VAULT, dir);
  const dest = path.join(OUT, dir);
  const n = copyMdRecursive(src, dest);
  console.log(`[copy-content] Copiado ${dir} -> src/content/${dir} (${n} archivos)`);
}
