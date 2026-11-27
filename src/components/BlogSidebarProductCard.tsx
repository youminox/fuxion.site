"use client";

import Link from "next/link";
import type { Product } from "@/lib/data";
import { useCountry } from "@/context/CountryContext";

export function BlogHeaderProductBar({ product }: { product: Product }) {
  const { country, localize } = useCountry();
  const loc = localize(product);

  return (
    <div className="mt-5 pt-4 border-t border-[#D7E4EC] flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <img
          src={product.bodegonImage || product.mainImage}
          alt={loc.localName}
          className="w-11 h-11 rounded-xl bg-white border border-[#D7E4EC] object-contain p-1"
        />
        <div>
          <p className="text-xs font-bold text-[#12232E]">
            Producto destacado: {loc.localName}{" "}
            {loc.availableInCountry && (
              <span className="text-[#0093DD]">
                ({loc.formattedPrice} {country.currencyCode})
              </span>
            )}
          </p>
          <p className="text-[11px] text-[#5A6B78]">
            {loc.availableInCountry
              ? `${country.flag} Código Oficial ${country.name} SKU #${loc.sku} · ${loc.pack}`
              : `${country.flag} Tienda Oficial FuXion ${country.name} (${country.currencyLabel})`}
          </p>
        </div>
      </div>
      <a
        href={loc.shopUrl}
        className="btn-fx btn-fx--buy !py-2 !px-4 text-xs font-bold"
      >
        {loc.availableInCountry
          ? `Comprar en ${country.shortName} →`
          : `Ver Tienda ${country.shortName} →`}
      </a>
    </div>
  );
}

export default function BlogSidebarProductCard({
  product,
}: {
  product: Product;
}) {
  const { country, countries, countryCode, setCountryCode, localize } =
    useCountry();
  const loc = localize(product);

  return (
    <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
      {/* Caja lateral del producto principal adaptada al país del lector */}
      <div className="rounded-3xl border-2 border-[#0093DD] bg-white p-6 shadow-[0_18px_44px_-20px_rgba(0,147,221,0.25)]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EDF7FD] text-[#0093DD]">
            <span>{country.flag}</span>
            <span>Compra Directa · {country.shortName}</span>
          </span>
          <span className="text-[11px] font-bold text-[#4E7A16]">
            {country.currencyCode}
          </span>
        </div>

        {/* Selector rápido de bandera */}
        <div className="flex flex-wrap gap-1 mb-3 pb-3 border-b border-[#EDF7FD]">
          {countries.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCountryCode(c.code)}
              title={`Cambiar a ${c.name} (${c.currencyCode})`}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                c.code === countryCode
                  ? "bg-[#0093DD] text-white"
                  : "bg-[#F6FBFE] text-[#12232E] border border-[#D7E4EC] hover:border-[#0093DD]"
              }`}
            >
              {c.flag} {c.code.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="aspect-[4/3] rounded-2xl bg-[#EDF7FD] p-3 grid place-items-center mb-4">
          <img
            src={product.bodegonImage || product.mainImage}
            alt={loc.localName}
            className="max-h-[175px] w-auto object-contain"
          />
        </div>

        <h3 className="text-xl font-extrabold text-[#12232E]">
          {loc.localName}
        </h3>
        <p className="text-xs text-[#5A6B78] mt-0.5 mb-3">
          {loc.availableInCountry
            ? `${loc.pack} · SKU #${loc.sku}`
            : `Tienda Oficial FuXion ${country.name}`}
        </p>

        {loc.availableInCountry ? (
          <div className="flex items-baseline justify-between py-3 border-y border-[#EDF7FD] mb-4">
            <span className="text-xs font-bold text-[#5A6B78]">
              Precio Oficial {country.shortName}:
            </span>
            <div className="text-right">
              <span
                className="text-2xl font-extrabold text-[#0093DD]"
                style={{ fontFamily: "var(--display)" }}
              >
                {loc.formattedPrice}
              </span>
              <span className="block text-[10px] font-semibold text-[#5A6B78]">
                {country.currencyLabel}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-3 border-y border-[#EDF7FD] mb-4 text-xs text-[#5A6B78]">
            Explora el catálogo oficial de <strong>FuXion {country.name}</strong>{" "}
            en {country.currencyLabel}.
          </div>
        )}

        <div className="space-y-2.5">
          <a
            href={loc.shopUrl}
            className="btn-fx btn-fx--buy w-full !py-3 text-sm font-bold"
          >
            {loc.availableInCountry
              ? `Comprar en Tienda ${country.shortName} →`
              : `Ir a Tienda FuXion ${country.shortName} →`}
          </a>
          <Link
            href={`/productos/${product.slug}/`}
            className="btn-fx btn-fx--ghost w-full !py-2.5 text-xs"
          >
            Ver Ficha e Ingredientes
          </Link>
        </div>

        <p className="text-[11px] text-[#5A6B78] text-center mt-3">
          🔒 Pago seguro en {country.currencyName} ({country.currencyCode}) en
          carlos-lingan.site.fuxion.com/{country.code}/ · {country.shippingBadge}
          .
        </p>
      </div>

      {/* Acceso a toda la tienda del país activo */}
      <div className="rounded-2xl border border-[#D7E4EC] bg-[#0093DD] text-[#FFFFF0] p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#EFFBC4] mb-1">
          {country.flag} Catálogo Oficial {country.name}
        </p>
        <h4 className="text-lg font-extrabold text-white mb-2">
          Explora todos los productos FuXion en {country.currencyCode}
        </h4>
        <p className="text-xs text-[#EAF6FD] leading-relaxed mb-4">
          Revisa todas las líneas de limpieza, energía, control de peso,
          colágeno, inmunidad y deporte disponibles en {country.name}.
        </p>
        <a
          href={country.shopTiendaUrl}
          className="btn-fx btn-fx--lime w-full !py-2.5 text-xs font-bold"
        >
          Ir a Tienda Oficial {country.shortName} →
        </a>
      </div>
    </aside>
  );
}
