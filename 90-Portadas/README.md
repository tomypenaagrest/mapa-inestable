# 90-Portadas

Acá viven las portadas generadas con Gemini (u otro modelo de imagen) para los borradores, publicaciones y despachos de Mapa Inestable.

---

## Estructura

```
90-Portadas/
├── diario/         portadas de borradores del agente diario
├── publicaciones/  portadas de piezas promovidas a 50-Publicaciones/
└── despachos/      portadas de despachos semanales
```

## Convención de nombres

**Mismo `slug` que el borrador**, sin acentos, kebab-case, extensión `.png` o `.webp`.

| Borrador | Portada |
|---|---|
| `60-Borradores/diario/Argentina - La cena que reemplazó al partido - 2026-05-10.md` | `90-Portadas/diario/la-cena-que-reemplazo-al-partido.png` |
| `60-Borradores/diario/Perú - La elección que no cabía en una sola hoja - 2026-05-07.md` | `90-Portadas/diario/la-eleccion-que-no-cabia-en-una-sola-hoja.png` |
| `50-Publicaciones/Despacho Semana 20 - 2026.md` | `90-Portadas/despachos/despacho-semana-20-2026.png` |

El slug está en el frontmatter del borrador (`slug:`), copialo tal cual.

## Cómo se generan

1. El skill (`agente-diario`, `analisis-semanal` o `despacho-semanal`) escribe un campo `cover_prompt` en el frontmatter del borrador.
2. Tomás copia el prompt + el bloque "Instrucciones para Gemini" de [`70-Producto/design-system/cover-style-guide.md`](../70-Producto/design-system/cover-style-guide.md) y lo manda al modelo.
3. La imagen generada se descarga y se guarda acá con el nombre = slug.

## Cómo se referencian desde el borrador

Una vez guardada la portada, sumá el campo `cover_image` al frontmatter del borrador, apuntando a la ruta relativa desde la raíz del vault:

```yaml
cover_image: 90-Portadas/diario/la-cena-que-reemplazo-al-partido.png
```

Cuando el frontend la consuma (todavía no lo hace — `platform/frontend/src/lib/content.ts` no la lee), la convención permitirá traducir esa ruta a `/covers/[slug].png` al copiar al directorio público.

## Cuando un borrador se promueve a publicación

El script `scripts/promote-draft.mjs` debería (cuando se actualice):
1. Tomar `90-Portadas/diario/<slug>.png` y copiarlo a `90-Portadas/publicaciones/<slug>.png`.
2. Sumar `cover_image: /covers/<slug>.png` al frontmatter de la nueva publicación en `50-Publicaciones/`.
3. Copiar el archivo a `platform/frontend/public/covers/<slug>.png` para que el sitio lo sirva.

Por ahora ese paso es manual. El campo `cover_prompt` del borrador **no se promueve** (verificado en código): es artefacto del proceso de generación, no de la pieza final.

## Resoluciones recomendadas

- **Borradores diarios:** 1500×1000 (3:2). Es el aspecto que pide la guía de estilo.
- **Despachos:** 1600×900 (16:9) si el despacho se publica como newsletter; mismo 3:2 si va a sitio.
- **OG image (opcional):** una segunda versión a 1200×630 para Open Graph / Substack / X. Misma escena, recortada o reformateada.

## Lo que NO va acá

- Iconos, logos, assets de UI — esos viven en `70-Producto/design-system/`.
- Imágenes embebidas en el cuerpo del análisis (gráficos, fotos de fuentes) — esas en `60-Borradores/diario/assets/[slug]/` si llegamos a necesitarlas.
- Mockups visuales de producto — en `70-Producto/mockups/`.

## Archivo

Las portadas viejas que ya cumplieron su función publicada se pueden mover a `90-Portadas/_archive/` con prefijo de fecha si en algún momento la carpeta se infla. Por ahora no hace falta.
