---
spec: 49
titulo: Touch handlers del mapa Torres García sobre D3 — pinch-zoom, pan, double-tap, hit area ampliada
estado: implementada
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-26
afecta:
  - platform/frontend/src/components/MapaTorresGarcia.tsx (refactor — sumar touch handlers sobre el SVG existente)
  - platform/frontend/src/hooks/useMapGestures.ts (NUEVO — hook que encapsula pinch-zoom + pan + double-tap)
  - platform/frontend/src/components/MapResetButton.tsx (NUEVO — botón floating que aparece cuando zoom > 1×)
  - platform/frontend/src/styles/map.css (refactor — touch-action, will-change, transform-origin)
  - platform/frontend/src/components/CountryPanelInline.tsx (Spec 33 + Spec 51 §2.3 — confirmar comportamiento mobile)
depende_de: [22, 33, 51]
relaciona_con: [Spec 22 §16.1 (reemplaza el comportamiento de tap propuesto), Spec 33 (panel preview de país — esta spec confirma su uso en mobile vs navegación directa), Spec 51 §2.3 (panel inline debajo del mapa), Spec 53 (header común mobile), EPIC-04 (sexta spec hija, última en cerrarse antes de Spec 54)]
prioridad: alta
bloqueante_de: AE3 + AE4 del epic (tap target ≥ 44px y pinch-zoom sin estado roto)
desbloquea: navegación gestual completa del mapa Torres García en mobile (Samsung A54 / 360px) sin romper expectativas de Android/iOS y sin perder identidad signature del proyecto
---

# 49 · Touch handlers del mapa Torres García sobre D3

## Resumen ejecutivo

Spec 22 §16.1 declaró el comportamiento base mobile del mapa Torres García (tap, labels ocultos, cruces 28×28), pero NO definió los gestos concretos: pinch-zoom, pan, double-tap, hit area ampliada para países chicos, manejo del gesto vs scroll del documento, comportamiento de selección persistente. EPIC-04 identificó esto como una de las cuatro vistas críticas del lanzamiento — un mapa que se ve bien pero no se navega bien rompe la promesa del proyecto.

Esta spec define los touch handlers concretos sobre el SVG D3 existente. **No introduce librería de mapas nueva** (decisión cerrada en EPIC-04 r1: Opción A — adaptar D3 actual). Las decisiones se tomaron como tabla en sesión de Cowork (2026-05-26) con visualización de tres estados del mapa (normal, zoomeado, tap-preview).

**Outcome.** Un lector en su A54 puede: ver el mapa entero a sangre (zoom 1×), hacer pinch para acercarse hasta 3× para tocar países chicos, pan controlado dentro de los bordes del mapa, double-tap para zoom-toggle (1× ↔ 2×), botón RESET visible cuando zoom > 1×, tap directo en cualquier país (incluso Uruguay y Ecuador gracias a hit area ampliada) abre panel preview inline debajo del mapa, panel persiste hasta acción explícita de cierre, gestos no compiten con scroll de la página.

**Decisión central que reemplaza Spec 22 §16.1:** **tap NO navega directo** — abre el panel preview inline (consistente con Spec 33 y Spec 51 §2.3). Para navegar a la ficha del país, el lector debe tap explícito en "Ver ficha →" dentro del panel. Esto unifica el comportamiento desktop/mobile del mapa y elimina la ambigüedad del "tooltip 800ms antes de navegar" que Spec 22 §16.1 declaraba.

**Lo que entra en r1:**

- Pinch-zoom con límites (1× mínimo, 3× máximo).
- Pan con boundaries (no se sale del mapa).
- Double-tap toggle (1× ↔ 2×).
- Botón RESET ⟲ floating que aparece cuando zoom > 1×.
- Indicador de zoom (`Zoom 2.0×`) arriba a la izquierda.
- Hit area ampliada para Uruguay y Ecuador (2 países, no los 10).
- Tap → panel inline (no navega directo).
- Panel persistente hasta cierre explícito o tap en otro país (cross-fade).
- `touch-action: pinch-zoom` en el SVG del mapa.
- Performance optimizado para Android mid-range vía `transform: translate3d() scale()` + GPU.

**Lo que NO entra en r1:**

- Librería de mapas externa (Mapbox / MapLibre). Decisión cerrada en EPIC-04: Opción A.
- Capas analíticas dinámicas (precipitación, viento, etc.) — son scope de EPIC-03, ya cerrado.
- Animación de "presentación" del mapa al cargar (fade-in de países en cascada). Diferida.
- Mini-mapa (overview) cuando está zoomeado. Innecesario en 360.
- Gestos avanzados: rotate, three-finger tap, swipe entre vistas del mapa. Diferidos a post-lanzamiento.
- Persistencia del estado de zoom al navegar fuera y volver. Cada visita carga zoom 1×.
- Vibración háptica al tap. Patrón app-y, descartado.

---

## Estado actual

### En Spec 22

§16.1 declaró:
- Mapa full-width del viewport, sin sidebar persistente ni panel lateral.
- Tap → "navega directo a /pais/[slug]" + "tooltip on-tap por 800ms antes de navegar".
- Labels ocultos en mobile.
- Cruces a 28×28 SVG units.

Esta spec **reemplaza el comportamiento de tap** (ya no navega directo) y **agrega** todo el sistema gestual que §16.1 no cubría.

### En Spec 33

Definió el panel preview de país en desktop (lateral del mapa). Spec 51 §2.3 confirmó que en mobile el panel aparece inline debajo del mapa. Esta spec confirma que el tap en mobile dispara ese panel.

### En el frontend

`MapaTorresGarcia.tsx` actualmente no tiene touch handlers. El click handler de desktop dispara hover state + panel preview en `MapaHeatmapSection.tsx`. Mobile cae a "click sintético" sin gestos.

### Mockups validados en sesión de Cowork (2026-05-26)

Tres estados visualizados:
- Estado normal (zoom 1×) con hit area ampliada de Uruguay y Ecuador anotada en líneas dashed terracota.
- Estado zoom 2× con pan activo, botón RESET visible, indicador de zoom.
- Estado tap-preview con panel inline abierto debajo del mapa.

Tabla de 9 decisiones de comportamiento, todas aprobadas como recomendadas.

---

## Propuesta

### 1. Pinch-zoom

**Límites:** 1× mínimo, 3× máximo. Fuera de esos límites, el gesto rebota visualmente (no se aplica) pero no rompe estado.

**Implementación:** detectar dos puntos `touchstart` simultáneos en el SVG, calcular distancia inicial, en `touchmove` calcular nueva distancia y aplicar ratio como `scale`. En `touchend` consolidar el scale final.

**Transformación:** sobre el `<g>` interno del SVG vía `transform: translate3d(x, y, 0) scale(s)`. Nunca actualizar `viewBox` durante el gesto (causa repaint completo, laggea en Android < 4GB RAM).

**Origen del scale:** punto medio entre los dos dedos (no centro del mapa). El lector que hace pinch sobre Brasil zoomea sobre Brasil, no recentra al medio.

**Throttle:** usar `requestAnimationFrame` para coalescer múltiples eventos `touchmove` en un solo frame (60fps target).

### 2. Pan

**Activo siempre que `scale > 1`.** En `scale = 1` (zoom 1×), pan no aplica (el mapa ya entra entero, no hay donde ir).

**Boundaries:** el viewport del mapa siempre debe mostrar **parte** del mapa, nunca terracota vacío. Calcular bounding box del mapa en el scale actual y limitar `translateX` / `translateY` a esos bordes.

**Inercia:** sí, pero corta. Al `touchend` durante un pan rápido, continuar el movimiento con desaceleración por 200-300ms (sensación natural Android/iOS).

**Implementación:** un dedo `touchstart` + `touchmove` cuando ya hay zoom activo → aplicar delta a `translateX / translateY` del `<g>`.

### 3. Double-tap toggle

**Comportamiento:** dos taps consecutivos dentro de 300ms (límite Android) en el mismo país aproximadamente (tolerancia 50px) → toggle entre zoom 1× y zoom 2× centrado en el punto del tap.

**Implementación:** registrar `touchend` con timestamp. Si segundo `touchend` < 300ms desde el anterior y a < 50px de distancia, disparar toggle. Cancelar el comportamiento default de tap-abre-panel (no se debe abrir panel en el primer tap del double-tap — esperar 300ms con `setTimeout` y si llega un segundo tap, cancelar).

**Trade-off conocido:** el primer tap del double-tap tiene 300ms de latencia para abrir panel. Es estándar mobile, aceptable.

### 4. Botón RESET ⟲

**Cuándo aparece:** cuando `scale > 1.05` (con tolerancia para evitar parpadeo en zoom 1.0 ± epsilon).

**Posición:** absolute, bottom-right del contenedor del mapa, 8px de margen. Z-index sobre el SVG.

**Anatomía:**
- Fondo `--mi-ink` (`#1F2A12`), color crema `--mi-bg-paper`.
- Texto "Reset ⟲" en IBM Plex Mono 9px uppercase letter-spacing 0.06em.
- Padding 4×8, borde 1.5px crema.
- Tap target ampliado a 44×44 con padding invisible alrededor.

**Acción:** vuelve a `scale = 1`, `translate = 0` con animación de 200ms `ease-out`. El botón se hace fade-out al terminar.

### 5. Indicador de zoom

**Posición:** absolute, top-left del contenedor del mapa, 8px de margen.

**Anatomía:**
- Fondo `rgba(31,42,18,0.85)` (verde-negro semitransparente).
- Texto "Zoom 2.0×" en IBM Plex Mono 9px uppercase letter-spacing 0.06em color dorado pálido `--mi-accent-gold`.
- Padding 3×7.

**Cuándo aparece:** solo cuando `scale > 1.05` (mismo trigger que el botón RESET).

**Decimales:** se muestra siempre con 1 decimal (`Zoom 1.5×`, `Zoom 2.0×`). Nunca enteros sin decimal.

### 6. Hit area ampliada (Uruguay y Ecuador)

**Quiénes:** los dos países más chicos del mapa Torres García en su silueta simbólica. Otros países (incluso Paraguay) tienen áreas visuales suficientes para tap-target accesible sin ampliación.

**Implementación SVG:**

```svg
<g class="hit-area">
  <!-- path invisible, más grande que el visual, captura eventos -->
  <path d="M..." fill="transparent" stroke="none" 
        pointer-events="all" 
        data-country="uruguay" />
  <!-- path visible, el dibujo -->
  <path d="M..." fill="#1F2A12" 
        pointer-events="none" 
        class="country-uy-visual" />
</g>
```

El `<path>` invisible es ~12px más grande en cada dirección que el visible (en SVG units). Captura todos los eventos. El visible solo renderiza.

**Trabajo de calibración:** definir los paths invisibles a mano en `mapa-con-capitales.svg` o generarlos con un script de buffer (dilation) de 12px sobre los polígonos visibles.

### 7. Tap → panel inline (reemplaza Spec 22 §16.1)

**Single tap (no double):**
1. Cancelar timeout de 300ms si era posible un double-tap.
2. Marcar el país como `selected` (anillo dorado `--mi-accent-gold` 1.5px alrededor de la cruz de capital).
3. Disparar evento `onCountryTap(slug)` que abre panel inline debajo del mapa.

**Panel inline:** definido en Spec 33 (anatomía) + Spec 51 §2.3 (comportamiento mobile). Slide-down 200ms `ease-out` desde altura 0 hasta `auto`. Empuja el resto del contenido del home hacia abajo (no modal, no overlay).

**Tap en otro país con panel abierto:** cross-fade 200ms — el panel transiciona contenido sin cerrar y abrir. El país previo pierde el anillo dorado, el nuevo lo gana.

**Tap fuera del mapa (sobre el documento):** no cierra el panel. El panel solo cierra con su propia X o con tap en otro país.

### 8. Panel persistente

**No se cierra al scrollear el documento.** El lector puede scrollear el home hacia abajo, ver el carrusel, volver arriba — el panel sigue abierto debajo del mapa.

**Cierre explícito:** X arriba a la derecha del panel.

**Cierre implícito:** tap en otro país (con cross-fade, no se cierra sino que se reemplaza).

**Persistencia entre navegaciones:** NO. Si el lector navega fuera del home y vuelve, el panel arranca cerrado. El estado del mapa (zoom 1×, sin selección) se resetea.

### 9. `touch-action` y manejo de scroll

**En el SVG del mapa:** `touch-action: pinch-zoom;`. Esto le dice al navegador: "el pinch acá lo manejo yo, el scroll vertical de un dedo lo manejás vos como scroll del documento".

**Sin esto**, el pinch en el mapa intenta zoomear la página entera (gesto nativo del browser) Y el código del mapa intenta zoomear el SVG. Los dos compiten, la UX se rompe.

**Caso de scroll dentro del mapa zoomeado:** cuando `scale > 1`, el comportamiento de un dedo cambia: pasa de "scroll del documento" a "pan del mapa". Esto requiere `touch-action: none` temporalmente cuando zoom activo. Implementación: el hook `useMapGestures` actualiza `touch-action` dinámicamente según `scale`.

### 10. Performance en Android mid-range

**Estrategia:**

- SVG inline en el HTML (no archivo externo, no img tag).
- `transform: translate3d() scale()` sobre el `<g>` interior — fuerza GPU acceleration.
- `will-change: transform` en el `<g>` durante los gestos (`touchstart` lo activa, `touchend` lo desactiva — no dejar siempre activo porque consume memoria).
- `requestAnimationFrame` para coalescer eventos `touchmove`.
- NO actualizar `viewBox`, NO actualizar paths SVG durante el gesto.
- Path complexity actual del mapa Torres García: 34 paths, ~25KB. Manejable en Pixel 6/A54. En dispositivos < 2GB RAM puede laggear ligero — aceptable.

**Métricas target:**

| Métrica | Target |
|---|---|
| Frame rate durante pinch | ≥ 50fps en A54 |
| Latencia tap → panel abierto | < 350ms (300ms timeout double-tap + 50ms animación) |
| Memory durante gesture | < 50MB delta |

Spec 54 (performance budget) profundiza estas métricas a nivel sistema.

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| Pinch-zoom 1×-3× con throttle 60fps | Librería de mapas externa |
| Pan con boundaries + inercia corta | Capas analíticas dinámicas |
| Double-tap toggle 1×/2× | Animación de "presentación" del mapa |
| Botón RESET ⟲ floating | Mini-mapa overview |
| Hit area ampliada para UY y EC | Gestos avanzados (rotate, swipe) |
| Tap → panel inline (reemplaza nav directa) | Persistencia de zoom entre navegaciones |
| Panel persistente hasta acción explícita | Vibración háptica |
| `touch-action: pinch-zoom` | Hit area ampliada para todos los países |
| Optimización GPU + rAF | Reescritura del SVG |

---

## Cross-refs y actualizaciones

- `70-Producto/specs/22-mapa-interactivo-torres-garcia.md` §16.1: agregar nota indicando que el comportamiento de tap se reemplaza por Spec 49 §7 (tap abre panel inline, no navega directo). El "tooltip 800ms" queda obsoleto.
- `70-Producto/specs/33-agendas-en-el-mapa-home.md`: confirmar en notas que mobile sigue usando el panel como contenido inline debajo del mapa (no lateral).
- `70-Producto/specs/51-home-mobile.md` §2.3: el comportamiento de tap del mapa que esta sección referencia se detalla en Spec 49 §7.
- `70-Producto/design-system/design-system.md`: agregar componente `MapResetButton` con anatomía resumida.

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Crear hook `useMapGestures.ts` con pinch + pan + double-tap, throttle rAF, `touch-action` dinámico | 5h | — |
| 2 | Refactor `MapaTorresGarcia.tsx` para consumir el hook y aplicar `transform` sobre el `<g>` interior | 2h | tarea 1 |
| 3 | Calibrar paths invisibles de hit area ampliada para Uruguay y Ecuador (puede ser manual o con script de buffer) | 2h | — |
| 4 | Crear `MapResetButton.tsx` con anatomía completa, mostrar/ocultar según `scale` | 1.5h | tarea 1 |
| 5 | Crear indicador de zoom (top-left) con misma lógica de mostrar/ocultar | 1h | tarea 1 |
| 6 | Integrar tap → panel inline (Spec 33 + Spec 51 §2.3): cancelación de double-tap, cross-fade entre países, persistencia | 2.5h | tareas 1, 2 |
| 7 | Validación en Samsung A54 real: pinch, pan, double-tap, RESET, hit area, performance frame rate | 2h | tareas 1-6 |
| 8 | Validación a11y: keyboard alternativa para pinch (botones +/-), focus management, screen reader anuncios de zoom y panel | 2h | tareas 1-6 |
| 9 | Cross-refs: actualizar Spec 22 §16.1, design system | 30min | — |

**Estimación total:** 18-19 horas (2.5 días de trabajo).

**Riesgo:** el hook `useMapGestures` es la pieza técnica más compleja del EPIC-04. Conviene reservar 1h adicional de buffer si aparecen ediciones de paths para hit area ampliada o si el rendering en Android mid-range requiere ajuste fino.

---

## Maqueta

Mockups validados en sesión de Cowork 2026-05-26 (widgets HTML inline, regenerables desde el prompt en `70-Producto/prompts-product-design/spec-49-mapa.md`).

| Mock | Qué validó |
|---|---|
| 3 estados del mapa (normal con hit areas anotadas, zoom 2× con pan, tap-preview con panel inline) | Visualización de cada estado del sistema gestual |
| Tabla de 9 decisiones de comportamiento (pinch, pan, double-tap, hit area, tap, panel, labels, performance, touch-action) | Cierre de todas las decisiones técnicas con rationale |

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-26 | Creación de la spec en estado `lista`. Decisiones tomadas en sesión de Cowork con visualizador de estados + tabla técnica | Quinta spec hija de EPIC-04 (después de 50, 52, 53, 51). Habilitada por el cierre de EPIC-03 que liberó el componente del mapa. Reemplazó formalmente Spec 22 §16.1 en el comportamiento de tap |
