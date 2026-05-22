---
layer: viento
title: Viento · orientación pro-mercado / pro-estado
last_updated: 2026-05-21
---

# Viento

El viento político-económico no es bueno ni malo: dice hacia dónde sopla el régimen en una semana dada. Un viento fuerte pro-mercado puede ser una liberalización necesaria o una transferencia de riesgo al ciudadano — depende del marco. Lo mismo para el pro-estado. Esta capa no juzga la orientación: la registra.

El proyecto usa "pro-mercado ↔ pro-estado" en lugar de "derecha ↔ izquierda" porque el eje izquierda-derecha mezcla dimensiones culturales, identitarias e históricas que esta capa no mide. Lo que sí mide es concreto: ¿el Estado esta semana amplió o retiró su mediación entre el mercado y la vida cotidiana? ¿Reguló o desreguló? ¿Gastó o ajustó? ¿Firmó con el FMI o resistió? El coding editorial responde estas preguntas semana a semana con fuentes trazables.

## Cómo se lee

- **El color del país codifica la magnitud absoluta del movimiento** — cuán fuerte fue el cambio en la semana, independientemente de la dirección. Más oscuro = movimiento más intenso.
- **El glyph sobre el país codifica la dirección:** una onda con punta apuntando a la derecha = pro-mercado; la misma onda espejada (apuntando izquierda) = pro-estado; dashes estáticos sin punta = neutro. Esta capa diverge del patrón de precipitación y temperatura: la dirección no vive solo en el tooltip — está visible en el mapa porque es la lectura principal del viento.
- **Bucket 0 "Neutro" no es lectura política, es lectura semanal.** El coding mide el cambio en la semana, no el posicionamiento absoluto del gobierno. Un gobierno fuertemente pro-mercado en una semana sin novedades materiales tiene rank 0. La orientación estructural del régimen vive en la serie histórica, no en el dato de la semana.
- **La cadencia es semanal.** Cada viernes el editor codifica los 10 países en la escala −3..+3. Cuando el slider apunta a una fecha entre dos semanas, el mapa muestra la última semana publicada para cada país.

## Escala

| rank | Magnitud | Dirección | Lectura |
|------|----------|-----------|---------|
| +3 | fuerte | pro-mercado | semana de movimientos materiales fuertes hacia la desregulación / liberalización / acuerdo con acreedores |
| +2 | moderado | pro-mercado | semana con varias señales claras pro-mercado pero sin cambio estructural único |
| +1 | leve | pro-mercado | señal leve — discurso más que acción, o una medida puntual de alcance limitado |
| 0 | Neutro | — | sin cambios materiales en la semana — no implica neutralidad del gobierno |
| −1 | leve | pro-estado | señal leve hacia regulación / gasto / control |
| −2 | moderado | pro-estado | varias señales pro-estado sin medida estructural única |
| −3 | fuerte | pro-estado | semana de movimientos fuertes hacia la regulación / estatización / ruptura con acreedores |

## Eventos clave por país-semana

El drawer muestra los eventos clave del último coding publicado para cada país cuando se abre al hacer click. Cada evento sale literal del archivo de coding; el codificador los formula con la fuente entre paréntesis y una flecha indicando si suman pro-mercado (↑), pro-estado (↓) o neutro (→).

## Lectura por país (piloto r1)

### Argentina

Argentina abre la serie semanal del viento con dos lecturas publicadas: W18 (rank +3, intensidad 0.85) y W19 (rank +1, intensidad 0.4).

W18 fue una semana densa: la segunda revisión del acuerdo FMI con desembolso de USD 1.200M, la liberación del cepo para personas jurídicas no financieras y la presentación del presupuesto 2027 con meta de superávit primario del 1.5% del PBI. Tres señales materiales en la misma semana — de ahí el rank +3 y la intensidad alta.

W19 fue calma normativa. Las declaraciones del Ministro reafirmaron el camino del superávit pero sin acciones nuevas. El rank baja a +1 porque el movimiento efectivo de la semana fue menor. La orientación pro-mercado sigue presente en el discurso pero no hubo movimientos materiales nuevos.

El ciclo de dos semanas ilustra la diferencia entre "semana decisiva" y "semana de mantenimiento": misma dirección, distinta intensidad. La modulación visual del fill (más opaco en W18, menos en W19) captura esa diferencia sin agregar un bucket nuevo.

## Otros países

> Lectura curada pendiente para Bolivia, Brasil, Chile, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela. El coding está en curso — cobertura mínima a alcanzar antes de la implementación técnica completa: AR ≥4 semanas, BR/CL ≥2 semanas, resto ≥1 semana. Brasil y Chile entran en la lectura editorial en r2; los demás en r3.

## Fuente y método

- **Coding editorial Mapa Inestable** (Spec 41, pipeline `viento-v1.0.0`). Codificador único en r1: Tomás Peña Agrest.
- **Escala discreta −3..+3**, 7 niveles. Aplicada semana a semana por país.
- **Criterios de coding:** política tributaria y fiscal (superávit/déficit, ajuste/gasto), política cambiaria y financiera (cepo, tipo de cambio, acuerdos), regulación sectorial (privatizaciones, desregulaciones, controles de precios), política exterior económica (acuerdos con acreedores, bloques regionales), discurso del gobierno (alineamiento o divergencia con los ejes anteriores).
- **Trazabilidad:** cada coding lleva codificador, fecha, justificativo y eventos clave con fuente. Los archivos viven en `70-Producto/datos-viento/<slug>/YYYY-W##.md`.
- **Cobertura semanal:** cada viernes a las ~16-17 ART el editor codifica las 10 semanas.

## Limitaciones

- El coding es interpretativo. El mismo evento puede ser codificado de manera diferente por codificadores distintos. En r1 hay un único codificador (Tomás) — la consistencia interna es alta, el margen de sesgo individual también.
- La capa muestra el cambio de la semana, no la orientación acumulada del régimen. Un gobierno estructuralmente pro-mercado con una semana de rank 0 no es "neutro" — la neutralidad es de la semana, no del gobierno.
- Países sin coding histórico aparecen como "sin dato" en el mapa.
- Subindicadores ausentes en r1. El bloque "Noticias por sector" (regulación/fiscal/discurso/exterior) llegará en r3 con Spec 41B una vez acumuladas 8-12 semanas de coding.
