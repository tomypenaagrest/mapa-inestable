import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EJES, EJES_BY_SLUG, MOCK_EJE_ANALYSES } from "@/lib/ejes";
import { getConceptosByEje } from "@/lib/conceptos";

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

  const analyses = MOCK_EJE_ANALYSES[slug] ?? [];
  const conceptos = getConceptosByEje(slug);
  const accentColor = `var(--mi-axis-${eje.axisKey})`;
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
                            <span>{a.date}</span>
                            <span style={{
                              color: "var(--mi-bg-paper)",
                              background: "var(--mi-ink)",
                              padding: "1px 6px",
                            }}>
                              {a.country}
                            </span>
                            {a.isPrimary === false && (
                              <span style={{ color: "var(--mi-ink-mute)" }}>secundario</span>
                            )}
                          </div>
                          <h3 style={{
                            fontFamily: "var(--mi-font-title)",
                            fontWeight: 600,
                            fontSize: "var(--mi-text-xl)",
                            lineHeight: "var(--mi-leading-snug)",
                            color: "var(--mi-ink)",
                            marginBottom: "var(--mi-space-2)",
                          }}>
                            <Link href={`/analisis/${a.countrySlug}/${a.slug}`}>{a.title}</Link>
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
