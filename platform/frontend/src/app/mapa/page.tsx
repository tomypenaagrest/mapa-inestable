import type { Metadata } from "next";
import { Suspense } from "react";
import MapaExplorer from "./MapaExplorer";

export const metadata: Metadata = {
  title: "Mapa",
  description: "Mapa interactivo de Sudamérica con análisis estructural por país.",
};

export default function MapaPage() {
  return (
    <Suspense fallback={
      <div style={{
        padding: "var(--mi-space-8)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        color: "var(--mi-ink-mute)",
        textAlign: "center",
      }}>
        Cargando mapa…
      </div>
    }>
      <MapaExplorer />
    </Suspense>
  );
}
