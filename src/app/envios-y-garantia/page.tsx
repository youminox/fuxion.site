import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { LEGAL_LOCATION, LEGAL_OWNER, SHOP_TIENDA_URL, SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  title: "Envíos en Perú, Medios de Pago en Soles y Garantía Oficial",
  description:
    "Conoce cómo funcionan los envíos a Lima y provincias del Perú, los medios de pago en Soles (S/) y la garantía de satisfacción al comprar en la Tienda Oficial FuXion.",
  alternates: {
    canonical: `${SITE_URL}/envios-y-garantia/`,
  },
};

export default function EnviosGarantiaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#EDF7FD]/35 pt-8 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "Inicio", href: "/" },
              { label: "Envíos, Pagos y Garantía en Perú" },
            ]}
          />

          <div className="rounded-3xl border border-[#D7E4EC] bg-white p-6 sm:p-10 shadow-xs fx-prose">
            <div className="xrule" aria-hidden="true" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12232E] mb-6">
              Envíos en Perú, Pagos en Soles y Garantía Oficial FuXion
            </h1>

            <p>
              Al elegir tus productos en <strong>{SITE_URL}</strong> (portal
              administrado por <strong>{LEGAL_OWNER}</strong>, domiciliado en{" "}
              <strong>{LEGAL_LOCATION}</strong>), tus compras se procesan de
              manera directa en la tienda oficial{" "}
              <strong>https://shop.site.fuxion.com</strong>.
            </p>

            <h2>1. Cobertura y Tiempos de Envío en el Perú</h2>
            <ul>
              <li>
                <strong>Lima Metropolitana y Callao:</strong> Despacho ágil a
                domicilio u oficina con entrega estimada entre 24 y 48 horas
                hábiles.
              </li>
              <li>
                <strong>Provincias de todo el Perú:</strong> Envíos garantizados
                a Arequipa, Trujillo, Chiclayo, Piura, Cusco, Huancayo, Ica,
                Tacna, Cajamarca, Pucallpa, Iquitos, Tarapoto, Chimbote, Puno y
                todas las regiones del país.
              </li>
              <li>
                <strong>Cálculo del envío:</strong> Se calcula automáticamente
                en Soles al ingresar tu dirección exacta en el checkout de{" "}
                <code>shop.site.fuxion.com</code>.
              </li>
            </ul>

            <h2>2. Medios de Pago Oficiales en Soles (PEN)</h2>
            <p>
              La pasarela oficial de FuXion Perú cuenta con encriptación
              bancaria de máxima seguridad y acepta tarjetas de crédito y débito{" "}
              <strong>
                Visa, Mastercard, American Express y Diners Club
              </strong>{" "}
              en moneda nacional (Soles Peruanos — S/).
            </p>

            <h2>3. Garantía de Autenticidad y Calidad</h2>
            <p>
              Todos los productos salen directamente desde los almacenes
              centrales de <strong>FuXion Biotech SAC en Perú</strong>, con lote
              reciente, empaque sellado, registro sanitario vigente y
              certificaciones <strong>HACCP, BPM y Clean Label</strong>.
            </p>

            <div className="mt-8 not-prose">
              <a
                href={SHOP_TIENDA_URL}
                className="btn-fx btn-fx--buy text-sm sm:text-base font-bold"
              >
                Ir a la Tienda Oficial FuXion Perú →
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
