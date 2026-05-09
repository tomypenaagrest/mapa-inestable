"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MapaCentrico, { type WeeklyCountryData } from "@/components/MapaCentrico";
import { COUNTRY_NAMES } from "@/lib/country-data";
import Link from "next/link";

const AXIS_LABELS: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Erosión de mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación epistemológica",
  atencion:          "Atención",
};

interface Props {
  weeklyCountries: WeeklyCountryData[];
}

export default function MapaExplorer({ weeklyCountries }: Props) {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = (iso: string) => {
    router.push(`/pais/${iso}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", minHeight: 500 }}>
      {/* Metabar */}
      <div style={{
        padding: "var(--mi-space-3) var(--mi-space-5)",
        borderBottom: "var(--mi-border-bold)",
        display: "flex",
        alignItems: "center",
        gap: "var(--mi-space-3)",
        background: "var(--mi-bg-paper)",
      }}>
        <Link href="/" style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          letterSpacing: "0.06em",
        }}>
          ← Inicio
        </Link>
        <span style={{ color: "var(--mi-ink-mute)", fontSize: 10 }}>·</span>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "0.06em",
          color: "var(--mi-ink)",
        }}>
          Mapa
        </span>
        <span style={{
          marginLeft: "auto",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          letterSpacing: "0.04em",
        }}>
          {weeklyCountries.length} países esta semana · click para ver ficha
        </span>
      </div>

      {/* Map + legend */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Map */}
        <div style={{ flex: 1, overflow: "hidden", borderRight: "var(--mi-border-bold)" }}>
          <MapaCentrico
            weeklyCountries={weeklyCountries}
            selectedCountry={hovered}
            onCountryClick={handleClick}
            height={600}
          />
        </div>

        {/* Country list sidebar */}
        <div style={{
          width: 220,
          overflowY: "auto",
          padding: "var(--mi-space-3)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--mi-space-1)",
          background: "var(--mi-bg-paper)",
        }}>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-2)",
          }}>
            Esta semana
          </div>
          {weeklyCountries.map(c => (
            <Link
              key={c.slug}
              href={`/pais/${c.slug}`}
              onMouseEnter={() => setHovered(c.slug)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: "var(--mi-space-2)",
                border: "var(--mi-border-soft)",
                background: hovered === c.slug ? "var(--mi-bg-cream)" : "transparent",
                transition: "background 120ms",
              }}
            >
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                color: "var(--mi-ink)",
                letterSpacing: "0.04em",
              }}>
                {COUNTRY_NAMES[c.slug] ?? c.slug}
              </span>
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "10px",
                color: "var(--mi-ink-mute)",
                letterSpacing: "0.03em",
              }}>
                {AXIS_LABELS[c.axisKey] ?? c.axisKey}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
