"use client";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MapaTorresGarcia from "@/components/MapaTorresGarcia";
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

const AXIS_KEYS = Object.keys(AXIS_LABELS);

const ALL_COUNTRIES = [
  { slug: "ar", name: "Argentina" },
  { slug: "bo", name: "Bolivia" },
  { slug: "br", name: "Brasil" },
  { slug: "cl", name: "Chile" },
  { slug: "co", name: "Colombia" },
  { slug: "ec", name: "Ecuador" },
  { slug: "pe", name: "Perú" },
  { slug: "py", name: "Paraguay" },
  { slug: "uy", name: "Uruguay" },
  { slug: "ve", name: "Venezuela" },
];

export default function MapaExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activePais  = searchParams.getAll("pais");
  const activeEjes  = searchParams.getAll("eje");
  const activePeriod = searchParams.get("periodo") ?? "todos";

  function buildUrl(nextPais: string[], nextEjes: string[], period: string) {
    const p = new URLSearchParams();
    nextPais.forEach(s => p.append("pais", s));
    nextEjes.forEach(e => p.append("eje", e));
    if (period !== "todos") p.set("periodo", period);
    const q = p.toString();
    return `/mapa${q ? `?${q}` : ""}`;
  }

  const togglePais = useCallback((slug: string, additive = false) => {
    let next: string[];
    if (additive) {
      next = activePais.includes(slug)
        ? activePais.filter(s => s !== slug)
        : [...activePais, slug];
    } else {
      next = activePais.includes(slug) && activePais.length === 1
        ? []
        : [slug];
    }
    router.push(buildUrl(next, activeEjes, activePeriod));
  }, [router, activePais, activeEjes, activePeriod]);

  const handleCountryClick = useCallback((slug: string) => {
    togglePais(slug, false);
  }, [togglePais]);

  const toggleEje = useCallback((key: string) => {
    const next = activeEjes.includes(key)
      ? activeEjes.filter(e => e !== key)
      : [...activeEjes, key];
    router.push(buildUrl(activePais, next, activePeriod));
  }, [router, activePais, activeEjes, activePeriod]);

  const clearAll = useCallback(() => {
    router.push("/mapa");
  }, [router]);

  const hasFilters = activePais.length > 0 || activeEjes.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 120px)" }}>

      {/* Metabar */}
      <div style={{
        padding: "var(--mi-space-3) var(--mi-space-5)",
        borderBottom: "var(--mi-border-bold)",
        display: "flex",
        alignItems: "center",
        gap: "var(--mi-space-3)",
        background: "var(--mi-bg-paper)",
        flexWrap: "wrap",
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
          fontWeight: 700,
        }}>
          Mapa
        </span>
        <span style={{
          marginLeft: "auto",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
        }}>
          Click → filtrar · Shift+click → multi-select · Doble-click → ver ficha
        </span>
      </div>

      {/* Main: mapa + sidebar */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* Filtros laterales sticky */}
        <div style={{
          width: 240,
          flexShrink: 0,
          borderRight: "var(--mi-border-bold)",
          background: "var(--mi-bg-paper)",
          padding: "var(--mi-space-4) var(--mi-space-3)",
          position: "sticky",
          top: 0,
          height: "fit-content",
          overflowY: "auto",
          maxHeight: "100vh",
        }}>
          {/* Countries filter */}
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            textTransform: "uppercase",
            letterSpacing: "var(--mi-tracking-widest)",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-2)",
          }}>
            País
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--mi-space-1)", marginBottom: "var(--mi-space-4)" }}>
            {ALL_COUNTRIES.map(c => (
              <button
                key={c.slug}
                onClick={() => togglePais(c.slug)}
                style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "3px 8px",
                  border: `2px solid ${activePais.includes(c.slug) ? "var(--mi-ink)" : "var(--mi-rule-soft)"}`,
                  background: activePais.includes(c.slug) ? "var(--mi-ink)" : "transparent",
                  color: activePais.includes(c.slug) ? "var(--mi-bg-paper)" : "var(--mi-ink-soft)",
                  cursor: "pointer",
                }}
              >
                {c.slug.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Axes filter */}
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            textTransform: "uppercase",
            letterSpacing: "var(--mi-tracking-widest)",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-2)",
          }}>
            Eje
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-1)", marginBottom: "var(--mi-space-4)" }}>
            {AXIS_KEYS.map(key => (
              <button
                key={key}
                onClick={() => toggleEje(key)}
                style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: 10,
                  textAlign: "left",
                  padding: "4px 8px",
                  border: `2px solid ${activeEjes.includes(key) ? `var(--mi-axis-${key})` : "var(--mi-rule-soft)"}`,
                  background: activeEjes.includes(key) ? `var(--mi-axis-${key})` : "transparent",
                  color: activeEjes.includes(key) ? "white" : "var(--mi-ink-soft)",
                  cursor: "pointer",
                }}
              >
                {AXIS_LABELS[key]}
              </button>
            ))}
          </div>

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearAll}
              style={{
                width: "100%",
                fontFamily: "var(--mi-font-mono)",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "6px 8px",
                border: "2px solid var(--mi-ink)",
                background: "transparent",
                color: "var(--mi-ink)",
                cursor: "pointer",
              }}
            >
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {/* Map + results */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {/* Map */}
          <div style={{
            borderBottom: "var(--mi-border-bold)",
            padding: "var(--mi-space-4)",
            background: "var(--mi-bg-cream)",
          }}>
            <MapaTorresGarcia
              variant="explorer"
              filters={{ pais: activePais, eje: activeEjes }}
              onCountryClick={handleCountryClick}
            />
          </div>

          {/* Results */}
          <div style={{ padding: "var(--mi-space-5)" }}>
            {hasFilters ? (
              <ResultadosFiltrados pais={activePais} ejes={activeEjes} />
            ) : (
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                color: "var(--mi-ink-mute)",
                letterSpacing: "0.06em",
                textAlign: "center",
                padding: "var(--mi-space-5)",
              }}>
                Hacé click en un país o un eje para filtrar el corpus
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Resultados ───────────────────────────────────────────────────────────────

function ResultadosFiltrados({ pais, ejes }: { pais: string[]; ejes: string[] }) {
  // Placeholder — replace with real corpus query when backend is connected
  const paisLabel = pais.map(s => COUNTRY_NAMES[s] ?? s).join(", ");
  const ejeLabel  = ejes.join(", ");

  return (
    <div>
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        textTransform: "uppercase",
        letterSpacing: "var(--mi-tracking-widest)",
        color: "var(--mi-ink-mute)",
        marginBottom: "var(--mi-space-3)",
      }}>
        Resultados
        {paisLabel && ` · ${paisLabel}`}
        {ejeLabel && ` · ${ejeLabel}`}
      </div>

      {/* Placeholder cards — replace with real analysis cards from corpus */}
      <div style={{ color: "var(--mi-ink-mute)", fontFamily: "var(--mi-font-mono)", fontSize: "var(--mi-text-xs)" }}>
        Los resultados del corpus filtrado aparecerán aquí cuando el backend esté conectado.
        <br /><br />
        <Link
          href={`/analisis${pais.length === 1 ? `/${pais[0]}` : ""}`}
          style={{ textDecoration: "underline", color: "var(--mi-ink)" }}
        >
          Ver archivo completo →
        </Link>
      </div>
    </div>
  );
}
