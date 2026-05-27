---
spec: 51
titulo: Home (`/`) re-jerarquizada mobile-first — mapa protagonista, orden vertical editorial
estado: lista
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-26
afecta:
  - platform/frontend/src/app/page.tsx (refactor del shell mobile, orden de bloques)
  - platform/frontend/src/components/MapaHeatmapSection.tsx (mobile: layout vertical, panel preview inline debajo del mapa)
  - platform/frontend/src/components/MapaTorresGarcia.tsx (variante mobile width-driven con aspect-ratio 1280/1380)
  - platform/frontend/src/components/Carousel.tsx (mobile: 1 card visible con swipe + scroll-snap)
  - platform/frontend/src/components/HeatmapEjesXSemanas.tsx (mobile: 6×12 con celdas 18px — reutilizable desde Spec 52)
  - platform/frontend/src/components/LastDispatchCard.tsx (mobile: full-width grande)
  - platform/frontend/src/components/SiteFooter.tsx (mobile: stack vertical de las 3 columnas)
  - platform/frontend/src/components/SiteHeader.tsx (Spec 53: ya define el header mobile con ☰)
  - platform/frontend/src/styles/home-mobile.css (NUEVO o refactor)
depende_de: [11, 22, 30, 33, 34, 50, 52, 53]
relaciona_con: [Spec 11 (rediseño home original — arquetipo A Atlas editorial), Spec 30 (datos del corpus en el home), Spec 33 (panel agendas/preview país al click en el mapa), Spec 34 (rediseño home desktop r2 — esta spec es el complemento mobile), Spec 50 (sistema tipográfico aplicado al "Esta semana" y al carrusel), Spec 52 (heatmap 6×12 reutilizable), Spec 53 (header con drawer ☰)]
prioridad: alta
bloqueante_de: EPIC-04 — es la primera vista que ve un lector nuevo desde WhatsApp/Substack en mobile
desbloquea: home mobile coherente con identidad del proyecto (mapa Torres García como signature), jerarquía editorial mobile-first sin sacrificar el desktop existente
---

# 51 · Home (`/`) re-jerarquizada mobile-first

## Resumen ejecutivo

Spec 34 r2 definió el home desktop con mapa entero arriba del fold, "Esta semana" debajo, carrusel angosto, último despacho, heatmap zona profunda. Spec 34 §12 propuso una versión mobile como layout vertical genérico — adaptación sin re-pensamiento. EPIC-04 r1 identificó la home como una de las cuatro vistas críticas del lanzamiento de julio: es la primera impresión que un lector nuevo va a tener desde un mensaje de WhatsApp o Substack, y la plataforma actual se construyó desktop-first.

Esta spec **re-piensa la home desde mobile 360**, no la adapta. Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-26) sobre tres variantes de above-the-fold y se confirmó el orden vertical post-fold derivado de Spec 34.

**Decisión central:** **el mapa Torres García sigue siendo protagonista en mobile**, arriba del fold a sangre, con el bloque "Esta semana · [eje]" debajo (ambos arriba del fold). Esto respeta el principio declarado en Spec 01 ("el mapa es la interfaz signature del proyecto") y mantiene coherencia visual con el desktop de Spec 34. Se descartaron explícitamente: un hero editorial manifiesto (V2 — pierde signature, repite la frase al recurrente) y un análisis destacado de la semana (V3 — pierde signature, exige curaduría editorial extra).

**Outcome.** En mobile, el lector que llega ve: header de Mapa Inestable (Spec 53 con drawer ☰, 44px) → mapa Torres García a sangre (≈388px alto, aspect-ratio 1280/1380) → bloque "Esta semana · DESORIENT." con Alfa Slab 26 + count en Lora italic. Si hace tap en un país del mapa, aparece **panel inline debajo del mapa** empujando "Esta semana" hacia abajo (no modal). Post-fold encuentra carrusel de análisis (1 card visible swipe) → card último despacho grande → heatmap 6×12 → footer en stack vertical.

**Lo que entra en r1:**

- Layout vertical mobile completo con orden definido.
- Mapa Torres García a sangre arriba del fold (width-driven, 360 × ~388).
- Bloque "Esta semana · [eje]" debajo del mapa, ambos arriba del fold.
- Panel preview de país inline debajo del mapa al tap (Spec 33 adaptado).
- Carrusel con 1 card visible + swipe horizontal + scroll-snap.
- Card último despacho 1 columna full-width.
- Heatmap 6×12 reutilizando el componente de Spec 52.
- Footer en stack vertical (las 3 columnas desktop apiladas).
- Sistema tipográfico de Spec 50 aplicado a los bloques con texto.

**Lo que NO entra en r1:**

- Hero editorial manifiesto (V2). Descartado.
- Análisis destacado curado de la semana (V3). Descartado — exigiría decisión editorial semanal extra y curaduría que no hay capacidad de sostener.
- Cambios al panel de Spec 33. Esta spec confirma que se muestra inline debajo, sin modificar contenido (nombre país + ejes crónicos + esta semana + agenda + CTA).
- Animación de cambio de tab en el carrusel — sigue el patrón de Spec 34 desktop (auto-slide 5s + swipe).
- Bloque "borradores diarios visibles" (Spec 32) en el home. Diferido a post-lanzamiento si se prioriza.
- Modal de búsqueda invocado desde el home. La búsqueda vive en el drawer (Spec 53) → `/buscador` (Spec 05).
- Modificaciones al heatmap más allá de reutilizar el componente Spec 52.

---

## Estado actual

### En Spec 34 (home desktop r2)

§12 propone layout vertical mobile: header 56px con hamburger, strip de conceptos opcional, mapa width-driven full-width, panel debajo del mapa, "Esta semana", carrusel 1 card swipe, último despacho, heatmap con scroll horizontal, footer. Esta spec **profundiza** esa propuesta con anatomía precisa y la **alinea** con las decisiones que se tomaron en EPIC-04 después (Spec 53 hamburger único, Spec 50 sistema tipográfico, Spec 52 heatmap 6×12 mobile).

### En el frontend

`app/page.tsx` actualmente renderiza el desktop de Spec 34 (mergeado). Mobile cae a versiones colapsadas sin orden ni jerarquía pensados. El refactor de esta spec opera sobre el mismo `page.tsx` con clases responsive (no archivos separados).

### Mockups validados en sesión de Cowork (2026-05-26)

Tres variantes de above-the-fold:
- V1: Mapa protagonista + "Esta semana" debajo — **elegida**.
- V2: Hero editorial manifiesto — descartada (pierde signature, pesa al recurrente).
- V3: Análisis destacado de la semana — descartada (pierde signature, exige curaduría editorial extra).

Argumentos finales V1: el mapa Torres García **es** la identidad del proyecto (Spec 01, Spec 11 arquetipo A, Spec 22, Spec 34). Sacarlo del above-the-fold mobile contradice esa decisión declarada. El bloque "Esta semana" debajo del mapa funciona como orientación editorial sin competir por el espacio del mapa.

---

## Propuesta

### 1. Layout vertical mobile

Orden de bloques de arriba a abajo:

```
┌─────────────────────────────────────┐
│ HEADER (Spec 53)                    │ ← 44px sticky
│ [⛰] MAPA INESTABLE          [ ☰ ]   │
├─────────────────────────────────────┤
│                                     │
│  MAPA TORRES GARCÍA                 │ ← ≈388px (360 × 1380/1280)
│  (width-driven, a sangre)           │   above fold
│  click país → panel inline abajo    │
│                                     │
├─────────────────────────────────────┤
│ Semana 19 · 2026                    │ ← bloque "Esta semana"
│ Esta semana · Desorient.            │   ≈100px above fold
│ 3 de 5 análisis lo activaron.       │
├═════════════════════════════════════┤ ← fold ~656px
│ ═════════════════════════════════   │
│  Carrusel · 1 card visible          │ ← scroll-snap
│  [ swipe ›]                         │   1ª card analysis
│  • • • ●                            │   dots debajo
├─────────────────────────────────────┤
│ ÚLTIMO DESPACHO                     │
│ [card grande con resumen + CTA]     │
├─────────────────────────────────────┤
│ EJES × SEMANAS · ÚLTIMAS 12         │ ← heatmap (Spec 52 reuso)
│ [matriz 6×12]                       │
├─────────────────────────────────────┤
│ FOOTER (stack vertical)             │
│ Hipótesis                            │
│ Ejes                                │
│ Países                              │
│ Créditos                            │
└─────────────────────────────────────┘
```

**Total scroll vertical estimado**: ~2400-2800px. Fold a ~656px. El lector que solo ve el fold experimenta el proyecto (mapa + orientación de la semana). El lector que scrollea explora.

### 2. Above the fold (Variante 1)

#### 2.1. Mapa Torres García mobile

- **Sizing:** width-driven. Aspect ratio 1280/1380 (mismo del componente desktop). En 360 de ancho → ~388px de alto. Sin padding lateral (a sangre).
- **Fondo:** color del eje activo de la semana o `--mi-bg` terracota por default.
- **Comportamiento:** tap en país → expande panel preview inline debajo (§2.3).
- **Cambios respecto a desktop (Spec 34 §6):** el modelo height-driven (`calc(100vh - 130px)`) NO aplica en mobile — vuelve a width-driven porque vertical es OK en mobile. Coherente con Spec 34 §12.2.
- **Hint editorial debajo del mapa:** "EL SUR ARRIBA · CLICK EN PAÍS" en mono 9px uppercase, color `--mi-ink-mute`, alineado al centro, padding-top 6px. Ayuda al lector nuevo a entender la inversión.

#### 2.2. Bloque "Esta semana · [eje]"

- Padding 20px lateral + 20px arriba 16px abajo.
- Border-top 1px tinta (separador del mapa).
- **Línea 1:** `SEMANA 19 · 2026` en mono 11px uppercase letter-spacing 0.08em color `--mi-ink-mute`.
- **Línea 2:** `Esta semana · DESORIENT.` en Alfa Slab One 26px, line-height 1.05, donde "DESORIENT." toma el color del eje activo (`var(--mi-axis-{slug})`). Letter-spacing -0.01em.
- **Línea 3:** "3 de 5 análisis lo activaron." en Lora italic 15px line-height 1.4 color `--mi-ink-soft`.
- **Estado vacío** (sin publicaciones esa semana, `getHomeData().thisWeek === null`): título "Esta semana se está cocinando" en Alfa Slab 26 + "La próxima entrega cierra el viernes" en Lora italic 15.

#### 2.3. Panel preview de país (inline, al tap en el mapa)

- Aparece **entre el mapa y "Esta semana"**, empujando todo lo de abajo (no modal).
- Animación: slide-down 200ms desde altura 0 hasta `auto`.
- Anatomía: ya está definida en Spec 33. Resumen: nombre del país (Alfa Slab 32 en mobile), ejes crónicos (axis pills row), esta semana (count de análisis), agenda (lista mono uppercase), CTA "Ver ficha →".
- Cierre: X arriba a la derecha del panel + tap fuera del panel cierra.
- Si el lector hace tap en otro país sin cerrar: el panel transiciona (no se cierra y abre — fade-cross 200ms).

### 3. Post-fold

#### 3.1. Carrusel de análisis recientes

- 1 card visible (vs 2 en desktop).
- Ancho del card: 320px (320 + padding 20 lateral = 360 total).
- Swipe horizontal con `scroll-snap-type: x mandatory` y `scroll-snap-align: start`.
- Auto-slide cada 5s. Pausa al touch. Pausa con `prefers-reduced-motion: reduce`.
- Dots indicador debajo: tinta-mute apagados, dorado activo. Tap en dot navega a esa card.
- Anatomía de cada card: misma que Spec 34 §8.2 (silueta país + name + eje pill + título Fraunces 18 + lede Lora 14 italic + meta mono 12). En mobile el ancho de 320 fuerza una jerarquía más apretada (eje pill al lado del país).
- Padding superior 32px (separación de "Esta semana"), inferior 28px.

#### 3.2. Card último despacho

- 1 columna full-width. Padding 20px lateral.
- Border-thick 2px tinta + shadow-card 4×4.
- Anatomía: label mono "ÚLTIMO DESPACHO" + h2 Fraunces 22 con el título del despacho + bajada en Lora italic 16 + CTA "Leer despacho →" en estilo botón-link primary (Spec 11 / Spec 34).
- Padding superior 28px, inferior 28px.

#### 3.3. Heatmap ejes × semanas

- **Reusa el componente de Spec 52 §5.2** (matriz 6 × 12 con celdas 18px, nombres de eje abreviados con pin de color, colores intensificados por frecuencia).
- Diferencia con Spec 52: aquí el heatmap es del corpus completo (no filtrado por país). El componente acepta el filtro como prop opcional.
- Label "EJES × ÚLTIMAS 12 SEMANAS" en mono 11 uppercase color mute, padding-bottom 6 border-bottom 1 tinta.
- Padding superior 32px, inferior 28px.

#### 3.4. Footer mobile

- Las 3 columnas del footer desktop (hipótesis, ejes, países + créditos) se apilan en stack vertical 1 columna.
- Fondo `--mi-bg-dark`, padding 28px lateral 40px vertical.
- **Hipótesis** (manifiesto del proyecto): Fraunces italic 18 / 1.4, color `--mi-bg-paper`. Es el bloque más visible del footer.
- **Ejes** (lista de los 6): mono 12 uppercase, color crema con opacity 0.85, padding 4px vertical por item.
- **Países** (lista de los 10): mono 12 uppercase, color crema con opacity 0.85, padding 4px vertical por item. Pueden ir agrupados de 3-4 con separadores `·`.
- **Créditos**: mono 10 lowercase color dorado pálido — autor, año, repo, contacto.
- Tagline "cartografía política del sur" en mono 11 lowercase color dorado pálido (la tagline que el header mobile no muestra, vive acá).

### 4. Implementación responsiva

`app/page.tsx` debe detectar mobile (≤640px) y aplicar el orden vertical de esta spec. Implementación recomendada:

```tsx
// page.tsx (pseudo)
<SiteHeader />  // Spec 53 — internamente decide mobile vs desktop
<main>
  <Map variant="home" />  // width-driven en mobile, height-driven en desktop
  <ThisWeekBlock />
  <Carousel variant="mobile-1-card" />  // o "desktop-2-cards"
  <LastDispatchCard />
  <HeatmapAxisTime scope="corpus" />  // Spec 52 reuso
</main>
<SiteFooter />
```

Sin componentes mobile-only — todo es responsive por CSS. Los componentes detectan viewport via media queries en su CSS, no en JS.

**El sidebar persistente NO se renderiza en mobile.** Su contenido vive ahora dentro del drawer del header (Spec 53). Eso libera el viewport horizontal entero para el mapa y el contenido.

### 5. Performance arriba del fold

LCP element en mobile = el mapa Torres García (SVG inline ≈ 25KB de paths). Para lograr LCP < 2.5s en 4G LATAM (criterio AE1 del epic):
- SVG inline, no archivo externo.
- Fuentes Alfa Slab + Lora + Fraunces + IBM Plex Mono con `font-display: swap`.
- Nada en JS bloqueante arriba del fold (el carousel y el heatmap hidratan post-fold).
- No imágenes externas arriba del fold (la tagline editorial es Alfa Slab puro).

Spec 54 (performance budget) va a profundizar esto cuando se diseñe, pero la decisión de mantener el mapa SVG inline + sin imágenes arriba del fold ya está tomada acá.

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| Mapa Torres García a sangre arriba del fold (V1) | Hero editorial manifiesto (V2) |
| Bloque "Esta semana" debajo del mapa | Análisis destacado curado (V3) |
| Panel preview de país inline debajo del mapa | Panel modal full-screen |
| Carrusel 1 card swipe + scroll-snap | Carrusel 2 cards (es desktop) |
| Card último despacho grande full-width | Bloque borradores diarios visibles |
| Heatmap 6×12 (Spec 52 reuso) | Heatmap completo 6×18 |
| Footer stack vertical 1 columna | Footer en 3 columnas (es desktop) |
| Sistema tipográfico Spec 50 aplicado | Modal de búsqueda invocado desde home |

---

## Cross-refs y actualizaciones

- `70-Producto/specs/34-rediseno-home-dashboard-r2.md` §12: agregar nota indicando que Spec 51 es la fuente de verdad mobile (Spec 34 §12 queda como propuesta inicial).
- `70-Producto/specs/11-rediseno-home-dashboard.md`: nota similar en §4.
- `70-Producto/specs/33-agendas-en-el-mapa-home.md`: nota indicando que en mobile el panel aparece inline debajo del mapa (no lateral). Sin cambios al contenido del panel.
- `70-Producto/specs/22-mapa-interactivo-torres-garcia.md` §12 (mobile): alinear con Spec 51 (mapa width-driven en mobile, panel inline).
- `70-Producto/design-system/design-system.md` §Componentes: agregar entrada `Home (mobile)` con orden de bloques.

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Refactor `app/page.tsx` para orden vertical mobile + clases responsive | 1.5h | Spec 53 implementada |
| 2 | Adaptar `MapaTorresGarcia.tsx` a variante mobile width-driven (sin `aspect-ratio` del padre) | 1h | — |
| 3 | Refactor `MapaHeatmapSection.tsx` o equivalente para layout vertical mobile (mapa arriba, panel inline al click) | 2h | tareas 1, 2 |
| 4 | Implementar carrusel mobile (1 card swipe + scroll-snap + dots + auto-slide 5s + pausa reduced-motion) | 3h | — |
| 5 | Ajustar `LastDispatchCard.tsx` y `SiteFooter.tsx` a layouts mobile (stack vertical, padding) | 1.5h | — |
| 6 | Integrar `HeatmapAxisTime` (Spec 52) con scope `corpus` (sin filtro de país) | 1h | Spec 52 implementada |
| 7 | Validación visual en Samsung A54 real + emulado 390 y 412 | 1.5h | tareas 1-6 |
| 8 | Lighthouse mobile: LCP < 2.5s, FCP < 1.8s, bundle home ≤ 250KB (AE1 + AE7 del epic) | 1h | tareas 1-7 |
| 9 | Cross-refs: actualizar Specs 34, 11, 33, 22, design system | 30min | — |

**Estimación total:** 13-14 horas (2 días de trabajo).

**Orden de implementación:** secuencial sobre la base de Spec 53 implementada (drawer y header mobile). El home depende del header, no al revés.

---

## Maqueta

Mockups validados en sesión de Cowork 2026-05-26 (widgets HTML inline, regenerables desde el prompt en `70-Producto/prompts-product-design/spec-51-home.md`).

| Mock | Qué validó |
|---|---|
| 3 variantes above-the-fold (mapa / hero / análisis destacado) | Elección de V1 (mapa protagonista + "Esta semana") |

El orden vertical post-fold se confirmó conversacionalmente sin mock adicional (derivable de Spec 34 desktop con adaptaciones mobile ya validadas en Specs 50 y 52).

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-26 | Creación de la spec en estado `lista`. Decisiones tomadas en sesión de Cowork con mockups HTML inline | Cuarta spec hija de EPIC-04 (después de 50, 52, 53). Reutiliza el sistema tipográfico de Spec 50, el heatmap de Spec 52 y el header de Spec 53. La home queda calibrada a 360 sin sacrificar la signature del mapa Torres García |
