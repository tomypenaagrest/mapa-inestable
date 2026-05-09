// Torres García: sur arriba, norte abajo
// viewBox 0 0 100 160 — masa sólida, sin rellenos internos
const SA_PATH =
  "M 29,0 L 34,5 L 34,21 L 49,42 L 59,53 L 70,66 L 83,79 L 89,100 " +
  "Q 97,109 98,114 L 91,123 L 66,131 L 62,140 L 47,147 " +
  "L 42,157 L 31,159 L 18,160 L 11,157 L 9,150 " +
  "L 6,136 L 2,130 L 0,119 L 2,112 L 9,103 L 23,91 " +
  "L 23,77 L 21,53 L 17,33 L 15,19 L 13,9 Z";

const ICON_ASPECT = 100 / 160;

type Variant = "full" | "icon" | "wordmark";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, { iconHeight: number; fontSize: string; gap: string }> = {
  sm: { iconHeight: 28, fontSize: "var(--mi-text-2xl)", gap: "10px" },
  md: { iconHeight: 40, fontSize: "var(--mi-text-3xl)", gap: "var(--mi-space-3)" },
  lg: { iconHeight: 64, fontSize: "var(--mi-text-4xl)", gap: "var(--mi-space-4)" },
};

interface LogoProps {
  variant?: Variant;
  color?: string;
  size?: Size;
}

function SvgIcon({ height, color }: { height: number; color: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      width={Math.round(height * ICON_ASPECT)}
      height={height}
      aria-hidden="true"
      style={{ display: "block", flexShrink: 0 }}
    >
      <path d={SA_PATH} fill={color} />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  color = "var(--mi-ink)",
  size = "sm",
}: LogoProps) {
  const { iconHeight, fontSize, gap } = SIZES[size];

  if (variant === "icon") {
    return <SvgIcon height={iconHeight} color={color} />;
  }

  const wordmark = (
    <span style={{
      fontFamily: "var(--mi-font-display)",
      fontSize,
      fontWeight: 400,
      letterSpacing: "-0.03em",
      textTransform: "uppercase",
      color,
      lineHeight: 1,
    }}>
      Mapa Inestable
    </span>
  );

  if (variant === "wordmark") return wordmark;

  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <SvgIcon height={iconHeight} color={color} />
      {wordmark}
    </div>
  );
}
