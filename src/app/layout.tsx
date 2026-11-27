import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/data";
import { CountryProvider } from "@/context/CountryContext";
import FuxionChatWidget from "@/components/FuxionChatWidget";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "FuXion Oficial: Catálogo 2026, Precios y Tienda Online (Perú, Colombia, EE. UU., México, Ecuador y Guatemala)",
    template: "%s | FuXion Catálogo Oficial",
  },
  description:
    "Catálogo oficial de productos FuXion con precios en tu moneda local y compra directa en Perú (S/), Colombia (COP), Estados Unidos (USD), México (MXN), Ecuador (USD) y Guatemala (GTQ).",
  keywords: [
    "fuxion peru",
    "fuxion colombia",
    "fuxion estados unidos",
    "fuxion mexico",
    "fuxion ecuador",
    "fuxion guatemala",
    "productos fuxion",
    "catalogo fuxion 2026",
    "prunex1 fuxion",
    "thermo t3 fuxion",
    "beauty in fuxion",
    "vita xtra t fuxion",
  ],
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      "es-PE": `${SITE_URL}/?pais=pe`,
      "es-CO": `${SITE_URL}/?pais=co`,
      "es-US": `${SITE_URL}/?pais=us`,
      "es-MX": `${SITE_URL}/?pais=mx`,
      "es-EC": `${SITE_URL}/?pais=ec`,
      "es-GT": `${SITE_URL}/?pais=gt`,
      "x-default": `${SITE_URL}/`,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title:
      "FuXion — Catálogo Oficial y Tienda Online en 6 Países",
    description:
      "Descubre todos los productos nutracéuticos FuXion con precios oficiales en la moneda de tu país (Perú, Colombia, EE. UU., México, Ecuador y Guatemala).",
    images: [
      {
        url: "/img/somos-fusion-nutraceutica.webp",
        width: 1200,
        height: 630,
        alt: "FuXion — Fusión Nutracéutica",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "Xdd1A3f3ckFsZKX8TyIqBvtn7FZwku1R19juCFLU3YA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-[#0093DD] selection:text-white">
        <CountryProvider>
          {children}
          <FuxionChatWidget />
        </CountryProvider>
      </body>
    </html>
  );
}
