import Link from "next/link";
import type { Metadata } from "next";
import { getEssayBySlug } from "@/lib/content";
import { isEssayDraft } from "@/lib/essay-drafts";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { calcReadingTime } from "@/lib/text-utils";

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
  const readingTime = calcReadingTime(essay.html);

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Navegación top */}
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
        <span style={{ color: "var(--mi-accent-gold)" }}>{isDraft ? "Borrador" : "Ensayo"}</span>
      </div>

      {/* Banner BORRADOR */}
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

      {/* Article header — Spec 50 §2 layout */}
      <div className="article-page-header">

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
          <span style={{ color: "var(--mi-ink)" }}>{isDraft ? "Borrador" : "Ensayo"}</span>
        </div>

        {/* H1 — ensayos no tienen country display */}
        <h1 className="article-h1">{essay.title}</h1>

        {/* Meta bar */}
        <div className="article-meta-bar">
          <span className="article-meta-item">
            <span className="article-meta-label">Lectura</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-value">{readingTime} min</span>
          </span>
          <span className="article-meta-item">
            <span className="article-meta-label">Autor</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-value">Mapa Inestable{isDraft ? " · borrador" : ""}</span>
          </span>
        </div>

        {/* Lede */}
        {essay.lede && (
          <p className="article-lede">{essay.lede}</p>
        )}
      </div>

      {/* Portada in-flow — coverImage se agrega en Spec 37 para ensayos */}

      {/* Cuerpo */}
      <ArticleBody html={essay.html} />

    </div>
  );
}
