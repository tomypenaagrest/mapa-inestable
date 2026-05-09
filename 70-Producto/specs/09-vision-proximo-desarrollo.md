# Spec 09 — Visión próximo desarrollo

**Estado:** captura de visión — NO scope inmediato
**Prioridad:** —
**Tipo:** documento de exploración / roadmap futuro

---

## 1. Por qué este documento

Esta spec **no es para implementar**. Es captura de tres ideas que aparecieron en una conversación de mayo 2026 sobre el rumbo del proyecto post-v1, ordenadas en capas de compromiso creciente para que cuando llegue el momento de decidir, las tensiones estén marcadas.

Las tres ideas son:

1. Sumar indicadores económicos y sociales al mapa.
2. Integrar información de encuestas.
3. Posible evolución hacia un dashboard de risk management de inversiones.

El tercer punto vino acompañado de "puede ser" — esta spec respeta esa duda. La función del documento es **no perder la idea** y **anticipar las tensiones** de cada salto, no resolverlos.

---

## 2. Capas de evolución (de menos a más compromiso)

Las tres ideas no son del mismo nivel. Las separo porque cada una implica un commit de producto distinto.

| # | Idea | Cambia el producto? | Cambia la audiencia? | Compromiso |
|---|------|---------------------|----------------------|------------|
| 1 | Indicadores económicos y sociales en el mapa | No (extensión natural) | No | Bajo |
| 2 | Encuestas | Parcialmente (suma capa cuantitativa) | No (sigue siendo lectores políticos) | Medio |
| 3 | Dashboard de risk management de inversiones | Sí (de plataforma editorial a producto financiero) | Sí (de lectores a inversores B2B) | Alto |

Conviene resolverlas en este orden, no por urgencia sino por reversibilidad: la 1 es revertible, la 3 cambia el proyecto.

---

## 3. Capa 1 — Indicadores económicos y sociales en el mapa

### 3.1. Qué sería

El mapa invertido (Spec 01.5.5) hoy muestra qué eje está activo en cada país por semana. La extensión natural es agregar **indicadores estructurales** que se superpongan o alternen con la capa de ejes:

- Económicos: PBI, inflación, deuda externa / PBI, riesgo país (EMBI), tipo de cambio real, exportaciones de commodities como % del total.
- Sociales: pobreza, desigualdad (Gini), informalidad laboral, indicador de capacidad estatal (proxy del Poder Infraestructural de Mann), confianza institucional.

Implementación: el mapa tiene un **selector de capa** ("Eje activo · PBI · Pobreza · …"). Cada país se colorea con un gradiente según el indicador. Hover muestra el valor exacto + serie histórica corta.

### 3.2. Cómo encaja con el proyecto

Bien. El proyecto trabaja sobre **transformaciones estructurales**, y los indicadores son la huella material de esas transformaciones. La reprimarización (concepto del vault) se hace visible si mostrás "exportaciones de commodities" en el tiempo. La desrepresentación cuadra con "confianza en partidos" en encuestas (capa 2).

Conexión directa con conceptos del vault que ya existen:
- [[../../35-Conceptos-clave/Reprimarización]] ↔ commodities como % del total
- [[../../35-Conceptos-clave/Poder Infraestructural]] ↔ capacidad recaudatoria, cobertura de servicios
- [[../../35-Conceptos-clave/Decadencia política]] ↔ confianza institucional

### 3.3. Fuentes

- Banco Mundial (API pública, datos abiertos)
- CEPAL (descargas, no API)
- IMF Data
- LATINOBARÓMETRO (parcialmente público)

Refresco: la mayoría de indicadores son anuales o trimestrales — no requieren pipeline en tiempo real. Un sync mensual alcanza.

### 3.4. Tensiones a anticipar

- **¿Es un mapa periodístico o un mapa de datos?** Hoy el mapa cumple una función **editorial** (mostrar dónde se publicó análisis esa semana). Sumar indicadores lo convierte parcialmente en **dashboard de datos**. Hay que decidir si las dos funciones conviven en el mismo mapa o si los datos viven en una vista paralela (`/datos`, `/indicadores`).
- **Riesgo de empirismo.** Mapa Inestable es un proyecto interpretativo, no estadístico. Si los indicadores se vuelven la pieza dominante, el proyecto pierde su voz. Los datos tienen que **acompañar la interpretación**, no reemplazarla.
- **Calidad de las fuentes para Sudamérica.** Argentina con INDEC pre/post Macri, Venezuela con datos congelados, Bolivia con cambios metodológicos. La trazabilidad obligatoria del proyecto (Spec 01) implica que cada indicador tiene que declarar su fuente y la fecha de su última actualización.

### 3.5. Preguntas abiertas

| # | Pregunta | A resolver |
|---|----------|------------|
| 1 | ¿El mapa unifica capas (eje + datos) o las separa en vistas distintas? | Antes de implementar |
| 2 | ¿Cuántos indicadores en v1? (proponer: 3-5 económicos, 2-3 sociales) | Antes de implementar |
| 3 | ¿Se permite al lector elegir capas o se cura desde la edición? | Antes de implementar |
| 4 | ¿Los indicadores se vinculan con análisis ("este análisis menciona la reprimarización; mirá el gráfico de exportaciones")? | Antes de implementar |

---

## 4. Capa 2 — Integración de encuestas

### 4.1. Qué sería

Sumar al mapa (o a las páginas de país) data de encuestas de opinión pública. Latinobarómetro es la fuente continental obvia, pero también hay encuestas nacionales (Cuestión Pública en Colombia, Datafolha en Brasil, Cadem en Chile, etc.).

Tipos de pregunta relevantes para el marco de Mapa Inestable:

- Confianza en instituciones (vincula con desrepresentación, decadencia política).
- Identificación partidaria / "ningún partido me representa" (desrepresentación).
- Percepción de la verdad / consumo de medios (desorientación epistemológica).
- Identidad / pertenencia (deculturación).
- Ansiedad económica subjetiva (vincula capa 1 con capa 2).

### 4.2. Cómo encaja

Encaja **mejor** que los indicadores económicos de la capa 1. Las encuestas miden **percepciones colectivas**, que son justo el territorio del proyecto (la cultura, la representación, la atención, la desorientación operan en la subjetividad colectiva).

El cruce más potente: la encuesta como **disparador estadístico** (paso 01 del método). Hasta hoy los disparadores son escenas concretas (una declaración, una escena viral). Una caída de 12 puntos en la confianza en partidos también es disparador — y cuantitativo.

### 4.3. Fuentes

- Latinobarómetro (continental, anual)
- LAPOP / Vanderbilt (continental, bianual, datos públicos)
- Encuestas nacionales por país — más fragmentado, requiere curaduría manual
- World Values Survey (continental, periódico)

### 4.4. Tensiones a anticipar

- **Cobertura desigual.** Latinobarómetro y LAPOP cubren los 10 países pero con frecuencia anual o bianual. Una semana sin encuesta nueva no genera disparador.
- **Sesgo metodológico.** Las encuestas tienen sus propios problemas (muestreo, formulación de preguntas). Ironía: un proyecto sobre desorientación epistemológica que se apoye sin crítica en encuestas reproduce la misma lógica que cuestiona.
- **Trazabilidad de pregunta.** Cada dato de encuesta requiere declarar la pregunta exacta, el muestreo, la fecha de campo. Es la versión "fuente primaria" de los análisis (Spec 01) aplicada a datos.

### 4.5. Conexión con la capa 1

Si las dos capas se construyen, conviene que el mapa pueda **cruzarlas**: "Países donde la informalidad supera el 50% Y la confianza en sindicatos cayó en los últimos 2 años". Eso transforma el mapa de "vista" a "exploratorio".

### 4.6. Preguntas abiertas

| # | Pregunta | A resolver |
|---|----------|------------|
| 1 | ¿Se publican datos crudos o solo mediados por análisis? | Antes de implementar |
| 2 | ¿Las encuestas viven en `/datos`, en página de país, o en mapa? | Antes de implementar |
| 3 | ¿Cómo se trata la incertidumbre estadística (errores de muestreo)? | Antes de implementar |
| 4 | ¿Se acepta solo Latinobarómetro/LAPOP o también encuestas nacionales? | Antes de implementar |

---

## 5. Capa 3 — Dashboard de risk management de inversiones

### 5.1. Qué sería

La hipótesis: la combinación de análisis estructurales + indicadores macro + encuestas de percepción = **señal predictiva de riesgo político-económico**. Esa señal le sirve a inversores institucionales que hoy compran ese producto a consultoras tradicionales (Eurasia Group, Control Risks, Verisk Maplecroft, Stratfor) por miles de dólares al mes.

El producto sería un dashboard B2B con:
- Score de riesgo país agregado (compuesto desde los ejes y los indicadores).
- Series de tiempo de cada eje × país.
- Alertas cuando un eje cambia de intensidad.
- Reportes ejecutivos semanales / mensuales.
- API para integrar a sistemas existentes del cliente.

Modelo de negocio: suscripción mensual por usuario o por institución, tier alto, cliente B2B (fondos, family offices, multilatinas, organismos internacionales).

### 5.2. Cómo encaja (y dónde no encaja)

**Encaja conceptualmente.** El proyecto ya hace análisis estructural; un dashboard es una capa de presentación distinta sobre el mismo material. La metodología existente sirve.

**No encaja sin tensiones.** Tres problemas grandes:

1. **Cambio de audiencia.** Hoy el lector es público interesado en política sudamericana. Risk management apunta a un cliente que **no comparte la misma sensibilidad**: lee para tomar decisiones financieras, no para interpretar transformaciones culturales. La voz, el tono, los registros de qué se enfatiza — todo cambia.

2. **Cambio de relación entre interpretación y predicción.** Mapa Inestable hoy se cuida de **no predecir**: deja preguntas abiertas (paso 04 del método), no cierra. Risk management vive del cierre: el cliente paga porque alguien le firma una afirmación predictiva ("riesgo alto / medio / bajo en X mercado"). El método actual y el producto financiero **operan en lógicas opuestas**.

3. **Riesgo de captura.** Cuando el cliente paga, el cliente influye. Un proyecto sobre desorientación epistemológica que se vuelve servicio para inversores corre el riesgo de domesticar su crítica para no incomodar al cliente. Es el riesgo profesional clásico de las consultoras políticas.

### 5.3. Modelos posibles si se decide avanzar

Si el camino se toma, hay varias formas de hacerlo que no son la misma:

- **Modelo A — Producto separado.** Mapa Inestable mantiene su voz editorial pública. El dashboard B2B es una marca distinta (otro nombre, otro sitio) que **se alimenta** del mismo trabajo analítico pero con presentación adaptada al cliente. Ventaja: protege la voz original. Desventaja: doble trabajo.
- **Modelo B — Tier premium.** Mapa Inestable agrega un tier de suscripción alto que da acceso a dashboard, alertas, reportes. Ventaja: una sola operación. Desventaja: el riesgo de captura es máximo.
- **Modelo C — Servicio puntual.** Mapa Inestable se mantiene como proyecto editorial; los reportes para inversores son **proyectos puntuales** vendidos uno por uno (research on demand). Ventaja: flexible. Desventaja: no escala.
- **Modelo D — Datos abiertos + servicio premium.** El score de riesgo y los indicadores son públicos; lo que se vende es la profundidad (reportes ejecutivos, sesiones con el autor, alertas custom). Ventaja: aprovecha el activo intelectual sin volver opaco lo que hoy es público.

Recomendación si se avanza: **Modelo D**. Es el menos invasivo del proyecto original y el que aprovecha mejor el activo distintivo (la mirada).

### 5.4. Tensiones a anticipar

Además de las del 5.2:

- **¿Qué tipo de empresa sería?** Una S.A. con inversores cambia el control. Una cooperativa o S.R.L. con socios afines mantiene independencia. Decisión societaria que no es trivial.
- **Ética del producto financiero.** Vender análisis político a fondos que toman posiciones cortas en países en crisis no es neutral. Un proyecto crítico se compromete.
- **Capacidad operativa.** Risk management requiere update frecuente, alertas, soporte. Single-author no escala. Se necesita equipo.
- **Métricas de éxito distintas.** Hoy el éxito es lectores que se transforman al leer. En B2B el éxito es renovación de contrato y NPS. Otra liga.

### 5.5. Preguntas abiertas

| # | Pregunta | A resolver |
|---|----------|------------|
| 1 | ¿La hipótesis sobre la utilidad predictiva del marco se valida con un piloto? | Antes de comprometerse |
| 2 | ¿Cuál es el modelo (A/B/C/D)? | Antes de construir |
| 3 | ¿Cómo se preserva la voz crítica si el cliente paga? | Antes de construir |
| 4 | ¿Se separa la marca o se mantiene unificada? | Antes de construir |
| 5 | ¿Es éste el camino para sostener el proyecto financieramente, o hay otros (membresía pública, financiación filantrópica, becas)? | Antes de comprometerse |

---

## 6. Lecturas y referencias para cuando se vuelva sobre esto

Productos en el espacio (para mapear competencia y formato):

- **Eurasia Group** — el referente de risk político global, voz del fundador como activo principal.
- **Control Risks** — más operacional, foco en seguridad corporativa.
- **Verisk Maplecroft** — score-based, muy cuantitativo, índices propietarios.
- **Stratfor** (RANE) — geopolítica con tono periodístico, B2B y B2C híbrido.
- **Latam Brief / The Latam Investor** — especializados en LATAM, mercado más chico.
- **GZero Media** — el branch público/editorial de Eurasia. Precedente del modelo A o D.

Conviene mirarlos no para copiar sino para entender qué espacio queda libre.

Conexión con conceptos del vault que justifican la hipótesis predictiva:
- [[../../35-Conceptos-clave/Decadencia política]] — Fukuyama propone que la rigidez institucional precede crisis.
- [[../../35-Conceptos-clave/Overstretch]] — Kennedy mide el declive como desfase entre compromisos y capacidades.
- [[../../35-Conceptos-clave/Repatrimonialización]] — la captura del Estado precede pérdida de capacidad para reformas.
- [[../../35-Conceptos-clave/Fuerzas profundas]] — Renouvin: la mentalidad colectiva como variable que orienta antes de que se vea.

Cada uno de estos conceptos sugiere una métrica posible del dashboard. Esto **es** parte del activo distintivo del proyecto.

---

## 7. Secuencia sugerida si se decide avanzar

```
Etapa 0 (ahora hasta v1 estable)
   ► No tocar nada de esto. Cerrar specs 04-08 y consolidar v1.

Etapa 1 (post v1, 6-12 meses)
   ► Sumar indicadores macro al mapa (capa 1).
   ► Bajo compromiso, alta visibilidad pública.
   ► Si funciona editorialmente, sigue. Si distrae, se retrocede.

Etapa 2 (12-18 meses post v1)
   ► Sumar encuestas (capa 2).
   ► Empieza a generar señales predictivas usables.

Etapa 3 (decisión de fondo)
   ► Evaluar si el material acumulado tiene utilidad predictiva real
     (validación con backtest simple: análisis pasados vs. eventos posteriores).
   ► Si sí: explorar modelo D (datos abiertos + servicio premium) en piloto pequeño.
   ► Si no: el proyecto sigue como plataforma editorial pura.
```

---

## 8. Notas finales

Tres cosas para no perder de vista cuando esto vuelva a la mesa:

**Una.** El proyecto se distingue por su mirada. Ningún competidor en risk management trabaja con un marco como los 6 ejes o el método de 4 pasos. Ese es el activo. Cualquier evolución que dilute la mirada para "parecerse más al producto financiero estándar" pierde lo único que vale.

**Dos.** La duda del usuario ("puede ser") es información. No es indecisión: es la señal de que el camino implica un compromiso grande con consecuencias profundas. Vale tomarse el tiempo y no apurar la decisión.

**Tres.** Hay caminos intermedios entre "newsletter independiente" y "consultora B2B": membresía paga al estilo *The Information*, partnerships con instituciones académicas, becas de fundaciones, contratos puntuales con organismos multilaterales. Antes de saltar a risk management de inversores, vale mapear esos otros caminos para ver cuál preserva mejor el proyecto.

---

**Fecha de captura:** mayo 2026
**Próxima revisión:** post v1 estable
