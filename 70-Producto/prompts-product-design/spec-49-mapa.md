---
tipo: prompt-product-design
spec: 49
fecha: 2026-05-26
estado: reutilizable
herramientas_compatibles: [v0, Lovable, Claude (artifacts), Figma Make]
naturaleza: subproducto del diseño de Spec 49. Spec 49 es la más técnica del EPIC-04 — el output del diseño son DECISIONES de comportamiento, no variantes visuales. Este prompt regenera la visualización de los 3 estados del mapa + la tabla de decisiones
---

# Prompt para Product Design — Spec 49 (touch handlers del mapa)

## Cómo usar

Spec 49 es de comportamiento gestual, no de jerarquía visual. Una herramienta que genera mockups estáticos (v0, Lovable, Figma) puede regenerar los 3 estados (normal, zoom, tap-preview) pero NO puede simular los gestos en sí. Para validar gestos de verdad hay que implementar en VS Code y testear en device real.

Este prompt da el contexto para regenerar los 3 estados visualmente. Las decisiones de comportamiento se traducen a código en la implementación, no a otro mock.

Antes de leer este prompt, leer `70-Producto/prompts-product-design/spec-50-reading.md` — comparte el contexto compartido del proyecto.

---

## Contexto compartido específico de Spec 49

> El mapa Torres García es la **interfaz signature** del proyecto: Sudamérica invertida (sur arriba), SVG vectorizado de un dibujo manuscrito de Joaquín Torres García (1943). Tiene 10 hot-zones (una por país) + 10 cruces de capitales. En desktop ocupa todo el viewport central; en mobile va a sangre arriba del fold.
>
> El sistema gestual mobile debe permitir: ver el mapa entero a zoom 1×, hacer pinch para acercarse a países chicos (Uruguay, Ecuador), pan dentro de boundaries, double-tap para zoom-toggle, tap simple que abre panel inline debajo del mapa (no navega directo a la ficha).
>
> Decisión cerrada en EPIC-04: NO se reescribe el motor del mapa con librería externa. Se adapta D3 actual sumando touch handlers.

---

## 1. [PROMPT] — Visualizador de 3 estados del mapa en mobile

> Diseñá un visualizador comparativo de 3 estados del mapa Torres García en mobile 360. Cada uno en un phone de 240px de ancho × ~280px de alto (más compacto que un phone completo — el objetivo es comparar estados, no validar layout).
>
> **Estado 1 — Zoom 1× normal.**
> - Phone con mini-header (30px alto, terracota, logo "⛰ MAPA INESTABLE" + ☰).
> - Mapa Torres García a sangre con aspect-ratio 1280/1380. SVG simplificado: una silueta INVERTIDA (sur arriba) de Sudamérica en tinta `#1F2A12` sobre fondo terracota `#C5663A`. Puntos de colores semánticos sobre el mapa (1 por país con análisis reciente — usar colores de ejes: `#2D4A6B` desorientación, `#8A4A55` desrep, `#B45729` estetización, `#C8993E` atención, `#4A5C30` mediaciones).
> - **Anotación visual:** dos rectángulos dashed terracota oscuro `#B45729` sobre Uruguay y Ecuador con label "UY · hit area" y "EC · hit area" en mono 8 uppercase color terracota. Indican que el tap target está ampliado virtualmente sobre el visual.
>
> **Estado 2 — Zoom 2× con pan activo.**
> - Mismo phone pero el SVG está aplicado `transform: translate(-40px, -30px) scale(2)` (zoomeado y descentrado, mostrando el "norte" del mapa que en Torres García es la parte inferior).
> - **Indicador de zoom:** absolute top-left, fondo `rgba(31,42,18,0.85)`, texto "Zoom 2.0×" mono 9 uppercase color dorado `#E8C58A`, padding 3×7.
> - **Botón RESET:** absolute bottom-right, fondo tinta `#1F2A12`, texto "Reset ⟲" mono 9 uppercase color crema, padding 4×8, borde 1.5px crema.
>
> **Estado 3 — Tap en país con panel inline.**
> - Phone con header + mapa a zoom 1× normal.
> - El punto correspondiente a Argentina marcado con anillo dorado `#E8C58A` 1.5px (estado "selected").
> - **Debajo del mapa:** panel inline con border-top 2px tinta, fondo crema, padding 14.
>   - Nombre país "Argentina" en Alfa Slab One 22px.
>   - Dos axis pills "Desorient." (fondo `#2D4A6B`) y "Desrep." (fondo `#8A4A55`) en mono 8 uppercase color crema, padding 2×5.
>   - Meta mono 9 uppercase color mute: "18 análisis · hace 3 días · Ver ficha →" con border-top dashed.
>   - Botón ✕ absolute top-right del panel, mono 12 borde 1px tinta padding 2×6.
>
> Los 3 phones en fila (responsive grid), cada uno con label mono 11 uppercase arriba ("Estado normal · zoom 1×", "Estado zoom 2× · pan activo", "Tap en país · panel inline") y una nota corta debajo de cada label explicando el comportamiento.

---

## 2. [PROMPT] — Tabla de decisiones de comportamiento

> Debajo del visualizador, una tabla con las 9 decisiones técnicas de comportamiento gestual. Cada fila: # (A-I), pregunta, recomendación. Tipografía Anthropic Sans (no del proyecto — esto es chrome de Cowork, no del sitio).
>
> Las 9 decisiones (con recomendaciones que ya se aprobaron en el proyecto):
>
> **A. ¿Pinch-zoom permitido?** Sí, con límites 1× mín, 3× máx. Sin pinch los países chicos son inaccesibles incluso con hit area ampliada. Sin límites el lector se pierde en zoom excesivo.
>
> **B. ¿Pan permitido durante zoom?** Sí, libre pero con boundaries (viewport siempre muestra parte del mapa, nunca terracota vacío).
>
> **C. ¿Cómo se sale del zoom?** Dos caminos paralelos: double-tap (toggle 1× ↔ 2×, gesto natural Android/iOS) + botón RESET ⟲ floating cuando zoom > 1× (discoverable).
>
> **D. ¿Tap target ampliado para países chicos?** Sí, solo Uruguay y Ecuador. Implementación: `<path>` invisible más grande que el visual con event handler.
>
> **E. ¿Tap → navega directo o abre panel?** Abre panel inline debajo del mapa (consistente con Spec 33 + Spec 51 §2.3). Reemplaza la propuesta de Spec 22 §16.1 que era ambigua. Para navegar a ficha hay tap explícito en "Ver ficha →" del panel.
>
> **F. ¿Panel se cierra al scrollear?** No. Persiste hasta acción explícita (X del panel o tap en otro país con cross-fade).
>
> **G. ¿Labels de nombres de país en mobile?** Ocultos (confirma Spec 22 §16.1). El nombre aparece dentro del panel inline.
>
> **H. Performance Android mid-range.** SVG inline + `transform: translate3d() scale()` con GPU acceleration. Evitar updates de `viewBox` durante gesture. Throttle a 60fps con `requestAnimationFrame`.
>
> **I. Gesto pinch vs scroll del documento.** `touch-action: pinch-zoom` en el SVG. Sin esto, pinch y scroll compiten y la UX se rompe.

---

## Outputs esperados (validación)

- Los 3 estados del mapa son visualmente distinguibles a primer vistazo.
- Las anotaciones de hit area ampliada (líneas dashed) se ven claramente sobre Uruguay y Ecuador.
- El botón RESET y el indicador de zoom aparecen solo en el estado 2 (zoom 2×), no en el normal.
- El panel inline del estado 3 está debajo del mapa, no encima ni a un lado.
- La tabla de 9 decisiones está claramente separada del visualizador (es chrome de proceso, no del sitio).

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-26 | Creación como subproducto de Spec 49. Las decisiones del diseño ya se tomaron con visualizador + tabla en Cowork |
