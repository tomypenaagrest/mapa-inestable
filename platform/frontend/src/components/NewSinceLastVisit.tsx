"use client";
import { useEffect, useState } from "react";
import { useReaderState } from "@/hooks/useReaderState";

interface Props {
  slides: { slug: string; publishedIso: string }[];
}

function formatRelativeDate(isoDate: string): string {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return "hoy";
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "hace 1 semana";
  if (weeks < 5) return `hace ${weeks} semanas`;
  const months = Math.floor(days / 30);
  return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
}

export default function NewSinceLastVisit({ slides }: Props) {
  const { state } = useReaderState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !state) return null;
  if (!state.lastVisit) return null;

  const lastVisitDate = new Date(state.lastVisit);
  const daysDiff = Math.floor((Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 3) return null;

  const newCount = slides.filter(s => new Date(s.publishedIso) > lastVisitDate).length;

  return (
    <div style={{
      fontFamily: "var(--mi-font-mono)",
      fontSize: "var(--mi-text-xs)",
      letterSpacing: "var(--mi-tracking-widest)",
      textTransform: "uppercase",
      color: "var(--mi-ink-mute)",
      marginBottom: "var(--mi-space-2)",
      borderBottom: "var(--mi-border-soft)",
      paddingBottom: "var(--mi-space-2)",
    }}>
      {newCount > 0 ? (
        <>
          <span style={{ color: "var(--mi-accent-gold)", marginRight: "var(--mi-space-1)" }}>●</span>
          Desde tu última visita · {newCount} {newCount === 1 ? "análisis nuevo" : "análisis nuevos"}
        </>
      ) : (
        <>Tu última visita fue {formatRelativeDate(state.lastVisit!)}. Sin novedades desde entonces.</>
      )}
    </div>
  );
}
