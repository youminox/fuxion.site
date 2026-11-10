import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogExplorer from "@/components/CatalogExplorer";
import {
  getAllArticles,
  getAllCategories,
  getAllProducts,
  getFlagshipProducts,
  SHOP_TIENDA_URL,
  SITE_URL,
} from "@/lib/data";

const HOME_FAQS = [
  {
    q: "¿Por dónde empiezo si nunca he tomado productos FuXion en Perú?",
    a: "Te recomendamos iniciar con el Paso 1 del Sistema Base (Limpieza Digestiva con Prunex1, Flora Liv o Liquid Fiber) y sumar el producto estrella según tu meta principal: Thermo T3 y NoCarb-T para control de peso, Vita Xtra T+ para energía diaria, Beauty-In para piel y colágeno, o No Stress para descansar mejor.",
  },
  {
    q: "¿Cómo se realiza la compra y el pago online?",
    a: "En cada ficha de producto y tarjeta de nuestra web encontrarás botones directos («Comprar en Tienda Oficial») que te llevan sin intermediarios a la plataforma oficial de FuXion Perú (shop.site.fuxion.com). Allí agregas tus productos al carrito y pagas de forma 100% segura con tarjeta Visa, Mastercard, American Express o Diners.",
  },
  {
    q: "¿Puedo tomar varios productos FuXion al mismo tiempo?",
    a: "Sí. Al ser alimentos nutracéuticos 100% naturales con certificación Clean Label (sin químicos ni azúcares añadidos), puedes combinar de 2 a 4 bebidas funcionales en distintos momentos del día: por ejemplo, Vita Xtra T+ por la mañana, Thermo T3 o NoCarb-T después del almuerzo y Prunex1, Beauty-In o Youth Elixir por la noche.",
  },
  {
    q: "¿Los productos FuXion son medicamentos o tienen octógonos?",
    a: "No son medicamentos: son alimentos nutracéuticos elaborados con principios activos concentrados de la Amazonía, los Andes y biotecnología celular. No contienen azúcar (están endulzados con stevia natural) y son libres de octógonos, colorantes y preservantes artificiales.",
  },
  {
    q: "¿Cuánto demora el envío en Lima y a provincias del Perú?",
    a: "Todos los pedidos realizados en la tienda oficial son despachados directamente desde los almacenes de FuXion Biotech SAC en Perú. El tiempo de entrega habitual es de 24 a 48 horas hábiles en Lima Metropolitana y Callao, y de 2 a 4 días hábiles en capitales de provincia.",
  },
];

export default function HomePage() {
  const flagships = getFlagshipProducts();
  const allProducts = getAllProducts();
  const categories = getAllCategories();
  const featuredArticles = getAllArticles().slice(0, 12);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "FuXion Perú — Catálogo Oficial y Tienda Transaccional",
      url: `${SITE_URL}/`,
      inLanguage: "es-PE",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Productos Estrella FuXion Perú",
      itemListElement: flagships.map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/productos/${p.slug}/`,
        name: p.cleanName,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: HOME_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main id="top">
        {/* ===== 1. HERO OFICIAL CLONADO DE SHOP.SITE.FUXION.COM ===== */}
        <section className="relative bg-[#0093DD] text-[#FFFFF0] overflow-hidden min-h-[540px] lg:min-h-[660px] flex items-end">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/img/somos-fusion-nutraceutica.webp"
              alt="Somos Fusión Nutracéutica — FuXion Perú"
              className="w-full h-full object-cover object-[50%_40%]"
              fetchPriority="high"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,26,45,0.93) 0%, rgba(0,26,45,0.68) 42%, rgba(0,26,45,0.22) 72%, rgba(0,26,45,0.10) 100%)",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-[1180px] w-full px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            <div className="max-w-2xl">
              <p
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#EFFBC4] mb-3"
                style={{ fontFamily: "var(--display)" }}
              >
                <span>Fusión Nutracéutica® · Hecho en Perú</span>
              </p>

              <h1
                className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#FFFFF0] leading-[1.06] mb-4"
                style={{ fontFamily: "var(--display)" }}
              >
                Tu cuerpo ya te está diciendo qué necesita. Nosotros te decimos
                con qué empezar.
              </h1>

              <p className="text-base sm:text-lg text-[#EAF6FD] max-w-xl leading-relaxed mb-7">
                Bebidas funcionales 100% naturales que trabajan sobre una función
                concreta del organismo: limpieza digestiva, energía, control de
                peso, colágeno, inmunidad, enfoque mental y deporte.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#destacados"
                  className="btn-fx btn-fx--lime text-sm sm:text-base font-bold"
                >
                  Buscar Productos
                </a>
                <a
                  href={SHOP_TIENDA_URL}
                  className="btn-fx btn-fx--ghostlight text-sm sm:text-base"
                >
                  Explorar Tienda Oficial →
                </a>
                <Link
                  href="/tienda/"
                  className="btn-fx btn-fx--buy text-sm sm:text-base"
                >
                  Ver Catálogo
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  <b className="text-[#EFFBC4]">4,9/5</b> · 2.300+ reseñas
                </span>
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  <b className="text-[#EFFBC4]">+55.000</b> personas en Perú
                </span>
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  Más de <b className="text-[#EFFBC4]">35 países</b>
                </span>
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  <b className="text-[#EFFBC4]">Clean Label</b> garantizado
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. CATÁLOGO TRANSACCIONAL COMPLETO CON BUSCADOR ===== */}
        <section className="py-16 sm:py-20 bg-white" id="destacados">
          <div id="catalogo" className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="xrule" aria-hidden="true" />
                <p
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0093DD] mb-1.5"
                  style={{ fontFamily: "var(--display)" }}
                >
                  Catálogo Oficial Perú 2026
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-3">
                  Todos los productos FuXion
                </h2>
                <p className="text-[#5A6B78] text-base sm:text-lg max-w-3xl">
                  Filtra por línea o busca por nombre, ingrediente o beneficio.
                  Cada producto cuenta con su ficha técnica completa y botón de
                  compra directa hacia la tienda oficial{" "}
                  <strong className="text-[#12232E]">
                    shop.site.fuxion.com
                  </strong>
                  .
                </p>
              </div>
              <a
                href={SHOP_TIENDA_URL}
                className="btn-fx btn-fx--ghost text-sm shrink-0 self-start md:self-auto"
              >
                Ir a Tienda Oficial FuXion →
              </a>
            </div>

            <CatalogExplorer products={allProducts} categories={categories} />
          </div>
        </section>

        {/* ===== 3. LAS LÍNEAS DEL SISTEMA FUXION PERÚ ===== */}
        <section
          className="py-16 sm:py-20 bg-[#EDF7FD]/60 border-y border-[#D7E4EC]"
          id="lineas"
        >
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="xrule" aria-hidden="true" />
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0093DD] mb-1.5"
              style={{ fontFamily: "var(--display)" }}
            >
              Sistema Nutracéutico FuXion®
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-3">
              Elige según el objetivo de tu cuerpo
            </h2>
            <p className="text-[#5A6B78] text-base sm:text-lg max-w-2xl mb-10">
              Explora nuestras líneas especializadas y encuentra la bebida
              funcional exacta para tu meta de salud, energía o composición
              corporal en Perú.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => {
                const catProds = allProducts.filter(
                  (p) => p.categorySlug === cat.slug
                );
                return (
                  <Link
                    key={cat.slug}
                    href={`/linea/${cat.slug}/`}
                    className="group rounded-2xl border border-[#D7E4EC] bg-white p-6 hover:border-[#0093DD] hover:shadow-[0_18px_44px_-20px_rgba(0,147,221,0.25)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EDF7FD] text-[#0093DD]">
                          {cat.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#12232E] group-hover:text-[#0093DD] transition-colors mb-2">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-[#5A6B78] leading-relaxed mb-4">
                        {cat.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EDF7FD] flex items-center justify-between text-xs font-bold text-[#0093DD]">
                      <span>{catProds.length} productos disponibles</span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        Explorar línea →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== 4. NOSOTROS Y CALIDAD (CLONADO DE SHOP.SITE.FUXION.COM) ===== */}
        <section className="py-16 sm:py-20 bg-white" id="nosotros">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-end p-6 sm:p-10 mb-10">
              <img
                src="/img/prunex1-hero.webp"
                alt="Naturaleza y laboratorio FuXion en Perú"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,26,45,0.92) 0%, rgba(0,26,45,0.55) 55%, rgba(0,26,45,0.2) 100%)",
                }}
              />
              <div className="relative z-10 max-w-3xl text-[#FFFFF0]">
                <div className="xrule xrule--light" aria-hidden="true" />
                <p className="text-xs font-bold uppercase tracking-widest text-[#EFFBC4] mb-2">
                  Quiénes somos
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                  Somos Fuxion Biotech SAC, una compañía multinacional
                  establecida en 2006 en Perú que cambia la vida de las personas.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
              <div className="lg:col-span-6 space-y-4 text-[#2B3D4B] leading-relaxed">
                <p>
                  <strong>FuXion®</strong> investiga, desarrolla y produce
                  alimentos nutracéuticos únicos que ayudan a alcanzar el máximo
                  potencial de salud del organismo, comercializándolos hacia el
                  mundo desde el Perú.
                </p>
                <p>
                  Nuestros productos nacen de la fusión de los conocimientos de
                  culturas milenarias —<strong>andina, amazónica</strong>,
                  mesoamericana y asiática— con los últimos avances en biología
                  celular y nutrición humana. A eso le llamamos{" "}
                  <strong className="text-[#0093DD]">
                    Fusión Nutracéutica®
                  </strong>
                  .
                </p>
              </div>
              <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {[
                  { b: "2006", s: "año de fundación, en Perú" },
                  { b: "+35", s: "países con presencia" },
                  { b: "+55.000", s: "personas nos eligen" },
                  { b: "100%", s: "de origen natural" },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/60 p-4 text-center"
                  >
                    <b
                      className="block text-2xl sm:text-3xl font-extrabold text-[#0093DD]"
                      style={{ fontFamily: "var(--display)" }}
                    >
                      {st.b}
                    </b>
                    <span className="text-xs text-[#5A6B78] mt-1 block">
                      {st.s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificaciones (#calidad) */}
            <div
              id="calidad"
              className="rounded-3xl border border-[#D7E4EC] bg-[#EDF7FD]/40 p-6 sm:p-10"
            >
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <img
                  src="/img/sello-calidad-garantizada.webp"
                  alt="Sello de calidad garantizada FuXion"
                  className="h-24 w-auto object-contain"
                  loading="lazy"
                />
                <div className="flex-1 min-w-[260px]">
                  <div className="xrule" aria-hidden="true" />
                  <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
                    Respaldo Científico e Industrial
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E]">
                    Quién avala lo que tomas
                  </h2>
                  <p className="text-sm sm:text-base text-[#5A6B78] mt-1">
                    Producto del Perú, elaborado bajo estándares internacionales
                    certificados y con etiqueta limpia (Clean Label).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {[
                  {
                    title: "HACCP",
                    desc: "Análisis de peligros y puntos críticos",
                  },
                  { title: "BPM", desc: "Buenas prácticas de manufactura" },
                  {
                    title: "Baltic Control",
                    desc: "Certificadora internacional",
                  },
                  { title: "INACAL", desc: "Laboratorio acreditado en Perú" },
                  {
                    title: "Clean Label",
                    desc: "Etiqueta limpia, sin químicos",
                  },
                  {
                    title: "Empresa Peruana",
                    desc: "Reconocimiento a la excelencia",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-[#D7E4EC] bg-white p-3.5"
                  >
                    <b className="block text-sm font-extrabold text-[#0093DD]">
                      {s.title}
                    </b>
                    <span className="text-xs text-[#5A6B78] mt-0.5 block">
                      {s.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 7. HUB DE ARTÍCULOS Y GUÍAS DE SALUD NUTRACÉUTICA (+105 ARTÍCULOS) ===== */}
        <section
          className="py-16 sm:py-20 bg-[#EDF7FD]/40 border-t border-[#D7E4EC]"
          id="guias"
        >
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <div className="xrule" aria-hidden="true" />
                <p
                  className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0093DD] mb-1.5"
                  style={{ fontFamily: "var(--display)" }}
                >
                  Biblioteca de Bienestar FuXion Perú
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12232E]">
                  Guías de uso, beneficios y salud nutracéutica
                </h2>
                <p className="text-[#5A6B78] text-base mt-2 max-w-2xl">
                  Explora más de 100 artículos especializados sobre cómo tomar
                  cada producto, horarios recomendados, comparativas y planes
                  para mejorar tu salud en Perú.
                </p>
              </div>
              <Link
                href="/blog/"
                className="btn-fx btn-fx--buy text-sm shrink-0 self-start md:self-auto"
              >
                Ver los +105 Artículos →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredArticles.map((art) => (
                <article
                  key={art.slug}
                  className="rounded-2xl border border-[#D7E4EC] bg-white p-5 flex flex-col justify-between hover:border-[#0093DD] hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-[#5A6B78] mb-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#EDF7FD] text-[#0093DD] font-bold">
                        {art.clusterName}
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
                      Leer guía completa →
                    </Link>
                    <a
                      href={art.primaryProductShopUrl}
                      className="text-[#4E7A16] hover:underline"
                    >
                      Ver producto en tienda →
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 8. PREGUNTAS FRECUENTES (FAQ) ===== */}
        <section className="py-16 sm:py-20 bg-white border-t border-[#D7E4EC]" id="ayuda">
          <div className="mx-auto max-w-[920px] px-4 sm:px-6">
            <div className="xrule" aria-hidden="true" />
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0093DD] mb-1.5"
              style={{ fontFamily: "var(--display)" }}
            >
              Preguntas frecuentes en Perú
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-8">
              Lo que más nos preguntan antes de comprar
            </h2>

            <div className="space-y-3.5">
              {HOME_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/35 open:bg-white p-5 transition-all"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-bold text-base sm:text-lg text-[#12232E]">
                    <span>{faq.q}</span>
                    <span className="w-7 h-7 rounded-full bg-[#EDF7FD] text-[#0093DD] grid place-items-center font-extrabold shrink-0 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-sm sm:text-base text-[#2B3D4B] leading-relaxed mt-3.5 pt-3.5 border-t border-[#D7E4EC]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 9. CTA BAND FINAL ===== */}
        <section className="py-12 sm:py-16 bg-[#EDF7FD] border-t border-[#D7E4EC]">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E]">
                ¿List@ para empezar tu cambio con FuXion Perú?
              </h2>
              <p className="text-[#5A6B78] text-base mt-1">
                Explora el catálogo completo y recibe tu pedido en Lima o
                provincias con garantía oficial.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href={SHOP_TIENDA_URL}
                className="btn-fx btn-fx--buy text-base font-bold"
              >
                Ir a la Tienda Oficial →
              </a>
              <Link href="/tienda/" className="btn-fx btn-fx--ghost text-base">
                Ver Catálogo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
