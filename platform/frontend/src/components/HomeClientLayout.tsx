"use client";
import { useState } from "react";
import Sidebar, { type SidebarConcepto } from "./Sidebar";

interface Props {
  conceptos: SidebarConcepto[];
  weeklyCountrySlugs: string[];
  children: React.ReactNode;
}

export default function HomeClientLayout({
  conceptos,
  weeklyCountrySlugs,
  children,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="mi-home-layout">
      <Sidebar
        conceptos={conceptos}
        weeklyCountrySlugs={weeklyCountrySlugs}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="mi-home-main">
        <button
          className="mi-drawer-toggle"
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menú de navegación"
        >
          ☰ Explorar
        </button>
        {children}
      </div>
    </div>
  );
}
