import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductBuyBox from "@/components/ProductBuyBox";
import ProductCard from "@/components/ProductCard";
import {
  getAllProducts,
  getArticlesByProduct,
  getProductBySlug,
  getRelatedProducts,
  SITE_URL,
} from "@/lib/data";

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: {
      canonical: `${SITE_URL}/productos/${product.slug}/`,
    },
    openGraph: {
      type: "website",
      locale: "es_PE",
      url: `${SITE_URL}/productos/${product.slug}/`,
      title: product.seoTitle,
      description: product.seoDescription,
      images: [
        {
          url: product.bodegonImage || product.mainImage,
          alt: `${product.cleanName} — FuXion Perú`,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = getRelatedProducts(product);
  const relatedArticles = getArticlesByProduct(product.slug, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.cleanName} — FuXion Perú`,
    sku: product.sku,
    mpn: product.sku,
    brand: {
      "@type": "Brand",
      name: "FuXion",
    },
    category: product.categoryName,
    description: product.description,
    image: [
      product.bodegonImage.startsWith("http")
        ? product.bodegonImage
        : `${SITE_URL}${product.bodegonImage}`,
      ...product.gallery,
    ],
    offers:
      product.presentations.length > 1
        ? product.presentations.map((pres) => ({
            "@type": "Offer",
            sku: pres.sku,
            name: `${product.cleanName} (${pres.pack})`,
            priceCurrency: "PEN",
            price: pres.price.toFixed(2),
            availability: pres.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            url: pres.shopUrl,
          }))
        : {
            "@type": "Offer",
            sku: product.sku,
            priceCurrency: "PEN",
            price: product.price.toFixed(2),
            availability: product.inStock
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            url: product.shopUrl,
          },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "148",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productJsonLd, faqJsonLd]),
        }}
      />
      <Header />

      <main className="min-h-screen bg-white pt-6 pb-24">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              {
                label: product.categoryShortName,
                href: `/linea/${product.categorySlug}/`,
              },
              { label: product.cleanName },
            ]}
          />

          {/* 1. BUY BOX TRANSACCIONAL + GALERÍA + SELECTOR DE PRESENTACIÓN */}
          <section id="producto" className="mb-16">
            <ProductBuyBox product={product} />
          </section>

          {/* 2. BENEFICIOS Y PARA QUÉ SIRVE (SEO + CONVERSIÓN) */}
          <section
            id="beneficios"
            className="py-12 border-t border-[#D7E4EC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-5">
              <div className="xrule" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                ¿Para qué sirve {product.cleanName}?
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-4">
                Beneficios principales en tu organismo
              </h2>
              <p className="text-[#2B3D4B] leading-relaxed mb-6">
                {product.description}
              </p>
              <a
                href={product.shopUrl}
                className="btn-fx btn-fx--buy text-sm font-bold"
              >
                Comprar {product.cleanName} ({product.formattedPrice}) →
              </a>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/55 p-5 flex items-start gap-3.5"
                >
                  <span className="w-8 h-8 rounded-full bg-[#8CC63F] text-[#1F3105] font-extrabold text-sm grid place-items-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm sm:text-[15px] font-medium text-[#12232E] leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. INGREDIENTES ACTIVOS Y CÓMO SE TOMA */}
          <section
            id="ingredientes"
            className="py-12 border-t border-[#D7E4EC] grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Ingredientes */}
            <div className="lg:col-span-6 rounded-3xl border border-[#D7E4EC] bg-white p-6 sm:p-8">
              <div className="xrule" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                Fusión Nutracéutica®
              </p>
              <h2 className="text-2xl font-extrabold text-[#12232E] mb-3">
                Ingredientes principales de {product.cleanName}
              </h2>
              <p className="text-sm text-[#5A6B78] mb-5">
                Principios activos naturales concentrados, sin azúcar añadida,
                libres de octógonos y endulzados con stevia natural:
              </p>

              <div className="flex flex-wrap gap-2 mb-5">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-2 rounded-xl bg-[#EDF7FD] border border-[#D7E4EC] text-xs sm:text-sm font-bold text-[#12232E]"
                  >
                    🌿 {ing}
                  </span>
                ))}
              </div>

              {product.ingredientsRaw && (
                <p className="text-xs text-[#5A6B78] bg-[#EDF7FD]/40 p-3.5 rounded-xl border border-[#D7E4EC]">
                  <strong>Composición oficial declarada:</strong>{" "}
                  {product.ingredientsRaw}
                </p>
              )}
            </div>

            {/* Cómo tomar y preparación */}
            <div className="lg:col-span-6 rounded-3xl border border-[#D7E4EC] bg-[#0093DD] text-[#FFFFF0] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="xrule xrule--light" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-wider text-[#EFFBC4] mb-1">
                  Modo de Empleo y Horario Ideal
                </p>
                <h2 className="text-2xl font-extrabold text-white mb-4">
                  ¿Cómo se prepara y a qué hora tomar {product.cleanName}?
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-[#EAF6FD]">
                  <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
                    <strong className="block text-[#EFFBC4] text-xs uppercase tracking-wider mb-1">
                      1. Preparación recomendada
                    </strong>
                    <p>{product.preparation}</p>
                  </div>

                  <div className="rounded-2xl bg-white/10 border border-white/20 p-4">
                    <strong className="block text-[#EFFBC4] text-xs uppercase tracking-wider mb-1">
                      2. Mejor momento del día
                    </strong>
                    <p>{product.idealTime}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/25 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#EFFBC4] font-semibold">
                  ✓ Rinde {product.sticks || 28} porciones · {product.pack}
                </span>
                <a
                  href={product.shopUrl}
                  className="btn-fx btn-fx--lime !py-2.5 !px-5 text-xs sm:text-sm font-bold"
                >
                  Pedir en Tienda Oficial →
                </a>
              </div>
            </div>
          </section>

          {/* 4. TABLA DE INFORMACIÓN NUTRICIONAL OFICIAL (SI EXISTE) */}
          {product.nutritionalImage && (
            <section
              id="informacion-nutricional"
              className="py-12 border-t border-[#D7E4EC]"
            >
              <div className="rounded-3xl border border-[#D7E4EC] bg-[#EDF7FD]/45 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5">
                  <div className="xrule" aria-hidden="true" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                    Transparencia Nutricional
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-3">
                    Información nutricional de {product.cleanName}
                  </h2>
                  <p className="text-sm sm:text-base text-[#5A6B78] leading-relaxed mb-5">
                    Revisa la tabla nutricional oficial de{" "}
                    <strong>{product.cleanName}</strong> para el mercado de Perú
                    (código SKU #{product.sku}). Elaborado bajo estándares
                    HACCP, BPM y Clean Label.
                  </p>
                  <a
                    href={product.shopUrl}
                    className="btn-fx btn-fx--buy text-sm font-bold"
                  >
                    Comprar Ahora ({product.formattedPrice}) →
                  </a>
                </div>
                <div className="lg:col-span-7 flex justify-center">
                  <img
                    src={product.nutritionalImage}
                    alt={`Tabla de información nutricional de ${product.cleanName} FuXion Perú`}
                    className="rounded-2xl border border-[#D7E4EC] bg-white p-2 max-h-[520px] w-auto object-contain shadow-xs"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          )}

          {/* 5. PREGUNTAS FRECUENTES DEL PRODUCTO */}
          <section id="preguntas-frecuentes" className="py-12 border-t border-[#D7E4EC]">
            <div className="max-w-3xl">
              <div className="xrule" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                Resolvemos tus dudas
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-6">
                Preguntas frecuentes sobre {product.cleanName} en Perú
              </h2>

              <div className="space-y-3.5">
                {product.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    open={idx === 0}
                    className="group rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 open:bg-white p-5 transition-all"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-base text-[#12232E]">
                      <span>{faq.question}</span>
                      <span className="w-7 h-7 rounded-full bg-[#EDF7FD] text-[#0093DD] grid place-items-center font-extrabold shrink-0 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>
                    <p className="text-sm sm:text-[15px] text-[#2B3D4B] leading-relaxed mt-3.5 pt-3.5 border-t border-[#D7E4EC]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* 6. PRODUCTOS COMPLEMENTARIOS RECOMENDADOS */}
          {relatedProducts.length > 0 && (
            <section className="py-12 border-t border-[#D7E4EC]">
              <div className="xrule" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                Sinergia Nutracéutica
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-2">
                ¿Con qué otros productos combinar {product.cleanName}?
              </h2>
              <p className="text-sm sm:text-base text-[#5A6B78] mb-8">
                Potencia tus resultados combinando {product.cleanName} con estas
                fórmulas complementarias del catálogo oficial de FuXion Perú:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.slug} product={rel} />
                ))}
              </div>
            </section>
          )}

          {/* 7. ARTÍCULOS Y GUÍAS RELACIONADAS */}
          {relatedArticles.length > 0 && (
            <section className="py-12 border-t border-[#D7E4EC]">
              <div className="xrule" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                Aprende más en nuestro Blog
              </p>
              <h2 className="text-2xl font-extrabold text-[#12232E] mb-6">
                Guías especializadas sobre {product.cleanName}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map((art) => (
                  <Link
                    key={art.slug}
                    href={`/blog/${art.slug}/`}
                    className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 hover:bg-white hover:border-[#0093DD] p-5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0093DD]">
                        {art.clusterName}
                      </span>
                      <h3 className="text-base sm:text-lg font-extrabold text-[#12232E] mt-1 mb-2">
                        {art.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5A6B78] line-clamp-2">
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
        </div>
      </main>

      <Footer />
    </>
  );
}
