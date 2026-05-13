# Arquitectura editorial · Mapa Inestable

**Versión:** 2026-05-13 · **Mantenido junto con:** CLAUDE.md, Spec 29 (agentes), Spec 37 (portadas)

Este documento es el mapa consolidado de la topología editorial del proyecto. Tres tablas:

1. **[Tipos de pieza](#1-tipos-de-pieza)** — qué clases de contenido existen, dónde viven, cómo se distinguen.
2. **[Pantallas del sitio](#2-pantallas-del-sitio)** — todas las rutas del frontend con qué muestra y de dónde lee.
3. **[Cruce tipo × pantalla × fuente](#3-cruce-tipo--pantalla--fuente)** — la matriz que conecta los dos.

Al final hay un mapa de [flujos editoriales](#4-flujos-editoriales) (cómo se mueve una pieza desde que la escribe el agente hasta que la lee un usuario) y un [glosario rápido](#5-glosario-rápido) de campos del frontmatter.

---

## 1. Tipos de pieza

Las piezas editoriales se distinguen por **dónde viven** (carpeta del vault) y por **qué frontmatter declaran** (`tipo:`). Todas son archivos `.md` con frontmatter YAML; el sitio nunca usa base de datos para contenido editorial.

### Piezas editoriales (markdown con frontmatter)

| Tipo | Carpeta | `tipo:` en frontmatter | Generado por | Estado | Notas |
|---|---|---|---|---|---|
| **Borrador del agente diario** | `60-Borradores/diario/` | `borrador-agente` | Scheduled task `agente-diario` (lun-vie 08:00 ART) | `borrador` → `promovido` | 11 piezas hoy. Cada una con `cover_image` y `cover_prompt`. Specs 23-25. |
| **Borrador manual** | `60-Borradores/` (raíz) | — (sin convención fija) | Tomás manualmente | borrador | 12 ensayos largos. No expuestos al público por ahora. Se conservan como insumo. |
| **Publicación** | `50-Publicaciones/` | `publicación` o `analisis-semanal` | Promoción de borrador-agente (script `promote-draft.mjs`) **o** skill on-demand `analisis-semanal` | `publicada` | 13 piezas históricas del Substack + futuras promociones del agente. |
| **Despacho semanal** | `50-Publicaciones/` | `despacho-semanal` | Skill on-demand `despacho-semanal` | `publicada` | Aún no hay despacho generado bajo este sistema. |
| **Borrador de agenda** | `60-Borradores/agendas/` | `agenda-borrador` (Spec 28) | Scheduled task `agenda-semanal` (viernes 17:00 ART, pendiente de implementación) | `borrador` → promote a live | Una por país (10 archivos `<slug>.md`) + `_resumen-YYYY-W##.md`. |
| **Agenda live** | `15-Países/agendas/` | (array `agendas[]` en frontmatter de la ficha) | Promoción manual del borrador (skill `promover-agenda`, Spec 28 §5, pendiente) | live | Una por país. 3-5 temas factuales con rank, tendencia, query a Google News. |

### Material conceptual / referencia (markdown con frontmatter ligero)

| Tipo | Carpeta | Cuántos | Usados por |
|---|---|---|---|
| **Ejes** | `10-Ejes/` | 6 (Deculturación, Erosión de mediaciones, Desrepresentación, Estetización, Desorientación, Atención) | `/ejes/[slug]`, color y nombre en pills y placeholders de portada |
| **Fichas de país** | `15-Países/` | 10 | `/pais/[slug]`, panel lateral del mapa de home |
| **Autores** | `30-Autores/` | ~5 (Roy, Han, Harari, Huntington, otros) | `/autor/[slug]`, `/autores` |
| **Conceptos clave** | `35-Conceptos-clave/` | ~10 | `/concepto/[slug]`, `/conceptos` |
| **Disparadores** | `40-Disparadores/` | 20+ | Referenciados desde análisis, no tienen vista propia |
| **Método** | `20-Metodo/` | ~5 archivos | `/metodo` |

### Assets visuales (binarios)

| Tipo | Carpeta | Cuántos | Usados por |
|---|---|---|---|
| **Portadas** | `90-Portadas/diario/`, `/publicaciones/`, `/despachos/` | 11 (diario) + 0 (otras) | Spec 37 — thumb en grillas, hero en lectura |
| **Design system** | `70-Producto/design-system/` | mapas, logos, tokens CSS | Identidad visual del sitio (Spec 21) |
| **Mockups** | `70-Producto/mockups/` | prototipos HTML | Referencia de diseño, no producción |

### Trackers operativos (no son piezas editoriales pero son del vault)

| Archivo | Función |
|---|---|
| `90-Portadas/_pending.md` | Tracker de portadas pendientes de generar |
| `*-MOC.md` por carpeta | Maps of Content de Obsidian (índices manuales) |
| `Índice.md` (raíz) | Índice general del vault |
| `00 - Sobre Mapa Inestable.md` | Manifiesto del proyecto |

---

## 2. Pantallas del sitio

Todas las rutas del frontend Next.js. Las URLs son lo que ve el usuario; la columna "lee de" indica qué archivos del vault alimentan cada vista vía `lib/*.ts`.

### Núcleo editorial

| Ruta | Qué muestra | Lee de | Lib |
|---|---|---|---|
| `/` | Home: hero con análisis del día + grilla de piezas recientes + mapa Torres García + ejes activos | `60-Borradores/diario/`, `50-Publicaciones/`, `15-Países/agendas/`, `10-Ejes/`, `35-Conceptos-clave/`, `30-Autores/` | `home.ts`, `agendas.ts`, `conceptos.ts`, `autores.ts`, `ejes.ts` |
| `/mapa` | Vista expandida del mapa Torres García | (estática, sin lectura editorial) | `MapaHeatmapSection` |
| `/analisis` | Listado de análisis publicados | `50-Publicaciones/` (filtra `tipo: publicación`) | `content.ts → getAllPublications()` |
| `/analisis/[pais]/[slug]` | Análisis individual ya publicado | `50-Publicaciones/` | `content.ts → getPublicationBySlug()` |
| `/analisis/borradores` | **Grilla de borradores diarios del agente** | `60-Borradores/diario/` | `content.ts → getAllAgentDrafts()` |
| `/analisis/borradores/[pais]/[slug]` | **Borrador individual del agente** | `60-Borradores/diario/<archivo>.md` | `content.ts → getAgentDraftBySlug()` |
| `/publicaciones/[slug]` | Publicación histórica del Substack | `50-Publicaciones/` (slug match) | `content.ts → getPublicationBySlug()` |
| `/despachos` | Listado de despachos semanales | `50-Publicaciones/` (filtra `tipo: despacho-semanal`) | `despachos.ts → getAllDispatches()` |
| `/despachos/[ano]/[semana]` | Despacho individual | `50-Publicaciones/` | `despachos.ts` |
| `/ensayos` | Listado de ensayos (borradores manuales largos) | `60-Borradores/` raíz | `essay-drafts.ts` |
| `/ensayos/[slug]` | Ensayo individual | `60-Borradores/<archivo>.md` | `essay-drafts.ts` |

### Marco conceptual

| Ruta | Qué muestra | Lee de | Lib |
|---|---|---|---|
| `/ejes` | Listado de los 6 ejes con descripción corta | `10-Ejes/` | `ejes.ts` |
| `/ejes/[slug]` | Eje individual con definición + análisis donde se activó | `10-Ejes/<eje>.md` + cross-ref a publicaciones | `ejes.ts`, `content.ts` |
| `/conceptos` | Listado de conceptos clave | `35-Conceptos-clave/` | `conceptos.ts` |
| `/concepto/[slug]` | Concepto individual | `35-Conceptos-clave/<concepto>.md` | `conceptos.ts` |
| `/autores` | Listado de autores referenciados | `30-Autores/` | `autores.ts` |
| `/autor/[slug]` | Autor individual | `30-Autores/<autor>.md` | `autores.ts` |
| `/metodo` | El método de 4 pasos explicado | `20-Metodo/` | (lectura simple) |

### País y datos comparados

| Ruta | Qué muestra | Lee de | Lib |
|---|---|---|---|
| `/pais/[slug]` | Ficha de país: diagnóstico estructural, ejes crónicos, análisis recientes, agenda live, indicadores | `15-Países/<pais>.md`, `15-Países/agendas/<pais>.md`, `50-Publicaciones/` (filtra por país), `60-Borradores/diario/` (filtra por país), latinobarómetro, macro | `content.ts`, `agendas.ts`, `latinobarometro.ts`, `macro-indicators.ts` |
| `/comparar` | Selector de indicadores cross-país | datos macro + latinobarómetro | `latinobarometro.ts`, `macro-indicators.ts` |
| `/comparar/[indicador]` | Indicador específico comparado entre países | idem | idem |

### Operativas / meta

| Ruta | Qué muestra | Lee de | Lib |
|---|---|---|---|
| `/acerca` | Quién, por qué, cómo. Manifiesto del proyecto | (estática) | — |
| `/pipeline` | Pipeline interno de producción (Spec 25): qué piezas están en qué estado | borradores + publicaciones + estado | `pipeline.ts` |
| `/leer-despues` | Lista de bookmarks del usuario (localStorage) | (cliente, no lee del vault) | — |

---

## 3. Cruce tipo × pantalla × fuente

Lectura matricial: qué carpeta del vault alimenta cada pantalla.

| Carpeta del vault | Pantallas que la leen | Vía |
|---|---|---|
| `10-Ejes/` | `/ejes`, `/ejes/[slug]`, `/pais/[slug]` (chips crónicos), `/`, colorización de pills | `ejes.ts` |
| `15-Países/` (fichas) | `/pais/[slug]`, `/` (panel lateral mapa) | `content.ts → getCountrySections()` |
| `15-Países/agendas/` (live) | `/pais/[slug]` (tab "Agenda"), `/` (panel lateral del mapa) | `agendas.ts` |
| `20-Metodo/` | `/metodo` | lectura directa |
| `30-Autores/` | `/autores`, `/autor/[slug]`, referenciado desde piezas | `autores.ts` |
| `35-Conceptos-clave/` | `/conceptos`, `/concepto/[slug]`, referenciado desde piezas | `conceptos.ts` |
| `40-Disparadores/` | (referenciado desde análisis vía `disparador.url` en frontmatter, no tiene vista propia) | — |
| `50-Publicaciones/` | `/analisis`, `/analisis/[pais]/[slug]`, `/publicaciones/[slug]`, `/despachos`, `/despachos/[ano]/[semana]`, `/`, `/pais/[slug]`, `/pipeline` | `content.ts`, `despachos.ts`, `home.ts` |
| `60-Borradores/` (raíz) | `/ensayos`, `/ensayos/[slug]` | `essay-drafts.ts` |
| `60-Borradores/diario/` | `/analisis/borradores`, `/analisis/borradores/[pais]/[slug]`, `/`, `/pais/[slug]`, `/pipeline` | `content.ts → getAllAgentDrafts()`, `pipeline.ts` |
| `60-Borradores/agendas/` | (no expuesto al sitio — solo material para promote a live) | — |
| `90-Portadas/diario/` | `/analisis/borradores` (thumb), `/analisis/borradores/[pais]/[slug]` (hero) | Spec 37 — vía `sync-covers.mjs` → `public/covers/diario/` |
| `90-Portadas/publicaciones/` | (vacío hoy; cuando se llene → `/analisis`, `/analisis/[pais]/[slug]`, `/publicaciones/[slug]`) | Spec 37 r2 |
| `90-Portadas/despachos/` | (vacío hoy; cuando se llene → `/despachos`, `/despachos/[ano]/[semana]`) | Spec 37 r3 |

### Lectura inversa: qué pantalla muestra qué

Si querés saber rápido qué se ve en cada vista:

| Pantalla | Qué tipos de pieza muestra |
|---|---|
| `/` | Borrador del día, mapa con países activos, agenda live por país (panel lateral), conceptos clave, autores |
| `/analisis` | Publicaciones (`tipo: publicación` o `analisis-semanal`) |
| `/analisis/borradores` | Borradores del agente diario (`tipo: borrador-agente`, estado `borrador`) |
| `/despachos` | Despachos (`tipo: despacho-semanal`) |
| `/publicaciones/[slug]` | Una publicación específica del Substack |
| `/ensayos` | Borradores manuales del autor (carpeta raíz de `60-Borradores/`) |
| `/pais/[slug]` | Ficha + agenda live + análisis recientes del país + borradores recientes del país + indicadores |
| `/ejes/[slug]` | Definición del eje + lista de análisis donde se activó |
| `/pipeline` | Estado de toda la producción: qué hay en borrador, qué se promovió, qué se publicó |

---

## 4. Flujos editoriales

Cómo se mueve una pieza desde que existe como archivo hasta que la lee un usuario en el sitio.

### Flujo A · Borrador del agente diario → Publicación

```
1. Scheduled task corre lun-vie 08:00 ART
   ↓
2. Agente genera borrador en 60-Borradores/diario/<País> - <Título> - <Fecha>.md
   Frontmatter: tipo: borrador-agente, estado: borrador
   + cover_image, cover_prompt declarados
   ↓
3. (Opcional inmediato) Tomás genera la portada con Gemini usando cover_prompt
   Guarda en 90-Portadas/diario/<slug>.png
   ↓
4. El sitio renderiza el borrador en /analisis/borradores y /analisis/borradores/[pais]/[slug]
   Si la portada existe → CoverImage con la imagen
   Si no existe todavía → CoverPlaceholder (color del eje + país en Alfa Slab)
   ↓
5. Tomás revisa, decide si publicar, ejecuta `npm run promote-draft -- --draft ...`
   ↓
6. promote-draft.mjs:
   - Crea archivo en 50-Publicaciones/ con frontmatter tipo: publicación
   - Marca borrador como estado: promovido + agrega published_url
   - Actualiza MOC
   - (Spec 37 r2 pendiente) Mueve la portada a 90-Portadas/publicaciones/ + reapunta cover_image
   ↓
7. El sitio renderiza la publicación en /analisis/[pais]/[slug]
```

### Flujo B · Análisis on-demand → Publicación

```
1. Tomás invoca skill `analisis-semanal` en Claude ("analizá Chile")
   ↓
2. Skill produce análisis con método de 4 pasos
   Output incluye cover_image + cover_prompt (Spec 37)
   ↓
3. Tomás aprueba ("guardalo")
   ↓
4. Archivo en 50-Publicaciones/<País> - Semana <N> - <año>.md
   ↓
5. Tomás genera portada con Gemini, guarda en 90-Portadas/publicaciones/<slug>.png
   ↓
6. Sitio renderiza
```

### Flujo C · Despacho semanal

```
1. Tomás invoca skill `despacho-semanal` ("armá el despacho")
   ↓
2. Skill integra análisis de la semana, propone 3 títulos
   Output incluye cover_image + cover_prompt (Spec 37)
   ↓
3. Tomás elige título, aprueba guardar
   ↓
4. Archivo en 50-Publicaciones/Despacho Semana <N> - <año>.md
   Frontmatter: tipo: despacho-semanal
   ↓
5. Portada en 90-Portadas/despachos/despacho-semana-<N>-<año>.png
   ↓
6. Sitio renderiza en /despachos y /despachos/<año>/<semana>
   ↓
7. (Opcional) Tomás copia la "versión Substack" del skill al editor de Substack
```

### Flujo D · Agenda por país

```
1. Scheduled task `agenda-semanal` corre viernes 17:00 ART (Spec 28, pendiente)
   ↓
2. Una task por país (10 en total) genera borrador en 60-Borradores/agendas/<slug>.md
   ↓
3. Task genera también `_resumen-YYYY-W##.md` con vista panorámica
   ↓
4. Tomás revisa, invoca skill `promover-agenda <país>` (Spec 28 §5, pendiente)
   ↓
5. Skill copia borrador al live 15-Países/agendas/<slug>.md
   ↓
6. Sitio renderiza la agenda en /pais/<slug> y en el panel lateral del mapa de la home
```

---

## 5. Glosario rápido

Campos del frontmatter que cruzan tipos.

| Campo | Tipos que lo usan | Significado | Quién lo escribe |
|---|---|---|---|
| `tipo` | todos | Distingue qué tipo de pieza es (`borrador-agente`, `publicación`, `despacho-semanal`, `analisis-semanal`, etc.) | El agente / skill / promote-draft |
| `estado` | borradores y publicaciones | `borrador`, `promovido`, `publicada` | El agente al crear / promote-draft al promover |
| `slug` | todos | Identificador kebab-case del título. Único dentro de su tipo | El agente / skill al crear |
| `country` / `country_slug` | piezas con país | Nombre del país y código de 2 letras | El agente |
| `fecha` | todos | Fecha de la pieza en YYYY-MM-DD | El agente / promote-draft |
| `eje_principal` / `ejes` | piezas analíticas | El eje dominante del análisis (1) y secundarios (lista) | El agente |
| `lede` | piezas analíticas | El párrafo de entrada en italics | El agente |
| `disparador` | piezas analíticas | Objeto con `url`, `medio`, `fecha_publicacion`, `titulo` de la fuente primaria | El agente |
| `cover_image` | piezas con portada | Ruta relativa al vault de la imagen: `90-Portadas/<categoria>/<slug>.png`. **Se renderiza** (Spec 37) | El agente / skill al crear |
| `cover_prompt` | piezas con portada | Bloque multilínea YAML con el prompt para Gemini. **Interno**, no se renderiza | El agente / skill al crear |
| `published_url` | publicaciones promovidas | URL del Substack donde se publicó | promote-draft.mjs |
| `publicacion_slug` | borradores promovidos | Slug de la publicación derivada | promote-draft.mjs |
| `agent_version` | borradores del agente | Versión del SKILL que generó el borrador (hoy v2.2) | El agente |

---

## Notas

- Este documento se actualiza junto con **CLAUDE.md**, **Spec 29** (calendario de agentes) y **Spec 37** (sistema de portadas). Si se agrega un nuevo tipo de pieza, una nueva pantalla, o un nuevo agente, hay que actualizar las tres tablas de acá.
- Para detalle conceptual del proyecto: `00 - Sobre Mapa Inestable.md` y `20-Metodo/`.
- Para detalle de stack y decisiones técnicas: **CLAUDE.md**.
- Para detalle visual: `70-Producto/design-system/design-system.md` y `cover-style-guide.md`.
- Para detalle del flujo de demo a un tercero: `70-Producto/guia-demo.md`.

## Pregunta abierta

¿Cómo se sostiene la coherencia editorial cuando el corpus crece a 200+ piezas y las pantallas que las muestran se multiplican? Hoy la respuesta práctica es "frontmatter consistente + un script de promote que controla la transición de un tipo a otro". Eventualmente vamos a necesitar **validación automatizada** del frontmatter (un linter editorial) que se ejecute en cada build y avise si una pieza está mal etiquetada, le falta un campo obligatorio, o apunta a una portada que no existe. No urgente, pero importante de tener en el horizonte.
