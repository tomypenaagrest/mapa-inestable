import type { Metadata } from "next";
import { Alfa_Slab_One, Fraunces, Lora, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CommandPalette from "@/components/CommandPalette";
import { getAllPublications } from "@/lib/content";
import { EJES } from "@/lib/ejes";

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
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Mapa Inestable — Cartografía política del sur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

function getWeeklyCountries(pubs: { countrySlug?: string; country?: string }[]): { slug: string; name: string }[] {
  if (pubs.length === 0) return [];
  const seen = new Set<string>();
  const countries: { slug: string; name: string }[] = [];
  for (const p of pubs) {
    if (!p.countrySlug) continue;
    if (!seen.has(p.countrySlug)) {
      seen.add(p.countrySlug);
      countries.push({ slug: p.countrySlug, name: p.country ?? p.countrySlug });
      if (countries.length >= 8) break;
    }
  }
  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

function getCurrentWeekInfo(pubs: { year: number; week: number }[]): { week: number; year: number } | null {
  if (pubs.length === 0) return null;
  const latestYear = Math.max(...pubs.map(p => p.year));
  const latestWeek = Math.max(...pubs.filter(p => p.year === latestYear).map(p => p.week));
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
  const pubs = getAllPublications();
  const weeklyCountries = getWeeklyCountries(pubs);
  const weekInfo = getCurrentWeekInfo(pubs);
  const realWeek = getRealISOWeek();
  const isFallback = !weekInfo
    ? false
    : weekInfo.year !== realWeek.year || weekInfo.week !== realWeek.week;

  const commandPubs = pubs.map(p => ({
    slug:         p.slug,
    title:        p.title,
    subtitle:     p.subtitle,
    country:      p.country,
    published_at: p.published_at,
    axisName:     EJES.find(e => e.axisKey === p.ejePrincipal)?.name ?? p.ejePrincipal,
  }));

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
        <CommandPalette publications={commandPubs} />
      </body>
    </html>
  );
}
