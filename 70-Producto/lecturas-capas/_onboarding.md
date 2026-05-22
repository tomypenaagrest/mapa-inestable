---
slug: _onboarding
titulo: "Cómo se lee este mapa"
version: v1
ultimo_cambio: 2026-05-21
---

# Pantalla 1 · Bienvenida

El mapa de Sudamérica tiene una doble vida. En su primera capa, es un índice de análisis editoriales: cada país lleva el peso de una hipótesis sobre lo que está pasando políticamente. En la segunda capa — esta — el mapa muestra el clima político-económico de la región como si fuera un sistema atmosférico.

No es una metáfora decorativa. Cada capa es un dato real con fuente, período y método trazables. El proyecto se construye contra la desorientación epistemológica: lo que se muestra aquí tiene que poder verificarse.

# Pantalla 2 · Las cuatro capas

Cuatro lecturas sobre el mismo mapa.

**Precipitación — Crecimiento económico (PBI)**
Cuándo llueve fuerte, hay expansión. Cuando hay sequía, recesión. El indicador es la variación interanual del PBI. Fuente: FMI, World Bank, CEPAL.

**Temperatura — Condiciones materiales (salario real)**
El termómetro del poder adquisitivo. Sube cuando el salario real mejora, baja cuando se erosiona. El indicador es la variación interanual del salario real (base 2021=100). Fuente: OIT ILOSTAT.

**Viento — Orientación política (pro-mercado / pro-estado)**
El viento sopla hacia el mercado o hacia el estado. El indicador es un coding editorial semanal que asigna un rank de -3 (pro-estado fuerte) a +3 (pro-mercado fuerte) según los eventos políticos de la semana. Fuente: coding manual editorial de Mapa Inestable.

**Presión — Densidad institucional (Latinobarómetro)**
Cuando la presión baja, las mediaciones se aflojan. El indicador agrega confianza en gobierno, parlamento, partidos y tribunales. Fuente: Latinobarómetro (anual).

Se activa una capa a la vez. El color del país cambia según el valor del indicador principal de la capa activa.

# Pantalla 3 · El tiempo no se mide igual en cada capa

Cada capa tiene su propia cadencia:

- **Viento** — semanal
- **Temperatura** — trimestral
- **Precipitación** — trimestral
- **Presión** — anual

El navegador de período en el rail izquierdo elige qué momento mostrar. Cada capa muestra su última lectura disponible hasta esa fecha. Esto significa: si navegás a la semana 12 de 2025, viento te muestra esa semana exacta, pero presión te muestra 2024 — el dato anual más cercano hacia atrás. La leyenda siempre lo dice explícito.

# Pantalla 4 · Despedida

No es un panel de control. Es un mapa que cambia mientras la región cambia.

- Cada capa tiene fuente, método y limitaciones documentadas
- Click en cualquier país abre la lectura editorial de ese país para la capa activa
- El botón **ⓘ Cómo se lee este mapa** en la leyenda vuelve a este onboarding cuando lo necesitás

# Glosario climático ↔ político

| Clima | Política / Economía |
|---|---|
| Precipitación | Crecimiento del PBI |
| Temperatura | Condiciones materiales (salario real) |
| Viento | Orientación política (pro-mercado ↔ pro-estado) |
| Presión | Densidad institucional (confianza en instituciones) |
| Lluvia intensa | Expansión económica fuerte |
| Sequía | Recesión |
| Termómetro alto | Salario real en alza, mayor poder adquisitivo |
| Viento hacia la derecha | Orientación pro-mercado |
| Viento hacia la izquierda | Orientación pro-estado |
| Viento neutro (dashes) | Sin orientación dominante en la semana |
| Presión alta | Instituciones con alta confianza ciudadana |
| Presión baja | Mediaciones institucionales debilitadas |
| Bucket | Rango discreto de un dato (e.g. "fuerte", "leve") |
| Dato congelado | Última lectura disponible antes de que la fuente dejara de actualizar |
| Dato estimado | El pipeline usó interpolación porque la fuente no publicó ese período aún |
