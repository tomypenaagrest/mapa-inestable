---
tipo: prompt-product-design
spec: 51
fecha: 2026-05-26
estado: reutilizable
herramientas_compatibles: [v0, Lovable, Claude (artifacts), Figma Make, otro agente con design context]
naturaleza: subproducto del diseño de Spec 51. Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-26). Este prompt queda como respaldo para regenerar variantes en otra herramienta o pasarle el contexto a una persona externa
---

# Prompt para Product Design — Spec 51 (home mobile)

## Cómo usar

Antes de leer este prompt, leer `70-Producto/prompts-product-design/spec-50-reading.md` — comparte el contexto compartido del proyecto.

El prompt 1 regenera las 3 variantes que se compararon en sesión. El prompt 2 muestra el home completo (panorámico) de la variante elegida con el orden vertical post-fold ya validado.

---

## Contexto compartido específico de Spec 51

> El home de Mapa Inestable tiene un componente protagonista: **el mapa Torres García** (Sudamérica invertida, sur arriba). Es la identidad signature del proyecto, declarada en Spec 01 y mantenida en Spec 11 (arquetipo A "Atlas editorial") y Spec 34 (rediseño desktop r2).
>
> Otros componentes del home: bloque "Esta semana · [eje]" (Alfa Slab con el eje destacado + count de análisis), carrusel de análisis recientes, card del último despacho, heatmap ejes × semanas (matriz 6×12), footer con hipótesis + ejes + países + créditos.
>
> En desktop el orden vertical (Spec 34) es: header → mapa entero + panel preview lateral → "Esta semana" → carrusel angosto 2 cards → despacho → heatmap → footer. En mobile hay que decidir si el mapa sigue siendo protagonista arriba del fold o se sacrifica por otro hero.

---

## 1. [PROMPT] — 3 variantes de above-the-fold del home mobile

> Diseñá 3 variantes del above-the-fold del home de Mapa Inestable en mobile 360. Cada phone muestra: header (Spec 53, 44px) + above-the-fold + un primer scroll. Marcá la "fold line" del Samsung A54 a 656px desde arriba del frame (header 44px + viewport útil ~612).
>
> **Header común a las 3 variantes:** fondo terracota `#C5663A`, 44px, borde bottom 2px tinta. Logo "⛰ MAPA INESTABLE" (Alfa Slab 13px) a la izquierda, botón ☰ a la derecha (mono 16 borde 1.5px tinta, transparente).
>
> **Variante 1 — Mapa protagonista + Esta semana.**
> Debajo del header: mapa Torres García a sangre (sin padding lateral) con aspect-ratio 1280/1380 → en 360 de ancho da ~388px de alto. Fondo del mapa terracota o crema. Silueta de Sudamérica INVERTIDA (sur arriba, norte abajo) en tinta `#1F2A12`. Algunos puntos de colores sobre el mapa (1 por país con análisis reciente — usar los colores semánticos de los ejes).
> Hint debajo del mapa: "EL SUR ARRIBA · CLICK EN PAÍS" en mono 9 uppercase letter-spacing 0.08em color tinta-mute, centrado, padding-top 6.
> Después: bloque "Esta semana · [eje]". Padding 20 lateral + 20 arriba 16 abajo. Border-top 1 tinta.
> - Línea 1: "SEMANA 19 · 2026" mono 11 uppercase letter-spacing 0.08em color mute.
> - Línea 2: "Esta semana · Desorient." Alfa Slab 26 line-height 1.05, donde "Desorient." va en color del eje desorientación `#2D4A6B`.
> - Línea 3: "3 de 5 análisis lo activaron." Lora italic 15 line-height 1.4 color tinta-soft.
>
> **Variante 2 — Hero editorial manifiesto.**
> Bloque hero con fondo terracota (a sangre, padding 28 lateral 24 vertical). Border-bottom 2 tinta.
> - Mark mono 10 uppercase letter-spacing 0.1em color tinta: "Cartografía política del sur · Sem 19 · 2026".
> - Pregunta central en Fraunces 600 22 line-height 1.25 color tinta: "¿Cómo se sostiene la vida democrática cuando se debilitan las mediaciones culturales, políticas y cognitivas que la hicieron posible?"
> - Dos CTAs en mono 11 uppercase letter-spacing 0.06em, padding 9×14. Primario: fondo tinta texto crema. Secundario: fondo transparente borde 2px tinta. Labels: "Explorar el mapa" / "Último despacho".
> Después: el mismo bloque "Esta semana" de V1.
>
> **Variante 3 — Análisis destacado de la semana.**
> Sin hero ni mapa arriba. Directo el bloque "Esta semana" de V1.
> Después una card grande con UN análisis destacado (no carrusel — UNA pieza curada):
> - País tag mono 10 uppercase fondo tinta texto terracota: "COLOMBIA".
> - Eje pill mono 10 uppercase fondo `#2D4A6B` texto crema: "Desorient."
> - Título Fraunces 600 22 line-height 1.2: "La sospecha antes del voto".
> - Lede Lora italic 15 line-height 1.5 color tinta-soft: "A 103 días del fin del mandato, Petro pone en duda la transparencia electoral y desplaza la disputa al terreno epistemológico."
> - Meta mono 10 uppercase color mute: "PUBLICADO HACE 3 DÍAS · 9 MIN DE LECTURA".
> - Border-top 1px dashed tinta sobre el meta.
>
> **Debajo del fold en las 3:** indicar con anotación "Post-fold · carrusel · despacho · heatmap →".
>
> **Decisión que se tomó en este proyecto:** Variante 1. Razones: el mapa Torres García es la identidad signature declarada del proyecto — sacarlo del above-the-fold mobile contradice esa decisión. V2 funcionaría para visitantes nuevos pero pesa al lector recurrente que ve la misma frase cada vez. V3 funcionaría para lector recurrente pero exige curaduría editorial semanal extra y también sacrifica el mapa.

---

## 2. [PROMPT] — Home completo mobile (variante 1 ampliada, todo el scroll)

> Diseñá el home completo de Mapa Inestable mobile 360, mostrando todo el scroll vertical (~2400-2800px de alto). Marcar la fold line a 656px.
>
> Orden de bloques:
>
> 1. **Header (Spec 53)** 44px sticky.
> 2. **Mapa Torres García** a sangre ~388px (above-the-fold con el header arriba).
> 3. **Bloque "Esta semana"** ~100px (above-the-fold también).
> 4. **Carrusel de análisis recientes** ~280px:
>    - 1 card visible de 320px de ancho (padding 20 lateral = 360 total).
>    - Card con silueta del país + nombre país + eje pill + título Fraunces 18 + lede Lora 14 italic + meta mono 12.
>    - Scroll-snap horizontal. Dots indicador debajo: tinta-mute apagados, dorado activo. Tap en dot navega.
>    - Padding 32 arriba (separación de "Esta semana") 28 abajo.
> 5. **Card último despacho** ~280px:
>    - Full-width con padding 20 lateral. Border-thick 2 + shadow-card 4×4.
>    - Label mono "ÚLTIMO DESPACHO".
>    - h2 Fraunces 22 con título del despacho.
>    - Lede Lora italic 16.
>    - CTA "Leer despacho →" en estilo botón-link primary.
> 6. **Heatmap 6×12** (reuso de Spec 52 §5.2). Padding 32 arriba 28 abajo. Label "EJES × ÚLTIMAS 12 SEMANAS" mono 11 uppercase border-bottom 1 tinta. 6 filas × 12 columnas. Nombres de eje abreviados con pin de color: DESORIENT., ESTETIZ., DESREP., MEDIAC., DECULT., ATENCIÓN.
> 7. **Footer** ~360px fondo verde-negro `#1F2A12`. Stack vertical en 1 columna:
>    - Hipótesis del proyecto en Fraunces italic 18/1.4 color crema (manifiesto principal).
>    - "EJES" label mono 9 uppercase color dorado, después los 6 ejes en mono 12 uppercase crema opacity 0.85, padding 4 vertical por item.
>    - "PAÍSES" mismo estilo, lista de los 10 con separadores ·.
>    - Tagline "cartografía política del sur" en mono 11 lowercase color dorado pálido (la tagline ausente del header vive acá).
>    - Créditos en mono 10 lowercase: autor, año, repo, contacto.
>
> Tipografía consistente con el sistema de Spec 50 (Lora 16/1.6 para body, Fraunces 600 para títulos, Alfa Slab para display, IBM Plex Mono para metadata).

---

## Outputs esperados (validación)

- El mapa entra entero arriba del fold sin necesidad de scroll.
- El bloque "Esta semana" también está arriba del fold.
- El carrusel tiene 1 card visible (no 2) con swipe horizontal y dots.
- El footer es stack vertical 1 columna (no 3 cols desktop).
- Cero border-radius, cero sombras difusas, cero imágenes externas arriba del fold (LCP target).

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-26 | Creación como subproducto de Spec 51. Decisiones tomadas con mocks HTML inline en Cowork |
