import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LEGAL_LOCATION, LEGAL_OWNER, SHOP_TIENDA_URL, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sobre Nosotros y Respaldo Nutracéutico FuXion en Perú",
  description: `Conoce la historia de la Fusión Nutracéutica® en el Perú y el portal oficial administrado por ${LEGAL_OWNER} en ${LEGAL_LOCATION}.`,
  alternates: {
    canonical: `${SITE_URL}/sobre-nosotros/`,
  },
};

export default function SobreNosotrosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#EDF7FD]/35 pt-8 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Sobre Nosotros" },
            ]}
          />

          <div className="rounded-3xl border border-[#D7E4EC] bg-white p-6 sm:p-10 shadow-xs fx-prose">
            <div className="xrule" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-6">
              Sobre Nosotros — Fusión Nutracéutica® desde el Perú
            </h1>

            <p>
              Bienvenido a <strong>fuxion.site</strong>, el catálogo digital y
              centro de información especializada en alimentos nutracéuticos{" "}
              <strong>FuXion®</strong> para el mercado peruano, bajo la
              titularidad de <strong>{LEGAL_OWNER}</strong>, domiciliado en{" "}
              <strong>{LEGAL_LOCATION}</strong>.
            </p>

            <h2>¿Qué es la Fusión Nutracéutica®?</h2>
            <p>
              Fundada en el Perú en el año 2006,{" "}
              <strong>FuXion Biotech SAC</strong> nació con la visión de unir
              los conocimientos ancestrales de culturas milenarias —en especial
              la riqueza botánica de nuestra{" "}
              <strong>Amazonía y Cordillera de los Andes</strong>— con los
              últimos avances científicos en biología celular y nutrición
              humana.
            </p>

            <h2>Nuestro Compromiso con el Consumidor Peruano</h2>
            <ul>
              <li>
                <strong>Información clara y transparente:</strong> Fichas
                completas con ingredientes activos, tablas nutricionales,
                horarios de consumo y precios reales en Soles (S/).
              </li>
              <li>
                <strong>Compra 100% directa y segura:</strong> Cada enlace de
                compra dirige sin intermediarios al entorno oficial{" "}
                <code>https://shop.site.fuxion.com</code>.
              </li>
              <li>
                <strong>Educación en salud preventiva:</strong> Más de 100
                artículos detallados sobre digestión, metabolismo, energía,
                inmunidad, belleza y nutrición deportiva.
              </li>
            </ul>

            <div className="mt-8 not-prose">
              <a
                href={SHOP_TIENDA_URL}
                className="btn-fx btn-fx--buy text-sm sm:text-base font-bold"
              >
                Explorar Tienda Oficial FuXion →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
