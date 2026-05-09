# Spec 06 — Marco conceptual público

**Estado:** pendiente
**Depende de:** Spec 01 (arquitectura)
**Prioridad:** alta — el sitio publica análisis pero no su andamiaje

---

## 1. Por qué

Mapa Inestable se distingue de un newsletter de coyuntura por su **marco conceptual explícito**: 6 ejes interpretativos, un método de 4 pasos, y un linaje de autores teóricos detrás. Hoy el sitio publica análisis que aplican ese marco pero **no expone el marco**.

Resultado: un visitante nuevo lee "La sospecha antes del voto" y ve "Eje · Desorientación epistemológica" sin saber qué significa eso, qué lugar ocupa en el sistema, ni por qué es el ángulo elegido. La voz editorial sostiene la pieza, pero el proyecto pierde la oportunidad de mostrar lo que lo hace distinto.

Esta spec define las páginas que hacen visible el marco: `/acerca`, `/metodo`, y `/ejes` (esta última se especifica en Spec 04 — acá se conecta).

---

## 2. Alcance

### 2.1. Entra

- Página `/acerca`: qué es Mapa Inestable, hipótesis central, contexto de origen, autor, ritmo de publicación.
- Página `/metodo`: explicación del método de 4 pasos con ejemplo trabajado.
- Conexión con `/ejes` (Spec 04) como tercera pata del marco.
- Linkado desde donde corresponde: header, footer, dentro de cada análisis.

### 2.2. Queda fuera

- Manifiesto largo / página tipo "ensayo fundacional" — eso vive en `/ensayos` cuando se redacte.
- FAQ — no hace falta en v1.
- Página de equipo / colaboradores — single-author por ahora.

---

## 3. Página `/acerca`

### 3.1. Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [HEADER del sitio]                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│       ACERCA DE                                             │
│                                                             │
│       Mapa Inestable                                        │
│       (Alfa Slab One display)                               │
│                                                             │
│       Cartografía política del sur · Año II                 │
│       (mono lg, ink-soft)                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [Hipótesis central — bloque destacado]                    │
│                                                             │
│   "Las estructuras que organizaban la vida colectiva        │
│    pierden capacidad de mediación. Mapa Inestable           │
│    rastrea esa pérdida."                                    │
│                                                             │
│   (Fraunces italic xl, dropcap)                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   QUÉ HACEMOS                                               │
│   [Texto curado por Tomás — 2-3 párrafos sobre qué es el    │
│    proyecto, qué países cubre, qué tipo de análisis         │
│    produce. Diferenciación frente al newsletter de          │
│    coyuntura: foco en transformación estructural, no en     │
│    comentario de noticias]                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CÓMO LEER MAPA INESTABLE                                  │
│   ┌──────────────┬──────────────┬──────────────┐           │
│   │ ANÁLISIS     │ DESPACHO     │ ENSAYOS      │           │
│   │ pieza por    │ integración  │ piezas más   │           │
│   │ país, método │ semanal de   │ largas que   │           │
│   │ de 4 pasos   │ los análisis │ trabajan un  │           │
│   │              │              │ eje a fondo  │           │
│   │ → /analisis  │ → /despachos │ → /ensayos   │           │
│   └──────────────┴──────────────┴──────────────┘           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   EL MARCO                                                  │
│                                                             │
│   El proyecto se sostiene sobre dos piezas:                 │
│                                                             │
│   ┌──────────────────────┬──────────────────────┐          │
│   │ LOS SEIS EJES        │ EL MÉTODO            │          │
│   │ Marco interpretativo │ Procedimiento de     │          │
│   │ que lee las          │ análisis por país    │          │
│   │ transformaciones     │ en cuatro pasos      │          │
│   │                      │                      │          │
│   │ → /ejes              │ → /metodo            │          │
│   └──────────────────────┴──────────────────────┘          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   AUTORÍA                                                   │
│   [Texto breve sobre Tomás, contexto. Foto opcional]        │
│                                                             │
│   AÑO II                                                    │
│   [Fecha de inicio del proyecto, ritmo de publicación]      │
│                                                             │
│   CONTACTO                                                  │
│   [Email + Substack mientras conviva]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2. Datos requeridos

Una sola entidad `About` con campos editables:

```
About {
  hipotesis_central (string)
  que_hacemos (rich text)
  autoria (rich text)
  ano_inicio (string, ej: "Marzo 2024")
  ritmo_publicacion (string, ej: "Despacho semanal · análisis por país")
  contacto_email
  substack_url (opcional, mientras coexista)
}
```

### 3.3. Aplicación Grabado

- Fondo `--mi-bg-paper`.
- Hero textual con `--mi-shadow-hero` debajo.
- Bloque de hipótesis con `border: var(--mi-border-thick)` + `--mi-shadow-card`. Es el ancla del proyecto, debe sentirse como sello.
- Cards de "Cómo leer" y "El marco" usan `--mi-shadow-card` chico.

---

## 4. Página `/metodo`

### 4.1. Propósito

Explicar el método de 4 pasos a alguien que llega por primera vez. No es la spec interna del método — es la versión pedagógica para lectores.

### 4.2. Layout

```
┌─────────────────────────────────────────────────────────────┐
│   MÉTODO                                                    │
│                                                             │
│   Cuatro pasos para leer una escena                         │
│   (Alfa Slab One display)                                   │
│                                                             │
│   [Lede — Fraunces lg, máx 60ch:                            │
│   Cada análisis de Mapa Inestable sigue una estructura      │
│   constante. No es retórica: es el procedimiento que        │
│   permite distinguir la noticia del proceso.]               │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─ 01 ─────────────────────────────────────────────────┐  │
│   │ DISPARADOR                                            │ │
│   │ Una escena concreta. Una noticia, una imagen, una    │ │
│   │ estadística específica con fuente trazable.          │ │
│   │                                                       │ │
│   │ El disparador no es el tema: es el evento puntual    │ │
│   │ desde el que arranca el análisis. Sin disparador     │ │
│   │ no hay pieza.                                        │ │
│   │                                                       │ │
│   │ Ejemplo: "El 22 de abril Petro publicó en X          │ │
│   │ una serie de mensajes cuestionando…"                 │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌─ 02 ─────────────────────────────────────────────────┐  │
│   │ DESPLAZAMIENTO                                        │ │
│   │ Del evento concreto al proceso estructural que       │ │
│   │ el evento revela…                                    │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌─ 03 ─────────────────────────────────────────────────┐  │
│   │ CONCEPTUALIZACIÓN                                     │ │
│   │ Interpretación a través de uno o más de los seis     │ │
│   │ ejes. Acá entra el marco…                            │ │
│   │                                                       │ │
│   │ → Conocer los seis ejes                              │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌─ 04 ─────────────────────────────────────────────────┐  │
│   │ APERTURA                                              │ │
│   │ Una pregunta sin respuesta. El análisis no cierra:   │ │
│   │ deja la tensión abierta para que el lector siga…     │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   POR QUÉ ASÍ                                               │
│   [Texto pedagógico — 200-400 palabras. Justifica la        │
│    estructura: por qué el disparador en lugar del tema,     │
│    por qué la apertura en lugar del cierre, por qué         │
│    la conceptualización viene después y no antes]           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   EJEMPLO TRABAJADO                                         │
│                                                             │
│   [Embed o link al análisis de Petro como ejemplo del       │
│    método aplicado. CTA: "Ver el análisis completo →"]      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3. Componentes

- **Bloques de paso (4)** — reusa el `step block` definido en Spec 01 sección 7. Cada uno con número grande mono, título, descripción pedagógica + ejemplo corto.
- **Bloque "Por qué así"** — texto curado en cream con borde grueso. Justifica las decisiones del método.
- **Ejemplo trabajado** — link a un análisis específico (el de Petro u otro elegido como ejemplo canónico) con preview.

### 4.4. Datos requeridos

```
Method {
  lede
  paso_disparador { titulo, descripcion, ejemplo_corto }
  paso_desplazamiento { ... }
  paso_conceptualizacion { ... }
  paso_apertura { ... }
  por_que_asi (rich text)
  ejemplo_canonico_analysis_id  ← FK a Analysis
}
```

### 4.5. Aplicación Grabado

- Fondo `--mi-bg-paper`. Página de lectura referencial.
- Cada step block con `--mi-shadow-card`. Numeración en mono uppercase, grande.
- Bloque "Por qué así" con borde grueso, fondo cream — se distingue como pieza editorial dentro de la página.

---

## 5. Conexión con `/ejes`

La página `/ejes` se especifica en Spec 04. Acá solo se asegura que esté **cross-linked** con `/acerca` y `/metodo`:

- `/acerca` enlaza a `/ejes` y `/metodo` desde el bloque "El marco".
- `/metodo` enlaza a `/ejes` desde el paso 03 (Conceptualización).
- `/ejes` enlaza a `/metodo` y `/acerca` desde el footer de su página.

Las tres páginas (`/acerca`, `/metodo`, `/ejes`) forman el **marco visible**. Sin las tres, el marco queda incompleto.

---

## 6. Linkado desde otros lugares

- **Header del sitio:** ya tiene `/acerca`. Sumar `/metodo` como nueva entrada de nav (entre `/ensayos` y `/acerca`, o agrupado bajo "Marco" como dropdown).
- **Footer:** agregar bloque "Marco" con `/ejes`, `/metodo`, `/acerca`.
- **Aside del análisis individual:** agregar al final del bloque de meta-data un link "→ Cómo leemos" que va a `/metodo`.
- **Pill de eje en análisis:** ya está cubierto en Spec 04.

---

## 7. Decisiones editoriales pendientes

Estas decisiones bloquean la redacción de los textos pero no la implementación del esqueleto:

| # | Decisión | Quién |
|---|----------|-------|
| 1 | ¿Cuándo arrancó "Año II"? Fecha de inicio explícita | Tomás |
| 2 | ¿Cuál es el ejemplo canónico para `/metodo`? Por defecto el de Petro, pero conviene revisar | Tomás |
| 3 | Foto del autor: sí / no en `/acerca` | Tomás |
| 4 | ¿Substack convive o se reemplaza? Afecta el bloque "Contacto" en `/acerca` | Spec 08 |

---

## 8. Orden de implementación

```
Día 1  ► /acerca esqueleto
         - Layout + componentes nuevos
         - Texto placeholder

Día 2  ► /metodo esqueleto + bloques de pasos
         - Reusa step block de Spec 01
         - Texto placeholder con ejemplos cortos

Día 3  ► Linkado desde header, footer, análisis individual
         - Header con dropdown "Marco" si entra
         - Footer con bloque nuevo
         - Aside con link a /metodo

Día 4  ► Redacción + revisión
         - Texto definitivo de hipótesis, qué hacemos, autoría
         - Texto pedagógico de cada paso del método
         - Bloque "Por qué así"
         - Decisiones de Spec 08 resueltas (al menos las que afectan estos textos)
```

---

## 9. Criterios de aceptación

- [ ] `/acerca` muestra la hipótesis central, qué hacemos, cómo leer el sitio, el marco, autoría, contacto.
- [ ] `/metodo` muestra los 4 pasos con título, descripción pedagógica y ejemplo corto.
- [ ] `/metodo` enlaza al análisis canónico como ejemplo trabajado.
- [ ] `/acerca`, `/metodo` y `/ejes` están cross-linkadas entre sí.
- [ ] El header del sitio expone el marco (dropdown o nav).
- [ ] Cada análisis tiene un link "Cómo leemos" al método.
- [ ] El proyecto declara explícitamente desde cuándo cuenta el tiempo (Año II → fecha).
