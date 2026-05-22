---
tags: [negocio, estrategia, lanzamiento]
tipo: plan-estrategico
estado: borrador-v1
fecha: 2026-05-21
horizonte: julio 2026
autor: Tomás
---

# Plan estratégico de lanzamiento — julio 2026

> Documento estratégico, no operativo. Define tesis, posicionamiento, modelo y constraints. El roadmap semanal va en un documento aparte una vez aprobado lo de acá.

---

## Síntesis ejecutiva

Mapa Inestable tiene los activos para lanzarse como **negocio editorial híbrido en julio 2026**, sostenido como side project, con un MVP que combina:

1. **Substack pago con tier free + premium** como canal de monetización principal (cobra desde el día uno, mínimo overhead operativo).
2. **La plataforma propia como ancla de diferenciación** — el motivo por el que alguien paga este Substack y no otro.
3. **Una puerta lateral hacia consultoría/informes a medida** como upside no comprometido (oportunista, no roadmap obligatorio).

El error a evitar es lanzar el SaaS como producto vendible en julio: no hay tiempo de hacerlo monetizable solo en 6 semanas sin descuidar Brevity. El error opuesto a evitar es lanzar "solo otro Substack": la plataforma es lo que sostiene un pricing más alto y un posicionamiento defendible.

**Pricing tentativo a validar:** USD 7/mes o USD 60/año (anclado en Boz histórico USD 90/año y mediana de Substack hispano). Tier institucional/equipos: USD 250–400/año.

---

## 1. Estado actual: el capital con el que se arranca

Antes de pensar modelo, hay que tener claro qué hay construido. Mapa Inestable no arranca de cero — arranca con un stack inusual para un proyecto editorial unipersonal.

**Contenido y corpus.**
- 15 publicaciones en el Substack actual.
- 10 países cubiertos con fichas estructurales (`15-Países/`).
- 40+ disparadores procesados (`40-Disparadores/`).
- 6 ejes conceptuales propios desarrollados (`10-Ejes/`).
- Método de 4 pasos formalizado y aplicable (`20-Metodo/`).
- Lecturas críticas de autores (Roy, Han, Harari, Huntington).
- Sistema de portadas con identidad visual coherente.

**Infraestructura técnica.**
- Plataforma web construida (FastAPI + Next.js + D3.js).
- Mapa Torres García interactivo con hot-zones por país.
- Dashboard por país, archivo, página de ensayos, capas analíticas.
- Sistema de agentes automáticos (`mapa-inestable.plugin`): análisis semanal, despacho semanal, agente diario, agendas por país.
- Pipeline de portadas con Gemini.

**Diferenciador editorial.**
- Único proyecto de análisis político LATAM en español que combina: framework conceptual coherente (los 6 ejes), método explícito, tratamiento regional (no país por país), interfaz visual propia (mapa invertido) y producción asistida por agentes.

Esto importa porque define qué se puede cobrar y por qué. **El Substack solo es una commodity (hay decenas). El Substack + la plataforma + el framework es defendible.**

---

## 2. Tesis del negocio

> Mapa Inestable existe como negocio porque hay un mercado pequeño pero estable de lectores e instituciones que necesitan **interpretación estructural** de América Latina y no encuentran un proyecto que la entregue con consistencia metodológica, en español, sin reaccionar a la coyuntura.

Esta tesis se sostiene si tres cosas son ciertas:

1. **Hay demanda de marco interpretativo, no de noticias.** El espacio de noticias está saturado y deflacionado en precio (los medios mismos están en crisis). El espacio de marco interpretativo coherente es escaso. Boz cobraba USD 90/año cuando cobraba — y su valor era exactamente ese: filtrar señal del ruido.
2. **La región se lee mal desde adentro y desde afuera.** Desde adentro, fragmentada por país. Desde afuera, simplificada por categorías importadas (populismo, izquierda/derecha). El proyecto tiene framework para leerla diferente.
3. **El idioma español es ventaja, no limitación.** España (45% del mercado hispano pago en Substack) más hispanos en EE.UU. (20%) más LATAM (la cola, pero creciente) cubren un mercado de varios cientos de miles de potenciales suscriptores pagos. No hace falta llegarles a todos.

Si alguna de estas tres se cae, el negocio se cae. Vale la pena tenerlas a la vista como hipótesis falsables.

---

## 3. Posicionamiento

### Categoría competitiva

No competir como "Substack de política latinoamericana" — esa categoría está poblada (Boz, Sin Filtro, Tendenci@s, Altopías, Latin America Daily Briefing) y compite en frescura de noticias, no en marco.

Competir como **plataforma de lectura estructural de Sudamérica con framework propio**. Esto es una categoría de uno, lo cual tiene dos efectos: nadie compite con vos, pero tampoco hay demanda explícitamente articulada — hay que construirla.

Referente conceptual más cercano: una cruza entre **Aeon/The New Atlantis** (formato ensayístico estructural) y **Latin America Risk Report** (foco regional especializado), en español.

### Audiencia primaria (3 segmentos, por orden de viabilidad)

**Segmento 1 — Analistas y comunicadores hispanohablantes especializados en LATAM (B2C2B).**
- Periodistas de redacciones internacionales con cobertura regional.
- Académicos de relaciones internacionales, ciencia política, sociología.
- Consultores y asesores que producen sus propios informes.
- Usan Mapa Inestable como insumo, marco o cita.
- Disposición a pagar: alta (USD 60–120/año), porque les ahorra trabajo y los hace mejores.
- Tamaño estimado: ~5.000–15.000 personas a las que se puede llegar orgánicamente.

**Segmento 2 — Lectores cultos no-especialistas hispanohablantes (B2C clásico).**
- Lectores de La Diaria, Anfibia, Letras Libres, Nueva Sociedad, El Salto.
- Interesados en filosofía política y crítica cultural.
- Disposición a pagar: media (USD 50–80/año), por curiosidad intelectual.
- Tamaño estimado: ~50.000–200.000 personas alcanzables vía SEO + recomendaciones cruzadas.

**Segmento 3 — Instituciones (B2B, oportunista).**
- Embajadas, organismos multilaterales con oficina LATAM, ONGs de derechos/democracia.
- Fondos con exposición LATAM, family offices, áreas de research de bancos regionales.
- Universidades con departamentos de área.
- Disposición a pagar: muy alta (USD 1.000–10.000/año por informes o accesos), pero ciclo de venta largo, requiere contacto directo.
- No es target del MVP de julio. Es upside de Q4 2026 en adelante.

### Propuesta de valor (en una frase)

> *"Mapa Inestable lee Sudamérica con un framework propio que no existe en ningún otro lado, te entrega análisis estructural con método trazable, y te ahorra el trabajo de filtrar lo coyuntural para encontrar lo importante."*

### Jobs-to-be-done

Lo que el lector está contratando a Mapa Inestable para hacer:
1. **Ahorrarme tiempo de lectura** — no quiero leer 200 noticias por semana, quiero las 5 que importan y por qué.
2. **Darme un marco para pensar la región** — no quiero datos sueltos, quiero estructura.
3. **Hacerme sonar mejor informado** (para los del segmento 1) — quiero citar cosas que mis colegas no leyeron.
4. **Defender mi atención de la coyuntura** — quiero un lugar que no me agite.

---

## 4. Análisis de modelos de monetización

### Modelo A — Substack pago + free tier

**Cómo funciona.** Mantener Substack como canal principal, abrir un tier pago (mensual + anual) con: archivo cerrado después de X tiempo, despachos completos solo para pagos, comentarios habilitados solo para pagos, una entrega adicional por semana (deep dive o country brief). Free tier mantiene 1 entrega semanal + un porcentaje del despacho.

**Encaje con stack actual.** Total. Ya hay Substack vivo, contenido producido y agentes que generan borradores. Nada nuevo que construir.

**Esfuerzo operativo solo.** Bajo. La operación es escribir + curar, que ya hacés. La parte de cobro la resuelve Substack (10% + Stripe).

**Time-to-revenue.** Inmediato. Se puede activar en julio sin pre-trabajo técnico.

**Ceiling.** Modesto. Comparables en español hispanohablante con audiencia profesional bien posicionada llegan a ~USD 30–80K/año (calculado: 500–1.500 suscriptores pagos × USD 60). Suficiente para validar tesis, lejos de reemplazar Brevity.

**Riesgo principal.** Que el techo orgánico de Substack en español LATAM sea menor de lo esperado y el revenue no justifique la dedicación. Mitigación: el costo marginal de probar es casi cero porque la operación es la misma que hoy.

### Modelo B — SaaS analítico (plataforma como producto)

**Cómo funciona.** La plataforma web se vuelve producto: acceso pago a mapa interactivo, agendas live por país, dashboard de capas analíticas, archivo navegable, alertas por eje. Posiblemente API.

**Encaje con stack actual.** Parcial. La plataforma está construida pero no monetizable: falta auth, billing, gating de features, gestión de usuarios, marketing site orientado a conversión. Es trabajo de varias semanas a tiempo completo, más sostenido.

**Esfuerzo operativo solo.** Alto. Cada feature nueva, cada bug, cada onboarding es tuyo. Soporte de pago = nueva categoría de trabajo.

**Time-to-revenue.** Lento. Aunque salga en julio, ARR significativo recién a los 6–12 meses si las cosas van bien.

**Ceiling.** Alto en teoría (USD 100K–500K+ ARR), bajo en práctica para un side project unipersonal. Para llegar al ceiling necesitás team y sales motion, ninguno de los cuales tenés disponible.

**Riesgo principal.** Que la plataforma se convierta en un segundo trabajo a tiempo completo y rompa el constraint de side project sin generar revenue proporcional. Esto es el clásico modo de fracaso de SaaS de fundador único: meses construyendo, ingresos magros, agotamiento.

**Recomendación.** No lanzarla como producto en julio. **Sí mantenerla pública y gratuita como anchor diferencial del Substack pago.** "Suscribite acá y tenés además acceso a la plataforma con mapa, agendas live, etc." — la plataforma vende el Substack, no se vende a sí misma.

### Modelo C — Consultoría / informes a medida

**Cómo funciona.** Vender análisis específicos a instituciones: informes país, briefings antes de elecciones, sesiones con equipos, etc. USD 1.500–8.000 por entregable.

**Encaje con stack actual.** Bueno en capacidad (sabés hacer el análisis), malo en flujo (no hay pipeline comercial, no hay marca con instituciones).

**Esfuerzo operativo solo.** Variable. Una entrega = mucho tiempo concentrado. La parte difícil no es entregar, es vender.

**Time-to-revenue.** Medio. 3–6 meses para primer cliente desde cero. Más rápido si llega inbound.

**Ceiling.** Alto unitariamente, bajo en escala (limitado por horas humanas). USD 30–100K/año con 1–2 clientes recurrentes.

**Riesgo principal.** Que consuma todas tus horas no-Brevity y no quede tiempo para producir el Substack que genera la marca que trae los clientes. Es un loop que se traba.

**Recomendación.** No empujar como modelo, dejar la puerta abierta. Si llega inbound (vía Substack), tomar. Si no llega, no perseguir hasta Q4.

---

## 5. Recomendación: modelo híbrido escalonado

```
JULIO 2026 (MVP)
├── Capa 1: Substack pago + free tier         ← motor de revenue
├── Capa 2: Plataforma pública gratis         ← motor de diferenciación
└── Capa 3: Consultoría disponible si llega   ← upside oportunista

Q4 2026 / 2027
├── Capa 1: Optimización pricing + audiencia
├── Capa 2: Empezar a evaluar gating selectivo de plataforma
└── Capa 3: Empuje activo a institucional si caps 1 y 2 lo justifican
```

**Por qué funciona como side project unipersonal.**
- Capa 1 es la única que requiere tiempo recurrente, y es exactamente el trabajo que ya hacés (escribir).
- Capa 2 ya está construida y los agentes la mantienen viva.
- Capa 3 es opcional y se activa solo con inbound.

**Por qué es defendible.**
- Nadie más combina Substack + plataforma + framework en español sobre LATAM. La capa 2 hace que el Substack no sea sustituible por otro Substack.

**Por qué es honesto con la ambición.**
- No promete reemplazar Brevity. Promete validar si hay negocio. Si la respuesta es sí, se replantea estructura en 12 meses.

---

## 6. Pricing inicial sugerido

Anclado en comparables (Boz USD 90/año, Tendenci@s tiered, Substack hispano mediana USD 16K/año):

| Tier | Precio | Qué incluye | Target |
|------|--------|-------------|--------|
| Free | USD 0 | 1 entrega semanal + despacho parcial + acceso a plataforma | Funnel + autoridad |
| Lector | USD 7/mes o USD 60/año | Todo + archivo completo + despacho íntegro + comentarios | Segmento 2 |
| Pro | USD 15/mes o USD 120/año | Lector + 1 deep dive mensual + country brief on demand | Segmento 1 |
| Equipos (5–10 usuarios) | USD 300/año | Pro + acceso compartido + 1 sesión Q&A trimestral | Segmento 3 entry |

**Rationale del USD 60/año individual:** abajo de Boz histórico para captar segmento 2 (no especialistas), arriba del piso de Substack porque hay plataforma incluida. Es el "precio honesto" para alguien que valora el proyecto pero no vive de la información política.

**Lo que NO se hace en el MVP:** tiers complicados, contenido behind paywall agresivo, pagos por contenido individual. La complejidad se evita.

---

## 7. Constraint: side project unipersonal

El plan funciona mientras estas condiciones se sostengan. Cuando alguna deje de cumplirse, hay que replantear.

- **Brevity sigue siendo el laburo principal.** Mapa Inestable no debe consumir más de 10–15 horas/semana sostenibles.
- **El sistema de agentes hace el trabajo pesado.** Si en algún momento la operación requiere intervención humana diaria intensa, hay un problema de diseño que arreglar antes de escalar.
- **No se contratan freelances editoriales antes de validar revenue.** Tentación clásica que destruye el unit economics temprano.
- **No se promete cadencia que no se pueda cumplir sin Brevity de por medio.** Cadencia segura para empezar: 1 entrega larga + 1 despacho semanal + 5 borradores diarios públicos.

---

## 8. Qué queda por decidir antes de ejecutar

Preguntas abiertas que necesitan resolución antes de fines de junio:

1. **¿Migrar de Substack a plataforma propia para el pago, o quedarse en Substack como capa de billing?** Substack tiene fricción mínima pero se queda con 10%. Plataforma propia con Stripe da más control, requiere construcción. **Recomendación: arrancar en Substack, migrar si y solo si revenue lo justifica.**
2. **¿Nombre comercial del producto pago?** ¿"Mapa Inestable Pro"? ¿"Premium"? ¿"Membresía"? El término "membresía" sugiere comunidad, "pro" sugiere uso profesional. Decisión menor pero importante.
3. **¿Llamado a sponsors / patrocinadores institucionales como capa 1.5?** Hay proyectos editoriales LATAM que se sostienen con apoyo de fundaciones (NED, Ford, Open Society). Es una capa entera no analizada acá. Vale la pena evaluar antes de julio.
4. **¿Identidad pública del autor / autores?** Por ahora el proyecto va sin firma personal visible. Para vender, especialmente B2B, eventualmente hace falta cara. ¿En el MVP de julio o después?
5. **¿Comunicación del lanzamiento?** Substack tiene mecánica de relaunch. ¿Se anuncia formalmente, se hace soft launch, se invita a una lista cerrada primero?

---

## 9. Fases hasta julio (alto nivel, no operativo)

> Esto NO es el roadmap. El roadmap operativo semanal va aparte una vez aprobado este documento.

| Fase | Ventana | Foco |
|------|---------|------|
| **F1 — Decisiones estratégicas** | 21–31 mayo | Cerrar las 5 preguntas de §8. Validar tesis con 3–5 personas de cada segmento. |
| **F2 — Posicionamiento público** | 1–14 junio | Reescribir página "Sobre", landing del Substack, identidad de tiers, materiales de marca de los planes. |
| **F3 — Producto cobrando** | 15–30 junio | Configurar tiers en Substack, definir qué es free vs pago, ajustar plataforma para mostrar mapa + agendas como "incluido en suscripción". |
| **F4 — Lanzamiento** | 1–15 julio | Anuncio formal, oferta de lanzamiento (descuento anual primeros 100), distribución activa, primeros 30 días de seguimiento de métricas. |

---

## 10. Métricas para evaluar en septiembre 2026

Para juzgar si el modelo está validado a 60 días del lanzamiento:

- **Conversión free → pago:** ≥ 2% del total de suscriptores activos. Si es < 1%, el problema es de propuesta de valor.
- **Suscriptores pagos a 60 días:** ≥ 100 (umbral mínimo para llamar tesis "no falsificada"); 250+ si fue bueno; 500+ si fue muy bueno.
- **Churn mensual:** ≤ 5%. Por encima de eso, el contenido no está cumpliendo la promesa.
- **Mix de segmentos:** ≥ 30% del revenue debería venir de segmento 1 (profesionales). Si todo es segmento 2, el ceiling es bajo.
- **Inbound institucional:** ≥ 2 conversaciones serias con instituciones. Indicador adelantado de capa 3.

Si en septiembre estos números no se acercan, hay que cuestionar la tesis, no la ejecución.

---

## Apertura

> Lanzar Mapa Inestable como negocio es coherente con el proyecto si se entiende que el negocio no es vender análisis — es **sostener la capacidad de producir un tipo de análisis que el mercado actual no produce solo**. El revenue es el medio, no el fin.

La pregunta abierta es si el mercado hispanohablante de LATAM ya está listo para sostener un proyecto así, o si llegamos cinco años antes. Solo hay una forma de averiguarlo: cobrar.

---

**Próximo documento a producir tras aprobar este:** `81-roadmap-operativo-junio-julio-2026.md` con el detalle semanal de tareas, dependencias y deliverables hasta el lanzamiento.

## Links internos

- [[CLAUDE]] — contexto general del proyecto
- [[70-Producto/arquitectura-editorial]] — topología del corpus que sostiene la propuesta
- [[10-Ejes/Ejes - MOC]] — framework conceptual que es el diferenciador editorial
- [[70-Producto/specs/29-calendario-agentes-automaticos]] — sistema operativo que hace viable el side project
