import Link from "next/link";
import { getAllEssays } from "@/lib/content";

export default function EnsayosPage() {
  const essays = getAllEssays();

  return (
    <div style={{ background: "var(--mi-bg)", minHeight: "100vh" }}>

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
        <span style={{ color: "var(--mi-accent-gold)" }}>Ensayos</span>
        <span>{essays.length} textos</span>
      </div>

      {/* Header */}
      <div style={{
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-7) var(--mi-space-6) var(--mi-space-6)",
      }} className="mi-grain">
        <div className="mi-container">
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-widest)",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
            opacity: 0.55,
            marginBottom: "var(--mi-space-3)",
          }}>
            Archivo · Borradores y ensayos
          </div>
          <h1 style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-5xl)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "var(--mi-bg-paper)",
          }}>
            Ensayos
          </h1>
        </div>
      </div>

      {/* Lista */}
      <div className="mi-container" style={{
        paddingTop: "var(--mi-space-7)",
        paddingBottom: "var(--mi-space-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--mi-space-1)",
      }}>
        {essays.map(e => (
          <article key={e.slug} style={{
            border: "var(--mi-border-thick)",
            background: "var(--mi-bg-paper)",
            padding: "var(--mi-space-4) var(--mi-space-5)",
            boxShadow: "var(--mi-shadow-card)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "var(--mi-space-4)",
            alignItems: "center",
          }}>
            <div>
              <h2 style={{
                fontFamily: "var(--mi-font-title)",
                fontWeight: 600,
                fontSize: "var(--mi-text-xl)",
                lineHeight: "var(--mi-leading-snug)",
                color: "var(--mi-ink)",
                marginBottom: e.lede ? "var(--mi-space-2)" : 0,
              }}>
                <Link href={`/ensayos/${e.slug}`}>{e.title}</Link>
              </h2>
              {e.lede && (
                <p style={{
                  fontFamily: "var(--mi-font-body)",
                  fontStyle: "italic",
                  fontSize: "var(--mi-text-base)",
                  lineHeight: "var(--mi-leading-normal)",
                  color: "var(--mi-ink-soft)",
                  maxWidth: "70ch",
                }}>
                  {e.lede}
                </p>
              )}
            </div>
            <Link
              href={`/ensayos/${e.slug}`}
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
  );
}
