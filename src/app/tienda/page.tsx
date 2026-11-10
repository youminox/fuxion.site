import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import CatalogExplorer from "@/components/CatalogExplorer";
import {
  getAllCategories,
  getAllProducts,
  LEGAL_OWNER,
  SHOP_TIENDA_URL,
  SITE_URL,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Tienda y Catálogo FuXion Perú 2026: Los 72 Productos en Soles (S/)",
  description:
    "Explora la tienda y catálogo oficial de FuXion Perú con precios en Soles (S/). Compra Prunex1, Thermo T3, Vita Xtra T+, Beauty-In, Flora Liv, Alpha Balance y los 72 SKUs con envío a Lima y provincias.",
  alternates: {
    canonical: `${SITE_URL}/tienda/`,
  },
};

export default function TiendaPage() {
  const products = getAllProducts();
  const categories = getAllCategories();

  // Flatten all 72 SKUs for the full SKU index table
  const allPresentations = products.flatMap((p) =>
    p.presentations.map((pres) => ({
      ...pres,
      productSlug: p.slug,
      cleanName: p.cleanName,
      categoryName: p.categoryShortName,
      badge: p.badge,
    }))
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tienda y Catálogo Oficial FuXion Perú en Soles",
    url: `${SITE_URL}/tienda/`,
    description:
      "Catálogo completo de bebidas nutracéuticas, proteínas y suplementos naturales FuXion en Perú con precios oficiales en Soles (PEN).",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen bg-white pb-20">
        {/* Cabecera estilo /tienda/ de shop.site.fuxion.com */}
        <section className="bg-[#0093DD] text-[#FFFFF0] py-12 sm:py-16 border-b border-[#D7E4EC]">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-semibold text-[#EFFBC4] mb-3">
                  <span>{LEGAL_OWNER} · Empresario FuXion</span>
                  <span>•</span>
                  <span>Lima, Perú · Moneda: Soles (PEN)</span>
                </div>
                <h1
                  className="text-3xl sm:text-5xl font-extrabold text-white leading-tight"
                  style={{ fontFamily: "var(--display)" }}
                >
                  Tienda y Catálogo Oficial FuXion Perú
                </h1>
                <p className="text-base sm:text-lg text-[#EAF6FD] mt-2 max-w-2xl">
                  Navega por los 60 productos y 72 presentaciones oficiales en
                  Soles (S/). Revisa para qué sirve cada fórmula o haz clic en
                  comprar para ir directo al checkout oficial.
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={SHOP_TIENDA_URL}
                  className="btn-fx btn-fx--lime text-base font-bold shadow-lg"
                >
                  Abrir Carrito en Tienda Oficial →
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Tienda y Catálogo en Soles" },
            ]}
          />

          {/* Explorador Interactivo */}
          <section className="mt-4 mb-16">
            <CatalogExplorer products={products} categories={categories} />
          </section>

          {/* Índice Completo de los 72 SKUs de shop.site.fuxion.com */}
          <section className="pt-12 border-t border-[#D7E4EC]">
            <div className="xrule" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
              Directorio Completo por Código SKU
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-3">
              Los 72 SKUs del Catálogo FuXion Perú con Enlace Directo
            </h2>
            <p className="text-sm sm:text-base text-[#5A6B78] max-w-3xl mb-6">
              Cada fila corresponde exactamente a un producto o presentación de
              la tienda oficial{" "}
              <strong className="text-[#12232E]">shop.site.fuxion.com</strong>{" "}
              en Soles (PEN), incluyendo Doypacks de 28 sticks, Cajas Mini de 7
              sticks, Potes de proteína, Packs y Shakers.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-[#D7E4EC] bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#12232E] text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold">SKU</th>
                    <th className="py-3 px-4 font-bold">Producto</th>
                    <th className="py-3 px-4 font-bold">Presentación</th>
                    <th className="py-3 px-4 font-bold">Puntos</th>
                    <th className="py-3 px-4 font-bold">Precio (S/)</th>
                    <th className="py-3 px-4 font-bold text-right">
                      Enlace Directo Tienda
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D7E4EC]">
                  {allPresentations.map((item) => (
                    <tr
                      key={item.sku}
                      className="hover:bg-[#EDF7FD]/60 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-mono text-xs font-bold text-[#0093DD]">
                        #{item.sku}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-[#12232E]">
                        <Link
                          href={`/productos/${item.productSlug}/`}
                          className="hover:text-[#0093DD] hover:underline"
                        >
                          {item.cleanName}
                        </Link>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-[#5A6B78]">
                        {item.pack}
                      </td>
                      <td className="py-2.5 px-4 text-xs font-semibold text-[#4E7A16]">
                        {item.points} pts
                      </td>
                      <td className="py-2.5 px-4 font-extrabold text-[#12232E]">
                        {item.formattedPrice}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <a
                          href={item.shopUrl}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0093DD] hover:bg-[#007CBC] text-white text-xs font-bold transition-colors"
                        >
                          <span>Comprar SKU #{item.sku}</span>
                          <span aria-hidden="true">→</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
