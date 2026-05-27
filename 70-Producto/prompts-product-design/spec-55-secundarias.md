---
tipo: prompt-product-design
spec: 55
fecha: 2026-05-27
estado: reutilizable
herramientas_compatibles: [v0, Lovable, Claude (artifacts), Figma Make]
naturaleza: subproducto del diseño de Spec 55. Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-27). Este prompt regenera los 3 patrones reutilizables para conceptos/autores/acerca/metodo
---

# Prompt para Product Design — Spec 55 (pantallas editoriales secundarias mobile)

## Cómo usar

Antes de leer este prompt, leer `70-Producto/prompts-product-design/spec-50-reading.md` — comparte el contexto compartido del proyecto.

Los 3 prompts abajo regeneran los 3 patrones reutilizables que cubren 6 pantallas:

- Patrón 1 (índice de glosario) → /conceptos + /autores
- Patrón 2 (detalle editorial corto) → /concepto/[slug] + /autor/[slug] — reusa Spec 50
- Patrón 3 (página estática manifiesto) → /acerca + /metodo

---

## Contexto compartido específico de Spec 55

> Mapa Inestable tiene un andamiaje teórico (autores, conceptos) que vive en el vault de Obsidian y se expone públicamente vía Spec 07 (puente vault → sitio con flag `publicar: true`). Adicionalmente tiene páginas estáticas (`/acerca`, `/metodo`) que son condición del lanzamiento — un lector nuevo desde WhatsApp/Substack las visita antes que ninguna otra cosa.
>
> Spec 55 NO modifica el contenido editorial, solo define cómo se renderizan estas pantallas en mobile 360. Reusa el sistema tipográfico de Spec 50 y el header con drawer de Spec 53.

---

## 1. [PROMPT] — Patrón 1 · Índice de glosario

> Diseñá la página `/conceptos` en mobile 360 como índice editorial de un glosario teórico. Phone de 360px ancho con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`.
>
> **Header del site** (Spec 53): 44px, fondo terracota `#C5663A`, logo "⛰ MAPA INESTABLE" izquierda + botón ☰ derecha.
>
> **Page header:**
> - Padding 24 arriba 18 abajo 20 lateral. Border-bottom 1px tinta.
> - Label "GLOSARIO" mono 11 uppercase letter-spacing 0.1em color mute.
> - H1 "Conceptos" en Alfa Slab One 36 line-height 1.05 letter-spacing -0.01em color tinta.
> - Bajada "El andamiaje teórico que distingue al proyecto. Conceptos transversales que reaparecen en los análisis." en Fraunces italic 400 16 line-height 1.4 color tinta-soft.
>
> **Meta row:**
> - Mono 11 uppercase letter-spacing 0.06em, padding 14 arriba 10 abajo lateral 20, border-bottom 1px tinta.
> - "15 CONCEPTOS · ÚLTIMA ACT. 22 MAY 2026" (con N en bold tinta).
>
> **Lista de items** (3 mínimo para validar):
> - Item 1: tag "EJE · ERÓSION DE MEDIACIONES" mono 10 uppercase color terracota oscuro `#B45729`. Título "Tradición inventada" Fraunces 600 22. Descripción "Hobsbawm: prácticas sociales nuevas que se presentan a sí mismas como continuidades de un pasado lejano." Lora italic 14 color tinta-soft. Meta "CITADO EN 6 ANÁLISIS →" mono 10.
> - Item 2: tag "EJE · DESORIENTACIÓN". Título "Trampa territorial". Descripción "Agnew: la fijación analítica al Estado-nación como unidad obvia, que obstruye ver lo que se mueve por debajo o por encima." Meta "CITADO EN 4 ANÁLISIS →".
> - Item 3: tag "EJE · ATENCIÓN". Título "Hegemonía". Descripción "Gramsci: el orden simbólico que se sostiene no por imposición sino por consentimiento moldeado." Meta "CITADO EN 8 ANÁLISIS →".
>
> Separator entre items: 1px dashed `#C8B894`. Item padding 16 lateral 20.
>
> **SIN imágenes thumb** en los items. Decisión deliberada para mantener identidad editorial densa, no patrón blog.

---

## 2. [PROMPT] — Patrón 2 · Detalle editorial corto

> Diseñá `/concepto/trampa-territorial` en mobile 360 como detalle editorial. Phone con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`.
>
> **Header del site** (Spec 53): igual al patrón 1.
>
> **Contenido principal** (padding 22 arriba 16 abajo lateral 20):
> - Tag superior "EJE · DESORIENTACIÓN EPISTEMOLÓGICA" mono 10 uppercase letter-spacing 0.08em color terracota oscuro `#B45729`.
> - H1 "Trampa territorial" Fraunces 600 28 line-height 1.15 color tinta. Margen 12 abajo.
> - Meta row mono 11 uppercase letter-spacing 0.08em color mute (etiqueta) + tinta (valor): "AUTOR · JOHN AGNEW" + "CITADO EN · 4 ANÁLISIS". Border-top + border-bottom 1px tinta, padding 10 vertical, flex gap 12 con wrap.
> - `web_intro` en Lora 400 italic 18 line-height 1.5 color tinta-soft: "La fijación analítica al Estado-nación como unidad obvia obstruye ver lo que se mueve por debajo o por encima." Margen 18 vertical.
> - Body Lora 16/1.6 (Spec 50): "Agnew formula el concepto en *Geopolitics: Re-visioning World Politics* (1998). Argumenta que la disciplina de las relaciones internacionales hereda del siglo XIX un supuesto invisible: el mundo es un mosaico de territorios soberanos y la política es lo que pasa entre ellos."
> - H2 "Cómo aparece en este proyecto" Fraunces 600 22 line-height 1.2 margen 24 arriba 12 abajo.
> - Body Lora 16/1.6 continúa: "La trampa territorial es el ancla del eje *desorientación epistemológica*: si los marcos analíticos heredados no ven las mediaciones supra ni infra-estatales (algoritmos, flujos, narrativas regionales), la realidad política aparece como caos cuando en realidad responde a lógicas que el marco no registra."
>
> **Bloque "Aparece en"** (al pie):
> - Fondo cream apagado `#ECE0C5`. Border-top 2px tinta. Padding 18 lateral 20.
> - Label "APARECE EN" mono 10 uppercase letter-spacing 0.08em color mute. Margen 10 abajo.
> - Chips: "El mapa inestable se reordena", "Colombia · la sospecha antes del voto". Cada chip: mono 10 uppercase letter-spacing 0.06em, padding 3 8, borde 1px tinta, fondo transparente, color tinta.

---

## 3. [PROMPT] — Patrón 3 · Página estática manifiesto

> Diseñá `/acerca` en mobile 360 como página estática editorial. Phone con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`.
>
> **Header del site** (Spec 53): igual al patrón 1.
>
> **Hero:**
> - Fondo terracota `#C5663A`. Border-bottom 2px tinta. Padding 28 arriba 22 abajo lateral 20.
> - Mark superior "CARTOGRAFÍA POLÍTICA DEL SUR" mono 10 uppercase letter-spacing 0.1em color tinta. Margen 12 abajo.
> - H1 "Acerca" Alfa Slab One 36 line-height 1.05 letter-spacing -0.01em color tinta. Margen 14 abajo.
> - Manifest "¿Cómo se sostiene la vida democrática cuando se debilitan las mediaciones culturales, políticas y cognitivas que la hicieron posible?" Fraunces 600 italic 19 line-height 1.35 color tinta.
>
> **Sección 1 — La hipótesis:**
> - Padding 24 lateral 20. Border-bottom 1px tinta.
> - Label "LA HIPÓTESIS" mono 10 uppercase letter-spacing 0.1em color mute. Margen 12 abajo.
> - H2 "Transición sin reemplazo" Fraunces 600 22 line-height 1.2 color tinta. Margen 12 abajo.
> - Body Lora 16/1.6 color tinta: "Las estructuras que organizaban la vida colectiva pierden capacidad de mediación. Lo que produce no es una nueva arquitectura sino fragmentación, desorientación y dificultad para construir mayorías."
>
> **Sección 2 — Los 6 ejes:**
> - Mismo padding y border. Label "LOS 6 EJES" + h2 "El sistema conceptual".
> - Lista con 6 items, cada uno: pin de color del eje (10×10px square sin border-radius) + nombre del eje en mono 12 uppercase letter-spacing 0.06em. Padding 8 vertical por item, border-bottom 1px dashed `#C8B894`.
> - Colores de pins: Deculturación `#6B4A38`, Erosión de mediaciones `#4A5C30`, Desrepresentación `#8A4A55`, Estetización `#B45729`, Desorientación epistemológica `#2D4A6B`, Atención (transversal) `#C8993E`.

---

## Outputs esperados (validación)

- Los 3 patrones son visualmente diferenciables a primer vistazo.
- El patrón 1 (índice) NO tiene imágenes thumb — solo texto + tags + meta.
- El patrón 2 (detalle) NO tiene portada hero ni axis pills row (los conceptos no se ilustran ni se categorizan en pills).
- El patrón 3 (estática) tiene hero terracota con manifesto en Fraunces italic — la pregunta central del proyecto se ve a primer vistazo.
- Cero border-radius, cero sombras difusas en todas las pantallas.

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-27 | Creación como subproducto de Spec 55 |
