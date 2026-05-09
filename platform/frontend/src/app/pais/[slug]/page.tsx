import Link from "next/link";
import type { Metadata } from "next";
import { getCountrySections, findSection, otherSections } from "@/lib/content";
import {
  COUNTRY_EJES,
  COUNTRY_SOURCES,
  COUNTRY_ANALYSES,
  COUNTRY_NAMES,
  type AxisIntensity,
  type Source,
  type AnalysisSummary,
} from "@/lib/country-data";
import { getCountryIndicators, LB_META, COVERED_COUNTRIES, axisDisplayKey } from "@/lib/latinobarometro";
import IndicatorCard from "@/components/IndicatorCard";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const name = COUNTRY_NAMES[slug];
  if (!name) return {};
  return {
    title: { absolute: `${name} — Mapa Inestable` },
    description: `Perfil estructural de ${name}. Los seis ejes activados, los procesos en curso y el análisis semanal de Mapa Inestable.`,
    openGraph: {
      title: `${name} — Mapa Inestable`,
      description: `Perfil estructural de ${name}. Los seis ejes activados, los procesos en curso y el análisis semanal de Mapa Inestable.`,
    },
  };
}

const SOURCE_TYPE_LABEL: Record<Source["type"], string> = {
  hegemonic:   "Hegemónico",
  alternative: "Alternativo",
  analysis:    "Análisis",
};

/* === COMPONENTES ================================================ */

function AxisBar({ eje }: { eje: AxisIntensity }) {
  const pct = (eje.intensity / 5) * 100;
  return (
    <div style={{ marginBottom: "var(--mi-space-3)" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "var(--mi-space-1)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
      }}>
        <span style={{ color: "var(--mi-ink)" }}>{eje.label}</span>
        <span style={{ color: "var(--mi-ink-mute)" }}>{eje.intensity}/5</span>
      </div>
      <div style={{ height: 6, background: "var(--mi-bg-cream)", border: "var(--mi-border-hair)" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: `var(--mi-axis-${eje.key})`,
          transition: "width 0.3s",
        }} />
      </div>
    </div>
  );
}

function AnalysisRow({ a, countrySlug }: { a: AnalysisSummary; countrySlug: string }) {
  return (
    <article style={{
      border: "var(--mi-border-thick)",
      background: "var(--mi-bg-paper)",
      padding: "var(--mi-space-4)",
      boxShadow: "var(--mi-shadow-card)",
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
        }}>
          {a.date} · Sem {a.week}
        </div>
        <h3 style={{
          fontFamily: "var(--mi-font-title)",
          fontWeight: 600,
          fontSize: "var(--mi-text-xl)",
          lineHeight: "var(--mi-leading-snug)",
          color: "var(--mi-ink)",
          marginBottom: "var(--mi-space-2)",
        }}>
          <Link href={`/analisis/${countrySlug}/${a.slug}`}>{a.title}</Link>
        </h3>
        <span style={{
          display: "inline-block",
          background: `var(--mi-axis-${a.axisKey})`,
          color: "var(--mi-bg-paper)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          padding: "2px 8px",
        }}>
          {a.axis}
        </span>
      </div>
      <Link
        href={`/analisis/${countrySlug}/${a.slug}`}
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

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--mi-font-display)",
  fontSize: "var(--mi-text-xl)",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  color: "var(--mi-ink)",
  borderBottom: "var(--mi-border-bold)",
  paddingBottom: "var(--mi-space-2)",
  marginBottom: "var(--mi-space-5)",
};

/* Secciones que van expandidas vs. colapsadas */
const ALL_SKIP_KEYS = ["tensiones", "pregunta", "outsider", "marco analítico"];

/* Orden y metadatos de los ejes para la sección Pulso */
const AXIS_ORDER = [
  { displayKey: "desrepresentacion", rawKey: "desrepresentacion",             label: "Desrepresentación" },
  { displayKey: "mediaciones",       rawKey: "erosion-mediaciones",           label: "Erosión de mediaciones" },
  { displayKey: "desorientacion",    rawKey: "desorientacion-epistemologica", label: "Desorientación epistemológica" },
  { displayKey: "deculturacion",     rawKey: "deculturacion",                 label: "Deculturación" },
  { displayKey: "atencion",          rawKey: "atencion",                      label: "Atención" },
  { displayKey: "contexto",          rawKey: "contexto",                      label: "Contexto · variable de lectura" },
] as const;

/* === PAGE ====================================================== */

export default async function PaisPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const name     = COUNTRY_NAMES[slug] ?? slug.toUpperCase();
  const ejes     = COUNTRY_EJES[slug]     ?? [];
  const fuentes  = COUNTRY_SOURCES[slug]  ?? [];
  const analyses = COUNTRY_ANALYSES[slug] ?? [];
  const sections = getCountrySections(slug) ?? [];

  const isCovered = (COVERED_COUNTRIES as readonly string[]).includes(slug);
  const lbIndicators = isCovered ? getCountryIndicators(slug) : [];

  const tensiones = findSection(sections, ["tensiones"]);
  const pregunta  = findSection(sections, ["pregunta"]);
  const rest      = otherSections(sections, ALL_SKIP_KEYS);

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
        <span style={{ color: "var(--mi-accent-gold)" }}>Perfil de país</span>
      </div>

      {/* Hero país */}
      <div style={{
        background: "var(--mi-bg)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
      }} className="mi-grain">
        <div className="mi-container" style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "end",
          gap: "var(--mi-space-6)",
        }}>
          <div>
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-widest)",
              textTransform: "uppercase",
              color: "var(--mi-ink-soft)",
              marginBottom: "var(--mi-space-3)",
            }}>
              Sudamérica · Análisis estructural
            </div>
            <h1 style={{
              fontFamily: "var(--mi-font-display)",
              fontSize: "var(--mi-text-display)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              color: "var(--mi-ink)",
              textTransform: "uppercase",
            }}>
              {name}
            </h1>
          </div>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-ink-soft)",
            textAlign: "right",
          }}>
            {analyses.length > 0 ? (
              <>
                <div>{analyses.length} análisis publicados</div>
                <div>Última edición · {analyses[0]?.date}</div>
              </>
            ) : (
              <div>Sin análisis publicados aún</div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="mi-container" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-8)",
        display: "grid",
        gridTemplateColumns: "1fr 340px",
        gap: "var(--mi-space-7)",
        alignItems: "start",
      }}>

        {/* Columna principal */}
        <div>

          {/* Diagnóstico estructural — expandido */}
          {tensiones && (
            <section style={{ marginBottom: "var(--mi-space-7)" }}>
              <h2 style={sectionTitle}>Diagnóstico estructural</h2>
              <div
                className="mi-prose"
                dangerouslySetInnerHTML={{ __html: tensiones.html }}
              />
            </section>
          )}

          {/* Pregunta central — bloque destacado */}
          {pregunta && (
            <div style={{
              background: "var(--mi-bg-dark)",
              border: "var(--mi-border-bold)",
              padding: "var(--mi-space-5)",
              boxShadow: "var(--mi-shadow-hero)",
              marginBottom: "var(--mi-space-7)",
            }}>
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-widest)",
                textTransform: "uppercase",
                color: "var(--mi-accent-gold)",
                marginBottom: "var(--mi-space-3)",
              }}>
                Pregunta central
              </div>
              <div
                className="mi-prose"
                style={{ "--mi-ink": "var(--mi-bg-paper)" } as React.CSSProperties}
                dangerouslySetInnerHTML={{ __html: pregunta.html }}
              />
            </div>
          )}

          {/* Pulso ciudadano · Latinobarómetro */}
          {lbIndicators.length > 0 && (
            <section style={{ marginBottom: "var(--mi-space-7)" }}>
              {/* Header de sección */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "end",
                gap: "var(--mi-space-4)",
                borderBottom: "var(--mi-border-bold)",
                paddingBottom: "var(--mi-space-3)",
                marginBottom: "var(--mi-space-5)",
              }}>
                <div>
                  <div style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-widest)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink-mute)",
                    marginBottom: "var(--mi-space-2)",
                  }}>
                    Evidencia cuantitativa
                  </div>
                  <h2 style={{ ...sectionTitle, borderBottom: "none", paddingBottom: 0, marginBottom: 0 }}>
                    Pulso ciudadano · 2024
                  </h2>
                </div>
                <div style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  letterSpacing: "var(--mi-tracking-wide)",
                  textTransform: "uppercase",
                  textAlign: "right",
                  color: "var(--mi-ink-soft)",
                  lineHeight: 1.5,
                }}>
                  {LB_META.wave_label}<br />
                  {lbIndicators.length} indicadores · {(lbIndicators[0]?.country.n ?? 0).toLocaleString("es-AR")} entrevistas<br />
                  Trabajo de campo · {LB_META.fieldwork}
                </div>
              </div>

              {/* Intro */}
              <p style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-base)",
                lineHeight: "var(--mi-leading-normal)",
                color: "var(--mi-ink)",
                marginBottom: "var(--mi-space-5)",
                maxWidth: "60ch",
              }}>
                {lbIndicators.length} indicadores curados del {LB_META.wave_label} para {name}, agrupados por los ejes del marco analítico. Cada cifra muestra el valor del país, la posición frente a los otros 16 países encuestados y la comparación con el promedio regional.
              </p>

              {/* Grupos por eje */}
              {AXIS_ORDER.map(axis => {
                const group = lbIndicators.filter(
                  ind => axisDisplayKey(ind.axis) === axis.displayKey
                );
                if (group.length === 0) return null;
                return (
                  <div key={axis.displayKey} style={{ marginBottom: "var(--mi-space-5)" }}>
                    {/* Axis header */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center",
                      gap: "var(--mi-space-3)",
                      marginBottom: "var(--mi-space-3)",
                    }}>
                      <div style={{
                        width: 12, height: 12,
                        background: `var(--mi-axis-${axis.displayKey})`,
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: "var(--mi-text-xs)",
                        letterSpacing: "var(--mi-tracking-widest)",
                        textTransform: "uppercase",
                        color: "var(--mi-ink)",
                      }}>
                        {axis.label}
                      </span>
                      <span style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: "var(--mi-text-xs)",
                        letterSpacing: "var(--mi-tracking-wide)",
                        textTransform: "uppercase",
                        color: "var(--mi-ink-mute)",
                      }}>
                        {group.length} {group.length === 1 ? "indicador" : "indicadores"}
                      </span>
                    </div>
                    {/* Grid de cards */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "var(--mi-space-3)",
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
                marginTop: "var(--mi-space-5)",
                padding: "var(--mi-space-4)",
                background: "var(--mi-bg-cream)",
                border: "var(--mi-border-thick)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "var(--mi-space-4)",
                alignItems: "center",
              }}>
                <div style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  letterSpacing: "var(--mi-tracking-wide)",
                  textTransform: "uppercase",
                  color: "var(--mi-ink)",
                  lineHeight: 1.6,
                }}>
                  <strong>Fuente</strong> · {LB_META.wave_label} · Informe "La democracia resiliente" · Diciembre 2024<br />
                  Encuesta presencial a {LB_META.n_total.toLocaleString("es-AR")} personas en 17 países · Margen de error ±3% por país
                </div>
                <a
                  href={LB_META.codebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mi-btn"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Informe completo →
                </a>
              </div>
            </section>
          )}

          {/* Resto de secciones — colapsables */}
          {rest.length > 0 && (
            <section style={{ marginBottom: "var(--mi-space-7)" }}>
              <h2 style={sectionTitle}>Contexto</h2>
              {rest.map(sec => (
                <details key={sec.heading} className="mi-details">
                  <summary>{sec.heading}</summary>
                  <div
                    className="mi-details-body mi-prose"
                    dangerouslySetInnerHTML={{ __html: sec.html }}
                  />
                </details>
              ))}
            </section>
          )}

          {/* Análisis publicados */}
          <section>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              borderBottom: "var(--mi-border-bold)",
              paddingBottom: "var(--mi-space-2)",
              marginBottom: "var(--mi-space-5)",
            }}>
              <h2 style={{ ...sectionTitle, borderBottom: "none", paddingBottom: 0, marginBottom: 0 }}>
                Análisis publicados
              </h2>
              <Link
                href={`/analisis?pais=${slug}`}
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
            {analyses.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-4)" }}>
                {analyses.map(a => (
                  <AnalysisRow key={a.slug} a={a} countrySlug={slug} />
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
                Próximamente — primer análisis en preparación
              </p>
            )}
          </section>

        </div>

        {/* Sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-6)" }}>

          {/* Ejes crónicos */}
          {ejes.length > 0 && (
            <div style={{
              border: "var(--mi-border-thick)",
              background: "var(--mi-bg-paper)",
              padding: "var(--mi-space-4)",
              boxShadow: "var(--mi-shadow-card)",
            }}>
              <h3 style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-widest)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
                marginBottom: "var(--mi-space-4)",
              }}>
                Ejes crónicos
              </h3>
              {ejes.map(eje => <AxisBar key={eje.key} eje={eje} />)}
            </div>
          )}

          {/* Fuentes monitoreadas */}
          {fuentes.length > 0 && (
            <div style={{
              border: "var(--mi-border-thick)",
              background: "var(--mi-bg-paper)",
              padding: "var(--mi-space-4)",
              boxShadow: "var(--mi-shadow-card)",
            }}>
              <h3 style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-widest)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
                marginBottom: "var(--mi-space-4)",
              }}>
                Fuentes monitoreadas
              </h3>
              <ul style={{ listStyle: "none" }}>
                {fuentes.map(f => (
                  <li key={f.name} style={{
                    borderBottom: "var(--mi-border-dashed)",
                    paddingBlock: "var(--mi-space-2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "var(--mi-space-2)",
                  }}>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" style={{
                      fontFamily: "var(--mi-font-mono)",
                      fontSize: "var(--mi-text-xs)",
                      color: "var(--mi-ink)",
                      borderBottom: "1px solid var(--mi-ink)",
                    }}>
                      {f.name}
                    </a>
                    <span style={{
                      fontFamily: "var(--mi-font-mono)",
                      fontSize: "var(--mi-text-xs)",
                      letterSpacing: "var(--mi-tracking-wide)",
                      textTransform: "uppercase",
                      color: "var(--mi-ink-mute)",
                    }}>
                      {SOURCE_TYPE_LABEL[f.type]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}
