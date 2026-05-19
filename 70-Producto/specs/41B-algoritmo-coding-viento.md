---
spec: 41B
titulo: Algoritmo híbrido de coding para la capa viento
estado: pendiente
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-18
epic: 03
afecta:
  - platform/data/coding-viento/algorithm/ (NUEVO directorio)
  - mapa-inestable.plugin/skills/coding-viento/ (extender: ahora pre-popula con baseline algorítmica)
  - 70-Producto/datos-viento/<slug>/YYYY-W##.md (los campos reservados se activan: `algorithmic_baseline`, `override_reason`)
depende_de: [41]
depende_blanda_de: [44]
relaciona_con:
  - Spec 41 (pipeline manual editorial — base sobre la que se monta el algoritmo)
  - EPIC-03 (decisión 7: codificación híbrida algoritmo + override editorial)
prioridad: baja (se diseña cuando haya 8-12 semanas de coding manual acumulado)
---

# 41B · Algoritmo híbrido de coding para la capa viento

## Estado

**Placeholder.** Esta spec se diseña cuando haya **8-12 semanas de coding manual editorial acumulado en el vault** (`70-Producto/datos-viento/<slug>/*.md` con `estado: publicada`). Diseñar el algoritmo antes de tener ese material sería inventar reglas arbitrarias sin posibilidad de validarlas contra el criterio editorial.

## Origen

Spec 41 r1 implementó el MVP 100% manual editorial para alimentar la capa viento. La decisión 7 del EPIC 03 pide **codificación híbrida** — algoritmo provee la base, autor hace override editorial. El MVP es la mitad humana de esa híbrida; esta spec será la mitad algorítmica.

El frontmatter de los `.md` de Spec 41 ya reserva campos para esta spec:

```yaml
# algorithmic_baseline:
#   rank: <int>
#   generated_at: <ISO>
#   source_signals: [<lista de inputs del algoritmo>]
# override_reason: <texto explicando por qué el editor desvió>
```

Cuando Spec 41B se mergea, esos campos se descomentan y se llenan.

## Por qué postergada

1. **El algoritmo necesita verdad terreno.** Sin material editorial de referencia, no hay forma de validar si una regla funciona. 8-12 semanas × 10 países = 80-120 codings — suficiente para identificar patrones reales en lugar de inventarlos.
2. **Los inputs probables del algoritmo son costosos.** RSS de boletines oficiales, scraping de comunicados de ministerios de economía, anuncios de bancos centrales — cada fuente cuesta tiempo de ingeniería. Si el coding manual revela que algunos países cambian poco semana a semana y otros mucho, el costo se invierte de forma desigual.
3. **El editor sigue siendo el último decisor en cualquier caso.** El algoritmo nunca decide solo. Por eso urge menos.

## Alcance preliminar (a profundizar cuando se diseñe r1)

### Fuentes de input probables del algoritmo

- **RSS de boletines oficiales** (BOE Argentina, Diário Oficial Brasil, Diario Oficial Chile, etc.). Detecta nuevos decretos / leyes / resoluciones.
- **Anuncios de ministerios de economía y bancos centrales** vía sitio web oficial o RSS.
- **APIs de medios** que clasifican noticias por sección economía/política.
- **Coding histórico** del propio sistema (Spec 41) — el algoritmo aprende patrones del editor.
- **Posiblemente eventos clave detectados por el agente diario** (Spec 23) si se anota cuando un evento tiene impacto político-económico.

### Mapeo señales → rank propuesto

El algoritmo propone un rank en la escala -3 a +3. Posibles estrategias:

- **Reglas explícitas**: cada tipo de evento aporta un delta al rank (privatización: +1; aumento de gasto: -1; etc.). Suma de deltas semanales, clipped a [-3, +3].
- **Embeddings + clasificador**: vectorizar los anuncios de la semana, comparar con codings históricos del editor, predecir rank usando un modelo entrenado sobre los 80-120 codings acumulados.
- **LLM-as-classifier**: pasar los anuncios al LLM con few-shot del coding del editor, pedir rank justificado.

La elección entre los 3 (o un híbrido) se decide en r1 según qué dé mejor recall sobre los codings editoriales acumulados.

### Cómo el editor interactúa con el algoritmo

1. El skill `coding-viento` (extendido) corre antes que el editor.
2. Para cada país, llama al algoritmo con los inputs de la semana.
3. Llena `algorithmic_baseline` en el frontmatter con el rank propuesto + señales que lo justifican.
4. El editor abre el archivo, ve el baseline algorítmico, decide:
   - **Confirma**: copia `algorithmic_baseline.rank` a `rank`, deja `override_reason` vacío.
   - **Overridea**: pone otro rank en `rank`, llena `override_reason` con la justificación del desvío.
5. El pipeline registra ambos: el rank publicado va al JSON, pero el JSON también puede llevar `algorithmic_baseline` y `override_reason` para análisis posterior.

### Métricas de calidad del algoritmo

- **Tasa de confirmación**: % de codings donde el editor acepta el baseline algorítmico. Si es alta, el algoritmo está bien calibrado.
- **Magnitud promedio del override**: cuando hay override, ¿es de 1 punto en la escala o de 3? Mide qué tan lejos está el algoritmo del criterio editorial.
- **Asimetría**: ¿el algoritmo se equivoca más en una dirección que en otra (siempre subestima cambios pro-mercado, ej.)?

Estas métricas se calculan periódicamente y guían iteraciones del algoritmo.

## Lo que NO va acá

- Cambios al schema del coding editorial (eso ya está hecho en Spec 41 con campos reservados).
- Cambios al patrón operativo (el viernes 16:00 sigue siendo el horario, el skill sigue asistiendo, el editor sigue decidiendo).
- Visualización del baseline algorítmico vs el coding publicado dentro del sitio. Eventualmente útil pero fuera de scope inicial.

## Próximos pasos

1. **Continuar el coding manual editorial** (Spec 41 r1) durante 8-12 semanas.
2. **Al llegar al umbral**: revisar el material acumulado para identificar patrones (qué países tienen más volatilidad, qué tipo de eventos disparan más overrides hipotéticos, etc.).
3. **Diseñar Spec 41B r1** en una sesión de Cowork con ese material a la vista.
4. **Implementar** en VS Code.
5. **Período de calibración**: 2-3 semanas con algoritmo corriendo + editor codificando, comparar baseline vs coding final, ajustar.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-18 | Creación como placeholder. Spec hija de Spec 41 r1. Se diseña cuando haya 8-12 semanas de coding manual editorial acumulado | Decisión #1 de Spec 41 r1: MVP manual primero, algoritmo después. Diseñar el algoritmo sin material editorial sería inventar reglas |
