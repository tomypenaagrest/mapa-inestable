"use client";
import { useEffect } from "react";
import type { Footnote } from "@/lib/analisis";
import AsideCard from "./AsideCard";

interface Props {
  footnote: Footnote;
  mark: string;
  onClose: () => void;
}

export default function FootnoteBottomSheet({ footnote, mark, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 200,
        }}
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60vh",
          background: "var(--mi-bg-paper)",
          border: "var(--mi-border-bold)",
          borderBottom: "none",
          zIndex: 201,
          overflowY: "auto",
          padding: "var(--mi-space-4) var(--mi-space-5) var(--mi-space-8)",
        }}
      >
        {/* Handle */}
        <div style={{
          width: 40,
          height: 3,
          background: "var(--mi-ink-mute)",
          margin: "0 auto var(--mi-space-4)",
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: "var(--mi-space-4)",
            right: "var(--mi-space-4)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-lg)",
            color: "var(--mi-ink-mute)",
            lineHeight: 1,
            padding: 0,
          }}
        >
          ×
        </button>

        <AsideCard footnote={footnote} mark={mark} isActive={true} onClick={() => {}} />
      </div>
    </>
  );
}
