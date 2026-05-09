import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllConceptos, getConceptoBySlug } from "@/lib/conceptos";
import { getAutorBySlug } from "@/lib/autores";
import { EJES_BY_SLUG } from "@/lib/ejes";

export function generateStaticParams() {
  return getAllConceptos().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const concepto = getConceptoBySlug(slug);
  if (!concepto) return {};
  return {
    title: `${concepto.name} · Mapa Inestable`,
    description: concepto.definicion,
  };
}

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

export default async function ConceptoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concepto = getConceptoBySlug(slug);
  if (!concepto) notFound();

  const conceptos = getAllConceptos();
  const totalConceptos = conceptos.length;
  const conceptoIndex = conceptos.findIndex((c) => c.slug === slug);
  const numStr = String(conceptoIndex + 1).padStart(2, "0");

  const autor = concepto.autorPrincipalSlug ? getAutorBySlug(concepto.autorPrincipalSlug) : null;

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
        <Link href="/conceptos" style={{ color: "var(--mi-ink-mute)" }}>← Conceptos</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Marco conceptual</span>
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
            <Link href="/conceptos" style={{ color: "var(--mi-ink-mute)" }}>Conceptos</Link>
            <span>·</span>
            <span style={{ color: "var(--mi-ink)" }}>{concepto.name}</span>
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
            Conceptos · {numStr} de {String(totalConceptos).padStart(2, "0")}
          </div>

          {/* Nombre */}
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(40px, 6vw, var(--mi-text-4xl))",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            maxWidth: "18ch",
            marginBottom: "var(--mi-space-4)",
          }}>
            {concepto.name}
          </h1>

          {/* Atribución */}
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
            flexWrap: "wrap",
          }}>
            <span>
              Concepto de {concepto.autores.join(", ")}
            </span>
            {concepto.ano && (
              <span style={{ borderLeft: "var(--mi-border-dashed)", paddingLeft: "var(--mi-space-5)" }}>
                {concepto.ano}
              </span>
            )}
            {concepto.obra && (
              <span style={{ borderLeft: "var(--mi-border-dashed)", paddingLeft: "var(--mi-space-5)", fontStyle: "italic" }}>
                {concepto.obra}
              </span>
            )}
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

        {/* Definición — blockquote prominente */}
        {concepto.definicionHtml && (
          <section>
            <div style={{
              borderLeft: "6px solid var(--mi-ink)",
              paddingLeft: "var(--mi-space-5)",
              margin: 0,
            }}>
              <div
                className="mi-prose"
                style={{ fontFamily: "var(--mi-font-title)", fontStyle: "italic" }}
                dangerouslySetInnerHTML={{ __html: concepto.definicionHtml }}
              />
            </div>
          </section>
        )}

        {/* Argumento */}
        {concepto.argumentoHtml && (
          <section>
            <span style={sectionLabel}>Argumento</span>
            <div
              className="mi-prose"
              dangerouslySetInnerHTML={{ __html: concepto.argumentoHtml }}
            />
          </section>
        )}

        {/* Cita */}
        {concepto.citaHtml && (
          <section>
            <span style={sectionLabel}>Cita</span>
            <div
              className="mi-prose"
              dangerouslySetInnerHTML={{ __html: concepto.citaHtml }}
            />
          </section>
        )}

        {/* Aplicabilidad sudamericana */}
        {concepto.aplicabilidadHtml && (
          <section>
            <span style={sectionLabel}>Aplicación a Sudamérica</span>
            <div
              className="mi-prose"
              dangerouslySetInnerHTML={{ __html: concepto.aplicabilidadHtml }}
            />
          </section>
        )}

        {/* Cruces con ejes */}
        {concepto.ejesRelacionados.length > 0 && (
          <section>
            <span style={sectionLabel}>Cruces con ejes</span>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "var(--mi-space-3)",
            }}>
              {concepto.ejesRelacionados.map((ejeSlug) => {
                const eje = EJES_BY_SLUG[ejeSlug];
                return eje ? (
                  <Link
                    key={ejeSlug}
                    href={`/ejes/${ejeSlug}`}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "var(--mi-space-2)",
                      border: "var(--mi-border-thick)",
                      background: "var(--mi-bg-paper)",
                      boxShadow: "var(--mi-shadow-card)",
                      padding: "var(--mi-space-3) var(--mi-space-4)",
                      borderLeft: `6px solid var(--mi-axis-${eje.axisKey})`,
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
                      {eje.name}
                    </span>
                    <span style={{
                      fontFamily: "var(--mi-font-mono)",
                      fontSize: "var(--mi-text-xs)",
                      letterSpacing: "var(--mi-tracking-wide)",
                      textTransform: "uppercase",
                      color: "var(--mi-ink-mute)",
                    }}>
                      → ver eje
                    </span>
                  </Link>
                ) : null;
              })}
            </div>
          </section>
        )}

        {/* Card del autor */}
        {autor && (
          <section>
            <span style={sectionLabel}>Autor</span>
            <Link
              href={`/autor/${autor.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--mi-space-2)",
                border: "var(--mi-border-thick)",
                background: "var(--mi-bg-paper)",
                boxShadow: "var(--mi-shadow-card)",
                padding: "var(--mi-space-4)",
                maxWidth: 320,
              }}
            >
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                {autor.nacionalidad} · {autor.disciplina.split(",")[0]}
              </span>
              <span style={{
                fontFamily: "var(--mi-font-title)",
                fontWeight: 600,
                fontSize: "var(--mi-text-xl)",
                color: "var(--mi-ink)",
              }}>
                {autor.name}
              </span>
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                → ver perfil completo
              </span>
            </Link>
          </section>
        )}

        {/* Fuente */}
        {concepto.fuenteHtml && (
          <section>
            <span style={sectionLabel}>Fuente</span>
            <div
              className="mi-prose"
              style={{
                border: "var(--mi-border-thick)",
                background: "var(--mi-bg-cream)",
                padding: "var(--mi-space-4) var(--mi-space-5)",
              }}
              dangerouslySetInnerHTML={{ __html: concepto.fuenteHtml }}
            />
          </section>
        )}

        {/* Navegación entre conceptos */}
        <nav style={{
          borderTop: "var(--mi-border-bold)",
          paddingTop: "var(--mi-space-5)",
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--mi-space-4)",
        }}>
          {conceptoIndex > 0 && (() => {
            const prev = conceptos[conceptoIndex - 1];
            return (
              <Link href={`/concepto/${prev.slug}`} style={{
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
          {conceptoIndex < conceptos.length - 1 && (() => {
            const next = conceptos[conceptoIndex + 1];
            return (
              <Link href={`/concepto/${next.slug}`} style={{
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
