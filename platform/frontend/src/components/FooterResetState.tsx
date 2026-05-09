"use client";
import { useState } from "react";
import { useReaderState } from "@/hooks/useReaderState";

export default function FooterResetState() {
  const { reset } = useReaderState();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <span style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        color: "var(--mi-ink-mute)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
      }}>
        Estado borrado
      </span>
    );
  }

  if (confirming) {
    return (
      <span style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-2)" }}>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
        }}>
          ¿Confirmar?
        </span>
        <button
          onClick={() => { reset(); setDone(true); }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-accent-warn)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          Sí, olvidar
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            padding: 0,
          }}
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        color: "var(--mi-ink-mute)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        textDecoration: "underline",
        padding: 0,
      }}
    >
      Olvidar estado de lectura
    </button>
  );
}
