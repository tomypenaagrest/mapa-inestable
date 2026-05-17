"use client";
import Link from "next/link";
import type { AgentDraftMeta } from "@/lib/content";
import { EJES } from "@/lib/ejes";

function shortDate(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${d} ${meses[m - 1]}`;
}

interface Props {
  draft: AgentDraftMeta;
}

export default function MiniDraftCard({ draft }: Props) {
  const href = `/analisis/borradores/${draft.countrySlug}/${draft.pieceSlug}`;

  const country = (draft.country ?? draft.countrySlug).toUpperCase();
  const date    = shortDate(draft.date);
  const meta    = [country, date, `sem ${draft.week}`].filter(Boolean).join(" · ");

  const ejeObj  = EJES.find(e => e.axisKey === draft.ejePrincipal);
  const ejeName = ejeObj?.name ?? draft.ejePrincipal;

  return (
    <Link
      href={href}
      className="mi-mini-card"
      style={{
        display:        "block",
        background:     "var(--mi-bg-paper)",
        border:         "var(--mi-border-thick)",
        boxShadow:      "var(--mi-shadow-card)",
        padding:        "16px",
        minHeight:      "120px",
        cursor:         "pointer",
        textDecoration: "none",
      }}
    >
      {/* Metadata */}
      <div style={{
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "11px",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color:         "var(--mi-ink-mute)",
        marginBottom:  "8px",
        paddingBottom: "8px",
        borderBottom:  "1px solid var(--mi-rule-soft)",
      }}>
        {meta}
      </div>

      {/* Axis pill */}
      {draft.ejePrincipal && (
        <div style={{ marginBottom: "8px" }}>
          <span
            className="mi-axis-pill"
            style={{ background: `var(--mi-axis-${draft.ejePrincipal})`, fontSize: "11px" }}
          >
            {ejeName}
          </span>
        </div>
      )}

      {/* Title */}
      <div style={{
        fontFamily:        "var(--mi-font-display)",
        fontSize:          "17px",
        fontWeight:        400,
        lineHeight:        1.2,
        color:             "var(--mi-ink)",
        marginBottom:      draft.lede ? "8px" : 0,
        overflow:          "hidden",
        display:           "-webkit-box",
        WebkitLineClamp:   2,
        WebkitBoxOrient:   "vertical",
      }}>
        {draft.title}
      </div>

      {/* Lede */}
      {draft.lede && (
        <div style={{
          fontFamily:      "var(--mi-font-body)",
          fontStyle:       "italic",
          fontSize:        "13px",
          lineHeight:      1.4,
          color:           "var(--mi-ink-soft)",
          overflow:        "hidden",
          display:         "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {draft.lede}
        </div>
      )}
    </Link>
  );
}
