import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAgentDraft } from "@/lib/content";

export async function generateMetadata(
  { params }: { params: Promise<{ pais: string; slug: string }> }
): Promise<Metadata> {
  const { pais, slug } = await params;
  const draft = getAgentDraft(pais, slug);
  if (!draft) return {};
  return {
    title: { absolute: `${draft.title} — [Borrador del agente]` },
    description: `[BORRADOR — no publicado] ${draft.lede || draft.title}`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${draft.title} — [Borrador del agente]`,
      description: `[BORRADOR] ${draft.lede || draft.title}`,
    },
  };
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${d} de ${meses[m - 1]} de ${y}`;
}

export default async function BorradorAgentePage(
  { params }: { params: Promise<{ pais: string; slug: string }> }
) {
  const { pais, slug } = await params;
  const draft = getAgentDraft(pais, slug);
  if (!draft) notFound();

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
        <Link href="/analisis/borradores" style={{ color: "var(--mi-ink-mute)" }}>← Borradores</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>{fmtDate(draft.date)}</span>
        <span>{draft.country}</span>
      </div>

      {/* Banner BORRADOR */}
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
          Borrador — generado por agente diario
        </strong>
        <div style={{
          fontSize: "var(--mi-text-xs)",
          marginTop: "4px",
          opacity: 0.8,
          textTransform: "none",
          letterSpacing: "0.04em",
        }}>
          Producción interna del agente automatizado, antes de pasar a edición y publicación. Las publicaciones reales del proyecto viven en el{" "}
          <a href="https://mapainestable.substack.com/" style={{ color: "var(--mi-accent-gold)", textDecoration: "underline" }}>
            Substack de Mapa Inestable
          </a>.
        </div>
      </div>

      {/* Hero textual */}
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
          flexWrap: "wrap",
        }}>
          <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>Inicio</Link>
          <span>·</span>
          <Link href="/analisis/borradores" style={{ color: "var(--mi-ink-mute)" }}>Borradores</Link>
          <span>·</span>
          <Link href={`/pais/${draft.countrySlug}`} style={{ color: "var(--mi-ink-mute)" }}>{draft.country}</Link>
          <span>·</span>
          <span style={{ color: "var(--mi-ink)" }}>Borrador</span>
        </div>

        {/* Título */}
        <h1 style={{
          fontFamily: "var(--mi-font-title)",
          fontWeight: 700,
          fontSize: "var(--mi-text-4xl)",
          lineHeight: "var(--mi-leading-snug)",
          letterSpacing: "var(--mi-tracking-tight)",
          color: "var(--mi-ink)",
          maxWidth: "26ch",
          marginBottom: draft.lede ? "var(--mi-space-5)" : "var(--mi-space-7)",
        }}>
          {draft.title}
        </h1>

        {/* Lede */}
        {draft.lede && (
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-lg)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "62ch",
            marginBottom: "var(--mi-space-5)",
          }}>
            {draft.lede}
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
          <span>Por <strong style={{ color: "var(--mi-ink)" }}>Agente Mapa Inestable</strong> · borrador no publicado</span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="mi-container--narrow" style={{ paddingBottom: "var(--mi-space-8)" }}>
        <div
          className="mi-prose"
          style={{ maxWidth: "70ch" }}
          dangerouslySetInnerHTML={{ __html: draft.html }}
        />
      </div>

    </div>
  );
}
