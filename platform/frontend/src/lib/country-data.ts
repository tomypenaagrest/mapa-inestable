export interface AxisIntensity {
  key: string;
  label: string;
  intensity: number; // 0–5
}

export interface Source {
  name: string;
  url: string;
  type: "hegemonic" | "alternative" | "analysis";
}

export interface AnalysisSummary {
  slug: string;
  title: string;
  axis: string;
  axisKey: string;
  date: string;
  week: number;
  year: number;
}

/* === EJES CRÓNICOS POR PAÍS ==================================== */

export const COUNTRY_EJES: Record<string, AxisIntensity[]> = {
  ar: [
    { key: "desorientacion",    label: "Desorientación",        intensity: 5 },
    { key: "estetizacion",      label: "Estetización",          intensity: 4 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 4 },
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 4 },
    { key: "atencion",          label: "Atención",              intensity: 3 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 2 },
  ],
  br: [
    { key: "atencion",          label: "Atención",              intensity: 5 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 4 },
    { key: "estetizacion",      label: "Estetización",          intensity: 4 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 3 },
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 3 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 2 },
  ],
  co: [
    { key: "desorientacion",    label: "Desorientación",        intensity: 5 },
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 4 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 3 },
    { key: "estetizacion",      label: "Estetización",          intensity: 2 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 2 },
    { key: "atencion",          label: "Atención",              intensity: 1 },
  ],
  cl: [
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 4 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 3 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 3 },
    { key: "estetizacion",      label: "Estetización",          intensity: 2 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 2 },
    { key: "atencion",          label: "Atención",              intensity: 2 },
  ],
  bo: [
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 4 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 4 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 3 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 3 },
    { key: "estetizacion",      label: "Estetización",          intensity: 2 },
    { key: "atencion",          label: "Atención",              intensity: 2 },
  ],
  pe: [
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 5 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 4 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 4 },
    { key: "estetizacion",      label: "Estetización",          intensity: 2 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 2 },
    { key: "atencion",          label: "Atención",              intensity: 2 },
  ],
  uy: [
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 2 },
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 2 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 2 },
    { key: "estetizacion",      label: "Estetización",          intensity: 1 },
    { key: "atencion",          label: "Atención",              intensity: 2 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 1 },
  ],
  py: [
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 3 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 3 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 2 },
    { key: "estetizacion",      label: "Estetización",          intensity: 1 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 2 },
    { key: "atencion",          label: "Atención",              intensity: 1 },
  ],
  ec: [
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 4 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 3 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 3 },
    { key: "estetizacion",      label: "Estetización",          intensity: 2 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 2 },
    { key: "atencion",          label: "Atención",              intensity: 2 },
  ],
  ve: [
    { key: "desrepresentacion", label: "Desrepresentación",     intensity: 5 },
    { key: "desorientacion",    label: "Desorientación",        intensity: 5 },
    { key: "mediaciones",       label: "Erosión de mediaciones",intensity: 5 },
    { key: "estetizacion",      label: "Estetización",          intensity: 3 },
    { key: "deculturacion",     label: "Deculturación",         intensity: 3 },
    { key: "atencion",          label: "Atención",              intensity: 3 },
  ],
};

/* === FUENTES POR PAÍS =========================================== */

export const COUNTRY_SOURCES: Record<string, Source[]> = {
  ar: [
    { name: "La Nación",      url: "https://lanacion.com.ar",   type: "hegemonic"   },
    { name: "Infobae",        url: "https://infobae.com",        type: "hegemonic"   },
    { name: "El Destape",     url: "https://eldestapeweb.com",   type: "alternative" },
    { name: "Chequeado",      url: "https://chequeado.com",      type: "analysis"    },
    { name: "El Cohete a la Luna", url: "https://elcohetealaluna.com", type: "alternative" },
  ],
  br: [
    { name: "Folha de S.Paulo",    url: "https://folha.uol.com.br",      type: "hegemonic"   },
    { name: "Agência Brasil",      url: "https://agenciabrasil.ebc.com.br", type: "hegemonic" },
    { name: "The Intercept Brasil",url: "https://theintercept.com/brasil", type: "alternative" },
    { name: "Piauí",               url: "https://piaui.folha.uol.com.br", type: "analysis"    },
  ],
  co: [
    { name: "La Silla Vacía",   url: "https://lasillavacia.com",      type: "analysis"   },
    { name: "El Espectador",    url: "https://elespectador.com",      type: "hegemonic"  },
    { name: "Semana",           url: "https://semana.com",            type: "hegemonic"  },
    { name: "Razón Pública",    url: "https://razonpublica.com",      type: "analysis"   },
    { name: "Cuestión Pública", url: "https://cuestionpublica.com",   type: "analysis"   },
  ],
  cl: [
    { name: "El Mostrador",   url: "https://elmostrador.cl",     type: "alternative" },
    { name: "CIPER",          url: "https://ciperchile.cl",      type: "analysis"    },
    { name: "La Tercera",     url: "https://latercera.com",      type: "hegemonic"   },
    { name: "El Desconcierto",url: "https://eldesconcierto.cl",  type: "alternative" },
  ],
  bo: [
    { name: "Los Tiempos",  url: "https://lostiempos.com",  type: "hegemonic"   },
    { name: "El Deber",     url: "https://eldeber.com.bo",  type: "hegemonic"   },
    { name: "Página Siete", url: "https://paginasiete.bo",  type: "analysis"    },
  ],
  pe: [
    { name: "La República",  url: "https://larepublica.pe",    type: "hegemonic"   },
    { name: "OjoPúblico",    url: "https://ojo-publico.com",   type: "analysis"    },
    { name: "El Comercio",   url: "https://elcomercio.pe",     type: "hegemonic"   },
    { name: "IDL-Reporteros",url: "https://idl-reporteros.pe", type: "analysis"    },
  ],
  uy: [
    { name: "La Diaria",  url: "https://ladiaria.com.uy", type: "alternative" },
    { name: "El País",    url: "https://elpais.com.uy",   type: "hegemonic"   },
    { name: "Brecha",     url: "https://brecha.com.uy",   type: "analysis"    },
  ],
  py: [
    { name: "ABC Color",   url: "https://abc.com.py",         type: "hegemonic"   },
    { name: "La Nación PY",url: "https://lanacion.com.py",    type: "hegemonic"   },
    { name: "E'a",         url: "https://ea.com.py",          type: "alternative" },
  ],
  ec: [
    { name: "El Universo", url: "https://eluniverso.com",  type: "hegemonic"   },
    { name: "GK",          url: "https://gk.city",         type: "analysis"    },
    { name: "Primicias",   url: "https://primicias.ec",     type: "analysis"    },
  ],
  ve: [
    { name: "Tal Cual",        url: "https://talcualdigital.com",   type: "alternative" },
    { name: "Efecto Cocuyo",   url: "https://efectococuyo.com",     type: "alternative" },
    { name: "Armando.info",    url: "https://armando.info",         type: "analysis"    },
    { name: "El Nacional",     url: "https://el-nacional.com",      type: "hegemonic"   },
  ],
};

/* === ANÁLISIS POR PAÍS (mock hasta conectar backend) =========== */

export const COUNTRY_ANALYSES: Record<string, AnalysisSummary[]> = {
  ar: [],
  br: [],
  co: [
    { slug: "la-sospecha-antes-del-voto",  title: "La sospecha antes del voto",        axis: "Desorientación epistemológica", axisKey: "desorientacion",    date: "27 abr 2026", week: 17, year: 2026 },
    { slug: "petro-y-los-territorios",     title: "Petro y los territorios sin Estado", axis: "Erosión de mediaciones",       axisKey: "mediaciones",       date: "14 abr 2026", week: 15, year: 2026 },
    { slug: "reforma-laboral-colombia",    title: "La reforma laboral que no pudo",    axis: "Desrepresentación",             axisKey: "desrepresentacion", date: "31 mar 2026", week: 13, year: 2026 },
  ],
  cl: [],
  bo: [],
  pe: [],
  uy: [],
  py: [],
  ec: [],
  ve: [],
};

export const COUNTRY_NAMES: Record<string, string> = {
  ar: "Argentina",
  br: "Brasil",
  cl: "Chile",
  co: "Colombia",
  bo: "Bolivia",
  pe: "Perú",
  uy: "Uruguay",
  py: "Paraguay",
  ec: "Ecuador",
  ve: "Venezuela",
};
