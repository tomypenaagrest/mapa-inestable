import type { MacroIndicator, MacroCountryData } from "@/lib/macro-indicators";
import { delta, formatMacroValue } from "@/lib/macro-indicators";

interface Props {
  indicator: MacroIndicator;
  country: MacroCountryData;
}

/* === Sparkline SVG ================================================ */

function Sparkline({
  series,
  width = 120,
  height = 32,
}: {
  series: { value: number }[];
  width?: number;
  height?: number;
}) {
  if (series.length < 2) return null;

  const values = series.map(p => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const pts = series.map((p, i) => {
    const x = (i / (series.length - 1)) * width;
    const y = height - ((p.value - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polyline = pts.join(" ");
  const lastX = parseFloat(pts[pts.length - 1].split(",")[0]);
  const lastY = parseFloat(pts[pts.length - 1].split(",")[1]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", overflow: "visible" }}
      aria-hidden
    >
      <polyline
        points={polyline}
        fill="none"
        stroke="var(--mi-ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.6}
      />
      <circle
        cx={lastX}
        cy={lastY}
        r={3}
        fill="var(--mi-ink)"
      />
    </svg>
  );
}

/* === Quality badge ================================================ */

const QUALITY_LABEL: Record<string, string> = {
  oficial:    "",
  estimado:   "est.",
  congelado:  "cong.",
};

const QUALITY_COLOR: Record<string, string> = {
  oficial:   "var(--mi-ink-mute)",
  estimado:  "var(--mi-accent-warn)",
  congelado: "var(--mi-ink-soft)",
};

/* === Card ========================================================= */

export default function MacroIndicatorCard({ indicator, country }: Props) {
  const latest = country.latest;
  if (!latest) return null;

  const d = delta(country.series, 5);
  const hasPositiveDelta = d !== null && d > 0;
  const hasNegativeDelta = d !== null && d < 0;
  const qualityLabel  = QUALITY_LABEL[latest.quality] ?? "";
  const qualityColor  = QUALITY_COLOR[latest.quality] ?? "var(--mi-ink-mute)";

  const formattedValue = formatMacroValue(indicator, latest.value);

  /* Unidad corta para mostrar junto al sparkline */
  const unitShort =
    indicator.unit === "USD"      ? "USD"
    : indicator.unit === "por mil" ? "‰"
    : indicator.unit === "por 100k" ? "/100k"
    : indicator.unit === "índice"  ? ""
    : indicator.unit;

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
      minHeight:   160,
    }}>
      {/* Label */}
      <div style={{
        fontFamily:    "var(--mi-font-mono)",
        fontSize:      "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        color:         "var(--mi-ink-mute)",
        lineHeight:    1.4,
      }}>
        {indicator.label}
      </div>

      {/* Sparkline + valor principal */}
      <div style={{
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "flex-end",
        gap:            "var(--mi-space-2)",
      }}>
        <Sparkline series={country.series} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{
            fontFamily: "var(--mi-font-display)",
            fontSize:   32,
            lineHeight: 1,
            color:      "var(--mi-ink)",
          }}>
            {formattedValue}
          </span>
          {unitShort && (
            <span style={{
              fontFamily: "var(--mi-font-display)",
              fontSize:   14,
              color:      "var(--mi-ink-mute)",
            }}>
              {unitShort}
            </span>
          )}
        </div>
      </div>

      {/* Delta + año */}
      <div style={{
        display:    "flex",
        alignItems: "center",
        gap:        "var(--mi-space-2)",
        flexWrap:   "wrap",
      }}>
        {d !== null && (
          <span style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            color: hasPositiveDelta
              ? "var(--mi-ink)"
              : hasNegativeDelta
              ? "var(--mi-ink-mute)"
              : "var(--mi-ink-soft)",
          }}>
            {hasPositiveDelta ? "+" : ""}{d.toLocaleString("es-AR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}{unitShort || "%"} vs 5a
          </span>
        )}
        <span style={{
          fontFamily:    "var(--mi-font-mono)",
          fontSize:      "var(--mi-text-xs)",
          color:         "var(--mi-ink-soft)",
          letterSpacing: "0.04em",
        }}>
          {latest.year}
        </span>
      </div>

      {/* Footer: fuente + quality */}
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
        <a
          href={indicator.source.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color:          "var(--mi-ink-mute)",
            borderBottom:   "1px solid var(--mi-ink-mute)",
            textDecoration: "none",
            overflow:       "hidden",
            textOverflow:   "ellipsis",
            whiteSpace:     "nowrap",
          }}
          title={indicator.methodology}
        >
          {indicator.source.name}
        </a>
        {qualityLabel && (
          <span style={{ color: qualityColor, flexShrink: 0 }}>
            {qualityLabel}
          </span>
        )}
      </div>
    </article>
  );
}
