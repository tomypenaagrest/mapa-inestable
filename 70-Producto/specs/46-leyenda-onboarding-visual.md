---
spec: 46
titulo: Sistema de leyenda y onboarding visual — presentar la metáfora climática sin esconder los trucos del mago
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-21
revision: 2026-05-21 (r1) — primera escritura. Foco: onboarding como eje central + leyenda r2 con refinamientos didácticos. Hereda contrato Layer (Spec 39), patrón A.4 tooltip+drawer (Spec 42), sistema de glyphs en 3 ejes compositivos (Specs 42-44). 1 decisión visual abierta para sesión de Product Design separada (Anexo A)
epic: 03
afecta:
  - platform/frontend/src/components/LayerLegend.tsx (extender — refinamientos r2: badge de calidad, microcopy didáctico, accordion "cómo se lee")
  - platform/frontend/src/components/MapaExplorer.tsx (integrar el onboarding overlay en el flujo de entrada a /mapa)
  - platform/frontend/src/components/LayerOnboarding.tsx (NUEVO — overlay de bienvenida + tour por hitos)
  - platform/frontend/src/components/LayerGlossaryChip.tsx (NUEVO — chip flotante con el glosario climático ↔ político, persistente discreto)
  - platform/frontend/src/lib/onboarding-state.ts (NUEVO — persistencia local del estado "ya viste el onboarding")
  - platform/frontend/src/styles/onboarding.css (NUEVO — tokens y animaciones del overlay)
  - 70-Producto/lecturas-capas/_onboarding.md (NUEVO — contenido editorial del overlay y del glosario, vault)
  - 70-Producto/design-system/mapa/onboarding-mockups/ (NUEVO — directorio para mockups del Anexo A)
depende_de: [39, 42]
depende_blanda_de: [43, 44]
relaciona_con:
  - EPIC-03 (esta spec materializa el principio editorial "no esconder los trucos del mago" en el primer contacto del lector; el otro brazo es Spec 39B con la página dedicada profunda)
  - Spec 39 (LayerController + LayerLegend + LayerTimeSlider — esta spec extiende la leyenda y agrega una superficie nueva de bienvenida)
  - Spec 39B (página dedicada de documentación por capa — pareja conceptual: onboarding presenta, 39B documenta)
  - Spec 42 (precipitación — primera capa que valida el patrón A.4 que este onboarding referencia)
  - Spec 33 (panel lateral del home — modelo para el patrón "drawer derecho con contenido editorial" que el overlay reusa)
desbloquea:
  - Spec 47 (tooltip + interacción multi-capa) — comparte el glosario y los microcopy didácticos
  - Spec 39B — el contenido de onboarding del Anexo A es el insumo conceptual del que se nutre la página dedicada
prioridad: media
---

# 46 · Sistema de leyenda y onboarding visual

## Resumen ejecutivo

EPIC 03 superpone cuatro capas analíticas (precipitación, temperatura, viento, presión) sobre un mapa que el lector ya entendía como **navegacional** (Spec 22, Spec 33). El cambio de gramática es grande: el mismo objeto deja de ser un índice de análisis editoriales y pasa a ser una superficie de lectura cuantitativa. Sin una mediación visual, un lector que entra a `/mapa` por primera vez se encuentra con una paleta de buckets, un time slider y un glosario climático sin contexto. La leyenda flotante (Spec 39 §6) le dice **qué muestra** la capa activa, pero no le dice **por qué hay capas**, **cómo se leen las cuatro juntas**, ni **qué hace la metáfora climática dentro del marco editorial del proyecto**.

Esta spec resuelve ese hueco. Diseña dos piezas complementarias:

1. **Un overlay de onboarding** que aparece la primera vez que un visitante entra a `/mapa` y le presenta — en tres pantallas cortas — la metáfora climática, las cuatro capas y el modelo de tiempo. Tras esa primera vez, el overlay no vuelve a aparecer, pero queda accesible desde un botón discreto en la leyenda (`[ⓘ Cómo se lee este mapa]`).
2. **Refinamientos r2 a la leyenda flotante** ya existente (Spec 39 §6): un badge de calidad/staleness más legible, microcopy didáctico que recuerda qué codifica el color, un accordion "Cómo se lee" expandible inline, y un chip persistente con el glosario climático ↔ político.

**Principio editorial central — "no esconder los trucos del mago".** Tomás fijó este principio en Spec 39 r2 como justificación de Spec 39B (página dedicada profunda). Esta spec lo materializa en el otro extremo del recorrido del lector: el primer contacto. El proyecto se posiciona contra la desorientación epistemológica como eje analítico; eso impone una obligación interna de explicar cómo se lee lo que se muestra **antes** de mostrarlo, no después.

**Reframe respecto a las opciones consideradas.** La conversación de Cowork del 2026-05-21 cerró tres alternativas (onboarding-céntrico, rediseño de leyenda, solo onboarding). Se eligió la primera por dos razones: (a) la leyenda actual de Spec 39 funciona en producción, no hay deuda visible que justifique un rediseño completo; (b) el hueco real es la entrada del lector — sin una mediación explícita, las capas se leen como adorno de mapa de Windy, no como herramienta analítica con marco propio.

**Lo que entra en r1:**

- Overlay de onboarding `<LayerOnboarding>` con tres pantallas (bienvenida, las cuatro capas, modelo de tiempo) + un cuarto "panel" de despedida con CTA "Empezar a explorar". Patrón "carousel guiado", no tour modal contextual sobre el mapa.
- Estado de onboarding persistido en `localStorage` (clave `mi.onboarding.v1.seen`). Tras la primera vista marcado como visto.
- Punto de re-entrada: botón `[ⓘ Cómo se lee este mapa]` en el header de la leyenda flotante. Click reabre el overlay desde el inicio.
- Chip flotante persistente `<LayerGlossaryChip>` en la esquina inferior izquierda del mapa, colapsado por default, que al expandir muestra el glosario climático ↔ político (lluvia = PBI, etc.). Se cierra con click fuera.
- Refinamientos r2 de la leyenda (Spec 39 §6):
  - Badge de calidad/staleness rediseñado: tres estados visibles — `dato oficial` (sin badge), `estimado` (badge ámbar discreto), `congelado` (badge ámbar + texto "última actualización: [fecha]").
  - Microcopy didáctico debajo de la escala: una línea de 1-2 ideas que recuerda qué codifica el color y qué codifica la posición (e.g. "El color codifica magnitud · la dirección crecimiento/recesión aparece en el tooltip y acá abajo"). Coherente con la decisión B.4 de Spec 42.
  - Accordion expandible `[▼ Cómo se lee esta capa]` que despliega 2-4 oraciones de contexto editorial inline, sin abrir el reading drawer. El drawer sigue siendo la lectura larga; el accordion es el atajo intermedio.
- Contenido editorial del overlay y del glosario en `70-Producto/lecturas-capas/_onboarding.md` (vault, no código). Mismo patrón que las reading guides por capa (Spec 39 §7).
- Accesibilidad: respeto a `prefers-reduced-motion`, navegación por teclado (←/→/Esc), trampa de foco dentro del overlay.

**Lo que NO entra en r1:**

- Rediseño completo de la leyenda flotante de Spec 39. Se respeta layout y posición (esquina superior derecha).
- Tour contextual modal sobre el mapa (popovers numerados que apuntan a cada control). Considerado y descartado: el patrón "guided carousel" es menos intrusivo y respeta mejor la dirección estética Grabado.
- Versión avanzada del glosario con expansión por término (clickear "lluvia" → mini-pop con definición). Si en producción aparece como demanda, va en r3.
- Reactivación condicional del overlay tras cambios mayores (e.g. una capa nueva → ofrecer ver onboarding actualizado). Considerado para r3.
- Onboarding para Spec 47 (tooltip multi-capa). Spec 47 hereda la infraestructura de esta spec si la necesita pero diseña su propio momento didáctico.
- Onboarding del corpus editorial (hot-zones, panel lateral, paneo por país). Esos se enseñan implícitamente — el corpus es la lectura por default del lector que ya conocía el sitio.

---

## Estado actual

### Lo que ya existe

- **`<LayerLegend>`** (Spec 39 §6, implementado en frontend): vive flotante en esquina superior derecha del área del mapa, colapsable, muestra glyph + label + unidad + período + escala de buckets + fuente + dos links (`[ⓘ Leer guía de lectura]` que abre el reading drawer largo + `[↗ Documentación completa]` que apunta a `/mapa/capas/<id>`).
- **`<LayerReadingDrawer>`** (Spec 39 §7, implementado): drawer derecho on-demand que renderiza el `.md` de `70-Producto/lecturas-capas/<readingGuideSlug>.md` como full markdown.
- **`<LayerController>`** (Spec 39 §4): rail izquierdo con toggle de capas + filtros país/eje.
- **Sistema de glyphs en 3 ejes compositivos** (Specs 42-44 r2): nube + gotas (precipitación), termómetro + marcas (temperatura), onda + punta (viento), y un vocabulario reservado para Spec 45 (presión). Documentado en `70-Producto/design-system/mapa/glyphs/README.md`.
- **`localStorage` en el frontend**: el sitio ya usa `localStorage` para persistir filtros del archivo (Spec 5). Patrón conocido, sin librerías nuevas.

### Lo que NO existe todavía

- Ningún mecanismo de primera-visita / onboarding en el sitio. Quien entra hoy a `/mapa` se encuentra con la leyenda y los controles directamente, sin mediación introductoria.
- El glosario climático ↔ político está enunciado conceptualmente en el doc maestro del epic, en los reading guides por capa, y en piezas editoriales del Substack, pero nunca aparece como pieza visual del propio sitio.
- La leyenda actual no muestra microcopy didáctico — la decisión B.4 de Spec 42 ("dirección solo en leyenda y tooltip") se materializa hoy con un bloque "Dirección" en la leyenda pero sin nota que explique por qué el color codifica solo magnitud. Un lector nuevo puede leerlo como bug visual.
- No hay distinción visual fuerte para `quality: "estimado"` vs `"congelado"` — el contrato de Spec 39 deja `qualityFlagColor` con stripes pero no hay un badge explícito.

### Lo que esta spec habilita

- Que un lector que entra por primera vez entienda **por qué hay capas** antes de tocar nada.
- Que el principio "no esconder los trucos del mago" (Spec 39 r2) tenga superficie visible en el primer momento de contacto, no solo en una página profunda separada.
- Que la leyenda funcione como pieza didáctica en cada uso, no solo como referencia técnica.
- Que el glosario climático ↔ político tenga una superficie persistente discreta, accesible sin abrir overlay ni drawer.

---

## Propuesta

### 1. El overlay de onboarding `<LayerOnboarding>`

**Patrón elegido: guided carousel modal, no tour contextual.** Tres pantallas más una de despedida, presentadas como carousel horizontal con dots de progreso. El lector navega con ← / → o con dos botones grandes. Tiene siempre disponible `[Saltar onboarding]` arriba a la derecha.

**Por qué carousel y no tour contextual con popovers numerados sobre el mapa:**

- El tour contextual (estilo Shepherd.js / Intro.js) apunta flechas a controles del mapa con popovers. Funciona bien en apps utilitarias (dashboards, CMS) pero rompe con la dirección estética Grabado: cuadros con flechas amarillas sobre el dibujo de Torres García competirían visualmente con las cruces de las capitales y con el panel lateral.
- El carousel modal cubre el mapa con un overlay editorial — bloque de texto + glyph + ejemplo visual estilizado — y libera al lector cuando está listo. Es más cercano al ritmo de lectura del Substack que a la UX de un producto SaaS.
- El tour contextual obliga a estar en `/mapa` para verlo. El carousel funciona también si el lector llega desde un link compartido con `?capa=precipitacion&t=2024-Q4` — el overlay aparece encima, contexto preservado.

**Estructura de las cuatro pantallas:**

```
┌─ Pantalla 1 · Bienvenida ─────────────────────────────────────┐
│                                                                │
│           [glyph compuesto: 4 glyphs encadenados,              │
│            horizontal, en trazo manuscrito Grabado]            │
│                                                                │
│         El mapa de Sudamérica como sistema climático           │
│                                                                │
│   Cada país de la región tiene un clima político-económico     │
│   propio. Esta sección del proyecto lo muestra como cuatro     │
│   capas: precipitación, temperatura, viento y presión.         │
│                                                                │
│   No es una metáfora decorativa. Cada capa es un dato real     │
│   con fuente, período y método trazables.                      │
│                                                                │
│                                       [● ○ ○ ○]                │
│                            [Saltar]   [Siguiente →]            │
└────────────────────────────────────────────────────────────────┘

┌─ Pantalla 2 · Las cuatro capas ───────────────────────────────┐
│                                                                │
│                    Cuatro lecturas sobre el mismo mapa         │
│                                                                │
│   [glyph nube]       PRECIPITACIÓN                             │
│                      Crecimiento económico (PBI)               │
│                      ── Cuándo llueve fuerte, hay expansión    │
│                                                                │
│   [glyph termómetro] TEMPERATURA                               │
│                      Condiciones materiales (salario real)     │
│                      ── Sube el termómetro, sube el bienestar  │
│                                                                │
│   [glyph onda+punta] VIENTO                                    │
│                      Orientación política (pro-mercado/estado) │
│                      ── Sopla a un lado o al otro              │
│                                                                │
│   [glyph reservado]  PRESIÓN                                   │
│                      Densidad institucional (Latinobarómetro)  │
│                      ── Cuando baja, las mediaciones se aflojan│
│                                                                │
│   Se activa una a la vez. El color del país cambia según el   │
│   valor del indicador principal de la capa.                    │
│                                                                │
│                                       [○ ● ○ ○]                │
│                            [← Atrás]  [Siguiente →]            │
└────────────────────────────────────────────────────────────────┘

┌─ Pantalla 3 · El tiempo no se mide igual en cada capa ────────┐
│                                                                │
│   Cada capa tiene su propia cadencia:                          │
│                                                                │
│       Viento ────────── semanal                                │
│       Temperatura ────── trimestral                            │
│       Precipitación ──── trimestral                            │
│       Presión ────────── anual                                 │
│                                                                │
│   El slider abajo del mapa elige una fecha. Cada capa muestra  │
│   su última lectura disponible hasta esa fecha.                │
│                                                                │
│   Esto significa: si arrastrás a la semana 12 de 2025, viento  │
│   te muestra esa semana, pero presión te muestra 2024 — el     │
│   dato anual más cercano hacia atrás.                          │
│                                                                │
│   La leyenda lo dice siempre explícito.                        │
│                                                                │
│                                       [○ ○ ● ○]                │
│                            [← Atrás]  [Siguiente →]            │
└────────────────────────────────────────────────────────────────┘

┌─ Pantalla 4 · Despedida ──────────────────────────────────────┐
│                                                                │
│              No es un panel de control. Es un mapa             │
│              que cambia mientras la región cambia.             │
│                                                                │
│   • Cada capa tiene fuente, método y limitaciones documentadas │
│   • Click en cualquier país abre la lectura editorial          │
│   • [ⓘ Cómo se lee este mapa] vuelve a este onboarding         │
│                                                                │
│                                                                │
│                                       [○ ○ ○ ●]                │
│                            [← Atrás]  [Empezar a explorar →]   │
└────────────────────────────────────────────────────────────────┘
```

**Trigger del overlay:**

1. **Primera visita** a `/mapa`. Detectado por ausencia de la clave `mi.onboarding.v1.seen` en `localStorage`. El overlay aparece tras 400ms de mount (no inmediatamente — da tiempo al lector a registrar visualmente la página antes de cubrirla).
2. **Re-apertura manual** desde el botón `[ⓘ Cómo se lee este mapa]` en el header de la leyenda. En este caso el overlay arranca siempre en pantalla 1.
3. **Trigger por query param** `?onboarding=1`. Útil para compartir links del estilo "mirá esto" → recipient ve el onboarding antes de explorar. No-op si la pantalla está abierta.

**Cierre del overlay:**

- Click en `[Empezar a explorar →]` en pantalla 4.
- Click en `[Saltar]` en cualquier pantalla.
- Tecla `Esc`.
- Click fuera del modal (en el overlay oscuro circundante).

En todos los casos, la clave `mi.onboarding.v1.seen` se setea con valor `{ version: "v1", seenAt: "<ISO>" }`. El versioning permite resetear el flag cuando el onboarding cambie sustantivamente (e.g. r2 con la capa de Spec 45 incorporada).

**Lo que el carousel NO hace:**

- No fuerza una secuencia obligatoria — `[Saltar]` y `Esc` están siempre.
- No oscurece controles del mapa con flechas. El mapa está cubierto por el overlay; el modelo es lectura, no aprendizaje guiado por tarea.
- No requiere internet adicional. Todo el contenido es estático y servido desde el `.md` del vault.
- No abre cuentas, ni pide email, ni guarda preferencias del lector.

### 2. Contenido editorial del overlay — `_onboarding.md`

Patrón idéntico a las reading guides por capa (Spec 39 §7). Vive en `70-Producto/lecturas-capas/_onboarding.md` (el guión bajo prefija para distinguir del resto, que son por capa).

Estructura:

```markdown
---
slug: _onboarding
titulo: "Cómo se lee este mapa"
version: v1
ultimo_cambio: 2026-05-XX
---

# Pantalla 1 · Bienvenida

[1-2 párrafos: por qué un mapa climático para política y economía]

# Pantalla 2 · Las cuatro capas

[4 bloques: una capa por bloque, con glyph + nombre + indicador + frase apoyo]

# Pantalla 3 · Modelo de tiempo

[1-2 párrafos: cadencias por capa + cómo se lee el slider]

# Pantalla 4 · Despedida

[1 párrafo de cierre + 3 bullets con dónde seguir explorando]

# Glosario climático ↔ político

[Tabla 2 columnas: término climático, qué representa políticamente.
Se renderiza también en el `<LayerGlossaryChip>` § 4.]
```

El componente `<LayerOnboarding>` parsea el `.md` por sus headers H1 (`# Pantalla N · ...`) y asigna cada bloque a su pantalla correspondiente. Si en r2 se agrega una pantalla, se agrega un header H1 nuevo + el componente lo recoge sin cambio de código.

El glosario vive en la **misma file** que el overlay porque ambos son material de "presentación introductoria del sistema" y conviene que evolucionen juntos.

### 3. El chip persistente `<LayerGlossaryChip>`

Vive flotante en la **esquina inferior izquierda** del área del mapa, colapsado por default a un chip mínimo:

```
┌─ chip colapsado ─────────────┐
│ [ⓘ] Glosario · clima/política │
└──────────────────────────────┘
```

Click expande a un panel pequeño con la tabla del glosario:

```
┌─ panel expandido ────────────────────────────┐
│ Glosario climático ↔ político          [×]   │
│                                              │
│  Precipitación  ──  Crecimiento del PBI      │
│  Temperatura    ──  Condiciones materiales   │
│  Viento         ──  Orientación pro-merc/est │
│  Presión        ──  Densidad institucional   │
│  Bucket         ──  Rango discreto de un dato│
│  Dato congelado ──  Última lectura disponible│
│                     antes de que la fuente   │
│                     dejara de actualizar     │
│                                              │
│  [Ver onboarding completo →]                 │
│                                              │
└──────────────────────────────────────────────┘
```

**Comportamiento:**

- El chip aparece en `/mapa` siempre, esté o no haya capa activa. Es metainformación del sistema, no de la capa.
- En desktop ≥1240px, el chip vive abajo a la izquierda (Spec 39 deja ese cuadrante libre — el rail izquierdo de controles ocupa columna propia, no flota sobre el mapa).
- En tablet 768-1239px, el chip se mantiene abajo a la izquierda del área de mapa.
- En mobile ≤767px, el chip se mueve a la franja del LayerLegend (que en mobile pasa a ser franja debajo del time slider, Spec 39 §6). Se renderiza como un link compacto dentro de esa franja.
- Click fuera del panel expandido lo colapsa.
- Tecla `Esc` lo colapsa si está expandido.
- El link `[Ver onboarding completo →]` reabre el overlay desde pantalla 1.

**Por qué esquina inferior izquierda y no inferior derecha o footer:**

- Inferior derecha competiría con el `<LayerReadingDrawer>` cuando está abierto (Spec 39 §7).
- Footer del mapa estaría debajo del time slider (Spec 39 §5) y se vería como pie de página, perdiendo discoverability.
- Inferior izquierda está libre en los tres breakpoints definidos por Spec 39 y conserva la coherencia con la regla "controles arriba/izquierda, lectura derecha".

### 4. Refinamientos r2 a `<LayerLegend>`

La leyenda actual cumple su función operativa (Spec 39 §6) pero le faltan tres piezas que esta spec agrega:

#### 4.1 Badge de calidad rediseñado

Hoy el contrato `LayerQuality` admite `"oficial" | "estimado" | "congelado"` y Spec 39 §6 lo materializa con stripes diagonales sobre el bucket. Esta spec agrega un badge explícito en el header de la leyenda:

```
┌─ leyenda (header rediseñado) ─────────────┐
│ [glyph] Precipitación · % del PBI         │
│ Q4 2024 · semana 20 · 2026                │
│ ⚑ Dato congelado · sin actualización desde│  ← badge nuevo
│   octubre 2024 (fuente: World Bank)       │
│                                            │
│ ▓▓▓ < -1%   recesión                      │
│ ░░░ -1 a 1% estancamiento                 │
│ ...                                        │
└────────────────────────────────────────────┘
```

**Reglas del badge:**

- Si `quality === "oficial"` (estado por default, dato fresco): **no se renderiza badge**. La ausencia es el caso normal.
- Si `quality === "estimado"`: badge `⚑ Dato estimado` en ámbar discreto, sin más texto. Tooltip al hover: "El pipeline usó interpolación o estimación porque la fuente no publicó este período aún."
- Si `quality === "congelado"`: badge `⚑ Dato congelado` en ámbar más saturado + texto "sin actualización desde [mes año] (fuente: [nombre])". Se renderiza siempre que el último dato disponible esté >2 cadencias del slider hacia atrás. Ejemplo: capa anual con slider en 2026 y último dato 2023 → 3 años de gap, se renderiza el badge.

Los stripes diagonales sobre el bucket de Spec 39 §6 se mantienen como mecanismo visual sobre el mapa — el badge es el equivalente textual en la leyenda. Refuerzo, no reemplazo.

#### 4.2 Microcopy didáctico debajo de la escala

Una línea — máximo dos — que aclare qué codifica el color de la escala. Necesario porque la decisión B.4 de Spec 42/43 hace que el color **no** codifique dirección, solo magnitud. Sin esta línea, un lector nuevo puede interpretar el color como "estado del país" y leer un rojo intenso como "país en problemas" — lo que sería literal para temperatura baja pero falso para precipitación recesiva.

Ejemplos por capa:

```
Precipitación → "El color codifica magnitud · la dirección crecimiento/recesión aparece en el tooltip y en la línea de abajo."

Temperatura   → "El color codifica magnitud · variación interanual del salario real."

Viento        → "El color codifica magnitud · el glyph sobre cada país codifica dirección
                 (pro-mercado ↔ pro-estado)."

Presión       → "El color codifica el nivel del índice agregado de confianza institucional."
```

El texto del microcopy vive en `lib/layers/<id>.ts` como un campo nuevo del contrato (ver §6) — propiedad de la capa, no del componente. Cada Spec 42-45 lo aporta en su implementación.

#### 4.3 Accordion `[▼ Cómo se lee esta capa]`

Bloque colapsable en la leyenda, debajo del microcopy. Click expande dos a cuatro oraciones de contexto editorial inline (sin abrir el reading drawer).

```
┌─ leyenda ───────────────────────────────┐
│ ... (badge + escala + microcopy)        │
│                                          │
│ [▼ Cómo se lee esta capa]               │
│                                          │
│ ┌─ expandido ──────────────────────────┐│
│ │ El crecimiento del PBI es la         ││
│ │ precipitación: lluvia abundante      ││
│ │ corresponde a expansión, sequía a    ││
│ │ recesión. La metáfora describe el    ││
│ │ sistema sin asignarle valor moral.   ││
│ │                                       ││
│ │ [Leer guía completa →] [Documentación │
│ │  profunda ↗]                          ││
│ └──────────────────────────────────────┘│
│                                          │
│ Fuente: World Bank · pulled 2026-05-10  │
│ [ⓘ Cómo se lee este mapa]               │  ← reabre onboarding
└──────────────────────────────────────────┘
```

**Contenido:** 2-4 oraciones, autoral, que adelantan el reading guide largo. Vive en el frontmatter del `.md` del reading guide de cada capa como campo `short_intro:` (string). Esta spec define el campo; cada Spec 42-45 lo aporta cuando le toque.

**Comportamiento:** colapsa/expande con animación 200ms. Persistencia opcional en `localStorage` si en producción aparece como demanda (no en r1).

**Diferencia con los dos links existentes (Spec 39 §6):**

- `[ⓘ Leer guía completa →]` (existente, ahora dentro del accordion) → abre `<LayerReadingDrawer>` con full markdown.
- `[↗ Documentación profunda]` (existente, ahora dentro del accordion) → navega a `/mapa/capas/<id>` (Spec 39B).
- `[▼ Cómo se lee esta capa]` (nuevo, exterior al accordion) → expande inline las 2-4 oraciones.

Los tres conviven: el accordion es el atajo intermedio, el drawer es la lectura larga, la página dedicada es la documentación técnica.

#### 4.4 Botón `[ⓘ Cómo se lee este mapa]`

Botón discreto al pie de la leyenda flotante. Click reabre `<LayerOnboarding>` desde pantalla 1. Es el único punto de re-entrada del onboarding desde el sitio.

### 5. Persistencia de estado en `lib/onboarding-state.ts`

Modulo dedicado para evitar dispersar `localStorage.getItem("mi.onboarding…")` por la codebase:

```ts
// platform/frontend/src/lib/onboarding-state.ts

const KEY = "mi.onboarding.v1.seen";

export interface OnboardingState {
  version: "v1";
  seenAt: string; // ISO datetime
}

export function hasSeenOnboarding(): boolean {
  if (typeof window === "undefined") return true; // SSR-safe
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as OnboardingState;
    return parsed.version === "v1";
  } catch {
    return false;
  }
}

export function markOnboardingSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ version: "v1", seenAt: new Date().toISOString() } satisfies OnboardingState),
    );
  } catch {
    // localStorage puede estar deshabilitado (modo incógnito estricto). Se ignora silencioso.
  }
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
```

Notas:

- **SSR-safe.** `typeof window === "undefined"` en el primer return preserva el render server-side de Next.js. En SSR, `hasSeenOnboarding()` retorna `true` (no se muestra overlay en el primer paint, evita flash). El componente cliente revisa al mount y abre overlay si corresponde.
- **Modo incógnito estricto** (Safari): `localStorage` puede fallar al write. El catch silencioso evita crash; el costo es que el overlay aparece cada visita en ese modo — aceptable.
- **`resetOnboarding`** se expone para uso en consola o un eventual flag de admin; no se expone en UI.

### 6. Extensión al contrato `Layer` (Spec 39)

Dos campos nuevos opcionales, agregados al `interface Layer` de `lib/layers.ts`:

```ts
export interface Layer {
  // ... (campos existentes de Spec 39)

  /**
   * Microcopy de una línea (máximo dos) que se renderiza debajo de la escala
   * en `<LayerLegend>`. Aclara qué codifica el color y qué codifica otros mecanismos.
   * Requisito de Spec 46 § 4.2.
   */
  legendMicrocopy: string;

  /**
   * Intro corta editorial (2-4 oraciones) que se renderiza dentro del accordion
   * "Cómo se lee esta capa" de `<LayerLegend>`. Requisito de Spec 46 § 4.3.
   */
  shortIntro: string;
}
```

**Cobertura del cambio:**

- Spec 39 declara el contrato. Esta spec lo extiende con dos campos.
- Specs 42-45 implementan los nuevos campos en sus respectivas `precipitacionLayer`, `temperaturaLayer`, etc. **Esta spec NO escribe el contenido de los 4 microcopy ni los 4 shortIntro** — cada capa los aporta como parte de su contenido editorial.
- En la implementación inicial (cuando Spec 46 entra en VS Code antes que las capas reales), los stubs pueden devolver strings vacíos. La leyenda renderiza sin microcopy ni accordion en ese caso (degradación silenciosa).

### 7. Anexo A · decisión visual pendiente

El layout funcional del overlay queda cerrado en r1. Lo que falta es la decisión visual del **header glyph compuesto de la pantalla 1**: el bloque que muestra "los 4 glyphs encadenados, horizontal, en trazo manuscrito Grabado".

Las cuatro capas tienen sistemas de glyphs cerrados (nube + gotas / termómetro + marcas / onda + punta / TBD para presión), pero en r2 de cada capa **no** se diseñó cómo verse las cuatro juntas como un sello compuesto. Hay tres opciones a explorar en sesión de Product Design:

- **H.1 Línea horizontal de glyphs separados.** Los cuatro glyphs uno al lado del otro, sin tocarse, tamaño 56px cada uno. Lectura: "estas son las cuatro lecturas".
- **H.2 Composición ensamblada.** Los cuatro glyphs en una composición orgánica (e.g. nube arriba, termómetro abajo, viento atravesando, presión como envoltura circular). Lectura: "estas cuatro juntas son un sistema".
- **H.3 Glyph compuesto nuevo.** Diseñar un quinto glyph "sello del sistema" que sintetice los cuatro sin replicarlos literalmente. Lectura: "esto es el mapa climático como objeto".

La decisión queda abierta para sesión de Product Design separada. Brief autocontenido en §Anexo A al final del documento.

Esta es la **única decisión visual abierta** en r1. El resto del diseño del overlay (tipografía, paleta, animaciones, microcopy concreto) usa tokens del DS existente (`--mi-font-display` para títulos, `--mi-font-mono` para metadatos, paleta terracota dominante, sombras duras sin radius).

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `platform/frontend/src/components/LayerOnboarding.tsx` | NUEVO — overlay carousel de 4 pantallas, parsea `_onboarding.md` |
| `platform/frontend/src/components/LayerGlossaryChip.tsx` | NUEVO — chip persistente esquina inferior izquierda |
| `platform/frontend/src/components/LayerLegend.tsx` | EXTENDER — agregar badge de calidad, microcopy, accordion, botón `[ⓘ Cómo se lee este mapa]` |
| `platform/frontend/src/components/MapaExplorer.tsx` | EXTENDER — integrar overlay (auto-trigger primera visita) + chip persistente + escuchar query param `?onboarding=1` |
| `platform/frontend/src/lib/onboarding-state.ts` | NUEVO — `hasSeenOnboarding` / `markOnboardingSeen` / `resetOnboarding` |
| `platform/frontend/src/lib/layers.ts` | EXTENDER — agregar campos `legendMicrocopy: string` y `shortIntro: string` al `interface Layer` |
| `platform/frontend/src/styles/onboarding.css` | NUEVO — tokens y animaciones del overlay (slide horizontal, fade backdrop, focus trap) |
| `platform/frontend/src/lib/markdown.ts` | EXTENDER o NUEVO — helper para parsear `_onboarding.md` por headers H1 (puede reusar el renderer del `LayerReadingDrawer`) |
| `70-Producto/lecturas-capas/_onboarding.md` | NUEVO — contenido editorial del overlay + glosario, en formato H1 por pantalla |
| `70-Producto/design-system/mapa/onboarding-mockups/` | NUEVO directorio para mockups del Anexo A — los 3 candidatos H.1/H.2/H.3 del header glyph compuesto |
| `platform/frontend/public/mapa/glyphs/onboarding-header.svg` | NUEVO al cerrar Anexo A — header glyph compuesto sincronizado desde el vault |
| `70-Producto/design-system/mapa/glyphs/README.md` | EXTENDER — documentar la decisión del header glyph compuesto del onboarding |
| `platform/frontend/src/lib/layers/precipitacion.ts` | EXTENDER — agregar `legendMicrocopy` + `shortIntro` (a coordinar con Spec 42 r3 o esta spec lo deja como TODO) |
| `platform/frontend/src/lib/layers/temperatura.ts` | EXTENDER — idem para Spec 43 |
| `platform/frontend/src/lib/layers/viento.ts` | EXTENDER — idem para Spec 44 |
| `platform/frontend/src/lib/layers/presion.ts` | EXTENDER — idem para Spec 45 |

---

## Criterios de aceptación

| # | Criterio | Verificación |
|---|---|---|
| AC1 | Primera visita a `/mapa` en una sesión sin `localStorage` del onboarding muestra `<LayerOnboarding>` tras 400ms del mount | DevTools: `localStorage.clear()`, recargar `/mapa`, overlay aparece tras la espera |
| AC2 | El overlay tiene 4 pantallas navegables con `←` `→` `Esc` `[Saltar]` y dots de progreso | Inspect: cada pantalla tiene los controles + el indicador visible |
| AC3 | `[Empezar a explorar →]` en pantalla 4 o `[Saltar]` o `Esc` cierran el overlay y persisten `mi.onboarding.v1.seen` en `localStorage` | Click en `[Empezar...]`, recargar, overlay no aparece |
| AC4 | Visitas posteriores no muestran el overlay automáticamente | Recargar `/mapa` con la clave seteada, overlay queda oculto |
| AC5 | El botón `[ⓘ Cómo se lee este mapa]` al pie de la leyenda reabre el overlay desde pantalla 1 | Click → overlay aparece, sin importar el estado de `localStorage` |
| AC6 | Query param `?onboarding=1` fuerza la apertura del overlay aunque ya esté visto | Visitar `/mapa?onboarding=1`, overlay aparece |
| AC7 | El overlay tiene trampa de foco — Tab/Shift+Tab ciclan solo dentro del overlay | Test de teclado: foco no sale al header del sitio mientras el overlay está abierto |
| AC8 | `prefers-reduced-motion: reduce` deshabilita la animación de slide horizontal entre pantallas | DevTools simula la preferencia, la transición pasa a instantánea |
| AC9 | El contenido de las 4 pantallas se renderiza desde `70-Producto/lecturas-capas/_onboarding.md` parseado por headers H1 | Editar el `.md`, recargar, contenido actualizado |
| AC10 | El chip `<LayerGlossaryChip>` aparece en esquina inferior izquierda del mapa en desktop y tablet | Inspect breakpoints, posición correcta |
| AC11 | En mobile (≤767px) el chip se reubica como link compacto dentro de la franja del LayerLegend | DevTools mobile, link visible donde corresponde |
| AC12 | Click en el chip lo expande mostrando la tabla del glosario | Click → panel expandido con tabla |
| AC13 | La leyenda muestra badge `⚑ Dato congelado` cuando el último dato real está >2 cadencias del slider | Mock data: slider en 2026, última lectura 2023, badge presente |
| AC14 | La leyenda no muestra badge cuando `quality === "oficial"` y está actualizada | Stub con dato fresh, no hay badge |
| AC15 | La leyenda muestra microcopy desde `layer.legendMicrocopy` debajo de la escala | Inspect: texto presente, contenido coincide con el campo |
| AC16 | El accordion `[▼ Cómo se lee esta capa]` expande/colapsa al click y muestra `layer.shortIntro` | Click expande, contenido visible |
| AC17 | El contrato `Layer` extiende `legendMicrocopy: string` y `shortIntro: string` | `pnpm typecheck` pasa; los 4 stubs declaran ambos campos |
| AC18 | Si `legendMicrocopy === ""` o `shortIntro === ""`, los bloques degradan a oculto sin romper la leyenda | Stub con strings vacíos, leyenda renderiza sin esos bloques |
| AC19 | El overlay tiene `role="dialog"` `aria-modal="true"` `aria-labelledby` apuntando al título de pantalla activa | Inspect ARIA, axe-core sin violaciones críticas |
| AC20 | Type-check pasa. `next build` completa sin errores | `pnpm typecheck && pnpm build` |
| AC21 | El header glyph compuesto de pantalla 1 (decisión #16 del Anexo A) está implementado según la opción elegida en Product Design | Inspect: SVG presente, coincide con el mockup elegido |

AC21 queda **cerrado en r2** con la sesión de Product Design.

---

## Edge cases

- **`localStorage` no disponible** (modo incógnito estricto Safari, navegador con storage bloqueado). El `try/catch` silencioso en `onboarding-state.ts` evita crash; consecuencia: overlay aparece cada visita. Aceptable.
- **Lector llega con un link compartido** (e.g. `/mapa?capa=precipitacion&t=2024-Q4`). Primera visita en su navegador. El overlay aparece, el estado de URL queda preservado debajo. Al cerrarlo, el lector ve la capa y el período preseleccionados.
- **Lector reabre el overlay con una capa stub** (Spec 39 stubs antes de Specs 42-45 implementadas). El overlay no depende de que las capas estén pobladas — su contenido es del sistema, no de la capa activa. Funciona igual.
- **`_onboarding.md` falta o tiene formato roto.** El componente `<LayerOnboarding>` debe fallar grácil con un overlay mínimo de fallback que diga "Mapa Inestable · presentación del mapa climático" + botón `[Cerrar]`. Logging en consola pero no error visible.
- **Glosario muy largo en el chip.** El panel expandido limita altura a 60vh con scroll interno. Si el glosario crece más allá, se mantiene navegable.
- **El lector está en `/` (home) y NO en `/mapa`.** El overlay no se muestra en `/` — es exclusivo de `/mapa`. El CTA "Explorar capas analíticas →" del home (Spec 39 §10) lleva a `/mapa` donde el overlay corresponde.
- **El lector navega `/mapa` → `/pais/[slug]` → vuelve a `/mapa`.** Si ya marcó como visto, no se reabre. Si saltó, se reabre la próxima vez que entre sin marca.
- **`shortIntro` con caracteres de markdown** (e.g. asteriscos, links). El accordion renderiza como texto plano en r1 — los markdown chars aparecen literales. Si Tomás quiere markdown rico, va en r2 o cierra el `shortIntro` siempre como texto plano por convención.
- **Animación del slide horizontal entre pantallas** con un dispositivo lento. La animación dura 200ms; en hardware muy lento puede verse jankeada. Mitigación: `will-change: transform` en el contenedor del carousel + `prefers-reduced-motion` lo desactiva.

---

## Decisiones tomadas

### Cerradas en r1 (sesión 2026-05-21)

| # | Tema | Decisión | Razón |
|---|---|---|---|
| 1 | Foco de la spec | **Onboarding como eje central + leyenda r2 con refinamientos menores** (opción 1 de 3 ofrecidas a Tomás) | La leyenda existente de Spec 39 §6 funciona en producción; el hueco real es la entrada del lector. Sin mediación, las capas se leen como adorno de mapa de Windy, no como herramienta analítica con marco editorial propio |
| 2 | Patrón del onboarding | **Guided carousel modal de 4 pantallas**, no tour contextual con popovers numerados | El tour contextual rompe con la dirección estética Grabado (flechas amarillas sobre el dibujo de Torres García compiten con cruces de capitales y panel lateral); el carousel se acerca al ritmo de lectura del Substack |
| 3 | Estructura de pantallas | Bienvenida → Las cuatro capas → Modelo de tiempo → Despedida | Tres bloques conceptuales (qué, qué hay, cómo se mueve) + cierre. Tres es el mínimo para presentar el sistema; cuatro deja despedida explícita sin sentirse padding |
| 4 | Persistencia | `localStorage` con clave `mi.onboarding.v1.seen` versionada | Versioning permite resetear el flag cuando el onboarding cambie sustantivamente (e.g. al sumar la 4ª capa real con Spec 45). Patrón ya usado en Spec 5 |
| 5 | Punto de re-entrada | Botón `[ⓘ Cómo se lee este mapa]` al pie de la leyenda flotante | Único punto. Más entradas (header del sitio, footer, slash command) dispersarían el descubrimiento y romperían el patrón "todo lo del mapa vive en `/mapa`" |
| 6 | Query param de fuerza | `?onboarding=1` reabre desde pantalla 1 | Habilita el caso de uso "mandale este link a alguien que recién entra" sin pedirle que limpie su `localStorage` |
| 7 | Trigger temporal | Auto-aparición tras 400ms del mount, no inmediata | Da tiempo al lector a registrar visualmente que cargó la página antes de cubrirla. 400ms es perceptible pero no molesto |
| 8 | Chip de glosario | `<LayerGlossaryChip>` flotante esquina inferior izquierda, colapsado por default | Esquina libre en los tres breakpoints definidos por Spec 39; conserva la coherencia "controles arriba/izquierda, lectura derecha" |
| 9 | Contenido del glosario | Mismo `.md` que el overlay (`_onboarding.md`), bajo un H1 propio "Glosario climático ↔ político" | Ambos son material introductorio del sistema; conviene que evolucionen juntos. Un solo archivo de vault, dos consumidores |
| 10 | Badge de calidad | Tres estados: `oficial` (sin badge) / `estimado` (badge ámbar discreto) / `congelado` (badge ámbar saturado + fecha de última actualización) | La ausencia es el caso normal — mostrar badge solo cuando hay desviación. El texto explícito en `congelado` es honestidad, no decoración (decisión 8 del epic) |
| 11 | Microcopy de leyenda | Campo nuevo del contrato `legendMicrocopy: string` aportado por cada capa | El microcopy es propiedad de la capa, no del componente. La decisión B.4 de Spec 42 (color = solo magnitud) sin microcopy se lee como bug visual |
| 12 | Accordion de leyenda | Bloque `[▼ Cómo se lee esta capa]` con `shortIntro: string` (2-4 oraciones) del contrato Layer | Atajo intermedio entre la leyenda (referencia técnica) y el reading drawer (lectura larga). Reduce fricción para el "skim" del lector que ya entró en el sistema |
| 13 | Extensión del contrato | Dos campos nuevos opcionales (`legendMicrocopy`, `shortIntro`) — la spec los define, cada Spec 42-45 los aporta | Mantiene la arquitectura limpia: contrato sin contenido, contenido por capa. Si una capa los deja vacíos, la leyenda degrada silenciosa |
| 14 | Accesibilidad | `role="dialog"` `aria-modal` `aria-labelledby` + trampa de foco + `Esc` cierra + `prefers-reduced-motion` desactiva slide | Estándar moderno de modales accesibles. axe-core sin violaciones críticas como AC |
| 15 | Patrón heredable | Esta spec inaugura un patrón que Spec 47 puede reusar — `<LayerOnboarding>` puede albergar pantallas adicionales en r2 si Spec 47 lo pide (e.g. "cómo leer el tooltip multi-capa") | El versioning de `localStorage` permite reactivar al sumar capas didácticas. Spec 47 no diseña su propio overlay si esta spec ya tiene la infraestructura |

### Cerradas condicionales para r2 (sesión de Product Design separada)

| # | Tema | Decisión | Estado |
|---|---|---|---|
| 16 | Header glyph compuesto de pantalla 1 | **H.1 / H.2 / H.3** — tres candidatos a elegir en sesión de Product Design (Mapa Inestable Design System · spec46/index.html) | Abierta — brief autocontenido en §Anexo A |

---

## Decisiones abiertas (tácticas, para implementación o para r3)

Las decisiones bloqueantes están cerradas. Lo que queda como decisión menor para la implementación:

1. **Renderer de markdown del overlay.** `<LayerReadingDrawer>` ya renderiza markdown desde el `.md` por capa. El overlay puede reusar el mismo renderer o usar un parser más simple si el contenido del `_onboarding.md` no necesita riqueza (tablas, imágenes). Decisión del implementador en VS Code.

2. **`shortIntro` con o sin markdown.** Esta spec lo deja como texto plano en r1. Si el contenido editorial necesita links o bold, se decide entre dos opciones: (a) cambiar `shortIntro: string` a `shortIntro: string | MarkdownNode[]`, (b) renderizar siempre como markdown — más flexible, más coste de renderer. Decisión a cerrar con el contenido editorial real.

3. **Posición exacta del chip glosario en mobile.** Esta spec dice "dentro de la franja del LayerLegend"; el lugar exacto (al pie de la franja, en una segunda línea, como ícono al lado del título) se cierra en implementación con la franja mobile real renderizando.

4. **Si Spec 47 reactiva el overlay con pantallas adicionales.** Mecanismo previsto en decisión 15: el `localStorage` versionado lo habilita. Spec 47 decide si lo necesita.

5. **Métrica de adopción.** No hay analytics en el sitio (Spec 39 no introduce ninguno). Si en una iteración futura se agrega telemetría, el evento natural sería `onboarding_seen` con `pantalla_final: 1-4` (¿cuántos saltaron, cuántos completaron?). Fuera de scope r1.

6. **Re-aparición condicional del overlay.** Si en r2 se suma la capa Spec 45 (presión), conviene reactivar el overlay para usuarios existentes. La opción mínima: bumpear `v1` → `v2` en la clave de `localStorage`. La opción más sofisticada: detectar el cambio y mostrar un overlay parcial "Nueva capa: Presión". Fuera de scope r1.

7. **Glosario expandible por término.** Click en "lluvia" → mini-pop con definición ampliada y link al reading guide de precipitación. Considerado en r1, descartado por simplicidad. Si en producción aparece demanda, va en r3.

---

## No incluido en esta spec

- Rediseño completo de la leyenda flotante (`<LayerLegend>`). Esta spec extiende; Spec 39 §6 sigue siendo la fuente de verdad del layout.
- Tour contextual modal sobre el mapa con popovers numerados apuntando a cada control. Considerado y descartado en decisión #2.
- Glosario expandible por término. Punto 7 de decisiones abiertas.
- Métricas de adopción del onboarding. Punto 5 de decisiones abiertas.
- Onboarding del corpus editorial (hot-zones, panel lateral, paneo por país). Esos se enseñan implícitamente al lector que ya conocía el sitio antes del epic.
- Onboarding propio de Spec 47. Si Spec 47 lo necesita, se monta sobre la infraestructura de esta spec (decisión 15).
- Onboarding del home `/`. Fuera de scope. El home no cambia (Spec 39 §10).
- Internacionalización del contenido. El sitio está solo en español, no se prevé multi-idioma en el epic.
- Tutoriales en video. Si en r2 o más adelante aparece, va como spec aparte.

---

## Implementación sugerida

Esta spec se diseña en Cowork (este documento es el handoff). La implementación la ejecuta una sesión de **Claude Code en VS Code** sobre `platform/frontend/`. Orden recomendado:

1. **Extender `lib/layers.ts`** con `legendMicrocopy: string` y `shortIntro: string`. Actualizar los 4 stubs (en `lib/layers/{precipitacion,temperatura,viento,presion}.ts`) con strings vacíos o placeholders. Pasar typecheck.
2. **Crear `lib/onboarding-state.ts`** con las 3 funciones. Unit tests de SSR-safety y de modo incógnito.
3. **Crear `70-Producto/lecturas-capas/_onboarding.md`** con el contenido editorial inicial (Tomás o Eche). Sin esperar a Anexo A — el header glyph se agrega después.
4. **Crear `<LayerOnboarding>`** con las 4 pantallas, navegación teclado/click, dots de progreso, trampa de foco, accesibilidad. Usar el renderer de markdown ya existente para parsear `_onboarding.md`.
5. **Crear `<LayerGlossaryChip>`** con expansión click, ESC para colapsar, layout por breakpoint.
6. **Extender `<LayerLegend>`** con: (a) badge de calidad de tres estados, (b) microcopy debajo de la escala, (c) accordion `[▼ Cómo se lee esta capa]` con `shortIntro`, (d) botón `[ⓘ Cómo se lee este mapa]` al pie.
7. **Integrar el overlay en `<MapaExplorer>`** con auto-trigger al mount (tras 400ms) si `!hasSeenOnboarding()`. Escuchar query param `?onboarding=1`. Persistir con `markOnboardingSeen()` al cerrar.
8. **Verificar AC1-AC20** uno por uno.
9. **Sesión Product Design** para Anexo A (decisión #16) → entregar `onboarding-header.svg` al vault.
10. **Sincronizar el SVG** al frontend y cerrar AC21.
11. **Type-check y `next build`.**
12. **Smoke test cruzado:** abrir `/mapa` en una sesión nueva (DevTools `localStorage.clear()`) → ver overlay → completar → recargar → no se ve → expandir chip glosario → reabrir overlay desde botón de leyenda.

Tiempo estimado: **3-4 días** de implementación. Bloqueante crítico: ninguno. Bloqueante condicional: Anexo A (decisión visual del header glyph) — la spec puede mergearse sin ese SVG si se usa un placeholder visual, y AC21 cierra después.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación de la spec en sesión de Cowork. r1 cierra 15 decisiones técnicas + 1 decisión abierta visual (Anexo A para sesión de Product Design separada) | Tomás eligió la opción "onboarding eje central + leyenda r2 con refinamientos menores" sobre dos alternativas (rediseño completo de leyenda; solo onboarding sin tocar leyenda). El foco quedó en la entrada del lector y la pieza didáctica permanente, no en rediseñar lo que ya funciona |

---

## Anexo A · brief para sesión de Product Design (Mapa Inestable Design System · spec46/index.html)

### Decisión 16 · Header glyph compuesto de la pantalla 1 del overlay

**El problema.** La pantalla 1 del onboarding abre con un bloque visual grande arriba del título "El mapa de Sudamérica como sistema climático". Las cuatro capas tienen glyphs cerrados (nube + gotas / termómetro + marcas / onda + punta / TBD para presión), pero ninguno por sí solo carga el significado "este sistema tiene cuatro lecturas". La pregunta: ¿cómo se materializa visualmente "las cuatro juntas como un sistema"?

**Restricciones.**

- Coherente con el sistema de glyphs cerrado por Specs 42-44 r2 (3 ejes compositivos distintos, trazo manuscrito Grabado, paleta `currentColor`).
- Tamaños mínimos: el header de la pantalla 1 ocupa ~280px de ancho × 100-140px de alto. Tiene que leerse a 100% pero también escalar arriba en mobile.
- No introduce glyphs nuevos por capa — esta decisión es sobre **un quinto bloque** que combina (o no) los cuatro existentes.
- Conserva la dirección estética. Sin emojis, sin íconos genéricos, sin estilizado distinto al resto del sistema.
- Spec 45 (presión) todavía no tiene glyph propio. La opción elegida debe funcionar con un placeholder mientras Spec 45 cierra.

**Opciones a explorar (no exhaustivas).**

**H.1 · Línea horizontal de glyphs separados.** Los cuatro glyphs uno al lado del otro, sin tocarse, tamaño 56px cada uno, con separador discreto entre ellos. Lectura: "estas son las cuatro lecturas, como cuatro caracteres alineados". Más simple, más coherente con el sistema. Riesgo: puede leerse como toolbar, no como sello del sistema.

**H.2 · Composición ensamblada.** Los cuatro glyphs en una composición orgánica — por ejemplo nube arriba, termómetro a la derecha, viento atravesando horizontal, presión envolviendo desde abajo. Los glyphs interactúan compositivamente sin perder identidad. Lectura: "estas cuatro juntas son un sistema en tensión". Más expresiva, más riesgo de saturación visual.

**H.3 · Glyph compuesto nuevo.** Diseñar un quinto glyph "sello del sistema" que sintetice los cuatro sin replicarlos literalmente. Podría ser un símbolo que evoque "clima en transformación" (e.g. un círculo con cuatro segmentos que insinúan cada elemento, o una espiral con cuatro brazos). Lectura: "esto es el mapa climático como objeto autónomo". Más identidad, más distancia del sistema cerrado.

**H.4 · No usar glyph compuesto.** Sustituir el bloque visual por una tipografía display grande y centrada con el título "Mapa climático sudamericano · cuatro lecturas". Lectura puramente tipográfica. Más austera, alinea con la dirección Grabado del sitio.

**Criterios de evaluación para la sesión de Product Design.**

- (a) **Coherencia con el sistema** — la opción no debe contradecir el patrón "elemento principal + secundarios" de los 4 glyphs cerrados.
- (b) **Densidad informativa** — al lector que ve este header por primera vez, ¿le adelanta que vienen cuatro lecturas distintas? La pantalla 2 las desglosa explícitamente; el header puede preparar o esconder.
- (c) **Escalabilidad por breakpoint** — desktop 280px, mobile ~200px. La opción debe leerse en ambos.
- (d) **Compatibilidad con Spec 45 pendiente** — la opción no debe romper si el glyph de presión cambia en r2 de Spec 45.
- (e) **Tiempo de diseño** — H.1 y H.4 son baratos; H.2 exige composición y prueba; H.3 exige diseño desde cero.

**Entregable esperado.** Un único SVG `onboarding-header.svg` (preferentemente 480px viewBox de ancho × 180px alto, `currentColor` paleta), entregado al vault en `70-Producto/design-system/mapa/glyphs/onboarding-header.svg`. Mockups exploratorios de las 4 opciones en `70-Producto/design-system/mapa/onboarding-mockups/`.

**Cierre.** La decisión #16 se cierra al elegir entre H.1, H.2, H.3 o H.4 (o una combinación) y entregar el SVG. AC21 cierra entonces.

---

## Glosario

- **Onboarding overlay (`<LayerOnboarding>`):** carousel modal de 4 pantallas que aparece en la primera visita a `/mapa` y queda reabrible desde la leyenda.
- **Glosario chip (`<LayerGlossaryChip>`):** chip flotante persistente en esquina inferior izquierda con la tabla climático ↔ político.
- **Microcopy de leyenda (`legendMicrocopy`):** una o dos líneas debajo de la escala de la leyenda que aclaran qué codifica el color. Campo nuevo del contrato `Layer`.
- **Short intro (`shortIntro`):** 2-4 oraciones de intro editorial dentro del accordion `[▼ Cómo se lee esta capa]`. Campo nuevo del contrato `Layer`.
- **Badge de calidad:** elemento visual en el header de la leyenda que aparece cuando `quality !== "oficial"`. Tres estados: oficial (sin badge), estimado (badge ámbar discreto), congelado (badge ámbar saturado + fecha).
- **Versioning del onboarding:** la clave `mi.onboarding.v1.seen` lleva el sufijo `v1` para habilitar reset condicional cuando el contenido del onboarding cambie sustantivamente.
- **Trampa de foco (focus trap):** mecanismo de accesibilidad que mantiene la navegación Tab/Shift+Tab dentro del modal abierto, sin escapar al resto del DOM.
