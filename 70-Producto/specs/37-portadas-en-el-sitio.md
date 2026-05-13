---
spec: 37
titulo: Portadas (cover images) en miniatura de navegación y hero de lectura
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-13
afecta:
  - 90-Portadas/ (vault — single source of truth de las imágenes)
  - 60-Borradores/diario/*.md (frontmatter: agregar campo cover_image)
  - 50-Publicaciones/*.md (frontmatter: agregar campo cover_image, cuando aplique)
  - platform/frontend/src/lib/content.ts (parseo del nuevo campo)
  - platform/frontend/src/components/CoverImage.tsx (NUEVO)
  - platform/frontend/src/components/CoverPlaceholder.tsx (NUEVO)
  - platform/frontend/public/covers/ (NUEVO directorio, hidratado por script)
  - platform/frontend/scripts/sync-covers.mjs (NUEVO script de build)
  - platform/frontend/package.json (hook prebuild)
  - platform/frontend/src/app/analisis/borradores/page.tsx (consumir thumb)
  - platform/frontend/src/app/analisis/borradores/[slug]/page.tsx (consumir hero)
  - platform/frontend/src/app/publicaciones/* (idem cuando se sume scope)
  - platform/frontend/src/app/despachos/* (idem cuando se sume scope)
depende_de: [21, 23, 26, 31, 32]
relaciona_con: [Spec 21 (logo y identidad), Spec 23 (frontmatter del agente diario), Spec 24 (promote-draft strippeo de cover_prompt), Spec 26 (cargar publicaciones del vault al sitio), Spec 31 (despachos del vault al sitio), Spec 32 (vista pública borradores diarios), guía cover-style-guide.md]
prioridad: media-alta
desbloquea: que cada pieza editorial del sitio tenga jerarquía visual propia — miniatura como tarjeta de presentación en grillas/listados y hero como portada al abrir la nota. Cierra el ciclo del flujo cover_prompt → Gemini → 90-Portadas/ → sitio.
---

# 37 · Portadas (cover images) en miniatura de navegación y hero de lectura

## Resumen ejecutivo

Desde Spec 21 el proyecto tiene una identidad visual definida (Grabado, terracota dominante, Alfa Slab One). Desde la guía `70-Producto/design-system/cover-style-guide.md` y los SKILLs del plugin (`agente-diario`, `analisis-semanal`, `despacho-semanal`) cada borrador deposita en su frontmatter un campo `cover_prompt` que el operador humano traduce a una imagen con Gemini y guarda en `90-Portadas/<categoria>/<slug>.png`. **A 2026-05-13 ya hay 11 portadas generadas para los 11 borradores diarios del vault.**

Lo que falta es la pata final del flujo: que esas imágenes se rendericen en el sitio. Hoy las cards de borradores y las páginas de detalle del frontend no consumen ningún campo de imagen — `platform/frontend/src/lib/content.ts` lee título, lede, eje, fecha, fuentes, pero ignora cualquier cover.

Esta spec define:

1. **Schema:** un campo `cover_image` (no `cover_prompt`, que es interno) en el frontmatter de cada borrador/publicación/despacho, apuntando a la ruta relativa al vault de su portada.
2. **Pipeline:** un script Node `sync-covers.mjs` que se ejecuta antes de cada build, copia el contenido de `90-Portadas/` a `platform/frontend/public/covers/` y aplana la estructura por categoría.
3. **Componentes:** `<CoverImage />` (usa `next/image`, dos variantes: `thumb` 3:2 chico y `hero` 3:2 grande) y `<CoverPlaceholder />` (fallback cuando no hay imagen: bloque sólido del color del eje principal con el nombre del país en Alfa Slab One).
4. **Integración:** las cards en `/analisis/borradores`, `/publicaciones`, `/despachos` usan `<CoverImage variant="thumb" />`. Las páginas de detalle usan `<CoverImage variant="hero" />` arriba del título.

**Lo que entra en r1:**

- Schema `cover_image` en frontmatter, documentado.
- Script `sync-covers.mjs` con `prebuild` hook.
- Componentes `<CoverImage />` y `<CoverPlaceholder />`.
- Integración en los **borradores diarios** (single scope que arranca, 11 piezas con imagen).
- Lectura de `cover_image` en `content.ts`.
- Placeholder para piezas sin `cover_image` declarado.

**Lo que NO entra en r1:**

- Integración en publicaciones del Substack (`50-Publicaciones/`) — queda para r2.
- Integración en despachos — queda para r3 (cuando exista el primer despacho).
- Integración en borradores manuales (`60-Borradores/` raíz) — descartado, no son públicos por ahora.
- Optimización a WebP o AVIF — la spec define el formato como `.png` por ahora; la conversión a WebP se trata en una hipotética Spec 38.
- LQIP / blur placeholders — `next/image` lo hace automático con `placeholder="blur"`, lo activamos pero no construimos data-URIs custom.
- OG image generation dinámica para Substack / X — queda como nota de futuro (ver §7).
- CDN externo (Cloudinary, ImageKit) — innecesario en r1; reevaluar si el bundle supera 20MB.

---

## Estado actual

### En el vault

- `90-Portadas/diario/` contiene 11 `.png` con nombre `<slug>.png` matcheando 1:1 con cada borrador de `60-Borradores/diario/`.
- `90-Portadas/publicaciones/` y `90-Portadas/despachos/` están vacías (gitkeep).
- Los borradores diarios tienen un campo `cover_prompt` en frontmatter pero **no tienen** un campo `cover_image`.

### En el frontend

- `platform/frontend/public/` contiene solo `apple-touch-icon.png`, `logo-completo.png`, `og-default.png`. No hay carpeta `covers/`.
- `platform/frontend/src/lib/content.ts` parsea frontmatter pero no extrae ningún campo de imagen. Cualquier campo extra (como `cover_image`) queda disponible en `data.*` del `matter()` pero no se exporta al componente.
- Las cards de `/analisis/borradores` muestran título, lede, país, eje, fecha — todo texto sobre fondo cream con borde y sombra dura. Sin jerarquía visual por pieza.
- La página de detalle de un borrador (`/analisis/borradores/[slug]`) abre con el título en Fraunces y el lede en italic. Sin hero visual arriba del título.

### Lo que el script `promote-draft.mjs` hace con el frontmatter

Verificado en código (Spec 24, líneas 260-269): cuando se promueve un borrador, **construye el frontmatter de la publicación desde cero** con campos explícitos (tags, tipo, estado, país, ejes, fecha, url, título-completo, subtítulo). No copia `cover_prompt` ni `cover_image`. Por lo tanto, al promover, la pieza pierde su referencia a la portada y hay que re-agregarla manualmente en `50-Publicaciones/<archivo>.md` apuntando a la ruta correspondiente en `90-Portadas/publicaciones/`.

→ Spec 37 r2 deberá actualizar `promote-draft.mjs` para preservar (renombrar y reapuntar) `cover_image`. Documentado en §7 como pendiente, no bloqueante de r1.

---

## Propuesta

### 1. Schema del frontmatter

Agregar campo `cover_image` a los borradores diarios. Ruta relativa al vault, sin slash inicial:

```yaml
---
tipo: borrador-agente
country: Argentina
country_slug: ar
title: "La cena que reemplazó al partido"
slug: la-cena-que-reemplazo-al-partido
# ... otros campos ...
cover_image: 90-Portadas/diario/la-cena-que-reemplazo-al-partido.png
cover_prompt: |
  [prompt completo — sigue siendo interno, no se renderiza]
---
```

**Reglas:**

- El valor es siempre la ruta relativa desde la raíz del vault.
- Match 1:1 con el `slug` declarado en el frontmatter.
- Solo `.png` en r1; `.webp` queda para una versión futura.
- Campo opcional: si falta, se aplica el fallback.
- El campo `cover_prompt` se mantiene como artefacto interno del proceso. Sigue sin renderizarse en el sitio.

### 2. Pipeline: `sync-covers.mjs`

Script Node que corre en `prebuild` (y se puede correr manualmente con `npm run sync-covers`). Lee el directorio `90-Portadas/` desde el vault y copia a `platform/frontend/public/covers/`, preservando la estructura por categoría.

```
90-Portadas/                            platform/frontend/public/covers/
├── diario/                              ├── diario/
│   ├── la-cena-...png       ─────►     │   ├── la-cena-...png
│   ├── la-eleccion-...png               │   ├── la-eleccion-...png
│   └── ...                              │   └── ...
├── publicaciones/                       ├── publicaciones/
│   └── (vacío)                          │   └── (vacío)
└── despachos/                           └── despachos/
    └── (vacío)                              └── (vacío)
```

**Implementación (esqueleto):**

```js
// platform/frontend/scripts/sync-covers.mjs
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'fs'
import { join, relative } from 'path'

const VAULT_PORTADAS = join(__dirname, '..', '..', '..', '90-Portadas')
const FRONTEND_COVERS = join(__dirname, '..', 'public', 'covers')

function walkAndCopy(src, dst) {
  if (!existsSync(src)) return
  mkdirSync(dst, { recursive: true })
  for (const entry of readdirSync(src)) {
    if (entry.startsWith('_') || entry.startsWith('.')) continue // ignora _archive, .gitkeep, README
    const s = join(src, entry)
    const d = join(dst, entry)
    if (statSync(s).isDirectory()) walkAndCopy(s, d)
    else if (/\.(png|jpe?g|webp)$/i.test(entry)) copyFileSync(s, d)
  }
}

// Limpia y reescribe para reflejar el estado actual del vault
if (existsSync(FRONTEND_COVERS)) rmSync(FRONTEND_COVERS, { recursive: true, force: true })
walkAndCopy(VAULT_PORTADAS, FRONTEND_COVERS)

console.log('[sync-covers] OK')
```

**Hook en `package.json`:**

```json
{
  "scripts": {
    "sync-covers": "node scripts/sync-covers.mjs",
    "prebuild": "node scripts/sync-covers.mjs",
    "predev": "node scripts/sync-covers.mjs"
  }
}
```

**¿Y para Vercel?** El script corre como `prebuild` antes del `next build`, en el momento del deploy. Pero Vercel **no tiene acceso al vault de Tomás** — el repo del frontend tiene que tener `public/covers/` checkeado en git para que Vercel encuentre las imágenes.

→ Decisión operativa: `public/covers/` queda **dentro** de git (no en `.gitignore`). El script lo regenera localmente antes de cada commit. Hay un workflow simple:

```
1. Generaste una portada → la guardás en 90-Portadas/diario/.
2. Corrés `npm run sync-covers` en platform/frontend/.
3. Hacés commit de los .png nuevos en public/covers/diario/.
4. Push, Vercel deploya con las imágenes ya en el repo.
```

Trade-off: el repo crece. Mitigación r1: PNG comprimidos a ≤500 KB cada uno; con 33 piezas potenciales son ~16 MB acumulados, aceptable. Si el bundle pasa de 50 MB, evaluamos LFS o CDN en una spec futura.

### 3. Modelo de datos en `content.ts`

`platform/frontend/src/lib/content.ts` debe extraer `cover_image` del frontmatter y transformar la ruta:

```ts
// transformVaultPathToPublicUrl()
// "90-Portadas/diario/la-cena.png"  →  "/covers/diario/la-cena.png"

function vaultPathToPublicUrl(vaultPath?: string): string | null {
  if (!vaultPath) return null
  const match = vaultPath.match(/^90-Portadas\/(.+)$/)
  if (!match) return null
  return `/covers/${match[1]}`
}
```

Agregar al tipo de salida del parser de borradores:

```ts
type AgentDraft = {
  country: string
  title: string
  lede: string
  date: string
  ejePrincipal: string
  ejes: string[]
  slug: string
  estado: string
  publicacionSlug?: string
  coverImage: string | null  // ← NUEVO
}
```

### 4. Componentes

**`<CoverImage />`** — wrapper sobre `next/image` con dos variantes:

```tsx
// platform/frontend/src/components/CoverImage.tsx
import Image from 'next/image'
import { CoverPlaceholder } from './CoverPlaceholder'

type Variant = 'thumb' | 'hero'

type Props = {
  piece: {
    coverImage: string | null
    title: string
    country: string
    ejePrincipal: string
  }
  variant: Variant
  priority?: boolean
}

const DIMS = {
  thumb: { w: 600, h: 400 },   // ~display 300x200, 2x DPR
  hero:  { w: 1500, h: 1000 }, // tamaño nativo del prompt
}

export function CoverImage({ piece, variant, priority }: Props) {
  if (!piece.coverImage) {
    return <CoverPlaceholder piece={piece} variant={variant} />
  }

  const { w, h } = DIMS[variant]

  return (
    <div
      className={`mi-cover mi-cover--${variant}`}
      style={{
        aspectRatio: '3 / 2',
        border: '2px solid var(--mi-ink)',
        boxShadow: variant === 'hero'
          ? 'var(--mi-shadow-hero)'
          : 'var(--mi-shadow-card)',
      }}
    >
      <Image
        src={piece.coverImage}
        alt={`Portada: ${piece.title}`}
        width={w}
        height={h}
        priority={priority}
        sizes={variant === 'hero' ? '(min-width: 1200px) 1200px, 100vw' : '(min-width: 1200px) 400px, 50vw'}
        style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
```

**`<CoverPlaceholder />`** — fallback cuando `coverImage === null`:

```tsx
// platform/frontend/src/components/CoverPlaceholder.tsx
const EJE_COLOR: Record<string, string> = {
  deculturacion:     'var(--mi-axis-deculturacion)',     // #6B4A38
  mediaciones:       'var(--mi-axis-mediaciones)',       // #4A5C30
  desrepresentacion: 'var(--mi-axis-desrepresentacion)', // #8A4A55
  estetizacion:      'var(--mi-axis-estetizacion)',      // #B45729
  desorientacion:    'var(--mi-axis-desorientacion)',    // #2D4A6B
  atencion:          'var(--mi-axis-atencion)',          // #C8993E
}

type Variant = 'thumb' | 'hero'

type Props = {
  piece: { country: string; ejePrincipal: string; title: string }
  variant: Variant
}

export function CoverPlaceholder({ piece, variant }: Props) {
  const bg = EJE_COLOR[piece.ejePrincipal] ?? 'var(--mi-bg-dark)'
  const fontSize = variant === 'hero' ? 'var(--mi-text-display)' : 'var(--mi-text-3xl)'

  return (
    <div
      className={`mi-cover-placeholder mi-cover-placeholder--${variant}`}
      style={{
        aspectRatio: '3 / 2',
        backgroundColor: bg,
        backgroundImage: 'var(--mi-grain-paper)', // textura del sistema
        border: '2px solid var(--mi-ink)',
        boxShadow: variant === 'hero' ? 'var(--mi-shadow-hero)' : 'var(--mi-shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--mi-space-4)',
        color: 'var(--mi-bg-paper)',
        textShadow: '3px 3px 0 var(--mi-ink)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--mi-font-display)',  // Alfa Slab One
          fontSize,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          lineHeight: 0.9,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {piece.country}
      </h2>
    </div>
  )
}
```

El placeholder sigue la regla del Spec 21 (logo): texto en Alfa Slab One con `text-shadow` sólido para "vibrar" sobre el fondo. La grilla cromática queda consistente con el sistema de ejes (cada placeholder hereda el color del eje principal de la pieza).

### 5. Integración en las pantallas

**`/analisis/borradores` (grilla — Spec 32):**

Cada card de borrador incluye la thumb arriba del título:

```tsx
<article className="mi-card">
  <CoverImage piece={draft} variant="thumb" />
  <div className="mi-card__body">
    <span className="mi-country-tag">{draft.country}</span>
    <h3>{draft.title}</h3>
    <p className="mi-card__lede">{draft.lede}</p>
    <footer>
      <span className="mi-axis-pill">{draft.ejePrincipal}</span>
      <time>{draft.date}</time>
    </footer>
  </div>
</article>
```

**`/analisis/borradores/[slug]` (lectura):**

Hero 3:2 arriba del título, con `priority` (LCP relevant):

```tsx
<article className="mi-piece">
  <CoverImage piece={draft} variant="hero" priority />
  <header className="mi-piece__header">
    <span className="mi-country-tag mi-country-tag--xl">{draft.country}</span>
    <h1>{draft.title}</h1>
    <p className="mi-piece__lede">{draft.lede}</p>
  </header>
  <div className="mi-piece__body">
    {/* markdown body */}
  </div>
</article>
```

### 6. Estilos

Agregar al `design-tokens.css` (o equivalente):

```css
.mi-cover,
.mi-cover-placeholder {
  width: 100%;
  overflow: hidden;
  /* aspect-ratio + border + shadow ya están inline */
}

.mi-cover--hero,
.mi-cover-placeholder--hero {
  margin-bottom: var(--mi-space-6); /* separación con el header de la pieza */
}
```

---

## Plan de implementación

| Paso | Qué hacer | Archivo | Output verificable |
|---|---|---|---|
| 1 | Sumar `cover_image` al frontmatter de los 11 borradores diarios existentes | `60-Borradores/diario/*.md` | `grep -l "^cover_image:" 60-Borradores/diario/*.md` devuelve 11 |
| 2 | Crear `sync-covers.mjs` | `platform/frontend/scripts/sync-covers.mjs` | `npm run sync-covers` deja 11 archivos en `public/covers/diario/` |
| 3 | Agregar hooks `prebuild` y `predev` en `package.json` | `platform/frontend/package.json` | `npm run build` ejecuta el script antes |
| 4 | Crear componente `<CoverPlaceholder />` | `platform/frontend/src/components/CoverPlaceholder.tsx` | Renderiza un bloque coloreado con el país en Alfa Slab |
| 5 | Crear componente `<CoverImage />` | `platform/frontend/src/components/CoverImage.tsx` | Renderiza la imagen vía `next/image` con fallback al placeholder |
| 6 | Extender `content.ts` con `coverImage` en el tipo + transformación de ruta | `platform/frontend/src/lib/content.ts` | El objeto que llega a la página tiene `coverImage` populated |
| 7 | Integrar `<CoverImage variant="thumb" />` en la grilla de `/analisis/borradores` | `platform/frontend/src/app/analisis/borradores/page.tsx` | Cada card muestra thumb 3:2 |
| 8 | Integrar `<CoverImage variant="hero" priority />` en `/analisis/borradores/[slug]` | `platform/frontend/src/app/analisis/borradores/[slug]/page.tsx` | El detalle abre con la portada grande |
| 9 | Actualizar SKILL del agente diario para que el campo `cover_image` se sume al frontmatter generado | `mapa-inestable-borrador-diario/SKILL.md` | El próximo borrador diario ya viene con `cover_image:` declarado |
| 10 | Lighthouse + screenshot QA | — | LCP < 2.5s en `/analisis/borradores/[slug]`, no hay layout shift |

---

## Criterios de aceptación

- [ ] `npm run build` no falla y deja `public/covers/diario/*.png` con los 11 archivos.
- [ ] La grilla `/analisis/borradores` muestra una thumb por cada uno de los 11 borradores, en 3:2, con borde y sombra sólidos del sistema.
- [ ] Al abrir cualquier borrador, la página renderiza el hero 3:2 arriba del título.
- [ ] Si un borrador tiene `cover_image: null` o no lo declara, en lugar de imagen aparece un `<CoverPlaceholder />` con el color del eje principal y el nombre del país en Alfa Slab.
- [ ] Inspeccionando el HTML, las imágenes vienen de `/covers/diario/<slug>.png` (no de `/90-Portadas/...` ni absolutas).
- [ ] No hay layout shift (las dimensiones están declaradas en `<Image />`).
- [ ] `next/image` está aplicando `priority` solo al hero, no a las thumbs.
- [ ] El frontmatter de los borradores no expone `cover_prompt` al lector (verificable: el HTML no contiene esa cadena).

---

## Lo que NO entra (explícito)

1. **`50-Publicaciones/` (Substack)** — fuera de r1. Requiere generar 13 portadas adicionales primero. Se trata en r2.
2. **Despachos** — fuera de r1. Requiere que haya primero un despacho generado con el skill. Se trata en r3.
3. **Borradores manuales** — descartados. No son vistas públicas del sitio.
4. **Conversión a WebP / AVIF** — innecesaria en r1 con 11 imágenes ≤500 KB. Se trata en una spec futura cuando el bundle pase de 30 MB.
5. **Modificar `promote-draft.mjs`** para preservar `cover_image` al promover — pendiente como sub-spec o r2.
6. **OG images dinámicas para Substack/X** — fuera de scope. Eventualmente se podría usar `next/og` para generar overlays con el título sobre la portada base.
7. **Cropping inteligente** — todas las portadas se diseñan en 3:2 desde la guía. No hay variantes; no hay `imgix`-style focal point.
8. **Edición / regeneración desde el sitio** — el flujo de edición de portadas vive en el vault, no en el frontend.
9. **Animación de entrada del hero** — opcional, no bloqueante. Si se agrega, respetar `--mi-duration-quick` y `--mi-ease` del sistema.

---

## Riesgos y consideraciones

### Tamaño del repo

11 portadas × ~400 KB = ~4.4 MB en r1. Si el scope se expande a publicaciones (13) + despachos (~25/año) + acumulado de borradores (~250/año al ritmo del agente diario), proyección anual ≈ 280 imágenes × 400 KB = ~112 MB. **Antes de eso (~150 imágenes) hay que decidir entre:**

- Git LFS para `public/covers/`.
- Mover a CDN externo (Cloudinary o Vercel Blob).
- Conversión a WebP que reduciría ~3x el tamaño.

La spec **no** lo resuelve ahora; lo deja documentado como umbral de decisión.

### Sync entre vault y repo

El script `sync-covers.mjs` asume que el repo del frontend está dentro del vault (relative path `../../../90-Portadas`). Si en algún momento el repo se mueve a un fork separado del vault, el path se rompe. **Mitigación:** parametrizar `VAULT_PORTADAS` vía variable de entorno con fallback al path por defecto.

### Cache de Next/Image en local

`next/image` cachea optimizaciones en `.next/cache/images/`. Si Tomás reemplaza una portada con el mismo nombre, el browser puede servir la vieja. **Mitigación:** documentar en el README de `90-Portadas/` que para reemplazar una portada conviene también borrar `platform/frontend/.next/cache/images/` antes de rebuildear.

### Vercel y la prebuild

Verificar que en Vercel el `prebuild` script efectivamente corre antes de `next build`. Next.js lo respeta nativamente. Si no, alternativa: poner el comando del script en `buildCommand` del `vercel.json` (`"node scripts/sync-covers.mjs && next build"`).

### Accesibilidad

- `alt={\`Portada: ${piece.title}\`}` no es ideal (descriptivo de la imagen sería mejor). En r2 se podría agregar un campo `cover_alt:` al frontmatter para acompañar al `cover_image:` con una descripción real de la escena. Por ahora suficiente.
- El placeholder usa `text-shadow` sólido — contrastes verificados en design-system.md.

---

## Notas de futuro (no bloqueantes)

- **`cover_alt`** en frontmatter, junto a `cover_image`, para `<img alt>` rico.
- **OG image per piece** generada con `next/og` (Vercel OG): podría tomar la portada base y overlayear el título en Alfa Slab para producir 1200×630 para Open Graph automáticamente.
- **Galería de portadas** como vista del archivo (`/portadas`): grilla de todas las imágenes generadas, ordenable por país, eje, fecha. Sería un *secondary discovery surface* del corpus.
- **Versionado de portadas** si se regenera con el mismo `cover_prompt`: `90-Portadas/diario/<slug>--v2.png` y campo `cover_image_version` en frontmatter. Pertinente solo si Tomás quiere probar variantes.
- **Auditoría de cobertura**: un script `npm run covers:audit` que reporte qué borradores/publicaciones tienen `cover_image` declarado y cuáles no, para no perder de vista la deuda visual.

---

## Pregunta abierta

¿Una portada que sostiene una segunda lectura (irónica, en tensión con el titular) opera distinto cuando se ve en miniatura 300×200 que cuando se ve en hero 1500×1000? Probablemente sí. Conviene observar, después de las primeras semanas con esto en producción, si hay portadas que funcionan en hero pero se diluyen en thumb (por densidad gráfica excesiva, cara perdida en el crop, etc.). Eso podría retroalimentar la `cover-style-guide.md` con una regla nueva: **legibilidad en 300px**. No la incorporamos preventivamente — la dejamos como aprendizaje que la propia spec va a producir.
