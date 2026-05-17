---
spec: 38
titulo: Columna lateral del mapa alimentada por borradores diarios
estado: borrador
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-16
afecta:
  - platform/frontend/src/lib/home.ts
  - platform/frontend/src/app/page.tsx
  - platform/frontend/src/components/MapaHeatmapSection.tsx
  - platform/frontend/src/components/AnalisisColumn.tsx
  - platform/frontend/src/components/MiniDraftCard.tsx (nuevo)
depende_de: [23, 30, 32, 34B]
extiende: 34B
relaciona_con: [Spec 25 (pipeline visible), Spec 32 (vista pública de borradores)]
prioridad: media — fix de "frescura" del above-the-fold
desbloquea: que la columna lateral muestre lo más reciente que produce el proyecto (borradores lun-vie) en vez de las publicaciones promovidas (semanales/quincenales)
---

# 38 · Columna lateral del mapa alimentada por borradores diarios

## Resumen ejecutivo

La columna **ÚLTIMOS ANÁLISIS** a la derecha del mapa Torres García (Spec 34B) hoy se alimenta de `getAllPublications()` filtrado por `tipo === "publicacion"`. Eso lista las publicaciones promovidas a `50-Publicaciones/`, que tienen ritmo semanal/quincenal. Resultado actual al 2026-05-16:

| # | Título | Fecha frontmatter | Antigüedad |
|---|---|---|---|
| 1 | Argentina sin cruzadas | 2026-05-11 | 5 días |
| 2 | Colombia – la sospecha antes del voto | 2026-04-27 | 19 días |
| 3 | La atención | 2026-03-04 | 73 días |
| 4 | El mapa inestable se reordena | 2026-02-24 | 81 días |

Las cards 3 y 4 tienen más de dos meses. La columna se siente desactualizada porque las publicaciones formales no salen todos los días — los **borradores del agente diario** (Specs 23-25, lun-vie en `60-Borradores/diario/`) sí. Al 2026-05-11 hay 9 borradores generados entre 2026-04-27 y 2026-05-11 (ver Spec 32 §"Estado actual"), todos más frescos que el ítem 3 de la columna actual.

**Cambio:** la columna lateral pasa a alimentarse de `getAllAgentDrafts()`, filtrando los borradores que ya fueron promovidos (para no duplicar con la publicación equivalente). Cada card linkea al detalle del borrador en `/analisis/borradores/[pais]/[slug]` (ruta pública de Spec 32). El header "ÚLTIMOS ANÁLISIS" se mantiene — los borradores diarios *son* análisis (siguen el método de 4 pasos), solo que pre-edición editorial.

**Lo que NO cambia:**

- El tooltip de hover sobre el mapa sigue mostrando cuenta de publicaciones promovidas (`countBySlug` se calcula sobre `cards`, no sobre borradores).
- `<WhileYouWereAway>` y `<NewSinceLastVisit>` siguen usando `cards` (publicaciones), no borradores.
- El layout, las dimensiones, los estilos y las animaciones de la columna y de las mini-cards se mantienen idénticos a Spec 34B §2-§3.
- El bloque "Esta semana · eje" y el heatmap post-fold siguen alimentándose de publicaciones.

---

## 1. Diagnóstico

### 1.1 Por qué la columna se siente desactualizada

`getHomeData().cards` se construye así (`lib/home.ts:107-110`):

```ts
const pubs = getAllPublications().filter(p => p.tipo === "publicacion");
const cards = pubs.slice(0, 5);
```

`getAllPublications()` (`lib/content.ts:434-482`) lee `50-Publicaciones/*.md`, descarta despachos, MOCs y notas-disparador, y ordena por `fecha` frontmatter descendente. El corpus de `50-Publicaciones/` tiene cadencia editorial — solo entran piezas promovidas, no borradores.

Mientras tanto, `60-Borradores/diario/` recibe entregas lun-vie del agente diario (Specs 23-25). `getAllAgentDrafts()` (`lib/content.ts:233-287`) ya existe y devuelve los borradores ordenados por `date` desc.

La columna debería reflejar **el ritmo de producción real del proyecto**, que es diario, no editorial.

### 1.2 Por qué filtrar promovidos

Spec 24 introduce el flujo `borrador → promovido → publicado-en-sitio`. Cuando un borrador se promueve, queda en `60-Borradores/diario/` con `estado: promovido` y `publicacion_slug: <slug-de-la-publicacion>` apuntando a la pieza en `50-Publicaciones/`. Si la columna mostrara borradores promovidos, el lector vería entradas redundantes con la publicación equivalente que ya está en el corpus.

**Filtro:** `d.estado !== "promovido" && d.estado !== "publicado-en-sitio"`.

Esto deja pasar `borrador` y `en-edicion`. Ambos son "borradores vivos" que no tienen aún publicación equivalente.

### 1.3 Por qué linkear al detalle del borrador

Spec 32 implementó `/analisis/borradores/[pais]/[slug]` como vista pública del detalle del borrador (semi-pública, con banner editorial "Borrador del agente · pendiente de edición editorial · puede contener errores"). Esa página es el destino natural del click sobre una card de borrador.

Como filtramos los borradores promovidos antes de mostrarlos, no existe el caso de "borrador en la columna cuya publicación ya está en `50-Publicaciones/`" — así que no necesitamos lógica de redirect.

---

## 2. Cambios en data layer

### 2.1 `HomeData` (en `lib/home.ts`)

Sumar campo:

```ts
export interface HomeData {
  thisWeek:        HomeWeekStrip | null;
  cards:           PublicationMeta[];          // SIN CAMBIOS — sigue alimentando WhileYouWereAway, NewSinceLastVisit, tooltip del mapa
  latestDrafts:    AgentDraftMeta[];           // NUEVO — alimenta la columna lateral del mapa
  heatmap:         HomeHeatmapCell[];
  heatmapWeeks:    HomeWeekLabel[];
  weeklyCountries: HomeWeeklyCountry[];
  latestDispatch:  DispatchMeta | null;
  currentWeek:     number;
  currentYear:     number;
}
```

Agregar import: `import { getAllAgentDrafts, type AgentDraftMeta } from "./content";`

### 2.2 `getHomeData()` — nuevo bloque

Después del cálculo de `cards`, agregar:

```ts
// ---- Borradores diarios: top 5 más recientes, sin promovidos ----
const latestDrafts = getAllAgentDrafts()
  .filter(d => d.estado !== "promovido" && d.estado !== "publicado-en-sitio")
  .slice(0, 5);
```

Y agregar `latestDrafts` al return del objeto `HomeData`.

**Nota:** `getAllAgentDrafts()` ya retorna ordenado por `date` desc (línea 286 de `content.ts`), así que `slice(0, 5)` da los 5 más recientes directamente.

---

## 3. Cambios en componentes

### 3.1 `app/page.tsx`

Pasar `latestDrafts` al `<MapaHeatmapSection>`:

```tsx
<MapaHeatmapSection
  weeklyCountries={data.weeklyCountries}
  agendasByCountry={agendasByCountry}
  cards={data.cards}
  latestDrafts={data.latestDrafts}   // NUEVO
/>
```

`WhileYouWereAway` y `NewSinceLastVisit` siguen usando `data.cards` sin cambios.

### 3.2 `MapaHeatmapSection.tsx`

Sumar prop:

```ts
interface Props {
  weeklyCountries:   WeeklyCountryData[];
  agendasByCountry?: Record<string, CountryAgenda>;
  cards:             PublicationMeta[];        // sigue siendo necesario para countBySlug del tooltip
  latestDrafts:      AgentDraftMeta[];         // NUEVO
}
```

El cálculo de `countBySlug` (líneas 23-26) se mantiene sobre `cards` — el tooltip de hover sigue mostrando cuenta de publicaciones promovidas, que es la métrica que importa para "cuánto análisis editorial hay sobre este país".

Cambiar la llamada a `<AnalisisColumn>`:

```tsx
<AnalisisColumn drafts={latestDrafts} />
```

### 3.3 `AnalisisColumn.tsx`

Renombrar la prop:

```ts
import type { AgentDraftMeta } from "@/lib/content";
import MiniDraftCard from "./MiniDraftCard";

interface Props {
  drafts: AgentDraftMeta[];
}

export default function AnalisisColumn({ drafts }: Props) {
  const visible = drafts.slice(0, 4);
  // ...resto igual
```

Cambiar el map del body:

```tsx
{visible.map(draft => (
  <MiniDraftCard key={draft.slug} draft={draft} />
))}
```

El header "ÚLTIMOS ANÁLISIS" y el footer "→ Ver todos los análisis" **se mantienen tal cual**. El link del footer sigue siendo `/analisis` (Decisión pendiente §5.1: ver si vale linkearlo a `/analisis/borradores` en su lugar).

El placeholder de estado vacío ("El archivo está arrancando…") se mantiene; cambia solo el contexto en el que se dispara (cuando no hay borradores en `60-Borradores/diario/`).

### 3.4 `MiniDraftCard.tsx` (NUEVO)

Componente nuevo, hermano de `MiniAnalysisCard.tsx`. Misma anatomía visual (Spec 34B §3) — cambian solo los campos que consume.

**Por qué no extender `MiniAnalysisCard`:** los tipos `PublicationMeta` y `AgentDraftMeta` divergen en nombres de campo (`fecha` vs `date`, `subtitle` vs `lede`, `slug` único vs `slug` compuesto + `pieceSlug`). Hacer un componente discriminado con union types ensucia la legibilidad para ahorrar 60 líneas. Más limpio tener dos componentes paralelos.

```tsx
"use client";
import Link from "next/link";
import type { AgentDraftMeta } from "@/lib/content";
import { EJES } from "@/lib/ejes";

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d} ${meses[m - 1]}`;
}

interface Props {
  draft: AgentDraftMeta;
}

export default function MiniDraftCard({ draft }: Props) {
  const href = `/analisis/borradores/${draft.countrySlug}/${draft.pieceSlug}`;

  const country = (draft.country ?? draft.countrySlug).toUpperCase();
  const date    = shortDate(draft.date);
  const meta    = [country, date, `sem ${draft.week}`].filter(Boolean).join(" · ");

  const ejeObj  = EJES.find(e => e.axisKey === draft.ejePrincipal);
  const ejeName = ejeObj?.name ?? draft.ejePrincipal;

  return (
    <Link
      href={href}
      className="mi-mini-card"
      style={{ /* mismas reglas que MiniAnalysisCard §3 */ }}
    >
      {/* Metadata superior — igual que MiniAnalysisCard */}
      {/* Axis pill — igual */}
      {/* Title: draft.title */}
      {/* Lede: draft.lede (en lugar de subtitle) */}
    </Link>
  );
}
```

Los estilos inline son **idénticos** a `MiniAnalysisCard.tsx`. Lo único distinto:

- `href` apunta a `/analisis/borradores/[pais]/[slug]`.
- El campo `lede` reemplaza a `subtitle` como segundo bloque italic.
- El campo `date` (formato `YYYY-MM-DD`) reemplaza a `fecha`.
- El slug del link se compone con `countrySlug` + `pieceSlug` (no `slug` global, porque `AgentDraftMeta.slug` ya viene compuesto como `${countrySlug}/${pieceSlug}` — usar `pieceSlug` aislado para construir la URL).

---

## 4. Estados edge

### 4.1 No hay borradores

Si `60-Borradores/diario/` está vacío o todos los borradores están promovidos:

- `latestDrafts` es `[]`.
- `AnalisisColumn` muestra el placeholder existente: "El archivo está arrancando. Las primeras publicaciones aparecen acá apenas estén cargadas."
- El texto del placeholder se puede ajustar si Tomás quiere reflejar mejor que son borradores ("El agente diario todavía no soltó nada esta semana"), pero por ahora se mantiene neutro.

### 4.2 Borrador con frontmatter incompleto

`getAllAgentDrafts()` ya filtra los borradores con frontmatter faltante (líneas 247-251 de `content.ts`). Si un borrador tiene frontmatter inválido, no llega a `latestDrafts`. Sin cambios.

### 4.3 País sin slug normalizado

`MiniDraftCard` usa `draft.countrySlug.toUpperCase()` como fallback si `draft.country` no está. Spec 23 (frontmatter del agente) marca `country` y `country_slug` como required, así que el caso de falta total no debería ocurrir.

### 4.4 Mezcla cronológica con publicaciones

Si una publicación de `50-Publicaciones/` tiene fecha posterior al borrador más reciente, **no se mezcla en la columna**. La columna refleja borradores diarios; las publicaciones promovidas siguen siendo accesibles por:

- El bloque "Esta semana · eje" debajo del mapa.
- El último despacho post-fold.
- La página `/analisis`.
- El sidebar "Países" / "Ejes".

Esto está alineado con la decisión del usuario (sin mezcla).

---

## 5. Decisiones pendientes

### 5.1 ¿El footer "→ Ver todos los análisis" linkea a `/analisis` o a `/analisis/borradores`?

- `/analisis` muestra el archivo completo de publicaciones promovidas.
- `/analisis/borradores` muestra el inventario de borradores (Spec 32).

Como la columna ahora muestra borradores, sería más coherente que el footer lleve a `/analisis/borradores`. Pero `/analisis` sigue siendo el archivo principal del proyecto y el lector puede esperar llegar ahí desde el home.

**Propuesta:** mantener `/analisis` (lectura editorial es la apuesta del sitio). Alternativa: dos links pequeños en el footer ("→ Análisis publicados · → Borradores diarios"), pero ensucia el diseño.

### 5.2 ¿El placeholder vacío necesita texto específico?

El placeholder actual "El archivo está arrancando" tiene sentido para publicaciones. Para borradores sería más preciso "El agente diario todavía no soltó nada esta semana" o "Sin borradores recientes". Diferencia mínima — decidir si vale el cambio.

### 5.3 ¿Mostrar un indicador visual de que son borradores?

Las mini-cards no aclaran "esto es borrador, no publicación final". Opciones:

- **Nada** (simplicidad, el header "ÚLTIMOS ANÁLISIS" agrupa todo bajo el mismo paraguas).
- **Etiqueta sutil** en la metadata superior: `BORRADOR · COLOMBIA · 27 ABR · sem 17` o el orden invertido.
- **Color de borde distinto** (más invasivo).

**Propuesta:** nada en v1. Los borradores se identifican cuando el lector entra al detalle (banner editorial de Spec 32). En la columna, todos son "análisis".

### 5.4 ¿Cuántas mini-cards visibles?

Spec 34B §2.3 fijó 4. Esta spec mantiene 4. Si el agente diario corre lun-vie, hay 5 borradores nuevos por semana — `slice(0, 5)` en `getHomeData()` deja margen, pero `AnalisisColumn` recorta a 4 visibles. La quinta queda fuera salvo que el alto del viewport permita scroll interno (overflow-y: auto del componente). Decisión sobre extender a 5 visibles: revisar después de implementar y ver el viewport real.

---

## 6. Archivos a tocar — resumen

| Archivo | Cambio |
|---|---|
| `platform/frontend/src/lib/home.ts` | Sumar campo `latestDrafts: AgentDraftMeta[]` a `HomeData`; llenarlo en `getHomeData()` con `getAllAgentDrafts()` filtrado por estado |
| `platform/frontend/src/app/page.tsx` | Pasar `latestDrafts={data.latestDrafts}` a `<MapaHeatmapSection>` |
| `platform/frontend/src/components/MapaHeatmapSection.tsx` | Sumar prop `latestDrafts: AgentDraftMeta[]`; pasarla a `<AnalisisColumn drafts={latestDrafts} />` (`cards` se mantiene para `countBySlug`) |
| `platform/frontend/src/components/AnalisisColumn.tsx` | Renombrar prop `cards: PublicationMeta[]` → `drafts: AgentDraftMeta[]`; importar y renderizar `<MiniDraftCard>` en lugar de `<MiniAnalysisCard>` |
| `platform/frontend/src/components/MiniDraftCard.tsx` | **Nuevo**. Mismo layout visual que `MiniAnalysisCard.tsx`; consume `AgentDraftMeta`; href apunta a `/analisis/borradores/[pais]/[slug]` |
| `platform/frontend/src/components/MiniAnalysisCard.tsx` | **Sin cambios**. Queda disponible para usos futuros con publicaciones (ej. archivo, listings). |

---

## 7. Criterios de aceptación

1. La columna **ÚLTIMOS ANÁLISIS** a la derecha del mapa Torres García muestra los 4 borradores más recientes de `60-Borradores/diario/`, ordenados por fecha descendente.
2. Los borradores con `estado: promovido` o `estado: publicado-en-sitio` NO aparecen en la columna.
3. Cada mini-card es clickeable y navega a `/analisis/borradores/[country_slug]/[piece_slug]` (Spec 32).
4. El header sigue diciendo "ÚLTIMOS ANÁLISIS" (mono uppercase, sin cambio visual).
5. El footer sigue diciendo "→ Ver todos los análisis" linkeando a `/analisis` (salvo que §5.1 se resuelva distinto).
6. Si `60-Borradores/diario/` no tiene borradores no-promovidos, se muestra el placeholder existente.
7. El tooltip de hover sobre un país en el mapa sigue mostrando cuenta de **publicaciones promovidas** (`countBySlug` calculado sobre `cards`), no de borradores.
8. `<WhileYouWereAway>` y `<NewSinceLastVisit>` siguen funcionando igual, alimentados por `data.cards` (publicaciones).
9. En mobile (≤640px), la columna se reordena debajo del mapa con los borradores (mantiene comportamiento de Spec 34B §6).
10. El bloque "Esta semana · eje", el último despacho y el heatmap post-fold siguen alimentándose de publicaciones — sin regresión.
11. TypeScript compila sin errores. `npm run build` pasa.
12. No hay imports huérfanos. `MiniAnalysisCard` queda sin uso pero se conserva el archivo (no se borra).

---

## 8. Roadmap

### Fase única (estimado: 1-2 horas)

1. Tocar `lib/home.ts` — sumar `latestDrafts` al tipo `HomeData` y al return de `getHomeData()`.
2. Tocar `app/page.tsx` — pasar la nueva prop a `MapaHeatmapSection`.
3. Tocar `MapaHeatmapSection.tsx` — agregar prop y propagar a `AnalisisColumn`.
4. Crear `components/MiniDraftCard.tsx` copiando `MiniAnalysisCard.tsx` y adaptando campos.
5. Tocar `AnalisisColumn.tsx` — cambiar tipo de prop y componente que renderiza.
6. `npm run build` para validar tipos.
7. Visual check en `localhost:3000` con los 9 borradores actuales: confirmar que aparecen los 4 más recientes no promovidos, que el link al detalle funciona, que el responsive sigue OK.
8. Resolver decisiones pendientes §5.1 y §5.2 según preferencia visual.

---

## 9. Cierre

La columna lateral del mapa pasa a reflejar el **ritmo real de producción del proyecto** (borradores diarios lun-vie) en lugar del ritmo editorial (publicaciones promovidas semanal/quincenal). El cambio es chico — una columna de datos cambia de origen — pero corrige una desconexión perceptual importante: lo que el visitante ve como "ÚLTIMOS ANÁLISIS" pasa a ser efectivamente lo último que el proyecto produjo.

El header se mantiene en "ÚLTIMOS ANÁLISIS" porque los borradores diarios *son* análisis (siguen el método de 4 pasos del proyecto, Spec 20). La distinción borrador / publicación se materializa en el detalle (banner editorial de Spec 32), no en la columna de la home.
