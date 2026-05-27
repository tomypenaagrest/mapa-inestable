"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const NAV_LINKS = [
  { href: "/despachos", label: "Despachos" },
  { href: "/ensayos",   label: "Ensayos"   },
  { href: "/mapa",      label: "Mapa"      },
  { href: "/acerca",    label: "Acerca"    },
];

const CORPUS_LINKS = [
  { href: "/paises",    label: "Países",    count: 10 },
  { href: "/ejes",      label: "Ejes",      count: 6  },
  { href: "/conceptos", label: "Conceptos"            },
  { href: "/autores",   label: "Autores"              },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export default function MobileNavDrawer({ isOpen, onClose, triggerRef }: Props) {
  const drawerRef  = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname   = usePathname();
  const prevPath   = useRef(pathname);

  useFocusTrap(drawerRef, isOpen);

  // Move focus to first nav item on open
  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => firstLinkRef.current?.focus(), 20);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  // ESC closes
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Return focus to trigger on close
  useEffect(() => {
    if (!isOpen) triggerRef.current?.focus();
  }, [isOpen, triggerRef]);

  // Close on route change (back/forward nav)
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  // Swipe left to close
  const touchStartX = useRef<number | null>(null);
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) onClose();
    touchStartX.current = null;
  }

  function isActive(href: string) {
    return href === "/" ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`mi-nav-drawer-backdrop${isOpen ? " mi-nav-drawer-backdrop--visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        id="mi-nav-drawer"
        className={`mi-nav-drawer${isOpen ? " mi-nav-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!isOpen}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drawer header */}
        <div className="mi-nd-header">
          <span className="mi-nd-brand">Mapa Inestable</span>
          <button
            className="mi-nd-close"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        {/* Sección 1 — nav principal */}
        <nav aria-label="Secciones del sitio">
          <div className="mi-nd-section-label">Secciones</div>
          <ul className="mi-nd-list">
            {NAV_LINKS.map(({ href, label }, i) => (
              <li key={href}>
                <Link
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={href}
                  className={`mi-nd-item mi-nd-item--primary${isActive(href) ? " mi-nd-item--active" : ""}`}
                  onClick={onClose}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sección 2 — recorrer el corpus */}
        <nav aria-label="Recorrer el corpus" className="mi-nd-corpus-nav">
          <div className="mi-nd-section-label">Recorrer el corpus</div>
          <ul className="mi-nd-list">
            {CORPUS_LINKS.map(({ href, label, count }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`mi-nd-item mi-nd-item--secondary${isActive(href) ? " mi-nd-item--active" : ""}`}
                  onClick={onClose}
                >
                  {label}
                  {count !== undefined && (
                    <span className="mi-nd-count"> ({count})</span>
                  )}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/analisis"
                className={`mi-nd-item mi-nd-item--secondary${isActive("/analisis") ? " mi-nd-item--active" : ""}`}
                onClick={onClose}
              >
                Buscar →
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
