---
spec: 34
titulo: Rediseño home dashboard r2 — mapa entero, reordenamiento y header angosto
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
revision: 2026-05-11 (r1) — strip de conceptos eliminado, logo variante B confirmado, tagline al lado del logo (no en footer)
afecta:
  - platform/frontend/src/app/page.tsx
  - platform/frontend/src/components/MapaHeatmapSection.tsx
  - platform/frontend/src/components/MapaTorresGarcia.tsx
  - platform/frontend/src/components/SiteHeader.tsx
  - platform/frontend/src/components/Sidebar.tsx (o nombre real del sidebar persistente)
  - platform/frontend/src/components/HomeContent.tsx (o nombre real)
  - platform/frontend/src/app/globals.css (tokens de header/sidebar)
depende_de: [11, 22, 30, 33]
resuelve: [BUG-003 mapa desbordante]
relaciona_con: [Spec 11 (rediseño home original), Spec 15 (lector recurrente), Spec 21 (logo r2)]
prioridad: alta — la home es la primera impresión del sitio y hoy presenta varios problemas de orden y proporción
---

# 34 · Rediseño home dashboard r2

## Resumen ejecutivo

El home actual (post-Spec 30 que cableó al corpus real, post-Spec 33 que sumó agendas al panel lateral del mapa) tiene problemas de **orden, proporción y jerarquía** que el rediseño original de Spec 11 no anticipó del todo. Esta spec propone una reorganización vertical del dashboard:

- **El mapa entra entero** en el primer viewport. Hoy se desborda (BUG-003).
- **El bloque editorial "Esta semana · [eje]" pasa debajo del mapa**, no arriba. El mapa toma protagonismo visual completo en el above-the-fold.
- **El heatmap ejes × semanas se mueve a zona profunda** (post-fold). Hoy compite con el mapa por atención sin aportar densidad informativa equivalente.
- **El carrusel de análisis recientes se vuelve más angosto** y **rota con más dinámica** (5s, dos cards visibles, fade + slide horizontal). Hoy ocupa demasiado espacio horizontal con rotación lenta.
- **El header global se compacta** de ~140px a ~70px. La tagline sale del header.
- **El strip de países** (línea de "argentina · colombia · ...") **se elimina** completamente. Los países ya están en sidebar y son clickeables en el mapa — sin redundancia.
- **El sidebar persistente pasa de 240px a 200px** expandido, tipografía más compacta.

Esta spec **no contradice** Spec 30 (la home sigue leyendo del corpus real mediante `getHomeData()`) ni Spec 33 (la sección Agenda dentro del panel lateral del mapa queda intacta). **Sí redefine** la estructura visual que Spec 11 había propuesto originalmente — Spec 11 queda como referencia histórica; Spec 34 es la fuente de verdad del layout actual del home.

**Login y suscriptores:** queda fuera de scope. Hoy el sitio es demo sin login. Cuando se decida implementar login + perfiles, será spec aparte (futura).

---

## 1. Estado actual

### 1.1 Lo que muestra la home hoy (post Specs 30, 33, 22)

```
┌────────────────────────────────────────────────────────────────────────┐
│ HEADER (~140px)                                                         │
│ Logo cuadrado | MAPA INESTABLE + tagline | DESPACHOS · ENSAYOS · ...  │
├────────────────────────────────────────────────────────────────────────┤
│ Strip de países: "argentina · colombia · ..."                          │
├────────────────────────────────────────────────────────────────────────┤
│ Sidebar 240px │ ESTA SEMANA · DESORIENTACIÓN EPISTEMOLÓGICA            │
│               │ 3 de 5 análisis lo activaron                            │
│               │                                                         │
│               │ [card análisis destacado — full width, fade slow 8s]   │
│               │                                                         │
│               │ ┌────────────────────────┐                              │
│               │ │  MAPA (recortado!)    │  ← BUG-003                    │
│               │ │  Sólo se ve la parte  │                              │
│               │ │  superior por scroll  │                              │
│               │ │  exceso del viewport  │                              │
│               │ └────────────────────────┘                              │
│               │                                                         │
│               │ EJES × SEMANAS (al lado del mapa, compite por atención)│
│               │ [grid 6 × 12]                                           │
└─────────┴──────────────────────────────────────────────────────────────┘
```

### 1.2 Problemas concretos

| Problema | Severidad | Origen |
|---|---|---|
| Mapa cortado en pantallas <1080px de alto | Alta | BUG-003 — aspectRatio width-driven sobre 1280×1380 desborda |
| "Esta semana" arriba del mapa empuja al mapa fuera del viewport | Alta | Composición vertical de Spec 11 §4.4-4.5 |
| Heatmap al lado del mapa duplica el pull visual | Media | Mismo |
| Carrusel ancho con rotación lenta queda estático visualmente | Media | Spec 11 §4.4 |
| Strip de países repite info que ya está en sidebar y mapa | Baja | Spec 18 §B3 r1 |
| Logo cuadrado en header de 96px con wordmark redundante | Media | Spec 18 §B4 r1 — se está corrigiendo en Spec 21 (logo r2) |
| Sidebar a 240px le come ancho al contenido en laptops 13" | Baja | Spec 11 §4.1 + Spec 15 §7.2 |

---

## 2. Relación con specs existentes

### 2.1 Spec 30 (Home derivada del corpus)

**Sigue válida.** Spec 30 dice "rediseño visual de la home queda como está" — esa frase queda obsoleta con esta spec. La capa de datos (`getHomeData()` en `lib/home.ts`, tipos `HomeData`, `HomeWeekStrip`, `HomeHeatmapCell`) se mantiene **sin cambios**. Spec 34 redefine solo cómo se renderizan esos datos.

Update concreto a Spec 30: en su sección "No incluido en esta spec" reemplazar "Spec 11 cubre eso" por "Spec 34 cubre el rediseño visual r2".

### 2.2 Spec 33 (Agendas en el panel lateral del mapa)

**Intacta.** El panel lateral del mapa (con sus 4 secciones: nombre, ejes crónicos, esta semana, agenda, CTA) no se modifica. Spec 34 solo cambia el tamaño y posición del mapa en la home, no su comportamiento al clickear un país.

### 2.3 BUG-003 (Mapa desbordante en home)

**Resuelto por esta spec.** La solución técnica de BUG-003 (acotar el bloque a `calc(100vh - 130px)` y derivar el ancho del mapa del alto disponible) se incorpora en §5.3. Al cerrar Spec 34 se cierra BUG-003.

### 2.4 Spec 11 (Rediseño home dashboard original)

**Queda como referencia histórica.** Spec 11 estableció el arquetipo A "Atlas editorial" y muchas decisiones que siguen vigentes (sidebar persistente, mapa céntrico, click → panel lateral). Lo que Spec 34 cambia respecto a Spec 11:

| Aspecto | Spec 11 | Spec 34 |
|---|---|---|
| Posición del bloque "Esta semana" | Arriba del mapa | Debajo del mapa |
| Tamaño del mapa | 60% del ancho del main | Ocupa el alto disponible (calc(100vh - 130px)), ancho derivado |
| Heatmap | Al lado del mapa | Zona profunda, post-fold |
| Carrusel | Full-width, auto-slide 8s | Más angosto (2 cards visibles), 5s, fade+slide |
| Header | Mantenido (sin tagline cambiando) | Compactado a ~70px, tagline al footer o `/acerca` |
| Strip de países | Línea editorial | Eliminado o reemplazado por conceptos invocados |
| Sidebar | 240px | 200px |

Marcar Spec 11 §4 con nota: "El layout descrito acá se actualizó en Spec 34 r2 (2026-05-11). Spec 11 queda como contexto del arquetipo A; Spec 34 es la fuente de verdad del layout actual."

### 2.5 Spec 21 (Logo r2)

**Coherente.** El logo horizontal del header (variante B o D según se decida, ver mockup en `70-Producto/design-system/logo/mockup-horizontal-comparativo.png`) encaja con el header compactado a ~70px. La producción del SVG horizontal definitivo sigue en Fase B de Spec 21 (fuera de scope de Claude).

---

## 3. Estructura propuesta

### 3.1 Layout desktop ≥1240px

```
┌──────────────────────────────────────────────────────────────────────────┐
│ HEADER ANGOSTO (~70px)                                                    │
│ [silueta+escalador] MAPA INESTABLE · cartografía política del sur    nav  │
├──────────────────────────────────────────────────────────────────────────┤
│         │ ┌──────────────────────────────────────────────────────────┐   │
│ sidebar │ │                                                          │   │
│ 200px   │ │   MAPA TORRES GARCÍA (entra entero)                      │   │
│         │ │   alto: calc(100vh - 130px)                              │   │
│         │ │   ancho: aspectRatio 1280/1380 derivado del alto         │   │
│         │ │                                                          │   │
│         │ │   click sobre país → panel lateral (Spec 33)             │   │
│         │ │                                                          │   │
│         │ │                              │ panel preview país        │   │
│         │ │                              │ (slide-in si hay click)   │   │
│         │ │                              │                           │   │
│         │ │                              │ Nombre país               │   │
│         │ │                              │ EJES CRÓNICOS             │   │
│         │ │                              │ ESTA SEMANA               │   │
│         │ │                              │ AGENDA (Spec 33)          │   │
│         │ │                              │ [VER FICHA →]             │   │
│         │ └──────────────────────────────────────────────────────────┘   │
│         │                                                                 │
│         │ ──── pliegue del viewport ──────────────────────────────────── │
│         │                                                                 │
│         │ SEMANA 19 · 2026                                                │
│         │ ESTA SEMANA · DESORIENTACIÓN EPISTEMOLÓGICA                    │
│         │ 3 de 5 análisis lo activaron                                    │
│         │                                                                 │
│         │ CARRUSEL DE ANÁLISIS RECIENTES (angosto, 2 cards, auto 5s)      │
│         │ ┌──────────────────────┐  ┌──────────────────────┐  ← swipe   │
│         │ │ card 320×220         │  │ card 320×220         │             │
│         │ └──────────────────────┘  └──────────────────────┘             │
│         │ • • • •                                                         │
│         │                                                                 │
│         │ ════════════════════════════════════════════════════════════   │
│         │                                                                 │
│         │ ÚLTIMO DESPACHO                                                 │
│         │ [card grande con resumen + CTA "leer despacho →"]              │
│         │                                                                 │
│         │ ════════════════════════════════════════════════════════════   │
│         │                                                                 │
│         │ EJES × SEMANAS (zona profunda)                                  │
│         │ [grid 6 × 12]                                                   │
│         │ click en celda → /analisis?eje=X&semana=N                       │
│         │                                                                 │
│         │ ════════════════════════════════════════════════════════════   │
│         │                                                                 │
│         │ FOOTER                                                          │
│         │ "Cartografía política del sur" · hipótesis · ejes · marco       │
└─────────┴──────────────────────────────────────────────────────────────────┘
```

### 3.2 Orden vertical de bloques

| Zona | Bloque | Origen del contenido |
|---|---|---|
| **Above the fold** | Header angosto | Logo silueta+escalador + wordmark + tagline + nav |
|  | **Mapa Torres García entero** | SVG vectorizado (Spec 22) + cuentas por país (Spec 30) |
| **Post-fold superior** | Bloque "Esta semana" | `getHomeData().thisWeek` (Spec 30) |
|  | Carrusel angosto de análisis | `getHomeData().cards` (Spec 30) |
| **Post-fold medio** | Card último despacho | `getHomeData().latestDispatch` (Spec 30 + 31) |
| **Zona profunda** | Heatmap ejes × semanas | `getHomeData().heatmap` (Spec 30) |
| **Footer** | Hipótesis + ejes + marco + créditos | Estático |

---

## 4. Header angosto

### 4.1 Composición

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [silueta+escalador] MAPA INESTABLE · cartografía política del sur    nav │
└──────────────────────────────────────────────────────────────────────────┘
```

- **Alto:** 70px (antes 140).
- **Logo:** **Variante B confirmada** — silueta+escalador recortada (`mockup-silueta-v4.png` como referencia mientras Spec 21 Fase B produce el SVG horizontal dedicado). Altura 48px, ancho derivado del aspect ratio del crop (~25px de ancho aprox).
- **Wordmark:** "MAPA INESTABLE" al lado del logo, en Alfa Slab One ~22px, color `--mi-ink`, uppercase, letter-spacing -0.02em (un poco apretado para que entre cómodo).
- **Separador:** ` · ` en mono color `--mi-ink-mute`, ~13px, padding lateral 12px.
- **Tagline:** "cartografía política del sur" en la **misma línea horizontal que el wordmark, al lado del separador**. Mono ~11-12px lowercase, color `--mi-ink-soft`, letter-spacing 0.04em.
- **Nav (`DESPACHOS · ENSAYOS · MAPA · ACERCA`)** alineado a la derecha, mono uppercase 13px color `--mi-ink`. Mantiene su forma actual.
- **Padding:** 16px arriba y abajo, 32px laterales.

### 4.1.1 Layout inline en una sola línea

Todo en línea horizontal (logo + wordmark + separador + tagline + nav) en una sola fila de 70px alto. El conjunto `[logo] [wordmark] · [tagline]` queda alineado a la izquierda; el nav alineado a la derecha; espacio fluido en el medio.

```html
<header>
  <div class="brand">
    <img src="/logo-horizontal.svg" height="48" alt="" />
    <h1 class="wordmark">MAPA INESTABLE</h1>
    <span class="separator">·</span>
    <span class="tagline">cartografía política del sur</span>
  </div>
  <nav>...</nav>
</header>
```

### 4.1.2 Fallback responsive

- **Desktop ≥1024px**: todo inline como en §4.1.
- **Desktop 768-1023px**: oculta la tagline (`display: none`); solo logo + wordmark + nav.
- **Mobile ≤640px**: logo + wordmark, nav colapsa a hamburger (§12).

### 4.2 Border y sombra

- Border-bottom thick `--mi-ink` 2px (separador visual claro).
- Sin sombra dura (el header es ancla fija, no card flotante).

### 4.3 Sticky behavior

- Permanece sticky al scrollear (top: 0).
- No se condensa más al hacer scroll — ya es compacto.

### 4.4 Cambio respecto al estado actual

Hoy el componente `SiteHeader.tsx` renderiza:
- Logo horizontal de 96px (size="md") + wordmark + tagline.
- Línea de "currentWeek + países cubiertos" debajo del header principal.
- Strip de países separado.

Cambios de Spec 34:
1. Reducir el logo a 48px (size="sm" o nuevo size="xs").
2. Eliminar la tagline "cartografía política del sur" del header.
3. Eliminar la línea de currentWeek del header (la info "sem 19" puede aparecer en otro bloque más editorial, ver §5.2 Strip de conceptos).
4. Eliminar el strip de países (§5.2).

---

## 5. Strip eliminado (decisión r1)

**Decisión confirmada en sesión 2026-05-11: Opción A — eliminar el strip completamente.**

El strip de países era redundante (los países ya viven en sidebar y son clickeables en el mapa). Se descartó también la alternativa de reemplazar por conceptos invocados — la home queda más limpia sin esa fila editorial extra.

**Implicancia visual:** el mapa queda directamente debajo del header, sin separador horizontal intermedio. La transición visual es: `header 70px → mapa entero`. Más respiración, menos elementos compitiendo.

**Implicancia técnica:** eliminar el componente que renderiza el strip de países en `SiteHeader.tsx` y cualquier referencia a `weeklyCountries` en la composición del header.

---

## 6. Mapa entero (resuelve BUG-003)

### 6.1 Modelo de sizing

Cambio de paradigma: el mapa pasa de **width-driven** a **height-driven**.

**Antes (causa de BUG-003):**
```tsx
// MapaTorresGarcia.tsx
<div style={{ width: "100%", aspectRatio: "1280/1380" }}>
  {/* En pantalla 1440px ancho → mapa de 1208px alto → desborda viewport */}
</div>
```

**Después (solución BUG-003):**
```tsx
// MapaHeatmapSection.tsx (contenedor padre)
<div style={{
  maxHeight: "calc(100vh - 130px)",
  display: "flex",
}}>
  <div style={{
    flexShrink: 0,
    aspectRatio: "1280/1380",  // ← el ancho deriva del alto
    height: "100%",
  }}>
    <MapaTorresGarcia variant="home" />
  </div>
  <div style={{
    flex: 1,
    minWidth: 220,
    maxWidth: 360,
  }}>
    {/* Panel preview de país, slide-in al hover/click */}
  </div>
</div>
```

```tsx
// MapaTorresGarcia.tsx (componente interno)
<div style={{
  width: "100%",
  height: "100%",
  // SIN aspectRatio aquí — el contenedor padre lo gestiona
}}>
  <svg viewBox="0 0 1280 1380" preserveAspectRatio="xMidYMid meet">
    {/* Paths del mapa */}
  </svg>
</div>
```

### 6.2 Constante CSS

Agregar a `globals.css`:

```css
:root {
  /* Spec 34 — alto máximo del bloque mapa en home */
  --mi-mapa-max-h: calc(100vh - 130px);
}
```

`130px` = header 70px + strip de conceptos 32px + padding/borders ~28px.

Puede ajustarse en una sesión de visual check.

### 6.3 Comportamiento al cambiar de viewport

| Viewport | Alto disponible | Ancho del mapa | Visible |
|---|---|---|---|
| 1440 × 900 | 770px | ~715px (770 × 1280/1380) | Mapa + panel ≤ 1075px de ancho, holgado |
| 1920 × 1080 | 950px | ~882px | Mapa + panel ≤ 1242px, panel se ensancha a maxWidth |
| 1280 × 800 | 670px | ~622px | Mapa + panel ≈ 842px, panel a minWidth |
| 1024 × 768 | 638px | ~592px | Mapa + panel ≈ 812px, panel a minWidth — apretado pero entra |

### 6.4 Casos de borde

- **Viewport altísimo (>1400px alto)**: el mapa puede crecer mucho. Mitigar con `max-height: 1400px` como cap absoluto opcional. Decisión pendiente.
- **Viewport bajísimo (<600px alto)**: la fórmula daría alto negativo o muy chico. Establecer `min-height: 480px` y aceptar que en esos casos el mapa fuerza scroll vertical.
- **Mobile**: el bloque entero pasa a layout vertical, ver §10.

---

## 7. Bloque "Esta semana · [eje]" reubicado

### 7.1 Nuevo lugar

Justo debajo del mapa, antes del carrusel.

### 7.2 Composición

```
SEMANA 19 · 2026

ESTA SEMANA · DESORIENTACIÓN EPISTEMOLÓGICA
3 de 5 análisis lo activaron
```

- **"SEMANA 19 · 2026"** en mono uppercase 13px color `--mi-ink-mute`, primera línea.
- **"ESTA SEMANA · [eje]"** en Alfa Slab One 36px, donde "[eje]" toma el color del eje correspondiente (`var(--mi-axis-{slug})`).
- **"3 de 5 análisis lo activaron"** en Lora italic 17px color `--mi-ink-soft`.
- Padding superior 48px (separación del mapa), inferior 24px (antes del carrusel).

### 7.3 Estado vacío

Si la semana actual no tiene publicaciones (`getHomeData().thisWeek === null` por Spec 30), mostrar:

```
SEMANA 19 · 2026

ESTA SEMANA SE ESTÁ COCINANDO
La próxima entrega cierra el viernes.
```

Mono + Fraunces. Sin inventar un eje cuando no lo hay.

---

## 8. Carrusel angosto + rotación dinámica

### 8.1 Especificación

| Atributo | Antes | Después (Spec 34) |
|---|---|---|
| Ancho de cada card | Full-width del main | 320px |
| Cards visibles simultáneamente | 1 | 2 (desktop) / 1 (mobile) |
| Auto-slide | 8 segundos | 5 segundos |
| Transición | Fade puro 400ms | Fade + horizontal slide 200ms |
| Pausa en hover | Sí | Sí (mantenido) |
| Pausa en `prefers-reduced-motion` | Sí | Sí (mantenido) |
| Indicador | Dots | Dots + swipe en mobile |

### 8.2 Anatomía de la card

Mismo componente `<AnalysisCard>` que Spec 11/16/19 ya define. Esta spec solo cambia el contenedor (carrusel) y sus dimensiones.

```
┌──────────────────────────────────┐
│  [silueta país]  COLOMBIA        │  ← 320×220
│  ─────────────────────────────   │
│  DESORIENTACIÓN EPISTEMOLÓGICA   │
│                                  │
│  La sospecha antes del voto      │  ← Fraunces 22px
│                                  │
│  A 103 días del fin del mandato, │  ← Lora 14px italic
│  Petro pone en duda la transp... │
│                                  │
│  hace 3 días · sem 19            │  ← mono 12px
└──────────────────────────────────┘
```

### 8.3 Implementación técnica

Usar una librería ligera de carrusel o implementación nativa con CSS scroll-snap:

```css
.carousel {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 320px;
  gap: 24px;
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  scrollbar-width: none;
}
.carousel > * {
  scroll-snap-align: start;
}
```

Auto-slide en JS:
```ts
useEffect(() => {
  if (prefersReducedMotion) return;
  const interval = setInterval(() => {
    setActiveIndex(prev => (prev + 1) % cards.length);
  }, 5000);
  return () => clearInterval(interval);
}, [cards.length, prefersReducedMotion]);
```

### 8.4 Indicador de progreso

Dots debajo del carrusel:
- Dot apagado: 6px, color `--mi-ink-mute`, opacity 0.4.
- Dot activo: 8px, color `--mi-brand-gold`, sin opacity.
- Click sobre un dot → salta a esa card.

---

## 9. Heatmap movido a zona profunda

### 9.1 Nuevo lugar

Después del bloque del último despacho, antes del footer.

### 9.2 Justificación

Tomás identificó que el heatmap **no es muy productivo** en el above-the-fold. Razones:
- Compite por atención con el mapa que es la pieza protagonista.
- Su valor informativo (qué eje en qué semana) es de exploración profunda, no de primer scan.
- Para el lector recurrente, el carrusel y el último despacho son más operativos.

### 9.3 Composición

Sin cambios estructurales respecto a Spec 11/30:
- Grid 6 ejes × 12 semanas más recientes.
- Color de celda intensifica según count de publicaciones de ese eje en esa semana.
- Click en celda → `/analisis?eje={slug}&semana={n}&ano={y}`.
- Header del grid: "EJES × SEMANAS" mono uppercase 13px.

Sí cambia:
- Tamaño total más chico (el heatmap pasa de competir con el mapa a ser un bloque editorial más). Width ~70% del main content (en lugar de ~40% al lado del mapa).
- Padding superior 96px (separación clara del bloque anterior).

---

## 10. Sidebar más compacto

### 10.1 Especificación

| Atributo | Antes | Después |
|---|---|---|
| Ancho expandido | 240px | 200px |
| Ancho colapsado | 48px | 48px (sin cambios) |
| Tipografía de items | 14px Lora | 13px Lora |
| Line-height | 1.6 | 1.45 |
| Padding interno | 24px | 20px |

### 10.2 Secciones

Sin cambios respecto a Spec 20:
- PAÍSES (10)
- EJES (6)
- BUSCADOR
- CONCEPTOS (N)
- AUTORES (N)

### 10.3 Default en home

Expanded (consistente con Spec 15 §7.2 r1 — el home es zona de exploración).

---

## 11. Implementación técnica

### 11.1 Archivos a tocar

| Archivo | Cambio |
|---|---|
| `app/page.tsx` | Reordenar bloques: header → mapa+panel → "Esta semana" → carrusel → despacho → heatmap → footer |
| `app/globals.css` | Agregar `--mi-mapa-max-h`, ajustar tokens de header height |
| `components/SiteHeader.tsx` | Reducir alto a 70px, eliminar línea de currentWeek, eliminar strip de países, logo a variante B (silueta+escalador 48px), wordmark inline + separador `·` + tagline inline + nav a la derecha |
| `components/MapaHeatmapSection.tsx` | Aplicar solución de BUG-003 (`maxHeight: "calc(100vh - 130px)"`, aspectRatio en el contenedor del mapa, `flex: 1` en el panel) |
| `components/MapaTorresGarcia.tsx` | Quitar `aspectRatio` del wrapper (delegado al padre) |
| `components/Sidebar.tsx` (o nombre real) | Reducir ancho a 200px, tipografía y padding compactos |
| `components/Carousel.tsx` (o nombre real) | Implementar grid de 2 cards visibles, auto-slide 5s, fade+slide, dots |
| `components/HeatmapEjesXSemanas.tsx` | Reducir tamaño (~70% del main) |

### 11.2 Componentes nuevos

Ninguno. Spec 34 reordena y compacta lo existente, sin agregar componentes.

### 11.3 Componentes que se eliminan

- El strip de países en `SiteHeader.tsx` — eliminado.
- La línea de "currentWeek + países cubiertos" del header — eliminada.
- El prop `weeklyCountries` del componente `SiteHeader` puede quedar deprecado.

### 11.4 Variables CSS nuevas

```css
:root {
  --mi-header-h:            70px;
  --mi-mapa-max-h:          calc(100vh - 100px);  /* sin strip intermedio: solo header + padding */
  --mi-sidebar-w:           200px;  /* antes 240 */
  --mi-sidebar-w-collapsed: 48px;
}
```

**Nota:** `--mi-mapa-max-h` queda en `calc(100vh - 100px)` (no `130px` como originalmente proponía BUG-003), porque al eliminar el strip de países/conceptos el header total es más bajo. Ajustar visualmente al implementar.

---

## 12. Mobile (≤640px)

### 12.1 Layout vertical

```
┌─────────────────────────────────┐
│ HEADER 56px                     │
│ [*] MAPA INESTABLE      ☰       │  ← hamburger del sidebar
├─────────────────────────────────┤
│ STRIP CONCEPTOS (opcional)      │
├─────────────────────────────────┤
│ MAPA full-width                  │
│ aspect-ratio 1280/1380          │
│ height: auto                     │
│ (vuelve al modelo width-driven   │
│  porque vertical es OK en mobile)│
├─────────────────────────────────┤
│ Panel preview país               │
│ (al pie del mapa, no a un lado) │
│ height: 280px                    │
├─────────────────────────────────┤
│ SEMANA 19 · ESTA SEMANA...      │
├─────────────────────────────────┤
│ Carrusel 1 card visible          │
│ swipe horizontal                 │
├─────────────────────────────────┤
│ ÚLTIMO DESPACHO                  │
├─────────────────────────────────┤
│ HEATMAP (scroll horizontal)      │
├─────────────────────────────────┤
│ FOOTER                           │
└─────────────────────────────────┘
```

### 12.2 Cambios específicos

- **Header**: 56px alto, logo 32px, nav colapsa a hamburger (drawer con sidebar).
- **Strip conceptos**: si se aplica, scroll horizontal touch con los chips.
- **Mapa**: vuelve al modelo width-driven (`aspect-ratio: 1280/1380; height: auto`). En mobile el viewport vertical es OK con scroll.
- **Panel preview**: aparece debajo del mapa, no al costado.
- **Carrusel**: 1 card visible, swipe horizontal, dots debajo.
- **Heatmap**: scroll horizontal interno, no responsive (no se reescala — la matriz se rompe si se squeeza).

---

## 13. Decisiones tomadas (en sesión 2026-05-11)

| # | Tema | Decisión |
|---|---|---|
| 1 | Mapa entero en above-the-fold | Sí. Height-driven con `calc(100vh - 100px)` (resuelve BUG-003) |
| 2 | Posición de "Esta semana" | Debajo del mapa, no arriba |
| 3 | Heatmap | Zona profunda, post-fold, ancho reducido a ~70% |
| 4 | Carrusel | 320px de ancho, 2 cards visibles, auto 5s, fade+slide |
| 5 | Header | Compactado a 70px |
| 6 | **Strip de países / conceptos** | **Eliminado** (Opción A). La home queda más limpia. |
| 7 | **Variante del logo** | **B confirmada** — silueta+escalador 48px (no la D del asterisco). Requiere SVG horizontal dedicado de Spec 21 Fase B |
| 8 | **Tagline "cartografía política del sur"** | **Al lado del logo, en línea horizontal con wordmark, separada por `·`**. NO en footer, NO debajo del wordmark |
| 9 | Sidebar | 200px expandido (-40px), tipografía 13px |
| 10 | Login | Fuera de scope, futura spec |

## 14. Decisiones pendientes

1. **Cap absoluto del mapa en viewports altísimos:** `max-height: 1400px` u otra cifra. Decisión post-implementación viendo cómo se comporta en pantallas grandes.

2. **Comportamiento del panel lateral del país cuando está abierto en viewports angostos:** ¿toma todo el ancho del mapa (modal) o sigue siendo lateral chico? Spec 22 §12.1 lo definía como drawer modal en 960-1239px. Confirmar.

3. **Si se agrega un bloque "borradores diarios visibles" en algún lugar del home post-fold.** Spec 32 (Vista pública borradores diarios) lo plantea. Esta spec no lo incluye explícitamente — si conviene, va en una pasada posterior.

4. **Comportamiento del header en mobile** cuando la tagline ya está oculta (768-1023px): ¿qué tamaño tiene el wordmark? Definir al hacer el visual check responsive.

---

## 15. Criterios de aceptación

1. En desktop 1440×900, el mapa Torres García se ve **entero** sin necesidad de scroll vertical.
2. El bloque "Esta semana · [eje]" aparece debajo del mapa, no arriba.
3. El heatmap se ve solo después de scrollear (zona profunda).
4. El carrusel tiene 2 cards visibles simultáneamente en desktop, auto-slide cada 5s, pausa en hover.
5. El header tiene ~70px de alto. No contiene tagline ni strip de países.
6. El sidebar mide 200px expandido.
7. BUG-003 cerrado: el mapa nunca desborda el viewport en ninguna resolución soportada.
8. Specs 30 (datos) y 33 (panel agendas) siguen funcionando sin regresión.
9. Mobile (≤640px) funciona con layout vertical, hamburger, swipe en carrusel.
10. Type-check pasa. `next build` completa sin errores.
11. Tests de accesibilidad (a11y) pasan: keyboard navigation entre header → sidebar → mapa → carrusel → heatmap → footer.

---

## 16. Implementación sugerida

### Fase A — Layout puro (1-2 días)

1. Reordenar `app/page.tsx` con los bloques en el orden de §3.
2. Aplicar fix de BUG-003 en `MapaHeatmapSection.tsx` y `MapaTorresGarcia.tsx`.
3. Reducir el header en `SiteHeader.tsx`, eliminar tagline y strip de países.
4. Reducir sidebar a 200px.

### Fase B — Carrusel angosto + heatmap profundo (1 día)

1. Reescribir el carrusel con 2 cards visibles, auto 5s, fade+slide.
2. Mover el heatmap a zona profunda con su tamaño reducido.

### Fase C — Strip de conceptos (½ día, opcional según decisión)

1. Si Opción B: extender `getHomeData()` con `conceptsThisWeek`.
2. Crear `StripConceptos.tsx`.
3. Renderizar entre header y mapa.

### Fase D — Mobile (½ día)

1. Layout vertical, hamburger del sidebar, swipe del carrusel.
2. Panel preview del país debajo del mapa.
3. Visual check en 360px, 640px, 768px.

### Fase E — Cierre (½ día)

1. Visual check completo en 1280, 1440, 1920 anchos.
2. Validar criterios de aceptación.
3. Marcar BUG-003 como resuelto en su archivo.
4. Actualizar Spec 11 con nota "ver Spec 34".

**Tiempo total estimado**: 3-5 días.

---

## 17. Cierre

Esta spec **recompone la jerarquía visual del home** alrededor del mapa Torres García como ancla protagonista. El resto de bloques (esta semana, carrusel, despacho, heatmap) se ordenan en una progresión de **operatividad descendente**: lo más relevante para el lector recurrente arriba (qué hay nuevo, dónde clickear), lo más reflexivo abajo (patrones acumulados en el heatmap, contexto del marco en el footer).

El header pasa de presentar el proyecto (tagline, strip de países) a ser solo identidad mínima + navegación. La tagline editorial se mueve a lugares donde tiene sentido editorial (`/acerca`, footer). El strip de países, si se convierte en strip de conceptos, gana valor informativo nuevo en cada visita.

Login y suscriptores quedan para la fase post-demo. Esta spec asume el modelo actual del proyecto: vault como fuente de verdad, sin autenticación, retención sin login (Spec 15).
