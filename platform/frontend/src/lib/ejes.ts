export interface Eje {
  num: number;
  slug: string;
  axisKey: string;
  name: string;
  definicion_corta: string;
  que_describe: string;
  autores: { name: string; slug: string }[];
}

export interface MockEjeAnalysis {
  slug: string;
  countrySlug: string;
  country: string;
  title: string;
  lede: string;
  date: string;
  year: number;
  isPrimary?: boolean;
}

export const EJES: Eje[] = [
  {
    num: 1,
    slug: "deculturacion",
    axisKey: "deculturacion",
    name: "Deculturación",
    definicion_corta: "La cultura deja de ser una estructura normativa heredada y pasa a funcionar como repertorio simbólico.",
    autores: [
      { name: "Olivier Roy", slug: "olivier-roy" },
      { name: "Samuel Huntington", slug: "samuel-huntington" },
    ],
    que_describe: `La cultura deja de funcionar como sistema de transmisión —de normas, rituales, narrativas colectivas— y se convierte en repertorio simbólico disponible. No desaparece: se vacía de contenido organizativo. A diferencia de las grandes transformaciones culturales históricas —el cristianismo reemplazando al paganismo, la modernidad desplazando a la tradición—, acá no hay sustitución. Hay desfondamiento.

Las formas siguen presentes. La religión, la patria, la lengua, las tradiciones locales continúan siendo reconocibles. Pero perdieron su capacidad de ordenar la experiencia colectiva. Es un mundo de símbolos flotantes: religión sin comunidad, nación sin proyecto, lengua sin literatura común.

Un segundo fenómeno agrava este proceso: la ruptura entre cultura y valores. Los valores contemporáneos —derechos humanos, igualdad de género, libertad individual— ya no se enmarcan en culturas particulares. Se proclaman como universales, independientes de cualquier tradición. Esto produce una tensión inédita: ya no es un conflicto entre culturas, sino entre una cultura que exige ser reconocida y valores que exigen ser obedecidos.

El resultado es la individualización de la identidad. Sin marcos heredados que organicen la pertenencia, cada persona construye su identidad como proyecto propio: coherente, expresivo, políticamente aceptable. Esto abre espacio para la libertad, pero también para la ansiedad. Y genera una demanda intensa de marcos normativos externos —de ahí el auge de identidades radicalizadas, sean religiosas, políticas o de estilo de vida.

La deculturación no es un juicio moral sobre el presente ni una nostalgia del pasado. Es un diagnóstico sobre el tipo de pérdida que ocurre cuando las estructuras culturales dejan de mediar —y sobre las consecuencias de ese vaciamiento para la vida colectiva.`,
  },
  {
    num: 2,
    slug: "erosion-de-mediaciones",
    axisKey: "mediaciones",
    name: "Erosión de mediaciones",
    definicion_corta: "Las instituciones que organizaban la experiencia colectiva pierden peso o son reemplazadas por mediaciones opacas.",
    autores: [
      { name: "Byung-Chul Han", slug: "byung-chul-han" },
      { name: "Yuval Noah Harari", slug: "yuval-noah-harari" },
    ],
    que_describe: `Toda experiencia colectiva está mediada. La pregunta nunca fue si hay mediación, sino qué media. Las mediaciones tradicionales —partidos políticos, sindicatos, iglesias, prensa masiva, comunidad territorial— organizaban la experiencia compartida durante el siglo XX. Eran visibles, discutibles, institucionalizadas. Podían criticarse porque se dejaban ver.

El proceso en curso no es la desaparición de esas mediaciones. Es su debilitamiento simultáneo y su reemplazo por mediaciones nuevas: plataformas digitales, influencers, algoritmos, canales de información paralelos. El cambio decisivo no es cuantitativo —más mediaciones— sino cualitativo: las nuevas mediaciones son opacas.

Antes podíamos discutir los sesgos de un diario o de un partido. Hoy las arquitecturas algorítmicas que filtran lo que vemos están diseñadas para optimizar engagement, no para informar mejor ni articular mayorías. Y no las vemos del todo. No están orientadas a la deliberación democrática. Están orientadas a maximizar el tiempo en pantalla. Es un modelo de negocio.

Una de las consecuencias más visibles es la fragmentación interpretativa. Un mismo hecho puede atravesar filtros distintos y producir lecturas incompatibles: triunfo institucional, maniobra política, distracción mediática, teoría conspirativa. No porque la realidad cambie, sino porque el filtro común se diluye. Compartimos el acontecimiento pero no el marco para interpretarlo.

Otra consecuencia es el reemplazo de comunidades territoriales por microcomunidades virtuales. Las grandes mediaciones —nación, clase, religión vivida— pierden peso frente a grupos transnacionales organizados en torno a intereses, estéticas o ideologías específicas.`,
  },
  {
    num: 3,
    slug: "desrepresentacion",
    axisKey: "desrepresentacion",
    name: "Desrepresentación",
    definicion_corta: "Las instituciones políticas siguen existiendo, pero pierden capacidad de generar identificación y participación sostenida.",
    autores: [
      { name: "Olivier Roy", slug: "olivier-roy" },
    ],
    que_describe: `La desrepresentación no es ausencia de representación: es pérdida de densidad simbólica. Las elecciones se celebran, los gobiernos gobiernan, los partidos siguen presentes. Pero la ciudadanía participa menos, confía menos y se siente menos interpelada por el sistema político. Las formas institucionales sobreviven; el contenido identificatorio se diluye.

La paradoja contemporánea es la siguiente: nunca antes hubo tanta expresión política —redes sociales, encuestas permanentes, protestas, reacciones en tiempo real— y nunca antes la implicación real fue tan baja. Hiperexpresión con baja participación sostenida.

Este proceso tiene dimensiones concretas. La participación electoral cae en distritos que solían ser políticamente activos. Los partidos históricos pierden rápidamente los capitales electorales que habían tardado décadas en construir. Emerge una volatilidad nueva: candidatos que concentran todo el apoyo en pocas semanas y lo pierden casi tan rápido. Los outsiders —figuras sin historia institucional— aprovechan el hartazgo acumulado, no la adhesión a sus ideas.

Lo que subyace no es solo desconfianza en los políticos. Es una distancia creciente entre las instituciones políticas y la experiencia cotidiana de quienes deberían sentirse representados. Cuando una reforma laboral ignora al 56% de los trabajadores que ya están fuera del sistema formal, no es un error técnico: es una señal de hasta qué punto la representación opera con mapas del siglo XX sobre territorios del siglo XXI.

El riesgo de este proceso no es el colapso institucional —al menos no en el corto plazo— sino la erosión silenciosa de la legitimidad que hace posible la vida democrática.`,
  },
  {
    num: 4,
    slug: "estetizacion",
    axisKey: "estetizacion",
    name: "Estetización de la cultura",
    definicion_corta: "Los símbolos culturales circulan sin anclaje histórico o comunitario profundo, transformándose en productos consumibles.",
    autores: [
      { name: "Byung-Chul Han", slug: "byung-chul-han" },
    ],
    que_describe: `Cuando la cultura se vacía de contenido estructurante —cuando deja de transmitir normas, rituales y narrativas con capacidad organizativa—, sus símbolos quedan disponibles como repertorio. Pasan a circular como objetos estéticos: combinables, usables, comercializables sin relación necesaria con su origen.

La estetización no es solo consumismo. Es algo más específico: el acto mismo de pertenecer se vuelve estético. Vestir, decorar, mostrar, posar. La identidad se vuelve performance visible antes que arraigo invisible.

Esto opera en múltiples niveles. En las ferias artesanales donde conviven estéticas andinas, hippie, cyberpunk y new age sin que ninguna tenga raíces en ninguna comunidad real presente. En la espiritualidad como producto —velas que prometen paz y amor sin inscribirse en ninguna cosmovisión concreta. En la narcoestética, donde la violencia se convierte en relato consumible y la figura del capo circula tanto como amenaza como ícono cultural.

La política también se estetiza. Los discursos antisistema compiten en nivel de antagonismo antes que en propuesta. Los símbolos desplazan al programa. La camiseta de la selección se vuelve uniforme político. El gesto reemplaza a la argumentación.

Lo que este proceso revela no es superficialidad individual —la búsqueda de sentido puede ser completamente genuina— sino una condición estructural: cuando no hay marcos culturales heredados que organicen la pertenencia, cualquier símbolo puede funcionar como sustituto temporal. Y los sustitutos temporales no generan la densidad que generaban las tradiciones.`,
  },
  {
    num: 5,
    slug: "desorientacion-epistemologica",
    axisKey: "desorientacion",
    name: "Desorientación epistemológica",
    definicion_corta: "Se debilita la capacidad de distinguir lo real, lo verdadero y lo relevante en un entorno saturado de información.",
    autores: [
      { name: "Byung-Chul Han", slug: "byung-chul-han" },
      { name: "Yuval Noah Harari", slug: "yuval-noah-harari" },
    ],
    que_describe: `La desorientación epistemológica no es simple desinformación. Es algo más profundo y más difícil de resolver: la sospecha como reflejo automático. Frente a un hecho impactante —un atentado político, un video viral, una declaración presidencial—, la primera reacción ya no es creer. Es dudar.

¿Es real? ¿Está exagerado? ¿Es operación política? ¿Es montaje? Esta secuencia, que hace quince años parecía exceso de escepticismo, hoy es la reacción más común frente a cualquier noticia que supere cierto umbral de impacto.

El resultado no es que discutamos qué significa un acontecimiento —eso es democracia—, sino que discutamos si ocurrió como se presenta. El objeto de la disputa ya no es la interpretación sino la existencia misma del hecho. Cuando ese umbral se cruza sistemáticamente, el espacio para el debate democrático se contrae: no hay deliberación posible sin un mínimo acuerdo sobre qué es real.

El proceso tiene condiciones técnicas precisas. Los videos generados por IA son cada vez menos distinguibles de los reales. Las mediaciones que antes filtraban y verificaban —los grandes medios, las instituciones, los árbitros reconocidos— perdieron legitimidad. Y los algoritmos que organizan lo que vemos están diseñados para maximizar reacción, no para maximizar verdad.

Lo que emerge de todo esto no es solo relativismo. Es aislamiento. Si ya no podemos confiar en lo que vemos y escuchamos, si cada marco de interpretación es sospechoso, la participación en el espacio público se vuelve costosa y arriesgada. Y cuando la participación se retrae, la democracia pierde densidad desde adentro.`,
  },
  {
    num: 6,
    slug: "atencion",
    axisKey: "atencion",
    name: "Atención",
    definicion_corta: "La atención se convierte en la principal mediación invisible que organiza la experiencia del mundo.",
    autores: [
      { name: "Yuval Noah Harari", slug: "yuval-noah-harari" },
      { name: "Byung-Chul Han", slug: "byung-chul-han" },
    ],
    que_describe: `La atención no es solo concentración: es selección. Es el mecanismo mediante el cual decidimos —consciente o inconscientemente— qué parte del mundo entra en nuestra experiencia. Como nuestro tiempo es finito, cada acto de atención excluye miles de otros posibles. Atender es, siempre, no atender a todo lo demás.

Cuando todas las otras mediaciones se erosionan —cultura, instituciones, representación, marcos compartidos de verdad—, la atención queda como mediación última. Y esa mediación está siendo capturada por arquitecturas diseñadas para retenerla, no para informar mejor ni articular mayorías.

La diferencia con mediaciones anteriores es estructural. Antes, los sesgos de un medio o de un partido eran visibles y discutibles. Hoy las arquitecturas algorítmicas que organizan lo que vemos están diseñadas para optimizar engagement: lo que produce reacción, lo que retiene, lo que genera la siguiente acción. No están orientadas a la deliberación democrática. Es un modelo de negocio.

Una de las consecuencias más profundas es la desincronización de la atención colectiva. La democracia moderna se apoyó en una cierta sincronía: personas expuestas a narrativas similares dentro de un mismo territorio, capaces de compartir una agenda pública aunque estuvieran en desacuerdo. Hoy convivimos en micro-ecosistemas informativos que frecuentemente no se tocan entre sí.

Frente a esto, la respuesta no puede ser solo individual. Lo que se debilita cuando la atención se fragmenta es algo colectivo: la capacidad de construir mayorías, de sostener deliberaciones, de reconocer árbitros comunes. La atención no es solo un recurso personal. Es infraestructura democrática.`,
  },
];

export const EJES_BY_SLUG = Object.fromEntries(EJES.map(e => [e.slug, e]));

export const AXIS_KEY_TO_SLUG: Record<string, string> = {
  deculturacion: "deculturacion",
  mediaciones: "erosion-de-mediaciones",
  desrepresentacion: "desrepresentacion",
  estetizacion: "estetizacion",
  desorientacion: "desorientacion-epistemologica",
  atencion: "atencion",
};

export const MOCK_EJE_ANALYSES: Record<string, MockEjeAnalysis[]> = {
  deculturacion: [
    {
      slug: "la-constitucion-que-no-fue",
      countrySlug: "cl",
      country: "Chile",
      title: "La constitución que no fue, otra vez",
      lede: "Tres procesos fallidos. La pregunta ya no es qué constitución, sino si todavía hay un demos para escribirla.",
      date: "14 abr 2026",
      year: 2026,
    },
  ],
  "erosion-de-mediaciones": [
    {
      slug: "el-reves-de-la-motosierra",
      countrySlug: "ar",
      country: "Argentina",
      title: "El revés de la motosierra",
      lede: "Los gobernadores que sostuvieron el ajuste empiezan a despegarse. La pregunta es quién media entre el palacio y el territorio.",
      date: "19 abr 2026",
      year: 2026,
    },
    {
      slug: "el-mas-sin-evo-sin-arce",
      countrySlug: "bo",
      country: "Bolivia",
      title: "El MAS sin Evo, sin Arce, sin destino",
      lede: "Dos décadas de hegemonía se desarman sin que aparezca quién venga después. La izquierda boliviana frente al vacío.",
      date: "12 abr 2026",
      year: 2026,
    },
  ],
  desrepresentacion: [
    {
      slug: "la-constitucion-que-no-fue",
      countrySlug: "cl",
      country: "Chile",
      title: "La constitución que no fue, otra vez",
      lede: "Tres procesos fallidos. La pregunta ya no es qué constitución, sino si todavía hay un demos para escribirla.",
      date: "14 abr 2026",
      year: 2026,
    },
  ],
  estetizacion: [
    {
      slug: "fluminense-y-los-nuevos-altares",
      countrySlug: "br",
      country: "Brasil",
      title: "Fluminense y los nuevos altares",
      lede: "El club como única estructura de pertenencia funcional. Cuando todo se desarma, queda el escudo.",
      date: "21 abr 2026",
      year: 2026,
    },
  ],
  "desorientacion-epistemologica": [
    {
      slug: "la-sospecha-antes-del-voto",
      countrySlug: "co",
      country: "Colombia",
      title: "La sospecha antes del voto",
      lede: "A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección. Cuando ambos lados operan bajo sospecha permanente, el voto deja de ser un acto democrático.",
      date: "27 abr 2026",
      year: 2026,
      isPrimary: true,
    },
  ],
  atencion: [
    {
      slug: "fluminense-y-los-nuevos-altares",
      countrySlug: "br",
      country: "Brasil",
      title: "Fluminense y los nuevos altares",
      lede: "El club como única estructura de pertenencia funcional. Cuando todo se desarma, queda el escudo.",
      date: "21 abr 2026",
      year: 2026,
      isPrimary: false,
    },
  ],
};
