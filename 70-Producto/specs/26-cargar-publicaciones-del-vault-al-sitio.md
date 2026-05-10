---
spec: 26
titulo: Cargar publicaciones del vault al sitio (50-Publicaciones → /analisis, /pais)
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-10
afecta: [/analisis, /pais/[slug], platform/frontend/src/lib/content.ts, platform/frontend/src/lib/analisis.ts, platform/frontend/src/app/analisis/AnalisisContent.tsx, platform/frontend/src/app/analisis/[pais]/[slug]/page.tsx, platform/frontend/src/components/CountryDashboard.tsx]
depende_de: []
relaciona_con: [Spec 23 (frontmatter agente), Spec 24 (promover), Spec 25 (pipeline)]
prioridad: alta
bloquea_a: el sitio mostrando contenido real
---

# 26 · Cargar publicaciones del vault al sitio

## Resumen ejecutivo

Hoy el sitio tiene **un agujero crítico**: las 11 publicaciones reales del Substack viven en `50-Publicaciones/*.md` con frontmatter completo (URL, fecha, ejes, subtítulo), pero **ninguna ruta del sitio las muestra**. La pieza `/analisis` está vacía (después de vaciar `ANALISIS_ALL` en `lib/analisis.ts`), `/pais/[slug]` también muestra "0 análisis", y la única vista que funciona con publicaciones reales era el archivo hardcodeado de fixtures que sacamos.

Esta spec implementa la lectura dinámica de `50-Publicaciones/*.md` y la enchufa en las rutas que ya existen, manteniendo `ANALISIS_ALL` vacío como queda hoy. Misma arquitectura que `getAllAgentDrafts()` (Spec implementada el 2026-05-10): leer el vault como filesystem, parsear frontmatter, devolver entries tipadas.

**Resuelve:** que el sitio refleje la realidad del Substack en vez de quedar vacío.

---

## Estado actual

### Lo que hay en el vault

11 archivos en `50-Publicaciones/` (más 1 nota-disparador y 1 MOC). Cada publicación tiene frontmatter:

```yaml
---
tags: [publicación]
tipo: publicación        # también: despacho, nota-disparador
estado: publicada
ejes: [[03 - Desrepresentación]]
fecha: 2025-06-01
url: https://mapainestable.substack.com/p/reforma-laboral-en-colombia
subtítulo: "Debate del siglo XXI, soluciones del siglo XX"
título-completo: "Reforma laboral en Colombia: Debate del siglo XXI, soluciones del siglo XX"
---
```

Y un cuerpo con secciones canónicas (Tesis principal, Ejes activados, Disparadores, Autores citados, Notas de contenido, Preguntas que dejó abiertas, Citas que pueden reaparecer, Diálogos con otras publicaciones).

### Lo que pasa en el sitio

- `lib/analisis.ts` exporta `ANALISIS_ALL: AnalisisEntry[] = []` (vaciado para sacar fixtures).
- `app/analisis/page.tsx` y `AnalisisContent.tsx` consumen `ANALISIS_ALL` → archivo vacío.
- `app/analisis/[pais]/[slug]/page.tsx` consume `ANALISIS_ALL` → 404 para todo.
- `app/pais/[slug]/page.tsx` llama `getAnalysesByCountry(slug)` que filtra `ANALISIS_ALL` → tab "Publicaciones" vacío.
- `/analisis/borradores` sí funciona, lee de `60-Borradores/diario/` (esto es lo agregado hoy).

---

## Propuesta

### 1. Nueva función `getAllPublications()` en `lib/content.ts`

Análoga a `getAllAgentDrafts()`. Lee `50-Publicaciones/*.md`, ignora el MOC y notas-disparador, parsea frontmatter con gray-matter, devuelve un array tipado.

```ts
const PUBLICATIONS_DIR = path.join(VAULT_ROOT, "50-Publicaciones");
const PUBLICATIONS_SKIP = new Set([
  "Publicaciones - MOC.md",
]);

export interface PublicationMeta {
  slug:        string;       // derivado del filename (kebab-case)
  filename:    string;
  title:       string;
  subtitle?:   string;
  fullTitle?:  string;
  tipo:        "publicacion" | "despacho" | "nota-disparador";
  estado:      "publicada" | "incluida-en-despacho";
  fecha:       string;       // YYYY-MM-DD
  year:        number;
  url:         string;       // del frontmatter, link al Substack
  ejes:        string[];     // ["deculturacion", "atencion", ...]
  ejePrincipal: string;
  countrySlug?: string;      // si aplica (ej. Reforma laboral en Colombia → "co")
  tags:        string[];
}

export interface Publication extends PublicationMeta {
  html:       string;        // cuerpo renderizado
  thesis:     string;        // sección "Tesis principal" (si existe)
  citations:  string[];      // citas reusables (sección "Citas que pueden reaparecer")
}

export function getAllPublications(): PublicationMeta[];
export function getPublicationBySlug(slug: string): Publication | null;
export function getPublicationsByCountry(countrySlug: string): PublicationMeta[];
```

**Parsing reglas:**

- `slug` = `slugify(filename sin .md)`
- `title` = primer `# ` del cuerpo (no del frontmatter, porque el frontmatter no tiene `title:`)
- `subtitle` = del frontmatter `subtítulo:`
- `fullTitle` = del frontmatter `título-completo:` si existe
- `ejes` parsea los Obsidian links: `[[01 - Deculturación]]` → `"deculturacion"`. Hay que mapear el número o el nombre al `axisKey`.
  - Mapeo: `01 → deculturacion`, `02 → mediaciones`, `03 → desrepresentacion`, `04 → estetizacion`, `05 → desorientacion`, `06 → atencion`.
- `ejePrincipal` = primer eje del array
- `countrySlug` = si el título matchea `<Algo> en <País>` o el frontmatter tiene `país:`/`country:` (algunos sí, ej. Colombia: la sospecha antes del voto). Si no, undefined.
- `thesis` = extraer la sección `## Tesis principal` del cuerpo
- `citations` = extraer los blockquotes (`> ...`) de la sección `## Citas que pueden reaparecer`

**Saltos seguros:**

Si un archivo no parsea (frontmatter inválido, faltan campos), **log warning y skip** — nunca crashear el build.

### 2. Mapear `PublicationMeta` a `AnalisisEntry` (para no romper componentes existentes)

`AnalisisContent.tsx` y otros consumen `AnalisisEntry`. Mantener la estructura actual y crear un adaptador:

```ts
// lib/analisis.ts
import { getAllPublications, type PublicationMeta } from "./content";

function publicationToAnalisisEntry(p: PublicationMeta): AnalisisEntry | null {
  if (!p.countrySlug) return null;  // no se puede mostrar sin país asociado
  return {
    slug: p.slug,
    countrySlug: p.countrySlug,
    country: COUNTRY_NAMES[p.countrySlug] ?? p.countrySlug,
    axisSlug: AXIS_KEY_TO_SLUG[p.ejePrincipal] ?? p.ejePrincipal,
    axisKey: p.ejePrincipal,
    axisName: AXIS_NAMES[p.ejePrincipal] ?? p.ejePrincipal,
    title: p.title,
    lede: p.subtitle ?? p.thesis ?? "",
    published_at: formatDateEs(p.fecha),
    published_iso: p.fecha,
    year: p.year,
    week: weekOf(p.fecha),
    step_disparador: "",          // las publicaciones del Substack no siguen el formato 4-pasos
    step_desplazamiento: "",
    step_conceptualizacion: "",
    step_apertura: "",
    // marcar la entrada como publicación-substack para que la UI pueda decidir cómo renderizarla
  };
}

// Reemplazar el array hardcodeado vacío:
export const ANALISIS_ALL: AnalisisEntry[] = getAllPublications()
  .map(publicationToAnalisisEntry)
  .filter((e): e is AnalisisEntry => e !== null);
```

**Pero ojo:** `lib/analisis.ts` se importa en client components (`AnalisisContent.tsx` tiene `"use client"`). Las funciones de `lib/content.ts` usan `fs` que no funciona en cliente.

**Solución:** mover la lectura a server-side. `app/analisis/page.tsx` (server) llama `getAllPublications()` y pasa el array al `AnalisisContent` por props. `AnalisisContent` deja de importar `ANALISIS_ALL`.

Cambios concretos:

| Archivo | Antes | Después |
|---|---|---|
| `app/analisis/page.tsx` | importa `AnalisisContent`, no le pasa nada | llama `getAllPublications()`, mapea a `AnalisisEntry`, pasa como prop `analyses={...}` |
| `app/analisis/AnalisisContent.tsx` | importa `ANALISIS_ALL` desde `@/lib/analisis` | recibe `analyses: AnalisisEntry[]` por props |
| `app/analisis/[pais]/[slug]/page.tsx` | usa `ANALISIS_ALL.find(...)` | usa `getPublicationBySlug(slug)` y `getPublicationsByCountry(pais)` |
| `app/pais/[slug]/page.tsx` | usa `getAnalysesByCountry()` (filtra `ANALISIS_ALL`) | reemplaza por nueva `getPublicationsByCountrySlug` |
| `lib/analisis.ts` | exporta `ANALISIS_ALL = []` | mantiene los tipos y helpers (`filterAndFacet`, etc.), pero el array deja de ser una constante. Se calcula desde `getAllPublications()` SOLO en server components |

### 3. Detalle: cómo renderizar el cuerpo de la publicación

Las publicaciones del vault NO siguen el formato 4-pasos del análisis. Tienen secciones distintas (Tesis principal, Notas de contenido, Citas reusables, etc.). La página `/analisis/[pais]/[slug]/page.tsx` actual renderiza `step_disparador` etc. como bloques.

**Dos opciones:**

- **3a (recomendada).** Crear una segunda página `/publicaciones/[slug]/page.tsx` (o `/analisis/[pais]/publicacion/[slug]`) que renderiza la publicación con su estructura propia: título, subtítulo, link al Substack como CTA principal, render del HTML del cuerpo. La página `/analisis/[pais]/[slug]` queda para análisis con formato 4-pasos del agente, cuando los haya.
- **3b.** Modificar la página existente para detectar si la entry tiene `step_*` vacíos y renderizar el HTML del cuerpo en su lugar. Más sencillo pero mezcla dos formatos en el mismo template.

Spec recomienda **3a**: separar las dos cosas. Una publicación de Substack es un objeto distinto a un análisis de país siguiendo el método.

### 4. Linkear correctamente

- Cards en `/analisis` → `/publicaciones/<slug>` (la versión rica con cuerpo del vault) **+ link directo al Substack**
- Si la publicación tiene `countrySlug`, también aparece en `/pais/<slug>?tab=publicaciones`
- En la página de detalle, banner verde/dorado: "Publicado en Substack · Leer la versión original →"

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/content.ts` | + `getAllPublications`, `getPublicationBySlug`, `getPublicationsByCountry` |
| `platform/frontend/src/lib/analisis.ts` | sacar `ANALISIS_ALL = []` (o mantenerlo vacío, no usarlo más). Mover el adaptador a una función reutilizable |
| `platform/frontend/src/app/analisis/page.tsx` | leer publicaciones server-side, pasar a `AnalisisContent` |
| `platform/frontend/src/app/analisis/AnalisisContent.tsx` | recibir `analyses` por props en vez de importar |
| `platform/frontend/src/app/analisis/[pais]/[slug]/page.tsx` | usar `getPublicationBySlug`. Mantener fallback a 404 |
| `platform/frontend/src/app/pais/[slug]/page.tsx` | reemplazar `getAnalysesByCountry` por nueva |
| `platform/frontend/src/components/CountryDashboard.tsx` | tab "Publicaciones" muestra `PublicationMeta[]` con link al Substack |
| `platform/frontend/src/app/publicaciones/[slug]/page.tsx` | **nuevo** — render rico de la publicación con CTA al Substack |

---

## Criterios de aceptación

1. ✅ `/analisis` muestra las 11 publicaciones del vault (con su URL real al Substack).
2. ✅ `/pais/co?tab=publicaciones` muestra "Reforma laboral en Colombia" y "Colombia: la sospecha antes del voto".
3. ✅ Cada card linkea a `/publicaciones/<slug>` y tiene un botón secundario "→ Leer en Substack".
4. ✅ La página de detalle `/publicaciones/<slug>` renderiza el cuerpo del .md como HTML (con secciones canónicas).
5. ✅ `/analisis/borradores` (los del agente) sigue funcionando intacto.
6. ✅ Type-check pasa sin errores.
7. ✅ `next build` completa sin errores.
8. ✅ Si una publicación no tiene `countrySlug`, igual aparece en `/analisis` general (filtro "país: cualquiera"), pero no en `/pais/<slug>`.

---

## Edge cases

- **Publicación sin `url` en frontmatter** — log warning, mostrar la card pero sin botón "Leer en Substack".
- **Despacho semanal** (`tipo: despacho`) — sí aparece en `/analisis` con tag visual "Despacho", no en `/pais/<slug>` (porque es transversal, no de un país).
- **Notas-disparador** (`tipo: nota-disparador`) — NO aparecen en `/analisis` ni en `/pais`. Solo se referencian desde sus despachos padre.
- **Frontmatter con eje en formato Obsidian link `[[01 - Deculturación]]`** — el parser tiene que normalizar a `deculturacion` antes de matchear con `axisKey` del sitio.

---

## No incluido en esta spec

- Modificar el formato del agente (eso es Spec 23)
- Comando para promover borradores del agente a publicaciones (Spec 24)
- Vista pipeline (Spec 25)

---

## Implementación sugerida

1. Crear `getAllPublications()` y testear con `node` que parsea bien los 11 archivos del vault.
2. Crear `getPublicationBySlug` y `getPublicationsByCountry`.
3. Refactor `app/analisis/page.tsx` y `AnalisisContent.tsx` para pasar publicaciones por props.
4. Crear `app/publicaciones/[slug]/page.tsx`.
5. Refactor `app/analisis/[pais]/[slug]/page.tsx` para usar la nueva fuente.
6. Refactor `app/pais/[slug]/page.tsx` y `CountryDashboard` para mostrar publicaciones con link al Substack.
7. Type-check + visual check de las 4 rutas (`/analisis`, `/pais/co`, `/publicaciones/reforma-laboral-en-colombia`, `/analisis/borradores`).
8. `next build` completo.
