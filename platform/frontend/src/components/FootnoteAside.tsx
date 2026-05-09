"use client";
import { useEffect, useState } from "react";
import type { Footnote } from "@/lib/analisis";
import AsideCard from "./AsideCard";

interface Props {
  footnotes: Footnote[];
  marks: Map<string, string>;
  pIdMap: Map<string, string>;    // footnote.id → "p-N"
  onCardClick: (fn: Footnote) => void;
}

export default function FootnoteAside({ footnotes, marks, pIdMap, onCardClick }: Props) {
  const [activePId, setActivePId] = useState<string | null>(null);

  useEffect(() => {
    const paragraphs = Array.from(document.querySelectorAll("[id^='p-']"));
    if (!paragraphs.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActivePId(visible[0].target.id);
      },
      { rootMargin: "-10% 0px -40% 0px", threshold: 0 },
    );

    paragraphs.forEach(p => observer.observe(p));
    return () => observer.disconnect();
  }, []);

  if (!footnotes.length) return null;

  return (
    <aside style={{ position: "sticky", top: "var(--mi-space-6)", alignSelf: "start" }}>
      {footnotes.map(fn => (
        <AsideCard
          key={fn.id}
          footnote={fn}
          mark={marks.get(fn.id) ?? ""}
          isActive={activePId !== null && activePId === pIdMap.get(fn.id)}
          onClick={() => onCardClick(fn)}
        />
      ))}
    </aside>
  );
}
