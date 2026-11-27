"use client";

import Link from "next/link";
import { LEGAL_LOCATION, LEGAL_OWNER } from "@/lib/data";
import { useCountry } from "@/context/CountryContext";

export default function Footer() {
  const { country, countries, countryCode, setCountryCode } = useCountry();

  return (
    <footer className="bg-[#0093DD] text-[#FFFFF0] pt-10 pb-7">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6">
        {/* Barra de Tiendas Oficiales por País */}
        <div className="mb-8 pb-6 border-b border-white/25">
          <p
            className="text-xs font-bold tracking-widest uppercase text-[#EFFBC4] mb-3"
            style={{ fontFamily: "var(--display)" }}
          >
            — TIENDAS OFICIALES FUXION EN 6 PAÍSES (MONEDA LOCAL)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {countries.map((c) => {
              const isSelected = c.code === countryCode;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCountryCode(c.code)}
                  className={`rounded-xl p-2.5 text-left border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-[#12232E] border-[#EFFBC4] shadow-md"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-base">{c.flag}</span>
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-[#0093DD] text-white"
                          : "bg-white/15 text-[#EFFBC4]"
                      }`}
                    >
                      {c.currencySymbol} {c.currencyCode}
                    </span>
                  </div>
                  <p className="font-extrabold text-xs mt-1 truncate">
                    {c.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Columna 1: Marca */}
          <div>
            <Link href="/" className="inline-block mb-3.5">
              <img
                src="/img/logo-fuxion-blanco.webp"
                alt={`FuXion ${country.name}`}
                className="h-[28px] w-auto"
                width={122}
                height={28}
              />
            </Link>
            <p className="text-[14.5px] text-[#FFFFF0] leading-relaxed max-w-[36ch]">
              Alimentos nutracéuticos creados por científicos que se inspiran en
              la naturaleza andina y amazónica y la potencian con biotecnología.
            </p>
          </div>

          {/* Columna 2: Información Legal y Navegación */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase text-[#EFFBC4] mb-3"
              style={{ fontFamily: "var(--display)" }}
            >
              — INFORMACIÓN LEGAL
            </h4>
            <ul className="space-y-1.5 text-[13.5px]">
              <li>
                <Link href="/sobre-nosotros/" className="hover:underline">
                  Sobre Nosotros y Respaldo FuXion
                </Link>
              </li>
              <li>
                <Link href="/envios-y-garantia/" className="hover:underline">
                  Envíos, Pagos y Garantía Oficial
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal/" className="hover:underline">
                  Aviso Legal y Titularidad
                </Link>
              </li>
              <li>
                <Link href="/politica-privacidad/" className="hover:underline">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/politica-de-cookies/" className="hover:underline">
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Compra Directa en el País Activo */}
          <div>
            <h4
              className="text-xs font-bold tracking-widest uppercase text-[#EFFBC4] mb-3"
              style={{ fontFamily: "var(--display)" }}
            >
              — EMPIEZA HOY EN {country.name.toUpperCase()} {country.flag}
            </h4>
            <p className="text-[14px] text-[#FFFFF0] leading-relaxed mb-3.5">
              Elige tu producto en{" "}
              <strong>
                {country.currencyName} ({country.currencySymbol}{" "}
                {country.currencyCode})
              </strong>{" "}
              y finaliza tu pedido directamente en la plataforma oficial de
              FuXion {country.name} con envío a {country.shippingRegions}.
            </p>
            <div className="mb-3.5">
              <a
                href={country.shopTiendaUrl}
                className="btn-fx btn-fx--ftcta w-full text-sm font-bold"
              >
                Ir a Tienda Oficial FuXion {country.name} →
              </a>
            </div>

            <div className="flex items-center gap-2">
              <img
                src="/img/tarjeta-visa.webp"
                alt="Visa"
                className="h-6 w-auto rounded bg-white px-1 py-0.5"
                width={38}
                height={24}
              />
              <img
                src="/img/tarjeta-mastercard.webp"
                alt="Mastercard"
                className="h-6 w-auto rounded bg-white px-1 py-0.5"
                width={38}
                height={24}
              />
              <img
                src="/img/tarjeta-amex.webp"
                alt="American Express"
                className="h-6 w-auto rounded bg-white px-1 py-0.5"
                width={38}
                height={24}
              />
              <img
                src="/img/tarjeta-diners.webp"
                alt="Diners Club"
                className="h-6 w-auto rounded bg-white px-1 py-0.5"
                width={38}
                height={24}
              />
            </div>
          </div>
        </div>

        {/* Cierre de Footer igual a carlos-lingan.site.fuxion.com */}
        <div className="border-t border-white/35 mt-7 pt-5 flex flex-wrap items-baseline justify-between gap-4">
          <p
            className="text-xl sm:text-2xl font-bold tracking-tight text-[#FFFFF0]"
            style={{ fontFamily: "var(--display)" }}
          >
            Fuxion, <em className="not-italic text-[#EFFBC4]">mejoramos tu vida</em>
          </p>
          <p className="text-xs sm:text-sm text-[#FFFFF0]">
            © {new Date().getFullYear()} fuxion.site · Titular: {LEGAL_OWNER} (Domiciliado en {LEGAL_LOCATION}).
          </p>
        </div>

        <p className="text-xs text-[#E9F6FF] mt-3 max-w-[90ch] leading-relaxed">
          Estos productos son alimentos nutracéuticos, no son medicamentos y no
          están destinados a diagnosticar, tratar, curar ni prevenir ninguna
          enfermedad. Consulta a tu profesional de la salud antes de consumirlos
          si estás embarazada, en periodo de lactancia o bajo tratamiento médico.
          Mantener fuera del alcance de los niños. Los resultados varían según
          cada organismo. Todas las transacciones se procesan de manera directa y
          segura en la tienda oficial de FuXion (carlos-lingan.site.fuxion.com).
        </p>
      </div>
    </footer>
  );
}
