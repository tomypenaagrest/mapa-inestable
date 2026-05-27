"use client";
import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const MobileNavDrawer = dynamic(() => import("./MobileNavDrawer"), {
  ssr: false,
});

const NAV_LINKS = [
  { href: "/despachos", label: "Despachos" },
  { href: "/ensayos",   label: "Ensayos"   },
  { href: "/mapa",      label: "Mapa"      },
  { href: "/acerca",    label: "Acerca"    },
];

export default function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const openDrawer  = useCallback(() => setDrawerOpen(true),  []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <header
        className="mi-header"
        style={{
          height:         "var(--mi-header-h, 70px)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "0 var(--mi-space-6)",
          borderBottom:   "var(--mi-border-bold)",
          background:     "var(--mi-bg)",
          position:       "sticky",
          top:            0,
          zIndex:         100,
        }}
      >
        {/* Brand: mark + wordmark + · + tagline */}
        <Link
          href="/"
          style={{
            display:        "inline-flex",
            alignItems:     "center",
            gap:            "var(--mi-space-3)",
            textDecoration: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-minimalista.svg"
            alt=""
            aria-hidden="true"
            width={43}
            height={48}
            className="mi-header-logo"
            style={{ display: "block", flexShrink: 0 }}
          />
          <span
            className="mi-header-wordmark"
            style={{
              fontFamily:    "var(--mi-font-display)",
              fontSize:      "22px",
              fontWeight:    400,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color:         "var(--mi-ink)",
              lineHeight:    1,
            }}
          >
            Mapa Inestable
          </span>
          <span
            className="mi-header-sep"
            style={{
              fontFamily: "var(--mi-font-mono)",
              fontSize:   "13px",
              color:      "var(--mi-ink-mute)",
              padding:    "0 2px",
            }}
            aria-hidden="true"
          >
            ·
          </span>
          <span
            className="mi-header-tagline"
            style={{
              fontFamily:    "var(--mi-font-mono)",
              fontSize:      "11px",
              letterSpacing: "0.04em",
              color:         "var(--mi-ink-soft)",
              textTransform: "lowercase",
            }}
          >
            cartografía política del sur
          </span>
        </Link>

        {/* Nav desktop — oculto en mobile (reemplazado por drawer ☰) */}
        <nav aria-label="Navegación principal" className="mi-header-nav">
          <ul style={{ display: "flex", gap: "var(--mi-space-1)", listStyle: "none" }}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="mi-nav-link">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botón ☰ — solo visible en mobile */}
        <button
          ref={triggerRef}
          className="mi-header-menu-btn"
          onClick={() => setDrawerOpen(o => !o)}
          aria-label={drawerOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={drawerOpen}
          aria-controls="mi-nav-drawer"
        >
          ☰
        </button>
      </header>

      <MobileNavDrawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        triggerRef={triggerRef}
      />
    </>
  );
}
