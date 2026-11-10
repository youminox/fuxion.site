import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogExplorer from "@/components/BlogExplorer";
import { getAllArticles, getArticleClusters, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title:
    "Blog y Guías de Salud Nutracéutica (+400 Artículos Especializados)",
  description:
    "Más de 400 guías especializadas sobre productos FuXion en Perú: para qué sirven, cómo tomarlos, horarios, comparativas, limpieza digestiva, control de peso, colágeno y precios en Soles.",
  alternates: {
    canonical: `${SITE_URL}/blog/`,
  },
};

export default function BlogIndexPage() {
  const articles = getAllArticles();
  const clusters = getArticleClusters();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog de Salud Nutracéutica FuXion Perú",
    url: `${SITE_URL}/blog/`,
    description:
      "Guías de uso, beneficios, horarios y precios en Soles de todos los productos FuXion en Perú.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="min-h-screen bg-white pb-20">
        {/* Hero del Blog */}
        <section className="bg-[#0093DD] text-[#FFFFF0] py-12 sm:py-16">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider text-[#EFFBC4] mb-3">
              📚 Biblioteca Nutracéutica · {articles.length} Guías para Perú
            </span>
            <h1
              className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-3"
              style={{ fontFamily: "var(--display)" }}
            >
              Guías de Uso, Beneficios y Bienestar FuXion Perú
            </h1>
            <p className="text-base sm:text-lg text-[#EAF6FD] max-w-3xl leading-relaxed">
              Aprende para qué sirve cada bebida funcional, a qué hora tomarla,
              cómo combinarla según tu meta y accede directamente al producto
              oficial en Soles (S/).
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1180px] px-4 sm:px-6 pt-8">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: `Blog y Guías de Salud (${articles.length} Artículos)` },
            ]}
          />

          <BlogExplorer articles={articles} clusters={clusters} />

          {/* Índice Maestro por Categoría para Rastreo SEO Completo */}
          <section className="mt-16 pt-12 border-t border-[#D7E4EC]">
            <div className="xrule" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
              Directorio Temático Completo
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-2">
              Índice de las {articles.length} Guías de Salud por Especialidad
            </h2>
            <p className="text-sm sm:text-base text-[#5A6B78] mb-6 max-w-3xl">
              Explora el archivo completo organizado por área de bienestar. Cada
              guía incluye modo de preparación, horario ideal y enlace directo al
              producto oficial en Soles (S/).
            </p>

            <div className="space-y-4">
              {clusters.map((cluster, idx) => {
                const clusterArticles = articles.filter(
                  (a) => a.clusterSlug === cluster.slug
                );
                return (
                  <details
                    key={cluster.slug}
                    open={idx === 0}
                    className="group rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 open:bg-white p-5 transition-all"
                  >
                    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-extrabold text-base sm:text-lg text-[#12232E]">
                      <span>
                        {cluster.name}{" "}
                        <span className="text-sm font-bold text-[#0093DD]">
                          ({clusterArticles.length} artículos)
                        </span>
                      </span>
                      <span className="w-7 h-7 rounded-full bg-[#EDF7FD] text-[#0093DD] grid place-items-center font-extrabold shrink-0 group-open:rotate-45 transition-transform">
                        +
                      </span>
                    </summary>

                    <ul className="mt-4 pt-4 border-t border-[#D7E4EC] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5 text-xs sm:text-sm">
                      {clusterArticles.map((art) => (
                        <li key={art.slug} className="flex items-start gap-2">
                          <span className="text-[#0093DD] font-bold mt-0.5">
                            •
                          </span>
                          <Link
                            href={`/blog/${art.slug}/`}
                            className="text-[#2B3D4B] hover:text-[#0093DD] hover:underline leading-snug"
                          >
                            {art.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
