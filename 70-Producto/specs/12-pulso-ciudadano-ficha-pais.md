# Spec 12 — Pulso ciudadano en la ficha de país (Latinobarómetro 2024)

**Estado:** datos listos · UI pendiente
**Depende de:** Spec 10 (marco general LB), Spec 04 (páginas de eje), Spec 01 (arquitectura)
**Prioridad:** alta — primera ejecución concreta de Spec 10, oleada 2024
**Tipo:** visualización editorial + componente UI
**Tamaño:** M (2-4 días)
**Bloqueado por:** nada (Spec 12B cerró el bloqueo de datos)
**Anexos:** [Spec 12A](12A-curaduria-12-indicadores.md) — curaduría · [Spec 12B](12B-pipeline-lb2024.md) — pipeline · [Mockup](../mockups/12-pulso-ciudadano-mockup.html) — preview con datos reales

---

## 1. Por qué esta spec existe

Spec 10 establece el marco general de integración de Latinobarómetro al sitio. Esta spec ejecuta la primera oleada (2024) sobre la ficha de país (`/pais/[slug]`).

Hoy esa ficha muestra: diagnóstico cualitativo, pregunta central, contexto, análisis publicados, sidebar con ejes crónicos y fuentes monitoreadas. Falta la **capa de evidencia cuantitativa** que active los 6 ejes con números trazables. LB 2024 es la pieza que la habilita.

El informe Latinobarómetro 2024 ("La democracia resiliente", 118 pp.) cubre directamente 5 de los 6 ejes:

| Sección del informe | Eje que alimenta |
|---|---|
| 4.1 Apoyo a la democracia, 4.6 Actitudes hacia el autoritarismo, 4.11.8 Representación | Desrepresentación |
| 4.7 Partidos / Congreso / Oposición, 4.9.2 Confianza en instituciones | Erosión de mediaciones |
| 4.9.4.3 Confianza en redes, 4.12.2 Redes sociales | Atención |
| 4.12.3 Información falsa, 4.11.7 Elecciones fraudulentas | Desorientación epistemológica |
| 7.1 Religión, escala izquierda-derecha (4.11.1) | Deculturación |

**Estetización** queda sin indicador propio en este dataset (ver Spec 12A §5).

## 2. Decisiones de scope (confirmadas con Tomás)

- Datos viven dentro de la ficha-país, no como módulo aparte.
- Se ejecuta **post-MVP** del flujo semanal de la plataforma.
- Doble audiencia: lectores del Substack + Tomás como insumo editorial.
- **Solo edición 2024** — no se construye framework genérico de datasets en esta spec.
- **Solo 17 países** del CSV de LB (incluye los 10 de Mapa Inestable + 7 de Centroamérica/México/RD).

## 3. Definición de "hecho"

Al cierre de la spec:

1. Las 10 fichas de país muestran una sección nueva **"Pulso ciudadano · Latinobarómetro 2024"** entre la Pregunta central y el Contexto.
2. Cada ficha incluye los **12 indicadores curados** (ver Spec 12A) organizados por eje.
3. Cada indicador muestra: valor 2024, ranking del país (1-17), comparación con promedio regional, y cita trazable al PDF (sección + página).
4. Existe componente reutilizable `<IndicatorCard />` (y `<IndicatorBar />` opcional para ranking).
5. El módulo `@/lib/latinobarometro-2024.ts` lee `indicators.json` (producido por Spec 12B) y expone helpers tipados.
6. La sección incluye al pie un bloque de fuente única con enlace al sitio oficial de Latinobarómetro y nota metodológica corta.

**No-objetivos (explícitos):**
- ❌ Series históricas 1995-2024 (queda para spec futura — la base ya está instalada en Spec 12B)
- ❌ Visualización interactiva tipo explorador con filtros
- ❌ Microdatos / cruces sociodemográficos (edad, género, educación)
- ❌ Otros datasets (LAPOP, encuestas país)

## 4. Plan en 4 historias (H1 ya cerrada por Spec 12B)

Tamaño T-shirt: **XS** = <2h · **S** = 1/2-1 día · **M** = 2-3 días.

### ~~H1 · Curaduría y carga de datos~~ — **✓ Cerrada por Spec 12B**

La curaduría de los 12 indicadores está en Spec 12A; el pipeline que produce `indicators.json` (204 datapoints validados ±1pp contra el informe) está en Spec 12B y ya fue ejecutado.

### H2 · Tipado y módulo de datos en el frontend · **S**

Crear `platform/frontend/src/lib/latinobarometro-2024.ts` que importa `indicators.json` y exporta:

- `getIndicatorsForCountry(slug): Indicator[]`
- `getIndicatorById(id): Indicator`
- `getIndicatorsByAxis(slug, axisKey): Indicator[]`

Tipos TypeScript estrictos (`AxisKey`, `IndicatorId`, `CountrySlug`). Helpers de formato: `formatValue(v, unit)` → `"74,6%"`, formateo de ranking `formatRank(rank, total)` → `"#1 de 17"`.

**Por qué frontend y no backend:** la ficha-país hoy se sirve estática. JSON pesa 30 KB, no justifica endpoint. Si en el futuro se incorpora serie histórica, se migra a Postgres.

### H3 · Componentes de UI: `<IndicatorCard />` + `<IndicatorBar />` · **M**

Especificación visual completa documentada en el mockup HTML del proyecto (ver `mockups/12-pulso-ciudadano-mockup.html`). Resumen:

- `<IndicatorCard indicator={...} country={...} />`:
    - Header: barra superior color del eje (6px), micro-label del indicador en mono uppercase.
    - Cifra grande en `var(--mi-font-display)` (Alfa Slab One), unidad en menor tamaño.
    - Meta row: chip de ranking (terracota si #1, oscuro si #17, neutro intermedio) + comparación regional.
    - Footer: cita "§ X.X · pág. NN" + link "Comparar →" (apunta a Spec 13).
- `<IndicatorBar indicator={...} highlight={countrySlug} />` (opcional v1, si conviene visualmente):
    - Barra horizontal con los 17 países ordenados.
    - País actual destacado, resto en `--mi-ink-mute`.
    - Línea vertical de promedio regional como referencia.

Respeta dirección Grabado: terracota dominante, Alfa Slab One para números, sombras duras 6×6 sin radius, bordes 2px.

**Verificación:** comparar componente real contra el mockup de referencia antes de integrar.

### H4 · Integración en `/pais/[slug]` · **S**

Insertar `<section>` "Pulso ciudadano · Latinobarómetro 2024" entre la Pregunta central y el Contexto en `src/app/pais/[slug]/page.tsx`.

Estructura por eje (orden):
1. Desrepresentación — 3 indicadores
2. Erosión de mediaciones — 3 indicadores
3. Desorientación epistemológica — 2 indicadores
4. Deculturación — 2 indicadores
5. Atención — 1 indicador
6. Contexto — 1 indicador (aprobación de gobierno)

Header del grupo: marker color del eje + nombre del eje + count "N indicadores".

**Decisión de UI tomada:** la sección va **expandida por defecto** (no colapsable como "Contexto"). Es la pieza de evidencia más fuerte y debe verse sin un click extra.

Footer único de la sección: cita global + botón "Informe completo →" al sitio oficial de Latinobarómetro.

### H5 · Cita global y trazabilidad · **XS**

- En cada `<IndicatorCard>`, link al PDF oficial de Latinobarómetro (URL del informe en latinobarometro.org).
- Crear nota en `30-Autores/` o `35-Conceptos-clave/`: ficha de Latinobarómetro como fuente (Marta Lagos, metodología, cobertura, periodicidad) — coherente con la trazabilidad no-negociable de Spec 01.
- Smoke test: las 10 fichas-país sudamericanas cargan sin errores; cada indicador tiene su cita.

## 5. Dependencias y orden

```
Spec 12B (✓ cerrada) ──► H2 (módulo TS) ──► H3 (componentes) ──► H4 (integración) ──► H5 (cita)
                                          │
                                          └─► H3 puede arrancar en paralelo con datos mock
```

H3 puede prototiparse contra el mockup HTML de referencia mientras H2 instrumenta el módulo TS.

## 6. Estimación

| Camino | Tiempo |
|---|---|
| Solo Tomás | 2-3 días |
| Tomás + Claude programa | 1 día calendario |
| Solo Claude | 1 sesión larga |

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Diseño no queda bien con datos reales en países distintos a Argentina | Media | Probar componente con Bolivia (extremo bajo) y El Salvador (extremo alto) antes de cerrar H4 |
| Densidad visual abruma en países con muchos indicadores en color extremo | Baja | El mockup ya validó la densidad con Argentina (3 rankings extremos) |
| Inconsistencia con tono editorial | Media | El número crudo va sin texto. La interpretación va en los análisis semanales, no en el card. |
| Falta indicador de Estetización | Confirmado | Documentado explícitamente en Spec 12A §5. La ficha muestra 5 ejes, no 6. |

## 8. Lo que esta spec habilita después

- **Spec 13 — Página comparativa cross-país:** lista. Consume el mismo `indicators.json` sin trabajo extra de datos.
- **Series históricas LB 1995-2023:** repetir Spec 12B con datasets anteriores (~1 día por año). El componente de ficha no cambia; solo agregaría delta vs años previos.
- **Otros datasets:** LAPOP, World Values Survey. El componente `<IndicatorCard />` es reusable.
- **Coloreado del mapa invertido por indicador** (futura): el dataset estructurado lo habilita; spec aparte porque cambia la UI del mapa.

## 9. Decisiones tomadas

| # | Pregunta | Resolución |
|---|---|---|
| 1 | ¿Subset de indicadores? | Los 12 de Spec 12A — curaduría cerrada |
| 2 | ¿Sección expandida o colapsable? | Expandida por defecto |
| 3 | ¿Mostrar promedio regional? | Sí, como contexto al lado del ranking |
| 4 | ¿`lib/` estático o backend? | `lib/` estático — JSON pesa 30 KB |
| 5 | ¿Hostear PDF o linkear? | Linkear al sitio oficial de Latinobarómetro |

## Apéndice · Estructura de archivos resultante

```
platform/
├── data/
│   └── latinobarometro-2024/        ← producido por Spec 12B
│       ├── indicators.json
│       ├── build_indicators.py
│       ├── README.md
│       └── raw/                      (gitignored)
└── frontend/
    └── src/
        ├── lib/
        │   └── latinobarometro-2024.ts          ← H2
        ├── components/
        │   ├── IndicatorCard.tsx                ← H3
        │   └── IndicatorBar.tsx                 ← H3 (opcional)
        └── app/
            └── pais/[slug]/page.tsx             ← H4 (modificada)
```
