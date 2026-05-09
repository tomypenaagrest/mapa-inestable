import Link from "next/link";
import type { Metadata } from "next";
import { getAllAutores } from "@/lib/autores";
import { EJES_BY_SLUG } from "@/lib/ejes";

export const metadata: Metadata = {
  title: "Autores · Mapa Inestable",
  description: "Los pensadores cuya obra sostiene el andamiaje teórico de Mapa Inestable.",
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

export default function AutoresPage() {
  const autores = getAllAutores();

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
            Marco · {autores.length} autores publicados
          </div>

          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(52px, 7vw, var(--mi-text-display))",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            maxWidth: "14ch",
            marginBottom: "var(--mi-space-5)",
          }}>
            Autores
          </h1>

          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-xl)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "52ch",
          }}>
            Los pensadores cuya obra sostiene el andamiaje interpretativo de Mapa Inestable.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="mi-container--narrow" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-8)",
      }}>
        <span style={sectionLabel}>
          Autores · {autores.length} de {autores.length}
        </span>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "var(--mi-space-4)",
        }}>
          {autores.map((autor) => (
            <Link
              key={autor.slug}
              href={`/autor/${autor.slug}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--mi-space-2)",
                border: "var(--mi-border-thick)",
                background: "var(--mi-bg-paper)",
                boxShadow: "var(--mi-shadow-card)",
                padding: "var(--mi-space-4)",
                transition: "transform var(--mi-duration-quick) var(--mi-ease), box-shadow var(--mi-duration-quick) var(--mi-ease)",
              }}
            >
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "var(--mi-tracking-wide)",
                textTransform: "uppercase",
                color: "var(--mi-ink-mute)",
              }}>
                {autor.nacionalidad} · {autor.disciplina.split(",")[0]}
              </div>

              <h2 style={{
                fontFamily: "var(--mi-font-title)",
                fontWeight: 600,
                fontSize: "var(--mi-text-xl)",
                lineHeight: "var(--mi-leading-snug)",
                color: "var(--mi-ink)",
              }}>
                {autor.name}
              </h2>

              {autor.descripcion && (
                <p style={{
                  fontFamily: "var(--mi-font-body)",
                  fontSize: "var(--mi-text-sm)",
                  lineHeight: "var(--mi-leading-relaxed)",
                  color: "var(--mi-ink-soft)",
                  flex: 1,
                }}>
                  {autor.descripcion.length > 120
                    ? autor.descripcion.slice(0, 120) + "…"
                    : autor.descripcion}
                </p>
              )}

              {autor.ejes.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {autor.ejes.slice(0, 2).map((ejeSlug) => {
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
                marginTop: "var(--mi-space-1)",
              }}>
                → ver perfil
              </span>
            </Link>
          ))}
        </div>

        {/* Links a otras secciones del marco */}
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
          <Link href="/conceptos" style={{ color: "var(--mi-ink-mute)" }}>→ Conceptos clave</Link>
          <Link href="/metodo" style={{ color: "var(--mi-ink-mute)" }}>→ Método</Link>
        </div>
      </div>
    </div>
  );
}
