---
spec: 20
titulo: Sidebar de navegación — Autores y ampliación de Conceptos
estado: borrador
autor: Tomás (con Claude)
fecha: 2026-05-09
depende_de: [07, 11, 15]
extiende: [11, 15]
afecta: [sidebar persistente global]
---

# 20 · Sidebar de navegación — Autores y ampliación de Conceptos

## Resumen

El sidebar persistente del sitio (definido en Spec 11 §4.1 y extendido a colapsable global en Spec 15 §7.2) actualmente expone cuatro secciones: **Países (10) · Ejes (6) · Buscador · Conceptos (N)**. Esta spec:

1. **Agrega una sección "Autores"** (colapsada por default), que lista todos los autores del corpus del proyecto con link a su página individual (Spec 07).
2. **Documenta el proceso editorial para ampliar la curaduría de Conceptos**, hoy limitada a ~5 visibles según Spec 07 §4 (curaduría inicial). El vault tiene 14+ fichas de concepto disponibles.

Es una spec de bajo riesgo arquitectural — el shell del sidebar y su comportamiento ya están definidos. Solo agrega secciones y aclara curaduría.

---

## 1. Estado actual del sidebar

### 1.1 Estructura visible (Spec 11 §4.1)

```
┌─────────────────┐
│  PAÍSES (10)    │ ▾
│   ▸ argentina    │
│   ▸ brasil       │
│   ▸ chile        │
│   ▸ colombia     │
│   ...            │
├─────────────────┤
│  EJES (6)       │ ▾
│   ▸ deculturación│
│   ▸ erosión      │
│   ...            │
├─────────────────┤
│  BUSCADOR  /    │
├─────────────────┤
│  CONCEPTOS (5)  │ ▾
│   ▸ hegemonía    │
│   ▸ ...          │
└─────────────────┘
```

### 1.2 Comportamiento (Spec 15 §7.2 r1)

- Sidebar colapsable en todas las páginas (48px iconos / 240px expandido).
- Default expandido en home y `/analisis`; default colapsado en lectura.
- Estado en `localStorage.preferences.sidebarState`.
- Cada sección puede colapsarse independientemente con su propio toggle.

---

## 2. Sección "Autores"

### 2.1 Por qué se agrega

Spec 07 propuso `/autor/[slug]` como página individual de cada autor citado en el corpus. La página está pendiente. El sidebar debe ser la entrada navegable a esos autores — sin sección en el sidebar, los autores quedan invisibles fuera de los footnotes individuales.

Es coherente con la lógica del proyecto: los autores del marco (Han, Roy, Harari, Huntington, etc.) son referencias estables, no descubrimiento puntual. Tener acceso permanente a la lista refuerza el armazón conceptual.

### 2.2 Posición en el sidebar

Después de Conceptos. La progresión queda:

```
Países  ▸  navegación geográfica
Ejes    ▸  marco interpretativo
Buscador ▸ acción
Conceptos ▸ marco conceptual
Autores  ▸  referencias del marco
```

De lo más concreto (geográfico) a lo más teórico (autores). Coherente con el orden de las solapas del dashboard de país (Spec 16 §2.2): de operativo a estructural.

### 2.3 Anatomía expandida

```
┌─────────────────────────┐
│  AUTORES (13)           │ ▾  ← mono uppercase 13px
│   ▸ Byung-Chul Han      │     ← Lora 14px regular
│   ▸ Arundhati Roy       │
│   ▸ Yuval Noah Harari   │
│   ▸ Samuel Huntington   │
│   ▸ Paul Kennedy        │
│   ...                    │
└─────────────────────────┘
```

- Header: `AUTORES (N)` mono uppercase, donde N es la cantidad de autores con `publicar: true` en el vault.
- Items: nombre completo del autor en Lora 14px regular, color `--mi-ink`. Hover: subrayado + cambio a `--mi-bg-warm`. Click: navega a `/autor/[slug]`.
- Marker `▸` (chevron mono) al inicio de cada item, color `--mi-ink-mute`.

### 2.4 Anatomía colapsada (icon-only)

```
┌────┐
│ 👥 │  ← ícono "AUTORES" (mono o pictográfico)
│ ── │
└────┘
```

Sidebar colapsado a 48px. Cada sección muestra un ícono representativo + tooltip al hover con el nombre. Para Autores, propongo un ícono mono simple (no pictórico — el DS pide consistencia mono): la inicial `A` en mono sobre fondo cream con border-thick, o el carácter unicode `§` (sección, sirve para autores como "obras").

**Decisión:** marcas mono uppercase consistentes con el resto del DS. Ningún ícono visual ornamental. Proposed:

| Sección | Marca colapsada |
|---|---|
| Países | `P` |
| Ejes | `E` |
| Buscador | `/` (también funciona como atajo) |
| Conceptos | `C` |
| Autores | `A` |

Hover sobre la marca: tooltip con el nombre completo de la sección + count.

### 2.5 Orden de los autores

**Default**: alfabético por apellido. (Han, B. → bajo H; Roy, A. → bajo R).

**Alternativa considerada**: cronológico por primera cita en el corpus. Descartada — es información poco navegable y puede cambiar.

### 2.6 Source of truth

`30-Autores/` del vault. Spec 07 §3 ya define el pipeline de sync: solo se incluyen los archivos con `publicar: true` en frontmatter. La sección "Autores" del sidebar lee del mismo build-time que `/autores` (la página de listado completo, también de Spec 07).

### 2.7 Componente

`<SidebarAuthorsSection>`. Hereda comportamiento de las otras secciones colapsables. Diferencias específicas:
- Orden alfabético por defecto.
- Items con tipografía Lora (mismo que países, no como ejes que usan axis pill).

---

## 3. Ampliación de Conceptos

### 3.1 Diagnóstico del estado actual

Spec 07 §4 proponía curaduría inicial de "~5 conceptos para v1". La intuición de Tomás ("creo que hay que sumar más conceptos") sugiere que ese límite arbitrario quedó corto. El vault tiene 14 fichas de concepto:

```
35-Conceptos-clave/
├── Decadencia política.md
├── Desterritorialización.md
├── Equilibrio de Poder.md
├── Estatura estratégica.md
├── Financiarización.md
├── Hegemonía.md
├── Hegemonía cultural.md
├── Poder Infraestructural.md
├── Reprimarización.md
├── Repatrimonialización.md
├── Soberanía.md
├── Sociedad de la información.md
├── Temporalidad.md
└── ... (otros pendientes de listar)
```

Si la curaduría inicial publicó 5, hay ~9 conceptos no expuestos en el sidebar. Esos conceptos pueden estar siendo invocados desde análisis (footnote tipo concepto, Spec 15 §3.4) — si lo están, deberían tener su página accesible. Si no lo están, vale considerarlos.

### 3.2 Política para v1: publicar todos, curar después

**Decisión r1 (tomada en sesión 2026-05-09):** todos los conceptos del vault `35-Conceptos-clave/` se exponen en el sidebar en v1. Sin filtro de calidad inicial, sin cap numérico, sin curaduría previa.

**Razones:**

1. La curaduría granular concepto-por-concepto agrega fricción de implementación con bajo retorno inmediato.
2. Los conceptos que no estén bien escritos serán visibles en su propia URL, lo que actúa como presión natural para completarlos.
3. La curaduría editorial se hace después, con el corpus en producción y el feedback del uso real (qué conceptos se invocan desde análisis, cuáles se buscan, cuáles tienen mejor fit).

**Implementación inmediata:** la sección Conceptos del sidebar lee el listado completo de archivos `.md` de `35-Conceptos-clave/`. No filtra por frontmatter `publicar`.

### 3.3 Curaduría diferida (post-v1)

Cuando Tomás decida hacer la curaduría — momento que vendrá con uso real del sitio o cuando los conceptos crezcan más allá de 20 — el mecanismo es:

1. Reintroducir el filtro `publicar: true` en el frontmatter de cada concepto.
2. Por default, los existentes se mantienen publicados.
3. Tomás marca `publicar: false` en los que considere a medio escribir o irrelevantes.

Es decir: hoy se publica todo, mañana se va sacando lo que sobra. La política inversa a la de Spec 07 §4 original ("publicar selectivo desde el principio").

**Riesgo asumido:** algún concepto a medio escribir queda visible un tiempo. Es un costo aceptable por la velocidad de implementación. Las URLs `/concepto/[slug]` que sean cuestionables se pueden ocultar puntualmente con `publicar: false` cuando aparezcan, sin necesidad de revisar el corpus entero.

### 3.4 Orden en el sidebar

**Default**: alfabético.

**Alternativa**: agrupar por eje principal asociado al concepto (frontmatter del concepto: `eje_principal`). Mostrar mini-headers de eje dentro de la sección Conceptos.

```
CONCEPTOS (12)            ▾
  
  · DECULTURACIÓN
    ▸ Hegemonía cultural
    ▸ Sociedad de la información
  
  · DESREPRESENTACIÓN
    ▸ Decadencia política
    ▸ Repatrimonialización
  
  · EROSIÓN DE MEDIACIONES
    ▸ Hegemonía
    ▸ Poder Infraestructural
    ...
```

**Recomendación:** alfabético en v1 (más simple, menos decisiones editoriales por concepto). La agrupación por eje queda como evolución v2 cuando los conceptos crezcan a 25+.

### 3.5 Componente

`<SidebarConceptsSection>`. Sin cambios de comportamiento respecto al actual; solo se elimina el cap interno y se respeta el flag `publicar: true`.

---

## 4. Implicaciones de altura del sidebar

### 4.1 Cálculo aproximado

Con la nueva sección y la ampliación:

| Sección | Items | Altura aproximada |
|---|---|---|
| Países | 10 | ~280px |
| Ejes | 6 | ~180px |
| Buscador | 1 trigger | ~48px |
| Conceptos (ampliado) | 12-14 | ~340px |
| Autores (nuevo) | 13 | ~360px |
| **Total expandido** | | **~1208px** |

En viewports altos (≥1080px) cabe sin scroll. En laptops 13" (768-900px) requiere scroll dentro del sidebar.

### 4.2 Decisión: secciones individualmente colapsables

Cada sección del sidebar tiene su propio toggle de colapsar (Spec 11 §4.1 ya lo permite). El estado de cada una se persiste en `localStorage.preferences.sidebarSections`:

```ts
sidebarSections: {
  paises: "expanded",
  ejes: "expanded",
  conceptos: "collapsed",
  autores: "collapsed"
}
```

**Default factory** (primera visita):
- Países: expanded
- Ejes: expanded
- Buscador: siempre visible (trigger único)
- Conceptos: **collapsed** (Tomás explícitamente pidió "Autores colapsados" — extiendo la lógica a Conceptos cuando crece. Ambos son referencias del marco, no navegación primaria).
- Autores: **collapsed**

El lector recurrente que use Conceptos o Autores frecuentemente expande una vez y queda persistido.

### 4.3 Scroll interno

El contenedor del sidebar tiene `overflow-y: auto` en su área de contenido (no en el header del sidebar). Scrollbar minimal estilo macOS (mostrar solo en hover, sin radius — coherente con el DS).

---

## 5. URL y deep-linking

Sin cambios respecto al sidebar actual:

- Click en país → `/pais/[slug]`.
- Click en eje → `/ejes/[slug]`.
- Click en concepto → `/concepto/[slug]` (Spec 07).
- Click en autor → `/autor/[slug]` (Spec 07, **nuevo en este spec**).
- `/` (atajo de teclado) abre command palette (Spec 15 §4.3).

---

## 6. Componentes nuevos / modificados

| Componente | Estado | Cambio |
|---|---|---|
| `<Sidebar>` | Existente (Spec 11) | Suma sección Autores |
| `<SidebarSection>` | Existente | Sin cambios |
| `<SidebarAuthorsSection>` | Nuevo | §2.7 |
| `<SidebarConceptsSection>` | Existente | Eliminar cap interno; respetar `publicar: true` |
| `<SidebarSectionToggle>` | Existente | Sin cambios |
| Estado `localStorage.preferences.sidebarSections` | Schema extendido | Suma `autores` y permite el cuarto valor |

---

## 7. Roadmap

### Fase A — Sección Autores (1-2 días)

1. Implementar `<SidebarAuthorsSection>` leyendo `30-Autores/` del vault con filtro `publicar: true`.
2. Agregar la sección al `<Sidebar>` después de Conceptos.
3. Persistir estado collapsed por default.
4. Smoke test: 13 autores listados, click en uno navega a `/autor/[slug]` (asumiendo que esa página existe; si no, link soft a `/autores` o estado pendiente).

### Fase B — Ampliar Conceptos (½ día, sin curaduría inicial)

1. Quitar el cap interno del componente.
2. Quitar el filtro por `publicar: true` (no se aplica en v1, según §3.2).
3. La sección lee el listado completo de `35-Conceptos-clave/`.
4. Smoke test: el sidebar muestra los 14 conceptos del vault.

**No requiere intervención editorial de Tomás en esta fase.** La curaduría se difiere a post-v1 (§3.3).

### Fase C — `/autor/[slug]` y `/concepto/[slug]` (Spec 07)

Esta spec **no implementa** las páginas individuales de autor y concepto. Eso corresponde a Spec 07. Si las páginas no existen al momento de implementar Fase A, el comportamiento es:

- Click en autor sin página: redirect a `/autores` con strip "Esta ficha está en preparación".
- Click en concepto sin página: redirect a `/conceptos` con strip equivalente.

**Recomendación:** ejecutar Spec 07 en paralelo o antes de cerrar esta spec, para que las navegaciones funcionen completas.

---

## 8. Decisiones tomadas implícitamente

| # | Tema | Decisión |
|---|-----|---------|
| 1 | Posición de Autores en el sidebar | Después de Conceptos |
| 2 | Default expanded/collapsed | Conceptos y Autores ambos collapsed por default |
| 3 | Orden de items dentro de Autores | Alfabético por apellido |
| 4 | Orden de items dentro de Conceptos | Alfabético en v1; por eje en v2 |
| 5 | Curaduría de Conceptos en v1 | Publicar todos los del vault sin filtro inicial. Curar después con uso real |
| 6 | Iconografía colapsada | Marcas mono uppercase (P, E, /, C, A) |

---

## 9. Decisiones pendientes

1. **Qué hacer con los autores cuyo `/autor/[slug]` no existe aún.** Spec 07 está pendiente. Propongo redirect soft a `/autores` con strip explicativo hasta que esa spec se implemente.

2. **Tooltip en sidebar colapsado** — ¿se muestra el count en el tooltip (`AUTORES (13)`) o solo el nombre (`AUTORES`)? Propongo con count para signaling — informa scope sin requerir click.

3. **Atajo de teclado para abrir el sidebar colapsado** — ¿existe? Si sí, ¿cuál? Propongo `[` y `]` como toggle (es el patrón de Notion / Linear). Decisión opcional.

4. **Más conceptos del vault (más allá de los 14 existentes)** — ¿hay un proceso para sumar fichas nuevas al vault y hacerlas publicables? Esto excede el scope de UI y entra en flow editorial. Documento la pregunta para no perderla, pero queda fuera de v1.

**Decisiones cerradas en sesión r1:**
- ~~Cuáles de los 14 conceptos publicar~~ → todos. Curaduría diferida a post-v1 (§3.2).
