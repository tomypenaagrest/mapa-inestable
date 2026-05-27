---
tipo: prompt-product-design
spec: 56
fecha: 2026-05-27
estado: reutilizable
herramientas_compatibles: [v0, Lovable, Claude (artifacts), Figma Make]
naturaleza: subproducto del diseño de Spec 56. Las decisiones se tomaron con mocks HTML inline en Cowork (2026-05-27). Este prompt regenera los 3 patrones nuevos (archivo + eje individual + comparador)
---

# Prompt para Product Design — Spec 56 (pantallas mobile restantes)

## Cómo usar

Antes de leer este prompt, leer `70-Producto/prompts-product-design/spec-50-reading.md` para contexto compartido del proyecto.

Los 3 prompts abajo regeneran los 3 patrones nuevos. Los dos derivables (/ejes índice → Spec 55 P1, /leer-despues → Patrón A filtrado) y /pipeline (fuera de scope) no requieren prompts.

---

## 1. [PROMPT] — Patrón A · Archivo con filtros

> Diseñá la página `/analisis` en mobile 360 como archivo completo del corpus con filtros y buscador. Phone con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`.
>
> **Header del site** (Spec 53): igual a otras specs del proyecto.
>
> **Page header:**
> - Padding 22 arriba 16 abajo 20 lateral. Border-bottom 1px tinta.
> - Label "ARCHIVO" mono 11 uppercase letter-spacing 0.1em color mute.
> - H1 "Análisis" Alfa Slab One 36 line-height 1.05 letter-spacing -0.01em.
> - Meta "78 ANÁLISIS · AÑO II" mono 11 uppercase letter-spacing 0.06em color mute + valores tinta.
>
> **Buscador inline:**
> - Margin 14 lateral 20. Padding 10 12. Fondo cream apagado `#ECE0C5`. Borde 1.5px tinta. Mono 12 color mute. Ícono ⌕ a la izquierda. Placeholder "Buscar análisis…".
>
> **Dos bandas de chips horizontales scrolleables:**
> - Banda 1 (temporal): chips "Todos (78) ✓" (activo, fondo tinta texto crema), "2026 (54)", "2025 (24)". Mono 10 uppercase letter-spacing 0.06em. Padding 5×10. Borde 1px tinta. Inactivos transparentes.
> - Banda 2 (eje): chips "Desorient." (fondo `#2D4A6B`), "Desrep." (fondo `#8A4A55`), "Estetiz.", "Mediac.". Color crema desde el inicio (el color identifica el eje). Multi-select.
> - Padding 8 arriba 14 abajo 16 lateral. Gap 6 entre chips. Overflow-x auto.
>
> **2 cards de análisis** (al menos para validar):
> - Card 1: country tag "COLOMBIA" mono 10 fondo tinta texto terracota + eje pill "Desorient." mono 10 fondo `#2D4A6B` texto crema. Título "La sospecha antes del voto" Fraunces 600 19. Descripción "A 103 días del fin del mandato, Petro pone en duda la transparencia electoral." Lora italic 14. Footer "HACE 3 DÍAS · SEM 19" mono 10.
> - Card 2: idem con "ARGENTINA", "Argentina sin cruzadas", "Sobre el ocaso de la cruzada como gramática política.", "11 MAY 2026 · SEM 19".
> - Separator 1px dashed `#C8B894`. Padding 14 vertical 20 lateral.

---

## 2. [PROMPT] — Patrón B · Página de eje individual

> Diseñá `/ejes/desorientacion-epistemologica` en mobile 360. Phone con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`.
>
> **Header del site** (Spec 53).
>
> **Hero del eje:**
> - Fondo `#2D4A6B` (color del eje desorientación). Texto crema. Border-bottom 2px tinta. Padding 28 arriba 22 abajo 20 lateral.
> - Label "EJE · 05 DE 06" mono 10 uppercase letter-spacing 0.1em color dorado pálido `#E8C58A`. Margen 8 abajo.
> - H1 "Desorientación epistemológica" Alfa Slab One 32 line-height 1.0 letter-spacing -0.01em color crema. Margen 12 abajo.
> - Lede "Se debilita la capacidad de distinguir lo real, lo verdadero, lo relevante." Fraunces 600 italic 17 line-height 1.35 color crema.
> - Stats "14 ANÁLISIS · ACTIVO EN 7 PAÍSES" mono 11 uppercase letter-spacing 0.06em color crema, margin-top 14 padding-top 10 border-top 1px crema con opacity 0.3.
>
> **Sección "Qué describe":**
> - Padding 20 lateral 20 vertical. Border-bottom 1px tinta.
> - Label "QUÉ DESCRIBE" mono 10 uppercase letter-spacing 0.1em color mute. Margin-bottom 10.
> - Body Lora 15 line-height 1.55 color tinta: "Cuando un régimen de visibilidad se rompe, lo que se rompe no es la verdad — es la capacidad colectiva de discernirla. Las plataformas, los desplazamientos algorítmicos y la fragmentación atencional producen una experiencia política donde lo verificable, lo plausible y lo viral se vuelven indistinguibles."
>
> **Sección "Activo en":**
> - Mismo padding y border.
> - Label "ACTIVO EN" + h2 "7 países" Fraunces 600 20 line-height 1.2 color tinta margin-bottom 10.
> - Grid 2 cols gap 8 con chips de país: "ARGENTINA · 8", "COLOMBIA · 3", "BRASIL · 2", "CHILE · 1". Cada chip: fondo cream apagado `#ECE0C5`, borde 1px tinta, mono 11 uppercase letter-spacing 0.06em padding 6×10, count en color mute al final con `·` separador.
>
> **Nota visual:** el color del hero (`#2D4A6B`) es la identidad de este eje específico. Si la herramienta regenera otra página de eje, usar el color correspondiente:
> - Deculturación `#6B4A38`
> - Erosión de mediaciones `#4A5C30`
> - Desrepresentación `#8A4A55`
> - Estetización `#B45729`
> - Desorientación `#2D4A6B`
> - Atención `#C8993E` (excepción: usar texto TINTA, no crema, porque dorado claro no contrasta con crema)

---

## 3. [PROMPT] — Patrón C · Comparador con ranking

> Diseñá `/comparar/apoyo-democracia` en mobile 360. Phone con borde tinta 2px y sombra sólida `6px 6px 0 #1F2A12`.
>
> **Header del site** (Spec 53).
>
> **Selector sticky:**
> - Fondo tinta `#1F2A12`. Padding 12 lateral 20. Texto crema mono 11 uppercase letter-spacing 0.08em.
> - Texto "INDICADOR · **APOYO A LA DEMOCRACIA**" donde el nombre activo va en color dorado pálido `#E8C58A` weight 500.
> - Arrow "▴ CAMBIAR" a la derecha en color dorado.
> - Sticky position: top 44 (debajo del site header).
>
> **Body header:**
> - Padding 18 arriba 12 abajo 20 lateral.
> - Eje pill "EJE · DESREPRESENTACIÓN" mono 10 uppercase letter-spacing 0.06em, padding 3×8, fondo `#8A4A55`, texto crema. Margin-bottom 8.
> - H1 "Apoyo a la democracia" Fraunces 600 22 line-height 1.2 color tinta.
> - Lectura "Solo 4 de 17 países LATAM superan el 60% de apoyo. La mediana cae respecto a 2020." Lora italic 14 line-height 1.5 color tinta-soft margin-bottom 8.
>
> **Ranking** (padding 0 lateral 20 abajo 16):
> - 17 rows con país + barra horizontal + valor. Mostrar al menos 7 rows para evaluar visualmente.
> - Cada row: flex align-items center gap 10, padding 8 vertical, border-bottom 1px dashed `#C8B894`.
> - Number: mono 11 color mute width 18.
> - País: mono 11 uppercase letter-spacing 0.06em color tinta width 80.
> - Bar wrap: flex 1 height 8 background `#ECE0C5`.
> - Bar fill: tinta sólida `#1F2A12` width % del valor.
> - Value: mono 11 weight 500 color tinta width 32 text-align right.
>
> **Datos de ejemplo** (ordenados descendente):
> 1. Uruguay 78%
> 2. Costa Rica 67%
> 3. Chile 63%
> 4. Argentina 55%
> — Promedio regional 48% —
> 5. Brasil 46%
> 6. Bolivia 42%
> 7. Perú 33%
>
> **Línea de promedio regional** (entre rows 4 y 5):
> - Text mono 10 uppercase letter-spacing 0.06em color terracota oscuro `#B45729`. Padding 6 vertical. Border-top + border-bottom 1px dashed terracota. Text-align center. Margin 10 vertical.
> - Contenido: "PROMEDIO REGIONAL · 48%".

---

## Outputs esperados (validación)

- Patrón A: el buscador es input siempre visible (no requiere tap para revelar). Los chips temporal y eje son visualmente distintos (los de eje tienen color desde el inicio).
- Patrón B: el hero usa el color del eje específico, no terracota genérico. El texto del hero contrasta correctamente (atención = tinta, resto = crema).
- Patrón C: la línea de promedio regional es la pieza visual más potente — comunica posición relativa de un vistazo. El selector sticky tiene el indicador actual en dorado para que sea fácil ver dónde estás.

---

## Histórico

| Fecha | Cambio |
|---|---|
| 2026-05-27 | Creación como subproducto de Spec 56 |
