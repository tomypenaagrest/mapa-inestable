"use client";
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
  countrySlug: string;
  weeklyCountries?: WeeklyCountryData[];
  agendaSummary?: CountryAgenda;
  onClose?: () => void;
}

export default function CountryPreviewPanel({
  countrySlug,
  weeklyCountries = [],
  agendaSummary,
  onClose,
}: Props) {
  const countryName = countrySlug ? (COUNTRY_NAMES[countrySlug] ?? countrySlug) : "";
  const ejes = countrySlug ? (COUNTRY_EJES[countrySlug] ?? []) : [];
  const topEjes = ejes.filter(e => e.intensity >= 3).slice(0, 3);
  const weeklyData = weeklyCountries.filter(c => c.slug === countrySlug);

  const showAgenda =
    agendaSummary &&
    agendaSummary.agendas.length > 0 &&
    agendaSummary.week > 0;

  const mono = {
    fontFamily: "var(--mi-font-mono)",
    fontSize: "var(--mi-text-xs)",
    textTransform: "uppercase" as const,
    letterSpacing: "var(--mi-tracking-widest)",
    color: "var(--mi-ink-mute)",
  };

  return (
    <div
      role="complementary"
      aria-label={`Vista previa de ${countryName}`}
      style={{
        width: "100%",
        height: "100%",
        background: "var(--mi-bg-paper)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "var(--mi-space-3) var(--mi-space-4)",
        borderBottom: "var(--mi-border-bold)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "var(--mi-space-2)",
      }}>
        <div>
          <div style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-xl)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--mi-ink)",
            lineHeight: 1,
          }}>
            {countryName}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Cerrar panel"
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            padding: "2px 4px",
            flexShrink: 0,
          }}
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--mi-space-3) var(--mi-space-4)" }}>

        {/* Active axes */}
        {topEjes.length > 0 && (
          <div style={{ marginBottom: "var(--mi-space-4)" }}>
            <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>
              Ejes crónicos
            </div>
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

        {/* Latest analyses this week */}
        {weeklyData.length > 0 ? (
          <div style={{ marginBottom: "var(--mi-space-4)" }}>
            <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>
              Esta semana
            </div>
            {weeklyData.map(w => (
              w.lastTitle && w.lastSlug ? (
                <Link
                  key={w.slug}
                  href={`/analisis/${w.slug}/${w.lastSlug}`}
                  style={{
                    display: "block",
                    marginBottom: "var(--mi-space-2)",
                    padding: "var(--mi-space-2)",
                    border: "var(--mi-border-soft)",
                  }}
                >
                  <div style={{
                    fontFamily: "var(--mi-font-title)",
                    fontWeight: 600,
                    fontSize: "var(--mi-text-sm)",
                    lineHeight: "var(--mi-leading-snug)",
                    color: "var(--mi-ink)",
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
            ))}
          </div>
        ) : (
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontSize: "var(--mi-text-sm)",
            color: "var(--mi-ink-mute)",
            lineHeight: "var(--mi-leading-normal)",
            marginBottom: "var(--mi-space-4)",
          }}>
            Sin análisis publicados esta semana.
          </p>
        )}

        {/* Agenda section */}
        {showAgenda && agendaSummary && (
          <div style={{ marginBottom: "var(--mi-space-3)" }}>
            <div style={{ ...mono, marginBottom: "var(--mi-space-2)" }}>
              Agenda · sem {agendaSummary.week} · {agendaSummary.year}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-2)" }}>
              {agendaSummary.agendas.map(ag => {
                const url = newsUrl(ag, agendaSummary);
                const rankStr = String(ag.rank).padStart(2, "0");
                const arrow = TEND_SYMBOL[ag.tendencia] ?? "→";
                const arrowColor = TEND_COLOR[ag.tendencia] ?? "var(--mi-ink-mute)";
                const sub = ag.description ? shortDesc(ag.description) : "";
                if (!url) return null;
                return (
                  <a
                    key={ag.slug}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", gap: "var(--mi-space-2)", alignItems: "baseline" }}>
                      <span style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: 12,
                        color: "var(--mi-ink-mute)",
                        flexShrink: 0,
                        lineHeight: 1.4,
                      }}>
                        {rankStr}
                      </span>
                      <span style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: 13,
                        color: arrowColor,
                        flexShrink: 0,
                        lineHeight: 1.4,
                      }}>
                        {arrow}
                      </span>
                      <div>
                        <div style={{
                          fontFamily: "var(--mi-font-title)",
                          fontWeight: 600,
                          fontSize: "var(--mi-text-sm)",
                          color: "var(--mi-ink)",
                          lineHeight: "var(--mi-leading-snug)",
                        }}>
                          {ag.title}
                        </div>
                        {sub && (
                          <div style={{
                            fontFamily: "var(--mi-font-body)",
                            fontSize: 12,
                            color: "var(--mi-ink-mute)",
                            lineHeight: 1.4,
                            marginTop: 1,
                          }}>
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
                style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: 12,
                  color: "var(--mi-ink-mute)",
                  textDecoration: "none",
                  letterSpacing: "var(--mi-tracking-wide)",
                }}
              >
                → Ver agenda completa
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div style={{
        padding: "var(--mi-space-3) var(--mi-space-4)",
        borderTop: "var(--mi-border-bold)",
      }}>
        <Link
          href={countrySlug ? `/pais/${countrySlug}` : "#"}
          className="mi-btn"
          style={{ display: "block", textAlign: "center" }}
        >
          Ver ficha completa →
        </Link>
      </div>
    </div>
  );
}
