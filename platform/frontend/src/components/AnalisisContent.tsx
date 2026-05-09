"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import type { AnalisisEntry, Footnote } from "@/lib/analisis";
import { computeFootnoteMarks } from "@/lib/analisis";
import { AXIS_KEY_TO_SLUG } from "@/lib/ejes";
import { computeFootnoteParagraphId } from "@/lib/text-utils";
import AnalisisBody from "./AnalisisBody";
import FootnoteAside from "./FootnoteAside";
import FootnoteBottomSheet from "./FootnoteBottomSheet";

interface Props {
  a: AnalisisEntry;
}

export default function AnalisisContent({ a }: Props) {
  const [activeFootnote, setActiveFootnote] = useState<Footnote | null>(null);

  const footnotes = a.footnotes ?? [];
  const steps = useMemo(() => ({
    step_disparador: a.step_disparador,
    step_desplazamiento: a.step_desplazamiento,
    step_conceptualizacion: a.step_conceptualizacion,
    step_apertura: a.step_apertura,
  }), [a.step_disparador, a.step_desplazamiento, a.step_conceptualizacion, a.step_apertura]);

  const marks = useMemo(() => computeFootnoteMarks(footnotes), [footnotes]);

  const pIdMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const fn of footnotes) {
      map.set(fn.id, computeFootnoteParagraphId(fn.stepKey, fn.paraIndex ?? 0, steps));
    }
    return map;
  }, [footnotes, steps]);

  const axisSlug = AXIS_KEY_TO_SLUG[a.axisKey] ?? a.axisKey;
  const axisColor = `var(--mi-axis-${a.axisKey})`;
  const hasFootnotes = footnotes.length > 0;

  return (
    <>
      <div
        className={`mi-container--narrow mi-analisis-grid${hasFootnotes ? " mi-analisis-grid--3col" : ""}`}
      >
        {/* Meta aside */}
        <aside className="mi-analisis-meta" style={{
          position: "sticky",
          top: "var(--mi-space-6)",
          alignSelf: "start",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          letterSpacing: "var(--mi-tracking-wide)",
          textTransform: "uppercase",
        }}>
          <dl style={{ lineHeight: "var(--mi-leading-relaxed)" }}>
            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>País</dt>
            <dd>
              <Link href={`/pais/${a.countrySlug}`} style={{ color: "var(--mi-ink)", fontWeight: 500 }}>
                {a.country}
              </Link>
            </dd>

            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Eje</dt>
            <dd>
              <Link
                href={`/ejes/${axisSlug}`}
                style={{
                  display: "inline-block",
                  background: axisColor,
                  color: "var(--mi-bg-paper)",
                  padding: "2px 6px",
                  fontSize: "var(--mi-text-xs)",
                  marginTop: "var(--mi-space-1)",
                }}
              >
                {a.axisName}
              </Link>
            </dd>

            <dt style={{ color: "var(--mi-ink-mute)", marginTop: "var(--mi-space-3)" }}>Fecha</dt>
            <dd style={{ color: "var(--mi-ink)" }}>{a.published_at}</dd>
          </dl>

          <div style={{
            marginTop: "var(--mi-space-6)",
            paddingTop: "var(--mi-space-3)",
            borderTop: "var(--mi-border-dashed)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--mi-space-2)",
          }}>
            <Link href="/metodo" style={{
              color: "var(--mi-ink-mute)",
              display: "block",
              lineHeight: "var(--mi-leading-relaxed)",
            }}>
              → Cómo leemos
            </Link>
            <Link href="/leer-despues" style={{
              color: "var(--mi-ink-mute)",
              display: "block",
              lineHeight: "var(--mi-leading-relaxed)",
            }}>
              ★ Lista de lectura
            </Link>
          </div>
        </aside>

        {/* 4 pasos */}
        <AnalisisBody
          slug={`${a.countrySlug}-${a.year}-w${a.week}`}
          steps={steps}
          footnotes={footnotes}
          marks={marks}
          onFootnoteClick={setActiveFootnote}
        />

        {/* Footnote aside — desktop only, hidden via CSS on tablet/mobile */}
        {hasFootnotes && (
          <div className="mi-footnote-aside-col">
            <FootnoteAside
              footnotes={footnotes}
              marks={marks}
              pIdMap={pIdMap}
              onCardClick={setActiveFootnote}
            />
          </div>
        )}
      </div>

      {/* Mobile bottom sheet */}
      {activeFootnote && (
        <FootnoteBottomSheet
          footnote={activeFootnote}
          mark={marks.get(activeFootnote.id) ?? ""}
          onClose={() => setActiveFootnote(null)}
        />
      )}
    </>
  );
}
