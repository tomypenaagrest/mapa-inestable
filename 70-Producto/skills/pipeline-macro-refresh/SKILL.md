---
skill: pipeline-macro-refresh
tipo: supervisor + ejecutor (cuando el sandbox lo permite)
activacion: scheduled (viernes 18:00 ART) + on-demand
output: 60-Borradores/pipeline-macro/_resumen-YYYY-W##.md
spec: 40
nota: Skill suelto en el vault (decisión 2026-05-19 — no se carga al plugin para uso personal). Si en algún momento se decide migrarlo al plugin, este archivo es la fuente.
---

# Skill: pipeline-macro-refresh

Supervisa la frescura del `indicators-macro.json` y, cuando el sandbox bash de Cowork lo permite (Python + network access a Banco Mundial), también ejecuta `build_indicators_macro.py`. Aplica la política de auto-promote del 5% definida en Spec 40 r2.

**Modo dual (decisión #10 r2):**

- **Si el sandbox puede correr Python con network**: el skill ejecuta el pipeline directamente, calcula diff, decide auto-promote vs review manual.
- **Si el sandbox no puede** (sin Python o sin network access a BM): el skill solo supervisa la frescura y deja un aviso en el resumen. Tomás corre el script manualmente desde su laptop.

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

## Política de auto-promote (decisión #12 r2)

Cuando el skill ejecuta el pipeline y regenera el JSON, decide entre promote automático o esperar review manual según la magnitud de los cambios:

**Triviales (auto-promote OK):**
- Ningún datapoint varió más del 5% respecto al JSON anterior.
- No hubo indicadores nuevos.
- Ningún stub se completó.
- Ningún cambio de unidad o metodología.

→ El skill copia el JSON regenerado a `platform/frontend/src/data/indicators-macro/indicators-macro.json` directamente. Log: "AUTO-PROMOTED · cambios triviales".

**Materiales (esperar review manual):**
- Al menos un datapoint varió > 5%.
- O hubo indicador nuevo.
- O se completó algún stub.
- O cambió unidad / metodología.

→ El skill deja el JSON regenerado en `60-Borradores/pipeline-macro/<YYYY-W##>/indicators-macro.json` (borrador). Log detallado con lista de cambios > 5%, recomendación de review. Tomás promueve manualmente cuando confirma.

## Principios (Spec 29)

- Solo escribe en `60-Borradores/pipeline-macro/` cuando es review manual.
- En auto-promote, escribe directamente al frontend (decisión consciente para evitar fricción semanal en cambios triviales).
- En caso de error de acceso: log "FALLA · [descripción]", sin output de borradores, JSON actual queda intacto.

---

*Spec 40 · EPIC 03 · Spec 29*
