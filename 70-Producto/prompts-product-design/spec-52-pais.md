---
tipo: prompt-product-design
spec: 52
fecha: 2026-05-26
estado: reutilizable
herramientas_compatibles: [v0, Lovable, Claude (artifacts), Figma Make, otro agente con design context]
naturaleza: subproducto del diseño de Spec 52. Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-26). Este prompt queda como respaldo para regenerar variantes en otra herramienta o pasarle el contexto a una persona externa
---

# Prompt para Product Design — Spec 52 (página de país mobile)

## Cómo usar este documento

Si vas a re-generar las variantes de diseño de Spec 52 con otra herramienta (v0, Lovable, Figma Make, otra sesión de Claude), copiá las secciones **[PROMPT]** abajo. El orden recomendado es: 1 (header + selector tabs) → 2 (heatmap eje × tiempo) → 3 (card macro). Es el mismo orden que se usó en Cowork.

Para una herramienta que acepta un solo prompt grande, concatenar las 3 secciones precedidas por el **contexto compartido**.

Antes de leer este prompt, leer también `70-Producto/prompts-product-design/spec-50-reading.md` — comparte el contexto compartido y el sistema tipográfico aplica a las dos specs.

---

## Contexto compartido (siempre incluir antes de cualquier prompt)

> Estás diseñando la página `/pais/[slug]` del proyecto **Mapa Inestable** — una plataforma editorial de análisis estructural sobre Sudamérica. La página es un **dashboard tabular** con 6 solapas (Publicaciones, Diagnóstico, Pulso ciudadano, Estructura material, Contexto, Fuentes). Definido en Spec 16 del proyecto.
>
> **Dispositivo de referencia.** Samsung A54, ancho de viewport 360px.
>
> **Identidad visual.** Llamada "Grabado" — reclama la tradición del Taller de Gráfica Popular mexicano, Joaquín Torres García, las revistas culturales impresas. NO es Medium. NO es Substack genérico.
>
> **Paleta:**
> - Fondo dominante: terracota `#C5663A`
> - Fondo de papel: crema `#F4E9D2`
> - Fondo crema apagado: `#ECE0C5` (para bandas de chips, frame strips)
> - Fondo profundo: verde-negro `#1F2A12` (no es negro)
> - Tinta principal: `#1F2A12`
> - Tinta soft: `#3D4A26`
> - Tinta mute: `#5C6638`
> - Acento terracota oscuro: `#B45729`
> - Acento dorado pálido: `#E8C58A`
>
> **Colores por eje conceptual** (para axis pills y celdas de heatmap):
> - Deculturación: `#6B4A38`
> - Erosión de mediaciones: `#4A5C30`
> - Desrepresentación: `#8A4A55`
> - Estetización: `#B45729`
> - Desorientación epistemológica: `#2D4A6B`
> - Atención (transversal): `#C8993E` (texto tinta sobre este, no crema)
>
> **Familias tipográficas:**
> - Alfa Slab One — country name. Nunca body.
> - Fraunces (peso 400 italic + peso 600) — pregunta central, h2, h3.
> - Lora — body y descripciones de card.
> - IBM Plex Mono (peso 400 y 500) — metadata, labels, axis pills, chips de tabs, sub-filtros.
>
> **Reglas inviolables del design system:**
> - `border-radius: 0` siempre. Nunca redondear nada.
> - Sombras sólidas sin blur (`box-shadow: 4px 4px 0 #1F2A12` típico). Nunca drop-shadow difusa.
> - Densidad. Aire entre piezas, no como dominante.
> - Trazabilidad visible: fuente, fecha, eje siempre visibles en mono uppercase.

---

## 1. [PROMPT] — Header de país + selector de tabs

> Diseñá 3 variantes del header y selector de tabs de la página `/pais/argentina` en mobile 360. Mostrá las 3 stacked vertical, cada una con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`.
>
> **Anatomía común a las 3 variantes** (header de país):
> - Site header arriba (chrome de Mapa Inestable: logo "MAPA INESTABLE" en Alfa Slab + nav mono uppercase "MAPA · EJES · ARCHIVO", fondo terracota `#C5663A`, borde bottom 2px tinta).
> - Country name "Argentina" en Alfa Slab One 48px, line-height 1.0, color tinta, padding lateral 20px.
> - Pregunta central en Fraunces italic 400 18px / 1.35, color tinta-soft `#3D4A26`: "¿Cómo se sostiene un sistema político cuando los partidos tradicionales pierden capacidad de mediación?"
> - Meta row con borde top 1px tinta, padding 8px arriba, mono 11px uppercase: `18 ANÁLISIS · ÚLTIMA HACE 3 DÍAS · 3 EJES ACTIVOS`.
> - Frame strip de ejes crónicos: banda cream-apagado `#ECE0C5`, borde top + bottom 1px tinta, padding 10px lateral 20px. Label "EJES CRÓNICOS ›" mono 9px uppercase color mute. 3 axis pills mono 10px uppercase: DESORIENTACIÓN (fondo `#2D4A6B`), ESTETIZACIÓN (fondo `#B45729`), DESREP... (fondo `#8A4A55`), texto crema. Scroll horizontal si hay overflow.
>
> **Las 3 variantes** difieren en el selector de tabs (justo debajo del frame strip):
>
> **V1 — Dropdown puro (Spec 16 §7).** Una sola línea sticky con fondo tinta, texto crema, mono 12 uppercase: `PUBLICACIONES (18) ▼`. Al tap se desplegaría un dropdown vertical mostrando las 6 opciones. Sticky completo al scrollear (100px = header condensed + dropdown).
>
> **V2 — Chips horizontales scrolleables + sticky mínimo.** Banda cream apagado `#ECE0C5`, borde bottom 1px tinta, padding 12px lateral 16px. 6 chips mono 11px uppercase con borde 1px tinta: `Publicaciones (18) ✓` (activo: fondo tinta + texto crema), `Diagnóstico`, `Pulso (12)`, `Estructura`, `Contexto`, `Fuentes`. Scroll-x con fade-out terracota a la derecha. Al scrollear, solo esta banda queda sticky (44px), el header de país se va.
>
> **V3 — Bottom-sheet on-demand.** Botón sticky arriba "TAB · PUBLICACIONES (18) ▴ CAMBIAR" con fondo tinta + texto crema. Al tap, abre desde abajo un bottom-sheet con las 6 opciones en lista vertical grande (cada item 48px de alto, mono 14px uppercase). Sticky 44px.
>
> **Contenido debajo del selector** (idéntico en las 3 variantes para evaluar solo el selector): sub-filtros temporales horizontales (`Recientes (8) ✓ · 2026 (12) · 2025 (4) · Todas (18)`) en mono 10px con borde 1px en chips chicos. Después una card de análisis tipo "Argentina sin cruzadas" con país tag, h3 Fraunces 18px, descripción Lora 14/1.5, footer mono con axis pill + fecha.
>
> **Decisión que se tomó en este proyecto:** Variante 2 (chips horizontales + sticky mínimo). Razones: 1 tap directo para cambiar tab (vs 2 en dropdown/bottom-sheet); descubrimiento alto (todas las tabs visibles); pixel cost del sticky bajo (44px vs 100px); tono editorial coherente con la identidad del proyecto (no app-y); coherencia con axis pills y sub-filtros que ya usan el mismo patrón visual.

---

## 2. [PROMPT] — Heatmap eje × tiempo del tab Diagnóstico

> Diseñá el componente "matriz eje × tiempo" del tab Diagnóstico de la página de país, en mobile 360. Es un heatmap de 6 filas (ejes conceptuales) × **12 columnas** (últimas 12 semanas). Cada celda representa cuántos análisis de ese país activaron ese eje en esa semana.
>
> **Anatomía:**
> - Container con padding 20px lateral, fondo crema `#F4E9D2`.
> - Título arriba: `MATRIZ EJE × TIEMPO · ÚLTIMAS 12 SEMANAS` en mono 11px uppercase, letter-spacing 0.08em, color mute, borde bottom 1px tinta, padding-bottom 6px, margen 14px abajo.
> - Tabla:
>   - Columna 1 (32% del ancho): nombres de eje abreviados a 7-8 caracteres con pin de color a la izquierda (cuadradito 8×8 del color del eje). Labels: `DESORIENT.`, `ESTETIZ.`, `DESREP.`, `MEDIAC.`, `DECULT.`, `ATENCIÓN`. Mono 10px peso 500 uppercase color tinta.
>   - Columnas 2-13: una columna por semana, header mono 9px con número de semana (17, 18, 19... 28). Celdas de ~18px de alto, borde 1px crema entre ellas.
> - **Color de celda según frecuencia:**
>   - Sin actividad: cream apagado `#ECE0C5`.
>   - Activo bajo (1 análisis): tono claro del color del eje (~30% saturación).
>   - Activo medio (2 análisis): tono medio (~60%).
>   - Activo alto (3+ análisis): tono saturado al 100%.
> - Leyenda debajo: mono 9px uppercase color mute con swatch + texto: `[swatch cream] SIN ACTIVIDAD · + ANÁLISIS = CELDA MÁS OSCURA`.
>
> **Distribución sugerida de actividad** (datos ficticios pero plausibles para Argentina):
> - Desorientación: actividad regular en ~8 de 12 semanas, picos en sem 20 y 27.
> - Estetización: actividad media, ~6 de 12 semanas.
> - Desrepresentación: actividad sostenida.
> - Mediaciones: baja, solo 2 activaciones.
> - Deculturación: sin actividad (toda la fila en cream apagado).
> - Atención: 4 activaciones dispersas.
>
> **Comportamiento esperado** (declararlo aunque no se renderice): cada celda es clickeable. Tap navega al análisis (o al primero si hay varios esa semana).
>
> **Decisión que se tomó en este proyecto:** mostrar 12 semanas (no 18) en mobile. Razón: con 18 las celdas quedan a 14px, debajo del tap-target accesible mínimo. Con 12 quedan a 18-20px, borderline aceptable.

---

## 3. [PROMPT] — Card macro con sparkline del tab Estructura material

> Diseñá las cards de la sección "A · Generación de riqueza" del tab Estructura material, en mobile 360. 3 cards apiladas vertical en 1 columna.
>
> **Anatomía de cada card:**
> - Border 2px tinta, fondo crema `#F4E9D2`, shadow sólida `4px 4px 0 #1F2A12`, padding 16px.
> - Header con label mono: `<b>A1</b> · PBI PER CÁPITA (PPP)` (donde A1 es código del indicador, mono 10px peso 500 uppercase color tinta; el resto en peso 400 uppercase color mute).
> - Cifra grande Alfa Slab One **32px** color tinta. Junto a la cifra, año en mono 11px uppercase color mute (ej: "2023"). Cifra y año en la misma línea, año desplazado a la derecha.
> - **Sparkline 100% ancho × 26px de alto**, debajo de la cifra. SVG con polyline stroke 2px tinta. Datos de 10-15 años. La sparkline es protagonista visual de la card — NO ocultarla en mobile.
> - Delta mono 11px: `Δ +6,9% VS 2018` o `Δ PROMEDIO 1,8% ÚLTIMOS 5 AÑOS`. Letter-spacing 0.04em (más apretado que el resto).
> - Marker de calidad (opcional, depende del estado del dato):
>   - `oficial`: sin estilo extra (color mute, mono 10px).
>   - `revisado`: mono 10px color mute, texto entre paréntesis "(REVISADO)".
>   - `estimado`: chip cream con borde thick 2px tinta, mono 10px uppercase, texto "ESTIMADO".
>   - `cuestionado`: chip cream con borde terracota `#B45729`, mono 10px uppercase color terracota, texto "CUESTIONADO".
>   - `congelado`: chip tinta `#1F2A12` con texto crema mono 10px uppercase, texto "CONGELADO · ÚLTIMA OBS. 2024".
> - Footer con border-top dashed 1px tinta, padding-top 8px: source mono 10px uppercase color mute con flecha → al final. Ej: `BANCO MUNDIAL WDI · PULLED 2026-05-09 →`.
>
> **3 cards sugeridas:**
> 1. A1 · PBI per cápita (PPP) — `US$ 26.505` 2023 — sparkline creciente — Δ +6,9% vs 2018 — sin marker (oficial) — fuente Banco Mundial WDI.
> 2. A2 · Crecimiento real del PBI — `+2,7%` 2023 — sparkline volátil — Δ promedio 1,8% últimos 5 años — marker `cuestionado` — fuente CEPALSTAT.
> 3. A3 · Inflación interanual — `211%` 2024 — sparkline subiendo fuerte (en terracota `#B45729` por la lectura semántica negativa) — Δ +186 p.p. vs 2019 — marker `congelado · última obs. 2024` — fuente INDEC.
>
> **Decisión que se tomó en este proyecto:** sparkline SE MANTIENE a 26px en mobile. Cerraba decisión pendiente de Spec 16 §12.5. Razón: la sparkline es parte indisociable del componente (sparkline + valor + delta + calidad son la unidad). Sacarla convierte la card en una tabla de números — pérdida visual y editorial.

---

## Adaptación por herramienta

**Si la herramienta es v0 (Vercel):** prefijar cada PROMPT con `Generate React + Tailwind code for...`. v0 tiende a usar `rounded-md` y `shadow-md` por default — recordarle explícitamente las reglas inviolables. Para el heatmap, pedirle implementación con CSS Grid o `<table>` (no canvas).

**Si la herramienta es Lovable:** pasar el contexto compartido + un solo prompt mega-combinado en lugar de 3 separados. Indicarle que la página es un "dashboard editorial" tipo periódico crítico, no un dashboard de SaaS.

**Si la herramienta es Figma Make:** los 3 prompts funcionan como specs visuales separadas. Para la sparkline, pedirle SVG inline.

**Si la herramienta es otra sesión de Claude con artifacts:** usar este prompt tal cual con `mcp__visualize__show_widget` o `mcp__cowork__create_artifact`. El patrón funciona bien y fue el que se usó para diseñar Spec 52 originalmente.

---

## Outputs esperados de Spec 52 (referencia para validar lo generado)

- El selector chips muestra todas las 6 tabs visibles arriba del fold (con scroll-x sutil para acceder a las últimas).
- El sticky al scrollear deja únicamente la banda de chips (44px), no el header de país completo.
- El heatmap tiene celdas tap-target borderline aceptables (~18-20px). Los nombres de eje son legibles a primer vistazo. La fila de Deculturación (sin actividad) se ve claramente distinta — toda en cream apagado.
- La card macro tiene la sparkline visible y legible. La cifra Alfa Slab es protagonista. El marker de calidad se distingue de los otros estados (no son todos iguales).
- Cero border-radius, cero sombras difusas, cero gradientes (excepto el fade-out terracota del chips).

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-26 | Creación como subproducto de Spec 52. Las decisiones del diseño ya se tomaron con mocks HTML inline en Cowork. Este prompt queda como respaldo reutilizable |
