# Spec 14A — Curaduría definitiva de los 24 indicadores estructurales

**Estado:** ✓ cerrada · curaduría definitiva
**Anexo de:** [Spec 14](14-indicadores-estructurales.md)
**Tipo:** documento de decisión editorial
**Producto:** subset definitivo de 24 indicadores económicos y sociales para la sección "Estructura material" de la ficha-país
**Posición en roadmap:** post-v1, después del cierre del ciclo 11 + 12 + 13.

---

## 1. Contexto

Spec 14 §4 propuso 24 indicadores tentativos repartidos en 4 familias. Esta spec documenta la curaduría definitiva tras la sesión de mayo 2026 que cerró cuatro políticas de marco y cuatro decisiones de detalle.

El universo de partida fueron las cuatro familias económicas y sociales nombradas en Spec 09 §3.1 (Capa 1) más los conceptos del vault que el proyecto ya usa. La pregunta que la curaduría tenía que responder no era "qué indicadores existen" — la respuesta a esa son los miles que publica el Banco Mundial — sino "qué subset sostiene las lecturas estructurales que el proyecto necesita sin caer en empirismo".

## 2. Criterios de ponderación aplicados

Mismo esquema que Spec 12A §2. Cada candidato evaluado en cuatro dimensiones con pesos distintos para macro respecto a LB.

| Dimensión | Peso | Qué mide |
|---|---|---|
| **Eje** | 30% | Qué tan directamente alimenta uno de los 6 ejes de Mapa Inestable (peso menor que en LB porque varios indicadores macro son de contexto material, no de eje puro). |
| **Fuerza narrativa** | 30% | Capacidad de sostener lecturas estructurales del proyecto: reprimarización, sándwich geopolítico, erosión del trabajo formal, capacidad estatal, estabilidad macro. |
| **Disponibilidad por país** | 25% | Cobertura para los 10 países sudamericanos (peso mayor que en LB porque las fuentes macro tienen huecos sistémicos en VE, BO, PY). |
| **Comparabilidad temporal** | 15% | Series de 10-15 años o más, sin quiebres metodológicos masivos. |

## 3. Políticas de marco (aplicables a los 24)

Cuatro decisiones que se aplican consistentemente a todo el set y que explican por qué algunos candidatos quedaron afuera.

### 3.1. Fuente regional sobre nacional

Cuando hay divergencia entre fuente regional (CEPAL, Banco Mundial, OIT, FMI) y oficial nacional (INDEC, IBGE, INE, etc.), gana la regional con documentación de la diferencia. La elección no es por "objetividad" — es por **comparabilidad** y por evitar arrastrar series intervenidas (Argentina 2007-2015) o congeladas (Venezuela 2014+) sin advertencia.

Implicancia operativa: el pipeline 14B prioriza endpoints regionales por defecto. Cuando el regional no está disponible (CEPALSTAT más lento que WB), se acepta el WB que a su vez consume del nacional armonizado.

### 3.2. Venezuela adentro con `quality: congelado`

Venezuela aparece en la lista de los 10 países con la última observación válida hasta el momento del corte y leyenda visible ("última observación: 2014"). Excluirla en cada indicador donde el dato está congelado borraría al país del análisis estructural justo cuando es más relevante para el proyecto (caso paradigmático de erosión).

Para homicidios, donde existe una fuente alternativa robusta (OVV, ONG nacional), se usa con `quality: estimado`. Para macro donde solo hay estimación FMI, se usa con `quality: estimado` también. Para indicadores donde no hay fuente alternativa (Gini reciente, informalidad reciente), se mantiene la última oficial con `quality: congelado`.

### 3.3. Solo observaciones primarias

Excluidos compuestos como IDH, Herfindahl, V-Dem, EDB, B-READY, Heritage Index, EMBI. Excepción única: Gini, porque no tiene sustituto operativo para comparar países y porque su fórmula es transparente.

Los compuestos comprimen información y, en proyecto interpretativo, comprimen mal: ocultan composición y vuelven mecánica la lectura. El proyecto se distingue por su mirada (Spec 09 §8 nota uno) — usar índices compuestos prefabricados por otros borra esa mirada.

### 3.4. Series 10-15 años

Cobertura del ciclo pos-2008 + pandemia + post-pandemia, que es el horizonte temporal del proyecto. JSON estimado en 100-200 KB. Los datapoints anteriores a ~2010 se postergan a v2 si aparece necesidad editorial.

## 4. Distribución resultante por familia

| Familia | # indicadores | Justificación |
|---|---|---|
| A · Generación de riqueza e industrias | 6 | Núcleo material del proyecto: PBI, crecimiento, composición sectorial, productividad, inversión, inflación. |
| B · Comercio exterior | 6 | Sándwich geopolítico China-EEUU + estructura de exportaciones + IED + deuda. |
| C · Empleo y estructura del trabajo | 6 | Erosión del trabajo formal como capa material de la desrepresentación. |
| D · Índices sociales | 6 | Capacidad estatal + violencia + pobreza + desigualdad. |
| **Total** | **24** | |

## 5. Subset definitivo — los 24 indicadores

### Familia A · Generación de riqueza e industrias (6)

#### A1 · PBI per cápita (PPP, USD constantes 2017)

- **Fuente primaria:** Banco Mundial WDI (`NY.GDP.PCAP.PP.KD`).
- **URL:** https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.KD
- **Frecuencia:** anual.
- **Eje:** ninguno directo — variable de contexto material.
- **Por qué:** ancla del tablero. Sin PBI per cápita, ningún otro indicador de la familia A se contextualiza.
- **Quality típica por país:** todos `oficial` salvo Venezuela `congelado` (última observación BM ~2014).

#### A2 · Crecimiento real del PBI

- **Fuente primaria:** Banco Mundial WDI (`NY.GDP.MKTP.KD.ZG`).
- **Frecuencia:** anual.
- **Eje:** ninguno directo.
- **Por qué:** par natural de A1. Distingue ciclos de los niveles. Útil para leer pos-2008 + pandemia + recuperación.

#### A3 · VAB sectorial (primario / manufactura / servicios)

- **Fuente primaria:** Banco Mundial WDI (`NV.AGR.TOTL.ZS`, `NV.IND.MANF.ZS`, `NV.SRV.TOTL.ZS`).
- **Frecuencia:** anual.
- **Estructura:** un indicador con tres sub-valores que suman 100%.
- **Eje secundario:** desrepresentación, deculturación (la base material del país).
- **Vault:** [[../../35-Conceptos-clave/Reprimarización]].
- **Por qué:** muestra desindustrialización en estructura del producto. Cuando manufactura cae y primario sube → reprimarización en valor. La lectura combinada con C4 (empleo industrial) cuenta la historia completa.

#### A4 · Productividad laboral (PBI / ocupado)

- **Fuente primaria:** OIT ILOSTAT (índice de productividad laboral, base 2010=100).
- **Frecuencia:** anual.
- **Eje secundario:** desrepresentación.
- **Por qué:** indicador derivado, declarado como tal en metodología. Cuando cae, la economía absorbe gente en sectores menos productivos — patrón sudamericano de las últimas dos décadas. Cierra la lectura A3 + A4 + C4.

#### A5 · Inversión bruta interna fija / PBI

- **Fuente primaria:** Banco Mundial WDI (`NE.GDI.FTOT.ZS`).
- **Frecuencia:** anual.
- **Eje:** ninguno directo.
- **Por qué:** condición material de cualquier transformación productiva. Países con inversión < 18% del PBI sostenida están en estancamiento estructural (Argentina, Venezuela, Bolivia en últimos años); países con inversión > 22% están en transformación (Chile periodos altos, Perú periodos altos).

#### A6 · Inflación IPC anual

- **Fuente primaria:** FMI WEO (`PCPIPCH`).
- **Reemplazo declarado:** Argentina 2007-2015 → CEPAL/IPC-Congreso con `quality: estimado`. Venezuela 2014+ → estimación FMI con `quality: estimado`.
- **Frecuencia:** anual.
- **Eje:** ninguno directo.
- **Por qué:** **el indicador económico más leído por el público sudamericano**. Excluirlo deja al tablero ciego ante el dato cotidiano. La metodología de reemplazo queda documentada y defendible.

### Familia B · Comercio exterior (6)

#### B1 · Exportaciones primarias / exportaciones totales

- **Fuente primaria:** BACI (CEPII), agregado a SITC Rev.3 secciones 0-4 + 68.
- **Referencia secundaria:** UN COMTRADE (declaración oficial de cada país).
- **Frecuencia:** anual.
- **Eje primario:** desrepresentación, deculturación.
- **Vault:** [[../../35-Conceptos-clave/Reprimarización]].
- **Por qué:** indicador más limpio de reprimarización en composición de exportaciones. Cuando supera 70% sostenido, el país opera económicamente como economía primaria-exportadora con todas las implicancias culturales que el vault desarrolla.

#### B2 · Cuota del principal socio comercial

- **Fuente primaria:** BACI.
- **Frecuencia:** anual.
- **Eje secundario:** desrepresentación.
- **Vault:** [[../../35-Conceptos-clave/Hegemonía]].
- **Por qué:** medida de dependencia bilateral. Cuando un país tiene >35% de su comercio con un solo socio, sus grados de libertad de política exterior se reducen sustancialmente. Para 7 de los 10 países sudamericanos el principal es China o EEUU (lectura combinada con B3 y B4 contextualiza), pero el dato del % concentrado vale aparte.

#### B3 · Cuota de exportaciones a China

- **Fuente primaria:** BACI.
- **Frecuencia:** anual.
- **Eje secundario:** desrepresentación.
- **Vault:** [[../../60-Borradores/América Latina entre dos hegemonías]].
- **Por qué:** el cambio más importante de la geografía comercial sudamericana del siglo. Brasil pasó de <2% en 2000 a >30% en 2023; Chile y Perú similares.

#### B4 · Cuota de exportaciones a EEUU

- **Fuente primaria:** BACI.
- **Frecuencia:** anual.
- **Eje secundario:** desrepresentación.
- **Por qué:** contracara de B3. Para Colombia, Ecuador, Venezuela (en su ventana de datos viejos) sigue siendo el primer socio. La divergencia entre países sudamericanos en B3 vs B4 es uno de los mapas más claros del sándwich geopolítico actual.

#### B5 · IED neta recibida / PBI

- **Fuente primaria:** UNCTAD (World Investment Report, base de datos online).
- **Frecuencia:** anual.
- **Eje:** ninguno directo.
- **Por qué:** capital externo como flujo. Distinto de A5 (inversión bruta total): cuando IED es alta y A5 es baja, el país es plataforma de IED sin transformación productiva interna (caso Bolivia hidrocarburos, Perú minería).

#### B6 · Deuda externa total / PBI

- **Fuente primaria:** Banco Mundial IDS (International Debt Statistics).
- **Frecuencia:** anual.
- **Eje:** ninguno directo.
- **Por qué:** la deuda condiciona los grados de libertad de la política económica. Argentina periódicamente, Ecuador 2008-2009, Venezuela 2017+. Sirve para contextualizar A2 (crecimiento) y A6 (inflación) en periodos de stress.

### Familia C · Empleo y estructura del trabajo (6)

#### C1 · Tasa de desempleo abierto

- **Fuente primaria:** OIT ILOSTAT (modelado armonizado).
- **Frecuencia:** anual.
- **Eje secundario:** desrepresentación.
- **Por qué:** en SudAm el desempleo abierto **subestima** sistemáticamente la precariedad laboral porque la informalidad absorbe lo que en economías desarrolladas sería desempleo. Por eso va junto con C2.

#### C2 · Empleo informal / empleo total (criterio empresa, OIT)

- **Fuente primaria:** OIT ILOSTAT (KILM 8 — sector informal).
- **Frecuencia:** anual.
- **Eje primario:** erosión de mediaciones, desrepresentación.
- **Vault:** [[../../35-Conceptos-clave/Poder Infraestructural]].
- **Por qué:** el indicador más importante de la familia C. Cuando supera 50% (caso Bolivia, Paraguay, Perú periódicamente), la mayoría del trabajo está fuera del registro estatal — capacidad infraestructural reducida, sindicatos sin base de afiliación posible, política de partidos sin clase trabajadora formal a la cual representar.

#### C3 · Asalariado registrado / empleo total (criterio relación laboral, CEPAL)

- **Fuente primaria:** CEPALSTAT.
- **Frecuencia:** anual.
- **Eje primario:** erosión de mediaciones.
- **Por qué:** complementa C2 con la otra definición. Brasil tiene mucha empresa formal con relación informal (PJ, terciarización) — eso aparece en C3 mejor que en C2. Bolivia tiene empresa informal con relación tradicional — aparece en C2 mejor que en C3. Mantener los dos enseña la diferencia.

#### C4 · Empleo industrial / empleo total

- **Fuente primaria:** OIT ILOSTAT (`SLF_EMP_SEX_ECO_NB`).
- **Frecuencia:** anual.
- **Eje secundario:** desrepresentación.
- **Por qué:** par natural de A3 manufactura. Cuando ambos caen, hay desindustrialización completa. Cuando A3 manufactura cae más rápido que C4, hay informalización industrial. Cuando C4 cae más rápido que A3, hay automatización. La distinción analítica vale.

#### C5 · Brecha de género en participación laboral

- **Fuente primaria:** OIT ILOSTAT (diferencia hombre-mujer en tasa de participación).
- **Frecuencia:** anual.
- **Eje:** ninguno directo en el set base — pero conecta con deculturación (cambios en estructura familiar y de valores) y con erosión de mediaciones (los procesos de incorporación femenina al trabajo formal son uno de los grandes cambios estructurales del siglo).
- **Por qué:** uno de los procesos estructurales más estables del periodo, con direccionalidad clara aunque desigual por país. Chile y Uruguay convergen rápido; Bolivia y Paraguay menos. Lectura útil sin polémica metodológica.

#### C6 · Subocupación (horas)

- **Fuente primaria:** OIT ILOSTAT.
- **Frecuencia:** anual (parcial trimestral).
- **Eje:** ninguno directo.
- **Por qué:** captura la parte de la precariedad que C1 (desempleo) y C2 (informalidad) no atrapan: gente con trabajo registrado pero con horas insuficientes. Argentina 2018-2019 fue caso paradigmático.

### Familia D · Índices sociales (6)

#### D1 · Pobreza (línea regional comparable)

- **Fuente primaria:** CEPALSTAT (línea regional armonizada).
- **Frecuencia:** anual.
- **Eje secundario:** desrepresentación.
- **Por qué:** el dato social más leído de la región. La línea CEPAL es comparable entre países (a diferencia de las líneas nacionales que cada estadística usa).

#### D2 · Indigencia (línea regional comparable)

- **Fuente primaria:** CEPALSTAT.
- **Frecuencia:** anual.
- **Por qué:** la pobreza extrema separa procesos sociales muy distintos del resto de la pobreza. La diferencia D1−D2 es la parte de la pobreza que no es alimentaria.

#### D3 · Coeficiente de Gini (ingreso)

- **Fuente primaria:** Banco Mundial WDI (`SI.POV.GINI`), referencia CEPAL.
- **Frecuencia:** anual.
- **Eje secundario:** repatrimonialización (concentración de ingreso).
- **Vault:** [[../../35-Conceptos-clave/Repatrimonialización]].
- **Excepción a la regla de no-compuestos:** sí, declarada. No hay sustituto operativo para comparar concentración entre países.
- **Por qué:** Sudamérica es la región más desigual del mundo y el Gini lo mide consistentemente. Cualquier transformación cultural sobre la representación pasa por niveles de desigualdad heredados.

#### D5 · Mortalidad infantil

- **Fuente primaria:** Banco Mundial WDI (`SP.DYN.IMRT.IN`), referencia OPS.
- **Frecuencia:** anual.
- **Eje secundario:** capacidad estatal (proxy).
- **Por qué:** indicador clásico de capacidad estatal sanitaria. Trayectoria descendente sostenida en SudAm, pero con ritmos diferentes — Chile y Uruguay convergen con OECD; Bolivia, Paraguay, Venezuela bastante atrás.

#### D6 · Homicidios / 100.000 habitantes

- **Fuente primaria:** UNODC (Global Study on Homicide).
- **Reemplazo declarado:** Venezuela 2014+ → OVV (Observatorio Venezolano de Violencia, ONG nacional) con `quality: estimado`.
- **Frecuencia:** anual.
- **Eje primario:** atención (la violencia urbana modela la atención cotidiana en buena parte del subcontinente); secundario: capacidad estatal.
- **Vault:** [[../../35-Conceptos-clave/Poder Infraestructural]].
- **Por qué:** captura la versión más cruda del Poder Infraestructural — capacidad de monopolizar la violencia legítima. Ecuador 2021-2024 (de 8 a 45/100k en tres años) es el caso paradigmático actual de erosión de esta capacidad. Para Argentina, Uruguay, Chile, Paraguay es marginal — y esa misma marginalidad es dato.

#### D7 · Presión tributaria / PBI

- **Fuente primaria:** CEPALSTAT (Estadísticas Tributarias en América Latina y el Caribe, conjunta con OECD).
- **Frecuencia:** anual.
- **Eje primario:** capacidad estatal (proxy directo del Poder Infraestructural).
- **Vault:** [[../../35-Conceptos-clave/Poder Infraestructural]].
- **Por qué:** Mann define Poder Infraestructural como capacidad de hacer presente al Estado en el territorio. Recaudar impuestos es la versión más concreta de esa capacidad. Argentina y Brasil >30%; Bolivia, Paraguay, Guatemala <15%. Es la variable que mejor distingue Estados densos de Estados delgados en la región.

## 6. Resumen tabular del set final

| # | Indicador | Familia | Eje primario | Fuente prim | Cuelga lecturas |
|---|---|---|---|---|---|
| A1 | PBI per cápita PPP | A | — (contexto) | WB WDI | estabilidad macro |
| A2 | Crecimiento real PBI | A | — | WB WDI | estabilidad macro |
| A3 | VAB sectorial 3 sub | A | DES, DEC | WB WDI | reprimarización |
| A4 | Productividad laboral | A | DES | OIT | reprimarización |
| A5 | Inversión bruta / PBI | A | — | WB WDI | — |
| A6 | Inflación IPC | A | — | FMI + CEPAL | estabilidad macro |
| B1 | Exp primarias / total | B | DES, DEC | BACI | reprimarización |
| B2 | Cuota principal socio | B | DES | BACI | sándwich geo |
| B3 | Cuota a China | B | DES | BACI | sándwich geo |
| B4 | Cuota a EEUU | B | DES | BACI | sándwich geo |
| B5 | IED / PBI | B | — | UNCTAD | sándwich geo |
| B6 | Deuda externa / PBI | B | — | WB IDS | estabilidad macro |
| C1 | Desempleo abierto | C | DES | OIT | erosión trabajo |
| C2 | Informalidad OIT | C | ERO, DES | OIT | erosión trabajo |
| C3 | Registrado CEPAL | C | ERO | CEPAL | erosión trabajo |
| C4 | Empleo industrial | C | DES | OIT | reprimarización |
| C5 | Brecha género | C | — | OIT | erosión trabajo |
| C6 | Subocupación | C | — | OIT | erosión trabajo |
| D1 | Pobreza | D | DES | CEPAL | capacidad estatal |
| D2 | Indigencia | D | DES | CEPAL | capacidad estatal |
| D3 | Gini | D | — (excepción) | WB / CEPAL | capacidad estatal |
| D5 | Mortalidad infantil | D | — | WB / OPS | capacidad estatal |
| D6 | Homicidios | D | ATE | UNODC + OVV | capacidad estatal |
| D7 | Presión tributaria | D | ERO | CEPAL/OECD | capacidad estatal |

Códigos de eje: DES = desrepresentación · ERO = erosión de mediaciones · DEC = deculturación · ATE = atención · EPI = desorientación epistemológica · EST = estetización (ninguno alimenta este último, igual que LB).

## 7. Las cinco lecturas estructurales que el set sostiene

La curaduría no se ordena por familia sino por lectura. Estas son las cinco lecturas que el conjunto de 24 hace posibles. Cualquier indicador 25 que se proponga sumar tiene que demostrar que abre una sexta lectura — si solo añade densidad a una lectura existente, no entra.

### 7.1. Reprimarización completa

**Indicadores:** A3 + A4 + B1 + C4.

VAB sectorial (manufactura cae) + productividad laboral (cae cuando hay reabsorción en sectores menos productivos) + exportaciones primarias / total (sube) + empleo industrial (cae). Los cuatro juntos cuentan la historia completa: el país pierde industria en valor, pierde productividad agregada, vende cada vez más commodities, emplea cada vez menos gente en industria. Es la lectura más cargada del proyecto.

### 7.2. Sándwich geopolítico

**Indicadores:** B3 + B4 + B6 + B5.

Cuota a China + cuota a EEUU + deuda externa + IED neta. La balanza China-EEUU contextualiza con quién está cada país; deuda + IED contextualiza desde dónde viene el capital. Lectura coherente con el borrador *América Latina entre dos hegemonías*.

### 7.3. Erosión del trabajo formal

**Indicadores:** C1 + C2 + C3 + C5 + C6.

Desempleo + informalidad + registrado + brecha de género + subocupación. Cinco caras del trabajo precario. Erosión de mediaciones en su versión laboral — los sindicatos y los partidos de base obrera operan sobre una base material cada vez más chica.

### 7.4. Capacidad estatal (la triada Mann-Fukuyama)

**Indicadores:** D7 + D5 + D6.

Presión tributaria + mortalidad infantil + homicidios. Recaudar, sanar, monopolizar la violencia. Las tres son las capacidades infraestructurales más básicas que un Estado moderno reclama. Cuando las tres se erosionan a la vez (caso Venezuela 2014+, Ecuador 2021+ parcialmente), no es ajuste, es decadencia política en el sentido fuerte.

### 7.5. Estabilidad macro

**Indicadores:** A1 + A2 + A6 + B6.

PBI per cápita + crecimiento + inflación + deuda. El terreno material sobre el que opera todo lo demás. Sin esta lectura, las tendencias estructurales se confunden con ruido coyuntural.

## 8. Indicadores fuertes que descarté

Candidatos legítimos que quedaron afuera con razón explícita:

| Indicador | Fuente | Por qué quedó afuera |
|-----------|--------|----------------------|
| Concentración de exportaciones (Herfindahl) | UNCTAD | Compuesto. La concentración exportadora la cuentan B1 + B2 + B3 + B4 sin esconder composición. |
| IDH | PNUD | Compuesto. Sus tres dimensiones ya están cubiertas por separado (D5, escolaridad descartada, A1 ingreso). |
| V-Dem / Polity / WJP / BTI | Centros académicos | Compuestos. Si aparece necesidad editorial, se citan ad hoc. |
| **EDB / B-READY** | **Banco Mundial** | **EDB descontinuado en septiembre 2021 tras escándalo WilmerHale** (manipulación deliberada de rankings de China, Arabia Saudita, Azerbaiyán, EAU). Sucesor B-READY cubre 50 países en oleada 2024 — solo Chile, Colombia, Perú de SudAm. Doble razón: cobertura insuficiente + compuesto. **El propio escándalo del EDB es material editorial** para el eje erosión de mediaciones — vale guardarlo como disparador eventual. |
| Heritage Index of Economic Freedom | Heritage Foundation | Compuesto + sesgo libertario explícito. Lente incompatible con la voz del proyecto. |
| Fraser Economic Freedom of the World | Fraser Institute | Idem Heritage. |
| EMBI Plus | JPMorgan | Latencia diaria, dato de mercado. Capa 3 (risk management) entrando por la puerta de atrás. Spec 09 §8 advierte resistir. |
| Tipo de cambio real multilateral | BIS / WB | TC paralelos en AR/VE hacen ficticio el oficial. Postergado a v2 con tratamiento metodológico específico. |
| Acceso a internet, suscripciones móviles | UIT | Bueno como contexto pero no alimenta lectura estructural específica del set. Postergado. |
| Educación: tasa de escolarización terciaria | UNESCO | Bueno pero solapa parcialmente con D5 (proxy de capacidad estatal). Postergado. |
| Confianza en partidos / instituciones | Latinobarómetro | Cubierto por LB en Spec 12. No duplicar acá. |
| Apoyo a la democracia | Latinobarómetro | Idem. |
| Inflación core | varias nacionales | Cobertura desigual en la región. A6 IPC headline alcanza para v1. |
| Concentración del 1% más rico | World Inequality Database | Compuesto y con cobertura desigual. D3 Gini alcanza como medida primaria de desigualdad. |

## 9. Política de tratamiento por país (resumen ejecutable)

| País | Tratamiento estándar | Excepciones |
|------|----------------------|-------------|
| Argentina | Regional > nacional. INDEC 2007-2015 con `quality: estimado` (reemplazo CEPAL). | Inflación A6 con reemplazo IPC-Congreso/CEPAL para 2007-2015. |
| Brasil | Regional > nacional. Sin reemplazos. | — |
| Chile | Regional > nacional. Sin reemplazos. | — |
| Colombia | Regional > nacional. Sin reemplazos. | — |
| Bolivia | Regional > nacional. Cambios metodológicos 2010s documentados. | C2 informalidad con quiebre 2015 declarado. |
| Perú | Regional > nacional. Sin reemplazos. | — |
| Uruguay | Regional > nacional. Sin reemplazos. | — |
| Paraguay | Regional > nacional. Cobertura estadística más débil. | Datos faltantes en D2 y D7 algunos años — `quality: estimado`. |
| Ecuador | Regional > nacional. | D6 homicidios con vigilancia editorial — el cambio 2021-2024 es histórico y merece nota dedicada. |
| Venezuela | Regional > nacional con fuerte uso de `quality: congelado` y `estimado`. | A6 inflación con FMI estimado. D6 homicidios con OVV. A1, A2, A5 con última observación BM válida (~2014). |

## 10. Decisiones tomadas en sesión (registro)

Esta spec cierra ocho preguntas que estaban abiertas en Spec 14. Registro las decisiones para que no haya que re-debatirlas.

| # | Pregunta | Resolución |
|---|----------|-----------|
| 1 | ¿Política de fuentes ante divergencia nacional/regional? | **Regional siempre.** §3.1. |
| 2 | ¿Cómo se trata Venezuela? | **Adentro con `quality: congelado` o `estimado`.** §3.2. |
| 3 | ¿Indicadores compuestos? | **No, excepto Gini.** §3.3. |
| 4 | ¿Longitud de serie? | **10-15 años.** §3.4. |
| 5 | ¿Inflación entra? | **Sí, con reemplazo declarado para AR 2007-2015 y VE 2014+.** A6. |
| 6 | ¿Homicidios entran? | **Sí, con UNODC + OVV para VE.** D6. |
| 7 | ¿VAB sectorial vs empleo industrial? | **Ambos. Miden cosas distintas (valor vs gente).** A3 + C4. |
| 8 | ¿Cuotas comerciales B2/B3/B4? | **Mantenemos los tres. Aceptamos duplicación a cambio de simplicidad de lectura.** |

## 11. Lo que esto desbloquea

- **Spec 14B (pipeline):** ya tiene la lista completa de variables a pullear con `source.code` por indicador. Trabajo estimado: 2-4 días distribuidos por fuente (WB es lo más fácil; CEPALSTAT es el desafío real porque su API es parcial).
- **Sección "Estructura material" en ficha-país (extensión de Spec 12):** tiene definida la lista de indicadores y los 4 grupos de organización. Mockup pendiente — paralelo a `12-pulso-ciudadano-mockup.html` actual.
- **Spec 15 (futura, comparativa macro):** decidir si replicar el patrón de Spec 13 con su propio scope (10 países × 24 indicadores) cuando 14B esté ejecutada.
- **Lecturas editoriales estructurales:** las cinco lecturas de §7 son material listo para borradores específicos. La reprimarización completa pide pieza propia, el sándwich geopolítico ya tiene borrador (*América Latina entre dos hegemonías*), la capacidad estatal triada Mann-Fukuyama amerita ensayo.

## 12. Inventario de candidatos descartados

El criterio de las 5 lecturas (§7) es la salvaguarda contra ampliar el set sin razón. Si en el futuro se quiere agregar el indicador 25, la prueba es: ¿abre una sexta lectura estructural? Si abre solo más densidad de una existente, no entra.

Los descartados de §8 son el archivo de partida si esa pregunta vuelve a abrirse.

---

**Fecha de cierre:** 9 mayo 2026
**Próxima iteración:** Spec 14B (pipeline) — ejecutar cuando v1 esté estable y se decida arrancar.
