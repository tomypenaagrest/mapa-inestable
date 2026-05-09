import Image from "next/image";

type Variant = "full" | "icon" | "wordmark";
type Size = "sm" | "md" | "lg";

interface LogoProps {
  variant?: Variant;
  size?: Size;
  /** @deprecated — el PNG tiene colores fijos. Parámetro ignorado. */
  color?: string;
}

const SIZE_PX: Record<Size, number> = {
  sm: 52,
  md: 80,
  lg: 128,
};

export default function Logo({ variant = "full", size = "sm" }: LogoProps) {
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

  // "icon" usa el logo sin la figura trepadora (más limpio a tamaño pequeño)
  // "full" usa el logo completo con figura y ola
  const src = variant === "icon" ? "/logo-simple.png" : "/logo.png";

  return (
    <Image
      src={src}
      alt="Mapa Inestable"
      width={px}
      height={px}
      style={{ display: "block" }}
      priority
    />
  );
}
