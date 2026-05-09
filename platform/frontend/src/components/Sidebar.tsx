"use client";
import { useState } from "react";
import Link from "next/link";
import { EJES } from "@/lib/ejes";
import { COUNTRY_NAMES } from "@/lib/country-data";

export interface SidebarConcepto {
  slug: string;
  name: string;
}

interface Props {
  conceptos: SidebarConcepto[];
  weeklyCountrySlugs: string[];
  isOpen: boolean;
  onClose: () => void;
}

function Module({
  id, label, count, children,
}: { id: string; label: string; count: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mi-sb-module">
      <button
        className="mi-sb-trigger"
        onClick={() => setOpen(o => !o)}
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

export default function Sidebar({ conceptos, weeklyCountrySlugs, isOpen, onClose }: Props) {
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const countries = Object.entries(COUNTRY_NAMES);

  return (
    <>
      {isOpen && (
        <div className="mi-sb-overlay" onClick={onClose} aria-hidden="true" />
      )}
      <aside className={`mi-sidebar${isOpen ? " mi-sidebar--open" : ""}`}>

        <Module id="paises" label="Países" count={countries.length}>
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

        <Module id="ejes" label="Ejes" count={EJES.length}>
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
            <span className="mi-sb-icon">🔍</span>
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
            <p className="mi-sb-empty">Sin conceptos publicados.</p>
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

      </aside>
    </>
  );
}
