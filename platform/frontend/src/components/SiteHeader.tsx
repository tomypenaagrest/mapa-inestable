import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/despachos", label: "Despachos" },
  { href: "/ensayos", label: "Ensayos" },
  { href: "/mapa", label: "Mapa" },
  { href: "/acerca", label: "Acerca" },
];

export default function SiteHeader() {
  return (
    <header style={{
      padding: "var(--mi-space-5) var(--mi-space-6) var(--mi-space-4)",
      borderBottom: "var(--mi-border-bold)",
      display: "flex",
      alignItems: "center",
      gap: "var(--mi-space-5)",
    }}>
      <div style={{ flex: 1 }}>
        <Link href="/" style={{ display: "inline-block" }}>
          <div style={{
            fontFamily: "var(--mi-font-display)",
            fontSize: "var(--mi-text-4xl)",
            lineHeight: "var(--mi-leading-tight)",
            letterSpacing: "-0.01em",
            color: "var(--mi-ink)",
            textTransform: "uppercase",
          }}>
            Mapa Inestable
          </div>
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wider)",
            textTransform: "uppercase",
            color: "var(--mi-ink-soft)",
            marginTop: "var(--mi-space-1)",
          }}>
            Cartografía política del sur · Año II
          </div>
        </Link>
      </div>

      <nav aria-label="Navegación principal">
        <ul style={{
          display: "flex",
          gap: "var(--mi-space-1)",
          listStyle: "none",
        }}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="mi-nav-link">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
