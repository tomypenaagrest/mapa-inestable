# Prompt para NotebookLM — Fichas teóricas Mapa Inestable

Dos versiones. Probá primero la **comprimida**. Si tampoco entra, usá la **partida en dos**.

---

## VERSIÓN 1 — Comprimida (un solo prompt)

```
Sos asistente de investigación. Producís fichas teóricas Markdown para Mapa Inestable, base de conocimientos sobre Sudamérica.

Marco: 6 ejes existentes — deculturación, erosión de mediaciones, desrepresentación, estetización, desorientación epistemológica, atención. Hipótesis: las estructuras que organizaban la vida colectiva pierden capacidad de mediación.

TAREA 1 — 6 fichas, una por concepto (no por libro), de:
1. Arrighi — ciclo sistémico de acumulación o hegemonía
2. Mann — una de las 4 fuentes del poder social
3. Kennedy — overstretch imperial o relación poder económico/militar
4. Fukuyama, Orden y decadencia — decadencia política
5. Agnew — trampa territorial / soberanía
6. Renouvin o Duroselle — fuerzas profundas en RR.II.

Formato de cada ficha:
---
titulo: [concepto]
autor: [apellido]
obra: [libro]
ano: [año]
---
# [concepto]
> [definición en una oración]
## Argumento
[1 párrafo]
## Cita
> "[literal]" — [autor, p. XX]
## Aplicabilidad sudamericana
[2-3 oraciones; si no aplica directo, decirlo]
## Cruces con ejes
- [[eje]] — [oración]
## Vinculados
- [[concepto]]
## Fuente
[obra, autor, año, pp. XX-YY]

Reglas: cita textual con página obligatoria; NUNCA inventar páginas (usar [p. ?]); wikilinks Obsidian [[X]]; español rioplatense.

TAREA 2 — Después de las 6 fichas, sección "# Ejes candidatos" con 2 a 4 ejes nuevos.

Un eje = proceso estructural de larga duración, no un concepto. Mismo registro que los 6 (sustantivo abstracto, prefijo de-/des-/re-/pos- o sufijo -ización). Tiene que estar alimentado por ≥2 fichas de autores distintos.

Formato:
## Eje candidato: [nombre]
**Definición:** [1 oración]
**Por qué es eje:** [2 oraciones]
**Fichas que lo alimentan:** [lista]
**Relación con los 6:** [diferenciación; si es extensión de uno existente, decirlo]
**Manifestación sudamericana:** [fenómeno concreto]
**Pregunta abierta:** [una]

Empezá.
```

---

## VERSIÓN 2 — Partida en dos prompts

Si la comprimida tampoco entra, usás estos dos en secuencia. Antes de pegar el segundo, esperás la respuesta del primero.

### Prompt A — Solo fichas

```
Sos asistente de investigación para Mapa Inestable, proyecto sobre Sudamérica con 6 ejes: deculturación, erosión de mediaciones, desrepresentación, estetización, desorientación epistemológica, atención.

Producí 6 fichas teóricas en Markdown, una por concepto (no por libro), de:
1. Arrighi — ciclo sistémico o hegemonía
2. Mann — una de las 4 fuentes del poder social
3. Kennedy — overstretch o poder económico/militar
4. Fukuyama, Orden y decadencia — decadencia política
5. Agnew — trampa territorial / soberanía
6. Renouvin o Duroselle — fuerzas profundas

Formato:
---
titulo: [concepto]
autor: [apellido]
obra: [libro]
ano: [año]
---
# [concepto]
> [definición en una oración]
## Argumento
[1 párrafo]
## Cita
> "[literal]" — [autor, p. XX]
## Aplicabilidad sudamericana
[2-3 oraciones]
## Cruces con ejes
- [[eje]] — [oración]
## Vinculados
- [[concepto]]
## Fuente
[obra, autor, año, pp. XX-YY]

Reglas: cita con página obligatoria; NUNCA inventar páginas (usar [p. ?]); wikilinks [[X]]; español rioplatense.

Empezá.
```

### Prompt B — Solo ejes candidatos (después de recibir las 6 fichas)

```
A partir de las 6 fichas que generaste, propóneme entre 2 y 4 ejes candidatos para sumar al sistema Mapa Inestable.

Un eje = proceso estructural de larga duración, no un concepto. Mismo registro que los 6 existentes (deculturación, erosión de mediaciones, desrepresentación, estetización, desorientación epistemológica, atención): sustantivo abstracto, prefijo de-/des-/re-/pos- o sufijo -ización.

Criterios:
- Proceso, no estado
- Aplicable a Sudamérica concretamente
- No solapa con los 6 actuales (si solapa, proponelo como extensión)
- Alimentado por ≥2 fichas de autores distintos

Formato de cada eje:
## Eje candidato: [nombre]
**Definición:** [1 oración]
**Por qué es eje:** [2 oraciones]
**Fichas que lo alimentan:** [lista]
**Relación con los 6:** [diferenciación o "extensión de [eje]"]
**Manifestación sudamericana:** [fenómeno concreto]
**Pregunta abierta:** [una]

Empezá.
```

---

## Notas operativas

- Si la **Versión 1** entra pero la respuesta sale truncada, pasá a la **Versión 2** (partida).
- Si NotebookLM se pone vago con las citas (cita sin página, parafrasea en vez de citar), repetile: *"recordá: cita textual con página exacta o `[p. ?]` — nunca inventes paginación"*.
- Si los ejes candidatos salen muy pegados a los 6 actuales, pedile: *"reformulá los ejes que solapen como extensiones de los existentes y proponé al menos 1 que cubra una zona que los 6 actuales no tocan (poder, soberanía, civilización, tiempo histórico)"*.
