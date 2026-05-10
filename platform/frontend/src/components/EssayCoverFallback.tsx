const AXIS_NAMES: Record<string, string> = {
  deculturacion:     "Deculturación",
  mediaciones:       "Erosión de mediaciones",
  desrepresentacion: "Desrepresentación",
  estetizacion:      "Estetización",
  desorientacion:    "Desorientación epistemológica",
  atencion:          "Atención",
};

interface Props {
  title: string;
  axisKey: string;
  variant?: "hero" | "thumbnail";
}

export default function EssayCoverFallback({ title, axisKey, variant = "thumbnail" }: Props) {
  const isHero = variant === "hero";
  const axisName = AXIS_NAMES[axisKey] ?? axisKey;

  return (
    <div
      className="mi-grain"
      style={{
        background: `var(--mi-axis-${axisKey})`,
        width: "100%",
        height: "100%",
        minHeight: isHero ? 320 : 160,
        padding: isHero ? "40px 48px" : "20px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "var(--mi-bg-paper)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <div>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          opacity: 0.6,
          marginBottom: isHero ? 10 : 5,
        }}>
          Ensayo
        </div>
        <div style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: isHero ? "12px" : "10px",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          opacity: 0.8,
        }}>
          {axisName}
        </div>
      </div>

      <div style={{
        fontFamily: "var(--mi-font-display)",
        fontSize: isHero ? "clamp(20px, 2.8vw, 34px)" : "16px",
        lineHeight: 1.0,
        textTransform: "uppercase",
        letterSpacing: "-0.01em",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: isHero ? 4 : 3,
        WebkitBoxOrient: "vertical",
      }}>
        {title}
      </div>

      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "9px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        opacity: 0.45,
      }}>
        Mapa Inestable
      </div>
    </div>
  );
}
