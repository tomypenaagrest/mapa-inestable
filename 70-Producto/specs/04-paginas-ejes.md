# Spec 04 — Páginas de eje individuales

**Estado:** pendiente
**Depende de:** Spec 01 (arquitectura)
**Prioridad:** alta — hueco crítico de la v1 actual

---

## 1. Por qué

Hoy los 6 ejes existen como categoría conceptual del proyecto y como tag visual en cada análisis, pero **no son páginas navegables**. Aparecen como listado en el footer (sin links) y como pill en cada análisis (también sin link). Cuando un lector lee "Desorientación epistemológica" en una pieza y quiere entender qué significa o qué otros análisis lo activaron, no tiene a dónde ir.

Esto rompe la promesa central del proyecto: los 6 ejes son la **infraestructura interpretativa**, y sin páginas propias quedan invisibles al visitante. La Spec 01 dejó estas páginas fuera del alcance v1; esta spec las recupera como deuda crítica de la v1 publicada.

---

## 2. Alcance

### 2.1. Entra

- Una página por eje (6 páginas).
- Un índice general en `/ejes` que muestra los 6 con su definición corta.
- Linkado bidireccional: cada análisis enlaza al eje activado, cada página de eje lista todos sus análisis.

### 2.2. Queda fuera

- Métricas de uso del eje (cuántas veces se activó por país en el tiempo) — v2.
- Comparación entre ejes — v2.
- Páginas de extensiones de eje (ej. Repatrimonialización como subtema de Desrepresentación) — v2, depende de la decisión editorial sobre nuevos ejes (ver vault `35-Conceptos-clave/`).

---

## 3. Rutas

```
/ejes                       Índice de los 6 ejes
/ejes/[slug]                Página de eje individual
```

Slugs (kebab-case, sin tildes para URL pero con tildes en display):

| Eje | Slug |
|-----|------|
| Deculturación | `deculturacion` |
| Erosión de mediaciones | `erosion-de-mediaciones` |
| Desrepresentación | `desrepresentacion` |
| Estetización de la cultura | `estetizacion` |
| Desorientación epistemológica | `desorientacion-epistemologica` |
| Atención | `atencion` |

---

## 4. Página de eje individual

### 4.1. Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [HEADER del sitio]                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   EJES · 05 DE 06                          [breadcrumb]     │
│                                                             │
│      Desorientación                                         │
│      epistemológica                                         │
│      (Alfa Slab One display, max 18ch, line-height 0.95)    │
│                                                             │
│      Se debilita la capacidad de distinguir lo real,        │
│      lo verdadero, lo relevante.                            │
│      (lede — Fraunces lg, ink-soft)                         │
│                                                             │
│      ─────────                                              │
│      14 análisis · activo en 7 países                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   QUÉ DESCRIBE                                              │
│   [Texto pedagógico — 200-400 palabras. Define el eje,      │
│    da ejemplos, anticipa malentendidos comunes. Escrito     │
│    por Tomás. Es texto referencial, no cambia con cada      │
│    semana.]                                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   AUTORES DE REFERENCIA                                     │
│   ┌─────────────┬─────────────┬─────────────┐              │
│   │ Olivier Roy │ Byung-Chul  │ Yuval N.    │              │
│   │             │ Han         │ Harari      │              │
│   │ → ver autor │ → ver autor │ → ver autor │              │
│   └─────────────┴─────────────┴─────────────┘              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CONCEPTOS VINCULADOS                                      │
│   - Trampa territorial (Agnew)                              │
│   - Decadencia política (Fukuyama)                          │
│   - …                                                       │
│   (cards pequeñas → llevan a /concepto/[slug])              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ANÁLISIS DONDE SE ACTIVÓ                                  │
│   (orden cronológico desc, agrupados por año)               │
│                                                             │
│   2026                                                      │
│   ┌─ 27 ABR · COLOMBIA ───────────────────┐                │
│   │ La sospecha antes del voto             │                │
│   │ A 103 días del fin del mandato…        │                │
│   │ Leer →                                  │                │
│   └────────────────────────────────────────┘                │
│   ┌─ 14 ABR · CHILE ──────────────────────┐                │
│   │ ...                                    │                │
│   └────────────────────────────────────────┘                │
│   …                                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Componentes

- **Hero textual** — sin imagen. Numeración del eje (`05 DE 06`) en mono uppercase, título en Alfa Slab One, definición corta como lede en Fraunces. Métricas mínimas (cantidad de análisis y países) bajo el separador.
- **Bloque "Qué describe"** — texto pedagógico de 200-400 palabras. Explica el eje a un lector que llega por primera vez. Curado por Tomás, raramente cambia. Renderizado en cream con borde grueso (`--mi-border-thick`).
- **Autores de referencia** — cards de 3-5 autores cuya obra alimenta el eje. Cada card es link a `/autor/[slug]` (Spec 07). Se pueblan desde el vault: `30-Autores/` filtrando por la conexión declarada al eje.
- **Conceptos vinculados** — cards de los conceptos transversales del vault (`35-Conceptos-clave/`) que tienen `ejes_relacionados` apuntando al eje. Cada card es link a `/concepto/[slug]` (Spec 07).
- **Análisis donde se activó** — listado cronológico desc, agrupado por año. Reusa el componente `analysis-card` del home pero compacto. Si el eje aparece como secundario en un análisis, se muestra con etiqueta "secundario" (mono xs).

### 4.3. Datos requeridos

Extiende el modelo de `Axis` en Spec 01 sección 8:

```
Axis {
  slug, name, definicion_corta
  qué_describe (rich text)         ← nuevo
  autores_referenciados [autor_slug]
  conceptos_vinculados [concepto_slug]   ← nuevo
}
```

Los conteos (`14 análisis`, `7 países`) se calculan en consulta.

### 4.4. Aplicación Grabado

- Fondo `--mi-bg-paper`. Es página de lectura referencial.
- Hero usa la **paleta semántica del eje** como acento (cada eje tiene un color asociado en el design system existente; verificar en `design-system/`).
- Cards de autores y conceptos con `--mi-shadow-card`.
- Cards de análisis con la firma visual ya existente (idem home).

---

## 5. Página índice `/ejes`

### 5.1. Propósito

Vista de los 6 ejes como sistema. No es solo un listado: es la presentación pedagógica del marco interpretativo.

### 5.2. Layout

```
┌─────────────────────────────────────────────────────────────┐
│   [Hero textual]                                            │
│      Los seis ejes                                          │
│      Marco interpretativo de Mapa Inestable                 │
│      [Hipótesis del proyecto en 1-2 oraciones]              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌────────────────┬────────────────┬────────────────┐     │
│   │ 01             │ 02             │ 03             │     │
│   │ DECULTURACIÓN  │ EROSIÓN…       │ DESREPRES…     │     │
│   │ [definición]   │ [definición]   │ [definición]   │     │
│   │ → entrar       │ → entrar       │ → entrar       │     │
│   └────────────────┴────────────────┴────────────────┘     │
│   ┌────────────────┬────────────────┬────────────────┐     │
│   │ 04             │ 05             │ 06             │     │
│   │ ESTETIZACIÓN   │ DESORIENTAC…   │ ATENCIÓN       │     │
│   │ ...            │ ...            │ ...            │     │
│   └────────────────┴────────────────┴────────────────┘     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│   [Bloque "Cómo se relacionan"]                             │
│   El texto del MOC del vault (10-Ejes/Ejes - MOC.md         │
│   sección "Cómo se relacionan") publicado al sitio.         │
└─────────────────────────────────────────────────────────────┘
```

### 5.3. Componentes

- **Grid 3×2** — un eje por celda. Card con número grande (Alfa Slab One), nombre del eje, definición corta de 1 oración, link "→ entrar".
- **Bloque "Cómo se relacionan"** — texto curado tomado del MOC actual del vault (`10-Ejes/Ejes - MOC.md`). Explica que los 6 ejes son ángulos de un mismo proceso. Esta es la pieza pedagógica clave.

---

## 6. Linkado desde otros lugares

Una vez existan estas páginas, hay que **conectarlas** desde donde el eje aparece:

| Lugar | Cambio |
|-------|--------|
| Footer del sitio | Cada eje pasa de texto plano a `<a href="/ejes/[slug]">` |
| Pill de eje en análisis individual | Pasa de tag visual a link a `/ejes/[slug]` |
| Card de análisis en home | Tag de eje pasa a link |
| Aside del análisis individual | El campo "Eje" pasa a link |
| Sección de ejes en página de país | Cada eje activo es link a su página |

Sin estos cambios, las páginas existen pero quedan huérfanas.

---

## 7. Datos pendientes (deuda editorial)

Para publicar las 6 páginas hace falta producir:

- 6 textos "Qué describe" (200-400 palabras cada uno) — Tomás
- Lista de autores referenciados por eje — derivable del vault `30-Autores/` (campo `Conexiones con ejes` en cada autor)
- Lista de conceptos vinculados por eje — derivable del vault `35-Conceptos-clave/` (campo `ejes_relacionados` en cada concepto)
- Color semántico por eje — verificar en `design-system/`. Si no existe, definir.

---

## 8. Orden de implementación

```
Día 1  ► Schema + ruta /ejes/[slug]
         - Extender modelo Axis con qué_describe, conceptos_vinculados
         - Página estática con datos hardcoded de los 6 ejes
         - Hero textual + bloque "Qué describe"

Día 2  ► Listado de análisis por eje
         - Query: Analysis WHERE axis IN analysis_axes
         - Agrupar por año, ordenar desc
         - Componente analysis-card-compact

Día 3  ► Linkado desde otros lugares
         - Footer, pill de análisis, card de análisis, aside, página de país
         - Verificar que ningún tag de eje queda sin link

Día 4  ► Página índice /ejes
         - Grid 3×2 con las 6 cards
         - Bloque "Cómo se relacionan"

Día 5  ► Cards de autores y conceptos vinculados
         - Reusar componentes que se definen en Spec 07
         - Si Spec 07 no está implementada todavía, mostrar placeholder
           "Próximamente" en esos bloques (no bloquea v1 de esta spec)
```

---

## 9. Criterios de aceptación

- [ ] Las 6 páginas `/ejes/[slug]` existen y son navegables.
- [ ] La página `/ejes` lista los 6 con sus definiciones cortas.
- [ ] Cada análisis enlaza a su eje primario y a sus ejes secundarios desde el aside y desde la pill del hero.
- [ ] El footer del sitio enlaza los 6 ejes a sus páginas.
- [ ] La página de país enlaza los ejes activos a sus páginas individuales.
- [ ] Las cards de autores y conceptos vinculados existen (con datos o placeholder).
