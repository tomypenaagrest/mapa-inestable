---
tipo: prompt de arranque
para: sesión futura de Cowork que diseñe Spec 43
fecha: 2026-05-20
contexto: Spec 42 cerrada en r2 (Anexo A resuelto, asset C.4 entregado). Próxima capa en orden = temperatura (decisión 5 + apertura #2 del epic resuelta en favor de "publicar de a una, en orden").
---

# Prompt · diseñar Spec 43 (capa temperatura) en Mapa Inestable

Copiá este bloque entero al iniciar la sesión de Cowork.

---

Quiero diseñar la **Spec 43 (capa temperatura)** del EPIC 03 de Mapa Inestable. Es la segunda capa analítica real del epic, después de Spec 42 (precipitación) que ya quedó cerrada en r2.

## Antes de hacer cualquier pregunta o redactar nada, hacé estos pre-flight checks

1. **Leé el doc maestro del epic** — `70-Producto/epics/EPIC-03-capas-analiticas.md`. Especialmente la tabla "Las cuatro capas", la sección "Decisiones cerradas", la sección "Próximos pasos", y el caveat sobre dirección de la capa viento.
2. **Leé Spec 42 completa** — `70-Producto/specs/42-capa-precipitacion.md`. Esta es la spec de capa de referencia. Spec 43 hereda la mayoría de su estructura y patrón. Prestá atención particular a:
   - El contrato técnico de subindicadores (decisión #10).
   - El cierre del Anexo A (A.4 tooltip+drawer, B.4 dirección solo en leyenda, C.4 glyph nube+gotas).
   - La sección "Decisiones condicionales para r3" — el punto #2 dice explícitamente que Spec 43 puede divergir en r1 si el patrón no traduce bien.
3. **Verificá el estado de implementación de Spec 42** — checkeá si los stubs ya corrieron en VS Code (`platform/frontend/src/lib/layers/precipitacion.ts`, tokens CSS, glyph en `public/mapa/glyphs/`). Si hubo ajustes al contrato `Layer` o a `LayerSubIndicator`, registralo antes de seguir.
4. **Verificá la cobertura real de los indicadores de temperatura** en `platform/data/indicators-macro/indicators-macro.json`:
   - Indicador principal candidato: `c7-salario-real-mensual` (el epic lo señala como base).
   - Verificar también: `d3-gini` (desigualdad — puede ser subindicador o complemento del principal según apertura del epic), `c1-desempleo`, `c2-informalidad`, otros indicadores de familia `empleo` o `sociales` que tengan cobertura.
   - El epic anticipa cobertura 6-8 países (no 10 como precipitación). Confirmar con datos reales.
5. **Leé el design system del mapa** — `70-Producto/design-system/mapa/glyphs/README.md` (creado con Spec 42). Define el patrón visual heredable: viewBox 48×48, `currentColor`, sistema "elemento principal + secundarios".

## Lo que Spec 43 hereda directo de Spec 42 (no reabrir)

- Contrato `Layer` + propuesta de extensión `subIndicators?: LayerSubIndicator[]`.
- Modelo de tiempo por capa (declarar `cadence` intencional con fallback runtime).
- Patrón de escala secuencial intensidad: 5 buckets de **magnitud absoluta** + dirección separada (probablemente — ver decisión nueva #2 abajo).
- Patrón A.4 (tooltip mínimo en hover + drawer completo con subindicadores y sparklines, `invertGood` para indicadores donde "más alto = peor").
- Patrón de cobertura editorial piloto (3 países curados, resto técnico-only).
- Patrón de quality flag (`oficial` / `estimado` / `congelado`).
- Patrón de paleta: tokens CSS `--mi-temperatura-0..4`, un solo tono con 5 saturaciones. Coherente con dirección Grabado.
- Patrón de glyph: sistema "elemento principal + secundarios" en trazo manuscrito, viewBox 48×48.

## Decisiones nuevas que Spec 43 tiene que cerrar (en r1)

1. **Unidad e indicador principal.** Salario real es un **índice** (base = 100 en algún año), no un %. Esto cambia toda la calibración numérica:
   - ¿Cuál es el indicador principal exacto? (`c7-salario-real-mensual` o algún otro de macro-v1.1.0).
   - ¿Los buckets de magnitud miden variación interanual del índice, variación absoluta respecto a base, o magnitud del cambio mes a mes?
   - ¿Qué umbrales definen "leve / moderado / fuerte / extremo" para esa unidad?
2. **Caveat B.4 — revisar dirección.** Salario real subiendo vs bajando es muy parecido a PBI subiendo vs bajando (mismo perfil: positivo = buena noticia, negativo = mala). B.4 probablemente aplica igual. **Pero hay que confirmarlo a propósito, no por inercia.** Si confirma, marcar explícitamente. Si no, abrir como decisión nueva en Anexo A.
3. **Subindicadores.** El epic mencionó "ratio mediano/promedio como índice de desigualdad" combinado con salario real. ¿Cómo se materializa?
   - Opción A: el ratio mediano/promedio es uno más de los 4 subindicadores (sparkline en drawer, igual que precipitación con inflación/inversión/deuda/productividad).
   - Opción B: el ratio cambia la lectura principal (ej. el color del país combina salario real con desigualdad — más complejo pero más expresivo).
   - Opción C: el ratio queda en una "vista" alternativa del controlador (rompe el principio de "una sola capa con dimensiones secundarias").
   - **Recomendación a priori**: opción A para mantener el patrón. Confirmar con el usuario.
   - **Otros subindicadores candidatos**: desempleo (`c1-desempleo`), informalidad (`c2-informalidad`), Gini (`d3-gini`), pobreza (`d1-pobreza`). Hay que curar cuáles según cobertura del pipeline.
4. **Cobertura piloto.** Spec 42 eligió ARG/BRA/CHI. ¿Mismo set para Spec 43? Considerar: si la cobertura técnica baja a 6-8 países (no 10), los países piloto deben estar dentro de los disponibles. Si el pipeline no tiene Chile en salario real mensual, hay que cambiar de piloto.
5. **Cadencia y fallback.** Spec 40 declaró `series_mensual` para `c7-salario-real-mensual` pero los datos pueden estar pendientes de la corrida con red contra ILO. Decisión: ¿declarar `cadence: "mensual"` con fallback a `series_trimestral` y luego a `series_anual`? ¿Qué hace la spec si solo hay anual?
6. **Glyph nuevo (decisión C análoga).** Esta decisión se cierra en sesión de Product Design como hizo Spec 42 (Anexo A). El sistema heredado dice "elemento principal + secundarios" — para temperatura, candidato natural: **termómetro + marcas / sol + rayos / mercurio en columna**. Dejar como decisión abierta para Product Design en Anexo A.

## Caveats operativos a registrar

- Si la implementación de Spec 42 en VS Code reveló bugs o ajustes al contrato `Layer`, Spec 43 debe consumir la versión más actual del contrato.
- Si el pipeline mensual no se corrió con red, los AC de Spec 43 que dependen de `series_mensual` quedan condicionales (mismo patrón que Spec 42 AC5/AC6).
- El doc maestro del epic se actualizará tras Spec 43 r1 — agregar entrada al histórico, cambiar estado en la tabla, actualizar pregunta abierta #2 del epic (relación capa ↔ eje editorial) si aplica.

## Flujo esperado de la sesión

1. **Pre-flight checks** (lectura + verificación de datos del pipeline).
2. **Resumen al usuario** de lo que encontraste — confirmar estado de Spec 42, cobertura real de indicadores temperatura, hallazgos relevantes.
3. **AskUserQuestion estructurado** sobre las decisiones nuevas #1, #3, #4, #5 (la #2 podés cerrarla tú con recomendación + confirmación; la #6 va a Anexo A).
4. **Redactar Spec 43 borrador-r1** en `70-Producto/specs/43-capa-temperatura.md` heredando estructura de Spec 42. Mismas secciones: frontmatter, resumen, estado actual, propuesta, archivos a tocar, AC, edge cases, decisiones tomadas, decisiones abiertas r2 (Anexo A), Anexo A brief para Product Design, histórico, glosario.
5. **Actualizar doc maestro EPIC 03**: estado de Spec 43 en tabla, entrada al histórico, ajustar la tabla "Las cuatro capas" con fuente real y estado.
6. **Actualizar memoria** `mi_epic_03_capas_analiticas.md` con la nueva pieza activa.

## Cuándo Spec 43 está "lista para Product Design"

Cuando todos los siguientes se cumplan:
- Estado: `borrador-r1`.
- Las 5 decisiones técnicas (#1, #2, #3, #4, #5) cerradas con razón explícita.
- La decisión #6 (glyph) marcada como abierta para Product Design en Anexo A, con brief autocontenido.
- Caveats heredados de Spec 42 documentados explícitamente.

Después de Product Design: r2 (igual que Spec 42).
Después de r2: handoff a VS Code.

---

## Notas de método

- Usá el patrón documental de Spec 41 r2 y Spec 42 r2 como anclas — no inventes estructura nueva.
- Si encontrás algo que **no está cubierto** por el patrón heredado y requiere divergencia, marcalo explícitamente como "decisión local de Spec 43 que diverge del patrón Spec 42" con razón.
- Frescura > velocidad. Si una decisión necesita más conversación, no la fuerces al cierre — dejala explícita como abierta y avanzá.
- El brief de Product Design (Anexo A) tiene que ser autocontenido, igual que en Spec 42 — alguien tiene que poder agarrarlo sin leer el resto de la spec.
