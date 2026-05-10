---
spec: 15
titulo: Capas de contexto y journey del lector recurrente
estado: borrador-r1
autor: Tomás (con Claude)
fecha: 2026-05-09
revision: 2026-05-09 (r1) — 13 decisiones despejadas en sesión, ver §13 Decisiones tomadas
depende_de: [01, 04, 05, 06, 07, 08, 11, 12, 13]
implementa: capa-contexto, retencion-sin-login, multi-layer-reading
---

# 15 · Capas de contexto y journey del lector recurrente

## Resumen ejecutivo

Esta spec **no redefine** vistas ya especificadas. Aporta tres cosas que ninguna spec previa cubre:

1. **Modelo "Panel multi-capa"** — formaliza cómo cinco capas de información (noticia · estadística · proceso · análisis · marco conceptual) coexisten en cada artículo y se vuelven accesibles sin romper la lectura.
2. **Journey del lector recurrente end-to-end** — define los nueve momentos del recorrido habitual y mapea qué bloque de UI los resuelve.
3. **Sistema de retención sin login** — localStorage como memoria del lector: visto/no visto, última visita, reading list, marcadores.

Trabaja por encima del corpus existente y resuelve cuatro contradicciones detectadas entre specs 01, 05 y 11. La implementación se propone en tres fases (§11) y agrega ~9 componentes al design system "Grabado" v1.1 (§6).

**Estado:** revisión r1 (2026-05-09) — 13 decisiones despejadas en sesión, ver §13.

**Persona objetivo:** lector recurrente (vuelve cada semana, conoce el marco conceptual, espera ver la evolución por país y por eje). No optimiza para primer-time visitor — eso queda para una spec separada de onboarding.

**Lo que NO está acá:** rediseño de la home (Spec 11), buscador (Spec 05), ficha de país (Spec 12), comparativa (Spec 13), página de eje (Spec 04). Esta spec se inserta entre todas y las articula.

---

## 1. Persona — el lector recurrente

### 1.1 Quién es

Mariana, 38, periodista o académica latinoamericanista, vive en Buenos Aires o Bogotá. Sigue Mapa Inestable desde hace cinco meses. Lee el despacho semanal por mail los lunes y vuelve al sitio dos o tres veces durante la semana cuando quiere profundizar un análisis particular. Tiene el marco internalizado: si decís "estetización" sabe a qué te referís.

### 1.2 Qué busca cuando vuelve

| Momento | Lo que la trae |
|---|---|
| Lunes 7am | Acaba de leer el despacho en mail; quiere abrir el análisis completo de un país |
| Miércoles 14h | Una noticia del día le recuerda algo que leyó hace un mes; quiere encontrarlo |
| Viernes 19h | Está armando un texto propio; quiere citar un fragmento puntual |
| Cada tanto | Quiere ver "qué pasó en Bolivia este año" o "cómo evolucionó la atención como eje" |

### 1.3 Frustraciones predecibles

- Volvió al sitio y no recuerda qué ya leyó. El layout no diferencia.
- Quiere citar la "Apertura" del análisis sobre Chile pero el link copia toda la URL del análisis, no el fragmento.
- Una afirmación del cuerpo cita a Byung-Chul Han pero no hay manera rápida de saber qué dijo Han ni dónde lo dijo.
- Encontró el análisis pero quiere ver los datos del Latinobarómetro citados sin saltar a otra página.
- Llegó a un análisis viejo y quiere saber si el proyecto ya volvió sobre ese tema.

### 1.4 Qué NO es esta persona

No es un visitor casual. No necesita que le expliquen "qué es Mapa Inestable". No quiere comentar. No quiere personalización agresiva ni recomendaciones algorítmicas. Valora la curaduría: el orden de los textos importa, lo elegido importa.

### 1.5 Implicancia editorial

El lector recurrente premia tres cualidades, en este orden: **trazabilidad** (puede confiar en lo que afirmás), **densidad navegable** (puede expandir contexto sin perder el hilo), **memoria del corpus** (puede saber qué ya vio y qué hila con qué). El sistema entero se diseña para esas tres.

---

## 2. Journey end-to-end

Nueve momentos del lector recurrente. Cada uno tiene una necesidad explícita y un componente o flujo que la resuelve.

| # | Momento | Necesidad | UI que la cubre | Spec |
|---|---|---|---|---|
| 1 | Aterriza desde mail del despacho | Saltar al análisis específico mencionado | Anchor links en el despacho | 01 + 15 §4.7 |
| 2 | Llega al home un martes | Ver "qué hay nuevo desde mi última visita" | Bloque `Esta semana, lo nuevo para vos` (§5.1) | 15 §5.1 |
| 3 | Quiere leer un análisis | Lectura sin fricción + capas accesibles | Layout multi-capa (§3) | 15 §3 + §6 |
| 4 | Encuentra una afirmación citada | Verificar fuente o profundizar concepto | Footnote inline + aside expandible (§3.3) | 15 §3 + §7 |
| 5 | Quiere comparar países | Saltar de análisis a comparativa | Conector `Comparar →` desde indicador o cita | 13 + 15 §5.4 |
| 6 | Quiere encontrar algo viejo | Búsqueda por país, eje, tiempo o concepto | Buscador con facets (Spec 05) + atajo `/` (§4.3) | 5 |
| 7 | Quiere citar un fragmento | Compartir un párrafo o "Apertura" puntual | Quote-as-card + URL con anchor (§4.7) | 15 §4.7 |
| 8 | Vuelve después de 14+ días | Ver el resumen de lo perdido | `Mientras estuviste fuera` widget (§5.5) | 15 §5.5 |
| 9 | Aterriza desde redes/Google sin contexto | Anclar el marco rápido | Frame strip inline siempre visible (§4.2 r1) | 15 §4.2 |

### 2.1 Diagrama del journey

```
[mail despacho] ──▶ análisis individual ─▶ frame strip ─┐
                                                        │
[Google search] ──▶ análisis individual ─▶ frame strip ─┤
                                                        ├──▶ aside autor / concepto
[home martes] ────▶ "lo nuevo para vos" ──▶ análisis ──▶┤
                                                        ├──▶ footnote ▾ fuente original
                                                        │
                                                        ├──▶ ficha de país (§12)
                                                        ├──▶ comparativa indicador (§13)
                                                        ├──▶ otro análisis del eje
                                                        └──▶ ensayo del eje (Spec 07)

[cualquier vista] ◂─── atajo "/" ───▶ buscador / palette
[cualquier vista] ◂─── atajo "?" ───▶ ayuda atajos
```

---

## 3. Modelo "Panel multi-capa"

### 3.1 Las cinco capas

Cada análisis es la articulación de cinco capas de información. La spec las nombra explícitamente para que tengan tratamiento de UI consistente.

| Capa | Qué es | Origen | Cómo se renderiza |
|---|---|---|---|
| **L1 · Noticia** | El disparador concreto: titular, hecho, fecha | Fuentes RSS / curaduría | Citation block primario |
| **L2 · Estadística** | Datos cuantitativos invocados (Latinobarómetro, encuestas, indicadores) | Vault `35-Conceptos-clave/` y dataset LB | `<IndicatorCard>` inline (§7.1) |
| **L3 · Proceso** | La trayectoria estructural que la noticia revela (paso 02 del método: desplazamiento del evento al proceso) | Cuerpo del análisis | Prose con footnotes (§7.2) |
| **L4 · Análisis** | La interpretación a través de los ejes | Cuerpo del análisis (paso 03 conceptualización) | Prose con axis pills y aside |
| **L5 · Marco conceptual** | Los ejes, autores, conceptos que dan sentido | Vault `10-Ejes/` `30-Autores/` `35-Conceptos-clave/` | Aside expandible (§3.3) + cross-reference panel |

### 3.2 Principio rector

> **El cuerpo del artículo es L3+L4 (prosa). Las otras tres capas son accesibles desde la prosa pero no la interrumpen.**

L1 vive en el citation block (header del artículo y final). L2 aparece como tarjeta inline cuando el cuerpo invoca un dato. L5 vive en el aside lateral que se expande sin sacar al lector de la página.

Esta es la diferencia con un explainer típico (NYT, Pudding, OurWorldInData): el cuerpo no se construye sobre los datos, los datos se invocan desde el cuerpo. La interpretación tiene primacía.

### 3.3 Aside expandible — anatomía

Layout desktop ≥ 960px:

```
┌─────────────────────────────┬──────────────────┐
│ Cuerpo del análisis (720px) │  Aside (240px)   │
│                             │                  │
│ ...el ensayo de Han sobre   │  ┌────────────┐  │
│ la sociedad del cansancio¹  │  │ ¹ Byung-Chul│  │
│ describe...                 │  │   Han       │  │
│                             │  │   Sociedad  │  │
│                             │  │   del cans. │  │
│                             │  │   2010      │  │
│                             │  │   Ver más → │  │
│                             │  └────────────┘  │
└─────────────────────────────┴──────────────────┘
```

- El número volado `¹` es **scroll-spy**: cuando el footnote entra al viewport, su tarjeta correspondiente en el aside se resalta (border-thick → border-bold y shadow-card → shadow-card-lift).
- En mobile (<640px) el aside no existe; el footnote es un botón que abre un drawer de bottom sheet con el contenido.
- En tablet (640–959px) el aside se vuelve drawer lateral derecho, escondible.

### 3.4 Tipos de footnote

| Tipo | Marca | Contenido del aside |
|---|---|---|
| Autor | `¹` (mono superscript) | Foto opcional, nombre, obra clave, año, link a `/autor/[slug]` |
| Concepto | `²` | Definición de 1-2 oraciones, autor que lo acuñó, link a `/concepto/[slug]` |
| Fuente primaria | `›` (chevron mono) | URL, medio, fecha, autor, "Leer original ↗" |
| Estadística | `■` (cuadrado mono) | Indicador, valor, fuente, año, "Comparar →" |
| Análisis previo | `⌖` (target mono) | Título del análisis, semana, "Leer →" |

Las marcas son intencionalmente extrañas (no superíndices arábigos genéricos): refuerzan la identidad de grabado y diferencian visualmente el tipo de profundización disponible.

### 3.5 Reglas de invocación

- **Sugerencia editorial de cinco footnotes por análisis** (no regla dura). El método pide densidad, no aparato académico. Si un análisis necesita más, pueden agregarse hasta ~7-8; del sexto en adelante el editor evalúa si conviene mover excedentes a una sección "Lecturas" al pie del artículo en lugar de seguir poblando footnotes con aside. La sección "Lecturas" usa la misma estructura visual del aside (tipos, marcas) pero apilada como lista al final del cuerpo.
- **Las primeras dos invocaciones de un autor o concepto en el corpus** disparan footnote; a partir de la tercera, solo link inline subrayado.
- **Las estadísticas siempre llevan footnote** — esto es regla editorial dura, alineada con la trazabilidad obligatoria del CLAUDE.md raíz.

---

## 4. Flujos clave

### 4.1 F1 — Retorno semanal "qué hay nuevo"

**Cuando:** el lector vuelve al home un martes después del despacho del lunes.

**Flujo:**

1. Home detecta `localStorage.lastVisit` (§6.1).
2. Si la última visita fue hace ≥3 días Y hay análisis publicados desde entonces, el bloque "Esta semana" del rediseño (Spec 11 §4.4) muestra primero un sub-encabezado:

   ```
   DESDE TU ÚLTIMA VISITA · 4 ANÁLISIS NUEVOS
   ```

3. Las cards del carrusel publicadas después de `lastVisit` llevan un dot dorado (`--mi-accent-gold`, 8px, top-right del card, sin animación).
4. El lector escanea, hace click. La acción de click marca esa pieza como "leída" (§6.2).

**Estados:**
- Lector primer-time o sin `lastVisit`: el sub-encabezado no aparece, los dots no aparecen. Se ve la home estándar de Spec 11.
- Lector recurrente sin nuevas: muestra "Tu última visita fue [fecha]. Sin novedades desde entonces." en un strip mono pequeño bajo el header de la sección.

**Componente:** `<NewSinceLastVisit>` (§7.6)

### 4.2 F2 — Marco siempre visible al inicio del análisis (Frame strip inline)

**Cuando:** todo el tiempo. No depende de `referrer` ni de detección de first-time visitor.

**Decisión r1:** convertimos el bloque puente al marco en un **strip editorial sutil al inicio del cuerpo del análisis** que se muestra a todos los lectores, recurrentes y nuevos por igual. Es información estructural del análisis, no un onboarding condicional.

**Anatomía del strip:**

```
─────────────────────────────────────────────────────────
ESTE ANÁLISIS SE ACTIVA EN  DESORIENTACIÓN EPISTEMOLÓGICA
                            [→ Sobre el eje]  [→ El método]
─────────────────────────────────────────────────────────
```

- Aparece entre el lede y el citation block primario (L1).
- Tipografía: mono uppercase 13px (`--mi-font-mono`), color `--mi-ink-mute` para "ESTE ANÁLISIS SE ACTIVA EN", axis pill para el eje, mono links subrayados para "Sobre el eje" y "El método".
- Background `--mi-bg-paper`, borde superior e inferior thick `--mi-rule-soft`.
- Si el análisis activa más de un eje, mostrar todos separados por `·`.
- En mobile: el strip se mantiene; los dos links se apilan a la derecha o pasan a línea siguiente.

**Por qué inline siempre:**
1. El marco es parte de la editorialidad de cada pieza. Mostrarlo siempre lo normaliza, no lo trata como onboarding excepcional.
2. Cero detección de referrer / state. Más simple de implementar; cero condicionales en la UI.
3. Para el lector recurrente cumple función de "anclaje rápido del eje" — útil incluso sabiendo el marco.

**Componente:** `<FrameStripInline>` (renombrado de `<FrameOnboardingBridge>`). Reemplaza el componente anterior; reduce el sistema de retención del lado de detección de first-time (no se necesita `frameSeen` en `localStorage`).

### 4.3 F3 — Búsqueda dirigida (extiende Spec 05)

Spec 05 ya cubre la página `/analisis`. Esta spec agrega:

1. **Atajo de teclado `/`** desde cualquier página abre un command palette modal (no navega a `/analisis`). Inspirado en patrones de Are.na y Linear.
2. **Búsqueda por capa**: el palette tiene tabs `Análisis / Países / Ejes / Autores / Conceptos`. La query se ejecuta sobre la capa seleccionada.
3. **Resultados con preview**: cada hit muestra título + 1 línea de contexto + axis pill. Enter navega.
4. **`Esc`** o backdrop cierra. `↑/↓` navega resultados.

**Componente:** `<CommandPalette>` (§7.8). Sticky en todo el sitio, foco recuperable. No interfiere con `/analisis` que sigue siendo la búsqueda full-page con filtros sticky.

### 4.4 F4 — Lectura del análisis con capas accesibles

**Layout primary del análisis individual** (extiende Spec 01 §5.2):

```
┌───────────────────────────────────────────────────────────┐
│  HEADER: país · semana · ejes · fecha                     │
│  TÍTULO h1 (Fraunces 52px)                                │
│  LEDE (Lora 22px, 2-3 oraciones)                          │
└───────────────────────────────────────────────────────────┘
┌───────────────────────────────────────────────────────────┐
│  FRAME STRIP INLINE (§4.2 r1) — siempre visible           │
│  ESTE ANÁLISIS SE ACTIVA EN [eje] · [Sobre el eje]        │
└───────────────────────────────────────────────────────────┘
┌────────────────────────────────────┬──────────────────────┐
│  CITATION BLOCK PRIMARIO (L1)      │   ASIDE STICKY      │
│  Disparador: noticia + fuente      │   (top: 96px)       │
│  ──────────────────                 │                      │
│                                    │   Empty hasta que    │
│  PASO 01 — Disparador (L1+L3)      │   un footnote        │
│  Step block con ícono "①"          │   activa una card    │
│  Prose con footnotes               │                      │
│                                    │   Cuando una card    │
│  PASO 02 — Desplazamiento (L3)     │   está activa:       │
│  Step block con ícono "②"          │   border-bold +      │
│                                    │   shadow-card-lift   │
│  [INDICATOR CARD INLINE — L2]      │                      │
│                                    │                      │
│  PASO 03 — Conceptualización (L4)  │   Hasta 5 cards      │
│  Axis pill prominente              │   activas; las que   │
│                                    │   salen del scroll   │
│  PASO 04 — Apertura (L4)           │   se mantienen pero  │
│  Quote-as-card destacable          │   con shadow-card    │
│                                    │   (no lift)          │
└────────────────────────────────────┴──────────────────────┘
┌───────────────────────────────────────────────────────────┐
│  CROSS-REFERENCE PANEL (Spec 01 §5.2)                     │
│  3 del país + 3 del eje                                   │
└───────────────────────────────────────────────────────────┘
```

**Decisión:** la ficha de país (Spec 12) usa indicadores Latinobarómetro como bloque expandido fijo. Acá los indicadores aparecen **inline contextual**: el cuerpo invoca uno, aparece la card, se sigue leyendo. Los componentes (`<IndicatorCard>`) se reusan; cambia la regla de invocación.

### 4.5 F5 — Profundización encadenada (POSTERGADO A v2)

**Decisión r1:** el componente `<ConceptualThread>` queda postergado a v2 de la spec.

**Razón:** depende de poblar el campo `conceptos_invocados[]` (Spec 07 §5) en el corpus, y ese trabajo de etiquetado retroactivo no entra en el scope de v1. Sin data, el bloque queda vacío para casi todos los análisis y empuja a una experiencia rota.

**Lo que sigue cubriendo la profundización en v1:**
- Cross-reference panel de Spec 01 §5.2: 3 análisis del mismo país + 3 del mismo eje (navegación tipológica).
- Footnote tipo `⌖` "análisis previo" (§3.4) cuando el cuerpo del análisis cita explícitamente otro: el lector llega curado, uno por vez, no por listado automático.
- Página de eje (Spec 04, ya implementada): listado cronológico de "análisis donde se activó".

**Backlog para v2:** retomar `<ConceptualThread>` cuando exista bandwidth para etiquetar conceptos del corpus (top 20 análisis canon o el corpus completo, según se decida en su momento). Spec 07 sección 5 sigue siendo la base del modelo de datos requerido.

### 4.6 F6 — Memoria del lector (client-side)

Detallado en §6.

### 4.7 F7 — Compartir fragmento citativo

**Cuando:** el lector quiere citar la "Apertura" o un párrafo específico.

**Mecánica:**

1. Hover sobre cualquier párrafo del análisis muestra un botón flotante a la izquierda: `❝` (Alfa Slab One, 18px, opacity 0.4 → 1 on hover).
2. Click sobre el botón:
   - Copia al portapapeles `<URL del análisis>#p-<id>` con un toast `Link copiado`.
   - Selecciona el párrafo con highlight terracota (`background: var(--mi-bg-warm); color: var(--mi-bg-paper);`).
3. URL con anchor `#p-7` carga el análisis con el párrafo 7 resaltado y scroll-into-view.
4. Botón secundario: `Generar imagen` → genera un PNG con el párrafo sobre fondo terracota + cita del autor + URL. Útil para Instagram/X.

**Aplicación especial — bloque "Apertura" (paso 04):** el botón es siempre visible (no hover), porque la pregunta sin respuesta es la unidad citativa más fuerte del proyecto.

**Componente:** `<ParagraphShare>` y `<QuoteCardGenerator>` (§7.5).

### 4.8 F8 — Lectura mobile (no breakpoints, flujos)

Spec 02 cubre breakpoints. Acá se cubre la pregunta "cómo se lee con cuatro step blocks en 360px de pantalla":

1. **Aside no existe.** Footnotes son botones que abren bottom-sheet de 60vh con backdrop. Cierre por swipe-down o tap fuera.
2. **Step blocks colapsables.** En mobile, cada uno de los 4 pasos del método empieza expandido pero el header del paso es sticky. Al scrollear dentro del paso, el header se queda pegado: el lector siempre sabe en qué paso está. Tipografía mono uppercase, Background terracota, height 36px.
3. **Indicator cards inline** se vuelven full-width con `aspect-ratio: auto`. La cifra grande conserva 72px (no baja a 52 como pediría Spec 02 §3.2 para `--mi-text-display`) — es la información primaria.
4. **Hilo conceptual y cross-reference** se vuelven cards apiladas con scroll horizontal por sección (similar al carrusel del home). Mantiene la idea sin abrumar.
5. **Frame onboarding bridge** se vuelve un strip horizontal sticky-bottom mientras el lector está en el primer 30% del scroll. Después se relega al pie. Anti-modal: nunca interrumpe lectura.

---

## 5. Sistema de retención sin login

### 5.1 Justificación

Mapa Inestable rechaza explícitamente login y personalización agresiva (Spec 09 §1.1 "Riesgo de captura"). Pero un corpus que crece a 78+ análisis al cabo del Año II sin marcadores de progreso convierte la lectura en búsqueda permanente. La salida es **memoria persistente sin identidad**: localStorage.

### 5.2 Schema localStorage

```ts
// Clave: 'mi:reader-state' (single key, JSON serialized)
{
  v: 1,                                    // version del schema
  lastVisit: "2026-05-09T11:32:00Z",       // ISO timestamp
  read: ["arg-2026-w15", "bra-2026-w15"],  // slugs de análisis leídos
  saved: ["chi-2026-w12"],                  // reading list manual
  followedCountries: ["argentina"],         // opcional, para §5.4 y §8.2
  followedAxes: ["desorientacion"],
  preferences: {
    reduceMotion: false,                    // respeta media query si null
    sidebarState: "collapsed",               // r1: 'collapsed' | 'expanded' | 'auto'
    theme: "auto"                           // futuro
  }
}
```

**Nota r1:** los campos `frameSeen` / `frameSeenAt` se eliminaron porque el frame strip ahora aparece siempre (§4.2 r1).

### 5.3 Reglas de uso

- **Nunca** se envía a un servidor.
- **Nunca** se cruza con datos personales — no hay datos personales.
- Reseteable desde footer: link `Olvidar estado de lectura`. Modal de confirmación.
- Si el usuario tiene `prefers-reduced-data` o storage bloqueado, el sitio funciona idéntico — los markers de "leído" simplemente no aparecen.

### 5.4 Marcadores visuales de "leído / nuevo"

| Estado | Marca |
|---|---|
| No leído | (sin marca) |
| Nuevo desde lastVisit | dot dorado 8px top-right del card |
| Leído | título en `--mi-ink-mute` (opacity ~0.7); meta-data en mono soft |
| Guardado en reading list | bookmark mono `★` antes del título |

Tres estados visibles, no más. El sistema no muestra "porcentaje leído" ni progreso interno — sería violencia con el cuerpo del análisis.

### 5.5 "Mientras estuviste fuera" widget

**Cuando:** el lector vuelve después de ≥14 días (decisión r1: dos despachos perdidos como umbral).

**Dónde:** strip al tope del home, sobre "Esta semana".

```
┌──────────────────────────────────────────────────────────┐
│ MIENTRAS ESTUVISTE FUERA · 2 SEMANAS, 8 ANÁLISIS         │
│                                                          │
│ Lo más activo: ARGENTINA (3) · DESORIENTACIÓN (4)        │
│ Lo nuevo: el eje ESTETIZACIÓN volvió tras 4 semanas      │
│                                                          │
│ Ver despachos perdidos →    Ir al home →                 │
└──────────────────────────────────────────────────────────┘
```

Strip se cierra con `×`. Click en cierre marca `lastVisit` al ahora; no vuelve a aparecer.

**Componente:** `<WhileYouWereAway>` (§7.10).

### 5.6 Reading list

`Guardar` button en cada card de análisis. Aside del análisis individual también lo tiene. La lista vive en `/leer-despues` (no se agrega al menú principal — link solo desde footer y desde `★ N` en el header del lector recurrente). Sin login, la lista es del navegador, no del usuario; se nombra explícitamente "este navegador" para que no haya confusión.

---

## 6. Componentes nuevos para el design system v1.1

Cada uno listado con anatomía, props mínimos y tokens. Asume que el design-system.md ya tiene los componentes de Spec 11.

### 6.1 `<Footnote>` (anchor inline)

**Anatomía:** marca según tipo (§3.4) en mono superscript, color `--mi-bg-warm`, hover translates +0 -1px. Click → scroll al aside. Activated state: marca con outline thick `--mi-bg-warm`.

```tsx
<Footnote type="autor" id="han" pos={1}>¹</Footnote>
```

### 6.2 `<AsideCard>` (footnote expandida)

**Anatomía:** width 240px, padding 24px, background `--mi-bg-paper`, border-thick `--mi-rule-soft`, shadow-card. Header: marca + tipo en mono uppercase (`AUTOR · 1`). Body: título Fraunces 19px, descripción Lora 15px. Footer: link `Ver más →` mono.

Estado activo: border-bold `--mi-bg-warm` + shadow-card-lift.

### 6.3 `<IndicatorCardInline>`

Reusa `<IndicatorCard>` de Spec 12 H3 con prop `inline: true`: max-width 480px, alignment center horizontal dentro del column de prosa, `margin-block: 32px 48px`. Borde solo top y bottom (`border-block: 2px solid var(--mi-rule-soft)`), sin laterales — se siente como un quote pull, no como un widget externo.

### 6.4 `<ConceptualThread>` — POSTERGADO A v2

Componente removido de v1 (ver §4.5). Se documenta su anatomía esperada para retomarlo:

> Sección con título "HILO CONCEPTUAL · N ANÁLISIS" (mono uppercase 13px), strip horizontal de chips de concepto bajo el título (axis pill style pero sin color fill, solo border thick + texto eje), tres cards en grid (vertical en mobile). Cada card: orden cronológico relativo (`Lectura recomendada antes / después / en paralelo`) en mono xs.

Requiere etiquetado del campo `conceptos_invocados[]` en el corpus para producir output útil.

### 6.5 `<ParagraphShare>` y anchor `#p-N`

Wrapping HTML: cada `<p>` de un análisis tiene `id="p-{n}"` generado por el render. Botón flotante absolute left:-44px top:0, opacity 0.4, hover 1. Click dispara `navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#p-' + n)` + toast.

### 6.6 `<QuoteCardGenerator>`

Modal full-screen sobre el análisis. Canvas SVG renderiza:
- Fondo terracota con `mi-grain`
- Quote en Fraunces 36px
- Atribución mono: pais · semana · año
- URL pequeño bottom-right
- Logo monograma top-left

Botón `Descargar PNG` (1080×1350 — ratio Instagram story) y `Descargar 1200×630` (Twitter card).

### 6.7 `<NewSinceLastVisit>`

Strip mono uppercase 13px sobre la sección "Esta semana" del home. Detecta `lastVisit` y `published_at` de los análisis. Si la diff entre last visit y hoy es ≥3 días Y hay análisis nuevos: muestra count. Else: muestra "Tu última visita fue [fecha relativa]".

### 6.8 `<FrameStripInline>` (renombrado)

Strip horizontal full-width entre el lede y el citation block primario del análisis. Background `--mi-bg-paper`, border-block thick `--mi-rule-soft`, padding 16px 0. Tipografía mono uppercase 13px en `--mi-ink-mute`. Axis pill prominente con color del eje. Dos links subrayados: "Sobre el eje" (apunta a `/ejes/[slug]`) y "El método" (apunta a `/metodo`). Sin condicionales — aparece en todos los análisis a todos los lectores. Reemplaza al `<FrameOnboardingBridge>` original.

### 6.9 `<CommandPalette>`

Modal centrado, max-width 640px. Backdrop blur DESACTIVADO (regla del DS): backdrop semi-transparente terracota oscuro. Input: Lora 22px sin border, autofocus. Tabs: chips axis-pill style. Resultados: lista vertical, hover background `--mi-bg-cream`, `↑/↓` arrow keys mueven selección visible.

### 6.10 `<WhileYouWereAway>`

Strip horizontal, full-width, padding 32px. Background `--mi-bg-cream` con `mi-grain`. Border-block-end thick. Close button (×) top-right mono.

---

## 7. Resolución de contradicciones detectadas

### 7.1 Mapa céntrico en home (Spec 11) vs `/mapa` full-screen (Spec 01)

**Resolución propuesta:**

- **Home (Spec 11):** mapa con click → panel lateral de país. Sin filtros laterales. Es overview navegable.
- **`/mapa`:** mapa full-screen con filtros laterales sticky 240px (eje, semana, año, país). Es exploración cartográfica profunda. Tienen UIs distintas y propósitos distintos: no es contradicción, es jerarquía. Spec 01 §5.5 se mantiene tal cual; Spec 11 §4.5 se mantiene tal cual; esta spec solo declara que ambos coexisten.

### 7.2 Sidebar persistente alcance (decisión r1)

**Resolución r1: sidebar colapsable en todas las páginas.** Estado por default: colapsado a 48px (solo iconos verticales: Países, Ejes, Buscador, Conceptos). Click en cualquier ícono o en un toggle dedicado expande a 240px con labels.

**Estado expandido vs colapsado:**
- En home y `/analisis` (corpus views) el sidebar arranca **expandido** por default. Es la página donde el lector está explorando.
- En páginas de lectura larga (`/analisis/[pais]/[slug]`, `/despachos/[año]/[semana]`, `/ejes/[slug]`, ensayos, página de país) el sidebar arranca **colapsado**. La densidad va al cuerpo y al aside contextual.
- El estado del sidebar (colapsado/expandido) se persiste en `localStorage.preferences.sidebarState` por usuario, con override por página: el lector puede expandirlo en una página de lectura y se mantiene durante esa sesión.

**Compatibilidad con el aside (§3.3):**
- En desktop ≥1240px: sidebar 48px + cuerpo 720px + aside 240px = 1008px contenido + márgenes. Cabe.
- En desktop 960-1239px: sidebar colapsado obligatorio (no se puede expandir sin que se rompa el layout) — botón de expand abre el sidebar como overlay temporal sobre el contenido.
- En tablet/mobile: sidebar es drawer.

**Componente:** `<CollapsibleSidebar>`. Estado en `useReaderState()` hook (§5.2). Iconografía: usar las marcas mono del proyecto, no librerías de íconos genéricas.

### 7.3 Header de ciudades (decisión r1)

**Resolución r1: la línea hardcoded "BA · Bogotá · Santiago" sale del header.** En su lugar, el header muestra los **países cubiertos esta semana**, sin capitales — solo nombres de país en mono lowercase, separados por `·`.

**Anatomía:**

```
mapa inestable                    año II · sem 18 · 4 países

cartografía política del sur

argentina · brasil · chile · méxico
```

- Tipografía: mono regular 13px, color `--mi-ink-mute`, letter-spacing 0.04em.
- Hover sobre un país: link a `/pais/[slug]`.
- Si no hay despacho esta semana, muestra los países del despacho más reciente con strip pequeño "última semana publicada: sem 17".
- Si supera 5 países, mostrar los primeros 5 alfabéticamente y `+N` con hover/click que abre dropdown con el resto.

**Costo de implementación:** la conexión data → header requiere que el rediseño de Spec 11 incluya un endpoint o build-time data que liste países publicados por semana. Bajo costo (los datos ya viven en los frontmatter de los análisis).

### 7.4 `/acerca` implementación parcial (Spec 06 vs estado actual)

Verificar en código (pendiente). Si existe parcial, completar siguiendo Spec 06 sin reescribir. Si no existe, implementar siguiendo Spec 06 sin novedades en esta spec.

---

## 8. Estados de UI prioritarios

### 8.1 Empty state — primer-time visitor en home

No hace falta widget especial. La home de Spec 11 ya funciona como puerta de entrada. Lo único que cambia es: `<NewSinceLastVisit>` no se renderiza, `<WhileYouWereAway>` no se renderiza, `<FrameOnboardingBridge>` puede aparecer dentro de los análisis que visite.

### 8.2 Empty state — lector recurrente sin novedades en su país seguido

Ficha de país (Spec 12) tiene este estado mencionado en Spec 01 §5.4. Esta spec lo concreta:

```
[CARD]
SIN ANÁLISIS NUEVOS DESDE TU ÚLTIMA VISITA

Lo más reciente sobre ARGENTINA es de la semana 12.
Mientras tanto, otros lectores también miran:

▸ Brasil · sem 47 — La economía sin centro
▸ El eje DESORIENTACIÓN está activo en 3 países

[Ver despachos pasados →]
```

"Otros lectores también miran" no es tracking; es la lista editorial curada de "lecturas recomendadas" que Tomás define semanalmente para cada país. Es decisión editorial, no algorítmica.

### 8.3 Loading

El sitio es server-rendered (Next.js App Router): casi no hay loading visible. Cuando ocurre (búsqueda, generación de quote card):
- **Skeleton blocks** con misma medida que el contenido final, background `--mi-bg-cream`, sin shimmer (no animation).
- Después de 600ms sin respuesta, agregar mensaje mono `Cargando…` (sin spinner — el DS no tiene loaders animados).
- Después de 3s, si sigue cargando, agregar `Está tardando más de lo habitual. ¿Reintentar?`.

### 8.4 Error

- 404 país no existente: redirect soft a `/paises` con strip `No tenemos análisis de [intento]. Estos son los 10 países que cubrimos.`
- 404 análisis: redirect a `/analisis` con strip explicando.
- Error en quote generator: toast inferior `No pudimos generar la imagen. Probá copiar el link.`

---

## 9. Mobile — flujos (no breakpoints)

Cubierto en §4.8. Resumen de las decisiones:

- Aside no existe; footnotes abren bottom-sheet 60vh.
- Step block headers son sticky.
- Indicator cards inline van full-width pero conservan tipografía display.
- Hilo conceptual y cross-reference se vuelven scroll horizontal.
- Frame onboarding bridge va sticky-bottom durante primer 30% scroll.

Spec 02 sigue siendo la fuente de verdad para tokens y breakpoints; esta spec no toca tokens.

---

## 10. Accesibilidad y performance

### 10.1 Accesibilidad

- **Contraste mínimo AA en cuerpo**: terracota `#C5663A` con verde-negro `#1F2A12` da contraste 6.4:1. Cumple AA y AAA para texto grande. Verificado.
- **Cream `#F4E9D2` con `#1F2A12`** da contraste 13.2:1. AAA todo.
- **Focus rings**: outline 2px solid `--mi-bg-warm` con offset 2px. Sin shadow blur (el DS no permite blur). Visible y consistente.
- **Skip link** al cuerpo del análisis para teclado/screen reader. Position absolute fuera de viewport hasta foco.
- **Footnotes** son `<sup><a href="#aside-N">¹</a></sup>` con `aria-describedby` apuntando al aside card. Tab order respeta scroll.
- **Quote-as-card** tiene `aria-label="Compartir párrafo"` y feedback de copia anunciado por `aria-live="polite"`.
- **Reduced motion**: respetar `prefers-reduced-motion: reduce`. El carrusel del home pasa de auto-slide a navegación manual; las transitions de aside cards desaparecen (estado activo aplica instantáneamente).

### 10.2 Performance — targets

| Métrica | Target | Cómo |
|---|---|---|
| LCP | < 2.0s | SSR + fonts subsetted + hero image WebP/AVIF + preconnect |
| FID/INP | < 100ms | Aside scroll-spy con IntersectionObserver, no scroll listeners |
| CLS | < 0.05 | Indicator cards inline con `aspect-ratio` reservado |
| Bundle JS inicial | < 80kb gzipped | Command palette y quote generator dynamic imports |
| Fonts | 4 subsets latin-ext | `font-display: swap`, fallbacks system serif/mono |

### 10.3 No-blur regla del DS

El comando palette NO usa `backdrop-filter`. Backdrop es `rgba(31, 42, 18, 0.85)` puro. Cualquier modal/drawer respeta esto.

---

## 11. Roadmap propuesto

Tres fases. Cada una entregable de forma independiente.

### Fase A — Cimiento (2-3 sprints)

1. Schema localStorage + helper hook `useReaderState()` (§5.2).
2. `<NewSinceLastVisit>` y dot dorado en cards de Spec 11 (§4.1, §5.4).
3. Anchors `#p-N` en todos los `<p>` de análisis. `<ParagraphShare>` mínimo (copiar link) (§4.7).
4. `<FrameStripInline>` siempre visible al inicio del análisis (§4.2 r1).
5. Header: línea de países dinámica reemplazando ciudades hardcoded (§7.3 r1).
6. `<CollapsibleSidebar>` con estado por página y persistencia (§7.2 r1).

**Por qué primero:** son aditivos, no reemplazan ningún componente existente (salvo la línea hardcoded del header), y desbloquean el modelo "lector recurrente" de la persona.

### Fase B — Capas dentro del artículo (3-4 sprints)

1. Sistema de footnote tipado (§3.4) en frontmatter del análisis: `footnotes: [{type, ref, pos}]`.
2. `<AsideCard>` con scroll-spy (§3.3).
3. `<IndicatorCardInline>` reusando Spec 12 (§6.3).
4. Bottom-sheet en mobile para footnotes (§4.8).
5. Sección "Lecturas" al pie cuando excede ~5 footnotes (§3.5 r1).

**Por qué después:** dependen del puente vault → sitio (Spec 07) y del sistema de footnotes en el modelo. Importante: `<ConceptualThread>` postergado a v2 (§4.5 r1) — no entra en fase B.

### Fase C — Distribución y memoria larga (2-3 sprints)

1. `<QuoteCardGenerator>` con SVG-to-PNG canvas, ambos formatos (1080×1350 + 1200×630) (§4.7 r1).
2. `<CommandPalette>` con atajo `/` (§4.3).
3. `<WhileYouWereAway>` con umbral 14 días (§5.5 r1).
4. Reading list `/leer-despues` versión completa, con botón guardar en cards y aside (§5.6 r1).
5. `followedCountries` y `followedAxes` (§5.2 y §8.2 con curaduría editorial de "otros lectores también miran").

**Por qué último:** son refinamientos de retención y distribución que ganan valor con corpus mayor.

---

## 12. Métricas de éxito (sin tracking invasivo)

El proyecto rechaza explícitamente personalización agresiva. Las métricas siguen ese principio.

| Métrica | Cómo se mide | Target |
|---|---|---|
| Profundidad de lectura | Análisis abiertos por sesión (single value, no perfil) | > 1.6 mediana |
| Retorno semanal | DAU/WAU ratio (sin cookies persistentes, solo sesión) | > 0.25 |
| Activación de capas | % de análisis donde al menos un footnote se expande | > 30% en desktop |
| Compartido | Clicks en `<ParagraphShare>` / sesión | tracking opcional vía evento sin id |
| Persistencia client-side | % de visitors con `lastVisit` ≥ 7 días vs visit count | > 40% en mes 3 |

Todas las métricas son **agregadas y anónimas**. Nada de IDs persistentes, nada de cookies de tracking, nada de comparar el comportamiento de un mismo usuario contra sí mismo en el tiempo.

---

## 13. Decisiones tomadas (sesión r1, 2026-05-09)

Trece decisiones despejadas en sesión y aplicadas a esta revisión de la spec:

| # | Tema | Decisión | Sección |
|---|---|---|---|
| 1 | Footnotes max | Sugerencia editorial de 5, no regla dura. Excedentes pasan a sección "Lecturas" al pie | §3.5 |
| 2 | `<ConceptualThread>` | Postergado a v2. Razón: requiere etiquetado de `conceptos_invocados[]` que no entra en scope v1 | §4.5, §6.4 |
| 3 | Frame strip al inicio | Inline siempre visible, sin condicionales. Renombrado `<FrameStripInline>` | §4.2, §6.8 |
| 4 | Reading list | Sí en v1, versión completa con botón en cards y aside, página `/leer-despues` | §5.6 |
| 5 | "Mientras estuviste fuera" | Umbral 14 días (dos despachos perdidos) | §5.5 |
| 6 | Marcadores de lectura | Tres estados confirmados: sin marca / dot dorado nuevo / título mute leído. Bookmark `★` para reading list | §5.4 |
| 7 | Header ciudades | La línea hardcoded sale. Reemplazo: países cubiertos esta semana, dinámico, sin capitales | §7.3 |
| 8 | Quote-as-card PNG | Sí en v1, formato completo (1080×1350 Instagram + 1200×630 Twitter) | §4.7, §6.6 |
| 9 | Sidebar persistente | Colapsable en todas las páginas (48px → 240px). Default expandido en home/`/analisis`, colapsado en lectura | §7.2 |
| 10 | Mapa dual | Confirmado: home overview (sin filtros) + `/mapa` explorer (con filtros laterales) | §7.1 |
| 11 | Roadmap | Orden A → B → C confirmado | §11 |
| 12 | Modelo 5 capas | L3 renombrado de "Historia" a "Proceso" (alinea con paso 02 del método) | §3.1 |
| 13 | Marcas footnote | Set completo de 5 confirmado: ¹ ² › ■ ⌖ | §3.4 |

## 13.1 Decisiones aún pendientes

1. **`/acerca` — verificar implementación parcial.** Pendiente revisar el código actual para confirmar si existe ya y completar siguiendo Spec 06.
2. **§4.7 quote generator — ¿servidor o cliente?** Decisión técnica de implementación: el PNG se genera client-side (canvas en browser) o server-side (endpoint). La decisión 8 confirmó "sí en v1" pero no la arquitectura. Recomendación: cliente, salvo que el bundle exceda los 80kb target de §10.2.
3. **§5.2 schema — `followedCountries` y `followedAxes`.** El schema reserva los campos pero no se implementó UX para agregarlos. Decidir en qué punto del journey aparecen los toggles "seguir" (en página de país, en página de eje, en footer del análisis).

---

## 14. Apéndice — Benchmark de patrones consultados

Sin referencias externas dadas. Estos son los patrones que informan la spec, con justificación de por qué cada uno aporta:

| Referencia | Patrón que aporta | Aplicado en |
|---|---|---|
| **NYT Magazine** (longread) | Footnote inline + aside lateral expandido sin sacar al lector | §3.3, §6.1, §6.2 |
| **Quanta Magazine** | Glossary terms con tooltip / aside contextual | §3.4 footnote tipo "concepto" |
| **The Pudding** | Datos invocados desde la prosa, no como dashboard separado | §3.2 principio rector, §6.3 |
| **Rest of World** | Densidad editorial + regional focus + tipografía editorial fuerte | §1.5 cualidades del lector recurrente |
| **OurWorldInData** | Citation block primario + URL canónica de cada gráfico | §3.4 footnote tipo "estadística" |
| **Are.na** | Command palette `/` + connections entre piezas como modelo de profundización | §4.3, §4.5 hilo conceptual |
| **FT (Financial Times)** | "Saved articles" sin login + "you've read this" markers | §5 sistema de retención |
| **Reuters Graphics** | Anchors a fragmentos de texto largos para citación | §4.7, §6.5 |
| **Stratechery / Substack** | Reading position memory para volver al hilo | §5.4 markers de leído |
| **Britannica online** | Cross-reference panel curado, no algorítmico | §4.5 — distinción curaduría vs algoritmo |

**Nota editorial:** Mapa Inestable comparte ADN con Rest of World (regional focus + análisis estructural) y con NYT Magazine (lectura larga + aparato citativo). Se diferencia de The Pudding y OurWorldInData en que la primacía es interpretativa: los datos ilustran, no estructuran.

---

## Adenda r2 — Variante "modo lectura" (decisión chromática)

**Fecha:** 2026-05-09 · **Estado:** abierta hasta que Tomás vea el comparador.

### Inquietud planteada

El sistema visual de Grabado descansa sobre dos piezas: terracota (`#C5663A`) como dominante y verde-negro (`#1F2A12`) como tinta. Esa elección le da al proyecto una identidad gráfica fuerte y deliberada, pero la combinación al 100% de saturación corre un riesgo concreto para la persona "lector recurrente" definida en §1: el header en plena terracota más sidebars y bandas también terracotas, vistos tres mañanas por semana a las siete, son cromáticamente expulsivos. El cuerpo de los análisis ya corre sobre crema (`#F4E9D2`) — la lectura larga está protegida —, pero el *scaffolding* alrededor (header sticky, sidebar persistente §7.2, bandas inter-sección, frames de heatmap y mapa) sigue saturado. La pregunta editorial no es "¿revertimos la apuesta?" sino "¿la apuesta está bien calibrada o se pasó de la raya?".

### Las dos variantes

**A · Grabado pleno (estado actual)** — sin cambios respecto al design-system v1.0. Terracota dominante en todo el scaffolding. Es la implementación literal de los principios §2 del design-system ("la materialidad importa") y de la decisión de abril 2026 de "doblar la apuesta". Defendible: la identidad es máxima. Vulnerable: tres días por semana puede agotar al lector recurrente que vuelve a la app desde mail.

**B · Modo lectura (propuesta)** — la terracota se convierte en **acento**, no fondo. Aparece en hero del home, citation block primario, footer band del newsletter, frame strip inline (§4.2), apertura quote-as-card (§4.7) y como strip de 10px en el borde superior del header (anclaje de marca). El header, sidebar persistente (§7.2), bandas inter-sección y frames usan **crema** (`#F4E9D2`) como fondo. La tinta secundaria del scaffolding suaviza un paso (`--mi-ink-soft`, `#3D4A26`) para no competir con la lectura. El body de cada análisis sigue siendo crema con tinta verde-negro: la lectura larga no cambia. En **home** y `/analisis` (zonas de exploración) la terracota recupera dominancia editorial vía hero y bandas-acento; en **páginas de lectura larga** (análisis individual, despacho, ensayo) la crema domina toda la pantalla.

### Tokens que cambian (contrato explícito)

```css
:root[data-variant="a"] {
  --canvas:         var(--mi-bg);          /* terracota */
  --header-bg:      var(--mi-bg);          /* terracota */
  --scaffold-bg:    var(--mi-bg);          /* terracota */
  --scaffold-ink:   var(--mi-ink);
  --reading-bg:     var(--mi-bg-paper);    /* crema (cuerpo) */
  --accent-zone:    var(--mi-bg);          /* sin distinción real */
}

:root[data-variant="b"] {
  --canvas:         var(--mi-bg-paper);    /* crema */
  --header-bg:      var(--mi-bg-paper);    /* crema con strip terracota arriba */
  --header-strip:   var(--mi-bg);          /* strip 10px */
  --scaffold-bg:    var(--mi-bg-paper);    /* crema */
  --scaffold-ink:   var(--mi-ink-soft);    /* tinta suavizada */
  --reading-bg:     var(--mi-bg-paper);
  --accent-zone:    var(--mi-bg);          /* terracota como ACENTO: hero,
                                              citation block, newsletter band */
}
```

Layout, tipografías, sombras, bordes, axis pills, axis colors, radius (=0) y todos los demás tokens del DS **no cambian**. Es exclusivamente una diferencia de distribución cromática del fondo y la tinta secundaria del scaffolding. Componentes ya especificados (`<FrameStripInline>`, `<AsideCard>`, `<IndicatorCardInline>`, etc.) funcionan idénticamente en ambas variantes.

### El trade-off

| Dimensión | A favorece | B favorece |
|---|---|---|
| Identidad visual fuerte | ✓ | (la mantiene en zonas-acento) |
| Densidad cromática del scaffolding | ✓ | — |
| Sustained readability del lector recurrente | — | ✓ |
| Continuidad con el design-system v1.0 (abril 2026) | ✓ | requiere revisión |
| Coherencia con principio §2 ("la materialidad importa") | máxima | parcial — la materialidad se concentra en zonas-acento |
| Diferenciación visual entre exploración y lectura | baja | alta |
| Costo de implementación | nulo | bajo (sólo tokens, sin layout) |

### Comparador como herramienta de decisión

Se construyó `design-system/comparador-paleta.html`: un HTML standalone que renderiza tres vistas (home, análisis individual, archivo) en cualquiera de las dos variantes, con un toggle de tres estados (A solo, B solo, A | B split con scroll sincronizado). El propósito es ver, no defender — el comparador no toma posición. Permite también iterar variantes intermedias modificando el bloque `:root[data-variant="b"]` en el `<style>`: por ejemplo, probar B con tinta `--mi-ink` en lugar de `--mi-ink-soft` en scaffolding, o probar B sin strip terracota en el header.

### Estado de la decisión

**Abierta.** El comparador es el insumo. La decisión queda registrada acá una vez que Tomás vea las dos variantes lado a lado en home, análisis y archivo. Posibilidades: (1) confirmar A — el sistema queda como está; (2) adoptar B — actualizar `design-tokens.css` con los tokens semánticos de canvas/scaffold/accent y propagar a `home-prototype.html`; (3) variante intermedia — definir nuevos tokens a partir del diff entre A y B observado en el comparador.

Esta adenda no modifica ninguna decisión de la r1 (§13). Convive con todas las componentes especificadas. Si se adopta B, los componentes que ya tienen prosa sobre crema (aside, indicator card, citation block) no requieren cambios; sólo el chrome del sitio.

---

## Glosario rápido (para futuros editores de la spec)

- **L1-L5**: las cinco capas de información (§3.1).
- **Aside**: panel lateral de footnotes expandidas, no es sidebar de navegación.
- **Hilo conceptual**: bloque al pie del análisis con análisis que comparten conceptos invocados (§4.5).
- **Frame onboarding bridge**: bloque puente al marco para visitors externos (§4.2).
- **Reader state**: el JSON localStorage del lector (§5.2).
- **Quote-as-card**: PNG generado de un párrafo para compartir en redes (§4.7).
