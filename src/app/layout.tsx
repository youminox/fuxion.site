import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/data";

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
      "FuXion Perú: Catálogo Oficial 2026, Precios y Tienda Online",
    template: "%s | FuXion Perú",
  },
  description:
    "Catálogo oficial de productos FuXion en Perú. Compra Prunex1, Thermo T3, Vita Xtra T+, Beauty-In, Flora Liv, Alpha Balance y más con envío directo a Lima y provincias.",
  keywords: [
    "fuxion peru",
    "productos fuxion",
    "catalogo fuxion peru 2026",
    "fuxion precios peru",
    "tienda fuxion lima",
    "prunex1 precio peru",
    "thermo t3 fuxion",
    "beauty in fuxion colageno",
    "vita xtra t fuxion",
    "flora liv fuxion",
  ],
  alternates: {
    canonical: `${SITE_URL}/`,
    languages: {
      "es-PE": `${SITE_URL}/`,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title:
      "FuXion Perú — Catálogo Oficial de Productos Nutracéuticos",
    description:
      "Descubre todos los productos del catálogo oficial de FuXion Perú: beneficios, ingredientes, cómo tomarlos y compra directa con entrega en Lima y todo el país.",
    images: [
      {
        url: "/img/somos-fusion-nutraceutica.webp",
        width: 1200,
        height: 630,
        alt: "FuXion Perú — Fusión Nutracéutica",
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
    <html lang="es-PE" className={`${outfit.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-[#0093DD] selection:text-white">
        {children}
      </body>
    </html>
  );
}
