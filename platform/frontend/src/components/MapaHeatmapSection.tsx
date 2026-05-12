"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import MapaTorresGarcia from "./MapaTorresGarcia";
import CountryPreviewPanel from "./CountryPreviewPanel";
import type { WeeklyCountryData } from "@/components/MapaCentrico";
import type { CountryAgenda } from "@/lib/agendas";

interface Props {
  weeklyCountries: WeeklyCountryData[];
  agendasByCountry?: Record<string, CountryAgenda>;
}

export default function MapaHeatmapSection({ weeklyCountries, agendasByCountry }: Props) {
  const router = useRouter();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleClick = useCallback((slug: string) => {
    router.push(`/pais/${slug}`);
  }, [router]);

  const handleHover = useCallback((slug: string | null) => {
    setHoveredCountry(slug);
  }, []);

  return (
    <div style={{
      border: "var(--mi-border-bold)",
      boxShadow: "var(--mi-shadow-card)",
      marginBottom: "var(--mi-space-5)",
      background: "var(--mi-bg-paper)",
    }}>
      {/* Mapa + panel preview */}
      <div style={{
        display: "flex",
        height: "var(--mi-mapa-max-h, calc(100vh - 100px))",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Mapa Torres García — height-driven, ancho derivado del aspect ratio */}
        <div style={{
          flexShrink: 0,
          aspectRatio: "1280 / 1380",
          height: "100%",
          overflow: "hidden",
          borderRight: hoveredCountry ? "var(--mi-border-thick)" : undefined,
          position: "relative",
          transition: "border 150ms var(--mi-ease)",
        }}>
          <MapaTorresGarcia
            variant="home"
            onCountryClick={handleClick}
            onCountryHover={handleHover}
          />
        </div>

        {/* Panel preview país — slide-in al hacer hover/click sobre el mapa */}
        <div style={{
          width: hoveredCountry ? "clamp(220px, 30%, 360px)" : 0,
          flexShrink: 0,
          overflow: "hidden",
          transition: "width 200ms cubic-bezier(0.2,0,0,1)",
          position: "relative",
        }}>
          {hoveredCountry && (
            <CountryPreviewPanel
              countrySlug={hoveredCountry}
              weeklyCountries={weeklyCountries}
              agendaSummary={agendasByCountry?.[hoveredCountry]}
              onClose={() => setHoveredCountry(null)}
            />
          )}
        </div>

      </div>
    </div>
  );
}
