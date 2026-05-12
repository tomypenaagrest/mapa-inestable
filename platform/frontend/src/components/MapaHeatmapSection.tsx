"use client";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import MapaTorresGarcia from "./MapaTorresGarcia";
import HeatmapEjes, { type HeatmapCell, type WeekLabel } from "./HeatmapEjes";
import CountryPreviewPanel from "./CountryPreviewPanel";
import type { WeeklyCountryData } from "@/components/MapaCentrico";
import type { CountryAgenda } from "@/lib/agendas";

interface Props {
  weeklyCountries: WeeklyCountryData[];
  heatmapData: HeatmapCell[];
  weeks: WeekLabel[];
  agendasByCountry?: Record<string, CountryAgenda>;
}

export default function MapaHeatmapSection({ weeklyCountries, heatmapData, weeks, agendasByCountry }: Props) {
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
        height: "calc(100vh - 130px)",
        borderBottom: hoveredCountry ? "var(--mi-border-bold)" : undefined,
        position: "relative",
      }}>
        <div style={{
          flexShrink: 0,
          aspectRatio: "1280 / 1380",
          height: "100%",
          overflow: "hidden",
          borderRight: "var(--mi-border-thick)",
          position: "relative",
        }}>
          <MapaTorresGarcia
            variant="home"
            onCountryClick={handleClick}
            onCountryHover={handleHover}
          />
        </div>

        {/* Right panel: heatmap (default) or country preview (on hover) */}
        <div style={{
          flex: 1,
          minWidth: 220,
          maxWidth: 360,
          overflow: "hidden",
          position: "relative",
        }}>
          {hoveredCountry ? (
            <CountryPreviewPanel
              countrySlug={hoveredCountry}
              weeklyCountries={weeklyCountries}
              agendaSummary={agendasByCountry?.[hoveredCountry]}
              onClose={() => setHoveredCountry(null)}
            />
          ) : (
            <HeatmapEjes data={heatmapData} weeks={weeks} />
          )}
        </div>
      </div>
    </div>
  );
}
