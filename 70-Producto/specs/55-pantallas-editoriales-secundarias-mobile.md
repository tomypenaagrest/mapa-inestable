---
spec: 55
titulo: Pantallas editoriales secundarias mobile — conceptos, autores, acerca, método (3 patrones reutilizables)
estado: lista
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-27
afecta:
  - platform/frontend/src/app/conceptos/page.tsx (índice — Patrón 1)
  - platform/frontend/src/app/concepto/[slug]/page.tsx (detalle — Patrón 2)
  - platform/frontend/src/app/autores/page.tsx (índice — Patrón 1)
  - platform/frontend/src/app/autor/[slug]/page.tsx (detalle — Patrón 2)
  - platform/frontend/src/app/acerca/page.tsx (estática — Patrón 3)
  - platform/frontend/src/app/metodo/page.tsx (estática — Patrón 3)
  - platform/frontend/src/components/GlosarioIndex.tsx (NUEVO — Patrón 1 reutilizable conceptos + autores)
  - platform/frontend/src/components/GlosarioItem.tsx (NUEVO — item del índice)
  - platform/frontend/src/components/EditorialShortDetail.tsx (NUEVO o adaptación — Patrón 2 reutilizable concepto + autor)
  - platform/frontend/src/components/StaticPage.tsx (NUEVO o adaptación — Patrón 3 reutilizable acerca + método)
  - platform/frontend/src/styles/editorial-secondary.css (NUEVO o refactor)
depende_de: [07, 20, 50, 53]
relaciona_con: [Spec 07 (puente vault → sitio, define cómo se generan /concepto y /autor desde el vault), Spec 20 (sidebar autores y conceptos), Spec 50 (sistema tipográfico aplicado al cuerpo de los detalles), Spec 53 (header común mobile con drawer ☰), EPIC-04 (séptima spec hija, sumada al scope original)]
prioridad: media-alta
bloqueante_de: AE de cobertura del epic (que /acerca sea legible en mobile es condición de lanzamiento — el lector nuevo desde WhatsApp va a /acerca antes que a cualquier otra cosa)
desbloquea: cobertura mobile completa del corpus editorial secundario sin romper el desktop existente, con 3 patrones reutilizables que escalan a futuras pantallas de la misma familia
---

# 55 · Pantallas editoriales secundarias mobile — conceptos, autores, acerca, método

## Resumen ejecutivo

EPIC-04 r1 declaró explícitamente fuera de scope las "vistas secundarias profundas (archivo, página de eje, página de autor, página de concepto)" — quedaban con responsive parcheado de Spec 02 hasta post-lanzamiento. En sesión de 2026-05-27, Tomás identificó que **/acerca y /conceptos** son condición real del lanzamiento: el lector nuevo que llega desde WhatsApp o Substack abre /acerca antes que ninguna otra cosa para entender qué es el proyecto, y desde el drawer del header (Spec 53) los conceptos son uno de los 5 destinos del corpus.

Esta spec **expande el scope del epic** sumando 6 pantallas en 3 patrones reutilizables:

| Patrón | Pantallas que cubre | Reutilización |
|---|---|---|
| **1 · Índice de glosario** | `/conceptos`, `/autores` | Mismo componente con dato distinto |
| **2 · Detalle editorial corto** | `/concepto/[slug]`, `/autor/[slug]` | Reusa sistema tipográfico de Spec 50 |
| **3 · Página estática manifiesto** | `/acerca`, `/metodo` | Mismo layout, contenido editorial distinto |

Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-27) sobre los 3 patrones simultáneos. Todas aprobadas como propuestas.

**Outcome.** Un lector que llega desde WhatsApp y tap-ea en "Acerca" desde el drawer ve: header de Mapa Inestable → hero terracota con manifiesto (pregunta central del proyecto en Fraunces italic) → secciones apiladas (hipótesis, los 6 ejes con pins de color, el método). Si en lugar de eso navega a "Conceptos", ve: header → page header con label + h1 + bajada → meta row con count + última actualización → lista vertical de items con título Fraunces, tag mono terracota, descripción Lora italic. Si tap-ea en un concepto específico, ve: header → tag mono + h1 Fraunces 28 + meta row + `web_intro` italic + cuerpo del .md + chips de análisis donde aparece citado.

**Lo que entra en r1:**

- Tres componentes reutilizables (`GlosarioIndex`, `EditorialShortDetail`, `StaticPage`).
- Aplicación de los 3 patrones a las 6 pantallas declaradas.
- Reuso del sistema tipográfico de Spec 50 en el patrón 2.
- Reuso del header con drawer de Spec 53 en las 6 pantallas.
- Sistema de "Aparece en" / "Citado en" para el patrón 2 (lista de análisis donde se referencia el concepto o autor).
- Estilos en `editorial-secondary.css` dedicado (no contamina globals).

**Lo que NO entra en r1:**

- Pantallas adicionales fuera de las 6 declaradas (`/ejes/[slug]`, `/comparar/[indicador]`, `/leer-despues`, `/pipeline`). Spec 02 §1 + Spec 02 §5 las cubren con responsive básico hasta post-lanzamiento.
- Búsqueda interna desde el índice (filtrar conceptos por texto). Diferido — el lector va al `/buscador` global.
- Imágenes thumb en los items del índice. Decisión deliberada — el proyecto se diferencia visualmente por densidad textual, no por grilla de cards con imagen.
- Filtros por eje en `/conceptos` (filtrar conceptos que activan tal eje). Diferido — el tag de eje aparece en cada item y es link, pero no hay filtro multi-select.
- Línea de tiempo en `/metodo` o `/acerca`. Spec 16 §12.4 había dejado abierto si se sumaba `<TimelineHorizontal>`; esta spec confirma que NO en r1.
- Edición de las páginas estáticas desde admin. Spec 07 ya cubre la generación desde el vault.

---

## Estado actual

### En el frontend

Las 6 rutas existen como archivos `page.tsx` en `platform/frontend/src/app/`. Todas renderizan en desktop con el layout de Spec 02 (grid o stack vertical básico) y caen a versiones colapsadas en mobile sin jerarquía pensada.

### En el vault

- `35-Conceptos-clave/` tiene ~15 fichas (3-5 con `publicar: true` según Spec 07).
- `30-Autores/` tiene ~13 fichas (3-5 con `publicar: true`).
- `/acerca` y `/metodo` no se generan desde el vault — son páginas estáticas editadas directamente en el código (decisión histórica del proyecto, fuera de Spec 07).

### En las specs anteriores

- **Spec 07** definió la generación de `/concepto/[slug]` y `/autor/[slug]` desde el vault con flag `publicar: true` + opcional `web_intro` + opcional `web_image`. Esta spec NO modifica ese pipeline — solo define cómo se renderiza el contenido en mobile.
- **Spec 20** definió los módulos del sidebar (Autores, Conceptos). Spec 53 ya migró esos módulos al drawer mobile. Esta spec NO modifica nada del sidebar/drawer — solo las pantallas destino de tap.

### Mockups validados en sesión de Cowork (2026-05-27)

Tres patrones visualizados side-by-side:
- Patrón 1: índice de glosario con 3 items reales del vault (Tradición inventada, Trampa territorial, Hegemonía).
- Patrón 2: detalle de "Trampa territorial" con `web_intro` + body + "Aparece en" al pie.
- Patrón 3: /acerca con hero manifiesto + sección hipótesis + sección "Los 6 ejes" con pins de color.

Todos aprobados como propuestas.

---

## Propuesta

### 1. Patrón 1 — Índice de glosario (`/conceptos`, `/autores`)

Anatomía vertical mobile 360:

```
┌─────────────────────────────────┐
│ HEADER (Spec 53)                │ ← 44px sticky
├─────────────────────────────────┤
│ Glosario                        │ ← label mono 11
│ Conceptos                       │ ← h1 Alfa Slab 36
│ El andamiaje teórico que…       │ ← bajada Fraunces italic 16
├─────────────────────────────────┤
│ 15 conceptos · última act. 22 may │ ← meta row mono 11
├─────────────────────────────────┤
│ EJE · Erosión de mediaciones    │ ← tag mono 10 color terracota
│ Tradición inventada             │ ← título Fraunces 22
│ Hobsbawm: prácticas sociales…   │ ← desc Lora italic 14
│ Citado en 6 análisis →          │ ← meta mono 10
├─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┤
│ EJE · Desorientación            │
│ Trampa territorial              │
│ Agnew: la fijación analítica…   │
│ Citado en 4 análisis →          │
└─────────────────────────────────┘
```

**Tokens:**

| Elemento | Token / Valor mobile-360 |
|---|---|
| Page header padding | 24px arriba, 18px abajo, 20px lateral |
| Label de sección ("GLOSARIO") | mono 11px uppercase letter-spacing 0.1em color mute |
| H1 ("Conceptos") | Alfa Slab One 36px line-height 1.05 letter-spacing -0.01em |
| Bajada | Fraunces 400 italic 16px line-height 1.4 color tinta-soft |
| Meta row (count + última act.) | mono 11px uppercase, padding 14px arriba 10px abajo, borde bottom 1px tinta |
| Item separator | 1px dashed `--mi-rule-soft` |
| Item padding | 16px lateral 20px |
| Item tag de eje | mono 10px uppercase color terracota oscuro `--mi-bg-warm` |
| Item título | Fraunces 600 22px line-height 1.15 color tinta |
| Item descripción | Lora 400 italic 14px line-height 1.45 color tinta-soft |
| Item meta ("Citado en N") | mono 10px uppercase color mute, flecha → al final |

**Comportamiento:**

- Tap en cualquier parte del item → navega a `/concepto/[slug]` o `/autor/[slug]`.
- Tap target = todo el item (alto > 44px asegurado por padding).
- Tap en el tag de eje (mono 10 terracota) → navega a `/ejes/[slug]` (sale del índice de conceptos). Es link distinto del item — tap precisa.

**Decisión deliberada — SIN imágenes thumb en los items.** El proyecto se diferencia visualmente por densidad textual ("esto no es Medium"). Una grilla de cards con thumb genérico empuja al sitio hacia un patrón blog que no es lo que somos. El `web_image` opcional (Spec 07) se usa SOLO en la página de detalle como hero, no en el índice.

**Orden de los items:** alfabético por título. No hay orden editorial curado. Si el corpus crece y se vuelve útil, se puede agregar agrupación por eje en una iteración futura.

**Estado vacío** (improbable pero por las dudas): "Glosario en construcción. Próximamente disponible." en mono 11 color mute, centrado.

### 2. Patrón 2 — Detalle editorial corto (`/concepto/[slug]`, `/autor/[slug]`)

Reusa el sistema tipográfico de Spec 50 con adaptaciones para contenido editorial corto (no análisis largo).

Anatomía:

```
┌─────────────────────────────────┐
│ HEADER (Spec 53)                │ ← 44px sticky
├─────────────────────────────────┤
│ EJE · Desorientación epist.     │ ← tag mono 10 color terracota
│ Trampa territorial              │ ← h1 Fraunces 28
│ Autor · John Agnew              │ ← meta mono 11
│ Citado en · 4 análisis          │
├─────────────────────────────────┤
│ La fijación analítica al        │ ← web_intro Lora italic 18
│ Estado-nación como unidad       │
│ obvia obstruye ver lo que…      │
├─────────────────────────────────┤
│ Agnew formula el concepto en    │ ← body Lora 16/1.6
│ Geopolitics… (1998). Argumenta  │
│ que la disciplina hereda…       │
│                                 │
│ Cómo aparece en este proyecto   │ ← h2 Fraunces 22
│ La trampa territorial es el     │
│ ancla del eje desorientación…   │
├─────────────────────────────────┤
│ APARECE EN                      │ ← label mono 10 sobre crema apagado
│ [chip] [chip] [chip]            │ ← chips mono 10 borde 1px tinta
└─────────────────────────────────┘
```

**Tokens:**

| Elemento | Token / Valor mobile-360 |
|---|---|
| Contenido padding | 22px arriba 16px abajo, 20px lateral |
| Tag de eje superior | mono 10px uppercase letter-spacing 0.08em color terracota oscuro |
| H1 (título del concepto/autor) | Fraunces 600 28px line-height 1.15 color tinta |
| Meta row | mono 11px uppercase letter-spacing 0.08em color mute (etiqueta) + tinta (valor), border-top + border-bottom 1px tinta, padding 10px vertical, flex gap 12 con wrap |
| `web_intro` | Lora 400 italic 18px line-height 1.5 color tinta-soft, margen 18px vertical |
| H2 | Fraunces 600 22px line-height 1.2 margen 24px arriba 12px abajo |
| Body | **Reusa Spec 50** — Lora 16/1.6 |
| Bloque "Aparece en" | fondo cream apagado `--mi-bg-cream`, border-top 2px tinta, padding 18px lateral 20px |
| Label "APARECE EN" | mono 10px uppercase letter-spacing 0.08em color mute |
| Chips de análisis | mono 10px uppercase, padding 3px 8px, borde 1px tinta, fondo transparente, color tinta |

**Sistema de elementos editoriales** (linkificación interna/externa, blockquote, etc.): **idéntico a Spec 50**. El detalle de concepto/autor es contenido editorial corto pero respeta los mismos patrones que un análisis.

**Diferencias con Spec 50 lectura:**

- Sin portada in-flow (decisión deliberada — los conceptos no se ilustran). Si `web_image` está en el frontmatter, se renderiza in-flow después del `web_intro` con caption.
- Sin axis pills row (el eje aparece como tag superior, no como pill row).
- Sin reading time (es corto).
- H1 a 28 en lugar de 30 (es contenido más sobrio que un análisis insignia).

**Bloque "Aparece en":**

- Lista de chips con título del análisis donde se cita el concepto/autor.
- Datos vienen de un cruce build-time entre los wikilinks `[[../35-Conceptos/Trampa territorial]]` en los frontmatters / cuerpos de los análisis + el slug del concepto actual.
- Chip = link a `/analisis/.../[slug]` o `/publicaciones/[slug]` según corresponda.
- Si hay > 6 chips, mostrar los 6 más recientes con "Ver todos →" al final.
- Si hay 0 chips: omitir el bloque entero.

**Comportamiento:**

- Tap en el tag de eje superior → navega a `/ejes/[slug]`.
- Tap en chips de "Aparece en" → navega al análisis correspondiente.
- Sin scroll progress (es corto, no se necesita).

### 3. Patrón 3 — Página estática manifiesto (`/acerca`, `/metodo`)

Anatomía:

```
┌─────────────────────────────────┐
│ HEADER (Spec 53)                │ ← 44px sticky
├─────────────────────────────────┤
│ Cartografía política del sur    │ ← mark mono 10 color tinta
│ Acerca                          │ ← h1 Alfa Slab 36
│ ¿Cómo se sostiene la vida       │ ← manifest Fraunces italic 19
│ democrática cuando se debilitan │
│ las mediaciones…?               │
│                                 │ ← FONDO TERRACOTA C5663A
├─────────────────────────────────┤
│ LA HIPÓTESIS                    │ ← label mono 10
│ Transición sin reemplazo        │ ← h2 Fraunces 22
│ Las estructuras que organizaban │ ← body Lora 16/1.6
│ la vida colectiva pierden…      │
├─────────────────────────────────┤
│ LOS 6 EJES                      │
│ El sistema conceptual           │
│ • Deculturación                 │ ← lista mono 12 uppercase con pin de color
│ • Erosión de mediaciones        │
│ • Desrepresentación             │
│ • Estetización                  │
│ • Desorientación epistemológica │
│ • Atención (transversal)        │
├─────────────────────────────────┤
│ EL MÉTODO                       │
│ Cuatro pasos                    │
│ 1. Disparador                   │
│ 2. Desplazamiento               │
│ 3. Conceptualización            │
│ 4. Apertura                     │
└─────────────────────────────────┘
```

**Tokens:**

| Elemento | Token / Valor mobile-360 |
|---|---|
| Hero padding | 28px arriba 22px abajo, 20px lateral |
| Hero background | terracota `--mi-bg` (`#C5663A`) |
| Hero border-bottom | 2px tinta |
| Mark superior ("CARTOGRAFÍA POLÍTICA DEL SUR") | mono 10px uppercase letter-spacing 0.1em color tinta |
| Hero h1 ("Acerca", "Método") | Alfa Slab One 36px line-height 1.05 color tinta |
| Manifest (pregunta central) | Fraunces 600 italic 19px line-height 1.35 color tinta |
| Section padding | 24px lateral 20px |
| Section border-bottom | 1px tinta |
| Section label ("LA HIPÓTESIS") | mono 10px uppercase letter-spacing 0.1em color mute |
| Section h2 | Fraunces 600 22px line-height 1.2 color tinta |
| Section body | Lora 16px line-height 1.6 color tinta (Spec 50) |
| Lista de ejes (en /acerca) | mono 12px uppercase letter-spacing 0.06em, padding 8px vertical por item, border-bottom 1px dashed, pin de color 10×10px del eje |
| Lista de pasos del método (en /metodo) | Lora 16px regular con número Fraunces 600 22px a la izquierda |

**Contenido sugerido (no exhaustivo):**

**/acerca:**
1. Hero con la pregunta central.
2. Sección "La hipótesis" — texto editorial sobre la transición de mediaciones.
3. Sección "Los 6 ejes" — lista con pins de color + link a cada `/ejes/[slug]`.
4. Sección "El método" — referencia rápida + link a `/metodo`.
5. Sección "Cobertura geográfica" — los 10 países + link a `/mapa`.
6. Sección "Créditos" — autor, año, fuentes editoriales, licencia.

**/metodo:**
1. Hero con título "Método" + manifest sobre por qué el método importa.
2. Sección "Disparador" (el paso 1) — definición + ejemplo.
3. Sección "Desplazamiento" (paso 2) — definición + ejemplo.
4. Sección "Conceptualización" (paso 3) — definición + ejemplo.
5. Sección "Apertura" (paso 4) — definición + ejemplo.
6. Sección "Por qué no es periodismo de coyuntura" — diferenciación.

**Comportamiento:**

- Hero NO es sticky. Se scrollea fuera con el resto.
- Tap en eje de la lista de /acerca → navega a `/ejes/[slug]`.
- Tap en "El método" (sección en /acerca) → navega a `/metodo`.
- Sin animaciones de scroll, sin parallax (descartado por incoherencia con identidad).

### 4. Mapeo de patrones a pantallas

| Pantalla | Patrón | Notas |
|---|---|---|
| `/conceptos` | 1 | Lista alfabética de los conceptos con `publicar: true` del vault (`35-Conceptos-clave/`) |
| `/autores` | 1 | Lista alfabética de los autores con `publicar: true` del vault (`30-Autores/`) |
| `/concepto/[slug]` | 2 | Cuerpo desde el `.md` del vault, opcional `web_intro` arriba, "Aparece en" al pie |
| `/autor/[slug]` | 2 | Mismo patrón. Para autores el tag superior es "AUTOR · [nombre vivo / falleció / nacionalidad]" en lugar de eje. La meta agrega "Obras de referencia · [lista mono]" si el frontmatter lo tiene |
| `/acerca` | 3 | Página estática del frontend, no del vault |
| `/metodo` | 3 | Página estática del frontend, no del vault |

### 5. Casos de borde

**Concepto sin `Aparece en`** (no se cita en ningún análisis todavía). Omitir el bloque. No mostrar "Aparece en 0 análisis" — es feo.

**Autor con `web_image`** (foto del autor). Renderizar in-flow después de `web_intro` con aspect-ratio 1:1 (es retrato), padding lateral 20px (no a sangre — los retratos a sangre son intensos sin razón), caption mono uppercase debajo con créditos.

**Concepto con cuerpo muy corto** (< 100 palabras de Lora 16/1.6 + meta row + chips). Renderizar igual sin padding extra — el sistema absorbe contenido corto sin parecer roto.

**`/acerca` y `/metodo` con secciones vacías** (improbable porque son páginas estáticas controladas, pero por consistencia con Spec 16): omitir la sección completa, no mostrar título sin cuerpo.

**Tap rápido en el tag de eje de un item del índice.** Solo dispara navegación al eje si el tap target es exactamente el tag (con padding 4px alrededor). Si el lector hace tap en el resto del item, navega al concepto/autor.

---

## Lo que entra y no entra en r1 (resumen)

| Entra | No entra |
|---|---|
| 3 patrones reutilizables (índice / detalle / estática) | Pantallas adicionales (ejes, comparar, leer-después, pipeline) |
| Mapeo de 6 pantallas a los 3 patrones | Búsqueda interna desde el índice |
| Bloque "Aparece en" en detalle | Imágenes thumb en items del índice |
| Sistema tipográfico de Spec 50 reusado en patrón 2 | Filtros multi-select por eje en /conceptos |
| Drawer de Spec 53 en todas las 6 pantallas | Línea de tiempo en /metodo |
| `web_image` opcional in-flow para autores | Edición desde admin |
| Hero terracota en /acerca y /metodo | Animaciones / parallax |

---

## Cross-refs y actualizaciones

- `70-Producto/specs/07-puente-vault-sitio.md` §3: agregar nota indicando que el render mobile de `/concepto/[slug]` y `/autor/[slug]` se define en Spec 55 §2. El pipeline de generación de Spec 07 NO cambia.
- `70-Producto/specs/20-sidebar-autores-conceptos.md`: agregar nota indicando que en mobile estos módulos viven en el drawer (Spec 53) y sus pantallas destino están definidas en Spec 55.
- `70-Producto/specs/50-reading-experience-mobile.md`: agregar nota en §10 indicando que Spec 55 §2 reusa el sistema tipográfico para detalles editoriales cortos (concepto/autor).
- `70-Producto/specs/02-mobile-responsive.md`: agregar nota indicando que para `/acerca`, `/conceptos`, `/concepto/[slug]`, `/autores`, `/autor/[slug]`, `/metodo` la fuente de verdad pasa a Spec 55. Las otras pantallas secundarias (ejes, comparar, etc.) siguen con Spec 02.
- `70-Producto/epics/EPIC-04-mobile-first.md`: actualizar el scope (mover "página de concepto", "página de autor" y "/acerca", "/metodo" de "Lo que NO entra" a "Lo que entra"). Marcar Spec 55 como séptima spec hija con estado `lista`.
- `70-Producto/design-system/design-system.md`: agregar entrada de componentes `GlosarioIndex`, `EditorialShortDetail`, `StaticPage` con anatomía resumida.

---

## Implementación

| # | Tarea | Estimación | Dependencia |
|---|---|---|---|
| 1 | Crear `GlosarioIndex.tsx` + `GlosarioItem.tsx` componentes reutilizables | 2.5h | — |
| 2 | Refactorizar `/conceptos/page.tsx` y `/autores/page.tsx` para consumir el componente | 1h | tarea 1 |
| 3 | Crear `EditorialShortDetail.tsx` (componente con header + meta + intro + body + chips "Aparece en") | 3h | Spec 50 implementada |
| 4 | Refactorizar `/concepto/[slug]/page.tsx` y `/autor/[slug]/page.tsx` para consumir el componente | 1.5h | tarea 3 |
| 5 | Implementar cruce build-time "Aparece en" (script que escanea análisis y registra dónde se cita cada concepto/autor) | 2.5h | tarea 4 |
| 6 | Crear `StaticPage.tsx` con hero + secciones apiladas | 2h | — |
| 7 | Refactorizar `/acerca/page.tsx` y `/metodo/page.tsx` con el componente + contenido editorial | 2h | tarea 6 |
| 8 | Crear `editorial-secondary.css` con las clases dedicadas | 1.5h | — |
| 9 | Validación visual en Samsung A54 real + emulado 390 y 412 sobre las 6 pantallas | 1.5h | tareas 1-7 |
| 10 | Cross-refs: actualizar Specs 07, 20, 50, 02, design system | 30min | — |

**Estimación total:** 17-18 horas (2.5 días de trabajo).

**Orden de implementación:** tarea 3 (detalle) requiere Spec 50 implementada. El resto es independiente. Conviene atacarlas en este orden: 1 → 2 (índice), 6 → 7 (estática), 3 → 4 → 5 (detalle con cruce). Tareas 8-10 al final.

---

## Maqueta

Mockups validados en sesión de Cowork 2026-05-27 (widget HTML inline con los 3 patrones simultáneos, regenerables desde el prompt en `70-Producto/prompts-product-design/spec-55-secundarias.md`).

| Patrón | Pantallas que cubre | Mock |
|---|---|---|
| 1 — Índice de glosario | /conceptos, /autores | Validado con 3 items reales del vault (Tradición inventada, Trampa territorial, Hegemonía) |
| 2 — Detalle editorial corto | /concepto/[slug], /autor/[slug] | Validado con "Trampa territorial" — tag superior, h1, meta, web_intro, body, h2, "Aparece en" con chips |
| 3 — Página estática manifiesto | /acerca, /metodo | Validado con /acerca — hero terracota con manifesto, sección hipótesis, lista de 6 ejes con pins de color |

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-27 | Creación de la spec en estado `lista`. Sumada al scope de EPIC-04 (originalmente excluida en r1). Decisiones tomadas en sesión de Cowork con widget HTML inline de los 3 patrones simultáneos | Tomás identificó que /acerca y /conceptos son condición real del lanzamiento de julio — los lectores nuevos desde WhatsApp/Substack van a /acerca antes de cualquier otra pantalla, y desde el drawer de Spec 53 los conceptos son uno de los 5 destinos del corpus. Las 4 vistas críticas originales del epic no cubrían esto. Spec 55 cubre 6 pantallas con 3 patrones reutilizables, minimizando trabajo nuevo (reusa Spec 50, Spec 53) |
