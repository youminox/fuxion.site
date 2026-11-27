"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCountry } from "@/context/CountryContext";
import type { CountryCode } from "@/lib/data";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { country, countries, countryCode, setCountryCode } = useCountry();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCountry = (code: CountryCode) => {
    setCountryCode(code);
    setCountryDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D7E4EC]">
      {/* Top Bar informativa con Banderas de los 6 Países */}
      <div className="bg-[#12232E] text-[#F0FAFF] text-xs py-1.5 px-4">
        <div className="mx-auto max-w-[1180px] flex flex-wrap items-center justify-between gap-2">
          <p className="font-medium flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8CC63F]" />
            <span>
              <strong>
                {country.flag} FuXion® {country.name}
              </strong>{" "}
              · Precios en {country.currencyName} ({country.currencySymbol}{" "}
              {country.currencyCode}) · {country.shippingBadge}
            </span>
          </p>

          {/* Barra rápida de banderas para cambiar de país con 1 clic */}
          <div className="flex items-center gap-1.5">
            <span className="hidden md:inline text-[11px] text-[#B9D9EB] mr-1">
              Cambiar país:
            </span>
            {countries.map((c) => {
              const active = c.code === countryCode;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelectCountry(c.code)}
                  title={`Ver tienda FuXion ${c.name} (${c.currencyCode})`}
                  aria-label={`Cambiar a ${c.name} (${c.currencyCode})`}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-[#0093DD] text-white ring-1 ring-[#8CC63F]"
                      : "bg-white/10 text-[#D7E4EC] hover:bg-white/20"
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="uppercase">{c.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Header idéntico a carlos-lingan.site.fuxion.com */}
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 min-h-[68px] flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          aria-label={`FuXion ${country.name} — Inicio`}
        >
          <img
            src="/img/logo-fuxion-azul.webp"
            alt={`FuXion ${country.name}`}
            className="h-[27px] w-auto"
            width={118}
            height={27}
          />
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EDF7FD] text-[#0093DD] border border-[#D7E4EC]">
            <span>{country.flag}</span>
            <span>{country.shortName}</span>
            <span className="text-[#4E7A16]">· {country.currencyCode}</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden lg:flex items-center gap-6 ml-auto mr-2 text-[15px] font-medium text-[#12232E]"
          style={{ fontFamily: "var(--display)" }}
          aria-label="Navegación Principal"
        >
          <Link
            href="/tienda/"
            className="py-1 border-b-2 border-transparent hover:border-[#0093DD] hover:text-[#0093DD] transition-colors"
          >
            Catálogo {country.shortName}
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
            Sobre FuXion
          </Link>
          <Link
            href="/blog/"
            className="py-1 border-b-2 border-transparent hover:border-[#0093DD] hover:text-[#0093DD] transition-colors"
          >
            Guías de Salud
          </Link>
        </nav>

        {/* Actions: Selector de País con Bandera + Carrito Tienda Oficial */}
        <div className="flex items-center gap-2">
          {/* Selector desplegable de país y moneda */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="h-10 px-3 rounded-full border-[1.5px] border-[#D7E4EC] hover:border-[#0093DD] bg-[#F6FBFE] flex items-center gap-1.5 text-xs font-bold text-[#12232E] transition-colors cursor-pointer"
              aria-label={`País seleccionado: ${country.name} (${country.currencyCode})`}
              aria-expanded={countryDropdownOpen}
            >
              <span className="text-base leading-none">{country.flag}</span>
              <span className="hidden sm:inline">{country.shortName}</span>
              <span className="text-[#0093DD] font-extrabold">
                ({country.currencySymbol} {country.currencyCode})
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform ${
                  countryDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {countryDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#D7E4EC] shadow-xl py-2 z-50"
                role="menu"
                aria-label="Seleccionar país y moneda"
              >
                <div className="px-3.5 py-2 border-b border-[#EDF7FD]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0093DD]">
                    Selecciona tu país de compra
                  </p>
                  <p className="text-[11px] text-[#5A6B78]">
                    Verás el catálogo y precios en tu moneda local
                  </p>
                </div>

                <div className="py-1">
                  {countries.map((c) => {
                    const isSelected = c.code === countryCode;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectCountry(c.code)}
                        className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#EDF7FD] font-extrabold text-[#0093DD]"
                            : "text-[#12232E] hover:bg-[#F6FBFE] font-semibold"
                        }`}
                        role="menuitem"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-lg leading-none">{c.flag}</span>
                          <span>
                            <span className="block text-sm leading-tight">
                              {c.name}
                            </span>
                            <span className="block text-[11px] text-[#5A6B78] font-normal">
                              {c.currencyName} ({c.currencySymbol}{" "}
                              {c.currencyCode})
                            </span>
                          </span>
                        </span>
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#0093DD] text-white text-[10px] font-bold">
                            Activo ✓
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#0093DD] font-bold">
                            Elegir →
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="px-3.5 pt-2 pb-1 border-t border-[#EDF7FD]">
                  <a
                    href={country.shopTiendaUrl}
                    className="block w-full text-center rounded-xl bg-[#8CC63F] hover:bg-[#7BB32E] text-[#142600] font-extrabold text-xs py-2 px-3 transition-colors"
                  >
                    Ir a Tienda Oficial {country.name} →
                  </a>
                </div>
              </div>
            )}
          </div>

          <a
            href={country.shopTiendaUrl}
            className="w-10 h-10 rounded-full border-[1.5px] border-[#D7E4EC] hover:border-[#0093DD] grid place-items-center text-[#12232E] hover:text-[#0093DD] transition-colors"
            aria-label={`Ir al carrito de la Tienda Oficial FuXion ${country.name}`}
            title={`Ir a la Tienda Oficial FuXion ${country.name}`}
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
          {/* Selector de país en móvil */}
          <div className="rounded-xl bg-[#EDF7FD]/70 border border-[#D7E4EC] p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#0093DD] mb-2">
              País y moneda de compra:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {countries.map((c) => {
                const active = c.code === countryCode;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelectCountry(c.code)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-bold border text-left transition-all ${
                      active
                        ? "bg-[#0093DD] text-white border-[#0093DD]"
                        : "bg-white text-[#12232E] border-[#D7E4EC]"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span className="truncate">
                      {c.shortName} ({c.currencyCode})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-2 text-[15px] font-semibold text-[#12232E]">
            <Link
              href="/tienda/"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EDF7FD]"
            >
              🛍️ Catálogo {country.name} ({country.currencySymbol})
            </Link>
            <Link
              href="/#lineas"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-[#EDF7FD]"
            >
              🧬 Las Líneas del Sistema FuXion
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
              href={country.shopTiendaUrl}
              className="btn-fx btn-fx--buy w-full text-sm"
            >
              Comprar en Tienda Oficial {country.name} →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
