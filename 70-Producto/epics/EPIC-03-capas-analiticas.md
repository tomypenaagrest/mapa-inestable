---
epic: 03
titulo: Capas analíticas en el mapa principal
estado: en-ejecucion
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-18
revision: 2026-05-19 (r3) — Spec 39 implementada en frontend; Specs 40 y 41 listas en r2 para handoff a VS Code; Spec 39B y 41B creadas como placeholders. Preguntas abiertas #2 y #4 resueltas
tipo: documento-epic
afecta: [platform/frontend (capa de visualización sobre el mapa), platform/data (pipelines de datos macro y políticos), 70-Producto/specs (Specs 39-48 + 39B + 41B), 70-Producto/datos-viento (NUEVO directorio del vault)]
depende_de: []
relaciona_con: [Spec 11 (rediseño home/dashboard), Spec 14 (indicadores estructurales), Spec 14A (curaduría 24 indicadores), Spec 14B (pipeline macro existente), Spec 22 (mapa Torres García), Spec 29 (calendario de agentes), Spec 34 (rediseño home r2)]
specs_vinculadas: [39, 39B, 40, 41, 41B, 42, 43, 44, 45, 46, 47, 48]
prioridad: media
naturaleza: documento vivo — fuente de verdad del epic, se actualiza con cada decisión cerrada o spec mergeada
---

# 03 · Capas analíticas en el mapa principal

## Resumen ejecutivo

Mapa Inestable usa hoy el mapa Torres García como interfaz de navegación: hot-zones por país que abren análisis editoriales. Este epic agrega una **capa de lectura adicional inspirada en mapas meteorológicos** (referencia: Windy). Cuatro variables superpuestas — viento, temperatura, presión, precipitación — visualizadas como sistema dinámico sobre la geografía sudamericana.

El epic habilita **dos lecturas** sobre el mismo objeto:

- **Editorial** — el mapa muestra el sistema político-económico como clima en transformación. Complementa los análisis de los 6 ejes con una capa de datos duros que ancla la lectura conceptual.
- **Risk management** — el mismo mapa, leído con framing de evaluación país, sirve a clientes B2B (consultoras, finanzas, comercio exterior, exportadores) que necesitan entender exposición regional sin leer ensayo.

La metáfora climática es central: no asigna valoración moral a una dirección del viento, solo describe el sistema. Es coherente con el método del proyecto — no es un tablero electoral, es un mapa de procesos estructurales.

**Outcome.** Una persona puede abrir el mapa y entender, sin leer ningún análisis, cómo se está moviendo la región. Un cliente B2B puede usar el mismo objeto para evaluar tendencias estructurales por país.

**Estado actual (2026-05-19).** El epic está en ejecución activa, no en planificación:

- **Spec 39 (arquitectura de capas + layout de `/mapa`)** está implementada en el frontend. Contrato `Layer`, 4 stubs, controlador/leyenda/time-slider/reading-drawer, extensión de `MapaTorresGarcia` con `activeLayer`, polígonos consumidos desde el JSON del vault.
- **Spec 40 (pipeline macro)** está **implementada**. Pipeline extendido con `series_trimestral` / `series_mensual`, indicador `c7-salario-real-mensual`, priority stubs `d1/d2`, CHANGELOG, README con contrato público, JSON en `macro-v1.1.0`. AC2/AC3 (sub-anuales) se poblan cuando haya acceso a red a IMF IFS e ILO.
- **Spec 41 (pipeline político / viento)** está en borrador-r2, lista para handoff a VS Code. MVP 100% manual editorial — coding semanal en escala -3 a +3 en `70-Producto/datos-viento/`, algoritmo postergado a Spec 41B.
- **Reframe operativo cerrado:** las capas viven exclusivamente en `/mapa`; el home sigue como mapa navegacional puro con un CTA discreto a `/mapa`. Doble lectura editorial / risk management se materializa dentro de `/mapa`, sin necesidad de dos rutas.
- **Specs hijas postergadas:** Spec 39B (página dedicada de documentación profunda por capa, se diseña al final del epic con las 4 capas implementadas) y Spec 41B (algoritmo híbrido de coding viento, se diseña con 8-12 semanas de coding manual acumulado).

**Lo que entra:**

- Sistema de capas raster/vectoriales sobre el mapa Torres García (toggle, leyenda, time slider).
- Cuatro capas conceptuales (viento, temperatura, presión, precipitación) con fuentes de datos definidas.
- Pipeline de ingestión de datos económicos y políticos (backend + storage + sync).
- Modo lectura editorial + modo lectura risk management (la forma exacta queda abierta — ver Decisión 3).
- Sistema de leyenda y onboarding visual de la metáfora climática.
- Eventualmente, export / snapshot / alertas si va el framing B2B (Spec 48).

**Lo que NO entra:**

- Cambios al modelo de datos editorial (publicaciones, despachos, agendas, agentes diarios siguen igual).
- Generación de análisis editoriales basados en las capas (eso es trabajo humano, no una feature del sistema).
- Predicciones / forecasting (las capas muestran estado y serie temporal, no predicción).
- Visualización subnacional como default (puede entrar como spec posterior para Brasil y Argentina si hay caso).
- Reescritura del mapa Torres García en sí (Spec 22 sigue vigente; este epic se monta encima).

---

## Las cuatro capas

| Capa | Qué representa | Fuente concreta | Cadencia | Estado de pipeline |
|---|---|---|---|---|
| **Viento** | Orientación político-económica: dirección (pro-mercado ↔ pro-estado) e intensidad (velocidad del cambio) | Coding editorial manual semanal (Spec 41 r2). Algoritmo híbrido pospuesto a Spec 41B (espera 8-12 semanas de coding acumulado) | Semanal | Spec 41 r2 lista para implementar |
| **Temperatura** | Condiciones materiales de la población. Salario real como base, posiblemente combinado con ratio mediano/promedio como índice de desigualdad | INDEC EMAE, IBGE PIB Trimestral, INE IR, DANE GEIH (cobertura 6-8 países en r1 de Spec 40, ampliar después) | Mensual | Pipeline en Spec 40 r2 lista para implementar |
| **Presión** | Densidad de mediaciones institucionales: confianza en partidos, instituciones, democracia, prensa | Latinobarómetro (índices ya curados en Specs 12A y 14A; lib `latinobarometro.ts` existente, no requiere refactor) | Anual | Datos ya ingestados, capa pendiente (Spec 45) |
| **Precipitación** | Estado de la economía: crecimiento vs. estancamiento, inflación | Banco Mundial (anual existente + extensión a trimestral en Spec 40). Indicador base: `a2-crecimiento-pbi.series_trimestral` | Trimestral | Pipeline en Spec 40 r2 lista para implementar; capa en Spec 42 pendiente de diseño |

La combinación de las cuatro capas describe el **clima país**: un país puede tener viento pro-mercado fuerte + temperatura baja (salarios cayendo) + presión baja (instituciones erosionadas) + precipitación alta (estancamiento). Esa lectura compuesta es lo que ningún análisis textual puede dar de un vistazo.

---

## Decisiones cerradas

| Fecha | Decisión | Rationale | Qué desbloquea |
|---|---|---|---|
| 2026-05-18 | La metáfora climática se conserva, pero las categorías se reescriben para alinearse al marco del proyecto | "Izquierda/derecha" importa el marco que el proyecto cuestiona (desrepresentación, deculturación deforman esas categorías). El clima como sistema sin valoración moral encaja con el método | Decide el lenguaje de la capa viento y la lógica conceptual de las cuatro |
| 2026-05-18 | La capa **viento** se codifica como "pro-mercado ↔ pro-estado", no izquierda/derecha | Más operativo y medible que el autoetiquetado; sirve mejor para risk management (Milei es de derecha pero hace ortodoxia FMI; Lula es de izquierda pero sostiene macro ortodoxa) | Hace escribible la Spec 44 (capa viento) |
| 2026-05-18 | Doble audiencia: editorial + risk management sobre el mismo mapa | Mismo objeto sirve a dos lecturas si las capas están bien diseñadas. No hay producto B2B separado; hay un mismo producto leído de dos maneras | Define el alcance del modo risk management (Spec 48) y abre Decisión 3 |
| 2026-05-18 | **Temperatura** = salario real (base), con opción de combinar con ratio mediano/promedio | Datos disponibles en INDEC/IBGE/INE; el ratio mediano/promedio agrega lectura de desigualdad casi gratis | Hace escribible la Spec 43 |
| 2026-05-18 | **Presión** = índices de Latinobarómetro | Datos ya curados en Specs 12A y 14A; aprovecha el pipeline existente | Hace escribible la Spec 45 (en parte) |
| 2026-05-18 | **Precipitación** = crecimiento económico | La más directa de implementar técnicamente; buena para validar la arquitectura punta a punta | Hace de Spec 42 la primera capa a construir |
| 2026-05-18 (r2) | **Capa viento: codificación híbrida.** Algoritmo provee la base; el autor puede hacer override editorial cuando la lectura algorítmica no captura un movimiento importante | Más robusta y defendible que algoritmo puro u editorial puro; el override editorial vive en el vault siguiendo el patrón borrador → promote de Spec 29 | Hace escribibles Specs 41 y 44, define el modelo de datos de la capa |
| 2026-05-18 (r2) | **Modelo de tiempo: por capa, no uniforme.** Cada capa se muestra siempre con su última lectura disponible al momento que apunta el slider, con la fecha explícita en la leyenda | Honesta sobre las distintas cadencias (viento semanal, temperatura mensual, precipitación trimestral, presión anual). Evita el error de leer la presión de hoy como si fuera la presión de ayer | Hace escribible Spec 39 (UI del slider) y el modelo de datos de Spec 40 |
| 2026-05-18 (r2) | **Visualización: una UI toggleable estilo Windy en v1.** Todas las capas disponibles desde el mismo controlador; el usuario elige qué activar | Empezar simple, ver cómo lo usa la gente antes de diferenciar. Modos editorial/risk como capa de personalización en una iteración posterior | Hace escribible Spec 39 (controlador de capas), simplifica navegación del sitio, posterga decisión de modelo de cuentas B2B |
| 2026-05-18 (r2) | **Profundidad histórica: 5 años en v1.** Time slider cubre desde 2021 | Cubre la cobertura del proyecto sin volver el slider inmanejable; casi todas las fuentes tienen esa profundidad sin pagar | Acota el costo de Spec 40 (storage e ingestión) y la performance del slider |
| 2026-05-18 (r2) | **Granularidad geográfica nivel país en v1.** Subnacional (Brasil, Argentina) queda como spec posterior si hay caso | Reduce el alcance de la primera iteración; subnacional cuadruplica el costo de ingestión y de UI. Las fuentes usadas serán todas de licencia libre o atribución manejable | Cierra Specs 40 y 41 a alcance manejable; deja el upgrade subnacional como decisión futura |

---

## Decisiones abiertas

Las 5 decisiones estratégicas del epic quedaron cerradas en la r2 del 2026-05-18 — ver tabla arriba. No quedan decisiones abiertas a nivel epic.

Las próximas decisiones aparecerán a nivel táctico cuando arranque la implementación de cada spec (qué endpoint exacto de cada fuente, qué algoritmo específico para el scoring de la capa viento, qué librería de rendering de partículas, etc.). Esas decisiones se cierran dentro de cada spec, no acá.

---

## Specs vinculadas

Ordenadas por dependencia. La numeración arranca en 39 (38 ya está ocupada).

| Spec | Título | Depende de | Estado |
|---|---|---|---|
| 39 | Arquitectura de capas en el mapa | EPIC 03 (decisiones 2, 3, 4) | **borrador-r2** — decisiones cerradas, lista para handoff a VS Code |
| 39B | Página dedicada de documentación por capa | Spec 39 + 4 capas implementadas | placeholder — se diseña al final del epic, con las 4 capas en el aire (no post-Spec 42 como se pensó originalmente) |
| 40 | Pipeline de datos macroeconómicos | EPIC 03 (decisión 5), Spec 14B existente | **implementada** — pipeline extendido con sub-anuales, `c7-salario-real-mensual`, priority stubs, skill staging, Spec 29 actualizada. AC2/AC3 requieren red para datos finales |
| 41 | Pipeline de datos políticos (capa viento) | EPIC 03 (decisiones 1, 5) | **borrador-r2** — 6 tácticas cerradas, lista para handoff a VS Code sin decisiones bloqueantes |
| 41B | Algoritmo híbrido de coding para capa viento | Spec 41 + 8-12 semanas de coding manual acumulado | placeholder — se diseña cuando haya material editorial de referencia |
| 42 | Capa precipitación: crecimiento económico | Spec 39, 40 | pendiente |
| 43 | Capa temperatura: salario real / desigualdad | Spec 39, 40 | pendiente |
| 44 | Capa viento: orientación pro-mercado / pro-estado | Spec 39, 41 | pendiente |
| 45 | Capa presión: densidad institucional desde Latinobarómetro | Spec 39, 12A, 14A | pendiente |
| 46 | Sistema de leyenda y onboarding visual | Spec 39 + al menos una capa publicada | pendiente |
| 47 | Tooltip e interacción multi-capa | Spec 39 + 2+ capas publicadas | pendiente |
| 48 | Modo risk management (export, alertas, snapshot) | Spec 39 + decisión 3 cerrada en favor de (b), o como adición a (a) | condicional |

Estimación gruesa: ~10 specs, 2-3 sprints de trabajo bien hecho, asumiendo que las cinco decisiones estratégicas estén cerradas antes de arrancar.

---

## Próximos pasos

1. ~~Cerrar las 5 decisiones estratégicas.~~ **Hecho en r2 del epic (2026-05-18).**
2. ~~Diseñar Spec 39 (arquitectura).~~ **Hecho 2026-05-18; implementada en frontend.**
3. ~~Diseñar Specs 40 y 41 (pipelines).~~ **Hechas 2026-05-18; cerradas tácticas en r2 el 2026-05-19; listas para handoff.**

**Próximos en orden recomendado:**

4. ~~**Mandar Spec 40 a VS Code para implementar.**~~ **Hecho 2026-05-19** — pipeline implementado, JSON `macro-v1.1.0` en frontend. Desbloquea Specs 42 y 43.
   - **Pendiente (Cowork):** crear scheduled task `pipeline-macro-refresh` viernes 18:00 ART + importar `70-Producto/skills/pipeline-macro-refresh/SKILL.md` al plugin.
   - **Pendiente (laptop con red):** correr `py build_indicators_macro.py` con acceso a internet para poblar `a2-crecimiento-pbi.series_trimestral` (IMF IFS, AC2) y `c7-salario-real-mensual.series_mensual` (ILO, AC3).
5. **Mandar Spec 41 a VS Code para implementar** (en paralelo o secuencial a Spec 40, son independientes). Desbloquea Spec 44.
6. **Diseñar Spec 42 (capa precipitación) en Cowork.** Es la primera capa real, valida la arquitectura de Spec 39 punta a punta con datos del pipeline de Spec 40 implementado. Ahora puede incluir la decisión sobre subcapas / sub-indicadores (apertura del 2026-05-19: además del crecimiento del PBI como dimensión principal, agregar lectura de inflación + inversión + deuda como subindicadores; ver pregunta abierta #6).
7. **Diseñar Specs 43, 44, 45** (capas temperatura, viento, presión) — pueden arrancarse en paralelo cuando Spec 42 valide la arquitectura.
8. **Diseñar Specs 46 y 47** (leyenda + onboarding, tooltip multi-capa) cuando haya al menos 2 capas implementadas para diseñar sobre uso real.
9. **Diseñar Spec 39B (página dedicada de documentación profunda por capa)** al final del epic, con las 4 capas implementadas.
10. **Decidir Spec 48 (modo risk management)** según resolución de la pregunta abierta #1 sobre tier B2B pago.
11. **Diseñar Spec 41B (algoritmo híbrido de coding viento)** después de 8-12 semanas de coding manual acumulado.

**Recordatorio de flujo de trabajo.** El diseño de cada spec (escritura del documento en `70-Producto/specs/`) se hace en sesiones de **Claude Cowork**. La implementación de cada spec (código en `platform/`) se hace en **VS Code con Claude Code**. El handoff entre ambos es el archivo de spec mergeado, listo para ser ejecutado. Ver sección "Flujo de trabajo" en `CLAUDE.md`.

**Velocidad esperada (basada en lo recorrido):** una sesión de Cowork cierra el diseño de una spec en 30-60 minutos cuando las decisiones estratégicas del epic ya están cerradas. Una sesión de VS Code implementa una spec en 1-3 días. A este ritmo, el epic completo (4 capas + tooling + página de docs) cierra en 4-6 semanas de trabajo distribuido.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-18 | Creación del documento. Origen: conversación sobre cómo aplicar la metáfora de mapas meteorológicos (Windy) al mapa Torres García. Inaugura la carpeta `70-Producto/epics/`, primer epic formal del proyecto | Spec 29 funcionó como meta-spec del sistema de agentes; surgió la necesidad de un patrón equivalente para features grandes del frontend |
| 2026-05-18 | Renumeración: las specs del epic arrancan en 39 (38 ya estaba tomada por "columna home borradores diarios") | Conflict de numeración detectado al revisar el directorio de specs |
| 2026-05-18 (r2) | Cerradas las 5 decisiones estratégicas siguiendo las recomendaciones preliminares: capa viento híbrida, modelo de tiempo por capa, UI única toggleable en v1, profundidad histórica 5 años, granularidad nivel país en v1. Estado del epic pasa de `borrador-r1` a `decisiones-cerradas` | Decisión explícita del autor; epic queda desbloqueado para arrancar Spec 39 |
| 2026-05-18 (r2) | Agregado al epic recordatorio del flujo de trabajo Cowork/VS Code en sección "Próximos pasos" | Garantizar que cualquier sesión que retome este epic sepa dónde se hace cada cosa |
| 2026-05-18 | Spec 39 mergeada en borrador-r2: arquitectura + layout de `/mapa` + reframe (home preview / `/mapa` analítico). Cerradas 22 decisiones (11 estratégicas + 11 tácticas). SSOT de polígonos de hot-zones movido al vault. Render con Gaussian blur para difuminar fronteras. Spec 39B creada como placeholder | Avance del epic: la spec madre está lista para handoff a VS Code. Spec 39B captura el principio "no esconder los trucos del mago" sin inflar Spec 39 |
| 2026-05-18 | Spec 40 mergeada en borrador-r1: formalización del pipeline macro existente (Spec 14B) + extensión a cadencias sub-anuales (trimestral, mensual) para alimentar capas precipitación y temperatura. Skill `pipeline-macro-refresh` + scheduled task semanal. Reposicionamiento de Spec 39B: se diseña al final del epic, no post-Spec 42 (decisión refinada por Tomás — para que el patrón documental sea consistente con las 4 capas implementadas) | Spec 40 desbloquea Specs 42 y 43. El pipeline existente reduce mucho el trabajo: no es construir desde cero, es formalizar contrato + agregar 2 indicadores nuevos |
| 2026-05-18 | Spec 41 mergeada en borrador-r1: MVP 100% manual editorial para alimentar la capa viento. Sistema de coding semanal con escala -3 a +3, archivo .md por país-semana en `70-Producto/datos-viento/<slug>/`, skill `coding-viento` que asiste, pipeline Node.js que compila JSON, scheduled tasks. Spec 41B creada como placeholder del algoritmo híbrido (se diseña cuando haya 8-12 semanas de coding manual acumulado). Spec 39 verificada como implementada en el frontend en sesión paralela de VS Code | Diseñar el algoritmo del coding viento sin material editorial sería inventar reglas. El coding manual es el input necesario para entender qué patrones existen antes de automatizar |
| 2026-05-19 | Spec 40 bumpeada a borrador-r2: cerradas 5 de las 6 decisiones tácticas abiertas (script Python en sandbox de Cowork, cobertura 6-8 países en r1, auto-promote con umbral 5%, `frozen_since?` para indicadores con fuente discontinuada, ratio mediano/promedio confirmado para cuando Spec 43 lo pida). Queda abierta sólo la #2 (historial de revisiones retroactivas) por decisión explícita: se decide tras 4-6 semanas de operación. Lista para handoff a VS Code sin decisiones bloqueantes | Tomás cerró las tácticas tras leer r1. La spec queda implementable sin volver a Cowork |
| 2026-05-19 | Spec 41 bumpeada a borrador-r2: cerradas las 6 decisiones tácticas abiertas (Tomás único codificador, sub-eventos sin rank propio en r2, paleta CSS cae en Spec 44, trigger on-publish vía skill, cobertura ≥1 país válida, histórico de revisiones pospuesto). Lista para handoff a VS Code sin decisiones bloqueantes. EPIC 03 ya tiene 3 specs listas (39 implementada + 40 r2 + 41 r2) y 2 placeholders (39B, 41B) | Tomás revisó r1 y cerró todas las tácticas. Próximo paso natural: diseñar Spec 42 (capa precipitación) que ya puede asumir Spec 40 implementada |
| 2026-05-19 (r3 del epic) | Actualización integral del documento del epic: estado cambia de `decisiones-cerradas` a `en-ejecucion`. Agregado párrafo de "Estado actual" al resumen ejecutivo. Refinada la tabla de las 4 capas con fuentes concretas + columna de estado de pipeline. Reescrita la sección "Próximos pasos" según el estado real (los 3 primeros pasos ya hechos). Resueltas las preguntas abiertas #2 (publicación de a una, no en bloque) y #4 (manejo de fuentes que no actualizan — resuelto en Spec 40 r2). Agregada pregunta abierta nueva #4 sobre subcapas / sub-indicadores planteada por Tomás. Specs_vinculadas extendidas con 39B y 41B en el frontmatter | El epic dejó de ser "planificación cerrada" para pasar a "ejecución activa" — el doc tenía que reflejar ese cambio para que cualquier sesión futura entienda dónde está parado |
| 2026-05-19 | Spec 40 implementada en sesión de Claude Code (VS Code). Estado en tabla de specs vinculadas pasa de `borrador-r2` a `implementada`. Próximo paso 4 tachado. Tabla de capas y resumen ejecutivo actualizados. Pipeline `macro-v1.1.0` activo en frontend | Primera spec del pipeline de EPIC 03 implementada; desbloquea diseño de Spec 42 (capa precipitación) |

---

## Preguntas resueltas

| # | Pregunta original | Resolución | Dónde se cerró |
|---|---|---|---|
| 2 | ¿Las capas se publican como una sola release o de a una? | **De a una, en orden: precipitación → temperatura → viento → presión.** Cada capa permite iterar el patrón antes de aplicarlo a la siguiente. Spec 42 es el caso piloto que valida arquitectura | Confirmado en planificación de orden de Specs 42-45; explícito en "Próximos pasos" de este doc |
| 4 | ¿Qué pasa cuando una fuente no actualiza? | **Tres mecanismos combinados**: (a) `quality: "estimado" / "congelado"` por datapoint, (b) campo opcional `frozen_since?: string` a nivel de indicador cuando la fuente entera deja de actualizar, (c) en la leyenda del mapa se muestra "⚠ dato congelado" cuando aplica. El render no muestra blanco — siempre la última lectura disponible con su fecha explícita | Spec 40 r2, decisiones #6 y #13 |

## Preguntas abiertas

1. **¿Va el tier B2B pago?** El framing de risk management abre la posibilidad de un producto pago. Si va, Spec 48 cobra prioridad y aparece una decisión sobre modelo de cuentas / billing. Si no, el modo risk es solo una lectura del mismo producto gratuito. No hay que resolverla para arrancar las capas, pero conviene saberlo antes de Spec 48.

2. **¿Hay relación entre las capas y los 6 ejes editoriales?** Cada capa probablemente "activa" un eje (presión = erosión de mediaciones; viento = desrepresentación o estetización según la dirección; temperatura = condiciones materiales que cruzan deculturación). Vale la pena mapearlo explícitamente — habilita una feature futura: filtrar el corpus editorial por capa, o ver qué análisis se escribieron mientras una capa estaba en cierto estado. Re-evaluar cuando haya 2+ capas implementadas y aparezca uso real.

3. **¿Hay sentido en agregar una quinta capa "atención" en el futuro?** El eje de atención es transversal a todos los demás. Podría visualizarse como intensidad de cobertura mediática por país (volumen de noticias, dispersión de fuentes, concentración de temas). No para v1, pero vale notarlo.

4. **¿Subcapas / sub-indicadores por capa? (apertura 2026-05-19)** Tomás planteó que en `/mapa`, al activar una capa, el lector debería poder profundizar interactivamente en los datos que la componen. Ej.: precipitación tiene crecimiento del PBI como dimensión principal pero hay indicadores secundarios (inflación, inversión / PBI, deuda / PBI, productividad) que enriquecen la lectura. El patrón probablemente aplica a las 4 capas. Decisión a tomar dentro de cada Spec 42-45 sobre cómo se materializa visualmente: (a) chips en el tooltip de hover, (b) sección expandida en el reading drawer, (c) controles de "vista" dentro del LayerController, o combinación. Si se confirma como patrón general, extender el contrato `Layer` de Spec 39 con `subIndicators?: SubIndicator[]` en r3. **Nota registrada en Spec 39 r2 como decisión abierta #7.**

---

## Notas

- Este documento se actualiza con cada decisión cerrada (mover de "Decisiones abiertas" a "Decisiones cerradas" con fecha y rationale), cada spec mergeada (actualizar columna estado en la tabla), y cada pregunta abierta resuelta.
- Para detalle del mapa Torres García sobre el que se monta este epic: Spec 22.
- Para indicadores ya curados que pueden alimentar las capas: Specs 12A (12 indicadores) y 14A (24 indicadores).
- Para el patrón de calendario de agentes que inspiró este formato de epic: Spec 29.
