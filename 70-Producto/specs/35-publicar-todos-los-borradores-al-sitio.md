---
spec: 35
titulo: Publicar todos los borradores diarios del agente como publicaciones del sitio
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta: [60-Borradores/diario/, scripts/, platform/frontend/src/lib/content.ts, platform/frontend/src/lib/analisis.ts, /pais/[slug], /analisis, /publicaciones/[slug], MOC de publicaciones]
depende_de: [Spec 23 (frontmatter del agente), Spec 24 (promote-draft individual), Spec 26 (publicaciones del vault al sitio)]
relaciona_con: [Spec 32 (vista pública de borradores diarios)]
prioridad: alta
bloquea_a: que el sitio refleje el corpus real del agente (hoy /pais/uy aparece "0 publicaciones" pese a tener 2 análisis del agente listos)
---

# 35 · Publicar todos los borradores diarios del agente como publicaciones del sitio

## Problema concreto

Hoy `/pais/uy` (Uruguay) muestra **0 publicaciones**, aunque el agente produjo 2 análisis sólidos:

- `Uruguay - El último país que aún conversa - 2026-04-27.md`
- `Uruguay - La cubierta donde no se esperaba ver al Frente Amplio - 2026-05-08.md`

Lo mismo pasa con Bolivia (2 borradores), Paraguay (2), Argentina (1), Ecuador (1), Perú (1), Venezuela (1). En total **10 análisis listos en el vault**, **0 visibles en `/pais/<slug>?tab=publicaciones`**.

Causa raíz: `getPublicationsByCountry()` en `lib/content.ts` solo lee `50-Publicaciones/*.md`. Los borradores del agente viven en `60-Borradores/diario/` con `estado: borrador` y nunca entran al tab.

El comando `promote-draft` (Spec 24) resuelve el caso individual cuando una pieza se publica en Substack, pero no cubre el caso "ya está aprobada, quiero que la vea el público del sitio aunque no haya pasado por Substack".

---

## Decisión de modelado

El proyecto está en transición de Substack → plataforma propia (lo dice el CLAUDE.md). Hasta ahora "publicación" significaba "está en Substack". Esta spec **amplía la definición**: una pieza puede estar publicada en el sitio sin estar (todavía) en Substack.

### Nuevos estados (frontmatter)

| Estado | Significado | Carpeta | url? |
|---|---|---|---|
| `borrador` | El agente lo escribió, sin revisión humana | `60-Borradores/diario/` | no |
| `publicado-en-sitio` | Aprobado por el editor, visible en el sitio. Aún no salió en Substack | `60-Borradores/diario/` | no |
| `publicado-en-ambos` | Visible en el sitio Y publicado en Substack | `50-Publicaciones/` | sí |
| `publicado-en-substack` | (legacy) Solo en Substack, no migrado al modelo nuevo. Cubre las 11 publicaciones históricas | `50-Publicaciones/` | sí |

**Importante:** las piezas en `publicado-en-sitio` quedan **físicamente en `60-Borradores/diario/`**. No se mueven a `50-Publicaciones/`. El concepto "publicación" se vuelve lógico, no físico.

### Por qué no moverlos a `50-Publicaciones/`

- Los archivos del agente tienen formato distinto a las publicaciones canónicas (texto narrativo + frontmatter rico, sin ficha analítica de secciones).
- Moverlos exige convertir el formato (lo que hace `promote-draft` con stubs) y pierde información.
- Mover N archivos es N rebabes, mantener el agente y el flujo más simple.
- `50-Publicaciones/` queda como "publicaciones canónicas / del Substack histórico". `60-Borradores/diario/` queda como "lo que el agente produjo y eventualmente aprobamos para el sitio".

### Por qué no usar `promote-draft` (Spec 24) en bucle

`promote-draft` está pensado para el caso "ya publicaste en Substack, ahora migrá la ficha al vault canónico". Tiene un workflow editorial (URL del Substack, conversión a formato canónico con TODOs). Para "aprobar para el sitio sin Substack" no aplica.

---

## Solución

### Pieza 1 — comando `publish-all-drafts.mjs`

Comando interactivo en `scripts/publish-all-drafts.mjs`:

```bash
npm run publish-all-drafts
```

Comportamiento:

1. Lista los borradores con `estado: borrador` y los muestra con país, fecha, título.
2. Permite seleccionar uno por uno (`<space>`), seleccionar todos (`a`), excluir (`-<n>`).
3. Para cada seleccionado:
   - Modifica el frontmatter del .md: `estado: publicado-en-sitio` (manteniendo todos los demás campos).
   - Agrega `published_in_site_at: 2026-05-11T18:00:00-03:00` (timestamp ISO local).
4. Imprime resumen final.

Variante non-interactiva para bulk inicial:

```bash
npm run publish-all-drafts -- --all
```

Promueve los 10 actuales sin confirmación.

### Pieza 2 — Extender `lib/content.ts`

Agregar función `getAllSitePublications()` que **unifica** publicaciones del Substack histórico y borradores aprobados:

```ts
export interface SitePublication {
  slug:         string;
  filename:     string;
  source:       "substack" | "agente-aprobado";
  countrySlug?: string;
  country?:     string;
  title:        string;
  subtitle?:    string;
  lede?:        string;
  fecha:        string;       // YYYY-MM-DD
  year:         number;
  week:         number;
  ejes:         string[];
  ejePrincipal: string;
  url?:         string;       // Substack URL si existe
  estado:       "publicado-en-sitio" | "publicado-en-ambos" | "publicado-en-substack";
  hasSubstack:  boolean;
}

export function getAllSitePublications(): SitePublication[];
export function getSitePublicationsByCountry(slug: string): SitePublication[];
export function getSitePublicationBySlug(slug: string): SitePublication | null;
```

Implementación:

- Lee `50-Publicaciones/*.md` (existente: `getAllPublications()`).
- Lee `60-Borradores/diario/*.md` y filtra los que tienen `estado: publicado-en-sitio` (o `publicado-en-ambos`).
- Mapea ambos a `SitePublication`, **ordena desc por fecha**.

### Pieza 3 — `/pais/<slug>` tab Publicaciones

Reemplazar la llamada `getPublicationsByCountry(slug)` por `getSitePublicationsByCountry(slug)`. La función ya devuelve el array unificado.

En las cards del tab, agregar **badge visual** según la fuente:

- `source: "substack"` → badge cromático "Substack"
- `source: "agente-aprobado"` con `url`: badge "Sitio + Substack"
- `source: "agente-aprobado"` sin `url`: badge "Sitio"

Esto le da transparencia al lector sobre dónde está la pieza.

### Pieza 4 — `/publicaciones/<slug>` detalle

Cuando el slug matchea con una pieza `source: "agente-aprobado"`:

- Render del cuerpo del .md tal cual (no tiene marker SUBSTACK_BODY porque el formato del agente es narrativo desde el inicio).
- En lugar del CTA "Leer en Substack" (que para piezas de agente no aplica si no hay URL), mostrar un bloque que diga "Publicado en mapainestable.com · análisis de [País]".
- Si tiene `url` (caso `publicado-en-ambos`), mantener el CTA al Substack.

Modificar `getPublicationBySlug` (o crear `getSitePublicationBySlug`) para que busque también en `60-Borradores/diario/`.

### Pieza 5 — `/analisis` (Archivo)

`AnalisisContent.tsx` consume `analyses` por props desde `app/analisis/page.tsx`. Cambiar la fuente: en vez de `ANALISIS_ALL` (vacío), pasar `getAllSitePublications().map(toAnalisisEntry)`. Las cards van a ser uniformes; los filtros por país/eje/año funcionan.

### Pieza 6 — Actualizar MOC

`50-Publicaciones/Publicaciones - MOC.md` agrega una sección al final:

```markdown
## Publicaciones del agente (en el sitio, todavía no en Substack)

| Fecha | País | Título | Eje | Origen |
|-------|------|--------|-----|--------|
| 8 may 2026 | Uruguay | La cubierta donde no se esperaba ver al Frente Amplio | mediaciones | Agente diario |
| 7 may 2026 | Perú | La elección que no cabía en una sola hoja | desrepresentacion | Agente diario |
| ... |
```

Generación automática del comando: regenera esa sección leyendo los .md con `estado: publicado-en-sitio`. Idempotente.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `scripts/publish-all-drafts.mjs` (nuevo) | Comando interactivo + flag `--all` |
| `package.json` | Agregar script `publish-all-drafts` |
| `platform/frontend/src/lib/content.ts` | `getAllSitePublications`, `getSitePublicationsByCountry`, `getSitePublicationBySlug`, tipo `SitePublication` |
| `platform/frontend/src/lib/analisis.ts` | (si conviene) adaptador `siteToAnalisisEntry` para que `AnalisisContent` siga aceptando el tipo `AnalisisEntry` |
| `platform/frontend/src/app/pais/[slug]/page.tsx` | reemplazar `getPublicationsByCountry` por `getSitePublicationsByCountry`. Mapear con el nuevo campo `source` |
| `platform/frontend/src/components/CountryDashboard.tsx` | tab Publicaciones muestra badge según `source` |
| `platform/frontend/src/app/publicaciones/[slug]/page.tsx` | usar `getSitePublicationBySlug`. Adaptar render para piezas de agente (sin marker SUBSTACK_BODY) |
| `platform/frontend/src/app/analisis/page.tsx` + `AnalisisContent.tsx` | leer publicaciones unificadas server-side, pasar por props |
| `50-Publicaciones/Publicaciones - MOC.md` | nueva sección "Publicaciones del agente" |
| `60-Borradores/diario/*.md` | el comando modifica `estado` y agrega `published_in_site_at` |

---

## Criterios de aceptación

1. ✅ Después de correr `npm run publish-all-drafts --all`, los 10 borradores actuales quedan con `estado: publicado-en-sitio` en su frontmatter.
2. ✅ `/pais/uy?tab=publicaciones` muestra al menos las 2 piezas de Uruguay del agente.
3. ✅ Lo mismo para Argentina, Bolivia, Ecuador, Paraguay, Perú, Venezuela.
4. ✅ `/analisis` muestra TODAS las piezas: 11 de Substack histórico + 10 del agente = 21 entries (a la fecha del spec).
5. ✅ `/publicaciones/<slug>` renderiza el cuerpo del .md del agente (texto del análisis), con CTA "Publicado en mapainestable.com" en lugar de CTA Substack.
6. ✅ Las cards del tab Publicaciones tienen badge visual distinguiendo `Substack` / `Sitio` / `Sitio + Substack`.
7. ✅ Cuando el agente escriba mañana un borrador nuevo, aparece en `/analisis/borradores` (tal cual hoy) y NO en `/pais/<slug>?tab=publicaciones` hasta que se lo apruebe explícitamente con el comando.
8. ✅ Si Tomás cambia manualmente el `estado: publicado-en-sitio` a `publicado-en-ambos` y agrega `url: https://mapainestable.substack.com/...`, la card muestra "Sitio + Substack" y el CTA al Substack.
9. ✅ Type-check pasa.
10. ✅ `next build` completa sin errores.

---

## Edge cases

- **Borrador sin frontmatter válido** (Spec 23 no aplicada todavía a archivos viejos) — el comando salta el archivo con warning, NO crashea.
- **Slug duplicado** entre Substack histórico y agente — improbable porque las URLs son distintas, pero si pasa, el `source` decide cuál mostrar; ambas aparecen en `/analisis` y `/pais/<slug>` con badges distintos.
- **Borrador sin `country_slug`** — no aparece en `/pais/<slug>` pero sí en `/analisis` general.
- **El agente revisa y reescribe** un análisis ya `publicado-en-sitio` — opción del editor:
  - El comando detecta archivos con timestamp más nuevo y ofrece bajar a `borrador` para nueva revisión, o mantener.
- **Borrador `publicado-en-sitio` que ya no querés mostrar** — el comando soporta `npm run publish-all-drafts -- --unpublish <filename>` que regresa a `borrador`.

---

## No incluido en esta spec

- Cross-posting automático a Substack (eso requiere API o automation con Claude in Chrome).
- Editor visual de borradores antes de aprobar (todavía manual en VS Code).
- Versionado de cambios de estado (auditable). Por ahora `published_in_site_at` es suficiente como marca.

---

## Migración inicial (one-shot)

Después de implementar el comando, correr **una sola vez**:

```bash
npm run publish-all-drafts -- --all
```

Eso aprueba los 10 borradores actuales como publicaciones del sitio. Quedan en `60-Borradores/diario/` (no se mueven). Próximos borradores del agente que escriba mañana arrancan en `borrador` y requieren aprobación explícita.

---

## Implementación sugerida (orden)

1. Crear `scripts/publish-all-drafts.mjs` con menú interactivo, `--all`, `--unpublish`. Testear modo `--dry-run`.
2. Agregar tipos `SitePublication` y funciones en `lib/content.ts`. Testear con `node` que devuelve correctamente las 21 piezas esperadas.
3. Refactor de `app/pais/[slug]/page.tsx` y `CountryDashboard` (tab Publicaciones).
4. Refactor de `app/analisis/page.tsx`.
5. Refactor de `app/publicaciones/[slug]/page.tsx` para soportar piezas de agente.
6. Actualizar MOC.
7. Type-check + `next build`.
8. Visual check de `/pais/uy?tab=publicaciones` (debe haber 2 piezas) y `/analisis` (debe haber 21 piezas).
9. Correr `npm run publish-all-drafts -- --all`.
10. Re-visual check: las piezas que estaban como "borradores del agente" ahora aparecen en Publicaciones del país.
