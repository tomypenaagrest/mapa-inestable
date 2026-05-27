"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { Indicator } from "@/lib/latinobarometro";
import "@/styles/mobile-restantes.css";

const AXIS_ORDER = [
  { displayKey: "desrepresentacion", label: "Desrepresentación" },
  { displayKey: "mediaciones",       label: "Erosión de mediaciones" },
  { displayKey: "desorientacion",    label: "Desorientación epistemológica" },
  { displayKey: "deculturacion",     label: "Deculturación" },
  { displayKey: "atencion",          label: "Atención" },
  { displayKey: "contexto",          label: "Contexto" },
] as const;

function axisDisplayKey(axis: string): string {
  const map: Record<string, string> = {
    "desrepresentacion":             "desrepresentacion",
    "erosion-mediaciones":           "mediaciones",
    "desorientacion-epistemologica": "desorientacion",
    "deculturacion":                 "deculturacion",
    "atencion":                      "atencion",
    "contexto":                      "contexto",
  };
  return map[axis] ?? axis;
}

interface IndicadorSelectorSheetProps {
  indicators: Indicator[];
  currentId: string;
  currentLabel: string;
}

export default function IndicadorSelectorSheet({
  indicators,
  currentId,
  currentLabel,
}: IndicadorSelectorSheetProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      {/* Sticky selector button */}
      <button
        className="mr-comp-selector-sticky"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="mr-comp-selector-prefix">Indicador ·</span>
        <span className="mr-comp-selector-value">{currentLabel}</span>
        <span className="mr-comp-selector-arrow">▴</span>
      </button>

      {/* Bottom sheet */}
      {open && (
        <>
          <div
            className="mr-sheet-overlay"
            onClick={close}
            aria-hidden
          />
          <div
            className="mr-sheet"
            role="dialog"
            aria-label="Cambiar indicador"
          >
            <div className="mr-sheet-handle" />
            <div className="mr-sheet-header">Cambiar indicador</div>

            {AXIS_ORDER.map(axis => {
              const group = indicators.filter(
                i => axisDisplayKey(i.axis) === axis.displayKey
              );
              if (group.length === 0) return null;

              return (
                <div key={axis.displayKey} className="mr-sheet-group">
                  <span className="mr-sheet-group-label">
                    <span
                      className="mr-sheet-group-dot"
                      style={{ background: `var(--mi-axis-${axis.displayKey})` }}
                    />
                    <span style={{ color: "var(--mi-ink-mute)" }}>{axis.label}</span>
                  </span>

                  {group.map(ind => {
                    const isActive = ind.id === currentId;
                    return (
                      <Link
                        key={ind.id}
                        href={`/comparar/${ind.id}`}
                        className="mr-sheet-item"
                        onClick={close}
                        style={isActive ? { fontWeight: 600 } : undefined}
                      >
                        <span className="mr-sheet-item-check">
                          {isActive ? "✓" : ""}
                        </span>
                        <span className="mr-sheet-item-text">{ind.label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
