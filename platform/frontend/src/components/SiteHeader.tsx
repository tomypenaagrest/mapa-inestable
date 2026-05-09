import Link from "next/link";
import Logo from "./Logo";

const NAV_LINKS = [
  { href: "/despachos", label: "Despachos" },
  { href: "/ensayos",   label: "Ensayos" },
  { href: "/mapa",      label: "Mapa" },
  { href: "/acerca",    label: "Acerca" },
];

interface Props {
  weeklyCountries?: { slug: string; name: string }[];
  currentWeek?: number;
  currentYear?: number;
  isFallback?: boolean;
}

export default function SiteHeader({ weeklyCountries = [], currentWeek, currentYear, isFallback }: Props) {
  const yearNum = currentYear ?? new Date().getFullYear();
  const siteYear = yearNum - 2024; // Año I = 2024, Año II = 2025, etc.
  const yearLabel = siteYear > 0 ? `Año ${toRoman(siteYear)}` : "Año I";

  const visibleCountries = weeklyCountries.slice(0, 5);
  const overflow = weeklyCountries.length - 5;

  return (
    <header>
      {/* Main bar */}
      <div style={{
        padding: "var(--mi-space-5) var(--mi-space-6) var(--mi-space-4)",
        borderBottom: weeklyCountries.length > 0 ? "var(--mi-border-soft)" : "var(--mi-border-bold)",
        display: "flex",
        alignItems: "center",
        gap: "var(--mi-space-5)",
      }}>
        <div style={{ flex: 1 }}>
          <Link href="/" style={{ display: "inline-block" }}>
            <Logo variant="full" size="md" />
            <div style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "12px",
              letterSpacing: "0.06em",
              color: "var(--mi-ink-soft)",
              marginTop: "var(--mi-space-2)",
            }}>
              cartografía política del sur
            </div>
          </Link>
        </div>

        {/* Sem / año info */}
        {currentWeek && (
          <div style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            display: "none", // visible solo en desktop via clase
          }}
            className="mi-header-week"
          >
            {yearLabel} · Sem {currentWeek} · {weeklyCountries.length} {weeklyCountries.length === 1 ? "país" : "países"}
          </div>
        )}

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
      </div>

      {/* Countries bar */}
      {weeklyCountries.length > 0 && (
        <div style={{
          borderBottom: "var(--mi-border-bold)",
          padding: `var(--mi-space-2) var(--mi-space-6)`,
          display: "flex",
          alignItems: "center",
          gap: "var(--mi-space-1)",
          background: "var(--mi-bg-paper)",
          flexWrap: "wrap",
        }}>
          {visibleCountries.map((c, i) => (
            <span key={c.slug} style={{ display: "flex", alignItems: "center", gap: "var(--mi-space-1)" }}>
              {i > 0 && (
                <span style={{
                  fontFamily: "var(--mi-font-mono)",
                  fontSize: "var(--mi-text-xs)",
                  color: "var(--mi-ink-mute)",
                }}>·</span>
              )}
              <Link
                href={`/pais/${c.slug}`}
                className="mi-country-week-link"
              >
                {c.name}
              </Link>
            </span>
          ))}
          {overflow > 0 && (
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              color: "var(--mi-ink-mute)",
              letterSpacing: "0.04em",
              marginLeft: "var(--mi-space-1)",
            }}>
              +{overflow}
            </span>
          )}
          {isFallback && currentWeek && (
            <span style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "10px",
              color: "var(--mi-ink-mute)",
              letterSpacing: "0.04em",
              marginLeft: "auto",
              opacity: 0.75,
            }}>
              última publicada: sem {currentWeek}
            </span>
          )}
        </div>
      )}
    </header>
  );
}

function toRoman(n: number): string {
  const MAP: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let result = "";
  let rem = n;
  for (const [val, sym] of MAP) {
    while (rem >= val) { result += sym; rem -= val; }
  }
  return result;
}
