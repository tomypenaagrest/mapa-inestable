import Link from "next/link";
import type { AgentDraftMeta } from "@/lib/content";
import MiniDraftCard from "./MiniDraftCard";

interface Props {
  drafts: AgentDraftMeta[];
}

export default function AnalisisColumn({ drafts }: Props) {
  const visible = drafts.slice(0, 4);

  return (
    <div style={{
      flex:      1,
      minWidth:  "var(--mi-analisis-col-min-w, 280px)",
      maxWidth:  "var(--mi-analisis-col-max-w, 380px)",
      height:    "100%",
      borderLeft:"var(--mi-border-thick)",
      display:   "flex",
      flexDirection: "column",
      overflow:  "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding:       "24px 16px 16px",
        borderBottom:  "1px solid var(--mi-rule-soft)",
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "13px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color:         "var(--mi-ink-mute)",
        flexShrink:    0,
      }}>
        Últimos análisis
      </div>

      {/* Cards */}
      <div
        className="mi-no-scrollbar"
        style={{
          flex:          1,
          overflowY:     "auto",
          padding:       "16px",
          display:       "flex",
          flexDirection: "column",
          gap:           "12px",
          scrollbarWidth:"none",
        }}
      >
        {visible.length > 0 ? (
          visible.map(draft => (
            <MiniDraftCard key={draft.slug} draft={draft} />
          ))
        ) : (
          <p style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "13px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color:         "var(--mi-ink-mute)",
            lineHeight:    1.5,
          }}>
            El archivo está arrancando.<br />
            Las primeras publicaciones aparecen acá apenas estén cargadas.
          </p>
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding:    "16px",
        borderTop:  "1px solid var(--mi-rule-soft)",
        flexShrink: 0,
      }}>
        <Link href="/analisis" className="mi-col-footer-link">
          → Ver todos los análisis
        </Link>
      </div>
    </div>
  );
}
