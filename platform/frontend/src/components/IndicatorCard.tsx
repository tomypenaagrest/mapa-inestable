import Link from "next/link";
import type { Indicator, IndicatorCountryData } from "@/lib/latinobarometro";
import { axisDisplayKey } from "@/lib/latinobarometro";

interface Props {
  indicator: Indicator;
  country: IndicatorCountryData;
}

const TOTAL_COUNTRIES = 17;

export default function IndicatorCard({ indicator, country }: Props) {
  const axisKey = axisDisplayKey(indicator.axis);
  const { value, rank, n } = country;
  const regional = indicator.regional_value;
  const isScale = indicator.unit === "escala 0-10";

  const valueStr   = value.toFixed(1);
  const unitStr    = isScale ? "/10" : "%";
  const regionalStr = isScale
    ? `Reg. ${regional.toFixed(1)}`
    : `Reg. ${Math.round(regional)}%`;

  const isTop    = rank === 1;
  const isBottom = rank === TOTAL_COUNTRIES;
  const rankBg   = isTop    ? "var(--mi-accent-warn)"
                 : isBottom ? "var(--mi-bg-dark)"
                 : "var(--mi-ink)";
  const rankArrow = isTop ? "↑ " : isBottom ? "↓ " : "";
  const cite = `§${indicator.section_pdf} · pág. ${indicator.page_pdf}`;

  return (
    <article style={{
      background:  "var(--mi-bg-paper)",
      border:      "var(--mi-border-thick)",
      boxShadow:   "var(--mi-shadow-card)",
      padding:     "var(--mi-space-3)",
      display:     "grid",
      gridTemplateRows: "auto 1fr auto auto",
      gap:         "var(--mi-space-2)",
      position:    "relative",
      minHeight:   200,
    }}>
      {/* Top color bar — 6px, axis color */}
      <div style={{
        position: "absolute",
        top: -2, left: -2, right: -2,
        height: 6,
        background: `var(--mi-axis-${axisKey})`,
      }} />

      {/* Label */}
      <div style={{
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        color:         "var(--mi-ink-mute)",
        marginTop:     "var(--mi-space-2)",
        lineHeight:    1.4,
      }}>
        {indicator.label}
      </div>

      {/* Big value */}
      <div style={{
        fontFamily: "var(--mi-font-display)",
        fontSize:   44,
        lineHeight: 1,
        color:      "var(--mi-ink)",
        display:    "flex",
        alignItems: "baseline",
        gap:        4,
      }}>
        {valueStr}
        <span style={{
          fontFamily: "var(--mi-font-display)",
          fontSize:   18,
          color:      "var(--mi-ink-mute)",
        }}>
          {unitStr}
        </span>
      </div>

      {/* Meta: rank chip + regional */}
      <div style={{
        display:    "flex",
        alignItems: "center",
        gap:        "var(--mi-space-2)",
        flexWrap:   "wrap",
      }}>
        <span style={{
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
          background:    rankBg,
          color:         "var(--mi-bg-paper)",
          padding:       "2px 8px",
          whiteSpace:    "nowrap",
        }}>
          {rankArrow}#{rank} de {TOTAL_COUNTRIES}
        </span>
        <span style={{
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          color:         "var(--mi-ink-soft)",
          letterSpacing: "0.04em",
        }}>
          {regionalStr}
        </span>
      </div>

      {/* Cite footer */}
      <div style={{
        fontFamily:     "var(--mi-font-mono)",
        fontSize:       10,
        letterSpacing:  "var(--mi-tracking-wide)",
        textTransform:  "uppercase",
        color:          "var(--mi-ink-mute)",
        borderTop:      "var(--mi-border-dashed)",
        paddingTop:     "var(--mi-space-2)",
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        gap:            "var(--mi-space-2)",
      }}>
        <span title={`${indicator.question_text} · Var: ${indicator.questionnaire_var} · n=${n.toLocaleString("es-AR")}`}>
          {cite}
        </span>
        <Link
          href={`/comparar/${indicator.id}`}
          style={{
            color:          "var(--mi-ink)",
            borderBottom:   "1px solid var(--mi-ink)",
            textDecoration: "none",
            whiteSpace:     "nowrap",
          }}
        >
          Comparar →
        </Link>
      </div>
    </article>
  );
}
