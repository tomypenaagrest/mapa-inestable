"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { EJES } from "@/lib/ejes";
import { COUNTRY_NAMES } from "@/lib/country-data";

export interface SidebarConcepto {
  slug: string;
  name: string;
}

export interface SidebarAutor {
  slug: string;
  name: string;
}

interface Props {
  conceptos: SidebarConcepto[];
  autores: SidebarAutor[];
  weeklyCountrySlugs: string[];
  isOpen: boolean;
  onClose: () => void;
}

const PREFS_KEY = "mi.preferences";

function readSectionPref(id: string): boolean | null {
  try {
    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    const sections = prefs.sidebarSections || {};
    if (id in sections) return sections[id] === "expanded";
  } catch {}
  return null;
}

function writeSectionPref(id: string, expanded: boolean) {
  try {
    const prefs = JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    const sections = prefs.sidebarSections || {};
    sections[id] = expanded ? "expanded" : "collapsed";
    prefs.sidebarSections = sections;
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {}
}

function Module({
  id, label, count, defaultOpen = false, children,
}: { id: string; label: string; count: number; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const saved = readSectionPref(id);
    if (saved !== null) setOpen(saved);
  }, [id]);

  function toggle() {
    const next = !open;
    setOpen(next);
    writeSectionPref(id, next);
  }

  return (
    <div className="mi-sb-module">
      <button
        className="mi-sb-trigger"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={`sb-${id}`}
      >
        <span className="mi-sb-icon">{open ? "▾" : "▸"}</span>
        <span className="mi-sb-label">{label}</span>
        <span className="mi-sb-count">{count}</span>
      </button>
      <div id={`sb-${id}`} className={`mi-sb-body${open ? " mi-sb-body--open" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default function Sidebar({ conceptos, autores, weeklyCountrySlugs, isOpen, onClose }: Props) {
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const countries = Object.entries(COUNTRY_NAMES);

  return (
    <>
      {isOpen && (
        <div className="mi-sb-overlay" onClick={onClose} aria-hidden="true" />
      )}
      <aside className={`mi-sidebar${isOpen ? " mi-sidebar--open" : ""}`}>

        <Module id="paises" label="Países" count={countries.length} defaultOpen>
          <ul className="mi-sb-list">
            {countries.map(([slug, name]) => (
              <li key={slug}>
                <Link href={`/pais/${slug}`} className="mi-sb-item">
                  {weeklyCountrySlugs.includes(slug) && (
                    <span className="mi-sb-dot" title="Con análisis esta semana" />
                  )}
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </Module>

        <Module id="ejes" label="Ejes" count={EJES.length} defaultOpen>
          <ul className="mi-sb-list">
            {EJES.map(e => (
              <li key={e.slug}>
                <Link href={`/ejes/${e.slug}`} className="mi-sb-item">
                  <span
                    className="mi-sb-eje-dot"
                    style={{ background: `var(--mi-axis-${e.axisKey})` }}
                  />
                  {e.name}
                </Link>
              </li>
            ))}
          </ul>
        </Module>

        <div className="mi-sb-module">
          <button
            className="mi-sb-trigger"
            onClick={() => setSearchOpen(o => !o)}
            aria-expanded={searchOpen}
          >
            <span className="mi-sb-icon">/</span>
            <span className="mi-sb-label">Buscador</span>
          </button>
          {searchOpen && (
            <div className="mi-sb-search">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (q.trim()) window.location.href = `/analisis?q=${encodeURIComponent(q)}`;
                }}
              >
                <input
                  type="text"
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Buscar análisis…"
                  className="mi-sb-search-input"
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        <Module id="conceptos" label="Conceptos" count={conceptos.length}>
          {conceptos.length === 0 ? (
            <p className="mi-sb-empty">Sin conceptos cargados.</p>
          ) : (
            <ul className="mi-sb-list">
              {conceptos.map(c => (
                <li key={c.slug}>
                  <Link href={`/concepto/${c.slug}`} className="mi-sb-item">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Module>

        <Module id="autores" label="Autores" count={autores.length}>
          {autores.length === 0 ? (
            <p className="mi-sb-empty">Sin autores publicados.</p>
          ) : (
            <ul className="mi-sb-list">
              {autores.map(a => (
                <li key={a.slug}>
                  <Link href={`/autor/${a.slug}`} className="mi-sb-item">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Module>

      </aside>
    </>
  );
}
