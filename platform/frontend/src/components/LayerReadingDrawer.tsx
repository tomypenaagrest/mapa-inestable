"use client";
// Spec 39 — Drawer derecho con guía de lectura editorial de la capa activa.
// Recibe HTML pre-renderizado desde el server (page.tsx lee el .md del vault con marked).

import { useEffect } from "react";
import type { LayerId } from "@/lib/layers";
import type { ReadingGuides } from "@/lib/reading-guides";

interface LayerReadingDrawerProps {
  layerId: LayerId;
  readingGuides: ReadingGuides;
  onClose: () => void;
}

export default function LayerReadingDrawer({ layerId, readingGuides, onClose }: LayerReadingDrawerProps) {
  const html = readingGuides[layerId] ?? "";

  // Cierra con Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(31,42,18,0.25)",
          zIndex: 40,
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Guía de lectura de la capa"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: "100vw",
          background: "var(--mi-bg-paper)",
          borderLeft: "var(--mi-border-bold)",
          overflowY: "auto",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--mi-space-3) var(--mi-space-4)",
          borderBottom: "var(--mi-border-bold)",
          background: "var(--mi-bg-paper)",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}>
          <span style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "var(--mi-text-xs)",
            textTransform: "uppercase",
            letterSpacing: "var(--mi-tracking-widest)",
            color:         "var(--mi-ink-mute)",
          }}>
            Guía de lectura
          </span>
          <button
            onClick={onClose}
            aria-label="Cerrar guía"
            style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize:   "var(--mi-text-xs)",
              background: "transparent",
              border:     "2px solid var(--mi-ink)",
              color:      "var(--mi-ink)",
              cursor:     "pointer",
              padding:    "4px 10px",
              letterSpacing: "0.06em",
            }}
          >
            Cerrar ×
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "var(--mi-space-4) var(--mi-space-4) var(--mi-space-6)", flex: 1 }}>
          {html ? (
            <div
              className="mi-reading-guide"
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                fontFamily:  "var(--mi-font-body)",
                fontSize:    "var(--mi-text-sm)",
                lineHeight:  "var(--mi-leading-relaxed)",
                color:       "var(--mi-ink-soft)",
              }}
            />
          ) : (
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize:   "var(--mi-text-xs)",
              color:      "var(--mi-ink-mute)",
              textAlign:  "center",
              padding:    "var(--mi-space-6) 0",
            }}>
              Guía de lectura en preparación.
              <br /><br />
              La documentación editorial de esta capa<br />
              se publica junto con la implementación real<br />
              (Specs 42–45).
            </div>
          )}
        </div>
      </div>
    </>
  );
}
