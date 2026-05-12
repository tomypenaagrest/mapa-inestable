---
spec: 33
titulo: Agendas en el panel lateral del mapa de la home
estado: borrador-r2
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
revision: 2026-05-11 (r2) — la spec deja de modificar el SVG del mapa; las agendas van dentro del panel lateral que ya se abre al clickear un país. Decisión de Tomás validada con screenshot.
afecta: [/, platform/frontend/src/components/CountryQuickPanel.tsx (o equivalente), platform/frontend/src/lib/agendas.ts, platform/frontend/src/app/page.tsx]
depende_de: [22, 27]
depende_blanda_de: [30]
relaciona_con: [Spec 16 (dashboard de país con tab Agenda), Spec 22 (mapa Torres García), Spec 26 (cargar publicaciones del vault — para que la sección "Esta semana" deje de leer mocks)]
prioridad: media-alta
desbloquea: que el panel lateral del mapa incluya la lectura factual de la conversación pública además del último análisis
---

# 33 · Agendas en el panel lateral del mapa de la home

## Resumen ejecutivo

Click sobre cualquier país del mapa Torres García en la home ya abre un panel lateral con tres secciones: nombre del país, ejes crónicos (chips), y "Esta semana" (la última publicación con su eje). Cierra con CTA "Ver ficha completa →" que lleva al dashboard del país.

Spec 27 acaba de habilitar agendas vivas por país en el vault — 3-5 temas factuales con tendencia y query a Google News. Esta spec **agrega una sección "Agenda" al panel lateral existente**, ubicada inmediatamente después de "Esta semana" y antes del CTA final. La sección lista las 3-5 agendas de la semana con rank, flecha de tendencia y título; cada ítem es clickeable y abre Google News con la búsqueda geolocalizada al país.

**Por qué dentro del panel y no sobre el SVG:** el mapa Torres García es una pieza con peso editorial (sur arriba, referencia a Torres García 1943). Sobreponer labels de agendas lo convertiría en infografía y diluiría la fuerza visual. El panel lateral, en cambio, ya existe como superficie de información estructurada y es el lugar canónico para sumar la capa factual de las agendas.

**Lo que entra:**
- Sección "Agenda" en el panel lateral, después de "Esta semana".
- Lista de 3-5 agendas con rank, flecha de tendencia, título.
- Cada ítem clickeable → abre Google News con la query geolocalizada (new tab).
- Estado vacío honesto: si no hay agenda live, la sección se omite.
- Lib function `getAllCountryAgendas()` que devuelve un mapa de slug → resumen.

**Lo que NO entra:**
- Modificaciones al SVG del mapa (Spec 22 sigue siendo la fuente; cero cambios visuales al mapa).
- Labels inline sobre los países (r1 lo proponía; r2 lo descarta).
- Popover en hover (r1 lo proponía; r2 lo descarta — el panel lateral ya es la interacción).
- Filtros por eje sobre el mapa.
- Cambios al CTA principal "Ver ficha completa →" (que sigue yendo a `/pais/<slug>`).

---

## Estado actual

### El panel lateral del mapa (Spec 22, ya implementado)

Al clickear un país en el mapa, se abre un panel lateral con:

1. **Header** — nombre del país en Alfa Slab One + botón cerrar (×).
2. **EJES CRÓNICOS** — chips con los ejes activos del país (3-5 chips coloreados).
3. **ESTA SEMANA** — card cream con título de la última publicación + chip del eje principal.
4. **CTA** — botón oscuro "VER FICHA COMPLETA →" que navega a `/pais/<slug>`.

El panel ocupa ~33% del ancho del viewport en desktop, full-width en mobile.

### Lo que falta

Hoy el panel comunica el frame estructural (ejes crónicos) y la pieza editorial más reciente (última publicación). Le falta la capa de **temperatura factual**: qué se está conversando esta semana en ese país. Esa capa existe ahora en el vault gracias a Spec 27 — solo hay que enchufarla.

---

## Propuesta

### 1. Nueva sección "AGENDA" en el panel lateral

Layout vertical del panel después de esta spec:

```
┌─────────────────────────────────────────────┐
│  BOLIVIA                              ×      │
├─────────────────────────────────────────────┤
│  EJES CRÓNICOS                               │
│  [Desrepresentación] [Desorientación]        │
│  [Erosión de mediaciones]                    │
├─────────────────────────────────────────────┤
│  ESTA SEMANA                                 │
│  ┌─────────────────────────────────────┐    │
│  │ El MAS sin Evo, sin Arce, sin destino│    │
│  │ [Erosión de mediaciones]             │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  AGENDA · sem 20 · 2026                      │
│                                              │
│  01 ↑ Bloqueos masivos                       │
│       14 puntos aíslan La Paz                │
│  02 ↑ Marcha evista "Por la Vida"            │
│       Caracollo hacia La Paz                 │
│  03 → Conflicto docente                      │
│       CTEUB paro 24 horas                    │
│  04 → Leyes cuestionadas                     │
│       Tupak Katari contra ley 1720           │
│  05 ↑ Crisis energética                      │
│       Escasez combustible y dólares          │
│                                              │
│  → Ver agenda completa                       │
├─────────────────────────────────────────────┤
│  [VER FICHA COMPLETA →]                      │
└─────────────────────────────────────────────┘
```

### 2. Anatomía de la sección Agenda

**Header:** "AGENDA · sem N · YYYY" en mono uppercase 13px color `--mi-ink-mute`. La semana viene del frontmatter del archivo.

**Lista de ítems** (3-5 según país):
- Rank: `01`, `02`, etc. en mono 13px, color `--mi-accent-gold` o `--mi-ink-mute`.
- Flecha de tendencia: `↑` (subiendo), `→` (estable), `↓` (bajando). Color por estado:
  - `↑` en color cálido (`--mi-accent-gold` o terracota)
  - `→` en `--mi-ink-mute`
  - `↓` en `--mi-accent-warn` (terracota apagada)
- Título de la agenda: en `--mi-font-display` peso medio o Fraunces semibold, color `--mi-ink`.
- Subtítulo (línea de descripción): texto en `--mi-font-body` 13px color `--mi-ink-mute`. Se extrae como primera oración de `description` o se trunca a ~50 caracteres.

**Cada ítem es clickeable.** El target es una URL de Google News construida con la query del item + parámetros gl/hl/ceid del archivo:

```
https://news.google.com/search?q={encodeURIComponent(query)}&hl={hl}&gl={gl}&ceid={ceid}
```

Click abre la búsqueda en nueva pestaña. Sin modal, sin preview adicional — Google News es el destino directo.

**Footer de la sección:** link discreto "→ Ver agenda completa" que navega a `/pais/<slug>?tab=agenda`. Útil para el lector que quiere leer las descripciones completas y el contexto editorial sin pasar por Google News.

### 3. Estado vacío

Si el país no tiene archivo live en `15-Países/agendas/<slug>.md`, **la sección Agenda no se renderiza**. El panel queda con su versión actual (EJES CRÓNICOS + ESTA SEMANA + CTA). Sin placeholder, sin "próximamente" — coherente con el principio editorial del proyecto (no inventar lo que no hay).

Si el archivo existe pero tiene `agendas: []` o `estado: borrador` por error, mismo tratamiento — sección omitida.

### 4. Función `getAllCountryAgendas()` en `lib/agendas.ts`

```ts
export interface CountryAgendaSummary {
  countrySlug:    string;
  countryName:    string;
  week:           number;
  year:           number;
  googleNewsGl:   string;
  googleNewsHl:   string;
  googleNewsCeid: string;
  agendas:        Agenda[];  // las 3-5 publicadas, ordenadas por rank
}

export function getAllCountryAgendas(): Record<string, CountryAgendaSummary>;
```

Server-only. Itera los 10 slugs, llama `getCountryAgenda(slug)` (Spec 27) para cada uno, devuelve solo los que tienen agenda con `estado: publicada`. Países sin agenda live no entran al objeto.

### 5. Helper `buildGoogleNewsUrl(agenda, summary)`

Función pura exportada también desde `lib/agendas.ts`:

```ts
export function buildGoogleNewsUrl(
  agenda: Agenda,
  summary: Pick<CountryAgendaSummary, "googleNewsGl" | "googleNewsHl" | "googleNewsCeid">
): string {
  const q = encodeURIComponent(agenda.query);
  return `https://news.google.com/search?q=${q}&hl=${summary.googleNewsHl}&gl=${summary.googleNewsGl}&ceid=${summary.googleNewsCeid}`;
}
```

Esta función la consume tanto Spec 27 (botón "Ver en Google News" del panel detalle de la tab Agenda) como esta spec 33 (cada ítem del panel lateral del mapa). Un solo lugar para construir la URL.

### 6. Integración

El componente que renderiza el panel lateral (a confirmar el nombre — probablemente `CountryQuickPanel.tsx` o similar) recibe un prop adicional:

```ts
interface CountryQuickPanelProps {
  country: CountrySummary;
  agendaSummary?: CountryAgendaSummary;  // ← nuevo, opcional
}
```

Si `agendaSummary` viene, renderiza la sección. Si no, no la renderiza.

En `app/page.tsx` (dos paths posibles según el estado de Spec 30):

**Path A — si Spec 30 ya está implementada:** consumir el lib unificado.

```ts
const homeData = getHomeData();  // incluye agendasByCountry
// ...
<CountryQuickPanel
  country={selectedCountry}
  agendaSummary={homeData.agendasByCountry[selectedCountry.slug]}
/>
```

**Path B — si Spec 30 todavía no está:** llamar directamente al lib de agendas server-side.

```ts
import { getAllCountryAgendas } from "@/lib/agendas";

const agendasByCountry = getAllCountryAgendas();  // Record<slug, summary>
// ...
<CountryQuickPanel
  country={selectedCountry}
  agendaSummary={agendasByCountry[selectedCountry.slug]}
/>
```

Path B es perfectamente válido; Spec 30 solo centraliza la lectura del corpus en un lugar limpio. Si Spec 33 entra antes que 30, el cableado directo funciona y después se refactoriza cuando 30 esté lista.

### 7. Mobile

El panel lateral en mobile ya funciona como modal o drawer (a confirmar el patrón actual). La sección Agenda se incorpora con el mismo tratamiento — items apilados verticalmente, cada uno clickeable. Sin cambios estructurales al comportamiento del panel.

Si el contenido del panel supera el viewport en mobile, scroll interno como hoy.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/lib/agendas.ts` | + `getAllCountryAgendas()`, + `buildGoogleNewsUrl(agenda, summary)`, + tipo `CountryAgendaSummary` |
| `platform/frontend/src/components/CountryQuickPanel.tsx` (o nombre real del panel lateral) | + prop `agendaSummary`, + render condicional de sección AGENDA |
| `platform/frontend/src/lib/home.ts` | (creado en Spec 30) — incluir `agendasByCountry` en `getHomeData()` |
| `platform/frontend/src/app/page.tsx` | Pasar `agendasByCountry` al map y al panel |

**Nota:** la spec asume nombres tentativos. La primera tarea de implementación es identificar el componente real del panel lateral en el código actual.

---

## Criterios de aceptación

1. Al clickear un país con agenda live en el mapa de la home, el panel lateral muestra la sección "AGENDA · sem N · YYYY" después de "ESTA SEMANA".
2. La sección lista 3-5 ítems con rank, flecha de tendencia, título y subtítulo breve.
3. Las flechas tienen tres estados visuales distinguibles (↑ ↓ →).
4. Click sobre cualquier ítem abre Google News en nueva pestaña con la query geolocalizada al país (`gl={CC}`, `ceid={CC}:{lang}`).
5. Click sobre "→ Ver agenda completa" navega a `/pais/<slug>?tab=agenda`.
6. Click sobre "VER FICHA COMPLETA →" navega a `/pais/<slug>` (sin cambios respecto al comportamiento actual).
7. Si el país no tiene agenda live, la sección Agenda no se renderiza (panel queda en su forma actual).
8. El SVG del mapa NO sufre modificaciones visuales (cero cambios a Spec 22).
9. Mobile: la sección Agenda aparece dentro del panel con scroll interno si es necesario.
10. Type-check pasa. `next build` completa sin errores.
11. La query de Google News construida funciona — verificar con Argentina ("Adorni contradicciones gabinete Milei") que devuelve resultados geolocalizados.

---

## Edge cases

- **Agenda con `query` vacío o malformado** → omitir esa fila (no romper el render). Log warning.
- **Título de la agenda muy largo** (>40 caracteres) → truncar con elipsis en el panel; el subtítulo se acorta agresivamente. El usuario tiene "Ver agenda completa →" para leer la versión sin truncar.
- **País con agenda pero sin parámetros gl/ceid en frontmatter** → omitir la sección entera, log warning. Sin estos parámetros la geolocalización falla.
- **Panel abierto, usuario cambia de país** → la sección Agenda se re-renderiza con los datos del nuevo país (re-fetch no es necesario, todo está en memoria del cliente desde build).
- **Agenda con `estado: borrador`** que se filtró por error a `15-Países/agendas/` → `lib/agendas.ts` la filtra; no debería llegar al panel.
- **Build sin ningún archivo de agenda live** → ningún panel muestra sección Agenda; el mapa funciona como antes de esta spec.

---

## No incluido en esta spec

- **Modificaciones al SVG del mapa.** Spec 22 sigue siendo intocable. Si en el futuro se quiere agregar un signal visual mínimo en el mapa (un dot de color por país), va en spec aparte.
- **Comparativa cross-país desde el panel.** Útil eventualmente pero excede el scope.
- **Histórico de agendas dentro del panel.** El panel muestra solo la semana actual. Para ver historia, dashboard de país.
- **Animación de cambio de agenda entre semanas.** Nice-to-have. v1 lo carga estático.
- **Vista del panel sin click** (alguna manera de ver la agenda más rápido) — eventualmente se podría agregar un keyboard shortcut, fuera de scope.

---

## Implementación sugerida

1. Identificar en el código actual el componente del panel lateral del mapa. Confirmar nombre real (probablemente `MapPanel`, `CountryQuickPanel`, `MapSidebar` o similar).
2. Implementar `getAllCountryAgendas()` y `buildGoogleNewsUrl()` en `lib/agendas.ts`. Test rápido con `node`.
3. Modificar el componente del panel para aceptar el nuevo prop `agendaSummary` y renderizar la sección condicionalmente.
4. Wireup en `app/page.tsx` para pasar `agendasByCountry[slug]` al panel al cambiar de país seleccionado.
5. Validar visualmente con Bolivia (que tiene agenda completa de 5 items en el live actual).
6. Validar el caso vacío con un país que se borre temporalmente del directorio agendas/ (no en prod, en local).
7. Verificar URL de Google News con click real en cada flecha.
8. Mobile responsive check.
9. Type-check + `next build`.

---

## Decisiones tomadas (r2)

| # | Tema | Decisión |
|---|---|---|
| 1 | Dónde van las agendas | Dentro del panel lateral existente, no sobre el SVG |
| 2 | Posición en el panel | Después de "ESTA SEMANA", antes del CTA principal |
| 3 | Cuántas agendas mostrar | Las 3-5 que estén publicadas (no truncar a top 3) |
| 4 | Acción del ítem clickeable | Abrir Google News con la query geolocalizada |
| 5 | Link a tab Agenda | "→ Ver agenda completa" como link discreto al final de la sección |
| 6 | CTA principal | Sin cambios — sigue siendo "VER FICHA COMPLETA →" yendo a `/pais/<slug>` |
| 7 | Estado vacío | Omitir la sección entera, sin placeholder |
| 8 | Mobile | Mismo panel con scroll interno, sin cambios estructurales |

## Decisiones abiertas

1. **Subtítulo del ítem.** Propuesta: primera oración de `description` o ~50 caracteres truncados. Alternativa: omitir descripción y mostrar solo el título (más compacto). Validar visualmente.

2. **Color de la flecha de tendencia.** Propuesta: ↑ en `--mi-accent-gold`, → en `--mi-ink-mute`, ↓ en `--mi-accent-warn`. Decidir mirando paleta real del sistema.

3. **Posición vertical del link "→ Ver agenda completa"** — pegado a la lista de agendas o como bloque separado abajo. Sugerencia: pegado al final de la lista, mismo estilo que un footnote.

4. **Si tiene sentido mostrar el `eje:` opcional del item** en alguna chip pequeña — propuesta es NO mostrarlo (las agendas son factuales, los ejes son lentes; la chip arriba en EJES CRÓNICOS ya cubre la dimensión interpretativa). Si se decide mostrar, conviene que sea muy discreto.

---

## Cierre editorial

Esta versión de la spec respeta el peso visual del mapa Torres García y aprovecha una superficie que ya existe (el panel lateral). El usuario que abre el mapa para descubrir un país ahora obtiene en un solo gesto: la lectura estructural del país (ejes crónicos), la pieza editorial reciente (última publicación) y la temperatura factual de la conversación pública (agenda de la semana) — todo conectado por un solo CTA al dashboard completo.

La home cierra el loop entre los tres planos del proyecto (estructural, editorial, factual) sin perder la compostura visual.
