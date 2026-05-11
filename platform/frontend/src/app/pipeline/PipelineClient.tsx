"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { PipelinePiece, PieceState } from "@/lib/pipeline";

const STATES: { key: PieceState; label: string }[] = [
  { key: "agente",      label: "Agente" },
  { key: "en-edicion",  label: "En edición" },
  { key: "promovido",   label: "Promovido" },
  { key: "publicado",   label: "Publicado" },
  { key: "archivado",   label: "Archivado" },
];

const EJE_LABEL: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación",
  atencion:          "Atención",
};

const PAISES: { slug: string; name: string }[] = [
  { slug: "ar", name: "Argentina" },
  { slug: "br", name: "Brasil" },
  { slug: "cl", name: "Chile" },
  { slug: "co", name: "Colombia" },
  { slug: "bo", name: "Bolivia" },
  { slug: "pe", name: "Perú" },
  { slug: "uy", name: "Uruguay" },
  { slug: "py", name: "Paraguay" },
  { slug: "ec", name: "Ecuador" },
  { slug: "ve", name: "Venezuela" },
];

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  if (!m || !d) return iso;
  return `${d} ${meses[m - 1]} ${y}`;
}

function PipelineCard({ piece }: { piece: PipelinePiece }) {
  const isStalled     = (piece.state === "agente" || piece.state === "en-edicion") && piece.daysInState > 14;
  const isPublication = piece.source === "publication";

  const titleNode = isPublication && piece.substackUrl ? (
    <a href={piece.substackUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
      {piece.title}
    </a>
  ) : piece.detailHref !== "#" ? (
    <Link href={piece.detailHref} style={{ color: "inherit" }}>
      {piece.title}
    </Link>
  ) : (
    <>{piece.title}</>
  );

  return (
    <article style={{
      border:     isStalled ? "2px solid var(--mi-accent-warn)" : "var(--mi-border-bold)",
      background: "var(--mi-bg-paper)",
      padding:    "var(--mi-space-3)",
      display:    "flex",
      flexDirection: "column",
      gap:        "var(--mi-space-2)",
      boxShadow:  isStalled ? "0 0 0 1px var(--mi-accent-warn)" : "var(--mi-shadow-card)",
    }}>
      {/* Pills */}
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", alignItems: "center" }}>
        {piece.countrySlug && (
          <span style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "9px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color:         "var(--mi-bg-paper)",
            background:    "var(--mi-ink)",
            padding:       "2px 5px",
            fontWeight:    700,
          }}>
            {piece.country}
          </span>
        )}
        {piece.ejePrincipal && (
          <span style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "9px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color:         "var(--mi-bg-paper)",
            background:    `var(--mi-axis-${piece.ejePrincipal})`,
            padding:       "2px 5px",
            fontWeight:    600,
          }}>
            {EJE_LABEL[piece.ejePrincipal] ?? piece.ejePrincipal}
          </span>
        )}
        {isStalled && (
          <span style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "9px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color:         "var(--mi-accent-warn)",
            fontWeight:    700,
          }}>
            ⚠ {piece.daysInState}d
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--mi-font-title)",
        fontWeight: 600,
        fontSize:   "var(--mi-text-sm)",
        lineHeight: "var(--mi-leading-snug)",
        color:      "var(--mi-ink)",
        margin:     0,
      }}>
        {titleNode}
      </h3>

      {/* Date + days in state */}
      <div style={{
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "10px",
        letterSpacing: "0.06em",
        color:         "var(--mi-ink-mute)",
        display:       "flex",
        justifyContent: "space-between",
        alignItems:    "center",
      }}>
        <span>{fmtDate(piece.date)}</span>
        {!isStalled && piece.daysInState > 0 && (
          <span>{piece.daysInState}d</span>
        )}
      </div>
    </article>
  );
}

export function PipelineClient({ pieces }: { pieces: PipelinePiece[] }) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const paisParam = searchParams.get("pais") ?? "";
  const ejeParam  = searchParams.get("eje")  ?? "";

  const selectedCountries = paisParam ? paisParam.split(",").filter(Boolean) : [];
  const selectedEjes      = ejeParam  ? ejeParam.split(",").filter(Boolean)  : [];
  const hasFilters        = selectedCountries.length > 0 || selectedEjes.length > 0;

  const filtered = useMemo(() => {
    if (!hasFilters) return pieces;
    return pieces.filter((p) => {
      if (selectedCountries.length > 0 && !selectedCountries.includes(p.countrySlug)) return false;
      if (selectedEjes.length > 0 && !selectedEjes.some((e) => p.ejes.includes(e))) return false;
      return true;
    });
  }, [pieces, selectedCountries, selectedEjes, hasFilters]);

  const byState = useMemo(() => {
    const map: Record<PieceState, PipelinePiece[]> = {
      agente: [], "en-edicion": [], promovido: [], publicado: [], archivado: [],
    };
    for (const p of filtered) map[p.state].push(p);
    return map;
  }, [filtered]);

  function toggleFilter(key: string, value: string, current: string[]) {
    const next    = new URLSearchParams(searchParams.toString());
    const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    if (updated.length) next.set(key, updated.join(","));
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `/pipeline?${qs}` : "/pipeline");
  }

  const chipBase: React.CSSProperties = {
    fontFamily:    "var(--mi-font-mono)",
    fontSize:      "9px",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    padding:       "2px 7px",
    cursor:        "pointer",
    border:        "1px solid rgba(244,233,210,0.25)",
    background:    "transparent",
    color:         "var(--mi-bg-cream)",
    fontWeight:    400,
  };

  return (
    <div style={{ padding: "var(--mi-space-5) var(--mi-space-6)", display: "flex", flexDirection: "column", gap: "var(--mi-space-5)" }}>

      {/* Filter bar */}
      <div style={{
        background:  "var(--mi-bg-dark)",
        padding:     "var(--mi-space-3) var(--mi-space-4)",
        display:     "flex",
        gap:         "var(--mi-space-5)",
        flexWrap:    "wrap",
        alignItems:  "flex-start",
      }}>
        {/* Country chips */}
        <div>
          <div style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "var(--mi-accent-gold)",
            marginBottom:  "var(--mi-space-1)",
          }}>
            País
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {PAISES.map((p) => {
              const hasAny = pieces.some((piece) => piece.countrySlug === p.slug);
              const active = selectedCountries.includes(p.slug);
              if (!hasAny && !active) return null;
              return (
                <button
                  key={p.slug}
                  onClick={() => toggleFilter("pais", p.slug, selectedCountries)}
                  style={{
                    ...chipBase,
                    background: active ? "var(--mi-accent-gold)" : "transparent",
                    color:      active ? "var(--mi-ink)"         : "var(--mi-bg-cream)",
                    border:     active ? "none"                  : chipBase.border,
                    fontWeight: active ? 700                     : 400,
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Eje chips */}
        <div>
          <div style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "9px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "var(--mi-accent-gold)",
            marginBottom:  "var(--mi-space-1)",
          }}>
            Eje
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {Object.entries(EJE_LABEL).map(([key, label]) => {
              const hasAny = pieces.some((p) => p.ejes.includes(key));
              const active = selectedEjes.includes(key);
              if (!hasAny && !active) return null;
              return (
                <button
                  key={key}
                  onClick={() => toggleFilter("eje", key, selectedEjes)}
                  style={{
                    ...chipBase,
                    background: active ? `var(--mi-axis-${key})` : "transparent",
                    color:      active ? "var(--mi-bg-paper)"    : "var(--mi-bg-cream)",
                    border:     active ? "none"                  : chipBase.border,
                    fontWeight: active ? 700                     : 400,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={() => router.replace("/pipeline")}
            style={{
              ...chipBase,
              alignSelf: "flex-end",
              padding:   "2px 10px",
            }}
          >
            Limpiar ×
          </button>
        )}
      </div>

      {/* Kanban board */}
      <div style={{
        display:               "grid",
        gridTemplateColumns:   "repeat(5, minmax(220px, 1fr))",
        gap:                   "var(--mi-space-4)",
        overflowX:             "auto",
        paddingBottom:         "var(--mi-space-4)",
      }}>
        {STATES.map(({ key, label }) => (
          <div key={key}>
            {/* Column header */}
            <div style={{
              fontFamily:     "var(--mi-font-mono)",
              fontSize:       "10px",
              letterSpacing:  "0.1em",
              textTransform:  "uppercase",
              borderBottom:   "2px solid var(--mi-ink)",
              paddingBottom:  "var(--mi-space-2)",
              marginBottom:   "var(--mi-space-3)",
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
            }}>
              <span style={{ color: "var(--mi-ink)" }}>{label}</span>
              <span style={{ color: "var(--mi-ink-mute)" }}>{byState[key].length}</span>
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-3)" }}>
              {byState[key].length === 0 ? (
                <div style={{
                  fontFamily:    "var(--mi-font-mono)",
                  fontSize:      "9px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color:         "var(--mi-ink-mute)",
                  padding:       "var(--mi-space-3)",
                  border:        "1px dashed rgba(0,0,0,0.15)",
                  textAlign:     "center",
                }}>
                  —
                </div>
              ) : (
                byState[key].map((piece) => (
                  <PipelineCard key={piece.filename} piece={piece} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
