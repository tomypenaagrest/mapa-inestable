---
spec: 18
titulo: Bugfixes urgentes — header y mapa
estado: borrador
autor: Tomás (con Claude)
fecha: 2026-05-09
tipo: QA / corrección de implementación
prioridad: alta
depende_de: [11, 15]
afecta: [home dashboard, /mapa, header global]
---

# 18 · Bugfixes urgentes — header y mapa

## Resumen

Cuatro bugs detectados en la implementación actual del sitio. Tres son del header global (afectan a todas las páginas), uno es del mapa interactivo (home + `/mapa`). Esta spec los documenta con repro, diagnóstico esperado y fix.

| # | Bug | Severidad | Páginas afectadas |
|---|-----|-----------|-------------------|
| B1 | Mapa del home dashboard no funciona | Alta | `/` |
| B2 | Página `/mapa` no funciona | Alta | `/mapa` |
| B3 | "uruguay" hardcoded en el strip de países | Media | todas |
| B4 | Logo subdimensionado, tagline compite | Media | todas |

---

## B1 + B2 — Mapa interactivo no funciona

### Síntoma

El componente del mapa (D3.js + GeoJSON Sudamérica invertida, Spec 11 §4.5 y Spec 01 §5.5) no responde como debería. Tomás reporta que "no funciona". A nivel UX puede traducirse en cualquiera de:

- El SVG no renderiza (área vacía donde debería estar el mapa).
- El SVG renderiza pero los países no son interactivos (no hay hover, no hay click).
- El click ocurre pero no abre el panel lateral / no navega a la ficha del país.
- La proyección invertida no se aplica (sur abajo en lugar de arriba).
- Errores en la consola del browser que bloquean la ejecución.

### Diagnóstico requerido (orden de chequeo)

1. **Inspeccionar consola del browser** en ambas vistas. Errores de JS, 404 sobre el GeoJSON, fallas de import de D3.
2. **Confirmar que el GeoJSON de Sudamérica está accesible** en el path esperado. Natural Earth 1:50m o similar (CLAUDE.md raíz lo menciona).
3. **Verificar la transformación de proyección** — el rotate `[0, 0, 180]` o el `lat * -1` que invierte el mapa (CLAUDE.md raíz da el snippet base).
4. **Verificar que los países tienen `<path>` con eventos** (`onMouseEnter`, `onClick`). Si están como SVG estático, faltan los handlers.
5. **Verificar que la navegación post-click funciona** — si el handler dispara `router.push(/pais/[slug])`, confirmar que la ruta existe y que el slug del país está bien construido.
6. **Verificar diferencia entre home y `/mapa`** — Spec 15 §7.1 define que son dos UIs distintas (overview sin filtros vs explorer con filtros laterales). Si las dos están rotas, el problema es del componente compartido. Si solo una, el problema está en el shell de esa página.

### Fix esperado

- Mapa renderiza correctamente con sur arriba.
- Hover en cualquier país: highlight + tooltip con nombre.
- Click en home → abre panel lateral derecho con resumen del país (Spec 11 §4.5).
- Click en `/mapa` → navega a `/pais/[slug]` o aplica filtro según la decisión de Spec 11.
- Cero errores en consola.

### Aceptación

- 10 países sudamericanos clickeables y navegables.
- Funciona en Chrome / Firefox / Safari última versión.
- Funciona en mobile (touch).

---

## B3 — "uruguay" hardcoded en strip de países

### Síntoma

Captura del 2026-05-09: el strip cream debajo del header principal (entre el bloque terracota y la banda verde-negro de breadcrumb) muestra `uruguay` literal, en mono lowercase. Esto ocurre en una página de eje (`/ejes/[slug]`), donde no hay contexto de país.

### Diagnóstico

Spec 15 §7.3 (revisión r1, 2026-05-09) estableció que la línea hardcoded del header debía salir y reemplazarse por **países cubiertos esta semana**, dinámico desde data. La implementación actual:

- Sacó la línea original (`BA · Bogotá · Santiago` o similar).
- Reemplazó con un placeholder único: `uruguay`.
- No leyó el frontmatter de los análisis publicados en la semana actual.

Es una implementación parcial: se hizo el cambio visual pero no la conexión a data.

### Fix esperado

Implementar lo que Spec 15 §7.3 r1 ya documentó:

- Strip muestra los países cubiertos esta semana, en mono lowercase, separados por `·`.
- Source: frontmatter `pais` de los análisis con `published_at` dentro de la semana ISO actual.
- Si supera 5 países, mostrar 5 alfabéticamente y `+N` con dropdown.
- Si no hay despacho esta semana, mostrar los del despacho más reciente con strip pequeño "última semana publicada: sem N".
- Hover sobre un país → link a `/pais/[slug]`.
- Tipografía: mono regular 13px, color `--mi-ink-mute`, letter-spacing 0.04em (Spec 15 §7.3).

### Implementación técnica

Componente: `<HeaderCountryStrip>` (nuevo). Recibe array de slugs de países cubiertos. Render server-side desde el build (los análisis están en archivos .md).

```tsx
async function getCountriesThisWeek(): Promise<string[]> {
  const week = getCurrentISOWeek();
  const analyses = await getAnalysesForWeek(week);
  if (analyses.length === 0) {
    const latest = await getMostRecentWeekWithAnalyses();
    return { week: latest.week, countries: latest.countries, isFallback: true };
  }
  return { week, countries: dedupe(analyses.map(a => a.country)).sort(), isFallback: false };
}
```

### Aceptación

- En la semana del 2026-05-09, el strip muestra los países correctos (probablemente 3-4).
- En cualquier otra semana, igual.
- En semanas sin publicaciones: muestra fallback con la semana real, no `uruguay`.
- En página de país individual: el strip puede o desaparecer o destacar el país actual; ver decisión pendiente.

### Decisión pendiente

¿En `/pais/[slug]` el strip muestra los mismos países globales o se reemplaza por algo específico al país (ej. ejes activos del país)? Propuesta inicial: mantener el strip global. El header del país (Spec 16 §3) ya da el contexto del país; duplicar lo confunde.

---

## B4 — Logo subdimensionado, tagline compite

### Síntoma

En la captura del 2026-05-09, el logo "MAPA INESTABLE" (con la silueta de Sudamérica invertida) aparece a un tamaño que lo hace visualmente subordinado al tagline "CARTOGRAFÍA POLÍTICA DEL SUR". El tagline en mono uppercase ocupa similar o más peso visual que el brand mark.

Mediciones aproximadas de la captura:
- Logo: ~70×70px efectivo (silueta + texto interno).
- Tagline: línea de ~22ch en mono ~13px, occupa ancho similar al logo.

### Diagnóstico

El design system (Spec 11 §4.1 y `design-system.md`) establece el logo como pieza de identidad fuerte. El tagline es subordinado por intención editorial (Spec 08 §3.2 lo reduce, quitándole "· Año II"). La proporción actual revierte esa jerarquía.

### Fix esperado

**Jerarquía visual del header** (desktop ≥960px):

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│  [LOGO MAPA INESTABLE]                  DESPACHOS  ENSAYOS  │
│   (silueta + brand)                     MAPA       ACERCA   │
│                                                              │
│  cartografía política del sur                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Especificaciones:**

- **Logo**: altura 96px desktop / 56px mobile. La silueta de Sudamérica + el texto "MAPA INESTABLE" en Alfa Slab One quedan como bloque visual dominante. Es la firma del sitio.
- **Tagline**: separado por al menos 8px verticales del logo. Tipografía: `--mi-font-mono` regular 12px, color `--mi-ink-soft` (no `--mi-ink` — bajamos un paso para subordinarlo). Letter-spacing 0.06em. **Lowercase**, no uppercase, para distanciarlo del nav.
- **Nav** (DESPACHOS · ENSAYOS · MAPA · ACERCA): alineado a la derecha, mono uppercase 13px, color `--mi-ink`. Mantiene su densidad actual.
- **Espaciado vertical del header**: padding 32px arriba y 24px abajo. Total altura aproximada: 152px desktop.

**Mobile** (≤640px):

- Logo 56px de alto, centrado o alineado izquierda.
- Tagline en línea inmediatamente debajo, 11px mono.
- Nav colapsa a fila inferior con overflow horizontal touch (Spec 02 §3.1 ya lo había definido, no usar hamburger).

### Aceptación

- El logo es la pieza visual dominante del header.
- El tagline existe pero no compite: está subordinado en peso, color y caso (lowercase vs uppercase).
- El nav mantiene su densidad y su rol funcional.
- En mobile, el logo no queda diminuto.

---

## Plan de implementación

### Orden sugerido

1. **B3 primero** (1-2h) — es un cambio de componente aislado, alta visibilidad, baja complejidad.
2. **B4 después** (2-3h) — toca el header pero es CSS + ajustes de tamaño, no requiere debug.
3. **B1 + B2 al final** (medio día) — requiere debug del componente del mapa, puede destapar problemas mayores. Vale separarlo del bloque del header.

Total: ~1 día de trabajo si no hay sorpresas con el mapa.

### Smoke test post-fix

- Abrir home en desktop → ver header con logo grande + tagline subordinado + nav alineado + strip de países correcto + mapa funcional.
- Click en un país del mapa → abre panel.
- Abrir `/mapa` → mapa funcional con filtros laterales.
- Abrir `/ejes/[slug]` → strip de países muestra los reales, no `uruguay`.
- Rebanada mobile (Chrome devtools 360px) → header no queda roto.

---

## Decisiones pendientes

1. **Strip de países en `/pais/[slug]`** — global o específico (ver §B3). Recomiendo global.
2. **Tagline lowercase vs uppercase** — propongo lowercase (§B4). Si se mantiene uppercase, asegurar `letter-spacing: 0.08em` y opacity 0.7 para subordinar.
3. **Si el bug del mapa es estructural** (ej. la lib D3 no es la indicada) — esa decisión sale del scope de esta spec y arma una spec aparte. Acá solo se cubre que el componente actual funcione como se diseñó.
