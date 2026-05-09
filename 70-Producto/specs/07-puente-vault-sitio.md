# Spec 07 — Puente vault → sitio (autores y conceptos)

**Estado:** pendiente
**Depende de:** Spec 01 (arquitectura), Spec 04 (páginas de eje), Spec 06 (marco conceptual)
**Prioridad:** media-alta — diferencia el proyecto de un newsletter común

---

## 1. Por qué

La base de conocimientos en Obsidian (`30-Autores/`, `35-Conceptos-clave/`) tiene hoy **13 perfiles de autores** y **15 fichas de conceptos transversales** —Roy, Han, Huntington, Harari, Arrighi, Mann, Kennedy, Fukuyama, Agnew, Renouvin, Hobsbawm, Diamond, Kissinger, más conceptos como Hegemonía, Trampa territorial, Tradición Inventada, Repatrimonialización—. Es el andamiaje teórico que distingue a Mapa Inestable de un newsletter de coyuntura.

Ese material **no aparece en el sitio**. Si Mapa Inestable se sostiene en su andamiaje, exponer parte de ese andamiaje al lector convierte cada análisis en parte de un sistema, no en una pieza suelta.

Esta spec define cómo se traduce el vault a páginas públicas: **qué entra, cómo se genera, cómo se mantiene**.

---

## 2. Decisión arquitectónica de fondo

Hay dos vías para tener páginas de autor y concepto en el sitio:

**A. Generar desde el vault automáticamente.**
- Pipeline que lee los `.md` del vault, parsea frontmatter, exporta MDX o JSON.
- Single source of truth: el vault.
- El sitio se reconstruye cuando el vault cambia (cron o git hook).

**B. Redactar manualmente versiones públicas.**
- El vault es notas internas; el sitio es contenido editorial separado.
- El autor cura cada página pensando en lector externo.

**Decisión recomendada: A con curaduría selectiva.**
- Single source of truth, pero **no todo el vault entra**: un campo `publicar: true` en el frontmatter decide. Los archivos sin ese flag quedan privados.
- El frontmatter se enriquece para web (descripción pública, imagen opcional, slug) sin tocar el cuerpo.
- El cuerpo del archivo se renderiza tal cual en MDX.
- Cuando el autor quiere afinar la versión pública sin afectar la nota interna, edita en el campo `web_intro` del frontmatter — un texto opcional que se inserta arriba del contenido en la versión pública.

Esto **respeta el trabajo ya hecho** en el vault sin obligar a duplicar contenido.

---

## 3. Alcance

### 3.1. Entra

- Página `/autor/[slug]` para cada autor con `publicar: true` en el frontmatter del archivo `30-Autores/[Nombre].md`.
- Página `/concepto/[slug]` para cada concepto con `publicar: true` en `35-Conceptos-clave/[Concepto].md`.
- Índices `/autores` y `/conceptos`.
- Sistema de generación: script que convierte vault → contenido del sitio.
- Linkado bidireccional con páginas de eje (Spec 04) y análisis individuales.

### 3.2. Queda fuera

- Edición de autores/conceptos desde el admin del sitio. La fuente sigue siendo el vault.
- Versionado público con histórico. v2 si se vuelve necesario.
- Comentarios sobre autores o conceptos.

---

## 4. Flag de publicación en el vault

Extender el frontmatter de `30-Autores/*.md` y `35-Conceptos-clave/*.md` con:

```yaml
---
# Campos ya existentes (tags, tipo, autores, obra, etc.)

# Nuevos campos para publicación
publicar: true              # default false. Solo true se exporta al sitio.
slug: "olivier-roy"         # opcional; si falta, derivar de nombre del archivo
web_intro: |                # opcional; texto público específico, máx ~150 palabras
  Texto curado para lector externo. Si está, se renderiza arriba del cuerpo.
  Si falta, el cuerpo del archivo se publica directo.
web_image: "/img/roy.jpg"   # opcional; foto para hero de la página
---
```

**Curaduría inicial recomendada (qué publicar primero):**

| Archivo del vault | ¿Publicar v1? | Por qué |
|---|---|---|
| Olivier Roy | sí | autor ya activo en publicaciones del Substack |
| Byung-Chul Han | sí | idem |
| Samuel Huntington | sí | referencia del eje deculturación |
| Yuval Noah Harari | sí | autor visible |
| Giovanni Arrighi | sí | concepto Hegemonía publicable |
| Michael Mann | sí | concepto Poder Infraestructural publicable |
| Francis Fukuyama | sí | concepto Decadencia política publicable |
| John Agnew | sí | concepto Trampa territorial publicable |
| Eric Hobsbawm | sí | concepto Tradición Inventada — alta utilidad pedagógica |
| Paul Kennedy | tal vez | overstretch tiene aplicabilidad indirecta |
| Henry Kissinger | tal vez | equilibrio de poder es canónico |
| Pierre Renouvin | no v1 | académico, menor uso público |
| Jared Diamond | no v1 | concepto controversial, mejor revisarlo antes |

| Concepto del vault | ¿Publicar v1? | Por qué |
|---|---|---|
| Hegemonía | sí | aplica a análisis recurrentes |
| Trampa territorial | sí | concepto vivo en piezas de Bolivia, Colombia |
| Tradición Inventada | sí | conecta con dos ejes core |
| Decadencia política | sí | utilidad amplia |
| Poder Infraestructural | sí | diagnostica Estados sudamericanos |
| Equilibrio de Poder | tal vez | si Kissinger se publica |
| Overstretch | tal vez | si Kennedy se publica |
| Poder Político | no v1 | la versión fina es Poder Infraestructural |
| Fuerzas profundas | no v1 | concepto blando |
| Causas últimas (Diamond) | no v1 | controversial |
| **Ejes candidatos (5)** | no v1 | son material editorial interno hasta decisión |

Esta tabla es propuesta — Tomás decide qué publica.

---

## 5. Página `/autor/[slug]`

### 5.1. Layout

```
┌─────────────────────────────────────────────────────────────┐
│   AUTORES · 03 DE 09                       [breadcrumb]     │
│                                                             │
│       Olivier Roy                                           │
│       Politólogo francés · Islam, secularización            │
│                                                             │
│       [opcional: foto a la izquierda en md+]                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   QUIÉN ES                                                  │
│   [Renderiza web_intro si existe; si no, primer párrafo     │
│    del cuerpo del archivo del vault]                        │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   OBRA CLAVE PARA MAPA INESTABLE                            │
│   [Sección "Obra clave para Mapa Inestable" del vault]      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   TESIS CENTRALES                                           │
│   [Sección "Tesis centrales relevantes" del vault]          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CONCEPTOS                                                 │
│   ┌─────────────┬─────────────┐                            │
│   │ Hegemonía   │ Decadencia  │                            │
│   │ → ver       │ → ver       │                            │
│   └─────────────┴─────────────┘                            │
│   (cards de conceptos del autor publicados)                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   EJES QUE TRABAJA                                          │
│   - Deculturación                                           │
│   - Erosión de mediaciones                                  │
│   (links a páginas de eje)                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   APARECE EN                                                │
│   [Listado de análisis y publicaciones donde se cita        │
│    al autor — derivado del vault, sección "Aparece en"]     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.2. Componentes

- **Hero textual** — nombre, descripción mínima, foto opcional. Sin cards de "Año II", sin metadata de número/contador (esto es referencia, no calendario).
- **Bloques de contenido** — derivados de las secciones del archivo del vault: "Obra clave", "Tesis centrales", "Conexiones con ejes". Renderizado MDX directo.
- **Cards de conceptos** — autores con conceptos publicados muestran cards a `/concepto/[slug]`. Reusa componente de Spec 04.
- **Lista de ejes que trabaja** — derivado de los wikilinks del archivo del vault. Filtrado a los 6 ejes activos.
- **Aparece en** — análisis del corpus que citan al autor. Esto requiere que los análisis tengan un campo `autores_citados[]` (ver sección 8).

### 5.3. Aplicación Grabado

- Fondo `--mi-bg-paper`.
- Hero con `--mi-shadow-hero`.
- Cards de conceptos y secciones con `--mi-shadow-card`.

---

## 6. Página `/concepto/[slug]`

### 6.1. Layout

```
┌─────────────────────────────────────────────────────────────┐
│   CONCEPTOS · 04 DE 08                     [breadcrumb]     │
│                                                             │
│       Hegemonía                                             │
│       Concepto de Giovanni Arrighi (2007)                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [Definición — primer blockquote del archivo del vault]    │
│                                                             │
│   "Es el poder adicional del que goza un grupo dominante    │
│    por su capacidad de dirigir a la sociedad…"              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ARGUMENTO                                                 │
│   [Sección "Argumento" del vault]                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CITA                                                      │
│   [Sección "Cita" del vault — citation block expanded]      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   APLICACIÓN A SUDAMÉRICA                                   │
│   [Sección "Aplicabilidad sudamericana" del vault]          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CRUCES CON EJES                                           │
│   ┌────────────────────┬────────────────────┐              │
│   │ Desrepresentación  │ Erosión mediaciones│              │
│   │ → ver eje          │ → ver eje          │              │
│   └────────────────────┴────────────────────┘              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   AUTOR                                                     │
│   [Card del autor con link a /autor/[slug]]                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   FUENTE                                                    │
│   [Citation block con obra, autor, año, páginas]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2. Componentes

- **Hero textual** — nombre del concepto + atribución mínima.
- **Definición** — el blockquote que abre la ficha. Se renderiza con tipografía grande Fraunces italic.
- **Bloques** — derivados de las secciones de la ficha del vault: Argumento, Cita, Aplicabilidad sudamericana.
- **Cards de ejes cruzados** — links a `/ejes/[slug]`.
- **Card de autor** — link a `/autor/[slug]`.
- **Citation block** — el "Fuente" del vault renderizado con el componente de trazabilidad (Spec 01).

### 6.3. Notas editoriales

Cuando el archivo del vault tiene una sección "Nota editorial" (varios la tienen), **no se publica al sitio público**. Es material interno: discusiones de Tomás con Claude sobre la pertinencia, el solapamiento, las tensiones. Se mantiene en el vault como herramienta de trabajo, fuera del sitio.

El parser de la pipeline debe **excluir explícitamente** la sección `## Nota editorial` al renderizar a MDX.

---

## 7. Índices `/autores` y `/conceptos`

### 7.1. `/autores`

Grid 3 o 4 columnas con cards: nombre, descripción mínima, foto si existe, link.

Agrupados por **disciplina o región** si conviene (ej: "Filósofos contemporáneos: Roy, Han, Huntington" / "Sociólogos del poder: Mann, Arrighi" / "Cientistas políticos: Fukuyama, Kissinger"). Esto es decisión editorial — si la agrupación se vuelve forzada, dejar grilla cronológica de adición.

### 7.2. `/conceptos`

Grid de cards con: nombre del concepto, autor central, definición de 1 oración. Agrupados por **familia conceptual**: poder, soberanía, mediaciones, símbolos.

Ambos índices linkean al `/acerca` y a `/ejes` desde su footer.

---

## 8. Cambios en modelo de Analysis

Para que la página de autor pueda mostrar "Aparece en", los análisis necesitan declarar a qué autores citan:

```
Analysis (existente) {
  ...
  autores_citados: [autor_slug]   ← nuevo
  conceptos_invocados: [concepto_slug]   ← nuevo
}
```

Estos campos se editan desde el editor de análisis (Spec 01.6.1) como multi-select. Son **opcionales**: un análisis no necesita citar autores para publicarse, pero si lo hace, el cross-link emerge.

Beneficio adicional: el filtro "ver análisis donde aparece este autor" se vuelve trivial.

---

## 9. Pipeline de generación

### 9.1. Estructura

```
platform/scripts/sync-vault.ts

1. Leer recursivamente /sessions/.../Mapa Inestable/30-Autores/*.md
   y /sessions/.../Mapa Inestable/35-Conceptos-clave/*.md

2. Para cada archivo:
   - Parsear frontmatter
   - Si publicar !== true → skip
   - Derivar slug
   - Convertir wikilinks [[X]] a links del sitio (ver tabla de mapeo abajo)
   - Excluir secciones "## Nota editorial"
   - Si existe web_intro, prependerlo al cuerpo
   - Escribir MDX a platform/frontend/content/autores/[slug].mdx
     o /content/conceptos/[slug].mdx

3. Generar índices:
   - platform/frontend/content/autores/_index.json
   - platform/frontend/content/conceptos/_index.json

4. Si web_image existe, copiarla a public/img/
```

### 9.2. Mapeo de wikilinks

| Wikilink en vault | Resuelve a |
|---|---|
| `[[../10-Ejes/03 - Desrepresentación]]` | `/ejes/desrepresentacion` |
| `[[../30-Autores/Olivier Roy]]` | `/autor/olivier-roy` (si publicar) o **plain text** si no |
| `[[../35-Conceptos-clave/Hegemonía]]` | `/concepto/hegemonia` (si publicar) o **plain text** |
| `[[Concepto X]]` (sin path) | resolver buscando en todo el vault |

**Regla de fallback**: si el target no tiene `publicar: true`, el link se renderiza como plain text (se quita el `<a>`). Nunca llevar al lector a un 404.

### 9.3. Cuándo se ejecuta

Tres opciones:

- Manual (`npm run sync-vault`) — más control.
- Pre-build de Vercel — automático en cada deploy.
- Watcher / cron — overkill para v1.

Recomendado: **manual con npm script** para empezar; agregar al pre-build cuando el flujo se estabilice.

---

## 10. Linkado desde otros lugares

| Lugar | Cambio |
|-------|--------|
| Página de eje (Spec 04) | Cards de "Autores de referencia" linkean a `/autor/[slug]` |
| Página de eje (Spec 04) | Cards de "Conceptos vinculados" linkean a `/concepto/[slug]` |
| Análisis individual | Si el análisis declara `autores_citados`, mostrar al pie un bloque "Autores citados" con cards |
| Análisis individual | Idem para `conceptos_invocados` |
| Header del sitio | Sumar `/autores` y `/conceptos` bajo dropdown "Marco" si existe (Spec 06) |
| Footer | Bloque "Marco" con `/ejes`, `/autores`, `/conceptos`, `/metodo`, `/acerca` |

---

## 11. Decisiones editoriales pendientes

| # | Decisión | Quién |
|---|----------|-------|
| 1 | Curaduría definitiva: qué autores y qué conceptos entran a v1 | Tomás (sección 4 propone una tabla) |
| 2 | ¿Agrupar índice de autores por disciplina o cronológico? | Tomás |
| 3 | ¿Foto del autor en cada página o solo nombre? | Tomás (afecta `web_image` en frontmatter) |
| 4 | ¿Publicar fichas teóricas con notas editoriales internas (filtradas) o reescribir cuerpos públicos? | Tomás — recomendación: filtrar |

---

## 12. Orden de implementación

```
Día 1  ► Pipeline de sincronización
         - Script sync-vault.ts
         - Parser de frontmatter + wikilinks + filtro de "Nota editorial"
         - Generación de MDX

Día 2  ► Páginas /autor/[slug] y /concepto/[slug]
         - Layouts según specs 5 y 6
         - Render desde MDX
         - Componentes reutilizados de Spec 04 (cards de eje, etc.)

Día 3  ► Índices /autores y /conceptos
         - Grid + agrupaciones
         - Search opcional (mismo patrón de Spec 05 simplificado)

Día 4  ► Curaduría y publicación
         - Tomás marca publicar:true en archivos del vault
         - Redacta web_intro donde haga falta
         - Decide qué entra a v1

Día 5  ► Linkado bidireccional
         - Conectar páginas de eje (Spec 04) con cards de autor/concepto
         - Conectar análisis individuales con autores_citados (requiere
           extender editor de análisis)
         - Header dropdown "Marco" + footer bloque "Marco"

Día 6  ► Pre-build hook (opcional)
         - Integrar sync-vault al build de Vercel
```

---

## 13. Criterios de aceptación

- [ ] Existe script que convierte el vault a MDX, respetando el flag `publicar`.
- [ ] Las secciones "Nota editorial" del vault no aparecen en el sitio.
- [ ] Los wikilinks del vault se resuelven a rutas del sitio cuando el target está publicado, y a plain text cuando no.
- [ ] `/autor/[slug]` existe para cada autor publicado y muestra obra, tesis, conceptos, ejes y citas.
- [ ] `/concepto/[slug]` existe para cada concepto publicado y muestra definición, argumento, cita, aplicabilidad y autor.
- [ ] `/autores` y `/conceptos` existen como índices navegables.
- [ ] Las páginas de eje (Spec 04) muestran cards de autores y conceptos vinculados que llevan a sus páginas.
- [ ] Cero links rotos: ningún wikilink no resuelto navega a 404.
