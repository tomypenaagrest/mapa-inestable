"use client";
import { useState, useEffect, useCallback } from "react";

export interface ReaderState {
  v: 1;
  lastVisit: string | null;
  read: string[];
  saved: string[];
  followedCountries: string[];
  followedAxes: string[];
  preferences: {
    reduceMotion: boolean | null;
    sidebarState: "collapsed" | "expanded" | "auto";
    theme: "auto";
  };
}

const STORAGE_KEY = "mi:reader-state";

const DEFAULT_STATE: ReaderState = {
  v: 1,
  lastVisit: null,
  read: [],
  saved: [],
  followedCountries: [],
  followedAxes: [],
  preferences: {
    reduceMotion: null,
    sidebarState: "auto",
    theme: "auto",
  },
};

function readStorage(): ReaderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE, preferences: { ...DEFAULT_STATE.preferences } };
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 1) return { ...DEFAULT_STATE, preferences: { ...DEFAULT_STATE.preferences } };
    return {
      ...DEFAULT_STATE,
      ...parsed,
      preferences: { ...DEFAULT_STATE.preferences, ...(parsed.preferences ?? {}) },
    };
  } catch {
    return { ...DEFAULT_STATE, preferences: { ...DEFAULT_STATE.preferences } };
  }
}

function writeStorage(state: ReaderState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked or full — silently fail
  }
}

export function useReaderState() {
  const [state, setState] = useState<ReaderState | null>(null);

  useEffect(() => {
    setState(readStorage());
  }, []);

  const update = useCallback((updater: (prev: ReaderState) => ReaderState) => {
    setState(prev => {
      const next = updater(prev ?? { ...DEFAULT_STATE, preferences: { ...DEFAULT_STATE.preferences } });
      writeStorage(next);
      return next;
    });
  }, []);

  const markRead = useCallback((slug: string) => {
    update(prev => ({
      ...prev,
      read: prev.read.includes(slug) ? prev.read : [...prev.read, slug],
    }));
  }, [update]);

  const toggleSaved = useCallback((slug: string) => {
    update(prev => ({
      ...prev,
      saved: prev.saved.includes(slug)
        ? prev.saved.filter(s => s !== slug)
        : [...prev.saved, slug],
    }));
  }, [update]);

  const touchLastVisit = useCallback(() => {
    update(prev => ({ ...prev, lastVisit: new Date().toISOString() }));
  }, [update]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    setState({ ...DEFAULT_STATE, preferences: { ...DEFAULT_STATE.preferences } });
  }, []);

  const isRead = useCallback((slug: string) => state?.read.includes(slug) ?? false, [state]);
  const isSaved = useCallback((slug: string) => state?.saved.includes(slug) ?? false, [state]);

  const isNewSince = useCallback((publishedIso: string, since?: string | null) => {
    const ref = since ?? state?.lastVisit;
    if (!ref) return false;
    return new Date(publishedIso) > new Date(ref);
  }, [state]);

  const daysSinceLastVisit = useCallback((): number | null => {
    if (!state?.lastVisit) return null;
    const diff = Date.now() - new Date(state.lastVisit).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }, [state]);

  return {
    state,
    markRead,
    toggleSaved,
    touchLastVisit,
    reset,
    isRead,
    isSaved,
    isNewSince,
    daysSinceLastVisit,
  };
}
