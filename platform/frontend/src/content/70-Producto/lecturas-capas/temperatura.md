---
layer: temperatura
title: Temperatura · salario real
last_updated: 2026-05-21
---

# Temperatura

El salario real es el termómetro del poder adquisitivo: traduce el crecimiento macroeconómico a la experiencia concreta de quienes trabajan. Un PBI que crece puede esconder un salario real que cae — o viceversa. En Latinoamérica esa brecha entre narrativa oficial y experiencia cotidiana es parte del tejido político.

La capa temperatura mide la variación interanual del índice de salario real (base 2021=100, OIT ILOSTAT). El color del país en el mapa refleja la intensidad del movimiento — cuán rápido sube o baja el termómetro — no su dirección. La dirección (mejora / caída / estancado) aparece en la leyenda y en el tooltip al pasar el cursor sobre un país.

## Cómo se lee

- **El color codifica magnitud**: más oscuro = cambio más intenso en términos absolutos, independientemente de si sube o baja.
- **La dirección aparece en el tooltip**: `+2.5% mejora`, `−1.8% caída`, `+0.2% estancado`.
- **La variación es interanual (YoY)**: compara el trimestre actual con el mismo trimestre del año anterior, para quitar el ruido estacional (aguinaldos, paritarias).
- **Bucket 0 = "Estancado" no es neutral**: en Latinoamérica, un salario real que no se mueve mientras hay inflación o expectativa de mejora es una señal activa de tensión política y social. No es ausencia de fenómeno — es congelamiento.

## Subindicadores

El drawer muestra cuatro subindicadores que enriquecen la lectura del indicador principal:

- **Desempleo** (`c1-desempleo`, %) — el tamaño del mercado laboral. Un salario real que sube puede coexistir con desempleo creciente si la composición del empleo cambia. `invertGood`: más alto es peor.
- **Informalidad** (`c2-informalidad`, %) — la estructura del trabajo. Un salario real promedio mide poco si la mitad de los trabajadores están en la informalidad y no entran al cálculo — o entran mal. En Latinoamérica la dispersión es grande: Chile 21%, Bolivia 64%. `invertGood`: más alto es peor.
- **Desigualdad** (`d3-gini`, índice Gini) — la distribución del ingreso. El salario real medio puede crecer concentrado en deciles altos. El Gini al lado captura quién se beneficia del calor. `invertGood`: más alto es peor.
- **PBI per cápita PPP** (`a1-pbi-pc-ppp`, USD constantes 2017) — el nivel general de riqueza. Da escala a la lectura: una recuperación de salario real desde un piso de pobreza y desde un piso de clase media son lecturas políticas distintas. `invertGood`: no — más alto es mejor.

## Lectura por país (piloto r1)

### Argentina

<TEXTO CURADO — pendiente de redacción editorial una vez hidratado c7 y vistos los rangos reales. Estructura sugerida: fase del salario real en la serie reciente, comportamiento típico del ciclo inflacionario-paritario, lectura cruzada con desempleo e informalidad, comentario sobre Gini histórico, PBI per cápita relativo a la región.>

### Brasil

<TEXTO CURADO — Brasil suele mostrar estabilidad. Estructura sugerida: salario real con rumbo estable, baja informalidad relativa para la región, Gini alto históricamente, PBI per cápita medio. Tensión interpretativa: crecimiento sin redistribución.>

### Chile

<TEXTO CURADO — Chile como ancla de estabilidad económica. Estructura sugerida: salario real recuperando post-pandemia, informalidad baja (21%), Gini medio-alto, PBI per cápita líder de la región. Tensión interpretativa: estabilidad con desigualdad estructural.>

## Otros países

> Lectura curada pendiente para Bolivia, Colombia, Ecuador, Paraguay, Perú, Uruguay, Venezuela. El indicador principal y los subindicadores están disponibles en el mapa (cobertura 9-10/10 según el subindicador); la lectura editorial se completa en r3 tras validar el patrón con AR/BR/CL en producción. Venezuela aparece sin dato para `d3-gini` y `a1-pbi-pc-ppp`.

## Fuente y método

- **Indicador principal**: OIT ILOSTAT `EAR_4MTH_SEX_ECO_CUR_NB_M` — salario medio mensual deflactado a real, indexado base 2021=100.
- **Subindicadores**: Banco Mundial y OIT; ver Spec 14A para detalle de cada uno.
- **Pipeline**: `macro-v1.1.0`.
- **Cadencia expuesta al slider**: trimestral, agregada por promedio simple desde la serie mensual original.
- **Variación interanual**: trimestre actual vs mismo trimestre del año anterior (year-over-year).
- **Último refresh**: ver leyenda del mapa.

## Limitaciones

- Los buckets de magnitud heredan los rangos de la capa precipitación; pueden recalibrarse en r2 si la distribución empírica del salario real lo sugiere.
- Los meses sin dato se omiten del promedio trimestral. Si un trimestre tiene menos de 2 meses con dato, se trata como `noData` para evitar lecturas con base estadística débil.
- Para Venezuela, `d3-gini` y `a1-pbi-pc-ppp` no están disponibles — el drawer los muestra como sin dato.
- La cobertura inicial del indicador principal depende de la corrida del pipeline con red contra OIT; ver Spec 40 para el estado del pendiente.
