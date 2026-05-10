/**
 * Logo — Spec 21 r2 (HTML puro, sin archivos de imagen)
 *
 * Variantes:
 *   full       — mark grande + wordmark apilados (footer, /acerca)
 *   horizontal — mark | wordmark + tagline en línea (header del sitio)
 *   monogram   — solo el mark asterisco (marca de agua, app icon)
 *   wordmark   — solo tipografía "MAPA INESTABLE" (email, citas)
 *
 * El mark es el asterisco dorado sobre fondo terracota (Spec 21 §3.5),
 * definido en SVG inline — no requiere ningún archivo externo.
 */

type Variant = "full" | "horizontal" | "monogram" | "wordmark";
type Size = "sm" | "md" | "lg";

interface LogoProps {
  variant?: Variant;
  size?: Size;
}

const SIZE_PX: Record<Size, number> = {
  sm: 40,
  md: 48,
  lg: 72,
};

function Mark({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width="32" height="32" fill="var(--mi-bg-warm, #C5663A)" />
      <g transform="translate(16,16)" fill="var(--mi-brand-gold, #E8B14B)">
        <rect x="-1.5" y="-9" width="3" height="18" rx="1.5" />
        <rect x="-1.5" y="-9" width="3" height="18" rx="1.5" transform="rotate(60)" />
        <rect x="-1.5" y="-9" width="3" height="18" rx="1.5" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export default function Logo({ variant = "full", size = "md" }: LogoProps) {
  const px = SIZE_PX[size];

  if (variant === "wordmark") {
    return (
      <span style={{
        fontFamily:    "var(--mi-font-display)",
        fontSize:      px * 0.9,
        fontWeight:    400,
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        color:         "var(--mi-ink)",
        lineHeight:    1,
      }}>
        Mapa Inestable
      </span>
    );
  }

  if (variant === "monogram") {
    return <Mark px={px} />;
  }

  if (variant === "horizontal") {
    const titleSize = Math.round(px * 0.52);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-3)" }}>
        <Mark px={px} />
        <div>
          <div style={{
            fontFamily:    "var(--mi-font-display)",
            fontSize:      titleSize,
            fontWeight:    400,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color:         "var(--mi-ink)",
            lineHeight:    1,
          }}>
            Mapa Inestable
          </div>
          <div style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "10px",
            letterSpacing: "0.07em",
            color:         "var(--mi-ink-mute)",
            marginTop:     "5px",
            textTransform: "lowercase",
          }}>
            cartografía política del sur
          </div>
        </div>
      </div>
    );
  }

  // full — mark grande + wordmark apilados
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "flex-start", gap: "var(--mi-space-2)" }}>
      <Mark px={px} />
      <div style={{
        fontFamily:    "var(--mi-font-display)",
        fontSize:      Math.round(px * 0.38),
        fontWeight:    400,
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        color:         "var(--mi-ink)",
        lineHeight:    1,
      }}>
        Mapa Inestable
      </div>
    </div>
  );
}
