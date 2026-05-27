// Spec 47 §6 — Persistencia del país pineado en localStorage.
// SSR-safe: todas las funciones verifican typeof window antes de acceder.

const KEY = "mi.mapa.pinned-country.v1";

export interface PinnedCountryState {
  version: "v1";
  countrySlug: string;
  pinnedAt: string; // ISO
}

export function getPinnedCountry(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PinnedCountryState;
    return parsed.version === "v1" ? parsed.countrySlug : null;
  } catch {
    return null;
  }
}

export function setPinnedCountry(slug: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ version: "v1", countrySlug: slug, pinnedAt: new Date().toISOString() } satisfies PinnedCountryState),
    );
  } catch {
    // localStorage deshabilitado (incógnito estricto). Ignora silencioso.
  }
}

export function clearPinnedCountry(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
