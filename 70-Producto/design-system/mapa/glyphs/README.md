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
| `temperatura.svg` | Temperatura | Activo en frontend (vault) | Spec 43 r2 · #17 — termómetro + 3 marcas de escala (T.1) |
| `viento.svg` | Viento (pro-mercado canónico; pro-estado vía `scaleX(-1)` aplicado por el componente del mapa) | Activo en vault | Spec 44 r2 · #18.a — onda + punta direccional (P.1) |
| `viento-neutro.svg` | Viento (rank = 0) | Activo en vault | Spec 44 r2 · #18.b — variante neutra distinta (V3) |
| `presion.svg` | Presión | Pendiente | Spec 45 |

## Contrato visual

- `viewBox="0 0 48 48"` — todos los glyphs comparten viewBox 48×48.
- `stroke="currentColor"` — el color lo aplica el componente padre vía CSS (`color: var(--mi-...)`).
- `fill="none"` — solo trazo, sin relleno.
- `stroke-width` entre 1.5 y 2.5 según el detalle del glyph.
- `stroke-linecap="round"` y `stroke-linejoin="round"` para trazo coherente con el espíritu Grabado.
- Tamaños de uso: 24px (LayerController), 36px (drawer header opcional), 56px (overlay del mapa — reservado, no usado hoy por B.4 de Spec 42).

## Sistema de glyphs

Decisión cerrada en Spec 42 r2 (C.4): los 4 glyphs del sistema deben usar el patrón "elemento principal + elementos secundarios" para mantener coherencia (precipitación = nube + gotas). Cuando se diseñen los glyphs de viento y presión, deben respetar ese nivel de detalle.

Cerrado para temperatura en Spec 43 r2 (#17): termómetro (tubo + bulbo en `<path>` único) + 3 marcas horizontales de escala como secundarios. Forma vertical complementaria a la forma horizontal de precipitación.

Cerrado para viento en Spec 44 r2 (#18.a + #18.b): glyph asimétrico de origen (onda 3-humps + extensión con punta direccional + 2 mini-ondas secundarias) + variante neutra distinta (dashes estáticos en vez de mini-ondas, onda principal sin punta — "con dato pero sin movimiento direccional"). Mecánica V3: el componente del mapa aplica `transform: scaleX(-1)` para renderear pro-estado a partir de `viento.svg`. El vocabulario de **stroke abierto horizontal (onda)** queda asignado a esta capa; ondas/sinusoides no deben reaparecer en otros glyphs del sistema.

El sistema queda con **tres ejes compositivos distintos** que las cuatro capas ocupan sin colisión:

- **Horizontal cerrado** — precipitación (nube + gotas).
- **Vertical cerrado** — temperatura (termómetro + marcas).
- **Horizontal abierto** — viento (onda + punta).

Heredable para Spec 45 (presión):

- Forma con eje compositivo claro; evitar diseños centrados-rotacionales si el sistema lo puede absorber con otro eje.
- Vocabularios disponibles: anillos/círculos concéntricos, barras, asterismos, contornos verticales de mayor altura que el termómetro, eje vertical abierto, etc. Vocabulario de ondas **ya consumido por viento** — no reusar.
- Si Spec 45 necesita carga direccional sobre el mapa, considerar V3 (asimetría intrínseca + variante neutra distinta) como referencia.
