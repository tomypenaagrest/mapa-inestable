import Link from "next/link";

const NAV_LINKS = [
  { href: "/despachos", label: "Despachos" },
  { href: "/ensayos",   label: "Ensayos" },
  { href: "/mapa",      label: "Mapa" },
  { href: "/acerca",    label: "Acerca" },
];

export default function SiteHeader() {
  return (
    <header style={{
      height: "var(--mi-header-h, 70px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 var(--mi-space-6)",
      borderBottom: "var(--mi-border-bold)",
      background: "var(--mi-bg)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand: mark + wordmark + · + tagline */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "var(--mi-space-3)",
          textDecoration: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-minimalista.svg"
          alt=""
          aria-hidden="true"
          width={43}
          height={48}
          style={{ display: "block", flexShrink: 0 }}
        />
        <span style={{
          fontFamily:    "var(--mi-font-display)",
          fontSize:      "22px",
          fontWeight:    400,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color:         "var(--mi-ink)",
          lineHeight:    1,
        }}>
          Mapa Inestable
        </span>
        <span
          className="mi-header-sep"
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize:   "13px",
            color:      "var(--mi-ink-mute)",
            padding:    "0 2px",
          }}
          aria-hidden="true"
        >
          ·
        </span>
        <span
          className="mi-header-tagline"
          style={{
            fontFamily:    "var(--mi-font-mono)",
            fontSize:      "11px",
            letterSpacing: "0.04em",
            color:         "var(--mi-ink-soft)",
            textTransform: "lowercase",
          }}
        >
          cartografía política del sur
        </span>
      </Link>

      {/* Nav */}
      <nav aria-label="Navegación principal">
        <ul style={{
          display:   "flex",
          gap:       "var(--mi-space-1)",
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
