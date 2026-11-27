"use client";

import Link from "next/link";
import type { Product } from "@/lib/data";
import { useCountry } from "@/context/CountryContext";

interface TransactionalProductCardProps {
  product: Product;
  contextLabel?: string;
  uniqueNote?: string;
}

export default function TransactionalProductCard({
  product,
  contextLabel,
  uniqueNote,
}: TransactionalProductCardProps) {
  const { country, countries, countryCode, setCountryCode, localize } =
    useCountry();
  const loc = localize(product);

  const dynamicLabel = contextLabel
    ? contextLabel.replace(/Per[uú]/g, country.name)
    : `Producto Oficial Recomendado en ${country.name}`;

  return (
    <aside
      aria-label={`Comprar ${loc.localName} en la Tienda Oficial FuXion ${country.name}`}
      className="my-8 rounded-2xl border-2 border-[#0093DD] bg-gradient-to-br from-[#EDF7FD] via-white to-[#F4FBE8] p-5 sm:p-7 shadow-[0_18px_44px_-20px_rgba(0,147,221,0.3)]"
    >
      {/* Cabecera de la tarjeta transaccional con selector de bandera */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#D7E4EC]">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0093DD]">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#8CC63F]" />
          <span>
            {country.flag} {dynamicLabel}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[#12232E]">
          {loc.availableInCountry && (
            <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D7E4EC]">
              SKU #{loc.sku}
            </span>
          )}
          <span
            className={`px-2.5 py-0.5 rounded-full ${
              loc.availableInCountry && loc.inStock
                ? "bg-[#E8F6D5] text-[#2F5207]"
                : "bg-amber-100 text-amber-900"
            }`}
          >
            {loc.availableInCountry
              ? loc.inStock
                ? `✓ En Stock ${country.shortName}`
                : `Sin stock temporal en ${country.shortName}`
              : `Ver alternativas en ${country.shortName}`}
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Foto Oficial */}
        <div className="md:col-span-4 flex flex-col items-center">
          <a
            href={loc.shopUrl}
            className="relative w-full max-w-[230px] aspect-square rounded-2xl bg-white border border-[#D7E4EC] p-3 grid place-items-center shadow-xs hover:scale-[1.02] transition-transform"
          >
            <img
              src={product.bodegonImage || product.mainImage}
              alt={`${loc.localName} — Comprar en Tienda Oficial FuXion ${country.name}`}
              className="max-h-[195px] w-auto object-contain"
              loading="lazy"
            />
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#0093DD] text-white">
              {product.badge}
            </span>
          </a>
        </div>

        {/* Información + Beneficios + CTA directo a carlos-lingan.site.fuxion.com/{country}/ */}
        <div className="md:col-span-8 space-y-3.5">
          <div>
            <p className="text-xs font-semibold text-[#5A6B78] uppercase tracking-wide">
              {product.categoryName} · {loc.pack}
            </p>
            <h3
              className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mt-0.5"
              style={{ fontFamily: "var(--display)" }}
            >
              {loc.localName}
            </h3>
          </div>

          {uniqueNote ? (
            <p className="text-sm sm:text-[15px] text-[#2B3D4B] leading-relaxed">
              {uniqueNote}
            </p>
          ) : (
            <>
              <p className="text-sm sm:text-[15px] text-[#2B3D4B] leading-relaxed">
                {product.description}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs sm:text-sm text-[#12232E]">
                {product.benefits.slice(0, 4).map((b, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#4E7A16] font-extrabold mt-0.5">
                      ✓
                    </span>
                    <span className="line-clamp-2">{b}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Bloque de Precio en la Moneda del País Activo y Botones */}
          <div className="pt-3 border-t border-[#D7E4EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {loc.availableInCountry ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span
                      className="text-2xl sm:text-3xl font-extrabold text-[#0093DD]"
                      style={{ fontFamily: "var(--display)" }}
                    >
                      {loc.formattedPrice}
                    </span>
                    <span className="text-xs font-semibold text-[#5A6B78]">
                      {country.currencyLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6B78]">
                    {loc.perStickFormatted
                      ? `${loc.perStickFormatted} por sobre · ${country.shippingBadge}`
                      : `${loc.pack} · Garantía Oficial FuXion ${country.name}`}
                  </p>
                </>
              ) : (
                <div>
                  <p className="text-sm font-bold text-[#12232E]">
                    Catálogo Oficial FuXion {country.name} ({country.currencyCode})
                  </p>
                  <p className="text-xs text-[#5A6B78]">
                    Revisa las presentaciones equivalentes disponibles en tu país
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href={loc.shopUrl}
                className="btn-fx btn-fx--buy !py-3 !px-6 text-sm sm:text-base font-bold shadow-md"
              >
                <span>
                  {loc.availableInCountry
                    ? `Comprar en Tienda ${country.shortName}`
                    : `Ver Tienda ${country.shortName}`}
                </span>
                <span aria-hidden="true">→</span>
              </a>
              <Link
                href={`/productos/${product.slug}/`}
                className="btn-fx btn-fx--ghost !py-2.5 !px-4 text-xs sm:text-sm"
              >
                Ver Ficha Completa
              </Link>
            </div>
          </div>

          {/* Si tiene otras presentaciones en ese país, mostrar acceso directo */}
          {loc.availableInCountry && loc.presentations.length > 1 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[#5A6B78]">
                Presentaciones en {country.name}:
              </span>
              {loc.presentations.map((pres) => (
                <a
                  key={pres.sku}
                  href={pres.shopUrl}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#D7E4EC] hover:border-[#0093DD] text-[#12232E] font-medium transition-colors"
                >
                  <span>{pres.pack}:</span>
                  <strong className="text-[#0093DD]">
                    {pres.formattedPrice}
                  </strong>
                  <span>→</span>
                </a>
              ))}
            </div>
          )}

          {/* Selector rápido de bandera si el lector está en otro país */}
          <div className="pt-2 border-t border-[#D7E4EC]/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5A6B78]">
            <span>¿Compras desde otro país? Cambia tu moneda:</span>
            <div className="flex flex-wrap items-center gap-1">
              {countries.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCountryCode(c.code)}
                  className={`px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer ${
                    c.code === countryCode
                      ? "bg-[#0093DD] text-white"
                      : "bg-white border border-[#D7E4EC] text-[#12232E] hover:border-[#0093DD]"
                  }`}
                >
                  {c.flag} {c.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
