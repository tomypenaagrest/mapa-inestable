---
spec: 56
titulo: Pantallas mobile restantes — archivo, ejes (índice + detalle), comparador, leer-después, pipeline (declarado interno)
estado: implementada
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-27
afecta:
  - platform/frontend/src/app/analisis/page.tsx (refactor mobile — Patrón A)
  - platform/frontend/src/app/ejes/page.tsx (refactor mobile — reuso Patrón 1 de Spec 55)
  - platform/frontend/src/app/ejes/[slug]/page.tsx (refactor mobile — Patrón B)
  - platform/frontend/src/app/comparar/[indicador]/page.tsx (refactor mobile — Patrón C)
  - platform/frontend/src/app/leer-despues/page.tsx (refactor mobile — reuso Patrón A)
  - platform/frontend/src/app/pipeline/page.tsx (sin cambios; declarado vista interna sin tratamiento mobile dedicado)
  - platform/frontend/src/components/ArchivoConFiltros.tsx (NUEVO — Patrón A reutilizable)
  - platform/frontend/src/components/EjePageMobile.tsx (NUEVO — Patrón B)
  - platform/frontend/src/components/ComparadorRanking.tsx (NUEVO — Patrón C)
  - platform/frontend/src/components/IndicadorSelectorSheet.tsx (NUEVO — bottom-sheet del selector de indicador en /comparar)
  - platform/frontend/src/styles/mobile-restantes.css (NUEVO o refactor)
depende_de: [04, 05, 13, 15, 25, 50, 52, 53, 55]
relaciona_con: [Spec 04 (páginas de eje — esta spec define mobile), Spec 05 (archivo + buscador — esta spec define mobile e integra el buscador inline), Spec 13 (comparativa — esta spec define mobile del ranking), Spec 15 §5 (lector recurrente con localStorage — esta spec aplica a /leer-despues), Spec 25 (pipeline — esta spec lo declara fuera de scope detallado), Spec 50/52/53/55 (reusos tipográficos y de componentes), EPIC-04 (octava y última spec hija)]
prioridad: media
bloqueante_de: cobertura mobile completa del corpus público antes del lanzamiento de julio
desbloquea: lectores que llegan al archivo por SEO, lectores recurrentes que usan leer-después, lectores que exploran /ejes/[slug] desde el frame strip de país o desde el drawer
---

# 56 · Pantallas mobile restantes — archivo, ejes, comparador, leer-después, pipeline

## Resumen ejecutivo

EPIC-04 r1 declaró fuera de scope las pantallas secundarias (archivo `/analisis`, página de eje `/ejes/[slug]`, comparativa `/comparar/[indicador]`, leer-después, pipeline). En r7 se sumó Spec 55 para cubrir conceptos/autores/acerca/método. Esta r8 cierra la cobertura mobile sumando las pantallas restantes que aún quedaban con responsive básico de Spec 02.

Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-27) sobre los 3 patrones nuevos necesarios (archivo, eje individual, comparador). Las otras 2 pantallas (índice de ejes, leer-después) se derivan de patrones ya validados (Spec 55 Patrón 1, esta spec Patrón A). `/pipeline` se declara explícitamente como vista interna privada sin tratamiento mobile dedicado.

**Outcome.** Un lector que llega a `/analisis` desde el drawer "Buscar →" ve: page header + input de búsqueda full-text + chips horizontales scrolleables por año y por eje + lista de cards de análisis. Si abre `/ejes/desorientacion-epistemologica`, ve hero terracota con color del eje + lede pedagógico + secciones apiladas (qué describe, países donde es crónico, análisis recientes). Si abre `/comparar/apoyo-democracia`, ve selector sticky arriba que abre bottom-sheet con los 12 indicadores agrupados por eje + ranking vertical de 17 países con barras + línea de promedio regional. `/leer-despues` reusa el patrón del archivo con label "LISTA PERSONAL". `/pipeline` cae al responsive de Spec 02 porque es admin.

**Lo que entra en r1:**

- **Patrón A — Archivo con filtros**: aplica a `/analisis` y `/leer-despues`. Page header + buscador full-text inline + 2 bandas de chips horizontales (temporal + eje) + cards en 1 columna.
- **Patrón B — Página de eje individual**: aplica a `/ejes/[slug]`. Hero con color del eje + secciones apiladas (sin tabs, más liviano que `/pais/[slug]`).
- **Patrón C — Comparador con ranking**: aplica a `/comparar/[indicador]`. Selector sticky + bottom-sheet de indicadores + ranking vertical de 17 países con barras + línea de promedio regional.
- **Reuso de Spec 55 Patrón 1** (índice de glosario): aplica a `/ejes` (los 6 ejes como índice navegable con pin de color + bajada).
- **Reuso de Patrón A** filtrado por localStorage (Spec 15 §5): aplica a `/leer-despues`.
- **`/pipeline` declarado fuera de scope detallado** pero documentado: vista interna privada, `robots: noindex`, oculta del nav público (Spec 25). Sigue con responsive de Spec 02.

**Lo que NO entra en r1:**

- Búsqueda semántica / vectorial. Spec 05 ya lo excluyó.
- Filtros por autor citado o por concepto vinculado en `/analisis`. Spec 05 ya lo excluyó.
- Saved searches / alertas. Diferido.
- Heatmap matriz 12×17 en `/comparar`. Spec 13 ya lo excluyó.
- Comparador 2-3 países side-by-side. Spec 13 ya lo excluyó.
- Coloreado del mapa por indicador desde `/comparar`. Spec 13 ya lo excluyó.
- Reordenamiento del ranking de `/comparar`. En r1 siempre descendente por valor.
- Tratamiento mobile dedicado de `/pipeline`. Vista admin, no público.
- Modificaciones al contenido editorial de las pantallas (cuerpo de las páginas de eje, lecturas curadas del comparador). Spec 04 y Spec 13 son fuentes — esta spec solo define render.

---

## Estado actual

### En las specs anteriores

- **Spec 04** define la estructura editorial de `/ejes` (índice) y `/ejes/[slug]` (detalle). Esta spec NO modifica contenido — solo define render mobile.
- **Spec 05** define `/analisis` con filtros + buscador full-text. Mobile: filtros como chips horizontales scrolleables ya estaban pensados conceptualmente; esta spec los formaliza con el patrón ya usado en Spec 52.
- **Spec 13** define `/comparar/[indicador]` con selector lateral en desktop + ranking de 17 países. Esta spec resuelve cómo se hace el selector en 360 (bottom-sheet) y cómo se ve el ranking sin la sidebar lateral.
- **Spec 15 §5** define el lector recurrente con localStorage. `/leer-despues` consume `readLaterIds` del localStorage para filtrar el corpus completo y mostrar solo los marcados.
- **Spec 25** define `/pipeline` como vista interna privada. Esta spec confirma que el responsive de Spec 02 alcanza — el caso de uso es admin en desktop.

### En el frontend

Las 6 rutas existen como archivos `page.tsx` en `platform/frontend/src/app/`. Mobile cae a versiones colapsadas sin jerarquía pensada para 5 de ellas (la 6ª, `/pipeline`, no necesita mobile dedicado).

### Mockups validados en sesión de Cowork (2026-05-27)

Tres patrones visualizados side-by-side:
- Patrón A: archivo con page header + buscador + chips temporal + chips de ejes + 2 cards de análisis.
- Patrón B: página de "Desorientación epistemológica" con hero terracota color del eje + lede + sección "Qué describe" + sección "Activo en" con grid de países.
- Patrón C: comparador "Apoyo a la democracia" con selector sticky + header con eje pill + ranking de 7 países (Uruguay 78%, Costa Rica 67%, Chile 63%, Argentina 55%, [línea promedio 48%], Brasil 46%, Bolivia 42%, Perú 33%).

Todos aprobados como propuestas.

---

## Propuesta

### 1. Patrón A — Archivo con filtros (`/analisis`, `/leer-despues`)

Anatomía:

```
┌─────────────────────────────────┐
│ HEADER (Spec 53)                │ ← 44px sticky
├─────────────────────────────────┤
│ Archivo                          │ ← label mono 11
│ Análisis                         │ ← h1 Alfa Slab 36
│ 78 análisis · Año II             │ ← meta mono 11
├─────────────────────────────────┤
│ ⌕ Buscar análisis…               │ ← input full-text
├─────────────────────────────────┤
│ [Todos (78) ✓] [2026 (54)] →     │ ← chips temporal scroll-x
│ [Desorient.] [Desrep.] [Estet.] →│ ← chips eje scroll-x con color
├─────────────────────────────────┤
│ COLOMBIA · Desorient.            │ ← card
│ La sospecha antes del voto       │
│ A 103 días del fin del mandato…  │
│ Hace 3 días · sem 19             │
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│ ARGENTINA · Desorient.           │
│ Argentina sin cruzadas           │
│ Sobre el ocaso de la cruzada…    │
│ 11 may 2026 · sem 19             │
└─────────────────────────────────┘
```

**Tokens:**

| Elemento | Token / Valor mobile-360 |
|---|---|
| Page header padding | 22px arriba 16px abajo, 20px lateral, border-bottom 1px tinta |
| Label "ARCHIVO" | mono 11 uppercase letter-spacing 0.1em color mute |
| H1 "Análisis" | Alfa Slab One 36 line-height 1.05 letter-spacing -0.01em |
| Meta "78 análisis · Año II" | mono 11 uppercase letter-spacing 0.06em color mute (etiqueta) + tinta (valor) |
| Buscador input | margin 14 lateral 20, padding 10×12, fondo cream apagado `#ECE0C5`, borde 1.5px tinta, mono 12, ícono ⌕ a la izquierda |
| Chips row padding | 8 arriba 14 abajo, 16 lateral, gap 6, overflow-x auto |
| Chip temporal | mono 10 uppercase letter-spacing 0.06em, padding 5×10, borde 1px tinta, fondo transparente, activo con fondo tinta + texto crema |
| Chip eje | mismo formato pero con fondo color del eje + texto crema desde el inicio (no esperan ser "activos" para colorearse — el color identifica el eje) |
| Card padding | 14 arriba 14 abajo lateral 20, separator 1px dashed `--mi-rule-soft` |
| Card country tag | mono 10 uppercase letter-spacing 0.08em fondo tinta texto terracota padding 3×8 |
| Card eje pill | mono 10 uppercase letter-spacing 0.08em color crema padding 3×8 fondo color del eje, margin-left 4 |
| Card título | Fraunces 600 19 line-height 1.15 margen 4 vertical |
| Card descripción | Lora 400 italic 14 line-height 1.45 color tinta-soft |
| Card footer | mono 10 uppercase letter-spacing 0.06em color mute |

**Comportamiento:**

- Buscador: `<input type="search">` con `autocomplete="off"`. Al recibir foco, no expande nada — se queda inline. Al tipear, debounce 300ms, después navegar a `/analisis?q=<value>` (mantener filtros activos). Si llega desde el drawer "Buscar →" (Spec 53), foco automático al cargar.
- Chips temporal: 1 chip activo a la vez (default "Todos"). Tap reemplaza el activo y navega.
- Chips eje: multi-select. Tap toggle. Múltiples ejes activos = filtro AND (analisis que activen TODOS los ejes seleccionados).
- Estado vacío (filtros sin resultados): card cream con "Sin análisis que combinen estos filtros. Probá quitar uno o ampliar el período."
- Paginación: 10 cards + "Ver más" al final. URL state con `&pagina=N`.

**Aplicación a `/leer-despues`:**

- Label "LISTA PERSONAL" en lugar de "ARCHIVO".
- H1 "Leer después" en lugar de "Análisis".
- Meta "N análisis guardados" donde N viene de `localStorage.readLaterIds.length` (Spec 15 §5.3).
- Mismos chips de filtro (temporal + eje) pero aplicados solo al subconjunto guardado.
- Card extra UI: ícono × arriba a la derecha de cada card para quitar de la lista (sin confirmación; toast de "Removido" abajo que permite undo por 5s).
- Estado vacío: "Tu lista está vacía. Marcá análisis con el botón 'Leer después' al final de cada uno."

### 2. Patrón B — Página de eje individual (`/ejes/[slug]`)

Anatomía:

```
┌─────────────────────────────────┐
│ HEADER (Spec 53)                │ ← 44px sticky
├─────────────────────────────────┤
│ Eje · 05 de 06                   │ ← label mono 10 color dorado
│ Desorientación                   │ ← h1 Alfa Slab 32 sobre color
│ epistemológica                   │   del eje
│                                  │
│ Se debilita la capacidad de      │ ← lede Fraunces italic 17
│ distinguir lo real, lo verdadero,│
│ lo relevante.                    │
│                                  │
│ 14 análisis · activo en 7 países │ ← stats mono 11
│                                  │   FONDO COLOR DEL EJE
├─────────────────────────────────┤
│ QUÉ DESCRIBE                     │
│ Cuando un régimen de visibilidad │ ← prosa Lora 15/1.55
│ se rompe…                        │
├─────────────────────────────────┤
│ ACTIVO EN                        │
│ 7 países                         │ ← h2 Fraunces 20
│ [Argentina · 8] [Colombia · 3]   │ ← grid 2 cols
│ [Brasil · 2]    [Chile · 1]      │
├─────────────────────────────────┤
│ ANÁLISIS RECIENTES               │
│ [card 1]                          │ ← lista de cards de análisis
│ [card 2]                          │   que activan este eje
└─────────────────────────────────┘
```

**Tokens:**

| Elemento | Token / Valor mobile-360 |
|---|---|
| Hero padding | 28 arriba 22 abajo, 20 lateral |
| Hero background | **color del eje** (`--mi-axis-{slug}`), texto crema. Excepción: Atención (`#C8993E` dorado) usa texto tinta porque dorado claro no contrasta con crema |
| Hero border-bottom | 2px tinta |
| Label "EJE · 05 DE 06" | mono 10 uppercase letter-spacing 0.1em color dorado pálido `--mi-accent-gold` sobre hero oscuro, color tinta sobre hero dorado |
| Hero h1 | Alfa Slab One 32 line-height 1.0 letter-spacing -0.01em |
| Lede | Fraunces 600 italic 17 line-height 1.35 |
| Stats row | mono 11 uppercase letter-spacing 0.06em, margin-top 14, padding-top 10, border-top 1px del color de texto del hero con opacity 0.3 |
| Section padding | 20 lateral 20 vertical, border-bottom 1px tinta |
| Section label | mono 10 uppercase letter-spacing 0.1em color mute, margin-bottom 10 |
| Section h2 (cuando aplica) | Fraunces 600 20 line-height 1.2 color tinta margin-bottom 10 |
| Section body (prosa) | Lora 15 line-height 1.55 color tinta (un poco más chico que Spec 50 porque es texto pedagógico, no análisis largo) |
| Grid países (sección "Activo en") | grid 2 cols gap 8, items con fondo crema apagado, border 1px tinta, mono 11 uppercase letter-spacing 0.06em padding 6×10. Count en color mute al final |
| Cards de análisis (sección "Análisis recientes") | mismo componente que Patrón A |

**Secciones del eje individual** (orden vertical):

1. **Hero** — etiqueta + h1 + lede + stats. Sin imagen — la identidad la da el color del eje.
2. **Qué describe** — prosa pedagógica de 200-400 palabras (escrita por Tomás, vive en el frontmatter del eje o en MDX).
3. **Activo en** — grid 2 cols con los países donde el eje es crónico, con count de análisis por país. Tap en chip de país → navega a `/pais/[slug]?tab=publicaciones&eje=<slug>` (Spec 16 §5.1 deep linking).
4. **Análisis recientes** — 5-8 cards de los análisis más recientes que activan ese eje. Card eje pill omitida (es redundante — todos activan este eje). Al pie "Ver todos →" navega a `/analisis?eje=<slug>`.
5. **Conceptos relacionados** (si aplica, opcional según Spec 04) — chips de conceptos del vault que se cruzan con el eje. Tap → `/concepto/[slug]`.
6. **Autores referenciales** (si aplica, opcional) — chips de autores. Tap → `/autor/[slug]`.

**Sin tabs.** La página de eje es más liviana que `/pais/[slug]` — no tiene Pulso, no tiene Estructura, no tiene Contexto. Las 4-6 secciones apiladas verticalmente entran cómodas en mobile sin necesitar el dashboard tabular.

### 3. Patrón C — Comparador con ranking (`/comparar/[indicador]`)

Anatomía:

```
┌─────────────────────────────────┐
│ HEADER (Spec 53)                │ ← 44px sticky
├─────────────────────────────────┤
│ Indicador · Apoyo a la democ. ▴ │ ← selector sticky tinta + dorado
├─────────────────────────────────┤
│ Eje · Desrepresentación          │ ← pill mono 10
│ Apoyo a la democracia            │ ← h1 Fraunces 22
│ Solo 4 de 17 países LATAM…       │ ← lectura Lora italic 14
├─────────────────────────────────┤
│  1  URUGUAY    [████████]   78% │ ← ranking row
│  2  COSTA RICA [██████░]    67% │
│  3  CHILE      [██████░]    63% │
│  4  ARGENTINA  [█████░]     55% │
│ — — — — Promedio regional 48% — │ ← línea separator
│  5  BRASIL     [████░]      46% │
│  6  BOLIVIA    [████░]      42% │
│  7  PERÚ       [███░]       33% │
│  ...                              │
│  17 HONDURAS   [██░]        21% │
├─────────────────────────────────┤
│ Fuente · Latinobarómetro 2024    │
└─────────────────────────────────┘
```

**Tokens:**

| Elemento | Token / Valor mobile-360 |
|---|---|
| Selector sticky | fondo tinta `--mi-ink`, texto crema, padding 12×20, font mono 11 uppercase letter-spacing 0.08em, sticky top 44 (debajo del site header) |
| Selector indicator (nombre actual) | color dorado pálido `--mi-accent-gold` weight 500 |
| Selector arrow ▴ | mono 11 color dorado |
| Body padding | 18 arriba 12 abajo, 20 lateral |
| Eje pill | mono 10 uppercase letter-spacing 0.06em, padding 3×8, fondo color del eje, texto crema |
| H1 (nombre del indicador) | Fraunces 600 22 line-height 1.2 |
| Lectura editorial | Lora italic 14 line-height 1.5 color tinta-soft |
| Ranking padding | 0 lateral 20 abajo 16 |
| Ranking row | display flex align-items center gap 10, padding 8 vertical, border-bottom 1px dashed `--mi-rule-soft` |
| Rank number | mono 11 color mute, width 18 |
| Rank país (nombre) | mono 11 uppercase letter-spacing 0.06em color tinta width 80 |
| Rank bar wrap | flex 1, height 8, background cream apagado |
| Rank bar fill | tinta sólida, width % del valor |
| Rank value (%) | mono 11 weight 500 color tinta width 32 text-align right |
| Línea de promedio regional | text mono 10 uppercase letter-spacing 0.06em color terracota oscuro `--mi-bg-warm`, padding 6 vertical, border-top + border-bottom 1px dashed terracota, text-align center, margin 10 vertical |

**Selector de indicador (bottom-sheet on-tap):**

- Tap en el selector sticky abre bottom-sheet desde abajo (mismo patrón que se descartó para Spec 53 main nav — acá funciona porque el caso de uso es transaccional, no editorial).
- Bottom-sheet ocupa 60-70% del viewport vertical. Fondo papel `--mi-bg-paper`, border-top 3px tinta, shadow `0 -4px 0 #1F2A12`.
- Contenido: handle barra arriba + título "Cambiar indicador" mono 11 uppercase + lista de los 12 indicadores agrupados por eje (mismo grouping que Spec 12 H4).
- Cada grupo: label mono 9 uppercase con color del eje + 2-3 items debajo (Fraunces 16 weight 500 con check ✓ al activo).
- Tap en un item → cierra bottom-sheet con animación y navega a `/comparar/[slug-del-indicador]`.
- Cierre: tap fuera, swipe down, ESC.

**Comportamiento del ranking:**

- 17 países siempre visibles (no paginación). La altura total del ranking es ~17 rows × 25px = ~425px. En 360 entran 7-8 above the fold + 9-10 con scroll.
- Tap en una row → navega a `/pais/[slug]?tab=pulso&indicador=<slug>` (deep link a Spec 16 §5.1).
- Si el país no es uno de los 10 cubiertos por Mapa Inestable (ej. Honduras, Costa Rica del LB que no están en `15-Países/`), la row no es link — se muestra el dato pero sin navegación.
- Ordenamiento siempre descendente por valor en r1.

**Línea de promedio regional:**

- Aparece como separador horizontal entre el último país por encima del promedio y el primero por debajo.
- Texto "PROMEDIO REGIONAL · 48%" en mono 10 uppercase color terracota oscuro.
- Borde dashed terracota arriba y abajo, padding vertical 6.
- Visualmente potente sin chrome adicional — comunica la posición relativa del país de un vistazo.

### 4. `/ejes` (índice) — derivación de Spec 55 Patrón 1

Reusa el componente `GlosarioIndex` de Spec 55 con datos distintos:

- Label "GLOSARIO" → "EJES".
- H1 "Conceptos" → "Ejes conceptuales".
- Bajada: "Los 6 ejes son la infraestructura interpretativa del proyecto. Cada uno organiza un conjunto de transformaciones estructurales que atraviesan la región."
- Meta: "6 ejes · activos en 10 países".
- Items: 6 (uno por eje). Cada item: pin de color del eje + nombre Fraunces 22 + bajada del eje en Lora italic 14 + meta "14 análisis · 7 países →".
- Sin separador de ejes (no agrupados — todos son ejes).

### 5. `/leer-despues` — derivación de Patrón A

Idéntico a `/analisis` con tres diferencias:

1. Label "LISTA PERSONAL" en lugar de "ARCHIVO".
2. H1 "Leer después" en lugar de "Análisis".
3. Meta "N análisis guardados".
4. Cada card tiene botón × arriba a la derecha (44×44 tap target) para quitar de la lista. Tap dispara `localStorage.readLaterIds.remove(id)` + toast "Removido" abajo con undo por 5s.
5. Estado vacío específico.

### 6. `/pipeline` — fuera de scope detallado

**Declaración explícita:** la página `/pipeline` (Spec 25) es **vista interna privada**, `robots: noindex`, oculta del nav público. El caso de uso es Tomás monitoreando el estado de las piezas en producción.

**Decisión:** no se rediseña para mobile en EPIC-04. Mantiene el responsive básico de Spec 02. Si en algún momento futuro se vuelve útil consultarla en mobile (poco probable — Tomás usa desktop para admin), se agrega como spec separada.

**Cross-ref:** agregar nota en Spec 25 indicando que `/pipeline` no recibe tratamiento mobile dedicado en EPIC-04 por decisión de scope.

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| Patrón A archivo (filtros + buscador + cards) | Búsqueda semántica / vectorial |
| Patrón B página de eje individual | Filtros por autor citado / concepto en /analisis |
| Patrón C ranking + bottom-sheet selector | Saved searches / alertas |
| Reuso Spec 55 P1 para /ejes índice | Heatmap matriz 12×17 en /comparar |
| Reuso Patrón A para /leer-despues | Comparador 2-3 países side-by-side |
| /pipeline declarado fuera de scope | Coloreado del mapa desde /comparar |
| Cross-refs a Specs 04, 05, 13, 15, 25 | Tratamiento mobile de /pipeline |
| Línea de promedio regional en ranking | Reordenamiento del ranking en r1 |
| Botón × para quitar de leer-después + undo | Cambios al contenido editorial |

---

## Cross-refs y actualizaciones

- `70-Producto/specs/04-paginas-ejes.md`: agregar nota indicando que el render mobile de `/ejes` y `/ejes/[slug]` se define en Spec 56 §2 y §4.
- `70-Producto/specs/05-archivo-buscador.md`: agregar nota indicando que el render mobile de `/analisis` con buscador inline se define en Spec 56 §1.
- `70-Producto/specs/13-pagina-comparativa-paises.md`: agregar nota indicando que el render mobile de `/comparar/[indicador]` se define en Spec 56 §3 (selector como bottom-sheet, ranking vertical con barras).
- `70-Producto/specs/15-lector-recurrente.md` §5.3 (o donde esté `readLaterIds`): agregar nota indicando que `/leer-despues` se define en Spec 56 §5 reusando el Patrón A con filtrado por localStorage.
- `70-Producto/specs/25-pipeline-de-produccion-visible.md`: agregar nota indicando que esta página NO recibe tratamiento mobile dedicado en EPIC-04 por ser vista interna privada.
- `70-Producto/specs/55-pantallas-editoriales-secundarias-mobile.md`: agregar nota indicando que `GlosarioIndex` (Patrón 1) también se reusa en `/ejes` (Spec 56 §4).
- `70-Producto/specs/02-mobile-responsive.md`: actualizar la nota de scope mobile, indicando que ahora solo `/pipeline` y vistas admin futuras quedan con responsive básico.
- `70-Producto/epics/EPIC-04-mobile-first.md`: marcar Spec 56 como octava spec hija con estado `lista`. Actualizar "Lo que NO entra" para reflejar que la única pantalla pública fuera de scope mobile-first es `/pipeline` (admin).

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Crear `ArchivoConFiltros.tsx` (Patrón A) — page header + buscador + chips + lista de cards | 4h | — |
| 2 | Refactorizar `/analisis/page.tsx` consumiendo `ArchivoConFiltros` + integración del buscador inline con auto-focus al venir del drawer | 2h | tarea 1 |
| 3 | Refactorizar `/leer-despues/page.tsx` consumiendo `ArchivoConFiltros` filtrado por `localStorage.readLaterIds` + botón × + toast undo | 2.5h | tarea 1 |
| 4 | Crear `EjePageMobile.tsx` (Patrón B) — hero con color del eje + secciones apiladas + grid de países + lista de análisis | 4h | — |
| 5 | Refactorizar `/ejes/[slug]/page.tsx` consumiendo `EjePageMobile`. Validar los 6 colores semánticos en el hero (atención requiere texto tinta, no crema) | 1.5h | tarea 4 |
| 6 | Refactorizar `/ejes/page.tsx` (índice) reusando `GlosarioIndex` de Spec 55 con datos de los 6 ejes | 1h | Spec 55 implementada |
| 7 | Crear `ComparadorRanking.tsx` (Patrón C) — header + ranking vertical con barras + línea de promedio | 3h | — |
| 8 | Crear `IndicadorSelectorSheet.tsx` — bottom-sheet con los 12 indicadores agrupados por eje | 3h | — |
| 9 | Refactorizar `/comparar/[indicador]/page.tsx` consumiendo los dos componentes | 1.5h | tareas 7, 8 |
| 10 | Validación visual en Samsung A54 real + emulado 390 y 412 sobre las 5 pantallas con tratamiento | 1.5h | tareas 1-9 |
| 11 | Cross-refs: actualizar Specs 04, 05, 13, 15, 25, 55, 02, design system | 30min | — |

**Estimación total:** 24-26 horas (~3 días de trabajo).

**Orden de implementación:** tareas 1-3 primero (archivo + leer-después comparten componente). Tareas 4-6 (ejes índice + detalle). Tareas 7-9 (comparador). Tarea 10-11 al final.

---

## Maqueta

Mockups validados en sesión de Cowork 2026-05-27 (widget HTML inline con los 3 patrones nuevos simultáneos, regenerables desde el prompt en `70-Producto/prompts-product-design/spec-56-restantes.md`).

| Patrón | Pantallas que cubre | Mock |
|---|---|---|
| A — Archivo con filtros | /analisis, /leer-despues | Validado con page header + buscador + 2 bandas de chips + 2 cards (Colombia desorient., Argentina desorient.) |
| B — Página de eje individual | /ejes/[slug] | Validado con hero desorientación (fondo `#2D4A6B` texto crema) + sección "Qué describe" + sección "Activo en" con grid 2 cols |
| C — Comparador con ranking | /comparar/[indicador] | Validado con selector sticky + h1 "Apoyo a la democracia" + ranking de 7 países con línea de promedio regional entre el 4° y 5° |

`/ejes` (índice) y `/leer-despues` se derivan sin mock visual de patrones ya validados (Spec 55 P1 y Patrón A respectivamente). `/pipeline` no recibe mock — declarado fuera de scope.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-27 | Creación de la spec en estado `lista`. Sumada al scope de EPIC-04 como octava spec hija | Tomás identificó que sumar las pantallas restantes a la cobertura mobile cierra el corpus público completo antes del lanzamiento de julio. /pipeline se declaró fuera de scope detallado por ser vista interna admin. Mockups en widget HTML inline con los 3 patrones nuevos. Pace: 25 minutos de Cowork por reusar fuertemente patrones de Specs 50, 52, 55 |
