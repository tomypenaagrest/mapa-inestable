"use client";
// Spec 46 — Overlay carousel de onboarding para /mapa.
// 4 pantallas + navegación teclado/click + trampa de foco + prefers-reduced-motion.

import { useEffect, useRef, useState, useCallback } from "react";
import type { OnboardingContent } from "@/lib/onboarding-content";
import { markOnboardingSeen } from "@/lib/onboarding-state";

interface LayerOnboardingProps {
  content: OnboardingContent;
  onClose: () => void;
}

export default function LayerOnboarding({ content, onClose }: LayerOnboardingProps) {
  const [current, setCurrent] = useState(0);
  const overlayRef  = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const total = content.panels.length;

  const handleClose = useCallback(() => {
    markOnboardingSeen();
    onClose();
  }, [onClose]);

  const goNext = useCallback(() => {
    if (current < total - 1) setCurrent(c => c + 1);
    else handleClose();
  }, [current, total, handleClose]);

  const goPrev = useCallback(() => {
    if (current > 0) setCurrent(c => c - 1);
  }, [current]);

  // Foco inicial + trampa de foco
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    function trapFocus(e: KeyboardEvent) {
      if (e.key === "Escape") { handleClose(); return; }
      if (e.key === "ArrowRight") { goNext(); return; }
      if (e.key === "ArrowLeft")  { goPrev(); return; }
      if (e.key !== "Tab") return;

      const focusable = (overlay as HTMLDivElement).querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { last.focus(); e.preventDefault(); }
      } else {
        if (document.activeElement === last) { first.focus(); e.preventDefault(); }
      }
    }

    document.addEventListener("keydown", trapFocus);
    return () => document.removeEventListener("keydown", trapFocus);
  }, [handleClose, goNext, goPrev]);

  // Preferencia de movimiento reducido
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const panel = content.panels[current];
  if (!panel) return null;

  const isLast = current === total - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(31, 42, 18, 0.75)",
        backdropFilter: "blur(2px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div style={{
        background: "var(--mi-bg-paper)",
        border: "var(--mi-border-bold)",
        boxShadow: "6px 6px 0 var(--mi-ink)",
        maxWidth: 560,
        width: "calc(100vw - 32px)",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header con botón Saltar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "var(--mi-space-3) var(--mi-space-4)",
          borderBottom: "1px solid var(--mi-rule-soft)",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: 9,
            color: "var(--mi-ink-mute)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}>
            Cómo se lee este mapa
          </span>
          <button
            ref={closeBtnRef}
            onClick={handleClose}
            aria-label="Saltar onboarding"
            style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: 9,
              color: "var(--mi-ink-mute)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "2px 4px",
              textDecoration: "underline",
            }}
          >
            Saltar
          </button>
        </div>

        {/* Contenido de la pantalla */}
        <div
          key={prefersReducedMotion ? "static" : current}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--mi-space-5) var(--mi-space-5) var(--mi-space-4)",
            ...(prefersReducedMotion ? {} : {
              animation: "mi-slide-in 200ms ease",
            }),
          }}
        >
          <h2
            id="onboarding-title"
            style={{
              fontFamily: "var(--mi-font-display)",
              fontSize: "var(--mi-text-xl)",
              color: "var(--mi-ink)",
              margin: "0 0 var(--mi-space-4)",
              lineHeight: "var(--mi-leading-snug)",
            }}
          >
            {panel.title}
          </h2>
          <div
            className="onboarding-body"
            dangerouslySetInnerHTML={{ __html: panel.html }}
            style={{
              fontFamily: "var(--mi-font-body)",
              fontSize: "var(--mi-text-sm)",
              color: "var(--mi-ink-soft)",
              lineHeight: "var(--mi-leading-normal)",
            }}
          />
        </div>

        {/* Footer — dots + navegación */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--mi-space-3) var(--mi-space-4)",
          borderTop: "1px solid var(--mi-rule-soft)",
          flexShrink: 0,
        }}>
          {/* Dots */}
          <div style={{ display: "flex", gap: 6 }}>
            {content.panels.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Pantalla ${i + 1}`}
                aria-current={i === current ? "step" : undefined}
                style={{
                  width: i === current ? 18 : 8,
                  height: 8,
                  borderRadius: 0,
                  background: i === current ? "var(--mi-ink)" : "var(--mi-rule-soft)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: prefersReducedMotion ? "none" : "width 150ms ease, background 150ms ease",
                }}
              />
            ))}
          </div>

          {/* Botones de navegación */}
          <div style={{ display: "flex", gap: "var(--mi-space-2)" }}>
            {current > 0 && (
              <button
                onClick={goPrev}
                style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: 9,
                  color: "var(--mi-ink-mute)",
                  background: "transparent",
                  border: "1px solid var(--mi-rule-soft)",
                  cursor: "pointer",
                  padding: "4px 10px",
                }}
              >
                ← Atrás
              </button>
            )}
            <button
              onClick={goNext}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: 9,
                fontWeight: 700,
                color: "var(--mi-bg-paper)",
                background: "var(--mi-ink)",
                border: "none",
                cursor: "pointer",
                padding: "4px 12px",
              }}
            >
              {isLast ? "Empezar a explorar →" : "Siguiente →"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mi-slide-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .onboarding-body p  { margin: 0 0 0.75em; }
        .onboarding-body ul { margin: 0 0 0.75em; padding-left: 1.2em; }
        .onboarding-body li { margin-bottom: 0.25em; }
        .onboarding-body strong { color: var(--mi-ink); font-weight: 700; }
        .onboarding-body table { border-collapse: collapse; font-size: 11px; font-family: var(--mi-font-mono); width: 100%; }
        .onboarding-body th, .onboarding-body td { border: 1px solid var(--mi-rule-soft); padding: 4px 8px; text-align: left; }
        .onboarding-body th { background: var(--mi-bg-cream); }
      `}</style>
    </div>
  );
}
