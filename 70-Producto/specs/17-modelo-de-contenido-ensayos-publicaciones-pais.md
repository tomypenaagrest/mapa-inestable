# 16 — Modelo de contenido: Ensayos vs. Publicaciones de país vs. Análisis

**Estado:** propuesta lista para implementar.
**Fecha:** 2026-05-09.
**Relacionado:** `BUG-001-detalle-analisis-hardcodeado.md`.

---

## Por qué existe este spec

Hoy el sitio mezcla tres tipos de contenido bajo un solo flujo (`/ensayos` lee de `60-Borradores/` y muestra borradores como si fueran ensayos publicados). El modelo mental real del proyecto es distinto y necesita quedar reflejado en el código y en la estructura del vault.

## Modelo mental canónico

| Tipo | Vive en | Se publica en | Estado actual del sitio |
|---|---|---|---|
| **Ensayos** | `50-Publicaciones/` (ficha + texto completo migrado) | `/ensayos` y Substack | ❌ `/ensayos` está leyendo de `60-Borradores/` |
| **Publicaciones de país** | `60-Publicaciones-pais/` (texto completo, vinculado a 1+ países) | `/pais/[slug]/publicaciones/[pubSlug]` | ❌ No existe, hoy son "borradores" sin país |
| **Análisis** (bot diario) | `lib/analisis.ts` (`ANALISIS_ALL`) | `/analisis` y `/analisis/[pais]/[slug]` | ✅ ok (con BUG-001 abierto) |
| **Disparadores** | `40-Disparadores/` | (no se publica, solo vault) | ✅ ok |

## Decisiones tomadas (referencia conversacional)

1. **Ruta de publicación de país:** nesteada → `/pais/[slug]/publicaciones/[pubSlug]`.
2. **Vínculo a países:** múltiple vía `paises: [ar, br, co]` en frontmatter; cada pieza aparece en la ficha de cada país que listó.
3. **Material duplicado** ("La sospecha antes del voto" existe como análisis corto del bot Y como borrador largo): elegir uno y borrar el otro. **Recomendación:** dejar el largo como publicación de país de Colombia y eliminar la entrada corta del bot en `ANALISIS_ALL` (el editorial gana sobre el automatizado para el mismo material). Confirmar o invertir antes de implementar.

## Cambios concretos

### A. Renombrar y completar frontmatter en el vault

1. **Renombrar** `60-Borradores/` → `60-Publicaciones-pais/`.
   - Mantener `Plantilla de borrador.md` (renombrar a `Plantilla.md`) y `Borradores - MOC.md` (renombrar a `Publicaciones-pais - MOC.md` y actualizar texto interno).
   - Borrar `Colombia - La sospecha antes del voto.md` SI se confirma la recomendación del punto 3 anterior; en ese caso, actualizar `lib/analisis.ts` para eliminar la entrada corta también.
2. **Agregar a cada `.md` el frontmatter mínimo:**
   ```yaml
   ---
   tipo: publicacion-pais
   estado: germen | borrador | listo | publicado
   publicado: true | false      # solo true sale en el sitio
   paises: [ar, co]             # códigos de PAISES_LIST en lib/analisis.ts
   ejes: [[02 - Erosión de las mediaciones]]
   fecha: 2026-05               # opcional, año-mes
   ---
   ```
3. **Para los 4 regionales** (*América Latina entre dos hegemonías*, *Caribe como laboratorio*, *Diplomacia latinoamericana erosionada*, *Patrón de violencia política regional*): listar en `paises:` el subconjunto donde tiene sentido aparecer, no necesariamente los 10. Decisión per-pieza (no genérica).
4. **Para los 12 archivos hoy con `publicado: false`:** dejarlos así. El sitio solo va a renderizar los que tengan `publicado: true`. Es la palanca para mover una pieza de "germen invisible" a "publicada visible".

### B. Migrar texto de Substack a `50-Publicaciones/` (Opción B)

Las 7 fichas hoy contienen solo metadata (tesis, ejes, disparadores, citas). Hay que pegar el cuerpo del artículo de cada post de Substack al final del `.md`, debajo de un separador estable:

```markdown
## Función en el proyecto
...
## Diálogos posibles con otras publicaciones
...

---

## Texto completo

[cuerpo del artículo migrado de Substack]
```

Y completar el frontmatter `url:` con el link permanente de cada post de Substack, para conservar la trazabilidad.

Trabajo manual: 7 piezas. No requiere código.

### C. Cambios en código (`platform/frontend/`)

#### `src/lib/content.ts`

- Renombrar `DRAFTS_DIR` → `PUBLICATIONS_DIR` apuntando a `60-Publicaciones-pais/` (no más `60-Borradores`).
- Renombrar `getAllEssays()` y `getEssayBySlug()` → cambiar la fuente a `50-Publicaciones/`. Filtrar `Publicaciones - MOC.md` y `frontmatter.url` vacío opcional.
- Crear `getCountryPublications(countrySlug: string)` y `getCountryPublicationBySlug(countrySlug, pubSlug)` que:
  - Lean `60-Publicaciones-pais/`.
  - Filtren `publicado: true`.
  - Filtren por `countrySlug ∈ frontmatter.paises`.
  - Devuelvan `{ slug, title, lede, ejes, fecha, html }`.
- El `lede` para publicaciones de país: usar el primer párrafo del cuerpo si no hay un campo dedicado (ya que estos archivos no tienen `*lede en cursiva*` como las publicaciones).

#### `src/app/ensayos/page.tsx` y `src/app/ensayos/[slug]/page.tsx`

- Leen `50-Publicaciones/` (no `60-Borradores/`).
- Listado: muestra título + tesis principal (extraer del `## Tesis principal` o primer `>` blockquote).
- Detalle: renderiza la ficha (tesis, ejes, disparadores, citas, función) **+ "## Texto completo"** debajo. Si hay `url:` del Substack, mostrar también un CTA secundario "Ver en Substack ↗".

#### Ruta nueva: `src/app/pais/[slug]/publicaciones/[pubSlug]/page.tsx`

- Resolver vía `getCountryPublicationBySlug(slug, pubSlug)`.
- Si no existe → `notFound()`.
- Layout similar a la ficha individual de análisis (breadcrumb: Inicio · País · Publicaciones · [título]).
- `generateStaticParams` que itere todos los países × sus publicaciones.

#### `src/app/pais/[slug]/page.tsx`

- Agregar una sección nueva entre las que ya tiene (probablemente después de "Análisis") titulada **"Publicaciones"**.
- Listar todas las `getCountryPublications(slug)` con título, fecha y link a la ruta nesteada.
- Si no hay ninguna, ocultar la sección (no mostrar header vacío).

#### Script de prebuild (vault → `src/content/`)

- Hoy copia `15-Países`, `30-Autores`, `35-Conceptos-clave`, `60-Borradores`.
- **Cambios:**
  - Sumar `50-Publicaciones/`.
  - Renombrar `60-Borradores` → `60-Publicaciones-pais` en el script.
- Buscar el script en `platform/scripts/` o equivalente y editarlo.

### D. Cleanup opcional pero recomendado

- Quitar de `ANALISIS_ALL` la entrada `la-sospecha-antes-del-voto` (Colombia) si se confirma 3y.
- Considerar marcar la ruta `/ensayos/[slug]` con `noindex` mientras la migración B está incompleta, para evitar que Google indexe versiones a medio armar.

## Criterios de aceptación

- [ ] `/ensayos` lista las 7 publicaciones de Substack (no los borradores).
- [ ] `/ensayos/el-mapa-antes-del-territorio` muestra ficha + texto completo + link a Substack.
- [ ] `/pais/co` muestra una sección "Publicaciones" con la(s) pieza(s) cuyo `paises:` incluye `co` y `publicado: true`.
- [ ] `/pais/co/publicaciones/la-sospecha-antes-del-voto` renderiza la pieza completa con breadcrumb correcto.
- [ ] `/pais/ar/publicaciones/foo-inexistente` devuelve 404, no mock.
- [ ] Una pieza con `paises: [ar, br]` aparece tanto en `/pais/ar` como en `/pais/br`, con la misma URL bajo cada ficha (`/pais/ar/publicaciones/...` y `/pais/br/publicaciones/...`) — duplicación intencional al canonicalizar por país.
- [ ] Una pieza con `publicado: false` no aparece en ninguna parte del sitio.
- [ ] El prebuild en Vercel encuentra `50-Publicaciones/` y `60-Publicaciones-pais/` y el sitio levanta.
- [ ] `40-Disparadores/` no se publica en ninguna ruta.

## Trade-offs y decisiones abiertas

- **URL canónica para piezas multi-país:** elegir entre dos URLs idénticas en contenido (una por país) vs. una URL única `/publicaciones/[slug]` con redirects desde `/pais/[slug]/publicaciones/[pubSlug]`. Por ahora, dos URLs (canonical por país) — menos infra, más coherente con la decisión 1-iii.
- **SEO:** considerar `<link rel="canonical">` apuntando al primer país listado en `paises:` para evitar duplicate-content penalty si se mantiene la URL por país.
- **Si la decisión 3 se invierte** (mantener el corto del bot, descartar el largo): borrar el `.md` largo de `60-Publicaciones-pais/` y no se necesita la sección "Publicaciones" en `/pais/co` para esa pieza específica.
