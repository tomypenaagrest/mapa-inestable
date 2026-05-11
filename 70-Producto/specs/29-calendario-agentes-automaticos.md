---
spec: 29
titulo: Calendario de agentes automáticos
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
tipo: documento-arquitectura
afecta: [mapa-inestable.plugin, scheduled-tasks de Cowork, vault entero]
depende_de: []
relaciona_con: [Spec 23, 24, 25, 26, 27, 28]
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
│ LUN  │ MAR  │ MIÉ  │ JUE  │ VIE              │ SÁB         │ DOM       │
├──────┼──────┼──────┼──────┼──────────────────┼─────────────┼───────────┤
│ daily│ daily│ daily│ daily│ daily (mañana)   │             │           │
│      │      │      │      │                  │             │           │
│ 09h: │      │      │      │ 17:00:           │ humano:     │ humano:   │
│ rev. │      │      │      │ agenda-semanal   │ promote     │ escritura │
│ pro- │      │      │      │ ×10 países       │ pendientes  │ despacho  │
│ mote │      │      │      │ → resumen sem.   │             │           │
└─────────────────────────────────────────────────────────────────────────┘
```

### Detalle

| Día | Hora ART | Agente | Output | Acción humana asociada |
|---|---|---|---|---|
| Lun-Vie | 08:00 | `agente-diario` | borradores en `60-Borradores/diario/` | Revisar al pasar, sin obligación |
| **Viernes** | **17:00** | **`agenda-semanal` × 10** | borradores en `60-Borradores/agendas/` + `_resumen-YYYY-W##.md` | — |
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

### `agenda-semanal`

| Campo | Valor |
|---|---|
| Spec de referencia | 27, 28 |
| Skill | `mapa-inestable.plugin/skills/agenda-semanal/` (a crear) |
| Cadencia | Semanal, viernes 17:00 ART |
| Trigger | 10 scheduled tasks (una por país), paralelas |
| Input | Web search + Google News RSS (v1) / tabla `events` (v2) |
| Output | `60-Borradores/agendas/<slug>.md` + append a `_resumen-YYYY-W##.md` |
| Resumen | Archivo semanal con los 10 países, diffs, alertas |
| Promote | Skill `promover-agenda` (Spec 28 §5) |
| Estado | En diseño |

### `promover-agenda`

| Campo | Valor |
|---|---|
| Spec de referencia | 28 §5 |
| Skill | `mapa-inestable.plugin/skills/promover-agenda/` (a crear) |
| Cadencia | On-demand (humano dispara) |
| Trigger | "promové la agenda de X" desde Claude Code |
| Input | `60-Borradores/agendas/<slug>.md` |
| Output | `15-Países/agendas/<slug>.md` + marca en resumen semanal |
| Estado | En diseño |

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

---

## Preguntas abiertas

1. **Cadencia exacta del `agente-diario`.** El skill existe (Specs 23-25) pero la hora exacta no está documentada en este calendario. Confirmar y completar.
2. **Resumen del agente diario.** ¿Genera un digest diario o solo deposita borradores individuales? Si genera, dónde lo escribe.
3. **`despacho-builder` automático.** Hoy el despacho semanal es 100% humano (con skill asistente). En el futuro podría existir un `despacho-builder` que ensamble un borrador. ¿Va? ¿Cuándo? Si sí, su cadencia sugerida es domingo 10:00 ART.
4. **Cleanup de archivos `_resumen-*.md` antiguos.** Acumular es barato pero después de 6 meses puede tener sentido moverlos a `_archive/`. Definir política.
5. **¿Hay agentes de monitoreo (no de generación)?** Por ejemplo, un agente que detecte que un país no tuvo publicaciones en 4 semanas y alerte. Útil para mantener el dashboard vivo en todos los países.
