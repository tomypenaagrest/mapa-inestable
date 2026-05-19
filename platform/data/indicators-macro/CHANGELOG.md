# CHANGELOG — indicators-macro.json

Historial de cambios al schema y a los datos. Versionado semver:
- **Patch** `macro-v1.0.X` — refresh de datos sin cambios al schema
- **Minor** `macro-v1.X.0` — nuevo indicador o campo opcional en schema
- **Major** `macro-v2.0.0` — breaking change (campo obligatorio removido/renombrado, cambio de unidad, eliminación de indicador)

---

## macro-v1.1.0 — 2026-05-18 (Spec 40)

**Tipo:** Minor — nuevos indicadores + schema extendido con cadencias sub-anuales.

### Schema: campos opcionales agregados a `by_country[ISO2]`

```ts
series_trimestral?: { year, quarter, value, quality }[]
series_mensual?:    { year, month,   value, quality }[]
```

Backward compatible: consumidores existentes (dashboards de país) ignoran los campos nuevos.

### Metadata top-level: campos nuevos

```json
{
  "quarter_start": 2021,
  "quarter_end":   2024,
  "month_start":   2021,
  "month_end":     2024,
  "priority_stubs": ["d1-pobreza", "d2-indigencia"]
}
```

### Indicadores nuevos

| ID | Label | Cadencia | Fuente |
|---|---|---|---|
| `c7-salario-real-mensual` | Salario real mensual (índice base 2021=100) | Mensual | OIT ILOSTAT EAR_4MTH_SEX_ECO_CUR_NB_M |

### Indicadores extendidos

| ID | Extensión |
|---|---|
| `a2-crecimiento-pbi` | Agregado `series_trimestral` (variación YoY trimestral, fuente IMF IFS NGDP_R_K_IX) |

### Stubs marcados como prioritarios

- `d1-pobreza` — alimenta capa temperatura como posible indicador secundario. Fuente CEPALSTAT no disponible vía API.
- `d2-indigencia` — ídem.

### Motivación

EPIC 03 (capas analíticas) requiere datos a cadencia sub-anual para las capas precipitación (PBI trimestral) y temperatura (salario real mensual). Esta versión formaliza el pipeline existente (Spec 14B) como contrato estable y lo extiende con las dos series necesarias. Ver Spec 40.

---

## macro-v1 — 2025-xx-xx (Spec 14B)

Versión inicial. 26 indicadores estructurales en 4 familias para 10 países SA. Series anuales 2010–2024. 15 indicadores con datos reales, 11 stubs.
