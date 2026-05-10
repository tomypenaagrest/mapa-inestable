---
spec: 19
titulo: /ensayos como revista editorial
estado: borrador
autor: Tomás (con Claude)
fecha: 2026-05-09
depende_de: [01, 04, 08, 11, 15]
afecta: [/ensayos, /ensayos/[slug]]
resuelve: Spec 08 §2.5 (estado de /ensayos sin verificar)
---

# 19 · /ensayos como revista editorial

## Resumen

`/ensayos` existe en código (Spec 08 §2.5) pero ninguna spec previa la describió en detalle. El render actual sigue probablemente el patrón genérico de listado de cards usado en `/despachos` y `/analisis`. Esta spec rediseña la página como **revista**: hero editorial, grid de miniaturas con cover image, jerarquía visual fuerte, espacio en blanco generoso. Se diferencia del archivo de análisis (Spec 05) — ahí el patrón es buscar y filtrar; acá es navegar como quien hojea una publicación impresa.

**Decisión central:** los ensayos son la pieza más larga y más cuidada del proyecto. Merecen tratamiento de revista, no de feed.

---

## 1. Diferencia con /analisis y /despachos

| Página | Función | Patrón visual |
|---|---|---|
| `/analisis` (Spec 05) | Buscar y filtrar el corpus de análisis | Filtros sticky + grid denso de cards |
| `/despachos` | Listado cronológico de despachos semanales | Lista vertical con metadata prominente |
| `/ensayos` (esta spec) | Hojear las piezas largas | Grid editorial tipo revista, jerarquía variable |

Los ensayos son cualitativamente distintos del análisis individual o del despacho:

- Más largos (3.000-8.000 palabras vs 800-1.200 del análisis).
- Más cuidados editorialmente — son las "piezas grandes" del proyecto, donde un eje se trabaja a fondo.
- Cadencia más espaciada (mensual o bimestral, no semanal).
- Conviven con autores invitados eventualmente (no solo Tomás).

La página debería sentirse distinta. La metáfora es revista, no archivo.

---

## 2. Estructura propuesta

### 2.1 Layout desktop (≥960px)

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER: ENSAYOS                                                  │
│  Piezas largas que trabajan un eje a fondo · cadencia mensual    │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  HERO PRINCIPAL — el ensayo destacado (1 col 100%)                │
│  ┌──────────────────────┬──────────────────────────────────────┐ │
│  │  COVER IMAGE         │  AXIS PILL · 12 min de lectura       │ │
│  │  (320×400 o 480×320  │                                       │ │
│  │   según orientación) │  TÍTULO h1 (Fraunces 52px)            │ │
│  │                      │                                       │ │
│  │                      │  Lede de 2-3 oraciones                │ │
│  │                      │  (Lora 22px italic)                   │ │
│  │                      │                                       │ │
│  │                      │  Por Tomás · sem 18 · 2026            │ │
│  └──────────────────────┴──────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  FILTROS EDITORIALES                                              │
│  [Todos] [Desorientación] [Erosión] [Estetización] ...           │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  GRID DE MINIATURAS (3 columnas)                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                        │
│  │ COVER    │  │ COVER    │  │ COVER    │                        │
│  │ (300×    │  │          │  │          │                        │
│  │ 200)     │  │          │  │          │                        │
│  ├──────────┤  ├──────────┤  ├──────────┤                        │
│  │ axis pill│  │ axis pill│  │ axis pill│                        │
│  │ TÍTULO   │  │ TÍTULO   │  │ TÍTULO   │                        │
│  │ Lede     │  │ Lede     │  │ Lede     │                        │
│  │ corto    │  │ corto    │  │ corto    │                        │
│  │ Por T·sem│  │ Por T·sem│  │ Por T·sem│                        │
│  └──────────┘  └──────────┘  └──────────┘                        │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                        │
│  │ ...      │  │ ...      │  │ ...      │                        │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  ESPACIO EN BLANCO GENEROSO (no rellenar con CTAs ni promos)      │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Espaciado y proporciones

- **Hero**: padding 64px arriba y abajo, 80px márgenes laterales del bloque hero (no del container general).
- **Entre hero y filtros**: 96px de espacio vertical.
- **Entre filtros y grid**: 48px.
- **Gap del grid**: 48px horizontal, 64px vertical.
- **Padding inferior de la página**: 160px (espacio en blanco generoso al final, no rellenar con widgets).

Densidad menor que `/analisis`. Esa densidad menor es la decisión.

### 2.3 Layout tablet (640-959px)

- Hero: cover image arriba (full-width), texto debajo.
- Grid: 2 columnas.
- Filtros: scroll horizontal touch.

### 2.4 Layout mobile (≤640px)

- Hero: cover image arriba, texto debajo. Cover en aspect 4:3, no 4:5 (más legible en pantalla angosta).
- Grid: 1 columna.
- Filtros: dropdown o scroll horizontal (alineado con Spec 16 §7).

---

## 3. Cover images

### 3.1 Por qué se incluyen

Los análisis individuales y los despachos son piezas que se citan y se mandan; conviven bien en formato texto puro. Los ensayos son piezas que se anuncian como evento — la cover image los marca como "pieza grande" y le da al lector una entrada visual.

### 3.2 Naturaleza de las covers

Tres opciones (no excluyentes):

| Tipo | Ejemplo | Costo de producción |
|---|---|---|
| Fotográficas | Imagen documentaria, archivo, retrato | Medio — buscar/licenciar imágenes |
| Tipográficas | Composición Alfa Slab One sobre fondo terracota o cream | Bajo — Tomás puede hacerlas |
| Ilustración | Dibujo o composición gráfica original | Alto — requiere ilustrador |

**Propuesta default v1:** mix. Los ensayos con foto disponible la usan; el resto va con cover tipográfica generada con la paleta Grabado y el título en Alfa Slab One. Sirve como fallback automático.

### 3.3 Especificaciones técnicas

- Formato: WebP con fallback JPEG.
- Aspect ratios soportados: 16:9 (horizontal default), 4:5 (vertical para hero), 1:1 (cuadrado para casos especiales).
- Tamaños: 1200×675 (hero desktop), 600×400 (miniatura desktop), 800×600 (mobile).
- Frontmatter del ensayo: `cover_image: "..."` (ruta o URL), `cover_aspect: "horizontal" | "vertical" | "square"`, `cover_caption: "..."` (opcional, atribución).
- Si no hay `cover_image`, se renderiza la cover tipográfica fallback automáticamente.

### 3.4 Cover tipográfica fallback

```
┌──────────────────────────────────┐
│                                  │
│  [TERRACOTA con mi-grain]        │
│                                  │
│  ENSAYO                          │
│  DESORIENTACIÓN EPISTEMOLÓGICA   │
│                                  │
│  TÍTULO DEL ENSAYO               │
│  EN ALFA SLAB ONE                │
│                                  │
│  MAPA INESTABLE                  │
│                                  │
└──────────────────────────────────┘
```

Composición SVG (no imagen estática). Se genera al render. Componente: `<EssayCoverFallback>`.

---

## 4. Componente miniatura

### 4.1 Anatomía

```
┌──────────────────────────────────┐
│  [COVER IMAGE / FALLBACK]        │
│  300×200px aspect ratio fijo     │
├──────────────────────────────────┤
│  AXIS PILL · 12 MIN              │  ← mono uppercase 11px
│                                  │
│  Título del ensayo                │  ← Fraunces 22px, max 3 líneas
│                                  │
│  Lede corto (1-2 oraciones,       │  ← Lora 15px italic
│  máx 2 líneas truncadas)          │
│                                  │
│  Por Tomás · sem 18 · 2026        │  ← mono 12px, color ink-mute
└──────────────────────────────────┘
```

### 4.2 Estados

- **Default**: cream `--mi-bg-paper`, border-thick `--mi-rule-soft`, shadow-card.
- **Hover**: translate -2 -2, shadow-card-lift. Cover image leve scale 1.02 si hay imagen real.
- **Visited / leído**: título en `--mi-ink-mute` (Spec 15 §5.4 marker de leído). Cover image opacity 0.85.
- **Nuevo desde lastVisit**: dot dorado top-right del card (Spec 15 §5.4).

### 4.3 Tipografía

Mantiene la jerarquía del DS:
- Título: Fraunces (no Alfa Slab One — Alfa queda para hero y para covers).
- Lede: Lora italic.
- Metadata: IBM Plex Mono.

### 4.4 Componente

`<EssayCard>`. Reusa el chasis general de tarjeta del DS pero suma cover image y lede explícito.

```ts
{
  essay: {
    slug: string;
    title: string;
    lede: string;
    axis: AxisKey | AxisKey[];   // primary axis del ensayo
    author: string;
    week: number;
    year: number;
    coverImage?: string;
    coverAspect?: "horizontal" | "vertical" | "square";
    readingTime: number;          // en minutos
    publishedAt: string;
  };
  variant: "hero" | "thumbnail";
}
```

---

## 5. Hero — el ensayo destacado

### 5.1 Cuál se destaca

Default: el más reciente. Sobre-escribible con el frontmatter `featured: true` en un ensayo más viejo.

Si hay más de un ensayo con `featured: true`, gana el más reciente (no se hace carrusel de heroes — un solo hero).

### 5.2 Layout del hero

```
desktop ≥960:
┌────────────┬────────────────────────────┐
│ COVER      │  AXIS PILL · 12 MIN        │
│ 480×400    │                             │
│ (vertical  │  TÍTULO h1 Fraunces 52px    │
│  o 4:5)    │                             │
│            │  Lede largo (2-3 oraciones) │
│            │  Lora 22px italic           │
│            │                             │
│            │  Por Tomás · sem 18 · 2026  │
│            │                             │
│            │  [LEER →]                   │
└────────────┴────────────────────────────┘

mobile:
┌────────────────────────────┐
│ COVER (full-width 4:3)     │
├────────────────────────────┤
│ AXIS PILL                  │
│ TÍTULO Fraunces 36px       │
│ Lede                       │
│ Por Tomás · sem 18 · 2026  │
│ [LEER →]                   │
└────────────────────────────┘
```

### 5.3 Componente

`<EssayHero>`. Variante de `<EssayCard>` con tipografía amplificada y layout split.

---

## 6. Filtros

### 6.1 Patrón

Chips axis-pill horizontales. Multi-select. URL state: `?eje=desorientacion,estetizacion`.

```
[ Todos ]  [ Desorientación ]  [ Erosión ]  [ Desrepresentación ]
[ Estetización ]  [ Desorientación epist. ]  [ Atención ]
```

Click en un chip lo activa (color del eje + cream interno). Click en "Todos" limpia.

### 6.2 Estado vacío

Si la combinación no tiene resultados:

```
NO HAY ENSAYOS QUE COMBINEN [DESORIENTACIÓN] Y [ATENCIÓN] TODAVÍA.
ESTOS DOS EJES SE TOCAN EN LOS ANÁLISIS SEMANALES.
[ → VER ANÁLISIS DEL CRUCE ]
```

Es coherente con la naturaleza del proyecto: los ensayos son escasos por design, no se forzará "no encontramos resultados" tipo Google.

### 6.3 Sin filtros temporales

A diferencia de `/analisis`, no hay filtro por año / semana en `/ensayos`. La cadencia espaciada de los ensayos hace que el orden cronológico ya sea legible — no son tantos como para necesitar facets temporales.

---

## 7. Página individual `/ensayos/[slug]`

### 7.1 Heredada del análisis

El render del ensayo individual hereda el patrón del análisis individual (Spec 15 §4.4) con dos diferencias:

1. **Cover image al tope** (no solo header textual). Full-width, 16:9 desktop o 4:3 mobile. Caption opcional al pie de la cover.
2. **No tiene los 4 step blocks del método**. El ensayo es prosa libre — no sigue Disparador/Desplazamiento/Conceptualización/Apertura. La lectura es lineal.

Lo demás se mantiene:
- Aside expandible con footnotes tipados (Spec 15 §3.3).
- Frame strip al inicio con eje principal (Spec 15 §4.2).
- Cross-reference panel al pie (Spec 01 §5.2).
- Quote-as-card por párrafo (Spec 15 §4.7).
- Markers de lectura (Spec 15 §5.4).

### 7.2 Componente

`<EssayLayout>`. Wrapper sobre el patrón del análisis individual con la cover y sin step blocks.

---

## 8. Roadmap

### Fase A — Estructura del listado (1 sprint)

1. `<EssayCard>` con variantes hero y thumbnail.
2. Layout de la página `/ensayos` con grid responsive.
3. Filtros por eje con URL state.
4. Cover tipográfica fallback `<EssayCoverFallback>` para los ensayos que aún no tienen imagen.
5. Espaciado generoso aplicado.

### Fase B — Cover images reales (continuo)

1. Tomás (o un colaborador) provee covers para los ensayos existentes.
2. Frontmatter de cada ensayo se extiende con `cover_image`.
3. La fallback queda activa solo para ensayos sin cover real.

### Fase C — Ensayo individual (1 sprint)

1. `<EssayLayout>` con cover al tope.
2. Adaptación del patrón de análisis a prosa libre (sin step blocks).
3. Smoke test sobre los ensayos publicados.

---

## 9. Decisiones pendientes

1. **Cantidad de columnas del grid en desktop ancho (≥1240px)** — propongo 3. Si los ensayos crecen mucho, podría considerarse 4. Decisión: 3 ahora, revisar al cabo de 20 ensayos.
2. **Cover image obligatoria u opcional** — propongo opcional con fallback automática. Confirmar.
3. **Reading time** — ¿se calcula automáticamente (palabras / 200) o se anota en frontmatter? Propongo automático con override manual.
4. **Caption de cover en hero** — sí/no. Propongo sí en mobile (la cover ocupa más), no en desktop hero (compite con el texto).
5. **Featured editorial vs cronológico** — ¿el frontmatter `featured: true` overrides al más reciente? Propongo sí.
6. **Si los ensayos tendrán autores invitados eventualmente**, ¿el campo `author` admite array o single? Propongo array con default `["Tomás"]`.
7. **Newsletter signup integrado en `/ensayos`** — sí/no. Spec 15 menciona email capture pero no lo concreta. Propongo no en v1; queda para spec de captura unificada.
