---
tipo: documento-referencia
autor: Tomás (con Claude · Cowork)
fecha: 2026-05-26
relaciona_con: [EPIC-04-mobile-first, Spec 02, Spec 22, design-system/design-system.md]
naturaleza: referencia permanente — base conceptual mientras se diseña EPIC-04
estado: r1
---

# Onboarding mobile express

Documento de calibración conceptual para diseñar las specs de EPIC-04 con criterio propio. No es teoría general — son los conceptos puntuales que vas a necesitar tener internalizados mientras tomamos decisiones de diseño sobre las 4 vistas críticas (mapa, home, país, lectura). Pensado para alguien que sabe diseño y producto pero no tuvo que diseñar mobile sostenido todavía.

Re-leíble en 20-30 min. Volvé acá cuando una decisión te suene resbalosa.

---

## 1. Anatomía del viewport mobile

**Viewport** es el área visible del navegador en el teléfono. No es la pantalla del teléfono — es la pantalla menos la barra de URL, la barra de estado, el teclado si está abierto. Lo que vos diseñás vive en el viewport, no en el dispositivo.

Anchos de viewport que importan para LATAM (en CSS pixels, no físicos):

| Dispositivo | Ancho CSS | Cuota aprox de mercado LATAM |
|---|---|---|
| iPhone SE / iPhone 8 | 375 | ~10% (legacy iPhone) |
| iPhone 13 / 14 / 15 | 390 | ~20% (iPhone reciente) |
| iPhone Pro Max | 428 | ~5% |
| Samsung A / Pixel base | 360 | ~30% (Android mid-range) |
| Pixel 6/7, Samsung S22 | 412 | ~15% (Android premium) |
| Resto (tablets, foldables, viejos) | — | ~20% |

**Conclusión práctica.** Diseñar contra **360-414px** cubre el 80%+ del mercado. La regla operativa: si funciona bien en **360px** (el más angosto), funciona en todos. Si rompe en 360 pero anda en 390, te perdés a media base Android LATAM.

**El "fold" mobile** es el área que el usuario ve sin scrollear. En 390×844 con barra de URL visible, son ~390×640 efectivos. Lo crítico — primer mensaje del proyecto, mapa, CTA — tiene que entrar acá. Todo lo demás se va a leer si el usuario decide scrollear, y los datos dicen que muchos no scrollean.

**Densidad de píxeles (DPR).** Un iPhone Pro Max físicamente tiene ~1290px de ancho, pero el CSS los trata como 428. La diferencia es **DPR (device pixel ratio)** — 3x en iPhones, 2x-3x en Androids. Para CSS no cambia nada; sí cambia para imágenes: una imagen pensada para 390px de viewport se ve borrosa en pantalla retina si no se sirve a 2x o 3x. De esto se ocupa Next.js Image con `sizes` y `srcset` automático, pero es bueno saberlo cuando una portada se vea pixelada.

---

## 2. Tap targets y zona de pulgar

**Tap target** es el área tocable de un elemento. Las guías oficiales:

- **iOS Human Interface Guidelines: 44×44 pt mínimo.**
- **Material Design (Android): 48×48 dp mínimo.**
- **WCAG accessibility: 44×44 CSS px mínimo.**

Operativamente: **toda zona clickeable en mobile tiene que medir al menos 44×44px de área tocable**. Importante: el área tocable no es el ícono visible — un link de texto de 16px de alto puede ser visualmente chico pero con padding tener 44×44 de área tocable. Eso está bien.

**Tap targets adyacentes** tienen que tener separación mínima de 8px entre ellos para que el dedo no se confunda. Dos links pegados en línea son problema clásico.

**Zona de pulgar.** El teléfono se agarra con una mano (mayoría) o dos (lectura prolongada). Con una mano, el pulgar alcanza cómodo el **tercio inferior** del viewport y la franja central. **El tercio superior es zona difícil** — requiere recolocar la mano. Implicancias:

- CTAs primarios mejor abajo o en franja media-inferior.
- Header con muchos controles en la parte superior funciona mal — el usuario lee pero no toca.
- En el mapa Torres García, los países "de arriba" (que con la inversión son **el norte geográfico** — Venezuela, Colombia) caen en zona difícil. Argentina, Chile, Uruguay quedan en zona pulgar. Es buena noticia para el dispositivo de hover/tap inicial: el sur de Sudamérica (que en el mapa invertido va arriba) está más a mano que parece.

(Sobre esto vamos a tener decisiones específicas en Spec 49.)

---

## 3. De hover a tap (especial mapa)

El cambio conceptual clave: **mobile no tiene hover**. Lo que en desktop es "paso el mouse y muestro tooltip" en mobile tiene que decidirse entre tres cosas:

1. **Tap simple → acción directa.** El elemento ejecuta su acción primaria. Sin tooltip, sin preview, sin estado intermedio.
2. **Tap simple → preview / estado expandido, segundo tap → acción.** Patrón "tap-to-reveal". Útil cuando hay info contextual que pre-decide la navegación.
3. **Long-press → menú contextual.** Patrón nativo. Menos discoverable, mejor para acciones secundarias.

**Para el mapa Torres García específicamente**, Spec 22 §16 ya tomó la decisión base: tap simple = navegar a la ficha del país. Lo que falta en Spec 49 es decidir si hay **tap-to-preview** intermedio (ver título del despacho de la semana en un mini-tooltip antes de navegar) o si va directo. Ambos son válidos; el tradeoff es discovery vs velocidad.

**Estados visuales que se pierden en mobile.** Cualquier `:hover` del CSS desktop deja de existir. Si una interacción dependía de hover (resaltar conexiones entre países, animación de cita al pasar el mouse, etc), en mobile hay que **redesignar la interacción**, no "esconderla". Esto es importante para el frame strip de ejes que hoy probablemente usa hover en desktop.

**Estados que sí existen en mobile.** `:active` (mientras el dedo está apoyado), `:focus` (después del tap, sobre el último elemento tocado). Útiles para feedback inmediato.

---

## 4. Tipografía mobile editorial

Diseñar tipografía mobile no es "achicar la del desktop". Es un sistema propio. Las variables que importan:

**Tamaño base del cuerpo (`body`).**

| Tamaño | Sensación | Cuándo |
|---|---|---|
| 14px | Apretado, "app-y" | Mala idea para lectura editorial — usuario zoomea o se va |
| 15-16px | Estándar editorial cómodo | **Recomendado** para Mapa Inestable |
| 17-18px | Generoso, "premium reading" | Substack, Medium recientes — buena dirección |
| 19-20px+ | Editorial extra grande | Aeon, NYT mobile longform — opción válida pero exige más scroll |

Para un sitio de análisis político donde la lectura es el producto, **17px base es un buen punto de partida** y testeamos hacia 18 si se siente cómodo.

**Line-height (interlineado).** En desktop solés usar 1.4-1.5. **En mobile, 1.55-1.7 funciona mejor** porque la línea es más corta y el ojo necesita más respiro vertical para encontrar la siguiente. Para cuerpo, 1.6 es un punto seguro.

**Longitud de línea (medida).** La regla editorial clásica es **45-75 caracteres por línea, óptimo 66**. En mobile a 390px con padding lateral de 24px (sobran 342px) y body de 17px, te quedan ~38-42 caracteres por línea. **Está debajo del mínimo cómodo**. No es un error tuyo — es la realidad mobile. Opciones:

- Aceptar ~40 caracteres como nueva norma mobile y compensar con line-height generoso.
- Bajar padding lateral a 16-20px → ganás 3-5 caracteres.
- Subir body a 16px → ganás ~2-3 caracteres pero perdés legibilidad ligera.

Spec 50 va a tener que decidir esto explícitamente. La decisión tiene que ser **declarada**, no implícita.

**Jerarquía (h1, h2, h3).** En desktop solés tener un h1 muy grande (~48-64px) por el espacio disponible. **En mobile, ese tamaño no entra** — un h1 de 64px ocupa media pantalla horizontal y rompe el ritmo. Escala típica mobile editorial:

| Nivel | Tamaño mobile típico | Equivalente desktop |
|---|---|---|
| h1 (título de pieza) | 28-34px | 48-64px |
| h2 (sección dentro) | 22-26px | 32-40px |
| h3 (subsección) | 18-20px | 22-28px |
| body | 17px | 18-19px |
| caption / meta | 13-14px | 14-15px |

**Fluida vs por breakpoints.** Hay dos enfoques:

- **Tipografía fluida con `clamp()`**: `font-size: clamp(28px, 6vw, 48px)`. El navegador interpola entre min y max según el ancho del viewport. Pro: una sola declaración cubre mobile, tablet, desktop. Contra: pierde control fino — un h1 puede quedar en un tamaño intermedio raro en algún ancho.
- **Tipografía por breakpoints**: declarás `font-size: 28px` en mobile, `font-size: 36px` en tablet, `font-size: 48px` en desktop. Pro: control total. Contra: más código, más mantenimiento.

Para Mapa Inestable con identidad "Grabado" donde **Alfa Slab One** es muy expresiva en titulares y la mala calibración rompe el ritmo visual, **breakpoints da más control** y es el camino conservador para el lanzamiento. Fluida queda como refinamiento post-lanzamiento si hace falta.

---

## 5. Breakpoints en la práctica

Los breakpoints estándar de Tailwind / la industria son:

- `sm: 640px` — phone landscape / small tablet portrait
- `md: 768px` — tablet portrait
- `lg: 1024px` — tablet landscape / laptop chico
- `xl: 1280px` — laptop estándar
- `2xl: 1536px` — desktop grande

**No tenés que usarlos todos.** Para un sitio editorial, el mínimo viable es:

- **default (0-639px)**: mobile portrait. Es el diseño base mobile-first.
- **md (768px+)**: salto a layout más amplio. Acá típicamente aparece la sidebar lateral en lugar de apilada.
- **lg (1024px+)**: layout desktop completo. Multi-columna, mapa más grande, sidebars + contenido + nav.

**Mobile-first significa: escribís el CSS base pensado para mobile, y agregás `@media (min-width: 768px) { … }` para "promover" a desktop**, no al revés. Operativamente, en Tailwind, `class="text-base md:text-lg"` lee como "base es 16px, en md+ pasa a 18px". Mobile-first es el primer término.

**El problema del breakpoint intermedio.** Entre 640 y 768 (phone landscape, tablet portrait chica) los layouts típicamente se rompen porque están "entre dos diseños". Es la zona de la AE8 del epic ("cero capas de UI rotas en breakpoints intermedios"). Solución práctica: probar con devtools en 640, 720, 768 mientras se diseña, no solo en los breakpoints "limpios".

---

## 6. Performance LATAM 3G/4G

**Las métricas que importan para el lanzamiento** (Core Web Vitals):

| Métrica | Qué mide | Target sano | Target excelente |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | Cuánto tarda en pintarse el elemento más grande arriba del fold (típicamente la imagen hero o el título grande) | < 2.5s | < 1.8s |
| **FCP** (First Contentful Paint) | Cuánto tarda en aparecer cualquier cosa en pantalla (ya no está en blanco) | < 1.8s | < 1.0s |
| **CLS** (Cumulative Layout Shift) | Cuánto se "salta" el layout mientras carga (imagen que llega tarde y empuja el texto) | < 0.1 | < 0.05 |
| **INP** (Interaction to Next Paint) | Qué tan rápido responde el sitio a una interacción del usuario (reemplazo de FID) | < 200ms | < 100ms |

Para LATAM con conexión inestable, **LCP < 2.5s en 4G simulado es el mínimo defendible**. El epic deja abierta la pregunta de si subir el target a 3G — esto se cierra en Spec 54.

**Bundle size.** Es el peso del JavaScript + CSS + fuentes que tiene que descargar el navegador antes de renderizar. Para una home editorial:

| Bundle | Sensación de velocidad |
|---|---|
| < 100KB gzipped | Excelente, el sitio se siente "snappy" en 4G LATAM |
| 100-200KB | Bien, el sitio carga rápido pero no instantáneo |
| 200-300KB | Aceptable para vistas con interactividad alta (mapa) |
| 300-500KB | Empezás a notar lag de FCP en 4G inestable |
| > 500KB | Problema en LATAM, abandono de página alto |

El AE7 del epic pide **≤ 250KB gzipped en bundle inicial del home**. Es razonable para un sitio con mapa SVG complejo, pero hay que cuidarlo activamente: cada librería que sumás suma. Spec 54 va a definir presupuestos por vista.

**Estrategia de imágenes para LATAM:**

- **Formato moderno**: WebP o AVIF, con fallback a JPEG. Next.js Image hace esto automático.
- **Responsive sizes**: nunca servir una imagen de 1920px a un mobile de 390px. Next.js `<Image sizes="(max-width: 768px) 100vw, 50vw">` resuelve.
- **Lazy load below-the-fold**: las imágenes que no están arriba del fold no se cargan hasta scroll. Next.js Image lo hace por defecto excepto si le ponés `priority`.
- **Hero image (LCP element)**: `priority={true}` y `fetchpriority="high"`. Sin esto el LCP se duplica.
- **Portadas Spec 37**: ya están en PNG. Considerar conversión a WebP en el pipeline de Gemini para ahorrar 30-50% de peso.

**Fuentes web.** Cada `@font-face` es una descarga adicional. Mapa Inestable usa Alfa Slab One (titulares) + alguna sans/serif para cuerpo. Reglas operativas:

- Cargar **solo los weights que usás** (no traer Regular + Bold + Italic + Light si solo usás 2).
- `font-display: swap` para que el texto se vea con fuente de sistema mientras carga la custom — evita "flash de texto invisible" (FOIT).
- Subset de caracteres latinos si la fuente lo permite (Google Fonts da esto automático).

---

## 7. Patrones de referencia editorial mobile

Lista corta de sitios para mirar mientras diseñamos. No son benchmarks aspiracionales — son **catálogo de soluciones** a problemas concretos.

| Sitio | Qué mirar |
|---|---|
| **Substack mobile** (read view de cualquier post) | Reading experience canónica para análisis largo. Body grande (~18px), line-height generoso (~1.6), padding lateral 16px, h1 contenido (~30px). Es el techo de lo que muchos lectores esperan. |
| **Medium mobile** | Sistema tipográfico maduro, jerarquía de h1/h2/h3 que escala, blockquotes con sangría y barra lateral. Tiene cosas que no queremos copiar (claps, follow) pero la tipografía pura es referencia. |
| **The Atlantic mobile** | Cómo manejan portadas grandes en mobile (hero a sangre + título superpuesto). Decisión Abierta #4 del epic la tienen resuelta así — vale verlo antes de decidir. |
| **Aeon mobile** | Reading experience editorial premium. Body grande, line-height largo, ritmo vertical de h2/h3 cuidado. Aspiracional para Spec 50. |
| **NYT The Daily mobile** | Cómo manejan navegación principal sin hamburger (tabs horizontales en la home). Spec 53 puede inspirarse acá. |
| **Are.na mobile** | Cómo presentan un mapa de relaciones complejo en pantalla chica. No es Torres García pero el patrón de "muchos nodos en poco espacio" es traspolable. |
| **El Diplomático Suplemento mobile** | Referencia LATAM-específica, español, prosa larga. Sirve para calibrar densidad sin caer en Substack genérico. |

Vale abrir cada uno desde tu teléfono mientras diseñamos las specs — no desde devtools, desde el teléfono real. Lo que ves en el dispositivo difiere de lo que ves en chrome mobile emulado.

---

## 8. Las 4 vistas críticas en clave mobile

Mini-brief por vista para tener el problema framed antes de cada sesión de diseño.

### Home (`/`)

**Problema mobile.** El desktop apila mapa + carrusel + heatmap + despacho + más. En mobile arriba del fold solo entra **una** de esas cosas. ¿Cuál? Decisión jerárquica fuerte: el mapa es identidad pura pero ocupa caro espacio; el carrusel es contenido fresco; el despacho es producto vendible.

**Lo que vamos a tener que decidir en Spec 51.**

- ¿Mapa hero arriba del fold sí o no?
- Si sí, ¿qué tamaño? Cuadrado 1:1? Rectangular?
- Si no, ¿qué es lo primero? ¿Despacho de la semana? ¿Frase manifiesto del proyecto?
- ¿Cuál es el orden vertical de las secciones cuando se scrolea?

### Mapa Torres García (componente)

**Problema mobile.** El SVG D3 actual funciona en mobile a nivel de render, pero los gestos no están implementados. Sin pinch-zoom, un usuario que quiera ver Uruguay tiene que conformarse con el zoom default. Sin pan, no puede mover el mapa para explorar. Sin tap-target generoso, los países chicos (Uruguay, Ecuador) son imposibles de tocar con el pulgar.

**Lo que vamos a tener que decidir en Spec 49.**

- ¿Pinch-zoom con límites mínimo/máximo? (Sí, propuesta: 1x mínimo, 3x máximo.)
- ¿Pan permitido cuando hay zoom activo?
- ¿Tap target ampliado virtualmente para países chicos? (Hit area > visual area.)
- ¿Estado de selección persistente o reset al scrollear?
- ¿Cómo se sale del estado zoomeado? (Botón "reset", double-tap, gesto natural?)
- ¿Qué pasa con los labels de nombres de país? Spec 22 §16 dice ocultos en mobile — ¿confirmamos o agregamos chip de nombre flotante en tap?

### Página de país (`/pais/[slug]`)

**Problema mobile.** Spec 02 §4 apila columnas en mobile. Funcionará a nivel "no se rompe" pero no a nivel "se siente diseñado para mobile". Una sidebar de ejes que en desktop es vertical lateral, apilada arriba del contenido principal en mobile, ocupa espacio sin claridad. Lo mismo el frame strip de ejes.

**Lo que vamos a tener que decidir en Spec 52.**

- ¿Qué se ve arriba del fold? ¿Nombre del país + cita corta? ¿Mapa del país? ¿Despacho de la semana?
- ¿Dónde van los 6 ejes? Apilados arriba, abajo, drawer expandible, tabs horizontales?
- ¿La pregunta central del país (los 6 ejes la tienen) es elemento separado o se integra con la cita?
- ¿Cómo se accede a los análisis pasados del país? Tabs? Lista? Scroll infinito?

### Lectura de análisis / ensayo

**Problema mobile.** Es la vista donde más tiempo va a pasar el lector. Spec 02 §6 toca solo el título — el resto "funciona bien sin cambios" según la spec, pero "funciona" ≠ "cómodo". Sin sistema tipográfico calibrado, una lectura de 8 minutos se vuelve fatiga visual a los 4.

**Lo que vamos a tener que decidir en Spec 50.**

- Tamaño base del cuerpo (15/16/17/18).
- Line-height de cuerpo (1.55 / 1.6 / 1.65 / 1.7).
- Padding lateral (16 / 20 / 24).
- Sistema de h1/h2/h3 calibrado a mobile.
- Comportamiento de blockquotes (sangría + borde, fondo distinto, tipografía itálica).
- Comportamiento de citas inline (linkificadas, en estilo distinto).
- Imágenes dentro del flujo (sangre? padded? con caption?).
- Portada del análisis (Decisión Abierta #4 del epic).
- Scroll progress indicator sí o no.

---

## 9. Vocabulario corto (glosario operativo)

| Término | Qué es |
|---|---|
| **Viewport** | Área visible del navegador en el dispositivo |
| **Fold (mobile)** | Lo que se ve sin scrollear |
| **Tap target** | Área tocable de un elemento — mínimo 44×44 |
| **Mobile-first** | Diseñar y escribir CSS primero para mobile, después promover a desktop con media queries |
| **Breakpoint** | Ancho de viewport donde el layout cambia (típicamente 640, 768, 1024) |
| **LCP** | Largest Contentful Paint — métrica de velocidad percibida |
| **FCP** | First Contentful Paint — cuándo aparece algo en pantalla |
| **CLS** | Cumulative Layout Shift — cuánto se mueve el layout mientras carga |
| **INP** | Interaction to Next Paint — qué tan rápido responde a interacción |
| **Bundle** | Peso total de JS/CSS que descarga el navegador |
| **DPR** | Device Pixel Ratio — densidad de píxeles físicos vs CSS |
| **PWA** | Progressive Web App — sitio web con capacidades de app nativa (install, push, offline). Diferida a EPIC-05. |
| **Pinch-zoom** | Gesto de dos dedos para zoomear |
| **Pan** | Mover el contenido con un dedo arrastrando |
| **Long-press** | Mantener apretado, equivalente mobile del click-derecho |
| **`clamp()`** | Función CSS para tipografía fluida: `clamp(min, ideal, max)` |
| **Subsetting** | Cargar solo los caracteres de una fuente que vas a usar, para bajar peso |

---

## 10. Cómo usar este documento

- **Antes de cada sesión de spec**, releé la sección 8 de la vista que vamos a trabajar — son las preguntas concretas que vamos a contestar.
- **Cuando una decisión te suene resbalosa**, abrí la sección correspondiente. Si la respuesta no está, lo discutimos en la sesión y actualizamos el doc.
- **Después de cerrar una spec**, si descubrimos un patrón nuevo que no estaba en este doc, lo agregamos. Este es un documento vivo durante la épica.
- **Después del lanzamiento**, se convierte en archivo de referencia histórico — el sistema real de mobile va a vivir en las specs mergeadas, no acá.

---

## Histórico

| Fecha | Cambio | Razón |
|---|---|---|
| 2026-05-26 | Creación del documento | Tomás arranca EPIC-04 sin experiencia previa en mobile dev. Necesita base conceptual calibrada al proyecto para tomar decisiones de diseño con criterio propio en las 6 specs que vienen |
