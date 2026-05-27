"use client";
import { useRef, useEffect } from "react";
import "@/styles/country-page.css";

export interface TabChip {
  slug:   string;
  label:  string;
  count?: number;
}

interface Props {
  tabs:        TabChip[];
  activeTab:   string;
  onTabChange: (slug: string) => void;
}

export default function TabBarChips({ tabs, activeTab, onTabChange }: Props) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      inline:   "center",
      behavior: "smooth",
      block:    "nearest",
    });
  }, [activeTab]);

  return (
    <div className="tab-chips-wrap">
      <div className="tab-chips">
        {tabs.map(tab => {
          const isActive = tab.slug === activeTab;
          return (
            <button
              key={tab.slug}
              ref={isActive ? activeRef : null}
              onClick={() => onTabChange(tab.slug)}
              className={`tab-chip${isActive ? " tab-chip--active" : ""}`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="tab-chip-count">({tab.count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
