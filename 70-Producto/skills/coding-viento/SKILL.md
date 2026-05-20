---
name: coding-viento
description: Asiste el coding editorial semanal de la capa viento de Mapa Inestable (EPIC 03, Spec 41). Activar cuando Tomás diga "codifiquemos viento", "coding de viento de esta semana", "vamos a codificar viento", "armemos el coding semanal de [país]", o cuando lo dispare el scheduled task `coding-viento-recordatorio` los viernes 16:00 ART. El skill NO genera rank — pre-rellena el archivo de la semana con el rank de la semana anterior como continuidad por default + agrega contexto de agendas y borradores diarios, y deja que el editor confirme/ajuste. Una sesión típica de coding cubre los 10 países en ~30 minutos.
---

# coding-viento

## Qué hace este skill

Asiste el **coding editorial semanal de la capa viento** del mapa de Mapa Inestable. Para cada uno de los 10 países sudamericanos, ayuda a producir un archivo `.md` con frontmatter que incluye un `rank` en escala **-3 a +3** (muy pro-estado ↔ muy pro-mercado) más justificativo y eventos clave de la semana.

Los archivos viven en `70-Producto/datos-viento/<slug>/YYYY-W##.md`. El pipeline `platform/data/coding-viento/build_viento.mjs` los compila al JSON que consume la capa viento del frontend (Spec 44).

## Principio crítico: el skill asiste, NO decide

**Nunca generes un rank por tu cuenta.** El editor (Tomás) es el único que asigna rank. Vos:

1. Pre-rellenás el archivo con el rank de la semana anterior como continuidad por default (si Argentina la semana pasada fue +1, esta semana arrancás con +1 — el editor lo cambia si hubo movimiento).
2. Agregás contexto: bullets sugeridos para "eventos clave" leyendo de las agendas (`15-Países/agendas/<slug>.md`, Spec 27) y de los borradores diarios (`60-Borradores/diario/`, Spec 23) de esa semana para ese país.
3. Pedís al editor confirmar/ajustar.

Esto cumple la decisión 7 del EPIC 03 (codificación híbrida algoritmo + override editorial): el override editorial es lo único que hay en r1, el algoritmo entra en Spec 41B cuando haya 8-12 semanas de material acumulado.

## Inputs que el skill necesita

- **Semana ISO actual**: calcular de la fecha de hoy (formato `YYYY-W##` con dos dígitos para la semana).
- **Slug del país** a codificar (o "todos" si el editor pide los 10).
- **Acceso al vault**: leer `70-Producto/datos-viento/<slug>/` para encontrar la semana anterior, leer `15-Países/agendas/<slug>.md` y `60-Borradores/diario/*<slug>*.md` para contexto.

## Flujo del skill

### Caso A: el editor pide codificar UN país específico

1. Calcular la semana actual (ej. 2026-W20).
2. Chequear si ya existe `70-Producto/datos-viento/<slug>/2026-W20.md`.
   - Si existe y está como `borrador`: abrirlo, mostrar contenido actual, ofrecer completar/editar.
   - Si existe y está como `publicada`: avisar al editor que ya está publicada, preguntar si quiere editar (cambio de coding ya firme — registrar como revisión).
   - Si no existe: crear borrador (paso 3).
3. **Crear el borrador** con esta plantilla, pre-rellenando lo que se pueda:

```yaml
---
country_slug: <slug>
country_name: <Nombre>
year: <YYYY>
week: <NN>
fecha_coding: <YYYY-MM-DD de hoy>
codificador: tomas
rank: <rank de la semana anterior, o 0 si es la primera vez>
direccion: <pro-estado | neutro | pro-mercado, derivado del rank>
intensidad:
estado: borrador

# Reservados para Spec 41B (algoritmo, no usados en r1):
# algorithmic_baseline:
#   rank:
#   generated_at:
#   source_signals: []
# override_reason:
---

# Justificativo

[Pendiente — el editor lo escribe. 1-3 frases que explican por qué el
rank de esta semana. Si no hubo cambios respecto a la semana anterior,
decirlo explícitamente.]

# Eventos clave de la semana

<bullets sugeridos en base a las agendas + borradores diarios del país
para esa semana. Marcar cada uno con "(sugerido — confirmar)" para que
el editor sepa que vienen del skill, no fueron decididos>

# Coding previo

- Semana <N-1>: rank <rank de la semana anterior, con su justificativo si está disponible>
- Semana <N-2>: rank <...>
- Semana <N-3>: rank <...>
```

4. Mostrar el borrador al editor. Esperar que confirme/edite:
   - Confirmar el `rank` (puede dejar el sugerido o cambiarlo).
   - Llenar el justificativo.
   - Editar / agregar / quitar bullets de eventos clave.
   - Opcional: setear `intensidad` (0-1) si es una semana decisiva.
5. Cuando el editor diga "publicalo", cambiar `estado: borrador` a `estado: publicada` y guardar.
6. Sugerir correr `build_viento.mjs` si es el último país de la semana en codificarse, o esperar al schedule del viernes 19:00.

### Caso B: el editor pide codificar los 10 países

Hacer el Caso A en serie, uno por uno, confirmando entre cada uno. **No batch automático** — la confirmación humana es parte del flujo.

### Caso C: disparado por scheduled task (viernes 16:00 ART)

Crear los 10 borradores en serie (sin confirmación entre uno y otro porque no hay humano presente). Dejar todos en `estado: borrador`. Generar un archivo de resumen `70-Producto/datos-viento/_recordatorio-YYYY-W##.md` con checklist de los 10 países pendientes y links a cada borrador. Notificar al editor por el medio disponible (en r1, dejar el archivo de resumen y listo — el editor lo verá al entrar a Cowork).

## Cosas que NO hacer

- **No inventar rank.** El skill propone continuidad (rank de la semana anterior); el editor decide si cambia.
- **No inventar eventos clave.** Solo agregar bullets sugeridos extraídos de fuentes verificables del vault (agendas + borradores diarios). Marcar como "(sugerido — confirmar)".
- **No promocionar a `estado: publicada` sin que el editor lo pida.** Aunque parezca completo, esperar la orden explícita.
- **No tocar archivos `.md` de semanas anteriores.** Esos son histórico; si hay que corregir uno, el editor lo pide explícito.
- **No alterar el JSON compilado `_compilado/viento.json` directamente.** Ese lo regenera `build_viento.mjs`.

## Glosario rápido

- **Rank**: entero -3 a +3. -3 = muy pro-estado, 0 = neutro / sin cambio, +3 = muy pro-mercado.
- **Direccion**: derivada del rank (pro-estado para <0, neutro para 0, pro-mercado para >0). Explícita en el frontmatter para legibilidad humana.
- **Intensidad**: opcional 0-1. Modula la saturación visual. Permite distinguir "una semana decisiva" de "una semana habitual" sin agregar buckets.
- **Estado**: `borrador` o `publicada`. Solo lo publicado entra al JSON consumido por el frontend.

## Referencias

- **Spec 41** (esta es la spec madre): `70-Producto/specs/41-pipeline-datos-politicos-viento.md`
- **Spec 41B** (algoritmo futuro, placeholder): `70-Producto/specs/41B-algoritmo-coding-viento.md`
- **EPIC-03**: `70-Producto/epics/EPIC-03-capas-analiticas.md` (decisiones 1 y 7 sobre por qué pro-mercado/pro-estado y codificación híbrida)
- **Pipeline**: `platform/data/coding-viento/build_viento.mjs`
- **Output**: `70-Producto/datos-viento/_compilado/viento.json`
