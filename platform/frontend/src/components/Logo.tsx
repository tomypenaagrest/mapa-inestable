import Image from "next/image";

/**
 * Variantes del logo (Spec 21):
 *   full       — logo completo cuadrado (OG image, /acerca, footer)
 *   horizontal — silueta+escalador | wordmark + tagline (header del sitio)
 *   monogram   — solo silueta+escalador, sin texto (marca de agua, app icon)
 *   wordmark   — solo tipografía "MAPA INESTABLE" (email, citas)
 *
 * Estado de archivos (2026-05-10):
 *   /logo-completo.svg        ✓ disponible (vectorial, 962 KB) — usado por variant="full"
 *   /logo-completo.png        ✓ disponible (1024×1024, 898 KB) — fallback raster
 *   /logo-horizontal.svg      ⚠ FALTA — Spec 21 Fase B (producción de Tomás/diseñador)
 *   /logo-monograma.svg       ⚠ FALTA — Spec 21 Fase B
 *
 * Mientras no existan los SVG dedicados, las variantes "horizontal" y "monogram"
 * usan /logo-completo.svg como fallback temporal. La variante "horizontal" en el
 * header sufre por esto: el SVG cuadrado se escala feo en una caja angosta.
 * Cuando Tomás produzca logo-horizontal.svg, cambiar el path en src abajo.
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
        {/* TEMP: usa logo-completo.svg como fallback hasta que exista logo-horizontal.svg dedicado (Spec 21 Fase B) */}
        <Image
          src="/logo-completo.svg"
          alt=""
          width={px}
          height={px}
          style={{ display: "block", flexShrink: 0 }}
          priority
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
    // TEMP: usa logo-completo.svg como fallback hasta que exista logo-monograma.svg dedicado (Spec 21 Fase B)
    return (
      <Image
        src="/logo-completo.svg"
        alt="Mapa Inestable"
        width={px}
        height={px}
        style={{ display: "block" }}
        priority
      />
    );
  }

  // full — vectorial v3 (Spec 21, archivos producidos 2026-05-10)
  return (
    <Image
      src="/logo-completo.svg"
      alt="Mapa Inestable"
      width={px}
      height={px}
      style={{ display: "block" }}
      priority
    />
  );
}
