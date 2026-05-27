import type { MacroIndicator, MacroCountryData } from "@/lib/macro-indicators";
import { delta, formatMacroValue } from "@/lib/macro-indicators";
import "@/styles/country-page.css";

interface Props {
  indicator: MacroIndicator;
  country:   MacroCountryData;
  compact?:  boolean;
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

/* === Quality badge (5 states) ===================================
   oficial:    sin badge visible
   revisado:   "rev." en mute
   estimado:   "est." en terracota (warn)
   cuestionado: "!" en terracota + borde terracota en la card
   congelado:  "cong." fondo tinta + texto crema
   =============================================================== */

type QualityState = "oficial" | "revisado" | "estimado" | "cuestionado" | "congelado";

function QualityBadge({ quality }: { quality: string }) {
  switch (quality as QualityState) {
    case "revisado":
      return <span className="quality-badge-revisado">rev.</span>;
    case "estimado":
      return <span className="quality-badge-estimado">est.</span>;
    case "cuestionado":
      return <span className="quality-badge-cuestionado">!</span>;
    case "congelado":
      return <span className="quality-badge-congelado">cong.</span>;
    default:
      return null;
  }
}

/* === Card ========================================================= */

export default function MacroIndicatorCard({ indicator, country, compact = false }: Props) {
  const latest = country.latest;
  if (!latest) return null;

  const d = delta(country.series, 5);
  const hasPositiveDelta = d !== null && d > 0;
  const hasNegativeDelta = d !== null && d < 0;
  const isCuestionado    = latest.quality === "cuestionado";

  const formattedValue = formatMacroValue(indicator, latest.value);

  /* Unidad corta para mostrar junto al sparkline */
  const unitShort =
    indicator.unit === "USD"      ? "USD"
    : indicator.unit === "por mil" ? "‰"
    : indicator.unit === "por 100k" ? "/100k"
    : indicator.unit === "índice"  ? ""
    : indicator.unit;

  return (
    <article
      className={`${compact ? "macro-card-compact" : ""} ${isCuestionado ? "quality-cuestionado" : ""}`}
      style={{
        background:  "var(--mi-bg-paper)",
        border:      isCuestionado ? `2px solid var(--mi-accent-warn)` : "var(--mi-border-thick)",
        boxShadow:   "var(--mi-shadow-card)",
        padding:     "var(--mi-space-3)",
        display:     "grid",
        gridTemplateRows: "auto 1fr auto auto",
        gap:         "var(--mi-space-2)",
        position:    "relative",
        minHeight:   compact ? 120 : 160,
      }}
    >
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
        <Sparkline series={country.series} height={compact ? 26 : 32} />
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
        <QualityBadge quality={latest.quality} />
      </div>
    </article>
  );
}
