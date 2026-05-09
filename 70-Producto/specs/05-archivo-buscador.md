# Spec 05 — Archivo + buscador

**Estado:** pendiente
**Depende de:** Spec 01 (arquitectura)
**Prioridad:** media — empieza a doler con 50+ análisis

---

## 1. Por qué

Hoy los análisis solo se acceden desde dos lugares: el home (4-6 piezas de la semana actual) y el despacho semanal (donde están integrados editorialmente). No existe un archivo cronológico ni un buscador. A 47 despachos publicados (≈70-100 análisis acumulados), un lector que recuerda haber visto algo sobre "minería en Bolivia" o "Petro" o "atención" no tiene cómo encontrarlo.

La Spec 01 dejó el archivo full-text fuera de v1; esta spec lo recupera porque ya está empezando a doler.

---

## 2. Alcance

### 2.1. Entra

- Página `/analisis` con listado cronológico de todos los análisis publicados.
- Filtros combinables: país, eje, año, semana.
- Buscador full-text sobre título + lede + cuerpo de los 4 pasos.
- URL persistente para combinaciones de filtros (compartible).

### 2.2. Queda fuera

- Búsqueda semántica / vectorial — v2 si la simple no alcanza.
- Búsqueda en despachos (entrada/cierre/conectores). El archivo es de análisis, no de despachos. Los despachos ya están listados en `/despachos`.
- Filtros por autor citado o por concepto vinculado — v2, depende de Spec 07.
- Saved searches / alertas — v2.

---

## 3. Ruta

```
/analisis                                  Archivo completo
/analisis?pais=co                          Filtrado por país
/analisis?eje=desorientacion-epistemologica  Filtrado por eje
/analisis?q=petro                          Búsqueda full-text
/analisis?pais=co&eje=desorientacion-epistemologica&q=petro  Combinado
/analisis?ano=2026&semana=47               Ventana temporal
```

Los filtros viven en query params para que la URL sea compartible y el navegador back/forward funcione.

---

## 4. Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [HEADER del sitio]                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ARCHIVO                                                   │
│   78 análisis · Año II                                      │
│                                                             │
│   ┌─ buscador ──────────────────────────────────────────┐  │
│   │ 🔍  Buscar en análisis…                              │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                             │
├─────────┬───────────────────────────────────────────────────┤
│         │                                                   │
│ FILTROS │   RESULTADOS · 78 piezas                          │
│         │                                                   │
│ País    │   ┌─ 27 ABR 2026 · COLOMBIA ─────────────────┐  │
│ ☐ Todos │   │ DESORIENTACIÓN EPISTEMOLÓGICA              │ │
│ ☑ Argen.│   │ La sospecha antes del voto                 │ │
│ ☑ Brasil│   │ A 103 días del fin del mandato…            │ │
│ ☐ ...   │   │ Leer →                                      │ │
│         │   └─────────────────────────────────────────────┘ │
│ Eje     │   ┌─ 14 ABR 2026 · CHILE ────────────────────┐  │
│ ☐ Todos │   │ ...                                        │ │
│ ☐ Decul.│   └─────────────────────────────────────────────┘ │
│ ☑ Erosi.│                                                   │
│ ☐ ...   │   …                                               │
│         │                                                   │
│ Año     │   [Cargar más → o paginación]                     │
│ ☐ 2025  │                                                   │
│ ☑ 2026  │                                                   │
│         │                                                   │
│ [Limpiar│                                                   │
│  filtros]│                                                  │
│         │                                                   │
└─────────┴───────────────────────────────────────────────────┘
```

---

## 5. Componentes

### 5.1. Buscador

- Input full-width sobre la grilla de filtros + resultados.
- Debounce de 300ms al teclear, actualiza la URL y los resultados.
- En el resultado, **highlightear** las ocurrencias del query en título y lede.
- Si el query devuelve 0 resultados, mostrar mensaje + sugerencia ("¿Quizás quisiste decir…?" usando coincidencia parcial).

### 5.2. Panel de filtros

- Sticky a la izquierda, ancho 240px desktop. Mobile: colapsa en `<details>` arriba de los resultados.
- 3 grupos de filtros (País, Eje, Año), cada uno con checkboxes. Múltiple selección.
- "Limpiar filtros" al fondo. Borra query params, vuelve a `/analisis`.
- Cada checkbox muestra el conteo del facet entre paréntesis: `Colombia (12)`, `Chile (9)`. Estos conteos se recalculan según el resto de filtros activos.

### 5.3. Tarjeta de resultado

- Reusa `analysis-card-compact` definido en Spec 04.
- Meta-bar arriba: `[fecha] · [país] · [eje primario]`.
- Título h3 + lede (2-3 líneas truncadas si supera).
- Link "Leer →" al análisis individual.

### 5.4. Paginación / scroll

- Por defecto 20 resultados por página.
- Botón "Cargar más" (infinite scroll opt-in, no automático). El automático rompe la URL persistente.
- O paginación numerada `1 2 3 … 4` al pie. Decisión: paginación numerada — más explícita, mejor UX para volver a un resultado.

---

## 6. Implementación técnica

### 6.1. Indexado

Dos opciones, ambas viables:

**Opción A — Postgres con `pg_trgm` + `tsvector`** (recomendada)
- Aprovecha la base de datos existente.
- `tsvector` sobre `title || lede || step_disparador || step_desplazamiento || step_conceptualizacion || step_apertura`, con GIN index.
- Consulta combinada: `WHERE country = X AND axis IN Y AND tsvector @@ plainto_tsquery(Z)`.
- Sin dependencias externas. Rápido hasta ~10k documentos.

**Opción B — Pagefind (build-time)**
- Genera índice estático JSON al hacer build.
- Cliente puro, no toca el server.
- Pro: extremadamente rápido. Con: requiere rebuild para que aparezcan análisis nuevos.

Recomendación: **A** para v1, evaluar B si los análisis nuevos no aparecen en archivo (porque solo lo usan al final del flujo, no en tiempo real).

### 6.2. Filtros con conteos

Para que cada checkbox muestre `(12)`, `(9)`, etc., hay que hacer **faceted search**: la consulta principal devuelve los resultados, y queries adicionales (una por dimensión: país, eje, año) devuelven los conteos del resto del universo. Postgres lo resuelve con `GROUP BY` y `FILTER`. Cachear por 60s.

### 6.3. URL como source of truth

- Toda la página se renderiza desde `searchParams`.
- Sin estado local de filtros — un cambio de checkbox actualiza la URL, la página re-renderea desde la nueva URL.
- Esto hace que back/forward del navegador funcione gratis y compartir URL funcione.

---

## 7. Aplicación Grabado

- Fondo `--mi-bg-paper`. Es página de uso, no de marca.
- El buscador como bloque grande con `--mi-shadow-card` y borde grueso. Es la entrada principal de la página.
- Panel de filtros con `border-right: var(--mi-border-thick)`. Sticky.
- Highlights del query en resultados: fondo `--mi-accent-gold` con padding 0 2px. No es subrayado — es marca tipográfica.

---

## 8. Linkado desde otros lugares

- **Header del sitio:** sumar `/analisis` al nav principal (entre `/ensayos` y `/mapa`, o reemplazando si se decide que "Despachos" cubre esa función públicamente).
- **Footer:** sumar enlace "Archivo" como contraparte de "Despachos".
- **Página de país:** el botón "Ver todos los análisis de Colombia" lleva a `/analisis?pais=co`.
- **Página de eje (Spec 04):** el botón "Ver todos los análisis con este eje" lleva a `/analisis?eje=...`.

---

## 9. Orden de implementación

```
Día 1  ► Página estática + render desde searchParams
         - /analisis con todos los análisis sin filtros
         - tarjeta de resultado, paginación numerada

Día 2  ► Filtros faceted
         - Panel sticky con checkboxes
         - Consultas de conteos
         - URL como source of truth

Día 3  ► Buscador full-text
         - Migración: agregar tsvector a Analysis con GIN
         - Input con debounce, highlight en resultados
         - Estado vacío con sugerencia

Día 4  ► Linkado + pulido
         - Header, footer, página de país, página de eje
         - Mobile: colapsar filtros en <details>
         - Performance: cachear conteos
```

---

## 10. Criterios de aceptación

- [ ] `/analisis` lista todos los análisis publicados, ordenados desc.
- [ ] Filtrar por uno o más países / ejes / años actualiza los resultados y la URL.
- [ ] El buscador encuentra coincidencias en título, lede y los 4 pasos del cuerpo.
- [ ] La URL con filtros aplicados es compartible: pegar en otra pestaña reproduce el estado.
- [ ] Los conteos de cada filtro reflejan el universo restante (no el total absoluto).
- [ ] Mobile: filtros colapsan, buscador queda accesible arriba.
- [ ] Lighthouse > 90.
