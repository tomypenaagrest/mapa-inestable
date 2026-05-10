---
spec: 22
tipo: bug
titulo: Dashboard de país muestra "sin publicaciones" aunque existen análisis
estado: pendiente-fix
autor: Tomás (con Claude)
fecha: 2026-05-09
afecta: [/pais/[slug], CountryDashboard, country-data.ts]
prioridad: alta
---

# 22 · Bug — Dashboard de país muestra "sin publicaciones" aunque existen análisis

## Síntoma

El dashboard de Uruguay (`/pais/uy`) muestra el tab "Publicaciones" vacío — "0 análisis" — aunque en `ANALISIS_ALL` existen dos entradas publicadas:

- `la-cubierta-donde-no-se-esperaba` (2026-05-08, sem 18)
- `el-frente-sin-mayoria` (2026-04-05, sem 14)

El problema no es exclusivo de Uruguay: afecta a todos los países con entradas en `ANALISIS_ALL` que no fueron copiadas manualmente a `COUNTRY_ANALYSES`.

---

## Causa raíz

Existen **dos fuentes de datos para los análisis**, y no están sincronizadas:

| Fuente | Archivo | Descripción |
|---|---|---|
| `ANALISIS_ALL` | `src/lib/analisis.ts` | Array completo con el contenido full de cada análisis (steps, footnotes, etc.). Es la fuente canónica. |
| `COUNTRY_ANALYSES` | `src/lib/country-data.ts` | Record estático por país con resúmenes de análisis. Se mantiene **a mano**, independientemente de `ANALISIS_ALL`. |

El page de país (`src/app/pais/[slug]/page.tsx`, línea 46) pasa `COUNTRY_ANALYSES[slug]` como prop `analyses` al `CountryDashboard`. No consulta `ANALISIS_ALL`.

### Estado actual de `COUNTRY_ANALYSES` (country-data.ts línea 173):

```ts
export const COUNTRY_ANALYSES: Record<string, AnalysisSummary[]> = {
  ar: [],   // vacío — tiene 2 en ANALISIS_ALL
  br: [],   // vacío — tiene 3 en ANALISIS_ALL
  co: [     // 3 entradas, pero 2 no existen en ANALISIS_ALL (datos fantasma)
    { slug: "la-sospecha-antes-del-voto", ... },   // ✓ existe
    { slug: "petro-y-los-territorios", ... },       // ✗ no existe en ANALISIS_ALL
    { slug: "reforma-laboral-colombia", ... },      // ✗ no existe en ANALISIS_ALL
  ],
  cl: [],   // vacío — tiene 2 en ANALISIS_ALL
  bo: [],   // vacío — tiene 1 en ANALISIS_ALL
  pe: [],   // vacío — tiene 1 en ANALISIS_ALL
  uy: [],   // vacío — tiene 2 en ANALISIS_ALL  ← el caso reportado
  py: [],   // vacío — tiene 1 en ANALISIS_ALL
  ec: [],   // vacío — tiene 1 en ANALISIS_ALL
  ve: [],   // vacío — tiene 2 en ANALISIS_ALL
};
```

El problema es estructural: cada vez que se agrega un análisis a `ANALISIS_ALL`, hay que copiarlo también a `COUNTRY_ANALYSES`. Si se olvida, el dashboard del país lo oculta.

---

## Países afectados

Todos menos Colombia (que tiene entradas en ambos lados, aunque con datos fantasma):

| País | Análisis en ANALISIS_ALL | En COUNTRY_ANALYSES | Resultado |
|---|---|---|---|
| Argentina | 2 | 0 | Vacío |
| Brasil | 3 | 0 | Vacío |
| Colombia | 3 | 3 (2 fantasma) | Muestra 3 pero 2 son erróneos |
| Chile | 2 | 0 | Vacío |
| Bolivia | 1 | 0 | Vacío |
| Perú | 1 | 0 | Vacío |
| **Uruguay** | **2** | **0** | **Vacío — caso reportado** |
| Paraguay | 1 | 0 | Vacío |
| Ecuador | 1 | 0 | Vacío |
| Venezuela | 2 | 0 | Vacío |

---

## Fix — derivar COUNTRY_ANALYSES desde ANALISIS_ALL

La solución es eliminar `COUNTRY_ANALYSES` como fuente independiente y construirlo derivado de `ANALISIS_ALL`. Una sola fuente de verdad.

### Paso 1 — Agregar utilidad en `analisis.ts`

```ts
// src/lib/analisis.ts

import type { AnalysisSummary } from "./country-data";

export function getAnalysesByCountry(slug: string): AnalysisSummary[] {
  return ANALISIS_ALL
    .filter(a => a.countrySlug === slug)
    .map(a => ({
      slug:    a.slug,
      title:   a.title,
      axis:    a.axisName,
      axisKey: a.axisKey,
      date:    a.published_at,
      week:    a.week,
      year:    a.year,
    }));
}
```

### Paso 2 — Actualizar `pais/[slug]/page.tsx`

Reemplazar la línea:

```ts
// ANTES (línea 46)
const analyses = COUNTRY_ANALYSES[slug] ?? [];
```

por:

```ts
// DESPUÉS
import { getAnalysesByCountry, ANALISIS_ALL } from "@/lib/analisis";
// ...
const analyses = getAnalysesByCountry(slug);
```

### Paso 3 — Eliminar `COUNTRY_ANALYSES` de `country-data.ts`

Borrar el bloque completo (líneas 171–188 de `country-data.ts`), la interfaz `AnalysisSummary` si no se usa en otros lugares, y el import en `pais/[slug]/page.tsx`.

> **Nota:** `AnalysisSummary` se define en `country-data.ts` y se usa en `CountryDashboard.tsx`. Si se elimina de `country-data.ts`, moverla a `analisis.ts` junto con `getAnalysesByCountry`.

### Paso 4 — Limpiar import en page.tsx

```ts
// Eliminar del import:
import {
  COUNTRY_EJES,
  COUNTRY_SOURCES,
  COUNTRY_ANALYSES,   // ← eliminar esta línea
  COUNTRY_NAMES,
} from "@/lib/country-data";
```

---

## Impacto del fix

- El tab "Publicaciones" de todos los países muestra automáticamente los análisis de `ANALISIS_ALL`.
- Agregar un análisis nuevo a `ANALISIS_ALL` lo hace aparecer inmediatamente en el dashboard del país correspondiente, sin ningún paso extra.
- Colombia deja de mostrar los 2 análisis fantasma que existían en `COUNTRY_ANALYSES` pero no en `ANALISIS_ALL`.
- `COUNTRY_ANALYSES` deja de existir: una sola fuente de verdad.

---

## Riesgo del fix

Bajo. El cambio es quirúrgico: reemplaza un lookup de tabla estática por un filter sobre `ANALISIS_ALL`. El tipo de retorno es idéntico (`AnalysisSummary[]`). El `CountryDashboard` no necesita cambios.

El único cuidado: `AnalysisSummary` vive en `country-data.ts`. Si se mueve a `analisis.ts`, verificar que todos los importadores actualizan el path.

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/lib/analisis.ts` | Agregar función `getAnalysesByCountry` + mover tipo `AnalysisSummary` |
| `src/lib/country-data.ts` | Eliminar `COUNTRY_ANALYSES` + eliminar `AnalysisSummary` |
| `src/app/pais/[slug]/page.tsx` | Reemplazar `COUNTRY_ANALYSES[slug]` por `getAnalysesByCountry(slug)` |
| `src/components/CountryDashboard.tsx` | Actualizar path del import `AnalysisSummary` (si se mueve) |
