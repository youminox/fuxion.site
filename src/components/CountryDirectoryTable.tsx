"use client";

import Link from "next/link";
import { getCountryDirectory } from "@/lib/data";
import { useCountry } from "@/context/CountryContext";

export default function CountryDirectoryTable() {
  const { country, countries, countryCode, setCountryCode } = useCountry();
  const items = getCountryDirectory(countryCode);

  return (
    <section className="pt-12 border-t border-[#D7E4EC]">
      <div className="xrule" aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-wider text-[#0093DD] mb-1">
        Directorio Oficial Completo · {country.flag} {country.name} (
        {country.currencyCode})
      </p>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mb-2">
            Catálogo Oficial FuXion {country.name} con Enlace Directo (
            {items.length} productos)
          </h2>
          <p className="text-sm sm:text-base text-[#5A6B78] max-w-3xl">
            Cada fila corresponde exactamente a un producto o presentación
            disponible en la tienda oficial{" "}
            <a
              href={country.shopHomeUrl}
              className="font-bold text-[#0093DD] hover:underline"
            >
              {country.shopHomeUrl.replace("https://", "")}
            </a>{" "}
            con su precio oficial en{" "}
            <strong className="text-[#12232E]">{country.currencyLabel}</strong>.
          </p>
        </div>

        {/* Pestañas de los 6 Países */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {countries.map((c) => {
            const active = c.code === countryCode;
            const count = getCountryDirectory(c.code).length;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => setCountryCode(c.code)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  active
                    ? "bg-[#0093DD] text-white border-[#0093DD] shadow-xs"
                    : "bg-white text-[#12232E] border-[#D7E4EC] hover:border-[#0093DD]"
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.shortName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#EDF7FD] text-[#0093DD]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#D7E4EC] bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#12232E] text-white text-xs uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">SKU</th>
              <th className="py-3 px-4 font-bold">
                Producto Oficial ({country.name})
              </th>
              <th className="py-3 px-4 font-bold">Presentación</th>
              <th className="py-3 px-4 font-bold">Estado</th>
              <th className="py-3 px-4 font-bold">
                Precio ({country.currencySymbol} {country.currencyCode})
              </th>
              <th className="py-3 px-4 font-bold text-right">
                Enlace Directo Tienda {country.shortName}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7E4EC]">
            {items.map((item) => (
              <tr
                key={`${countryCode}-${item.sku}-${item.shopUrl}`}
                className="hover:bg-[#EDF7FD]/60 transition-colors"
              >
                <td className="py-2.5 px-4 font-mono text-xs font-bold text-[#0093DD]">
                  #{item.sku}
                </td>
                <td className="py-2.5 px-4 font-bold text-[#12232E]">
                  <Link
                    href={`/productos/${item.productSlug}/`}
                    className="hover:text-[#0093DD] hover:underline"
                  >
                    {item.name}
                  </Link>
                </td>
                <td className="py-2.5 px-4 text-xs text-[#5A6B78]">
                  {item.pack}
                </td>
                <td className="py-2.5 px-4 text-xs">
                  {item.inStock ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F6D5] text-[#2F5207]">
                      ✓ En stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                      Sin stock
                    </span>
                  )}
                </td>
                <td className="py-2.5 px-4 font-extrabold text-[#12232E]">
                  {item.formattedPrice}
                </td>
                <td className="py-2.5 px-4 text-right">
                  <a
                    href={item.shopUrl}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0093DD] hover:bg-[#007CBC] text-white text-xs font-bold transition-colors"
                  >
                    <span>
                      Comprar en {country.flag} {country.code.toUpperCase()}
                    </span>
                    <span aria-hidden="true">→</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
