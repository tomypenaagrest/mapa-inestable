import Link from "next/link";
import EssayCoverFallback from "./EssayCoverFallback";

const AXIS_LABELS: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Erosión de mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación epistemológica",
  atencion:          "Atención",
};

export interface EssayEntry {
  slug: string;
  title: string;
  lede: string;
  axisKey: string;
  author: string;
  week: number;
  year: number;
  readingTime: number;
  publishedAt: string;
  publishedIso: string;
  coverImage?: string;
  featured?: boolean;
  /** Si es true, el ensayo se muestra como borrador / próximamente. No tiene fecha de publicación válida ni linkea a la pieza completa. */
  draft?: boolean;
}

interface Props {
  essay: EssayEntry;
  variant: "hero" | "thumbnail";
}

function Cover({ essay, variant }: { essay: EssayEntry; variant: "hero" | "thumbnail" }) {
  if (essay.coverImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={essay.coverImage}
        alt={essay.title}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    );
  }
  return <EssayCoverFallback title={essay.title} axisKey={essay.axisKey} variant={variant} />;
}

function DraftPill({ small }: { small?: boolean }) {
  return (
    <span style={{
      fontFamily: "var(--mi-font-mono)",
      fontSize: small ? "10px" : "11px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--mi-bg-paper)",
      background: "var(--mi-ink)",
      padding: small ? "2px 6px" : "2px 8px",
      fontWeight: 700,
    }}>
      Borrador
    </span>
  );
}

export default function EssayCard({ essay, variant }: Props) {
  const axisLabel = AXIS_LABELS[essay.axisKey] ?? essay.axisKey;
  const isDraft = essay.draft === true;
  const byline = isDraft
    ? `Por ${essay.author.split(" ")[0]} · borrador · sin publicar`
    : `Por ${essay.author.split(" ")[0]} · sem ${essay.week} · ${essay.year}`;

  if (variant === "hero") {
    const heroBody = (
      <article className="mi-essay-hero">
        <div style={{ overflow: "hidden" }}>
          <Cover essay={essay} variant="hero" />
        </div>
        <div style={{
          padding: "clamp(32px, 5vw, 64px) clamp(32px, 5vw, 72px)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--mi-space-4)",
          justifyContent: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-2)", flexWrap: "wrap" }}>
            <span className="mi-axis-pill" style={{ background: `var(--mi-axis-${essay.axisKey})` }}>
              {axisLabel}
            </span>
            {isDraft ? <DraftPill /> : null}
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "11px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
            }}>
              · {essay.readingTime} min de lectura
            </span>
          </div>
          <h1 style={{
            fontFamily: "var(--mi-font-title)",
            fontWeight: 700,
            fontSize: "clamp(26px, 3.2vw, 52px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: "var(--mi-ink)",
          }}>
            {essay.title}
          </h1>
          <p style={{
            fontFamily: "var(--mi-font-body)",
            fontStyle: "italic",
            fontSize: "clamp(15px, 1.4vw, 22px)",
            lineHeight: "var(--mi-leading-normal)",
            color: "var(--mi-ink-soft)",
            maxWidth: "46ch",
          }}>
            {essay.lede}
          </p>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--mi-ink-mute)",
          }}>
            {byline}
          </div>
          {isDraft ? (
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
              fontStyle: "italic",
            }}>
              — En desarrollo. Próximamente. —
            </div>
          ) : (
            <div>
              <span style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-xs)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--mi-ink)",
                borderBottom: "2px solid var(--mi-ink)",
                paddingBottom: 2,
              }}>
                Leer →
              </span>
            </div>
          )}
        </div>
      </article>
    );

    if (isDraft) {
      return (
        <div style={{ display: "block", textDecoration: "none", cursor: "default", opacity: 0.85 }}>
          {heroBody}
        </div>
      );
    }
    return (
      <Link href={`/ensayos/${essay.slug}`} style={{ display: "block", textDecoration: "none" }}>
        {heroBody}
      </Link>
    );
  }

  // thumbnail
  const thumbBody = (
    <article className="mi-essay-card" style={{
      border: "var(--mi-border-bold)",
      boxShadow: "var(--mi-shadow-card)",
      background: "var(--mi-bg-paper)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      <div style={{ aspectRatio: "3/2", overflow: "hidden", flexShrink: 0 }}>
        <Cover essay={essay} variant="thumbnail" />
      </div>
      <div style={{
        padding: "var(--mi-space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--mi-space-2)",
        flex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-1)", flexWrap: "wrap" }}>
          <span className="mi-axis-pill" style={{
            background: `var(--mi-axis-${essay.axisKey})`,
            fontSize: "10px",
            padding: "2px 6px",
          }}>
            {axisLabel}
          </span>
          {isDraft ? <DraftPill small /> : null}
          <span style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "10px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
          }}>
            · {essay.readingTime} min
          </span>
        </div>
        <h2 style={{
          fontFamily: "var(--mi-font-title)",
          fontWeight: 600,
          fontSize: "var(--mi-text-lg)",
          lineHeight: "var(--mi-leading-snug)",
          color: "var(--mi-ink)",
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {essay.title}
        </h2>
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontStyle: "italic",
          fontSize: "var(--mi-text-sm)",
          lineHeight: "var(--mi-leading-normal)",
          color: "var(--mi-ink-soft)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          {essay.lede}
        </p>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: "var(--mi-ink-mute)",
          marginTop: "auto",
          paddingTop: "var(--mi-space-2)",
        }}>
          {byline}
        </div>
      </div>
    </article>
  );

  if (isDraft) {
    return (
      <div style={{ display: "block", textDecoration: "none", height: "100%", cursor: "default", opacity: 0.85 }}>
        {thumbBody}
      </div>
    );
  }
  return (
    <Link href={`/ensayos/${essay.slug}`} style={{ display: "block", textDecoration: "none", height: "100%" }}>
      {thumbBody}
    </Link>
  );
}
