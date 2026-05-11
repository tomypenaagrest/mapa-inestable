import Link from "next/link";
import type { Metadata } from "next";
import { getAllAgentDrafts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Borradores del agente — Mapa Inestable",
  description: "Análisis diarios producidos por el agente automatizado. No publicados todavía.",
  robots: { index: false, follow: false },
};

const EJE_LABEL: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación",
  atencion:          "Atención",
};

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d} ${meses[m - 1]} ${y}`;
}

export default function BorradoresPage() {
  const drafts = getAllAgentDrafts();

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Meta-bar */}
      <div style={{
        background: "var(--mi-ink)",
        color: "var(--mi-bg-paper)",
        padding: "6px var(--mi-space-6)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        display: "flex",
        gap: "var(--mi-space-6)",
        alignItems: "center",
      }}>
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <Link href="/analisis" style={{ color: "var(--mi-ink-mute)" }}>← Archivo</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Borradores del agente</span>
        <span>{drafts.length} {drafts.length === 1 ? "borrador" : "borradores"}</span>
      </div>

      {/* Header editorial */}
      <div style={{
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
        background: "var(--mi-bg-paper)",
      }}>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-3)",
        }}>
          Producción interna · agente diario
        </div>
        <h1 style={{
          fontFamily: "var(--mi-font-display)",
          fontSize: "var(--mi-text-5xl)",
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: "var(--mi-ink)",
          marginBottom: "var(--mi-space-4)",
        }}>
          Borradores
        </h1>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontStyle: "italic",
          fontSize: "var(--mi-text-base)",
          color: "var(--mi-ink-soft)",
          maxWidth: "62ch",
          lineHeight: "var(--mi-leading-normal)",
        }}>
          Análisis producidos cada día por el agente automatizado de Mapa Inestable. No están publicados — son insumos del flujo de producción, antes de pasar al Substack.
        </p>
      </div>

      {/* Grid */}
      <div style={{ padding: "var(--mi-space-7) var(--mi-space-6)" }}>
        {drafts.length === 0 ? (
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-sm)",
            color: "var(--mi-ink-mute)",
            textAlign: "center",
            padding: "var(--mi-space-8)",
          }}>
            El agente todavía no escribió ningún borrador.
          </div>
        ) : (
          <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gap: "var(--mi-space-4)",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
            maxWidth: "1280px",
          }}>
            {drafts.map(d => (
              <li key={d.slug}>
                <Link
                  href={`/analisis/borradores/${d.countrySlug}/${d.pieceSlug}`}
                  style={{ display: "block", textDecoration: "none", color: "inherit" }}
                >
                  <article style={{
                    border: "var(--mi-border-bold)",
                    boxShadow: "var(--mi-shadow-card)",
                    background: "var(--mi-bg-paper)",
                    padding: "var(--mi-space-4)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--mi-space-2)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-2)", flexWrap: "wrap" }}>
                      <span style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: "10px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--mi-bg-paper)",
                        background: "var(--mi-ink)",
                        padding: "2px 6px",
                        fontWeight: 700,
                      }}>
                        Borrador
                      </span>
                      {d.ejePrincipal && (
                        <span style={{
                          fontFamily: "var(--mi-font-mono)",
                          fontSize: "10px",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--mi-bg-paper)",
                          background: `var(--mi-axis-${d.ejePrincipal})`,
                          padding: "2px 6px",
                          fontWeight: 600,
                        }}>
                          {EJE_LABEL[d.ejePrincipal] ?? d.ejePrincipal}
                        </span>
                      )}
                      <span style={{
                        fontFamily: "var(--mi-font-mono)",
                        fontSize: "11px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--mi-ink-mute)",
                      }}>
                        {d.country} · {fmtDate(d.date)}
                      </span>
                    </div>
                    <h2 style={{
                      fontFamily: "var(--mi-font-title)",
                      fontWeight: 600,
                      fontSize: "var(--mi-text-lg)",
                      lineHeight: "var(--mi-leading-snug)",
                      color: "var(--mi-ink)",
                    }}>
                      {d.title}
                    </h2>
                    {d.lede && (
                      <p style={{
                        fontFamily: "var(--mi-font-body)",
                        fontStyle: "italic",
                        fontSize: "var(--mi-text-sm)",
                        lineHeight: "var(--mi-leading-normal)",
                        color: "var(--mi-ink-soft)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        margin: 0,
                      }}>
                        {d.lede}
                      </p>
                    )}
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
