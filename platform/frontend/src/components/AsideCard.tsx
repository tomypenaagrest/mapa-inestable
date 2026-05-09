import Link from "next/link";
import type { Footnote } from "@/lib/analisis";

interface Props {
  footnote: Footnote;
  mark: string;
  isActive: boolean;
  onClick: () => void;
}

export default function AsideCard({ footnote, mark, isActive, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "var(--mi-space-3)",
        marginBottom: "var(--mi-space-3)",
        border: isActive ? "var(--mi-border-bold)" : "var(--mi-border-soft)",
        background: isActive ? "var(--mi-bg-cream)" : "transparent",
        transition: "background 200ms ease, border-color 200ms ease",
        cursor: "pointer",
      }}
    >
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        color: "var(--mi-accent-gold)",
        marginBottom: "var(--mi-space-2)",
      }}>
        {mark} · {footnote.type}
      </div>
      {footnote.type === "fuente" && <FuenteContent fn={footnote} />}
      {footnote.type === "concepto" && <ConceptoContent fn={footnote} />}
      {footnote.type === "autor" && <AutorContent fn={footnote} />}
      {footnote.type === "estadistica" && <EstadisticaContent fn={footnote} />}
      {footnote.type === "analisis" && <AnalisisRefContent fn={footnote} />}
    </div>
  );
}

function FuenteContent({ fn }: { fn: Footnote }) {
  return (
    <div>
      {fn.medio && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink)",
          fontWeight: 500,
        }}>
          {fn.medio}
        </div>
      )}
      {fn.autorNota && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-soft)",
        }}>
          {fn.autorNota}
        </div>
      )}
      {fn.fecha && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
        }}>
          {fn.fecha}
        </div>
      )}
      {fn.url && (
        <a
          href={fn.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{
            display: "block",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            marginTop: "var(--mi-space-1)",
          }}
        >
          → Ver fuente
        </a>
      )}
    </div>
  );
}

function ConceptoContent({ fn }: { fn: Footnote }) {
  return (
    <div>
      {fn.definicion && (
        <p style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink)",
          lineHeight: "var(--mi-leading-relaxed)",
          marginBottom: "var(--mi-space-1)",
          fontStyle: "italic",
        }}>
          {fn.definicion}
        </p>
      )}
      {fn.acunadoPor && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
        }}>
          — {fn.acunadoPor}
        </div>
      )}
      {fn.conceptoSlug && (
        <Link
          href={`/conceptos/${fn.conceptoSlug}`}
          onClick={e => e.stopPropagation()}
          style={{
            display: "block",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            marginTop: "var(--mi-space-1)",
          }}
        >
          → Ver concepto
        </Link>
      )}
    </div>
  );
}

function AutorContent({ fn }: { fn: Footnote }) {
  return (
    <div>
      {fn.nombre && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink)",
          fontWeight: 500,
        }}>
          {fn.nombre}
        </div>
      )}
      {fn.obra && (
        <div style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-xs)",
          fontStyle: "italic",
          color: "var(--mi-ink-soft)",
        }}>
          {fn.obra}{fn.year ? ` (${fn.year})` : ""}
        </div>
      )}
      {fn.slug && (
        <Link
          href={`/autores/${fn.slug}`}
          onClick={e => e.stopPropagation()}
          style={{
            display: "block",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            marginTop: "var(--mi-space-1)",
          }}
        >
          → Ver autor
        </Link>
      )}
    </div>
  );
}

function EstadisticaContent({ fn }: { fn: Footnote }) {
  return (
    <div>
      {fn.indicador && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          {fn.indicador}
        </div>
      )}
      {fn.valor && (
        <div style={{
          fontFamily: "var(--mi-font-title)",
          fontSize: "var(--mi-text-lg)",
          color: "var(--mi-ink)",
          fontWeight: 700,
          lineHeight: 1.1,
        }}>
          {fn.valor}
        </div>
      )}
      {fn.fuenteNombre && (
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink-mute)",
        }}>
          {fn.fuenteNombre}
        </div>
      )}
    </div>
  );
}

function AnalisisRefContent({ fn }: { fn: Footnote }) {
  return (
    <div>
      {fn.titulo && (
        <div style={{
          fontFamily: "var(--mi-font-body)",
          fontSize: "var(--mi-text-xs)",
          color: "var(--mi-ink)",
        }}>
          {fn.titulo}
        </div>
      )}
      {fn.countrySlugRef && fn.analisisSlug && (
        <Link
          href={`/analisis/${fn.countrySlugRef}/${fn.analisisSlug}`}
          onClick={e => e.stopPropagation()}
          style={{
            display: "block",
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            color: "var(--mi-ink-mute)",
            marginTop: "var(--mi-space-1)",
          }}
        >
          → Ver análisis
        </Link>
      )}
    </div>
  );
}
