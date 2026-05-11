---
spec: 27
titulo: Agendas por país (tab vivo de conversación pública)
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
afecta: [/pais/[slug], platform/frontend/src/components/CountryDashboard.tsx, platform/frontend/src/app/pais/[slug]/page.tsx, platform/frontend/src/lib/agendas.ts (nuevo), 15-Países/agendas/ (nueva carpeta del vault)]
depende_de: [16]
relaciona_con: [Spec 16 (dashboard tabular), Spec 26 (lectura del vault), BUG-001 (hardcodeo)]
prioridad: media-alta
extiende: 16
bloquea_a: 28 (scheduled task semanal de actualización de agendas)
---

# 27 · Agendas por país

## Resumen ejecutivo

Las páginas de país tienen hoy seis solapas que describen la estructura de cada país (publicaciones, diagnóstico, pulso, estructura material, contexto, fuentes). Falta una capa intermedia entre el evento concreto (publicación / disparador) y la estructura de fondo (ejes): **lo que ocupa la conversación pública en este momento**.

Esa capa es la que un lector que no habita el país necesita para entender de qué hablan los medios y la opinión pública esa semana. Hoy no existe en ningún lado del sitio.

Esta spec agrega una solapa nueva **`Agenda`** en el dashboard de país, posicionada entre `Publicaciones` y `Diagnóstico`. Cada agenda es un tema (corrupción, inflación, empleo, seguridad) con descripción de qué se discute específicamente esa semana, tendencia editorial (subiendo / estable / bajando) y link a Google News con búsqueda geolocalizada al país.

**Principio rector — sin hardcodeo.** El contenido de las agendas vive en el vault como archivos markdown. El componente nunca contiene datos. Es la misma arquitectura que `getAllPublications()` (Spec 26): vault → lib → server component → client component por props. BUG-001 (mock hardcodeado en página de detalle) es el antipatrón que evitamos.

**Lo que entra:**
- Nueva tab `Agenda` (slug `agenda`) entre `Publicaciones` y `Diagnóstico`.
- Modelo de datos en el vault: un archivo por país en `15-Países/agendas/<slug>.md` con frontmatter estructurado.
- `lib/agendas.ts` con `getCountryAgenda(slug)` análogo a `getCountrySections`.
- Componente `<TabAgenda>` con la interacción del mockup (lista a la izquierda, panel a la derecha, click cambia el panel, botón → Google News).
- Constructor de URL de Google News geolocalizada por país (mapa `slug → gl/ceid`).

**Lo que NO entra (followups explícitos):**
- Historia de agendas (snapshots semanales). MVP es solo estado actual; cuando una semana cambia, se sobrescribe el archivo. Spec futura puede agregar versionado.
- Tarea programada en Cowork que regenera las agendas automáticamente leyendo prensa local. Es el siguiente spec (28); este lo deja preparado.
- Admin UI para editar agendas desde el sitio. Por ahora se edita en Obsidian, igual que el resto del vault.
- Visualización del eje vinculado como tag prominente en la card. Decisión editorial: agendas son factuales, ejes son lentes; la relación es metadata secundaria.

---

## Estado actual

`/pais/[slug]` renderiza 6 tabs definidas en `CountryDashboard.tsx` línea 17-26. Para un lector que no habita el país, hoy puede ver:

- Publicaciones del Substack (qué se publicó sobre el país).
- Diagnóstico estructural (cómo lo leemos).
- Pulso ciudadano LB2024 (datos subjetivos).
- Estructura material (placeholder hasta 14B).
- Contexto (histórico / político / cultural).
- Fuentes monitoreadas.

**Lo que falta:** una vista de qué se conversa en el país esta semana. Sin esa capa, el lector externo entiende los marcos de fondo pero no la temperatura de la conversación pública — y el dashboard pierde el carácter de "vivo" que justifica visitarlo cada semana.

---

## Propuesta

### 1. Modelo de datos en el vault

Nueva carpeta `15-Países/agendas/`. Un archivo por país, nombre = slug:

```
15-Países/agendas/
  ar.md
  br.md
  cl.md
  co.md
  ...
```

**Estructura del archivo** (`15-Países/agendas/ar.md`):

```yaml
---
country_slug: ar
country_name: Argentina
updated: 2026-05-11
week: 19
year: 2026
google_news_gl: AR
google_news_ceid: AR:es-419
google_news_hl: es-419
agendas:
  - rank: 1
    slug: corrupcion
    title: Corrupción
    description: |
      La causa $LIBRA recobró centralidad tras nuevas imputaciones a funcionarios
      del círculo presidencial. El oficialismo apela al "no son todos lo mismo"
      mientras la oposición intenta capitalizar sin liderazgo claro.
    tendencia: subiendo      # subiendo | estable | bajando
    eje: desrepresentacion   # opcional · una de las axisKey conocidas
    query: corrupción $LIBRA gobierno
  - rank: 2
    slug: inflacion
    title: Inflación
    description: |
      El IPC sostiene la baja anunciada por el gobierno, pero la conversación
      se desplazó a tarifas y servicios regulados.
    tendencia: bajando
    eje: mediaciones
    query: inflación tarifas
  - rank: 3
    slug: empleo-salarios
    ...
---

# Notas editoriales (opcional, no se renderiza)

Esta semana corrupción desplaza a inflación como tema dominante. Cuándo cambiar:
si aparece pico de inseguridad, mover seguridad a top 3.
```

**Reglas de parsing:**

- `country_slug` debe matchear el filename. Si no matchean → log warning y skip.
- `agendas` es un array. Mínimo 3, máximo 7. Si excede, se trunca a los 5 primeros visualmente (con warning en consola).
- `rank` es 1-indexed y debe ser único dentro del array.
- `tendencia` es enum estricto. Si viene otro valor → log warning, default `estable`.
- `eje` es opcional. Si viene, debe matchear una `axisKey` conocida (`deculturacion | mediaciones | desrepresentacion | estetizacion | desorientacion | atencion`). Si no matchea → log warning, ignorar el campo.
- `query` puede tener cualquier string. La encodificación ocurre al construir la URL, no al guardar.
- `description` se renderiza como texto plano (los `\n` se conservan como párrafos; sin markdown rico para mantener consistencia visual).
- El cuerpo del archivo (después del `---`) es para notas editoriales del autor y **no se renderiza en el sitio**.

**Saltos seguros:**

- Archivo no existe para un país → la tab muestra placeholder (§5).
- Archivo malformado → log warning con el path, no romper el build.
- Array `agendas` vacío → placeholder, no error.

### 2. Capa de acceso: `lib/agendas.ts`

Análogo a `lib/content.ts → getCountrySections()`. Server-side, usa `fs` y `gray-matter` (ya en dependencias por Spec 26).

```ts
// platform/frontend/src/lib/agendas.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { VAULT_ROOT } from "./content";
import type { AxisKey } from "./ejes";

export type AgendaTendencia = "subiendo" | "estable" | "bajando";

export interface Agenda {
  rank: number;
  slug: string;
  title: string;
  description: string;
  tendencia: AgendaTendencia;
  eje?: AxisKey;
  query: string;
}

export interface CountryAgenda {
  countrySlug: string;
  countryName: string;
  updated: string;          // ISO date (YYYY-MM-DD)
  week: number;
  year: number;
  googleNewsGl: string;     // ISO country (AR, BR, CL...)
  googleNewsCeid: string;   // ej. "AR:es-419"
  googleNewsHl: string;     // ej. "es-419"
  agendas: Agenda[];
}

const AGENDAS_DIR = path.join(VAULT_ROOT, "15-Países", "agendas");

export function getCountryAgenda(slug: string): CountryAgenda | null;
export function buildGoogleNewsUrl(agenda: Agenda, ca: CountryAgenda): string;
```

`buildGoogleNewsUrl` construye:

```
https://news.google.com/search?q={encodeURIComponent(query)}&hl={hl}&gl={gl}&ceid={ceid}
```

El `gl` y `ceid` se leen del frontmatter — no se hardcodea un mapeo `slug → ISO` en el código. Si un país nuevo entra al sitio, alcanza con crear su archivo en `agendas/` con los valores correctos.

### 3. Integración en el dashboard

En `CountryDashboard.tsx` línea 17-26 — insertar la nueva tab en posición 2:

```ts
const TABS = [
  { slug: "publicaciones", label: "Publicaciones" },
  { slug: "agenda",        label: "Agenda" },          // ← nuevo
  { slug: "diagnostico",   label: "Diagnóstico" },
  { slug: "pulso",         label: "Pulso ciudadano" },
  { slug: "estructura",    label: "Estructura material" },
  { slug: "contexto",      label: "Contexto" },
  { slug: "fuentes",       label: "Fuentes" },
];
```

Y agregar el render condicional:

```tsx
{activeTab === "agenda" && (
  <TabAgenda agenda={agenda} />
)}
```

Donde `agenda: CountryAgenda | null` viene como prop del page server. El componente `<TabAgenda>` se documenta en §4.

En `app/pais/[slug]/page.tsx` cargar:

```ts
const agenda = getCountryAgenda(slug);   // null si no hay archivo
```

Y pasarlo al dashboard:

```tsx
<CountryDashboard
  // ... props existentes
  agenda={agenda}
/>
```

### 4. Componente `<TabAgenda>`

Adaptado del mockup en `70-Producto/mockups/agendas-mockup.html`. Anatomía:

- **Header de la tab:** título "Agenda" + subtítulo editorial corto + meta row con fecha de actualización y número de semana. Mismo lenguaje visual que las otras tabs.
- **Layout dos columnas (desktop):** lista de cards a la izquierda (~380px), panel detalle a la derecha (resto del ancho).
- **Card:** rank en Alfa Slab One terracota + título + descripción truncada a una línea + flecha de tendencia (`↑` / `→` / `↓`). Activa = fondo terracota, texto cream. Shadow dura `--mi-shadow-card`. Sin radius (regla DS).
- **Panel detalle:** título grande de la agenda + meta row (`Rank N` · `Tendencia · subiendo` · `Lente · Desrepresentación` si hay eje) + descripción completa + botón principal `Ver en Google News →` con shadow terracota.
- **Click en una card:** cambia el panel sin recargar. Estado del activo en `useState` interno del componente; no se persiste en URL.
- **Mobile (≤640px):** las cards se vuelven acordeón — click expande la card en lugar de abrir panel lateral. El layout dos columnas no entra en mobile.

**Props:**

```ts
interface TabAgendaProps {
  agenda: CountryAgenda | null;
}
```

### 5. Estado vacío (placeholder)

Si `agenda === null` o `agendas.length === 0`:

```
┌────────────────────────────────────────────────────────────────┐
│  AGENDA — PENDIENTE DE CARGA                                   │
│                                                                 │
│  Las agendas de este país todavía no están cargadas en el      │
│  vault. Para activarlas, crear el archivo:                     │
│                                                                 │
│    15-Países/agendas/<slug>.md                                 │
│                                                                 │
│  con el frontmatter especificado en Spec 27.                   │
└────────────────────────────────────────────────────────────────┘
```

Sin números mockup, sin agendas dummy. Misma honestidad editorial que el placeholder de Estructura material (Spec 16 §4.4).

### 6. Decisiones de diseño

| # | Decisión |
|---|---|
| 1 | Posición de la tab: **entre Publicaciones y Diagnóstico** (segunda posición). Decisión de Tomás. |
| 2 | Cantidad de agendas: **3 a 5 visibles**, hasta 7 aceptadas en el archivo, truncado a 5 en UI. |
| 3 | Ranking explícito por importancia editorial — el orden en el array es el orden mostrado. |
| 4 | Tendencia es **juicio editorial manual**, no derivado. Cuando exista historia, podrá calcularse. |
| 5 | Eje vinculado es **metadata secundaria**, no tag prominente. Agendas son factuales, ejes son lentes. |
| 6 | Sin historia en MVP. Sobreescribir el archivo cada semana es suficiente. Versionado es spec futura. |
| 7 | Google News `gl/ceid/hl` viven en el frontmatter del país, no hardcoded en el código. |
| 8 | Estado activo del panel detalle en `useState` local — no se persiste en URL. La tab sí (`?tab=agenda`). |

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/agendas.ts` | **nuevo** — tipos `Agenda`, `CountryAgenda`, función `getCountryAgenda(slug)`, función `buildGoogleNewsUrl(agenda, ca)` |
| `platform/frontend/src/components/CountryDashboard.tsx` | Insertar tab `agenda` en `TABS`, agregar `<TabAgenda>` como render condicional, definir el componente al final del archivo siguiendo la convención de los demás `Tab*` |
| `platform/frontend/src/app/pais/[slug]/page.tsx` | Llamar `getCountryAgenda(slug)`, pasar como prop `agenda` al `<CountryDashboard>` |
| `15-Países/agendas/` | **nueva carpeta** en el vault. Crear archivos iniciales para los 10 países (al menos un MVP con Argentina, Brasil, Chile, Colombia para validar) |
| `70-Producto/mockups/agendas-mockup.html` | Existe ya — referencia visual no normativa pero útil para QA |

---

## Criterios de aceptación

1. La tab `Agenda` aparece en segunda posición en el dashboard de todos los países, después de `Publicaciones` y antes de `Diagnóstico`.
2. `/pais/ar?tab=agenda` carga la tab activa correctamente (URL state respetado).
3. Con `15-Países/agendas/ar.md` presente y bien formateado, la tab renderiza la lista de agendas, la primera activa por default, panel con detalle visible.
4. Click en cualquier card cambia el panel detalle sin recargar la página.
5. Click en `Ver en Google News →` abre nueva pestaña con la búsqueda geolocalizada al país (verificar `gl=AR` en Argentina, `gl=BR` en Brasil).
6. Si no existe `15-Países/agendas/<slug>.md`, la tab muestra el placeholder editorial (no rompe la página).
7. Si el archivo está malformado (YAML inválido, agendas vacío), placeholder + warning en build log; no rompe el build.
8. La tendencia se visualiza correctamente (`↑` subiendo, `→` estable, `↓` bajando).
9. Si una agenda tiene `eje:` definido, el panel muestra la línea `Lente · <nombre del eje>` en color terracota. Si no, esa línea se omite.
10. En mobile, las cards funcionan como acordeón (expandir en lugar de panel lateral).
11. `next build` completa sin errores.
12. Type-check pasa.
13. Ningún componente importa datos de agendas como constante. La única fuente es `getCountryAgenda()`.

---

## Edge cases

- **País sin archivo de agenda** → placeholder con instrucciones para el editor (§5). No 404.
- **Archivo presente pero `agendas: []`** → mismo placeholder. Treat como "pendiente".
- **Una agenda sin `query`** → log warning, ocultar el botón de Google News para esa agenda (el resto se renderiza).
- **Una agenda con `query` que tiene caracteres especiales** (acentos, `$`, espacios) → `encodeURIComponent` los maneja. Verificar con el caso `corrupción $LIBRA`.
- **`updated` con fecha en formato no-ISO** → log warning, mostrar "Actualización pendiente" en lugar de la fecha.
- **Más de 7 agendas** → log warning indicando el exceso, mostrar las primeras 5.
- **Ranks duplicados o salteados** → log warning, igual renderizar en el orden del array.
- **`eje:` con valor no reconocido** → log warning, tratar como si no estuviera definido.

---

## No incluido en esta spec

- **Spec 28 (siguiente):** scheduled task en Cowork que cada lunes regenera las agendas leyendo prensa local del país y escribe el archivo `agendas/<slug>.md`. Esta spec deja el formato preparado para eso; la lógica de generación es trabajo aparte.
- **Historia / versionado** de agendas (ej. `agendas/ar/2026-W19.md`). Cuando entre, el formato del archivo no necesita cambiar — solo el path y un loader que use `getCountryAgendaAt(slug, week, year)`.
- **Filtros / búsqueda** de agendas dentro de la tab. El conjunto es pequeño (≤5); no hace falta filtro.
- **Vinculación bidireccional agenda → publicaciones**. Sería útil ver "publicaciones que se cruzan con esta agenda" pero requiere taggear publicaciones con agenda-slug en el frontmatter — fuera de alcance.
- **Indicador visual de novedad** (ej. "esta agenda es nueva esta semana"). Requiere historia; queda para iteración.

---

## Implementación sugerida

1. Crear `lib/agendas.ts` con los tipos y `getCountryAgenda()`. Hacer un test rápido con `node -e` que parsee un archivo de prueba.
2. Crear `15-Países/agendas/ar.md` con 3-5 agendas reales (válido para QA visual).
3. Insertar la tab `agenda` en `CountryDashboard.tsx → TABS`.
4. Implementar `<TabAgenda>` siguiendo el mockup `70-Producto/mockups/agendas-mockup.html` — desktop primero, mobile después.
5. Pasar `agenda` por props desde `app/pais/[slug]/page.tsx`.
6. Verificar criterios 1-5 con Argentina cargada.
7. Probar criterios 6-7 con `/pais/br` (sin archivo) → placeholder.
8. Probar criterio 7 inverso: archivo malformado deliberadamente → no rompe build.
9. Cargar agendas reales para los 10 países (puede ir en paralelo o en una sesión editorial dedicada).
10. Type-check + `next build`.
11. QA en mobile (acordeón).

---

## Notas para Spec 28 (followup)

Cuando se arme la tarea programada de Cowork:

- El task escribe directo a `15-Países/agendas/<slug>.md`. No hace falta endpoint backend.
- El prompt del task ya recibe el formato del frontmatter como referencia.
- El task corre semanal (lunes 9am local de Buenos Aires).
- Edge case del task: si Tomás editó el archivo a mano después de la última corrida, el task debe respetar las ediciones manuales (estrategia simple: no sobrescribir si `updated` > N días previos).
- La interacción Cowork↔vault ya existe vía filesystem; no hay infra nueva para construir.

---

## Actualización post-Spec 28 (2026-05-11)

Spec 28 se escribió y reformuló dos decisiones que afectan esta spec sin requerir reabrirla:

1. **El task NO escribe directo al live.** En lugar de tocar `15-Países/agendas/<slug>.md`, escribe a borrador en `60-Borradores/agendas/<slug>.md`. El paso a live es un acto humano explícito (skill `promover-agenda`). Esto preserva el principio editorial de revisión.

2. **Cron pasa de lunes 09:00 a viernes 17:00 ART.** La agenda no es predictiva — captura el cierre del arco narrativo semanal.

3. **Nuevo campo opcional `estado:` en el frontmatter** — `publicada` para los archivos en `15-Países/agendas/`, `borrador` para los archivos en `60-Borradores/agendas/`. Si el campo no existe, `lib/agendas.ts` lo trata como `publicada` (retrocompatible con los archivos creados manualmente bajo esta spec). El frontend filtra: solo renderiza agendas con `estado === "publicada"` o ausencia del campo.

Ejemplo de frontmatter actualizado:

```yaml
---
country_slug: ar
estado: publicada     # ← nuevo, opcional
updated: 2026-05-11
agendas: [...]
---
```

Ninguno de estos cambios requiere modificar el componente `<TabAgenda>` ni el render — solo la lógica de filtrado en `getCountryAgenda()` y el path que escribe la tarea programada. Spec 27 sigue siendo la fuente del formato del archivo y la integración en el dashboard.
