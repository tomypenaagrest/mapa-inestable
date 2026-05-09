# Latinobarómetro 2024 — pipeline de indicadores

Cálculo de los 12 indicadores curados de la edición 2024 del Latinobarómetro, computados desde los microdatos crudos para alimentar las fichas-país de Mapa Inestable.

## Cómo correr

```bash
cd platform/data/latinobarometro-2024
python3 build_indicators.py
```

Output: `indicators.json` (~30 KB), consumido por el frontend.

Dependencias: `pandas`, `numpy`. No hace falta `pyreadstat` ni librerías de SPSS — usamos el CSV español que ya viene tabulado.

## Fuente

- **Dataset:** `Latinobarometro_2024_Csv_esp_v20250817.csv` (26 MB, 19.214 filas, 332 variables)
- **Cuestionario:** `Latinobarometro_2024_Cuestionario_esp.pdf` (mapeo de variables a preguntas)
- **Origen:** [Banco de datos Latinobarómetro](https://www.latinobarometro.org/latContents.jsp?CMSID=Datos)
- **Versión:** v20250817

Los archivos crudos viven en `raw/` y están gitignored (pesan demasiado para el repo). Para reconstruir el setup desde cero:

1. Bajar `Latinobarometro_2024_Csv_esp_v20250817.zip` desde la URL de arriba.
2. Descomprimir el CSV en `raw/`.
3. Bajar el cuestionario (PDF) y guardarlo en `raw/`.
4. `python3 build_indicators.py`.

## Cita académica recomendada

> Corporación Latinobarómetro (2024). *Informe Latinobarómetro 2024: La democracia resiliente*. Santiago de Chile.

## Cobertura

| Países | 17 (Sudamérica + México + Centroamérica + República Dominicana) |
|---|---|
| Excluido | Nicaragua (no se aplicó por dictadura, igual que en 2023) |
| Entrevistas | 19.214 (1.000-1.210 por país) |
| Trabajo de campo | 2024 |
| Margen de error típico | ±3% por país (95% confianza) |

Códigos `IDENPA` usados (ISO 3166-1 numeric):

| Code | Slug | País | n |
|---|---|---|---|
| 32 | AR | Argentina | 1.210 |
| 68 | BO | Bolivia | 1.200 |
| 76 | BR | Brasil | 1.204 |
| 152 | CL | Chile | 1.000 |
| 170 | CO | Colombia | 1.200 |
| 188 | CR | Costa Rica | 1.000 |
| 214 | DO | Rep. Dominicana | 1.000 |
| 218 | EC | Ecuador | 1.200 |
| 222 | SV | El Salvador | 1.000 |
| 320 | GT | Guatemala | 1.000 |
| 340 | HN | Honduras | 1.000 |
| 484 | MX | México | 1.200 |
| 591 | PA | Panamá | 1.000 |
| 600 | PY | Paraguay | 1.200 |
| 604 | PE | Perú | 1.200 |
| 858 | UY | Uruguay | 1.200 |
| 862 | VE | Venezuela | 1.200 |

## Metodología de cómputo

Todos los indicadores se calculan **ponderados por `WT`** (peso muestral oficial provisto por Latinobarómetro). Los valores NS/NR se excluyen del denominador (denominador = universo válido, no universo total).

### Tipos de cómputo

| Tipo | Fórmula |
|---|---|
| `pct` | `(Σ WT donde valor ∈ target) / (Σ WT donde valor no es missing) × 100` |
| `mean` | `(Σ valor × WT) / (Σ WT)` dentro del rango válido, excluyendo missing |

### Mapeo definitivo: indicador → variable → cómputo

| # | Indicador | Variable | Códigos missing | Target | Tipo |
|---|---|---|---|---|---|
| 1 | Apoyo a la democracia | `P11STGBS` | {0, 8} | =1 | pct |
| 2 | No representado parlamento | `P25ST` | {0, 8} | =2 | pct |
| 3 | Sociedad debe cambiarse radicalmente | `P4ST` | {0, 8} | =4 | pct |
| 4 | Confianza partidos | `P14ST.G` | {0, 8} | ∈{1,2} | pct |
| 5 | Confianza congreso | `P14ST.D` | {0, 8} | ∈{1,2} | pct |
| 6 | Confianza poder judicial | `P14ST.F` | {0, 8} | ∈{1,2} | pct |
| 7 | Info falsa en redes | `P47ST.D` | {0, 8} | ∈{1,2} | pct |
| 8 | Elecciones fraudulentas | `P27ST` | {0, 8} | =2 | pct |
| 9 | Sin religión | `S1` | {0, 98} | =97 | pct |
| 10 | Izquierda-derecha | `P16ST` | {97, 98, 99} | rango 0-10 | mean |
| 11 | Confianza redes sociales | `P14ST.L` | {0, 8} | ∈{1,2} | pct |
| 12 | Aprobación de gobierno | `P15STGBS` | {0} | =1 | pct |

### Convención de redondeo

- `pct`: 1 decimal (`51.6%`).
- `mean`: 2 decimales (`5.62`).
- El informe oficial redondea a entero. Por eso pueden aparecer diferencias de ±1pp entre nuestro cómputo y los gráficos del informe; es esperable y aceptable (ver "Validación" abajo).

## Validación

El cómputo se cross-checkea contra los valores regionales publicados en el informe oficial:

| Indicador | Computado | Informe | Δ |
|---|---|---|---|
| Apoyo democracia | 51.6% | 52% | -0.4 |
| No representado parlamento | 74.6% | 75% | -0.4 |
| Cambio radical | 26.5% | 26% | +0.5 |
| Confianza partidos | 16.9% | 17% | -0.1 |
| Confianza congreso | 24.5% | 24% | +0.5 |
| Confianza judicial | 28.5% | 28% | +0.5 |
| Info falsa redes | 76.0% | 76% | 0.0 |
| Elecciones fraudulentas | 60.6% | 61% | -0.4 |
| Sin religión | 18.6% | 19% | -0.4 |
| Izquierda-derecha | 5.62 | 5.6 | +0.02 |
| Confianza redes | 33.6% | 34% | -0.4 |
| Aprobación gobierno | 43.0% | 43% | 0.0 |

**Todos dentro de tolerancia ±1pp.** El pipeline está validado.

## Schema del JSON producido

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
        ...
      }
    },
    ...
  ]
}
```

## Cómo agregar un indicador nuevo

1. Identificar la variable en el cuestionario.
2. Determinar `target` (códigos que cuentan al numerador) y `missing`.
3. Agregar entrada al array `INDICATORS` en `build_indicators.py`.
4. Re-correr el script. El JSON se regenera con el nuevo indicador.
5. Cross-check del valor regional contra el informe.
6. Si pasa, actualizar la spec correspondiente y el frontend.

## Cómo agregar series históricas

Bajar el CSV de la edición anterior (ej. `Latinobarometro_2023_Csv_esp.csv`) a `raw/`, parametrizar el script para iterar sobre años, y agregar campo `historical` al JSON. Trabajo estimado: 1 día por año.

## Archivos

```
data/latinobarometro-2024/
├── raw/                                     # gitignored
│   ├── Latinobarometro_2024_Csv_esp_v20250817.csv
│   └── Latinobarometro_2024_Cuestionario_esp.pdf
├── build_indicators.py                      # pipeline
├── indicators.json                          # output (~30 KB) ✓ committed
├── README.md                                # este archivo
└── .gitignore
```
