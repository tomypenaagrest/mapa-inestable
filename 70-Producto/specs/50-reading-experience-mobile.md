---
spec: 50
titulo: Reading experience mobile — sistema tipográfico y de elementos editoriales calibrado a 360px
estado: lista
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-26
afecta:
  - platform/frontend/src/app/analisis/borradores/[slug]/page.tsx (lectura de borradores diarios)
  - platform/frontend/src/app/publicaciones/[slug]/page.tsx (lectura de publicaciones)
  - platform/frontend/src/app/despachos/[slug]/page.tsx (lectura de despachos)
  - platform/frontend/src/app/ensayos/[slug]/page.tsx (lectura de ensayos)
  - platform/frontend/src/components/ArticleBody.tsx (NUEVO o refactor del existente — componente único que renderiza el cuerpo de cualquier pieza editorial)
  - platform/frontend/src/styles/article.css (NUEVO archivo dedicado al sistema tipográfico de lectura)
  - platform/frontend/src/components/CoverImage.tsx (Spec 37 — agregar variant="in-flow" además de "hero" y "thumb")
  - 70-Producto/design-system/design-system.md (extender §Tokens·Tipografía con la escala mobile-360)
depende_de: [02, 21, 37]
relaciona_con: [Spec 02 (mobile responsive — esta spec profundiza §6 reading), Spec 17 (modelo de contenido de ensayos/publicaciones/país), Spec 22 (mapa — independiente pero comparte design system), Spec 37 (portadas — esta spec define la integración in-flow), EPIC-04 (esta es la primera spec hija)]
prioridad: alta
bloqueante_de: EPIC-04 — define la base tipográfica que Specs 51, 52 reutilizan
desbloquea: lectura cómoda de análisis, despachos y ensayos en mobile (Samsung A54 / 360px de base), con jerarquía editorial visible arriba del fold y sistema de elementos (linkificación, blockquote, pull-quote, imagen, separador, lista) consistente con la identidad "Grabado"
---

# 50 · Reading experience mobile — sistema tipográfico y de elementos editoriales calibrado a 360px

## Resumen ejecutivo

Spec 02 §6 dejó la lectura mobile en estado "funciona": el título se ajusta, las imágenes hacen `max-width: 100%`, el resto "se ve bien sin tocar". Esto alcanza para no romper la página, pero no para sostener lectura de 8-12 minutos sin fatiga visual. EPIC-04 identificó la lectura como una de las cuatro vistas críticas de lanzamiento porque es donde se entrega el producto.

Esta spec define el sistema tipográfico y de elementos editoriales calibrado a **360px de ancho base** (Samsung A54, decidido en EPIC-04 r2), respetando estrictamente el design system "Grabado" del proyecto. **No inventa identidad nueva — calibra a mobile la identidad existente.** Las familias tipográficas (Lora cuerpo, Fraunces títulos, Alfa Slab One display, IBM Plex Mono metadata), la paleta (terracota / papel / verde-negro / dorado), las sombras sólidas sin blur y la prohibición de border-radius siguen vigentes sin modificación.

**Outcome.** Un lector que abre un análisis en su teléfono ve: país en Alfa Slab + título Fraunces + axis pills + lede italic arriba del fold; después la portada in-flow como respiro visual; después el cuerpo Lora 16/1.6 con linkificación trazable, blockquotes con barra terracota, pull-quotes con Fraunces italic, imágenes a sangre, separadores grabados y listas con asterisco terracota. Toda la metadata (fuente, fecha, eje) queda visible — la trazabilidad es estética, no nota al pie.

**Lo que entra en r1:**

- Sistema tipográfico calibrado a 360 (tabla completa de tamaños, line-height, padding lateral).
- Layout del análisis en mobile (orden de elementos arriba del fold, portada in-flow, jerarquía vertical).
- Sistema de elementos editoriales: link externo, link externo con cita corta, wikilink interno, blockquote, pull-quote, imagen a sangre con caption, separador grabado, lista con asterisco terracota, h3 minor.
- Reglas de fallback cuando falta portada, lede o axis pills.
- Comportamiento del subtítulo largo (lede de más de 2 líneas).
- Validación contra 390 y 412 (devtools) declarada como parte del done.

**Lo que NO entra en r1:**

- Footnotes / notas al pie. No las usa el corpus actual; se agregan en r2 si aparecen.
- Inline code o términos técnicos en monoespaciada dentro del cuerpo. Improbable en análisis político; se agregan en r2 si aparecen.
- Tablas en el cuerpo del análisis. Improbable mobile; si aparecen, scroll horizontal con tratamiento mínimo — definición se difiere.
- Scroll progress indicator (barra de progreso de lectura arriba). Posible adición post-lanzamiento; no es bloqueante.
- Modo lectura/dark mode. Diferido a post-lanzamiento.
- Variantes de la página de país (`/pais/[slug]`) — pertenecen a Spec 52.
- Variantes de la home (`/`) — pertenecen a Spec 51.

---

## Estado actual

### En el design system

`70-Producto/design-system/design-system.md` declara la escala tipográfica para desktop (base 17, h1 52, display 110, etc.). No declara escala mobile. `design-tokens.css` tiene los tokens base pero los componentes los aplican uniformes a todos los breakpoints, lo que en 360 da titulares que rompen y body que se ve "como si fuera el desktop achicado".

### En el frontend

- Las páginas de detalle (`/analisis/borradores/[slug]`, `/publicaciones/[slug]`, etc.) usan los tokens del design system sin override para mobile.
- No existe `ArticleBody.tsx` ni `article.css` — el cuerpo del artículo se renderiza inline en cada page con clases Tailwind sueltas.
- La portada (Spec 37) tiene variantes `thumb` (3:2 chico para grillas) y `hero` (3:2 grande para detalle). El comportamiento `hero` actualmente es a sangre arriba del título — esta spec lo cambia a in-flow en mobile (manteniendo hero a sangre opcional en desktop).
- Las citas con link externo (frecuentes en análisis: `[Infobae, 4 may 2026](url)`) hoy se renderizan como link tinta subrayado uniforme, sin diferenciación tipográfica que las distinga del cuerpo.
- Los wikilinks `[[../10-Ejes/04 - Estetización|estetización]]` del vault se renderizan con el mismo estilo que los links externos — sin diferenciación.

### Mockups validados en sesión de Cowork (2026-05-26)

- **Variante A** del sistema tipográfico (body 16 / lh 1.6 / h1 30 / h2 22 / padding 20) elegida sobre Variantes B (premium reading 18/1.65) y C (denso purista 17/1.55).
- **Portada in-flow** (Opción 2) elegida sobre hero a sangre (Opción 1) y híbrida overlay (Opción 3).

Ver §9 (Maqueta) para los mockups en sí.

---

## Propuesta

### 1. Sistema tipográfico calibrado a 360px

Extensión de la tabla de tokens del design system, agregando columna mobile-360. Los tokens existentes mantienen sus valores desktop.

| Token | Familia | Desktop (existente) | Mobile-360 (esta spec) | Line-height | Uso |
|---|---|---|---|---|---|
| `--mi-text-display` | Alfa Slab One | 110px | **44px** | 1.0 | Country name en hero (`BOLIVIA`) |
| `--mi-text-h1` | Fraunces 600 | 52px | **30px** | 1.15 | Título del análisis |
| `--mi-text-h2` | Fraunces 600 | 36px | **22px** | 1.20 | Sección interna del análisis |
| `--mi-text-h3` | Fraunces 600 | 28px | **18px** | 1.25 | Subsección |
| `--mi-text-lede` | Lora italic | 19px | **18px** | 1.50 | Subtítulo / bajada del análisis |
| `--mi-text-body` | Lora 400 | 17px | **16px** | 1.60 | Cuerpo |
| `--mi-text-meta` | IBM Plex Mono 400 uppercase | 13px | **11px** | 1.40 | Metadata (fecha, fuente, lectura) |
| `--mi-text-caption` | IBM Plex Mono 400 uppercase | 13px | **11px** | 1.40 | Caption debajo de imagen |
| `--mi-text-pill` | IBM Plex Mono 500 uppercase | 11px | **10px** | 1.0 | Axis pill |

**Padding lateral del cuerpo de lectura:** `20px` en mobile (sobre 360 → 320 de ancho útil de texto → ~37 caracteres por línea Lora 16). En desktop, mantiene los valores actuales.

**Margen vertical entre párrafos:** `16px` (espacio de respiro suficiente sin perder densidad, en línea con principio "densidad es virtud" del design system).

**Margen vertical antes de h2:** `28px`. Antes de h3: `22px`. Después de h2: `12px`. Después de h3: `8px`.

**Espacio inter-bloques editoriales** (figure, blockquote, pull-quote, separador): `20-24px` arriba y abajo, declarado por elemento.

### 2. Layout del análisis en mobile

Orden vertical fijo arriba del fold y siguiente:

```
[country name — Alfa Slab 44px]
[h1 — Fraunces 30px]
[meta bar — 1px border top+bottom, mono 11px]
  · Publicado · [fecha]
  · Lectura · [N min]
[axis pills row — 1-3 pills lado a lado]
[lede — Lora italic 18px]
[portada — in-flow, aspect 3:2, padding lateral igual al body]
[caption — mono 11px uppercase]
[body — Lora 16px / 1.6]
  ↓
[h2, body, ...]
```

**Decisión clave:** La portada NO va arriba del país. NO va arriba del fold. Aparece después del lede, dentro del flujo, con padding lateral igual al texto. Caption mono debajo. Aspect ratio 3:2 (consistente con `cover_image` de Spec 37).

**Caso especial** (no estándar): si una pieza editorial es declarada `featured: true` en frontmatter, la portada puede subir a hero a sangre arriba del fold. Bandera reservada para análisis de despachos especiales o piezas insignia. Para el lanzamiento de julio se reserva sin uso activo — todo el corpus inicial va con portada in-flow.

### 3. Sistema de elementos editoriales

#### 3.1. Link externo simple (sobre frase)

Inline en el cuerpo Lora. Subrayado sólido tinta (`--mi-ink`) de 1.5px, offset 3px del baseline. Color del texto = `--mi-ink` (mismo que el body — no se diferencia por color, solo por subrayado).

```html
El programa se vendió bajo un slogan: <a class="article-link" href="…">"capitalismo para todos"</a>.
```

#### 3.2. Link externo con cita corta (al final de oración)

Patrón frecuente en los análisis: link a una fuente periodística al final de una frase. Aparece en IBM Plex Mono 11px uppercase, entre corchetes, color `--mi-ink-mute`, subrayado 1px offset 2px. Visualmente "se aleja" del flujo Lora para señalar metadata.

```html
…llegaron a la sede de gobierno tras caminar mil kilómetros 
<a class="article-cite" href="…">[Infobae · 4 may 2026]</a>.
```

#### 3.3. Wikilink interno (a un eje, a otra publicación, a un autor)

Link a contenido interno del proyecto. Color `--mi-bg-warm` (terracota oscuro), subrayado punteado 1.5px offset 3px, peso 500. Visualmente "más caliente" que el link externo — señala navegación adentro del corpus.

```html
Acá aparece el cruce con el eje de la 
<a class="article-wikilink" href="/ejes/estetizacion">estetización</a> 
que organiza este proyecto.
```

#### 3.4. Blockquote

Para citas externas o reformulaciones de párrafos. Barra lateral terracota (`--mi-bg-warm`) de 4px, padding-left 16px. Familia Lora italic 16px, color `--mi-ink-soft`, line-height 1.55. Margen vertical 20px.

```html
<blockquote class="article-blockquote">
  "Capitalismo para todos" no es una ideología. Es una promesa formal de inclusión sin contenido sustantivo.
</blockquote>
```

#### 3.5. Pull-quote

Para frases protagónicas del propio análisis que el autor quiere amplificar. Fraunces 600 italic 22px, line-height 1.30, color `--mi-ink`, doble borde horizontal (top y bottom 2px tinta), padding 16px verticales. Margen vertical 28px. Opcionalmente con `--mi-pullquote-attr` debajo en mono 11px uppercase color `--mi-ink-mute`.

```html
<div class="article-pullquote">
  "La COB de 2026 es una mediación sin matriz. Funciona como bloqueo pero no como representación."
  <span class="article-pullquote-attr">Cita interna · destacable</span>
</div>
```

#### 3.6. Imagen a sangre (dentro del cuerpo)

`<figure>` con margen lateral negativo igual al padding del body (–20px). La imagen ocupa todo el ancho del phone (360). Aspect ratio sugerido 3:2. Caption en IBM Plex Mono 11px uppercase color `--mi-ink-mute`, padding lateral 20px (vuelve al padding del body), margen superior 8px.

```html
<figure class="article-figure">
  <img src="…" alt="…" />
  <figcaption>Marcha amazónica frente a la sede de gobierno · La Paz · 4 may 2026</figcaption>
</figure>
```

#### 3.7. Separador grabado

Entre dos sub-bloques temáticos dentro de la misma sección h2. No usar entre h2's (las h2 ya separan). Aparece como dos rayas horizontales de 1px tinta con un asterisco dorado central (Alfa Slab One 20px color `--mi-brand-gold`). Margen vertical 28px.

```html
<hr class="article-separator" aria-hidden="true">
```

#### 3.8. Lista con asterisco terracota

`<ul class="article-list">`. Sin bullet nativo del navegador. Bullet custom: asterisco Alfa Slab 16px color `--mi-bg-warm` posicionado en hanging indent. Items en Lora 16 / 1.55, padding-left 22px relativo a un position relative del `<li>`, margen 10px entre items.

```html
<ul class="article-list">
  <li>La mediación política se vacía simbólicamente arriba.</li>
  <li>La mediación social pierde su matriz cultural abajo.</li>
  <li>La mediación atencional ya no importa contenido que no existe.</li>
</ul>
```

### 4. Header del análisis: detalles

#### 4.1. Country name (Alfa Slab 44px)

Display de identidad. Texto del país con primera letra mayúscula (no all-caps — Alfa Slab ya tiene aire monumental). `letter-spacing: -0.01em` para compactar. Margen inferior 0 (el h1 sigue inmediato).

#### 4.2. H1 del análisis

Fraunces 600, 30px, line-height 1.15. Sin uppercase. Margen 14px arriba, 12px abajo. No tiene número de orden ni icono — el peso visual lo da Fraunces sola.

#### 4.3. Meta bar

Borde top + bottom 1px `--mi-ink`. Padding vertical 10px. Display flex con gap 12px y `flex-wrap: wrap` (si no entra en una línea, hace wrap). Cada item en mono 11px uppercase, color `--mi-ink-mute` para etiqueta, `--mi-ink` para valor. Separador interno con punto centrado mono (`·`).

Items mínimos en r1:
- `Publicado · [fecha]`
- `Lectura · [N min]` (calculado desde word count del cuerpo, ~250 palabras/min)

Items opcionales (si están en frontmatter):
- `Fuente · [medio]` (cuando aplique — algunos análisis sí tienen fuente atribuible además del autor)
- `Autor · [nombre]` (cuando aplique)

#### 4.4. Axis pills row

Display flex con gap 6px. Cada pill: mono 500 10px uppercase, padding 3-4px verticales × 8-9px horizontales, color de fondo del eje según `design-system.md §Color por eje`, texto crema (`--mi-bg-paper`) excepto en `--mi-axis-atencion` (dorado pálido) donde el texto pasa a tinta. Sin border-radius (cero).

Si la pieza tiene 4+ ejes activados, las pills hacen wrap automáticamente.

#### 4.5. Lede

Lora italic 400, 18px, line-height 1.50, color `--mi-ink-soft`. Margen 0 arriba (el axis row ya separó), 18px abajo.

Si el lede excede 4 líneas en 360, se mantiene completo — no se corta. El lede es elemento editorial, no chrome de UI.

### 5. Casos de fallback

**Sin `cover_image` en frontmatter.** No se renderiza la portada ni el caption. El cuerpo arranca directo después del lede. (No se reemplaza por `<CoverPlaceholder>` en mobile — la pieza simplemente no muestra portada.)

**Sin axis pills.** No se renderiza la fila. El lede aparece directo bajo la meta bar.

**Sin lede.** No se renderiza. La portada (si existe) aparece directo bajo la axis row, o bajo la meta bar si no hay pills.

**Sin meta `Lectura · N min`.** Se calcula al build del sitio. Si falla el cálculo, se omite (no se muestra "0 min"). El item `Publicado` es obligatorio.

### 6. Notas para implementación en VS Code

- **Crear `ArticleBody.tsx`** como componente único que recibe el `markdown` body parseado y aplica las clases del sistema. Idealmente con un plugin remark/rehype que mappea los nodos AST a clases (`<a class="article-cite">` cuando el link es a un dominio externo y el texto del link arranca con `[`, `<a class="article-wikilink">` cuando el href arranca con `/ejes/`, `/pais/`, `/autores/`, `/conceptos/`, `/publicaciones/`, `/analisis/`, etc.).
- **Crear `article.css`** dedicado, importado solo en las páginas de lectura. Mantener fuera del CSS global para evitar pesar el bundle del home y el mapa.
- **Adaptar `CoverImage.tsx`** (Spec 37): agregar `variant="in-flow"` con aspect ratio 3:2 y padding lateral 0 (vive dentro del contenedor de article con su propio padding). Las variantes `thumb` y `hero` se mantienen para grillas y para uso explícito `featured: true`.
- **Frontmatter:** agregar campo opcional `featured: boolean` para habilitar hero a sangre por excepción. Si falta, default `false` → portada in-flow.
- **Validación:** correr Lighthouse mobile en throttling 4G slow sobre 3 análisis distintos del corpus (Bolivia, Argentina sin cruzadas, otro a elección) en Samsung A54 real, antes de marcar Spec como implementada-completa. Bundle del article CSS no debe superar 8KB gzipped.

### 7. Cross-refs y actualizaciones a otros documentos

- `70-Producto/design-system/design-system.md` — extender §Tokens·Tipografía con la columna "Mobile-360" de la tabla §1. Agregar nota sobre padding lateral del article container.
- `70-Producto/specs/02-mobile-responsive.md` — agregar nota al final de §6 declarando que Spec 50 reemplaza esta sección para el caso de lectura de análisis/publicaciones/despachos/ensayos. Otras pantallas siguen con Spec 02.
- `70-Producto/specs/37-portadas-en-el-sitio.md` — nota al pie indicando que en mobile la variante `hero` se sustituye por `in-flow` por default, con excepción para piezas `featured: true`. Esto no requiere cambio de schema de Spec 37.

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| Tabla tipográfica mobile-360 calibrada | Footnotes |
| Layout vertical del análisis | Inline code monoespaciado |
| Linkificación 3 patrones (ext, ext-cita, wiki) | Tablas en cuerpo |
| Blockquote, pull-quote | Scroll progress indicator |
| Imagen a sangre con caption | Modo lectura / dark mode |
| Separador grabado, lista asterisco | Página de país (Spec 52) |
| Portada in-flow, caption | Home (Spec 51) |
| Fallbacks sin portada/lede/axis | Touch handlers del mapa (Spec 49) |
| Validación contra 390 y 412 | Performance budget detallado (Spec 54) |

---

## Maqueta

Los mockups validados en sesión de Cowork 2026-05-26 están registrados en los widgets HTML inline de esa conversación. Resumen de las 4 vistas mockeadas:

| Vista | Qué validó |
|---|---|
| Tres variantes tipográficas A/B/C, side-by-side a 360px | Elección de Variante A (16/1.6/30/22/padding 20) |
| Variante A con todos los elementos editoriales | Aprobación de linkificación, blockquote, pull-quote, imagen a sangre, separador, lista |
| Comparativa portada: hero a sangre / in-flow contenida / híbrida overlay | Elección de in-flow contenida (Opción 2) |

Las maquetas se pueden regenerar desde Cowork siguiendo el prompt `70-Producto/prompts-product-design/spec-50-reading.md` (subproducto reutilizable, ver Spec §11).

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Crear `platform/frontend/src/styles/article.css` con todas las clases (`article-link`, `article-cite`, `article-wikilink`, `article-blockquote`, `article-pullquote`, `article-figure`, `article-separator`, `article-list`) | 2-3h | — |
| 2 | Crear `ArticleBody.tsx` con plugins remark/rehype que mappean nodos a clases | 3-4h | tarea 1 |
| 3 | Adaptar `CoverImage.tsx` con `variant="in-flow"` | 1h | — |
| 4 | Refactorizar `/analisis/borradores/[slug]/page.tsx` para usar `ArticleBody` y respetar el layout vertical de §2 | 2h | tareas 1, 2, 3 |
| 5 | Aplicar a `/publicaciones/[slug]/page.tsx`, `/despachos/[slug]/page.tsx`, `/ensayos/[slug]/page.tsx` | 1.5h | tarea 4 |
| 6 | Validar visualmente en Samsung A54 real + emular 390 y 412 en devtools | 1h | tarea 5 |
| 7 | Lighthouse mobile en 3 análisis. Bundle check sobre article CSS | 1h | tarea 6 |
| 8 | Cross-refs: actualizar `design-system.md`, anotar `Spec 02 §6` y `Spec 37` | 30min | — |

**Estimación total:** 12-14 horas de implementación bien hechas (1.5-2 días de trabajo).

**Orden de implementación:** secuencial. Hay overlap conceptual entre tareas 1-2 pero conviene resolver el CSS primero (tarea 1) para que el componente (tarea 2) pueda usar las clases ya definidas y verificarlas en hot reload.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-26 | Creación de la spec en estado `lista`. Decisiones tomadas en sesión de Cowork con mockups HTML inline | Primera spec hija de EPIC-04. Calibró el sistema tipográfico del proyecto a 360px sin reinventar identidad. Decisión Abierta #3 del epic (portada in-flow) cerrada en la misma sesión |
