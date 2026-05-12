import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllAgentDrafts } from "@/lib/content";
import { BorradoresContent } from "./BorradoresContent";

export const metadata: Metadata = {
  title: "Borradores del agente — Mapa Inestable",
  description: "Análisis diarios producidos por el agente automatizado de Mapa Inestable. Material en curso, no editado, sujeto a cambios.",
  // robots: index/follow — el listado de borradores es público y buscable
};

export default function BorradoresPage() {
  const drafts = getAllAgentDrafts();

  return (
    <Suspense
      fallback={
        <div style={{
          background:    "var(--mi-bg-paper)",
          minHeight:     "100vh",
          display:       "flex",
          alignItems:    "center",
          justifyContent:"center",
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color:         "var(--mi-ink-mute)",
        }}>
          Cargando borradores…
        </div>
      }
    >
      <BorradoresContent drafts={drafts} />
    </Suspense>
  );
}
