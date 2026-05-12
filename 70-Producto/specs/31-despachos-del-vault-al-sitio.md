---
spec: 31
titulo: Despachos del vault al sitio (/despachos y detalle por semana)
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta: [/despachos, /despachos/[ano]/[semana], platform/frontend/src/lib/despachos.ts (nuevo), platform/frontend/src/app/despachos/page.tsx, platform/frontend/src/app/despachos/[ano]/[semana]/page.tsx]
depende_de: [26]
relaciona_con: [Spec 26 (cargar publicaciones del vault), Spec 30 (home derivada del corpus), brevity-release-notes (referencia editorial)]
prioridad: alta
bloquea_a: que /despachos refleje los despachos reales del Substack
---

# 31 · Despachos del vault al sitio

## Resumen ejecutivo

El sitio tiene dos rutas relacionadas con despachos: `/despachos` (listado) y `/despachos/[ano]/[semana]` (detalle de un despacho). Hoy ambas renderizan mock — el home incluso linkea a "Despacho 47 · Semana 19 · La sospecha como arma" que no existe como archivo en el vault.

Spec 26 reconoce el `tipo: despacho` como una variante de publicación pero **no aborda explícitamente las rutas `/despachos/*`**. Su scope es enchufar `/analisis` y `/pais/<slug>`. Esta spec extiende la lógica a las rutas de despacho: lee del vault las publicaciones con `tipo: despacho`, las renderiza en listado y detalle, y le da a la home un loader (`getLatestDispatch()`) consumible desde Spec 30.

**Por qué un spec aparte:** un despacho es estructuralmente distinto a un análisis. Es una pieza semanal trans-país (combina múltiples análisis bajo una pregunta de la semana), tiene su propia estructura editorial (entrada / hilo / cierre / pregunta), y vive en una ruta separada del sitio. Forzarlo a usar la misma vista que un análisis individual oscurece la distinción.

---

## Estado actual

### En el vault

`50-Publicaciones/*.md` con `tipo: despacho`. Cuáles son exactamente requiere revisión editorial, pero el frontmatter de Spec 26 ya contempla el campo. Candidatos plausibles del listado actual:

- "El mapa inestable se reordena.md" (suena a despacho de cierre temático)
- "Acuerdos, balas y ferias.md" (título estilo despacho multi-país)
- "La atención.md" (puede ser despacho temático)

La determinación final es editorial: cada uno se confirma leyendo `tipo:` del frontmatter del archivo.

### En el sitio

- `/despachos` — ruta existente (linkeada desde el nav principal). No fetcheada pero presumiblemente muestra mock o vacío.
- `/despachos/[ano]/[semana]` — ruta de detalle. La home linkea a `/despachos/2026/19`. Renderiza un despacho fake "La sospecha como arma".
- `app/page.tsx` (home) — card "Despacho 47 · Semana 19" 100% mock.

---

## Propuesta

### 1. Loader en `lib/despachos.ts`

Análogo a `getAllPublications()` de Spec 26 pero filtrado a `tipo: despacho` y con campos propios.

```ts
// platform/frontend/src/lib/despachos.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { VAULT_ROOT } from "./content";
import type { AxisKey } from "./ejes";

export interface DispatchMeta {
  slug:           string;       // del filename
  filename:       string;
  number:         number;       // del frontmatter `despacho:` (ej. 47)
  week:           number;       // ISO week
  year:           number;
  title:          string;       // del cuerpo (primer #)
  subtitle?:      string;       // frontmatter `subtítulo:`
  question:       string;       // pregunta de la semana, frontmatter `pregunta-semana:` o derivada
  ejesActivados:  AxisKey[];    // qué ejes toca este despacho
  paisesTocados:  string[];     // slugs de país que el despacho menciona / analiza
  fecha:          string;       // YYYY-MM-DD
  url?:           string;       // Substack
  estado:         "publicada" | "incluida-en-otro" | "borrador";
}

export interface Dispatch extends DispatchMeta {
  html:           string;       // cuerpo renderizado
  entrada:        string;       // sección "Entrada" del cuerpo
  hilo:           string[];     // bloques del hilo (por análisis citado)
  cierre:         string;       // sección "Cierre"
  preguntaSemana: string;       // sección "Pregunta de la semana"
  analisisLinkeados: { slug: string; countrySlug: string; title: string }[];
}

export function getAllDispatches(): DispatchMeta[];
export function getDispatchBySemana(year: number, week: number): Dispatch | null;
export function getLatestDispatch(): DispatchMeta | null;
```

**Reglas de parsing:**

- Lee `50-Publicaciones/*.md` ignorando los que NO tienen `tipo: despacho`.
- `number`: campo `despacho:` del frontmatter. Si no existe, calcular como índice ordinal en la serie (orden por `fecha` ascendente). Documentar el cálculo en comentario.
- `week`/`year`: si el frontmatter tiene `semana:`/`año:` explícitos, usar esos. Si no, derivar de `fecha` con cálculo ISO.
- `paisesTocados`: extraer del cuerpo los links a `/pais/<slug>` o del frontmatter `paises:`. Si ninguno, array vacío.
- `ejesActivados`: del frontmatter `ejes:` (mismo parser que publicaciones, Spec 26).
- `analisisLinkeados`: extraer del cuerpo los links a análisis del archivo (`/analisis/<pais>/<slug>` o `/publicaciones/<slug>`). Para cada uno, intentar resolver el `title` desde `getAllPublications()`. Si no resuelve, mantener el slug como title.
- Cuerpo: parsear secciones canónicas (`## Entrada`, `## El hilo`, `## Cierre`, `## La pregunta de la semana`) y devolverlas como campos separados además del HTML completo.

**Saltos seguros:** archivo malformado → log warning, skip, no romper build (mismo patrón que Spec 26).

### 2. Ruta `/despachos` (listado)

`platform/frontend/src/app/despachos/page.tsx`. Server Component.

```tsx
import { getAllDispatches } from "@/lib/despachos";

export default function DespachosListing() {
  const dispatches = getAllDispatches().sort((a, b) => b.number - a.number);
  return <DespachosListContent dispatches={dispatches} />;
}
```

**Layout propuesto:**

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                           │
│  Despachos                                                        │
│  Análisis estructural integrado, semana a semana.                 │
│  N despachos publicados desde [primer despacho]                   │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  CARDS (grid 2 col desktop / 1 col mobile)                        │
│                                                                   │
│  ┌────────────────────────┐  ┌────────────────────────┐          │
│  │ #47 · sem 19 · 2026    │  │ #46 · sem 18 · 2026    │          │
│  │ La sospecha como arma  │  │ El silencio en común   │          │
│  │ [subtítulo / pregunta] │  │ ...                    │          │
│  │ ejes: D, E, R          │  │ ...                    │          │
│  │ países: CO, AR, BO     │  │ ...                    │          │
│  │ Leer →                 │  │ Leer →                 │          │
│  └────────────────────────┘  └────────────────────────┘          │
│  ... más cards ordenadas descendente ...                          │
└──────────────────────────────────────────────────────────────────┘
```

**Filtros (opcional v1):** por año, por eje. Si el corpus es chico (<10), filtros se omiten.

### 3. Ruta `/despachos/[ano]/[semana]` (detalle)

`platform/frontend/src/app/despachos/[ano]/[semana]/page.tsx`. Server Component con `generateStaticParams`.

```tsx
import { getAllDispatches, getDispatchBySemana } from "@/lib/despachos";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return getAllDispatches().map(d => ({
    ano: String(d.year),
    semana: String(d.week),
  }));
}

export default async function DespachoDetalle({ params }) {
  const { ano, semana } = await params;
  const dispatch = getDispatchBySemana(Number(ano), Number(semana));
  if (!dispatch) notFound();
  return <DespachoDetailContent dispatch={dispatch} />;
}
```

**Render:**

- Header: número del despacho, semana ISO, fecha, título, subtítulo.
- Strip de ejes y países que el despacho toca.
- Cuerpo en secciones canónicas:
  - **Entrada** — texto editorial de apertura
  - **El hilo** — bloques que linkean a los análisis individuales del archivo
  - **Cierre** — texto editorial de cierre
  - **La pregunta de la semana** — destacada visualmente (citation block o equivalente)
- Footer: link al Substack original ("→ Leer en Substack").

**Si el despacho no tiene una sección canónica** (ej. falta `## Cierre`): omitir la sección, no renderizar placeholder. La estructura del archivo manda.

### 4. Hook para Spec 30

Exportar `getLatestDispatch()` para que Spec 30 (home) lo consuma directamente. Devuelve la `DispatchMeta` con mayor `number` (o mayor `fecha` si los números no son consistentes), o `null` si no hay despachos.

```ts
export function getLatestDispatch(): DispatchMeta | null {
  const all = getAllDispatches();
  if (all.length === 0) return null;
  return all.sort((a, b) => b.number - a.number)[0];
}
```

### 5. Eliminar mocks

Buscar y borrar:
- `MOCK_DISPATCHES` o variantes en `lib/`.
- `LATEST_DISPATCH_MOCK` en componentes home.
- Cualquier objeto hardcoded de despachos en `app/despachos/*`.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/despachos.ts` | **nuevo** — loader + tipos |
| `platform/frontend/src/app/despachos/page.tsx` | Reescribir para usar `getAllDispatches()` |
| `platform/frontend/src/app/despachos/DespachosListContent.tsx` | **nuevo** o refactor del existente — recibe array por props |
| `platform/frontend/src/app/despachos/[ano]/[semana]/page.tsx` | Reescribir para usar `getDispatchBySemana()` y `generateStaticParams` |
| `platform/frontend/src/app/despachos/[ano]/[semana]/DespachoDetailContent.tsx` | **nuevo** o refactor — render por secciones canónicas |
| Mocks varios | Eliminar |

---

## Criterios de aceptación

1. `/despachos` muestra solo despachos reales del vault. Si el vault tiene cero despachos, la página muestra placeholder honesto ("Aún no hay despachos publicados. El próximo cierra el domingo.") sin cards inventadas.
2. Cada card linkea a `/despachos/<year>/<week>` correctamente formada.
3. `/despachos/2026/19` (o el despacho real más reciente) renderiza el despacho con sus secciones canónicas.
4. Si la URL apunta a una semana sin despacho real, devuelve 404 (`notFound()`).
5. Los links en el cuerpo de un despacho a análisis individuales resuelven a `/analisis/<pais>/<slug>` o `/publicaciones/<slug>` según convención de Spec 26.
6. `getLatestDispatch()` exportada y consumible por Spec 30.
7. Sin `MOCK_DISPATCHES` residual.
8. Type-check + `next build`.

---

## Edge cases

- **Despacho sin campo `despacho:` (número)** → calcular ordinal por fecha ascendente. Documentar en comentario y warn.
- **Despachos con number duplicado** → usar fecha como tie-breaker. Log warning, no crashear.
- **Despacho que linkea a un análisis que ya no existe** → renderizar el bloque del hilo con el título textual sin link funcional (no 404 inline, no romper el render del despacho).
- **Sección del cuerpo sin contenido** → omitir del render.
- **Despacho con `tipo: despacho` pero sin `url:` (no publicado aún en Substack)** → renderizar igual, omitir el footer "Leer en Substack".
- **Múltiples despachos en la misma semana ISO** → caso raro pero posible; renderizar ambos en la card list, en `/despachos/<year>/<week>` mostrar el más reciente por fecha (y agregar nota "Hay otra entrega esta semana, ver archivo").

---

## No incluido en esta spec

- **Editor de despachos** — los despachos se editan en Obsidian / VSCode.
- **Sistema de comentarios o discusión** — fuera de alcance.
- **Newsletter / suscripciones** — el link a Substack queda como CTA, no se duplica la mecánica de suscripción.
- **Heatmap específico de despachos** — Spec 30 ya cubre el heatmap por análisis individuales. Despachos no necesitan grilla propia.

---

## Implementación sugerida

1. Confirmar editorialmente cuáles de las 10 publicaciones actuales tienen `tipo: despacho`. Si ninguna, decidir cuáles deberían tenerlo y actualizar el frontmatter.
2. Crear `lib/despachos.ts` con tipos y `getAllDispatches()`. Test manual con `node`.
3. Implementar `getDispatchBySemana()` y `getLatestDispatch()`.
4. Refactor `/despachos/page.tsx`.
5. Refactor `/despachos/[ano]/[semana]/page.tsx` con `generateStaticParams`.
6. Eliminar mocks. Verificar con grep.
7. Visual check: navegar de `/despachos` → detalle → click en un análisis del hilo → vuelta atrás.
8. Type-check + `next build`.

---

## Relación con el sistema editorial completo

Cuando Specs 26, 30 y 31 estén ejecutadas, el ciclo editorial del sitio queda completo:

- Spec 24 (en curso) promueve borradores diarios a `50-Publicaciones/`.
- Spec 26 enchufa esas publicaciones a `/analisis`, `/publicaciones`, `/pais/<slug>`.
- Spec 30 enchufa la home al corpus.
- Spec 31 enchufa los despachos a sus rutas dedicadas.

Cualquier publicación nueva que entre al vault (manual o promovida desde borrador) aparece automáticamente en el sitio en su lugar correcto sin tocar código.