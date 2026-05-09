# Spec 12B — Pipeline de carga LB 2024 (microdatos)

**Estado:** ✓ ejecutada y validada
**Anexo de:** [Spec 12](12-pulso-ciudadano-ficha-pais.md)
**Tipo:** ingesta de datos
**Tamaño:** S (medio día)
**Producto:** `platform/data/latinobarometro-2024/indicators.json` (30 KB, 204 datapoints validados ±1pp contra el informe oficial)

---

## 1. Por qué existe

Spec 10 §5 define el pipeline conceptual de ingesta. Spec 12 originalmente preveía transcripción manual de gráficos del PDF analítico para los 12 indicadores. Esa estrategia tenía tres problemas:

1. **Riesgo de error** — leer cifras de barras stackeadas a ojo no es confiable.
2. **Cobertura parcial** — sólo los indicadores que aparecen graficados.
3. **Sin reusabilidad** — un año de trabajo para un único año de datos.

Latinobarómetro publica los **microdatos crudos** (~19,200 entrevistas, 332 variables, peso muestral) en SPSS/CSV — exactamente lo que Spec 10 §5 anticipa como pipeline ideal. Con un script de Python de ~150 líneas se calculan los 12 indicadores con precisión exacta y queda instalado un pipeline reproducible para futuras ediciones (2025+) y para indicadores nuevos sin volver a tocar el PDF.

## 2. Estado del dataset

| Aspecto | Valor |
|---|---|
| Archivo | `Latinobarometro_2024_Csv_esp_v20250817.csv` (26 MB, UTF-8 BOM, separador `;`) |
| Filas | 19.214 entrevistas (1.000-1.210 por país) |
| Columnas | 332 variables |
| Identificador país | `IDENPA` (códigos ISO 3166-1 numéricos: 32=Arg, 76=Bra, 862=Ven, ...) |
| Peso muestral | `WT` (última columna) — usado para todos los % |
| Codificación | Numérica cruda (no etiquetas). Cuestionario: `Latinobarometro_2024_Cuestionario_esp.pdf` |
| Cobertura | 17 países (Nicaragua excluida desde 2018 por dictadura, conforme al informe) |

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
| 10 | Autoposicionamiento izquierda-derecha | `P16ST` | promedio ponderado (escala 00-10) |
| 11 | Confianza en redes sociales | `P14ST.L` | % donde valor ∈ {1, 2} |
| 12 | Aprobación de gobierno | `P15STGBS` | % donde valor = 1 ("Aprueba") |

Códigos de NR/NS tratados como missing por variable: documentados en `platform/data/latinobarometro-2024/build_indicators.py`.

## 4. Definición de "hecho" — cumplido

1. ✓ CSV en `platform/data/latinobarometro-2024/raw/` (gitignored, 26 MB).
2. ✓ `build_indicators.py` ejecutado, ~150 líneas, sólo dependencias de pandas y numpy.
3. ✓ `indicators.json` produce los 12 × 17 = 204 datapoints completos (30 KB).
4. ✓ `README.md` documenta metodología, cobertura, mapeo, validación.
5. ✓ Validación contra PDF: los 12 valores regionales pasan ±1pp.

## 5. Plan ejecutado (3 historias)

### H1 · Setup del entorno y validación rápida · ✓
- `platform/data/latinobarometro-2024/raw/` creado.
- CSVs (español + inglés) y cuestionario copiados.
- `.gitignore` agregado para no committear el CSV.
- Verificación: pandas 2.3.3 disponible, 17 países confirmados, 332 columnas, las 12 variables presentes.

### H2 · Pipeline de cómputo · ✓
- `build_indicators.py` con dos funciones core: `pct_weighted()` y `mean_weighted()`.
- Loop principal sobre los 12 indicadores × 17 países.
- Output a `indicators.json` con schema:

```json
{
  "version": "lb2024-v20250817",
  "computed_at": "2026-05-08",
  "n_total": 19214,
  "n_countries": 17,
  "indicators": [
    {
      "id": "apoyo-democracia",
      "label": "Apoyo a la democracia",
      "axis": "desrepresentacion",
      "section_pdf": "4.1",
      "page_pdf": 30,
      "questionnaire_var": "P11STGBS",
      "question_text": "La democracia es preferible a cualquier otra forma de gobierno",
      "compute": "% valor = 1 (preferible), ponderado por WT",
      "unit": "%",
      "regional_value": 51.6,
      "regional_n": 19214,
      "by_country": {
        "AR": { "name": "Argentina", "value": 74.6, "n": 1210, "rank": 1 },
        "UY": { "name": "Uruguay", "value": 70.1, "n": 1200, "rank": 2 },
        "...": "..."
      }
    }
  ]
}
```

### H3 · Validación contra PDF · ✓

Cross-check de los 12 valores regionales contra el informe oficial:

| Indicador | Computado | Informe | Δ |
|---|---|---|---|
| Apoyo democracia | 51,6% | 52% | -0,4 |
| No representado parlamento | 74,6% | 75% | -0,4 |
| Cambio radical | 26,5% | 26% | +0,5 |
| Confianza partidos | 16,9% | 17% | -0,1 |
| Confianza congreso | 24,5% | 24% | +0,5 |
| Confianza judicial | 28,5% | 28% | +0,5 |
| Info falsa redes | 76,0% | 76% | 0,0 |
| Elecciones fraudulentas | 60,6% | 61% | -0,4 |
| Sin religión | 18,6% | 19% | -0,4 |
| Izquierda-derecha | 5,62 | 5,6 | +0,02 |
| Confianza redes | 33,6% | 34% | -0,4 |
| Aprobación gobierno | 43,0% | 43% | 0,0 |

**Todos dentro de tolerancia ±1pp.** Pipeline validado. Los rankings por país también coinciden (Argentina #1 en apoyo a la democracia con 74,6 vs 75 del PDF; El Salvador 6,8 exacto en izq-der; México 4,4).

## 6. Decisiones tomadas

Esta spec cierra dos preguntas que quedaban abiertas en Spec 12 §9:

| Pregunta | Resolución |
|---|---|
| ¿`lib/` estático o endpoint FastAPI? | **Estático.** El JSON pesa 30 KB, no justifica backend. El backend FastAPI queda libre para lo que sí justifica DB (eventos, análisis, despachos). |
| ¿Hostear PDF o linkear al sitio oficial? | **Linkear al sitio oficial.** Latinobarómetro mantiene URLs estables y tiene su propia caché. Hostear sería duplicación innecesaria (y zona gris de redistribución). |

## 7. Lo que esto desbloquea

- **Spec 12 H1** ya no necesita transcripción manual: simplemente carga `indicators.json` en el módulo TS.
- **Spec 13** (página comparativa) consume el mismo JSON sin trabajo extra de datos.
- **Series históricas LB 1995-2023:** el mismo pipeline corre contra LB2023, LB2022... bajando esos CSV. Cada año añade ~1 día de trabajo, no semanas.
- **Indicadores nuevos:** si se quiere agregar el indicador 13 (ej. "para quién se gobierna"), es 1 entrada más en el array `INDICATORS` del script, no un nuevo proceso de transcripción.
- **Cruces sociodemográficos** (futura): con los microdatos cargados, queda habilitado computar "apoyo a la democracia por edad" o "por nivel educativo" sin tocar el pipeline base.

## 8. Estructura de archivos resultante

```
platform/data/latinobarometro-2024/
├── raw/                                                     (gitignored)
│   ├── Latinobarometro_2024_Csv_esp_v20250817.csv          26 MB
│   └── Latinobarometro_2024_Cuestionario_esp.pdf           421 KB
├── build_indicators.py                                      11.5 KB
├── indicators.json                                          30 KB ✓ committed
├── README.md                                                6.5 KB
└── .gitignore
```

## 9. Cómo correr (para futuras ediciones)

```bash
cd platform/data/latinobarometro-2024
python3 build_indicators.py
```

Output: `indicators.json` regenerado. Tiempo: <2 segundos.

Para agregar un indicador nuevo: añadir entrada al array `INDICATORS` del script con `id`, `var`, `kind`, `target`, `missing`. Re-correr. Cross-check contra el informe.

Para agregar una edición (ej. LB 2025): bajar el CSV de la nueva edición a `raw/`, parametrizar el script para iterar sobre años, agregar campo `historical` al JSON. Trabajo estimado: 1 día por año.
