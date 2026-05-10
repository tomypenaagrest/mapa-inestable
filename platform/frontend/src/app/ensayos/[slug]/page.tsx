import Link from "next/link";
import type { Metadata } from "next";
import { getEssayBySlug } from "@/lib/content";
import { isEssayDraft } from "@/lib/essay-drafts";
import { notFound } from "next/navigation";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);
  if (!essay) return {};
  const draft = isEssayDraft(slug);
  const titleSuffix = draft ? "[Borrador]" : "Mapa Inestable";
  const fullTitle = `${essay.title} — ${titleSuffix}`;
  const description = draft
    ? `[BORRADOR — no publicado] ${essay.lede || essay.title}`
    : essay.lede || `Ensayo de Mapa Inestable: ${essay.title}.`;
  return {
    title: { absolute: fullTitle },
    description,
    // Borradores no deben aparecer indexados ni con preview lindo en redes
    robots: draft ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
    },
  };
}

export default async function EnsayoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const essay = getEssayBySlug(slug);

  if (!essay) notFound();

  const isDraft = isEssayDraft(slug);

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
        <Link href="/ensayos" style={{ color: "var(--mi-ink-mute)" }}>← Ensayos</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Ensayo</span>
      </div>

      {/* Banner BORRADOR — solo cuando el slug está marcado como draft */}
      {isDraft && (
        <div style={{
          background: "var(--mi-ink)",
          color: "var(--mi-bg-paper)",
          padding: "var(--mi-space-4) var(--mi-space-6)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-sm)",
          letterSpacing: "var(--mi-tracking-wide)",
          textAlign: "center",
          borderBottom: "var(--mi-border-bold)",
        }}>
          <strong style={{ letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Borrador — no publicado
          </strong>
          <div style={{
            fontSize: "var(--mi-text-xs)",
            marginTop: "4px",
            opacity: 0.8,
            textTransform: "none",
            letterSpacing: "0.04em",
          }}>
            Este texto está en desarrollo. Las publicaciones reales del proyecto viven en el{" "}
            <a
              href="https://mapainestable.substack.com/"
              style={{ color: "var(--mi-accent-gold)", textDecoration: "underline" }}
            >
              Substack de Mapa Inestable
            </a>.
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="mi-container--narrow" style={{ paddingTop: "var(--mi-space-7)" }}>

        {/* Breadcrumb */}
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          marginBottom: "var(--mi-space-4)",
          display: "flex",
          gap: "var(--mi-space-2)",
          alignItems: "center",
        }}>
          <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>Inicio</Link>
          <span>·</span>
          <Link href="/ensayos" style={{ color: "var(--mi-ink-mute)" }}>Ensayos</Link>
          <span>·</span>
          <span style={{ color: "var(--mi-ink)" }}>Ensayo</span>
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: "var(--mi-font-title)",
          fontWeight: 700,
          fontSize: "var(--mi-text-4xl)",
          lineHeight: "var(--mi-leading-snug)",
          letterSpacing: "var(--mi-tracking-tight)",
          color: "var(--mi-ink)",
          maxWidth: "24ch",
          marginBottom: essay.lede ? "var(--mi-space-5)" : "var(--mi-space-7)",
        }}>
          {essay.title}
        </h1>

        {/* Lede */}
        {essay.lede && (
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-lg)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "60ch",
            marginBottom: "var(--mi-space-5)",
          }}>
            {essay.lede}
          </p>
        )}

        {/* Byline */}
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
          borderTop: "var(--mi-border-bold)",
          paddingTop: "var(--mi-space-4)",
          marginBottom: "var(--mi-space-7)",
        }}>
          <span>Por <strong style={{ color: "var(--mi-ink)" }}>Mapa Inestable</strong>{isDraft ? " · borrador" : ""}</span>
        </div>
      </div>

      {/* Cuerpo del ensayo */}
      <div className="mi-container--narrow" style={{ paddingBottom: "var(--mi-space-8)" }}>
        <div
          className="mi-prose"
          style={{ maxWidth: "70ch" }}
          dangerouslySetInnerHTML={{ __html: essay.html }}
        />
      </div>

    </div>
  );
}
