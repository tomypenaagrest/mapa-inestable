import type { Metadata } from "next";
import { Alfa_Slab_One, Fraunces, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CommandPalette from "@/components/CommandPalette";
import { ANALISIS_ALL } from "@/lib/analisis";

const alfaSlabOne = Alfa_Slab_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-title",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mapa Inestable",
    template: "%s · Mapa Inestable",
  },
  description: "Cartografía política del sur. Análisis estructural de Sudamérica.",
  openGraph: {
    siteName: "Mapa Inestable",
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

/* Compute countries to show in the header strip.
   Returns the most recently analyzed unique countries (up to 8),
   so the strip always shows meaningful content even if a given week
   only published one country. */
function getWeeklyCountries(): { slug: string; name: string }[] {
  if (ANALISIS_ALL.length === 0) return [];
  // ANALISIS_ALL is already sorted desc by published_iso
  const seen = new Set<string>();
  const countries: { slug: string; name: string }[] = [];
  for (const a of ANALISIS_ALL) {
    if (!seen.has(a.countrySlug)) {
      seen.add(a.countrySlug);
      countries.push({ slug: a.countrySlug, name: a.country });
      if (countries.length >= 8) break;
    }
  }
  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

function getCurrentWeekInfo(): { week: number; year: number } | null {
  if (ANALISIS_ALL.length === 0) return null;
  const latestYear = Math.max(...ANALISIS_ALL.map(a => a.year));
  const latestWeek = Math.max(...ANALISIS_ALL.filter(a => a.year === latestYear).map(a => a.week));
  return { week: latestWeek, year: latestYear };
}

function getRealISOWeek(): { week: number; year: number } {
  const d = new Date();
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return { week, year: utc.getUTCFullYear() };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const weeklyCountries = getWeeklyCountries();
  const weekInfo = getCurrentWeekInfo();
  const realWeek = getRealISOWeek();
  const isFallback = !weekInfo
    ? false
    : weekInfo.year !== realWeek.year || weekInfo.week !== realWeek.week;

  return (
    <html
      lang="es"
      className={`${alfaSlabOne.variable} ${fraunces.variable} ${lora.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <SiteHeader
          weeklyCountries={weeklyCountries}
          currentWeek={weekInfo?.week}
          currentYear={weekInfo?.year}
          isFallback={isFallback}
        />
        <main>{children}</main>
        <SiteFooter />
        <CommandPalette />
      </body>
    </html>
  );
}
