"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { filterAndFacet, type AnalisisEntry } from "@/lib/analisis";
import { EJES } from "@/lib/ejes";
import "@/styles/mobile-restantes.css";

const PAGE_SIZE = 10;

interface ArchivoConFiltrosProps {
  analyses: AnalisisEntry[];
  label: string;
  h1Title: string;
  metaLabel?: string;
  onRemove?: (slugKey: string) => void;
  emptyMessage?: string;
}

export default function ArchivoConFiltros({
  analyses,
  label,
  h1Title,
  metaLabel,
  onRemove,
  emptyMessage,
}: ArchivoConFiltrosProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q        = searchParams.get("q")   ?? "";
  const ejeParam = searchParams.get("eje") ?? "";
  const anoParam = searchParams.get("ano") ?? "";
  const pageParam = parseInt(searchParams.get("page") ?? "1", 10);

  const selectedEjes  = ejeParam ? ejeParam.split(",").filter(Boolean) : [];
  const selectedYears = anoParam ? anoParam.split(",").filter(Boolean).map(Number) : [];

  const [inputValue, setInputValue] = useState(q);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [toastSlug, setToastSlug] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setInputValue(q); }, [q]);

  const navigate = useCallback((params: URLSearchParams) => {
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [router, pathname]);

  const handleSearch = useCallback((val: string) => {
    setInputValue(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams.toString());
      val.trim() ? next.set("q", val.trim()) : next.delete("q");
      next.delete("page");
      navigate(next);
    }, 300);
  }, [searchParams, navigate]);

  const setYear = useCallback((year: number | null) => {
    const next = new URLSearchParams(searchParams.toString());
    if (year === null) next.delete("ano");
    else next.set("ano", year.toString());
    next.delete("page");
    navigate(next);
  }, [searchParams, navigate]);

  const toggleEje = useCallback((slug: string) => {
    const next = new URLSearchParams(searchParams.toString());
    const updated = selectedEjes.includes(slug)
      ? selectedEjes.filter(e => e !== slug)
      : [...selectedEjes, slug];
    if (updated.length) next.set("eje", updated.join(","));
    else next.delete("eje");
    next.delete("page");
    navigate(next);
  }, [searchParams, navigate, selectedEjes]);

  const handleRemove = useCallback((slugKey: string) => {
    onRemove?.(slugKey);
    setToastSlug(slugKey);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastSlug(null), 5000);
  }, [onRemove]);

  const handleUndo = useCallback(() => {
    if (toastSlug && onRemove) onRemove(toastSlug); // toggleSaved — re-adds
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToastSlug(null);
  }, [toastSlug, onRemove]);

  const { results, allYears } = filterAndFacet(analyses, q, [], selectedEjes, selectedYears);

  const activeYear  = selectedYears.length === 1 ? selectedYears[0] : null;
  const totalPages  = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, pageParam), totalPages);
  const pageResults = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const metaText = metaLabel
    ? `${analyses.length} análisis · ${metaLabel}`
    : `${analyses.length} ${analyses.length === 1 ? "análisis guardado" : "análisis guardados"}`;

  return (
    <div className="mr-mobile-only" style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Page header */}
      <div className="mr-archivo-header">
        <span className="mr-archivo-label">{label}</span>
        <h1 className="mr-archivo-h1">{h1Title}</h1>
        <span className="mr-archivo-meta">{metaText}</span>
      </div>

      {/* Buscador */}
      <div className="mr-search-wrap">
        <span className="mr-search-icon">⌕</span>
        <input
          type="search"
          className="mr-search-input"
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={`Buscar ${h1Title.toLowerCase()}…`}
          aria-label={`Buscar ${h1Title.toLowerCase()}`}
          autoComplete="off"
        />
      </div>

      {/* Chips temporales */}
      {allYears.length > 0 && (
        <div className="mr-chips-row">
          <button
            className={`mr-chip-temporal${activeYear === null ? " active" : ""}`}
            onClick={() => setYear(null)}
          >
            Todos ({analyses.length})
          </button>
          {allYears.map(y => (
            <button
              key={y}
              className={`mr-chip-temporal${activeYear === y ? " active" : ""}`}
              onClick={() => setYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {/* Chips de ejes */}
      <div
        className="mr-chips-row"
        style={{
          paddingTop: allYears.length > 0 ? 0 : undefined,
          borderBottom: "1px solid var(--mi-ink)",
        }}
      >
        {EJES.map(eje => {
          const active = selectedEjes.includes(eje.slug);
          return (
            <button
              key={eje.slug}
              className={`mr-chip-eje${active ? " active" : ""}`}
              style={{ background: `var(--mi-axis-${eje.axisKey})` }}
              onClick={() => toggleEje(eje.slug)}
              aria-pressed={active}
            >
              {eje.name.split(" ")[0]}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {pageResults.length === 0 ? (
        <div className="mr-empty">
          {emptyMessage ?? "Sin análisis que combinen estos filtros.\nProbá quitar uno o ampliar el período."}
        </div>
      ) : (
        <div className="mr-cards-list">
          {pageResults.map(a => {
            const isPublication = a.tipo === "publicacion" || a.tipo === "despacho";
            const href = isPublication
              ? `/publicaciones/${a.slug}`
              : `/analisis/${a.countrySlug}/${a.slug}`;
            const slugKey = `${a.countrySlug}-${a.year}-w${a.week}`;

            return (
              <div key={`${a.countrySlug}-${a.slug}`} className="mr-card">
                {onRemove && (
                  <button
                    className="mr-card-remove"
                    onClick={() => handleRemove(slugKey)}
                    aria-label="Quitar de la lista"
                  >
                    ×
                  </button>
                )}

                <div className="mr-card-meta">
                  {a.country && (
                    <span className="mr-card-country">{a.country}</span>
                  )}
                  <span
                    className="mr-card-eje-pill"
                    style={{ background: `var(--mi-axis-${a.axisKey})` }}
                  >
                    {a.axisName}
                  </span>
                </div>

                <Link href={href} className="mr-card-title">{a.title}</Link>

                {a.lede && (
                  <p className="mr-card-desc">{a.lede}</p>
                )}

                <span className="mr-card-footer">
                  {a.published_at}
                  {a.week ? ` · sem ${a.week}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Ver más */}
      {currentPage < totalPages && (
        <div className="mr-ver-mas">
          <Link
            href={(() => {
              const next = new URLSearchParams(searchParams.toString());
              next.set("page", (currentPage + 1).toString());
              return `${pathname}?${next.toString()}`;
            })()}
          >
            Ver más ({results.length - currentPage * PAGE_SIZE} más →)
          </Link>
        </div>
      )}

      {/* Toast undo */}
      {toastSlug && (
        <div className="mr-toast">
          <span>Removido</span>
          <button className="mr-toast-undo" onClick={handleUndo}>
            Deshacer
          </button>
        </div>
      )}
    </div>
  );
}
