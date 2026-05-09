# Épica E001 — Latinobarómetro 2024 en la ficha de país

> **Estado:** propuesta de planificación · `2026-05-08`
> **Tamaño T-shirt:** **M** (mediano) — una semana focal o dos sprints livianos en paralelo a otros frentes
> **Bloquea:** publicación del primer batch de fichas-país con evidencia cuantitativa
> **Bloqueado por:** confirmación del subset de indicadores a cargar (decisión editorial — ver sección "Pre-trabajo")

---

## 1. Por qué esta épica existe

El informe Latinobarómetro 2024 ("La democracia resiliente", 118 pp.) es la pieza de evidencia cuantitativa más completa disponible para hablar de los 6 ejes en Sudamérica:

| Sección del informe | Eje que alimenta |
|---|---|
| 4.1 Apoyo a la democracia, 4.6 Actitudes hacia el autoritarismo | Desrepresentación |
| 4.7 Partidos / Congreso / Oposición, 4.9.2 Confianza en instituciones | Erosión de mediaciones |
| 4.9.4.1-3 Confianza en medios / prensa / redes, 4.12.2 Redes sociales | Erosión + Atención |
| 4.12.3 Información falsa, 4.12.1 La gente dice lo que piensa | Desorientación epistemológica |
| 7.1 Religión, 7.2 Buenos modales, escala izquierda-derecha (4.11.1) | Deculturación |
| 4.11 La política completa, 4.8 Para quién se gobierna | Desrepresentación |

Hoy la ficha de país (`/pais/[slug]`) muestra: diagnóstico cualitativo, pregunta central, contexto, análisis publicados y un sidebar con ejes crónicos (intensidad 0-5) y fuentes monitoreadas. **Falta la capa de evidencia.** LB 2024 es la pieza que la habilita.

**Decisión de scope (confirmada con Tomás):**
- Datos viven dentro de la ficha-país, no como módulo aparte.
- Post-MVP (la plataforma tiene que estar levantada).
- Doble audiencia: lectores del Substack + Tomás como insumo editorial.
- Solo edición 2024 — no construimos framework genérico de datasets.

---

## 2. Definición de "hecho"

Al cierre de la épica:

1. Las 10 fichas de país muestran una sección nueva **"Pulso ciudadano · Latinobarómetro 2024"** entre la Pregunta central y el Contexto.
2. Cada ficha incluye **8-12 indicadores curados** organizados por eje (subset, no los 120+ del informe).
3. Cada indicador muestra: valor 2024, comparación regional (promedio LAT), señalética cuando rompe récord o invierte tendencia, y cita trazable al PDF (sección + página).
4. Hay un componente reutilizable `<IndicatorCard />` y `<IndicatorBar />` (comparación entre países).
5. Existe un endpoint o módulo de datos curados (`@/lib/latinobarometro-2024.ts` o `/api/pais/{slug}/latinobarometro`) que sirve los indicadores.
6. La página `/pais/[slug]` incluye al pie un bloque de fuente única con enlace al PDF original y nota metodológica corta.
7. Hay un README en `platform/data/latinobarometro-2024/README.md` que documenta de dónde salieron los números (qué páginas del PDF, qué decisiones de redondeo, qué quedó afuera y por qué).

**No-objetivos (explícitos):**
- ❌ Series históricas 1995-2024 (queda para épica futura).
- ❌ Ediciones anteriores o futuras.
- ❌ Visualización interactiva tipo explorador con filtros.
- ❌ Microdatos / cruces sociodemográficos (edad, género, educación).
- ❌ Otros datasets (LAPOP, encuestas país).

---

## 3. Pre-trabajo de Tomás (bloqueante)

Antes de escribir una sola línea de código, hay una decisión editorial que sólo Tomás puede tomar:

**Curar el subset de 8-12 indicadores que aparecerán en cada ficha.**

Recomendación de partida (a confirmar/editar):

| # | Indicador | Sección PDF | Eje |
|---|---|---|---|
| 1 | Apoyo a la democracia | 4.1 | Desrepresentación |
| 2 | Satisfacción con la democracia | 4.4 | Desrepresentación |
| 3 | Confianza en partidos políticos | 4.7.1 | Erosión |
| 4 | Confianza en el congreso | 4.7.2 | Erosión |
| 5 | Confianza en el poder judicial | 4.9.2.4 | Erosión |
| 6 | Confianza en medios de comunicación | 4.9.4.1 | Erosión + Atención |
| 7 | Confianza en redes sociales | 4.9.4.3 | Atención |
| 8 | Información falsa (preocupación) | 4.12.3 | Desorientación |
| 9 | "Para quién se gobierna" — para una minoría | 4.8 | Desrepresentación |
| 10 | Escala izquierda-derecha (promedio) | 4.11.1 | Deculturación |
| 11 | Religión (importancia) | 7.1 | Deculturación |
| 12 | Aprobación de gobierno | 4.10 | Contexto |

**Output esperado de Tomás antes del kick-off:** un Google Doc o sección en el vault con los 12 indicadores definitivos, en qué páginas del PDF están las cifras por país, y qué corte editorial usar (¿"% de acuerdo + muy de acuerdo"? ¿"mucha + algo de confianza"?).

Sin esto, la épica no arranca con buen pie — el riesgo es construir UI bonita sobre datos que después hay que rehacer.

---

## 4. Plan en 5 historias

Tamaño T-shirt por historia: **XS** = <2h · **S** = 1/2 día · **M** = 1 día · **L** = 2-3 días.

### H1 · Curaduría y transcripción de datos · **M**
**Quién:** Tomás (curaduría) + Claude (transcripción asistida).
**Qué:**
- Tomás congela los 8-12 indicadores definitivos.
- Claude lee el PDF página por página y extrae los valores por país.
- Output: archivo `platform/data/latinobarometro-2024/indicators.json` con esquema:
  ```json
  {
    "indicators": [
      {
        "id": "apoyo-democracia",
        "label": "Apoyo a la democracia",
        "axis": "desrepresentacion",
        "section": "4.1",
        "pdf_page": 30,
        "unit": "%",
        "regional_avg": 52,
        "by_country": {
          "ar": { "value": 67, "delta_vs_2023": 4, "rank": 2 },
          "br": { "value": 50, "delta_vs_2023": -1, "rank": 7 },
          ...
        }
      }
    ]
  }
  ```
- Claude redacta `README.md` documentando criterios de redondeo, decisiones de cortes, indicadores descartados.

**Riesgo:** los gráficos del PDF son imágenes (no tablas extraíbles). La transcripción es manual y propensa a errores → mitigar con cross-check del archivo "Resultados por país" (PDF F00017937, que sí trae tablas).

---

### H2 · Tipado y módulo de datos en el frontend · **S**
**Qué:**
- Crear `platform/frontend/src/lib/latinobarometro-2024.ts` que importa `indicators.json` y exporta:
  - `getIndicatorsForCountry(slug): Indicator[]`
  - `getIndicatorById(id): Indicator`
  - `getAxisSummary(slug, axisKey): { count, indicators[] }`
- Tipos TypeScript estrictos (`AxisKey`, `IndicatorId`, `CountrySlug`).
- Helpers de formato: `formatDelta(+4)` → `"+4 pts"`, badge de récord/inversión.

**Por qué frontend y no backend:** la ficha-país hoy se sirve estática (markdown + constants). Meter un endpoint solo para 12 indicadores × 10 países × 1 año = 120 filas es over-engineering. Si más adelante se incorpora serie histórica, se migra a Postgres.

---

### H3 · Componentes de UI: `<IndicatorCard />` + `<IndicatorBar />` · **M**
**Qué:**
- `<IndicatorCard indicator={...} country={...} />`:
  - Header: nombre del indicador + chip del eje (color de `--mi-axis-{key}`).
  - Cifra grande en `Alfa Slab One` (var `--mi-text-display`).
  - Unidad + delta vs 2023 (con flecha arriba/abajo).
  - Footnote: "Latinobarómetro 2024 · § 4.1 · p. 30".
- `<IndicatorBar indicator={...} highlight={countrySlug} />`:
  - Barra horizontal con los 10 países ordenados.
  - País actual destacado en `--mi-accent-gold`, resto en `--mi-ink-mute`.
  - Valor regional como línea vertical de referencia.
- Respeta dirección estética "Grabado": terracota dominante, Alfa Slab One, sombras duras sin radius (de tu memoria de diseño).
- Sin librerías nuevas — todo CSS + SVG inline (la plataforma ya tiene d3 si hace falta).

**Verificación:** screenshot de ambos componentes en isolation para revisar antes de integrar.

---

### H4 · Integración en `/pais/[slug]` · **S**
**Qué:**
- Insertar nueva `<section>` "Pulso ciudadano · Latinobarómetro 2024" entre la Pregunta central y el Contexto.
- Agrupar los 8-12 indicadores por eje (3-4 grupos visualmente claros).
- Para cada eje, mostrar 2-3 `<IndicatorCard />` en grid + opcionalmente 1 `<IndicatorBar />` para el indicador más fuerte del grupo.
- Footer de la sección con bloque de cita única: "Fuente: Latinobarómetro 2024 · Informe La democracia resiliente · Diciembre 2024 · [PDF completo →]".

**Decisión de UI a tomar:** ¿la sección va expandida por defecto o colapsable como "Contexto"? Recomiendo expandida — es la pieza de evidencia más fuerte y los lectores deben verla sin un click extra.

---

### H5 · Cita global y trazabilidad · **XS**
**Qué:**
- Agregar el PDF al vault `platform/public/sources/latinobarometro-2024.pdf` para servirlo desde el sitio.
- Pie de cada `<IndicatorCard />` y bloque global linkean a esa URL.
- Añadir entrada en `30-Autores/` o nueva carpeta `30-Fuentes/`: nota de Latinobarómetro como organización (Marta Lagos, metodología, cobertura, cuándo publican).
- Smoke test: verificar que las 10 fichas cargan sin errores y que cada indicador tiene su cita.

---

## 5. Dependencias y orden

```
H1 (curaduría + transcripción) ──► H2 (módulo TS) ──► H3 (componentes) ──► H4 (integración) ──► H5 (cita)
                                          │
                                          └─► H3 puede arrancar en paralelo con datos mock
```

H3 no necesita esperar a H1/H2 si se trabaja con un mock de 2 países. Esto permite paralelizar el diseño visual mientras la transcripción avanza.

---

## 6. Estimación total

| Camino | Tiempo |
|---|---|
| Solo (Tomás programando) | 4-5 días de trabajo focal |
| Tomás cura + Claude programa | 2-3 días calendario |
| Solo Claude (con curaduría aprobada) | 1 sesión larga + 1 de pulido |

**Recomendación:** dividir en dos sesiones —
- **Sesión 1 (medio día Tomás):** curaduría de los 12 indicadores, congelar lista, marcar páginas del PDF.
- **Sesión 2 (1 día Claude + revisión Tomás):** H1 a H5 ejecutadas de corrido, con review en H3 (componentes) y H4 (integración).

---

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Errores de transcripción del PDF | Alta | Cross-check con F00017937 "Resultados por país" + Tomás revisa 2 países al azar antes de cerrar |
| Curaduría de indicadores se demora | Media | Bloquea toda la épica. Asignar slot calendarizado. |
| Diseño no queda bien con los datos reales | Media | H3 con datos mock primero, validar con Tomás antes de H4 |
| LB 2024 se actualiza / sale 2025 | Baja en horizonte 6m | Esquema `latinobarometro-2024.ts` ya separa por año, agregar 2025 será nueva épica |
| Inconsistencia con tono editorial | Media | Cada indicador acompañado de una línea de "lectura" curada por Tomás (no solo número crudo) |

---

## 8. Lo que esta épica habilita después

- **Series históricas:** una vez resuelto el patrón visual con 2024, agregar 1995-2023 es repetir H1 con más datos. Probablemente nueva épica E002.
- **Otros datasets:** LAPOP, World Values Survey, encuestas país. El componente `<IndicatorCard />` se reusa.
- **Vista comparativa cross-país:** tener 12 × 10 = 120 datapoints estructurados habilita una página `/comparar` o un modo del mapa que colorea países por indicador. Épica futura.
- **Integración con análisis semanales:** cuando un análisis menciona apoyo a la democracia, autolinkear al indicador en la ficha del país. Trabajo de plataforma, no de esta épica.

---

## 9. Decisiones pendientes (para confirmar antes de arrancar H1)

1. ¿Los 12 indicadores propuestos son los correctos? ¿Quitás/agregás alguno?
2. ¿La sección va expandida o colapsable en la ficha?
3. ¿Querés mostrar también el promedio regional o solo el valor del país?
4. ¿Vamos con `lib/` estático o ya armamos endpoint en backend (FastAPI) pensando en escalar?
5. ¿El PDF se hostea en el sitio o se linkea al sitio oficial de Latinobarómetro?

---

## Apéndice A · Estructura de archivos resultante

```
platform/
├── data/
│   └── latinobarometro-2024/
│       ├── indicators.json
│       ├── README.md                  # criterios de transcripción
│       └── source.pdf                 # copia del informe original
├── frontend/
│   ├── public/
│   │   └── sources/
│   │       └── latinobarometro-2024.pdf
│   └── src/
│       ├── lib/
│       │   └── latinobarometro-2024.ts
│       ├── components/
│       │   ├── IndicatorCard.tsx
│       │   └── IndicatorBar.tsx
│       └── app/
│           └── pais/[slug]/page.tsx   # modificada (H4)
└── specs/
    └── E001-latinobarometro-2024.md   # este documento
```

## Apéndice B · Mapeo eje → indicadores propuesto

```
DESREPRESENTACIÓN  ▸ apoyo-democracia · satisfaccion-democracia · gobierno-para-minoria
EROSIÓN MEDIAC.    ▸ confianza-partidos · confianza-congreso · confianza-judicial · confianza-medios
ATENCIÓN           ▸ confianza-redes
DESORIENTACIÓN     ▸ informacion-falsa
DECULTURACIÓN      ▸ izquierda-derecha · religion-importancia
CONTEXTO           ▸ aprobacion-gobierno
```
