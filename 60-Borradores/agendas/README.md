# Borradores de agendas — generados por el agente

Esta carpeta es escrita automáticamente por las 10 scheduled tasks `agenda-{slug}-semanal` los viernes 17:00 ART.

**Convenciones:**

- `<slug>.md` — borrador de agenda del país (uno por país). Se sobreescribe cada semana.
- `_resumen-YYYY-W##.md` — digest semanal con los 10 países, diff vs. live previo, alertas editoriales.
- `_archive/` — versiones promovidas archivadas (futuro).

**Flujo:**

1. Viernes 17:00 ART — corren las 10 tareas en paralelo.
2. Cada tarea escribe `<slug>.md` con `estado: borrador` + frontmatter de Spec 27.
3. Cada tarea hace append al `_resumen-YYYY-W##.md` de la semana.
4. Tomás abre el resumen el lunes y promueve los que aprueba con el skill `promover-agenda`.

**Specs de referencia:** 27 (formato del archivo de agenda), 28 (lógica del agente), 29 (calendario completo).

**No edites archivos a mano salvo durante el flujo de promote.** Una edición manual del borrador sobrevive hasta la próxima corrida del viernes, que la sobreescribe. Si querés iterar sobre un borrador específico, copialo afuera de esta carpeta antes.
