import Link from "next/link";
import type { Metadata } from "next";
import { getAllConceptos } from "@/lib/conceptos";
import { EJES_BY_SLUG } from "@/lib/ejes";

export const metadata: Metadata = {
  title: "Conceptos · Mapa Inestable",
  description: "Las categorías analíticas con las que Mapa Inestable interpreta los procesos políticos de Sudamérica.",
};

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

export default function ConceptosPage() {
  const conceptos = getAllConceptos();

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
        <span style={{ color: "var(--mi-accent-gold)" }}>Marco conceptual</span>
      </div>

      {/* Hero */}
      <div style={{
        background: "var(--mi-bg-paper)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
      }}>
        <div className="mi-container--narrow">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            marginBottom: "var(--mi-space-3)",
          }}>
            Marco · {conceptos.length} conceptos publicados
          </div>

          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(52px, 7vw, var(--mi-text-display))",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            maxWidth: "16ch",
            marginBottom: "var(--mi-space-5)",
          }}>
            Conceptos
          </h1>

          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-xl)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "52ch",
          }}>
            Las categorías analíticas con las que Mapa Inestable interpreta los procesos políticos de Sudamérica.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mi-container--narrow" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-8)",
      }}>
        <span style={sectionLabel}>
          Conceptos · {conceptos.length} de {conceptos.length}
        </span>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "var(--mi-space-4)",
        }}>
          {conceptos.map((concepto) => (
            <Link
              key={concepto.slug}
              href={`/concepto/${concepto.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--mi-space-3)",
                border: "var(--mi-border-thick)",
                background: "var(--mi-bg-paper)",
                boxShadow: "var(--mi-shadow-card)",
                padding: "var(--mi-space-4)",
              }}
            >
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                {concepto.autores[0]}
                {concepto.ano ? ` · ${concepto.ano}` : ""}
              </div>

              <h2 style={{
                fontFamily: "var(--mi-font-title)",
                fontWeight: 600,
                fontSize: "var(--mi-text-xl)",
                lineHeight: "var(--mi-leading-snug)",
                color: "var(--mi-ink)",
              }}>
                {concepto.name}
              </h2>

              {concepto.definicion && (
                <p style={{
                  fontFamily: "var(--mi-font-title)",
                  fontStyle: "italic",
                  fontSize: "var(--mi-text-sm)",
                  lineHeight: "var(--mi-leading-relaxed)",
                  color: "var(--mi-ink-soft)",
                  flex: 1,
                }}>
                  {concepto.definicion.length > 140
                    ? concepto.definicion.slice(0, 140) + "…"
                    : concepto.definicion}
                </p>
              )}

              {concepto.ejesRelacionados.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {concepto.ejesRelacionados.slice(0, 2).map((ejeSlug) => {
                    const eje = EJES_BY_SLUG[ejeSlug];
                    return eje ? (
                      <span
                        key={ejeSlug}
                        style={{
                          fontFamily: "var(--mi-font-mono)",
                          fontSize: "var(--mi-text-xs)",
                          letterSpacing: "var(--mi-tracking-wide)",
                          textTransform: "uppercase",
                          color: "var(--mi-bg-paper)",
                          background: `var(--mi-axis-${eje.axisKey})`,
                          padding: "2px 6px",
                        }}
                      >
                        {eje.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                → ver concepto
              </span>
            </Link>
          ))}
        </div>

        <div style={{
          marginTop: "var(--mi-space-8)",
          borderTop: "var(--mi-border-bold)",
          paddingTop: "var(--mi-space-5)",
          display: "flex",
          gap: "var(--mi-space-6)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
        }}>
          <Link href="/ejes" style={{ color: "var(--mi-ink-mute)" }}>→ Los seis ejes</Link>
          <Link href="/autores" style={{ color: "var(--mi-ink-mute)" }}>→ Autores</Link>
          <Link href="/metodo" style={{ color: "var(--mi-ink-mute)" }}>→ Método</Link>
        </div>
      </div>
    </div>
  );
}
