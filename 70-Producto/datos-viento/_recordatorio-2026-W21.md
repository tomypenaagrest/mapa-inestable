---
tipo: coding-viento-recordatorio
fecha: 2026-05-20
semana: 2026-W21
generado_por: scheduled-task
---

# Recordatorio de coding viento — Semana 2026-W21

Borradores generados automáticamente el miércoles **2026-05-20** por el scheduled task `coding-viento-recordatorio`.

> ⚠️ El task está programado para correr los **viernes 16:00 ART** según Spec 29, pero esta corrida fue disparada un miércoles. Los borradores corresponden a la semana ISO actual (2026-W21, lunes 18/5 a domingo 24/5). Si esto fue un disparo manual o de prueba, sigue siendo seguro: ningún archivo se sobreescribió y todos quedaron en `estado: borrador`.

## Pendiente de coding por país (10)

Para cada país: confirmar/ajustar `rank` y `direccion`, completar el justificativo (1-3 frases), validar/editar los bullets sugeridos de eventos clave, y publicar (`estado: publicada`) para que entre al JSON de la capa viento.

- [ ] **Argentina** — [ar/2026-W21.md](ar/2026-W21.md) — rank pre-rellenado: **+1** (continuidad desde W19)
- [ ] **Bolivia** — [bo/2026-W21.md](bo/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Brasil** — [br/2026-W21.md](br/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Chile** — [cl/2026-W21.md](cl/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Colombia** — [co/2026-W21.md](co/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Ecuador** — [ec/2026-W21.md](ec/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Perú** — [pe/2026-W21.md](pe/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Paraguay** — [py/2026-W21.md](py/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Uruguay** — [uy/2026-W21.md](uy/2026-W21.md) — rank pre-rellenado: **0** (primera semana)
- [ ] **Venezuela** — [ve/2026-W21.md](ve/2026-W21.md) — rank pre-rellenado: **0** (primera semana)

## Notas de la corrida

- Solo Argentina tenía coding previo (W18 +3, W19 +1). El default de continuidad usó W19 (rank +1) según indica el SKILL.
- Para los otros 9 países es la **primera semana** de coding viento. El SKILL indica usar rank 0 como default cuando no hay continuidad previa; el editor debería revisarlos con especial atención porque la baseline es arbitraria.
- Los bullets de "Eventos clave de la semana" se extrajeron exclusivamente de las agendas live W21 de cada país (`15-Países/agendas/<slug>.md`, todas updated 2026-05-17). Cada bullet quedó marcado **(sugerido — confirmar)** según lo pide el SKILL.
- Los borradores diarios de los últimos 7 días (2026-05-13 a 2026-05-20) **no se usaron como bullets** por una razón editorial: las piezas diarias son ya el producto interpretativo, mientras que el coding viento necesita evidencia de evento bruto. Las agendas live son la mejor fuente para eso. Si querés que en próximas corridas integre los títulos de los diarios como contexto adicional, decímelo y actualizo el comportamiento del skill.

### Borradores diarios disponibles esta semana (referencia, no usados como bullets)

- Argentina: "El orgullo que llegó traducido" (20/5), "El éxito que no convoca" (20/5)
- Chile: "Una manera de gobernar" (13/5)
- Colombia: "La encuesta que se parecía a una encuesta" (14/5), "Los nuevos mediadores" (14/5)
- Paraguay: "Cancelar la patria" (16/5)
- Perú: "El presidente que prefería no haber firmado" (17/5)
- Uruguay: "La desaprobación que llegó sin noticia" (18/5)
- Bolivia, Brasil, Ecuador, Venezuela: sin borradores diarios en la ventana.

## Próximo paso

1. Abrir el primero de la lista, completar justificativo y ajustar rank.
2. Cuando termine los 10, correr el build:
   ```bash
   node platform/data/coding-viento/build_viento.mjs
   ```
3. El build deja `_compilado/viento.json` actualizado y el frontend lo levanta automáticamente.

## Referencias

- SKILL: `70-Producto/skills/coding-viento/SKILL.md`
- Spec madre: `70-Producto/specs/41-pipeline-datos-politicos-viento.md`
- Calendario de agentes: `70-Producto/specs/29-calendario-agentes-automaticos.md`
- EPIC 03: `70-Producto/epics/EPIC-03-capas-analiticas.md`
