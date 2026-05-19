---
skill: pipeline-macro-refresh
tipo: supervisor
activacion: scheduled (viernes 18:00 ART) + on-demand
output: 60-Borradores/pipeline-macro/_resumen-YYYY-W##.md
spec: 40
nota: Este archivo es el staging del skill. Importar a mapa-inestable.plugin desde Cowork.
---

# Skill: pipeline-macro-refresh

Supervisa la frescura del `indicators-macro.json` y registra en el vault qué cambió.
No ejecuta el script Python — lo supervisa y deja log.

---

## Activación

- **Scheduled**: viernes 18:00 ART (Spec 29, después del task de agendas).
- **On-demand**: "refrescá el pipeline macro".

---

## Qué hace

### 1. Leer estado actual del JSON

```
Leer platform/data/indicators-macro/indicators-macro.json
```

Extraer: `version`, `computed_at`, `stubs`, `priority_stubs`, y para cada indicador
`source.pulled_at` + presencia de `series_trimestral` / `series_mensual`.

### 2. Verificar frescura

- `computed_at` > 7 días → desactualizado → alerta en el resumen.
- Semana actual → sin cambios de frescura.

### 3. Verificar cobertura de sub-anuales (EPIC 03)

`a2-crecimiento-pbi.series_trimestral`:
- ≥ 8 países con datos → OK (AC2 cumplido)
- < 8 → recordar ejecutar pipeline con acceso a IMF IFS (dataservices.imf.org)

`c7-salario-real-mensual.series_mensual`:
- ≥ 6 países → OK (AC3 cumplido)
- < 6 → recordar agregar fuentes nacionales en sources.py

### 4. Priority stubs

Mencionar `d1-pobreza` y `d2-indigencia` si siguen sin datos.

### 5. Escribir resumen

Crear `60-Borradores/pipeline-macro/_resumen-YYYY-W##.md`:

```markdown
---
tipo: pipeline-macro-refresh
fecha: YYYY-MM-DD
semana: YYYY-W##
json_version: macro-v1.X.Y
json_computed_at: YYYY-MM-DD
---

# Pipeline macro — resumen semana YYYY-W##

## Estado general
- JSON: macro-v1.X.Y · generado YYYY-MM-DD · [fresco / desactualizado]
- Indicadores con datos anuales: N/27
- Stubs: [lista]
- Priority stubs pendientes: d1-pobreza, d2-indigencia

## Series sub-anuales (EPIC 03)
| Indicador | series_trimestral | series_mensual |
|---|---|---|
| a2-crecimiento-pbi | N/10 países | — |
| c7-salario-real-mensual | — | N/10 países |

## Acciones pendientes
- [ ] [si desactualizado] Ejecutar `py build_indicators_macro.py` con acceso a internet
- [ ] Completar d1-pobreza y d2-indigencia (priority stubs para capa temperatura)
- [ ] [otras si aplican]
```

---

## Principios (Spec 29)

- Solo escribe en `60-Borradores/pipeline-macro/`.
- La promote del JSON al frontend es siempre manual.
- En caso de error de acceso: log "FALLA · [descripción]", sin output de borradores.

---

*Spec 40 · EPIC 03 · Spec 29*
