// Spec 47 §5 — Snapshot cruzado de todas las capas para un país y una fecha del slider.
// Primitivo reutilizable por LayerTooltip, LayerReadingDrawer y el panel pineado de LayerLegend.

import { LAYERS, LAYER_IDS } from "./layers";
import type { Layer, LayerId, LayerValue, LayerPeriod, LayerChipFormat } from "./layers";

export interface CrossLayerChip {
  layerId: LayerId;
  layer: Layer;
  period: LayerPeriod | null;
  value: LayerValue | null;
  chipFormat: LayerChipFormat;
}

export interface CrossLayerSnapshot {
  countrySlug: string;
  sliderDate: string;
  chips: CrossLayerChip[];
}

function defaultChipFormat(layer: Layer): LayerChipFormat {
  return {
    shortChipLabel: layer.shortLabel.slice(0, 5),
    tone: "neutral",
    useOrientedGlyph: false,
  };
}

export function getCrossLayerSnapshot(
  countrySlug: string,
  sliderDate: string,
): CrossLayerSnapshot {
  const chips: CrossLayerChip[] = LAYER_IDS.map((id) => {
    const layer = LAYERS[id];
    const period = layer.getLastPeriodBefore(sliderDate);
    const value = period ? layer.getValueForCountry(countrySlug, period) : null;
    const chipFormat: LayerChipFormat =
      value && layer.formatCrossLayerChip
        ? layer.formatCrossLayerChip(value)
        : defaultChipFormat(layer);
    return { layerId: id, layer, period, value, chipFormat };
  });
  return { countrySlug, sliderDate, chips };
}

// Memoización por (countrySlug, sliderDate). Cache de sesión (módulo), se invalida al recargar.
const _memo = new Map<string, CrossLayerSnapshot>();

export function getCrossLayerSnapshotMemo(
  countrySlug: string,
  sliderDate: string,
): CrossLayerSnapshot {
  const key = `${countrySlug}::${sliderDate}`;
  if (_memo.has(key)) return _memo.get(key)!;
  const result = getCrossLayerSnapshot(countrySlug, sliderDate);
  _memo.set(key, result);
  return result;
}

export function clearCrossLayerMemo(): void {
  _memo.clear();
}
