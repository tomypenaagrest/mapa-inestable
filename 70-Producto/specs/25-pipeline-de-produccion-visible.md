---
spec: 25
titulo: Pipeline de producción visible — vista interna del flujo borrador → publicación
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-10
afecta: [/pipeline (nueva ruta), platform/frontend/src/lib/content.ts, platform/frontend/src/lib/pipeline.ts (nuevo)]
depende_de: [Spec 23 (frontmatter), Spec 24 (promover)]
relaciona_con: [Spec 11 (rediseño home dashboard)]
prioridad: media-baja
---

# 25 · Pipeline de producción visible

## Resumen ejecutivo

Hoy el flujo de producción del proyecto vive en tres lugares aislados:

1. **Agente diario** escribe en `60-Borradores/diario/`
2. **Tomás edita** un borrador y lo promueve (Spec 24) → aparece en `50-Publicaciones/`
3. **Substack** publica la versión final

No hay una sola vista que muestre el estado de todas las piezas en proceso. Esta spec define una **vista interna** (privada, `robots: noindex`) en `/pipeline` que muestre cada pieza con su estado actual y el tiempo en cada estado.

**Solo lectura**, no edita. Es un dashboard de observabilidad del proyecto editorial.

---

## Estados del pipeline

| Estado | Origen del dato | Descripción |
|---|---|---|
| `agente` | `60-Borradores/diario/` con `estado: borrador` | Producido por el agente, sin tocar |
| `en-edicion` | mismo dir, `estado: en-edicion` (manual) | Tomás está editando para publicar |
| `promovido` | mismo dir, `estado: promovido` | Pasó a `50-Publicaciones/`, esperando salir en Substack |
| `publicado` | `50-Publicaciones/*.md` con `estado: publicada` y `url:` válida | Vive en Substack |
| `archivado` | `50-Publicaciones/*.md` con `estado: archivada` | Publicado pero bajado / despublicado |

El estado `en-edicion` es nuevo: lo agregamos para distinguir "borrador del agente sin tocar" de "borrador que Tomás está trabajando". Se setea manualmente o por Spec 24 al iniciar promoción.

---

## Vista propuesta

URL: `/pipeline` (oculta del nav público, accesible por URL directa)
Header: meta-bar negra como las demás páginas internas
Layout: **Kanban** con 5 columnas (los 5 estados arriba), cards arrastrables visualmente (no funcional drag & drop por ahora — solo cards estáticas).

### Cards

Cada card muestra:
- País (pill de color)
- Eje principal (pill cromático del eje)
- Título (1-2 líneas)
- Fecha del archivo (último update si es borrador, fecha de publicación si es publicada)
- "Días en este estado" (calculado desde `published_iso`/`mtime`)
- Link al detalle (`/analisis/borradores/<pais>/<slug>` para borradores, URL Substack para publicadas)

### Métricas en el header

- Total piezas en pipeline (todos los estados)
- Promedio de días `agente` → `publicado` (lead time)
- Piezas estancadas (>14 días en `agente` o `en-edicion`) — destacadas en rojo

### Filtros

- Por país (multi-select)
- Por eje (multi-select)
- Por mes (mostrar solo lo publicado/escrito en un mes determinado)

---

## Implementación técnica

### Nueva función en `lib/pipeline.ts`

```ts
export type PieceState = "agente" | "en-edicion" | "promovido" | "publicado" | "archivado";

export interface PipelinePiece {
  state:        PieceState;
  countrySlug:  string;
  country:      string;
  title:        string;
  ejePrincipal: string;
  ejes:         string[];
  date:         string;          // YYYY-MM-DD del archivo (borrador) o publicación
  daysInState:  number;
  detailHref:   string;
  substackUrl?: string;
  source:       "draft" | "publication";
  filename:     string;
}

export function getAllPipelinePieces(): PipelinePiece[] {
  // 1. leer 60-Borradores/diario/*.md → mapear a PipelinePiece según `estado`
  // 2. leer 50-Publicaciones/*.md → mapear a PipelinePiece (ignorando MOCs y plantillas)
  // 3. concatenar, ordenar por date desc
}
```

### Página `/pipeline`

`platform/frontend/src/app/pipeline/page.tsx`:

- Server Component, llama `getAllPipelinePieces()`
- Pasa el array a un Client Component que maneja filtros (URL state)
- Renderiza Kanban (5 columnas, scroll horizontal en mobile)
- Header con métricas calculadas server-side

### `robots: noindex` y meta-bar privada

```tsx
export const metadata = {
  title: "Pipeline — Mapa Inestable [interno]",
  robots: { index: false, follow: false },
};
```

Banner amarillo arriba: "Vista interna del proceso editorial. No para difusión."

### Linkeo desde `/analisis`

En el header de `/analisis` (donde ya pusimos "Borradores del agente →"), agregar otro link "Pipeline →".

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/pipeline.ts` (nuevo) | Función `getAllPipelinePieces`, tipos `PieceState`, `PipelinePiece` |
| `platform/frontend/src/lib/content.ts` | Reutilizar funciones existentes; quizás extraer una `readAllPublications()` que paralelize a `getAllAgentDrafts` |
| `platform/frontend/src/app/pipeline/page.tsx` (nuevo) | Server component con métricas |
| `platform/frontend/src/app/pipeline/PipelineClient.tsx` (nuevo) | Kanban + filtros |
| `platform/frontend/src/app/analisis/AnalisisContent.tsx` | Agregar link "Pipeline →" en el header |

---

## Criterios de aceptación

1. ✅ `/pipeline` renderiza con las piezas existentes en sus columnas correctas.
2. ✅ El header muestra total, lead time promedio, piezas estancadas.
3. ✅ Filtros por país y eje funcionan (URL state, compartibles).
4. ✅ Cards "estancadas" (>14 días) se destacan visualmente.
5. ✅ Cards de publicaciones linkean al Substack en una nueva pestaña; cards de borradores linkean a `/analisis/borradores/...`.
6. ✅ La página tiene `robots: noindex`.
7. ✅ Mobile: Kanban en scroll horizontal sin romper layout.
8. ✅ Type-check pasa.

---

## Métricas que reporta el header (cálculo)

- **Total**: `pieces.length`
- **Lead time promedio**: para cada pieza con `state === "publicado"`, calcular días entre el primer registro del agente (heurística: archivo más viejo en `60-Borradores/diario/` con mismo título o slug) y la `published_iso`. Promedio.
- **Estancadas**: piezas con `state ∈ ["agente", "en-edicion"]` y `daysInState > 14`.

---

## Edge cases

- **Pieza promovida pero el .md original ya fue borrado** — el comando de Spec 24 dice que NO borra; pero por si acaso, si solo existe la publicación sin draft, marcarla `estado: publicado` y omitir el lead time.
- **Publicación sin URL** (`url:` vacío) — log warning, omitir de la columna `publicado`, agregar a `estancada` con razón "publicación sin URL".
- **Pieza con frontmatter inválido** — log warning, omitir.

---

## No incluido en esta spec (futuro)

- Drag & drop entre columnas (cambia el `estado` del .md). Nice to have, requiere endpoint de escritura.
- Notificaciones push cuando una pieza queda estancada >X días.
- Métricas históricas (eje más publicado por mes, country mix, etc.).

---

## Implementación sugerida

1. Crear `lib/pipeline.ts` con la función pura `getAllPipelinePieces()`.
2. Test manual: ejecutar la función desde `node` y verificar el output.
3. Crear `/pipeline/page.tsx` con render mínimo (sin filtros).
4. Agregar header con métricas.
5. Agregar `PipelineClient.tsx` con filtros (URL state).
6. Polish visual + mobile.
