---
spec: 29
titulo: Calendario de agentes automáticos
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
tipo: documento-arquitectura
afecta: [mapa-inestable.plugin, scheduled-tasks de Cowork, vault entero]
depende_de: []
relaciona_con: [Spec 23, 24, 25, 26, 27, 28, 41]
prioridad: documental
naturaleza: documento vivo — se actualiza cada vez que entra, sale o cambia un agente
---

# 29 · Calendario de agentes automáticos

## Resumen ejecutivo

Mapa Inestable opera como un pequeño newsroom asistido por agentes automáticos. Este documento es la **fuente única de verdad** sobre qué agentes existen, cuándo corren, qué producen y cómo se relacionan entre sí. Cuando se agrega un agente, se cambia un horario, o se decide dar de baja una tarea, se actualiza este archivo. Las specs individuales (Specs 23-28) definen la lógica de cada agente; este documento define el sistema.

**Audiencia:** Tomás (operador) + cualquier futura mano que ayude con Mapa Inestable. Es lo primero que se lee para entender cómo respira el proyecto.

---

## Principios del sistema

1. **Borrador → promote, nunca auto-publish.** Cada agente termina su corrida con un artefacto en borrador. El paso a producción es siempre una decisión humana explícita. La automatización absorbe la repetición; la decisión editorial es del autor.

2. **El vault es el medio.** Los agentes se comunican escribiendo archivos al vault. No hay canales externos (Slack, email, dashboards admin). Tomás opera desde Claude Code + Obsidian + filesystem; los outputs viven en el mismo lugar que el resto del trabajo editorial.

3. **Cada corrida deja un resumen.** Además de los outputs específicos, cada agente que corre sobre múltiples ítems (10 países, N borradores) escribe un archivo de digest. Revisión rápida sin abrir 10 archivos.

4. **Aislación.** Cada agente corre independiente. La falla de uno no afecta a los otros. Las scheduled tasks se crean una por unidad (un país, un eje, etc.) en lugar de una mega-task que loopee.

5. **Cadencias respetan el ritmo editorial.** Diario para descubrimiento, viernes a la tarde para cierre semanal, sábado/domingo para escritura, lunes a la mañana para revisión y promote. No correr agentes en momentos donde su output no tiene dónde ir.

6. **Sin sorpresas.** Ningún agente toca contenido en `15-Países/`, `50-Publicaciones/` o cualquier carpeta "viva" salvo a través de un skill de promote explícito disparado por el autor.

---

## Calendario semanal

Horarios en ART (`America/Argentina/Buenos_Aires`).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RITMO SEMANAL                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ LUN  │ MAR  │ MIÉ  │ JUE  │ VIE                │ SÁB         │ DOM     │
├──────┼──────┼──────┼──────┼────────────────────┼─────────────┼─────────┤
│ daily│ daily│ daily│ daily│ daily (mañana)     │             │         │
│      │      │      │      │                    │             │         │
│ 09h: │      │      │      │ 16:00:             │ humano:     │ humano: │
│ rev. │      │      │      │ coding-viento-     │ promote     │ escrit. │
│ pro- │      │      │      │ recordatorio       │ pendientes  │ despacho│
│ mote │      │      │      │ 17:00:             │             │         │
│      │      │      │      │ agenda-semanal     │             │         │
│      │      │      │      │ ×10 países         │             │         │
│      │      │      │      │ 18:00:             │             │         │
│      │      │      │      │ pipeline-macro-    │             │         │
│      │      │      │      │ refresh → resumen  │             │         │
│      │      │      │      │ 19:00:             │             │         │
│      │      │      │      │ build-viento       │             │         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detalle

| Día | Hora ART | Agente | Output | Acción humana asociada |
|---|---|---|---|---|
| Lun-Vie | 08:00 | `agente-diario` | borradores en `60-Borradores/diario/` | Revisar al pasar, sin obligación |
| **Viernes** | **16:00** | **`coding-viento-recordatorio`** | borradores base en `70-Producto/datos-viento/<slug>/YYYY-W##.md` + `_compilado/_recordatorio-YYYY-W##.md` | Coding humano: editor codifica ~16:30-17:30 con skill `coding-viento` |
| **Viernes** | **17:00** | **`agenda-semanal` × 10** | borradores en `60-Borradores/agendas/` + `_resumen-YYYY-W##.md` | — |
| **Viernes** | **18:00** | **`pipeline-macro-refresh`** | `60-Borradores/pipeline-macro/_resumen-YYYY-W##.md` | Revisar frescura del JSON; ejecutar pipeline si es necesario |
| **Viernes** | **19:00** | **`build-viento`** | `70-Producto/datos-viento/_compilado/viento.json` + `_log-YYYY-W##.md` + copia a `platform/frontend/src/data/coding-viento/viento.json` | Verificar log en `_compilado/` |
| Sábado | flexible | (humano) | revisa resumen semanal, comienza escritura | promote selectivo |
| Domingo | flexible | (humano) | escritura del despacho semanal | usa agendas como capa intermedia |
| Lunes | 09:00 | (humano) | revisión final + promote pendientes | `promover-agenda <slug>` desde Claude Code |

### Por qué este ritmo

- **Diario por la mañana:** descubrimiento de eventos sin saturar la noche.
- **Viernes 17:00 para agendas:** cierre del arco narrativo semanal. La conversación pública de la semana ya jugó. Beneficio extra: alimenta al despacho del fin de semana con las agendas frescas como capa intermedia entre disparadores y ejes.
- **Sábado / domingo para escritura humana:** el momento de mayor concentración de Tomás coincide con materiales ya generados (borradores diarios acumulados + agendas semanales recién drafteadas).
- **Lunes a la mañana para promote:** las decisiones editoriales del fin de semana se ejecutan en el inicio formal de la semana; el sitio se sincroniza con la mirada editorial actual.

---

## Inventario de agentes

### `agente-diario`

| Campo | Valor |
|---|---|
| Spec de referencia | 23, 24, 25 |
| Skill | (existente en `mapa-inestable.plugin`) |
| Cadencia | Diario, lun-vie 08:00 ART |
| Trigger | Scheduled task |
| Input | RSS de fuentes monitoreadas |
| Output | `60-Borradores/diario/<YYYY-MM-DD>-<slug>.md` |
| Resumen | (TBD — confirmar si el agente diario tiene un resumen agregado o solo deposita borradores individuales) |
| Promote | Skill aparte (Spec 24) |
| Estado | En producción |

### `agenda-semanal` (10 instancias, una por país)

| Campo | Valor |
|---|---|
| Spec de referencia | 27, 28 |
| Skills | `C:\Users\Tomi\OneDrive\Documentos\Claude\Scheduled\mapa-inestable-agenda-{slug}-semanal\SKILL.md` × 10 |
| Cadencia | Semanal, viernes 17:00 ART (cron `0 17 * * 5`) |
| Trigger | 10 scheduled tasks de Cowork (una por país), paralelas con jitter de hasta 6 min |
| Input | Web search + Google News RSS por país (gl/ceid/hl en el prompt) |
| Output | `60-Borradores/agendas/<slug>.md` + append a `_resumen-YYYY-W##.md` |
| Resumen | Archivo semanal con bloques de los 10 países, diffs, alertas editoriales |
| Promote | Script `npm run promote-agenda <slug>` (ver abajo) |
| Estado | **Implementada** · primera corrida real: viernes 15 may 2026 17:00 ART |

### `promover-agenda` (script Node, no skill del plugin)

| Campo | Valor |
|---|---|
| Spec de referencia | 28 §5 + notas de implementación |
| Script | `scripts/promote-agenda.mjs` en el repo del vault |
| Comando | `npm run promote-agenda <slug>` (CLI) o `npm run promote-agenda` (interactivo) |
| Cadencia | On-demand (humano dispara desde Claude Code o terminal) |
| Input | `60-Borradores/agendas/<slug>.md` con `estado: borrador` |
| Output | `15-Países/agendas/<slug>.md` con `estado: publicada` + archive del borrador en `_archive/<slug>-<fecha>.md` + marca en resumen semanal |
| Edge case manejado | Live más reciente que borrador → pregunta antes de overwrite |
| Estado | **Implementada** |

### `coding-viento-recordatorio`

| Campo | Valor |
|---|---|
| Spec de referencia | 41 (pipeline de datos políticos para capa viento) |
| Skill | `70-Producto/skills/coding-viento/SKILL.md` (suelto en vault — decisión 2026-05-19, no en plugin) |
| Cadencia | Semanal, **viernes 16:00 ART** (antes del agenda-semanal a 17:00) |
| Trigger | Scheduled task `mapa-inestable-coding-viento-recordatorio` (1 instancia, no por país) |
| Input | Archivos `70-Producto/datos-viento/<slug>/YYYY-W##.md` existentes (lee coding previo para pre-rellenar) |
| Output | `70-Producto/datos-viento/<slug>/YYYY-W##.md` × 10 en `estado: borrador` + `_recordatorio-YYYY-W##.md` (checklist) |
| Promote | Humano: el editor codifica con el skill `coding-viento` y cambia cada .md a `estado: publicada` |
| Estado | **Activo desde 2026-05-19** · scheduled task creada, primera corrida viernes 2026-05-22 16:04 ART |

**Qué hace:**
- Crea los 10 archivos de coding de la semana en borrador (si no existen).
- Pre-rellena rank tentativo = semana anterior (continuidad por default).
- Deja el archivo resumen `_recordatorio-YYYY-W##.md` con checklist de los 10 países.
- **No genera rank propio** — solo prepara el terreno para el coding humano.

### `build-viento`

| Campo | Valor |
|---|---|
| Spec de referencia | 41 (pipeline de datos políticos para capa viento, decisión #14 r2) |
| Script | `node platform/data/coding-viento/build_viento.mjs` |
| Cadencia | Semanal, **viernes 19:00 ART** (red de seguridad) + on-publish vía skill `coding-viento` (trigger primario) |
| Trigger | Scheduled task `mapa-inestable-build-viento` (red de seguridad) + skill `coding-viento` al cambiar `estado: borrador` → `estado: publicada` (trigger primario) |
| Input | `70-Producto/datos-viento/<slug>/*.md` con `estado: publicada` (cualquier número ≥ 1 país válido — decisión #15 r2) |
| Output | `70-Producto/datos-viento/_compilado/viento.json` + `platform/frontend/src/data/coding-viento/viento.json` + `_log-YYYY-W##.md` |
| Promote | No aplica — el JSON es output directo del pipeline |
| Estado | **Activo desde 2026-05-19** · scheduled task creada, primera corrida viernes 2026-05-22 19:08 ART |

**Qué supervisa:**
- Valida rank ∈ {-3..+3}, intensidad ∈ [0,1], campos obligatorios presentes, `country_slug` coincide con carpeta.
- Solo incluye `estado: publicada` en el JSON.
- Loguea resumen en `_compilado/_log-YYYY-W##.md`.
- Detecta si hubo cambios respecto a la corrida anterior y lo anota en el log.

### `pipeline-macro-refresh`

| Campo | Valor |
|---|---|
| Spec de referencia | 40 (pipeline macro EPIC 03) |
| Skill | `70-Producto/skills/pipeline-macro-refresh/SKILL.md` (suelto en vault — decisión 2026-05-19, no en plugin) |
| Cadencia | Semanal, **viernes 18:00 ART** (después de agenda-semanal a 17:00) |
| Trigger | Scheduled task `mapa-inestable-pipeline-macro-refresh` (1 instancia, no una por país) |
| Input | `platform/data/indicators-macro/indicators-macro.json` |
| Output | Auto-promote o borrador según política: si triviales → copia directa a `platform/frontend/src/data/indicators-macro/`; si materiales → `60-Borradores/pipeline-macro/<YYYY-W##>/indicators-macro.json`. Siempre `_resumen-YYYY-W##.md` |
| Resumen | El propio archivo de resumen (1 archivo por semana) |
| Promote | **Auto-promote con umbral del 5%** (decisión #12 r2 de Spec 40): cambios triviales (ningún datapoint > 5% + sin indicadores nuevos + sin stubs completados) se promueven solos; cambios materiales esperan review manual de Tomás |
| Estado | **Activo desde 2026-05-19** · scheduled task creada, primera corrida viernes 2026-05-22 18:05 ART |

**Modo dual (decisión #10 r2):**
- **Si el sandbox bash de Cowork puede ejecutar Python con network access**: ejecuta `build_indicators_macro.py` directamente y aplica auto-promote.
- **Si no puede**: solo modo supervisor + chequeo de frescura, deja aviso para que Tomás corra el script desde su laptop.

**Qué supervisa siempre:**
- Frescura del JSON (`computed_at` > 7 días → alerta).
- Cobertura de sub-anuales: `a2-crecimiento-pbi.series_trimestral` (capa precipitación) y `c7-salario-real-mensual.series_mensual` (capa temperatura).
- Priority stubs: `d1-pobreza` y `d2-indigencia` (pendientes para capa temperatura Spec 43).

### `analisis-semanal`

| Campo | Valor |
|---|---|
| Spec de referencia | (skill heredado de la versión inicial del plugin) |
| Skill | `mapa-inestable.plugin/skills/analisis-semanal/` (existente) |
| Cadencia | On-demand |
| Trigger | "analizá [país]" desde Claude Code |
| Input | Noticias provistas por Tomás + perfil de país + ejes |
| Output | Análisis estructural en formato 4-pasos, opcionalmente guardado en `50-Publicaciones/` |
| Estado | En uso |

### `despacho-semanal`

| Campo | Valor |
|---|---|
| Spec de referencia | (skill heredado) |
| Skill | `mapa-inestable.plugin/skills/despacho-semanal/` (existente) |
| Cadencia | On-demand, típicamente fin de semana |
| Trigger | "armá el despacho" desde Claude Code |
| Input | Análisis de la semana + agendas (cuando estén live) |
| Output | Despacho publicable (formato Substack) |
| Estado | En uso |

---

## Patrón borrador → promote (aplicado al sistema)

Todos los agentes que producen contenido siguen el mismo patrón de tres carpetas:

```
60-Borradores/    ← donde escriben los agentes automáticos
   diario/        ← agente-diario
   agendas/       ← agenda-semanal
   despachos/     ← (futuro: despacho-builder)

15-Países/        ← contenido live, escrito tras promote humano
   agendas/

50-Publicaciones/ ← publicaciones promovidas
60-Borradores/_archive/ ← versiones anteriores (cuando aplique)
```

**Regla invariable:** ningún agente automático escribe directamente fuera de `60-Borradores/`. Las únicas entradas a las carpetas live son los skills de promote disparados por humanos.

Esta separación garantiza que cualquier corrida defectuosa (hallucination, error de parseo, prensa fabricada) quede contenida en borradores y no contamine el sitio.

---

## Coordinación entre agentes

### No overlap temporal

Los agentes no se superponen en horario para evitar confusión cognitiva (dos notificaciones a la vez es ruido aunque técnicamente no haya conflicto).

- `agente-diario` corre 08:00 ART. El viernes corre como cualquier otro día.
- `agenda-semanal` corre 17:00 ART, solo viernes. 9 horas de margen con el daily.

### Dependencias suaves

- `despacho-semanal` (manual) idealmente se escribe **después** de que las agendas live estén actualizadas con los promotes del lunes. Si Tomás escribe el despacho el sábado/domingo sin haber promovido aún, igual funciona pero pierde la opción de citar las agendas live en la pieza.
- No hay dependencias duras (un agente esperando explícitamente la salida de otro). Cada uno opera con lo que encuentra.

### Recursos compartidos

- Todos los agentes pueden leer cualquier parte del vault.
- Solo los skills de promote escriben en carpetas live.
- Las scheduled tasks de Cowork son independientes; ninguna otra config compartida.

---

## Cómo agregar un agente nuevo al sistema

1. **Definir necesidad.** Escribir una spec individual (siguiente número disponible) con el patrón de Spec 27/28.
2. **Patrón borrador → promote.** El agente DEBE escribir a `60-Borradores/<categoría>/` y nunca tocar carpetas live directamente.
3. **Cadencia.** Decidir cuándo corre. Evitar superposición con agentes existentes en este calendario.
4. **Resumen.** Si la corrida produce múltiples outputs, definir el archivo de resumen.
5. **Skill complementario de promote.** Crear el skill que mueva el borrador a live, con sus edge cases (qué pasa si el live es más reciente, etc.).
6. **Actualizar este documento.** Agregar entrada al inventario (§) y al calendario semanal (§). Sin esa entrada, el agente no está oficialmente en el sistema.

---

## Cómo modificar el calendario

- **Cambiar un horario:** editar el cron en `mapa-inestable.plugin/scheduled-tasks/*.yml` + actualizar este documento.
- **Pausar un agente temporalmente:** desactivar la scheduled task en Cowork. Anotar en este documento con fecha y razón.
- **Dar de baja:** mover la entrada del inventario a una sección §Histórico al final de este documento + eliminar la scheduled task.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-11 | Creación del documento + entrada inicial para `agente-diario`, `agenda-semanal`, `promover-agenda`, `analisis-semanal`, `despacho-semanal` | Spec 28 destapó la necesidad de un calendario unificado |
| 2026-05-11 | Spec 28 ejecutada — 10 scheduled tasks creadas (`mapa-inestable-agenda-{slug}-semanal`) + script `promote-agenda.mjs`. `promover-agenda` quedó como script Node en lugar de skill del plugin (alineación con `promote-draft.mjs` de Spec 24) | Implementación |
| 2026-05-20 | Spec 41 ejecutada — `coding-viento-recordatorio` (viernes 16:00) + `build-viento` (viernes 19:00) agregados al calendario. Skill `coding-viento` en el plugin ZIP. Pipeline `build_viento.mjs` implementado. JSON compilado + copia frontend. | Spec 41 implementada |
| 2026-05-19 | Las 3 scheduled tasks del epic 03 creadas en Cowork: `mapa-inestable-coding-viento-recordatorio` (viernes 16:00 ART, cron `0 16 * * 5`), `mapa-inestable-pipeline-macro-refresh` (viernes 18:00 ART, cron `0 18 * * 5`), `mapa-inestable-build-viento` (viernes 19:00 ART, cron `0 19 * * 5`). SKILL.md de `coding-viento` y `pipeline-macro-refresh` escritos en `70-Producto/skills/` (decisión: skills sueltos en vault, no en plugin, para uso personal). Primera corrida real: viernes 2026-05-22 | Cierre operativo de Specs 40 y 41. El epic 03 pasa a tener sus 3 agentes activos en el calendario semanal |

---

## Preguntas abiertas

1. **Cadencia exacta del `agente-diario`.** El skill existe (Specs 23-25) pero la hora exacta no está documentada en este calendario. Confirmar y completar.
2. **Resumen del agente diario.** ¿Genera un digest diario o solo deposita borradores individuales? Si genera, dónde lo escribe.
3. **`despacho-builder` automático.** Hoy el despacho semanal es 100% humano (con skill asistente). En el futuro podría existir un `despacho-builder` que ensamble un borrador. ¿Va? ¿Cuándo? Si sí, su cadencia sugerida es domingo 10:00 ART.
4. **Cleanup de archivos `_resumen-*.md` antiguos.** Acumular es barato pero después de 6 meses puede tener sentido moverlos a `_archive/`. Definir política.
5. **¿Hay agentes de monitoreo (no de generación)?** Por ejemplo, un agente que detecte que un país no tuvo publicaciones en 4 semanas y alerte. Útil para mantener el dashboard vivo en todos los países.
