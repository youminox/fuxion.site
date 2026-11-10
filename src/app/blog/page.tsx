import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import BlogExplorer from "@/components/BlogExplorer";
import { getAllArticles, getArticleClusters, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title:
    "Blog y Guías de Salud Nutracéutica FuXion Perú (+400 Artículos Especializados)",
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
        </div>
      </main>

      <Footer />
    </>
  );
}
