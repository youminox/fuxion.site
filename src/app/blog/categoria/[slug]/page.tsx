import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  cleanSeoTitle,
  getAllBlogCategories,
  getArticlesByBlogCategory,
  getBlogCategoryBySlug,
  SITE_URL,
} from "@/lib/data";

export async function generateStaticParams() {
  return getAllBlogCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: cleanSeoTitle(category.seoTitle),
    description: category.seoDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/categoria/${category.slug}/`,
    },
    openGraph: {
      type: "website",
      locale: "es_PE",
      url: `${SITE_URL}/blog/categoria/${category.slug}/`,
      title: category.seoTitle,
      description: category.seoDescription,
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getBlogCategoryBySlug(slug);
  if (!category) notFound();

  const categoryArticles = getArticlesByBlogCategory(category.slug);
  const allCategories = getAllBlogCategories();
  const siblingCategories = allCategories
    .filter((c) => c.slug !== category.slug)
    .slice(0, 6);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.headline,
    description: category.seoDescription,
    url: `${SITE_URL}/blog/categoria/${category.slug}/`,
    inLanguage: "es-PE",
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
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${SITE_URL}/blog/categoria/${category.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([collectionJsonLd, breadcrumbJsonLd]),
        }}
      />
      <Header />

      <main className="min-h-screen bg-white pb-20">
        <section className="bg-[#0093DD] text-[#FFFFF0] py-12 sm:py-16">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider text-[#EFFBC4] mb-3">
              {category.clusterName} · Perú
            </span>
            <h1
              className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4"
              style={{ fontFamily: "var(--display)" }}
            >
              {category.headline}
            </h1>
            <p className="text-base sm:text-lg text-[#EAF6FD] max-w-3xl leading-relaxed">
              {category.intro}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Guías de Salud", href: "/blog/" },
              { label: category.name },
            ]}
          />

          <div className="mt-6 flex items-center justify-between gap-4 border-b border-[#D7E4EC] pb-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#12232E]">
              Guías disponibles ({categoryArticles.length})
            </h2>
            <Link
              href="/blog/"
              className="text-xs sm:text-sm font-bold text-[#0093DD] hover:underline"
            >
              ← Ver todas las guías del blog
            </Link>
          </div>

          {categoryArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryArticles.map((art) => (
                <article
                  key={art.slug}
                  className="rounded-2xl border border-[#D7E4EC] bg-white overflow-hidden flex flex-col justify-between hover:border-[#0093DD] hover:shadow-[0_18px_44px_-20px_rgba(0,147,221,0.25)] transition-all"
                >
                  {art.heroImage && (
                    <Link
                      href={`/blog/${art.slug}/`}
                      className="block aspect-[16/9] bg-[#EDF7FD] overflow-hidden"
                    >
                      <img
                        src={art.heroImage}
                        alt={art.heroAlt || art.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#5A6B78] mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EDF7FD] text-[#0093DD] font-bold">
                          {category.name}
                        </span>
                        <span>{art.readingTime}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#12232E] leading-snug mb-2 hover:text-[#0093DD] transition-colors">
                        <Link href={`/blog/${art.slug}/`}>{art.title}</Link>
                      </h3>
                      <p className="text-sm text-[#5A6B78] line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#EDF7FD] flex items-center justify-between text-xs font-bold">
                      <Link
                        href={`/blog/${art.slug}/`}
                        className="text-[#0093DD] hover:underline"
                      >
                        Leer guía →
                      </Link>
                      <a
                        href={art.primaryProductShopUrl}
                        className="px-2.5 py-1 rounded-full bg-[#E8F6D5] text-[#2F5207] hover:bg-[#8CC63F] hover:text-[#1F3105] transition-colors"
                      >
                        Comprar SKU #{art.primaryProductSku} →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/50 p-8 text-center">
              <p className="text-base font-bold text-[#12232E] mb-2">
                Nuevas guías especializadas en preparación
              </p>
              <p className="text-sm text-[#5A6B78] mb-4">
                Mientras publicamos las 25 guías de {category.name}, puedes explorar el resto de nuestro archivo editorial.
              </p>
              <Link href="/blog/" className="btn-fx btn-fx--buy text-xs font-bold">
                Explorar todas las guías →
              </Link>
            </div>
          )}

          <section className="mt-14 pt-10 border-t border-[#D7E4EC]">
            <div className="xrule" aria-hidden="true" />
            <h2 className="text-xl font-extrabold text-[#12232E] mb-4">
              Otras especialidades de bienestar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {siblingCategories.map((sib) => (
                <Link
                  key={sib.slug}
                  href={`/blog/categoria/${sib.slug}/`}
                  className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 hover:bg-white hover:border-[#0093DD] p-4 transition-all"
                >
                  <p className="text-xs font-bold text-[#0093DD]">{sib.clusterName}</p>
                  <p className="text-base font-extrabold text-[#12232E] mt-0.5">
                    {sib.name} →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
