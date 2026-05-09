import Link from "next/link";

interface AxisItem {
  name: string;
  key: string;
  slug: string;
}

interface Props {
  axes: AxisItem[];
}

export default function FrameStripInline({ axes }: Props) {
  return (
    <div style={{
      borderTop: "var(--mi-border-thick)",
      borderBottom: "var(--mi-border-thick)",
      padding: "var(--mi-space-3) 0",
      background: "var(--mi-bg-paper)",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "var(--mi-space-2)",
      marginBottom: "var(--mi-space-5)",
    }}>
      <span style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-widest)",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
        marginRight: "var(--mi-space-1)",
      }}>
        Este análisis se activa en
      </span>

      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {axes.map((ax, i) => (
          <span key={ax.key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {i > 0 && (
              <span style={{ color: "var(--mi-ink-mute)", fontFamily: "var(--mi-font-mono)", fontSize: "var(--mi-text-xs)" }}>·</span>
            )}
            <span style={{
              display: "inline-block",
              background: `var(--mi-axis-${ax.key})`,
              color: "var(--mi-bg-paper)",
              padding: "2px 8px",
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
            }}>
              {ax.name}
            </span>
          </span>
        ))}
      </div>

      <div style={{ display: "flex", gap: "var(--mi-space-3)", marginLeft: "auto" }}>
        {axes[0] && (
          <Link
            href={`/ejes/${axes[0].slug}`}
            style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize: "var(--mi-text-xs)",
              letterSpacing: "var(--mi-tracking-wide)",
              textTransform: "uppercase",
              color: "var(--mi-ink-mute)",
              textDecoration: "underline",
            }}
          >
            Sobre el eje
          </Link>
        )}
        <Link
          href="/metodo"
          style={{
            fontFamily: "var(--mi-font-mono)",
            fontSize: "var(--mi-text-xs)",
            letterSpacing: "var(--mi-tracking-wide)",
            textTransform: "uppercase",
            color: "var(--mi-ink-mute)",
            textDecoration: "underline",
          }}
        >
          El método
        </Link>
      </div>
    </div>
  );
}
