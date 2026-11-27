import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogExplorer from "@/components/CatalogExplorer";
import ProductInlineCta from "@/components/ProductInlineCta";
import {
  getAllArticles,
  getAllCategories,
  getAllCountries,
  getAllProducts,
  getFlagshipProducts,
  getProductBySlug,
  SITE_URL,
} from "@/lib/data";

const HOME_FAQS = [
  {
    q: "¿Por dónde empiezo si nunca he tomado productos FuXion?",
    a: "Te recomendamos iniciar con el Paso 1 del Sistema Base (Limpieza Digestiva con Prunex1 / Guindon X / Prunex, Flora Liv o Liquid Fiber) y sumar el producto estrella según tu meta principal: Thermo T3 (T T3) y NoCarb-T para control de peso, Vita Xtra T+ para energía diaria, Beauty-In (Cool Age / Bell In) para piel y colágeno, o No Stress (Off) para descansar mejor.",
  },
  {
    q: "¿En qué países y monedas puedo comprar online en la Tienda Oficial?",
    a: "Actualmente nuestra tienda oficial vende y despacha directamente en 6 países con su moneda local: Perú (Soles · PEN), Colombia (Pesos Colombianos · COP), Estados Unidos (Dólares · USD), México (Pesos Mexicanos · MXN), Ecuador (Dólares · USD) y Guatemala (Quetzales · GTQ). Nuestra web detecta tu ubicación automáticamente o puedes cambiar de país con las banderas de la barra superior.",
  },
  {
    q: "¿Cómo se realiza la compra y el pago online?",
    a: "En cada ficha de producto y tarjeta de nuestra web encontrarás botones directos («Comprar en Tienda Oficial») que te llevan sin intermediarios a la plataforma oficial de FuXion de tu país (carlos-lingan.site.fuxion.com). Allí agregas tus productos al carrito y pagas de forma 100% segura en tu moneda local con tarjeta Visa, Mastercard, American Express, Diners o medios locales.",
  },
  {
    q: "¿Puedo tomar varios productos FuXion al mismo tiempo?",
    a: "Sí. Al ser alimentos nutracéuticos 100% naturales con certificación Clean Label (sin químicos ni azúcares añadidos), puedes combinar de 2 a 4 bebidas funcionales en distintos momentos del día: por ejemplo, Vita Xtra T+ por la mañana, Thermo T3 o NoCarb-T después del almuerzo y Prunex1, Beauty-In o Youth Elixir por la noche.",
  },
  {
    q: "¿Cuánto demora el envío a mi domicilio?",
    a: "Todos los pedidos realizados en la tienda oficial son despachados directamente desde los centros logísticos oficiales de FuXion Biotech en cada país (Perú, Colombia, EE. UU., México, Ecuador y Guatemala), con entrega a domicilio entre 1 y 5 días hábiles según tu ciudad.",
  },
];

export default function HomePage() {
  const flagships = getFlagshipProducts();
  const allProducts = getAllProducts();
  const categories = getAllCategories();
  const countries = getAllCountries();
  const featuredArticles = getAllArticles().slice(0, 12);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "FuXion Oficial — Catálogo y Tienda Transaccional en 6 Países",
      url: `${SITE_URL}/`,
      inLanguage: "es",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Productos Estrella FuXion",
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
        {/* ===== 1. HERO OFICIAL CLONADO DE CARLOS-LINGAN.SITE.FUXION.COM ===== */}
        <section className="relative bg-[#0093DD] text-[#FFFFF0] overflow-hidden min-h-[540px] lg:min-h-[660px] flex items-end">
          <div className="absolute inset-0" aria-hidden="true">
            <img
              src="/img/somos-fusion-nutraceutica.webp"
              alt="Somos Fusión Nutracéutica — FuXion Oficial"
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
                className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#EFFBC4] mb-3"
                style={{ fontFamily: "var(--display)" }}
              >
                <span>Fusión Nutracéutica® · Tienda Oficial en 6 Países</span>
                <span>
                  ({countries.map((c) => `${c.flag} ${c.currencyCode}`).join(" · ")})
                </span>
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
                peso, colágeno, inmunidad, enfoque mental y deporte. Compra en
                la moneda oficial de tu país.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#destacados"
                  className="btn-fx btn-fx--lime text-sm sm:text-base font-bold"
                >
                  Buscar Productos
                </a>
                <Link
                  href="/tienda/"
                  className="btn-fx btn-fx--buy text-sm sm:text-base"
                >
                  Ver Catálogo de mi País
                </Link>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  <b className="text-[#EFFBC4]">6 Países</b> · Moneda Local
                </span>
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  <b className="text-[#EFFBC4]">4,9/5</b> · 2.300+ reseñas
                </span>
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  <b className="text-[#EFFBC4]">+55.000</b> clientes activos
                </span>
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-xs text-[#F0FAFF]">
                  <b className="text-[#EFFBC4]">Clean Label</b> garantizado
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 2. CATÁLOGO TRANSACCIONAL MULTI-PAÍS CON BUSCADOR ===== */}
        <section className="py-16 sm:py-20 bg-white" id="destacados">
          <div id="catalogo" className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="mb-8">
              <div className="xrule" aria-hidden="true" />
              <p
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0093DD] mb-1.5"
                style={{ fontFamily: "var(--display)" }}
              >
                Catálogo Oficial Internacional 2026
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-3">
                Todos los productos FuXion en tu moneda local
              </h2>
              <p className="text-[#5A6B78] text-base sm:text-lg max-w-3xl">
                Detectamos tu país automáticamente (o cámbialo con las banderas)
                para mostrarte los productos disponibles, su precio en tu moneda
                local y el enlace directo a tu tienda oficial{" "}
                <strong className="text-[#12232E]">
                  carlos-lingan.site.fuxion.com
                </strong>
                .
              </p>
            </div>

            <CatalogExplorer products={allProducts} categories={categories} />
          </div>
        </section>

        {/* ===== 3. LAS LÍNEAS DEL SISTEMA FUXION ===== */}
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
              corporal.
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
                      <span>{catProds.length} fórmulas en la línea</span>
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

        {/* ===== 4. NOSOTROS Y CALIDAD ===== */}
        <section className="py-16 sm:py-20 bg-white" id="nosotros">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
            <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-end p-6 sm:p-10 mb-10">
              <img
                src="/img/prunex1-hero.webp"
                alt="Naturaleza y laboratorio FuXion"
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
                  Sobre FuXion
                </p>
                <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                  Fuxion Biotech es una compañía multinacional establecida en
                  2006 que transforma la salud y bienestar en las Américas y el
                  mundo.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
              <div className="lg:col-span-6 space-y-4 text-[#2B3D4B] leading-relaxed">
                <p>
                  <strong>FuXion®</strong> investiga, desarrolla y produce
                  alimentos nutracéuticos únicos que ayudan a alcanzar el máximo
                  potencial de salud del organismo, con distribución oficial y
                  despacho directo en{" "}
                  <strong>
                    Perú, Colombia, Estados Unidos, México, Ecuador y Guatemala
                  </strong>
                  .
                </p>
                <p>
                  Sus productos nacen de la fusión de los conocimientos de
                  culturas milenarias —<strong>andina, amazónica</strong>,
                  mesoamericana y asiática— con los últimos avances en biología
                  celular y nutrición humana. A eso se le llama{" "}
                  <strong className="text-[#0093DD]">
                    Fusión Nutracéutica®
                  </strong>
                  .
                </p>
              </div>
              <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { b: "2006", s: "año de fundación" },
                  { b: "6 Países", s: "tienda directa online" },
                  { b: "+55.000", s: "personas la eligen" },
                  { b: "100%", s: "de origen natural" },
                ].map((st, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/60 px-2.5 py-4 text-center flex flex-col items-center justify-center overflow-hidden"
                  >
                    <b
                      className="block text-xl xl:text-[22px] font-extrabold tracking-tight leading-none text-[#0093DD] whitespace-nowrap"
                      style={{ fontFamily: "var(--display)" }}
                    >
                      {st.b}
                    </b>
                    <span className="text-xs text-[#5A6B78] mt-1.5 block leading-snug">
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
                    Elaborado bajo estándares internacionales certificados y con
                    etiqueta limpia (Clean Label).
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
                  { title: "INACAL", desc: "Laboratorio acreditado" },
                  {
                    title: "Clean Label",
                    desc: "Etiqueta limpia, sin químicos",
                  },
                  {
                    title: "Patentes Bio",
                    desc: "Ingredientes patentados",
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

        {/* ===== 7. HUB DE ARTÍCULOS Y GUÍAS DE SALUD NUTRACÉUTICA (+400 ARTÍCULOS) ===== */}
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
                  Biblioteca de Bienestar FuXion
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#12232E]">
                  Guías de uso, beneficios y salud nutracéutica
                </h2>
                <p className="text-[#5A6B78] text-base mt-2 max-w-2xl">
                  Explora más de 400 artículos especializados sobre cómo tomar
                  cada producto, horarios recomendados y planes de salud con
                  enlaces adaptados a tu país y moneda.
                </p>
              </div>
              <Link
                href="/blog/"
                className="btn-fx btn-fx--buy text-sm shrink-0 self-start md:self-auto"
              >
                Ver los +400 Artículos →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredArticles.map((art) => {
                const artProd = getProductBySlug(art.primaryProductSlug);
                return (
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
                      <ProductInlineCta product={artProd} variant="text" />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===== 8. PREGUNTAS FRECUENTES (FAQ) ===== */}
        <section
          className="py-16 sm:py-20 bg-white border-t border-[#D7E4EC]"
          id="ayuda"
        >
          <div className="mx-auto max-w-[920px] px-4 sm:px-6">
            <div className="xrule" aria-hidden="true" />
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0093DD] mb-1.5"
              style={{ fontFamily: "var(--display)" }}
            >
              Preguntas frecuentes
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
                ¿List@ para empezar tu cambio con FuXion?
              </h2>
              <p className="text-[#5A6B78] text-base mt-1">
                Explora el catálogo completo en tu moneda local y recibe tu
                pedido en casa con garantía oficial.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <ProductInlineCta className="btn-fx btn-fx--buy text-base font-bold" />
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
