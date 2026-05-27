import Link from "next/link";
import type { Metadata } from "next";
import { EJES } from "@/lib/ejes";
import { getAllPublications } from "@/lib/content";
import GlosarioIndex from "@/components/GlosarioIndex";
import "@/styles/mobile-restantes.css";

export const metadata: Metadata = {
  title: "Los seis ejes",
  description: "Marco interpretativo de Mapa Inestable. Los seis conceptos con los que analizamos las transformaciones políticas de Sudamérica.",
};

const COMO_SE_RELACIONAN = [
  { eje: "Deculturación", desc: "es la condición de fondo: sin marco cultural compartido, las mediaciones se erosionan." },
  { eje: "Erosión de mediaciones", desc: "cuando las mediaciones se debilitan, la representación pierde densidad y aparece la desrepresentación." },
  { eje: "Desrepresentación", desc: "sin marco cultural ni mediaciones fuertes, los símbolos quedan sueltos: estetización." },
  { eje: "Estetización", desc: "en ese vacío, distinguir lo real se vuelve difícil: desorientación epistemológica." },
  { eje: "Desorientación epistemológica", desc: "y emerge una mediación nueva, invisible: la atención capturada por arquitecturas algorítmicas." },
];

function EjeCard({ eje }: { eje: typeof EJES[0] }) {
  const numStr = String(eje.num).padStart(2, "0");
  const accentColor = `var(--mi-axis-${eje.axisKey})`;

  return (
    <Link
      href={`/ejes/${eje.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "var(--mi-border-thick)",
        background: "var(--mi-bg-paper)",
        boxShadow: "var(--mi-shadow-card)",
        padding: "var(--mi-space-4)",
        gap: "var(--mi-space-3)",
        textDecoration: "none",
        transition: "transform var(--mi-duration-quick) var(--mi-ease), box-shadow var(--mi-duration-quick) var(--mi-ease)",
      }}
      className="mi-eje-card"
    >
      {/* Número */}
      <div style={{
        fontFamily: "var(--mi-font-display)",
        fontSize: "var(--mi-text-3xl)",
        lineHeight: 1,
        color: accentColor,
        letterSpacing: "-0.02em",
      }}>
        {numStr}
      </div>

      {/* Nombre */}
      <h2 style={{
        fontFamily: "var(--mi-font-display)",
        fontSize: "var(--mi-text-xl)",
        textTransform: "uppercase",
        letterSpacing: "0.01em",
        lineHeight: "var(--mi-leading-snug)",
        color: "var(--mi-ink)",
        flex: 1,
      }}>
        {eje.name}
      </h2>

      {/* Definición */}
      <p style={{
        fontFamily: "var(--mi-font-body)",
        fontStyle: "italic",
        fontSize: "var(--mi-text-sm)",
        lineHeight: "var(--mi-leading-relaxed)",
        color: "var(--mi-ink-soft)",
      }}>
        {eje.definicion_corta}
      </p>

      {/* CTA */}
      <div style={{
        borderTop: "var(--mi-border-dashed)",
        paddingTop: "var(--mi-space-2)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wider)",
        textTransform: "uppercase",
        color: "var(--mi-ink)",
      }}>
        → entrar
      </div>
    </Link>
  );
}

export default function EjesPage() {
  const publications = getAllPublications();

  // Compute per-eje stats for mobile index
  const ejeItems = EJES.map(eje => {
    const ejePubs = publications.filter(p => p.ejePrincipal === eje.axisKey);
    const uniqueCountries = new Set(ejePubs.map(p => p.countrySlug).filter(Boolean));
    const metaText = ejePubs.length > 0
      ? `${ejePubs.length} análisis · ${uniqueCountries.size} países →`
      : "→ ver eje";
    return {
      href: `/ejes/${eje.slug}`,
      pinColor: `var(--mi-axis-${eje.axisKey})`,
      titulo: eje.name,
      descripcion: eje.definicion_corta,
      metaText,
    };
  });

  return (
    <>
      {/* Mobile — Spec 56 §4: GlosarioIndex reuse */}
      <div className="mr-mobile-only">
        <GlosarioIndex
          label="EJES"
          title="Ejes conceptuales"
          bajada="Los 6 ejes son la infraestructura interpretativa del proyecto. Cada uno organiza un conjunto de transformaciones estructurales que atraviesan la región."
          count={EJES.length}
          items={ejeItems}
        />
      </div>

      {/* Desktop — layout existente */}
      <div className="mr-desktop-only" style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

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
        <span style={{ color: "var(--mi-accent-gold)" }}>Marco interpretativo</span>
      </div>

      {/* Hero */}
      <div style={{
        background: "var(--mi-bg)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
      }} className="mi-grain">
        <div className="mi-container">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
            marginBottom: "var(--mi-space-3)",
          }}>
            Mapa Inestable · Ejes conceptuales
          </div>
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "clamp(52px, 7vw, var(--mi-text-display))",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            color: "var(--mi-ink)",
            textTransform: "uppercase",
            maxWidth: "12ch",
            marginBottom: "var(--mi-space-5)",
          }}>
            Los seis ejes
          </h1>
          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-xl)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "52ch",
          }}>
            Las estructuras que organizaban la vida colectiva pierden capacidad de mediación. Los seis ejes son los ángulos desde los que Mapa Inestable rastrea ese proceso.
          </p>
        </div>
      </div>

      {/* Grid 3×2 */}
      <div className="mi-container" style={{ paddingTop: "var(--mi-space-7)", paddingBottom: "var(--mi-space-7)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--mi-space-4)",
          marginBottom: "var(--mi-space-8)",
        }}>
          {EJES.map(eje => <EjeCard key={eje.slug} eje={eje} />)}
        </div>

        {/* Cómo se relacionan */}
        <section>
          <h2 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-2xl)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            color: "var(--mi-ink)",
            borderBottom: "var(--mi-border-bold)",
            paddingBottom: "var(--mi-space-3)",
            marginBottom: "var(--mi-space-5)",
          }}>
            Cómo se relacionan
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--mi-space-6)",
            alignItems: "start",
          }}>
            <div>
              <p style={{
                fontFamily: "var(--mi-font-title)",
                fontStyle: "italic",
                fontSize: "var(--mi-text-lg)",
                lineHeight: "var(--mi-leading-relaxed)",
                color: "var(--mi-ink-soft)",
                marginBottom: "var(--mi-space-5)",
              }}>
                Los seis ejes describen un mismo proceso desde ángulos distintos: la pérdida de capacidad de mediación de las estructuras tradicionales. Lo que antes organizaba la experiencia colectiva —cultura, instituciones, representación, símbolos compartidos, criterios de verdad, atención sincrónica— hoy funciona con menor densidad.
              </p>
              <div style={{ display: "flex", gap: "var(--mi-space-5)", flexWrap: "wrap" }}>
                <Link
                  href="/metodo"
                  style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wider)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink)",
                    borderBottom: "2px solid var(--mi-ink)",
                    paddingBottom: 4,
                  }}
                >
                  El método →
                </Link>
                <Link
                  href="/acerca"
                  style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wider)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink)",
                    borderBottom: "2px solid var(--mi-ink)",
                    paddingBottom: 4,
                  }}
                >
                  Sobre el proyecto →
                </Link>
              </div>
            </div>

            <ol style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "var(--mi-space-3)" }}>
              {COMO_SE_RELACIONAN.map((item, i) => (
                <li key={i} style={{
                  borderLeft: "3px solid var(--mi-ink)",
                  paddingLeft: "var(--mi-space-3)",
                }}>
                  <strong style={{
                    fontFamily: "var(--mi-font-mono)",
                    fontSize: "var(--mi-text-xs)",
                    letterSpacing: "var(--mi-tracking-wide)",
                    textTransform: "uppercase",
                    color: "var(--mi-ink)",
                    display: "block",
                    marginBottom: "var(--mi-space-1)",
                  }}>
                    {item.eje}
                  </strong>
                  <span style={{
                    fontFamily: "var(--mi-font-body)",
                    fontSize: "var(--mi-text-sm)",
                    lineHeight: "var(--mi-leading-relaxed)",
                    color: "var(--mi-ink-soft)",
                  }}>
                    {item.desc}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>

      </div> {/* end mr-desktop-only */}
    </>
  );
}
