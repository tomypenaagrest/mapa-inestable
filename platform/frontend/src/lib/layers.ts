// Spec 39 — Contrato común de capas analíticas
// Cualquier capa que se sume al sistema debe implementar la interface Layer.

export type LayerId = "precipitacion" | "temperatura" | "viento" | "presion";

export type LayerCategory = "macro" | "institucional" | "editorial";

export type LayerCadence = "semanal" | "mensual" | "trimestral" | "anual";

export type LayerScaleType = "continuous" | "diverging" | "categorical";

export interface LayerPeriod {
  key: string;
  date: string;   // ISO YYYY-MM-DD del último día del período
  label: string;
}

export interface LayerBucket {
  bucketIndex: number;
  label: string;
  color: string;
  rangeDescription?: string;
}

export interface LayerLegendDef {
  type: LayerScaleType;
  buckets: LayerBucket[];
  noDataColor?: string;
  qualityFlagColor?: string;
}

export interface LayerSource {
  name: string;
  url: string;
  publishedDate: string;
  lastFetched: string;
}

export type LayerQuality = "oficial" | "estimado" | "congelado";

export interface LayerValue {
  raw: number;
  formatted: string;
  bucketIndex: number;
  delta?: number;
  quality: LayerQuality;
}

/** Spec 42 — Sub-indicador asociado a una capa. Enriquece sin reemplazar el indicador principal. */
export interface LayerSubIndicator {
  slug: string;
  label: string;
  unit: string;
  /** Si true, un valor más alto es peor (inflación, deuda). Afecta el color de la sparkline en el drawer. */
  invertGood?: boolean;
  getValueForCountry(countrySlug: string, period: LayerPeriod): LayerValue | null;
  /** Devuelve hasta 8 puntos históricos anuales para la sparkline. */
  getSeries(countrySlug: string): Array<{ key: string; value: number; quality: LayerQuality }>;
}

export interface Layer {
  id: LayerId;
  label: string;
  shortLabel: string;
  glyphSrc: string;
  category: LayerCategory;
  description: string;
  unit: string;
  cadence: LayerCadence;
  legend: LayerLegendDef;
  source: LayerSource;
  periods: LayerPeriod[];
  defaultPeriod: LayerPeriod;
  getValueForCountry(countrySlug: string, period: LayerPeriod): LayerValue | null;
  getLastPeriodBefore(date: string): LayerPeriod | null;
  readingGuideSlug: string;
  /** Spec 42 — Sub-indicadores opcionales que enriquecen la lectura del drawer. */
  subIndicators?: LayerSubIndicator[];
  /** Spec 42 — Texto editorial curado por país (piloto). Slug en minúsculas → párrafo HTML. */
  editorialByCountry?: Record<string, string>;
}

// ── Registry ──────────────────────────────────────────────────────────────────

import { precipitacionLayer } from "./layers/precipitacion";
import { temperaturaLayer }   from "./layers/temperatura";
import { vientoLayer }         from "./layers/viento";
import { presionLayer }        from "./layers/presion";

export const LAYERS: Record<LayerId, Layer> = {
  precipitacion: precipitacionLayer,
  temperatura:   temperaturaLayer,
  viento:        vientoLayer,
  presion:       presionLayer,
};

export const LAYER_IDS: LayerId[] = ["precipitacion", "temperatura", "viento", "presion"];

export function getLayer(id: LayerId): Layer {
  return LAYERS[id];
}

/** Rango global cubierto por todas las capas (mínimo 2021-01-01, máximo = hoy). */
export function getGlobalDateRange(): { start: string; end: string } {
  const today = new Date().toISOString().slice(0, 10);
  return { start: "2021-01-01", end: today };
}

/** Valida si un string es un LayerId válido. */
export function isLayerId(s: string): s is LayerId {
  return LAYER_IDS.includes(s as LayerId);
}
