"use client";
// Spec 46 §3 — Chip flotante persistente con el glosario climático ↔ político.
// Esquina inferior izquierda del área del mapa. Colapsado por default.

import { useEffect, useRef, useState } from "react";
import type { OnboardingSection } from "@/lib/onboarding-content";

interface LayerGlossaryChipProps {
  glossary: OnboardingSection | null;
  onOpenOnboarding: () => void;
}

export default function LayerGlossaryChip({ glossary, onOpenOnboarding }: LayerGlossaryChipProps) {
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Colapsar al clickear fuera
  useEffect(() => {
    if (!expanded) return;
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [expanded]);

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        bottom: "var(--mi-space-3)",
        left: "var(--mi-space-3)",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {expanded && (
        <div style={{
          background: "var(--mi-bg-paper)",
          border: "var(--mi-border-bold)",
          boxShadow: "4px 4px 0 var(--mi-ink)",
          width: 260,
          maxHeight: "60vh",
          overflowY: "auto",
          marginBottom: "var(--mi-space-2)",
        }}>
          {/* Cabecera del panel */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "var(--mi-space-2) var(--mi-space-2)",
            borderBottom: "1px solid var(--mi-rule-soft)",
          }}>
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: 9,
              fontWeight: 700,
              color: "var(--mi-ink)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}>
              Glosario climático ↔ político
            </span>
            <button
              onClick={() => setExpanded(false)}
              aria-label="Cerrar glosario"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--mi-font-mono)",
                fontSize: 11,
                color: "var(--mi-ink-mute)",
                padding: 0,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>

          {/* Contenido */}
          <div
            className="glossary-body"
            dangerouslySetInnerHTML={{ __html: glossary?.html ?? "" }}
            style={{
              padding: "var(--mi-space-2)",
            }}
          />

          {/* Link al onboarding */}
          <div style={{
            padding: "var(--mi-space-1) var(--mi-space-2) var(--mi-space-2)",
            borderTop: "1px solid var(--mi-rule-soft)",
          }}>
            <button
              onClick={() => { setExpanded(false); onOpenOnboarding(); }}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 9,
                color: "var(--mi-ink)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Ver onboarding completo →
            </button>
          </div>
        </div>
      )}

      {/* Chip */}
      <button
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
        aria-label={expanded ? "Cerrar glosario" : "Ver glosario climático-político"}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "var(--mi-bg-paper)",
          border: "var(--mi-border-bold)",
          boxShadow: "2px 2px 0 var(--mi-ink)",
          cursor: "pointer",
          padding: "4px 8px",
          fontFamily: "var(--mi-font-mono)",
          fontSize: 9,
          color: "var(--mi-ink)",
          letterSpacing: "0.04em",
        }}
      >
        <span>ⓘ</span>
        <span>Glosario · clima/política</span>
      </button>

      <style>{`
        .glossary-body table { border-collapse: collapse; font-size: 9px; font-family: var(--mi-font-mono); width: 100%; }
        .glossary-body th, .glossary-body td { border: 1px solid var(--mi-rule-soft); padding: 3px 6px; text-align: left; }
        .glossary-body th { background: var(--mi-bg-cream); font-weight: 700; }
        .glossary-body p { margin: 0 0 0.5em; font-size: 9px; font-family: var(--mi-font-mono); }
      `}</style>
    </div>
  );
}
