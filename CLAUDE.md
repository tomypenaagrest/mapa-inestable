# CLAUDE.md — Mapa Inestable

Contexto completo del proyecto para continuar desde cualquier sesión de Claude Code.

---

## Qué es este proyecto

**Mapa Inestable** es una plataforma de análisis político-cultural enfocada en Sudamérica. No reacciona a la coyuntura: identifica transformaciones estructurales en política, cultura y percepción de la realidad.

Sitio web: https://mapainestable.substack.com (origen del proyecto, ahora en transición hacia plataforma propia)

**Hipótesis central:** Vivimos una transición donde las estructuras que organizaban la vida colectiva pierden capacidad de mediación. Esto produce fragmentación, desorientación, debilitamiento de la representación y dificultad para construir mayorías.

---

## Estado actual del proyecto

### Base de conocimientos (Obsidian)

- `10-Ejes/` — Los 6 ejes conceptuales desarrollados
- `15-Países/` — Fichas por país (10 países)
  - `15-Países/agendas/` — Agendas live por país (Spec 27), una `<slug>.md` por país, escritas solo tras promote
- `20-Metodo/` — El método de trabajo y principios editoriales
- `30-Autores/` — Notas sobre Roy, Han, Harari, Huntington
- `35-Conceptos-clave/` — Glosario conceptual del proyecto
- `40-Disparadores/` — 20+ escenas/eventos procesados
- `50-Publicaciones/` — Índice del Substack con notas atómicas
- `60-Borradores/` — Piezas en desarrollo
  - `60-Borradores/diario/` — Borradores del agente diario (Specs 23-25)
  - `60-Borradores/agendas/` — Borradores semanales del task de agendas (Spec 28), incluye `_resumen-YYYY-W##.md`
- `mapa-inestable.plugin` — Plugin de Cowork con skills de análisis y agentes automáticos (ver abajo)

### Plataforma web (construida)

Stack: **FastAPI** (backend) + **Next.js** (frontend) + **D3.js** (mapa)

- `platform/backend/` — API Python, modelo de datos PostgreSQL, RSS aggregator
- `platform/frontend/` — Next.js app con mapa Torres García, dashboard por país, ensayos, archivo
- `platform/data/` — GeoJSON y datos estructurales

### Producto / diseño (especificaciones)

- `70-Producto/specs/` — 32 specs escritas (01–32, con anexos 12A, 12B, 14A) + 4 bug reports (BUG-001, BUG-002, dos BUG-003) + QA-05. Specs 27-29 cubren **agendas por país** y el **sistema de agentes automáticos**. Specs 30-32 resuelven la deuda de **corpus vivo en el sitio** (home, despachos, borradores diarios).
- `70-Producto/design-system/` — Design tokens, sistema cromático, assets de identidad visual
- `70-Producto/mockups/` — Prototipos HTML de vistas
- `70-Producto/guia-demo.md` — Guía de demo del producto

**Identidad visual (Spec 21):** Logo escalador con asterisco SVG, sistema cromático definido.

**Mapa interactivo (Spec 22):** Mapa Torres García con hot-zones por país, coordenadas editoriales calibradas, componente React integrado.

---

## Marco conceptual (siempre en contexto)

### Los 6 ejes

| Eje | Definición corta |
|-----|-----------------|
| Deculturación | La cultura pasa de estructura normativa a repertorio simbólico |
| Erosión de mediaciones | Partidos, medios, iglesia, comunidad pierden peso; los reemplazan algoritmos |
| Desrepresentación | Las instituciones políticas existen pero pierden densidad simbólica |
| Estetización | Los símbolos circulan sin anclaje histórico, se vuelven consumibles |
| Desorientación epistemológica | Se debilita la capacidad de distinguir lo real, lo verdadero, lo relevante |
| Atención (transversal) | La atención es la mediación invisible que organiza la experiencia del mundo |

### El método (4 pasos)

1. **Disparador** — escena concreta (noticia, imagen, estadística)
2. **Desplazamiento** — del evento al proceso estructural que revela
3. **Conceptualización** — interpretación a través de los ejes
4. **Apertura** — pregunta sin respuesta que mantiene la tensión

### Países cubiertos (10)

Argentina, Brasil, Chile, Colombia, Bolivia, Perú, Uruguay, Paraguay, Ecuador, Venezuela.

---

## El producto: qué construir

### Visión

Una plataforma web de análisis político internacional con:
- Mapa de Sudamérica **invertido** (sur arriba, referencia a Torres García / América Invertida 1943) como interfaz principal
- Entregas semanales de análisis estructural por país
- Resúmenes acumulativos por país
- Marco conceptual propio como capa de interpretación visible
- Sistema de citas y fuentes trazables (requisito no negociable — ver abajo)

**Escala mínima:** herramienta personal de producción para el autor.
**Escala máxima:** plataforma colaborativa de análisis político para múltiples analistas.

Arrancar por mínima, diseñar para que pueda escalar.

### Flujo semanal (lo que el producto tiene que resolver)

```
1. INGESTA — noticias de la semana por país (RSS + manual)
2. FILTRADO — cuáles son estructuralmente relevantes (no coyunturales)
3. CLASIFICACIÓN — qué eje activa cada evento
4. ANÁLISIS — método de 4 pasos por país seleccionado
5. DESPACHO — integración semanal publicable (Substack)
6. ARCHIVO — actualización de la base de conocimientos
```

### Requisito de citas (no negociable)

Cada evento analizado debe tener:
- Fuente primaria (URL)
- Medio de comunicación
- Fecha de publicación
- Autor (si aplica)

El análisis no puede existir sin el evento, y el evento no puede existir sin la fuente. La trazabilidad es parte del proyecto — un proyecto sobre desorientación epistemológica no puede operar sin ella.

---

## Especificación técnica

### Stack recomendado

**Backend**
- Python (FastAPI) o Node.js (Express)
- Base de datos: PostgreSQL (eventos, fuentes, análisis, países, ejes)
- RSS aggregator: `feedparser` (Python) o `rss-parser` (Node)
- Scheduler: cron semanal para pull de fuentes

**Frontend**
- Next.js (React) o SvelteKit
- Mapa: D3.js con GeoJSON de Sudamérica — invertir el eje Y para efecto Torres García
- Editor de análisis: textarea o rich text simple (no hace falta Notion)

**Hosting**
- Backend: Railway o Render
- Frontend: Vercel
- DB: Railway PostgreSQL o Supabase

### Modelo de datos (mínimo viable)

```sql
-- Fuentes de noticias por país
sources (id, country, name, rss_url, type) -- type: hegemonic|alternative|analysis

-- Eventos de la semana
events (id, country, title, url, medium, author, published_at, week, year)

-- Clasificación por eje
event_axes (event_id, axis, is_primary)

-- Análisis
analyses (id, event_id, country, week, year, 
          disparador, desplazamiento, conceptualizacion, apertura,
          created_at, published)

-- Despacho semanal
dispatches (id, week, year, title, entrada, hilo, cierre, published_at)
dispatch_analyses (dispatch_id, analysis_id)
```

**Agendas (Spec 27-28).** No viven en la base de datos del backend. Son archivos markdown con frontmatter YAML en el vault: `15-Países/agendas/<slug>.md` para el live, `60-Borradores/agendas/<slug>.md` para borradores. Cada archivo tiene array `agendas[]` con `rank`, `title`, `description`, `tendencia`, `query`, `eje` (opcional) y los parámetros `gl/ceid/hl` de Google News por país. El frontend lee server-side vía `lib/agendas.ts`.

### Fuentes RSS sugeridas por país

| País | Fuentes sugeridas |
|------|------------------|
| Argentina | Infobae, El Destape, El Cohete a la Luna |
| Brasil | Agência Brasil, The Intercept Brasil, Folha |
| Chile | El Mostrador, CIPER, La Tercera |
| Colombia | El Espectador, La Silla Vacía, Semana |
| Bolivia | Los Tiempos, El Deber |
| Perú | La República, OjoPúblico |
| Uruguay | La Diaria, El País |
| Paraguay | ABC Color |
| Ecuador | El Universo, GK |
| Venezuela | Tal Cual, Efecto Cocuyo |

---

## El mapa invertido (diseño)

**Referencia:** Joaquín Torres García, "América Invertida" (1943). El sur arriba es una declaración epistemológica, no solo estética.

**Implementación técnica:**
```js
// Con D3.js — invertir proyección
const projection = d3.geoMercator()
  .scale(scale)
  .center([centerLon, centerLat])
  .rotate([0, 0, 180]) // rotación para invertir
  // o bien: transformar las coordenadas del GeoJSON multiplicando lat * -1
```

**GeoJSON:** usar Natural Earth 1:50m de Sudamérica. Disponible en naturalearthdata.com (dominio público).

**Interacción:**
- Hover → resalta país + tooltip con resumen de ejes crónicos
- Click → abre panel de análisis de la semana
- Color del punto/área → codifica qué eje está más activo esa semana
- Filtro por eje → resalta países donde ese eje está activo

---

## Plugin de Cowork

El archivo `mapa-inestable.plugin` contiene los skills y scheduled tasks que asisten la producción editorial. **Ver Spec 29 (Calendario de agentes automáticos) para el inventario completo y el ritmo semanal.**

### Skills on-demand (humano dispara)

- **`analisis-semanal`** — genera análisis completo por país con el método de 4 pasos. Activar: "analizá [país]" o pegando noticias.
- **`despacho-semanal`** — integra análisis de la semana en pieza publicable. Activar: "armá el despacho".
- **`promover-agenda`** (Spec 28 §5, pendiente) — promueve un borrador de agenda a live. Activar: "promové la agenda de [país]".

### Skills disparados por scheduled task

- **`agente-diario`** (Specs 23-25) — corre lun-vie por la mañana, deposita borradores de análisis en `60-Borradores/diario/`.
- **`agenda-semanal`** (Spec 28, pendiente) — corre **viernes 17:00 ART**, una tarea por país (10 en total). Genera borradores en `60-Borradores/agendas/<slug>.md` y un archivo de resumen semanal `_resumen-YYYY-W##.md`.

### Principios del sistema de agentes (Spec 29)

1. Borrador → promote, nunca auto-publish. El vault es el medio de comunicación (no Slack, no email).
2. Cada corrida multi-ítem deja un archivo de resumen.
3. Aislación: una tarea por unidad (un país, un eje) en lugar de mega-tasks que loopean.
4. Ningún agente automático escribe directo a carpetas live (`15-Países/agendas/`, `50-Publicaciones/`) — solo los skills de promote disparados por humanos.

Los skills tienen los 6 ejes, el método y los perfiles de países como referencias permanentes. Ofrecen guardar en Obsidian con confirmación.

---

## Decisiones de diseño ya tomadas

| Decisión | Resolución |
|----------|-----------|
| ¿Blog o plataforma? | Plataforma con entregas semanales |
| ¿Cobertura geográfica? | Sudamérica, 10 países, arrancar completo |
| ¿Input de noticias? | RSS + manual (mixto), sin scraping agresivo |
| ¿Guardar análisis? | Confirmar antes de guardar, nunca automático |
| ¿Colaborativo desde el inicio? | No — primero herramienta personal, diseñar para escalar |
| ¿Citas de fuentes? | Obligatorias — parte del modelo de datos, no opcional |
| ¿Interfaz del mapa? | Mapa invertido Torres García, D3.js + GeoJSON |
| ¿Publicación? | Substack mientras no hay plataforma propia |

---

## Pregunta central del proyecto

> ¿Cómo se sostiene la vida democrática cuando se debilitan las mediaciones culturales, políticas y cognitivas que la hicieron posible?

---

## Notas para la sesión de Claude Code

- La base de conocimientos en `10-Ejes/` y `20-Metodo/` es la referencia conceptual permanente
- La plataforma está construida — arrancar leyendo `platform/` y los specs relevantes antes de tocar código
- Para cambios de UI: leer el spec correspondiente en `70-Producto/specs/` + el design system en `70-Producto/design-system/design-system.md`
- El mapa Torres García vive en el frontend como componente React con hot-zones por país; las coordenadas editoriales están calibradas en Spec 22
- Los bug reports siguen el patrón `BUG-NNN-descripcion.md` en `70-Producto/specs/`
- Specs con número secuencial (`01-…`, `32-…`) son features; bug reports (`BUG-001`, `BUG-002`, `BUG-003`) son correcciones
- Para entender el sistema de agentes automáticos antes de tocar cualquier skill o scheduled task, leer Spec 29 — es el calendario unificado y se actualiza cuando entra o cambia un agente
- Las agendas por país son la única capa de datos del proyecto que vive **solo** en el vault (no en backend). Ver Specs 27 y 28
