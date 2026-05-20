---
spec: 41B
titulo: Algoritmo híbrido para capa viento — baseline algorítmico + override editorial
estado: placeholder
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-20
epic: 03
afecta: []
depende_de: [41]
precondicion: 8-12 semanas de coding manual acumulado en 70-Producto/datos-viento/
---

# 41B · Algoritmo híbrido para capa viento

## Estado

**PLACEHOLDER.** Esta spec no está lista para diseño.

**Precondición:** 8-12 semanas de coding manual acumulado en `70-Producto/datos-viento/` (empezando desde Spec 41, semana W20 de 2026). Diseñar el algoritmo sin material sería inventar reglas arbitrarias. El coding manual es el input necesario para entender qué patrones existen antes de automatizar.

**Cuándo retomar:** cuando haya 8-12 semanas completas de 10 países × rank + justificativo, abrir una sesión de diseño en Cowork con el material acumulado como input.

---

## Propósito (a diseñar cuando haya material)

Implementar el "algoritmo" de la decisión 7 del EPIC 03 (codificación híbrida):

- El algoritmo propone un `rank` candidato para cada país cada semana, basado en señales automáticas (RSS de boletines oficiales, press releases de ministerios, scraping de fuentes legales).
- El editor ve el candidato algorítmico (`algorithmic_baseline`) y decide si lo confirma, ajusta, o descarta.
- Si el editor desvía del algoritmo, registra la razón en `override_reason`.

En MVP (Spec 41 r1), todo el coding es override porque no hay baseline. Cuando esta spec se implemente, el baseline algorítmico pre-populará el rank y el editor solo confirmará/ajustará.

---

## Campos del frontmatter reservados desde Spec 41

```yaml
# algorithmic_baseline:
#   rank: <int>              # el rank que propone el algoritmo
#   generated_at: <ISO>      # cuándo se generó
#   source_signals:          # qué inputs usó el algoritmo
#     - tipo: <tipo>
#       fuente: <url>
#       fecha: <YYYY-MM-DD>
# override_reason: <texto>   # por qué el editor desvió (cuando aplica)
```

Estos campos están comentados en los archivos generados por Spec 41. Cuando esta spec se implemente, el algoritmo los populará automáticamente antes de presentar el borrador al editor.

---

## Preguntas de diseño (a responder con el material acumulado)

1. **¿Qué señales usa el algoritmo?** RSS de boletines oficiales (Argentina: infoleg.gob.ar, Brasil: diariooficial.gov.br, etc.), press releases de ministerios de economía, declaraciones de funcionarios clave, datos de BCRA/bancos centrales.
2. **¿Cuál es la lógica de scoring?** ¿Suma ponderada de señales? ¿Modelo de clasificación? ¿Heurísticas por tipo de señal?
3. **¿Cuánto acuerdo hay entre el algoritmo y el editor?** Medir discrepancias en el material acumulado para calibrar el algoritmo.
4. **¿Cómo maneja el algoritmo semanas sin señales?** ¿Rank 0 por default? ¿Continuidad?
5. **¿El algoritmo es por país o hay un modelo unificado?** Cada país tiene dinámicas distintas (Argentina: BCRA como señal clave; Venezuela: señales muy distintas).

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-20 | Placeholder creado | Spec 41 implementada — algoritmo postergado hasta tener material acumulado |
