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
    icon: [{ url: "/logo-minimalista.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pubs = getAllPublications();

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
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <CommandPalette publications={commandPubs} />
      </body>
    </html>
  );
}
