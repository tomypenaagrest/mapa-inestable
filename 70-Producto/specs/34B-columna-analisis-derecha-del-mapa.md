---
spec: 34B
titulo: Columna de últimos análisis a la derecha del mapa
estado: borrador
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta:
  - platform/frontend/src/app/page.tsx
  - platform/frontend/src/components/MapaHeatmapSection.tsx (ahora renombrable a MapaSidePanelSection)
  - platform/frontend/src/components/CountryQuickPanel.tsx (panel preview existente)
  - platform/frontend/src/components/AnalisisColumn.tsx (nuevo)
  - platform/frontend/src/components/CarouselAnalisis.tsx (posiblemente removible)
depende_de: [22, 30, 33, 34]
extiende: 34
relaciona_con: [Spec 11 (rediseño home original), Spec 19 (ensayos como revista — comparte patrón de mini-card)]
prioridad: alta — define el above-the-fold de la home, junto con Spec 34
---

# 34B · Columna de últimos análisis a la derecha del mapa

## Resumen ejecutivo

Spec 34 redefinió el layout vertical del home: mapa entero arriba, "Esta semana" debajo, carrusel angosto, despacho, heatmap profundo. Esta spec **afina la zona above-the-fold**: el espacio a la derecha del mapa pasa a tener una **columna permanente de los últimos análisis encolumnados**. Esa columna reemplaza el carrusel horizontal post-fold que Spec 34 §8 había propuesto, y obliga a redefinir cómo se muestra el preview de país (Spec 22 §12.2 + Spec 33).

**Lo que entra:**

- Columna lateral a la derecha del mapa, alto igual al mapa (`calc(100vh - 100px)`).
- 3-5 mini-cards verticales con los últimos análisis publicados (del corpus real, Spec 30).
- Diseño distinto del carrusel: más denso, sin imagen grande, lectura escaneable.
- Click en una mini-card → `/analisis/[pais]/[slug]` (navega completo).
- El carrusel horizontal post-fold de Spec 34 §8 **se elimina** (la columna toma su rol).

**Lo que cambia respecto a Spec 22 + Spec 33:**

- El panel preview de país (slide-in lateral con secciones EJES CRÓNICOS + ESTA SEMANA + AGENDA + CTA) **pasa a ser un modal centrado** que se abre al click en un país del mapa. Ya no compite por el espacio de la derecha — ese espacio ahora lo ocupa la columna fija.
- Hover sobre un país: solo highlight visual del país en el mapa + tooltip mínimo (nombre + 1 línea). No abre panel.
- Click sobre un país: abre el modal preview centrado, con backdrop.

---

## 1. Diagnóstico

### 1.1 La tensión que esta spec resuelve

Tres cosas competían por el espacio a la derecha del mapa hasta ahora:

1. **Panel preview de país** (Spec 22 §12.2 + Spec 33): slide-in lateral 220-360px al hover/click.
2. **Carrusel angosto de análisis** (Spec 34 §8): horizontal post-fold, 2 cards de 320px.
3. **Columna de últimos análisis** (esta spec, nueva propuesta de Tomás): permanente a la derecha del mapa.

(1) y (3) ocupaban literalmente el mismo espacio físico (derecha del mapa) con propósitos distintos. Tener los dos creaba conflicto: ¿qué hace el espacio cuando no hay hover? Quedaba vacío.

(2) y (3) tenían propósitos similares: mostrar análisis recientes. Tenerlos juntos era redundante.

**Resolución r1:**

- (3) gana el espacio derecho del mapa permanente.
- (1) pasa a modal centrado, se invoca solo al click.
- (2) se elimina — la columna asume el rol.

### 1.2 Layout actualizado above-the-fold

```
┌──────────────────────────────────────────────────────────────────────────┐
│ HEADER 70px                                                               │
├──────────────────────────────────────────────────────────────────────────┤
│ side- │ ┌──────────────────────────────────┐ ┌────────────────────────┐ │
│ bar   │ │                                  │ │ ÚLTIMOS ANÁLISIS       │ │
│ 200px │ │   MAPA TORRES GARCÍA             │ │                        │ │
│       │ │                                  │ │ ┌────────────────────┐ │ │
│       │ │   alto: calc(100vh - 100px)      │ │ │ mini-card 1        │ │ │
│       │ │   ancho: aspectRatio derivado    │ │ │ Colombia · 27 abr  │ │ │
│       │ │                                  │ │ │ DESORIENTACIÓN     │ │ │
│       │ │   click país → modal preview     │ │ │ La sospecha antes…│ │ │
│       │ │   hover país → tooltip mínimo    │ │ └────────────────────┘ │ │
│       │ │                                  │ │                        │ │
│       │ │                                  │ │ ┌────────────────────┐ │ │
│       │ │                                  │ │ │ mini-card 2        │ │ │
│       │ │                                  │ │ └────────────────────┘ │ │
│       │ │                                  │ │                        │ │
│       │ │                                  │ │ ┌────────────────────┐ │ │
│       │ │                                  │ │ │ mini-card 3        │ │ │
│       │ │                                  │ │ └────────────────────┘ │ │
│       │ │                                  │ │                        │ │
│       │ │                                  │ │ ┌────────────────────┐ │ │
│       │ │                                  │ │ │ mini-card 4        │ │ │
│       │ │                                  │ │ └────────────────────┘ │ │
│       │ │                                  │ │                        │ │
│       │ │                                  │ │ → Ver todos los análisis│ │
│       │ └──────────────────────────────────┘ └────────────────────────┘ │
└───────┴──────────────────────────────────────────────────────────────────┘
                              ↓ scroll
            ESTA SEMANA · [eje]
            ÚLTIMO DESPACHO
            HEATMAP EJES × SEMANAS (zona profunda)
            FOOTER
```

---

## 2. Anatomía de la columna

### 2.1 Posicionamiento

- **Ancho**: `flex: 1` con `minWidth: 280px`, `maxWidth: 380px`. Se adapta al espacio disponible entre el mapa (a la izquierda) y el borde derecho del viewport.
- **Alto**: 100% del contenedor `MapaSidePanelSection`, que ya está acotado a `calc(100vh - 100px)` por Spec 34 §6.
- **Border**: `border-left: var(--mi-border-thick)` para separación visual del mapa. Sin sombra (no compite con el mapa).
- **Padding**: 24px arriba, 16px laterales y abajo.
- **Overflow**: `overflow-y: auto`. Si las mini-cards no entran en el alto disponible, scroll interno (sin scrollbar visible — `scrollbar-width: none`).

### 2.2 Encabezado de la columna

```
ÚLTIMOS ANÁLISIS
```

- Mono uppercase 13px, color `--mi-ink-mute`, letter-spacing 0.12em.
- Padding-bottom 16px.
- Border-bottom hair line `--mi-rule-soft` 1px.

### 2.3 Lista de mini-cards

- Cantidad: **4 mini-cards** por default. Si el alto del viewport no entra 4, scroll interno deja ver el resto.
- Gap entre cards: 12px.
- Origen de datos: `getHomeData().cards.slice(0, 4)` (Spec 30).

### 2.4 Footer de la columna

```
→ Ver todos los análisis
```

- Mono uppercase 12px color `--mi-ink-mute`, hover `--mi-ink`.
- Padding-top 16px.
- Border-top hair line `--mi-rule-soft` 1px.
- Click navega a `/analisis` (archivo completo, Spec 05).

---

## 3. Mini-card (diseño nuevo)

Distinto del componente `<AnalysisCard>` del carrusel/archivo (que tiene imagen + lede + metadata expandida). La mini-card es más densa, optimizada para escaneo vertical en columna angosta.

### 3.1 Anatomía

```
┌────────────────────────────────────────┐
│ COLOMBIA · 27 ABR · sem 17             │  ← mono uppercase 11px, --mi-ink-mute
│ ─────────────────────────────────────  │
│ [DESORIENTACIÓN]                       │  ← axis pill chico, 11px
│                                        │
│ La sospecha antes del voto             │  ← Fraunces 17px, --mi-ink
│                                        │
│ A 103 días del fin del mandato, Petro │  ← Lora italic 13px, --mi-ink-soft
│ pone en duda la transparencia…         │     truncado a 2 líneas máx
└────────────────────────────────────────┘
```

### 3.2 Especificaciones

- **Background**: `--mi-bg-paper` (crema).
- **Border**: `--mi-border-thick` (2px ink).
- **Sombra**: `--mi-shadow-card` (offset stamp 4 4 0).
- **Hover**:
  - `transform: translate(-2px, -2px)`.
  - `box-shadow: 6 6 0` (más profundo).
  - `transition: 120ms cubic-bezier(0.2, 0, 0, 1)`.
- **Padding**: 16px.
- **Min-height**: 120px. Max-height auto.
- **Click**: navega a `/analisis/[pais]/[slug]`.
- **Cursor**: pointer.

### 3.3 Metadata superior

`COLOMBIA · 27 ABR · sem 17`

- País en uppercase.
- Fecha relativa o absoluta (a definir — propongo absoluta corta "27 abr" en lowercase para distinguir).
- Semana ISO al final.
- Separados por `·`.

### 3.4 Axis pill

Misma anatomía que las pills del proyecto (axis-color de fondo, texto `--mi-bg-paper`, mono uppercase, padding 2px 8px). Solo el eje principal del análisis (`ejePrincipal` del frontmatter, Spec 30).

### 3.5 Título

Fraunces 17px, weight 400, line-height 1.2, max-height 2.4em (2 líneas), `text-overflow: ellipsis`, `overflow: hidden`.

### 3.6 Lede

Lora italic 13px, line-height 1.4, `-webkit-line-clamp: 2` para truncar a 2 líneas, `text-overflow: ellipsis`.

### 3.7 Estados de lectura (Spec 15 markers)

- **Default**: como arriba.
- **Nuevo desde `lastVisit`**: dot dorado 6px en top-right del card.
- **Leído**: título en `--mi-ink-mute` (opacity ~0.7), metadata en mute aún más mute. Mantiene click navegable.

---

## 4. Conflicto con el panel preview de país

### 4.1 Estado anterior (Spec 22 §12.2 + Spec 33)

Click sobre un país en el mapa → **panel preview slide-in lateral** a la derecha (220-360px), con secciones: nombre país, EJES CRÓNICOS, ESTA SEMANA, AGENDA (Spec 33), CTA "VER FICHA COMPLETA →".

### 4.2 Estado nuevo (esta spec)

El espacio a la derecha del mapa ahora está ocupado por la columna permanente de análisis. El panel preview pasa a ser **un modal centrado** con backdrop semi-transparente.

### 4.3 Anatomía del modal preview

```
┌─────────────────────────────────────────────────────────┐
│                                                          │ ← backdrop oscuro
│       ┌───────────────────────────────────────┐         │   semi-transparente
│       │  BOLIVIA                          ×   │         │   (no blur, regla DS)
│       ├───────────────────────────────────────┤         │
│       │  EJES CRÓNICOS                         │         │
│       │  [Desrepresentación] [Desorientación] │         │
│       ├───────────────────────────────────────┤         │
│       │  ESTA SEMANA                           │         │
│       │  ┌────────────────────────────────┐  │         │
│       │  │ El MAS sin Evo, sin Arce…      │  │         │
│       │  └────────────────────────────────┘  │         │
│       ├───────────────────────────────────────┤         │
│       │  AGENDA · sem 20 · 2026                │         │
│       │  01 ↑ Bloqueos masivos                 │         │
│       │  02 ↑ Marcha evista…                   │         │
│       │  ...                                   │         │
│       ├───────────────────────────────────────┤         │
│       │  [VER FICHA COMPLETA →]               │         │
│       └───────────────────────────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 4.4 Especificaciones del modal

- **Backdrop**: `rgba(31, 42, 18, 0.75)` (verde-negro semi-transparente). **Sin blur** (regla del DS, Spec 15 §10.3).
- **Dimensiones del modal**: width 480px desktop, max-width 90vw mobile. Height auto, max-height 80vh con scroll interno.
- **Posición**: centrado horizontal y vertical (`position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`).
- **Background del modal**: `--mi-bg-paper`.
- **Border**: `--mi-border-bold` (3px ink).
- **Sombra**: `--mi-shadow-hero` (12 12 0).
- **Padding**: 24px.
- **Botón cerrar (×)**: top-right, mono, 24px, color `--mi-ink`.

### 4.5 Eventos

- **Click sobre país en mapa**: abre el modal.
- **Click sobre backdrop**: cierra el modal.
- **Click sobre `×`**: cierra el modal.
- **`Esc`**: cierra el modal.
- **Tab**: focus se restringe dentro del modal (focus trap).

### 4.6 Hover sobre país en mapa

- No abre modal.
- Solo highlight visual del país: `fill="rgba(192, 83, 46, 0.15)"` sobre la hot-zone (Spec 22 §15).
- Tooltip mínimo a 80px del cursor: nombre del país + cuenta de análisis. Ej: `Bolivia · 4 análisis`. Mono 12px, fondo `--mi-bg-paper`, border `--mi-border-thick`.

### 4.7 Impacto en Spec 22 y Spec 33

**Spec 22 §12.2 — `<CountryPreviewPanel>`:** queda obsoleto en su forma slide-in lateral. Se rebautiza como `<CountryModalPanel>` y se reescribe como modal centrado. El contenido (secciones EJES CRÓNICOS / ESTA SEMANA / AGENDA / CTA) **se mantiene idéntico**.

**Spec 33 §3 — AGENDA en el panel:** sin cambios al contenido, solo al contenedor (de slide-in lateral a modal centrado). La sección Agenda sigue siendo el tercer bloque dentro del panel.

Update concreto:
- Spec 22 §12.2 → marcar con nota "El panel pasa a ser modal en Spec 34B; el contenido sigue igual".
- Spec 33 §3 → marcar con nota "Los criterios de aceptación siguen válidos pero el contenedor es modal, no panel lateral".

---

## 5. Eliminación del carrusel post-fold

### 5.1 Justificación

El carrusel horizontal post-fold de Spec 34 §8 mostraba "últimos análisis con rotación dinámica". La columna lateral propuesta acá hace lo mismo de forma vertical y permanente. Tener los dos sería redundante.

### 5.2 Lo que se conserva del carrusel

Nada como bloque dedicado. Pero algunas decisiones de Spec 34 §8 migran a la columna:
- Auto-slide cada 5s → **no aplica** en la columna (la lista es estática, no rota).
- Fade + slide horizontal → **no aplica**.
- Pausa en hover → **no aplica**.
- Dots → **no aplica**.

La columna es **estática y escaneable**, no rotante. Es la diferencia conceptual: el carrusel pedía atención secuencial (una card por vez); la columna ofrece comparación vertical (varias cards visibles juntas).

### 5.3 Update a Spec 34

Spec 34 §8 entera queda **superseded by Spec 34B**. Marcar §8 con nota: "Reemplazado por Spec 34B columna lateral. Carrusel descartado por redundante."

Spec 34 §3.2 (orden vertical de bloques) actualizado:

| Zona | Bloque |
|---|---|
| Above the fold | Header → mapa+columna análisis (en paralelo, both visibles) |
| Post-fold | Bloque "Esta semana · eje" |
|  | Card último despacho |
|  | Heatmap ejes × semanas |
| Footer | Tagline + hipótesis + ejes + marco |

---

## 6. Mobile (≤640px)

### 6.1 Layout

El layout horizontal mapa + columna no entra en mobile. La columna **se mueve debajo del mapa**, full-width.

```
┌──────────────────────────────────┐
│ HEADER 56px (hamburger)          │
├──────────────────────────────────┤
│ MAPA full-width                  │
│ aspect-ratio 1280/1380           │
│ (width-driven, sin maxHeight)    │
├──────────────────────────────────┤
│ ÚLTIMOS ANÁLISIS                 │
│ ┌────────────────────────────┐  │
│ │ mini-card 1 (full-width)   │  │
│ └────────────────────────────┘  │
│ ┌────────────────────────────┐  │
│ │ mini-card 2                │  │
│ └────────────────────────────┘  │
│ → Ver todos                       │
├──────────────────────────────────┤
│ ESTA SEMANA · eje                │
│ DESPACHO                         │
│ HEATMAP (scroll horizontal)      │
│ FOOTER                           │
└──────────────────────────────────┘
```

### 6.2 Mini-cards en mobile

- Full-width del viewport (con padding lateral 16px).
- Cantidad: 3 (en lugar de 4) para no alargar demasiado el scroll antes de "Esta semana".

### 6.3 Modal preview en mobile

- Width: 100vw - 32px (margin lateral 16px cada lado).
- Max-height: 90vh con scroll interno.
- Botón cerrar más prominente (32px) por target touch.

---

## 7. Variables CSS y archivos a tocar

### 7.1 Variables nuevas en `globals.css`

```css
:root {
  /* Spec 34B */
  --mi-analisis-col-min-w: 280px;
  --mi-analisis-col-max-w: 380px;
}
```

### 7.2 Archivos a tocar

| Archivo | Cambio |
|---|---|
| `app/page.tsx` | Sumar la columna AnalisisColumn a la derecha del mapa. Remover el carrusel post-fold. |
| `components/MapaHeatmapSection.tsx` (renombrar a `MapaSidePanelSection.tsx`) | Reemplazar el panel preview por la columna estática |
| `components/AnalisisColumn.tsx` (**nuevo**) | Renderiza el header "ÚLTIMOS ANÁLISIS", la lista de 4 mini-cards, el footer "→ Ver todos" |
| `components/MiniAnalysisCard.tsx` (**nuevo**) | Mini-card densa (metadata + axis pill + título + lede de 2 líneas) |
| `components/CountryModalPanel.tsx` (renombrar de `CountryPreviewPanel.tsx`) | Convertir de slide-in lateral a modal centrado |
| `components/Carousel.tsx` o equivalente | **Eliminar o desactivar** — Spec 34B lo deprecia |
| `app/globals.css` | Sumar variables CSS del §7.1 |

---

## 8. Criterios de aceptación

1. La columna de últimos análisis aparece a la derecha del mapa, con su mismo alto.
2. La columna muestra 4 mini-cards con publicaciones reales del corpus (Spec 30).
3. Cada mini-card es clickeable y navega a `/analisis/[pais]/[slug]`.
4. Click sobre un país en el mapa abre un modal centrado con el preview (no slide-in lateral).
5. Hover sobre un país: highlight visual + tooltip mínimo (nombre + cuenta).
6. El carrusel post-fold ya no existe en `app/page.tsx`.
7. En mobile, la columna se mueve debajo del mapa, full-width, con 3 mini-cards.
8. El modal preview funciona en mobile (full-width con margen) y desktop (centrado 480px).
9. `Esc` cierra el modal. Click en backdrop cierra el modal.
10. Spec 30 (`getHomeData()`), Spec 33 (sección Agenda dentro del panel) y Spec 22 (mapa interactivo) siguen funcionando sin regresión.

---

## 9. Decisiones pendientes

1. **Cantidad de mini-cards visibles en desktop:** propongo 4. Alternativas: 3 (más aire), 5 (más denso, requiere scroll interno en viewports altos). Confirmar.

2. **Hover sobre mini-card vs hover sobre país:** ¿el hover en una mini-card resalta el país correspondiente en el mapa? Mi recomendación: sí, como confirmación visual del vínculo. Costo: implementar comunicación bidireccional columna ↔ mapa.

3. **Estado vacío (corpus sin análisis recientes):** si `getHomeData().cards` está vacío, ¿qué muestra la columna? Propongo placeholder editorial: "EL ARCHIVO ESTÁ ARRANCANDO" (mismo patrón que Spec 30 §5).

4. **Filtros mínimos en la columna:** ¿algún filtro rápido por eje en el header de la columna (chip pequeño)? Mi recomendación: no en v1. Si el lector quiere filtrar, va al archivo `/analisis`.

5. **Si el sidebar de navegación se mantiene en 200px en este nuevo layout** o se reduce más (ej. siempre colapsado a 48px en home para dar más espacio a mapa + columna). Mi recomendación: mantener 200px expandido por consistencia con Spec 15 §7.2.

6. **Si hay un divisor visual más fuerte entre el mapa y la columna** que el `border-left` propuesto. Alternativa: gap horizontal de 24px sin border. Decisión visual post-implementación.

7. **Si el modal preview de país abre con animación (slide-up + fade)** o aparece directo. Spec 15 §10.3 dice cero blur; animación suave sí. Propuesta: fade-in 150ms + scale 0.95 → 1.0.

---

## 10. Roadmap

### Fase A — Estructura nueva (1-2 días)

1. Crear `<AnalisisColumn>` y `<MiniAnalysisCard>`.
2. Modificar `MapaHeatmapSection.tsx` para reemplazar el panel slide-in por la columna estática.
3. Cablear `getHomeData().cards` a la columna.

### Fase B — Modal preview de país (1 día)

1. Convertir `<CountryPreviewPanel>` en `<CountryModalPanel>`.
2. Implementar backdrop, centrado, focus trap, cierre por Esc/click backdrop/×.
3. Verificar que la sección AGENDA (Spec 33) funciona dentro del nuevo contenedor.

### Fase C — Cleanup (½ día)

1. Eliminar el carrusel horizontal del home.
2. Eliminar imports y constantes huérfanas.
3. Update a Spec 22 §12.2 y Spec 33 §3 con notas del nuevo contenedor modal.
4. Update a Spec 34 §8 marcándolo como superseded.

### Fase D — Mobile + a11y + visual check (1 día)

1. Layout responsive de la columna debajo del mapa en mobile.
2. Modal mobile (full-width con margen).
3. Keyboard navigation: Tab desde columna → mapa → modal.
4. Validar AC1-AC10.

**Tiempo total estimado:** 3-4 días.

---

## 11. Cierre

La columna de últimos análisis a la derecha del mapa convierte el above-the-fold del home en un **dashboard de lectura inmediata**: el mapa como navegación geográfica, la columna como acceso operativo a las publicaciones recientes — todo visible sin scroll. El panel preview de país queda reservado para el momento en que el lector pide profundizar sobre un país específico (click), no para hover casual.

Esta arquitectura honra mejor lo que Tomás pidió: "el mapa es parte central del dashboard". El mapa queda como ancla visual; la columna como utilidad permanente; el modal como gesto explícito de profundización. Cada elemento tiene su rol claro y no compite por el espacio.
