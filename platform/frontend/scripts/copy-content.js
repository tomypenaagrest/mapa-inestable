// Copia archivos del vault a src/content/ para el build de producción.
// Se ejecuta automáticamente antes de `next build` via el script "prebuild".
const fs = require("fs");
const path = require("path");

const VAULT = path.join(__dirname, "..", "..", "..");
const OUT = path.join(__dirname, "..", "src", "content");

const DIRS = ["15-Países", "60-Borradores", "30-Autores", "35-Conceptos-clave", "50-Publicaciones"];

for (const dir of DIRS) {
  const src = path.join(VAULT, dir);
  const dest = path.join(OUT, dir);

  if (!fs.existsSync(src)) {
    console.warn(`[copy-content] No encontrado: ${src}`);
    continue;
  }

  fs.mkdirSync(dest, { recursive: true });

  for (const file of fs.readdirSync(src)) {
    if (!file.endsWith(".md")) continue;
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
  }

  console.log(`[copy-content] Copiado ${dir} → src/content/${dir}`);
}
