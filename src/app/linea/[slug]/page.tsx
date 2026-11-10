import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import {
  cleanSeoTitle,
  getAllCategories,
  getArticlesByCategory,
  getCategoryBySlug,
  getProductsByCategory,
  SHOP_TIENDA_URL,
  SITE_URL,
} from "@/lib/data";

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: cleanSeoTitle(category.seoTitle),
    description: category.seoDescription,
    alternates: {
      canonical: `${SITE_URL}/linea/${category.slug}/`,
    },
    openGraph: {
      type: "website",
      locale: "es_PE",
      url: `${SITE_URL}/linea/${category.slug}/`,
      title: category.seoTitle,
      description: category.seoDescription,
    },
  };
}

export default async function LineaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const allCategories = getAllCategories();
  const categoryArticles = getArticlesByCategory(category.slug, 9);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: category.description,
    url: `${SITE_URL}/linea/${category.slug}/`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/productos/${p.slug}/`,
        name: p.cleanName,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen bg-white pb-20">
        {/* Hero de Línea */}
        <section className="bg-[#0093DD] text-[#FFFFF0] py-12 sm:py-16">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider text-[#EFFBC4] mb-3">
              <span>{category.icon}</span>
              <span>{category.step} · FuXion Perú</span>
            </span>
            <h1
              className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-3"
              style={{ fontFamily: "var(--display)" }}
            >
              {category.name}
            </h1>
            <p className="text-base sm:text-lg text-[#EAF6FD] max-w-3xl leading-relaxed">
              {category.description}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Tienda", href: "/tienda/" },
              { label: category.name },
            ]}
          />

          {/* Navegación rápida entre líneas */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allCategories.map((c) => (
              <Link
                key={c.slug}
                href={`/linea/${c.slug}/`}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  c.slug === category.slug
                    ? "bg-[#0093DD] text-white"
                    : "bg-[#EDF7FD] text-[#12232E] hover:bg-[#D7E4EC]"
                }`}
              >
                {c.icon} {c.shortName}
              </Link>
            ))}
          </div>

          {/* Grid de Productos de la Línea */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {/* Guías del Blog Relacionadas con la Línea */}
          {categoryArticles.length > 0 && (
            <section className="py-12 border-t border-[#D7E4EC] mb-8">
              <div className="xrule" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                Aprende cómo tomarlos
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-6">
                Guías y artículos sobre {category.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categoryArticles.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/blog/${art.slug}/`}
                    className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 hover:bg-white hover:border-[#0093DD] p-5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0093DD]">
                        {art.clusterName}
                      </span>
                      <h3 className="text-base font-extrabold text-[#12232E] mt-1 mb-2 leading-snug">
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#5A6B78] line-clamp-2">
                        {art.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0093DD] mt-3 inline-block">
                      Leer guía completa →
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* CTA hacia tienda oficial */}
          <div className="rounded-3xl border border-[#D7E4EC] bg-[#EDF7FD] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#12232E]">
                Compra productos de la {category.name} en la Tienda Oficial
              </h2>
              <p className="text-sm sm:text-base text-[#5A6B78] mt-1">
                Precios oficiales en Soles (S/), despacho rápido a Lima y
                provincias y garantía de autenticidad FuXion Biotech SAC.
              </p>
            </div>
            <a
              href={SHOP_TIENDA_URL}
              className="btn-fx btn-fx--buy text-sm sm:text-base font-bold shrink-0"
            >
              Ir a Tienda Oficial FuXion →
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
