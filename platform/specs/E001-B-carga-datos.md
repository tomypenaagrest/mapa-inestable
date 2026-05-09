# Épica E001-B — Carga de datos Latinobarómetro 2024 (microdatos)

> **Estado:** propuesta de planificación · `2026-05-08`
> **Tamaño T-shirt:** **S** (chica) — medio día / 1 día calendario
> **Bloquea:** H1 de E001 (transcripción)
> **Bloqueado por:** nada (los CSV ya están subidos)

---

## 1. Por qué existe esta tarea preliminar

E001 H1 originalmente preveía que Tomás transcribiera valores leyendo gráficos del PDF analítico. Esa estrategia tenía tres problemas:

1. **Riesgo de error** — leer cifras de barras stackeadas a ojo no es confiable.
2. **Cobertura parcial** — sólo los indicadores que aparecen graficados.
3. **Sin reusabilidad** — un año de trabajo para un único año de datos.

Latinobarómetro publica los **microdatos crudos** (~19,200 entrevistas, 332 variables, peso muestral) en SPSS/CSV. Con un script de Python de ~150 líneas se calculan los 12 indicadores con precisión exacta y queda instalado un pipeline reproducible para futuras ediciones (2025+) y para indicadores nuevos sin volver a tocar el PDF.

**Esta épica es lo que faltaba aclarar antes de arrancar E001 H1.** Una vez producido `indicators.json`, la H1 de E001 cambia de "transcribir" a simplemente "cargar y validar".

---

## 2. Estado del dataset (ya verificado)

| Aspecto | Valor |
|---|---|
| Archivo | `Latinobarometro_2024_Csv_esp_v20250817.csv` (26 MB, UTF-8 BOM, separador `;`) |
| Filas | 19.214 entrevistas (1.200 por país, 1.210 Argentina, 1.000 los más pequeños) |
| Columnas | 332 variables |
| Identificador país | `IDENPA` (códigos ISO 3166-1 numéricos: 32=Arg, 76=Bra, 862=Ven, ...) |
| Peso muestral | `WT` (última columna) — debe usarse para % ponderados |
| Codificación | Numérica cruda (no etiquetas). Cada variable tiene su esquema en el cuestionario `Latinobarometro_2024_Cuestionario_esp.pdf` |
| Cobertura | 17 países (Nicaragua excluida desde 2018 por dictadura, conforme al informe) |

---

## 3. Mapeo definitivo: 12 indicadores → variables CSV

Cada indicador se computa como % ponderado por `WT` filtrado por `IDENPA`, usando el código de respuesta indicado.

| # | Indicador | Variable | Cómputo |
|---|---|---|---|
| 1 | Apoyo a la democracia | `P11STGBS` | % donde valor = 1 ("preferible a cualquier otra forma") |
| 2 | No representado en parlamento | `P25ST` | % donde valor = 2 ("No") |
| 3 | Sociedad debe cambiarse radicalmente | `P4ST` | % donde valor = 4 |
| 4 | Confianza en partidos políticos | `P14ST.G` | % donde valor ∈ {1, 2} ("mucha" + "algo") |
| 5 | Confianza en congreso/parlamento | `P14ST.D` | % donde valor ∈ {1, 2} |
| 6 | Confianza en poder judicial | `P14ST.F` | % donde valor ∈ {1, 2} |
| 7 | Información falsa en redes sociales | `P47ST.D` | % donde valor ∈ {1, 2} ("mucha" + "alguna") |
| 8 | Elecciones son fraudulentas | `P27ST` | % donde valor = 2 ("fraudulentas") |
| 9 | Sin religión | `S1` | % donde valor = 97 ("Ninguna") |
| 10 | Autoposicionamiento izquierda-derecha | `P16ST` | promedio ponderado (escala 00-10) excluyendo 98 (NS) y 00→ojo: en P16ST 00 es "izquierda" extrema, no missing — leer tarjeta cuidadosamente |
| 11 | Confianza en redes sociales | `P14ST.L` | % donde valor ∈ {1, 2} |
| 12 | Aprobación de gobierno | `P15STGBS` | % donde valor = 1 ("Aprueba") |

**Códigos de NR/NS a tratar como missing en todos los casos:** habitualmente `8` (No sabe), `0` (No responde), `98`, `00`, `99`. Cada variable tiene su esquema — ver cuestionario p/u.

---

## 4. Definición de "hecho"

Al cierre de la épica:

1. Los CSV están en `platform/data/latinobarometro-2024/raw/` (gitignored si pesan > 1 MB).
2. Existe `platform/data/latinobarometro-2024/build_indicators.py` que:
    - Lee el CSV español.
    - Para cada uno de los 12 indicadores, calcula el % (o promedio) ponderado por `WT`, por país.
    - Calcula el promedio regional ponderado.
    - Calcula el ranking 1-17 de cada país por indicador.
    - Genera `indicators.json` siguiendo el schema definido en E001.
3. El `indicators.json` produce los 12 × 17 = 204 datapoints completos.
4. Existe `platform/data/latinobarometro-2024/README.md` con:
    - Cómo correr el script (1 comando).
    - Qué versión del dataset se usó (v20250817).
    - Mapeo indicador → variable → corte (la tabla de la sección 3).
    - Cita académica recomendada por Latinobarómetro.
    - Criterios de tratamiento de missing.
5. Existe un test de validación: para 3 indicadores elegidos al azar, se compara el valor regional computado vs el valor publicado en el informe PDF. Tolerancia: ±1 punto porcentual (redondeo). Si difiere más, hay un bug que investigar.

---

## 5. Plan en 3 historias

### H1 · Setup del entorno y validación rápida · **XS**
- Crear `platform/data/latinobarometro-2024/` y copiar los CSV ahí.
- Agregar a `.gitignore` los CSV crudos (pesan 26 MB, no deberían ir al repo).
- Crear venv Python con: `pandas`, `numpy`. Sin dependencias exóticas.
- Script de exploración inicial (`explore.py`) que carga el CSV, imprime distribución por país, verifica que las 12 variables están presentes y reporta % de missing por variable.

### H2 · Pipeline de cómputo · **S**
- `build_indicators.py` con una función por tipo de cómputo:
    - `pct_weighted(df, var, target_codes, weight_col)` — para % ponderados (indicadores 1-9, 11-12).
    - `mean_weighted(df, var, weight_col, exclude_codes)` — para promedios (indicador 10).
    - `compute_by_country(df, fn, **kwargs)` — itera sobre IDENPA y devuelve dict.
- Loop principal que para cada uno de los 12 indicadores aplica el cómputo y agrega: valor por país, valor regional, ranking, delta vs 2023 (si está disponible — ver §6 Riesgos).
- Output a `indicators.json` con el schema:
    ```json
    {
      "version": "lb2024-v20250817",
      "computed_at": "2026-05-08",
      "n_total": 19214,
      "indicators": [
        {
          "id": "apoyo-democracia",
          "label": "Apoyo a la democracia",
          "axis": "desrepresentacion",
          "section_pdf": "4.1",
          "page_pdf": 30,
          "questionnaire_var": "P11STGBS",
          "question_text": "La democracia es preferible a cualquier otra forma de gobierno",
          "compute": "% valor = 1, ponderado por WT",
          "unit": "%",
          "regional_value": 51.7,
          "by_country": {
            "AR": { "value": 75.2, "rank": 1, "n": 1210 },
            "BR": { "value": 49.6, "rank": 7, "n": 1204 },
            "...": "..."
          }
        }
      ]
    }
    ```

### H3 · Validación y documentación · **XS**
- Test manual: comparar 3 indicadores con el informe PDF (apoyo a democracia debería dar 52% reg, confianza partidos 17%, info falsa 76%). Si difiere > 1pp, debug.
- Escribir `README.md` con todo lo de §4.
- Cerrar H1 de E001 reemplazando "transcripción manual" por "validación del JSON producido".

---

## 6. Riesgos y mitigaciones

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Mi mapeo variable→indicador tiene un error sutil | Media | El test de §5 H3 contra el PDF lo detectaría inmediatamente |
| Los códigos de respuesta no son los que asumí | Baja | Cuestionario PDF + cross-check inicial en H1 |
| El peso muestral no se aplica correctamente | Media | Cross-check del valor regional contra el informe en H3 |
| Delta vs 2023 no es computable sin dataset 2023 | Alta | Si no se baja LB2023, el campo `delta_2023` queda en `null` y se documenta en el README. No bloquea esta épica. |
| Códigos ISO numéricos vs slugs (ar/br/...) | Baja | Tabla de mapping hardcodeada en el script (10 países sudamericanos + 7 resto = 17) |
| El CSV español tiene encoding raro en algunas etiquetas | Baja | Es UTF-8 BOM. pandas lo maneja con `encoding='utf-8-sig'` |

---

## 7. Lo que esto desbloquea

- **E001 H1** ya no necesita transcripción manual: simplemente carga `indicators.json` en el módulo TS.
- **E002** (página comparativa) consume el mismo JSON sin trabajo extra de datos.
- **Series históricas** (épica futura): el mismo pipeline corre contra LB2023, LB2022... bajando esos CSV. Cada año añade ~1 día de trabajo, no semanas.
- **Indicadores nuevos** (épica futura): si Tomás quiere agregar el indicador 13 (ej. "para quién se gobierna"), es 1 entrada más en el loop, no un nuevo proceso de transcripción.
- **Cruces sociodemográficos** (épica futura): con los microdatos cargados, queda habilitado computar "apoyo a la democracia por edad" o "por nivel educativo" sin tocar el pipeline.

---

## 8. Estructura de archivos resultante

```
platform/
└── data/
    └── latinobarometro-2024/
        ├── raw/                                    # gitignored
        │   ├── Latinobarometro_2024_Csv_esp_v20250817.csv
        │   ├── Latinobarometro_2024_Cuestionario_esp.pdf
        │   └── Latinobarometro_2024_Informe_2024.pdf
        ├── explore.py                              # H1 — sanity check
        ├── build_indicators.py                     # H2 — pipeline
        ├── indicators.json                         # output — consumido por frontend
        └── README.md                               # H3 — metodología
```

---

## 9. Decisiones tomadas (que cierran las preguntas pendientes de E001)

Pregunta 4 de E001 sec 9 ("¿`lib/` estático o endpoint FastAPI?"): **lib estático** sigue siendo la opción correcta. El JSON tiene ~30 KB, no justifica backend. El backend FastAPI queda libre para lo que sí justifica DB (eventos del flujo semanal, análisis, despachos).

Pregunta 5 de E001 sec 9 ("¿hostear PDF o linkear al sitio oficial?"): **linkear al sitio oficial.** Latinobarómetro mantiene URLs estables y tiene su propia caché. Hostear sería duplicación innecesaria (y entra en zona gris de redistribución).
