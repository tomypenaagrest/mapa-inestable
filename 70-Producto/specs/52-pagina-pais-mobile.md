---
spec: 52
titulo: Página de país (`/pais/[slug]`) repensada desde mobile 360
estado: lista
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-26
afecta:
  - platform/frontend/src/app/pais/[slug]/page.tsx (refactor del shell, integración del nuevo selector de tabs)
  - platform/frontend/src/components/CountryHeader.tsx (NUEVO — extrae del page.tsx el header + frame strip + selector tabs como componente unificado)
  - platform/frontend/src/components/TabBarChips.tsx (NUEVO o refactor de `<TabBar>` propuesto en Spec 16 §9.4 — esta spec define el comportamiento chips horizontales scrolleables)
  - platform/frontend/src/components/TabBarDropdown.tsx (Spec 16 §9.4 — DESCARTAR si existía; mobile NO usa dropdown)
  - platform/frontend/src/components/ChronicAxisCard.tsx (Spec 16 §9.1 — confirmar layout 1 col mobile)
  - platform/frontend/src/components/PulsoSummary.tsx (Spec 16 §9.2 — confirmar wrap a 2-3 líneas en 360)
  - platform/frontend/src/components/IndicatorCardMacro.tsx (Spec 16 §9.7 — esta spec confirma sparkline reducida 26px, valor Alfa Slab 32px)
  - platform/frontend/src/components/HeatmapAxisTime.tsx (NUEVO o refactor del existente en home — esta spec define versión mobile 6×12 con celdas 18×18 y nombres de eje abreviados)
  - platform/frontend/src/components/SourceCard.tsx (Spec 16 §9.3 — confirmar 1 col mobile sin cambios estructurales)
  - platform/frontend/src/components/CountryContextSection.tsx (Spec 16 §9.6 — esta spec define sub-nav vertical compacta en mobile)
  - platform/frontend/src/styles/country-page.css (NUEVO o refactor — clases dedicadas a /pais/ para no contaminar globals)
depende_de: [02, 12, 14, 14A, 16, 50]
relaciona_con: [Spec 02 §4 (reemplaza el comportamiento mobile del grid de país), Spec 12 (Pulso ciudadano — sin cambios de contenido, solo de contenedor), Spec 14 + 14A (Estructura material — esta spec define el render mobile), Spec 16 (dashboard tabular — esta spec lo calibra a 360), Spec 50 (sistema tipográfico mobile — esta spec lo aplica al cuerpo de cada tab), EPIC-04 (segunda spec hija)]
prioridad: alta
bloqueante_de: EPIC-04
desbloquea: navegación del corpus de cada país en mobile (lectura del dashboard de país en Samsung A54 / 360px) con jerarquía editorial mantenida y las 6 tabs accesibles sin fricción
---

# 52 · Página de país (`/pais/[slug]`) repensada desde mobile 360

## Resumen ejecutivo

Spec 16 definió `/pais/[slug]` como dashboard tabular de 6 solapas (Publicaciones, Diagnóstico, Pulso, Estructura, Contexto, Fuentes) y propuso `<TabBarDropdown>` para mobile en §7. EPIC-04 r1 identificó esta página como una de las cuatro vistas críticas del lanzamiento de julio porque es la segunda más visitada (destino del tap en el mapa).

Esta spec repiensa el comportamiento mobile (no la estructura, que sigue siendo la de Spec 16) calibrado a **360px de ancho base** (Samsung A54). Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-26) sobre tres variantes de selector de tabs y dos componentes internos que requerían validación visual.

**Outcome.** Un lector que llega a `/pais/argentina` desde el mapa en su A54 ve: nombre país (Alfa Slab 48) + pregunta central (Fraunces italic 18) + meta row + frame strip de ejes crónicos + chips horizontales con las 6 tabs (Publicaciones activa por default). Cambia de tab con 1 tap directo. Al scrollear, los chips quedan sticky (44px) y el header de país libera viewport. Cada tab muestra su contenido en 1 columna full-width respetando el sistema tipográfico de Spec 50.

**Lo que entra en r1:**

- Selector de tabs como **chips horizontales scrolleables** (descarta el dropdown propuesto en Spec 16 §7).
- Comportamiento sticky mínimo: solo los chips quedan fijos al scrollear (44px en lugar de 100px que Spec 16 §6.3 proponía).
- Frame strip de ejes crónicos confirmado as-is (3 pills + scroll horizontal con fade terracota). NO sticky.
- Heatmap eje × tiempo del tab Diagnóstico: reducido a 6 ejes × 12 semanas en mobile (no entra 6×18 con tap-target accesible). Nombres de eje abreviados a 7-8 caracteres con pin de color.
- Card macro del tab Estructura: sparkline reducida a 26px (cierra Spec 16 §12.5), valor Alfa Slab 32px, marker de calidad con 5 estados.
- Confirmación de reuso de componentes de Spec 16 sin variantes mobile específicas: `<ChronicAxisCard>`, `<PulsoSummary>`, `<IndicatorCard>` de Pulso, `<SourceCard>`, `<CountryContextSection>`.
- Sub-nav del tab Contexto pasa de banda horizontal a lista vertical compacta en mobile.
- Aplicación del sistema tipográfico de Spec 50 al body de todas las tabs.

**Lo que NO entra en r1:**

- Bottom-sheet selector. Se descartó por ser patrón app-y, incoherente con la identidad editorial del proyecto.
- Header sticky completo (nombre + pregunta + meta). Se descartó: 100px de sticky comen demasiado viewport en A54.
- Cambios al contenido de las tabs (Pulso, Estructura, Contexto, Fuentes). Spec 16 y sus dependencias (12, 14, 14A) son la fuente — esta spec solo define el render mobile.
- Heatmap eje × tiempo con todas las 18 semanas en mobile. Diferido a post-lanzamiento si aparece pedido editorial.
- `<TimelineHorizontal>` para Histórico de Contexto. Spec 16 §12.4 lo dejó como decisión pendiente — esta spec mantiene el diferimiento.
- Animaciones de cambio de tab. En r1 el cambio es instantáneo.

---

## Estado actual

### En Spec 16 (dashboard tabular)

§7 propone `<TabBarDropdown>` en mobile (≤640px) como botón con dropdown vertical que despliega las 6 opciones. §6.3 declara sticky completo de 100px (header condensed + dropdown).

### En el frontend

Spec 02 §4 apila el grid `1fr 340px` a 1 columna mobile con `order: 2` para la sidebar. Pero `/pais/[slug]/page.tsx` actualmente no implementa el dashboard tabular de Spec 16 — sigue siendo el scroll vertical previo (diagnóstico, pregunta central, Pulso expandido, contexto, análisis, sidebar). Spec 16 está mergeada como `borrador-r2` pero su implementación está pendiente.

**Implicancia:** esta spec se implementa al mismo tiempo que Spec 16 (o después de ella). El refactor del page.tsx incluye ambas: la estructura tabular desktop de Spec 16 + el comportamiento mobile que define esta spec.

### Mockups validados en sesión de Cowork (2026-05-26)

Tres variantes del header + selector de tabs, comparadas:
- V1: dropdown puro (Spec 16 §7) — descartada
- V2: chips horizontales + sticky mínimo — **elegida**
- V3: bottom-sheet on-demand — descartada (app-y, fuera de tono editorial)

Dos componentes internos validados:
- Heatmap eje × tiempo en 360 (12 semanas en lugar de 18) — aprobado
- Card macro con sparkline a 26px — aprobado

Ver §6 (Maqueta) para los mockups.

---

## Propuesta

### 1. Header de país en mobile (no sticky)

Anatomía completa, de arriba a abajo:

```
┌─────────────────────────────────────────────┐
│  [site header — chrome de Mapa Inestable]   │
├─────────────────────────────────────────────┤
│  Argentina                                   │ ← Alfa Slab 48px
│                                              │
│  ¿Cómo se sostiene un sistema político       │ ← Fraunces italic 18/1.35
│  cuando los partidos tradicionales pierden   │
│  capacidad de mediación?                     │
│                                              │
│  ─────────────────────────────────────       │ ← border-top 1px
│  18 análisis · última hace 3 días · 3 ejes  │ ← mono 11px uppercase
├─────────────────────────────────────────────┤
│  EJES CRÓNICOS ›  [DES] [EST] [DESREP] →     │ ← banda cream-apagado, scroll-x
├─────────────────────────────────────────────┤
│  [ Publ. (18) ] [ Diag. ] [ Pulso (12) ] →   │ ← chips horizontales scrolleables ← sticky al scrollear
└─────────────────────────────────────────────┘
```

**Tamaños y tokens:**

| Elemento | Token / Valor mobile-360 |
|---|---|
| Padding lateral del header de país | 20px (igual que body de Spec 50) |
| Country name | Alfa Slab One, 48px, line-height 1.0, letter-spacing -0.01em, color `--mi-ink` |
| Pregunta central | Fraunces 400 italic, 18px, line-height 1.35, color `--mi-ink-soft`, margen 14px arriba y abajo |
| Meta row | mono 11px uppercase, letter-spacing 0.06em, color `--mi-ink-mute` (etiquetas) y `--mi-ink` (valores), borde top 1px tinta, padding-top 8px, flex con gap 10px y wrap |
| Frame strip de ejes | banda cream-apagado `#ECE0C5`, borde top + bottom 1px tinta, padding 10px lateral 20px, label mono 9px + axis pills mono 10px, scroll-x overflow auto, fade-out terracota a la derecha si hay overflow |
| Selector de tabs (chips) | banda cream-apagado `#ECE0C5`, borde bottom 1px tinta, padding 12px lateral 16px, chips mono 11px con borde 1px tinta, activo con fondo tinta + texto crema, scroll-x overflow auto |

**No sticky.** Todo el bloque (country name + pregunta + meta + frame strip) se scrollea fuera del viewport. Solo los chips de tab quedan sticky.

### 2. Sticky behavior: solo los chips de tab (44px)

Al scrollear, **solo la banda de chips queda sticky en `top: 0`**. Total fijo: 44px. El header de país se va — el lector ya está dentro del país, no necesita ver el nombre fijo.

```
[ scrollback de contenido ] ← lo que se scrolleó queda arriba
─────────────────────────────────────
[ Publ. ✓ ] [ Diag. ] [ Pulso ] →   ← STICKY (44px)
─────────────────────────────────────
[ contenido del tab activo continúa ]
```

**Implementación CSS:** la banda de chips usa `position: sticky; top: 0; z-index: 10;`. El contenedor padre debe tener `overflow: visible` (no `overflow: hidden`). El background de la banda es opaco (`#ECE0C5`) para no transparentar el contenido que pasa por debajo.

**Por qué no sticky el header de país:** en A54 el viewport útil es ~800px (descontando barras del sistema). 100px de sticky es 12% — mucho. Liberar el header libera 56px adicionales (la diferencia entre 100 y 44) que son 7% más viewport útil para el contenido del tab. Es real.

**Compromiso editorial:** el lector que scrollea profundo y "se olvida en qué país está" puede usar back nativo o scroll-to-top con tap en la barra del sistema (gesto nativo en Android). No es óptimo pero no es el caso de uso dominante — el lector entra a un país con intención y se mantiene en él durante la sesión.

### 3. Selector de tabs: chips horizontales scrolleables

**Anatomía:**

```
┌─────────────────────────────────────────────────────────┐
│ [ Publicaciones (18) ✓ ] [ Diagnóstico ] [ Pulso (12) ] [ Estructura ] [ Contexto ] [ Fuentes ] │ ← scroll-x si no entra
└─────────────────────────────────────────────────────────┘
```

**Chip activo:** fondo `--mi-ink`, texto `--mi-bg-paper`, borde `--mi-ink`.

**Chip inactivo:** fondo transparente, texto `--mi-ink`, borde 1px `--mi-ink`. Hover/active state: fondo cream-warm sutil.

**Tipografía del chip:** IBM Plex Mono 11px / weight 400 (inactivo) o 500 (activo), uppercase, letter-spacing 0.06em.

**Contadores:** los chips con dato cuantitativo (`Publicaciones (18)`, `Pulso (12)`, `Estructura (24)`) muestran el N entre paréntesis con opacity reducida (0.6). Los chips sin contador (`Diagnóstico`, `Contexto`, `Fuentes`) no muestran nada.

**Fade-out a la derecha:** si el conjunto de chips excede los 320px de ancho útil (lo hace casi siempre), se aplica un gradiente terracota desde la derecha que insinúa el scroll horizontal disponible.

```css
.tab-chips::after {
  content: '';
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 28px;
  background: linear-gradient(to right, transparent, #ECE0C5);
  pointer-events: none;
}
```

**Comportamiento al cambiar tab:**
- Cambio inmediato del contenido. Sin animación en r1 (puede agregarse post-lanzamiento).
- La URL se actualiza con `?tab=<slug>` (regla de Spec 16 §5).
- El chip seleccionado se auto-scrollea al centro de la banda si estaba parcialmente fuera del viewport (`scrollIntoView({ inline: 'center', behavior: 'smooth' })`).

**Por qué chips y no dropdown:** comparativa hecha en sesión 2026-05-26.

| Criterio | Dropdown (Spec 16) | Chips (esta spec) |
|---|---|---|
| Taps para cambiar de tab | 2 | 1 |
| Descubrimiento de tabs disponibles | bajo (1 visible) | alto (todas visibles, salvo scroll) |
| Coherencia con axis pills + sub-filtros | media | alta |
| Pixel cost del sticky | 100px | 44px |
| Tono del patrón | app-y | editorial |

### 4. Frame strip de ejes crónicos en mobile

Confirmado as-is desde Spec 16 §3.3. Adaptado:

- Label `EJES CRÓNICOS ›` en mono 9px uppercase, color `--mi-ink-mute`, no clickeable.
- 3-4 axis pills siguientes (color de eje sobre crema apagado, texto crema, mono 10px uppercase).
- Scroll horizontal si hay más de 3 pills (raro — los países típicos tienen 2-3 ejes crónicos).
- NO sticky: se va con el header al scrollear.
- Tap en pill navega a `/ejes/[slug]?pais=<country>` (filtro pre-aplicado, regla de Spec 16 §5.3).

**Por qué se queda como está:**
- Los axis pills coloreados son identidad del proyecto. Comprimirlos a contadores numéricos los pierde.
- Los 3-4 pills entran en 360 con padding 20 lateral y gap 6 entre pills (≈ 280px de espacio para pills, suficiente).
- No sticky: una vez que el lector entra a la tab Diagnóstico, ya tiene los ejes en el heatmap y en los `<ChronicAxisCard>`. En Publicaciones los ve por análisis en cada card. No necesita el frame strip fijo arriba.

### 5. Contenido de cada tab en mobile

#### 5.1. Tab `Publicaciones` (default)

- **Sub-filtro temporal** (chips horizontales scrolleables, mismo patrón que tabs pero más chico): `Recientes (8)`, `2026 (12)`, `2025 (4)`, `Todas (18)`. Chip activo con fondo tinta + texto crema; inactivos con borde 1px `--mi-rule-soft` (más sutil que las tabs para no competir).
- **Filtro por eje** (axis pills multi-select): debajo del sub-filtro temporal, scroll-x si hay más de 3-4 ejes. Si el lector tiene `followedAxes` en localStorage (Spec 15 §5.2), aparecen pre-marcados.
- **Cards de análisis** (1 columna full-width): mismo componente que home (Spec 11). Anatomía: country tag, h3 título Fraunces 18px, descripción Lora 14/1.5, footer con axis pill + fecha mono. Border-thick + shadow-card 4×4.
- Markers de leído / nuevo desde `lastVisit` (Spec 15 §5.4) — punto dorado en la esquina si es nuevo.
- Paginación: 10 cards por página + "Ver más" al final.

#### 5.2. Tab `Diagnóstico`

- **Sección "Diagnóstico estructural"**: prosa cualitativa del país. Lora 16/1.6 (Spec 50), padding lateral 20px. 3-5 párrafos.
- **Sección "Ejes crónicos ampliados"**: `<ChronicAxisCard>` en 1 columna full-width, 3-4 cards apiladas. Cada card tiene axis pill prominente, metadata mono (Activo desde · Frecuencia · Última activación) y nota cualitativa Lora italic 16px.
- **Sección "Matriz eje × tiempo"** (heatmap):
  - Tabla de 6 ejes × **12 semanas** (las últimas 12, en lugar de 18 desktop).
  - Nombres de eje abreviados con pin de color a la izquierda: `DESORIENT.`, `ESTETIZ.`, `DESREP.`, `MEDIAC.`, `DECULT.`, `ATENCIÓN`.
  - Celda de ~18×18px (border 1px crema entre celdas).
  - Color de celda intensifica según frecuencia (3 niveles + sin actividad). Sin actividad = cream apagado `#ECE0C5`. Activo bajo = tono claro del eje. Activo medio = tono medio. Activo alto = tono saturado.
  - Click en celda → navega al análisis (o al primero si hay varios).
  - Leyenda mono debajo: `[sin actividad] [+ análisis = celda más oscura]`.
- **Justificación de 12 semanas en lugar de 18:** con 18 semanas en 360, las celdas quedan a ~14px de lado, debajo del tap-target accesible mínimo (44×44). Reducir a 12 deja celdas de 18-20px que combinadas con padding tocable suman ~32px — borderline aceptable pero coherente con la realidad del componente. Para ver más historia, el lector puede ir a la tab Publicaciones con filtros.

#### 5.3. Tab `Pulso ciudadano`

- `<PulsoSummary>` arriba: banda mono 11px uppercase color mute con 3 frases separadas por `·`. En 360 hace wrap automático a 2-3 líneas — confirmado as-is.
- Indicadores agrupados por eje (orden de Spec 12 H4). Cada grupo tiene un h3 mono uppercase ("DESREPRESENTACIÓN — 3 INDICADORES") y debajo los `<IndicatorCard>` apilados, 1 columna full-width.
- Cada `<IndicatorCard>`: estructura existente de Spec 12 (cifra grande, comparación regional, barra, ranking). En mobile, la barra de Spec 12 ocupa 100% del ancho del card. Botón "Comparar →" como footer del card (link a `/comparar/<indicador>`).
- Footer del tab: link `Informe completo →` y `Metodología`.

#### 5.4. Tab `Estructura material`

- Sub-nav anchors vertical en mobile (no horizontal): lista compacta `• Riqueza · Comercio · Empleo · Sociales` en mono 11px uppercase, padding 8px, borde bottom dashed `--mi-ink`. Al tap, scroll a la sección correspondiente.
- 4 secciones (A · Riqueza, B · Comercio, C · Empleo, D · Sociales). Cada una con h3 mono uppercase + 6 cards macro apiladas.
- **`<IndicatorCardMacro>` en mobile:**
  - Label mono 10px: `A1 · PBI PER CÁPITA (PPP)`.
  - Cifra grande Alfa Slab 32px + año mono 11px a la derecha.
  - **Sparkline 26px de alto, 100% ancho del card** (la decisión Spec 16 §12.5 se cierra acá: sparkline se mantiene reducida).
  - Delta mono 11px: `Δ +6,9% vs 2018` o `Δ promedio 1,8% últimos 5 años`.
  - Marker de calidad con 5 estados (oficial, revisado, estimado, cuestionado, congelado). Cuestionado con borde terracota; congelado con fondo tinta y texto crema.
  - Source al pie con border-top dashed: `→ Banco Mundial WDI · pulled 2026-05-09`.
- Cita global al pie del tab (24 indicadores · 4 fuentes · última actualización · chips de fuentes · link a `/metodo#datos-macro`).
- **Estado vacío** (placeholder mientras Spec 14B no esté ejecutada): card cream con border thick, texto editorial honesto sobre que la tab está próximamente. Sin números mockup.

#### 5.5. Tab `Contexto`

- **Sub-nav vertical compacto** (no horizontal anchor list como desktop): lista de las 4 sub-secciones (Histórico, Político-institucional, Cultural, Demográfico) en mono 11px uppercase, padding 8px por item, borde bottom dashed. Al tap, scroll a la sub-sección.
- 4 secciones (apiladas vertical), cada una con h2 Fraunces 22px + cuerpo Lora 16/1.6 (Spec 50). Si una sub-sección está vacía en el frontmatter del país, se omite del sub-nav y del scroll.
- **Sin `<TimelineHorizontal>`** en r1 — Spec 16 §12.4 dejó esta decisión pendiente, esta spec confirma que se difiere.

#### 5.6. Tab `Fuentes`

- Intro corto (1 párrafo Lora 16/1.6) explicando qué fuentes se monitorean.
- `<SourceCard>` en 1 columna full-width (no 2 cols mobile). Anatomía existente Spec 16 §4.6: nombre del medio Alfa Slab 22px, tipo + ubicación + fecha mono, URL externa, métrica de citas.
- Nota metaeditorial al pie (Lora italic 16px) sobre por qué se eligen esas fuentes.

### 6. Maqueta

Mockups validados en sesión de Cowork 2026-05-26 (widgets HTML inline, no persistidos como archivos en este vault — regenerables desde el prompt en `70-Producto/prompts-product-design/spec-52-pais.md`).

| Mock | Qué validó |
|---|---|
| 3 variantes selector de tabs (dropdown / chips / bottom-sheet) | Elección de chips horizontales + sticky mínimo |
| Heatmap eje × tiempo en 360 (6 × 12 semanas) | Aprobación del comportamiento reducido (12 semanas en lugar de 18) |
| Card macro con sparkline 26px en 360 | Cierre de Spec 16 §12.5: sparkline se mantiene reducida |

### 7. Cross-refs y actualizaciones a otros documentos

- `70-Producto/specs/16-dashboard-de-pais.md`:
  - §7 (Mobile — dropdown selector) → marcar como REEMPLAZADO POR Spec 52 §3. El componente `<TabBarDropdown>` se descarta; se reemplaza por `<TabBarChips>`.
  - §6.3 (sticky mobile 100px) → marcar como REEMPLAZADO POR Spec 52 §2. Sticky mobile es solo 44px (chips).
  - §12.5 (decisión pendiente sparkline mobile) → marcar como RESUELTO por Spec 52 §5.4 (sparkline se mantiene a 26px).
- `70-Producto/specs/02-mobile-responsive.md`:
  - §4 (Página de país) → marcar como DEPRECADO por Spec 52. El grid `1fr 340px` ya no aplica porque el dashboard tabular no usa sidebar lateral.
- `70-Producto/specs/50-reading-experience-mobile.md`:
  - Sin cambios. Esta spec aplica el sistema tipográfico de Spec 50 al cuerpo de las tabs.
- `70-Producto/design-system/design-system.md`:
  - Agregar nota en §Componentes documentando `<TabBarChips>` como variante mobile del shell del dashboard.

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| Selector de tabs chips horizontales scrolleables | Dropdown selector (descartado) |
| Sticky de 44px (solo los chips) | Sticky completo del header de país (100px) |
| Frame strip de ejes as-is, no sticky | Compresión de frame strip a contadores |
| Heatmap eje × tiempo 6×12 en mobile | Heatmap completo 6×18 en mobile |
| Card macro con sparkline 26px y valor Alfa Slab 32px | Card macro sin sparkline (descartado) |
| Aplicación del sistema tipográfico de Spec 50 | Animaciones de cambio de tab |
| Sub-nav vertical compacto en Contexto | `<TimelineHorizontal>` (diferido) |
| Cards en 1 columna en todas las tabs | Bottom-sheet selector |
| Confirmación de reuso de componentes Spec 16 | Cambios de contenido en las tabs |

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Crear `CountryHeader.tsx` con anatomía completa de §1 (country name, pregunta central, meta row, frame strip) | 2-3h | — |
| 2 | Crear `TabBarChips.tsx` con scroll-x, sticky 44px, fade-out terracota, comportamiento de auto-scroll del activo | 3h | — |
| 3 | Refactorizar `/pais/[slug]/page.tsx` para usar `CountryHeader` + `TabBarChips` + URL state según Spec 16 §5 | 2h | tareas 1, 2 |
| 4 | Crear `HeatmapAxisTime.tsx` con variante mobile 6×12 (o adaptar el componente existente si está en home) | 3h | — |
| 5 | Crear o refinar `IndicatorCardMacro.tsx` con sparkline 26px, valor Alfa Slab 32px, marker de calidad con 5 estados | 3h | — |
| 6 | Implementar contenido de tab Diagnóstico (prosa + `<ChronicAxisCard>` + heatmap) | 2h | tareas 3, 4 |
| 7 | Implementar contenido de tab Estructura (sub-nav + 4 secciones de cards macro + placeholder si no hay datos) | 2h | tareas 3, 5 |
| 8 | Implementar contenido de tabs Publicaciones, Pulso, Contexto, Fuentes en mobile | 3h | tarea 3 |
| 9 | Crear `styles/country-page.css` con todas las clases dedicadas | 1h | — |
| 10 | Validación visual en Samsung A54 real + emular 390 y 412 en devtools sobre 3 países (Argentina, Bolivia, Chile) | 1.5h | tareas 6, 7, 8 |
| 11 | Cross-refs: actualizar Spec 16 §6.3, §7, §12.5; Spec 02 §4; design system | 30min | — |

**Estimación total:** 23-26 horas (3-3.5 días de trabajo).

**Orden de implementación:** tareas 1-3 primero (shell del dashboard), después tareas 4-5 en paralelo (componentes específicos), después tareas 6-8 en paralelo (contenido de tabs), después tarea 10 (validación). Tareas 9 y 11 se hacen en cualquier momento.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-26 | Creación de la spec en estado `lista`. Decisiones tomadas en sesión de Cowork con mockups HTML inline | Segunda spec hija de EPIC-04. Resolvió Spec 16 §7 y §12.5 (decisiones pendientes que ya tenían el problema bien planteado pero no las elecciones cerradas). Validó visualmente la transformación de componentes desktop a 360 |
