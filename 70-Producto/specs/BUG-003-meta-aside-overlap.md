---
spec: 23
tipo: bug
titulo: Sidebar meta sticky se superpone con cards 02 y 04 en detalle de análisis
estado: fix-aplicado
autor: Tomás (con Claude)
fecha: 2026-05-10
afecta: [/analisis/[country]/[slug], AnalisisContent, AnalisisBody]
prioridad: media
---

# 23 · Bug — Sidebar meta sticky se superpone con cards 02 y 04 en detalle de análisis

## Síntoma

Al scrollear cualquier detalle de análisis (ej. `/analisis/ar/el-reves-de-la-motosierra`), el aside meta de la izquierda (PAÍS / EJE / FECHA / CÓMO LEEMOS / LISTA DE LECTURA) — que es `position: sticky` — queda fijo encima de las cards **02 Desplazamiento** y **04 Apertura**. El texto del análisis se vuelve ilegible porque se cruza con el texto de la sidebar.

Las cards **01 Disparador** y **03 Conceptualización** se ven bien.

---

## Causa raíz

El layout `.mi-analisis-grid` es un grid de 2 columnas (`grid-template-columns: 200px 1fr`). El componente `AnalisisContent` espera que el grid reciba **2 hijos**: el `<aside>` meta y el bloque de pasos.

Pero `AnalisisBody` devuelve un **fragment** (`<>`) con un `<StepBlock>` por paso (4 pasos). React aplana el fragment, así que el grid termina recibiendo **5 hijos** (aside + 4 steps). El auto-flow del grid los reparte así:

| Fila | Col 1 (200px, sticky aside) | Col 2 (1fr) |
|------|------|------|
| 1 | aside (sticky) | 01 Disparador |
| 2 | **02 Desplazamiento** | 03 Conceptualización |
| 3 | **04 Apertura** | — |

Las cards 02 y 04 caen exactamente en la misma columna donde vive el aside sticky. Como el aside no tiene `z-index` definido, el orden de pintado depende del DOM y el resultado es el overlap visible al scrollear.

---

## Fix aplicado

Archivo: `platform/frontend/src/components/AnalisisContent.tsx`, línea 110.

Envolver `<AnalisisBody>` en un `<div>` para que sea un único hijo del grid. Eso colapsa los 4 StepBlocks en una sola celda de columna 2 y el grid vuelve a comportarse como estaba pensado.

### Antes

```tsx
{/* 4 pasos */}
<AnalisisBody
  slug={`${a.countrySlug}-${a.year}-w${a.week}`}
  steps={steps}
  footnotes={footnotes}
  marks={marks}
  onFootnoteClick={setActiveFootnote}
/>
```

### Después

```tsx
{/* 4 pasos — wrap en <div> para que sea un único hijo del grid (BUG-003) */}
<div>
  <AnalisisBody
    slug={`${a.countrySlug}-${a.year}-w${a.week}`}
    steps={steps}
    footnotes={footnotes}
    marks={marks}
    onFootnoteClick={setActiveFootnote}
  />
</div>
```

---

## Validación

Probado en vivo (parche al DOM con JS, equivalente al edit aplicado): el aside queda en columna 1 y las 4 cards apilan vertical en columna 2, sin overlap. Probado tanto con análisis sin footnotes (grid 2-col) como con footnotes (grid 3-col, `mi-analisis-grid--3col`).

Mobile y tablet no estaban afectados: el media query `max-width: 639px` ya colapsa el grid a 1 columna y oculta el aside.

---

## Riesgo del fix

Mínimo. El cambio:

- No toca CSS.
- No cambia lógica ni estilos de `AnalisisBody`.
- Solo agrega un wrapper `<div>` sin clase, sin estilo, sin atributos.
- No afecta `mi-analisis-grid--3col`: la columna de footnotes (`mi-footnote-aside-col`) sigue siendo el tercer hijo del grid.

---

## Alternativa equivalente (no aplicada)

Cambiar el `return <>` de `AnalisisBody.tsx` (línea 232) por `return <div>...</div>`. Sería más robusto a callers futuros (cualquiera que use `AnalisisBody` heredaría el comportamiento), pero es un cambio en el componente compartido y obliga a verificar que ningún consumidor depende del fragment. El wrapper en `AnalisisContent` resuelve el caso reportado sin tocar la API de `AnalisisBody`.

Si en el futuro aparece otro consumidor de `AnalisisBody`, mover el wrapper adentro.

---

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `platform/frontend/src/components/AnalisisContent.tsx` | Wrap `<AnalisisBody>` en `<div>` (1 línea + comentario) |
