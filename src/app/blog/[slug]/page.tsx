import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import TransactionalProductCard from "@/components/TransactionalProductCard";
import ProductCard from "@/components/ProductCard";
import ArticleBlocksRenderer, {
  slugifyHeading,
} from "@/components/article-blocks/ArticleBlocksRenderer";
import AuthorBox from "@/components/article-blocks/AuthorBox";
import {
  cleanSeoTitle,
  getAllArticles,
  getArticleBySlug,
  getBlogCategoryBySlug,
  getMerchantOfferExtras,
  getProductBySlug,
  getRelatedArticlesForArticle,
  LEGAL_LOCATION,
  LEGAL_OWNER,
  SHOP_TIENDA_URL,
  SITE_URL,
} from "@/lib/data";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const primaryProduct = getProductBySlug(article.primaryProductSlug);
  const articleHeroImage = article.heroImage
    ? article.heroImage.startsWith("http")
      ? article.heroImage
      : `${SITE_URL}${article.heroImage}`
    : null;
  const ogImage =
    articleHeroImage ||
    (primaryProduct
      ? primaryProduct.bodegonImage || primaryProduct.mainImage
      : `${SITE_URL}/img/somos-fusion-nutraceutica.webp`);

  return {
    title: cleanSeoTitle(article.seoTitle),
    description: article.seoDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}/`,
    },
    openGraph: {
      type: "article",
      locale: "es_PE",
      url: `${SITE_URL}/blog/${article.slug}/`,
      title: article.seoTitle,
      description: article.seoDescription,
      publishedTime: article.publishedAt,
      images: [
        {
          url: ogImage,
          alt: article.heroAlt || `${article.title} — FuXion Perú`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.seoTitle,
      description: article.seoDescription,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const primaryProduct = getProductBySlug(article.primaryProductSlug);
  if (!primaryProduct) notFound();

  const secondaryProducts = article.secondaryProductSlugs
    .map((s) => getProductBySlug(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const relatedArticles = getRelatedArticlesForArticle(article, 6);
  const blogCategory = article.categorySlug
    ? getBlogCategoryBySlug(article.categorySlug)
    : undefined;
  const offerExtras = getMerchantOfferExtras();
  const primaryImageUrl = primaryProduct.bodegonImage.startsWith("http")
    ? primaryProduct.bodegonImage
    : `${SITE_URL}${primaryProduct.bodegonImage}`;
  const articleLeadImage = article.heroImage
    ? article.heroImage.startsWith("http")
      ? article.heroImage
      : `${SITE_URL}${article.heroImage}`
    : null;

  const modifiedDate = article.updatedAt || article.publishedAt;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.seoDescription,
    image: articleLeadImage
      ? [articleLeadImage, primaryImageUrl, ...primaryProduct.gallery]
      : [primaryImageUrl, ...primaryProduct.gallery],
    datePublished: article.publishedAt,
    dateModified: modifiedDate,
    inLanguage: "es-PE",
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}/`,
    author: {
      "@type": "Person",
      name: LEGAL_OWNER,
      homeLocation: {
        "@type": "Place",
        name: LEGAL_LOCATION,
      },
    },
    publisher: {
      "@type": "Organization",
      name: "FuXion Perú — fuxion.site",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/img/logo-fuxion-azul.webp`,
      },
    },
    about: {
      "@type": "Product",
      name: primaryProduct.cleanName,
      sku: primaryProduct.sku,
      image: primaryImageUrl,
      brand: {
        "@type": "Brand",
        name: "FuXion",
      },
      offers: {
        "@type": "Offer",
        sku: primaryProduct.sku,
        priceCurrency: "PEN",
        price: primaryProduct.price.toFixed(2),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        url: primaryProduct.shopUrl,
        ...offerExtras,
      },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guías de Salud",
        item: `${SITE_URL}/blog/`,
      },
      ...(blogCategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: blogCategory.name,
              item: `${SITE_URL}/blog/categoria/${blogCategory.slug}/`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: article.title,
              item: `${SITE_URL}/blog/${article.slug}/`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: article.title,
              item: `${SITE_URL}/blog/${article.slug}/`,
            },
          ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, faqJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Header />

      <main className="min-h-screen bg-white pt-6 pb-20">
        <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Guías de Salud", href: "/blog/" },
              ...(blogCategory
                ? [
                    {
                      label: blogCategory.name,
                      href: `/blog/categoria/${blogCategory.slug}/`,
                    },
                  ]
                : []),
              { label: article.title },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mt-4">
            {/* COLUMNA PRINCIPAL DEL ARTÍCULO */}
            <article className="lg:col-span-8">
              {/* Cabecera del Artículo */}
              <header className="rounded-3xl border border-[#D7E4EC] bg-[#EDF7FD]/60 p-6 sm:p-9 mb-8">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-bold mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#0093DD] text-white uppercase tracking-wider">
                    {article.clusterName}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#D7E4EC] text-[#12232E]">
                    ⏱ {article.readingTime}
                  </span>
                  <span className="text-[#5A6B78]">
                    Actualizado en Perú · {modifiedDate}
                  </span>
                </div>

                <h1
                  className="text-2xl sm:text-4xl font-extrabold text-[#12232E] leading-tight mb-4"
                  style={{ fontFamily: "var(--display)" }}
                >
                  {article.title}
                </h1>

                <p className="text-base sm:text-lg text-[#2B3D4B] leading-relaxed">
                  {article.excerpt}
                </p>

                {/* Barra rápida de acceso al producto mencionado */}
                <div className="mt-5 pt-4 border-t border-[#D7E4EC] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={primaryProduct.bodegonImage || primaryProduct.mainImage}
                      alt={primaryProduct.cleanName}
                      className="w-11 h-11 rounded-xl bg-white border border-[#D7E4EC] object-contain p-1"
                    />
                    <div>
                      <p className="text-xs font-bold text-[#12232E]">
                        Producto destacado: {primaryProduct.cleanName} (
                        {primaryProduct.formattedPrice})
                      </p>
                      <p className="text-[11px] text-[#5A6B78]">
                        Código Oficial Perú SKU #{primaryProduct.sku} ·{" "}
                        {primaryProduct.pack}
                      </p>
                    </div>
                  </div>
                  <a
                    href={primaryProduct.shopUrl}
                    className="btn-fx btn-fx--buy !py-2 !px-4 text-xs font-bold"
                  >
                    Ver en Tienda Oficial →
                  </a>
                </div>
              </header>

              {article.heroImage && (
                <figure className="mb-8 overflow-hidden rounded-3xl border border-[#D7E4EC] bg-[#EDF7FD]">
                  <img
                    src={article.heroImage}
                    alt={article.heroAlt || article.title}
                    className="w-full aspect-[16/9] object-cover"
                  />
                  {article.heroAlt && (
                    <figcaption className="px-4 py-2.5 text-xs text-[#5A6B78] bg-white border-t border-[#D7E4EC]">
                      {article.heroAlt}
                    </figcaption>
                  )}
                </figure>
              )}

              {article.blocks && article.blocks.length > 0 ? (
                <>
                  {/* Índice dinámico generado desde los encabezados reales del artículo */}
                  {(() => {
                    const headings = article.blocks
                      .map((b) => {
                        const heading =
                          "heading" in b && b.heading
                            ? b.heading
                            : b.type === "medical_notice"
                            ? "¿Cuándo conviene consultar con un médico?"
                            : "";
                        if (!heading) return null;
                        return {
                          id: ("id" in b && b.id) || slugifyHeading(heading),
                          label: heading,
                        };
                      })
                      .filter(
                        (h): h is { id: string; label: string } => Boolean(h)
                      );

                    if (headings.length < 2) return null;

                    if (article.layoutVariant === "editorial") {
                      return (
                        <nav
                          aria-label="En este artículo"
                          className="mb-6 flex flex-wrap items-center gap-2 text-xs"
                        >
                          <span className="font-bold uppercase tracking-wider text-[#5A6B78] mr-1">
                            En este artículo:
                          </span>
                          {headings.map((h) => (
                            <a
                              key={h.id}
                              href={`#${h.id}`}
                              className="px-3 py-1 rounded-full bg-[#EDF7FD] text-[#12232E] hover:bg-[#0093DD] hover:text-white font-semibold transition-colors"
                            >
                              {h.label}
                            </a>
                          ))}
                        </nav>
                      );
                    }

                    if (article.layoutVariant === "comparison") {
                      return null;
                    }

                    return (
                      <nav
                        aria-label="Tabla de contenidos"
                        className="rounded-2xl border border-[#D7E4EC] bg-white p-5 mb-8"
                      >
                        <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-2.5">
                          {article.layoutVariant === "checklist"
                            ? "Puntos clave de esta guía"
                            : "Contenido de esta guía"}
                        </p>
                        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-medium text-[#12232E]">
                          {headings.map((h, i) => (
                            <li key={h.id}>
                              <a
                                href={`#${h.id}`}
                                className="hover:text-[#0093DD] hover:underline"
                              >
                                {i + 1}. {h.label}
                              </a>
                            </li>
                          ))}
                        </ol>
                      </nav>
                    );
                  })()}

                  {/* Bloques dinámicos del artículo con tarjeta contextual en posición variable */}
                  <ArticleBlocksRenderer
                    blocks={article.blocks}
                    product={primaryProduct}
                    cardPosition={article.cardPosition}
                    cardContextNote={article.cardContextNote}
                  />

                  <AuthorBox updatedAt={modifiedDate} />
                </>
              ) : (
                <>
                  {/* Fallback legado durante migración */}
                  <div
                    className="fx-prose"
                    dangerouslySetInnerHTML={{ __html: article.introHtml || "" }}
                  />
                  <div
                    className="fx-prose"
                    dangerouslySetInnerHTML={{
                      __html: article.beforeCardHtml || "",
                    }}
                  />
                  <TransactionalProductCard
                    product={primaryProduct}
                    contextLabel={`Tarjeta de Compra Directa · ${primaryProduct.cleanName} en Perú`}
                  />
                  <div
                    className="fx-prose"
                    dangerouslySetInnerHTML={{
                      __html: article.afterCardHtml || "",
                    }}
                  />
                  <AuthorBox updatedAt={modifiedDate} />
                </>
              )}

              {/* Preguntas Frecuentes del Artículo */}
              <section className="my-10 pt-8 border-t border-[#D7E4EC]">
                <div className="xrule" aria-hidden="true" />
                <h2 className="text-2xl font-extrabold text-[#12232E] mb-5">
                  Preguntas frecuentes sobre este tema
                </h2>
                <div className="space-y-3">
                  {article.faqs.map((faq, idx) => (
                    <details
                      key={idx}
                      open={idx === 0}
                      className="group rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 open:bg-white p-5"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-base text-[#12232E]">
                        <span>{faq.question}</span>
                        <span className="w-7 h-7 rounded-full bg-[#EDF7FD] text-[#0093DD] grid place-items-center font-extrabold shrink-0 group-open:rotate-45 transition-transform">
                          +
                        </span>
                      </summary>
                      <p className="text-sm sm:text-[15px] text-[#2B3D4B] leading-relaxed mt-3 pt-3 border-t border-[#D7E4EC]">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            </article>

            {/* SIDEBAR STICKY DE CONVERSIÓN */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              {/* Caja lateral del producto principal */}
              <div className="rounded-3xl border-2 border-[#0093DD] bg-white p-6 shadow-[0_18px_44px_-20px_rgba(0,147,221,0.25)]">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EDF7FD] text-[#0093DD] mb-3">
                  Compra Directa · Perú
                </span>

                <div className="aspect-[4/3] rounded-2xl bg-[#EDF7FD] p-3 grid place-items-center mb-4">
                  <img
                    src={
                      primaryProduct.bodegonImage || primaryProduct.mainImage
                    }
                    alt={primaryProduct.cleanName}
                    className="max-h-[175px] w-auto object-contain"
                  />
                </div>

                <h3 className="text-xl font-extrabold text-[#12232E]">
                  {primaryProduct.cleanName}
                </h3>
                <p className="text-xs text-[#5A6B78] mt-0.5 mb-3">
                  {primaryProduct.pack} · SKU #{primaryProduct.sku}
                </p>

                <div className="flex items-baseline justify-between py-3 border-y border-[#EDF7FD] mb-4">
                  <span className="text-xs font-bold text-[#5A6B78]">
                    Precio Oficial Perú:
                  </span>
                  <span
                    className="text-2xl font-extrabold text-[#0093DD]"
                    style={{ fontFamily: "var(--display)" }}
                  >
                    {primaryProduct.formattedPrice}
                  </span>
                </div>

                <div className="space-y-2.5">
                  <a
                    href={primaryProduct.shopUrl}
                    className="btn-fx btn-fx--buy w-full !py-3 text-sm font-bold"
                  >
                    Comprar en Tienda Oficial →
                  </a>
                  <Link
                    href={`/productos/${primaryProduct.slug}/`}
                    className="btn-fx btn-fx--ghost w-full !py-2.5 text-xs"
                  >
                    Ver Ficha e Ingredientes
                  </Link>
                </div>

                <p className="text-[11px] text-[#5A6B78] text-center mt-3">
                  🔒 Pago seguro en Soles en shop.site.fuxion.com · Envíos a
                  Lima y provincias.
                </p>
              </div>

              {/* Acceso a toda la tienda */}
              <div className="rounded-2xl border border-[#D7E4EC] bg-[#0093DD] text-[#FFFFF0] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#EFFBC4] mb-1">
                  Catálogo Oficial
                </p>
                <h4 className="text-lg font-extrabold text-white mb-2">
                  Explora todos los productos FuXion
                </h4>
                <p className="text-xs text-[#EAF6FD] leading-relaxed mb-4">
                  Revisa todas las líneas de limpieza, energía, control de peso,
                  colágeno, inmunidad y deporte.
                </p>
                <a
                  href={SHOP_TIENDA_URL}
                  className="btn-fx btn-fx--lime w-full !py-2.5 text-xs font-bold"
                >
                  Ir a Tienda Oficial →
                </a>
              </div>
            </aside>
          </div>

          {/* PRODUCTOS COMPLEMENTARIOS */}
          {secondaryProducts.length > 0 && (
            <section className="mt-14 pt-12 border-t border-[#D7E4EC]">
              <div className="xrule" aria-hidden="true" />
              <h2 className="text-2xl font-extrabold text-[#12232E] mb-6">
                Productos relacionados con esta guía
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <ProductCard product={primaryProduct} />
                {secondaryProducts.map((sp) => (
                  <ProductCard key={sp.slug} product={sp} />
                ))}
              </div>
            </section>
          )}

          {/* ARTÍCULOS RELACIONADOS */}
          {relatedArticles.length > 0 && (
            <section className="mt-14 pt-12 border-t border-[#D7E4EC]">
              <div className="xrule" aria-hidden="true" />
              <h2 className="text-2xl font-extrabold text-[#12232E] mb-6">
                Continúa leyendo sobre bienestar nutracéutico
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}/`}
                    className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 hover:bg-white hover:border-[#0093DD] p-5 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0093DD]">
                        {rel.clusterName}
                      </span>
                      <h3 className="text-base font-extrabold text-[#12232E] mt-1 mb-2">
                        {rel.title}
                      </h3>
                      <p className="text-xs text-[#5A6B78] line-clamp-2">
                        {rel.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0093DD] mt-3 inline-block">
                      Leer guía →
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
