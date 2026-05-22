import type { Metadata } from "next";
import { Suspense } from "react";
import MapaExplorer from "./MapaExplorer";
import { getReadingGuides } from "@/lib/reading-guides";
import { getAllCountryAgendas } from "@/lib/agendas";
import { getHomeData } from "@/lib/home";
import { getOnboardingContent } from "@/lib/onboarding-content";

export const metadata: Metadata = {
  title: "Mapa analítico",
  description: "Explorador de capas analíticas sobre Sudamérica: crecimiento económico, salario real, orientación político-económica y confianza institucional.",
};

export default function MapaPage() {
  const readingGuides      = getReadingGuides();
  const agendasByCountry   = getAllCountryAgendas();
  const { weeklyCountries } = getHomeData();
  const onboardingContent  = getOnboardingContent();

  return (
    <Suspense fallback={
      <div style={{
        padding: "var(--mi-space-8)",
        fontFamily: "var(--mi-font-mono)",
        fontSize:   "var(--mi-text-xs)",
        color:      "var(--mi-ink-mute)",
        textAlign:  "center",
      }}>
        Cargando mapa…
      </div>
    }>
      <MapaExplorer
        readingGuides={readingGuides}
        agendasByCountry={agendasByCountry}
        weeklyCountries={weeklyCountries}
        onboardingContent={onboardingContent}
      />
    </Suspense>
  );
}
