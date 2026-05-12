---
spec: 28
titulo: Scheduled task semanal de actualización de agendas (Cowork)
estado: implementada
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-11
revision: 2026-05-11 (r2) — viernes 17:00 ART en lugar de lunes 09:00; resumen semanal en vault en lugar de notificación Slack
afecta: [mapa-inestable.plugin (nuevos skills agenda-semanal y promover-agenda), 60-Borradores/agendas/ (nueva carpeta), 15-Países/agendas/ (escritura tras promote)]
depende_de: [27]
relaciona_con: [Spec 23 (frontmatter agente), Spec 24 (promover borrador), Spec 25 (pipeline visible), Spec 27 (agendas por país), Spec 29 (calendario de agentes)]
prioridad: media
desbloquea: agendas vivas sin trabajo manual de curaduría semanal
---

# 28 · Scheduled task semanal de actualización de agendas

## Resumen ejecutivo

Spec 27 dejó el formato del archivo `15-Países/agendas/<slug>.md` listo para ser editado a mano. Esta spec automatiza la generación de ese archivo semana a semana mediante una tarea programada en Cowork: cada **viernes a las 17:00 ART**, para cada uno de los 10 países, un skill de Claude lee la prensa de la última semana, identifica las 3-5 agendas dominantes, redacta descripciones factuales y guarda un **borrador** en `60-Borradores/agendas/<slug>.md`. Además escribe un **archivo de resumen semanal** que digiere los 10 países en una sola vista.

El borrador **nunca se publica solo**. El fin de semana o el lunes a la mañana, Tomás abre el resumen, revisa, promueve los que aprueba y edita los que necesitan ajuste. La separación borrador / live es la misma decisión editorial que el agente diario (Specs 23-25): la automatización propone, el autor decide.

**Por qué viernes 17:00 y no lunes 09:00.** La agenda no es predictiva — es la lectura del estado de la conversación pública. Viernes a la tarde captura el cierre del arco narrativo semanal: lo que se conversó esta semana ya jugó. Lunes a la mañana mezcla el residuo del fin de semana con la anticipación de la semana que arranca — temporalidad confusa para una agenda. Beneficio extra: el despacho semanal se nutre de las agendas, y con esta cadencia el despacho del sábado/domingo cuenta con las agendas frescas como capa intermedia entre disparadores y ejes.

**Por qué archivo de resumen y no notificación externa.** Tomás opera desde Claude Code + Obsidian + filesystem; no hay valor en empujar pings a Slack u otros canales. El digest semanal con rankings, diffs y alertas vive en el vault como cualquier otro artefacto editorial. Se abre el lunes a la mañana como primera acción del día.

**Lo que entra:**
- Nuevo skill `agenda-semanal` en `mapa-inestable.plugin`.
- 10 scheduled tasks (una por país) que corren los viernes 17:00 ART y disparan el skill.
- Path de borrador: `60-Borradores/agendas/<slug>.md`.
- **Archivo de resumen semanal:** `60-Borradores/agendas/_resumen-YYYY-W##.md` (un archivo por semana, persistente como log histórico de qué propuso el sistema).
- Skill auxiliar `promover-agenda` que copia borrador → live y deja un check en el resumen.
- Cómputo de tendencia comparando el borrador con el live actual.

**Lo que NO entra:**
- Cambios al esquema del archivo de agenda (Spec 27 sigue siendo la fuente).
- Cambios al frontend (Spec 27 ya renderiza desde `15-Países/agendas/<slug>.md`).
- Generación de análisis ni de despacho (eso es `analisis-semanal` y `despacho-semanal`).
- Snapshot histórico de **agendas live** (en backlog; ver §8).
- Notificaciones externas (Slack, email). El resumen en el vault es la única vista de control.
- UI web para editar borradores. Se editan en Obsidian / VSCode.

---

## Estado actual

### Lo que dejó preparado Spec 27

- Formato canónico del archivo `15-Países/agendas/<slug>.md` con frontmatter YAML estructurado.
- Lib server-side `lib/agendas.ts` con `getCountryAgenda(slug)`.
- Componente `<TabAgenda>` que renderiza vivo desde el vault.

### Lo que falta

- **No hay quién escriba esos archivos.** Sin tarea programada, las agendas envejecen rápido y la "vida" del dashboard se vuelve teatro.
- **No hay loop de feedback** entre la prensa de la semana y lo que el sitio muestra como agenda.

### Cambio menor a Spec 27

Spec 27 dejaba abierto que la tarea podría escribir directo a `15-Países/agendas/<slug>.md`. **Esta spec lo revisa:** la escritura directa rompería el principio editorial de revisión humana. La tarea escribe a borrador; el promote es acto humano. Se agrega un campo opcional `estado: borrador | publicada` al frontmatter para defender contra archivos arrastrados por accidente. `lib/agendas.ts` filtra por `estado === "publicada"` o ausencia del campo (retrocompatible).

---

## Propuesta

### 1. Arquitectura general

```
┌─────────────────────────────────────────────────────────────────────┐
│  COWORK SCHEDULED TASK (×10, una por país)                          │
│  Cron: viernes 17:00 ART                                            │
│  Acción: disparar skill `agenda-semanal` con country_slug=<slug>    │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SKILL `agenda-semanal`                                             │
│                                                                      │
│  1. Lee 15-Países/<slug>.md (perfil del país)                        │
│  2. Lee 15-Países/agendas/<slug>.md si existe (live previo, para     │
│     calcular tendencia y diff)                                       │
│  3. Lee 10-Ejes/*.md (referencia conceptual)                         │
│  4. Ingesta prensa últimos 7 días (web search + Google News RSS)     │
│  5. Clasifica eventos por tema → cluster en 3-5 agendas              │
│  6. Para cada agenda: redacta descripción, define query, asigna     │
│     tendencia (vs. live), sugiere eje vinculado                      │
│  7. Escribe 60-Borradores/agendas/<slug>.md con estado: borrador    │
│  8. Append al archivo semanal _resumen-YYYY-W##.md con el digest    │
│     del país (ranking, diff vs. semana previa, alertas editoriales) │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (cuando los 10 países terminaron)
┌─────────────────────────────────────────────────────────────────────┐
│  RESUMEN SEMANAL LISTO EN EL VAULT                                  │
│  60-Borradores/agendas/_resumen-2026-W19.md                         │
│                                                                      │
│  Tomás abre el archivo el sábado o el lunes a la mañana.            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  REVISIÓN (humano)                                                  │
│  → "promote ar"  desde Claude Code                                  │
│  → o edita el borrador en Obsidian, luego promote                   │
│  → o ignora (el live no se toca, queda la versión anterior)         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  SKILL `promover-agenda`                                            │
│                                                                      │
│  1. Copia 60-Borradores/agendas/<slug>.md → 15-Países/agendas/<slug>│
│  2. Cambia `estado: borrador` → `estado: publicada`                 │
│  3. Refresca `updated`, `week`, `year`                              │
│  4. Marca en `_resumen-YYYY-W##.md`: "✅ AR promovido 2026-05-12"    │
│  5. (opcional fase 2) archiva la versión anterior con timestamp     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  PLATAFORMA WEB                                                     │
│  Spec 27 vive — `getCountryAgenda()` lee el archivo actualizado     │
│  El sitio refleja la nueva agenda en el próximo build / revalidate │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. El skill `agenda-semanal`

**Ubicación:** `mapa-inestable.plugin/skills/agenda-semanal/SKILL.md`.

**Disparadores:**
- "generá la agenda de [país]"
- "actualizá la agenda de [país] de esta semana"
- Programáticamente: scheduled-task con argumento `country_slug=<slug>`

**Contexto que el skill carga al activarse:**

| Archivo / fuente | Para qué |
|---|---|
| `15-Países/<country>.md` | Pregunta central, diagnóstico estructural, ejes crónicos |
| `15-Países/agendas/<slug>.md` (si existe) | Estado live previo — comparar para tendencia y diff |
| `60-Borradores/agendas/<slug>.md` (si existe) | Borrador previo no promovido — overwrite es OK pero se reporta |
| `10-Ejes/*.md` | Vocabulario conceptual (uso secundario, solo para sugerir `eje:`) |
| `20-Metodo/principios-editoriales.md` | Voz, tono |
| Web search / Google News RSS | Prensa últimos 7 días del país |

**Output:**
- Archivo `60-Borradores/agendas/<slug>.md` con el frontmatter de Spec 27 + `estado: borrador`.
- Append al archivo `60-Borradores/agendas/_resumen-YYYY-W##.md` con el bloque del país (formato en §4).

**Modelo a usar:** Sonnet (sensibilidad editorial > velocidad).

**Reglas del prompt:**

1. **No fabricar.** Si la prensa de la semana no alcanza para identificar 3 agendas claras, escribir menos (mínimo 2). Mejor 2 reales que 5 inventadas.
2. **Factualidad.** La `description` describe qué se está discutiendo, no qué interpretamos.
3. **Tendencia derivada.** Comparar contra el live previo:
   - Agenda nueva esta semana → `subiendo`.
   - Agenda que era top 1-2 y bajó al puesto 3-5 → `bajando`.
   - Agenda que mantuvo posición → `estable`.
   - Sin live previo → todas `estable` por default.
4. **Query.** Compacta, 2-5 palabras, sin entrecomillado.
5. **Eje.** Opcional. Solo asignar si el match es claro.
6. **`updated/week/year`** se setean al día/semana de generación.
7. **`estado: borrador`** siempre. El skill NUNCA escribe a `15-Países/agendas/`.

### 3. Fuentes de prensa

**v1:** web search + Google News RSS por país.

```
https://news.google.com/rss?hl=es-419&gl=<COUNTRY_ISO>&ceid=<COUNTRY_ISO>:es-419
```

El skill puede iterar: leer el RSS general → identificar 5-7 keywords → profundizar con búsquedas temáticas.

**v2 (cuando el backend esté en prod):** leer la tabla `events` filtrada por país y últimos 7 días. Migración trivial; el resto del prompt no cambia.

### 4. Archivo de resumen semanal

**Path:** `60-Borradores/agendas/_resumen-YYYY-W##.md`. Un archivo por semana ISO. El archivo de la semana anterior permanece como log — sirve para reconstruir qué propuso el sistema y qué decidió Tomás.

**Cuándo se crea / actualiza:**
- Cuando corre la primera tarea del viernes para un país, si no existe el archivo de la semana, lo crea con un encabezado.
- Cada corrida por país hace append de su bloque.
- Cuando `promover-agenda` corre, marca el país como promovido en el archivo.

**Formato (ejemplo después de las 10 corridas del viernes):**

```markdown
---
semana: 2026-W19
generado_al: 2026-05-08T17:00:00-03:00
paises_procesados: 10
paises_con_borrador: 9
paises_sin_borrador: 1
---

# Agendas semanales · sem 19 · 2026

Generado el viernes 2026-05-08 17:00 ART. Borradores en `60-Borradores/agendas/`.
Para promover: `promover-agenda <slug>` desde Claude Code.

---

## 🇦🇷 Argentina

**Status:** borrador listo · pendiente de promote

01. ↑ **Corrupción** · causa $LIBRA y nuevas imputaciones
02. ↓ **Inflación** · desinflación vs. tarifas y servicios
03. → **Empleo y salarios** · paritarias trabadas, salario real cayendo
04. ↑ **Seguridad** · operativos Bullrich, militarización en debate
05. → **Reforma previsional** · movilidad jubilatoria

**Diff vs. sem 18:**
- entran: Reforma previsional
- salen: Litio y minería
- cambian rank: Seguridad (3→4), Empleo (2→3)

`60-Borradores/agendas/ar.md`

---

## 🇧🇷 Brasil

**Status:** borrador listo · pendiente de promote

01. ↑ **Reforma tributária** · pacto pelo IBS no Senado
02. → **STF e Bolsonaro** · audiência preliminar do AP 2668
...

---

## 🇵🇾 Paraguay

**Status:** ⚠ prensa insuficiente — no se generó borrador

Solo 4 piezas relevantes en la semana. Se requiere revisión manual.

---

## 🇻🇪 Venezuela

**Status:** ⚠ borrador previo (sem 18) no promovido — sobreescrito por nuevo borrador

01. → **Sanciones y diálogo** · ...
...

`60-Borradores/agendas/ve.md`

---

## Resumen de la corrida

| País | Status | Acción sugerida |
|---|---|---|
| 🇦🇷 AR | Borrador listo | Revisar y promover |
| 🇧🇷 BR | Borrador listo | Revisar y promover |
| 🇨🇱 CL | Borrador listo | Revisar y promover |
| 🇨🇴 CO | Borrador listo | Revisar y promover |
| 🇧🇴 BO | Borrador listo | Revisar y promover |
| 🇵🇪 PE | Borrador listo | Revisar y promover |
| 🇺🇾 UY | Borrador listo | Revisar y promover |
| 🇵🇾 PY | ⚠ Prensa insuficiente | Manual |
| 🇪🇨 EC | Borrador listo | Revisar y promover |
| 🇻🇪 VE | ⚠ Borrador previo no promovido | Revisar diff y decidir |
```

**Cuando se promueve un país**, el bloque correspondiente queda marcado:

```markdown
## 🇦🇷 Argentina

**Status:** ✅ promovido 2026-05-12 09:23 · live en `15-Países/agendas/ar.md`

01. ↑ **Corrupción** · ...
...
```

El archivo es Markdown plano, abrible en Obsidian con preview pero también legible en VSCode. No requiere ningún componente especial.

### 5. El skill `promover-agenda`

**Disparadores:**
- "promové la agenda de [país]"
- "/promover-agenda <slug>"

**Acción:**
1. Verificar que existe `60-Borradores/agendas/<slug>.md`. Si no → error claro.
2. Verificar que parsea bien (frontmatter válido, `estado: borrador`). Si no → error con campos faltantes.
3. Si existe `15-Países/agendas/<slug>.md`, comparar `updated`. Si el live es más reciente que el borrador → **preguntar antes de overwrite** (caso edición manual posterior a la corrida).
4. Copiar borrador a `15-Países/agendas/<slug>.md`, setear `estado: publicada`, refrescar timestamps.
5. Marcar el bloque del país en `60-Borradores/agendas/_resumen-YYYY-W##.md` como promovido.
6. Borrar el borrador (o moverlo a `_archive/`).
7. Confirmar en la conversación de Claude Code: "✅ AR promovido. Live en `15-Países/agendas/ar.md`. El sitio refleja en el próximo build."

### 6. Scheduled tasks

Crear 10 tareas programadas, una por país:

| Tarea | Cron (ART) | Argumento al skill |
|---|---|---|
| `agenda-ar-semanal` | viernes 17:00 | `country_slug=ar` |
| `agenda-br-semanal` | viernes 17:00 | `country_slug=br` |
| `agenda-cl-semanal` | viernes 17:00 | `country_slug=cl` |
| ... 7 más ... | | |

**Cron expresión:** `0 17 * * 5` interpretado en timezone `America/Argentina/Buenos_Aires`. Cowork debe permitir setear timezone por tarea; si no, ajustar a UTC equivalente (`0 20 * * 5`).

**Por qué una por país y no una mega-task:**
- Aislación de errores: si Venezuela falla por bloqueo de fuentes, las otras 9 corren igual.
- Paralelización.
- Configurabilidad futura por país.

**Coordinación con otros agentes:** ver Spec 29 (calendario de agentes). El `agente-diario` corre por la mañana, no se superpone con el `agenda-semanal` del viernes a la tarde.

---

## Archivos a tocar

| Archivo | Acción |
|---|---|
| `mapa-inestable.plugin/skills/agenda-semanal/SKILL.md` | **nuevo** — prompt descrito en §2 |
| `mapa-inestable.plugin/skills/agenda-semanal/README.md` | **nuevo** — breve doc |
| `mapa-inestable.plugin/skills/promover-agenda/SKILL.md` | **nuevo** — prompt de §5 |
| `60-Borradores/agendas/` | **nueva carpeta** |
| `60-Borradores/agendas/_archive/` | **nueva carpeta** (preparada para futuro) |
| `mapa-inestable.plugin/scheduled-tasks/agendas.yml` | **nuevo** — config de las 10 tareas con cron y país |
| `platform/frontend/src/lib/agendas.ts` | Agregar filtro `estado === "publicada" \|\| estado === undefined` en `getCountryAgenda` |
| `70-Producto/specs/27-agendas-por-pais.md` | Nota al final mencionando el campo `estado` opcional |
| `70-Producto/specs/29-calendario-agentes-automaticos.md` | Agregar entrada de `agenda-semanal` y `promover-agenda` |

---

## Criterios de aceptación

1. El skill `agenda-semanal` se activa con "generá la agenda de Argentina" y produce un borrador válido en `60-Borradores/agendas/ar.md`.
2. El borrador parsea correctamente con `lib/agendas.ts` — frontmatter válido, agendas array con rank único, tendencia válida, `estado: borrador`.
3. La tendencia se calcula correctamente vs. live previa (subiendo si nueva, bajando si cae ≥2 ranks, estable en otro caso, todas estables si no hay live previo).
4. Después de las 10 corridas del viernes, existe `60-Borradores/agendas/_resumen-2026-W##.md` con los 10 bloques de país en el formato de §4.
5. El skill `promover-agenda ar` copia correctamente el borrador a live, refresca timestamps, marca el resumen.
6. Si no existe el borrador, `promover-agenda` da error claro sin tocar nada.
7. Si el live es más reciente que el borrador, `promover-agenda` pregunta antes de sobreescribir.
8. Las 10 scheduled tasks están creadas y disparan los viernes 17:00 ART (verificable en panel de Cowork).
9. Una corrida real completa para Argentina genera un borrador con prensa real de la última semana — no agendas hallucinated.
10. El sitio refleja la nueva agenda después de un build / revalidate sin tocar código.
11. Si la generación falla, el live previo queda intacto y el resumen reporta el error en el bloque del país.

---

## Edge cases

- **País sin agenda previa (primera corrida):** todas las tendencias quedan `estable`. El bloque del país en el resumen aclara: "Primera generación — sin diff vs. semana anterior".
- **Borrador previo no promovido:** la corrida del viernes sobreescribe el borrador del viernes anterior si no fue promovido. El resumen lo señala con ⚠ y deja el diff de "lo que decía la sem N-1 vs. lo que dice esta sem".
- **Prensa de la semana muy escasa** → el skill produce 2-3 agendas (mínimo 2). Si no llega a 2 → no escribe borrador, el bloque del país en el resumen dice "⚠ prensa insuficiente — revisión manual".
- **Conflicto: live más reciente que borrador en `promover-agenda`** → prompt al usuario antes de overwrite.
- **Bloqueo de prensa local (Venezuela)** → el skill explicita en la descripción que "la cobertura de medios independientes es limitada esta semana".
- **Errores transitorios de web search / RSS** → 2 retries con backoff. Si sigue fallando, no escribe borrador y reporta en resumen.
- **El skill termina pero el archivo borrador es inválido** → log error, mantener el borrador previo, reportar en resumen.
- **Múltiples corridas en el mismo día** (Tomás dispara manualmente además del viernes) → cada corrida sobreescribe el borrador y agrega un append al resumen indicando "regenerado <timestamp>". El promote sigue siendo explícito.
- **Resumen semanal de una semana sin corrida** (todos los países fallaron, o se canceló la tarea) → no se crea archivo. Spec 29 explica cómo saberlo desde el calendario.

---

## No incluido en esta spec

- **Snapshot histórico de agendas live.** Hoy se sobreescribe el live. Para tener "agendas de abril 2026", crear `15-Países/agendas/_history/<slug>/<YYYY-W##>.md` automáticamente en cada promote. Spec aparte.
- **UI web para revisar y promover borradores.** Hoy se hace desde Claude Code + Obsidian. Una vista `/admin/agendas/borradores` con preview + botón promote es spec futura.
- **Ajuste de prompts por país.** Un solo prompt sirve a los 10 países en v1. Si Venezuela necesita override (fuentes alternativas, manejo de censura), se agrega luego.
- **Métricas de calidad del skill** (% de promotes sin edición, tiempo promedio de revisión).
- **Migración de v1 (web search) a v2 (backend events).** Definida acá pero se ejecuta cuando el backend esté en prod.

---

## Implementación sugerida

1. **Día 1 — Skill base.** Escribir `agenda-semanal/SKILL.md` con el prompt completo. Probar manualmente con "generá la agenda de Argentina" — sin scheduled task, solo file output. Iterar hasta producir borrador parseable y editorialmente decente.
2. **Día 2 — Tendencia y diff.** Implementar la lógica de comparar contra el live previo. Verificar con dos corridas seguidas.
3. **Día 3 — Skill de promote.** Escribir `promover-agenda` y probar el flujo borrador → live + el edge "live más reciente".
4. **Día 4 — Resumen semanal.** Implementar el append al archivo de resumen. Verificar formato visual abriendo en Obsidian preview.
5. **Día 5 — Scheduled tasks.** Crear las 10 tasks con `mcp__scheduled-tasks__create_scheduled_task` con cron `0 17 * * 5` en timezone ART. Disparar manualmente para validar paralelización.
6. **Día 6 — Soak test.** Dejar corriendo una semana real. Tomás revisa los 10 borradores el lunes siguiente. Iterar prompt según calidad observada.
7. **Día 7 — Migración a v2 (futuro).** Cuando el backend esté en prod, cambiar fuente de prensa a tabla `events`. Sin cambios en el resto del skill.

---

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Skill hallucina agendas | Regla "no fabricar" en el prompt + revisión humana obligatoria pre-promote |
| Sobreescritura de borrador previo no promovido pierde edits manuales | El resumen señala ⚠ con diff vs. borrador anterior. Si se vuelve problema, agregar lock manual |
| Tarea programada falla silenciosamente y Tomás no se entera | El resumen semanal se crea aunque algunos países hayan fallado, con bloques de error explícitos. Si no existe el resumen del lunes a la mañana, eso mismo es la señal de alarma |
| Costo de 10 corridas Sonnet × semanal | ~40 corridas/mes a ~10k tokens c/u = barato. Si escala, Haiku para borrador inicial y Sonnet para refinamiento |
| Google News bloquea o cambia RSS | v2 (backend events) resuelve. Mientras tanto, múltiples queries y manejo de errores |
| Ediciones manuales del live se pisan en próxima corrida | El borrador no toca el live; solo el promote lo hace. Ediciones manuales sobreviven hasta el próximo promote, que Tomás controla |
| Acumulación de archivos `_resumen-*.md` en el vault | Son markdown plano, baratos. Se pueden mover a `_archive/` con un cleanup eventual; mientras tanto sirven como log histórico de qué propuso el sistema |

---

## Glosario

- **Borrador (de agenda):** archivo en `60-Borradores/agendas/<slug>.md` con `estado: borrador`. Generado automáticamente, no visible en el sitio.
- **Live (de agenda):** archivo en `15-Países/agendas/<slug>.md` con `estado: publicada` (o sin estado). Lo que renderiza el sitio.
- **Promote:** acción explícita (skill `promover-agenda`) que copia borrador → live.
- **Resumen semanal:** archivo `60-Borradores/agendas/_resumen-YYYY-W##.md` con el digest de las 10 corridas del viernes. Punto único de entrada para la revisión humana.
- **Diff vs. live previa:** comparación entre el borrador nuevo y el live previo. Lo que se reporta en el bloque del país.
- **Tendencia derivada:** valor de `tendencia` calculado por comparación con la live previa.

---

## Notas de implementación (2026-05-11)

La spec se ejecutó con dos pequeñas desviaciones respecto a r2:

1. **`promover-agenda` se implementó como script Node, no como skill del plugin.** Path: `scripts/promote-agenda.mjs`, ejecutable vía `npm run promote-agenda <slug>` o interactivo. La razón: mantener consistencia con `promote-draft.mjs` (Spec 24), que ya funciona con el mismo patrón. El script vive en el repo del vault, se invoca desde Claude Code o terminal, y no requiere infra de plugin de Cowork. Si más adelante conviene una skill canónica del plugin (`mapa-inestable:promover-agenda`), se envuelve el script con un wrapper de skill.

2. **Las 10 scheduled tasks tienen el prompt embebido completo, no referencian un skill compartido.** Los SKILL.md viven en `C:\Users\Tomi\OneDrive\Documentos\Claude\Scheduled\mapa-inestable-agenda-{slug}-semanal\`. Cada uno tiene el prompt completo de Spec 28 §2 con los parámetros del país sustituidos. Esto duplica el prompt 10 veces pero garantiza aislación total — si cambia la lógica para un país (ej. Venezuela necesita override de fuentes), se edita su SKILL.md sin afectar a los otros 9. Cuando un cambio aplica a todos, se actualiza con `mcp__scheduled-tasks__update_scheduled_task` 10 veces.

3. **Las 10 tasks comparten cron `0 17 * * 5`.** Cowork aplica un jitter de hasta 6 minutos al dispatch para balancear carga; cada task corre dentro de los primeros 10 minutos de las 5pm ART del viernes. El primer país que corre crea el archivo `_resumen-YYYY-W##.md`; los siguientes hacen append.

4. **Estructura del vault:** `60-Borradores/agendas/` y `60-Borradores/agendas/_archive/` creadas con `README.md` que documenta la convención.

**Pendiente de validación operativa:**
- Primera corrida real: viernes 15 de mayo 2026, 17:00 ART.
- Verificar que las 10 tasks producen borradores parseables.
- Verificar que `_resumen-2026-W20.md` se genera con los 10 bloques.
- Iterar prompts si la calidad editorial requiere ajustes (Spec 28 §"Implementación sugerida" día 6 — soak test).
