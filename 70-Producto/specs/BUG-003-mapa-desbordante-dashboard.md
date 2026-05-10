# BUG-003 — Mapa desbordante en el dashboard home

**Estado:** abierto  
**Prioridad:** alta — el mapa es el elemento central del dashboard y hoy queda recortado en cualquier pantalla estándar  
**Componentes afectados:** `MapaHeatmapSection.tsx`, `MapaTorresGarcia.tsx`

---

## Problema

El mapa Torres García en el home ocupa todo el ancho disponible de su contenedor (`width: 100%`) y su alto se deriva del `aspectRatio: "1280/1380"` (≈ 107 % del ancho). En una pantalla de 1440 px de ancho, con el panel derecho de 320 px descontado, el mapa ocupa ~1120 px de ancho → **~1208 px de alto**. El viewport típico tiene 800–900 px de alto, así que el mapa queda siempre recortado y hay que hacer scroll para verlo entero.

El bloque siguiente (despacho, carrusel) queda enterrado bajo el pliegue.

---

## Causa raíz

En `MapaTorresGarcia.tsx` el wrapper usa:

```tsx
style={{
  position: "relative",
  width: "100%",
  aspectRatio: "1280 / 1380",  // alto ≈ 107 % del ancho
}}
```

Y en `MapaHeatmapSection.tsx` el contenedor izquierdo es `flex: 1` sin ninguna restricción de alto. Resultado: el mapa crece tanto como el ancho disponible lo permita, sin techo.

---

## Comportamiento deseado

- El bloque mapa + panel derecho debe caber entero (o casi) en el primer viewport, sin necesidad de scroll.
- El mapa mantiene siempre su aspect ratio `1280:1380`; nunca se distorsiona.
- El panel derecho (heatmap / preview) ocupa el mismo alto que el mapa.
- En pantallas anchas el mapa no se hace innecesariamente grande.
- En pantallas angostas (tablet, ≥ 768 px) el layout se apila verticalmente.

---

## Solución propuesta

### Estrategia: acotar el alto del bloque al viewport, derivar el ancho del mapa a partir del alto

En lugar de que el ancho defina el alto (situación actual), el alto disponible (viewport − navbar − márgenes) define el ancho del mapa. El mapa se convierte en el elemento que "respira" horizontalmente.

**Constante:** el bloque mapa+panel no debe superar `calc(100vh − 130px)`.  
`130px` = navbar estimado (60 px) + padding de sección + borde de tarjeta.  
Este valor puede ajustarse con una variable CSS `--mi-mapa-max-h`.

---

### Cambios en `MapaHeatmapSection.tsx`

**Row contenedora:** agregar `maxHeight`.

```tsx
// ANTES
<div style={{
  display: "flex",
  borderBottom: ...,
  position: "relative",
}}>

// DESPUÉS
<div style={{
  display: "flex",
  maxHeight: "calc(100vh - 130px)",
  borderBottom: ...,
  position: "relative",
}}>
```

**Contenedor izquierdo del mapa:** pasar de `flex: 1` a tamaño derivado por alto.

```tsx
// ANTES
<div style={{
  flex: 1,
  borderRight: "var(--mi-border-thick)",
  position: "relative",
}}>

// DESPUÉS
<div style={{
  flexShrink: 0,
  aspectRatio: "1280 / 1380",   // ← el ancho se auto-calcula a partir del alto disponible
  height: "100%",
  overflow: "hidden",
  borderRight: "var(--mi-border-thick)",
  position: "relative",
}}>
```

**Panel derecho:** en lugar de `width: 320` fijo, darle `flex: 1` con un `minWidth` para que llene el espacio sobrante (que varía según el alto/ancho del viewport).

```tsx
// ANTES
<div style={{
  width: 320,
  flexShrink: 0,
  overflow: "hidden",
  position: "relative",
}}>

// DESPUÉS
<div style={{
  flex: 1,
  minWidth: 220,   // nunca más angosto que esto
  maxWidth: 360,   // nunca más ancho que esto
  overflow: "hidden",
  position: "relative",
}}>
```

---

### Cambios en `MapaTorresGarcia.tsx`

El wrapper deja de manejar el aspect ratio (lo maneja ahora el contenedor padre en `MapaHeatmapSection`). Pasa a llenar su contenedor al 100 %.

```tsx
// ANTES
<div
  style={{
    position: "relative",
    width: "100%",
    aspectRatio: "1280 / 1380",
    overflow: "hidden",
  }}
  ...
>

// DESPUÉS
<div
  style={{
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  }}
  ...
>
```

> **Nota:** esta prop se aplica **solo en `variant="home"`**. En `variant="explorer"` el mapa vive dentro de `/mapa` con un layout diferente (el explorer puede mantener su propio modelo de sizing, tbd en spec separado). La forma más limpia es que `MapaTorresGarcia` no gestione su propio tamaño y delegue esa responsabilidad al contenedor — así funciona en ambos contextos.

---

### Comportamiento en mobile / tablet

Con CSS media query o inline:

```
@media (max-width: 768px) {
  .mapa-heatmap-row {
    flex-direction: column;
    max-height: none;
  }
  .mapa-heatmap-mapa {
    width: 100%;
    height: auto;
    aspect-ratio: 1280/1380;   /* vuelve al modelo width-driven */
  }
  .mapa-heatmap-panel {
    width: 100%;
    min-width: unset;
    max-width: unset;
    height: 280px;             /* alto fijo para el panel en mobile */
  }
}
```

Implementar como `useMediaQuery` (ya existente en el proyecto) o con CSS modules / styled tag.

---

## Casos a verificar

| Pantalla | Resultado esperado |
|---|---|
| 1440 × 900 | Mapa + panel visible sin scroll, mapa no recortado |
| 1280 × 800 | Mapa + panel visible, panel ≥ 220px |
| 1920 × 1080 | Mapa no crece más allá del max-height, panel absorbe espacio extra |
| 768 × 1024 (tablet) | Layout vertical, mapa full-width, panel 280px debajo |
| Hover en país | CountryPreviewPanel aparece en el panel sin afectar el alto |
| `/mapa` (explorer) | No regresión — el mapa del explorer mantiene su layout actual |

---

## Archivos a tocar

1. `platform/frontend/src/components/MapaHeatmapSection.tsx` — cambios de layout descritos arriba
2. `platform/frontend/src/components/MapaTorresGarcia.tsx` — remover `aspectRatio` del wrapper div

## Out of scope

- El mapa en `/mapa` (explorer): tiene su propio layout, se especificará por separado si hace falta.
- Animación al redimensionar ventana: no es necesaria.
