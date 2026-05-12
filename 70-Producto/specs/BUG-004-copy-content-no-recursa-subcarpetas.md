# BUG-004 — `copy-content.js` no recursa en subcarpetas, agendas y diarios no llegan al build

**Severidad:** alta — bloquea visibilidad pública de las agendas (Spec 27/28) y de los borradores diarios (Spec 32).
**Reportado:** 2026-05-11
**Área:** `platform/frontend/scripts/copy-content.js`
**Estado:** Fix aplicado al archivo local; pendiente de commit + push + redeploy de Vercel.

---

## Síntoma

`/pais/ar?tab=agenda` (y los otros 9 países) muestra el placeholder de Spec 27 §5:

```
AGENDA — PENDIENTE DE CARGA

Las agendas de este país todavía no están cargadas en el vault. Para activarlas, crear el archivo:

15-PAÍSES/AGENDAS/?.MD

con el frontmatter especificado en SPEC 27.
```

A pesar de que los 10 archivos `15-Países/agendas/{ar,bo,br,cl,co,ec,py,pe,uy,ve}.md` existen y están bien formados (verificado por `lib/agendas.ts` con `getCountryAgenda(slug)` corriendo localmente con el vault completo).

Por el mismo motivo, `/analisis/borradores` (Spec 32, recién marcada como implementada) probablemente se ve vacía o stale en producción — los 10 borradores diarios en `60-Borradores/diario/` no se copian al build.

## Reproducción

1. Tener el vault con `15-Países/agendas/ar.md` poblado y válido.
2. Correr `cd platform/frontend && node scripts/copy-content.js` con el script original.
3. Inspeccionar `platform/frontend/src/content/15-Países/`.
4. Observar: están `Argentina.md`, `Bolivia.md`, etc., pero **no existe la subcarpeta `agendas/`**.
5. Hacer `next build` y desplegar.
6. Visitar `/pais/ar?tab=agenda` → placeholder.

## Causa raíz

`platform/frontend/scripts/copy-content.js` itera `DIRS = ["15-Países", "60-Borradores", ...]` y para cada uno hace:

```js
for (const file of fs.readdirSync(src)) {
  if (!file.endsWith(".md")) continue;
  fs.copyFileSync(path.join(src, file), path.join(dest, file));
}
```

`readdirSync` lista entries de primer nivel únicamente. **El script ignora subdirectorios.** Como `15-Países/agendas/` y `60-Borradores/diario/` son subcarpetas, sus archivos `.md` nunca se copian a `src/content/`.

`lib/agendas.ts` y `lib/content.ts` (`getAllAgentDrafts`) leen del vault que en producción resuelve a `platform/frontend/src/content/`, no al vault de OneDrive (Vercel no tiene acceso al filesystem del autor). Resultado: lookup falla, fallback al placeholder.

## Fix aplicado

Reescritura del script para recursar en subdirectorios con skip de carpetas privadas (las que empiezan con `_`, convención Obsidian + buena higiene para no contaminar el build con `_archive/`, `_Comparativo`, etc.).

Diff conceptual:

```js
// ANTES
for (const dir of DIRS) {
  // ... readdirSync de primer nivel solo
}

// DESPUÉS
function copyMdRecursive(src, dest) {
  if (!fs.existsSync(src)) { console.warn(...); return 0; }
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
  const n = copyMdRecursive(path.join(VAULT, dir), path.join(OUT, dir));
  console.log(`[copy-content] Copiado ${dir} -> src/content/${dir} (${n} archivos)`);
}
```

El archivo `platform/frontend/scripts/copy-content.js` ya tiene este cambio aplicado. Verificación local exitosa: corrida del script produce 21 archivos en `15-Países/` (11 países + 10 agendas) y 35 archivos en `60-Borradores/` (incluyendo los 10 diarios + 10 borradores de agenda).

## Criterios de aceptación

- [ ] `platform/frontend/src/content/15-Países/agendas/` existe con los 10 archivos `<slug>.md`.
- [ ] `platform/frontend/src/content/60-Borradores/diario/` existe con los borradores del agente.
- [ ] Carpetas privadas (`_archive`, `_Comparativo`, etc.) NO aparecen en `src/content/`.
- [ ] `next build` completa sin errores tras la corrida del nuevo `copy-content.js`.
- [ ] En producción, `/pais/ar?tab=agenda` muestra las 5 agendas argentinas con flechas de tendencia y queries de Google News funcionales (no el placeholder).
- [ ] En producción, `/analisis/borradores` muestra los ~10 borradores diarios listados con país, fecha, título y lede.
- [ ] Click en un ítem de agenda abre Google News geolocalizado al país (verificar con `gl=AR&ceid=AR:es-419` en la URL para Argentina).

## Pasos para cerrar

1. Confirmar el cambio en `platform/frontend/scripts/copy-content.js` (ya aplicado).
2. Decidir si `platform/frontend/src/content/` está en git o gitignored:
   - Si está en git: `git add platform/frontend/scripts/copy-content.js platform/frontend/src/content/` y commit.
   - Si está gitignored: solo `git add platform/frontend/scripts/copy-content.js` — el prebuild de Vercel lo regenera. Pero atención: si Vercel buildea sin acceso al vault de Obsidian, el prebuild no encuentra los archivos fuente. Verificar la cadena de deploy.
3. `git push`.
4. Esperar redeploy de Vercel.
5. Validar criterios de aceptación en el sitio vivo.

## Notas

- **Detalle adicional sin impacto bloqueante:** el script no limpia `src/content/` antes de copiar, así que archivos previamente copiados (como `_Comparativo - sistema de partidos.md` que entró cuando el script no tenía el skip de `_`) quedan en el destino aunque ya no se vuelvan a copiar. Para limpieza estricta, agregar `fs.rmSync(OUT, { recursive: true, force: true })` al inicio del script. Opcional.

- **Bug colateral cerrado por el mismo fix:** Spec 32 (vista pública de borradores diarios) que se acaba de marcar como implementada también dependía de esto — los borradores en `60-Borradores/diario/` no llegaban al build. Con el fix, también queda funcional sin trabajo adicional.

- **Por qué tardamos en detectarlo:** la convención de subcarpetas dentro de carpetas numeradas (`15-Países/agendas/`, `60-Borradores/diario/`) entró en el proyecto con Specs 23 y 27. Hasta entonces todas las carpetas top-level del vault tenían sus `.md` de primer nivel y nada más, así que `copy-content.js` original alcanzaba. La regresión apareció con el primer uso de subcarpetas, no se anticipó cuando se escribió el script.

- **Dependencias afectadas:** Spec 27 (tab Agenda), Spec 32 (borradores diarios públicos), Spec 33 (panel lateral con agendas). Las tres dependían en última instancia de que el vault llegue al frontend, lo cual este fix garantiza.
