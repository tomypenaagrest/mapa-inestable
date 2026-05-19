---
spec: 39B
titulo: Página dedicada de documentación por capa — "no esconder los trucos del mago"
estado: pendiente
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-18
epic: 03
afecta:
  - platform/frontend/src/app/mapa/capas/[id]/page.tsx (NUEVO)
  - platform/frontend/src/lib/layers.ts (extender contrato Layer con metadata documental)
  - 70-Producto/lecturas-capas/<capa>.md (extender estructura con secciones de documentación profunda) o nueva carpeta paralela 70-Producto/documentacion-capas/
depende_de: [39, 42]
relaciona_con:
  - Spec 39 (drawer corto de guía de lectura)
  - Spec 42 (primera capa real implementada — fuente del contenido documental concreto)
  - EPIC-03 (esta spec materializa el principio editorial de transparencia metodológica)
prioridad: baja (post-Spec 42)
---

# 39B · Página dedicada de documentación por capa

## Estado

**Placeholder. Se diseña al final de la épica, no post-Spec 42.**

Decisión refinada el 2026-05-18: aunque originalmente se pensó arrancar Spec 39B post-Spec 42, Tomás revisó y el orden correcto es esperar a que **las 4 capas estén implementadas** antes de diseñar esta spec. Razones:

1. El patrón documental tiene que ser consistente entre capas y eso solo se ve con todas las capas en el aire.
2. Si se arranca post-Spec 42, es probable que algo nuevo en Spec 44 (capa viento, codificación híbrida con override editorial) rompa el patrón establecido.
3. Las decisiones metodológicas más interesantes para documentar son las de viento — sin eso implementado, la documentación queda estructuralmente incompleta.

Por lo tanto, esta spec es **la última pieza editorial del epic**, después de Spec 47 (multi-capa) y antes/durante Spec 48 (risk management, condicional). El orden tentativo del epic queda:

1. Spec 39 (arquitectura) ✓ r2
2. Spec 40 (pipeline macro)
3. Spec 42 (precipitación) — valida arquitectura punta a punta
4. Spec 43 (temperatura)
5. Spec 41 (pipeline político) + Spec 44 (viento)
6. Spec 45 (presión)
7. Spec 46 (leyenda + onboarding)
8. Spec 47 (multi-capa)
9. **Spec 39B (esta — documentación profunda)** ← acá
10. Spec 48 (risk management, condicional)

## Origen

Spec 39 cerró las decisiones sobre el **reading drawer corto**: el panel que se desliza desde la derecha del mapa cuando el lector clickea `[ⓘ Leer guía]` en la leyenda. Ese drawer es un tooltip largo — 2-5 párrafos para entender la capa sin salir del mapa.

En la sesión del 2026-05-18, Tomás abrió una segunda pieza distinta:

> "Tiene que haber una versión de guía de lectura sobre el mapa, pero quisiera poder hacer una página extra luego sobre la documentación del análisis. Para no esconder los trucos del mago."

El reading drawer responde a "qué representa esta capa". Esta página dedicada responde a "cómo se calcula exactamente, de dónde sale cada número, qué decisiones metodológicas tomé, qué podés descargar para verificar". Es la materialización editorial del principio de trazabilidad — análogo al requisito de citas del proyecto (cada análisis tiene fuente primaria, URL, fecha), aplicado al método de las capas.

## Por qué importa

El proyecto Mapa Inestable se posiciona contra la desorientación epistemológica (uno de sus 6 ejes). Si las capas analíticas son un producto, esas capas no pueden ser una caja negra. La página dedicada de documentación hace explícito el método y permite al lector:

- Verificar que el cálculo coincide con lo que dice la fuente.
- Entender por qué dos países pueden tener el mismo color con datos crudos distintos.
- Replicar el análisis con sus propios datos.
- Cuestionar decisiones metodológicas (qué se incluyó, qué se dejó afuera).

Es coherente con la postura editorial del proyecto: un análisis cuya construcción no se puede inspeccionar funciona mal cuando lo que se está discutiendo es la calidad de la información pública.

## Alcance preliminar (a profundizar en r1)

Probable estructura de la página `/mapa/capas/[id]`:

- **Header**: nombre de la capa, glyph, eje afín del proyecto (si aplica), última actualización del pipeline.
- **Resumen ejecutivo**: una versión expandida del `description` que vive en el reading drawer.
- **Qué mide exactamente**: definición operativa rigurosa del indicador. Fórmulas si aplica.
- **Fuente primaria**: nombre, organismo, URL canónica, frecuencia oficial de publicación, licencia.
- **Pipeline**: cómo se obtiene el dato (RSS, scraping, descarga manual, API). Última corrida. Próxima corrida programada. Link al script en el repo si aplica.
- **Buckets y umbrales**: cómo se definieron los rangos de la escala. Por qué esos umbrales y no otros. Si fue decisión editorial vs algorítmica, decirlo.
- **Casos límite**: qué pasa cuando un país no actualiza, cuando hay revisiones retroactivas, cuando una fuente cambia de metodología.
- **Limitaciones**: qué NO captura esta capa. Sesgos conocidos. Relación con otras capas.
- **Descarga**: link al JSON / CSV crudo del dato que alimenta la capa, para que cualquiera verifique.
- **Histórico de cambios metodológicos**: log de cada cambio relevante en el método de la capa (ej. "2026-03-15: cambió la fuente de PBI nominal a PBI per cápita PPP por consistencia entre países").

## Lo que NO va acá

- Análisis editorial usando la capa (eso son las publicaciones / despachos del corpus).
- Onboarding visual de la metáfora climática (eso es Spec 46).
- Comparación cross-país (eventualmente, otra spec).

## Próximos pasos

1. Esperar a que Spec 42 (capa precipitación) esté implementada y publicada.
2. Iterar el contenido de la página de documentación de precipitación con material editorial real.
3. Una vez validada con una capa, extender el patrón a las otras tres en Specs 43-45 (cada spec hija agrega su página al patrón ya definido).
4. Considerar si la página queda como ruta dedicada `/mapa/capas/[id]` o si vive como sección expandible dentro del reading drawer cuando el lector la pide.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-18 | Creación como placeholder. Spec hija de Spec 39 r2 | Tomás explicitó el principio de transparencia metodológica al cerrar decisión #8 de Spec 39 r1. Se separa en spec hija para no inflar Spec 39 y para diseñar con material editorial real (post-Spec 42) |
