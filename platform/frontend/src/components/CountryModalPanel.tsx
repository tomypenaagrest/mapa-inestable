"use client";
import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { COUNTRY_NAMES, COUNTRY_EJES } from "@/lib/country-data";
import type { WeeklyCountryData } from "@/components/MapaCentrico";
import type { CountryAgenda, Agenda } from "@/lib/agendas";

const TEND_SYMBOL: Record<string, string> = {
  subiendo: "↑",
  estable:  "→",
  bajando:  "↓",
};

const TEND_COLOR: Record<string, string> = {
  subiendo: "var(--mi-accent-warn)",
  estable:  "var(--mi-ink-mute)",
  bajando:  "var(--mi-accent-warn)",
};

function shortDesc(description: string): string {
  const first = description.split(/\.\s/)[0].replace(/\n/g, " ").trim();
  return first.length > 55 ? first.slice(0, 52) + "…" : first;
}

function newsUrl(ag: Agenda, ca: CountryAgenda): string {
  if (!ag.query) return "";
  return (
    `https://news.google.com/search?q=${encodeURIComponent(ag.query)}` +
    `&hl=${ca.googleNewsHl}&gl=${ca.googleNewsGl}&ceid=${ca.googleNewsCeid}`
  );
}

interface Props {
  countrySlug:   string;
  weeklyCountries?: WeeklyCountryData[];
  agendaSummary?: CountryAgenda;
  onClose:       () => void;
}

export default function CountryModalPanel({
  countrySlug,
  weeklyCountries = [],
  agendaSummary,
  onClose,
}: Props) {
  const modalRef   = useRef<HTMLDivElement>(null);
  const countryName = COUNTRY_NAMES[countrySlug] ?? countrySlug;
  const ejes        = COUNTRY_EJES[countrySlug] ?? [];
  const topEjes     = ejes.filter(e => e.intensity >= 3).slice(0, 3);
  const weeklyData  = weeklyCountries.filter(c => c.slug === countrySlug);

  const showAgenda =
    agendaSummary &&
    agendaSummary.agendas.length > 0 &&
    agendaSummary.week > 0;

  // Esc key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Auto-focus close button
  useEffect(() => {
    const btn = modalRef.current?.querySelector<HTMLElement>("[data-close]");
    btn?.focus();
  }, []);

  // Focus trap
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusable = Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute("disabled"));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const mono = {
    fontFamily:    "var(--mi-font-mono)",
    fontSize:      "var(--mi-text-xs)",
    textTransform: "uppercase" as const,
    letterSpacing: "var(--mi-tracking-widest)",
    color:         "var(--mi-ink-mute)",
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          position:   "fixed",
          inset:      0,
          background: "rgba(31,42,18,0.75)",
          zIndex:     200,
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Vista previa de ${countryName}`}
        onKeyDown={handleKeyDown}
        style={{
          position:   "fixed",
          top:        "50%",
          left:       "50%",
          transform:  "translate(-50%,-50%)",
          width:      "480px",
          maxWidth:   "90vw",
          maxHeight:  "80vh",
          background: "var(--mi-bg-paper)",
          border:     "var(--mi-border-bold)",
          boxShadow:  "var(--mi-shadow-hero)",
          zIndex:     201,
          display:    "flex",
          flexDirection: "column",
          overflow:   "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          padding:       "var(--mi-space-3) var(--mi-space-4)",
          borderBottom:  "var(--mi-border-bold)",
          display:       "flex",
          justifyContent:"space-between",
          alignItems:    "flex-start",
          gap:           "var(--mi-space-2)",
          flexShrink:    0,
        }}>
          <div style={{
            fontFamily:    "var(--mi-font-display)",
            fontSize:      "var(--mi-text-xl)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color:         "var(--mi-ink)",
            lineHeight:    1,
          }}>
            {countryName}
          </div>
          <button
            data-close
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontFamily: "var(--mi-font-mono)",
              fontSize:   "24px",
              color:      "var(--mi-ink)",
              padding:    "0 4px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          className="mi-no-scrollbar"
          style={{
            flex:      1,
            overflowY: "auto",
            padding:   "var(--mi-space-3) var(--mi-space-4)",
            scrollbarWidth: "none",
          }}
        >
          {/* Ejes crónicos */}
          {topEjes.length > 0 && (
            <div style={{ marginBottom: "var(--mi-space-4)" }}>
              <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>Ejes crónicos</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--mi-space-1)" }}>
                {topEjes.map(e => (
                  <span
                    key={e.key}
                    className="mi-axis-pill"
                    style={{ background: `var(--mi-axis-${e.key})`, fontSize: 10 }}
                  >
                    {e.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Esta semana */}
          {weeklyData.length > 0 ? (
            <div style={{ marginBottom: "var(--mi-space-4)" }}>
              <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>Esta semana</div>
              {weeklyData.map(w =>
                w.lastTitle && w.lastSlug ? (
                  <Link
                    key={w.slug}
                    href={`/analisis/${w.slug}/${w.lastSlug}`}
                    style={{
                      display:      "block",
                      marginBottom: "var(--mi-space-2)",
                      padding:      "var(--mi-space-2)",
                      border:       "var(--mi-border-soft)",
                    }}
                  >
                    <div style={{
                      fontFamily: "var(--mi-font-title)",
                      fontWeight: 600,
                      fontSize:   "var(--mi-text-sm)",
                      lineHeight: "var(--mi-leading-snug)",
                      color:      "var(--mi-ink)",
                      marginBottom: 4,
                    }}>
                      {w.lastTitle}
                    </div>
                    {w.lastAxis && (
                      <span
                        className="mi-axis-pill"
                        style={{ background: `var(--mi-axis-${w.axisKey})`, fontSize: 9 }}
                      >
                        {w.lastAxis}
                      </span>
                    )}
                  </Link>
                ) : null
              )}
            </div>
          ) : (
            <p style={{
              fontFamily: "var(--mi-font-body)",
              fontSize:   "var(--mi-text-sm)",
              color:      "var(--mi-ink-mute)",
              lineHeight: "var(--mi-leading-normal)",
              marginBottom: "var(--mi-space-4)",
            }}>
              Sin análisis publicados esta semana.
            </p>
          )}

          {/* Agenda */}
          {showAgenda && agendaSummary && (
            <div style={{ marginBottom: "var(--mi-space-3)" }}>
              <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>
                Agenda · sem {agendaSummary.week} · {agendaSummary.year}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-2)" }}>
                {agendaSummary.agendas.map(ag => {
                  const url      = newsUrl(ag, agendaSummary);
                  const rankStr  = String(ag.rank).padStart(2, "0");
                  const arrow    = TEND_SYMBOL[ag.tendencia] ?? "→";
                  const arrowColor = TEND_COLOR[ag.tendencia] ?? "var(--mi-ink-mute)";
                  const sub      = ag.description ? shortDesc(ag.description) : "";
                  if (!url) return null;
                  return (
                    <a
                      key={ag.slug}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", textDecoration: "none", cursor: "pointer" }}
                    >
                      <div style={{ display: "flex", gap: "var(--mi-space-2)", alignItems: "baseline" }}>
                        <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 12, color: "var(--mi-ink-mute)", flexShrink: 0, lineHeight: 1.4 }}>
                          {rankStr}
                        </span>
                        <span style={{ fontFamily: "var(--mi-font-mono)", fontSize: 13, color: arrowColor, flexShrink: 0, lineHeight: 1.4 }}>
                          {arrow}
                        </span>
                        <div>
                          <div style={{ fontFamily: "var(--mi-font-title)", fontWeight: 600, fontSize: "var(--mi-text-sm)", color: "var(--mi-ink)", lineHeight: "var(--mi-leading-snug)" }}>
                            {ag.title}
                          </div>
                          {sub && (
                            <div style={{ fontFamily: "var(--mi-font-body)", fontSize: 12, color: "var(--mi-ink-mute)", lineHeight: 1.4, marginTop: 1 }}>
                              {sub}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
              <div style={{ marginTop: "var(--mi-space-2)" }}>
                <Link
                  href={`/pais/${countrySlug}?tab=agenda`}
                  style={{ fontFamily: "var(--mi-font-mono)", fontSize: 12, color: "var(--mi-ink-mute)", textDecoration: "none", letterSpacing: "var(--mi-tracking-wide)" }}
                >
                  → Ver agenda completa
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div style={{
          padding:    "var(--mi-space-3) var(--mi-space-4)",
          borderTop:  "var(--mi-border-bold)",
          flexShrink: 0,
        }}>
          <Link
            href={`/pais/${countrySlug}`}
            className="mi-btn"
            style={{ display: "block", textAlign: "center" }}
          >
            Ver ficha completa →
          </Link>
        </div>
      </div>
    </>
  );
}
