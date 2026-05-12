"use client";

import { useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { AgentDraftMeta } from "@/lib/content";

const EJE_LABEL: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación",
  atencion:          "Atención",
};

const ESTADO_LABEL: Record<string, string> = {
  "borrador":   "Borrador",
  "en-edicion": "En edición",
  "promovido":  "Promovido",
};

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
}

const mono: React.CSSProperties = {
  fontFamily:    "var(--mi-font-mono)",
  fontSize:      "var(--mi-text-xs)",
  letterSpacing: "var(--mi-tracking-wide)",
  textTransform: "uppercase",
};

export function BorradoresContent({ drafts }: { drafts: AgentDraftMeta[] }) {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const paisParam   = searchParams.get("pais")   ?? "";
  const ejeParam    = searchParams.get("eje")    ?? "";
  const estadoParam = searchParams.get("estado") ?? "";

  const selectedPaises  = paisParam   ? paisParam.split(",").filter(Boolean)   : [];
  const selectedEjes    = ejeParam    ? ejeParam.split(",").filter(Boolean)     : [];
  const selectedEstados = estadoParam ? estadoParam.split(",").filter(Boolean)  : [];

  const allPaises  = [...new Set(drafts.map(d => d.countrySlug))].sort();
  const allEjes    = [...new Set(drafts.map(d => d.ejePrincipal).filter(Boolean))].sort();
  const allEstados = [...new Set(drafts.map(d => d.estado))].sort();

  const filtered = drafts.filter(d => {
    if (selectedPaises.length  && !selectedPaises.includes(d.countrySlug))  return false;
    if (selectedEjes.length    && !selectedEjes.includes(d.ejePrincipal))   return false;
    if (selectedEstados.length && !selectedEstados.includes(d.estado))      return false;
    return true;
  });

  const hasFilters = selectedPaises.length > 0 || selectedEjes.length > 0 || selectedEstados.length > 0;

  const toggle = useCallback(
    (key: string, value: string, current: string[]) => {
      const next    = new URLSearchParams(searchParams.toString());
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      if (updated.length) next.set(key, updated.join(","));
      else next.delete(key);
      const qs = next.toString();
      router.replace(qs ? `/analisis/borradores?${qs}` : "/analisis/borradores", { scroll: false });
    },
    [searchParams, router]
  );

  const clearFilters = useCallback(() => {
    router.replace("/analisis/borradores", { scroll: false });
  }, [router]);

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Meta-bar */}
      <div style={{
        background:    "var(--mi-ink)",
        color:         "var(--mi-bg-paper)",
        padding:       "6px var(--mi-space-6)",
        ...mono,
        display:       "flex",
        gap:           "var(--mi-space-6)",
        alignItems:    "center",
      }}>
        <Link href="/"        style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <Link href="/analisis" style={{ color: "var(--mi-ink-mute)" }}>← Archivo</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Borradores del agente</span>
        <span>{filtered.length} de {drafts.length}</span>
      </div>

      {/* Header editorial */}
      <div style={{
        borderBottom: "var(--mi-border-bold)",
        padding:      "var(--mi-space-7) var(--mi-space-6) var(--mi-space-5)",
      }}>
        <div style={{ ...mono, color: "var(--mi-ink-mute)", marginBottom: "var(--mi-space-3)" }}>
          Producción interna · agente diario
        </div>
        <h1 style={{
          fontFamily:    "var(--mi-font-display)",
          fontSize:      "var(--mi-text-5xl)",
          lineHeight:    0.9,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color:         "var(--mi-ink)",
          marginBottom:  "var(--mi-space-4)",
        }}>
          Borradores
        </h1>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontStyle:  "italic",
          fontSize:   "var(--mi-text-base)",
          color:      "var(--mi-ink-soft)",
          maxWidth:   "62ch",
          lineHeight: "var(--mi-leading-normal)",
        }}>
          Análisis producidos cada día por el agente automatizado. Son insumos del flujo editorial — no publicados en Substack. Pasan por edición humana antes de publicarse.
        </p>
      </div>

      {/* Filtros */}
      <div style={{
        padding:      "var(--mi-space-4) var(--mi-space-6)",
        borderBottom: "var(--mi-border-dashed)",
        background:   "var(--mi-bg-cream)",
        display:      "flex",
        gap:          "var(--mi-space-5)",
        flexWrap:     "wrap",
        alignItems:   "flex-start",
      }}>
        {/* País */}
        {allPaises.length > 1 && (
          <fieldset style={{ border: "none", padding: 0 }}>
            <legend style={{ ...mono, color: "var(--mi-ink-mute)", marginBottom: "var(--mi-space-2)", display: "block" }}>
              País
            </legend>
            <div style={{ display: "flex", gap: "var(--mi-space-1)", flexWrap: "wrap" }}>
              {allPaises.map(slug => {
                const active = selectedPaises.includes(slug);
                return (
                  <button
                    key={slug}
                    onClick={() => toggle("pais", slug, selectedPaises)}
                    style={{
                      ...mono,
                      padding:    "3px 10px",
                      border:     "var(--mi-border-thick)",
                      background: active ? "var(--mi-ink)"      : "transparent",
                      color:      active ? "var(--mi-bg-paper)" : "var(--mi-ink-mute)",
                      cursor:     "pointer",
                    }}
                  >
                    {slug.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Eje */}
        {allEjes.length > 1 && (
          <fieldset style={{ border: "none", padding: 0 }}>
            <legend style={{ ...mono, color: "var(--mi-ink-mute)", marginBottom: "var(--mi-space-2)", display: "block" }}>
              Eje
            </legend>
            <div style={{ display: "flex", gap: "var(--mi-space-1)", flexWrap: "wrap" }}>
              {allEjes.map(eje => {
                const active = selectedEjes.includes(eje);
                return (
                  <button
                    key={eje}
                    onClick={() => toggle("eje", eje, selectedEjes)}
                    style={{
                      ...mono,
                      padding:    "3px 10px",
                      border:     `2px solid var(--mi-axis-${eje})`,
                      background: active ? `var(--mi-axis-${eje})` : "transparent",
                      color:      active ? "var(--mi-bg-paper)"    : `var(--mi-axis-${eje})`,
                      cursor:     "pointer",
                    }}
                  >
                    {EJE_LABEL[eje] ?? eje}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {/* Estado */}
        {allEstados.length > 1 && (
          <fieldset style={{ border: "none", padding: 0 }}>
            <legend style={{ ...mono, color: "var(--mi-ink-mute)", marginBottom: "var(--mi-space-2)", display: "block" }}>
              Estado
            </legend>
            <div style={{ display: "flex", gap: "var(--mi-space-1)", flexWrap: "wrap" }}>
              {allEstados.map(estado => {
                const active = selectedEstados.includes(estado);
                return (
                  <button
                    key={estado}
                    onClick={() => toggle("estado", estado, selectedEstados)}
                    style={{
                      ...mono,
                      padding:    "3px 10px",
                      border:     "var(--mi-border-thick)",
                      background: active ? "var(--mi-ink)"      : "transparent",
                      color:      active ? "var(--mi-bg-paper)" : "var(--mi-ink-mute)",
                      cursor:     "pointer",
                    }}
                  >
                    {ESTADO_LABEL[estado] ?? estado}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        {hasFilters && (
          <button
            onClick={clearFilters}
            style={{
              ...mono,
              alignSelf:  "flex-end",
              background: "none",
              border:     "none",
              color:      "var(--mi-ink-mute)",
              cursor:     "pointer",
              borderBottom: "1px solid var(--mi-ink-mute)",
              paddingBottom: 1,
            }}
          >
            Limpiar ×
          </button>
        )}
      </div>

      {/* Grid */}
      <div style={{ padding: "var(--mi-space-6) var(--mi-space-6)" }}>
        {filtered.length === 0 ? (
          <div style={{
            ...mono,
            color:     "var(--mi-ink-mute)",
            textAlign: "center",
            padding:   "var(--mi-space-8)",
          }}>
            {hasFilters
              ? "No hay borradores que coincidan con los filtros."
              : "El agente todavía no escribió ningún borrador."}
          </div>
        ) : (
          <ul style={{
            listStyle:           "none",
            margin:              0,
            padding:             0,
            display:             "grid",
            gap:                 "var(--mi-space-4)",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            maxWidth:            "1280px",
          }}>
            {filtered.map(d => (
              <li key={d.slug}>
                <Link
                  href={`/analisis/borradores/${d.countrySlug}/${d.pieceSlug}`}
                  style={{ display: "block", textDecoration: "none", color: "inherit" }}
                >
                  <article style={{
                    border:         "var(--mi-border-bold)",
                    boxShadow:      "var(--mi-shadow-card)",
                    background:     "var(--mi-bg-paper)",
                    padding:        "var(--mi-space-4)",
                    height:         "100%",
                    display:        "flex",
                    flexDirection:  "column",
                    gap:            "var(--mi-space-2)",
                  }}>
                    {/* Tags */}
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-2)", flexWrap: "wrap" }}>
                      <EstadoTag estado={d.estado} />
                      {d.ejePrincipal && (
                        <span style={{
                          ...mono,
                          fontSize:   "10px",
                          color:      "var(--mi-bg-paper)",
                          background: `var(--mi-axis-${d.ejePrincipal})`,
                          padding:    "2px 6px",
                          fontWeight: 600,
                        }}>
                          {EJE_LABEL[d.ejePrincipal] ?? d.ejePrincipal}
                        </span>
                      )}
                      <span style={{ ...mono, fontSize: "11px", color: "var(--mi-ink-mute)" }}>
                        {d.country} · {fmtDate(d.date)}
                      </span>
                    </div>

                    {/* Título */}
                    <h2 style={{
                      fontFamily: "var(--mi-font-title)",
                      fontWeight: 600,
                      fontSize:   "var(--mi-text-lg)",
                      lineHeight: "var(--mi-leading-snug)",
                      color:      "var(--mi-ink)",
                    }}>
                      {d.title}
                    </h2>

                    {/* Lede */}
                    {d.lede && (
                      <p style={{
                        fontFamily:         "var(--mi-font-body)",
                        fontStyle:          "italic",
                        fontSize:           "var(--mi-text-sm)",
                        lineHeight:         "var(--mi-leading-normal)",
                        color:              "var(--mi-ink-soft)",
                        display:            "-webkit-box",
                        WebkitLineClamp:    3,
                        WebkitBoxOrient:    "vertical",
                        overflow:           "hidden",
                        margin:             0,
                      }}>
                        {d.lede}
                      </p>
                    )}

                    {/* Link a publicado si promovido */}
                    {d.estado === "promovido" && d.publicacionSlug && (
                      <div style={{ marginTop: "auto", paddingTop: "var(--mi-space-2)" }}>
                        <span style={{ ...mono, fontSize: "10px", color: "var(--mi-ink-mute)" }}>
                          → Ver versión publicada
                        </span>
                      </div>
                    )}
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EstadoTag({ estado }: { estado: string }) {
  if (estado === "promovido") {
    return (
      <span style={{
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "10px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color:         "var(--mi-ink)",
        background:    "var(--mi-accent-gold)",
        padding:       "2px 6px",
        fontWeight:    700,
      }}>
        Promovido
      </span>
    );
  }
  if (estado === "en-edicion") {
    return (
      <span style={{
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "10px",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color:         "var(--mi-bg-paper)",
        background:    "var(--mi-ink-soft)",
        padding:       "2px 6px",
        fontWeight:    700,
      }}>
        En edición
      </span>
    );
  }
  return (
    <span style={{
      fontFamily:    "var(--mi-font-mono)",
      fontSize:      "10px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color:         "var(--mi-bg-paper)",
      background:    "var(--mi-ink)",
      padding:       "2px 6px",
      fontWeight:    700,
    }}>
      Borrador
    </span>
  );
}
