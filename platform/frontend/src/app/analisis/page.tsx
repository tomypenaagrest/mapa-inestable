import { Suspense } from "react";
import type { Metadata } from "next";
import { AnalisisContent } from "./AnalisisContent";

export const metadata: Metadata = {
  title: "Archivo — Mapa Inestable",
  description: "Todos los análisis publicados por Mapa Inestable. Filtrá por país, eje y año.",
};

export default function AnalisisPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            background: "var(--mi-bg-paper)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}
        >
          Cargando archivo…
        </div>
      }
    >
      <AnalisisContent />
    </Suspense>
  );
}
