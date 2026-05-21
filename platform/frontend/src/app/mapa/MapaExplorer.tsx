"use client";
// Spec 39 — MapaExplorer rediseñado: layout 3 zonas (rail | mapa + slider | drawer on-demand)

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MapaTorresGarcia from "@/components/MapaTorresGarcia";
import LayerController   from "@/components/LayerController";
import LayerLegend       from "@/components/LayerLegend";
import LayerReadingDrawer from "@/components/LayerReadingDrawer";
import type { ActiveCountryForLayer } from "@/components/LayerReadingDrawer";
import CountryModalPanel  from "@/components/CountryModalPanel";
import { COUNTRY_NAMES } from "@/lib/country-data";
import { getLayer, isLayerId } from "@/lib/layers";
import type { LayerId, LayerPeriod } from "@/lib/layers";
import type { ReadingGuides } from "@/lib/reading-guides";
import type { CountryAgenda } from "@/lib/agendas";
import type { WeeklyCountryData } from "@/components/MapaCentrico";

interface MapaExplorerProps {
  readingGuides: ReadingGuides;
  agendasByCountry: Record<string, CountryAgenda>;
  weeklyCountries: WeeklyCountryData[];
}

export default function MapaExplorer({ readingGuides, agendasByCountry, weeklyCountries }: MapaExplorerProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // ── Modal de país (cuando no hay capa activa) ──────────────────────────────
  const [modalSlug, setModalSlug] = useState<string | null>(null);

  // ── País seleccionado en modo capa (A.4) ──────────────────────────────────
  const [layerCountry, setLayerCountry] = useState<string | null>(null);

  // ── URL state ─────────────────────────────────────────────────────────────

  const activePais    = searchParams.getAll("pais");
  const activeEjes    = searchParams.getAll("eje");
  const activePeriodo = searchParams.get("periodo") ?? "todos";

  // Capa activa (query param ?capa=)
  const rawCapa      = searchParams.get("capa") ?? "";
  const activeLayerId: LayerId | null = isLayerId(rawCapa) ? rawCapa : null;

  // Fecha del slider (query param ?t=) — default: defaultPeriod de la capa activa
  const rawT = searchParams.get("t");
  const defaultSliderDate = activeLayerId
    ? getLayer(activeLayerId).defaultPeriod.date
    : "";
  const sliderDate = rawT ?? defaultSliderDate;

  // Drawer de guía de lectura (?guia=1)
  const guiaOpen  = searchParams.get("guia") === "1";

  // Estado local para mobile bottom sheet
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  // ── Helpers de URL ────────────────────────────────────────────────────────

  function buildUrl(opts: {
    pais?: string[];
    eje?: string[];
    periodo?: string;
    capa?: LayerId | null;
    t?: string;
    guia?: boolean;
  }) {
    const p = new URLSearchParams();
    const pais    = opts.pais    ?? activePais;
    const eje     = opts.eje     ?? activeEjes;
    const periodo = opts.periodo ?? activePeriodo;
    const capa    = "capa"  in opts ? opts.capa    : activeLayerId;
    const t       = "t"     in opts ? opts.t       : (rawT ?? null);
    const guia    = "guia"  in opts ? opts.guia    : guiaOpen;

    pais.forEach(s => p.append("pais", s));
    eje.forEach(e  => p.append("eje", e));
    if (periodo !== "todos") p.set("periodo", periodo);
    if (capa) p.set("capa", capa);
    if (capa && t) p.set("t", t);
    if (guia) p.set("guia", "1");
    const q = p.toString();
    return `/mapa${q ? `?${q}` : ""}`;
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  const togglePais = useCallback((slug: string) => {
    const next = activePais.includes(slug)
      ? activePais.filter(s => s !== slug)
      : [...activePais, slug];
    router.push(buildUrl({ pais: next }));
  }, [activePais, activeEjes, activePeriodo, activeLayerId, rawT, guiaOpen]);

  const toggleEje = useCallback((key: string) => {
    const next = activeEjes.includes(key)
      ? activeEjes.filter(e => e !== key)
      : [...activeEjes, key];
    router.push(buildUrl({ eje: next }));
  }, [activePais, activeEjes, activePeriodo, activeLayerId, rawT, guiaOpen]);

  const handleCountryClick = useCallback((slug: string) => {
    if (!activeLayerId) {
      // Sin capa: abre el modal de país
      setModalSlug(slug);
    } else {
      // Con capa: abre el drawer A.4 con datos del país
      setLayerCountry(prev => prev === slug ? null : slug);
    }
  }, [activeLayerId]);

  const handleLayerChange = useCallback((id: LayerId | null) => {
    setLayerCountry(null);
    if (id === null) {
      router.push(buildUrl({ capa: null, t: undefined, guia: false }));
    } else {
      const defaultT = getLayer(id).defaultPeriod.date;
      router.push(buildUrl({ capa: id, t: defaultT, guia: false }));
    }
  }, [activePais, activeEjes, activePeriodo]);

  const handleSliderChange = useCallback((date: string) => {
    router.replace(buildUrl({ t: date }), { scroll: false });
  }, [activePais, activeEjes, activePeriodo, activeLayerId, guiaOpen]);

  const handleOpenGuide  = useCallback(() => router.push(buildUrl({ guia: true })),  [activePais, activeEjes, activePeriodo, activeLayerId, rawT]);
  const handleCloseGuide = useCallback(() => router.push(buildUrl({ guia: false })), [activePais, activeEjes, activePeriodo, activeLayerId, rawT]);

  const clearAll = useCallback(() => router.push("/mapa"), [router]);

  // ── Capa activa + período ─────────────────────────────────────────────────

  const activeLayer = activeLayerId ? getLayer(activeLayerId) : null;
  const activePeriod: LayerPeriod | null = activeLayer
    ? (activeLayer.getLastPeriodBefore(sliderDate) ?? null)
    : null;

  const activeLayerProps = activeLayer && activePeriod
    ? { layer: activeLayer, period: activePeriod }
    : undefined;

  const activePeriodIndex = activePeriod && activeLayer
    ? activeLayer.periods.findIndex(p => p.date === activePeriod.date)
    : -1;

  const handlePrevPeriod = useCallback(() => {
    if (!activeLayer || activePeriodIndex <= 0) return;
    handleSliderChange(activeLayer.periods[activePeriodIndex - 1].date);
  }, [activeLayer, activePeriodIndex, handleSliderChange]);

  const handleNextPeriod = useCallback(() => {
    if (!activeLayer || activePeriodIndex < 0 || activePeriodIndex >= activeLayer.periods.length - 1) return;
    handleSliderChange(activeLayer.periods[activePeriodIndex + 1].date);
  }, [activeLayer, activePeriodIndex, handleSliderChange]);

  const hasFilters = activePais.length > 0 || activeEjes.length > 0;

  return (
    <>
      {/* Layout principal — llena el viewport debajo del header */}
      <div style={{
        display: "flex",
        height: "calc(100vh - var(--mi-header-h))",
        overflow: "hidden",
      }}>

        {/* ── Rail izquierdo ── */}
        <LayerController
          activeLayerId={activeLayerId}
          onLayerChange={handleLayerChange}
          periodNav={activeLayer && activePeriod ? {
            layer: activeLayer,
            activePeriod,
            onPrevPeriod: handlePrevPeriod,
            onNextPeriod: handleNextPeriod,
            hasPrev: activePeriodIndex > 0,
            hasNext: activePeriodIndex >= 0 && activePeriodIndex < activeLayer.periods.length - 1,
          } : undefined}
        />

        {/* ── Área central: mapa + slider + resultados (solo si hay filtros) ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Mapa — flex: 1, llena el espacio disponible */}
          <div style={{
            flex: 1,
            position: "relative",
            background: "var(--mi-bg-cream)",
            overflow: "hidden",
            minHeight: 0,
          }}>
            <MapaTorresGarcia
              variant="explorer"
              filters={{ pais: activePais, eje: activeEjes }}
              activeLayer={activeLayerProps}
              onCountryClick={handleCountryClick}
            />

            {/* Leyenda flotante — superior derecha */}
            {activeLayer && activePeriod && (
              <LayerLegend
                layer={activeLayer}
                period={activePeriod}
                sliderDate={sliderDate}
                onOpenReadingGuide={handleOpenGuide}
              />
            )}
          </div>

          {/* Resultados — solo cuando hay filtros activos */}
          {hasFilters && (
            <div style={{
              padding:    "var(--mi-space-4) var(--mi-space-5)",
              borderTop:  "var(--mi-border-bold)",
              overflowY:  "auto",
              maxHeight:  "28vh",
              background: "var(--mi-bg-paper)",
              flexShrink: 0,
            }}>
              <ResultadosFiltrados pais={activePais} ejes={activeEjes} />
            </div>
          )}
        </div>
      </div>

      {/* ── Modal de país (sin capa activa) ── */}
      {modalSlug && !activeLayerId && (
        <CountryModalPanel
          countrySlug={modalSlug}
          weeklyCountries={weeklyCountries}
          agendaSummary={agendasByCountry[modalSlug]}
          onClose={() => setModalSlug(null)}
        />
      )}

      {/* ── Drawer de país con capa activa (A.4) ── */}
      {layerCountry && activeLayer && activePeriod && (
        <LayerReadingDrawer
          layerId={activeLayerId!}
          readingGuides={readingGuides}
          onClose={() => setLayerCountry(null)}
          activeCountry={{
            layer: activeLayer,
            countrySlug: layerCountry,
            countryName: COUNTRY_NAMES[layerCountry] ?? layerCountry,
            period: activePeriod,
          }}
        />
      )}

      {/* ── Reading drawer genérico (guía de lectura) ── */}
      {guiaOpen && activeLayerId && !layerCountry && (
        <LayerReadingDrawer
          layerId={activeLayerId}
          readingGuides={readingGuides}
          onClose={handleCloseGuide}
        />
      )}
    </>
  );
}

// ── Resultados ───────────────────────────────────────────────────────────────

function ResultadosFiltrados({ pais, ejes }: { pais: string[]; ejes: string[] }) {
  const paisLabel = pais.map(s => COUNTRY_NAMES[s] ?? s).join(", ");
  const ejeLabel  = ejes.join(", ");

  return (
    <div>
      <div style={{
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "var(--mi-text-xs)",
        textTransform: "uppercase",
        letterSpacing: "var(--mi-tracking-widest)",
        color:         "var(--mi-ink-mute)",
        marginBottom:  "var(--mi-space-3)",
      }}>
        Resultados
        {paisLabel && ` · ${paisLabel}`}
        {ejeLabel  && ` · ${ejeLabel}`}
      </div>
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
