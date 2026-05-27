---
spec: 53
titulo: Navegación principal en mobile — menú único colapsable (drawer) con dos secciones
estado: lista
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-26
afecta:
  - platform/frontend/src/components/SiteHeader.tsx (refactor — reemplaza nav scroll horizontal por botón ☰ en mobile)
  - platform/frontend/src/components/MobileNavDrawer.tsx (NUEVO — drawer con backdrop, dos secciones, a11y)
  - platform/frontend/src/components/Sidebar.tsx (mobile: deja de renderizarse standalone, su contenido pasa al drawer)
  - platform/frontend/src/styles/globals.css (tokens para drawer width, backdrop, transición)
  - platform/frontend/src/hooks/useFocusTrap.ts (NUEVO o adopción de librería liviana, para a11y del drawer)
depende_de: [02, 11, 20, 34, 50]
relaciona_con: [Spec 02 (esta spec REABRE §2), Spec 11 §4.1 (header), Spec 20 (sidebar autores/conceptos), Spec 34 §4 (header angosto desktop), EPIC-04 (cierra Decisión Abierta #2)]
prioridad: alta
bloqueante_de: EPIC-04 (Spec 51 depende de esta porque define el header común del home)
desbloquea: navegación principal coherente en mobile que escala con el crecimiento del menú (5+ secciones futuras, sidebar con Países/Ejes/Conceptos/Autores/Buscar) sin rediseñar chrome cada vez
---

# 53 · Navegación principal en mobile — menú único colapsable (drawer) con dos secciones

## Resumen ejecutivo

Spec 02 §2 (2026, fecha temprana del proyecto) decidió "no hamburger porque es sitio editorial — el header pasa a flex-column con scroll horizontal de nav". EPIC-04 r1 (2026-05-21) reabrió esa decisión bajo el argumento de que el menú principal crece: hoy tiene Despachos · Ensayos · Mapa · Acerca (4 secciones) + sidebar persistente con Países · Ejes · Conceptos · Autores · Buscar (5 destinos navegacionales adicionales). Nueve destinos en mobile no escalan con scroll horizontal.

Esta spec cierra esa decisión: en mobile (≤640px) la navegación principal se consolida en un **botón ☰ a la derecha del logo** que abre un **drawer slide-in desde la izquierda** con dos secciones internas:

1. **Secciones** (nav principal del site): Despachos · Ensayos · Mapa · Acerca.
2. **Recorrer el corpus** (sidebar persistente actual): Países (10) · Ejes (6) · Conceptos · Autores · Buscar.

Las dos navegaciones quedan visualmente diferenciadas dentro del mismo drawer (tipografía y peso distintos, separador) para mantener la diferencia funcional declarada en Spec 11 §4.1: "el header maneja qué tipo de pieza estás leyendo, el sidebar maneja por dónde recorrés el corpus".

**Argumento contra "no hamburger porque es editorial":** falso por ausencia de evidencia. Los mejores sitios editoriales mobile (NYT, Guardian, El País, Le Monde, Substack, Aeon) usan el patrón ☰ + drawer en mobile. Lo que define editorial vs app no es la presencia del menú colapsado sino el tono visual y tipográfico del drawer. Esta spec respeta el tono editorial con drawer en verde-negro (`--mi-bg-dark`), tipografía Alfa Slab + IBM Plex Mono, sin animaciones gratuitas.

**Argumento de flexibilidad** (señalado por Tomás en sesión): si el menú crece (nuevas secciones, nuevas entidades del corpus, idiomas), el drawer absorbe sin rediseñar chrome. Un nav scroll horizontal se rompe con cada item nuevo.

**Outcome.** En mobile, el header de Mapa Inestable mide 44px: logo + wordmark a la izquierda, botón ☰ a la derecha. Tap en ☰ abre drawer desde la izquierda (280px ancho, backdrop semitransparente sobre el contenido) con las dos secciones de nav. El usuario navega con 2 taps (☰ + destino). El header libera el viewport máximo.

**Lo que entra en r1:**

- Botón ☰ en el header mobile (≤640px).
- Drawer slide-in desde la izquierda, 280px ancho, fondo verde-negro, backdrop `rgba(0,0,0,0.45)`.
- Dos secciones internas con jerarquía visual distinta.
- A11y: foco automático al primer ítem al abrir, focus trap dentro del drawer, ESC cierra, backdrop tap cierra, X arriba a la derecha cierra.
- Reapertura formal de Spec 02 §2.
- Cierre de Decisión Abierta #2 del epic.

**Lo que NO entra en r1:**

- Bottom navigation (tab bar al pie del viewport). Patrón más app-y, descartado.
- Hamburger en desktop. El header desktop mantiene nav inline + sidebar lateral (Spec 34 §4).
- Search bar siempre visible en el header mobile. Se evaluó (Variante 3 de la sesión) y se descartó: el wordmark + ☰ + search no entran cómodos en 360 sin sacrificar identidad.
- Animaciones complejas (slide + fade + scale). En r1: solo slide-in 200ms con `ease-out`.
- Submenús dentro del drawer (Países expandible). En r1: tap en "Países" navega a `/paises` (índice). Si el lector quiere uno específico, lo elige desde ahí.
- Recordar último ítem visitado en el drawer. Se abre siempre en estado limpio.

---

## Estado actual

### En Spec 02 §2

> El header pasa de flex-row a flex-column. La nav scrollea horizontalmente si no entra. No se necesita hamburger — es un sitio editorial, no una app.

Esta decisión queda **reabierta y reemplazada por esta spec** con rationale documentado.

### En Spec 34 §12.2

> Header 56px alto, logo 32px, nav colapsa a hamburger (drawer con sidebar).

Spec 34 ya planteó la dirección que esta spec formaliza y profundiza. La inconsistencia entre Spec 02 §2 y Spec 34 §12.2 se resuelve en favor de Spec 34 (y de esta spec).

### En el frontend

`SiteHeader.tsx` actualmente renderiza nav inline siempre (sin colapso mobile). El sidebar (`Sidebar.tsx`) en mobile vive abajo del contenido principal, no colapsado. Ambos componentes se refactoran en esta spec.

### Mockups validados en sesión de Cowork (2026-05-26)

Tres variantes comparadas:
- V1: hamburger único — **elegida**.
- V2: nav scroll horizontal + drawer separado para sidebar — descartada (76px de header alto, no escala).
- V3: hamburger + buscador siempre visible — descartada (compite por ancho a 360, sacrifica wordmark).

Argumentos finales para V1: patrón editorial mobile estándar, header limpio en 44px, flexible para crecimiento futuro del menú.

---

## Propuesta

### 1. Header mobile (≤640px)

Anatomía:

```
┌─────────────────────────────────────────────┐
│ [⛰] MAPA INESTABLE                    [ ☰ ] │  ← 44px alto
└─────────────────────────────────────────────┘
```

**Tokens:**

| Elemento | Valor |
|---|---|
| Alto del header | 44px |
| Fondo | terracota `--mi-bg` (`#C5663A`) |
| Borde inferior | `--mi-border-thick` 2px tinta |
| Padding lateral | 16px |
| Logo (silueta + escalador) | 28px de alto |
| Wordmark "MAPA INESTABLE" | Alfa Slab One 13px, color tinta, letter-spacing -0.01em |
| Botón ☰ | mono 16px tinta, padding 4×8, borde 1.5px tinta, fondo transparente |
| Sticky | Sí (top: 0, z-index: 50) |

**Diferencia con desktop (Spec 34 §4):** se elimina la tagline "cartografía política del sur" del header mobile. Es información introductoria — en mobile el espacio es premio. La tagline queda visible en `/acerca` y en el footer del home.

### 2. Drawer slide-in desde la izquierda

Anatomía:

```
┌─────────────────────────────────┬──────┐
│ MAPA INESTABLE              [✕] │      │
│                                 │      │  ← drawer 280px
│ SECCIONES                       │      │     fondo verde-negro
│ Despachos                       │      │     padding 20 lateral
│ Ensayos                         │backd │
│ Mapa                            │ rop  │
│ Acerca                          │      │
│                                 │      │
│ RECORRER EL CORPUS              │      │
│ Países (10)                     │      │
│ Ejes (6)                        │      │
│ Conceptos                       │      │
│ Autores                         │      │
│ Buscar →                        │      │
│                                 │      │
└─────────────────────────────────┴──────┘
```

**Tokens:**

| Elemento | Valor |
|---|---|
| Ancho del drawer | 280px |
| Fondo del drawer | `--mi-bg-dark` (`#1F2A12`) |
| Backdrop (sobre el contenido detrás) | `rgba(0, 0, 0, 0.45)` |
| Padding interno | 20px lateral, 24px arriba, 32px abajo |
| Transición de apertura | `transform: translateX()` 200ms `cubic-bezier(0.2, 0, 0, 1)` |
| Z-index | drawer 200, backdrop 199 |

**Header del drawer (arriba):**

```
MAPA INESTABLE                                    [✕]
```

- "MAPA INESTABLE" en mono 10px uppercase letter-spacing 0.08em color terracota `--mi-bg` (sirve de ancla y refuerza marca dentro del drawer).
- Botón ✕ alineado a la derecha: mono 14px color crema `--mi-bg-paper`, padding 4px, sin borde. Tap-target 44×44 (área alrededor).
- Borde bottom 1px crema con `opacity: 0.2` debajo del header del drawer, margen 18px.

**Sección 1 — Secciones (nav principal del site):**

- Label de sección "SECCIONES" en mono 9px uppercase letter-spacing 0.1em color dorado `--mi-accent-gold`, padding-bottom 4px, borde bottom 1px crema-opacity-20.
- Items: "Despachos", "Ensayos", "Mapa", "Acerca".
- Cada item: mono 13px uppercase letter-spacing 0.05em color crema `--mi-bg-paper`, padding 8px vertical, sin borde.
- Tap-target del item: 44px de alto (`padding: 12px 0` para garantizarlo).
- Item activo (cuando estás en `/despachos/...`): peso 500, color dorado pálido `--mi-accent-gold`.

**Separador entre secciones:** margin-top 16px de la sección 2, sin borde (los labels de sección son suficiente jerarquía visual).

**Sección 2 — Recorrer el corpus (sidebar persistente actual):**

- Label "RECORRER EL CORPUS" mismo estilo que "SECCIONES".
- Items en escala menor para diferenciar funcionalmente (Spec 11 §4.1: "header maneja qué pieza, sidebar maneja recorrido"):
  - "Países (10)", "Ejes (6)", "Conceptos", "Autores".
  - Cada item: Lora 400 13px, color crema con `opacity: 0.85`, sin uppercase, padding 6px vertical.
  - Tap-target del item: 44px de alto (`padding: 10px 0`).
  - Counts entre paréntesis con `opacity: 0.5` (jerarquía secundaria).
- "Buscar →" al final de la sección 2: mismo estilo que items pero con flecha de salida — link a la página `/buscador` (Spec 05) o abre un modal de búsqueda (decisión que ya está en Spec 05).

### 3. Comportamiento del drawer

**Apertura:**

- Tap en ☰ del header → drawer aparece deslizando desde `translateX(-280px)` a `translateX(0)` en 200ms `ease-out`. Backdrop fade-in de `opacity: 0` a `opacity: 1` en paralelo.
- Body de la página recibe `overflow: hidden` para evitar scroll de fondo mientras el drawer está abierto.
- Foco se mueve automáticamente al primer ítem ("Despachos").

**Cierre (cualquiera de los siguientes):**

- Tap en ✕.
- Tap en el backdrop (los 80px visibles del contenido detrás).
- Swipe horizontal hacia la izquierda sobre el drawer (gesto nativo).
- ESC en keyboard.
- Click en un ítem (navega + cierra).
- Cambio de ruta por navegación back/forward del browser.

En todos los casos: transición inversa 200ms, body recupera scroll, foco vuelve al botón ☰.

**Focus trap:**

- Mientras el drawer está abierto, el `Tab` cicla solo entre los ítems del drawer + el botón ✕.
- Al cerrar, foco vuelve al botón ☰ original.
- Implementación: hook `useFocusTrap` o librería `focus-trap-react` (ligera).

**Scroll del drawer:**

- Si el contenido excede los 800px de viewport (raro con 9 items en 13/13px), el drawer hace scroll vertical interno. El header del drawer + el botón ✕ quedan fijos arriba.

### 4. Decisión Abierta #2 del epic

Esta spec **cierra** la Decisión Abierta #2 ("¿Cómo se accede al menú/navegación principal en mobile? Spec 02 §2 decidió no hamburger…") con la resolución V1 (hamburger único).

### 5. Reapertura formal de Spec 02 §2

En `70-Producto/specs/02-mobile-responsive.md`, agregar nota al final de §2:

> **Reapertura 2026-05-26 (Spec 53):** la decisión "no hamburger" de esta sección queda reemplazada. El header mobile usa botón ☰ con drawer slide-in. Ver Spec 53 para anatomía completa. El argumento original ("es sitio editorial, no app") se descartó por ausencia de evidencia — los principales sitios editoriales mobile usan el patrón ☰ con drawer. La diferencia editorial vs app la hace el tono del drawer, no la presencia del botón.

### 6. Casos de borde

**Drawer abierto + cambio de orientación (portrait ↔ landscape).** El drawer mantiene ancho 280px (no es %). En landscape de A54 (800×360) ocupa 35% del viewport — más respiración.

**Lector con `prefers-reduced-motion: reduce`.** Apertura y cierre son instantáneos (transición 0ms). El backdrop sí aparece (no es animación, es estado).

**Doble tap rápido en ☰.** Idempotente: si ya está abierto, segundo tap lo cierra (toggle).

**Pantallas <320px** (raro pero existe en gama baja). Drawer mantiene 280px y deja apenas 40px visibles del contenido detrás. Es feo pero funcional. La regla de validación de EPIC-04 (mobile-first a 360px) cubre el 95%+ del mercado LATAM.

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| Header mobile con ☰ a la derecha | Tagline en el header mobile |
| Drawer slide-in 280px desde izquierda | Bottom navigation app-y |
| Dos secciones con jerarquía visual distinta | Hamburger en desktop |
| Focus trap + ESC + backdrop tap + swipe | Buscador siempre visible |
| Reapertura de Spec 02 §2 | Submenús anidados (Países expandible) |
| Cierre de Decisión Abierta #2 del epic | Animaciones complejas |
| Logo + wordmark visibles permanentemente | Recordar último ítem visitado |

---

## Cross-refs y actualizaciones

- `70-Producto/specs/02-mobile-responsive.md` §2: agregar nota de reapertura (texto exacto en §5 arriba).
- `70-Producto/specs/34-rediseno-home-dashboard-r2.md` §12.2: marcar como ALINEADO con esta spec — el hamburger que §12.2 planteaba se especifica acá.
- `70-Producto/specs/11-rediseno-home-dashboard.md` §4.2 (sidebar persistente): agregar nota: "en mobile, el sidebar se renderiza como sección 'Recorrer el corpus' dentro del drawer mobile (Spec 53), no como elemento standalone".
- `70-Producto/specs/20-sidebar-autores-conceptos.md`: agregar nota similar al §11 anterior.
- `70-Producto/design-system/design-system.md` §Componentes: agregar entrada `MobileNavDrawer` con anatomía resumida.

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Refactorizar `SiteHeader.tsx` para renderizar layout mobile vs desktop según breakpoint (CSS-based o JS-detected) | 1.5h | — |
| 2 | Crear `MobileNavDrawer.tsx` con anatomía completa, transición, focus trap | 3h | tarea 1 |
| 3 | Implementar comportamientos de cierre (backdrop, ESC, swipe, X, navegación) | 1.5h | tarea 2 |
| 4 | Adaptar `Sidebar.tsx` para no renderizarse en mobile (su contenido vive ahora dentro del drawer) | 30min | tarea 2 |
| 5 | Hook `useFocusTrap` o instalar `focus-trap-react` (peso: ~3KB gzipped, OK para budget) | 30min | — |
| 6 | Validación visual en Samsung A54 real + emulado 390 y 412 | 1h | tareas 1-4 |
| 7 | Validación a11y: keyboard navigation, screen reader, tab order, ESC, focus visible | 1.5h | tareas 1-5 |
| 8 | Cross-refs: actualizar Spec 02 §2, Spec 11 §4.2, Spec 20, Spec 34 §12.2, design system | 30min | — |

**Estimación total:** 9-10 horas (1.5 días de trabajo).

---

## Maqueta

Mockups validados en sesión de Cowork 2026-05-26 (widgets HTML inline, regenerables desde el prompt en `70-Producto/prompts-product-design/spec-53-nav.md`).

| Mock | Qué validó |
|---|---|
| 3 variantes navegación mobile (hamburger único / nav scroll + drawer separado / hamburger + buscador visible) | Elección de V1 hamburger único |
| Drawer abierto con dos secciones (Secciones + Recorrer el corpus) | Anatomía del drawer y diferenciación tipográfica entre secciones |

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-26 | Creación de la spec en estado `lista`. Decisiones tomadas en sesión de Cowork con mockups HTML inline | Tercera spec hija de EPIC-04. Cerró Decisión Abierta #2 del epic. Reabrió formalmente Spec 02 §2. Spec 51 (home mobile) depende de esta y se diseñó en la misma sesión |
