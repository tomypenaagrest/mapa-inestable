---
spec: 30
titulo: Home derivada del corpus real (sin fixtures)
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta: [/, platform/frontend/src/app/page.tsx, platform/frontend/src/lib/home.ts (nuevo), componentes de la home]
depende_de: [26]
relaciona_con: [Spec 11 (rediseño home), Spec 26 (cargar publicaciones del vault), BUG-001, BUG-002, Spec 31 (despachos)]
prioridad: alta
bloquea_a: que la cara pública del proyecto deje de mostrar fixtures legados
---

# 30 · Home derivada del corpus real

## Resumen ejecutivo

La home (`/`) es la primera impresión del sitio y hoy **miente sobre el corpus**: muestra cinco cards de análisis donde solo una corresponde a una publicación real del vault, un heatmap con ~25 análisis distribuidos cuando el corpus real son 10 publicaciones, y un widget de "Despacho 47" que no existe como archivo. Cuando Spec 26 termine de cargar `50-Publicaciones/` al sitio, las rutas `/analisis` y `/pais/<slug>` van a quedar coherentes con el vault — pero la home seguirá renderizando fixtures porque está fuera del alcance de 26.

Esta spec mueve la home al mismo patrón que Spec 26 ya establece para las otras rutas: leer del vault, derivar las vistas, eliminar todo `MOCK_*` y constante hardcoded. Cuando termine, la cara del sitio refleja exactamente lo que está publicado, ni más ni menos.

**Resuelve concretamente:**
- 4 cards de análisis con títulos inventados (motosierra, constitución, fluminense, MAS) → desaparecen.
- Heatmap con cuentas de análisis fantasma → recalcula desde el corpus.
- "Despacho 47 · Semana 19 · La sospecha como arma" → reemplazado por el último despacho real (delegado a Spec 31) o vacío si no hay.
- Lectura "Esta semana · Desorientación epistemológica · 3 de 5 análisis" → calculada desde la realidad del corpus de la semana.

---

## Estado actual

### Lo que muestra la home hoy

1. **Strip "Esta semana · [Eje] · N de M análisis lo activaron"** — eje y cuentas derivadas de fixtures.
2. **Grid de 5 cards** de análisis con país, eje, fecha, título, lede, link al detalle. Mock excepto una.
3. **Mapa Torres García** (Spec 22) — esto sí funciona, no es problema.
4. **Heatmap "Ejes × Semanas"** — 6 filas (ejes) × 12 columnas (sem 8-19 de 2026). Cada celda con count "0", "1", "2" o "3" análisis. Click navega a `/analisis?eje=<slug>&semana=<n>&ano=2026`. Cuentas totalmente fabricadas.
5. **Card "Despacho N · Semana N"** con título y lede del último despacho. Mock.
6. **Footer** con hipótesis, ejes, países, marco — esto está bien.

### Por qué Spec 26 no lo resuelve

Spec 26 §"Archivos a tocar" lista explícitamente:
- `app/analisis/page.tsx`
- `app/analisis/[pais]/[slug]/page.tsx`
- `app/pais/[slug]/page.tsx`
- `components/CountryDashboard.tsx`

No incluye `app/page.tsx`. La home tiene su propia lógica de selección (top-N recientes, eje dominante de la semana, heatmap acumulativo) que merece su propio spec en lugar de inflar Spec 26 mid-execution.

---

## Propuesta

### 1. Nuevo módulo `lib/home.ts`

Server-only, consume las funciones que Spec 26 va a establecer en `lib/content.ts` (`getAllPublications`) y las existentes (`getAllAgentDrafts`).

```ts
// platform/frontend/src/lib/home.ts
import { getAllPublications, type PublicationMeta } from "./content";
import { getAllDispatches, type DispatchMeta } from "./despachos";  // Spec 31
import { AXIS_KEYS, type AxisKey } from "./ejes";

export interface HomeWeekStrip {
  ejeKey:      AxisKey;          // eje dominante de la semana
  activations: number;            // cuántos análisis lo activan esta semana
  total:       number;            // total análisis de la semana
  week:        number;
  year:        number;
}

export interface HomeHeatmapCell {
  ejeKey:      AxisKey;
  week:        number;
  year:        number;
  count:       number;
}

export interface HomeData {
  thisWeek:    HomeWeekStrip | null;     // null si la semana actual no tiene corpus
  cards:       PublicationMeta[];        // top-N recientes
  heatmap:     HomeHeatmapCell[];        // 6 ejes × 12 semanas más recientes
  latestDispatch: DispatchMeta | null;   // último despacho real, null si no hay
}

export function getHomeData(): HomeData;
```

**Reglas de cómputo:**

- `cards`: hasta 5 publicaciones más recientes con `tipo: publicación` (no despachos, no notas-disparador). Si hay menos de 5 en el vault, renderiza las que haya. Si hay cero, mostrar placeholder editorial honesto (§5).
- `thisWeek`: tomar todas las publicaciones de la semana ISO actual. Calcular qué eje aparece más veces como `ejePrincipal`. Si hay empate, el primero en orden de ejes (deculturación → mediaciones → desrepresentación → estetización → desorientación → atención). Si la semana actual no tiene corpus, devolver `null` y omitir el strip.
- `heatmap`: 6 ejes × 12 semanas (la semana actual + 11 anteriores). Para cada celda, contar cuántas publicaciones tienen ese `ejePrincipal` y fecha dentro de esa semana ISO. Solo cuentas reales. La celda mantiene el click → `/analisis?eje=<slug>&semana=<n>&ano=<y>` como hoy.
- `latestDispatch`: la publicación más reciente con `tipo: despacho` (Spec 31). Si no hay despachos en el vault, devolver `null` y mostrar placeholder.

### 2. Refactor de `app/page.tsx`

Server Component. Llama `getHomeData()` y pasa a un Client Component si necesita interactividad (probable, para el heatmap), o renderiza directo si todo es server-friendly.

```tsx
// platform/frontend/src/app/page.tsx
import { getHomeData } from "@/lib/home";

export default function HomePage() {
  const data = getHomeData();
  return <HomeContent data={data} />;
}
```

**Cambios concretos:**

| Sección de la home | Antes | Después |
|---|---|---|
| Strip "Esta semana" | Hardcoded `WEEK_STRIP_MOCK` | `data.thisWeek` o omitido si null |
| Grid de 5 cards | Array `HOME_CARDS_MOCK` | `data.cards.map(...)` con link a `/publicaciones/<slug>` (consistente con Spec 26 §3a) |
| Heatmap | Función `getMockHeatmap()` | `data.heatmap` con cuentas reales |
| Card de despacho | Constante `LATEST_DISPATCH_MOCK` | `data.latestDispatch` o placeholder |

### 3. Eliminar fixtures

Buscar y borrar (o mover a `__tests__/fixtures/`):

- `MOCK_ANALYSIS` o variantes residuales (BUG-001 — Spec 26 debería ya haberlo manejado en el detalle; verificar que la home no use copia separada).
- `HOME_CARDS_MOCK` / `WEEK_STRIP_MOCK` / `LATEST_DISPATCH_MOCK` / `getMockHeatmap()` o equivalentes.
- Cualquier import de mocks en `app/page.tsx` o componentes hijos.

Después del cambio, una búsqueda `grep -ri "mock" platform/frontend/src/app/page.tsx` debería devolver vacío o solo comentarios irrelevantes.

### 4. Cards de la home — selección y orden

**Criterio editorial r1:** top 5 publicaciones por `fecha` descendente, filtradas a `tipo: publicación`. Excluye `tipo: despacho` (los despachos viven en su card propia) y `tipo: nota-disparador` (esas no son piezas terminadas).

Si dos publicaciones tienen la misma `fecha`, desempate por título alfabético (estable, predecible).

**Decisión abierta:** ¿el home debería preferir publicaciones de la semana actual cuando existen, aunque haya menos de 5? Mi propuesta: sí — si hay 2 publicaciones esta semana, mostrar esas 2 + completar con las 3 más recientes anteriores. Le da prioridad temporal al lector recurrente sin dejar el grid pelado. Confirmar con Tomás antes de implementar.

### 5. Placeholders honestos (estados vacíos)

**Cuando no hay corpus de la semana actual:**

```
SIN PUBLICACIONES ESTA SEMANA
La próxima entrega cierra el viernes.
```

Mono uppercase 13px en `--mi-ink-mute`, sin tratar de inventar contenido.

**Cuando no hay despachos en el vault:**

Omitir la card del despacho enteramente. No mostrar "Próximamente" en su lugar — la home se compacta.

**Cuando hay menos de 5 publicaciones en total:**

Renderizar las que haya, sin truchear el grid. Si hay cero, mostrar:

```
EL ARCHIVO ESTÁ ARRANCANDO
Las primeras publicaciones aparecen acá apenas estén cargadas.
```

### 6. Heatmap — comportamiento con corpus chico

Hoy el corpus real son ~10 publicaciones distribuidas en ~6 meses. El heatmap de 12 semanas va a quedar mayormente vacío. Eso es honesto y correcto — la grilla refleja la realidad de producción.

**Mejora visual sugerida:** las celdas con `count === 0` quedan vacías (sin contenido, fondo plano). Las celdas con `count > 0` muestran el número en mono. Cualquier intento de "rellenar" con datos falsos es la patología que esta spec ataca.

A medida que el agente diario (Spec 25) y los promotes (Spec 24) carguen el corpus, la grilla se va llenando naturalmente.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/home.ts` | **nuevo** — `getHomeData()`, tipos `HomeData`, `HomeWeekStrip`, `HomeHeatmapCell` |
| `platform/frontend/src/app/page.tsx` | Reemplazar uso de mocks por `getHomeData()` |
| `platform/frontend/src/app/HomeContent.tsx` (o equivalente) | Recibir `HomeData` por props; eliminar imports de fixtures |
| `platform/frontend/src/lib/` (varios) | Eliminar constantes mock: `HOME_CARDS_MOCK`, `WEEK_STRIP_MOCK`, `LATEST_DISPATCH_MOCK`, `getMockHeatmap()` — moverlas a tests si todavía se usan ahí, o borrar |

---

## Criterios de aceptación

1. La home muestra solo análisis que existen en `50-Publicaciones/` con `tipo: publicación`. Verificar con grep que ninguno de los títulos mostrados sea inventado.
2. Si el vault tiene `Colombia - la sospecha antes del voto`, esa card aparece linkeada a `/publicaciones/colombia-la-sospecha-antes-del-voto` (no a `/analisis/co/...`, salvo decisión contraria en Spec 26).
3. Strip "Esta semana" muestra el eje dominante derivado del corpus real de la semana ISO actual, o se omite si no hay publicaciones esta semana.
4. Heatmap muestra cuentas reales por eje × semana. Una celda solo tiene `count > 0` si efectivamente existen publicaciones con ese `ejePrincipal` en esa semana ISO.
5. Card del despacho muestra el último despacho real del vault (cuando Spec 31 esté ejecutada). Si no hay despachos, la card se omite.
6. Ningún `MOCK_*` ni `*_MOCK` queda referenciado desde `app/page.tsx` o sus children.
7. Type-check pasa.
8. `next build` completa sin errores.
9. Una visita a `/` con el vault vacío de publicaciones muestra placeholders editoriales honestos (§5), no contenido inventado.

---

## Edge cases

- **Publicación con `tipo` ausente en frontmatter** → log warning, tratar como `publicación` por default (retrocompatibilidad con archivos viejos).
- **Publicación con `fecha` malformada** → log warning, omitir de cards y de heatmap.
- **Eje no reconocido en `ejes:` del frontmatter** → log warning, ignorar al computar el strip "Esta semana".
- **Dos publicaciones con misma fecha y mismo título** → renderizar ambas (problema editorial del vault, no de la home).
- **Corpus enorme (50+ publicaciones)** → cards limita a 5, heatmap limita a 12 semanas. No hay paginación en la home — quien quiere ver más va al archivo.
- **Semana ISO cruza año** (sem 1 de 2027 vs sem 52 de 2026) → el heatmap respeta semana ISO, no calendario. Confirmar con `date-fns` o equivalente para evitar off-by-one.

---

## No incluido en esta spec

- **Rediseño visual de la home.** Spec 11 cubre eso. Spec 30 es solo el cableado al corpus real. La estructura visual queda como está.
- **Cambios al loader de publicaciones.** Spec 26 define `getAllPublications`; esta spec lo consume sin modificar.
- **Despachos.** El loader lo provee Spec 31. Mientras 31 no esté ejecutada, `latestDispatch` queda como `null` y la card se omite.
- **Borradores diarios en la home.** No se muestran. Si en el futuro se quieren incluir, es spec aparte. La home queda exclusivamente para publicaciones promovidas.

---

## Implementación sugerida

1. Esperar que Spec 26 establezca `getAllPublications()` en `lib/content.ts` (o ejecutarla en paralelo si conviene).
2. Crear `lib/home.ts` con `getHomeData()`. Test manual con `node` que la función devuelve datos coherentes con el vault.
3. Refactorar `app/page.tsx` para llamar `getHomeData()` y pasar a children por props.
4. Eliminar fixtures hardcoded de los componentes hijos. Confirmar con grep que no quedan referencias.
5. Visual check de la home: strip, cards, heatmap, despacho (o ausencia honesta de despacho).
6. Type-check + `next build`.
7. Validar criterio 1: ningún título de card es inventado.

---

## Dependencia explícita con Spec 26

Esta spec **no se puede ejecutar antes que Spec 26** porque depende de `getAllPublications()`. Si Spec 26 se termina parcialmente (ej. solo `/analisis` se cablea al vault pero `/pais/<slug>` queda pendiente), Spec 30 todavía puede ejecutarse — solo necesita el loader. Lo que importa es que el loader exista y sea estable.

Si conviene operativamente, Spec 30 y Spec 26 se pueden ejecutar como un solo PR (la home siempre fue parte del problema "corpus invisible"). Decisión queda en quien implemente.