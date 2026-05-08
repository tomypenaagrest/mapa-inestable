# Mapa Inestable — Design System

**Dirección:** Grabado · **Versión:** 1.0 · **Fecha:** 27 abr 2026

---

## Qué es esto

Este documento es la referencia visual y técnica del sistema de diseño de Mapa Inestable. Define los principios, los tokens, los componentes y la voz que rigen la web platform en construcción y, eventualmente, cualquier publicación que opere bajo la marca.

Acompaña a dos archivos:

- `design-tokens.css` — todos los tokens declarados como variables CSS, listos para pegar en el futuro proyecto Next.js / SvelteKit.
- `home-prototype.html` — prototipo funcional del home con el sistema aplicado, incluido el mapa invertido.

---

## La dirección: Grabado

Mapa Inestable es un proyecto sobre la pérdida de mediaciones. Su sistema visual no podía ser sobrio: la sobriedad es exactamente la promesa que el proyecto cuestiona.

La dirección elegida —**Grabado**— reclama una tradición visible: la del Taller de Gráfica Popular mexicano, Antonio Berni, Joaquín Torres García, los panfletos políticos del cono sur, las revistas culturales impresas. La traduce a una interfaz contemporánea sin moderarla.

No es decoración. Es declaración: **el sur arriba, la materialidad arriba, el grabado arriba.**

---

## Principios

### 1. El sur arriba

El mapa de Sudamérica se invierte siempre. Es referencia explícita a *América Invertida* de Joaquín Torres García (1943) y se mantiene a lo largo de todo el sistema, no solo en la home. Los thumbnails de país, los marcadores, los fondos decorativos: todos respetan la inversión. No es un truco visual: es una declaración epistemológica.

### 2. La materialidad importa

Los bordes son thick. Las sombras son sólidas, no difusas. Los colores son terracota y verde profundo, no grises corporate. El border-radius es 0. Cada elemento se siente como impreso, no como flotante. Si una decisión te tira al territorio de "app SaaS limpia", probablemente está mal.

### 3. La trazabilidad es estética

Cada análisis muestra siempre: **país, eje activado, fecha, fuente.** La cita no es nota al pie — es metadata visible, en mono, en lugares de jerarquía. Un proyecto sobre desorientación epistemológica no puede operar sin ella, y el sistema visual lo refuerza.

### 4. La tipografía es voz

Cuatro familias, una jerarquía clara:

- **Alfa Slab One** — el grito. Brand, hero, nombres de país. No usar para texto largo, jamás.
- **Fraunces (SOFT axis)** — los títulos pensados. Variabilidad permite ajustar peso y "softness" según contexto.
- **Lora** — la prosa larga. Lectura serena, italianas funcionales.
- **IBM Plex Mono** — la maquinaria. Metadata, fuentes, fechas, tags, código.

### 5. La densidad es virtud

Esto no es Medium. Esto es un periódico crítico latinoamericano. El home muestra muchos análisis, no uno. La grilla pesa. Si una vista se siente "vacía" o "respirada", probablemente perdió el ADN de Mapa Inestable. Aire sí, pero el aire es un descanso entre piezas, no la dominante.

---

## Tokens · Color

| Token | Hex | Uso |
|---|---|---|
| `--mi-bg` | `#C5663A` | **Fondo dominante.** Terracota del logo. La superficie por defecto del sistema. |
| `--mi-bg-warm` | `#B45729` | Fondo profundo. Hover de cards, énfasis, área activa. |
| `--mi-bg-paper` | `#F4E9D2` | **Papel.** Crema cálido. Cards, surfaces que aparecen sobre terracota. |
| `--mi-bg-cream` | `#ECE0C5` | Crema apagado. Contenedores secundarios, sidebars. |
| `--mi-bg-dark` | `#1F2A12` | Verde-negro. Footer, secciones inversas, hero-art. |
| `--mi-ink` | `#1F2A12` | **Tinta principal.** No negro puro — verde profundo del logo. |
| `--mi-ink-soft` | `#3D4A26` | Texto secundario, lede, descripciones. |
| `--mi-ink-mute` | `#5C6638` | Metadata, fechas, captions. |
| `--mi-accent-gold` | `#E8C58A` | **Oro.** Amarillo del trepador del logo. Highlight, énfasis, activos sobre fondo oscuro. |
| `--mi-accent-warn` | `#B45729` | Alertas, badges urgentes. |
| `--mi-rule` | (= `--mi-ink`) | Líneas y bordes principales. |
| `--mi-rule-soft` | `#C8B894` | Líneas suaves sobre fondos cremas. |

**Regla de uso:**

- Sobre `--mi-bg` (terracota), texto siempre en `--mi-ink` o `--mi-bg-paper`.
- Sobre `--mi-bg-paper` (crema), texto en `--mi-ink` o `--mi-ink-soft`.
- Sobre `--mi-bg-dark` (verde-negro), texto en `--mi-bg-paper` o `--mi-accent-gold`.
- **Nunca** usar gris en lugar de la tinta verde-negra. El verde es deliberado.

### Color por eje

Cada uno de los seis ejes conceptuales tiene un color que se usa en pills, badges y para colorear el mapa según qué eje está activo en cada país esa semana.

| Eje | Token | Hex |
|---|---|---|
| Deculturación | `--mi-axis-deculturacion` | `#6B4A38` |
| Erosión de mediaciones | `--mi-axis-mediaciones` | `#4A5C30` |
| Desrepresentación | `--mi-axis-desrepresentacion` | `#8A4A55` |
| Estetización | `--mi-axis-estetizacion` | `#B45729` |
| Desorientación | `--mi-axis-desorientacion` | `#2D4A6B` |
| Atención (transversal) | `--mi-axis-atencion` | `#C8993E` |

---

## Tokens · Tipografía

### Familias

| Token | Familia | Cuándo |
|---|---|---|
| `--mi-font-display` | Alfa Slab One | Brand, country names, hero stamps. **Nunca** body. |
| `--mi-font-title` | Fraunces | Títulos h1–h4. Usar SOFT 50–60 para feel hand-carved. |
| `--mi-font-body` | Lora | Texto largo, lede, descripciones. |
| `--mi-font-mono` | IBM Plex Mono | Metadata, fechas, fuentes, tags, código. |

### Escala

| Token | Tamaño | Uso típico |
|---|---|---|
| `--mi-text-xs` | 11px | Tags, country marks, timestamps |
| `--mi-text-sm` | 13px | Metadata extendida, captions |
| `--mi-text-base` | 17px | Body por defecto |
| `--mi-text-lg` | 19px | Lede, prose enfatizada |
| `--mi-text-xl` | 22px | Card titles, h4 |
| `--mi-text-2xl` | 28px | h3, grid section titles |
| `--mi-text-3xl` | 36px | h2, sub-headlines |
| `--mi-text-4xl` | 52px | h1, hero titles |
| `--mi-text-5xl` | 72px | Section displays |
| `--mi-text-display` | 110px | Country names en hero, brand size |

---

## Tokens · Espaciado

Sistema de 8px. `--mi-space-N` donde `N` va de 0 a 9.

```
0  → 0px
1  → 4px     (gaps mínimos, separadores en línea)
2  → 8px     (padding interno tight)
3  → 16px    (padding por defecto, gaps en grid)
4  → 24px    (separación entre elementos relacionados)
5  → 32px    (separación entre cards)
6  → 48px    (padding de container, separación de secciones cortas)
7  → 72px    (separación de secciones grandes)
8  → 96px    (entre bloques mayores)
9  → 128px   (entre el hero y la siguiente sección)
```

---

## Tokens · Bordes y sombras

### Bordes

| Token | Definición | Uso |
|---|---|---|
| `--mi-border-hair` | 1px solid ink | Separadores sutiles, footers |
| `--mi-border-soft` | 1px solid rule-soft | Separadores en cream |
| `--mi-border-thick` | 2px solid ink | Cards, inputs |
| `--mi-border-bold` | 3px solid ink | Hero, secciones de énfasis |
| `--mi-border-dashed` | 1px dashed ink | Separadores internos en cards |

`--mi-radius` está fijado en `0`. **Nunca redondear.** La materialidad gráfica no permite redondeos.

### Sombras (firma del sistema)

Las sombras son **sólidas, no difusas**. Replican el offset del registro en grabado — el efecto del papel mal alineado en una imprenta. Son el trace.

| Token | Definición | Uso |
|---|---|---|
| `--mi-shadow-card` | `6px 6px 0 ink` | Cards estándar |
| `--mi-shadow-card-lift` | `8px 8px 0 ink` | Hover de card |
| `--mi-shadow-hero` | `12px 12px 0 ink` | Hero featured, secciones protagónicas |

**Nunca** usar `box-shadow` con blur. Si el navegador difumina una sombra, perdimos.

---

## Componentes

### Logo

Tres versiones del logo se usan según contexto:

1. **Logo completo** (figura trepando) — para hero, splash, página de about, redes sociales.
2. **Logotipo + monograma horizontal** — para header del sitio. La versión que aparece en el masthead.
3. **Mark solo (el avatar circular naranja-verde)** — para favicon, OG image, contextos pequeños donde solo cabe el ícono.

**Reglas:**

- Nunca usar el logo sobre fondos que no sean `--mi-bg`, `--mi-bg-paper` o `--mi-bg-dark`.
- Nunca aplicar drop-shadow blur al logo. Si necesita destacarse, usar `--mi-shadow-hero` (sombra sólida).
- El monograma puede acompañarse de la palabra "Mapa Inestable" en `--mi-font-display` (Alfa Slab One) en `text-transform: uppercase`.

### Hero featured (análisis del día)

```
┌──────────────────────────────────────────────────────────┐
│ [hero-art: country-display]    [hero-text: title + lede] │
│ Verde-negro · texto cream      Cream · texto ink         │
│ Alfa Slab One 110px country    Fraunces 52px h1          │
│ + stamp de fecha               + axis tag + lede + cta   │
└──────────────────────────────────────────────────────────┘
```

- Borde `--mi-border-bold` (3px), sombra `--mi-shadow-hero` (12 12 0).
- El bloque-arte (izq) siempre es `--mi-bg-dark` con tipografía display gigante (country name) y un `text-shadow: 4px 4px 0 var(--mi-bg)` para hacer la palabra "vibrar" sobre el fondo oscuro.

### Card de análisis (grilla)

```
┌─────────────────────────────┐
│ [country tag · ink+terra]   │
│ h3 (Fraunces 22px)          │
│ desc (Lora 14px ink-soft)   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ [eje · mono] · [fuente]     │
└─────────────────────────────┘
```

- Fondo `--mi-bg-paper`, borde `--mi-border-thick`, sombra `--mi-shadow-card`.
- Hover: `transform: translate(-2px, -2px)` + sombra a `--mi-shadow-card-lift`. La sensación es que la card "se despega" del papel.
- Country tag siempre en bloque ink con texto terra/cream. Funciona como sello de origen.

### Axis pill

Pill compacto con el nombre del eje. Color de fondo según el eje (ver tokens semánticos por eje), texto en `--mi-bg-paper`, tipografía mono uppercase.

```
[ DESREPRESENTACIÓN ]   ← color #8A4A55, texto cream
```

### Source badge

Bloque de metadata con la fuente primaria del análisis:

```
FUENTE · La Silla Vacía
PUBLICADO · 27 abr 2026
AUTOR · Mapa Inestable
```

- IBM Plex Mono, `--mi-text-xs`, letter-spacing wide, uppercase.
- Color `--mi-ink-mute` para etiquetas, `--mi-ink` para valores.
- En contextos sobre fondo oscuro: etiquetas en `--mi-accent-gold`, valores en `--mi-bg-paper`.

### Mapa interactivo (mapa invertido)

El componente protagónico del sistema. Sudamérica representada con el sur arriba (rotación 180° o `scale(1, -1)`).

**Estados:**

- **Default:** silueta en `--mi-bg-paper` sobre `--mi-bg`, contornos en `--mi-ink` 1.5px.
- **País con análisis activo esa semana:** relleno con el color del eje activo, dot dorado (`--mi-accent-gold`) en su centro.
- **Hover:** outline ink se engrosa a 3px, tooltip flotante con país + título del análisis.
- **Click:** abre el panel de análisis lateral.

**Reglas:**

- El mapa nunca se muestra "en derecho" (norte arriba). Sería traicionar el principio.
- Los nombres de país se imprimen sobre el mapa en `--mi-font-mono` size xs, no en serif.

### Botones

```css
/* Primary */
.mi-btn-primary {
  background: var(--mi-ink);
  color: var(--mi-bg-paper);
  font-family: var(--mi-font-mono);
  font-size: var(--mi-text-xs);
  letter-spacing: var(--mi-tracking-wider);
  text-transform: uppercase;
  padding: 12px 20px;
  border: 2px solid var(--mi-ink);
  box-shadow: var(--mi-shadow-card);
  transition: transform var(--mi-duration-quick) var(--mi-ease);
}
.mi-btn-primary:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--mi-shadow-card-lift);
}

/* Ghost */
.mi-btn-ghost {
  background: transparent;
  color: var(--mi-ink);
  border: 2px solid var(--mi-ink);
  /* el resto igual al primary */
}

/* Link */
.mi-btn-link {
  background: none;
  border: none;
  border-bottom: 2px solid var(--mi-ink);
  padding: 0 0 4px;
  font-family: var(--mi-font-mono);
  text-transform: uppercase;
}
```

### Footer

- Fondo `--mi-bg-dark`, padding `--mi-space-7` vertical.
- Tres columnas: hipótesis del proyecto (manifiesto en italic Fraunces), los seis ejes (lista mono), los diez países (agrupados de a dos o tres).
- Nunca redes sociales con íconos brillosos. Si hay enlaces a redes, en mono uppercase.

---

## Voz visual

### Hacer

- Densidad. Mostrar varias piezas en una vista.
- Bordes thick. Sombras sólidas. Cero radius.
- Metadata visible (fuente, eje, fecha) — nunca esconder la trazabilidad.
- Contraste alto entre terracota y verde-negro. Es la identidad.
- Tipografía display (Alfa Slab) en momentos protagónicos. Hace ruido. Bien.
- Latín latinoamericano: "Cartografía política del sur". El idioma es parte de la marca.

### No hacer

- Border-radius. Ni siquiera 4px.
- Box-shadow con blur. Las sombras son sólidas o no son.
- Gris corporate. La tinta es verde profundo, no `#888`.
- Iconos simpáticos. Si hace falta un icono, es un símbolo gráfico (estrella, mapa, sello), no un emoji.
- Mapas con norte arriba.
- "Léeme" en lugar de "leer análisis".

---

## Implementación técnica

### Importar tokens

```html
<link rel="stylesheet" href="/design-tokens.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Fraunces:opsz,wght,SOFT@9..144,400..900,0..100&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Stack recomendado

- **Frontend:** Next.js (App Router) o SvelteKit. Tailwind con tokens custom (extender `theme.colors`, `theme.fontFamily`, `theme.boxShadow` a partir de los tokens del sistema).
- **Mapa:** D3.js + GeoJSON Natural Earth 1:50m. Inversión vía `projection.rotate([0, 0, 180])` o `transform: scale(1, -1)` sobre el `<g>` contenedor. Tooltips manuales (no librería) para mantener control del estilo.
- **Tipografía:** Google Fonts en producción está bien. Para más performance: self-host vía `next/font` o `@fontsource`.

### Roadmap de adopción

1. **Ahora** — `home-prototype.html` como referencia visual viva.
2. **Próximo paso** — escaffolding del proyecto en Next.js con `design-tokens.css` importado en el layout.
3. **Después** — implementar mapa invertido como componente independiente con datos de eventos reales.
4. **Eventualmente** — extraer a una librería de componentes (`@mapa-inestable/ui`) si se suman colaboradores.

---

## Referencias visuales

Para discusión y onboarding de colaboradores, las referencias del sistema son:

- **Taller de Gráfica Popular** (México, 1937–2010). Grabado político, contraste alto, terracotas.
- **Antonio Berni** (Argentina). Manchismo, materialidad, política como composición visual.
- **Joaquín Torres García** (Uruguay). *América Invertida* (1943) — el sur arriba.
- **Revista Anfibia** (Argentina, 2012–). Densidad editorial, latinoamericanidad explícita.
- **Revista Crisis** (Argentina, 2010–). Crítica política con personalidad gráfica fuerte.
- **The Dial** (internacional, 2022–). Editorial digital con tipografía clásica y mucha presencia textual. La referencia para "qué *no* somos pero qué nos enseña sobre lectura larga".

---

## Pregunta abierta

> ¿Cómo se sostiene la vida democrática cuando se debilitan las mediaciones culturales, políticas y cognitivas que la hicieron posible?

El sistema visual no responde la pregunta. La hace visible.
