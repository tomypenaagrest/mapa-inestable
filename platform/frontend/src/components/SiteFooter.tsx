import Link from "next/link";

const EJES: [string, string][] = [
  ["Deculturación", "deculturacion"],
  ["Erosión de mediaciones", "erosion-de-mediaciones"],
  ["Desrepresentación", "desrepresentacion"],
  ["Estetización", "estetizacion"],
  ["Desorientación epistemológica", "desorientacion-epistemologica"],
  ["Atención", "atencion"],
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
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
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
            {EJES.map(([nombre, slug]) => (
              <li key={slug}>
                <Link href={`/ejes/${slug}`} className="mi-footer-link">
                  {nombre}
                </Link>
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

        <div>
          <span style={labelStyle}>Marco</span>
          <ul style={{ listStyle: "none", lineHeight: 2 }}>
            <li><Link href="/ejes" className="mi-footer-link">Los seis ejes</Link></li>
            <li><Link href="/autores" className="mi-footer-link">Autores</Link></li>
            <li><Link href="/conceptos" className="mi-footer-link">Conceptos</Link></li>
            <li><Link href="/metodo" className="mi-footer-link">Método</Link></li>
            <li><Link href="/acerca" className="mi-footer-link">Acerca</Link></li>
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
        gap: "var(--mi-space-5)",
        flexWrap: "wrap",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
      }}>
        <span>Mapa Inestable · Cartografía política del sur</span>
        <div style={{ display: "flex", gap: "var(--mi-space-4)" }}>
          <Link href="/despachos" className="mi-footer-link">Despachos</Link>
          <Link href="/analisis" className="mi-footer-link">Archivo</Link>
          <Link href="/ensayos" className="mi-footer-link">Ensayos</Link>
        </div>
        <span>Sur arriba — siempre</span>
      </div>
    </footer>
  );
}
