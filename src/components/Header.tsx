"use client";

import { useState } from "react";
import Link from "next/link";
import { SHOP_TIENDA_URL } from "@/lib/data";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D7E4EC]">
      {/* Top Bar informativa Perú */}
      <div className="bg-[#12232E] text-[#F0FAFF] text-xs py-1.5 px-4">
        <div className="mx-auto max-w-[1180px] flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8CC63F]" />
            <span>
              <strong>FuXion® Perú</strong> · Catálogo Oficial · Envíos a Lima y todo el Perú
            </span>
          </p>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#D7E4EC]">
            <span>✓ 100% Clean Label</span>
            <span>✓ Compra Directa en Tienda Oficial</span>
          </div>
        </div>
      </div>

      {/* Main Header idéntico a shop.site.fuxion.com */}
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 min-h-[68px] flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label="FuXion Perú — Inicio"
        >
          <img
            src="/img/logo-fuxion-azul.webp"
            alt="FuXion Perú"
            className="h-[27px] w-auto"
            width={118}
            height={27}
          />
          <span className="hidden xl:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EDF7FD] text-[#0093DD] border border-[#D7E4EC]">
            Perú
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-6 ml-auto mr-4 text-[15px] font-medium text-[#12232E]"
          style={{ fontFamily: "var(--display)" }}
          aria-label="Navegación Principal"
        >
          <Link
            href="/tienda/"
            className="py-1 border-b-2 border-transparent hover:border-[#0093DD] hover:text-[#0093DD] transition-colors"
          >
            Catálogo
          </Link>
          <Link
            href="/#lineas"
            className="py-1 border-b-2 border-transparent hover:border-[#0093DD] hover:text-[#0093DD] transition-colors"
          >
            Líneas FuXion
          </Link>
          <Link
            href="/#nosotros"
            className="py-1 border-b-2 border-transparent hover:border-[#0093DD] hover:text-[#0093DD] transition-colors"
          >
            Nosotros
          </Link>
          <Link
            href="/blog/"
            className="py-1 border-b-2 border-transparent hover:border-[#0093DD] hover:text-[#0093DD] transition-colors"
          >
            Guías de Salud
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          <a
            href={SHOP_TIENDA_URL}
            className="w-10 h-10 rounded-full border-[1.5px] border-[#D7E4EC] hover:border-[#0093DD] grid place-items-center text-[#12232E] hover:text-[#0093DD] transition-colors"
            aria-label="Ir al carrito de la Tienda Oficial FuXion"
            title="Ir a la Tienda Oficial FuXion Perú"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M6 6h15l-1.6 9H7.6z" />
              <path d="M6 6L5 3H2" />
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
            </svg>
          </a>

          <a
            href={SHOP_TIENDA_URL}
            className="btn-fx btn-fx--buy !py-2.5 !px-4 sm:!px-5 text-sm whitespace-nowrap"
          >
            <span>Ver Tienda Oficial</span>
            <span aria-hidden="true">→</span>
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden w-10 h-10 rounded-full border border-[#D7E4EC] grid place-items-center text-[#12232E]"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden border-t border-[#D7E4EC] bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="grid gap-2 text-[15px] font-semibold text-[#12232E]">
            <Link
              href="/tienda/"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EDF7FD]"
            >
              🛍️ Catálogo
            </Link>
            <Link
              href="/#lineas"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EDF7FD]"
            >
              🧬 Las 7 Líneas del Sistema FuXion
            </Link>
            <Link
              href="/#nosotros"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EDF7FD]"
            >
              🌿 Sobre FuXion
            </Link>
            <Link
              href="/blog/"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EDF7FD]"
            >
              📚 Blog y Guías de Uso
            </Link>
          </div>
          <div className="pt-2 border-t border-[#D7E4EC]">
            <a
              href={SHOP_TIENDA_URL}
              className="btn-fx btn-fx--buy w-full text-sm"
            >
              Comprar en Tienda Oficial FuXion →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
