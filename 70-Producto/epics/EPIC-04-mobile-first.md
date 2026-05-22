---
epic: 04
titulo: Mobile-first como condición de lanzamiento
estado: borrador-r1
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-21
revision: 2026-05-21 (r1) — creación del documento. 4 decisiones estratégicas cerradas en sesión. Specs hijas planteadas como pendientes
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

---

## Decisiones abiertas

| # | Pregunta | Cuándo se cierra |
|---|---|---|
| 1 | **¿Qué dispositivo de referencia para el diseño y testeo?** Probables candidatos: iPhone 13/14 (390×844), Samsung A-series mid-range (360×800), Pixel 6 (412×915). El diseño base se hace contra uno y se valida contra los otros dos. La elección importa porque el ancho base define la grilla y los tamaños tipográficos | Al arrancar Spec 50 (reading experience) — primera spec que requiere ancho base concreto |
| 2 | **Performance budget concreto: LCP target en 3G LATAM o 4G LATAM?** Spec 22 §18.5 declara LCP < 2.5s en 4G simulado. Para LATAM con conexión inestable, ¿se mantiene esa meta o se sube a 3G como peor caso? La diferencia define presupuesto de bundle, estrategia de imágenes, prioridad de hidratación | Al arrancar Spec 54 (performance budget) — la spec entera depende de esto |
| 3 | **¿Cómo se accede al menú/navegación principal en mobile?** Spec 02 §2 decidió "no hamburger porque es sitio editorial" — el header pasa a flex-column con scroll horizontal. Pero con 4 vistas críticas + acceso a otras secciones (archivo, ejes, conceptos, acerca), el scroll horizontal de nav puede no escalar. ¿Confirmamos Spec 02 o reconsideramos hamburger sólo para el nav secundario? | Al arrancar Spec 51 (home re-jerarquizada) — primera spec que confronta la decisión |
| 4 | **¿La portada del análisis ocupa hero completo en mobile o queda como elemento dentro del flujo?** Las portadas de Spec 37 son visualmente potentes. En mobile pueden funcionar como hero arriba del fold (cinematográfico) o como imagen dentro de la lectura (más sobrio). Es decisión editorial, no técnica | Al arrancar Spec 50 (reading experience) |

---

## Specs vinculadas

Ordenadas por dependencia. La numeración arranca en 49 para no colisionar con specs 43-48 reservadas en EPIC-03.

| Spec | Título | Depende de | Estrategia | Estado |
|---|---|---|---|---|
| 49 | Touch handlers del mapa Torres García sobre D3 | Spec 22, EPIC-03 implementado | Rediseño (profundiza §16 de Spec 22) | pendiente |
| 50 | Reading experience mobile (tipografía, línea, padding) | Spec 02, design-system | Adaptación profunda | pendiente |
| 51 | Home re-jerarquizada mobile-first | Spec 11, Spec 34, Spec 22 | Rediseño (puede cambiar desktop) | pendiente |
| 52 | Página de país re-pensada desde mobile | Spec 02 §4, Spec 16 | Adaptación profunda | pendiente |
| 53 | Navegación mobile y comportamiento de header | Spec 02 §2 (puede reabrir decisión) | Adaptación + decisión cerrada en §4 abierta | pendiente |
| 54 | Performance budget LATAM (LCP, FCP, bundle, imágenes) | Spec 22 §18.5 (extiende), Spec 50 | Sistema transversal | pendiente |

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

1. **Esperar cierre de EPIC-03.** No bloquear el trabajo en curso. Specs 43-47 + 39B + 41B son prioridad de EPIC-03 antes de arrancar implementación de EPIC-04.
2. **En paralelo a la implementación final de EPIC-03 en VS Code, arrancar el diseño de Spec 50 (reading experience) en Cowork.** Es la primera porque cierra las decisiones abiertas #1 (dispositivo de referencia) y #4 (portada en mobile) que las otras specs necesitan.
3. **Diseñar Specs 49, 52 en Cowork** una vez Spec 50 esté mergeada — son independientes entre sí, pueden ir en paralelo si hay sesiones disponibles.
4. **Diseñar Specs 51, 53 en Cowork** — comparten decisión abierta #3 (navegación).
5. **Diseñar Spec 54 (performance) al final** con todas las demás cerradas — define presupuestos con base en lo que ya está diseñado.
6. **Implementación en VS Code en el mismo orden** que el diseño, validando en device real entre specs.

**Recordatorio de flujo de trabajo.** El diseño de cada spec se hace en sesiones de **Claude Cowork** (este entorno). La implementación de cada spec en código va en **VS Code con Claude Code**. El handoff entre ambos es el archivo de spec mergeado. Ver sección "Flujo de trabajo" en `CLAUDE.md` y la convención usada en EPIC-03.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-21 | Creación del documento. Origen: conversación sobre el plan de lanzamiento de julio 2026 y la realización de que la plataforma actual fue construida desktop-first con responsive básico. La primera impresión en mobile va a definir conversión, y hoy no está al nivel necesario | El plan de negocio (`80-Negocio/plan-lanzamiento-julio-2026.md`) identificó mobile-first como bloqueante de la viabilidad del lanzamiento. Hacía falta un epic explícito que agrupe el trabajo y deje el norte claro |
| 2026-05-21 | Cerradas las 4 decisiones estratégicas en sesión de diseño con Claude: alcance acotado a 4 vistas críticas, estrategia híbrida (rediseño mapa+home / adaptación país+lectura), Opción A para el mapa (adaptar D3 sin librería nueva), PWA diferida a EPIC-05 | Permite escribir el epic con decisiones cerradas desde la r1, no como documento abierto que espera definiciones |

---

## Preguntas resueltas

(Vacío — preguntas se mueven acá cuando se cierren las abiertas)

---

## Notas

- Este documento se actualiza con cada decisión cerrada (mover de "Decisiones abiertas" a "Decisiones cerradas" con fecha y rationale), cada spec mergeada (actualizar columna estado en la tabla), y cada pregunta abierta resuelta.
- La épica **complementa**, no reemplaza, a Spec 02 y Spec 22. Donde existe conflicto, esta épica es la fuente de verdad y se actualiza la spec correspondiente con un cross-ref.
- Para el contexto de por qué mobile-first es bloqueante de lanzamiento, ver `80-Negocio/plan-lanzamiento-julio-2026.md` §3 (posicionamiento) y §6 (pricing — el checkout mobile define conversión).
- Para el patrón de epic que inspiró este formato, ver `EPIC-03-capas-analiticas.md`.
- PWA queda apuntado como EPIC-05 placeholder. Cuando se cree ese epic, hereda las decisiones diferidas de acá: install prompt, manifest, push de despachos, offline básico para lectura. Esa decisión se evalúa post-lanzamiento con datos de uso real.
