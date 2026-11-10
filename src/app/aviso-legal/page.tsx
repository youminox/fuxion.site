import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Aviso Legal y Condiciones de Uso",
  description: `Aviso Legal, titularidad y condiciones generales de uso del portal web ${SITE_URL} en Perú.`,
  alternates: {
    canonical: `${SITE_URL}/aviso-legal/`,
  },
};

export default function AvisoLegalPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#EDF7FD]/35 pt-8 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Aviso Legal" },
            ]}
          />

          <div className="rounded-3xl border border-[#D7E4EC] bg-white p-6 sm:p-10 shadow-xs fx-prose">
            <div className="xrule" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-6">
              Aviso Legal y Condiciones de Uso
            </h1>

            <p>
              En cumplimiento con la normativa vigente en la República del Perú
              sobre comercio electrónico, protección al consumidor y servicios
              de la sociedad de la información, se informa a los usuarios de
              este sitio web (<strong>{SITE_URL}</strong>) los datos de
              titularidad y las condiciones que regulan su acceso y navegación.
            </p>

            <h2>1. Datos del Titular del Sitio Web</h2>
            <ul>
              <li>
                <strong>Titular del Portal Web:</strong> {LEGAL_OWNER}
              </li>
              <li>
                <strong>Domicilio:</strong> {LEGAL_LOCATION}
              </li>
              <li>
                <strong>Condición Comercial:</strong> Distribuidor / Empresario
                Independiente Autorizado de FuXion Biotech SAC en el Perú.
              </li>
              <li>
                <strong>Sitio Web:</strong> <code>{SITE_URL}</code>
              </li>
            </ul>

            <h2>2. Objeto y Naturaleza Transaccional del Sitio Web</h2>
            <p>
              El sitio web <strong>fuxion.site</strong> tiene como finalidad
              brindar información detallada, veraz y estructurada en idioma
              español sobre el catálogo de alimentos nutracéuticos de la marca{" "}
              <strong>FuXion®</strong> en el mercado de Perú, con precios
              expresados en moneda nacional (Soles Peruanos — PEN / S/), así
              como facilitar a los usuarios el acceso directo a las páginas de
              compra oficiales alojadas en{" "}
              <strong>https://shop.site.fuxion.com</strong>.
            </p>
            <p>
              Todas las operaciones de pago, facturación electrónica y logística
              de despacho se procesan de manera íntegra y directa dentro del
              entorno seguro oficial de{" "}
              <strong>https://shop.site.fuxion.com</strong> operado bajo el
              respaldo de FuXion Biotech SAC.
            </p>

            <h2>3. Descargo de Responsabilidad Nutracéutica y de Salud</h2>
            <p>
              Los productos mostrados en este sitio web son{" "}
              <strong>alimentos nutracéuticos y bebidas funcionales</strong>{" "}
              elaborados a partir de extractos naturales.{" "}
              <strong>
                No son medicamentos y no están destinados a diagnosticar,
                tratar, curar ni prevenir ninguna enfermedad.
              </strong>
            </p>
            <p>
              La información publicada en nuestras fichas y artículos tiene
              carácter estrictamente informativo y nutricional. Si usted se
              encuentra en periodo de embarazo, lactancia o sigue un tratamiento
              médico específico, le recomendamos consultar con su médico o
              profesional de la salud antes de iniciar el consumo de cualquier
              suplemento o alimento funcional.
            </p>

            <h2>4. Propiedad Intelectual e Industrial</h2>
            <p>
              Las denominaciones de productos, logotipos, fotografías de
              empaques y marcas registradas mencionadas (incluyendo FuXion®,
              Fusión Nutracéutica®, BioProtein+ con Colostrum®, Prolibra®,
              Actinos®, Wellmune WGP® y TurmiPure®) pertenecen a sus respectivos
              titulares y a FuXion Biotech SAC, utilizándose en este portal con
              fines de distribución oficial autorizada.
            </p>

            <h2>5. Legislación Aplicable y Jurisdicción</h2>
            <p>
              El presente Aviso Legal se rige íntegramente por las leyes de la
              República del Perú. Para cualquier controversia que pudiera
              derivarse del acceso o uso de este sitio web, las partes se
              someten a la jurisdicción de los tribunales competentes de la
              ciudad de <strong>{LEGAL_LOCATION}</strong>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
