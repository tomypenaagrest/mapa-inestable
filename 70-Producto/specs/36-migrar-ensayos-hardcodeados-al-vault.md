---
spec: 36
titulo: Migrar ensayos del array hardcodeado al vault (60-Borradores/)
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta: [60-Borradores/*.md (raíz), platform/frontend/src/app/ensayos/page.tsx, platform/frontend/src/app/ensayos/[slug]/page.tsx, platform/frontend/src/lib/content.ts, platform/frontend/src/lib/essay-drafts.ts (a borrar)]
depende_de: []
relaciona_con: [Spec 23 (frontmatter del agente), Spec 26 (publicaciones del vault), Spec 35 (publicar borradores al sitio)]
prioridad: alta
bloquea_a: que el sitio sea completamente vault-driven (resto del corpus ya lo es; solo /ensayos sigue con datos pegados a mano)
---

# 36 · Migrar ensayos del array hardcodeado al vault

## Problema concreto

`/ensayos` y `/ensayos/[slug]` muestran 7 piezas conceptuales como borradores. **Las piezas viven en `60-Borradores/*.md` (raíz)** y `getEssayBySlug()` ya las lee dinámicamente para el detalle. Pero **el listing en `app/ensayos/page.tsx` tiene un array `ESSAYS` hardcodeado de 7 entradas** con título, lede, axisKey, week, year, readingTime, etc. — pegado a mano. Y existe un archivo `src/lib/essay-drafts.ts` con un `Set<string>` también hardcodeado.

Esto es lo último del sitio que no es vault-driven. El resto (publicaciones, despachos, análisis del agente, agendas, conceptos, autores) ya se lee dinámicamente del vault.

Resultado del bug: si el agente o el editor producen un ensayo nuevo en `60-Borradores/`, no aparece en `/ensayos` hasta que alguien edita `app/ensayos/page.tsx` a mano y agrega la entrada con metadata. Friction innecesaria.

---

## Estado actual

### Array hardcodeado

`platform/frontend/src/app/ensayos/page.tsx`, líneas ~14-110:

```tsx
const ESSAYS: EssayEntry[] = [
  {
    slug: "america-latina-entre-dos-hegemonias",
    title: "América Latina entre dos hegemonías",
    lede: "El reordenamiento global presiona a la región desde el norte y el este. ...",
    axisKey: "mediaciones",
    author: "Tomás Peña Agrest",
    week: 18, year: 2026, readingTime: 12,
    publishedAt: "—", publishedIso: "2026-05-08",
    featured: true,
    draft: true,
  },
  // … 6 más
];
```

### Archivos correspondientes en el vault

| slug | Archivo en `60-Borradores/` | Frontmatter actual |
|---|---|---|
| america-latina-entre-dos-hegemonias | `América Latina entre dos hegemonías.md` | sin frontmatter o mínimo |
| estetica-de-los-movimientos-antisistema | `Estética de los movimientos antisistema.md` | sin frontmatter o mínimo |
| soberania-cognitiva-colectiva | `Soberanía cognitiva colectiva.md` | sin frontmatter o mínimo |
| el-ultimo-de-su-tipo | `El último de su tipo.md` | sin frontmatter o mínimo |
| caribe-como-laboratorio-del-fin-de-los-relatos-del-xx | `Caribe como laboratorio del fin de los relatos del XX.md` | tipo: borrador, estado: germen, ejes |
| patron-de-violencia-politica-regional | `Patrón de violencia política regional.md` | sin frontmatter o mínimo |
| super-newsletter-sobre-harari | `Super newsletter sobre Harari.md` | sin frontmatter o mínimo |

Otros archivos en `60-Borradores/` (NO son ensayos, no migrar):

- `Argentina sin cruzadas.md`, `Colombia - La sospecha antes del voto.md` — borradores del agente promovidos (Spec 24).
- `Diplomacia latinoamericana erosionada.md`, `Propuesta para resolver la desorientación.md`, `Vuelta de los activos duros.md` — borradores germinales que NO están en el array hardcodeado.
- `Borradores - MOC.md`, `Plantilla de borrador.md` — skip.
- `60-Borradores/diario/*.md` — borradores del agente, skip.

### `essay-drafts.ts`

`platform/frontend/src/lib/essay-drafts.ts`:

```ts
export const DRAFT_ESSAY_SLUGS: ReadonlySet<string> = new Set<string>([
  "america-latina-entre-dos-hegemonias",
  // … 6 más
]);
```

Usado en `app/ensayos/[slug]/page.tsx` para mostrar banner "BORRADOR — no publicado". Después de la migración este archivo deja de tener sentido (el draft viene del frontmatter del .md).

---

## Propuesta

### 1. Frontmatter de los 7 ensayos en el vault

Cada uno de los 7 .md arranca con este frontmatter:

```yaml
---
tipo: ensayo
estado: borrador            # o "publicado", "germen", "en-edicion"
slug: america-latina-entre-dos-hegemonias
title: "América Latina entre dos hegemonías"
lede: "El reordenamiento global presiona a la región desde el norte y el este. Las mediaciones que ordenaban la política exterior latinoamericana se disuelven cuando el marco mismo del orden mundial se vuelve incierto."
author: "Tomás Peña Agrest"
axis_key: mediaciones
week: 18
year: 2026
reading_time: 12
featured: true              # opcional, default false
published_iso: "2026-05-08" # cuando se publique de verdad; mientras es borrador, mismo valor que tentative
---
```

**Estados válidos:** `borrador` (no publicado, banner visible), `en-edicion` (Tomás está trabajándolo), `publicado` (visible sin banner), `germen` (idea, no muestrar en /ensayos).

**Valores válidos para `axis_key`:** los seis del proyecto — `deculturacion | mediaciones | desrepresentacion | estetizacion | desorientacion | atencion`.

### 2. Migración de los 7 archivos

Para cada uno: agregar el frontmatter arriba (con los valores que están en el array hardcodeado), preservar el cuerpo del .md tal cual. **No tocar el contenido**, solo agregar el bloque YAML al inicio.

Tarea manual o script — 7 archivos chicos, ~15 min.

### 3. Nueva función `getAllEssays()` en `lib/content.ts`

```ts
const ESSAYS_DIR = path.join(VAULT_ROOT, "60-Borradores");

// Archivos en la raíz de 60-Borradores que NO son ensayos
const ESSAYS_SKIP = new Set([
  "Borradores - MOC.md",
  "Plantilla de borrador.md",
  "Argentina sin cruzadas.md",
  "Colombia - La sospecha antes del voto.md",
  // los borradores del agente promovidos
]);

export interface EssayMetadata {
  slug:         string;
  filename:     string;
  title:        string;
  lede:         string;
  author:       string;
  axisKey:      string;
  week:         number;
  year:         number;
  readingTime:  number;
  publishedIso: string;
  publishedAt:  string;       // formato "8 may 2026"
  estado:       "borrador" | "en-edicion" | "publicado" | "germen";
  featured:     boolean;
  draft:        boolean;      // true si estado !== "publicado"
}

export function getAllEssays(): EssayMetadata[] {
  if (!fs.existsSync(ESSAYS_DIR)) return [];
  const files = fs.readdirSync(ESSAYS_DIR)
    .filter(f => f.endsWith(".md") && !ESSAYS_SKIP.has(f));

  const out: EssayMetadata[] = [];
  for (const filename of files) {
    const raw = fs.readFileSync(path.join(ESSAYS_DIR, filename), "utf-8");
    const { data } = safeMatter(raw);
    // Solo .md con tipo: ensayo entra al listado
    if (data.tipo !== "ensayo") continue;
    if (data.estado === "germen") continue;  // gérmenes no se muestran
    out.push({
      slug:         String(data.slug ?? slugify(filename.replace(".md", ""))),
      filename,
      title:        String(data.title ?? filename.replace(".md", "")),
      lede:         String(data.lede ?? ""),
      author:       String(data.author ?? "Tomás Peña Agrest"),
      axisKey:      String(data.axis_key ?? "mediaciones"),
      week:         Number(data.week ?? 0),
      year:         Number(data.year ?? new Date().getFullYear()),
      readingTime:  Number(data.reading_time ?? 10),
      publishedIso: String(data.published_iso ?? ""),
      publishedAt:  data.published_iso ? formatDateEs(String(data.published_iso)) : "—",
      estado:       (data.estado as EssayMetadata["estado"]) ?? "borrador",
      featured:     Boolean(data.featured),
      draft:        data.estado !== "publicado",
    });
  }
  // Más recientes primero
  return out.sort((a, b) => b.publishedIso.localeCompare(a.publishedIso));
}
```

### 4. Modificar `app/ensayos/page.tsx`

```tsx
import { getAllEssays } from "@/lib/content";
import EnsayosClient from "./EnsayosClient";

export default function EnsayosPage() {
  const essays = getAllEssays();  // server-side
  const allDraft = essays.every(e => e.draft);

  return (
    <div ...>
      {/* … */}
      <span>{essays.length} {allDraft ? "borradores · 0 publicados" : "ensayos"}</span>
      {/* … */}
      <EnsayosClient essays={essays} />
    </div>
  );
}
```

- Sacar el array `ESSAYS = [...]` completo
- Sacar el import de `EssayEntry` (queda solo en el component)
- Mantener el filtro/grid actual

### 5. Modificar `app/ensayos/[slug]/page.tsx`

Reemplazar `isEssayDraft(slug)` por una lectura directa del frontmatter:

```ts
import { getAllEssays } from "@/lib/content";

// ...
const essay = getEssayBySlug(slug);  // ya existe, lee el cuerpo HTML
const meta = getAllEssays().find(e => e.slug === slug);
const isDraft = meta?.draft ?? false;
```

### 6. Borrar `lib/essay-drafts.ts`

Ya no es necesario. El draft viene del frontmatter.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `60-Borradores/América Latina entre dos hegemonías.md` | +frontmatter |
| `60-Borradores/Estética de los movimientos antisistema.md` | +frontmatter |
| `60-Borradores/Soberanía cognitiva colectiva.md` | +frontmatter |
| `60-Borradores/El último de su tipo.md` | +frontmatter |
| `60-Borradores/Caribe como laboratorio del fin de los relatos del XX.md` | reemplazar frontmatter por el nuevo |
| `60-Borradores/Patrón de violencia política regional.md` | +frontmatter |
| `60-Borradores/Super newsletter sobre Harari.md` | +frontmatter |
| `platform/frontend/src/lib/content.ts` | +`getAllEssays()`, type `EssayMetadata`, constante `ESSAYS_SKIP` |
| `platform/frontend/src/app/ensayos/page.tsx` | sacar array `ESSAYS`, llamar `getAllEssays()` |
| `platform/frontend/src/app/ensayos/[slug]/page.tsx` | usar frontmatter para `isDraft`, sacar import de `essay-drafts` |
| `platform/frontend/src/lib/essay-drafts.ts` | **borrar** |

---

## Criterios de aceptación

1. ✅ `/ensayos` lista los 7 ensayos leyendo del vault (verificable: editar el frontmatter de un .md → recargar página → cambio se ve).
2. ✅ Cambiar `estado: borrador` → `estado: publicado` en un .md → la card en `/ensayos` pierde el pill "Borrador".
3. ✅ Cambiar `estado: borrador` → `estado: germen` en un .md → la pieza desaparece de `/ensayos`.
4. ✅ Crear un .md nuevo en `60-Borradores/` con `tipo: ensayo` y frontmatter completo → aparece en `/ensayos` sin tocar código.
5. ✅ `/ensayos/<slug>` muestra el banner "BORRADOR — no publicado" solo cuando `estado !== "publicado"`.
6. ✅ `lib/essay-drafts.ts` ya no existe.
7. ✅ El array `ESSAYS = [...]` ya no existe en `page.tsx`.
8. ✅ Type-check pasa.
9. ✅ `next build` completa sin errores.

---

## Edge cases

- **.md sin frontmatter** — se ignora (no entra al listado). El warning en consola ayuda a debug.
- **.md con `tipo: ensayo` pero sin `axis_key`** — default `mediaciones` (la card sigue rendereando con el pill genérico).
- **.md con `featured: true` y `draft: true`** — la card es featured (hero) pero con badge "Borrador". El featured no implica publicado.
- **Dos .md con el mismo `slug`** — el último gana, log warning.

---

## No incluido en esta spec

- Migrar el resto de archivos en `60-Borradores/` (Diplomacia, Propuesta para resolver, Vuelta de activos duros) — esos son borradores germinales sin estructura todavía, no son ensayos.
- Editor visual de frontmatter — sigue siendo manual en VS Code.
- Sistema de publicación que mueva ensayos al Substack (eso requiere otra spec).

---

## Implementación sugerida (orden)

1. Agregar frontmatter a los 7 archivos (un script Python o manual, 15 min).
2. Agregar `getAllEssays()` en `lib/content.ts`. Testear con `node` que devuelve 7 entries.
3. Refactor de `app/ensayos/page.tsx`: sacar array, llamar `getAllEssays()`, pasar por props.
4. Refactor de `app/ensayos/[slug]/page.tsx`: usar frontmatter para isDraft.
5. Borrar `lib/essay-drafts.ts`.
6. Type-check + visual check de `/ensayos` y un `/ensayos/<slug>` cualquiera.
7. Probar el cambio de estado en un .md.

---

## Commit sugerido

```
feat: spec 36 — ensayos leídos del vault, sacar array hardcodeado

Los 7 ensayos de /ensayos vivían en un array ESSAYS hardcodeado en
app/ensayos/page.tsx, paralelo a los .md del vault en 60-Borradores/.
Cualquier cambio requería editar el .tsx a mano. Misma fricción que
con las publicaciones (resuelta en Spec 26).

Cambios:
- 60-Borradores/<ensayo>.md: agregar frontmatter completo (tipo: ensayo,
  estado, slug, title, lede, axis_key, week, year, reading_time,
  published_iso, featured).
- lib/content.ts: +getAllEssays() que filtra tipo:ensayo y deriva
  draft de estado !== "publicado".
- app/ensayos/page.tsx: sacar array ESSAYS, llamar getAllEssays()
  server-side, pasar por props a EnsayosClient.
- app/ensayos/[slug]/page.tsx: derivar isDraft del frontmatter.
- lib/essay-drafts.ts: borrar (ya no se necesita).

Resultado: el sitio es completamente vault-driven. Cambiar estado:
borrador → publicado en un .md saca el pill de borrador sin tocar
código. Crear un .md nuevo con tipo:ensayo lo agrega al listing.
```
