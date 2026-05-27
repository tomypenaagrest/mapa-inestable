---
epic: 04
titulo: Mobile-first como condición de lanzamiento
estado: diseño-completo
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-21
revision: 2026-05-26 (r6) — Specs 49 (touch handlers mapa) y 54 (performance budget) diseñadas y mergeadas. EPIC-04 completo en su fase de diseño — las 6 specs hijas están en estado `lista`. Cero decisiones abiertas. Listo para implementación en VS Code
historico_revisiones:
  - 2026-05-21 (r1) — creación del documento. 4 decisiones estratégicas cerradas en sesión. Specs hijas planteadas como pendientes
  - 2026-05-26 (r2) — onboarding mobile creado (`70-Producto/onboarding-mobile.md`). Decisión Abierta #1 cerrada: dispositivo de referencia = Samsung A54 (360×800). Decisiones abiertas renumeradas de 4 a 3
  - 2026-05-26 (r3) — Spec 50 (reading experience) diseñada y mergeada como lista. Decisión Abierta #3 cerrada: portada in-flow contenida (Opción 2). Decisiones abiertas renumeradas de 3 a 2
  - 2026-05-26 (r4) — Spec 52 (página de país) diseñada y mergeada como lista. Cerró 2 decisiones pendientes de Spec 16 (selector mobile + sparkline). No quedaron decisiones abiertas del epic afectadas
  - 2026-05-26 (r5) — Specs 51 (home) y 53 (navegación) diseñadas y mergeadas juntas. Cerró Decisión Abierta #2 del epic. Reabrió formalmente Spec 02 §2. Quedó 1 decisión abierta (performance budget)
tipo: documento-epic
afecta: [platform/frontend (vistas críticas, sistema de tipografía, componente del mapa), 70-Producto/specs (Specs 49-54 nuevas, complementan 02 y 22), 70-Producto/design-system (tokens responsivos)]
depende_de: [EPIC-03 implementado completo]
relaciona_con: [Spec 02 (mobile responsive — base que se profundiza), Spec 11 (rediseño home dashboard), Spec 16 (ficha de país), Spec 22 (mapa Torres García — base que se profundiza), Spec 34 (rediseño home r2), EPIC-03 (capas analíticas — debe terminar antes), plan-lanzamiento-julio-2026 (bloqueante de julio)]
specs_vinculadas: [49, 50, 51, 52, 53, 54]
prioridad: alta
naturaleza: documento vivo — fuente de verdad del epic, se actualiza con cada decisión cerrada o spec mergeada
bloqueante_de: lanzamiento-julio-2026
---

# 04 · Mobile-first como condición de lanzamiento

## Resumen ejecutivo

El plan de lanzamiento de Mapa Inestable como negocio (julio 2026) asume que el 80% del consumo va a ser mobile. La plataforma hoy fue construida desktop-first con adaptaciones responsive parciales (Spec 02 cubre CSS básico; Spec 22 cubre mobile del mapa a nivel de comportamiento pero no de touch handlers concretos). **No alcanza para sostener un lanzamiento donde la primera impresión de un nuevo lector va a ser en su teléfono.**

Este epic agrupa el trabajo de consolidación mobile-first de las vistas críticas — mapa, home, página de país, lectura — sobre las que se sostiene la conversión inicial. No es una reescritura del sitio: es un refinamiento quirúrgico de las pantallas que importan para julio, con criterio mobile-first donde corresponde y adaptación responsive donde alcanza.

**Outcome.** Un nuevo lector que llega al sitio desde un mensaje de WhatsApp o de Substack, en un teléfono LATAM con conexión inestable, puede: ver el mapa Torres García y navegarlo con gestos naturales (tap, pinch-zoom limitado, pan controlado), entrar a la ficha de un país, leer un análisis completo cómodo, y entender qué es el proyecto — todo sin sentir que está mirando una versión "comprimida" del desktop.

**Estado actual (2026-05-21).** Epic en planificación. EPIC-03 (capas analíticas) está en ejecución activa y debe terminar antes de arrancar la implementación de este. Esto da una ventana natural: el diseño de las specs hijas puede arrancar en Cowork en paralelo a la implementación final de EPIC-03 en VS Code, pero la implementación de EPIC-04 espera el cierre de EPIC-03.

**Lo que entra:**

- Touch handlers concretos del mapa Torres García (pinch-zoom limitado, pan controlado, tap, double-tap, gestos no destructivos) — profundización de Spec 22 §16 que hoy solo declara comportamiento.
- Sistema de tipografía y reading experience mobile (line-height, longitud de línea, padding lateral, tamaños calibrados a 360-414px de ancho).
- Re-jerarquización mobile-first de la home (en lugar de adaptar el layout desktop existente).
- Re-pensamiento de la página de país (`/pais/[slug]`) desde mobile (complementa Spec 02 §4 que solo apila columnas).
- Performance budget concreto para LATAM 3G/4G inestable: LCP, FCP, bundle size, image strategy, lazy loading.
- Navegación mobile clarificada (no hamburger por decisión de Spec 02 §2, pero sí breadcrumbs, skip links, comportamiento de back/forward).

**Lo que NO entra:**

- PWA (install prompt, manifest, push notifications, offline). Diferido a EPIC-05 post-lanzamiento.
- Reescritura del motor del mapa con librería especializada (Mapbox / MapLibre). Decisión estratégica cerrada: Opción A — adaptar D3 actual. Una eventual reescritura entraría en otra épica futura si las capas analíticas evolucionan a complejidades que D3 no soporte.
- Vistas secundarias profundas (archivo `/analisis`, página de eje `/ejes/[slug]`, página de autor, página de concepto, pipeline). Estas quedan con responsive parcheado de Spec 02 hasta post-lanzamiento.
- Gestos avanzados (swipe entre despachos, pull-to-refresh, animaciones complejas). Diferidos a EPIC-05.
- Sistema admin / promote / dashboard interno. No es público, no es prioridad mobile.
- Cambios al modelo de datos editorial, al sistema de agentes, o a cualquier pipeline backend.

---

## Las cuatro vistas críticas

La épica trata como críticas las cuatro pantallas que un lector nuevo ve en su primer minuto en el sitio. Si estas funcionan en mobile, el lanzamiento es defendible. Si no, no.

| Vista | Por qué es crítica | Estado mobile actual | Qué falta para julio |
|---|---|---|---|
| **Home** (`/`) | Primera impresión absoluta. Mapa + carrusel + heatmap + despacho | Layout desktop-first con responsive básico, mapa según Spec 22 §12 | Re-jerarquización mobile-first: qué es hero arriba del fold en 375px, qué se esconde, qué orden visual prioriza la lectura sobre la exploración |
| **Mapa Torres García** (componente en home + `/mapa`) | Identidad + entry point de navegación | Spec 22 §16 declara tap nav y labels ocultos pero **no implementa touch handlers** (pinch-zoom, pan controlado, double-tap, comportamientos defensivos) | Touch handlers concretos sobre D3.js, gestos naturales, performance del SVG inline en mobile bajo (~2GB RAM Android viejos) |
| **Página de país** (`/pais/[slug]`) | Segunda pantalla más visitada (destino del tap en mapa) | Spec 02 §4 apila columnas (sidebar baja, grids 1-col) | Replanteo de jerarquía: qué se ve primero, cómo se accede a los análisis, dónde va la pregunta central, qué pasa con el frame strip de ejes |
| **Lectura de análisis / ensayo** (`/analisis/[pais]/[slug]`, `/ensayos/[slug]`) | El producto en sí — donde se entrega el valor | Spec 02 §6 ajusta título; el resto "funciona bien sin cambios" según la spec | Sistema completo de reading experience: tipografía calibrada, line-height, longitud de línea óptima en 375px, padding lateral, gestión de imágenes/portadas, scroll progress, comportamiento de citas y blockquotes |

Las cuatro juntas son ~6-7 specs de trabajo. Lo que queda fuera (archivo, ejes, autores, conceptos, pipeline) sigue con Spec 02 parcheada hasta post-lanzamiento.

---

## Decisiones cerradas

| Fecha | Decisión | Rationale | Qué desbloquea |
|---|---|---|---|
| 2026-05-21 | **Alcance acotado a 4 vistas críticas para julio.** Mapa, home, país, lectura. El resto del sitio queda en responsive parcheado | Side project unipersonal con ventana de 6 semanas, post-EPIC 03. Hacer mobile-first integral no es viable y no es necesario para el lanzamiento — un lector nuevo no recorre las vistas secundarias en su primera sesión | Define el scope concreto de la épica y bloquea el impulso de "ya que estamos, hagamos todo" |
| 2026-05-21 | **Estrategia híbrida: rediseño mobile-first del mapa y la home; adaptación cuidadosa del resto.** Las vistas donde la jerarquía visual es central (home, mapa) se repiensan desde 375px. Las vistas de contenido (país, lectura) se adaptan profundizando lo existente | El desktop del mapa y la home gana al repensarlos (queda más enfocado, menos cluttered). El desktop de país y lectura ya está bien — no hay razón para reescribirlo, alcanza con que el mobile sea cómodo | Habilita Specs 51 (home) y 53 (mapa) como rediseños; deja Specs 50 (reading) y 52 (país) como adaptaciones profundas |
| 2026-05-21 | **Mapa: Opción A — adaptar D3 actual para touch.** Mantiene el motor SVG/D3 existente, agrega touch handlers (pinch-zoom limitado, pan controlado, tap, double-tap), reemplaza hover states con tap states + tooltips. No introduce librería de mapas nueva | EPIC 03 ya está implementando las capas analíticas sobre D3 sin problemas; alcanza para la visión actual. Mapbox/MapLibre se justifica solo si en futuro las capas evolucionan a partículas animadas reales o mapas de calor de alta densidad. Esa decisión, si llega, va a otra épica futura | Habilita Spec 49 como spec de touch sobre la base existente; evita re-trabajo de Spec 22 |
| 2026-05-21 | **PWA diferida a EPIC-05 post-lanzamiento.** Install prompt, manifest, push notifications y offline NO entran en EPIC-04 | El valor de PWA se ve cuando hay base de usuarios para medir engagement diario. Antes del lanzamiento sería trabajo especulativo. Mobile-first web responsive ya cubre el 95% del caso de uso editorial | Acota el scope, evita 2-3 specs adicionales que no son bloqueantes para julio |
| 2026-05-26 | **Dispositivo de referencia = Samsung A54 (360×800) como base de diseño.** Validación secundaria contra 390 (iPhone 13/14 emulado en devtools) y 412 (Pixel 6 emulado). Mobile-first estricto: si funciona apretado en 360, en 390/412 sobra espacio | Es el único dispositivo de validación física disponible. Diseñar contra un device que no se puede tocar (390/iPhone) es la peor combinación: layouts pensados para un ancho que después no se valida. La elección obliga a comprimir más al inicio pero el resultado es más robusto en Android base, que es ~30% del mercado LATAM | Habilita el arranque de Spec 50 (reading experience) con ancho base concreto y sistema tipográfico calibrado a 360 |
| 2026-05-26 | **Portada del análisis = in-flow contenida (Opción 2).** La portada NO ocupa hero a sangre arriba del fold. Aparece dentro del flujo, después del lede, con padding lateral igual al texto, caption en IBM Plex Mono debajo. Aspect ratio 3:2 | El producto del proyecto es el análisis, no la imagen. Las portadas Gemini son aún experimentales en calidad y constancia — sostenerlas in-flow es más conservador. El principio "densidad es virtud" + "esto no es Medium" del design system tira para esta opción. Para análisis insignia donde la portada sea particularmente potente, se puede sobreescribir caso por caso con un flag editorial (queda como nota en Spec 50 §6) | Cierra el layout del análisis. Habilita la consolidación de Spec 50 |
| 2026-05-26 | **Navegación principal mobile = hamburger único con drawer slide-in desde la izquierda (Spec 53 Variante 1).** Reemplaza Spec 02 §2 ("no hamburger"). El drawer (280px, fondo verde-negro) contiene dos secciones: "Secciones" (Despachos · Ensayos · Mapa · Acerca) en mono uppercase + "Recorrer el corpus" (Países · Ejes · Conceptos · Autores · Buscar) en Lora. Header mobile reducido a 44px (logo + wordmark + ☰) | El argumento original de Spec 02 ("no hamburger porque es editorial") era ideológico, no funcional — los principales sitios editoriales mobile (NYT, Guardian, El País, Aeon) usan el patrón. Con 9 destinos navegacionales el scroll horizontal no escala. El drawer en verde-negro con tipografía Alfa Slab + IBM Plex Mono sostiene el tono editorial. Argumento adicional (Tomás): es flexible para crecimiento futuro del menú sin rediseñar chrome | Cierra el header de TODAS las páginas mobile. Habilita Spec 51 (home) que depende del header común |
| 2026-05-26 | **Above-the-fold del home mobile = mapa Torres García + bloque "Esta semana" (Spec 51 Variante 1).** El mapa entra a sangre con aspect-ratio 1280/1380 (~388px alto en 360). Debajo el bloque "Esta semana · [eje]" en Alfa Slab + count en Lora italic. Ambos arriba del fold de A54. Descarta hero editorial manifiesto y análisis destacado | El mapa Torres García es la identidad signature declarada del proyecto (Spec 01 + Spec 11 arquetipo A + Spec 22 + Spec 34). Sacarlo del above-the-fold mobile contradice esa decisión. V2 hero editorial pesaría al lector recurrente (Spec 15) que ve la misma frase cada vez. V3 análisis destacado exige curaduría editorial semanal extra que no hay capacidad de sostener | Cierra el home mobile. Habilita la implementación del orden vertical en VS Code |
| 2026-05-26 | **Performance budget target = 4G LATAM (no 3G).** LCP < 2.5s en 4G simulado se confirma como meta. El supuesto operativo: el lector de Mapa Inestable accede desde 4G urbano o WiFi (suscriptor potencial de Substack pago en LATAM urbano). El caso 3G inestable existe pero no es el target | Tomás priorizó: "lectura con WiFi, no me preocupa" la conexión inestable como peor caso. El budget se calibra para 4G LATAM razonable, no para el peor caso de Android low-end con conexión 3G de borde. Decisión consciente que acepta un 5-10% del mercado LATAM en condiciones marginales | Cierra el último parámetro de Spec 54 antes de su diseño. NO quedan decisiones abiertas del epic |

---

## Decisiones abiertas

(Vacío — todas las decisiones del epic están cerradas. La spec 54 puede arrancar sin parámetros pendientes.)

---

## Specs vinculadas

Ordenadas por dependencia. La numeración arranca en 49 para no colisionar con specs 43-48 reservadas en EPIC-03.

| Spec | Título | Depende de | Estrategia | Estado |
|---|---|---|---|---|
| 49 | Touch handlers del mapa Torres García sobre D3 | Spec 22, Spec 33, Spec 51, EPIC-03 implementado | Rediseño (profundiza §16 de Spec 22) | **lista** (2026-05-26) |
| 50 | Reading experience mobile (tipografía, línea, padding) | Spec 02, design-system | Adaptación profunda | **lista** (2026-05-26) |
| 51 | Home re-jerarquizada mobile-first | Spec 11, Spec 34, Spec 22, Spec 50, Spec 52, Spec 53 | Rediseño (puede cambiar desktop) | **lista** (2026-05-26) |
| 52 | Página de país re-pensada desde mobile | Spec 02 §4, Spec 16, Spec 50 | Adaptación profunda | **lista** (2026-05-26) |
| 53 | Navegación mobile y comportamiento de header | Spec 02 §2 (REABRE decisión) | Reemplazo de Spec 02 §2 | **lista** (2026-05-26) |
| 54 | Performance budget LATAM (LCP, FCP, bundle, imágenes) | Spec 22 §18.5 (extiende), Spec 37, Spec 49, Spec 50, Spec 51, Spec 52, Spec 53 | Sistema transversal | **lista** (2026-05-26) |

**Estimación gruesa:** 6 specs, ~2 sprints de trabajo bien hecho asumiendo que las 4 decisiones abiertas se cierran al inicio de cada spec relevante, no en bloque.

**Orden recomendado de diseño en Cowork:**

1. **Spec 50 (reading experience)** primero — fuerza cerrar la decisión abierta #1 (dispositivo de referencia) y #4 (portada en mobile); deja la base tipográfica que las otras specs usan.
2. **Spec 49 (touch handlers mapa)** y **Spec 52 (país)** en paralelo — son independientes entre sí.
3. **Spec 51 (home)** después — necesita Spec 49 ya pensada para encastre del mapa.
4. **Spec 53 (navegación)** junto con Spec 51 — comparten la decisión abierta #3.
5. **Spec 54 (performance)** al final — necesita las otras 5 para saber qué optimizar; cierra la decisión abierta #2.

**Orden recomendado de implementación en VS Code:**

Mismo orden que diseño, una spec por vez, validando en dispositivo real entre cada una. Sin paralelizar implementación porque hay overlap en el componente del mapa y en el sistema de tipografía global.

---

## Cómo se conecta con el plan de lanzamiento

Esta épica es **bloqueante** del lanzamiento de julio según `80-Negocio/plan-lanzamiento-julio-2026.md`. La conversión de free a Cafecito / suscripción colapsa si la primera impresión en mobile es mala. El plan asume que el 80% del consumo va a ser mobile — la épica entrega esa condición.

**Ventana de ejecución prevista:**

| Semana | Cowork (diseño) | VS Code (implementación) |
|---|---|---|
| sem 21 (2026-05-25 / 2026-05-31) | EPIC-03: cerrar Specs 43-45 | EPIC-03: implementar Spec 42 |
| sem 22 (2026-06-01 / 2026-06-07) | EPIC-03: cerrar Specs 46-47 + EPIC-04: Spec 50 | EPIC-03: implementar Specs 43-44 |
| sem 23 (2026-06-08 / 2026-06-14) | EPIC-04: Specs 49, 52 | EPIC-03: implementar Specs 45-47 + EPIC-04: implementar Spec 50 |
| sem 24 (2026-06-15 / 2026-06-21) | EPIC-04: Specs 51, 53 | EPIC-04: implementar Specs 49, 52 |
| sem 25 (2026-06-22 / 2026-06-28) | EPIC-04: Spec 54 | EPIC-04: implementar Specs 51, 53 |
| sem 26 (2026-06-29 / 2026-07-05) | Soft launch interno y ajustes | EPIC-04: implementar Spec 54 + ajustes |
| sem 27 (2026-07-06 / 2026-07-12) | Lanzamiento formal | Bug fixes post-lanzamiento |

Esto es estimación, no compromiso. Realismo: probablemente entren 1-2 semanas de desfase, lo que mueve el lanzamiento a mediados/fines de julio. Si EPIC-03 se retrasa más de lo previsto, EPIC-04 se solapa más con su implementación (riesgo de conflictos en componente del mapa).

---

## Criterios de éxito de la épica

La épica está terminada cuando un lector nuevo, llegando desde un mensaje de WhatsApp o Substack en un Android mid-range con conexión LATAM, puede:

| # | Criterio | Cómo se mide |
|---|---|---|
| AE1 | Cargar la home en menos de 2.5s (LCP) | Lighthouse en throttling 3G fast / 4G slow |
| AE2 | Ver el mapa Torres García completo arriba del fold sin scrollear | Test visual en 375×667 (iPhone SE) y 360×640 (Android base) |
| AE3 | Tocar un país en el mapa con tap target ≥ 44×44 pt y navegar a su ficha | Manual test en device real |
| AE4 | Hacer pinch-zoom en el mapa sin que rompa la lectura ni quede atrapado en estado | Test manual de gestos |
| AE5 | Leer un análisis completo cómodo en mobile (line-height, longitud de línea, contraste) | Test de lectura sostenida de 5+ min sin fatiga visual evidente |
| AE6 | Volver al home con back nativo y no perder estado relevante | Test de back/forward en navegación |
| AE7 | Bundle inicial del home ≤ 250KB gzipped | Build report |
| AE8 | Cero capas de UI rotas en breakpoints intermedios (640px, 768px, 1024px) | Visual regression en los 3 breakpoints |

Si todos los AE pasan, la épica se cierra y el lanzamiento queda habilitado por el lado de plataforma.

---

## Próximos pasos

**EPIC-04 completo en su fase de diseño** (2026-05-26). Las 6 specs hijas están en estado `lista`. La implementación se hace en VS Code con Claude Code en el orden recomendado.

1. **Spec 50** (reading experience) — sistema tipográfico base. Implementar primero para que las otras specs puedan reusar el `article.css`.
2. **Spec 53** (navegación mobile) — header común a todas las páginas. Implementar antes que Spec 51 (depende del drawer).
3. **Spec 51** (home) — usa el header de Spec 53 + tipografía de Spec 50.
4. **Spec 52** (página país) — usa el header + tipografía + heatmap reutilizable que después usará Spec 51.
5. **Spec 49** (touch handlers mapa) — implementar después de que Spec 51 esté con el mapa renderizado. Requiere validar en device real.
6. **Spec 54** (performance budget) — implementar al final como sistema transversal. Lighthouse-ci + size-limit en CI no se activan hasta que las otras 5 estén implementadas (sus bundles definen los presupuestos).

**Estimación total de implementación** (sumada de las 6 specs hijas): ~85-95 horas (~2 sprints de trabajo dedicado bien hecho). Validación en device real entre cada spec.

**Recordatorio de flujo de trabajo.** El diseño de cada spec se hizo en sesiones de **Claude Cowork**. La implementación de cada spec en código va en **VS Code con Claude Code**. El handoff entre ambos es el archivo de spec mergeado. Ver sección "Flujo de trabajo" en `CLAUDE.md`.

---

## Validación cruzada — handoff a VS Code

Revisión de consistencia entre las 6 specs hijas antes del handoff (2026-05-26). Resultado: **aprobada para implementación**. Sin conflictos bloqueantes.

### Consistencia tipográfica

Sistema declarado en Spec 50 (mobile-360) y aplicado en las otras specs. Tokens compartidos:

| Token mobile-360 | Spec 50 | Spec 51 | Spec 52 | Spec 53 |
|---|---|---|---|---|
| Country name Alfa Slab | 44px | 48px (home) | 48px (header país) | n/a |
| h1 Fraunces 600 | 30px | n/a | n/a | n/a |
| h2 Fraunces 600 | 22px | n/a | 22px (sub-section) | n/a |
| Body Lora | 16/1.6 | 16/1.6 | 16/1.6 | n/a |
| Mono metadata | 11px | 11px | 11px | 11px |
| Padding lateral body | 20px | 20px | 20px | n/a |

**Observación:** la Country name varía entre 44 (lectura) y 48 (home + país). Es deliberado — en lectura está dentro del flujo editorial; en home y país es elemento de header con más peso visual. Consistente con la jerarquía del proyecto.

### Consistencia de header mobile

Spec 53 define el header común (44px sticky, ☰ a la derecha). Specs 50, 51, 52 lo heredan. El header de país (Spec 52) NO es sticky en sí — solo la banda de chips de tab queda sticky (44px). Consistente.

### Consistencia del comportamiento de tap en el mapa

Spec 22 §16.1 declaraba "tap navega directo + tooltip 800ms". Spec 49 reemplaza con "tap abre panel inline". Spec 51 §2.3 ya asumía el comportamiento de Spec 49. Spec 33 (panel preview) confirmado como contenido inline en mobile. **Coherente. Cross-ref aplicado en Spec 22.**

### Consistencia del sistema de portadas

Spec 37 define `cover_image` PNG. Spec 50 declara comportamiento in-flow contenida (no hero). Spec 54 declara conversión a WebP en el sync. **Coherente.** Schema del frontmatter NO cambia.

### Consistencia de performance

Spec 54 declara presupuestos por vista. Las otras specs los respetan:

| Spec | Componente | Peso declarado | Cabe en Spec 54 |
|---|---|---|---|
| 50 | article.css | ≤ 8KB gz | ✅ (parte de 25KB CSS lectura) |
| 51 | home JS total | n/a (no declarado) | ≤ 250KB (Spec 54) |
| 52 | country-page.css | n/a (no declarado) | ≤ 35KB (Spec 54) |
| 53 | focus-trap-react | ~3KB gz | ✅ (cabe en home y país) |
| 49 | useMapGestures hook | ~15KB | ✅ (parte del bundle del mapa, dentro del home 250KB) |

**Sin conflictos.**

### Cross-refs aplicados

Todas las specs declararon sus cross-refs a documentos previos:
- Spec 02 §2 → reabierta por Spec 53.
- Spec 02 §4 → deprecada por Spec 52.
- Spec 22 §16.1 → reemplazada por Spec 49 §7.
- Spec 22 §18.5 → extendida por Spec 54.
- Spec 16 §6.3, §7, §12.5 → reemplazadas/resueltas por Spec 52.
- Spec 11 §4.2 → nota agregada por Spec 53 (sidebar va al drawer en mobile).
- Spec 33 → confirmado como panel inline en mobile.
- Spec 34 §12 → fuente de verdad mobile pasa a Spec 51.
- Spec 37 §2 → extendido por Spec 54 (conversión WebP).

**Acción pendiente para implementación:** aplicar materialmente esas notas en los archivos de Spec 02, 11, 16, 22, 33, 34, 37 al implementar. No bloquean, son housekeeping.

### Observaciones para Claude Code en VS Code

1. **Implementar en el orden recomendado** del epic (50 → 53 → 51 → 52 → 49 → 54). No paralelizar — overlapean en componentes del header, mapa y article.
2. **Validar en device real (Samsung A54) entre specs**, no solo en emulator. Específicamente para Spec 49 (gestos) y Spec 54 (performance) la validación en device es no-negociable.
3. **El sub-agente de QA del proyecto** (si existe) puede correr Lighthouse-ci de Spec 54 cuando esté configurado.
4. **El plan de lanzamiento de julio** asume EPIC-04 implementada para mediados de junio. Si la implementación se desfasa, mover el lanzamiento — no apurar la validación.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación del documento. Origen: conversación sobre el plan de lanzamiento de julio 2026 y la realización de que la plataforma actual fue construida desktop-first con responsive básico. La primera impresión en mobile va a definir conversión, y hoy no está al nivel necesario | El plan de negocio (`80-Negocio/plan-lanzamiento-julio-2026.md`) identificó mobile-first como bloqueante de la viabilidad del lanzamiento. Hacía falta un epic explícito que agrupe el trabajo y deje el norte claro |
| 2026-05-21 | Cerradas las 4 decisiones estratégicas en sesión de diseño con Claude: alcance acotado a 4 vistas críticas, estrategia híbrida (rediseño mapa+home / adaptación país+lectura), Opción A para el mapa (adaptar D3 sin librería nueva), PWA diferida a EPIC-05 | Permite escribir el epic con decisiones cerradas desde la r1, no como documento abierto que espera definiciones |
| 2026-05-26 | r2: creado `70-Producto/onboarding-mobile.md` como base conceptual del epic. Cerrada Decisión Abierta #1 (dispositivo de referencia = Samsung A54 / 360×800). Decisiones abiertas restantes renumeradas de 4→3 | Arranque del trabajo de diseño en Cowork. Tomás no tiene experiencia previa en mobile y necesitaba base conceptual antes de tomar decisiones. La elección de Samsung A54 como base salió de constraint físico: es el device de validación disponible |
| 2026-05-26 | r3: Spec 50 (reading experience) diseñada, mockeada en widgets HTML inline en Cowork, y consolidada como lista. Cerrada Decisión Abierta #3 (portada in-flow contenida). Decisiones abiertas restantes renumeradas de 3→2 | Primera spec hija de EPIC-04 completada. El ciclo diseño conceptual → mocks comparados → elección → consolidación tomó una sesión de Cowork. Validó que el approach Opción A (mocks desde acá vs herramienta externa) funciona — habilita repetir el patrón para Specs 49, 52, 51, 53, 54 |
| 2026-05-26 | r4: Spec 52 (página de país) diseñada y mergeada en continuación de la misma sesión. 3 variantes de selector de tabs comparadas → elegida V2 (chips horizontales + sticky mínimo, descarta dropdown de Spec 16 §7). 2 componentes internos validados visualmente en 360: heatmap eje × tiempo 6×12 y card macro con sparkline 26px. Cerradas 2 decisiones pendientes de Spec 16 (§7 selector y §12.5 sparkline) | Segunda spec hija completada en la misma sesión, reusando el sistema tipográfico de Spec 50. Más rápida que Spec 50 porque la estructura conceptual estaba en Spec 16 — el trabajo fue de calibración a 360, no de definición. Quedan 4 specs hijas: 49 (mapa), 51 (home), 53 (nav), 54 (performance) |
| 2026-05-26 | r5: Specs 51 (home) y 53 (navegación) diseñadas y mergeadas juntas en continuación de la misma sesión. 3 variantes de navegación mobile → elegida V1 hamburger único (cierra Decisión Abierta #2 del epic, reabre Spec 02 §2). 3 variantes de above-the-fold del home → elegida V1 mapa protagonista + "Esta semana" (mantiene signature del proyecto). Orden vertical post-fold derivado de Spec 34 sin variantes adicionales — derivable por la estructura ya validada | Tercera y cuarta specs hijas completadas en la misma sesión. 4 de 6 specs hijas listas. El sistema mobile del proyecto queda definido en sus piezas mayores. Quedan: Spec 49 (touch handlers del mapa, idealmente después de EPIC-03 cerrada) y Spec 54 (performance, al final una vez que todas las otras existan). Pace promedio observado: 1 spec hija cerrada cada 30-45 minutos de Cowork |
| 2026-05-26 | r6: Specs 49 (touch handlers mapa) y 54 (performance budget) diseñadas y mergeadas. Tomás confirma que EPIC-03 está cerrado (desbloquea Spec 49). LCP target = 4G (cierra última Decisión Abierta del epic). Spec 49 reemplaza el comportamiento de tap declarado en Spec 22 §16.1 (tap abre panel inline, no navega directo). Spec 54 declara presupuestos por vista + Lighthouse-ci + size-limit en CI | Quinta y sexta specs hijas completadas en la misma sesión. EPIC-04 completo en su fase de diseño — las 6 specs hijas están en estado `lista`, cero decisiones abiertas. Listo para implementación en VS Code |

---

## Preguntas resueltas

| # original | Pregunta | Resolución | Fecha |
|---|---|---|---|
| 1 (r1) | ¿Qué dispositivo de referencia para diseño y testeo? | Samsung A54 (360×800) como base; 390 y 412 emulados como validación secundaria | 2026-05-26 |
| 4 (r1) → 3 (r2) | ¿La portada del análisis ocupa hero completo en mobile o queda como elemento dentro del flujo? | In-flow contenida (Opción 2). Hero a sangre se descartó por sacrificar el fold editorial; híbrida overlay se descartó por agregar constraint operativo a las portadas Gemini que no compensa el wow effect | 2026-05-26 |
| 3 (r1) → 2 (r4) | ¿Cómo se accede al menú/navegación principal en mobile? | Hamburger único (☰) con drawer slide-in desde la izquierda, 280px ancho, dos secciones internas diferenciadas (Secciones + Recorrer el corpus). Reemplaza Spec 02 §2 | 2026-05-26 |
| 2 (r1) → 1 (r5) | Performance budget concreto: ¿LCP target en 3G LATAM o 4G LATAM? | 4G LATAM. Se acepta degradación gradual en 3G inestable. El target operativo es el lector tipo (4G urbano o WiFi, suscriptor potencial de Substack pago) | 2026-05-26 |

---

## Notas

- Este documento se actualiza con cada decisión cerrada (mover de "Decisiones abiertas" a "Decisiones cerradas" con fecha y rationale), cada spec mergeada (actualizar columna estado en la tabla), y cada pregunta abierta resuelta.
- La épica **complementa**, no reemplaza, a Spec 02 y Spec 22. Donde existe conflicto, esta épica es la fuente de verdad y se actualiza la spec correspondiente con un cross-ref.
- Para el contexto de por qué mobile-first es bloqueante de lanzamiento, ver `80-Negocio/plan-lanzamiento-julio-2026.md` §3 (posicionamiento) y §6 (pricing — el checkout mobile define conversión).
- Para el patrón de epic que inspiró este formato, ver `EPIC-03-capas-analiticas.md`.
- PWA queda apuntado como EPIC-05 placeholder. Cuando se cree ese epic, hereda las decisiones diferidas de acá: install prompt, manifest, push de despachos, offline básico para lectura. Esa decisión se evalúa post-lanzamiento con datos de uso real.
