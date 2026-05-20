---
tipo: pipeline-macro-refresh
fecha: 2026-05-20
semana: 2026-W21
json_version: macro-v1.1.0
json_computed_at: 2026-05-19
modo: supervisor (CASO B — sandbox sin network access)
---

# Pipeline macro — resumen semana 2026-W21

## Estado general

- **JSON canónico**: `macro-v1.1.0` · generado 2026-05-19 · **fresco** (1 día)
- **Indicadores totales**: 27
- **Países**: 10 (AR, BO, BR, CL, CO, EC, PY, PE, UY, VE)
- **Stubs declarados (12)**: `b1-exp-primarias`, `b2-cuota-principal-socio`, `b3-cuota-china`, `b4-cuota-eeuu`, `b5-ied-pbi`, `c3-registrado`, `c6-subocupacion`, `d1-pobreza`, `d2-indigencia`, `d6-homicidios`, `d7-presion-tributaria`, `c7-salario-real-mensual`
- **Priority stubs pendientes**: `d1-pobreza`, `d2-indigencia` (bloqueantes para capa temperatura)

> Observación: `c5-brecha-genero` figura con `n_countries_covered=0` pero NO está marcado en `stubs[]`. Posible inconsistencia a revisar manualmente.

## Series sub-anuales (EPIC 03)

| Indicador | series_trimestral | series_mensual | AC |
|---|---|---|---|
| a2-crecimiento-pbi | **0/10 países** | — | ❌ AC2 (necesita ≥8) |
| c7-salario-real-mensual | — | **0/10 países** | ❌ AC3 (necesita ≥6) |

Ningún país tiene series sub-anuales todavía. Las series anuales del JSON están cubiertas, pero el pipeline trimestral (IMF IFS) y mensual (ILO + fuentes nacionales) no se ha ejecutado nunca con éxito en este JSON.

## Diagnóstico de este run

El sandbox de Cowork tiene Python 3.10 disponible pero **no tiene network access a las APIs externas**:

- `api.worldbank.org` → 403 (proxy)
- `dataservices.imf.org` → 403 (proxy)

Por lo tanto se entra en **CASO B (supervisor)**: no se ejecuta el pipeline, no se hace diff, no se aplica política de auto-promote. El JSON actual queda intacto.

## Acciones pendientes

- [ ] **Ejecutar pipeline manualmente desde la laptop** (network access a BM + IMF + ILO):
      ```
      cd platform/data/indicators-macro && python3 build_indicators_macro.py
      ```
      Luego inspeccionar diff y promover según política del 5%.
- [ ] **Completar series sub-anuales** (EPIC 03 — bloqueante de capas analíticas):
  - `a2-crecimiento-pbi.series_trimestral`: validar adaptador IMF IFS en `sources.py`. Target ≥8 países.
  - `c7-salario-real-mensual.series_mensual`: agregar fuentes nacionales (INDEC, IBGE, INE Chile, DANE) a `sources.py`. Target ≥6 países.
- [ ] **Priority stubs**: completar `d1-pobreza` y `d2-indigencia` (bloqueantes de capa temperatura — EPIC 03).
- [ ] **Revisar inconsistencia**: `c5-brecha-genero` tiene 0 cobertura pero no está listado en `stubs[]`. Decidir si agregarlo o popularlo.

## Estado de auto-promote

No aplicable este run. Sin ejecución del pipeline no hay diff que evaluar.

## Próxima corrida automática

Viernes 2026-05-29 18:00 ART (semana 2026-W22).

---

*Run automático del scheduled task `mapa-inestable-pipeline-macro-refresh` · Spec 40 r2 · Spec 29 · EPIC 03*
