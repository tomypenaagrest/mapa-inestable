import Link from "next/link";

const EJES = [
  "Deculturación",
  "Erosión de mediaciones",
  "Desrepresentación",
  "Estetización",
  "Desorientación epistemológica",
  "Atención",
];

const PAISES: [string, string][] = [
  ["Argentina", "ar"], ["Brasil", "br"],
  ["Chile", "cl"], ["Colombia", "co"],
  ["Bolivia", "bo"], ["Perú", "pe"],
  ["Uruguay", "uy"], ["Paraguay", "py"],
  ["Ecuador", "ec"], ["Venezuela", "ve"],
];

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--mi-font-mono)",
  fontSize: "var(--mi-text-xs)",
  letterSpacing: "var(--mi-tracking-wider)",
  textTransform: "uppercase",
  color: "var(--mi-accent-gold)",
  marginBottom: "var(--mi-space-3)",
  display: "block",
};

export default function SiteFooter() {
  return (
    <footer style={{
      background: "var(--mi-bg-dark)",
      color: "var(--mi-bg-paper)",
      borderTop: "var(--mi-border-bold)",
      padding: "var(--mi-space-7) var(--mi-space-6)",
      marginTop: "var(--mi-space-8)",
    }}>
      <div style={{
        maxWidth: "var(--mi-container)",
        marginInline: "auto",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "var(--mi-space-7)",
      }}>

        <div>
          <span style={labelStyle}>Hipótesis</span>
          <p style={{
            fontFamily: "var(--mi-font-title)",
            fontStyle: "italic",
            fontSize: "var(--mi-text-lg)",
            lineHeight: "var(--mi-leading-relaxed)",
            color: "var(--mi-bg-paper)",
            maxWidth: "42ch",
          }}>
            Las estructuras que organizaban la vida colectiva pierden capacidad de mediación. Mapa Inestable rastrea esa pérdida.
          </p>
        </div>

        <div>
          <span style={labelStyle}>Los seis ejes</span>
          <ul style={{ listStyle: "none", lineHeight: 2 }}>
            {EJES.map(eje => (
              <li key={eje} style={{
                fontFamily: "var(--mi-font-mono)",
                fontSize: "var(--mi-text-sm)",
                color: "var(--mi-bg-paper)",
              }}>
                {eje}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <span style={labelStyle}>Países</span>
          <ul style={{ listStyle: "none", lineHeight: 2 }}>
            {PAISES.map(([nombre, slug]) => (
              <li key={slug}>
                <Link href={`/pais/${slug}`} className="mi-footer-link">
                  {nombre}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div style={{
        maxWidth: "var(--mi-container)",
        marginInline: "auto",
        marginTop: "var(--mi-space-7)",
        borderTop: "1px solid rgba(244,233,210,0.15)",
        paddingTop: "var(--mi-space-4)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
      }}>
        <span>Mapa Inestable · Cartografía política del sur</span>
        <span>Sur arriba — siempre</span>
      </div>
    </footer>
  );
}
