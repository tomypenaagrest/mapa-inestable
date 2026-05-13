# Mapa Inestable — guía para una demo

Una versión corta para mostrarle el proyecto a alguien que no lo conoce. Sirve como guion oral y como texto autocontenido.

---

## Qué es

Mapa Inestable es un proyecto de análisis político sobre Sudamérica. Pero no es un blog de coyuntura: no responde a la noticia del día ni opina sobre lo que ya está siendo discutido en redes. Mira para abajo. Trata de identificar qué cosas estructurales están cambiando en la región — debajo de los titulares — y cómo se conectan entre sí.

La hipótesis es esta: las estructuras que organizaban la vida colectiva — partidos, medios, iglesias, sindicatos, vecindarios, escuela pública — están perdiendo peso. Lo que las reemplaza (algoritmos, redes sociales, plataformas) no opera con la misma lógica. De ahí salen muchas cosas que sentimos como "desorden" sin saber bien cómo nombrarlas: cuesta más representarse políticamente, cuesta más distinguir lo importante de lo viral, cuesta más sostener proyectos colectivos en el tiempo. El proyecto rastrea esa transición a través de seis "ejes" o procesos estructurales, y los aplica país por país.

El nombre viene de eso: el mapa que estamos tratando de leer es **inestable**. No tenemos coordenadas firmes para entender el momento. Pero podemos cartografiarlo igual, con cuidado, semana a semana.

A escala práctica: cubre 10 países (Argentina, Brasil, Chile, Colombia, Bolivia, Perú, Uruguay, Paraguay, Ecuador, Venezuela), publica un análisis o dos por semana, y al cabo del año son entre 60 y 80 piezas que arman un corpus navegable.

## Cómo trabaja

Cada análisis arranca con un **disparador** concreto — una noticia, una imagen, una estadística — y lo lee en cuatro pasos:

1. **Disparador** — qué pasó. La escena puntual.
2. **Desplazamiento** — del evento al proceso de fondo que ese evento revela. Acá se aleja la cámara.
3. **Conceptualización** — cómo se entiende ese proceso a través de los ejes del marco. La interpretación.
4. **Apertura** — una pregunta que queda abierta. El análisis no cierra: deja un eco. Si funciona bien, esa pregunta queda dando vueltas.

Es la diferencia central con el periodismo de opinión clásico: no se busca una conclusión cerrada, se busca una formulación más precisa del problema.

---

## Recorrido sugerido (10-15 minutos)

### 1. Home — la portada

**Qué van a ver:** un mapa de Sudamérica con el sur arriba. No es un capricho gráfico: es una declaración de perspectiva. La imagen viene de Joaquín Torres García, *América Invertida* (1943): "nuestro norte es el sur". Abajo del mapa, el contenido editorial reciente y los ejes que están activos esta semana.

**Para destacar:**
- El mapa invertido como puerta de entrada al sitio.
- El bloque "Esta semana" con el eje activo — funciona como pulso del proyecto.
- Click en cualquier país lleva a su ficha.

### 2. Un despacho semanal — entrar a `/despachos`

**Qué van a ver:** la pieza que sale cada semana, integrando los análisis publicados. Es lo más parecido a un "newsletter" tradicional, pero se publica primero en el sitio y desde ahí se manda por mail.

**Para destacar:**
- Formato corto, narrativo, editorial. No es un boletín de noticias.
- Cómo conecta varias piezas individuales en una lectura común — los análisis se citan entre sí.
- Cada despacho tiene un título y un hilo conductor; no es un compilado.

### 3. Un análisis individual — entrar desde el despacho o desde el home

**Qué van a ver:** el corazón del proyecto. Una pieza de 800-1.200 palabras que toma una escena concreta y la abre. Arriba del título, una **portada ilustrada** específica de esa pieza.

**Para destacar:**
- La estructura en 4 pasos del método (Disparador, Desplazamiento, Conceptualización, Apertura). Funciona pasarlos visualmente para que se entienda la secuencia.
- Que el último paso (Apertura) es una pregunta sin respuesta. Es deliberado: el análisis no cierra el problema, lo formula mejor.
- Las citas a la fuente original del disparador — cada análisis es trazable, se puede chequear.
- La portada: cada pieza tiene una ilustración propia, en estilo de **viñeta política caricaturesca** (referencia explícita a *Revista Humor* argentina, Taller de Gráfica Popular mexicano, Antonio Berni). No es decoración: es una segunda lectura del análisis. La paleta cerrada (terracota, tinta verde-negra, papel crema, dorado de marca) y el granulado de papel impreso son la firma visual del sistema. Las portadas se generan con Gemini a partir de un prompt específico que el agente diario produce automáticamente — el sistema completo está documentado en la Spec 37.

### 4. Una página de eje — entrar a `/ejes`

**Qué van a ver:** la puerta al marco conceptual. Cada eje describe un proceso estructural:

- **Deculturación** — la cultura deja de formar y pasa a ser un menú de cosas para elegir.
- **Erosión de mediaciones** — las instituciones que mediaban entre la persona y el Estado pierden peso; el algoritmo las reemplaza con otra lógica.
- **Desrepresentación** — votamos a alguien pero la representación se vacía.
- **Estetización** — los símbolos políticos circulan sin historia, casi como remeras.
- **Desorientación epistemológica** — es cada vez más difícil saber qué es real, qué es relevante, qué importa.
- **Atención** — lo que mira la gente es lo que existe; y la atención está cada vez más capturada por pocos jugadores.

**Para destacar:**
- Que los ejes no son etiquetas: son hipótesis sobre qué se está transformando.
- Mostrar uno completo (Desorientación funciona bien para empezar — todos lo intuimos).
- Al pie de la página: la lista de análisis donde ese eje se activó. Permite ver patrones cross-país.

### 5. Una ficha de país — entrar a `/pais/argentina` (o el que prefieran)

**Qué van a ver:** todo lo que el proyecto acumula sobre un país — diagnóstico estructural, pregunta central, ejes crónicos, análisis publicados, fuentes que se monitorean. La idea es que cada país tenga su "panel" propio.

**Para destacar:**
- La pregunta central del país: una sola oración que el proyecto trata de responder en sus piezas sobre ese país.
- Los ejes crónicos: qué procesos están más activos ahí.
- Cómo se acumula lectura: cada análisis nuevo enriquece esa ficha.

---

## Si quieren seguir leyendo después

- **Substack** — `mapainestable.substack.com` — el despacho semanal llega por mail.
- **`/método`** — explica la metodología en detalle: cómo se eligen los disparadores, cómo se construyeron los ejes, qué autores los inspiran (Han, Roy, Han, Huntington, entre otros).
- **`/acerca`** — el por qué del proyecto, quién lo escribe, cómo se trabaja.

---

## Cómo funciona el "back-office" (si pregunta alguien más técnico)

El proyecto tiene una capa editorial automática que conviene mencionar si el interlocutor pregunta cómo se mantiene a ritmo semanal:

- **Vault Obsidian** — toda la base de conocimientos vive en archivos markdown organizados por carpeta (`10-Ejes/`, `15-Países/`, `50-Publicaciones/`, `60-Borradores/`, `90-Portadas/`).
- **Plugin de Cowork** — un set de skills (`analisis-semanal`, `despacho-semanal`) que estructuran el método de 4 pasos. Se invocan a demanda desde la conversación con Claude.
- **Agente diario** — corre lun-vie por la mañana, rota entre los 10 países, deposita un borrador completo de análisis en `60-Borradores/diario/` con su prompt de portada incluido en el frontmatter. Nunca publica solo: todo pasa por un paso manual de aprobación (`promover-borrador-a-publicacion.md`).
- **Portadas** — cada pieza tiene un campo `cover_image` declarado en el frontmatter. El path apunta a `90-Portadas/<categoria>/<slug>.png`. El sitio sincroniza esa carpeta a `public/covers/` en cada build. Si la imagen no existe todavía (el agente la pre-declaró pero no se generó), se muestra un placeholder con el color del eje y el nombre del país.
- **Front** — Next.js, lee server-side todo el vault a través de `lib/content.ts`, `lib/agendas.ts`, etc. Sin base de datos: el archivo markdown es la fuente de verdad.

El detalle vive en `70-Producto/arquitectura-editorial.md` (mapa de tipos × pantallas × fuentes), en `70-Producto/specs/29-…` (calendario de agentes automáticos) y `70-Producto/specs/37-…` (sistema de portadas).

---

## Una nota personal

Si después de esto algo no se entendió, lo más útil que pueden hacer es decirme "no entendí esto puntual" — me sirve mucho más que un "lindo el sitio". El proyecto está vivo, va por su segundo año, y todavía estoy ajustando muchas cosas. Si algo les genera la sensación de "esto debería estar acá y no está", también vale escucharlo.

Gracias por darle un rato.
