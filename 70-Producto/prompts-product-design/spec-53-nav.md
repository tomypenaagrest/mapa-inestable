---
tipo: prompt-product-design
spec: 53
fecha: 2026-05-26
estado: reutilizable
herramientas_compatibles: [v0, Lovable, Claude (artifacts), Figma Make, otro agente con design context]
naturaleza: subproducto del diseño de Spec 53. Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-26). Este prompt queda como respaldo para regenerar variantes en otra herramienta o pasarle el contexto a una persona externa
---

# Prompt para Product Design — Spec 53 (navegación mobile, drawer)

## Cómo usar

Antes de leer este prompt, leer `70-Producto/prompts-product-design/spec-50-reading.md` — comparte el contexto compartido del proyecto.

Este prompt regenera las 3 variantes que se compararon en sesión + el drawer abierto de la elegida.

---

## Contexto compartido

Ver bloque "Contexto compartido" del prompt de Spec 50. Acá agrego solo lo específico de Spec 53:

> Mapa Inestable hoy tiene 9 destinos navegacionales totales:
> - **Nav principal del site** (4): Despachos, Ensayos, Mapa, Acerca.
> - **Sidebar persistente "Recorrer el corpus"** (5): Países (10), Ejes (6), Conceptos, Autores, Buscar.
>
> El argumento original de Spec 02 §2 ("no hamburger porque es sitio editorial") se descartó por ausencia de evidencia — NYT, Guardian, El País, Aeon, Substack mobile todos usan ☰ + drawer. Lo que define editorial vs app es el tono visual del drawer, no la presencia del botón.

---

## 1. [PROMPT] — 3 variantes de navegación mobile

> Diseñá 3 variantes del header de Mapa Inestable en mobile 360, mostrando para cada una: el estado normal (header cerrado + un poco de contenido debajo) Y el drawer/menú abierto (en otro phone al lado).
>
> **Variante 1 — Hamburger único.** Header de 44px: logo "⛰ MAPA INESTABLE" a la izquierda (Alfa Slab 13px), botón ☰ a la derecha (mono 16, borde 1.5px tinta, transparente). Tap en ☰ abre drawer desde la izquierda de 280px ancho con fondo verde-negro `#1F2A12`, padding 20 lateral. El drawer tiene dos secciones internas:
> - "SECCIONES" en mono 9 uppercase color dorado `#E8C58A`: Despachos, Ensayos, Mapa, Acerca. Items en mono 13 uppercase letter-spacing 0.05em color crema, padding 8 vertical.
> - "RECORRER EL CORPUS" mismo label style: Países (10), Ejes (6), Conceptos, Autores, Buscar →. Items en Lora 13 (no mono, no uppercase) color crema opacity 0.85.
>
> **Variante 2 — Nav scroll horizontal + drawer separado para sidebar.** Header de 2 filas (total 76px): arriba logo + botón ☰; abajo banda terracota oscuro `#B45729` con scroll horizontal de los 4 items principales en mono 11 uppercase crema. Drawer (al tap en ☰) muestra solo la sección "Recorrer el corpus".
>
> **Variante 3 — Hamburger único + buscador siempre visible.** Header de 56px con 3 elementos: logo "⛰" sin wordmark, buscador inline central (input crema con borde tinta + ícono ⌕ + placeholder "Buscar análisis…" en mono 11), botón ☰ a la derecha. Drawer igual que V1.
>
> **Decisión que se tomó en este proyecto:** Variante 1. Razones: patrón editorial mobile estándar; header limpio en 44px; flexible para crecimiento futuro del menú; el buscador a 2 taps no es problema porque el lector accede al corpus principalmente por el mapa.

---

## 2. [PROMPT] — Anatomía detallada del drawer (Variante 1 elegida)

> Diseñá el drawer mobile en detalle como componente standalone. Ancho 280px, fondo verde-negro `#1F2A12`, padding 20px lateral. Slide-in desde la izquierda con backdrop `rgba(0,0,0,0.45)` sobre el contenido detrás.
>
> **Header del drawer (arriba):**
> - "MAPA INESTABLE" en mono 10 uppercase letter-spacing 0.08em color terracota `#C5663A`, alineado a la izquierda.
> - Botón ✕ alineado a la derecha: mono 14 color crema, padding 4, tap-target 44×44 (área alrededor).
> - Border-bottom 1px crema con opacity 0.2, margin-top 18px.
>
> **Sección 1 — Secciones:**
> - Label "SECCIONES" en mono 9 uppercase letter-spacing 0.1em color dorado pálido `#E8C58A`. Padding-bottom 4, border-bottom 1px crema opacity 0.2.
> - 4 items, cada uno: mono 13 uppercase letter-spacing 0.05em color crema `#F4E9D2`, padding 8 vertical. Tap-target 44px de alto (padding 12 vertical para garantizar).
> - Item activo (cuando estás en /despachos/...): peso 500, color dorado.
>
> **Sección 2 — Recorrer el corpus:** (margin-top 16 desde sección 1)
> - Label "RECORRER EL CORPUS" mismo estilo.
> - 4 items + "Buscar →": Lora 13 (no mono) color crema opacity 0.85, padding 6 vertical. Tap-target 44 (padding 10).
> - Counts entre paréntesis con opacity 0.5: "Países (10)", "Ejes (6)".
>
> **Comportamientos a indicar visualmente con anotaciones** (no se renderiza pero declarar):
> - Foco automático al primer ítem al abrir.
> - Focus trap mientras el drawer está abierto.
> - Cierre: tap en ✕, tap en backdrop, swipe izquierda, ESC, tap en ítem.
> - Animación slide 200ms ease-out + backdrop fade en paralelo.
> - Con `prefers-reduced-motion: reduce`, apertura/cierre instantáneo.

---

## Outputs esperados (validación)

- Header mobile en 44px (V1) o 56-76px (V2/V3) según corresponda.
- Drawer claramente diferenciado entre las dos secciones (labels distintos, tipografía distinta).
- Items con tap-target ≥ 44px de alto.
- Sin border-radius, sin sombras difusas.
- Logo + wordmark visibles en V1 y V2 (no sacrificados a chrome).

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-26 | Creación como subproducto de Spec 53. Decisiones tomadas con mocks HTML inline en Cowork |
