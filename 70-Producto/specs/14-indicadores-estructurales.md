# Spec 14 — Integración de indicadores estructurales (económicos y sociales)

**Estado:** marco general · pendiente decantar en 14A (curaduría — completada en sesión, ver archivo aparte) y 14B (pipeline)
**Depende de:** Spec 01 (arquitectura), Spec 09 §3 (Capa 1 — captura de visión)
**Hermana de:** Spec 10 (Latinobarómetro). Esta es la ejecución de la **Capa 1** lo que aquélla es para la Capa 2.
**No modifica:** Spec 12 (ficha-país LB), Spec 13 (comparativa LB). Convive con ambas — ver §7.
**Prioridad:** media — segunda fuente de datos cuantitativos del proyecto, posterior al ciclo LB. Post-v1.
**Tipo:** ingesta de datos + visualización editorial
**Tamaño estimado:** L (subdividido en 14A + 14B)
**Posición en roadmap:** después del cierre del ciclo Spec 11 + 12 + 13 + ajustes a v1.

---

## 1. Por qué este documento

La Spec 09 §3 capturó la idea "sumar indicadores económicos y sociales al mapa" como Capa 1 de la evolución post-v1: la de menor compromiso, revertible, que no cambia ni el producto ni la audiencia. Esta spec convierte esa captura en un marco accionable, sin todavía comprometerse con la curaduría definitiva ni con el pipeline ejecutado — esas decisiones quedan para 14A y 14B.

La intención es **ordenar la lógica de carga y actualización** de los principales indicadores estructurales antes de empezar a construir, igual que la Spec 10 ordena la integración del Latinobarómetro antes de las 12A/12B/13.

---

## 2. Posición editorial

La Spec 10 §1 estableció que el Latinobarómetro no se cita con reservas — se trata como representación científica legítima. Conviene declarar una posición simétrica para los indicadores estructurales, porque la naturaleza de las fuentes lo exige.

### 2.1. Los datos acompañan, no reemplazan

Mapa Inestable es un proyecto interpretativo. Los indicadores estructurales son **la huella material** de las transformaciones que el proyecto rastrea, no su explicación. La reprimarización no se demuestra con un gráfico de exportaciones de commodities: el gráfico la **muestra**; el análisis la nombra y la conecta con los ejes. El riesgo de empirismo está marcado en Spec 09 §3.4 — esta spec lo opera asumiendo que toda visualización va acompañada de lectura editorial (Spec 10 §11.2 ya estableció el patrón).

### 2.2. Trazabilidad como dato del proyecto

Un proyecto sobre desorientación epistemológica no puede operar sin trazabilidad. Cada indicador publicado declara, sin excepción:

- **Fuente primaria** (institución que produce el dato).
- **URL** del dataset o serie.
- **Fecha de la última observación** (no la fecha del pull).
- **Fecha del pull** (cuándo el pipeline lo trajo).
- **Metodología** (definición operativa, unidad, ámbito).

Esto es la versión "fuente primaria" de Spec 01 aplicada a datos cuantitativos.

### 2.3. Sudamérica como caso difícil

Spec 09 §3.4 lo señala: INDEC pre/post Macri, Venezuela con datos congelados, Bolivia con cambios metodológicos. La spec asume estas dificultades y las trata así:

- Donde hay quiebres metodológicos conocidos, el gráfico los marca con una línea vertical y nota.
- Donde la fuente nacional está cuestionada, se prefiere la fuente regional (CEPAL, FMI) sobre la oficial nacional, y se documenta la preferencia.
- Donde el dato no existe o está congelado (Venezuela post-2015 en muchos indicadores), se muestra la última observación válida con la leyenda "última observación disponible: AAAA".
- Cada datapoint puede declarar `quality` ∈ {`oficial`, `revisado`, `estimado`, `cuestionado`, `congelado`} para que la UI lo señale al lector.

Esta posición editorial es parte del trabajo, no un "caveat técnico". El propio cuestionamiento de la calidad de los datos públicos en Sudamérica es síntoma del eje **erosión de mediaciones** y se puede tematizar.

---

## 3. Alcance

### 3.1. Entra (v1)

- Importación curada de **24 indicadores estructurales** repartidos en 4 familias de 6 (sección 4 — set cerrado en sesión de curaduría, ver Spec 14A).
- Pipeline `build_indicators_macro.py` que pulla de las APIs públicas y produce `indicators-macro.json` estático committeado.
- Cobertura de los **10 países** que el proyecto cubre (los 17 de LB no aplican: Mapa Inestable es Sudamérica).
- Series históricas de **10-15 años** por indicador donde la fuente lo permite.
- Ficha-país agrega una sección **paralela** a "Pulso ciudadano" (Spec 12), llamada "Estructura material", que muestra los indicadores con sub-secciones por familia. Esta spec no modifica el contrato de Spec 12 — convive como sección hermana, idealmente debajo o lateral.
- **No se modifica Spec 13.** La comparativa LB se mantiene en su scope (17 países, edición 2024). Una comparativa macro equivalente queda planteada como **Spec 15 futura**, posterior al cierre de 14B y a una decisión sobre si conviene replicar el patrón de la 13 con un dataset de 10 países.

### 3.2. No entra (queda para v2 o más)

- Indicadores subnacionales (provincia, departamento, ciudad).
- Datos en frecuencia mensual con alertas (eso vive en territorio del dashboard de la Capa 3 de Spec 09).
- Composición de cruces multidimensionales tipo "informalidad por sexo y región".
- Indicadores de coyuntura financiera (riesgo país EMBI diario, tipos de cambio paralelos). La Spec 09 los mencionaba pero su frecuencia los pone más cerca de la Capa 3 que de la 1.

---

## 4. Las cuatro familias

Cada familia se elige porque alimenta directamente uno o más ejes y porque tiene fuente regional confiable con cobertura completa. La curaduría definitiva (qué 5-6 indicadores quedan dentro de cada familia, cuáles se descartan, por qué) se documenta en Spec 14A — acá se fija el marco.

### 4.1. A · Generación de riqueza e industrias

**Qué eje alimenta:** transversal, principalmente lectura material que sostiene los ejes culturales (la deculturación y la desrepresentación tienen anclajes en estructuras económicas; mostrarlas hace visible la base material sobre la que opera el resto).

**Conceptos del vault que toca:**
- [[../../35-Conceptos-clave/Reprimarización]] — composición sectorial del producto y de las exportaciones.
- [[../../35-Conceptos-clave/Financiarización]] — peso del sector financiero, ahorro vs inversión productiva.

**Indicadores tentativos (v1, sujetos a curaduría 14A):**

| # | Indicador | Unidad | Frecuencia | Fuente probable |
|---|-----------|--------|------------|-----------------|
| A1 | PBI per cápita PPP (USD constantes) | USD | anual | Banco Mundial WDI |
| A2 | Crecimiento real del PBI | % | anual | Banco Mundial WDI / CEPALSTAT |
| A3 | Composición sectorial del VAB (primario / manufacturero / servicios) | % | anual | Banco Mundial WDI |
| A4 | Productividad laboral (PBI / ocupado) | índice base 2010 | anual | OIT ILOSTAT / CEPAL |
| A5 | Inversión bruta interna / PBI | % | anual | Banco Mundial WDI / FMI WEO |
| A6 | Inflación IPC anual | % anual | anual | FMI WEO + reemplazo CEPAL para AR 2007-2015 y VE post-2014 |

### 4.2. B · Vínculos de comercio exterior

**Qué eje alimenta:** desrepresentación (la dependencia de un socio comercial dominante limita los grados de libertad de la política nacional) y deculturación (los ciclos de commodities marcan los horizontes posibles de proyecto colectivo).

**Conceptos del vault que toca:**
- [[../../35-Conceptos-clave/Hegemonía]] — concentración de destinos de exportación.
- [[../../35-Conceptos-clave/Equilibrio de Poder]] — peso relativo de China, EEUU, UE como socios.
- [[../../35-Conceptos-clave/Reprimarización]] — composición de la canasta exportadora.

**Indicadores tentativos:**

| # | Indicador | Unidad | Frecuencia | Fuente probable |
|---|-----------|--------|------------|-----------------|
| B1 | Exportaciones primarias / exportaciones totales | % | anual | UN COMTRADE / CEPAL |
| B2 | Cuota del principal socio comercial | % | anual | UN COMTRADE |
| B3 | Cuota de exportaciones a China | % | anual | UN COMTRADE |
| B4 | Cuota de exportaciones a EEUU | % | anual | UN COMTRADE |
| B5 | IED neta recibida / PBI | % | anual | UNCTAD / Banco Mundial |
| B6 | Deuda externa total / PBI | % | anual | Banco Mundial IDS / FMI |

### 4.3. C · Empleo y estructura del trabajo

**Qué eje alimenta:** desrepresentación (la informalidad expulsa a la mayoría del sistema de representación clásico vinculado a sindicatos y partidos de base obrera) y erosión de mediaciones (los sindicatos como mediación pierden peso cuando el trabajo informal supera la mitad del empleo).

**Conceptos del vault que toca:**
- [[../../35-Conceptos-clave/Poder Infraestructural]] — capacidad estatal de regular y registrar el trabajo.
- [[../../35-Conceptos-clave/Decadencia política]] — la fragmentación del trabajo precede la fragmentación de la representación.

**Indicadores tentativos:**

| # | Indicador | Unidad | Frecuencia | Fuente probable |
|---|-----------|--------|------------|-----------------|
| C1 | Tasa de desempleo abierto | % PEA | anual / trimestral | OIT ILOSTAT |
| C2 | Empleo informal / empleo total | % | anual | OIT ILOSTAT |
| C3 | Empleo asalariado registrado / empleo total | % | anual | CEPALSTAT |
| C4 | Empleo industrial / empleo total | % | anual | OIT ILOSTAT |
| C5 | Brecha de género en participación laboral | pp | anual | OIT ILOSTAT |
| C6 | Subocupación (horas) | % | anual | OIT ILOSTAT / fuentes nacionales |

### 4.4. D · Índices sociales

**Qué eje alimenta:** desrepresentación (la pobreza estructural deja a un sector de la población fuera de cualquier representación efectiva), erosión de mediaciones (la capacidad estatal materializa o no las mediaciones) y atención (la violencia urbana modela la atención cotidiana en buena parte del subcontinente).

**Conceptos del vault que toca:**
- [[../../35-Conceptos-clave/Poder Infraestructural]] — Mann: la capacidad del Estado de hacer presente su autoridad cotidiana.
- [[../../35-Conceptos-clave/Repatrimonialización]] — concentración del ingreso y captura del Estado.

**Indicadores tentativos:**

| # | Indicador | Unidad | Frecuencia | Fuente probable |
|---|-----------|--------|------------|-----------------|
| D1 | Pobreza (línea regional comparable) | % población | anual | CEPALSTAT |
| D2 | Indigencia (línea regional comparable) | % población | anual | CEPALSTAT |
| D3 | Coeficiente de Gini (ingreso) | índice | anual | Banco Mundial / CEPAL |
| D5 | Mortalidad infantil | por 1.000 nacidos vivos | anual | Banco Mundial / OPS |
| D6 | Homicidios | por 100.000 habitantes | anual | UNODC + OVV para VE post-2014 |
| D7 | Presión tributaria (proxy capacidad estatal) | % PBI | anual | CEPALSTAT / OECD |

**Set cerrado: 24 indicadores en 4 familias de 6.** Curaduría completa documentada en Spec 14A.

---

## 5. Fuentes — caracterización para diseño de pipeline

La diferencia clave con el LB es que acá hay **API pública** en la mayoría de los casos. Eso simplifica el pipeline pero introduce su propia complejidad: cada API tiene sus reglas.

| Fuente | Cobertura | Acceso | Latencia típica | Frecuencia | Notas operativas |
|--------|-----------|--------|------------------|-----------|------------------|
| **Banco Mundial WDI** | Universal | API REST pública con SDK Python (`wbdata`, `pandas-datareader`) | 12-18 meses (vintage) | Anual | Estable, históricos largos (1960+). Variable por código (`NY.GDP.PCAP.PP.KD`). Sin auth. |
| **CEPALSTAT** | LATAM | Descarga manual + API parcial | 12-24 meses | Anual | Idiosincracia regional bien resuelta (líneas de pobreza comparables). API documentada parcial; conviene plan B de descarga manual. |
| **FMI WEO / IFS** | Universal | API REST + SDMX | 6-12 meses | Anual / trimestral | Útil para deuda y proyecciones. SDMX requiere parseo. |
| **OIT ILOSTAT** | Universal | API REST + bulk download | 6-18 meses | Anual / trimestral | Variables consistentes para informalidad y empleo. Buena documentación. |
| **UN COMTRADE** | Universal | API REST con rate limit | 12 meses | Anual | Free tier limitado a queries chicas. Para volumen grande: BACI (académico, anual, ya consolidado). |
| **UNCTAD** | Universal | Descarga | 12 meses | Anual | IED y comercio. |
| **PNUD** | Universal | Descarga PDF + Excel | 12-24 meses | Anual | IDH como dato compuesto, no como serie reconstruida. |
| **UNODC** | Universal | Descarga | 18-24 meses | Anual | Homicidios. Latencia alta. |
| **OPS** | LATAM | API SUI parcial + descarga | variable | Anual | Salud pública regional. |

**Implicancia para el pipeline:** ningún indicador es de tiempo real. La cadencia de actualización tolera **un cron mensual** sin perder relevancia editorial. Donde la fuente actualiza una vez al año, el cron mensual simplemente no encuentra cambios — no es problema, es la realidad de la latencia oficial.

---

## 6. Modelo de pipeline (estático, mismo patrón que 12B)

Decisión ya tomada: el JSON estático committeado funcionó para LB y se replica acá. La complejidad mayor (multi-fuente, multi-frecuencia, manejo de calidad) se absorbe dentro del script, no en infraestructura externa.

### 6.1. Estructura propuesta

```
platform/data/indicators-macro/
├── raw/                                    (gitignored)
│   ├── worldbank/                          caches de pulls de WB
│   ├── cepalstat/                          dumps manuales periódicos
│   ├── ilostat/                            caches OIT
│   └── comtrade/                           caches comercio
├── build_indicators_macro.py               script principal, ~300-500 líneas
├── sources.py                              adaptadores por fuente (uno por API)
├── indicators-macro.json                   ✓ committed, ~100-200 KB estimado
├── README.md                               metodología + cómo correr
└── .gitignore
```

### 6.2. Schema propuesto del JSON

Mirror del schema de `indicators.json` (Spec 12B §5) con extensiones necesarias para macro:

```json
{
  "version": "macro-v1",
  "computed_at": "2026-05-09",
  "n_indicators": 24,
  "n_countries": 10,
  "indicators": [
    {
      "id": "pbi-pc-ppp",
      "label": "PBI per cápita (PPP, USD constantes 2017)",
      "family": "riqueza",
      "axis_primary": null,
      "axis_secondary": ["desrepresentacion"],
      "unit": "USD",
      "source": {
        "name": "Banco Mundial WDI",
        "code": "NY.GDP.PCAP.PP.KD",
        "url": "https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.KD",
        "pulled_at": "2026-05-09"
      },
      "methodology": "PPA, USD constantes de 2017",
      "by_country": {
        "AR": {
          "name": "Argentina",
          "latest": { "year": 2023, "value": 26505.4, "quality": "oficial" },
          "series": [
            { "year": 2014, "value": 24800.1, "quality": "oficial" },
            { "year": 2015, "value": 24503.7, "quality": "oficial" }
            // ... hasta 2023
          ]
        },
        "VE": {
          "name": "Venezuela",
          "latest": { "year": 2014, "value": 17834.2, "quality": "congelado" },
          "series": [ /* ... */ ],
          "notes": "Última observación oficial 2014; el INE no actualiza desde 2015."
        }
      }
    }
  ]
}
```

**Decisiones del schema:**
- `series` se incluye dentro del propio indicador, no en archivo aparte. 24 indicadores × 10 países × ~15 años ≈ 3.600 datapoints. Cabe en <200 KB minificado.
- `quality` por datapoint, no por país. Permite marcar un solo año cuestionado sin invalidar la serie.
- `axis_primary` puede ser `null` cuando el indicador es contextual (como #12 en LB). `axis_secondary` admite múltiples ejes — los indicadores estructurales raramente alimentan un solo eje limpio.
- `pulled_at` fecha del pull, no de la observación. El consumidor puede mostrar ambas para que el lector entienda la latencia.

### 6.3. Lógica de actualización

```
build_indicators_macro.py
├── for each source in [WB, CEPAL, ILO, COMTRADE, UNCTAD, FMI, PNUD, UNODC]:
│     ├── connect (con retry + backoff)
│     ├── fetch only the variables we declare in INDICATORS
│     ├── cache raw response in raw/<source>/<date>/
│     └── normalize to (country, year, value, quality)
├── merge en estructura indicators-macro.json
├── validate:
│     ├── cobertura: cada indicador tiene los 10 países o documenta huecos
│     ├── monotonía: alertar saltos > 3σ entre observaciones consecutivas
│     ├── último año: alertar si la última observación es > 3 años atrás
│     └── unidades: chequeo dimensional (% no debe pasar de 100, índice 0-1, etc.)
├── compare contra última versión committeada → emite changelog.md
└── escribe indicators-macro.json
```

**Política de re-pull:**

| Disparador | Frecuencia |
|------------|------------|
| Cron mensual local | mensual, primer lunes |
| Liberación conocida de fuente (CEPAL Panorama Social anual ~diciembre, WB Update semestral) | manual cuando se sabe |
| Cierre editorial de despacho semanal donde hay análisis con cita explícita | manual antes de publicar |

El cron es un comodín; la última fila es la importante: cuando un análisis menciona un indicador, conviene refrescarlo antes de publicar. Esto se documenta como práctica editorial, no como automatización.

### 6.4. Cuándo NO conviene re-correr

Si una fuente cambia metodología (ej. CEPAL revisa la línea de pobreza), un re-pull mete una serie que no es comparable con la versión committeada anterior. El script debe detectarlo (cambio en el campo `methodology` de la fuente) y **no machacar el JSON**: pedir confirmación humana antes de reescribir. Esto preserva el principio de Spec 09 §3.4 sobre quiebres metodológicos.

---

## 7. Cómo se conecta con la UI

Las decisiones detalladas son de Spec 12 (ficha-país) y Spec 13 (comparativa). Acá se fija lo mínimo de contrato:

### 7.1. Ficha-país

La sección "Pulso ciudadano" hoy es la cara de los datos de LB. Se le suma una sección hermana **"Estructura material"** con cuatro sub-secciones (riqueza, comercio, empleo, sociales). Cada sub-sección muestra 5-6 indicadores como sparklines + valor actual + delta vs hace 5 años.

La spec 12 obligaba a un techo de 12 indicadores por la curaduría dura. Acá la sub-sección permite albergar más sin reventar la página: la jerarquía visual cambia.

### 7.2. Comparativa cross-país

**Esta spec no modifica Spec 13.** Spec 13 está scope-cerrada: 17 países, edición 2024, ranking por indicador LB. Mezclar 17 países (LB) con 10 países (macro) en la misma página rompe el contrato visual y temporal.

Cuando 14B esté ejecutada y haya 24 indicadores macro × 10 países disponibles, corresponde decidir si conviene una **Spec 15 (comparativa macro)** que replique el patrón de la 13 con su propio scope. La decisión se posterga: con material en mano la pregunta cambia ("¿qué patrón cross-país quiero exponer?"), y conviene tomarla con el JSON ya generado, no antes.

### 7.3. Mapa

Spec 09 §3.5 P1 dejó abierta la pregunta "¿el mapa unifica capas o las separa?". Esta spec **no la resuelve**: deja la pregunta marcada para que se decida cuando 14A esté cerrada y la estructura de datos sea concreta. Mi recomendación tentativa para no contaminar la decisión: empezar la implementación de v1 con los datos en `/datos` y en la ficha-país, **sin tocar el mapa**, y volver a la pregunta del mapa con el material concreto en mano.

---

## 8. Tensiones a anticipar (heredadas y nuevas)

### 8.1. De la Spec 09 §3.4

- **¿Mapa periodístico o mapa de datos?** Diferida a 14A. No se decide en esta spec.
- **Riesgo de empirismo.** Mitigado por la sección 2.1 (interpretación obligatoria) y por la separación visual entre la sección editorial de la ficha-país y la sección "Estructura material".
- **Calidad de fuentes.** Mitigada por el campo `quality` en el schema (sección 6.2) y por la política de fuentes regionales sobre nacionales cuando la nacional está cuestionada (sección 2.3).

### 8.2. Nuevas (específicas de la Capa 1)

- **Latencia oficial vs ritmo editorial.** El proyecto publica semanal; los datos llegan con 6-24 meses de rezago. Implica que un análisis de la semana **no puede citar el dato del último trimestre**, sino el dato más reciente disponible. La UI tiene que dejar esta latencia visible para que no parezca obsolescencia.
- **Comparabilidad entre países.** Países con sistemas estadísticos heterogéneos (Argentina, Brasil, Chile altos · Bolivia, Paraguay, Venezuela bajos) producen series de calidad desigual. Las fuentes regionales (CEPAL, OIT) homogenizan en parte, pero no totalmente. El campo `quality` es la herramienta para no esconder esa heterogeneidad.
- **Incentivo a la sobreinterpretación.** Tener 24 indicadores tienta a "buscar correlaciones". El proyecto no es estadístico; los indicadores están al servicio de la narrativa de los ejes, no al revés. La curaduría 14A es la salvaguarda principal contra esto.
- **Costos ocultos del JSON estático.** Para series de 15 años × 24 indicadores × 10 países, el JSON va a estar entre 100-200 KB. Sigue siendo razonable para un fetch único (la página comparativa lo carga entero). Si la spec creciera (50+ indicadores, series de 30 años), conviene revisar la decisión hacia un patrón híbrido o partición por familia.

---

## 9. Conexión con el corpus editorial existente

Los indicadores no llegan al proyecto desde afuera: son la base material de varios borradores y conceptos ya escritos. Esta lista no es exhaustiva; sirve como punto de chequeo para que la sección que genere el JSON sepa qué mirada tiene que sostener.

| Indicador (familia) | Concepto / borrador relevante |
|---------------------|-------------------------------|
| B1 Exportaciones primarias / total | [[../../35-Conceptos-clave/Reprimarización]] |
| B3 Cuota a China | [[../../60-Borradores/América Latina entre dos hegemonías]] |
| C2 Empleo informal | erosión de mediaciones — sindicatos como mediación menguante |
| D3 Gini | [[../../35-Conceptos-clave/Repatrimonialización]] |
| D7 Presión tributaria | [[../../35-Conceptos-clave/Poder Infraestructural]] |

La curaduría 14A revisa y completa esta lista.

---

## 10. Preguntas abiertas

| # | Pregunta | A resolver en |
|---|----------|---------------|
| 1 | ¿La curaduría definitiva queda en 24 indicadores o se recorta a 20-22? | 14A |
| 2 | ¿Cómo se manejan los indicadores donde el dato regional (CEPAL) y el nacional difieren significativamente? | 14A — definir política de prioridad |
| 3 | ¿Se usa `wbdata` (SDK no oficial pero estable) o requests directo a la API del Banco Mundial? | 14B |
| 4 | ¿Se publican series enteras (15 años) o solo los últimos 5 años en v1, dejando históricas para v2? | 14A |
| 5 | ¿La sección "Estructura material" reemplaza o convive con la sección de "Pulso ciudadano"? | Spec 12 (revisión post-14A) |
| 6 | ¿El mapa adopta capas con selector o se mantiene como vista editorial pura y los datos viven en `/datos`? | Decisión post-implementación 14A+14B |
| 7 | ¿Qué se hace con Venezuela — se incluye con datos congelados etiquetados, o se excluye explícitamente del comparativo en cada indicador? | 14A — política caso por caso |
| 8 | ¿El changelog que emite el script (sección 6.3) se publica como parte del feed editorial o queda interno? | 14B |

---

## 11. Secuencia sugerida

```
Etapa 0 (esta spec)
   ► Marco general acordado.
   ► No hay implementación.

Etapa 1 — Spec 14A (curaduría editorial)
   ► Para cada una de las 4 familias: ronda de candidatos amplios (~50-80
     entre las 4) y filtro con criterios ponderados (eje, fuerza narrativa,
     cobertura, comparabilidad — análogos a 12A §2).
   ► Output: subset definitivo de 20-25 indicadores con razones de inclusión
     y razones de descarte explícitas.
   ► Tamaño: M (1-2 días).

Etapa 2 — Spec 14B (pipeline)
   ► Implementación de build_indicators_macro.py.
   ► Validaciones: cobertura, monotonía, unidades, latencia.
   ► Output: indicators-macro.json validado y committeado.
   ► Tamaño: M-L (2-4 días, distribuidos por fuente).

Etapa 3 — UI (extensión Spec 12 + Spec 13)
   ► Sub-sección "Estructura material" en ficha-país.
   ► Vista comparativa extendida.
   ► Tamaño: M.

Etapa 4 — Decisión sobre el mapa
   ► Con datos en mano, recién ahí evaluar si conviene capas en el mapa
     o vista paralela /datos.
```

---

## 12. Garantías de trazabilidad

Un proyecto sobre desorientación epistemológica no puede operar sin trazabilidad declarada. Lo que la Spec 01 pidió para los eventos (fuente primaria + URL + fecha + autor obligatorios) tiene su versión cuantitativa en ocho mecanismos que aplican al pipeline 14B y que conviene fijar acá para que no queden a discreción del momento de implementación.

### 12.1. Schema obligatorio

Cada datapoint declara `source.name`, `source.code` (variable exacta del dataset), `source.url`, `pulled_at`, `methodology`, `quality`. El script falla si falta cualquiera. No hay valor sin procedencia. Schema completo en §6.2.

### 12.2. Pulls cacheados con timestamp

`raw/<fuente>/<fecha>/` guarda la respuesta cruda de cada pull, no solo el resultado normalizado. Si un dato se cuestiona meses después, queda reproducible el contexto del pull original. Es la diferencia entre confiar y poder defender.

### 12.3. Validación cruzada contra documento ancla

Patrón ya probado por Spec 12B con LB (validación ±1pp contra el PDF oficial). Para macro, cada fuente tiene un documento ancla equivalente — *World Development Report* del BM, *Panorama Social* de CEPAL, *World Economic Outlook* del FMI, *Informe Mundial sobre Drogas* de UNODC. La 14B incluye validación contra ese ancla por indicador, no contra "lo que devuelve la API". Si API y documento divergen, el script falla y pide intervención humana.

### 12.4. Diff vs versión committeada anterior

Cada re-pull genera changelog: qué datapoints cambiaron, en cuánto, en qué dirección. Cambios mayores a un umbral (3σ histórico de la serie, o 5pp absolutos para %) salen como warnings y no se aceptan automáticamente. Detecta tanto correcciones legítimas de la fuente como errores del propio pull.

### 12.5. Detección de quiebres metodológicos

El campo `methodology` se hashea por pull. Si una fuente cambia metodología, el hash cambia y el script **rehúsa machacar el JSON**. Pide intervención humana: nueva serie reemplaza, convive como serie B, o se rompe en dos series con marca temporal.

### 12.6. Política regional > nacional, escrita

Decisión ya tomada (§2.3): cuando hay divergencia BM/CEPAL vs INDEC/INE, gana la regional con documentación de la diferencia. Evita que el dato cambie porque alguien decidió "esta vez parece más razonable la oficial". La política se escribe en el README del pipeline.

### 12.7. Trazabilidad pública en la UI

Cuando un análisis cite un indicador, la ficha-país muestra `source.url` directo. El lector puede chequearlo. Es control de calidad distribuido — el sistema más fuerte que existe para mantener honesta una fuente, porque cualquiera puede ponerla en duda con un click.

### 12.8. Política editorial de uso pre-publicación

Antes de citar un indicador en un despacho semanal, el flujo es: re-pull manual de ese indicador específico → diff contra el JSON committeado → si cambió, re-validar contra documento ancla → publicar. Tres minutos por indicador citado. No es automatización, es disciplina operativa que el proyecto asume como parte del proceso.

### 12.9. Lo que estos mecanismos NO garantizan

Que la fuente original esté bien medida. Banco Mundial puede publicar mal, OIT puede tener un error, CEPAL puede arrastrar un dato nacional viciado sin advertirlo. Para eso el único mecanismo es **leer el dato con sospecha estructural cuando se mueve fuerte**: leer el comunicado de la fuente, leer la nota técnica de las revisiones retroactivas. Trabajo editorial que no se automatiza.

---

## 13. Indicadores compuestos descartados explícitamente

Para que la decisión quede documentada y no haya que re-debatirla cuando aparezca otro candidato similar, dejo lista cerrada de los compuestos evaluados y la razón de exclusión.

| Indicador | Fuente | Razón de exclusión |
|-----------|--------|---------------------|
| IDH (Índice de Desarrollo Humano) | PNUD | Compuesto. Sus tres dimensiones (mortalidad, educación, ingreso) ya están cubiertas por separado en el set. Promedio aritmético entre dimensiones inconmensurables. |
| Herfindahl de exportaciones | UNCTAD | Compuesto. La concentración exportadora la cuentan B1 (% primarias) + B2 + B3 + B4 (top socios) sin esconder composición. |
| V-Dem / Polity / Bertelsmann TI / WJP Rule of Law | Centros académicos | Compuestos. Lente liberal-democrático occidental. Si aparece necesidad editorial, se citan ad hoc, no entran al tablero. |
| **Ease of Doing Business (EDB)** | Banco Mundial | **Descontinuado en septiembre 2021** tras investigación WilmerHale por manipulación deliberada de rankings (China, Arabia Saudita, Azerbaiyán, EAU). El sucesor B-READY cubre solo 50 países en oleada 2024 (Sudamérica: Chile, Colombia, Perú; resto en oleadas posteriores). Doble razón de exclusión: cobertura insuficiente + compuesto. **El propio escándalo del EDB es material editorial** sobre el eje erosión de mediaciones — vale guardarlo como disparador eventual, no como dato de tablero. |
| Índice de Libertad Económica (Heritage / Fraser) | Think tanks libertarios | Compuesto + sesgo institucional explícito. No entra. |
| Riesgo país EMBI | JPMorgan | Latencia diaria, dato de mercado. Pertenece a Capa 3 (risk management) — la advertencia de Spec 09 §8 sobre resistir Capa 3 entrando por la puerta de atrás aplica directamente. |

La regla de exclusión es **observaciones primarias sobre compuestos**, con única excepción declarada del Gini (no tiene sustituto operativo para comparar países).

---

## 14. Notas finales

**Una.** El precedente del Latinobarómetro funcionó porque la curaduría editorial (12A) precedió al pipeline (12B). Acá conviene mantener el orden: 14A antes que 14B. La tentación de empezar por el pipeline porque "los datos están en API" omite el paso editorial que hace que estos datos cuenten una historia y no sean ruido.

**Dos.** La calidad heterogénea de los datos sudamericanos no es un problema técnico — es parte del fenómeno que el proyecto rastrea. Que Venezuela tenga datos congelados, que Argentina tenga un quiebre INDEC, que Bolivia haya cambiado metodología, es información sobre la erosión de las mediaciones estadísticas como capa de mediación social. La spec lo trata declarativamente con `quality`, pero el proyecto puede tematizarlo editorialmente.

**Tres.** Esta spec es estrictamente Capa 1 de la Spec 09. Cuando empiece a tentar "agregar alertas, scoring compuesto, riesgo país agregado", esa tentación es Capa 3 (risk management) entrando por la puerta de atrás. Vale resistir hasta que la decisión de Capa 3 se tome de frente — es la advertencia explícita de Spec 09 §8.

**Cuatro.** Esta spec **no entra en conflicto con specs 11-13**, que están en ejecución activa. La 11 (home) explícitamente postergó "atlas + indicadores" a post-v1. La 12 (pulso ciudadano) define una sección de la ficha-país que esta spec complementa con una sección hermana, no la sobrescribe. La 13 (comparativa LB) mantiene su scope cerrado de 17 países × 12 indicadores LB. Toda extensión comparativa de macro queda como Spec 15 futura.

---

**Fecha de captura:** 9 mayo 2026
**Curaduría completada:** 9 mayo 2026 — ver Spec 14A.
**Próxima iteración:** Spec 14B (pipeline) cuando v1 esté estable y se decida arrancar.
