/* === TIPOS ====================================================== */

export interface AnalysisSnippet {
  num: string;
  country: string;
  countrySlug: string;
  axis: string;
  axisKey: string;
  title: string;
  slug: string;
  lede: string;
  apertura: string;
}

export interface ConnectorBlock {
  body: string;
}

export type DispatchBlock =
  | { type: "analysis"; data: AnalysisSnippet }
  | { type: "connector"; data: ConnectorBlock };

export interface Dispatch {
  year: number;
  week: number;
  num: number;
  title: string;
  date_range: string;
  year_label: string;
  entrada: string;
  blocks?: DispatchBlock[];
  cierre?: string;
  pregunta_semana?: string;
}

/* === DATOS ====================================================== */

export const DESPACHOS_ALL: Dispatch[] = [
  {
    year: 2026,
    week: 17,
    num: 47,
    title: "La sospecha como arma",
    date_range: "21–27 abr 2026",
    year_label: "Año II",
    entrada: "Esta semana el mapa político de Sudamérica se movió en una dirección que no habíamos visto antes: la retórica del fraude preventivo cruzó la frontera ideológica. Ya no es solo la derecha populista la que siembra la duda antes del resultado —ahora la izquierda también juega esa carta. Lo que estamos viendo no es hipocresía: es la normalización de una técnica. El voto como árbitro de la disputa política pierde densidad cuando todos los actores se reservan el derecho de desconocerlo.",
    blocks: [
      {
        type: "analysis",
        data: {
          num: "01",
          country: "Colombia",
          countrySlug: "co",
          axis: "Desorientación epistemológica",
          axisKey: "desorientacion",
          title: "La sospecha antes del voto",
          slug: "la-sospecha-antes-del-voto",
          lede: "A 103 días del fin del mandato, Petro pone en duda la transparencia de la elección que decidirá su sucesión. Lo nuevo no es el discurso —es de Trump, Bolsonaro, Milei— sino que ahora sea pronunciado por la izquierda.",
          apertura: "¿Puede una democracia sostenerse cuando el procedimiento que la funda —el voto— ya no opera como árbitro? ¿O estamos ante el comienzo del fin de la idea de que los números cierran la política?",
        },
      },
      {
        type: "connector",
        data: {
          body: "El caso colombiano no es una anomalía regional —es la punta de lanza de un proceso más amplio. En los últimos dieciocho meses hemos registrado cuatro situaciones similares en el continente. La duda sobre el proceso electoral ya no se activa después del resultado: se instala antes.",
        },
      },
      {
        type: "analysis",
        data: {
          num: "02",
          country: "Argentina",
          countrySlug: "ar",
          axis: "Erosión de mediaciones",
          axisKey: "mediaciones",
          title: "El revés de la motosierra",
          slug: "el-reves-de-la-motosierra",
          lede: "Los gobernadores que sostuvieron el ajuste de Milei empiezan a despegarse. La pregunta es quién media entre el palacio y el territorio en Argentina.",
          apertura: "¿Puede el gobierno de Milei sostener su programa de ajuste sin las mediaciones que lo instalaron, si esas mediaciones empiezan a calcular su propia supervivencia territorial?",
        },
      },
    ],
    cierre: "Los dos análisis de esta semana comparten una misma lógica de fondo: el vaciamiento de los procedimientos que organizan la vida política. No es que el fraude exista o que el Estado llegue —es que la creencia en que el procedimiento puede funcionar se erosiona. Cuando esa creencia cede, el vacío lo llena quien pueda.",
    pregunta_semana: "¿En qué momento el debilitamiento de los procedimientos se vuelve irreversible?",
  },
  {
    year: 2026,
    week: 15,
    num: 46,
    title: "Los territorios sin Estado",
    date_range: "7–13 abr 2026",
    year_label: "Año II",
    entrada: "Hay zonas en el continente donde el Estado nunca llegó y otras donde llegó pero se retiró. Esta semana se movieron ambas fronteras simultáneamente.",
  },
  {
    year: 2026,
    week: 13,
    num: 45,
    title: "El trabajo que no existe",
    date_range: "24–30 mar 2026",
    year_label: "Año II",
    entrada: "Las reformas laborales que no avanzan revelan algo más profundo que la resistencia sindical: revelan la mutación del trabajo como categoría organizadora de la vida.",
  },
  {
    year: 2026,
    week: 10,
    num: 44,
    title: "La representación en suspenso",
    date_range: "3–9 mar 2026",
    year_label: "Año II",
    entrada: "Cuando los partidos no representan y las instituciones se vacían de sentido, la democracia sigue funcionando formalmente pero pierde densidad simbólica.",
  },
];

/* === UTILIDADES ================================================= */

export function findDespacho(year: number, week: number): Dispatch | undefined {
  return DESPACHOS_ALL.find(d => d.year === year && d.week === week);
}
