import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LEGAL_LOCATION, LEGAL_OWNER, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos Personales",
  description: `Política de Privacidad adaptada a la Ley N° 29733 (Ley de Protección de Datos Personales del Perú) de ${SITE_URL}.`,
  alternates: {
    canonical: `${SITE_URL}/politica-privacidad/`,
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#EDF7FD]/35 pt-8 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Política de Privacidad" },
            ]}
          />

          <div className="rounded-3xl border border-[#D7E4EC] bg-white p-6 sm:p-10 shadow-xs fx-prose">
            <div className="xrule" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-6">
              Política de Privacidad y Protección de Datos Personales
            </h1>

            <p>
              De conformidad con la{" "}
              <strong>
                Ley N° 29733 — Ley de Protección de Datos Personales de la
                República del Perú
              </strong>{" "}
              y su Reglamento aprobado mediante Decreto Supremo N° 003-2013-JUS,
              informamos a los usuarios de <strong>{SITE_URL}</strong> sobre el
              tratamiento y resguardo de su privacidad durante su navegación.
            </p>

            <h2>1. Responsable del Sitio Web</h2>
            <ul>
              <li>
                <strong>Responsable:</strong> {LEGAL_OWNER}
              </li>
              <li>
                <strong>Domicilio:</strong> {LEGAL_LOCATION}
              </li>
              <li>
                <strong>Sitio Web:</strong> <code>{SITE_URL}</code>
              </li>
            </ul>

            <h2>2. Recopilación de Datos en fuxion.site</h2>
            <p>
              El sitio web <strong>fuxion.site</strong> actúa como catálogo
              informativo y puente transaccional hacia la tienda oficial{" "}
              <strong>https://shop.site.fuxion.com</strong>. En{" "}
              <code>fuxion.site</code> no almacenamos datos de tarjetas de
              crédito, débito ni contraseñas bancarias.
            </p>
            <p>
              Cuando el usuario hace clic en cualquiera de los botones de compra
              y pasa al proceso de checkout en{" "}
              <strong>https://shop.site.fuxion.com</strong>, los datos de envío
              y facturación son gestionados directamente por la plataforma
              oficial de comercio electrónico de{" "}
              <strong>FuXion Biotech SAC</strong> bajo protocolos de cifrado SSL
              y estándares internacionales PCI-DSS.
            </p>

            <h2>3. Datos de Navegación y Analítica</h2>
            <p>
              Durante su visita a <strong>fuxion.site</strong>, el servidor web
              puede recopilar datos técnicos anónimos (como tipo de navegador,
              sistema operativo, páginas visitadas y tiempo de permanencia) con
              la única finalidad de optimizar la velocidad de carga, seguridad y
              experiencia de búsqueda del catálogo en el Perú.
            </p>

            <h2>4. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
            <p>
              La legislación peruana (Ley N° 29733) garantiza a todo ciudadano
              el ejercicio de sus derechos de información, acceso, actualización,
              inclusión, rectificación, supresión y oposición sobre sus datos
              personales, conforme a los procedimientos establecidos por la
              Autoridad Nacional de Protección de Datos Personales del Perú en
              la jurisdicción de <strong>{LEGAL_LOCATION}</strong>.
            </p>

            <h2>5. Seguridad y Confidencialidad</h2>
            <p>
              Implementamos medidas técnicas de seguridad como conexión cifrada
              HTTPS y cabeceras seguras para garantizar una navegación
              transparente y libre de software malicioso.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
