# Spec 10 — Integración Latinobarómetro

**Estado:** marco general · ejecución concreta en specs 12, 12A, 12B, 13
**Depende de:** Spec 01 (arquitectura), Spec 04 (páginas de eje), Spec 09 (visión — capa 2)
**Prioridad:** media — primera fuente de datos cuantitativos del proyecto
**Tipo:** ingesta de datos + visualización editorial

**Implementación concreta — oleada 2024:**
- [Spec 12](12-pulso-ciudadano-ficha-pais.md) — Pulso ciudadano en la ficha de país (UI pendiente)
- [Spec 12A](12A-curaduria-12-indicadores.md) — Curaduría de los 12 indicadores ✓
- [Spec 12B](12B-pipeline-lb2024.md) — Pipeline de microdatos ✓
- [Spec 13](13-pagina-comparativa-paises.md) — Página comparativa cross-país (post-Spec 12)

---

## 1. Por qué Latinobarómetro

Latinobarómetro es la única encuesta de opinión pública continental con cobertura completa de los 10 países que cubre Mapa Inestable, periodicidad regular (anual con interrupciones, oleadas desde 1995), y batería de preguntas estable a lo largo del tiempo que permite **series comparables**.

Para el marco conceptual del proyecto, las encuestas son la fuente de datos **más coherente** que existe: miden percepciones colectivas, que es exactamente el territorio donde operan los 6 ejes (representación, mediación, atención, desorientación). Mientras que indicadores macroeconómicos describen procesos materiales que el proyecto **interpreta**, las encuestas miden directamente lo que el proyecto rastrea.

### Posición editorial

El Latinobarómetro no es una fuente sospechosa que se cite con reservas. Es una **representación científica y válida de la opinión del pueblo latinoamericano respecto a las instituciones de la democracia**, con tres décadas de tradición metodológica, financiamiento institucional sólido y cobertura continental ininterrumpida. Esta spec parte de esa premisa: los datos del Latinobarómetro son evidencia legítima, no objeto de sospecha sistemática.

Más aún: **el hecho mismo de que estos datos se produzcan, circulen y se discutan es información** — no solo respecto de lo que miden, sino respecto de cómo una sociedad se piensa a sí misma. La existencia del Latinobarómetro como institución productora de saber regional es parte del fenómeno que el proyecto rastrea: que se mida la confianza en partidos cada año, que se publique, que circule en medios, que se cite en discursos políticos, es un hecho del campo de la representación tanto como los números que arroja. La encuesta es a la vez **fuente y objeto** del análisis.

Esta posición tiene consecuencias prácticas en el diseño: los datos se publican sin caveats defensivos sobre la fuente; se publican con interpretación editorial (sección 11.2); y se consideran legítimos como disparadores estadísticos del flujo editorial (sección 9).

### Encuadre técnico

Esta spec registra cómo se incorpora la fuente al sitio: qué preguntas se importan, cómo se procesan, cómo se publican respetando trazabilidad, y cómo se conectan con el corpus editorial.

Es la primera ejecución concreta de la **capa 2** definida en Spec 09 (visión próximo desarrollo). Implementar esta spec implica salir de la etapa 0 — vale decisión consciente de Tomás antes de avanzar.

---

## 2. Estado del Latinobarómetro

### 2.1. Qué es

Encuesta anual gestionada por la Corporación Latinobarómetro (sede en Santiago de Chile), financiada por una mezcla de fundaciones y organismos multilaterales. Cobertura: 18 países de América Latina. Tamaño muestra típico: ~1.000-1.200 entrevistas presenciales por país.

Sitio web: https://www.latinobarometro.org

### 2.2. Lo que hay disponible

- **Microdatos** (cuestionarios anonimizados a nivel individual) en formato Stata (.dta) y SPSS (.sav). Descarga gratuita previo registro.
- **Online Analysis** (cruces simples vía web).
- **Reportes anuales** en PDF con análisis curado por la Corporación.
- **Codebooks** que documentan cada pregunta, escala, valores válidos.

### 2.3. Lo que NO hay

- API REST. Los datos se descargan como archivos.
- Latencia rápida. Una oleada se libera meses después del trabajo de campo.
- Cobertura completa en cada oleada. Hay países que faltaron en algunos años (ej: Venezuela en oleadas recientes).

### 2.4. Periodicidad real

Verificación necesaria al implementar:

- 1995-2018: anual sin interrupción.
- 2019-2020: interrumpido (no salió oleada por causas administrativas).
- 2020-2023: relanzado con financiación BID, oleadas anuales.
- 2024+: estado actual a confirmar al momento de implementar.

Para v1 conviene importar las **3 últimas oleadas disponibles** (cobertura suficiente para series cortas) y agregar las anteriores en sucesivas ingestas.

---

## 3. Alcance

### 3.1. Entra (v1)

- Descarga manual y curaduría de las **3 últimas oleadas** del Latinobarómetro.
- Importación selectiva de un subset de **~20-25 preguntas** mapeadas a los 6 ejes del proyecto (curaduría en sección 4).
- Pipeline de conversión Stata/SPSS → CSV → Postgres.
- Tabla `survey_responses` agregada a nivel país-año (no microdatos individuales).
- Visualización en página de país y página de eje.
- Trazabilidad: cada dato muestra pregunta exacta, oleada, fecha de campo, n, fuente.

### 3.2. Queda fuera (v2+)

- Microdatos individuales para análisis estadístico avanzado. Solo agregados.
- LAPOP (otra encuesta continental) — spec aparte.
- Encuestas nacionales (Cadem, Datafolha, etc.) — spec aparte.
- Visualización predictiva o ML sobre datos. Solo descriptivo.
- Score compuesto que combine encuestas con macro. Spec aparte (relacionado con Spec 09 capa 3).

---

## 4. Curaduría de preguntas

No se importa todo el cuestionario. Se selecciona el subset relevante para los 6 ejes. Esta es **decisión editorial**, no técnica — la importa Tomás revisando el codebook de la última oleada.

Propuesta de mapping inicial (a validar con codebook):

### 4.1. Para Desrepresentación

| Pregunta (descripción) | Código típico | Por qué |
|---|---|---|
| Confianza en partidos políticos | `P14STGBS_E` | Núcleo del eje |
| Confianza en el Congreso | `P14STGBS_C` | Idem |
| Identificación con un partido | `P25ST` | Mide pertenencia política |
| ¿Cuán democrático es el país? | `P22ST_A` | Percepción del régimen |

### 4.2. Para Erosión de mediaciones

| Pregunta | Código típico | Por qué |
|---|---|---|
| Confianza en sindicatos | `P14STGBS_F` | Mediación clásica |
| Confianza en la iglesia | `P14STGBS_G` | Mediación cultural |
| Confianza en los medios | `P14STGBS_H` | Mediación informacional |
| Confianza interpersonal | `P12ST` | Capital social |

### 4.3. Para Desorientación epistemológica

| Pregunta | Código típico | Por qué |
|---|---|---|
| Principal fuente de información política | `P11ST` | Ecosistema mediático |
| Confianza en redes sociales como fuente | `P14NCBR` | Reemplazo de mediadores |
| Percepción de noticias falsas (si existe) | varía | Verdad/incertidumbre |

### 4.4. Para Atención

Latinobarómetro mide poco directamente la atención. Aproximaciones:

| Pregunta | Código típico | Por qué |
|---|---|---|
| Frecuencia de consumo de noticias | `P11STA` | Tiempo dedicado |
| Uso de redes sociales (frecuencia) | varía | Mediación algorítmica |

### 4.5. Para Deculturación

| Pregunta | Código típico | Por qué |
|---|---|---|
| Identificación nacional (orgullo) | varía | Pertenencia cultural |
| Religiosidad (autoidentificación) | varía | Marco normativo |

### 4.6. Para Estetización

Latinobarómetro **no mide bien** este eje. Es más un fenómeno cultural difuso que una creencia o conducta declarable. Aceptar la limitación: no forzar mapeo.

### 4.7. Total estimado

~20-25 preguntas. La curaduría definitiva la cierra Tomás revisando el codebook real. Esta sección es **propuesta**, no decisión.

---

## 5. Pipeline de ingesta

### 5.1. Pasos

```
1. Descarga manual
   - Tomás se loguea en latinobarometro.org
   - Descarga el archivo .dta de la oleada deseada
   - Descarga el codebook PDF correspondiente
   - Guarda en platform/data/raw/latinobarometro/[ola_año]/

2. Conversión a CSV
   - Script: platform/scripts/convert-latinobarometro.ts
   - Usa pyreadstat (Python) o haven (R) para leer .dta
   - Aplica filtro: solo las preguntas curadas (sección 4)
   - Aplica filtro: solo los 10 países de Mapa Inestable
   - Genera platform/data/processed/latinobarometro/[ola]/responses.csv

3. Agregación a nivel país-año
   - Script: platform/scripts/aggregate-survey.ts
   - Para cada (pregunta, país, año): calcular % por categoría de respuesta
   - Manejo de NS/NC: registrar pero no contar como categoría
   - Genera responses_aggregated.csv

4. Carga a Postgres
   - Migration con tablas (sección 6)
   - Script: platform/scripts/load-survey.ts
   - Idempotente: si la oleada ya está cargada, actualiza no duplica

5. Verificación
   - Endpoint /admin/data/latinobarometro lista oleadas cargadas
   - Comparación rápida con reporte oficial de Latinobarómetro
     para detectar errores de import
```

### 5.2. Cuándo se ejecuta

Manual. Cada vez que sale una oleada nueva, Tomás corre el pipeline. Latinobarómetro libera 1-2 oleadas por año, no requiere automatización.

### 5.3. Versionado

Cada oleada es un release distinto. La tabla `survey_waves` registra qué se cargó y cuándo. Si una oleada se reprocesa (corrección), se versiona con `wave_id` distinto y se mantiene el histórico.

---

## 6. Modelo de datos

```sql
-- Una oleada de encuesta
survey_waves (
  id                  serial PK
  source              text    -- 'latinobarometro' | 'lapop' | etc.
  wave_year           int
  fieldwork_start     date
  fieldwork_end       date
  countries_covered   text[]  -- array de country_slug
  metodologia_url     text
  codebook_url        text
  loaded_at           timestamp
  notes               text
)

-- Una pregunta del cuestionario
survey_questions (
  id                  serial PK
  wave_id             int FK
  question_code       text    -- ej: 'P14STGBS_E'
  question_text       text    -- texto completo en español
  axis_relacionado    text[]  -- array de axis_slug; puede ser >1
  scale               text    -- 'likert_1_4' | 'binary' | 'percentage' | etc.
  valores_validos     jsonb   -- {"1": "Mucho", "2": "Algo", ...}
)

-- Respuesta agregada a nivel país-año
survey_responses (
  id                  serial PK
  question_id         int FK
  country_slug        text
  wave_year           int
  category            text    -- ej: "Mucho/Algo confianza" o "Sí" o "Nada"
  pct                 numeric -- porcentaje
  n_respondents       int
  margin_error        numeric -- si aplica
  computed_at         timestamp
)

-- Índice por consulta típica
CREATE INDEX idx_survey_country_year
  ON survey_responses (country_slug, wave_year);
```

**Decisión:** se almacena agregado por país-año, no respuesta individual. Suficiente para visualización, simplifica privacidad y volumen.

---

## 7. Visualización en el sitio

### 7.1. Página de país (Spec 01.5.4)

Sumar nueva sección **"Indicadores de percepción"** después del bloque "Ejes crónicos":

```
┌─────────────────────────────────────────────────────────────┐
│   INDICADORES DE PERCEPCIÓN · LATINOBARÓMETRO              │
│                                                             │
│   ┌─ Confianza en partidos ──────────────────────────────┐ │
│   │  2018 ▆▆▅▄▃▂▂  2024                                 │ │
│   │  Cayó de 28% a 11% en los últimos 6 años            │ │
│   │  Última medición: oleada 2024 · n=1.200             │ │
│   │  Pregunta exacta: ¿Cuánta confianza tiene en…?      │ │
│   │  Fuente: Latinobarómetro 2024 ↗                     │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌─ Confianza interpersonal ────────────────────────────┐ │
│   │  …                                                    │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                             │
│   …                                                         │
└─────────────────────────────────────────────────────────────┘
```

Cada card:
- Sparkline histórica.
- Texto interpretativo de 1-2 líneas (curado, no autogenerado).
- Metadata de trazabilidad expandible.
- Link al codebook si existe.

### 7.2. Página de eje (Spec 04)

Sumar bloque **"Indicadores asociados"** que muestra series para cada país donde la encuesta toca el eje:

```
┌─────────────────────────────────────────────────────────────┐
│   INDICADORES ASOCIADOS                                     │
│   Datos de Latinobarómetro relacionados con este eje.       │
│                                                             │
│   ┌─ Confianza en partidos políticos ────────────────────┐ │
│   │  Tabla compacta:                                       │ │
│   │  País      2020  2021  2022  2023  2024  Tendencia   │ │
│   │  AR        15%   13%   11%   9%    8%    ▼▼▼         │ │
│   │  BR        22%   20%   17%   16%   14%   ▼▼          │ │
│   │  …                                                    │ │
│   └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 7.3. Dashboard / home (capa 2 de Spec 09)

Si se implementa el arquetipo B.1 (tira de contexto) o B.3 (capas del mapa) del rediseño de home:

- B.1: una de las cards de la tira es "Confianza en partidos · LATAM".
- B.3: una de las capas del mapa es "Confianza en partidos por país".

### 7.4. Análisis individual (opcional)

Cuando un análisis cita un dato del Latinobarómetro, se renderiza con un componente de "evidencia" (citation block extendido) que muestra el dato + sparkline + trazabilidad. Nunca un número suelto.

---

## 8. Trazabilidad

Cada dato publicado debe declarar:

1. **Fuente:** "Latinobarómetro [año]"
2. **Pregunta exacta:** texto completo en español, no solo el código.
3. **Categoría agregada:** qué se sumó (ej: "respuestas 'Mucho' + 'Algo' confianza").
4. **N de respondentes:** cantidad de entrevistas en ese país-año.
5. **Fecha de campo:** rango de fechas de la entrevista.
6. **Link al codebook:** PDF público de la oleada.
7. **Nota metodológica:** si aplica (cambio de muestreo, redefinición de pregunta, etc.).

Implementación: componente `<SurveyDataCitation>` que se renderiza con cada dato, expandible al click. **Visible y obligatorio**, no nota al pie.

Esta es la versión "fuente primaria" de Spec 01 aplicada a datos. Mismo principio: la trazabilidad es estructural, no opcional.

---

## 9. Conexión con el corpus de análisis

### 9.1. Disparadores estadísticos

Cuando una pregunta cambia significativamente entre oleadas (umbral configurable, ej: caída ≥10pp), se genera **automáticamente** un disparador en el inbox del editor (Spec 01.6.3 / Spec 02 — motor IA).

Formato del disparador:

```
[disparador estadístico] La confianza en partidos cayó 12pp en Argentina
                        entre Latinobarómetro 2022 y 2024.
                        Eje sugerido: Desrepresentación
                        País: Argentina
                        → ver pregunta · → crear análisis · → archivar
```

Esto convierte a la encuesta en **fuente activa de disparadores**, no solo material de fondo.

### 9.2. Citación desde análisis

El editor de análisis (Spec 01.6.1) suma un nuevo campo opcional:

```
fuentes_estadisticas: [{
  source: 'latinobarometro',
  question_code: 'P14STGBS_E',
  country_slug: 'ar',
  wave_year: 2024,
  finding_text: 'Confianza cayó al 8%, mínimo histórico'
}]
```

El análisis publicado renderiza estas citas con el componente de Sección 8.

### 9.3. Cross-linking

Una página de pregunta (`/datos/encuesta/[question_code]`) lista todos los análisis que la citaron, ordenados cronológicamente. Esto convierte cada pregunta en un nodo navegable del corpus.

Decisión: implementar `/datos/encuesta/[code]` o no en v1. Recomendación: **no en v1**. Puede ser v2 si emerge la necesidad.

---

## 10. Decisiones pendientes

| # | Decisión | A resolver |
|---|----------|-----------|
| 1 | Cuáles son las 3 oleadas exactas a importar inicialmente | Tomás, al ejecutar |
| 2 | Curaduría definitiva de preguntas (validar tabla sección 4 contra codebook real) | Tomás |
| 3 | Umbral para "cambio significativo" en disparador estadístico | Tomás (recomendación: 10pp) |
| 4 | ¿Se publica el % o también el "n / n total"? | Tomás (recomendación: solo %, n al expandir) |
| 5 | ¿Se muestra margen de error visual (banda de confianza en sparkline)? | Tomás (recomendación: sí, opacity 0.2) |
| 6 | ¿Idioma de la pregunta exacta: español original o traducción si la pregunta varía entre países? | Tomás |
| 7 | ¿Hay un texto pedagógico en `/acerca` o `/metodo` sobre cómo se usan datos de encuestas? | Tomás (recomendación: sí, conecta con la trazabilidad) |

---

## 11. Riesgos y mitigaciones

### 11.1. Sesgos del Latinobarómetro

La encuesta tiene problemas conocidos:
- Cobertura urbana sobrerrepresentada en algunos países.
- Cambios metodológicos entre oleadas (en 2018 hubo cambio de proveedor de campo).
- Cobertura intermitente de Venezuela post-2018.

**Mitigación:** documentar limitaciones en `/acerca` o en una página `/datos/sobre-encuestas`. No esconder los problemas — exponerlos refuerza la trazabilidad del proyecto.

### 11.2. Interpretación editorial obligatoria

Por decisión editorial, ningún dato se publica solo: siempre va acompañado de interpretación curada de 1-2 líneas que dice qué leer del número.

**Esto no es defensa frente a la fuente** — la posición editorial sobre el Latinobarómetro está fijada en sección 1 — sino consecuencia de que el proyecto es **interpretativo, no descriptivo**. Mostrar un sparkline sin texto rompe la voz: deja al dato sin lector y al lector sin marco.

La interpretación incluye, cuando aplica, mencionar limitaciones específicas de la pregunta o de la oleada (cobertura, cambios metodológicos, comparabilidad entre años). No para invalidar el dato, sino para que el lector tenga el contexto técnico completo. Esa información es parte de la trazabilidad (sección 8), no caveat defensivo.

### 11.3. Sobre-cuantificación del proyecto

Riesgo de que los datos pasen a dominar visualmente y el proyecto pierda su voz interpretativa.

**Mitigación:** la curaduría de centralidad en el dashboard (Spec home revisada) define que los datos son **contexto**, no protagonista. Si en algún momento los datos dominan, retroceder.

---

## 12. Orden de implementación

```
Día 1   ► Acceso y descarga
          - Tomás registra cuenta en Latinobarómetro
          - Descarga 3 últimas oleadas (.dta + codebook)
          - Validar cobertura de los 10 países

Día 2   ► Curaduría de preguntas
          - Revisar codebook
          - Confirmar/ajustar tabla sección 4
          - Documentar mapping en archivo platform/data/latinobarometro-mapping.json

Día 3   ► Pipeline de conversión
          - Script convert-latinobarometro.ts
          - Filtrar países + preguntas curadas
          - Output a CSV procesado

Día 4   ► Schema + carga
          - Migrations (tablas survey_waves, survey_questions, survey_responses)
          - Script aggregate-survey.ts
          - Script load-survey.ts
          - Carga de las 3 oleadas

Día 5   ► Componentes de visualización
          - Componente SurveyCard (sparkline + texto + metadata)
          - Componente SurveyDataCitation (trazabilidad expandible)
          - Componente SurveyTableByCountry (matriz país × año)

Día 6   ► Integración en página de país y eje
          - Sección "Indicadores de percepción" en /pais/[slug]
          - Bloque "Indicadores asociados" en /ejes/[slug]
          - Texto interpretativo curado por Tomás (decisión editorial, no
            autogenerado)

Día 7   ► Disparadores estadísticos (opcional v1)
          - Lógica de detección de cambios significativos
          - Inserción en inbox de editor (Spec 01.6.3)
          - Si no se hace en v1, dejar tabla con `notable_changes`
            para implementar después

Día 8   ► Documentación pública
          - Página /datos/sobre-encuestas (limitaciones, metodología,
            relación con el método del proyecto)
          - Link desde /acerca y /metodo
          - Texto curado por Tomás
```

---

## 13. Criterios de aceptación

- [ ] Las 3 últimas oleadas del Latinobarómetro están cargadas en Postgres con cobertura de los 10 países.
- [ ] La curaduría de preguntas está documentada en un archivo versionado (`latinobarometro-mapping.json`).
- [ ] Cada `/pais/[slug]` muestra al menos 4 indicadores con sparkline histórica y trazabilidad expandible.
- [ ] Cada `/ejes/[slug]` muestra una tabla país × año de las preguntas asociadas al eje.
- [ ] Cada dato publicado declara: pregunta exacta, n, fecha de campo, link al codebook.
- [ ] Existe la página `/datos/sobre-encuestas` con limitaciones y metodología.
- [ ] El editor de análisis acepta `fuentes_estadisticas` como campo opcional.
- [ ] Cero datos sin trazabilidad: ningún número en el sitio sin fuente cliclable.

---

## 14. Histórico de la incorporación

Esta sección registra cronológicamente las decisiones tomadas sobre la integración. Se actualiza con cada paso, no se reescribe:

```
Mayo 2026 — Decisión inicial: integrar Latinobarómetro como primera
            fuente de datos cuantitativos del proyecto.
            Contexto: capa 2 de Spec 09 (visión próximo desarrollo),
            disparada por el rediseño de home como dashboard.

Mayo 2026 — Posición editorial confirmada por Tomás:
            (a) Latinobarómetro es representación científica y válida
                de la opinión latinoamericana sobre las instituciones
                democráticas. No se cita con reservas.
            (b) La existencia y circulación de los datos es ella misma
                información sobre cómo la región se piensa a sí misma.
                La encuesta es fuente y objeto del análisis.
            Esta posición moldea la sección 1 (justificación) y la
            sección 11.2 (que pasó de "riesgo de reproducir desorientación"
            a "interpretación editorial obligatoria sin caveat defensivo").

— pendiente —
```

(Cada milestone futuro suma una entrada acá: cuándo se cargó cada oleada, qué cambió en el mapping, qué descubrimientos se hicieron al revisar los datos. Es el log editorial de la integración, no la documentación técnica.)
