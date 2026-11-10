import Link from "next/link";
import type { Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group rounded-2xl border border-[#D7E4EC] bg-white overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_44px_-20px_rgba(0,147,221,0.28)]">
      <div>
        {/* Imagen del producto */}
        <Link
          href={`/productos/${product.slug}/`}
          className="relative block aspect-[4/3] bg-[#EDF7FD] overflow-hidden"
        >
          <img
            src={product.bodegonImage || product.mainImage}
            alt={`${product.cleanName} — FuXion Perú`}
            loading="lazy"
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-[#0093DD] border border-[#D7E4EC] shadow-xs">
            {product.badge}
          </span>
          {product.presentations.length > 1 && (
            <span className="absolute bottom-2.5 right-2.5 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#12232E]/85 text-white">
              {product.presentations.length} presentaciones
            </span>
          )}
        </Link>

        {/* Cuerpo */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 text-xs text-[#5A6B78] mb-1">
            <span>{product.pack}</span>
            <span className="font-semibold text-[#4E7A16]">
              SKU #{product.sku}
            </span>
          </div>

          <h3 className="text-lg font-bold text-[#12232E] leading-snug mb-2 group-hover:text-[#0093DD] transition-colors">
            <Link href={`/productos/${product.slug}/`}>
              {product.cleanName}
            </Link>
          </h3>

          <p className="text-sm text-[#5A6B78] line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
      </div>

      {/* Pie transaccional */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 border-t border-[#EDF7FD] flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <span
              className="text-xl font-extrabold text-[#12232E]"
              style={{ fontFamily: "var(--display)" }}
            >
              {product.formattedPrice}
            </span>
            {product.perStickFormatted && (
              <span className="block text-[11px] text-[#5A6B78]">
                {product.perStickFormatted} por sobre
              </span>
            )}
          </div>
          <Link
            href={`/productos/${product.slug}/`}
            className="text-xs font-bold text-[#0093DD] hover:underline"
          >
            Ver beneficios →
          </Link>
        </div>

        <a
          href={product.shopUrl}
          className="btn-fx btn-fx--buy w-full !py-2.5 !px-4 text-sm"
        >
          <span>Comprar en Tienda</span>
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
