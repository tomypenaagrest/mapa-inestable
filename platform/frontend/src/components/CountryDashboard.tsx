"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import Link from "next/link";
import IndicatorCard from "@/components/IndicatorCard";
import MacroIndicatorCard from "@/components/MacroIndicatorCard";
import HeatmapEjes, { type HeatmapCell, type WeekLabel } from "@/components/HeatmapEjes";
import type { AxisIntensity, Source } from "@/lib/country-data";
import type { AnalysisSummary } from "@/lib/analisis";
import type { Indicator, IndicatorCountryData } from "@/lib/latinobarometro";
import type { MacroIndicator, MacroCountryData } from "@/lib/macro-indicators";
import type { CountryAgenda, Agenda } from "@/lib/agendas";
import type { AgentDraftMeta } from "@/lib/content";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TABS = [
  { slug: "publicaciones", label: "Publicaciones" },
  { slug: "agenda",        label: "Agenda" },
  { slug: "diagnostico",   label: "Diagnóstico" },
  { slug: "pulso",         label: "Pulso ciudadano" },
  { slug: "estructura",    label: "Estructura material" },
  { slug: "contexto",      label: "Contexto" },
  { slug: "fuentes",       label: "Fuentes" },
] as const;

type TabSlug = (typeof TABS)[number]["slug"];

const AXIS_ORDER = [
  { displayKey: "desrepresentacion", label: "Desrepresentación" },
  { displayKey: "mediaciones",       label: "Erosión de mediaciones" },
  { displayKey: "desorientacion",    label: "Desorientación epistemológica" },
  { displayKey: "deculturacion",     label: "Deculturación" },
  { displayKey: "atencion",          label: "Atención" },
  { displayKey: "contexto",          label: "Contexto · variable de lectura" },
] as const;

const AXIS_KEY_MAP: Record<string, string> = {
  "desrepresentacion":             "desrepresentacion",
  "erosion-mediaciones":           "mediaciones",
  "desorientacion-epistemologica": "desorientacion",
  "deculturacion":                 "deculturacion",
  "atencion":                      "atencion",
  "contexto":                      "contexto",
};

const SOURCE_TYPE_LABEL: Record<Source["type"], string> = {
  hegemonic:   "Hegemónico",
  alternative: "Alternativo",
  analysis:    "Análisis",
};

function toDisplayKey(raw: string): string {
  return AXIS_KEY_MAP[raw] ?? raw;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────

type LBIndicator = Indicator & { country: IndicatorCountryData };
type MacroIndicatorFull = MacroIndicator & { country: MacroCountryData };

export interface CountryDashboardProps {
  slug: string;
  name: string;
  centralQuestion: string | null;
  ejes: AxisIntensity[];
  fuentes: Source[];
  analyses: AnalysisSummary[];
  tensionesHtml: string | null;
  preguntaHtml: string | null;
  contextSections: { heading: string; html: string }[];
  lbIndicators: LBIndicator[];
  lbMeta: { wave_label: string; fieldwork: string; n_total: number; codebook_url: string };
  macroIndicators: MacroIndicatorFull[];
  macroFamilies: readonly { key: string; label: string }[];
  macroMeta: { year_start: number; year_end: number; computed_at: string };
  initialTab: string;
  agenda?: CountryAgenda | null;
  agentDrafts?: AgentDraftMeta[];
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const mono: CSSProperties = {
  fontFamily: "var(--mi-font-mono)",
  fontSize:   "var(--mi-text-xs)",
  letterSpacing: "var(--mi-tracking-wide)",
  textTransform: "uppercase",
  color: "var(--mi-ink-mute)",
};

const sectionTitle: CSSProperties = {
  fontFamily:    "var(--mi-font-display)",
  fontSize:      "var(--mi-text-xl)",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  color:         "var(--mi-ink)",
  borderBottom:  "var(--mi-border-bold)",
  paddingBottom: "var(--mi-space-2)",
  marginBottom:  "var(--mi-space-5)",
};

// ─── UTILITIES ────────────────────────────────────────────────────────────────

function buildHeatmapData(analyses: AnalysisSummary[]): { data: HeatmapCell[]; weeks: WeekLabel[] } {
  const weekMap = new Map<string, WeekLabel>();
  for (const a of analyses) {
    const k = `${a.year}-${String(a.week).padStart(2, "0")}`;
    weekMap.set(k, { week: a.week, year: a.year, label: `S${a.week}` });
  }
  const weeks = Array.from(weekMap.values())
    .sort((a, b) => a.year !== b.year ? a.year - b.year : a.week - b.week)
    .slice(-18);

  const countMap = new Map<string, number>();
  for (const a of analyses) {
    const k = `${a.axisKey}|${a.week}|${a.year}`;
    countMap.set(k, (countMap.get(k) ?? 0) + 1);
  }
  const data: HeatmapCell[] = Array.from(countMap.entries()).map(([k, count]) => {
    const parts = k.split("|");
    return { axisKey: parts[0], week: parseInt(parts[1]), year: parseInt(parts[2]), count };
  });

  return { data, weeks };
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function CountryDashboard({
  slug, name, centralQuestion, ejes, fuentes, analyses,
  tensionesHtml, preguntaHtml, contextSections,
  lbIndicators, lbMeta, macroIndicators, macroFamilies, macroMeta,
  initialTab, agenda, agentDrafts,
}: CountryDashboardProps) {
  const router   = useRouter();
  const pathname = usePathname();

  const [activeTab,    setActiveTab]    = useState<TabSlug>(
    TABS.find(t => t.slug === initialTab)?.slug ?? "publicaciones"
  );
  const [condensed,    setCondensed]    = useState(false);
  const [isMobile,     setIsMobile]     = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll  = () => setCondensed(window.scrollY > 80);
    const onResize  = () => setIsMobile(window.innerWidth <= 640);
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function handleTabChange(tab: TabSlug) {
    setActiveTab(tab);
    setDropdownOpen(false);
    router.push(`${pathname}?tab=${tab}`, { scroll: false });
  }

  const activeAxesCount = ejes.filter(e => e.intensity >= 3).length;

  return (
    <div>
      {/* ── STICKY SHELL ─────────────────────────────────────────────────── */}
      <div style={{
        position:   "sticky",
        top:        0,
        zIndex:     40,
        background: "var(--mi-bg-paper)",
      }}>

        {/* Full header */}
        {!condensed && (
          <div
            className="mi-container"
            style={{
              padding:      "var(--mi-space-6) var(--mi-space-6) 0",
              borderBottom: "var(--mi-border-soft)",
            }}
          >
            <h1 style={{
              fontFamily:    "var(--mi-font-display)",
              fontSize:      "clamp(48px, 8vw, 72px)",
              lineHeight:    0.9,
              letterSpacing: "-0.03em",
              color:         "var(--mi-ink)",
              textTransform: "uppercase",
            }}>
              {name}
            </h1>

            {centralQuestion && (
              <p style={{
                fontFamily: "var(--mi-font-title)",
                fontStyle:  "italic",
                fontSize:   "clamp(16px, 2.2vw, 22px)",
                lineHeight: 1.35,
                color:      "var(--mi-ink-soft)",
                marginTop:  "var(--mi-space-3)",
                maxWidth:   "65ch",
              }}>
                {centralQuestion}
              </p>
            )}

            {/* Meta row */}
            <div style={{
              ...mono,
              display:      "flex",
              gap:          "var(--mi-space-5)",
              marginTop:    "var(--mi-space-3)",
              marginBottom: "var(--mi-space-3)",
              flexWrap:     "wrap",
            }}>
              <span>{analyses.length} análisis</span>
              {analyses[0]?.date && <span>última: {analyses[0].date}</span>}
              <span>{activeAxesCount} ejes activos</span>
            </div>

            {/* Frame strip */}
            {ejes.filter(e => e.intensity >= 2).length > 0 && (
              <div style={{
                ...mono,
                display:       "flex",
                flexWrap:      "wrap",
                gap:           "var(--mi-space-3)",
                alignItems:    "center",
                paddingBottom: "var(--mi-space-4)",
              }}>
                <span>Ejes crónicos ▸</span>
                {ejes.filter(e => e.intensity >= 2).map(eje => (
                  <Link
                    key={eje.key}
                    href={`/ejes/${eje.key}?pais=${slug}`}
                    style={{
                      color:          `var(--mi-axis-${eje.key})`,
                      borderBottom:   `1px solid var(--mi-axis-${eje.key})`,
                      textDecoration: "none",
                      fontFamily:     "var(--mi-font-mono)",
                      fontSize:       "var(--mi-text-xs)",
                      letterSpacing:  "var(--mi-tracking-wide)",
                      textTransform:  "uppercase",
                    }}
                  >
                    {eje.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Condensed header */}
        {condensed && (
          <div
            className="mi-container"
            style={{
              padding:      "10px var(--mi-space-6)",
              display:      "flex",
              alignItems:   "center",
              gap:          "var(--mi-space-4)",
              borderBottom: "var(--mi-border-soft)",
            }}
          >
            <span style={{
              fontFamily:    "var(--mi-font-display)",
              fontSize:      30,
              lineHeight:    1,
              textTransform: "uppercase",
              color:         "var(--mi-ink)",
              flexShrink:    0,
            }}>
              {name}
            </span>
            {centralQuestion && !isMobile && (
              <span style={{
                fontFamily: "var(--mi-font-title)",
                fontStyle:  "italic",
                fontSize:   14,
                color:      "var(--mi-ink-soft)",
                overflow:   "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}>
                {centralQuestion}
              </span>
            )}
          </div>
        )}

        {/* Tab bar */}
        <div style={{ borderBottom: "var(--mi-border-bold)", background: "var(--mi-bg-paper)" }}>
          <div className="mi-container">
            {isMobile ? (
              /* Mobile dropdown */
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    width:           "100%",
                    display:         "flex",
                    justifyContent:  "space-between",
                    alignItems:      "center",
                    padding:         "12px 0",
                    background:      "none",
                    border:          "none",
                    cursor:          "pointer",
                    ...mono,
                    color:           "var(--mi-ink)",
                  }}
                >
                  <span>▸ {TABS.find(t => t.slug === activeTab)?.label}</span>
                  <span>{dropdownOpen ? "▲" : "▼"}</span>
                </button>
                {dropdownOpen && (
                  <div style={{
                    position:   "absolute",
                    top:        "100%",
                    left:       "-1rem",
                    right:      "-1rem",
                    background: "var(--mi-bg-paper)",
                    border:     "var(--mi-border-thick)",
                    boxShadow:  "var(--mi-shadow-card)",
                    zIndex:     50,
                  }}>
                    {TABS.map(tab => (
                      <button
                        key={tab.slug}
                        onClick={() => handleTabChange(tab.slug)}
                        style={{
                          width:        "100%",
                          display:      "block",
                          textAlign:    "left",
                          padding:      "12px var(--mi-space-4)",
                          background:   activeTab === tab.slug ? "var(--mi-bg-cream)" : "none",
                          border:       "none",
                          borderBottom: "var(--mi-border-dashed)",
                          cursor:       "pointer",
                          ...mono,
                          color: activeTab === tab.slug ? "var(--mi-ink)" : "var(--mi-ink-mute)",
                        }}
                      >
                        {activeTab === tab.slug ? `▸ ${tab.label}` : tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Desktop tab bar */
              <div style={{ display: "flex", overflowX: "auto" }}>
                {TABS.map(tab => {
                  const active = activeTab === tab.slug;
                  return (
                    <button
                      key={tab.slug}
                      onClick={() => handleTabChange(tab.slug)}
                      style={{
                        padding:       "12px var(--mi-space-4)",
                        background:    "none",
                        border:        "none",
                        borderBottom:  active ? "3px solid var(--mi-ink)" : "3px solid transparent",
                        cursor:        "pointer",
                        whiteSpace:    "nowrap",
                        ...mono,
                        color: active ? "var(--mi-ink)" : "var(--mi-ink-mute)",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────────────────────── */}
      <div
        className="mi-container"
        style={{ paddingTop: "var(--mi-space-7)", paddingBottom: "var(--mi-space-8)" }}
      >
        {activeTab === "publicaciones" && (
          <TabPublicaciones analyses={analyses} ejes={ejes} slug={slug} name={name} agentDrafts={agentDrafts} />
        )}
        {activeTab === "agenda" && (
          <TabAgenda agenda={agenda ?? null} />
        )}
        {activeTab === "diagnostico" && (
          <TabDiagnostico
            tensionesHtml={tensionesHtml}
            preguntaHtml={preguntaHtml}
            ejes={ejes}
            analyses={analyses}
          />
        )}
        {activeTab === "pulso" && (
          <TabPulso indicators={lbIndicators} lbMeta={lbMeta} name={name} />
        )}
        {activeTab === "estructura" && (
          <TabEstructura
            indicators={macroIndicators}
            families={macroFamilies}
            macroMeta={macroMeta}
            name={name}
          />
        )}
        {activeTab === "contexto" && (
          <TabContexto sections={contextSections} />
        )}
        {activeTab === "fuentes" && (
          <TabFuentes fuentes={fuentes} />
        )}
      </div>
    </div>
  );
}

// ─── TAB: PUBLICACIONES ───────────────────────────────────────────────────────

function TabPublicaciones({
  analyses,
  ejes,
  slug,
  name,
  agentDrafts,
}: {
  analyses:    AnalysisSummary[];
  ejes:        AxisIntensity[];
  slug:        string;
  name:        string;
  agentDrafts?: AgentDraftMeta[];
}) {
  const [period,      setPeriod]      = useState("recientes");
  const [activeAxes,  setActiveAxes]  = useState<string[]>([]);

  const years = [...new Set(analyses.map(a => a.year))].sort((a, b) => b - a);
  const recentCut = Math.min(8, analyses.length);

  if (analyses.length === 0) {
    return (
      <p style={{ ...mono, color: "var(--mi-ink-mute)", padding: "var(--mi-space-6) 0" }}>
        Próximamente — primer análisis en preparación.
      </p>
    );
  }

  const periodChips = [
    { value: "recientes", label: `Recientes (${recentCut})` },
    ...years.map(y => ({
      value: String(y),
      label: `${y} (${analyses.filter(a => a.year === y).length})`,
    })),
    ...(analyses.length > recentCut
      ? [{ value: "all", label: `Todas (${analyses.length})` }]
      : []),
  ];

  const byPeriod = (() => {
    if (period === "recientes") return analyses.slice(0, recentCut);
    if (period === "all")       return analyses;
    return analyses.filter(a => a.year === parseInt(period));
  })();

  const filtered = activeAxes.length === 0
    ? byPeriod
    : byPeriod.filter(a => activeAxes.includes(a.axisKey));

  function toggleAxis(key: string) {
    setActiveAxes(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  return (
    <div>
      {/* Temporal chips */}
      <div style={{ display: "flex", gap: "var(--mi-space-2)", flexWrap: "wrap", marginBottom: "var(--mi-space-4)" }}>
        {periodChips.map(chip => {
          const active = period === chip.value;
          return (
            <button
              key={chip.value}
              onClick={() => setPeriod(chip.value)}
              style={{
                padding:    "4px 12px",
                border:     active ? "var(--mi-border-bold)" : "var(--mi-border-thick)",
                background: active ? "var(--mi-ink)"         : "var(--mi-bg-paper)",
                color:      active ? "var(--mi-bg-paper)"    : "var(--mi-ink-mute)",
                cursor:     "pointer",
                ...mono,
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Axis pills */}
      {ejes.length > 0 && (
        <div style={{ display: "flex", gap: "var(--mi-space-2)", flexWrap: "wrap", marginBottom: "var(--mi-space-5)" }}>
          {ejes.map(eje => {
            const active = activeAxes.includes(eje.key);
            return (
              <button
                key={eje.key}
                onClick={() => toggleAxis(eje.key)}
                style={{
                  padding:       "3px 10px",
                  border:        `2px solid var(--mi-axis-${eje.key})`,
                  background:    active ? `var(--mi-axis-${eje.key})` : "transparent",
                  color:         active ? "var(--mi-bg-paper)" : `var(--mi-axis-${eje.key})`,
                  cursor:        "pointer",
                  fontFamily:    "var(--mi-font-mono)",
                  fontSize:      "var(--mi-text-xs)",
                  letterSpacing: "var(--mi-tracking-wide)",
                  textTransform: "uppercase",
                }}
              >
                {eje.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ ...mono, color: "var(--mi-ink-mute)", padding: "var(--mi-space-5) 0" }}>
          No hay análisis que coincidan con los filtros seleccionados.
          {" "}Probá ampliar el período o quitar un eje.
        </p>
      ) : (
        <div style={{
          display:               "grid",
          gridTemplateColumns:   "repeat(auto-fill, minmax(280px, 1fr))",
          gap:                   "var(--mi-space-4)",
        }}>
          {filtered.map(a => (
            <AnalysisCard key={a.slug} a={a} slug={slug} />
          ))}
        </div>
      )}

      {/* Borradores del agente para este país */}
      {agentDrafts && agentDrafts.length > 0 && (
        <details style={{ marginTop: "var(--mi-space-7)" }}>
          <summary style={{
            ...mono,
            cursor:        "pointer",
            color:         "var(--mi-ink-mute)",
            padding:       "var(--mi-space-3) 0",
            borderTop:     "var(--mi-border-dashed)",
            listStyle:     "none",
            display:       "flex",
            justifyContent:"space-between",
            alignItems:    "center",
          }}>
            <span>Borradores del agente sobre {name}</span>
            <span style={{ color: "var(--mi-ink-mute)" }}>
              {agentDrafts.length} {agentDrafts.length === 1 ? "borrador" : "borradores"} ▾
            </span>
          </summary>
          <div style={{
            marginTop:           "var(--mi-space-4)",
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap:                 "var(--mi-space-3)",
          }}>
            {agentDrafts.map(d => (
              <Link
                key={d.slug}
                href={`/analisis/borradores/${d.countrySlug}/${d.pieceSlug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article style={{
                  border:        "var(--mi-border-thick)",
                  background:    "var(--mi-bg-paper)",
                  padding:       "var(--mi-space-3)",
                  boxShadow:     "var(--mi-shadow-card)",
                  display:       "flex",
                  flexDirection: "column",
                  gap:           "var(--mi-space-2)",
                }}>
                  <div style={{ display: "flex", gap: "var(--mi-space-2)", alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{
                      ...mono,
                      fontSize:   "10px",
                      color:      "var(--mi-bg-paper)",
                      background: d.estado === "promovido" ? "var(--mi-accent-gold)" : "var(--mi-ink)",
                      padding:    "1px 5px",
                      fontWeight: 700,
                    }}>
                      {d.estado === "promovido" ? "Promovido" : d.estado === "en-edicion" ? "En edición" : "Borrador"}
                    </span>
                    <span style={{ ...mono, fontSize: "10px", color: "var(--mi-ink-mute)" }}>
                      {d.date}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: "var(--mi-font-title)",
                    fontWeight: 600,
                    fontSize:   "var(--mi-text-base)",
                    lineHeight: "var(--mi-leading-snug)",
                    color:      "var(--mi-ink)",
                    margin:     0,
                  }}>
                    {d.title}
                  </h3>
                </article>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "var(--mi-space-3)" }}>
            <Link
              href="/analisis/borradores"
              style={{
                ...mono,
                color:         "var(--mi-ink-mute)",
                borderBottom:  "1px solid var(--mi-ink-mute)",
                textDecoration:"none",
                paddingBottom: 1,
              }}
            >
              Ver todos los borradores →
            </Link>
          </div>
        </details>
      )}
    </div>
  );
}

function AnalysisCard({ a, slug }: { a: AnalysisSummary; slug: string }) {
  const isPublication = a.tipo === "publicacion" || a.tipo === "despacho";
  const detailHref = isPublication ? `/publicaciones/${a.slug}` : `/analisis/${slug}/${a.slug}`;

  return (
    <article style={{
      border:         "var(--mi-border-thick)",
      background:     "var(--mi-bg-paper)",
      padding:        "var(--mi-space-4)",
      boxShadow:      "var(--mi-shadow-card)",
      display:        "flex",
      flexDirection:  "column",
      gap:            "var(--mi-space-3)",
      position:       "relative",
    }}>
      {/* Axis top stripe */}
      <div style={{
        position:   "absolute",
        top: -1, left: -1, right: -1,
        height:     4,
        background: `var(--mi-axis-${a.axisKey})`,
      }} />

      <div style={{ ...mono, color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-1)" }}>
        {a.date} · Sem {a.week}
      </div>

      <h3 style={{
        fontFamily: "var(--mi-font-title)",
        fontWeight: 600,
        fontSize:   "var(--mi-text-xl)",
        lineHeight: "var(--mi-leading-snug)",
        color:      "var(--mi-ink)",
        flex:       1,
      }}>
        <Link
          href={detailHref}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          {a.title}
        </Link>
      </h3>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{
          display:       "inline-block",
          background:    `var(--mi-axis-${a.axisKey})`,
          color:         "var(--mi-bg-paper)",
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          padding:       "2px 8px",
        }}>
          {a.axis}
        </span>
        <div style={{ display: "flex", gap: "var(--mi-space-3)", alignItems: "center" }}>
          {isPublication && a.substackUrl && (
            <a
              href={a.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:    "var(--mi-font-mono)",
                fontSize:      "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wider)",
                textTransform: "uppercase",
                color:         "var(--mi-ink-mute)",
                textDecoration: "none",
              }}
            >
              ↗ Substack
            </a>
          )}
          <Link
            href={detailHref}
            style={{
              fontFamily:    "var(--mi-font-mono)",
              fontSize:      "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wider)",
              textTransform: "uppercase",
              color:         "var(--mi-ink)",
              borderBottom:  "2px solid var(--mi-ink)",
              paddingBottom: 2,
              textDecoration: "none",
            }}
          >
            Leer →
          </Link>
        </div>
      </div>
    </article>
  );
}

// ─── TAB: DIAGNÓSTICO ─────────────────────────────────────────────────────────

function TabDiagnostico({
  tensionesHtml,
  preguntaHtml,
  ejes,
  analyses,
}: {
  tensionesHtml: string | null;
  preguntaHtml:  string | null;
  ejes:          AxisIntensity[];
  analyses:      AnalysisSummary[];
}) {
  const { data: heatmapData, weeks } = buildHeatmapData(analyses);

  return (
    <div style={{ display: "flex", gap: "var(--mi-space-7)", alignItems: "start", flexWrap: "wrap" }}>

      {/* Main column */}
      <div style={{ flex: "1 1 400px", minWidth: 0 }}>

        {tensionesHtml && (
          <section style={{ marginBottom: "var(--mi-space-7)" }}>
            <h2 style={sectionTitle}>Diagnóstico estructural</h2>
            <div className="mi-prose" dangerouslySetInnerHTML={{ __html: tensionesHtml }} />
          </section>
        )}

        {preguntaHtml && (
          <div style={{
            background: "var(--mi-bg-dark)",
            border:     "var(--mi-border-bold)",
            padding:    "var(--mi-space-5)",
            boxShadow:  "var(--mi-shadow-hero)",
            marginBottom: "var(--mi-space-7)",
          }}>
            <div style={{ ...mono, color: "var(--mi-accent-gold)", marginBottom: "var(--mi-space-3)" }}>
              Pregunta central
            </div>
            <div
              className="mi-prose"
              style={{ "--mi-ink": "var(--mi-bg-paper)" } as CSSProperties}
              dangerouslySetInnerHTML={{ __html: preguntaHtml }}
            />
          </div>
        )}

        {weeks.length > 0 && (
          <section>
            <h2 style={sectionTitle}>Matriz eje × semana</h2>
            <div style={{ border: "var(--mi-border-thick)", background: "var(--mi-bg-cream)" }}>
              <HeatmapEjes data={heatmapData} weeks={weeks} />
            </div>
            <p style={{ ...mono, color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-2)" }}>
              {weeks.length} semanas · click en celda navega al análisis
            </p>
          </section>
        )}

        {!tensionesHtml && !preguntaHtml && weeks.length === 0 && (
          <p style={{ ...mono, color: "var(--mi-ink-mute)", padding: "var(--mi-space-6) 0" }}>
            Diagnóstico en preparación.
          </p>
        )}
      </div>

      {/* Sidebar: ejes crónicos */}
      {ejes.length > 0 && (
        <aside style={{ flex: "0 0 320px", minWidth: 0 }}>
          <h2 style={sectionTitle}>Ejes crónicos</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-3)" }}>
            {ejes.map(eje => (
              <ChronicAxisCard key={eje.key} eje={eje} analyses={analyses} />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

function ChronicAxisCard({ eje, analyses }: { eje: AxisIntensity; analyses: AnalysisSummary[] }) {
  const byAxis = analyses.filter(a => a.axisKey === eje.key);
  const freq   = analyses.length > 0 ? Math.round((byAxis.length / analyses.length) * 100) : 0;
  const last   = byAxis[0];

  return (
    <div style={{
      background: "var(--mi-bg-cream)",
      border:     "var(--mi-border-thick)",
      padding:    "var(--mi-space-4)",
      boxShadow:  "var(--mi-shadow-card)",
    }}>
      <div style={{
        display:       "inline-block",
        background:    `var(--mi-axis-${eje.key})`,
        color:         "var(--mi-bg-paper)",
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        padding:       "2px 8px",
        marginBottom:  "var(--mi-space-3)",
      }}>
        {eje.label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-1)" }}>
        <div style={mono}>Intensidad: {eje.intensity}/5</div>
        <div style={mono}>{byAxis.length} análisis · {freq}% del corpus</div>
        {last && <div style={mono}>Última activación: {last.date}</div>}
      </div>
    </div>
  );
}

// ─── TAB: PULSO CIUDADANO ─────────────────────────────────────────────────────

function TabPulso({
  indicators,
  lbMeta,
  name,
}: {
  indicators: LBIndicator[];
  lbMeta:     { wave_label: string; fieldwork: string; n_total: number; codebook_url: string };
  name:       string;
}) {
  if (indicators.length === 0) {
    return (
      <p style={{ ...mono, color: "var(--mi-ink-mute)", padding: "var(--mi-space-6) 0" }}>
        Datos del Latinobarómetro no disponibles para este país.
      </p>
    );
  }

  return (
    <div>
      {/* Section header */}
      <div style={{
        display:       "grid",
        gridTemplateColumns: "1fr auto",
        alignItems:    "end",
        gap:           "var(--mi-space-4)",
        borderBottom:  "var(--mi-border-bold)",
        paddingBottom: "var(--mi-space-3)",
        marginBottom:  "var(--mi-space-5)",
      }}>
        <div>
          <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>Evidencia cuantitativa</div>
          <h2 style={{ ...sectionTitle, borderBottom: "none", paddingBottom: 0, marginBottom: 0 }}>
            Pulso ciudadano · 2024
          </h2>
        </div>
        <div style={{ ...mono, textAlign: "right", lineHeight: 1.6, color: "var(--mi-ink-soft)" }}>
          {lbMeta.wave_label}<br />
          {indicators.length} indicadores · {(indicators[0]?.country.n ?? 0).toLocaleString("es-AR")} entrevistas<br />
          Trabajo de campo · {lbMeta.fieldwork}
        </div>
      </div>

      <p style={{
        fontFamily:  "var(--mi-font-body)",
        fontSize:    "var(--mi-text-base)",
        lineHeight:  "var(--mi-leading-normal)",
        color:       "var(--mi-ink)",
        marginBottom: "var(--mi-space-5)",
        maxWidth:    "60ch",
      }}>
        {indicators.length} indicadores curados del {lbMeta.wave_label} para {name}, agrupados por los ejes del marco analítico. Cada cifra muestra el valor del país, la posición frente a los otros 16 países encuestados y la comparación con el promedio regional.
      </p>

      {AXIS_ORDER.map(axis => {
        const group = indicators.filter(ind => toDisplayKey(ind.axis) === axis.displayKey);
        if (group.length === 0) return null;
        return (
          <div key={axis.displayKey} style={{ marginBottom: "var(--mi-space-5)" }}>
            <div style={{
              display:             "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems:          "center",
              gap:                 "var(--mi-space-3)",
              marginBottom:        "var(--mi-space-3)",
            }}>
              <div style={{ width: 12, height: 12, background: `var(--mi-axis-${axis.displayKey})`, flexShrink: 0 }} />
              <span style={{ ...mono, color: "var(--mi-ink)" }}>{axis.label}</span>
              <span style={mono}>{group.length} {group.length === 1 ? "indicador" : "indicadores"}</span>
            </div>
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap:                 "var(--mi-space-3)",
            }}>
              {group.map(ind => (
                <IndicatorCard key={ind.id} indicator={ind} country={ind.country} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{
        marginTop:  "var(--mi-space-5)",
        padding:    "var(--mi-space-4)",
        background: "var(--mi-bg-cream)",
        border:     "var(--mi-border-thick)",
        display:    "grid",
        gridTemplateColumns: "1fr auto",
        gap:        "var(--mi-space-4)",
        alignItems: "center",
      }}>
        <div style={{ ...mono, color: "var(--mi-ink)", lineHeight: 1.6 }}>
          <strong>Fuente</strong> · {lbMeta.wave_label} · Informe "La democracia resiliente" · Diciembre 2024<br />
          Encuesta presencial a {lbMeta.n_total.toLocaleString("es-AR")} personas en 17 países · Margen de error ±3% por país
        </div>
        <a
          href={lbMeta.codebook_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mi-btn"
          style={{ whiteSpace: "nowrap" }}
        >
          Informe completo →
        </a>
      </div>
    </div>
  );
}

// ─── TAB: ESTRUCTURA MATERIAL ─────────────────────────────────────────────────

function TabEstructura({
  indicators,
  families,
  macroMeta,
  name,
}: {
  indicators: MacroIndicatorFull[];
  families:   readonly { key: string; label: string }[];
  macroMeta:  { year_start: number; year_end: number; computed_at: string };
  name:       string;
}) {
  if (indicators.length === 0) {
    return (
      <div style={{
        background: "var(--mi-bg-cream)",
        border:     "var(--mi-border-thick)",
        padding:    "var(--mi-space-6)",
        boxShadow:  "var(--mi-shadow-card)",
        maxWidth:   "600px",
      }}>
        <h2 style={{ ...sectionTitle, marginBottom: "var(--mi-space-4)" }}>
          Estructura material — Próximamente
        </h2>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize:   "var(--mi-text-base)",
          color:      "var(--mi-ink)",
          lineHeight: 1.6,
        }}>
          Esta tab mostrará los 24 indicadores macro del país (riqueza, comercio, empleo, sociales)
          con series de 10–15 años, sparklines y trazabilidad completa.
        </p>
        <p style={{ ...mono, color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>
          Curaduría editorial cerrada en Spec 14A · Pipeline en construcción (Spec 14B)
        </p>
      </div>
    );
  }

  const presentFamilies = families.filter(f => indicators.some(i => i.family === f.key));

  return (
    <div>
      {/* Section header */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "1fr auto",
        alignItems:          "end",
        gap:                 "var(--mi-space-4)",
        borderBottom:        "var(--mi-border-bold)",
        paddingBottom:       "var(--mi-space-3)",
        marginBottom:        "var(--mi-space-5)",
      }}>
        <div>
          <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>Evidencia cuantitativa</div>
          <h2 style={{ ...sectionTitle, borderBottom: "none", paddingBottom: 0, marginBottom: 0 }}>
            Estructura material
          </h2>
        </div>
        <div style={{ ...mono, textAlign: "right", lineHeight: 1.6, color: "var(--mi-ink-soft)" }}>
          {indicators.length} indicadores<br />
          Series {macroMeta.year_start}–{macroMeta.year_end}
        </div>
      </div>

      <p style={{
        fontFamily:   "var(--mi-font-body)",
        fontSize:     "var(--mi-text-base)",
        lineHeight:   "var(--mi-leading-normal)",
        color:        "var(--mi-ink)",
        marginBottom: "var(--mi-space-5)",
        maxWidth:     "60ch",
      }}>
        Indicadores estructurales de la economía y la sociedad de {name}, agrupados en cuatro familias.
        Cada cifra muestra el valor más reciente, la trayectoria histórica y la variación respecto a hace cinco años.
      </p>

      {/* Sub-nav */}
      {presentFamilies.length > 1 && (
        <div style={{ display: "flex", gap: "var(--mi-space-4)", marginBottom: "var(--mi-space-6)", flexWrap: "wrap" }}>
          {presentFamilies.map(f => (
            <a
              key={f.key}
              href={`#familia-${f.key}`}
              style={{
                ...mono,
                color:          "var(--mi-ink)",
                borderBottom:   "1px solid var(--mi-ink)",
                textDecoration: "none",
              }}
            >
              {f.label}
            </a>
          ))}
        </div>
      )}

      {/* Families */}
      {families.map(family => {
        const group = indicators.filter(i => i.family === family.key);
        if (group.length === 0) return null;
        return (
          <div key={family.key} id={`familia-${family.key}`} style={{ marginBottom: "var(--mi-space-7)" }}>
            <div style={{
              display:       "flex",
              alignItems:    "center",
              gap:           "var(--mi-space-3)",
              marginBottom:  "var(--mi-space-4)",
              paddingBottom: "var(--mi-space-3)",
              borderBottom:  "var(--mi-border-thick)",
            }}>
              <div style={{ width: 12, height: 12, background: "var(--mi-ink)", flexShrink: 0 }} />
              <span style={{ ...mono, color: "var(--mi-ink)" }}>{family.label}</span>
              <span style={mono}>{group.length} indicadores</span>
            </div>
            <div style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap:                 "var(--mi-space-3)",
            }}>
              {group.map(ind => (
                <MacroIndicatorCard key={ind.id} indicator={ind} country={ind.country} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{
        marginTop:  "var(--mi-space-5)",
        padding:    "var(--mi-space-4)",
        background: "var(--mi-bg-cream)",
        border:     "var(--mi-border-thick)",
      }}>
        <div style={{ ...mono, color: "var(--mi-ink)", lineHeight: 1.8 }}>
          <strong>Fuentes</strong> · Banco Mundial WDI · FMI WEO · OIT ILOSTAT<br />
          Datos al {macroMeta.computed_at} ·{" "}
          <em style={{ textTransform: "none", fontStyle: "italic", fontFamily: "var(--mi-font-body)" }}>est.</em>
          {" "}= estimado ·{" "}
          <em style={{ textTransform: "none", fontStyle: "italic", fontFamily: "var(--mi-font-body)" }}>cong.</em>
          {" "}= última observación disponible
        </div>
      </div>
    </div>
  );
}

// ─── TAB: CONTEXTO ────────────────────────────────────────────────────────────

function TabContexto({ sections }: { sections: { heading: string; html: string }[] }) {
  if (sections.length === 0) {
    return (
      <p style={{ ...mono, color: "var(--mi-ink-mute)", padding: "var(--mi-space-6) 0" }}>
        Contexto no disponible para este país todavía.
      </p>
    );
  }

  function anchor(heading: string) {
    return `ctx-${heading.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;
  }

  return (
    <div>
      {/* Sub-nav */}
      {sections.length > 1 && (
        <div style={{
          display:      "flex",
          gap:          "var(--mi-space-4)",
          marginBottom: "var(--mi-space-6)",
          flexWrap:     "wrap",
          padding:      "var(--mi-space-3) var(--mi-space-4)",
          background:   "var(--mi-bg-cream)",
          border:       "var(--mi-border-thick)",
        }}>
          {sections.map(sec => (
            <a
              key={sec.heading}
              href={`#${anchor(sec.heading)}`}
              style={{
                ...mono,
                color:          "var(--mi-ink)",
                borderBottom:   "1px solid var(--mi-ink)",
                textDecoration: "none",
              }}
            >
              {sec.heading}
            </a>
          ))}
        </div>
      )}

      {/* Sections */}
      {sections.map(sec => (
        <section
          key={sec.heading}
          id={anchor(sec.heading)}
          style={{ marginBottom: "var(--mi-space-7)" }}
        >
          <h2 style={sectionTitle}>{sec.heading}</h2>
          <div className="mi-prose" dangerouslySetInnerHTML={{ __html: sec.html }} />
        </section>
      ))}
    </div>
  );
}

// ─── TAB: FUENTES ─────────────────────────────────────────────────────────────

function TabFuentes({ fuentes }: { fuentes: Source[] }) {
  if (fuentes.length === 0) {
    return (
      <p style={{ ...mono, color: "var(--mi-ink-mute)", padding: "var(--mi-space-6) 0" }}>
        Fuentes no documentadas para este país todavía.
      </p>
    );
  }

  return (
    <div>
      <p style={{
        fontFamily:   "var(--mi-font-body)",
        fontSize:     "var(--mi-text-base)",
        lineHeight:   "var(--mi-leading-normal)",
        color:        "var(--mi-ink)",
        marginBottom: "var(--mi-space-5)",
        maxWidth:     "60ch",
      }}>
        Los medios y publicaciones que se siguen para producir el análisis de este país.
      </p>

      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap:                 "var(--mi-space-4)",
      }}>
        {fuentes.map(f => (
          <SourceCard key={f.name} source={f} />
        ))}
      </div>
    </div>
  );
}

function SourceCard({ source }: { source: Source }) {
  const domain = source.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");

  return (
    <div style={{
      background: "var(--mi-bg-cream)",
      border:     "var(--mi-border-thick)",
      padding:    "var(--mi-space-4)",
      boxShadow:  "var(--mi-shadow-card)",
      display:    "flex",
      flexDirection: "column",
      gap:        "var(--mi-space-2)",
    }}>
      <div style={{
        fontFamily:    "var(--mi-font-display)",
        fontSize:      22,
        letterSpacing: "-0.01em",
        color:         "var(--mi-ink)",
        textTransform: "uppercase",
        lineHeight:    1,
      }}>
        {source.name}
      </div>
      <div style={mono}>
        {SOURCE_TYPE_LABEL[source.type]}
      </div>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          ...mono,
          color:          "var(--mi-ink)",
          borderBottom:   "1px solid var(--mi-ink)",
          textDecoration: "none",
          marginTop:      "var(--mi-space-1)",
        }}
      >
        → {domain}
      </a>
    </div>
  );
}

// ─── TAB: AGENDA ─────────────────────────────────────────────────────────────

const EJE_LABELS: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Erosión de mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación epistemológica",
  atencion:          "Atención",
};

const TEND_SYMBOL: Record<string, string> = {
  subiendo: "↑",
  estable:  "→",
  bajando:  "↓",
};

const TEND_LABEL: Record<string, string> = {
  subiendo: "Subiendo",
  estable:  "Estable",
  bajando:  "Bajando",
};

function fmtAgendaDate(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "Actualización pendiente";
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d} ${meses[m - 1]} ${y}`;
}

function newsUrl(agenda: Agenda, ca: CountryAgenda): string {
  return (
    `https://news.google.com/search?q=${encodeURIComponent(agenda.query)}` +
    `&hl=${ca.googleNewsHl}&gl=${ca.googleNewsGl}&ceid=${ca.googleNewsCeid}`
  );
}

function TabAgenda({ agenda }: { agenda: CountryAgenda | null }) {
  const [activeIdx,   setActiveIdx]   = useState(0);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [isMobile,    setIsMobile]    = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 640);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!agenda || agenda.agendas.length === 0) {
    const slug = agenda?.countrySlug ?? "?";
    return (
      <div style={{
        background: "var(--mi-bg-cream)",
        border:     "var(--mi-border-thick)",
        padding:    "var(--mi-space-5)",
        boxShadow:  "var(--mi-shadow-card)",
        maxWidth:   600,
      }}>
        <h2 style={{ ...sectionTitle, marginBottom: "var(--mi-space-4)" }}>
          Agenda — Pendiente de carga
        </h2>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize:   "var(--mi-text-base)",
          color:      "var(--mi-ink)",
          lineHeight: 1.6,
        }}>
          Las agendas de este país todavía no están cargadas en el vault.
          Para activarlas, crear el archivo:
        </p>
        <p style={{ ...mono, color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>
          15-Países/agendas/{slug}.md
        </p>
        <p style={{ ...mono, color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-2)" }}>
          con el frontmatter especificado en Spec 27.
        </p>
      </div>
    );
  }

  const activeAgenda   = agenda.agendas[activeIdx];
  const updatedLabel   = fmtAgendaDate(agenda.updated);
  const weekLabel      = agenda.week ? `Semana ${agenda.week}` : "";

  const agendaHeader = (
    <div style={{ marginBottom: "var(--mi-space-5)" }}>
      <h2 style={sectionTitle}>Agenda</h2>
      <p style={{
        fontFamily:   "var(--mi-font-body)",
        fontStyle:    "italic",
        fontSize:     "var(--mi-text-base)",
        color:        "var(--mi-ink-soft)",
        marginBottom: "var(--mi-space-2)",
      }}>
        Los temas que ordenan la conversación pública esta semana.
      </p>
      <div style={{ ...mono, color: "var(--mi-ink-mute)" }}>
        Actualizado · {updatedLabel}{weekLabel && ` · ${weekLabel}`}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div>
        {agendaHeader}
        <div style={{
          ...mono,
          marginBottom: "var(--mi-space-3)",
          borderBottom: "var(--mi-border-bold)",
          paddingBottom: "var(--mi-space-2)",
        }}>
          En agenda
        </div>
        {agenda.agendas.map((ag, idx) => {
          const expanded = expandedIdx === idx;
          const rankStr  = String(ag.rank).padStart(2, "0");
          return (
            <div
              key={ag.slug}
              style={{
                border:       "var(--mi-border-thick)",
                marginBottom: "var(--mi-space-2)",
                boxShadow:    "var(--mi-shadow-card)",
              }}
            >
              <button
                onClick={() => setExpandedIdx(expanded ? null : idx)}
                style={{
                  width:               "100%",
                  display:             "grid",
                  gridTemplateColumns: "36px 1fr auto",
                  alignItems:         "center",
                  gap:                "var(--mi-space-2)",
                  padding:            "var(--mi-space-3)",
                  background:         expanded ? "var(--mi-bg)" : "var(--mi-bg-paper)",
                  border:             "none",
                  cursor:             "pointer",
                  textAlign:          "left",
                }}
              >
                <span style={{
                  fontFamily: "var(--mi-font-display)",
                  fontSize:   24,
                  lineHeight: 1,
                  color:      expanded ? "var(--mi-bg-paper)" : "var(--mi-bg)",
                }}>
                  {rankStr}
                </span>
                <span style={{
                  fontFamily:    "var(--mi-font-display)",
                  fontSize:      "var(--mi-text-base)",
                  lineHeight:    "var(--mi-leading-snug)",
                  color:         expanded ? "var(--mi-bg-paper)" : "var(--mi-ink)",
                  textTransform: "uppercase",
                }}>
                  {ag.title}
                </span>
                <span style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize:   20,
                  color:      expanded ? "var(--mi-bg-paper)" : "var(--mi-ink)",
                }}>
                  {TEND_SYMBOL[ag.tendencia]}
                </span>
              </button>

              {expanded && (
                <div style={{
                  padding:    "var(--mi-space-3)",
                  borderTop:  "var(--mi-border-thick)",
                  background: "var(--mi-bg-paper)",
                }}>
                  <div style={{ ...mono, color: "var(--mi-ink-mute)", marginBottom: "var(--mi-space-2)" }}>
                    Tendencia · {TEND_LABEL[ag.tendencia]}
                    {ag.eje && (
                      <span style={{ marginLeft: "var(--mi-space-3)", color: "var(--mi-bg)" }}>
                        · Lente · {EJE_LABELS[ag.eje] ?? ag.eje}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontFamily:   "var(--mi-font-body)",
                    fontSize:     "var(--mi-text-base)",
                    lineHeight:   "var(--mi-leading-normal)",
                    color:        "var(--mi-ink)",
                    whiteSpace:   "pre-wrap",
                    marginBottom: ag.query ? "var(--mi-space-3)" : 0,
                  }}>
                    {ag.description}
                  </p>
                  {ag.query && (
                    <a
                      href={newsUrl(ag, agenda)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mi-btn"
                    >
                      Ver en Google News →
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop: two columns
  return (
    <div>
      {agendaHeader}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "380px 1fr",
        gap:                 "var(--mi-space-5)",
        alignItems:          "start",
      }}>
        {/* Card list */}
        <div>
          <div style={{
            ...mono,
            marginBottom:  "var(--mi-space-3)",
            borderBottom:  "var(--mi-border-bold)",
            paddingBottom: "var(--mi-space-2)",
          }}>
            En agenda
          </div>
          {agenda.agendas.map((ag, idx) => {
            const active  = activeIdx === idx;
            const rankStr = String(ag.rank).padStart(2, "0");
            return (
              <button
                key={ag.slug}
                onClick={() => setActiveIdx(idx)}
                style={{
                  width:               "100%",
                  display:             "grid",
                  gridTemplateColumns: "36px 1fr auto",
                  alignItems:         "center",
                  gap:                "var(--mi-space-2)",
                  padding:            "var(--mi-space-3)",
                  marginBottom:       "var(--mi-space-2)",
                  border:             "var(--mi-border-thick)",
                  background:         active ? "var(--mi-bg)" : "var(--mi-bg-paper)",
                  boxShadow:          "var(--mi-shadow-card)",
                  cursor:             "pointer",
                  textAlign:          "left",
                }}
              >
                <span style={{
                  fontFamily: "var(--mi-font-display)",
                  fontSize:   26,
                  lineHeight: 1,
                  color:      active ? "var(--mi-bg-paper)" : "var(--mi-bg)",
                }}>
                  {rankStr}
                </span>
                <div>
                  <div style={{
                    fontFamily:    "var(--mi-font-display)",
                    fontSize:      "var(--mi-text-base)",
                    lineHeight:    "var(--mi-leading-snug)",
                    color:         active ? "var(--mi-bg-paper)" : "var(--mi-ink)",
                    textTransform: "uppercase",
                    marginBottom:  2,
                  }}>
                    {ag.title}
                  </div>
                  <div style={{
                    fontFamily:   "var(--mi-font-body)",
                    fontSize:     "var(--mi-text-sm)",
                    color:        active ? "var(--mi-bg-paper)" : "var(--mi-ink-soft)",
                    overflow:     "hidden",
                    whiteSpace:   "nowrap",
                    textOverflow: "ellipsis",
                    maxWidth:     260,
                  }}>
                    {ag.description.split("\n")[0]}
                  </div>
                </div>
                <span style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize:   20,
                  color:      active ? "var(--mi-bg-paper)" : "var(--mi-ink)",
                }}>
                  {TEND_SYMBOL[ag.tendencia]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div style={{
          background: "var(--mi-bg-cream)",
          border:     "var(--mi-border-thick)",
          padding:    "var(--mi-space-5)",
          boxShadow:  "var(--mi-shadow-card)",
          minHeight:  380,
        }}>
          <h3 style={{
            fontFamily:    "var(--mi-font-display)",
            fontSize:      "var(--mi-text-3xl)",
            lineHeight:    "var(--mi-leading-snug)",
            textTransform: "uppercase",
            color:         "var(--mi-ink)",
            marginBottom:  "var(--mi-space-3)",
          }}>
            {activeAgenda.title}
          </h3>

          <div style={{
            ...mono,
            display:       "flex",
            flexWrap:      "wrap",
            gap:           "var(--mi-space-4)",
            color:         "var(--mi-ink-mute)",
            marginBottom:  "var(--mi-space-4)",
            paddingBottom: "var(--mi-space-3)",
            borderBottom:  "var(--mi-border-hair)",
          }}>
            <span>Rank {String(activeAgenda.rank).padStart(2, "0")}</span>
            <span>Tendencia · {TEND_LABEL[activeAgenda.tendencia]}</span>
            {activeAgenda.eje && (
              <span style={{ color: "var(--mi-bg)" }}>
                Lente · {EJE_LABELS[activeAgenda.eje] ?? activeAgenda.eje}
              </span>
            )}
          </div>

          <p style={{
            fontFamily:   "var(--mi-font-body)",
            fontSize:     "var(--mi-text-base)",
            lineHeight:   "var(--mi-leading-normal)",
            color:        "var(--mi-ink)",
            whiteSpace:   "pre-wrap",
            maxWidth:     "56ch",
            marginBottom: "var(--mi-space-5)",
          }}>
            {activeAgenda.description}
          </p>

          {activeAgenda.query && (
            <>
              <a
                href={newsUrl(activeAgenda, agenda)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:        "inline-block",
                  background:     "var(--mi-ink)",
                  color:          "var(--mi-bg-paper)",
                  fontFamily:     "var(--mi-font-mono)",
                  fontSize:       "var(--mi-text-xs)",
                  letterSpacing:  "var(--mi-tracking-wider)",
                  textTransform:  "uppercase",
                  padding:        "12px 20px",
                  border:         "var(--mi-border-thick)",
                  boxShadow:      `5px 5px 0 var(--mi-bg)`,
                  textDecoration: "none",
                }}
              >
                Ver en Google News →
              </a>
              <p style={{
                ...mono,
                color:     "var(--mi-ink-mute)",
                marginTop: "var(--mi-space-3)",
                maxWidth:  "52ch",
              }}>
                El link aplica geolocalización {agenda.countryName} para que los resultados reflejen la conversación local.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
