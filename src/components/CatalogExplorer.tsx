"use client";

import { useState, useMemo } from "react";
import type { Category, Product } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

interface CatalogExplorerProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function CatalogExplorer({
  products,
  categories,
  initialCategory = "all",
}: CatalogExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat =
        selectedCategory === "all" || p.categorySlug === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = `${p.cleanName} ${p.name} ${p.sku} ${p.badge} ${p.categoryName} ${p.description} ${p.ingredientsRaw}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Barra de búsqueda y filtro por línea */}
      <div className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/70 p-4 sm:p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-4">
          <div className="relative flex-1">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, beneficio o ingrediente (ej. Prunex1, colágeno, quemar grasa, probióticos, SKU...)"
              className="w-full rounded-full border border-[#D7E4EC] bg-white pl-11 pr-4 py-3 text-sm text-[#12232E] placeholder:text-[#5A6B78] focus:outline-none focus:border-[#0093DD] focus:ring-2 focus:ring-[#0093DD]/20"
              aria-label="Buscar productos FuXion Perú"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0093DD]"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <div className="text-xs sm:text-sm font-semibold text-[#12232E] px-2">
            Mostrando <span className="text-[#0093DD]">{filteredProducts.length}</span> de{" "}
            {products.length} productos
          </div>
        </div>

        {/* Pills de Líneas */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-[#0093DD] text-white shadow-xs"
                : "bg-white text-[#12232E] border border-[#D7E4EC] hover:border-[#0093DD]"
            }`}
          >
            Todos ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter(
              (p) => p.categorySlug === cat.slug
            ).length;
            const active = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? "bg-[#0093DD] text-white shadow-xs"
                    : "bg-white text-[#12232E] border border-[#D7E4EC] hover:border-[#0093DD]"
                }`}
              >
                {cat.icon} {cat.shortName} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#D7E4EC] bg-white p-10 text-center">
          <p className="text-lg font-bold text-[#12232E] mb-2">
            No encontramos productos con ese término
          </p>
          <p className="text-sm text-[#5A6B78] mb-4">
            Prueba buscando por otra palabra clave o muestra todas las líneas del catálogo.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="btn-fx btn-fx--buy text-sm"
          >
            Ver todo el catálogo FuXion Perú
          </button>
        </div>
      )}
    </div>
  );
}
