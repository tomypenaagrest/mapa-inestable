# Glyphs de capas analíticas

Carpeta inaugurada con Spec 42 (capa precipitación) — 2026-05-20.

## Patrón

Esta carpeta es **single source of truth** para los glyphs SVG custom que el LayerController y el LayerReadingDrawer usan en `/mapa`. Patrón análogo a `paises-poligonos.json` de la misma carpeta `70-Producto/design-system/mapa/`: el vault es la fuente canónica; el frontend lee desde una copia sincronizada en `platform/frontend/public/mapa/glyphs/<id>.svg`.

Cada vez que un glyph cambia acá, hay que correr la sincronización al frontend (manual o vía script, según defina la implementación de Spec 42).

## Inventario

| Archivo | Capa | Estado | Decisión asociada |
|---|---|---|---|
| `precipitacion.svg` | Precipitación (crecimiento económico) | Activo en frontend | Spec 42 r2 · C.4 — nube + 3 gotas |
| `precipitacion-recesion.svg` | Precipitación (versión seca) | **Reservado — no se referencia desde el frontend** | Spec 42 r2 · C.4 — entregado pero B.4 no lo requiere |
| `temperatura.svg` | Temperatura | Pendiente | Spec 43 |
| `viento.svg` | Viento | Pendiente | Spec 44 |
| `presion.svg` | Presión | Pendiente | Spec 45 |

## Contrato visual

- `viewBox="0 0 48 48"` — todos los glyphs comparten viewBox 48×48.
- `stroke="currentColor"` — el color lo aplica el componente padre vía CSS (`color: var(--mi-...)`).
- `fill="none"` — solo trazo, sin relleno.
- `stroke-width` entre 1.5 y 2.5 según el detalle del glyph.
- `stroke-linecap="round"` y `stroke-linejoin="round"` para trazo coherente con el espíritu Grabado.
- Tamaños de uso: 24px (LayerController), 36px (drawer header opcional), 56px (overlay del mapa — reservado, no usado hoy por B.4 de Spec 42).

## Sistema de glyphs

Decisión cerrada en Spec 42 r2 (C.4): los 4 glyphs del sistema deben usar el patrón "elemento principal + elementos secundarios" para mantener coherencia (precipitación = nube + gotas). Cuando se diseñen los glyphs de temperatura, viento y presión, deben respetar ese nivel de detalle.
