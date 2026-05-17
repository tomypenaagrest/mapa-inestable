1---
spec: 22
titulo: Mapa interactivo Torres García — producción e implementación
estado: borrador-r2
autor: Tomás (con Claude)
fecha: 2026-05-09
revision: 2026-05-09 (r2) — extendida con user story, implementación en home y /mapa, hot-zones, estados, mobile, a11y, URL state, performance
depende_de: [01, 11, 15, 16, 18, 21]
afecta: [/, /mapa, design-system, identidad visual del proyecto]
resuelve: Spec 18 §B1 + §B2 (mapa no funciona en home y /mapa)
prioridad: alta
---

# 22 · Mapa interactivo Torres García — vectorización, capitales y herramienta editorial

## Resumen ejecutivo

El proyecto declara desde el CLAUDE.md raíz que la interfaz principal del sitio es **un mapa de Sudamérica invertido** (sur arriba), referencia a "América Invertida" (1943) de Joaquín Torres García. Esa pieza es identidad y es navegación al mismo tiempo: hover y click sobre un país abren la ficha (Spec 16) o la página de eje filtrada por país (Spec 04).

Esta spec cubre dos cosas:

**Producción (cubierta en §1-§9):**
1. **Vectorización del dibujo original** (escaneo del libro de Torres García → SVG).
2. **Herramienta editorial interactiva** (`herramienta-capitales.html`) para ubicar las 10 capitales sobre el dibujo simbólico — el dibujo no es geográficamente preciso, las posiciones se calibran a ojo.
3. **SVG final** con capitales y recorte aplicados (`mapa-con-capitales.svg`).

**Implementación (cubierta en §11-§19, agregadas en revisión r2):**
4. **User story y acceptance criteria** (§11).
5. **Integración en home dashboard** como pieza central del viewport (§12).
6. **Integración en `/mapa`** como página de exploración con filtros laterales (§13).
7. **Hot-zones poligonales** por país, estados visuales, eventos, URL state, mobile, a11y, performance (§14-§18).

Los archivos viven en `70-Producto/design-system/mapa/`. Esta spec es la fuente de verdad de cómo se produjo, cómo se itera y cómo se monta en el sitio.

**Resuelve:** B1 y B2 de Spec 18 (mapa no funciona en home y `/mapa`) — entrega el activo y especifica la implementación completa.

---

## 1. Posición en el corpus de specs

| Spec | Relación |
|---|---|
| 01 §5.5 | Define que el mapa es página dedicada `/mapa`. Esta spec entrega el activo visual a usar |
| 11 §4.5 | Define el mapa céntrico en home (sin filtros, click → panel lateral). Mismo activo |
| 15 §7.1 | Resuelve la coexistencia: home overview vs `/mapa` explorer. Esta spec no la modifica |
| 16 §3.3 | Frame strip de país lista los ejes activos. Click en un eje del strip → `/ejes/[slug]?pais=X`. El mapa puede aceptar el query param y resaltar el país |
| 18 §B1, B2 | Bugs de mapa no funciona. Esta spec entrega el SVG; la implementación de interactividad se hace después |
| 21 | Identidad visual r2 (logo escalador). El mapa convive con el logo nuevo; ambos referencian a Torres García pero con tratamientos distintos |

---

## 2. Flujo de producción (en orden cronológico)

### Etapa 1: vectorización del original

**Input:** `torresgarcia40.jpg` — escaneo del Grabado 57 (página 210) del libro de Torres García, 1280×1621 px.

**Process:** dos approaches probados, segundo descartó al primero.

**A. Skeleton + stroke con OpenCV (descartado).** Pipeline manual con PIL + OpenCV `findContours` + `skeletonize` + Bézier suavizado. Resultado: 65 KB, paths de 1 px reducidos a líneas. **No funcionó bien**: la silueta quedó facetada, los textos manuscritos perdieron grosor, "Polo S" quedó partido. Tres iteraciones (r1, r2, r3) no llegaron a calidad aceptable.

**B. AutoTracer.org (adoptado).** Tomás pasó la imagen por la herramienta paga [autotracer.org](https://www.autotracer.org/). Approach distinto: vectorización por color (regiones rellenas), no skeleton. Resultado: 75 KB, 34 paths, **conserva el grosor variable del trazo manuscrito** (cada letra es una región con forma propia, no una línea de grosor uniforme). Calidad muy superior al pipeline manual.

**Conclusión documentada:** la vectorización de dibujos a mano alzada con tinta es **estructuralmente más fiel** con color tracing que con skeleton. Para tareas similares en el futuro (ej. otro grabado, otra ilustración del proyecto), default a herramienta especializada externa, no implementar manualmente.

**Output crudo de AutoTracer:**
- Colores: `#cfc1ae` (papel envejecido beige) + `#453b30` (tinta marrón-verdosa).
- Dimensiones: 1280×1621.
- 34 paths sin agrupar.

### Etapa 2: adaptación a paleta DS Grabado

Los colores de AutoTracer no coinciden con la paleta del design system (`--mi-bg-paper #F4E9D2` y `--mi-ink #1F2A12`). La adaptación es find-and-replace:

```
#cfc1ae → #F4E9D2  (papel envejecido → crema cálido del DS)
#453b30 → #1F2A12  (tinta marrón → verde-negro del DS)
```

Esta paleta queda como **versión "para el sitio"**. La versión con colores AutoTracer queda preservada como referencia del original.

**Estado actual del archivo `mapa-con-capitales.svg`:** mantiene los colores **originales de AutoTracer** (`#cfc1ae`/`#453b30`), no la paleta DS. La adaptación de paleta queda como **decisión pendiente** (§8 #1) — depende del contexto de uso final (herramienta vs sitio).

### Etapa 3: herramienta editorial para capitales

El dibujo de Torres García es simbólico — la silueta no es geográficamente precisa. Ubicar las capitales por sus coordenadas reales (lat/lon) no funciona: caen en lugares que no se "ven" como esa capital sobre el dibujo. Hace falta calibración a ojo.

**Decisión:** construir una herramienta editorial. `herramienta-capitales.html` es un HTML autónomo con tres paneles:

- **Stage** (centro): el SVG cargado como imagen, con click handler.
- **Sidebar** (derecha): lista de los 10 países, indicador de país activo, botones de undo/clear/exportar.
- **Overlay**: capa de cruces colocadas con drag-and-drop.

**Flujo de uso:**

1. El editor abre `herramienta-capitales.html` en el browser.
2. Selecciona un país de la lista (queda en negro).
3. Click sobre el mapa donde se "ve" esa capital → cae una cruz `✕` con label.
4. La herramienta auto-avanza al siguiente país sin colocar.
5. Drag de una cruz para reposicionarla. Doble-click para borrarla.
6. `Z` deshace.
7. Estado persiste en `localStorage` (clave `mapa-inestable-capitales-v1`) — sobrevive a refresh.
8. `↓ Exportar SVG` baja el archivo final con las cruces y labels integrados.

**Por qué herramienta vs hard-coded:** la calibración de las 10 capitales sobre un dibujo simbólico es decisión editorial pura — el editor (Tomás) tiene mejor sentido espacial del dibujo que cualquier estimación automática. La herramienta separa el momento de calibración del momento de implementación.

### Etapa 4: post-procesado (recorte + uppercase + dimensiones)

Dos correcciones aplicadas al SVG exportado por la herramienta:

**Recorte de altura 1621 → 1380.** El escaneo original tiene un margen inferior con residuos del texto "Grabado 57.- Páj. 210" del libro original. Para uso editorial conviene recortarlos. Se aplica `viewBox="0 0 1280 1380"` + `height="1380"`. El contenido por debajo de y=1380 simplemente no se renderiza. Las 10 capitales están todas en y < 1170 — no se afectan.

**Corrección del render de labels.** El primer export de la herramienta tenía cuatro defectos:

1. Labels en case mixed (`AR · Buenos Aires`) en vez de uppercase como en el preview interactivo.
2. Width del `<rect>` calculado con fórmula imprecisa (`length × 7 + 8`).
3. Texto desalineado vertical respecto al rect.
4. `letter-spacing="1"` sin unidad.

La función `buildCrossesSvg()` de la herramienta fue corregida para emitir:

- Texto con `.toUpperCase()` explícito.
- Width = `length × 8.4 + 20` (más realista para Courier New 13px).
- `<rect y="-10" height="20">` + `<text dominant-baseline="middle" text-anchor="middle" x="${labelWidth/2}">` para centrado completo.
- `letter-spacing="0.8px"` con unidad.
- `font-family="'Courier New', ui-monospace, monospace"` con quotes.

---

## 3. Decisiones técnicas finales

### 3.1 Posiciones de las 10 capitales

Calibradas en sesión 2026-05-09 sobre el dibujo simbólico. **No son coordenadas geográficas reales** — son las posiciones donde cada capital "se ve" sobre el dibujo de Torres García.

| Código | País | Capital | x | y |
|---|---|---|---|---|
| AR | Argentina | Buenos Aires | 572.1 | 465.2 |
| BO | Bolivia | La Paz / Sucre | 759.4 | 775.8 |
| BR | Brasil | Brasília | 459.7 | 824.2 |
| CL | Chile | Santiago | 754.7 | 551.0 |
| CO | Colombia | Bogotá | 967.0 | 1164.5 |
| EC | Ecuador | Quito | 1038.8 | 1123.9 |
| PY | Paraguay | Asunción | 565.9 | 690.0 |
| PE | Perú | Lima | 1009.2 | 858.5 |
| UY | Uruguay | Montevideo | 530.0 | 502.6 |
| VE | Venezuela | Caracas | 795.3 | 1166.0 |

Coordenadas en SVG nativo (1280×1380 después del recorte). Si el SVG se redimensiona en CSS, los puntos siguen alineados gracias al `viewBox`.

**Bolivia:** se incluyen las dos sedes (La Paz administrativa, Sucre constitucional) como `LA PAZ / SUCRE`. Decisión editorial — el resto de países tiene una sola.

### 3.2 Anatomía visual de cada cruz + label

```
    ✕                                            ┌──────────────────────┐
   28×28 px                                     │  AR · BUENOS AIRES   │
   stroke #c0532e                               │  (mono, uppercase,   │
   stroke-width 5                               │   13px, 0.8px sp)    │
   linecap round                                └──────────────────────┘
    │                                            ▲
    │                                            │
    └── separación 8 px ─────────────────────────┘
```

**Cruz:**
- Tamaño: 28×28 px (`x1=-14 y1=-14 x2=14 y2=14` y la opuesta).
- Color: `#c0532e` (rojo terracota más vivo que el `--mi-accent-warn` `#B45729` del DS, pero coherente con la familia de rojos).
- Stroke-width: 5 px.
- Linecap: round.
- **Sin temblor**: dos `<line>` rectas. Decisión editorial confirmada en sesión — más limpio que la versión Bézier con offset random.

**Label:**
- `<rect>` con `fill="#efe7d7"` (crema), `stroke="#1a1814"` (oscuro casi-negro), `stroke-width=1`.
- Width = `length(uppercase text) × 8.4 + 20` px.
- Height = 20 px, centrado vertical respecto a la cruz.
- Padding vertical: 10 px arriba, 10 abajo desde el centro.
- Separación cruz → label: 8 px.

**Texto del label:**
- `font-family: 'Courier New', ui-monospace, monospace`.
- `font-size: 13`.
- `letter-spacing: 0.8px`.
- `text-anchor: middle`, `dominant-baseline: middle`.
- Color: `#1a1814`.
- **Texto en uppercase explícito** (no por CSS — el SVG no aplica text-transform).

### 3.3 Recorte de altura

`viewBox="0 0 1280 1380"` + `width="1280"` + `height="1380"`. Recorta los residuos del texto inferior del original.

### 3.4 Paleta del SVG actual vs paleta DS

| Elemento | Color actual del archivo | Equivalente en DS Grabado |
|---|---|---|
| Papel (fondo) | `#cfc1ae` | `--mi-bg-paper` `#F4E9D2` |
| Tinta del dibujo | `#453b30` | `--mi-ink` `#1F2A12` |
| Cruz capital | `#c0532e` | (sin equivalente directo, asociado a `--mi-accent-warn` `#B45729`) |
| Label fondo | `#efe7d7` | (similar a `--mi-bg-paper` `#F4E9D2`) |
| Label borde | `#1a1814` | (similar a `--mi-ink` `#1F2A12`) |

**Decisión pendiente** (§8 #1): si conviene mantener los colores originales de AutoTracer (más fieles al papel envejecido del libro original) o adaptar al sistema DS para integración limpia con el resto del sitio.

---

## 4. Archivos producidos

```
70-Producto/design-system/mapa/
├── mapa-con-capitales.svg              ← producto final (recortado + capitales)
├── mapa-con-capitales-preview.png      ← render PNG de referencia visual
└── herramienta-capitales.html          ← herramienta editorial para iterar
```

**Tamaños:**
- `mapa-con-capitales.svg` — 80.7 KB
- `mapa-con-capitales-preview.png` — 95.7 KB
- `herramienta-capitales.html` — 15 KB

**Conservados como historial** (en raíz del workspace):
- `torresgarcia40.jpg` — escaneo original.
- `torresgarcia40.svg` — output crudo de AutoTracer (sin capitales, sin recorte, sin paleta DS).
- `capitales-mapa-inestable.svg` — primer export de la herramienta (labels case mixed, sin recorte).
- `capitales-mapa-inestable-v2.svg` — export con labels corregidos (uppercase, centrado), sin recorte.

Ninguno de los anteriores es el archivo activo. Todos preservados por si vale recuperar algo. **Decisión post-implementación**: archivar los obsoletos en `_archive/` cuando se confirme que `mapa-con-capitales.svg` es el definitivo.

---

## 5. Estructura del SVG final

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 1380" width="1280" height="1380">
  <!-- 34 paths del dibujo de Torres García (silueta + sol + luna + estrellas + barco + pez + textos) -->
  <path style="fill:#cfc1ae" d="..."/>  <!-- papel/fondo -->
  <path style="fill:#453b30" d="..."/>  <!-- tinta -->
  ... (32 paths más)
  
  <!-- Capa de capitales (10 cruces + labels) -->
  <g id="capitales">
    <g transform="translate(572.1 465.2)">
      <line x1="-14" y1="-14" x2="14" y2="14" stroke="#c0532e" stroke-width="5" stroke-linecap="round"/>
      <line x1="-14" y1="14" x2="14" y2="-14" stroke="#c0532e" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(22 0)">
        <rect x="0" y="-10" width="155" height="20" fill="#efe7d7" stroke="#1a1814" stroke-width="1"/>
        <text x="77.5" y="0" font-family="'Courier New', ui-monospace, monospace"
              font-size="13" fill="#1a1814" letter-spacing="0.8px"
              text-anchor="middle" dominant-baseline="middle">AR · BUENOS AIRES</text>
      </g>
    </g>
    ... (9 capitales más)
  </g>
</svg>
```

**Lo que NO tiene el SVG actual** (decisiones pendientes):

- Cada `<g>` de capital **sin `id="capital-{slug}"`**: necesario para conectar handlers de click. Se agrega cuando se haga la integración técnica.
- **Sin paleta DS aplicada** (mantiene los colores originales).
- **Sin hot-zones invisibles por país**: el dibujo es continental, no nacional. Para hacer click sobre "Brasil" como entidad necesita un `<polygon>` o `<path>` invisible que cubra la región brasileña.

---

## 6. Cómo usar la herramienta editorial

### 6.1 Abrirla

Opción A: abrir `herramienta-capitales.html` directamente con doble click (file://). Funciona pero CORS puede impedir el `fetch` del SVG en algunos browsers.

Opción B: servir con un servidor local. Desde la carpeta `70-Producto/design-system/mapa/`:
```bash
python3 -m http.server 8080
# o
npx serve .
```
Después abrir `http://localhost:8080/herramienta-capitales.html`.

### 6.2 Cargar el SVG

La herramienta espera el SVG en el path `assets/torresgarcia40.svg`. Si no existe, hay que:
- Crear `assets/` dentro de `70-Producto/design-system/mapa/`.
- Copiar `torresgarcia40.svg` (o `mapa-con-capitales.svg` si se quiere editar sobre el archivo final) ahí.

### 6.3 Iterar las posiciones

1. Abrir la herramienta.
2. Las posiciones existentes se cargan desde `localStorage` automáticamente.
3. Drag de cualquier cruz para mover.
4. `Borrar todo` resetea (con confirmación).
5. `↓ Exportar SVG` baja el SVG con las cruces.

### 6.4 Limitaciones

- Sin export con paleta DS aplicada — siempre exporta con colores AutoTracer (`#cfc1ae`/`#453b30`). La conversión de paleta es manual post-export (find/replace).
- Sin export con recorte — siempre exporta height=1621. El recorte es manual post-export.
- Sin IDs por capital en el SVG exportado.
- Sin atributo `<title>` en cada capital para tooltip nativo.

Estas limitaciones se asumen porque la herramienta es **editorial**, no producción. La adaptación a producto se hace en una pasada de integración aparte.

---

## 7. Cómo conectar a interactividad (hot-zones por país)

El SVG actual tiene la silueta como **dibujo continental**, no como conjunto de polígonos por país. Para hover/click por país se superponen polígonos invisibles.

### 7.1 Approach técnico

Sobre el SVG, agregar un `<g id="hotzones">` con 10 `<polygon>` o `<path>` por país, con:

```xml
<g id="hotzones" fill="transparent">
  <polygon id="hot-argentina" points="...puntos del cono sur..." pointer-events="all"/>
  <polygon id="hot-brasil" points="..." pointer-events="all"/>
  ... (8 más)
</g>
```

Cada polígono cubre la región del país en el dibujo. Aunque el dibujo no tenga fronteras nacionales dibujadas, las regiones se dividen visualmente — el cono sur es Argentina/Chile/Uruguay, el centro-oeste es Bolivia/Paraguay, etc.

Las regiones se delimitan **a ojo** sobre el dibujo, igual que las capitales. Una herramienta similar a la actual puede armar los polígonos arrastrando puntos.

### 7.2 Estados visuales

- **Default**: polígono transparente, capital visible (cruz + label).
- **Hover**: polígono se vuelve `fill="rgba(192, 83, 46, 0.15)"` (terracota suave), label de capital se resalta (border-bold).
- **Active** (país seleccionado, ej. desde URL `?pais=brasil`): polígono `fill="rgba(192, 83, 46, 0.30)"` + cruz de capital cambia a fondo `--mi-brand-gold`.

### 7.3 Eventos

```js
poligono.addEventListener('click', () => {
  router.push(`/pais/${slug}`);
});
poligono.addEventListener('mouseenter', () => {
  showCountryPanel(slug);  // panel lateral en home (Spec 11 §4.5)
});
```

### 7.4 Implementación detallada en §11-§19

La implementación de hot-zones, eventos, integración con home y `/mapa`, mobile, a11y y performance se detalla en las secciones agregadas en r2 al final de esta spec (§11 en adelante).

---

## 8. Decisiones pendientes

1. **Paleta del SVG: AutoTracer original o adaptación al DS Grabado.** El archivo actual mantiene los colores originales (papel beige `#cfc1ae`, tinta marrón `#453b30`). Adaptar a DS (`#F4E9D2`, `#1F2A12`) integra mejor con el resto del sitio. Mi recomendación: **adaptar al DS** cuando se haga la integración técnica (Spec 23). Mientras tanto el archivo actual sirve como fuente editorial.

2. **IDs por capital y `<title>` para tooltip.** Agregar `id="capital-{slug}"` a cada `<g>` de capital + `<title>{Nombre}</title>` adentro. Habilita interactividad sin reescribir el SVG. Decisión: hacerlo en la pasada de Spec 23.

3. **Exportar la herramienta con las correcciones de paleta + recorte + IDs aplicadas automáticamente.** Hoy la herramienta exporta el SVG "crudo" (paleta AutoTracer, sin recorte, sin IDs) y los pasos de adaptación son manuales. Conviene mover esa lógica al export de la herramienta para iteración futura sin sufrimiento.

4. **Bolivia: "La Paz / Sucre" o solo "La Paz".** Decisión editorial actual: incluir ambas. Si rompe la consistencia visual con el resto (todos los demás tienen una sola capital), valorar simplificar a "La Paz".

5. **Responsividad del SVG en mobile.** El SVG escala con `viewBox` pero los labels en mobile (≤640px) pueden quedar muy chicos o se cortan entre sí. Decisión: probar en mobile real. Posibles soluciones: ocultar labels en mobile y mostrar solo cruces + tooltip al tap, o reducir tamaño del label automáticamente con `vw` units.

6. **Integración con el mapa de home (Spec 11 §4.5) vs `/mapa` (Spec 01 §5.5).** Spec 15 §7.1 confirmó que coexisten con UIs distintas: home overview sin filtros, `/mapa` explorer con filtros laterales. Esta spec entrega el activo común a ambos. Cómo se monta cada uno se define en Spec 23 (interactividad) o en las specs de página correspondientes.

7. **Origen del color `#c0532e` para las cruces.** No coincide con ningún token del DS. ¿Se sumerge en el sistema (ej. nuevo `--mi-mark-capital`) o se mantiene fuera del DS porque es un color editorial puntual? Mi recomendación: **fuera del DS**, documentado en esta spec como excepción intencional.

---

## 9. Roadmap

### Fase A — Esta spec (ya hecho)

1. Vectorización del original con AutoTracer ✓
2. Paleta DS evaluada (decisión post) ✓
3. Herramienta editorial construida ✓
4. 10 capitales calibradas y exportadas ✓
5. Recorte aplicado ✓
6. Render fiel de labels (uppercase, dimensiones, centrado) ✓
7. Archivos organizados en `70-Producto/design-system/mapa/` ✓
8. Documentación (esta spec) ✓

### Fase B — Implementación interactiva (revisar §19 para detalle)

Detallada en §19. Resumen: 1) construir herramienta de hot-zones similar a `herramienta-capitales.html` para definir los 10 polígonos editoriales por país. 2) Componente React `<MapaTorresGarcia>` con eventos. 3) Variantes home y `/mapa`. 4) URL state + integración con `localStorage` (Spec 15). 5) Mobile y a11y.

### Fase C — Optimización (cuando aplique)

1. Adaptar la herramienta editorial para emitir SVG con paleta DS + recorte + IDs aplicados.
2. Probar responsividad en mobile y ajustar.
3. Considerar versión "minimal" del mapa (sin sol/luna/estrellas/barco/pez) para usos donde la decoración compite (ej. card chico, favicon, OG image).

---

## 11. User story y acceptance criteria

### 11.1 User story

> **Como lector recurrente**, al entrar al home quiero ver el mapa de Sudamérica invertido como pieza central del dashboard, identificar qué países están activos esta semana, y navegar a la ficha completa de cualquier país con un click sobre su área en el mapa.

### 11.2 Acceptance criteria

| # | Criterio | Verificación |
|---|---|---|
| AC1 | El mapa ocupa al menos el 60% del viewport central de la home en desktop ≥1024px | Inspect: width del componente del mapa relativo al main content |
| AC2 | Click sobre la zona de cualquier país navega a `/pais/[slug]` | Click en hot-zone de Argentina → URL = `/pais/argentina` |
| AC3 | Hover sobre la zona de un país muestra preview en panel lateral derecho | Hover Brasil → panel se llena con preview |
| AC4 | Las cruces de capitales se mantienen visibles siempre como referencia | Capitales presentes en cualquier estado |
| AC5 | En `/mapa` el comportamiento cambia: click filtra (no navega) | Click en Brasil en `/mapa` → URL = `/mapa?pais=brasil`, query persiste |
| AC6 | Mobile: tap navega directo en home; tap filtra en `/mapa` | Tap en Argentina home → ficha; tap en `/mapa` → filtro |
| AC7 | Países sin análisis publicados se muestran atenuados | Bolivia con 0 análisis → cruz mute, hover sin preview |
| AC8 | Países con análisis nuevos desde `lastVisit` muestran dot dorado | Spec 15 §5.4 — el marker aplica también en el mapa |
| AC9 | Keyboard: Tab cicla entre los 10 países en orden alfabético | Tab desde el sidebar → primer país (Argentina), Tab → Bolivia... |
| AC10 | URL deep-link: `/mapa?pais=brasil` carga con Brasil resaltado | Refresh con esa URL → Brasil destacado al cargar |

---

## 12. Implementación en home dashboard

### 12.1 Posicionamiento como pieza central

Spec 11 §4.5 ya posicionaba el mapa al 60% del ancho. Esta spec lo confirma y agrega el principio: **el mapa es el ancla visual del home, no un widget secundario**. El resto de bloques se organiza alrededor de él, no compite con él.

**Layout desktop ≥1240px:**

```
┌───────┬───────────────────────────────────────┬──────────┐
│       │                                        │          │
│ side  │   ESTA SEMANA · DESORIENTACIÓN         │          │
│ bar   │   carrusel de 5 análisis               │          │
│ 240px │                                        │          │
│       ├───────────────────────────────────────┤          │
│       │                                        │  panel   │
│       │                                        │  lateral │
│       │   ┌────────────────────────────┐      │  derecho │
│       │   │                             │      │  (slide) │
│       │   │   MAPA TORRES GARCÍA        │      │          │
│       │   │   (60% del main content)    │      │  320px   │
│       │   │                             │      │          │
│       │   │   click → /pais/[slug]      │      │  (oculto │
│       │   │   hover → panel lateral     │      │   hasta  │
│       │   │                             │      │   hover) │
│       │   └────────────────────────────┘      │          │
│       │                                        │          │
│       ├───────────────────────────────────────┤          │
│       │                                        │          │
│       │   HEATMAP EJES × 12 SEMANAS            │          │
│       │                                        │          │
│       ├───────────────────────────────────────┤          │
│       │                                        │          │
│       │   CARD ÚLTIMO DESPACHO                 │          │
│       │                                        │          │
│       └───────────────────────────────────────┴──────────┘
```

- **Sidebar**: 240px expandido / 48px colapsado (Spec 15 §7.2).
- **Main content**: container fluido, max-width 1240px.
- **Mapa**: ~60% del main, alto auto según aspect ratio del SVG (1280×1380 → ~52% alto/ancho).
- **Panel lateral derecho**: 320px, position absolute o fixed según diseño, **oculto por default**, slide-in cuando hover sobre un país.

**Layout desktop 960-1239px:**

- Sidebar siempre colapsado a 48px.
- Mapa pasa a 70% del main content.
- Panel lateral derecho se vuelve **drawer modal** (overlay completo en lugar de slide-in lateral).

**Layout tablet 640-959px:**

- Sidebar como drawer (no colapsado-permanente, solo cuando se invoca).
- Mapa full-width del main content.
- Panel lateral se reemplaza: el preview se muestra al pie del mapa, no a un costado. Tap en país muestra preview. Segundo tap navega.

**Layout mobile ≤640px:**

- Sin sidebar persistente. Hamburger o sidebar como drawer (Spec 02 §3.1).
- Mapa full-width del viewport, scroll vertical normal.
- **Sin panel preview**. Tap en país navega directo a `/pais/[slug]`. Single-tap = navegación.

### 12.2 Panel lateral derecho (preview de país)

**Cuándo aparece:** hover sobre la zona de un país por más de 200ms (debounce). Click sobre el país navega antes de que aparezca el panel.

**Anatomía:**

```
┌─────────────────────────┐
│ ARGENTINA               │  ← nombre del país (Alfa Slab One 28px)
│ pregunta central · 1-2  │  ← (Fraunces italic 17px, mute)
│ líneas, fade out al fin │
├─────────────────────────┤
│ EJES ACTIVOS            │  ← mono uppercase 11px
│ [Desorientación]        │  ← axis pills
│ [Estetización]          │
│ [Desrepresentación]     │
├─────────────────────────┤
│ ÚLTIMOS ANÁLISIS · 3    │
│ ▸ El régimen mediático  │  ← cards mini
│   sem 18                │
│ ▸ Mapas que ya...       │
│   sem 12                │
│ ▸ El plebiscito...      │
│   sem 8                 │
├─────────────────────────┤
│ [VER FICHA COMPLETA →]  │  ← CTA primary, click navega
└─────────────────────────┘
```

**Componente:** `<CountryPreviewPanel>`. Recibe `countrySlug` y carga data de:
- Frontmatter del país (`15-Países/[slug].md`)
- Últimos 3 análisis del país (filtrado del corpus)
- Ejes activos en los últimos 90 días

**Estados:**
- **Default**: oculto.
- **Slide-in** (200ms): hover sobre un país.
- **Slide-out** (150ms): mouse leave del mapa O hover sobre otro país.
- **Sticky**: si el lector hace click sobre el panel mismo (no sobre el país), el panel se "fija" hasta que clickee fuera.

### 12.3 Eventos en home

| Evento | Resultado |
|---|---|
| `hover` (200ms) sobre hot-zone de país | Panel lateral slide-in con preview |
| `click` sobre hot-zone | `router.push('/pais/{slug}')` — navega completo |
| `click` sobre cruz de capital | Mismo resultado que click en hot-zone — navega |
| `mouseenter` sobre cruz de capital sin hover sobre hot-zone | Panel preview también aparece |
| Click en `[VER FICHA COMPLETA →]` del panel | Navegación |
| `mouseleave` del componente mapa | Panel slide-out |

### 12.4 Países sin análisis publicados

Si un país tiene 0 análisis publicados:
- Hot-zone existe pero opacity 0.5.
- Cruz de capital opacity 0.5 también.
- Hover muestra panel con texto: "Aún no publicamos análisis sobre [país]. Ver el resto del corpus →" + CTA al archivo `/analisis`.
- Click navega igual a `/pais/[slug]` — la ficha del país muestra estado vacío con su pregunta central + sugerencia de otros países (Spec 16 §8.2).

---

## 13. Implementación en `/mapa`

`/mapa` es la página dedicada de exploración cartográfica. Coexiste con el mapa del home (Spec 15 §7.1 confirmó la dualidad). Mismo SVG, comportamiento distinto.

### 13.1 Layout

```
┌───────┬───────────────────────────────────────────────┐
│       │                                                │
│ side  │   ┌──────────────────────────────────────┐   │
│ bar   │   │                                       │   │
│ 240px │   │   FILTROS LATERALES STICKY            │   │
│ persi │   │   • País: [Argentina ✕] [Brasil ✕]   │   │
│ stent │   │   • Eje: [Desorientación ✕]          │   │
│ colap │   │   • Período: [2026 ✕]                 │   │
│ sable │   │   • Limpiar filtros                   │   │
│       │   │                                       │   │
│       │   ├──────────────────────────────────────┤   │
│       │   │                                       │   │
│       │   │   MAPA (80% del ancho disponible)    │   │
│       │   │   click → filtro (no navega)         │   │
│       │   │   shift+click → suma país al filtro  │   │
│       │   │                                       │   │
│       │   ├──────────────────────────────────────┤   │
│       │   │                                       │   │
│       │   │   RESULTADOS · N ANÁLISIS QUE         │   │
│       │   │   COINCIDEN CON LOS FILTROS           │   │
│       │   │   grid de cards (mismo de Spec 05)    │   │
│       │   │                                       │   │
│       │   └──────────────────────────────────────┘   │
└───────┴───────────────────────────────────────────────┘
```

### 13.2 Eventos en `/mapa`

| Evento | Resultado |
|---|---|
| `click` sobre hot-zone | Toggle filtro de ese país en URL `?pais=...`. Si ya estaba activo, se quita |
| `shift+click` sobre hot-zone | Suma el país al filtro existente (multi-select) |
| `click` sobre eje del filtro lateral | Resalta países con ese eje activo en color del eje (`--mi-axis-{slug}`) sobre el mapa |
| `click` en "Limpiar filtros" | URL queda en `/mapa` puro, todos los países en estado default |
| Doble-click sobre país | Atajo: navega a `/pais/[slug]` (sale del flow de exploración) |

### 13.3 Resaltado por filtros

Cuando hay filtros aplicados:

**Filtro `?pais=argentina&pais=brasil`:**
- Argentina y Brasil con `fill="rgba(192, 83, 46, 0.30)"` (terracota intenso) sobre la silueta.
- Resto de países con opacity 0.5.
- Cruces de capitales: las de Argentina y Brasil con borde adicional en `--mi-brand-gold`.

**Filtro `?eje=desorientacion`:**
- Países con análisis del eje Desorientación con `fill="var(--mi-axis-desorientacion)"` opacity 0.40.
- Países sin análisis de ese eje en opacity 0.5.

**Filtros combinados `?pais=brasil&eje=desorientacion`:**
- Brasil con doble énfasis: fill terracota + axis-color.
- Resto: opacity 0.5.

### 13.4 Resultados al pie

Bajo el mapa, el grid de cards de análisis filtrados (mismo componente que `/analisis` de Spec 05). Permite leer los análisis sin salir de `/mapa`. Click en una card navega a `/analisis/[pais]/[slug]`.

### 13.5 Diferencia clave con home

| Aspecto | Home | `/mapa` |
|---|---|---|
| Tamaño del mapa | 60% del main | 80% del main |
| Filtros | No | Sticky lateral 240px |
| Click en país | Navega a `/pais/[slug]` | Toggle filtro |
| Hover en país | Panel preview slide-in | Highlight + tooltip simple |
| Multi-select | No | Sí (shift+click) |
| Resultados al pie | No | Sí (cards de análisis filtrados) |

---

## 14. Hot-zones poligonales por país

### 14.1 Por qué se necesitan

El SVG actual es un **dibujo continental único**, no un conjunto de polígonos por país con fronteras nacionales. No hay forma de hacer hover/click "sobre Brasil" porque Brasil no es un path independiente — es parte de la silueta.

**Solución**: superponer 10 `<polygon>` invisibles, uno por país, que cubran la región del país en el dibujo. Estos polígonos no se ven (son `fill="transparent"`) pero capturan eventos de mouse/touch.

### 14.2 Anatomía técnica

```xml
<g id="hotzones">
  <polygon id="hot-argentina"
           points="..."
           fill="transparent"
           pointer-events="all"
           tabindex="0"
           role="button"
           aria-label="Argentina, 18 análisis"/>
  <polygon id="hot-brasil" ... />
  ...
</g>
```

Cada polígono:
- `fill="transparent"`: invisible.
- `pointer-events="all"`: aún siendo invisible, captura eventos.
- `tabindex="0"`: navegable por teclado.
- `role="button"`: identificación accesible.
- `aria-label`: lector de pantalla anuncia "Argentina, 18 análisis publicados".

### 14.3 Definición de los 10 polígonos

**Decisión editorial**: igual que las capitales, los polígonos se definen **a ojo** sobre el dibujo simbólico — el dibujo no tiene fronteras nacionales, así que las regiones se delimitan por sentido visual.

**Aproximación de regiones** (en sistema 1280×1380):

| País | Región aproximada |
|---|---|
| Argentina | Cono inferior central-este, desde y≈480 hasta y≈800, x≈400-700 |
| Chile | Franja vertical oeste del cono, x≈250-400, y≈480-900 |
| Uruguay | Zona pequeña sureste, alrededor de la cruz `+`, x≈480-580, y≈480-560 |
| Paraguay | Centro, encima del Brasil, x≈420-650, y≈630-770 |
| Bolivia | Centro-oeste, x≈350-570, y≈730-880 |
| Brasil | Centro-este, parte ancha del dibujo, x≈500-1100, y≈770-1080 |
| Perú | Oeste, x≈250-450, y≈830-1080 |
| Ecuador | Esquina noroeste de la silueta inferior, x≈300-470, y≈1000-1170 |
| Colombia | Norte central, x≈430-700, y≈1010-1170 |
| Venezuela | Norte-este, x≈700-1100, y≈980-1170 |

**Estos rangos son aproximados**: los polígonos reales se dibujan con una herramienta similar a `herramienta-capitales.html` (ver §19 Roadmap), permitiendo arrastrar puntos para definir cada borde.

### 14.4 Solapamientos y prioridad

Si dos polígonos se solapan en una zona, el de Z-index superior (último en el SVG) gana el evento. El orden recomendado en el `<g id="hotzones">`:

1. Países pequeños primero (Uruguay) — quedan abajo, más cobertura visible.
2. Países grandes después (Brasil) — sobre los chicos en zonas no compartidas.

Esto se valida visualmente con la herramienta de definición.

---

## 15. Estados visuales por país

Cada país en el mapa puede estar en uno de estos estados, combinables. Aplican a la hot-zone (fill) y a la cruz de capital (color, borde).

| Estado | Hot-zone | Cruz capital | Cuándo aplica |
|---|---|---|---|
| **Default** | `transparent` | `#c0532e` stroke 5 | País sin interacción y con análisis publicados |
| **Sin análisis** | `transparent`, opacity 0.5 sobre el grupo | opacity 0.5 | País con 0 análisis publicados |
| **Hover** (home) | `rgba(192,83,46,0.15)` (terracota suave) | borde `--mi-brand-gold` 2px | Mouse sobre la zona |
| **Hover** (`/mapa`) | `rgba(192,83,46,0.20)` | borde `--mi-brand-gold` 2px + tooltip "Argentina · 18 análisis" | Mouse sobre la zona |
| **Active** (filtro aplicado) | `rgba(192,83,46,0.30)` | fondo `--mi-brand-gold` (cuadrado tras la cruz) | URL `?pais=...` incluye el país |
| **Eje resaltado** | `var(--mi-axis-{slug})` opacity 0.40 | sin cambio | URL `?eje=...` y país tiene ese eje activo |
| **Focus (keyboard)** | outline 2px `--mi-brand-gold` (sin offset, dentro del polígono visible) | sin cambio | Tab navegación |
| **Followed** (Spec 15 `localStorage.followedCountries`) | sin cambio | dot dorado adicional 6px abajo-izquierda de la cruz | Lector marcó el país como seguido |
| **Nuevo desde `lastVisit`** | sin cambio | dot dorado 8px arriba-derecha de la cruz | Hay análisis publicados desde `lastVisit` |

**Combinaciones:**
- Hover + Active: prevalece Active (la combinación de fills no se aplica — usa Active).
- Eje resaltado + Active: el axis-color domina.
- Focus + cualquier otro: outline siempre sobre los demás.

**Transiciones:**
- Hover/leave: 150ms cubic-bezier(0.2, 0, 0, 1).
- Active toggle: 200ms.
- En `prefers-reduced-motion: reduce`: instantáneo.

---

## 16. Mobile y a11y

### 16.1 Mobile (≤640px)

**Layout:**
- Mapa full-width del viewport.
- Sin sidebar persistente.
- Sin panel lateral derecho.

**Interacciones:**
- En home: `tap` sobre país navega directo a `/pais/[slug]`. Sin preview lateral. La capital y el nombre del país aparecen en un tooltip on-tap por 800ms antes de navegar.
- En `/mapa`: `tap` toggle filtro. Filtros laterales se vuelven drawer (`Filtrar ▾`). Resultados aparecen al hacer scroll abajo del mapa.

**Cruces y labels:**
- A 360-640px: cruces se mantienen (28×28 px en SVG units, escala con viewBox).
- **Labels (`AR · BUENOS AIRES`) se ocultan en mobile** — el espacio no permite leerlos sin overlap. La info aparece en el tooltip al tap.
- Estado decisión §8 #5 confirmado: ocultar labels en mobile.

### 16.2 Accesibilidad

**Keyboard navigation:**
- `Tab` desde el sidebar o desde el viewport entra al primer país (Argentina, alfabético).
- Sucesivos `Tab` ciclan: Argentina → Bolivia → Brasil → Chile → Colombia → Ecuador → Paraguay → Perú → Uruguay → Venezuela.
- `Shift+Tab` cicla en reverso.
- `Enter` o `Space` sobre un país enfocado: equivalente a click (navega en home, filtra en `/mapa`).
- `Esc`: cierra el panel preview si está abierto.

**Focus visible:**
- Outline de 2px `--mi-brand-gold` aplicado al polígono enfocado (visible sobre `transparent`).
- No usa `outline: none` — siempre visible.

**Screen readers:**
- Cada hot-zone con `aria-label="{País}, {N} análisis publicados, último hace {tiempo}"`.
- El SVG tiene `role="img"` + `aria-labelledby` apuntando a un `<title>` interno: "Mapa de Sudamérica invertido con las 10 capitales".
- Los textos manuscritos del SVG (Polo S, Ecuador, etc.) no tienen rol semántico — son decoración.

**Skip link:**
- Al inicio del mapa, link no visible "Saltar al listado de países": va al sidebar (que tiene la lista navegable de los 10 países).

**Contraste:**
- Hover fill `rgba(192,83,46,0.15)` sobre fondo crema = contraste suficiente para usuarios con visión normal, pero **no es la única señal** — el cambio de color de la cruz (borde dorado) refuerza visualmente.
- Para usuarios con baja visión: el outline focus es la señal primaria.

---

## 17. URL state y deep-linking

### 17.1 Estado URL en home

El home **no usa URL state** para el mapa. El panel preview es ephemeral y solo viven en hover/click.

Excepción: si el lector llega desde `/pais/[slug]` y vuelve al home con back button, no se restaura ningún estado del mapa. Es deliberado — el home es overview, no navegación con historia.

### 17.2 Estado URL en `/mapa`

Spec completa de query params:

| Param | Valores | Comportamiento |
|---|---|---|
| `pais` | slug, repetible | `/mapa?pais=argentina&pais=brasil` filtra por esos dos |
| `eje` | slug, repetible | `/mapa?eje=desorientacion` resalta países con ese eje |
| `periodo` | "recientes" \| year (`2025`) \| `todos` | Filtra los análisis mostrados al pie |

Combinación: `/mapa?pais=brasil&pais=argentina&eje=desorientacion&periodo=2026`.

Reglas:
- Toggle vía click sobre el mapa: agrega/quita el país del query.
- Al cargar con URL pre-rellena, el mapa renderiza ya con los estados visuales aplicados.
- "Limpiar filtros" → `router.push('/mapa')` (sin query).
- Back/forward del browser navega por los estados de filtro.

### 17.3 Compartibilidad

`/mapa?pais=brasil&eje=desorientacion` puede pegarse en mensaje y abre con el mismo estado visual. Hace al mapa una herramienta editorial: "Mirá esto: Brasil + Desorientación, mirá los patrones".

---

## 18. Performance e implementación técnica

### 18.1 Cómo se sirve el SVG

**Decisión recomendada: SVG inline en el HTML del componente React**, no como `<img src>`. Razones:

1. **Permite eventos** sobre paths internos (hot-zones, capitales).
2. **Permite cambiar estilos** (fill de hot-zones según estado) con CSS variables.
3. **Sin fetch extra**: el SVG (80 KB) viaja con el HTML del home.
4. Para el OG image y otros usos estáticos: PNG render aparte.

### 18.2 Componente React

```tsx
// platform/frontend/src/components/MapaTorresGarcia.tsx

interface MapaTorresGarciaProps {
  variant: "home" | "explorer";  // home = navegación, explorer = filtros
  filters?: {
    pais?: string[];
    eje?: AxisKey[];
  };
  onCountryClick?: (slug: string) => void;
  onCountryHover?: (slug: string | null) => void;
}

export function MapaTorresGarcia({ variant, filters, onCountryClick, onCountryHover }: ...) {
  // SVG inline con paths del dibujo + hotzones + capitales
  // Estados visuales aplicados según props
  return (
    <svg viewBox="0 0 1280 1380" ...>
      {/* dibujo de Torres García: 34 paths */}
      <g id="dibujo">...</g>
      
      {/* capitales: 10 grupos con id */}
      <g id="capitales">
        <g id="capital-argentina" data-country="argentina">...</g>
        ...
      </g>
      
      {/* hot-zones invisibles */}
      <g id="hotzones">
        <polygon id="hot-argentina"
                 data-country="argentina"
                 className={cn("hotzone", {
                   "is-active": filters?.pais?.includes("argentina"),
                   "is-empty": countryAnalyses.argentina === 0
                 })}
                 onMouseEnter={() => onCountryHover?.("argentina")}
                 onClick={() => onCountryClick?.("argentina")}
                 ... />
        ...
      </g>
    </svg>
  );
}
```

### 18.3 Cómo se monta en home

```tsx
// platform/frontend/src/app/page.tsx

export default function HomePage() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const router = useRouter();
  
  return (
    <main>
      <ThisWeekCarousel />
      
      <div className="map-container">
        <MapaTorresGarcia
          variant="home"
          onCountryClick={(slug) => router.push(`/pais/${slug}`)}
          onCountryHover={setHoveredCountry}
        />
        <CountryPreviewPanel
          countrySlug={hoveredCountry}
          onClose={() => setHoveredCountry(null)}
        />
      </div>
      
      <HeatmapEjesXSemanas />
      <UltimoDespachoCard />
    </main>
  );
}
```

### 18.4 Cómo se monta en `/mapa`

```tsx
// platform/frontend/src/app/mapa/page.tsx

export default function MapaExplorerPage() {
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);
  
  const handleCountryClick = (slug: string) => {
    toggleParam("pais", slug);  // helper que actualiza URL
  };
  
  return (
    <main className="grid grid-cols-[240px_1fr]">
      <FiltrosLaterales filters={filters} />
      <div>
        <MapaTorresGarcia
          variant="explorer"
          filters={filters}
          onCountryClick={handleCountryClick}
        />
        <ResultadosFiltrados filters={filters} />
      </div>
    </main>
  );
}
```

### 18.5 Performance targets

| Métrica | Target |
|---|---|
| Tamaño bundle del componente `<MapaTorresGarcia>` | < 90 KB gzipped (incluye SVG inline) |
| Time to interactive en home | < 2.5s en 4G simulado |
| Hover delay (debounce) | 200ms |
| Animación de panel slide-in | 200ms (60fps target) |
| FCP (First Contentful Paint) home | < 1.8s |
| LCP (Largest Contentful Paint) home — el mapa es candidato a LCP | < 2.5s |

**Optimizaciones:**

1. SVG inline pero con `<path>` agrupados — el browser puede pintar progresivamente.
2. Hot-zones con `pointer-events: none` por default y `pointer-events: all` solo cuando el mapa está visible (intersection observer) — evita capturar eventos antes de tiempo.
3. El panel preview lazy-loads su data: solo fetch del país cuando aparece, no todos los 10 al cargar.
4. El heatmap y el carrusel de la home no bloquean al mapa — orden de prioridad: mapa → carrusel → heatmap.

---

## 19. Roadmap de implementación

### Fase A — Producción del activo (✓ COMPLETA)

Cubierta en §1-§9. Estado: `mapa-con-capitales.svg` listo.

### Fase B — Hot-zones editoriales (1-2 días)

1. Construir herramienta similar a `herramienta-capitales.html` para definir polígonos por país. Mismo paradigma: click sobre el SVG agrega un punto al polígono activo, drag para mover puntos.
2. Definir los 10 polígonos sobre el dibujo simbólico — decisión editorial de Tomás.
3. Exportar el SVG con `<g id="hotzones">` poblado.
4. Preservar la herramienta en `70-Producto/design-system/mapa/herramienta-hotzones.html` para iteraciones futuras.

### Fase C — Componente React (3-5 días)

1. Crear `platform/frontend/src/components/MapaTorresGarcia.tsx` con SVG inline.
2. Implementar estados visuales (§15) controlados por props.
3. Conectar eventos (click, hover, focus) y delegarlos por callbacks.
4. Crear `<CountryPreviewPanel>` con data fetching desde el corpus.
5. Tests unitarios mínimos: renderiza 10 países, eventos disparan callbacks.

### Fase D — Integración en home (1-2 días)

1. Reemplazar el placeholder actual del mapa en `app/page.tsx` con `<MapaTorresGarcia variant="home">`.
2. Conectar al panel preview.
3. Probar layout en desktop / tablet / mobile.
4. Verificar AC1-AC10 (§11.2).

### Fase E — Integración en `/mapa` (2-3 días)

1. Crear `app/mapa/page.tsx` con `<MapaTorresGarcia variant="explorer">`.
2. Implementar filtros laterales (mismo patrón de Spec 05 archivo).
3. URL state con `searchParams` (Next.js).
4. Resultados al pie (cards de análisis filtrados).
5. Verificar comportamiento en mobile (drawer de filtros).

### Fase F — A11y y polish (1 día)

1. Keyboard navigation completa (§16.2).
2. Screen reader testing con NVDA / VoiceOver.
3. Skip link.
4. Contrast testing en todos los estados visuales.
5. `prefers-reduced-motion` respect.

### Fase G — Cierre de bugs Spec 18 (½ día)

1. Verificar B1: mapa funciona en home.
2. Verificar B2: `/mapa` funciona y carga el explorer completo.
3. Smoke test final: navegar de home a `/pais/argentina` vía mapa, volver, ir a `/mapa`, filtrar Brasil + Desorientación, click en una card de resultado.

**Tiempo total estimado**: 9-15 días distribuidos. Bloqueante: Fase B (decisión editorial de polígonos por Tomás).

---

## 20. Glosario

- **Vectorización**: conversión de imagen raster (JPG/PNG) a SVG con paths.
- **AutoTracer**: herramienta web (autotracer.org) usada para la vectorización del original.
- **Hot-zone**: polígono invisible superpuesto al SVG que captura clicks/hover por región.
- **Calibración a ojo**: ubicar elementos sobre el dibujo simbólico por estimación visual, sin coordenadas geográficas reales.
- **`mapa-con-capitales.svg`**: archivo activo del producto. Recortado, con capitales, paleta original de AutoTracer.
- **`herramienta-capitales.html`**: HTML autónomo para iterar las posiciones de las capitales sin tocar código.
- **Variant `"home"` vs `"explorer"`**: el componente `<MapaTorresGarcia>` tiene dos modos de uso. Home = click navega, hover muestra preview. Explorer (`/mapa`) = click filtra, multi-select con shift.
- **Panel preview**: `<CountryPreviewPanel>` que aparece slide-in en hover sobre un país (solo en home).
