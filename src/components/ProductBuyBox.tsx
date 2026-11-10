"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";

export default function ProductBuyBox({ product }: { product: Product }) {
  const [selectedPresIdx, setSelectedPresIdx] = useState(0);
  const currentPres =
    product.presentations[selectedPresIdx] || product.presentations[0];

  const allImages = Array.from(
    new Set(
      [
        product.bodegonImage,
        ...(currentPres?.gallery || []),
        ...product.gallery,
      ].filter(Boolean)
    )
  );
  const [activeImage, setActiveImage] = useState(
    allImages[0] || product.mainImage
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Galería (estilo landing-pdp.css de shop.site.fuxion.com) */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/55 p-4 sm:p-6">
            <div className="relative aspect-square rounded-xl bg-white border border-[#D7E4EC] grid place-items-center p-4 overflow-hidden">
              <img
                src={activeImage}
                alt={`${product.cleanName} — ${currentPres.pack} FuXion Perú`}
                className="max-h-[380px] w-auto object-contain transition-all duration-200"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0093DD] text-white shadow-xs">
                {product.badge}
              </span>
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F6D5] text-[#2F5207]">
                ✓ Original FuXion Perú
              </span>
            </div>

            {allImages.length > 1 && (
              <div
                className="flex flex-wrap gap-2.5 mt-4"
                role="group"
                aria-label="Galería del producto"
              >
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-1.5 border-2 transition-all overflow-hidden ${
                      activeImage === imgUrl
                        ? "border-[#0093DD] scale-105 shadow-xs"
                        : "border-[#D7E4EC] opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.cleanName} vista ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
            <p className="text-xs text-[#5A6B78] mt-3">
              Toca una miniatura para ver el producto y el empaque oficial de FuXion Perú.
            </p>
          </div>
        </div>

        {/* Caja de Compra Transaccional */}
        <div className="lg:col-span-6 rounded-2xl border border-[#D7E4EC] bg-white p-6 sm:p-8 shadow-[0_18px_44px_-20px_rgba(0,147,221,0.22)]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0093DD]">
              {product.categoryName}
            </span>
            <span className="text-xs font-semibold text-[#5A6B78]">
              Código SKU: <strong className="text-[#12232E]">#{currentPres.sku}</strong>
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold text-[#12232E] leading-tight mb-2"
            style={{ fontFamily: "var(--display)" }}
          >
            {product.cleanName}
          </h1>

          <p className="text-sm font-medium text-[#5A6B78] mb-3">
            Presentación seleccionada:{" "}
            <strong className="text-[#12232E]">{currentPres.pack}</strong>
          </p>

          {/* Puntos y Stock */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EDF7FD] text-[#0093DD] border border-[#D7E4EC]">
              ⭐ Acumula {currentPres.points} puntos FuXion
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E8F6D5] text-[#2F5207]">
              ● Disponible para envío en Perú
            </span>
          </div>

          {/* Precio en Soles */}
          <div className="rounded-xl bg-[#EDF7FD]/80 border border-[#D7E4EC] p-4 mb-5">
            <div className="flex items-baseline gap-2.5">
              <span
                className="text-3xl sm:text-4xl font-extrabold text-[#0093DD]"
                style={{ fontFamily: "var(--display)" }}
              >
                {currentPres.formattedPrice}
              </span>
              <span className="text-xs font-bold uppercase text-[#5A6B78]">
                Soles (PEN · IGV Incluido)
              </span>
            </div>
            {currentPres.perStickFormatted && (
              <p className="text-xs sm:text-sm font-medium text-[#12232E] mt-1">
                {currentPres.sticks > 0
                  ? `${currentPres.sticks} sobres · ${currentPres.perStickFormatted} por sobre`
                  : `${currentPres.perStickFormatted} por porción`}
              </p>
            )}
          </div>

          {/* Selector de Presentación cuando hay más de 1 SKU */}
          {product.presentations.length > 1 && (
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-[#12232E] mb-2.5">
                Elige tu presentación oficial:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.presentations.map((pres, idx) => {
                  const isSelected = idx === selectedPresIdx;
                  return (
                    <button
                      key={pres.sku}
                      type="button"
                      onClick={() => {
                        setSelectedPresIdx(idx);
                        if (pres.gallery?.[0]) {
                          setActiveImage(pres.gallery[0]);
                        }
                      }}
                      className={`text-left rounded-xl p-3 border-2 transition-all ${
                        isSelected
                          ? "border-[#0093DD] bg-[#EDF7FD]/60 shadow-xs"
                          : "border-[#D7E4EC] bg-white hover:border-[#0093DD]/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#12232E]">
                          {pres.pack}
                        </span>
                        <span className="text-sm font-extrabold text-[#0093DD]">
                          {pres.formattedPrice}
                        </span>
                      </div>
                      <span className="block text-[11px] text-[#5A6B78] mt-0.5">
                        SKU #{pres.sku} · {pres.points} pts
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resumen corto */}
          <p className="text-[15px] text-[#2B3D4B] leading-relaxed mb-6">
            {product.description}
          </p>

          {/* CTA Principal directo a shop.site.fuxion.com */}
          <div className="space-y-3">
            <a
              href={currentPres.shopUrl}
              className="btn-fx btn-fx--buy w-full !py-4 !px-6 text-base sm:text-lg font-bold shadow-lg"
            >
              <span>Comprar {product.cleanName} en Tienda Oficial</span>
              <span aria-hidden="true">→</span>
            </a>

            {currentPres.shopUrl !== currentPres.directProductUrl && (
              <a
                href={currentPres.directProductUrl}
                className="btn-fx btn-fx--ghost w-full !py-2.5 !px-4 text-xs sm:text-sm"
              >
                Ir a Ficha Rápida de Carrito (SKU #{currentPres.sku}) →
              </a>
            )}
          </div>

          {/* Sellos de confianza bajo el botón */}
          <div className="mt-6 pt-5 border-t border-[#D7E4EC] grid grid-cols-3 gap-2 text-center text-xs text-[#5A6B78]">
            <div className="rounded-lg bg-[#EDF7FD]/50 p-2">
              <strong className="block text-[#12232E]">🔒 Pago Seguro</strong>
              <span>Checkout Oficial FuXion</span>
            </div>
            <div className="rounded-lg bg-[#EDF7FD]/50 p-2">
              <strong className="block text-[#12232E]">🚚 Envíos Perú</strong>
              <span>Lima y Provincias</span>
            </div>
            <div className="rounded-lg bg-[#EDF7FD]/50 p-2">
              <strong className="block text-[#12232E]">🌿 Clean Label</strong>
              <span>100% Origen Natural</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra Flotante Inferior en Móvil idéntica a shop.site.fuxion.com */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-[#D7E4EC] px-4 py-3 shadow-[0_-8px_24px_rgba(18,35,46,0.1)]">
        <div className="mx-auto max-w-[600px] flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-[#0093DD] leading-none">
              {currentPres.formattedPrice}
            </p>
            <p className="text-[11px] font-medium text-[#5A6B78] truncate max-w-[170px] mt-0.5">
              {product.cleanName} · {currentPres.pack}
            </p>
          </div>
          <a
            href={currentPres.shopUrl}
            className="btn-fx btn-fx--buy !py-2.5 !px-5 text-sm font-bold shrink-0"
          >
            Comprar Ahora →
          </a>
        </div>
      </div>
    </>
  );
}
