"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ANALISIS_ALL, PAISES_LIST, filterAndFacet, type AnalisisEntry, type AnalisisFacets } from "@/lib/analisis";
import { EJES } from "@/lib/ejes";

const PAGE_SIZE = 20;

/* === HIGHLIGHT ================================================== */

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
  const lower = query.toLowerCase();
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === lower ? (
          <mark
            key={i}
            style={{
              background: "var(--mi-accent-gold)",
              padding: "0 2px",
              color: "var(--mi-ink)",
              fontStyle: "inherit",
            }}
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

/* === CARD ====================================================== */

function AnalisisCard({ a, q }: { a: AnalisisEntry; q: string }) {
  return (
    <article
      style={{
        border: "var(--mi-border-thick)",
        background: "var(--mi-bg-paper)",
        boxShadow: "var(--mi-shadow-card)",
        padding: "var(--mi-space-4)",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gap: "var(--mi-space-4)",
        alignItems: "start",
      }}
    >
      <div>
        {/* Meta-bar */}
        <div
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-2)",
            display: "flex",
            gap: "var(--mi-space-2)",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span>{a.published_at}</span>
          <span aria-hidden>·</span>
          <Link
            href={`/pais/${a.countrySlug}`}
            style={{
              color: "var(--mi-ink)",
              borderBottom: "1px solid var(--mi-ink-mute)",
            }}
          >
            {a.country}
          </Link>
          <span aria-hidden>·</span>
          <Link
            href={`/ejes/${a.axisSlug}`}
            style={{
              background: `var(--mi-axis-${a.axisKey})`,
              color: "var(--mi-bg-paper)",
              padding: "1px 6px",
            }}
          >
            {a.axisName}
          </Link>
        </div>

        {/* Título */}
        <h3
          style={{
            fontFamily: "var(--mi-font-title)",
            fontWeight: 600,
            fontSize: "var(--mi-text-xl)",
            lineHeight: "var(--mi-leading-snug)",
            color: "var(--mi-ink)",
            marginBottom: "var(--mi-space-2)",
          }}
        >
          <Link href={`/analisis/${a.countrySlug}/${a.slug}`}>
            <Highlight text={a.title} query={q} />
          </Link>
        </h3>

        {/* Lede */}
        <p
          style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-sm)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-ink-soft)",
            maxWidth: "60ch",
          }}
        >
          <Highlight text={a.lede} query={q} />
        </p>
      </div>

      <Link
        href={`/analisis/${a.countrySlug}/${a.slug}`}
        style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wider)",
          textTransform: "uppercase",
          color: "var(--mi-ink)",
          borderBottom: "2px solid var(--mi-ink)",
          paddingBottom: 2,
          whiteSpace: "nowrap",
        }}
      >
        Leer →
      </Link>
    </article>
  );
}

/* === FILTER PANEL ============================================== */

interface FilterPanelProps extends AnalisisFacets {
  selectedCountries: string[];
  selectedEjes: string[];
  selectedYears: number[];
  hasFilters: boolean;
  onToggleCountry: (slug: string) => void;
  onToggleEje: (slug: string) => void;
  onToggleYear: (year: number) => void;
  onClear: () => void;
}

function FilterPanel({
  selectedCountries,
  selectedEjes,
  selectedYears,
  countryFacets,
  ejeFacets,
  yearFacets,
  allYears,
  hasFilters,
  onToggleCountry,
  onToggleEje,
  onToggleYear,
  onClear,
}: FilterPanelProps) {
  const groupLabel: React.CSSProperties = {
    fontFamily: "var(--mi-font-mono)",
    fontSize: "var(--mi-text-xs)",
    letterSpacing: "var(--mi-tracking-widest)",
    textTransform: "uppercase",
    color: "var(--mi-accent-gold)",
    display: "block",
    marginBottom: "var(--mi-space-2)",
  };

  return (
    <div
      style={{
        background: "var(--mi-bg-dark)",
        padding: "var(--mi-space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--mi-space-4)",
      }}
    >
      {/* País */}
      <fieldset style={{ border: "none" }}>
        <legend style={groupLabel}>País</legend>
        {PAISES_LIST.map((p) => {
          const count = countryFacets[p.slug] ?? 0;
          const active = selectedCountries.includes(p.slug);
          if (count === 0 && !active) return null;
          return (
            <label
              key={p.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--mi-space-2)",
                padding: "3px 0",
                cursor: "pointer",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                opacity: count === 0 ? 0.4 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggleCountry(p.slug)}
                style={{ accentColor: "var(--mi-accent-gold)", cursor: "pointer" }}
              />
              <span style={{ color: active ? "var(--mi-bg-paper)" : "var(--mi-bg-cream)", flex: 1 }}>
                {p.name}
              </span>
              <span style={{ color: "var(--mi-ink-mute)" }}>({count})</span>
            </label>
          );
        })}
      </fieldset>

      {/* Eje */}
      <fieldset style={{ border: "none" }}>
        <legend style={groupLabel}>Eje</legend>
        {EJES.map((e) => {
          const count = ejeFacets[e.slug] ?? 0;
          const active = selectedEjes.includes(e.slug);
          if (count === 0 && !active) return null;
          return (
            <label
              key={e.slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--mi-space-2)",
                padding: "3px 0",
                cursor: "pointer",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                opacity: count === 0 ? 0.4 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggleEje(e.slug)}
                style={{ accentColor: "var(--mi-accent-gold)", cursor: "pointer" }}
              />
              <span
                style={{
                  color: active ? `var(--mi-axis-${e.axisKey})` : "var(--mi-bg-cream)",
                  fontWeight: active ? 600 : 400,
                  flex: 1,
                }}
              >
                {e.name}
              </span>
              <span style={{ color: "var(--mi-ink-mute)" }}>({count})</span>
            </label>
          );
        })}
      </fieldset>

      {/* Año */}
      <fieldset style={{ border: "none" }}>
        <legend style={groupLabel}>Año</legend>
        {allYears.map((y) => {
          const count = yearFacets[y] ?? 0;
          const active = selectedYears.includes(y);
          if (count === 0 && !active) return null;
          return (
            <label
              key={y}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--mi-space-2)",
                padding: "3px 0",
                cursor: "pointer",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                opacity: count === 0 ? 0.4 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={active}
                onChange={() => onToggleYear(y)}
                style={{ accentColor: "var(--mi-accent-gold)", cursor: "pointer" }}
              />
              <span style={{ color: active ? "var(--mi-bg-paper)" : "var(--mi-bg-cream)", flex: 1 }}>
                {y}
              </span>
              <span style={{ color: "var(--mi-ink-mute)" }}>({count})</span>
            </label>
          );
        })}
      </fieldset>

      {/* Limpiar */}
      {hasFilters && (
        <button
          onClick={onClear}
          style={{
            background: "none",
            border: "1px solid rgba(244,233,210,0.25)",
            color: "var(--mi-bg-cream)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            padding: "var(--mi-space-2) var(--mi-space-3)",
            cursor: "pointer",
            width: "100%",
            marginTop: "var(--mi-space-1)",
          }}
        >
          Limpiar filtros ×
        </button>
      )}
    </div>
  );
}

/* === PAGINATION ================================================ */

function Pagination({
  page,
  totalPages,
  searchParamsStr,
}: {
  page: number;
  totalPages: number;
  searchParamsStr: string;
}) {
  const all = Array.from({ length: totalPages }, (_, i) => i + 1);

  let visible: (number | "…")[];
  if (totalPages <= 7) {
    visible = all;
  } else {
    const set = new Set<number>();
    set.add(1);
    set.add(2);
    if (page > 1) set.add(page - 1);
    set.add(page);
    if (page < totalPages) set.add(page + 1);
    set.add(totalPages - 1);
    set.add(totalPages);
    const sorted = [...set].sort((a, b) => a - b);
    const withEllipsis: (number | "…")[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) withEllipsis.push("…");
      withEllipsis.push(sorted[i]);
    }
    visible = withEllipsis;
  }

  return (
    <nav
      aria-label="Paginación"
      style={{
        display: "flex",
        gap: "var(--mi-space-1)",
        marginTop: "var(--mi-space-6)",
        flexWrap: "wrap",
      }}
    >
      {visible.map((p, i) => {
        if (p === "…") {
          return (
            <span
              key={`ellipsis-${i}`}
              style={{
                padding: "4px 6px",
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                color: "var(--mi-ink-mute)",
              }}
            >
              …
            </span>
          );
        }
        const pNum = p as number;
        const next = new URLSearchParams(searchParamsStr);
        if (pNum === 1) next.delete("page");
        else next.set("page", pNum.toString());
        const qs = next.toString();
        const href = qs ? `/analisis?${qs}` : "/analisis";

        return (
          <Link
            key={pNum}
            href={href}
            aria-current={pNum === page ? "page" : undefined}
            style={{
              display: "inline-block",
              padding: "4px 10px",
              border: "2px solid var(--mi-ink)",
              background: pNum === page ? "var(--mi-ink)" : "transparent",
              color: pNum === page ? "var(--mi-bg-paper)" : "var(--mi-ink)",
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              minWidth: 32,
              textAlign: "center",
            }}
          >
            {pNum}
          </Link>
        );
      })}
    </nav>
  );
}

/* === MAIN ====================================================== */

export function AnalisisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const q           = searchParams.get("q")    ?? "";
  const paisParam   = searchParams.get("pais") ?? "";
  const ejeParam    = searchParams.get("eje")  ?? "";
  const anoParam    = searchParams.get("ano")  ?? "";
  const pageParam   = parseInt(searchParams.get("page") ?? "1", 10);

  const selectedCountries = paisParam ? paisParam.split(",").filter(Boolean) : [];
  const selectedEjes      = ejeParam  ? ejeParam.split(",").filter(Boolean)  : [];
  const selectedYears     = anoParam  ? anoParam.split(",").filter(Boolean).map(Number) : [];

  const [inputValue, setInputValue] = useState(q);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local input when URL changes (e.g. browser back)
  useEffect(() => { setInputValue(q); }, [q]);

  const handleSearchInput = useCallback(
    (val: string) => {
      setInputValue(val);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        const next = new URLSearchParams(searchParams.toString());
        val.trim() ? next.set("q", val.trim()) : next.delete("q");
        next.delete("page");
        const qs = next.toString();
        router.replace(qs ? `/analisis?${qs}` : "/analisis");
      }, 300);
    },
    [searchParams, router]
  );

  const updateFilter = useCallback(
    (key: string, value: string, current: string[]) => {
      const next = new URLSearchParams(searchParams.toString());
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);
      next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `/analisis?${qs}` : "/analisis");
    },
    [searchParams, router]
  );

  const toggleCountry = useCallback(
    (slug: string) => updateFilter("pais", slug, selectedCountries),
    [updateFilter, selectedCountries]
  );
  const toggleEje = useCallback(
    (slug: string) => updateFilter("eje", slug, selectedEjes),
    [updateFilter, selectedEjes]
  );
  const toggleYear = useCallback(
    (year: number) => updateFilter("ano", year.toString(), selectedYears.map(String)),
    [updateFilter, selectedYears]
  );

  const clearFilters = useCallback(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    setInputValue("");
    router.replace("/analisis");
  }, [router]);

  const { results, countryFacets, ejeFacets, yearFacets, allYears } = filterAndFacet(
    ANALISIS_ALL,
    q,
    selectedCountries,
    selectedEjes,
    selectedYears
  );

  const totalPages  = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);
  const pageResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const hasFilters  = selectedCountries.length > 0
    || selectedEjes.length > 0
    || selectedYears.length > 0
    || !!q.trim();

  const filterProps: FilterPanelProps = {
    selectedCountries,
    selectedEjes,
    selectedYears,
    countryFacets,
    ejeFacets,
    yearFacets,
    allYears,
    hasFilters,
    onToggleCountry: toggleCountry,
    onToggleEje:     toggleEje,
    onToggleYear:    toggleYear,
    onClear:         clearFilters,
  };

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Meta-bar */}
      <div style={{
        background: "var(--mi-ink)",
        color: "var(--mi-bg-paper)",
        padding: `6px var(--mi-space-6)`,
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        display: "flex",
        gap: "var(--mi-space-6)",
      }}>
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Archivo de análisis</span>
      </div>

      {/* Hero + buscador */}
      <div
        style={{
          background: "var(--mi-bg)",
          borderBottom: "var(--mi-border-bold)",
          padding: "var(--mi-space-6) var(--mi-space-6)",
        }}
        className="mi-grain"
      >
        <div className="mi-container">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
            marginBottom: "var(--mi-space-2)",
          }}>
            Mapa Inestable · Archivo
          </div>

          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(40px, 5vw, 80px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            marginBottom: "var(--mi-space-3)",
          }}>
            Archivo
          </h1>

          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-5)",
          }}>
            {ANALISIS_ALL.length} análisis · Año II
          </div>

          {/* Buscador */}
          <div style={{ position: "relative", maxWidth: 640 }}>
            <span style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--mi-ink-mute)",
              pointerEvents: "none",
              fontSize: 18,
              lineHeight: 1,
            }}>
              ⌕
            </span>
            <input
              type="search"
              value={inputValue}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Buscar en análisis…"
              aria-label="Buscar en archivo"
              style={{
                width: "100%",
                padding: "14px 16px 14px 40px",
                border: "var(--mi-border-bold)",
                boxShadow: "var(--mi-shadow-card)",
                background: "var(--mi-bg-paper)",
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-base)",
                color: "var(--mi-ink)",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        className="mi-container"
        style={{ paddingTop: "var(--mi-space-5)", paddingBottom: "var(--mi-space-8)" }}
      >
        <div className="mi-archive-layout">

          {/* Desktop filter panel (sticky, hidden on mobile) */}
          <aside className="mi-archive-panel">
            <div style={{ position: "sticky", top: "var(--mi-space-5)" }}>
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Results column */}
          <main style={{ minWidth: 0 }}>

            {/* Mobile filter (hidden on desktop) */}
            <details className="mi-archive-mobile-filters">
              <summary style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-widest)",
                textTransform: "uppercase",
                color: "var(--mi-ink)",
                cursor: "pointer",
                padding: "var(--mi-space-3) 0",
                borderBottom: "var(--mi-border-bold)",
                listStyle: "none",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span>Filtros</span>
                {hasFilters && (
                  <span style={{ color: "var(--mi-accent-warn)" }}>· activos</span>
                )}
              </summary>
              <div style={{ marginTop: "var(--mi-space-3)", marginBottom: "var(--mi-space-4)" }}>
                <FilterPanel {...filterProps} />
              </div>
            </details>

            {/* Results header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "var(--mi-border-dashed)",
              paddingBottom: "var(--mi-space-3)",
              marginBottom: "var(--mi-space-4)",
            }}>
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                {results.length} {results.length === 1 ? "pieza" : "piezas"}
                {hasFilters && " · filtrado"}
                {totalPages > 1 && ` · p. ${currentPage}/${totalPages}`}
              </span>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink-mute)",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--mi-ink-mute)",
                    paddingBottom: 1,
                  }}
                >
                  limpiar ×
                </button>
              )}
            </div>

            {/* Cards */}
            {pageResults.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-4)" }}>
                {pageResults.map((a) => (
                  <AnalisisCard key={`${a.countrySlug}-${a.slug}`} a={a} q={q} />
                ))}
              </div>
            ) : (
              /* Estado vacío */
              <div style={{
                border: "var(--mi-border-thick)",
                background: "var(--mi-bg-paper)",
                padding: "var(--mi-space-7)",
                textAlign: "center",
                boxShadow: "var(--mi-shadow-card)",
              }}>
                <div style={{
                  fontFamily: "var(--mi-font-display)",
                  fontSize: "var(--mi-text-3xl)",
                  color: "var(--mi-bg-cream)",
                  marginBottom: "var(--mi-space-3)",
                  letterSpacing: "-0.02em",
                }}>
                  0
                </div>
                <p style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  letterSpacing: "var(--mi-tracking-widest)",
                  textTransform: "uppercase",
                  color: "var(--mi-ink-mute)",
                  marginBottom: "var(--mi-space-3)",
                }}>
                  Sin resultados{q ? ` para "${q}"` : ""}
                </p>
                {q && (
                  <p style={{
                    fontFamily: "var(--mi-font-body)",
                    fontSize: "var(--mi-text-sm)",
                    color: "var(--mi-ink-soft)",
                    marginBottom: "var(--mi-space-4)",
                  }}>
                    Probá buscar sin acentos o con términos más cortos.
                  </p>
                )}
                <button
                  onClick={clearFilters}
                  className="mi-btn"
                >
                  Ver todos →
                </button>
              </div>
            )}

            {/* Paginación */}
            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                searchParamsStr={searchParams.toString()}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
