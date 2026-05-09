import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllAutores, getAutorBySlug } from "@/lib/autores";
import { getConceptosByAutor } from "@/lib/conceptos";
import { EJES_BY_SLUG } from "@/lib/ejes";

export function generateStaticParams() {
  return getAllAutores().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const autor = getAutorBySlug(slug);
  if (!autor) return {};
  return {
    title: `${autor.name} · Mapa Inestable`,
    description: autor.descripcion,
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

export default async function AutorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const autor = getAutorBySlug(slug);
  if (!autor) notFound();

  const conceptos = getConceptosByAutor(slug);
  const autores = getAllAutores();
  const totalAutores = autores.length;
  const autorIndex = autores.findIndex((a) => a.slug === slug);
  const numStr = String(autorIndex + 1).padStart(2, "0");

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
        <Link href="/autores" style={{ color: "var(--mi-ink-mute)" }}>← Autores</Link>
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
            <Link href="/autores" style={{ color: "var(--mi-ink-mute)" }}>Autores</Link>
            <span>·</span>
            <span style={{ color: "var(--mi-ink)" }}>{autor.name}</span>
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
            Autores · {numStr} de {String(totalAutores).padStart(2, "0")}
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
            {autor.name}
          </h1>

          {/* Descripcion */}
          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-xl)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "52ch",
            marginBottom: "var(--mi-space-4)",
          }}>
            {autor.descripcion}
          </p>

          {/* Meta */}
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
            <span>{autor.nacionalidad}</span>
            <span style={{ borderLeft: "var(--mi-border-dashed)", paddingLeft: "var(--mi-space-5)" }}>
              {autor.disciplina}
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

        {/* Obra clave */}
        {autor.obraClaveHtml && (
          <section>
            <span style={sectionLabel}>Obra clave para Mapa Inestable</span>
            <div
              className="mi-prose"
              dangerouslySetInnerHTML={{ __html: autor.obraClaveHtml }}
            />
          </section>
        )}

        {/* Tesis centrales */}
        {autor.tesisCentralesHtml && (
          <section>
            <span style={sectionLabel}>Tesis centrales relevantes</span>
            <div
              className="mi-prose"
              dangerouslySetInnerHTML={{ __html: autor.tesisCentralesHtml }}
            />
          </section>
        )}

        {/* Por qué importa (Huntington-style) */}
        {autor.porQueImportaHtml && (
          <section>
            <span style={sectionLabel}>Por qué importa para Mapa Inestable</span>
            <div
              className="mi-prose"
              dangerouslySetInnerHTML={{ __html: autor.porQueImportaHtml }}
            />
          </section>
        )}

        {/* Citas */}
        {autor.citasHtml && (
          <section>
            <span style={sectionLabel}>Citas registradas</span>
            <div
              className="mi-prose"
              dangerouslySetInnerHTML={{ __html: autor.citasHtml }}
            />
          </section>
        )}

        {/* Conceptos del autor */}
        {conceptos.length > 0 && (
          <section>
            <span style={sectionLabel}>Conceptos</span>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "var(--mi-space-3)",
            }}>
              {conceptos.map((c) => (
                <Link
                  key={c.slug}
                  href={`/concepto/${c.slug}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
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
                  {c.definicion && (
                    <span style={{
                      fontFamily: "var(--mi-font-body)",
                      fontStyle: "italic",
                      fontSize: "var(--mi-text-sm)",
                      color: "var(--mi-ink-soft)",
                      lineHeight: "var(--mi-leading-snug)",
                    }}>
                      {c.definicion.length > 80 ? c.definicion.slice(0, 80) + "…" : c.definicion}
                    </span>
                  )}
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
          </section>
        )}

        {/* Ejes que trabaja */}
        {autor.ejes.length > 0 && (
          <section>
            <span style={sectionLabel}>Ejes que trabaja</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--mi-space-2)" }}>
              {autor.ejes.map((ejeSlug) => {
                const eje = EJES_BY_SLUG[ejeSlug];
                return eje ? (
                  <Link
                    key={ejeSlug}
                    href={`/ejes/${ejeSlug}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--mi-space-3)",
                      border: "var(--mi-border-thick)",
                      background: "var(--mi-bg-paper)",
                      boxShadow: "var(--mi-shadow-card)",
                      padding: "var(--mi-space-3) var(--mi-space-4)",
                      borderLeft: `6px solid var(--mi-axis-${eje.axisKey})`,
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--mi-font-title)",
                      fontWeight: 600,
                      fontSize: "var(--mi-text-base)",
                      color: "var(--mi-ink)",
                      flex: 1,
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

        {/* Navegación entre autores */}
        <nav style={{
          borderTop: "var(--mi-border-bold)",
          paddingTop: "var(--mi-space-5)",
          display: "flex",
          justifyContent: "space-between",
          gap: "var(--mi-space-4)",
        }}>
          {autorIndex > 0 && (() => {
            const prev = autores[autorIndex - 1];
            return (
              <Link href={`/autor/${prev.slug}`} style={{
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
          {autorIndex < autores.length - 1 && (() => {
            const next = autores[autorIndex + 1];
            return (
              <Link href={`/autor/${next.slug}`} style={{
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
