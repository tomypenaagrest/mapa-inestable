export interface AnalisisEntry {
  slug: string;
  countrySlug: string;
  country: string;
  axisSlug: string;
  axisKey: string;
  axisName: string;
  title: string;
  lede: string;
  published_at: string;
  published_iso: string;
  year: number;
  week: number;
  step_disparador: string;
  step_desplazamiento: string;
  step_conceptualizacion: string;
  step_apertura: string;
}

export const PAISES_LIST = [
  { slug: "ar", name: "Argentina" },
  { slug: "br", name: "Brasil" },
  { slug: "cl", name: "Chile" },
  { slug: "co", name: "Colombia" },
  { slug: "bo", name: "Bolivia" },
  { slug: "pe", name: "Perú" },
  { slug: "uy", name: "Uruguay" },
  { slug: "py", name: "Paraguay" },
  { slug: "ec", name: "Ecuador" },
  { slug: "ve", name: "Venezuela" },
] as const;

export const ANALISIS_ALL: AnalisisEntry[] = [
  /* ── 2026 ─────────────────────────────────────────────────────── */
  {
    slug: "la-cubierta-donde-no-se-esperaba",
    countrySlug: "uy",
    country: "Uruguay",
    axisSlug: "desorientacion-epistemologica",
    axisKey: "desorientacion",
    axisName: "Desorientación epistemológica",
    title: "La cubierta donde no se esperaba ver al Frente Amplio",
    lede: "Una imagen de tapa que rompe el pronóstico. Uruguay en 2026: cuando la percepción mediática y el resultado electoral divergen, ¿quién falla?",
    published_at: "8 may 2026",
    published_iso: "2026-05-08",
    year: 2026,
    week: 18,
    step_disparador: "El 8 de mayo de 2026, la revista Caras y Caretas publicó una portada dedicada al regreso del Frente Amplio al gobierno uruguayo. La imagen circuló en redes en minutos: un símbolo de coalición que pocos medios hegemónicos habían anticipado ganar.",
    step_desplazamiento: "Lo que revela la portada no es el triunfo del Frente Amplio sino la distancia entre el discurso dominante previo a las elecciones uruguayas y el resultado real. La desorientación epistemológica opera en ambas direcciones: el error no fue del público, sino de los marcos interpretativos que organizaron la percepción.",
    step_conceptualizacion: "Cuando los medios de referencia no pueden anticipar el resultado democrático en Uruguay, no es solo un problema de encuestas fallidas. Es una señal de que los sistemas de interpretación de la realidad política perdieron contacto con algo fundamental en el territorio.",
    step_apertura: "¿Puede un sistema informativo seguir funcionando como árbitro de la realidad cuando sistemáticamente falla en anticipar las mayorías que existen en el territorio?",
  },
  {
    slug: "la-sospecha-antes-del-voto",
    countrySlug: "co",
    country: "Colombia",
    axisSlug: "desorientacion-epistemologica",
    axisKey: "desorientacion",
    axisName: "Desorientación epistemológica",
    title: "La sospecha antes del voto",
    lede: "A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección que decidirá su sucesión. Lo nuevo no es el discurso —es de Trump, Bolsonaro, Milei— sino que ahora sea pronunciado por la izquierda.",
    published_at: "27 abr 2026",
    published_iso: "2026-04-27",
    year: 2026,
    week: 17,
    step_disparador: "El 22 de abril, Gustavo Petro publicó en X una serie de mensajes cuestionando la capacidad del Consejo Nacional Electoral colombiano de garantizar elecciones limpias, citando sin evidencia el precedente de fraude en 2022.",
    step_desplazamiento: "Lo que Petro hace no es describir una amenaza real de fraude electoral: está instalando el marco. Cuando un candidato introduce la sospecha sistemática antes del voto, cualquier resultado adverso puede leerse como confirmación de esa sospecha.",
    step_conceptualizacion: "El eje de Desorientación epistemológica se activa aquí en su forma más aguda: no como confusión involuntaria, sino como estrategia deliberada que transforma el procedimiento electoral en escenario de disputa donde la verdad del resultado queda en suspenso indefinido.",
    step_apertura: "¿Puede una democracia sostenerse cuando el procedimiento que la funda —el voto— ya no opera como árbitro compartido?",
  },
  {
    slug: "fluminense-y-los-nuevos-altares",
    countrySlug: "br",
    country: "Brasil",
    axisSlug: "estetizacion",
    axisKey: "estetizacion",
    axisName: "Estetización",
    title: "Fluminense y los nuevos altares",
    lede: "El club de fútbol como única estructura de pertenencia funcional en Brasil. Cuando todo se desarma, queda el escudo.",
    published_at: "21 abr 2026",
    published_iso: "2026-04-21",
    year: 2026,
    week: 16,
    step_disparador: "El 19 de abril, Fluminense ganó su cuarta Copa Libertadores consecutiva. Las imágenes de celebración en Río de Janeiro mostraron algo distinto a la alegría futbolística habitual: eran rituales de una comunidad que encontró en el club lo que no encontró en otra parte.",
    step_desplazamiento: "El club de fútbol en Brasil ya no es solo entretenimiento: funciona como estructura de mediación. Organiza emociones, genera identidad colectiva, crea ritos de paso, establece jerarquías de pertenencia. Lo hace en el vacío que dejaron las mediaciones tradicionales.",
    step_conceptualizacion: "La estetización opera aquí en su forma más visible: el escudo, la camiseta, los colores del equipo funcionan como sistema de significados, como lengua compartida entre personas que ya no comparten narrativas políticas, religiosas ni comunitarias.",
    step_apertura: "¿Es el fútbol el último espacio de identificación colectiva funcional en Brasil, o solo la forma más visible de un proceso de sustitución más amplio?",
  },
  {
    slug: "el-reves-de-la-motosierra",
    countrySlug: "ar",
    country: "Argentina",
    axisSlug: "erosion-de-mediaciones",
    axisKey: "mediaciones",
    axisName: "Erosión de mediaciones",
    title: "El revés de la motosierra",
    lede: "Los gobernadores que sostuvieron el ajuste de Milei empiezan a despegarse. La pregunta es quién media entre el palacio y el territorio en Argentina.",
    published_at: "19 abr 2026",
    published_iso: "2026-04-19",
    year: 2026,
    week: 16,
    step_disparador: "En la semana del 14 al 19 de abril, tres gobernadores del PRO —Pullaro, Morales y Orrego— publicaron declaraciones críticas al recorte de fondos de coparticipación anunciado por el gobierno de Milei. Era la primera fisura pública desde el inicio del ajuste.",
    step_desplazamiento: "Lo que los gobernadores están haciendo no es oposición ideológica: es autopreservación territorial. El ajuste fiscal llega al territorio y ellos son los que lo tienen que explicar. La motosierra que aplaudieron en Buenos Aires llega a sus provincias con otra cara.",
    step_conceptualizacion: "La erosión de mediaciones opera aquí en su forma más institucional: los partidos políticos que deberían mediar entre el gobierno central y los territorios están fragmentados, los gobernadores actúan como gestores de emergencia, no como intermediarios de un proyecto compartido.",
    step_apertura: "¿Puede el gobierno de Milei sostener su programa de ajuste sin las mediaciones que lo instalaron, si esas mediaciones empiezan a calcular su propia supervivencia territorial?",
  },
  {
    slug: "la-constitucion-que-no-fue",
    countrySlug: "cl",
    country: "Chile",
    axisSlug: "deculturacion",
    axisKey: "deculturacion",
    axisName: "Deculturación",
    title: "La constitución que no fue, otra vez",
    lede: "Tres procesos constituyentes fallidos en Chile. La pregunta ya no es qué constitución, sino si todavía hay un demos capaz de escribirla.",
    published_at: "14 abr 2026",
    published_iso: "2026-04-14",
    year: 2026,
    week: 15,
    step_disparador: "El 12 de abril, el tercer proceso constituyente de Chile cerró sin resultado: el texto fue rechazado por el 62% del electorado en el plebiscito de salida. Era el tercero en seis años.",
    step_desplazamiento: "Lo que el triple fracaso revela no es incapacidad técnica para redactar una constitución: es la ausencia de un relato compartido sobre el tipo de comunidad política que Chile quiere ser. Sin ese relato, ningún texto alcanza.",
    step_conceptualizacion: "La deculturación opera aquí en su forma más clara: cuando una sociedad ya no comparte el andamiaje normativo —los valores, los relatos, las referencias comunes que definen quiénes somos— no puede producir un documento fundante. Una constitución no es un contrato entre individuos, es un relato colectivo sobre el futuro.",
    step_apertura: "Si Chile no puede acordar su constitución, ¿qué otras formas de pacto colectivo siguen siendo posibles en democracias que ya no comparten un horizonte común?",
  },
  {
    slug: "el-mas-sin-evo-sin-arce-sin-destino",
    countrySlug: "bo",
    country: "Bolivia",
    axisSlug: "erosion-de-mediaciones",
    axisKey: "mediaciones",
    axisName: "Erosión de mediaciones",
    title: "El MAS sin Evo, sin Arce, sin destino",
    lede: "Dos décadas de hegemonía se desarman sin que aparezca quién venga después. La izquierda boliviana frente al vacío.",
    published_at: "12 abr 2026",
    published_iso: "2026-04-12",
    year: 2026,
    week: 15,
    step_disparador: "En abril de 2026, el Movimiento Al Socialismo boliviano celebró su congreso nacional con dos listas en disputa —la de Evo Morales y la de Luis Arce— y sin posibilidad de acuerdo. El partido que gobernó Bolivia durante 14 años no pudo elegir un candidato presidencial.",
    step_desplazamiento: "El MAS no es solo un partido: fue durante dos décadas la mediación principal entre el Estado boliviano y los movimientos sociales indígenas y campesinos. Su fragmentación no es una crisis interna: es la desarticulación de toda una arquitectura de representación.",
    step_conceptualizacion: "La erosión de mediaciones en Bolivia se produce en el eje que más duele: el de las organizaciones que articulaban la demanda histórica de los sectores excluidos. Sin esa mediación, la demanda no desaparece, pero pierde forma institucional.",
    step_apertura: "¿Puede la izquierda latinoamericana producir nuevas mediaciones después de la crisis de sus vehículos históricos, o estamos viendo el fin de un ciclo sin sucesor visible?",
  },
  {
    slug: "el-frente-sin-mayoria",
    countrySlug: "uy",
    country: "Uruguay",
    axisSlug: "desrepresentacion",
    axisKey: "desrepresentacion",
    axisName: "Desrepresentación",
    title: "El Frente sin mayoría parlamentaria",
    lede: "El Frente Amplio ganó la presidencia uruguaya pero perdió el parlamento. Orsi gobierna desde el primer día en minoría.",
    published_at: "5 abr 2026",
    published_iso: "2026-04-05",
    year: 2026,
    week: 14,
    step_disparador: "A 100 días del inicio del gobierno de Yamandú Orsi, el Frente Amplio no logró aprobar ninguno de sus proyectos prioritarios en el parlamento uruguayo. La coalición opositora de blancos y colorados bloqueó sistemáticamente la agenda legislativa.",
    step_desplazamiento: "La desrepresentación en Uruguay opera de forma inversa a otros países: las instituciones funcionan correctamente, pero su resultado —la minoría parlamentaria del ejecutivo— produce una brecha entre el mandato electoral y la capacidad de gobernar.",
    step_conceptualizacion: "El problema de representación en Uruguay no es la corrupción ni la incompetencia: es la geometría. Cuando el sistema electoral produce presidentes sin mayorías, y no existe cultura de coalición de gobierno entre sectores ideológicamente distantes, la representación se fragmenta.",
    step_apertura: "¿Puede la democracia de partidos seguir funcionando cuando la fragmentación electoral impide traducir mandatos claros en capacidad de gobernar?",
  },
  {
    slug: "el-apagon-y-la-verdad-oficial",
    countrySlug: "ve",
    country: "Venezuela",
    axisSlug: "desorientacion-epistemologica",
    axisKey: "desorientacion",
    axisName: "Desorientación epistemológica",
    title: "El apagón y la verdad oficial",
    lede: "Cuando Caracas quedó sin luz por 72 horas, el gobierno de Maduro dio tres versiones distintas en 24 horas. El apagón no fue la crisis: fue el escenario donde la crisis de verdad se volvió visible.",
    published_at: "30 mar 2026",
    published_iso: "2026-03-30",
    year: 2026,
    week: 13,
    step_disparador: "El 27 de marzo, un fallo en el sistema eléctrico venezolano dejó sin luz a Caracas y a ocho estados durante 72 horas. En ese lapso, el gobierno de Maduro atribuyó el apagón a tres causas incompatibles: ataque cibernético desde Miami, sabotaje de operarios, y fallos en mantenimiento por el bloqueo.",
    step_desplazamiento: "Lo importante no es cuál de las tres versiones era verdadera. Lo importante es que el gobierno emitió tres versiones incompatibles sin explicar la contradicción. Y que esto ya no produce escándalo en Venezuela: la desorientación epistemológica está tan consolidada que la contradicción oficial ya no exige resolución.",
    step_conceptualizacion: "Venezuela es el caso más avanzado del proceso que Mapa Inestable rastrea: una sociedad donde la capacidad de distinguir lo real de lo oficial se ha erosionado tanto que ya no funciona como criterio de acción colectiva. La desorientación no es accidental: es el sistema.",
    step_apertura: "¿Puede una sociedad reconstruir los criterios compartidos de verdad una vez que el poder los ha erosionado sistemáticamente durante décadas?",
  },
  {
    slug: "el-congreso-que-nadie-defiende",
    countrySlug: "pe",
    country: "Perú",
    axisSlug: "desrepresentacion",
    axisKey: "desrepresentacion",
    axisName: "Desrepresentación",
    title: "El Congreso que nadie defiende",
    lede: "El Congreso de Perú tiene 9% de aprobación, pero sigue legislando como si tuviera mandato. La brecha entre la institución que existe y la representación que ya no existe.",
    published_at: "24 mar 2026",
    published_iso: "2026-03-24",
    year: 2026,
    week: 12,
    step_disparador: "En marzo de 2026, Ipsos Perú publicó la encuesta de aprobación mensual de poderes del Estado: el Congreso obtuvo 9% de aprobación, el ejecutivo 14%. Era la octava encuesta consecutiva con ambos poderes por debajo del 15%.",
    step_desplazamiento: "La paradoja peruana es extrema: una institución con 9% de aprobación tiene plenas facultades legislativas y las usa. Puede remover presidentes, aprobar leyes que modifican el sistema electoral, ampliar sus propios fueros. La representación nominal sigue; la legitimidad popular, no.",
    step_conceptualizacion: "La desrepresentación en Perú llegó al punto de mínima fricción: las instituciones ya no necesitan legitimidad para operar porque los controles que deberían exigirla —la prensa, los partidos, la protesta sostenida— están también fragmentados.",
    step_apertura: "¿Cuánto tiempo puede una democracia operar con instituciones que nadie defiende pero tampoco nadie derroca?",
  },
  {
    slug: "noboa-y-la-calle",
    countrySlug: "ec",
    country: "Ecuador",
    axisSlug: "erosion-de-mediaciones",
    axisKey: "mediaciones",
    axisName: "Erosión de mediaciones",
    title: "Noboa y la calle",
    lede: "Ecuador tiene un presidente joven con popularidad alta y un Estado que no puede garantizar seguridad básica. El crédito personal no reemplaza a las instituciones que ya no median.",
    published_at: "17 mar 2026",
    published_iso: "2026-03-17",
    year: 2026,
    week: 11,
    step_disparador: "En marzo de 2026, Daniel Noboa fue reelegido con el 61% del voto popular en primera vuelta, un resultado excepcional en la historia electoral ecuatoriana. Al mismo tiempo, los homicidios en Guayaquil alcanzaron un nuevo récord mensual.",
    step_desplazamiento: "La paradoja ecuatoriana: alta aprobación presidencial con alta violencia no es una contradicción si se entiende que el voto a Noboa no es adhesión a un proyecto, es delegación de emergencia. No hay mediaciones institucionales en las que confiar —policía, justicia, municipios— entonces el voto concentra en una persona lo que debería distribuirse en instituciones.",
    step_conceptualizacion: "La erosión de mediaciones en Ecuador opera en su forma más cruda: cuando los partidos, la justicia, la policía y la comunidad local fallan como organizadores de la experiencia colectiva, el populismo de emergencia llena el vacío. Pero ninguna persona puede sustituir a las instituciones que ya no existen.",
    step_apertura: "¿Puede el apoyo personal a un líder reemplazar a las mediaciones institucionales que ya no funcionan, o solo posterga el momento en que el vacío se hace insostenible?",
  },
  {
    slug: "la-soja-como-bandera",
    countrySlug: "py",
    country: "Paraguay",
    axisSlug: "estetizacion",
    axisKey: "estetizacion",
    axisName: "Estetización",
    title: "La soja como bandera",
    lede: "Paraguay exporta el 25% del PIB en soja. El agronegocio dejó de ser política económica para volverse identidad nacional. Cuando la economía se estetiza, el debate sobre sus consecuencias desaparece.",
    published_at: "10 mar 2026",
    published_iso: "2026-03-10",
    year: 2026,
    week: 10,
    step_disparador: "En marzo de 2026, la Cámara de Exportadores de Paraguay presentó el informe anual de exportaciones de soja: 18 millones de toneladas, récord histórico. El presidente Santiago Peña celebró el dato en redes con una imagen del campo y la frase 'Paraguay, potencia agroalimentaria'.",
    step_desplazamiento: "Lo que la estetización de la soja produce no es orgullo nacional sino invisibilización. Cuando el agronegocio se vuelve símbolo identitario —una bandera, no un sector económico— el debate sobre su impacto ambiental y los desplazamientos campesinos se vuelve antipatriótico.",
    step_conceptualizacion: "La estetización opera aquí en su forma política más clara: el símbolo desplaza al debate de política económica. La soja como bandera transforma un modelo de desarrollo con ganadores y perdedores en una imagen de prosperidad colectiva sin conflicto.",
    step_apertura: "¿Cómo se discute un modelo económico cuando sus símbolos ya operan como identidad nacional? ¿Dónde queda el espacio para la deliberación cuando el dato se convierte en mito?",
  },
  {
    slug: "el-himno-en-la-grieta",
    countrySlug: "ar",
    country: "Argentina",
    axisSlug: "deculturacion",
    axisKey: "deculturacion",
    axisName: "Deculturación",
    title: "El himno en la grieta",
    lede: "En Argentina se discute si cantar el himno es gesto político o acto cívico. Cuando los símbolos nacionales se vuelven campo de disputa, ya no unifican: dividen.",
    published_at: "3 mar 2026",
    published_iso: "2026-03-03",
    year: 2026,
    week: 9,
    step_disparador: "El 1 de marzo, en el acto de apertura de sesiones ordinarias del Congreso argentino, un grupo de legisladores libertarios cantó el himno nacional de pie mientras el resto permanecía sentado. La imagen recorrió las redes durante días y generó debates sobre la 'apropiación' del himno.",
    step_desplazamiento: "Lo que la disputa por el himno revela no es un conflicto sobre protocolo: es la señal de que los símbolos nacionales ya no son territorio neutral en Argentina. El himno, la bandera, la escarapela: todos estos elementos han sido colonizados por alguna facción y ya no pueden operar como referentes comunes.",
    step_conceptualizacion: "La deculturación no es que la cultura desaparezca: es que pierde su función de marco compartido. En Argentina, los símbolos nacionales se vaciaron de contenido unificador y se llenaron de contenido de trinchera. Una bandera que divide no es una bandera: es un uniforme.",
    step_apertura: "Si los símbolos nacionales ya no pueden operar como territorio común, ¿qué queda de la idea de nación como comunidad imaginada?",
  },
  {
    slug: "lula-y-los-medios",
    countrySlug: "br",
    country: "Brasil",
    axisSlug: "erosion-de-mediaciones",
    axisKey: "mediaciones",
    axisName: "Erosión de mediaciones",
    title: "Lula y los medios",
    lede: "Lula sale de comunicado en comunicado en redes sociales, evitando a la prensa tradicional brasileña. La mediación de los medios hegemónicos sigue erosionándose, pero la alternativa también fragmenta.",
    published_at: "24 feb 2026",
    published_iso: "2026-02-24",
    year: 2026,
    week: 8,
    step_disparador: "En la semana del 18 al 24 de febrero, el gobierno de Luiz Inácio Lula da Silva publicó 47 videos en redes sociales con anuncios de política pública —nuevas escuelas, ampliación del Bolsa Familia, obras de infraestructura— sin convocar ni una sola conferencia de prensa.",
    step_desplazamiento: "Lo que Lula está haciendo no es solo comunicación política: es un cambio de arquitectura de la esfera pública en Brasil. Al publicar directamente en redes, el gobierno elimina la función de edición y verificación de la prensa. El ciudadano recibe el anuncio gubernamental sin el contexto que la prensa podría proveer.",
    step_conceptualizacion: "La erosión de mediaciones en Brasil opera en dos tiempos simultáneos: la prensa hegemónica pierde credibilidad y alcance, y el gobierno aprovecha ese vacío para instalar mediaciones propias. El resultado no es más información, sino información más fragmentada y más difícil de contrastar.",
    step_apertura: "¿Puede la democracia de masas funcionar sin un sistema de medios que medie entre el poder y los ciudadanos, o la comunicación directa del gobierno con el público es una nueva forma de representación?",
  },
  {
    slug: "las-fake-news-electorales",
    countrySlug: "cl",
    country: "Chile",
    axisSlug: "desorientacion-epistemologica",
    axisKey: "desorientacion",
    axisName: "Desorientación epistemológica",
    title: "Las fake news electorales en Chile",
    lede: "En Chile hay elecciones en noviembre. Ya circulan imágenes falsas de candidatos, videos manipulados y encuestas apócrifas. La campaña de desinformación empezó antes que la campaña.",
    published_at: "17 feb 2026",
    published_iso: "2026-02-17",
    year: 2026,
    week: 7,
    step_disparador: "En la segunda semana de febrero, el Servicio Electoral de Chile (SERVEL) registró 34 denuncias por desinformación electoral vinculadas a la campaña presidencial: videos generados por IA de candidatos diciendo cosas que nunca dijeron, encuestas sin metodología visible, capturas de pantalla de noticias de medios que no las publicaron.",
    step_desplazamiento: "Lo notable en Chile no es que exista desinformación electoral —existe en todas las democracias— sino la velocidad con que se institucionalizó. En 2021 era un fenómeno emergente. En 2026, SERVEL tiene una unidad dedicada y aun así el volumen supera la capacidad de verificación.",
    step_conceptualizacion: "La desorientación epistemológica en Chile opera ahora como condición de la campaña electoral: los votantes no solo tienen que decidir a quién apoyar, sino verificar primero si lo que vieron es real. Ese costo cognitivo adicional no cae igual en todos.",
    step_apertura: "¿Puede una democracia garantizar igualdad de voto cuando el acceso a información verificada está distribuido tan desigualmente entre sus ciudadanos?",
  },
  {
    slug: "el-vacio-despues-de-las-farc",
    countrySlug: "co",
    country: "Colombia",
    axisSlug: "desrepresentacion",
    axisKey: "desrepresentacion",
    axisName: "Desrepresentación",
    title: "El vacío después de las FARC",
    lede: "A nueve años del Acuerdo de Paz, los territorios donde operaban las FARC tienen disidencias, grupos nuevos y ausencia del Estado colombiano. La desrepresentación tomó forma armada.",
    published_at: "10 feb 2026",
    published_iso: "2026-02-10",
    year: 2026,
    week: 6,
    step_disparador: "El 8 de febrero, la Oficina del Alto Comisionado para la Paz de Colombia publicó el informe anual sobre la implementación del Acuerdo de Paz: el 34% de los puntos del acuerdo siguen sin implementarse, los homicidios en zonas ex-FARC aumentaron un 22% interanual.",
    step_desplazamiento: "Lo que revela el informe no es solo un fracaso de implementación del acuerdo: es una señal de que cuando el Estado no llena el espacio que dejaron las FARC, otros actores lo ocupan. El vacío político no dura: se llena de lo que haya disponible.",
    step_conceptualizacion: "La desrepresentación en Colombia opera en su forma más concreta: en territorios donde el Estado no tiene presencia —escuelas, hospitales, justicia, infraestructura— la representación política es irrelevante porque el Estado que debería ejercerla no existe.",
    step_apertura: "¿Puede el Acuerdo de Paz colombiano ser viable sin una reforma del Estado que lo acompañe? ¿O el problema es que la paz firma papeles pero el Estado llega tarde?",
  },
  /* ── 2025 ─────────────────────────────────────────────────────── */
  {
    slug: "el-feed-como-horizonte",
    countrySlug: "ar",
    country: "Argentina",
    axisSlug: "atencion",
    axisKey: "atencion",
    axisName: "Atención",
    title: "El feed como horizonte",
    lede: "Los argentinos pasan más horas en redes sociales que en ningún otro medio. La atención como infraestructura democrática está completamente capturada. ¿Qué queda para la deliberación?",
    published_at: "15 dic 2025",
    published_iso: "2025-12-15",
    year: 2025,
    week: 50,
    step_disparador: "En diciembre de 2025, Comscore publicó el informe de consumo digital en Argentina: promedio de 6,4 horas diarias en redes sociales por usuario activo, el dato más alto de la historia del país. TikTok superó a YouTube en tiempo total de reproducción.",
    step_desplazamiento: "Las 6,4 horas diarias de redes no son tiempo libre: son tiempo de atención capturada. La atención tiene una economía: lo que entra ahí no entra en la deliberación política, en la lectura larga, en la conversación presencial.",
    step_conceptualizacion: "La atención como infraestructura democrática está siendo reemplazada por atención como producto. Las plataformas no venden información: venden el tiempo de atención de sus usuarios a anunciantes. En ese sistema, la deliberación democrática no tiene modelo de negocio.",
    step_apertura: "Si la atención es el recurso escaso que organiza la experiencia del mundo, ¿qué tipo de ciudadanos produce una sociedad donde ese recurso está capturado por algoritmos de engagement?",
  },
  {
    slug: "carnaval-sin-raices",
    countrySlug: "br",
    country: "Brasil",
    axisSlug: "deculturacion",
    axisKey: "deculturacion",
    axisName: "Deculturación",
    title: "Carnaval sin raíces",
    lede: "El carnaval de Río es el evento cultural más fotografiado del mundo y el menos comprendido en su origen. Cuando el rito se separa de la comunidad que lo creó, queda el espectáculo.",
    published_at: "8 dic 2025",
    published_iso: "2025-12-08",
    year: 2025,
    week: 49,
    step_disparador: "En diciembre de 2025, la UNESCO incluyó el carnaval de Brasil en la lista de Patrimonio Cultural Inmaterial de la Humanidad. La decisión fue celebrada por el gobierno y las escuelas de samba. Pocas semanas después, los precios de los sambódromos para turistas se incrementaron un 180%.",
    step_desplazamiento: "La declaración de patrimonio no preserva el rito: lo musea. El carnaval que la UNESCO protege no es el que practica la comunidad en el morro —ese carnaval es cada vez más caro, más inaccesible para quienes lo crearon— sino el producto turístico derivado.",
    step_conceptualizacion: "La deculturación no requiere que la forma desaparezca: solo que se separe de la comunidad que le daba sentido. El carnaval de Río puede seguir siendo el más espectacular del mundo y simultáneamente estar dejando de ser una práctica de la comunidad afrobrasileña que lo inventó.",
    step_apertura: "¿Qué preserva el patrimonio cuando lo que era práctica comunitaria se convierte en producto turístico? ¿La forma sin la comunidad es todavía cultura o ya es entretenimiento?",
  },
  {
    slug: "petro-y-la-pantalla",
    countrySlug: "co",
    country: "Colombia",
    axisSlug: "erosion-de-mediaciones",
    axisKey: "mediaciones",
    axisName: "Erosión de mediaciones",
    title: "Petro y la pantalla",
    lede: "Gustavo Petro tiene más seguidores en X que ningún otro presidente de América Latina. También tiene el menor índice de aprobación de su mandato colombiano. Las redes amplifican la voz pero no construyen mayorías.",
    published_at: "1 dic 2025",
    published_iso: "2025-12-01",
    year: 2025,
    week: 48,
    step_disparador: "En noviembre de 2025, la cuenta de X del presidente Petro superó los 12 millones de seguidores. Simultáneamente, Invamer publicó su última encuesta sobre Colombia: 26% de aprobación, mínimo histórico del gobierno.",
    step_desplazamiento: "La paradoja de Petro revela algo sobre la arquitectura de las redes sociales: maximizan el alcance de la voz pero no la convierten en poder político. 12 millones de seguidores no son 12 millones de votos ni 12 millones de ciudadanos que apoyan el programa de gobierno.",
    step_conceptualizacion: "La erosión de mediaciones tiene este efecto perverso: los líderes políticos aprenden a comunicar directamente con sus bases a través de redes, pero las redes no proveen la densidad institucional —sindicatos, partidos, organizaciones territoriales— que necesitan para gobernar.",
    step_apertura: "¿Qué tipo de poder construye un líder que tiene millones de seguidores en redes pero que no puede aprobar una ley en el parlamento colombiano?",
  },
  {
    slug: "el-meme-como-politica",
    countrySlug: "cl",
    country: "Chile",
    axisSlug: "estetizacion",
    axisKey: "estetizacion",
    axisName: "Estetización",
    title: "El meme como política",
    lede: "En Chile, el 40% de los jóvenes de 18-24 años dice informarse políticamente principalmente a través de memes. La política estetizada no desaparece: se vuelve inasible para el debate.",
    published_at: "24 nov 2025",
    published_iso: "2025-11-24",
    year: 2025,
    week: 47,
    step_disparador: "En noviembre de 2025, el Centro de Estudios de la Realidad Contemporánea (CERC) publicó un estudio sobre consumo de información política en jóvenes chilenos: el 40% de los encuestados de 18 a 24 años declaró que los memes y videos cortos son su principal fuente de información política.",
    step_desplazamiento: "El meme como formato no es neutralmente inferior al artículo periodístico: optimiza para la respuesta emocional inmediata, no para la comprensión de procesos complejos. Y la política en democracia es, fundamentalmente, gestión de procesos complejos.",
    step_conceptualizacion: "La estetización de la política opera en Chile a través de la forma meme: el contenido político se comprime, se descontextualiza, se vuelve emotivo y compartible. El efecto no es que los jóvenes sean ignorantes: es que su información tiene una forma que no permite matices ni procesos, solo posiciones.",
    step_apertura: "¿Puede construirse ciudadanía deliberativa con herramientas diseñadas para la reacción instantánea?",
  },
  {
    slug: "maduro-y-el-silencio",
    countrySlug: "ve",
    country: "Venezuela",
    axisSlug: "desrepresentacion",
    axisKey: "desrepresentacion",
    axisName: "Desrepresentación",
    title: "Maduro y el silencio organizado",
    lede: "En Venezuela no hay oposición legal, no hay prensa independiente con alcance nacional, y la única encuesta publicada tiene al gobierno de Maduro con 71% de aprobación. La desrepresentación como sistema.",
    published_at: "17 nov 2025",
    published_iso: "2025-11-17",
    year: 2025,
    week: 46,
    step_disparador: "En noviembre de 2025, el gobierno de Nicolás Maduro inhabilitó al último partido de oposición que podía participar en elecciones regionales venezolanas. Simultáneamente, Hinterlaces —la única encuestadora que publica datos favorables al gobierno— dio a conocer una aprobación presidencial del 71%.",
    step_desplazamiento: "La desrepresentación en Venezuela no es el resultado de una elección fallida: es el diseño del sistema. No hay oposición que pueda ganar porque no hay oposición que pueda participar. No hay prensa independiente porque fue cerrada, comprada o forzada al exilio.",
    step_conceptualizacion: "El caso venezolano es el extremo del proceso que Mapa Inestable rastrea: una democracia que mantiene las formas institucionales —presidencia, parlamento, elecciones— pero las vacía de función representativa. Las instituciones son fachadas de un sistema de poder que ya no necesita legitimidad electoral para operar.",
    step_apertura: "¿En qué momento una democracia deja de serlo aunque mantenga sus formas? ¿Y quién puede decirlo desde adentro si ya no hay prensa ni oposición?",
  },
];

/* === SORT (desc por fecha) ====================================== */
ANALISIS_ALL.sort((a, b) => b.published_iso.localeCompare(a.published_iso));

/* === UTILIDADES ================================================= */

function searchMatches(a: AnalisisEntry, q: string): boolean {
  const lower = q.toLowerCase();
  return (
    a.title.toLowerCase().includes(lower) ||
    a.lede.toLowerCase().includes(lower) ||
    a.step_disparador.toLowerCase().includes(lower) ||
    a.step_desplazamiento.toLowerCase().includes(lower) ||
    a.step_conceptualizacion.toLowerCase().includes(lower) ||
    a.step_apertura.toLowerCase().includes(lower)
  );
}

function countBy(arr: AnalisisEntry[], key: (a: AnalisisEntry) => string): Record<string, number> {
  const result: Record<string, number> = {};
  for (const a of arr) {
    const k = key(a);
    result[k] = (result[k] ?? 0) + 1;
  }
  return result;
}

export interface AnalisisFacets {
  countryFacets: Record<string, number>;
  ejeFacets: Record<string, number>;
  yearFacets: Record<number, number>;
  allYears: number[];
}

export function filterAndFacet(
  all: AnalisisEntry[],
  q: string,
  selectedCountries: string[],
  selectedEjes: string[],
  selectedYears: number[],
): { results: AnalisisEntry[] } & AnalisisFacets {
  const afterText = q.trim() ? all.filter(a => searchMatches(a, q.trim())) : all;

  // Facet counts exclude each dimension's own filter (proper faceted search)
  const forCountry = afterText.filter(a =>
    (selectedEjes.length === 0    || selectedEjes.includes(a.axisSlug)) &&
    (selectedYears.length === 0   || selectedYears.includes(a.year))
  );
  const forEje = afterText.filter(a =>
    (selectedCountries.length === 0 || selectedCountries.includes(a.countrySlug)) &&
    (selectedYears.length === 0     || selectedYears.includes(a.year))
  );
  const forYear = afterText.filter(a =>
    (selectedCountries.length === 0 || selectedCountries.includes(a.countrySlug)) &&
    (selectedEjes.length === 0      || selectedEjes.includes(a.axisSlug))
  );

  const countryFacets = countBy(forCountry, a => a.countrySlug);
  const ejeFacets     = countBy(forEje,     a => a.axisSlug);

  const allYears = [...new Set(all.map(a => a.year))].sort((a, b) => b - a);
  const yearFacets: Record<number, number> = {};
  for (const a of forYear) yearFacets[a.year] = (yearFacets[a.year] ?? 0) + 1;

  const results = afterText.filter(a =>
    (selectedCountries.length === 0 || selectedCountries.includes(a.countrySlug)) &&
    (selectedEjes.length === 0      || selectedEjes.includes(a.axisSlug)) &&
    (selectedYears.length === 0     || selectedYears.includes(a.year))
  );

  return { results, countryFacets, ejeFacets, yearFacets, allYears };
}
