"use client";
import { useEffect, useCallback, useState } from "react";
import { useReaderState } from "@/hooks/useReaderState";
import { splitParagraphs, computeFootnoteParagraphId } from "@/lib/text-utils";
import type { Footnote } from "@/lib/analisis";
import FootnoteInline from "./FootnoteInline";

/* === Paragraph share ============================================== */

function ParagraphShare({ pId, isApertura }: { pId: string; isApertura: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#${pId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: no clipboard access
    }
  }, [pId]);

  return (
    <button
      onClick={handleCopy}
      title={copied ? "¡Copiado!" : "Copiar link a este párrafo"}
      aria-label="Compartir párrafo"
      className={`mi-para-share${isApertura ? " mi-para-share--always" : ""}`}
      style={{
        position: "absolute",
        left: -44,
        top: 0,
        width: 32,
        height: 32,
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: isApertura ? 0.6 : 0,
        transition: "opacity 150ms ease",
        fontFamily: "var(--mi-font-display)",
        fontSize: 18,
        color: "var(--mi-bg-warm)",
        padding: 0,
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
      onMouseLeave={e => { if (!isApertura) (e.currentTarget as HTMLButtonElement).style.opacity = "0"; }}
    >
      {copied ? "✓" : "❝"}
    </button>
  );
}

/* === Step block =================================================== */

const STEP_LABELS: Record<string, string> = {
  step_disparador: "Disparador",
  step_desplazamiento: "Desplazamiento",
  step_conceptualizacion: "Conceptualización",
  step_apertura: "Apertura",
};

const STEP_NUMS: Record<string, string> = {
  step_disparador: "01",
  step_desplazamiento: "02",
  step_conceptualizacion: "03",
  step_apertura: "04",
};

const STEP_KEYS = ["step_disparador", "step_desplazamiento", "step_conceptualizacion", "step_apertura"] as const;
type StepKey = typeof STEP_KEYS[number];

interface StepBlockProps {
  stepKey: StepKey;
  body: string;
  pStart: number;
  highlightPId: string | null;
  footnoteByPId: Map<string, Footnote>;
  marks: Map<string, string>;
  onFootnoteClick: (fn: Footnote) => void;
}

function StepBlock({ stepKey, body, pStart, highlightPId, footnoteByPId, marks, onFootnoteClick }: StepBlockProps) {
  const num = STEP_NUMS[stepKey];
  const label = STEP_LABELS[stepKey];
  const isApertura = stepKey === "step_apertura";
  const paragraphs = splitParagraphs(body);

  return (
    <div style={{
      border: "var(--mi-border-thick)",
      boxShadow: "var(--mi-shadow-card)",
      background: "var(--mi-bg-paper)",
      marginBottom: "var(--mi-space-5)",
    }}>
      <div style={{
        borderBottom: "var(--mi-border-dashed)",
        padding: "var(--mi-space-3) var(--mi-space-4)",
        display: "flex",
        alignItems: "baseline",
        gap: "var(--mi-space-3)",
      }}>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-3xl)",
          fontWeight: 400,
          color: "var(--mi-bg-cream)",
          lineHeight: 1,
          userSelect: "none",
        }}>
          {num}
        </span>
        <span style={{
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-widest)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
        }}>
          {label}
        </span>
      </div>

      <div style={{ padding: "var(--mi-space-4) var(--mi-space-4) var(--mi-space-5)" }}>
        {paragraphs.map((para, i) => {
          const pId = `p-${pStart + i}`;
          const isHighlighted = highlightPId === pId;
          const footnote = footnoteByPId.get(pId);
          return (
            <p
              key={pId}
              id={pId}
              style={{
                fontFamily: isApertura ? "var(--mi-font-title)" : "var(--mi-font-body)",
                fontSize: isApertura ? "var(--mi-text-lg)" : "var(--mi-text-base)",
                lineHeight: "var(--mi-leading-relaxed)",
                fontStyle: isApertura ? "italic" : "normal",
                color: isHighlighted ? "var(--mi-bg-paper)" : "var(--mi-ink)",
                marginBottom: i < paragraphs.length - 1 ? "var(--mi-space-3)" : 0,
                position: "relative",
                background: isHighlighted ? "var(--mi-bg-warm)" : "transparent",
                padding: isHighlighted ? "2px 4px" : undefined,
                transition: "background 300ms ease, color 300ms ease",
              }}
            >
              <ParagraphShare pId={pId} isApertura={isApertura} />
              {para}
              {footnote && marks.get(footnote.id) && (
                <FootnoteInline
                  mark={marks.get(footnote.id)!}
                  type={footnote.type}
                  onClick={() => onFootnoteClick(footnote)}
                />
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

/* === Read tracker ================================================= */

function ReadTracker({ slug }: { slug: string }) {
  const { markRead, touchLastVisit } = useReaderState();

  useEffect(() => {
    const timer = setTimeout(() => {
      markRead(slug);
      touchLastVisit();
    }, 4000);
    return () => clearTimeout(timer);
  }, [slug, markRead, touchLastVisit]);

  return null;
}

/* === Highlight handler ============================================ */

function useHighlightFromHash() {
  const [highlightPId, setHighlightPId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith("p-")) {
      setHighlightPId(hash);
      const el = document.getElementById(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
      }
      setTimeout(() => setHighlightPId(null), 3000);
    }
  }, []);

  return highlightPId;
}

/* === Main component =============================================== */

interface Props {
  slug: string;
  steps: Record<StepKey, string>;
  footnotes?: Footnote[];
  marks?: Map<string, string>;
  onFootnoteClick?: (fn: Footnote) => void;
}

export default function AnalisisBody({ slug, steps, footnotes, marks, onFootnoteClick }: Props) {
  const highlightPId = useHighlightFromHash();

  // Build pId → footnote map for inline rendering
  const footnoteByPId = new Map<string, Footnote>();
  for (const fn of (footnotes ?? [])) {
    const pId = computeFootnoteParagraphId(fn.stepKey, fn.paraIndex ?? 0, steps);
    footnoteByPId.set(pId, fn);
  }

  const resolvedMarks = marks ?? new Map<string, string>();
  const resolvedClick = onFootnoteClick ?? (() => {});

  let pCounter = 0;
  const stepRanges = STEP_KEYS.map(key => {
    const pStart = pCounter;
    pCounter += splitParagraphs(steps[key] || "").length;
    return { key, pStart };
  });

  return (
    <>
      <ReadTracker slug={slug} />
      {stepRanges.map(({ key, pStart }) => (
        <StepBlock
          key={key}
          stepKey={key}
          body={steps[key] || ""}
          pStart={pStart}
          highlightPId={highlightPId}
          footnoteByPId={footnoteByPId}
          marks={resolvedMarks}
          onFootnoteClick={resolvedClick}
        />
      ))}
    </>
  );
}
