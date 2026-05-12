---
spec: 32
titulo: Vista pública de borradores diarios del agente
estado: implementado
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta: [/analisis/borradores, /analisis/borradores/[pais]/[slug], platform/frontend/src/app/analisis/borradores/, lib/content.ts]
depende_de: [23, 24]
relaciona_con: [Spec 23 (frontmatter agente), Spec 24 (promover borrador), Spec 25 (pipeline interno), Spec 26 (cargar publicaciones), Spec 30 (home derivada del corpus)]
prioridad: media
desbloquea: que los borradores diarios del agente sean descubribles desde el sitio público
---

# 32 · Vista pública de borradores diarios

## Resumen ejecutivo

El agente diario (Specs 23-25) deposita borradores en `60-Borradores/diario/`. Hoy hay 9 archivos generados entre el 27 de abril y el 11 de mayo de 2026 (Argentina, Bolivia, Uruguay×2, Paraguay×2, Perú, Ecuador, Venezuela). Spec 26 reconoce que `/analisis/borradores` "sigue funcionando intacto" pero **no existe entry point desde el sitio público** — la ruta no aparece en el nav, no se linkea desde la home, y un visitante que llegue al sitio nunca se entera de que esos borradores existen.

Spec 25 hace visible el pipeline pero como vista **interna privada** (`robots: noindex`, banner amarillo "no para difusión"). Spec 32 resuelve el complemento: una vista **pública** (o semi-pública) de los borradores del agente como inventario navegable.

**Decisión editorial abierta — y central para esta spec —:** ¿los borradores del agente diario deberían ser *públicos* (cualquier lector los puede leer), *semi-públicos* (la lista existe pero los detalles requieren cierta intención de entrar al sitio), o *internos* (nunca renderizar en el sitio público, mover toda la visibilidad a `/pipeline` de Spec 25)?

La spec describe las tres opciones y propone la intermedia, pero la decisión es de Tomás antes de implementar.

---

## Estado actual

### En el vault

`60-Borradores/diario/*.md` con frontmatter de agente (Spec 23). 9 archivos al 2026-05-11:

| País | Título | Fecha |
|---|---|---|
| Uruguay | El último país que aún conversa | 2026-04-27 |
| Venezuela | Esperar como forma de gobernar | 2026-04-29 |
| Ecuador | La excepción que ya no interrumpe | 2026-05-05 |
| Paraguay | El honor que quería tener voto | 2026-05-06 |
| Paraguay | El país convertido en activo | 2026-05-06 |
| Perú | La elección que no cabía en una sola hoja | 2026-05-07 |
| Uruguay | La cubierta donde no se esperaba ver al Frente Amplio | 2026-05-08 |
| Argentina | La cena que reemplazó al partido | 2026-05-10 |
| Bolivia | La refundación entra en comisión | 2026-05-11 |

### En el sitio

- Nav principal: no menciona borradores.
- Home: no linkea a borradores.
- `/analisis`: no linkea a borradores (Spec 26 §"No incluido" lo confirma).
- `/analisis/borradores`: existe internamente per Spec 25 referencias, pero como entry point público es invisible.

---

## Tres opciones (decisión editorial)

### Opción A — Borradores totalmente públicos

`/analisis/borradores` aparece en el nav. Cada borrador renderiza con su cuerpo completo en `/analisis/borradores/<pais>/<slug>`. Banner editorial pequeño: "Borrador del agente · no editado · sujeto a cambios". El lector puede leerlos como cualquier publicación.

**Pros:** transparencia total del proceso editorial. El agente diario se ve como pipeline visible al público (alineado con el espíritu de "desorientación epistemológica" — mostrar cómo se construye lo que se publica).

**Cons:** muchos borradores son escritos automáticamente y pueden tener errores factuales, voz inconsistente, o tesis no respaldadas. Publicarlos como "lectura" puede confundir al lector y dañar credibilidad.

### Opción B — Listing público, detalles entrables (recomendada)

`/analisis/borradores` aparece linkeada desde un footer secundario o desde `/analisis` (no en el nav principal). El listado muestra todos los borradores con país, fecha, título y un párrafo del lead. El detalle (`/analisis/borradores/<pais>/<slug>`) existe pero requiere click explícito desde el listado — no es indexado por buscadores (`robots: noindex` en el detalle).

Cada detalle tiene banner claramente identificable: "Borrador del agente · pendiente de edición editorial · puede contener errores".

**Pros:** transparencia sin riesgo reputacional. Quien quiere ver "qué está cocinándose" lo encuentra; quien navega casualmente no se topa con borradores sin contexto. Coherente con el principio editorial del proyecto: las cosas se nombran por lo que son.

**Cons:** ninguno significativo. Es la opción de menor riesgo y mayor transparencia controlada.

### Opción C — Solo interno (Spec 25 cubre todo)

Los borradores no aparecen en el sitio público. Toda la visibilidad queda en `/pipeline` (Spec 25, vista interna con `noindex`). El public-facing del sitio empieza recién en `50-Publicaciones/`.

**Pros:** simplicidad. El sitio queda más limpio.

**Cons:** los borradores son una parte real del corpus producido. Dejarlos invisibles desperdicia trabajo del agente y desconecta al lector del proyecto en curso. Argumento editorial débil contra B.

### Recomendación

**Opción B** es la que esta spec asume y diseña. Si Tomás prefiere A o C, los criterios de aceptación se ajustan pero la mayoría del cableado técnico es el mismo.

---

## Propuesta (asumiendo Opción B)

### 1. Loader en `lib/content.ts`

Probablemente ya existe `getAllAgentDrafts()` (Spec 26 §"Estado actual" lo menciona como ya agregado). Esta spec lo usa y complementa.

```ts
// platform/frontend/src/lib/content.ts (existente, posiblemente ya implementado)

export interface AgentDraftMeta {
  slug:        string;
  countrySlug: string;
  country:     string;
  title:       string;
  lede:        string;
  ejes:        AxisKey[];
  ejePrincipal: AxisKey;
  fecha:       string;       // YYYY-MM-DD
  estado:      "borrador" | "en-edicion" | "promovido";
  filename:    string;
}

export interface AgentDraft extends AgentDraftMeta {
  html:        string;       // cuerpo renderizado
  step_disparador?:       string;
  step_desplazamiento?:   string;
  step_conceptualizacion?: string;
  step_apertura?:         string;
}

export function getAllAgentDrafts(): AgentDraftMeta[];
export function getAgentDraftsByCountry(slug: string): AgentDraftMeta[];
export function getAgentDraftBySlug(country: string, slug: string): AgentDraft | null;
```

Si las funciones ya existen con tipos similares, solo confirmar; si no, agregarlas como parte de esta spec.

### 2. Ruta `/analisis/borradores` (listing)

`platform/frontend/src/app/analisis/borradores/page.tsx`. Server Component.

```tsx
import { getAllAgentDrafts } from "@/lib/content";

export const metadata = {
  title: "Borradores del agente — Mapa Inestable",
  description: "Borradores diarios generados por el agente. Material en curso, no editado.",
  // robots: index/follow OK — el listado es buscable
};

export default function BorradoresList() {
  const drafts = getAllAgentDrafts().sort((a, b) => b.fecha.localeCompare(a.fecha));
  return <BorradoresContent drafts={drafts} />;
}
```

**Layout:**

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                           │
│  Borradores del agente                                            │
│  Material diario en curso. No editado. Voz exploratoria.          │
│  N borradores · actualizado [fecha del más reciente]              │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  EXPLICACIÓN BREVE (mono uppercase chip)                          │
│  Estos textos son borradores diarios producidos por el agente     │
│  del proyecto. Pasan por edición humana antes de publicarse.      │
│  Lo que leés acá es trabajo en proceso, no la versión final.     │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  FILTROS (mono chips)                                             │
│  Por país: [AR] [BO] [BR] ... [VE]                                │
│  Por eje: [Desorientación] [Mediaciones] ...                      │
│  Por estado: [Borrador] [En edición] [Promovido]                  │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  LISTADO DE BORRADORES                                            │
│                                                                   │
│  Cards apiladas verticalmente o en grid 2-col:                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ BORRADOR · ARGENTINA · 10 may 2026                          │  │
│  │ La cena que reemplazó al partido                            │  │
│  │ [Lede de 2-3 líneas]                                         │  │
│  │ Eje: Erosión de mediaciones                                  │  │
│  │ Leer borrador →                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ... más cards ...                                                │
└──────────────────────────────────────────────────────────────────┘
```

**Tag visual "BORRADOR"** muy visible en cada card (chip mono en color de advertencia, no neutro).

### 3. Ruta `/analisis/borradores/[pais]/[slug]` (detalle)

`platform/frontend/src/app/analisis/borradores/[pais]/[slug]/page.tsx`. Server Component.

```tsx
import { getAgentDraftBySlug } from "@/lib/content";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Borrador — Mapa Inestable",
  robots: { index: false, follow: false },   // ← key: no indexar borradores
};

export default async function BorradorDetalle({ params }) {
  const { pais, slug } = await params;
  const draft = getAgentDraftBySlug(pais, slug);
  if (!draft) notFound();
  return <BorradorDetailContent draft={draft} />;
}
```

**Render:**

- **Banner editorial prominente al inicio:**
  ```
  ┌──────────────────────────────────────────────────────────────┐
  │ ⚠ BORRADOR DEL AGENTE                                         │
  │                                                                │
  │ Texto generado automáticamente. Pendiente de edición humana.  │
  │ Puede contener imprecisiones factuales, voz inconsistente o   │
  │ tesis no terminadas. La versión publicada en Substack puede   │
  │ ser distinta o no existir.                                    │
  └──────────────────────────────────────────────────────────────┘
  ```
  Color `--mi-accent-warn` o terracota apagada. Imposible de no ver.

- **Header:** título, lede, país, eje, fecha del borrador, estado.
- **Cuerpo:** los 4 pasos si están presentes (`step_disparador`, etc.), o el HTML directo del cuerpo si el agente no estructura.
- **Footer editorial:**
  - "Cuando se publique la versión final, va a aparecer en /analisis o /publicaciones."
  - Link al borrador en `60-Borradores/diario/` si esto fuera interno (no en versión pública).

### 4. Entry points públicos

- **Footer del sitio:** agregar link "Borradores en curso →" en la columna "Marco" o "Producción".
- **`/analisis` (Archivo):** después del listado de publicaciones, sección "También en curso" con link a borradores.
- **`/pais/<slug>` (dashboard):** en la tab Publicaciones, después de las publicaciones reales, sección colapsada "Borradores diarios sobre [País]" con cards de los borradores del país (si los hay).
- **NO** en el nav principal: queda como entry point lateral, no primario.

### 5. Tag "promovido" — ciclo de vida del borrador

Un borrador pasa por estados (Spec 23 + 24 + 25):

- `borrador` → recién generado, sin tocar.
- `en-edicion` → Tomás está trabajando.
- `promovido` → ya se copió a `50-Publicaciones/`. El borrador queda con frontmatter `estado: promovido` pero el archivo sigue en `60-Borradores/diario/` hasta cleanup.

**Decisión:** los borradores con `estado: promovido` siguen visibles en el listado pero con tag "PROMOVIDO" y link al análisis publicado. El lector puede ver el antes y el después si quiere — coherente con la transparencia editorial.

Alternativa: ocultarlos del listado público apenas se promueven. La spec recomienda mostrar pero claramente etiquetados (`PROMOVIDO → ver versión final`).

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/content.ts` | Confirmar / completar tipos y funciones `getAllAgentDrafts`, `getAgentDraftsByCountry`, `getAgentDraftBySlug` |
| `platform/frontend/src/app/analisis/borradores/page.tsx` | **nuevo o refactor** — listado de borradores |
| `platform/frontend/src/app/analisis/borradores/BorradoresContent.tsx` | **nuevo** — render del listado con filtros |
| `platform/frontend/src/app/analisis/borradores/[pais]/[slug]/page.tsx` | **nuevo o refactor** — detalle con banner editorial y `robots: noindex` |
| `platform/frontend/src/components/SiteFooter.tsx` | Agregar link "Borradores en curso →" |
| `platform/frontend/src/app/analisis/AnalisisContent.tsx` | Agregar sección "También en curso" con link a `/analisis/borradores` |
| `platform/frontend/src/components/CountryDashboard.tsx` | En tab Publicaciones, agregar sección colapsada de borradores del país |

---

## Criterios de aceptación

1. `/analisis/borradores` renderiza el listado de los 9 borradores existentes con país, fecha, eje, título, lede.
2. Cada card tiene tag visual "BORRADOR" inequívoco.
3. Click en una card abre `/analisis/borradores/<pais>/<slug>` con el cuerpo del borrador.
4. La página de detalle tiene `robots: noindex` y banner editorial visible al inicio.
5. Filtros por país, eje y estado funcionan (URL state).
6. El footer del sitio incluye link "Borradores en curso →".
7. El archivo `/analisis` incluye una sección "También en curso" con link al listado.
8. La tab Publicaciones del dashboard de país muestra los borradores del país en sección colapsada cuando existen.
9. Borradores con `estado: promovido` aparecen con tag "PROMOVIDO" y link al análisis publicado.
10. Type-check + `next build`.

---

## Edge cases

- **País sin borradores** → en `/pais/<slug>` la sección colapsada se omite.
- **Borrador con frontmatter incompleto** (sin lede, sin eje, etc.) → renderizar con campos disponibles, los faltantes se omiten. Si falta `title` o `countrySlug`, log warning y omitir del listado.
- **Borrador con `estado: promovido` pero no se encuentra la publicación final** → tag "PROMOVIDO" sin link funcional. Probablemente bug del flow de promote; reportar pero no romper render.
- **Dos borradores con mismo slug en el mismo país** (regenerados) → renderizar el más reciente. Mover los anteriores a `_archive/` es responsabilidad del flujo de Spec 24/25.
- **Borrador del agente con tesis claramente errónea** → el banner editorial cubre esto desde la UX, pero no hay validación automática. Es trabajo editorial.

---

## No incluido en esta spec

- **Edición desde el sitio** — borradores se editan en Obsidian/VSCode, no en `/analisis/borradores`. Spec 25 menciona drag & drop como "no incluido"; aplica acá también.
- **Comments / reactions** — fuera de alcance.
- **Indexación por buscadores** — explícitamente `noindex` para evitar que borradores se posicionen como contenido autoritativo.
- **Notificación cuando un borrador se promueve** — Spec 25 (pipeline interno) y Spec 24 (promote) lo manejan editorialmente.
- **Análisis del agente diario que NO sean borradores diarios** — esta spec asume que todo lo de `60-Borradores/diario/` es del agente diario. Otros borradores manuales (si existen) viven en `60-Borradores/` directo y no aplican.

---

## Implementación sugerida

1. Confirmar que `getAllAgentDrafts()` ya está implementada (Spec 26 sugiere que sí). Completar tipos si faltan.
2. Crear o refactor `/analisis/borradores/page.tsx` con listado.
3. Crear o refactor `/analisis/borradores/[pais]/[slug]/page.tsx` con detalle y banner.
4. Agregar entry points: footer, `/analisis`, dashboard de país.
5. Implementar filtros (URL state) en el listado.
6. Verificar `robots: noindex` en el detalle (inspeccionar HTML).
7. Type-check + `next build`.
8. Smoke test con los 9 borradores actuales.

---

## Relación con Spec 25 (pipeline interno)

Spec 25 define `/pipeline` como vista **kanban interna privada** (`noindex`, banner "no para difusión"). Spec 32 es la vista **pública del lado borradores** del mismo flujo.

Convivencia:
- `/pipeline` es para Tomás — operativo, ve métricas, lead time, piezas estancadas.
- `/analisis/borradores` es para el lector — transparencia editorial, contexto.

Mismo loader (`getAllAgentDrafts()`), distinto framing. Ninguna redundancia.