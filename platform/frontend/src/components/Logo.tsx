import Image from "next/image";

/**
 * Variantes del logo (Spec 21):
 *   full       — logo completo cuadrado (OG image, /acerca, footer)
 *   horizontal — silueta+escalador | wordmark + tagline (header del sitio)
 *   monogram   — solo silueta+escalador, sin texto (marca de agua, app icon)
 *   wordmark   — solo tipografía "MAPA INESTABLE" (email, citas)
 *
 * Archivos esperados en /public/ (Fase B — producción de Tomás):
 *   /logo-completo.png        → variante full
 *   /logo-horizontal.svg      → variante horizontal (parte izquierda)
 *   /logo-monograma.svg       → variante monogram
 *   Mientras no existan: fallback al PNG v3.
 */

type Variant = "full" | "horizontal" | "monogram" | "wordmark";
type Size = "sm" | "md" | "lg";

interface LogoProps {
  variant?: Variant;
  size?: Size;
}

const SIZE_PX: Record<Size, number> = {
  sm: 52,
  md: 96,
  lg: 128,
};

export default function Logo({ variant = "full", size = "md" }: LogoProps) {
  const px = SIZE_PX[size];

  if (variant === "wordmark") {
    return (
      <span style={{
        fontFamily: "var(--mi-font-display)",
        fontSize: px * 0.45,
        fontWeight: 400,
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        color: "var(--mi-ink)",
        lineHeight: 1,
      }}>
        Mapa Inestable
      </span>
    );
  }

  if (variant === "horizontal") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-4)" }}>
        <Image
          src="/logo-horizontal.svg"
          alt=""
          width={px * 0.6}
          height={px}
          style={{ display: "block", flexShrink: 0 }}
          priority
          onError={() => {}}
        />
        <div>
          <div style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: Math.round(px * 0.32),
            fontWeight: 400,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: "var(--mi-ink)",
            lineHeight: 1,
          }}>
            Mapa Inestable
          </div>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "11px",
            letterSpacing: "0.08em",
            color: "var(--mi-ink-soft)",
            marginTop: "4px",
            textTransform: "lowercase",
          }}>
            cartografía política del sur
          </div>
        </div>
      </div>
    );
  }

  if (variant === "monogram") {
    return (
      <Image
        src="/logo-monograma.svg"
        alt="Mapa Inestable"
        width={px}
        height={px}
        style={{ display: "block" }}
        priority
      />
    );
  }

  // full — fallback al PNG v3 mientras no exista logo-completo.png
  return (
    <Image
      src="/logo-completo.png"
      alt="Mapa Inestable"
      width={px}
      height={px}
      style={{ display: "block" }}
      priority
    />
  );
}
