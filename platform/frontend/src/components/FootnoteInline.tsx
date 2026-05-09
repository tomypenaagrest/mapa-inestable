"use client";

interface Props {
  mark: string;
  type: string;
  onClick: () => void;
}

export default function FootnoteInline({ mark, type, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={`Ver referencia: ${type}`}
      title={`Ver ${type}`}
      style={{
        display: "inline",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0 1px",
        marginLeft: "1px",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "0.65em",
        lineHeight: 1,
        verticalAlign: "super",
        color: "var(--mi-accent-gold)",
      }}
    >
      {mark}
    </button>
  );
}
