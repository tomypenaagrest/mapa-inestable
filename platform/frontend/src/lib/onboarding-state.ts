// Spec 46 §5 — Persistencia del estado de onboarding en localStorage.
// SSR-safe: todas las funciones verifican typeof window antes de acceder.

const KEY = "mi.onboarding.v1.seen";

export interface OnboardingState {
  version: "v1";
  seenAt: string; // ISO datetime
}

export function hasSeenOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as OnboardingState;
    return parsed.version === "v1";
  } catch {
    return false;
  }
}

export function markOnboardingSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ version: "v1", seenAt: new Date().toISOString() } satisfies OnboardingState),
    );
  } catch {
    // localStorage puede estar deshabilitado (modo incógnito estricto). Se ignora silencioso.
  }
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
