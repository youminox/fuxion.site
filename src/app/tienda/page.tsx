import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogExplorer from "@/components/CatalogExplorer";
import CountryDirectoryTable from "@/components/CountryDirectoryTable";
import ProductInlineCta from "@/components/ProductInlineCta";
import {
  getAllCategories,
  getAllCountries,
  getAllProducts,
  LEGAL_OWNER,
  SITE_URL,
} from "@/lib/data";

export const metadata: Metadata = {
  title:
    "Tienda y Catálogo Oficial FuXion 2026 (Perú, Colombia, EE. UU., México, Ecuador y Guatemala)",
  description:
    "Explora la tienda y catálogo oficial de FuXion en 6 países con precios en tu moneda local: Perú (S/), Colombia (COP), Estados Unidos (USD), México (MXN), Ecuador (USD) y Guatemala (GTQ).",
  alternates: {
    canonical: `${SITE_URL}/tienda/`,
    languages: {
      "es-PE": `${SITE_URL}/tienda/?pais=pe`,
      "es-CO": `${SITE_URL}/tienda/?pais=co`,
      "es-US": `${SITE_URL}/tienda/?pais=us`,
      "es-MX": `${SITE_URL}/tienda/?pais=mx`,
      "es-EC": `${SITE_URL}/tienda/?pais=ec`,
      "es-GT": `${SITE_URL}/tienda/?pais=gt`,
    },
  },
};

export default function TiendaPage() {
  const products = getAllProducts();
  const categories = getAllCategories();
  const countries = getAllCountries();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tienda y Catálogo Oficial FuXion Multi-País",
    url: `${SITE_URL}/tienda/`,
    description:
      "Catálogo completo de bebidas nutracéuticas, proteínas y suplementos naturales FuXion con precios oficiales en Perú, Colombia, Estados Unidos, México, Ecuador y Guatemala.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen bg-white pb-20">
        {/* Cabecera estilo /tienda/ de carlos-lingan.site.fuxion.com */}
        <section className="bg-[#0093DD] text-[#FFFFF0] py-12 sm:py-16 border-b border-[#D7E4EC]">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-[#EFFBC4] mb-3">
                  <span>{LEGAL_OWNER} · Empresario FuXion</span>
                  <span>•</span>
                  <span>
                    {countries.map((c) => c.flag).join(" ")} 6 Países Oficiales
                  </span>
                </div>
                <h1
                  className="text-3xl sm:text-5xl font-extrabold text-white leading-tight"
                  style={{ fontFamily: "var(--display)" }}
                >
                  Tienda y Catálogo Oficial FuXion
                </h1>
                <p className="text-base sm:text-lg text-[#EAF6FD] mt-2 max-w-2xl">
                  Detectamos tu país automáticamente para mostrarte los
                  productos, presentaciones y precios oficiales en tu moneda
                  local (Perú, Colombia, EE. UU., México, Ecuador y Guatemala).
                </p>
              </div>
              <div className="shrink-0">
                <ProductInlineCta
                  variant="lime"
                  className="btn-fx btn-fx--lime text-base font-bold shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Tienda y Catálogo Oficial" },
            ]}
          />

          {/* Explorador Interactivo Multi-País */}
          <section className="mt-4 mb-16">
            <CatalogExplorer products={products} categories={categories} />
          </section>

          {/* Índice Completo de productos de carlos-lingan.site.fuxion.com por país */}
          <CountryDirectoryTable />
        </div>
      </main>

      <Footer />
    </>
  );
}
