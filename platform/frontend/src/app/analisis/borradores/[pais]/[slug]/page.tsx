import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAgentDraft } from "@/lib/content";
import { CoverImage } from "@/components/CoverImage";
import ArticleBody from "@/components/ArticleBody";
import { calcReadingTime } from "@/lib/text-utils";

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

const EJE_LABEL: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Erosión de mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación epistemológica",
  atencion:          "Atención (transversal)",
};

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

  const readingTime = calcReadingTime(draft.html);
  const ejeKey = draft.ejePrincipal;

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Navegación top */}
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
          flexWrap: "wrap",
        }}>
          <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>Inicio</Link>
          <span>·</span>
          <Link href="/analisis/borradores" style={{ color: "var(--mi-ink-mute)" }}>Borradores</Link>
          <span>·</span>
          <Link href={`/pais/${draft.countrySlug}`} style={{ color: "var(--mi-ink-mute)" }}>{draft.country}</Link>
        </div>

        {/* Country display */}
        <p className="article-country">{draft.country}</p>

        {/* H1 */}
        <h1 className="article-h1">{draft.title}</h1>

        {/* Meta bar */}
        <div className="article-meta-bar">
          <span className="article-meta-item">
            <span className="article-meta-label">Publicado</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-value">{fmtDate(draft.date)}</span>
          </span>
          <span className="article-meta-item">
            <span className="article-meta-label">Lectura</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-value">{readingTime} min</span>
          </span>
          <span className="article-meta-item">
            <span className="article-meta-label">Autor</span>
            <span className="article-meta-sep">·</span>
            <span className="article-meta-value">Agente Mapa Inestable</span>
          </span>
        </div>

        {/* Axis pills */}
        {ejeKey && (
          <div className="article-axis-row">
            <span
              className={`article-axis-pill${ejeKey === "atencion" ? " article-axis-pill--atencion" : ""}`}
              style={{ background: `var(--mi-axis-${ejeKey})` }}
            >
              {EJE_LABEL[ejeKey] ?? ejeKey}
            </span>
          </div>
        )}

        {/* Lede */}
        {draft.lede && (
          <p className="article-lede">{draft.lede}</p>
        )}
      </div>

      {/* Portada in-flow */}
      {draft.coverImage && (
        <div className="article-cover-inflow">
          <CoverImage piece={draft} variant="in-flow" priority />
        </div>
      )}

      {/* Disparador — trazabilidad de la fuente */}
      {draft.disparador?.url && (
        <div style={{
          maxWidth: "var(--mi-container-narrow)",
          margin: "0 auto",
          padding: "0 48px 24px",
        }}>
          <div style={{
            borderLeft: `3px solid var(--mi-axis-${ejeKey ?? "mediaciones"})`,
            paddingLeft: "var(--mi-space-4)",
          }}>
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
              marginBottom: "var(--mi-space-1)",
            }}>
              Disparador
            </div>
            <a
              href={draft.disparador.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--mi-font-body)",
                fontSize: "var(--mi-text-sm)",
                color: "var(--mi-ink)",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
              }}
            >
              {draft.disparador.titulo ?? draft.disparador.url}
            </a>
            {(draft.disparador.medio || draft.disparador.fecha_publicacion) && (
              <div style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                color: "var(--mi-ink-mute)",
                marginTop: "var(--mi-space-1)",
              }}>
                {[draft.disparador.medio, draft.disparador.fecha_publicacion].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cuerpo — ArticleBody con clases Spec 50 */}
      <ArticleBody html={draft.html} />

    </div>
  );
}
