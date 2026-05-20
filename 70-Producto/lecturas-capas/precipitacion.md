---
layer: precipitacion
title: Precipitación · crecimiento económico
last_updated: 2026-05-20
---

# Precipitación

El crecimiento del PBI es la primera precipitación: la cantidad de agua que cae sobre la economía en un período. Lluvia abundante y sostenida sostiene actividad, empleo, inversión. Sequía prolongada es recesión — no solo una cifra negativa, sino un ciclo que deteriora la capacidad productiva, eleva la deuda real y erosiona las mediaciones institucionales que sostienen el contrato social.

La metáfora es operativa, no decorativa. El lenguaje de los buckets usa términos económicos directos: el color del país en el mapa codifica la **magnitud** del cambio del PBI (más oscuro = más extremo, en cualquier dirección). La **dirección** (crecimiento o recesión) aparece en el tooltip y en el drawer — no en el mapa. Un país con crecimiento de +5% y otro con recesión de −5% comparten el mismo bucket de magnitud (extremo) pero tienen lecturas cualitativas opuestas.

## Cómo se lee

- **Color del país en el mapa**: magnitud absoluta del cambio del PBI. Cinco pasos de terracota, del más claro (sin cambio, |PBI| ≤ 0.5%) al más oscuro (extremo, |PBI| > 6%).
- **Tooltip (hover)**: valor exacto con signo y label — "+3.2% crecimiento" o "−1.8% recesión". Aquí aparece la dirección.
- **Drawer (click sobre el país)**: valor PBI + lectura editorial + cuatro subindicadores con sparklines de 8 años.
- **Leyenda**: escala secuencial con rangos de magnitud + bloque "Dirección" que aclara que el color codifica solo magnitud.

Esta separación magnitud/dirección es deliberada: evita forzar una escala divergente que rompería el design system Grabado y añadiría ruido visual. Un lector que quiere saber si un país está en recesión debe hacer hover o click — coherente con el perfil interpretativo de Mapa Inestable.

## Subindicadores

La capa expone cuatro subindicadores que describen cómo está distribuida y qué tan sostenible es el caudal:

- **Inflación (IPC)** — ¿la lluvia trae tormenta? Si el PBI sube mientras la inflación se dispara, el crecimiento puede estar siendo consumido por el deterioro del poder adquisitivo.
- **Inversión / PBI** — ¿la lluvia alimenta el suelo o se evapora? La formación bruta de capital mide si el crecimiento actual siembra capacidad productiva futura o es solo consumo presente.
- **Deuda / PBI** — ¿de dónde viene el agua? Crecimiento financiado con deuda creciente es una precipitación prestada.
- **Productividad laboral** — ¿el sistema convierte la lluvia en cosecha? Si el PBI crece pero la productividad laboral se estanca, el crecimiento es extensivo y más frágil.

Los subindicadores tienen sparklines de 8 años. Para inflación y deuda, la escala está invertida: un valor más alto es peor.

## Lectura por país (piloto r1)

### Argentina

Argentina 2024: −1.3% — tercer año consecutivo de contracción o estancamiento. El ciclo 2022–2024 muestra el patrón clásico argentino: un boom de +6% en 2022 seguido de ajuste brusco (−1.9% en 2023, −1.3% en 2024). La inflación estructural se mueve en dirección contraria al PBI. Leer los subindicadores como sistema: cuando la inversión cae con la inflación disparada, el rebote posterior es frágil — depende de condiciones externas más que de capacidad productiva acumulada.

### Brasil

Brasil 2024: +3.4% — tercer año consecutivo de crecimiento estable en la banda 3–3.5%. La consistencia es el rasgo distintivo: sin boom ni colapso. La inflación bajó desde el pico pospandemia y la inversión/PBI se mantiene moderada. Brasil funciona como el ancla de estabilidad macroeconómica de la región en la serie 2022–2024. El riesgo principal: si la deuda/PBI sigue subiendo con el crecimiento estable, el margen fiscal se estrecha para el siguiente ciclo de desaceleración.

### Chile

Chile 2024: +2.6% — recuperación tras el frenazo de 2023 (+0.5%). El ciclo pospandemia chileno tuvo un boom en 2021 (+11.7%) seguido de consolidación. Chile ajustó sin caer en recesión. La inflación cedió. La deuda/PBI se mantuvo contenida. El bucket "moderado" es la lectura correcta: un PBI de +2.6% con estos subindicadores es estabilidad, no dinamismo — el piso de lo que se llama crecimiento estructuralmente sostenido en la región.

## Otros países

> Lectura curada pendiente para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay y Venezuela. El indicador principal y los subindicadores están disponibles en el mapa. La lectura editorial de estos países se incorpora en r3.

Nota sobre Venezuela: la serie 2022–2024 está clasificada como "estimado" por el Banco Mundial. El valor se renderiza con flag de calidad en el tooltip.

## Fuente y método

- **Indicador**: NY.GDP.MKTP.KD.ZG — crecimiento del PBI, precios constantes (Banco Mundial).
- **Pipeline**: `macro-v1.1.0` (Spec 40). Serie anual 2010–2024.
- **Cadencia declarada**: trimestral (con fallback a anual cuando trimestral no está poblado).
- **Último refresh**: 2026-05-19.
- **Cobertura**: 10/10 países.

## Limitaciones

- Los buckets de magnitud son umbrales arbitrarios calibrados para la distribución histórica 2010–2024 de los 10 países. Pueden ajustarse en r3.
- Un PBI de exactamente 1.5% cae en bucket 1 ("leve") por la regla `≤`.
- Los datos posteriores al último año del Banco Mundial pueden estar estimados. Venezuela 2022–2024 es estimado.
- La distinción crecimiento/recesión no es visible en el mapa sin interacción (decisión B.4). Intencional — documentado para revisión si la evidencia de uso muestra que genera confusión.
