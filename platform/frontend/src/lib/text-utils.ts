/* Strips HTML tags and counts words to estimate reading time (~250 wpm). */
export function calcReadingTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 250));
}

export function splitParagraphs(text: string): string[] {
  return text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
}

const STEP_ORDER = [
  "step_disparador",
  "step_desplazamiento",
  "step_conceptualizacion",
  "step_apertura",
] as const;

export function computeFootnoteParagraphId(
  stepKey: string,
  paraIndex: number,
  steps: Record<string, string>
): string {
  let offset = 0;
  for (const key of STEP_ORDER) {
    if (key === stepKey) return `p-${offset + paraIndex}`;
    offset += splitParagraphs(steps[key] || "").length;
  }
  return "p-0";
}
