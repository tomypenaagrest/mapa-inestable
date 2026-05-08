const BASE = "/api";

export type Axis =
  | "deculturacion"
  | "erosion_mediaciones"
  | "desrepresentacion"
  | "estetizacion"
  | "desorientacion_epistemologica"
  | "atencion";

export const AXIS_LABELS: Record<Axis, string> = {
  deculturacion: "Deculturación",
  erosion_mediaciones: "Erosión de mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion: "Estetización",
  desorientacion_epistemologica: "Desorientación epistemológica",
  atencion: "Atención",
};

export const AXIS_COLORS: Record<Axis, string> = {
  deculturacion: "#e07b54",
  erosion_mediaciones: "#6b9fa8",
  desrepresentacion: "#c4855a",
  estetizacion: "#8fa86b",
  desorientacion_epistemologica: "#a87a6b",
  atencion: "#6b6ba8",
};

export const COUNTRY_NAMES: Record<string, string> = {
  AR: "Argentina",
  BR: "Brasil",
  CL: "Chile",
  CO: "Colombia",
  BO: "Bolivia",
  PE: "Perú",
  UY: "Uruguay",
  PY: "Paraguay",
  EC: "Ecuador",
  VE: "Venezuela",
};

export interface AxisActivity {
  axis: Axis;
  count: number;
}

export interface CountrySummary {
  country: string;
  week: number;
  year: number;
  event_count: number;
  analysis_count: number;
  active_axes: AxisActivity[];
}

export interface Event {
  id: number;
  country: string;
  title: string;
  url: string;
  medium: string;
  author: string | null;
  published_at: string | null;
  week: number;
  year: number;
  summary: string | null;
  relevant: boolean;
  axes: { axis: Axis; is_primary: boolean }[];
}

export interface Analysis {
  id: number;
  event_id: number;
  country: string;
  week: number;
  year: number;
  disparador: string;
  desplazamiento: string;
  conceptualizacion: string;
  apertura: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  event?: Event;
}

export interface Dispatch {
  id: number;
  week: number;
  year: number;
  title: string;
  entrada: string | null;
  hilo: string | null;
  cierre: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  map: {
    week: (year: number, week: number) =>
      request<CountrySummary[]>(`/map/week/${year}/${week}`),
  },
  events: {
    list: (params: Record<string, string | number | boolean>) => {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      return request<Event[]>(`/events${qs ? `?${qs}` : ""}`);
    },
    create: (data: Partial<Event>) =>
      request<Event>("/events", { method: "POST", body: JSON.stringify(data) }),
    markRelevant: (id: number, relevant: boolean) =>
      request<Event>(`/events/${id}/relevant?relevant=${relevant}`, {
        method: "PATCH",
      }),
    setAxes: (id: number, axes: { axis: Axis; is_primary: boolean }[]) =>
      request<Event>(`/events/${id}/axes`, {
        method: "POST",
        body: JSON.stringify(axes),
      }),
  },
  analyses: {
    list: (params: Record<string, string | number | boolean>) => {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString();
      return request<Analysis[]>(`/analyses${qs ? `?${qs}` : ""}`);
    },
    create: (data: Partial<Analysis>) =>
      request<Analysis>("/analyses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Analysis>) =>
      request<Analysis>(`/analyses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  dispatches: {
    list: () => request<Dispatch[]>("/dispatches"),
    create: (data: Partial<Dispatch> & { analysis_ids: number[] }) =>
      request<Dispatch>("/dispatches", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: number, data: Partial<Dispatch> & { analysis_ids?: number[] }) =>
      request<Dispatch>(`/dispatches/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
  rss: {
    ingest: () => request("/rss/ingest", { method: "POST" }),
  },
};
