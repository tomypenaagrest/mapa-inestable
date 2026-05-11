import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EJES, EJES_BY_SLUG } from "@/lib/ejes";
import { getAllPublications } from "@/lib/content";
import { getConceptosByEje } from "@/lib/conceptos";
import {
  getIndicatorsByAxis,
  LB_META,
  COVERED_COUNTRIES,
  formatValue,
  type Indicator,
} from "@/lib/latinobarometro";

/* === COMPONENTES LATINOBARÓMETRO ================================= */

const COUNTRY_LABEL: Record<string, string> = {
  ar: "Argentina", bo: "Bolivia", br: "Brasil", cl: "Chile",
  co: "Colombia", ec: "Ecuador", py: "Paraguay", pe: "Perú",
  uy: "Uruguay", ve: "Venezuela",
};

function IndicatorTable({ indicator, accentColor }: { indicator: Indicator; accentColor: string }) {
  const rows = COVERED_COUNTRIES.map(slug => {
    const d = indicator.by_country[slug.toUpperCase()];
    return d ? { slug, ...d } : null;
  }).filter(Boolean) as Array<{ slug: string; name: string; value: number; n: number; rank: number }>;

  rows.sort((a, b) => b.value - a.value);
  const max = indicator.unit === "escala 0-10" ? 10 : 100;
  const regional = indicator.regional_value;

  return (
    <div style={{
      border: "var(--mi-border-thick)",
      background: "var(--mi-bg-paper)",
      boxShadow: "var(--mi-shadow-card)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: "var(--mi-bg-dark)",
        padding: "var(--mi-space-3) var(--mi-space-4)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: "var(--mi-space-4)",
      }}>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-bg-paper)",
        }}>
          {indicator.label}
        </span>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "10px",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          whiteSpace: "nowrap",
        }}>
          n={indicator.regional_n.toLocaleString("es-AR")} · LATAM: {formatValue(indicator, regional)}
        </span>
      </div>

      {/* Filas */}
      <div>
        {rows.map((row, i) => {
          const pct = (row.value / max) * 100;
          const refPct = (regional / max) * 100;
          return (
            <div key={row.slug} style={{
              padding: "var(--mi-space-2) var(--mi-space-4)",
              borderTop: i > 0 ? "var(--mi-border-hair)" : undefined,
              display: "grid",
              gridTemplateColumns: "130px 1fr 60px",
              gap: "var(--mi-space-3)",
              alignItems: "center",
            }}>
              <Link
                href={`/pais/${row.slug}`}
                style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  letterSpacing: "var(--mi-tracking-wide)",
                  textTransform: "uppercase",
                  color: "var(--mi-ink)",
                  borderBottom: "1px solid transparent",
                }}
                onMouseOver={undefined}
              >
                {COUNTRY_LABEL[row.slug] ?? row.slug.toUpperCase()}
              </Link>
              <div style={{ position: "relative", height: 6, background: "var(--mi-bg-cream)", border: "var(--mi-border-hair)" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: accentColor, opacity: 0.85 }} />
                <div style={{ position: "absolute", top: -2, bottom: -2, left: `${refPct}%`, width: 2, background: "var(--mi-ink)", opacity: 0.3 }} />
              </div>
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                color: "var(--mi-ink)",
                textAlign: "right",
              }}>
                {formatValue(indicator, row.value)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Pie trazabilidad */}
      <div style={{
        borderTop: "var(--mi-border-dashed)",
        padding: "var(--mi-space-2) var(--mi-space-4)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "10px",
        letterSpacing: "var(--mi-tracking-wide)",
        color: "var(--mi-ink-mute)",
      }}>
        <span style={{ color: "var(--mi-ink)", textTransform: "uppercase" }}>Pregunta</span>
        {" "}· {indicator.question_text}
        {" "}· Var. {indicator.questionnaire_var}
      </div>
    </div>
  );
}

/* === STATIC PARAMS ============================================== */

export function generateStaticParams() {
  return EJES.map(e => ({ slug: e.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const eje = EJES_BY_SLUG[slug];
  if (!eje) return {};
  return {
    title: eje.name,
    description: eje.definicion_corta,
  };
}

/* === COMPONENTES ================================================ */

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--mi-font-mono)",
  fontSize: "var(--mi-text-xs)",
  letterSpacing: "var(--mi-tracking-widest)",
  textTransform: "uppercase",
  color: "var(--mi-ink-mute)",
  borderBottom: "var(--mi-border-dashed)",
  paddingBottom: "var(--mi-space-2)",
  marginBottom: "var(--mi-space-5)",
  display: "block",
};

function AutorCard({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/autor/${slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: "var(--mi-border-thick)",
        background: "var(--mi-bg-paper)",
        boxShadow: "var(--mi-shadow-card)",
        padding: "var(--mi-space-3) var(--mi-space-4)",
        gap: "var(--mi-space-2)",
        minHeight: 80,
      }}
    >
      <span style={{
        fontFamily: "var(--mi-font-title)",
        fontWeight: 600,
        fontSize: "var(--mi-text-base)",
        color: "var(--mi-ink)",
        lineHeight: "var(--mi-leading-snug)",
      }}>
        {name}
      </span>
      <span style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
      }}>
        → ver autor
      </span>
    </Link>
  );
}

/* === PAGE ====================================================== */

export default async function EjePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const eje = EJES_BY_SLUG[slug];
  if (!eje) notFound();

  const analyses = getAllPublications()
    .filter(p => p.ejePrincipal === eje.axisKey)
    .map(p => ({
      slug:         p.slug,
      year:         p.year,
      published_at: p.published_at,
      country:      p.country ?? "—",
      countrySlug:  p.countrySlug ?? "",
      lede:         p.subtitle ?? "",
      title:        p.title,
      href:         `/publicaciones/${p.slug}`,
    }));
  const conceptos = getConceptosByEje(slug);
  const accentColor = `var(--mi-axis-${eje.axisKey})`;
  const lbIndicators = getIndicatorsByAxis(eje.axisKey);
  const numStr = String(eje.num).padStart(2, "0");
  const totalEjes = EJES.length;

  /* agrupar análisis por año */
  const byYear: Record<number, typeof analyses> = {};
  for (const a of analyses) {
    if (!byYear[a.year]) byYear[a.year] = [];
    byYear[a.year].push(a);
  }
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

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
        <Link href="/ejes" style={{ color: "var(--mi-ink-mute)" }}>← Ejes</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Marco interpretativo</span>
      </div>

      {/* Hero */}
      <div style={{
        background: "var(--mi-bg-paper)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
      }}>
        <div className="mi-container--narrow">

          {/* Breadcrumb */}
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-5)",
            display: "flex",
            gap: "var(--mi-space-2)",
            alignItems: "center",
          }}>
            <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>Inicio</Link>
            <span>·</span>
            <Link href="/ejes" style={{ color: "var(--mi-ink-mute)" }}>Ejes</Link>
            <span>·</span>
            <span style={{ color: "var(--mi-ink)" }}>{eje.name}</span>
          </div>

          {/* Numeración */}
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-3)",
          }}>
            Ejes · {numStr} de {String(totalEjes).padStart(2, "0")}
          </div>

          {/* Título */}
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(52px, 7vw, var(--mi-text-display))",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            maxWidth: "18ch",
            marginBottom: "var(--mi-space-5)",
          }}>
            {eje.name}
          </h1>

          {/* Lede */}
          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-xl)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "52ch",
            marginBottom: "var(--mi-space-4)",
          }}>
            {eje.definicion_corta}
          </p>

          {/* Separador + stats */}
          <div style={{
            borderTop: "var(--mi-border-bold)",
            paddingTop: "var(--mi-space-3)",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            display: "flex",
            gap: "var(--mi-space-5)",
          }}>
            <span>
              <span style={{ color: accentColor, fontWeight: 700 }}>{analyses.length}</span>
              {" "}análisis
            </span>
            <span style={{ borderLeft: "var(--mi-border-dashed)", paddingLeft: "var(--mi-space-5)" }}>
              Eje {numStr} de {totalEjes}
            </span>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="mi-container--narrow" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--mi-space-8)",
      }}>

        {/* Qué describe */}
        <section>
          <span style={sectionLabel}>Qué describe</span>
          <div style={{
            border: "var(--mi-border-thick)",
            background: "var(--mi-bg-paper)",
            boxShadow: "var(--mi-shadow-card)",
            padding: "var(--mi-space-5) var(--mi-space-6)",
            borderLeft: `6px solid ${accentColor}`,
          }}>
            {eje.que_describe.split("\n\n").map((para, i) => (
              <p key={i} style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-base)",
                lineHeight: "var(--mi-leading-relaxed)",
                color: "var(--mi-ink)",
                marginBottom: i < eje.que_describe.split("\n\n").length - 1 ? "var(--mi-space-4)" : 0,
              }}>
                {para}
              </p>
            ))}
          </div>
        </section>

        {/* Autores de referencia */}
        <section>
          <span style={sectionLabel}>Autores de referencia</span>
          {eje.autores.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "var(--mi-space-3)",
            }}>
              {eje.autores.map(a => (
                <AutorCard key={a.slug} name={a.name} slug={a.slug} />
              ))}
            </div>
          ) : (
            <p style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              Próximamente
            </p>
          )}
        </section>

        {/* Indicadores asociados · Latinobarómetro */}
        {lbIndicators.length > 0 && (
          <section>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "var(--mi-space-5)",
            }}>
              <span style={{ ...sectionLabel, marginBottom: 0 }}>Indicadores asociados</span>
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "10px",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                {LB_META.wave_label}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-4)" }}>
              {lbIndicators.map(ind => (
                <IndicatorTable key={ind.id} indicator={ind} accentColor={accentColor} />
              ))}
            </div>
            <div style={{
              marginTop: "var(--mi-space-4)",
              fontFamily: "var(--mi-font-mono)",
              fontSize: "10px",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              <span style={{ color: "var(--mi-ink)" }}>Fuente</span>
              {" "}· {LB_META.citation}
            </div>
          </section>
        )}

        {/* Conceptos vinculados */}
        <section>
          <span style={sectionLabel}>Conceptos vinculados</span>
          {conceptos.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "var(--mi-space-3)",
            }}>
              {conceptos.map((c) => (
                <Link
                  key={c.slug}
                  href={`/concepto/${c.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "var(--mi-space-2)",
                    border: "var(--mi-border-thick)",
                    background: "var(--mi-bg-paper)",
                    boxShadow: "var(--mi-shadow-card)",
                    padding: "var(--mi-space-3) var(--mi-space-4)",
                    minHeight: 90,
                  }}
                >
                  <span style={{
                    fontFamily: "var(--mi-font-title)",
                    fontWeight: 600,
                    fontSize: "var(--mi-text-base)",
                    color: "var(--mi-ink)",
                    lineHeight: "var(--mi-leading-snug)",
                    flex: 1,
                  }}>
                    {c.name}
                  </span>
                  <span style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink-mute)",
                  }}>
                    → ver
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              Próximamente
            </p>
          )}
        </section>

        {/* Análisis donde se activó */}
        <section>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "var(--mi-space-5)",
          }}>
            <span style={{ ...sectionLabel, marginBottom: 0 }}>Análisis donde se activó</span>
            <Link
              href={`/analisis?eje=${eje.slug}`}
              style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
                borderBottom: "1px solid var(--mi-ink-mute)",
                paddingBottom: 1,
                whiteSpace: "nowrap",
              }}
            >
              Ver todos en archivo →
            </Link>
          </div>

          {analyses.length === 0 ? (
            <p style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              Sin análisis publicados aún
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-6)" }}>
              {years.map(year => (
                <div key={year}>
                  {/* Año */}
                  <div style={{
                    fontFamily: "var(--mi-font-display)",
                    fontSize: "var(--mi-text-3xl)",
                    letterSpacing: "-0.02em",
                    color: "var(--mi-bg-cream)",
                    lineHeight: 1,
                    marginBottom: "var(--mi-space-4)",
                  }}>
                    {year}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-3)" }}>
                    {byYear[year].map(a => (
                      <article key={a.slug} style={{
                        border: "var(--mi-border-thick)",
                        background: "var(--mi-bg-paper)",
                        boxShadow: "var(--mi-shadow-card)",
                        padding: "var(--mi-space-4)",
                        display: "grid",
                        gridTemplateColumns: "1fr auto",
                        gap: "var(--mi-space-4)",
                        alignItems: "start",
                      }}>
                        <div>
                          <div style={{
                            fontFamily: "var(--mi-font-mono)",
                            fontSize: "var(--mi-text-xs)",
                            letterSpacing: "var(--mi-tracking-wide)",
                            textTransform: "uppercase",
                            color: "var(--mi-ink-mute)",
                            marginBottom: "var(--mi-space-2)",
                            display: "flex",
                            gap: "var(--mi-space-3)",
                            alignItems: "center",
                          }}>
                            <span>{a.published_at}</span>
                            <span style={{
                              color: "var(--mi-bg-paper)",
                              background: "var(--mi-ink)",
                              padding: "1px 6px",
                            }}>
                              {a.country}
                            </span>
                          </div>
                          <h3 style={{
                            fontFamily: "var(--mi-font-title)",
                            fontWeight: 600,
                            fontSize: "var(--mi-text-xl)",
                            lineHeight: "var(--mi-leading-snug)",
                            color: "var(--mi-ink)",
                            marginBottom: "var(--mi-space-2)",
                          }}>
                            <Link href={a.href}>{a.title}</Link>
                          </h3>
                          <p style={{
                            fontFamily: "var(--mi-font-body)",
                            fontSize: "var(--mi-text-sm)",
                            lineHeight: "var(--mi-leading-relaxed)",
                            color: "var(--mi-ink-soft)",
                            maxWidth: "60ch",
                          }}>
                            {a.lede}
                          </p>
                        </div>
                        <Link
                          href={a.href}
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
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Navegación entre ejes */}
        <nav style={{
          borderTop: "var(--mi-border-bold)",
          paddingTop: "var(--mi-space-5)",
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--mi-space-4)",
        }}>
          {eje.num > 1 && (() => {
            const prev = EJES[eje.num - 2];
            return (
              <Link href={`/ejes/${prev.slug}`} style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                ← {prev.name}
              </Link>
            );
          })()}
          <div style={{ flex: 1 }} />
          {eje.num < EJES.length && (() => {
            const next = EJES[eje.num];
            return (
              <Link href={`/ejes/${next.slug}`} style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                {next.name} →
              </Link>
            );
          })()}
        </nav>

      </div>
    </div>
  );
}
