import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: `Política de uso de cookies técnicas y funcionales en el portal ${SITE_URL}.`,
  alternates: {
    canonical: `${SITE_URL}/politica-de-cookies/`,
  },
};

export default function PoliticaCookiesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#EDF7FD]/35 pt-8 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Política de Cookies" },
            ]}
          />

          <div className="rounded-3xl border border-[#D7E4EC] bg-white p-6 sm:p-10 shadow-xs fx-prose">
            <div className="xrule" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-6">
              Política de Cookies
            </h1>

            <p>
              El presente documento explica qué son las cookies y cómo se
              utilizan en el sitio web <strong>{SITE_URL}</strong>, cuya
              titularidad corresponde a <strong>{LEGAL_OWNER}</strong>,
              domiciliado en <strong>{LEGAL_LOCATION}</strong>.
            </p>

            <h2>1. ¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web
              almacenan en el navegador del usuario (computadora, tablet o
              teléfono móvil) para recordar preferencias de navegación y
              garantizar el correcto funcionamiento técnico de la página.
            </p>

            <h2>2. Tipos de cookies utilizadas</h2>
            <ul>
              <li>
                <strong>Cookies técnicas y necesarias:</strong> Permiten la
                navegación fluida a través de las secciones del catálogo, el
                filtrado instantáneo por líneas de productos y el correcto
                direccionamiento hacia la tienda oficial{" "}
                <code>https://shop.site.fuxion.com</code>.
              </li>
              <li>
                <strong>Cookies de atribución de tienda:</strong> Al pasar a{" "}
                <code>https://shop.site.fuxion.com</code>, la plataforma oficial
                de FuXion utiliza cookies de sesión de carrito (WooCommerce)
                para conservar los productos seleccionados durante el proceso de
                pago en Soles.
              </li>
            </ul>

            <h2>3. Cómo administrar o desactivar las cookies</h2>
            <p>
              El usuario puede permitir, bloquear o eliminar las cookies
              instaladas en su equipo mediante la configuración de las opciones
              del navegador que utilice (Google Chrome, Safari, Mozilla Firefox
              o Microsoft Edge).
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
