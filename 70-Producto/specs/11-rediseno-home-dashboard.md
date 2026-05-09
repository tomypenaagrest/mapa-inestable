# Spec 11 — Rediseño de home como dashboard

**Estado:** decidido (arquetipo A revisado), implementación pendiente
**Depende de:** Spec 01 (arquitectura), Spec 04 (páginas de eje), Spec 05 (buscador), Spec 07 (conceptos)
**Habilita:** Spec 10 (integración Latinobarómetro como capa B)
**Prioridad:** alta — la home es la cara del proyecto, su rediseño define la sensación del sitio

---

## 1. Por qué rediseñar la home

La home actual (`mapa-inestable-v1.vercel.app`) cumple su función editorial: pieza featured + 4 análisis de la semana + ejes y países en footer. Pero queda corta en tres frentes:

1. **El mapa invertido**, que la Spec 01 declara como **interfaz signature del proyecto**, no aparece en home — vive solo en `/mapa`. La home debería tenerlo céntrico para cumplir la identidad declarada.
2. **No hay punto de entrada exploratoria**: el lector nuevo ve 5 piezas, pero no tiene cómo recorrer el corpus por país, eje o concepto. La navegación está dispersa entre header genérico y footer textual.
3. **No hay lectura del estado de la semana**: ¿cuál es el eje más activo? ¿qué países se movieron? ¿cuál es la conexión entre las 4-5 piezas? La home es lista, no narrativa.

Esta spec define el rediseño que resuelve los tres frentes. Surge de una conversación de mayo 2026 con varias decisiones tomadas en chat — esta spec las registra.

---

## 2. Decisión arquitectónica: arquetipo A revisado

Se evaluaron tres arquetipos en chat:

| Arquetipo | Característica central | Decisión |
|-----------|------------------------|----------|
| A — Atlas editorial | Mapa céntrico + carrusel + heatmap | **ELEGIDO** |
| B — Atlas + indicadores | Suma capa cuantitativa externa (capa 2 Spec 09) | Postergado a post-v1 |
| C — Editorial denso sin mapa | Tres columnas, sin mapa en home | Descartado |

Razones de la decisión:

- **A** respeta la etapa 0 de Spec 09 (no integrar indicadores externos hasta v1 estable).
- **A** hace al mapa lo que Spec 01 dice que debe ser: la interfaz signature. C lo degradaba a página secundaria.
- **A** propone una novedad real: la **lectura del eje de la semana**, que es genuinamente analítica y solo este proyecto puede producirla.
- B se queda como evolución natural cuando se ejecute la integración del Latinobarómetro (Spec 10).

---

## 3. Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  ◯  MAPA INESTABLE              Despachos · Ensayos · Mapa · Acerca │
├────────────┬─────────────────────────────────────────────────────────┤
│            │                                                         │
│   PAÍSES   │   ESTA SEMANA · DESORIENTACIÓN EPISTEMOLÓGICA          │
│   ▸ 10     │   3 de 4 análisis la activaron · Sem 19                │
│            │                                                         │
│   EJES     │   ┌─ CARRUSEL AUTO-SLIDE ──────────────────────────┐   │
│   ▸ 6      │   │ ╱╲                                              │   │
│            │   │ ╲ ╲   La sospecha antes del voto                │   │
│   BUSCADOR │   │  ╲ ╲   Colombia · Desorientación · 27 abr      │   │
│   🔍       │   │   ╲╱   A 103 días del fin del mandato…          │   │
│            │   │  silueta CO                                      │   │
│   CONCEPTOS│   │  invertida                                       │   │
│   ▸ 9      │   │        Leer →             ●  ○  ○  ○            │   │
│            │   └──────────────────────────────────────────────────┘   │
│            │                                                         │
│            │   ┌──────────────────────────┬──────────────────────┐  │
│            │   │                          │                      │  │
│            │   │   MAPA INVERTIDO         │   HEATMAP EJES × SEM │  │
│            │   │   click país → panel     │   6 filas × 12 cols  │  │
│            │   │                          │   intensidad por     │  │
│            │   │                          │   cantidad de aná-   │  │
│            │   │                          │   lisis              │  │
│            │   │                          │                      │  │
│            │   └──────────────────────────┴──────────────────────┘  │
│            │                                                         │
│            │   DESPACHO 47 · La sospecha como arma                  │
│            │   → leer despacho   → suscribirse                       │
│            │                                                         │
└────────────┴─────────────────────────────────────────────────────────┘
```

---

## 4. Componentes

### 4.1. Header

**Sin cambios estructurales** respecto al actual. Mantiene logo + tagline a la izquierda y nav de **secciones del producto** a la derecha: Despachos · Ensayos · Mapa · Acerca.

Decisión editorial: el header maneja **qué tipo de pieza** estás leyendo, el sidebar maneja **por dónde recorrés el corpus**. Diferencia funcional clara.

Tagline: queda **"Cartografía política del sur"** (ver Spec 08 sección 3.2 — quitar "· Año II" del subtítulo del header).

### 4.2. Sidebar persistente (NUEVO)

Sidebar izquierdo de **240px en desktop**, **drawer colapsable en mobile** (breakpoint 640px de Spec 02).

Cuatro módulos verticales, cada uno expandible inline al click:

| Módulo | Comportamiento |
|--------|----------------|
| **Países** ▸ 10 | Despliega los 10 con punto pequeño al lado de los que tienen análisis recientes. Click sobre uno → `/pais/[slug]` |
| **Ejes** ▸ 6 | Despliega los 6 con conteo de análisis activos esta semana. Click → `/ejes/[slug]` (Spec 04) |
| **Buscador** 🔍 | Click expande input inline o abre modal. Atajo de teclado `/`. Conecta con `/analisis?q=` (Spec 05) |
| **Conceptos** ▸ N | Despliega los conceptos del vault con `publicar: true` (Spec 07). Click → `/concepto/[slug]` |

El conteo al lado del título se actualiza desde la base de datos.

**Estados visuales:**
- Cerrado (default): título + ícono ▸ + conteo.
- Expandido: ▸ rota a ▾, lista de items debajo con padding chico.
- Hover sobre item: subraya con `--mi-accent-gold`.
- Item activo (cuando estás en esa página): borde izquierdo grueso `--mi-border-bold`.

### 4.3. Bloque "Esta semana" (NUEVO)

Encabezado con dos líneas:

- **Línea 1**: `ESTA SEMANA · [EJE MÁS ACTIVO]` en mono uppercase + Alfa Slab One.
- **Línea 2**: `[N] de [M] análisis la activaron · Sem [N]` en mono lg.

El "eje más activo de la semana" se calcula automáticamente: agrega `analysis_axes` con `is_primary=true` para `week=current`, agrupa por eje, ordena desc. Si hay empate, desempata por orden de aparición.

**Decisión pendiente:** ¿el eje se calcula automático o lo curás vos editorialmente? (sección 12, decisión 1).

### 4.4. Carrusel auto-slide (NUEVO)

Un slide por análisis publicado en la semana actual (típicamente 4-5).

**Cada slide contiene:**
- Silueta del país a la izquierda (ver sección 4.4.1).
- Título del análisis en Alfa Slab One 4xl.
- Línea de meta: `[País] · [Eje primario] · [Fecha]` en mono uppercase.
- Lede del análisis en Fraunces lg.
- CTA "Leer →" linkeado al análisis.

**Comportamiento:**
- Auto-rotación cada **8 segundos**.
- **Pausa al hover** sobre el carrusel.
- Dots de navegación visibles abajo a la derecha (uno por slide, el activo en `--mi-accent-gold`).
- Click en un dot avanza a ese slide y resetea el timer.
- Transición tipo **fade** (cross-fade entre slides), no slide horizontal. Más calmo, coherente con Grabado.
- Accesibilidad: `prefers-reduced-motion` desactiva auto-rotación; el lector navega con dots o flechas.

### 4.4.1. Silueta del país (NUEVO)

**Decisión confirmada (mayo 2026):** se usa **silueta del país** en lugar de bandera.

Razones:
- Coherencia con la estética Torres García y el marco conceptual del proyecto.
- Las banderas son símbolos del Estado-nación; el proyecto trabaja sobre la erosión del contenedor estatal (ver ficha [[Trampa territorial]] en `35-Conceptos-clave/`). Reproducir banderas oficiales contradice la voz.
- Las banderas latinoamericanas son visualmente confusas (AR/UY franjas similares; varias paletas comunes); las siluetas son distintivas.

**Implementación:**
- SVG por país, paths simplificados desde Natural Earth.
- Orientación: invertida (sur arriba), consistente con el mapa principal.
- Color: `--mi-ink` sólido sobre fondo cream, sin relleno interno.
- Tamaño en carrusel: ~100px de alto.
- Reutilizable en otras vistas (página de país, archivo, etc.).

Mismo set de SVGs para los 10 países sirve para: carrusel de home, breadcrumbs, mini-maps en página de país (Spec 01.5.4), tooltips del mapa principal.

### 4.5. Mapa invertido céntrico

Hereda implementación de Spec 01.5.5 (D3 + GeoJSON Natural Earth simplificado, proyección invertida).

**Diferencia respecto al `/mapa` full-screen:**
- En home, el mapa ocupa ~60% del ancho de la zona principal (no full-canvas).
- Click en país → abre **panel lateral derecho** (no modal) con preview del último análisis del país y link a `/pais/[slug]`.
- No tiene filtros de eje/semana en home (eso vive en `/mapa`).
- El estado por defecto: muestra los países activos esta semana coloreados por su eje primario; los inactivos en `--mi-bg-paper` con borde tenue.

### 4.6. Heatmap ejes × semana (NUEVO)

Matriz de 6 filas × 12 columnas (los 6 ejes × las últimas 12 semanas).

**Cada celda:**
- Color: gradient de `--mi-bg-paper` (0 análisis) a `--mi-bg` terracota saturado (≥3 análisis).
- Hover: tooltip con `[Eje] · Semana [N] · [count] análisis`.
- Click: navega a `/analisis?eje=[slug]&semana=[N]&año=[YYYY]` (Spec 05).

**Datos:**
- Solo cuenta `is_primary=true`. Eje secundario no suma.
- Solo análisis publicados (no drafts).

**Por qué 12 semanas:** un trimestre. Es suficiente para ver patrones (qué eje sube, cuál baja) sin saturar visualmente. La opción de 52 semanas se descarta para home; vive en `/analisis` con filtros (Spec 05).

### 4.7. Bloque despacho

Tarjeta única al pie con el último despacho publicado: número, título, lede del despacho, dos CTA (`leer despacho`, `suscribirse`).

Reusa el componente `dispatch-card` que ya existe en home actual.

---

## 5. Datos requeridos

Toda la home se renderiza con los datos del schema actual (Spec 01.8). No se necesitan tablas nuevas.

Queries clave:

```sql
-- Análisis de la semana actual
SELECT * FROM analyses
WHERE week = current_week AND year = current_year
  AND status = 'published'
ORDER BY published_at DESC;

-- Eje más activo de la semana
SELECT axis_slug, COUNT(*) as cnt
FROM analysis_axes
JOIN analyses ON analysis_axes.analysis_id = analyses.id
WHERE analyses.week = current_week
  AND analyses.year = current_year
  AND analysis_axes.is_primary = true
  AND analyses.status = 'published'
GROUP BY axis_slug
ORDER BY cnt DESC
LIMIT 1;

-- Heatmap eje × semana (últimas 12 semanas)
SELECT axis_slug, week, year, COUNT(*) as cnt
FROM analysis_axes
JOIN analyses ON analysis_axes.analysis_id = analyses.id
WHERE analysis_axes.is_primary = true
  AND analyses.status = 'published'
  AND (year, week) IN (...últimas 12 combinaciones...)
GROUP BY axis_slug, week, year;

-- Mapa: países activos de la semana
SELECT DISTINCT country_slug, axis_primary
FROM analyses
WHERE week = current_week AND year = current_year
  AND status = 'published';

-- Conteos del sidebar
SELECT COUNT(*) FROM countries;  -- 10
SELECT COUNT(*) FROM axes;       -- 6
SELECT COUNT(*) FROM concepts WHERE published = true;  -- N
```

Cachear todo el bundle de la home por 60 segundos. La home cambia cuando se publica un análisis nuevo (cache invalidation manual desde admin).

---

## 6. Aplicación Grabado

- **Fondo general:** `--mi-bg-paper` (cream).
- **Sidebar:** `border-right: var(--mi-border-bold)`. Fondo cream. Mono uppercase para títulos de módulo.
- **Header:** sin cambios respecto al actual.
- **Bloque "Esta semana":** Alfa Slab One para nombre del eje, mono uppercase para meta.
- **Carrusel:** card grande con `--mi-shadow-hero`. Borde grueso `--mi-border-bold`. Silueta a la izquierda en `--mi-ink` sólido.
- **Mapa céntrico:** SVG sobre `--mi-bg-paper`. Países activos coloreados con paleta semántica del eje (ver design system). Bordes en `--mi-ink`.
- **Heatmap:** grilla con celdas en escala de terracota. Sin radius. Mono uppercase para labels de eje y números de semana.
- **Bloque despacho:** card en `--mi-bg-dark` (verde-negro) con texto cream. Cierre visual fuerte de la página.

Cero hex hardcodeado fuera de los tokens. Toda decisión de color sale del design system.

---

## 7. Comportamiento responsive

Sigue las reglas de Spec 02 (breakpoint 640px).

**Mobile (< 640px):**
- Sidebar colapsa a drawer. Toggle con ícono ☰ a la izquierda del header.
- Carrusel ocupa full-width, silueta encima del título (no a la izquierda).
- Mapa céntrico y heatmap se apilan verticalmente (no lado a lado).
- Heatmap reduce a 8 semanas (no 12) para no apretar columnas.

**Desktop (≥ 640px):**
- Sidebar persistente, sin toggle.
- Carrusel con silueta a la izquierda + texto a la derecha (split 30/70).
- Mapa + heatmap lado a lado (split 60/40).

---

## 8. Conexión con otras specs

| Spec | Conexión |
|------|----------|
| **Spec 04** (páginas de eje) | El módulo "Ejes" del sidebar enlaza a `/ejes/[slug]`. El heatmap también. |
| **Spec 05** (archivo + buscador) | El módulo "Buscador" usa el endpoint de `/analisis?q=`. El heatmap enlaza a `/analisis` con filtros. |
| **Spec 07** (puente vault → sitio) | El módulo "Conceptos" lista los conceptos con `publicar: true` y enlaza a `/concepto/[slug]`. |
| **Spec 08** (coherencia editorial) | Hereda decisión 2.2 (header dinámico de ciudades) y 3.2 (subtítulo limpio). |
| **Spec 09** (visión próximo desarrollo) | Esta spec implementa A. La evolución a B con indicadores externos (capa 2) queda para post-v1. |
| **Spec 10** (Latinobarómetro) | Cuando se ejecute Spec 10, esta home suma capas de mapa + tira de indicadores (B.3 + B.1 del chat de mayo 2026). |

---

## 9. Comportamiento del "eje más activo de la semana"

Decisión pendiente: **automático vs. curado**.

**Opción A — Automático.** Computado por query (sección 5). Pro: cero trabajo editorial, refleja el corpus tal cual es. Con: si una semana hay empate o si la cuenta no captura la "energía" real (ej: 2 análisis sobre desrepresentación pero uno es flojo y otro es central), el algoritmo no lo distingue.

**Opción B — Curado.** Tomás marca uno de los ejes como "destacado" desde el admin. Pro: control editorial. Con: trabajo manual semanal y riesgo de olvido.

**Opción C — Híbrido.** Default automático, pero el admin puede sobreescribir. Pro: cobertura sin trabajo + control cuando hace falta. Con: implementación más compleja.

**Recomendación:** **C** si se hace bien (campo opcional `featured_axis_slug` en tabla `dispatches`); **A** si se quiere simple. **B** se descarta — agrega trabajo manual sin valor proporcional.

---

## 10. Componentes nuevos para el design system

| Componente | Aparece en | Notas |
|------------|------------|-------|
| **Sidebar persistente** | Home (esta spec), idealmente todo el sitio | 240px desktop, drawer mobile |
| **Sidebar module** | Sidebar | Título + ícono expand + conteo + lista expandible |
| **Carrusel editorial** | Esta spec | Auto-slide con dots, pausa hover, fade transition |
| **Silueta de país SVG** | Carrusel + breadcrumbs + mini-maps | Set de 10 SVGs, invertidos, ink sólido |
| **Heatmap ejes × tiempo** | Esta spec | Grilla de celdas con tooltip y click navegacional |
| **Bloque "Esta semana"** | Esta spec | Tipo banner editorial, dos líneas, sin sombra |

Estos se agregan al design system en una **revisión 1.2** post-aprobación de esta spec, similar a cómo Spec 01 sección 7 lo previó.

---

## 11. Decisiones tomadas (registro)

Listo de decisiones que esta spec **fija**:

1. ✅ Arquetipo A (mapa céntrico + carrusel + heatmap), no B ni C.
2. ✅ Sidebar persistente con 4 módulos: Países, Ejes, Buscador, Conceptos.
3. ✅ Reparto sidebar/header: sidebar para exploración del corpus, header para secciones del producto.
4. ✅ Silueta del país en carrusel (no banderas).
5. ✅ Carrusel con auto-slide, fade, pausa hover, dots.
6. ✅ Heatmap de 12 semanas (no 52), solo eje primario.
7. ✅ Mapa céntrico con click → panel lateral (no modal).
8. ✅ Conteo del eje más activo en encabezado "Esta semana".

---

## 12. Decisiones pendientes

| # | Decisión | A resolver |
|---|----------|-----------|
| 1 | "Eje más activo": automático, curado o híbrido (sección 9) | Tomás (recomendación: híbrido) |
| 2 | Cuándo evolucionar a arquetipo B (capa 2 con indicadores) | Post v1 estable, depende de Spec 10 |
| 3 | Si el sidebar es persistente solo en home o en todo el sitio | Tomás (recomendación: todo el sitio para consistencia) |
| 4 | Si las siluetas de país se generan a mano o se importan desde GeoJSON simplificado | Implementación (recomendación: derivar del GeoJSON ya cargado) |

---

## 13. Orden de implementación

```
Día 1   ► Sidebar + estructura base
          - Componente sidebar persistente con 4 módulos
          - Layout grid: sidebar 240px | contenido fluido
          - Conteos desde la base de datos
          - Cero contenido todavía en módulos (lista vacía)

Día 2   ► Bloque "Esta semana" + carrusel
          - Query del eje más activo
          - Componente carrusel con auto-slide y fade
          - Set de 10 siluetas SVG (extraer de GeoJSON Natural Earth)
          - Slides con datos reales

Día 3   ► Mapa céntrico
          - Reusar implementación de /mapa (Spec 01.5.5)
          - Adaptar a 60% del ancho
          - Click → panel lateral derecho con preview de análisis
          - Sin filtros (los filtros viven en /mapa)

Día 4   ► Heatmap eje × semana
          - Componente con Observable Plot o D3 directo
          - Query de las últimas 12 semanas
          - Tooltip + click navegacional

Día 5   ► Sidebar funcional
          - Expandir módulos al click
          - Submenús con datos reales (10 países, 6 ejes, conceptos publicados)
          - Buscador inline

Día 6   ► Mobile + pulido
          - Drawer del sidebar
          - Stack vertical de mapa + heatmap
          - Reducción del carrusel a layout mobile
          - Lighthouse > 90
```

---

## 14. Criterios de aceptación

- [ ] La home tiene sidebar persistente con 4 módulos navegables.
- [ ] El bloque "Esta semana" muestra el eje más activo con conteo.
- [ ] El carrusel rota automáticamente entre los 4-5 análisis de la semana, con silueta del país en cada slide, pausa al hover y dots clicables.
- [ ] El mapa invertido es céntrico y al hacer click en un país abre panel lateral con preview.
- [ ] El heatmap muestra las últimas 12 semanas × los 6 ejes con celdas en escala terracota; al hacer click navega al archivo filtrado.
- [ ] El bloque despacho cierra la página con el último publicado.
- [ ] Cero hex hardcodeado: todo color viene de tokens.
- [ ] En mobile (≤640px) el sidebar es drawer, el carrusel apila silueta + texto, el mapa y heatmap se apilan verticalmente.
- [ ] Lighthouse > 90 en performance, accesibilidad, SEO.
- [ ] `prefers-reduced-motion` desactiva auto-rotación del carrusel.
