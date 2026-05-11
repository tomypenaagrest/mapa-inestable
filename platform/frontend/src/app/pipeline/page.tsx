import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPipelinePieces, getPipelineMetrics } from "@/lib/pipeline";
import { PipelineClient } from "./PipelineClient";

export const metadata: Metadata = {
  title: "Pipeline — Mapa Inestable [interno]",
  robots: { index: false, follow: false },
};

export default function PipelinePage() {
  const pieces  = getAllPipelinePieces();
  const metrics = getPipelineMetrics(pieces);

  return (
    <div style={{ background: "var(--mi-bg-paper)", minHeight: "100vh" }}>

      {/* Meta-bar */}
      <div style={{
        background: "var(--mi-ink)",
        color: "var(--mi-bg-paper)",
        padding: "6px var(--mi-space-6)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        display: "flex",
        gap: "var(--mi-space-6)",
        alignItems: "center",
      }}>
        <Link href="/" style={{ color: "var(--mi-ink-mute)" }}>← Inicio</Link>
        <Link href="/analisis" style={{ color: "var(--mi-ink-mute)" }}>← Archivo</Link>
        <span style={{ color: "var(--mi-accent-gold)" }}>Pipeline editorial</span>
      </div>

      {/* Warning banner */}
      <div style={{
        background: "#f5c518",
        color: "#000",
        padding: "8px var(--mi-space-6)",
        fontFamily: "var(--mi-font-mono)",
        fontSize: "var(--mi-text-xs)",
        letterSpacing: "var(--mi-tracking-wide)",
        textTransform: "uppercase",
        textAlign: "center",
        fontWeight: 600,
      }}>
        Vista interna del proceso editorial · No para difusión
      </div>

      {/* Metrics header */}
      <div style={{
        background: "var(--mi-bg-dark)",
        borderBottom: "var(--mi-border-bold)",
        padding: "var(--mi-space-5) var(--mi-space-6)",
        display: "flex",
        gap: "var(--mi-space-8)",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        <MetricBlock label="Total en pipeline" value={metrics.total.toString()} />
        <MetricBlock
          label="Lead time prom."
          value={metrics.leadTimeAvg !== null ? `${metrics.leadTimeAvg}d` : "—"}
        />
        <MetricBlock
          label="Estancadas >14d"
          value={metrics.stalled.length.toString()}
          warn={metrics.stalled.length > 0}
        />
      </div>

      <Suspense fallback={
        <div style={{
          padding: "var(--mi-space-6)",
          fontFamily: "var(--mi-font-mono)",
          fontSize: "var(--mi-text-xs)",
          textTransform: "uppercase",
          color: "var(--mi-ink-mute)",
        }}>
          Cargando pipeline…
        </div>
      }>
        <PipelineClient pieces={pieces} />
      </Suspense>
    </div>
  );
}

function MetricBlock({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div>
      <div style={{
        fontFamily: "var(--mi-font-mono)",
        fontSize: "10px",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--mi-ink-mute)",
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "var(--mi-font-display)",
        fontSize: "var(--mi-text-3xl)",
        lineHeight: 1,
        color: warn ? "var(--mi-accent-warn)" : "var(--mi-bg-paper)",
        letterSpacing: "-0.02em",
      }}>
        {value}
      </div>
    </div>
  );
}
