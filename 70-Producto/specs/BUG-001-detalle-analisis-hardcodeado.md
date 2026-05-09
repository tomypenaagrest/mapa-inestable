# BUG-001 — La página de detalle de análisis renderiza siempre "La sospecha antes del voto"

**Severidad:** alta — el archivo es navegable pero el contenido no se puede leer.
**Reportado:** 2026-05-09
**Área:** `platform/frontend` — ruta `/analisis/[pais]/[slug]`

---

## Síntoma

Desde el listado de `/analisis` (Archivo), al hacer click en cualquier análisis (ej. "El revés de la motosierra" — `/analisis/ar/el-reves-de-la-motosierra`) se abre el detalle de **"La sospecha antes del voto"** (Colombia).

El título de la pestaña del navegador sí cambia al título correcto del análisis clickeado (porque `generateMetadata` lo resuelve bien), pero el `<h1>`, el lede, el país, el eje, los 4 pasos, la fuente y todo el cuerpo son los de "La sospecha antes del voto".

## Reproducción

1. Levantar el frontend (`platform/frontend`).
2. Ir a `/analisis`.
3. Filtrar por **Eje → Erosión de mediaciones** y **Año → 2026** (replica el screenshot del reporte).
4. Click en **"El revés de la motosierra"** (Argentina, 19 abr 2026).
5. Observar la URL: navega a `/analisis/ar/el-reves-de-la-motosierra` ✅
6. Observar el contenido: muestra "La sospecha antes del voto" ❌

Reproduce con cualquier otro slug (`/analisis/uy/la-cubierta-donde-no-se-esperaba`, `/analisis/cl/la-constitucion-que-no-fue`, etc.).

## Causa raíz

`platform/frontend/src/app/analisis/[pais]/[slug]/page.tsx` (líneas 200–202):

```tsx
export default function AnalisisPage() {
  const a = MOCK_ANALYSIS;          // ← hardcodeado
  const axisColor = `var(--mi-axis-${a.axisKey})`;
  ...
}
```

El componente nunca recibe ni usa `params`. El objeto `MOCK_ANALYSIS` (líneas 49–68 del mismo archivo) es literalmente "La sospecha antes del voto", así que cualquier ruta que matchee `[pais]/[slug]` cae en él.

`generateMetadata` (líneas 6–20) sí está bien: hace `ANALISIS_ALL.find(x => x.slug === slug)` y por eso el título del tab y el OG son correctos. Esa diferencia es la pista que hace obvio el bug.

## Fix sugerido

1. Convertir `AnalisisPage` en `async` y recibir `params: Promise<{ pais: string; slug: string }>` (mismo patrón que `generateMetadata`).
2. Resolver el análisis con `ANALISIS_ALL.find(x => x.countrySlug === pais && x.slug === slug)`. Filtrar por **ambos** (no solo `slug`) para que dos análisis con slug repetido en países distintos no colisionen.
3. Si no hay match → `notFound()` de `next/navigation`.
4. Eliminar (o mover a un fixture de tests) el bloque `MOCK_ANALYSIS` y el tipo `Analysis` local — el shape de `AnalisisEntry` en `lib/analisis.ts` ya cubre los campos del cuerpo (`step_disparador`, `step_desplazamiento`, `step_conceptualizacion`, `step_apertura`, `country`, `countrySlug`, `axisName`, `axisKey`, `title`, `lede`, `published_at`).
5. **Atención:** `MOCK_ANALYSIS` tiene campos que `AnalisisEntry` **no** tiene: `source_primary` (URL, medio, autor) y `reading_time_min`. Hoy el bloque `<CitationBlock>` y el header dependen de eso. Dos opciones:
   - **(A)** Extender `AnalisisEntry` en `lib/analisis.ts` con `source_primary` y `reading_time_min` y completarlos para los 20 análisis (faltan datos reales hoy).
   - **(B)** Renderizar `<CitationBlock>` y el `min de lectura` solo cuando existan; en los análisis donde no hay fuente cargada, ocultar el bloque y mostrar un placeholder discreto ("Fuente pendiente").
   - Recomendación: **(B)** primero (no bloqueante), y abrir un follow-up para completar fuentes — encaja con el requisito no-negociable de citas del `CLAUDE.md`.
6. Considerar agregar `generateStaticParams` para pre-renderizar las rutas de los análisis existentes (perf + SEO).

## Criterios de aceptación

- [ ] Click en cualquier card del Archivo abre el detalle correcto (título, país, eje, 4 pasos, fecha).
- [ ] `/analisis/ar/el-reves-de-la-motosierra` muestra "El revés de la motosierra" con país Argentina y eje Erosión de mediaciones.
- [ ] `/analisis/co/la-sospecha-antes-del-voto` sigue funcionando (no romper el caso que hoy "anda").
- [ ] Una ruta inexistente (ej. `/analisis/ar/foo-bar`) devuelve 404, no el mock.
- [ ] El breadcrumb y el aside (País, Eje, Fuente) reflejan el análisis real.
- [ ] No queda referencia a `MOCK_ANALYSIS` en el código de prod.

## Notas

- El listado (`AnalisisContent.tsx`) construye los hrefs bien: `/analisis/${a.countrySlug}/${a.slug}` (líneas 111 y 131). El bug es 100% del lado de la página de detalle.
- El proyecto está en transición de Substack a plataforma propia y el detalle es la vista principal de lectura — priorizar.
