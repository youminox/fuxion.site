import Link from "next/link";
import type { Product } from "@/lib/data";

interface TransactionalProductCardProps {
  product: Product;
  contextLabel?: string;
}

export default function TransactionalProductCard({
  product,
  contextLabel = "Producto Oficial Recomendado en Perú",
}: TransactionalProductCardProps) {
  return (
    <aside
      aria-label={`Comprar ${product.cleanName} en la Tienda Oficial FuXion Perú`}
      className="my-8 rounded-2xl border-2 border-[#0093DD] bg-gradient-to-br from-[#EDF7FD] via-white to-[#F4FBE8] p-5 sm:p-7 shadow-[0_18px_44px_-20px_rgba(0,147,221,0.3)]"
    >
      {/* Cabecera de la tarjeta transaccional */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-[#D7E4EC]">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0093DD]">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#8CC63F]" />
          <span>{contextLabel}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#12232E]">
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D7E4EC]">
            SKU #{product.sku}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#E8F6D5] text-[#2F5207]">
            ✓ En Stock Perú
          </span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Foto Oficial */}
        <div className="md:col-span-4 flex flex-col items-center">
          <a
            href={product.shopUrl}
            className="relative w-full max-w-[230px] aspect-square rounded-2xl bg-white border border-[#D7E4EC] p-3 grid place-items-center shadow-xs hover:scale-[1.02] transition-transform"
          >
            <img
              src={product.bodegonImage || product.mainImage}
              alt={`${product.cleanName} — Comprar en Tienda Oficial FuXion Perú`}
              className="max-h-[195px] w-auto object-contain"
              loading="lazy"
            />
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#0093DD] text-white">
              {product.badge}
            </span>
          </a>
        </div>

        {/* Información + Beneficios + CTA directo a shop.site.fuxion.com */}
        <div className="md:col-span-8 space-y-3.5">
          <div>
            <p className="text-xs font-semibold text-[#5A6B78] uppercase tracking-wide">
              {product.categoryName} · {product.pack}
            </p>
            <h3
              className="text-2xl sm:text-3xl font-extrabold text-[#12232E] mt-0.5"
              style={{ fontFamily: "var(--display)" }}
            >
              {product.cleanName}
            </h3>
          </div>

          <p className="text-sm sm:text-[15px] text-[#2B3D4B] leading-relaxed">
            {product.description}
          </p>

          {/* Puntos clave */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs sm:text-sm text-[#12232E]">
            {product.benefits.slice(0, 4).map((b, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#4E7A16] font-extrabold mt-0.5">✓</span>
                <span className="line-clamp-2">{b}</span>
              </li>
            ))}
          </ul>

          {/* Bloque de Precio en Soles y Botones */}
          <div className="pt-3 border-t border-[#D7E4EC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-2xl sm:text-3xl font-extrabold text-[#0093DD]"
                  style={{ fontFamily: "var(--display)" }}
                >
                  {product.formattedPrice}
                </span>
                <span className="text-xs font-semibold text-[#5A6B78]">
                  Soles (PEN)
                </span>
              </div>
              <p className="text-xs text-[#5A6B78]">
                {product.perStickFormatted
                  ? `${product.perStickFormatted} por sobre · Acumula ${product.points} pts`
                  : `${product.pack} · Garantía Oficial FuXion Perú`}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <a
                href={product.shopUrl}
                className="btn-fx btn-fx--buy !py-3 !px-6 text-sm sm:text-base font-bold shadow-md"
              >
                <span>Comprar en Tienda Oficial</span>
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

          {/* Si tiene otras presentaciones (ej. Caja Mini 7 sticks o Pote), mostrar acceso directo */}
          {product.presentations.length > 1 && (
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[#5A6B78]">
                Otras presentaciones disponibles:
              </span>
              {product.presentations.map((pres) => (
                <a
                  key={pres.sku}
                  href={pres.shopUrl}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#D7E4EC] hover:border-[#0093DD] text-[#12232E] font-medium transition-colors"
                >
                  <span>{pres.pack}:</span>
                  <strong className="text-[#0093DD]">{pres.formattedPrice}</strong>
                  <span>→</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
