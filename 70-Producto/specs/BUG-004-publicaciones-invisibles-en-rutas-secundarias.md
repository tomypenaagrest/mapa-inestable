# BUG-004 — Publicaciones del vault invisibles en rutas secundarias y en producción

**Estado:** Resuelto  
**Detectado:** 2026-05-11  
**Afecta:** `/ejes/[slug]`, `CommandPalette`, header de layout, `copy-content.js` (prebuild de Vercel)

---

## Síntoma

Tras implementar Spec 26 (carga de publicaciones desde el vault), las publicaciones aparecen correctamente en `/analisis`, `/pais/[slug]` y `/publicaciones/[slug]` — pero quedan invisibles en cuatro lugares:

1. **`/ejes/[slug]`** — la sección "Publicaciones" de cada eje aparece vacía.
2. **CommandPalette** (búsqueda por `/`) — la pestaña "Análisis" no retorna resultados.
3. **Header del sitio** — la franja de "países activos esta semana" aparece vacía.
4. **Vercel (producción)** — ninguna ruta muestra publicaciones porque el prebuild no copia `50-Publicaciones/` al directorio `src/content/`.

## Causa raíz

### Rutas secundarias (1–3)

Todas estas rutas seguían leyendo de `ANALISIS_ALL`, el array vacío heredado de antes de Spec 26:

```typescript
// lib/analisis.ts
export const ANALISIS_ALL: AnalisisEntry[] = [];
```

Spec 26 conectó `/analisis` y `/pais/[slug]` a `getAllPublications()`, pero no actualizó las rutas secundarias.

### Vercel (4)

El script `scripts/copy-content.js` copia el vault al contenedor de build, pero `50-Publicaciones` no estaba en la lista:

```js
const DIRS = ["15-Países", "60-Borradores", "30-Autores", "35-Conceptos-clave"];
// ↑ faltaba "50-Publicaciones"
```

`getAllPublications()` tiene un guard `if (!existsSync) return []`, por lo que el build no falla — simplemente no muestra nada en producción.

## Fix aplicado

### 1. `scripts/copy-content.js`

Agregado `"50-Publicaciones"` al array `DIRS`.

### 2. `src/app/ejes/[slug]/page.tsx`

Reemplazado `ANALISIS_ALL.filter(...)` por `getAllPublications()` con mapeo a la forma local. Hrefs actualizados a `/publicaciones/${slug}`.

### 3. `src/app/layout.tsx`

Reemplazado `ANALISIS_ALL` por `getAllPublications()` en `getWeeklyCountries()` y `getCurrentWeekInfo()`. Las publicaciones serializadas se pasan como prop a `CommandPalette`.

### 4. `src/components/CommandPalette.tsx`

Ahora acepta `publications: PubSearchItem[]` como prop. El tab "Análisis" busca sobre esas publicaciones y navega a `/publicaciones/${slug}`.

## Fuera de scope

- **`/leer-despues`** — la función de guardado (★) todavía no existe en las páginas de publicaciones. La página se mantiene funcional pero vacía hasta que se agregue el botón ★ en `/publicaciones/[slug]`.
