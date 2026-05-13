# 90-Portadas

Acá viven las portadas generadas con Gemini (u otro modelo de imagen) para los borradores, publicaciones y despachos de Mapa Inestable.

**El comportamiento end-to-end del sistema** (cómo entran al sitio, qué se muestra como fallback, cómo se sincroniza con el frontend) está definido en **[Spec 37 · Portadas en el sitio](../70-Producto/specs/37-portadas-en-el-sitio.md)**.

**El estilo visual** (paleta, granulado, espíritu Revista Humor, instrucciones para Gemini) está en **[`70-Producto/design-system/cover-style-guide.md`](../70-Producto/design-system/cover-style-guide.md)**.

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

El SKILL del agente diario (y los skills `analisis-semanal` y `despacho-semanal` del plugin) **escriben automáticamente** dos campos relacionados en el frontmatter:

```yaml
cover_image: 90-Portadas/diario/la-cena-que-reemplazo-al-partido.png
cover_prompt: |
  [descripción visual del prompt para Gemini]

  Aplicá la guía completa de estilo: 70-Producto/design-system/cover-style-guide.md
  Guardar la imagen como: 90-Portadas/diario/la-cena-que-reemplazo-al-partido.png
```

- **`cover_image`** apunta al path donde *estará* la portada (declarativo). El sitio lo lee y, si la imagen aún no existe, muestra un placeholder con el color del eje principal y el nombre del país en Alfa Slab. Cuando la imagen aparece, la renderiza.
- **`cover_prompt`** es el insumo para que vos generes la imagen con Gemini. Interno: el frontend lo ignora. Al promover la pieza a publicación, se omite.

**Coherencia:** el path en `cover_image` y en la última línea del `cover_prompt` (`Guardar la imagen como: …`) **deben ser idénticos**. Si difieren, hay error de coordinación.

## Sincronización con el frontend

Las imágenes viven acá (en el vault) y se sincronizan al frontend con el script `npm run sync-covers` (Spec 37 §2), que copia `90-Portadas/` a `platform/frontend/public/covers/`. Ese script corre automáticamente en `prebuild` y `predev`, pero también podés invocarlo a mano después de agregar/reemplazar una portada.

## Cuando un borrador se promueve a publicación

El script `scripts/promote-draft.mjs` debería (cuando se actualice — Spec 37 §7):

1. Preservar `cover_image` reapuntando el path de `90-Portadas/diario/` a `90-Portadas/publicaciones/`.
2. Mover/copiar la imagen entre ambas carpetas.
3. Stripear `cover_prompt` del frontmatter de la publicación final.

Por ahora ese paso es **manual**. El campo `cover_prompt` del borrador no se promueve automáticamente (verificado en código): es artefacto del proceso de generación, no de la pieza final.

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
