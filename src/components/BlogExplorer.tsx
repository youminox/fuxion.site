"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ArticleSummary } from "@/lib/data";

interface BlogExplorerProps {
  articles: ArticleSummary[];
  clusters: { slug: string; name: string; count: number }[];
}

export default function BlogExplorer({
  articles,
  clusters,
}: BlogExplorerProps) {
  const [selectedCluster, setSelectedCluster] = useState("all");
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchCluster =
        selectedCluster === "all" || a.clusterSlug === selectedCluster;
      if (!matchCluster) return false;
      if (!q) return true;
      return `${a.title} ${a.excerpt} ${a.focusTopic} ${a.clusterName}`
        .toLowerCase()
        .includes(q);
    });
  }, [articles, selectedCluster, query]);

  const visibleArticles = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const handleClusterChange = (slug: string) => {
    setSelectedCluster(slug);
    setVisibleCount(24);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setVisibleCount(24);
  };

  return (
    <div>
      {/* Buscador y Filtros de Clúster */}
      <div className="rounded-2xl border border-[#D7E4EC] bg-[#EDF7FD]/70 p-4 sm:p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-4">
          <div className="relative flex-1">
            <input
              type="search"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Buscar guía por producto o síntoma (ej. Prunex1, estreñimiento, bajar de peso, colágeno, hígado...)"
              className="w-full rounded-full border border-[#D7E4EC] bg-white pl-11 pr-4 py-3 text-sm text-[#12232E] placeholder:text-[#5A6B78] focus:outline-none focus:border-[#0093DD]"
              aria-label="Buscar en las guías de FuXion Perú"
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
            Mostrando <span className="text-[#0093DD]">{visibleArticles.length}</span> de{" "}
            <span className="text-[#0093DD]">{filtered.length}</span> artículos ({articles.length} en total)
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleClusterChange("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedCluster === "all"
                ? "bg-[#0093DD] text-white"
                : "bg-white text-[#12232E] border border-[#D7E4EC] hover:border-[#0093DD]"
            }`}
          >
            Todos ({articles.length})
          </button>
          {clusters.map((cl) => (
            <button
              key={cl.slug}
              type="button"
              onClick={() => handleClusterChange(cl.slug)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCluster === cl.slug
                  ? "bg-[#0093DD] text-white"
                  : "bg-white text-[#12232E] border border-[#D7E4EC] hover:border-[#0093DD]"
              }`}
            >
              {cl.name} ({cl.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Artículos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleArticles.map((art) => (
          <article
            key={art.slug}
            className="rounded-2xl border border-[#D7E4EC] bg-white overflow-hidden flex flex-col justify-between hover:border-[#0093DD] hover:shadow-[0_18px_44px_-20px_rgba(0,147,221,0.25)] transition-all"
          >
            {art.heroImage && (
              <Link href={`/blog/${art.slug}/`} className="block aspect-[16/9] bg-[#EDF7FD] overflow-hidden">
                <img
                  src={art.heroImage}
                  alt={art.heroAlt || art.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </Link>
            )}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#5A6B78] mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#EDF7FD] text-[#0093DD] font-bold">
                    {art.clusterName}
                  </span>
                  <span>{art.readingTime}</span>
                </div>

                <h2 className="text-lg font-extrabold text-[#12232E] leading-snug mb-2.5 hover:text-[#0093DD] transition-colors">
                  <Link href={`/blog/${art.slug}/`}>{art.title}</Link>
                </h2>

                <p className="text-sm text-[#5A6B78] line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-[#EDF7FD] flex items-center justify-between text-xs font-bold">
                <Link
                  href={`/blog/${art.slug}/`}
                  className="text-[#0093DD] hover:underline"
                >
                  Leer artículo →
                </Link>
                <a
                  href={art.primaryProductShopUrl}
                  className="px-2.5 py-1 rounded-full bg-[#E8F6D5] text-[#2F5207] hover:bg-[#8CC63F] hover:text-[#1F3105] transition-colors"
                >
                  Comprar SKU #{art.primaryProductSku} →
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Botón Mostrar Más */}
      {visibleCount < filtered.length && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 36)}
            className="px-6 py-3 rounded-full bg-[#0093DD] hover:bg-[#0077B6] text-white font-bold text-sm shadow-sm transition-colors"
          >
            Ver más artículos (+36) — Quedan {filtered.length - visibleCount} por mostrar
          </button>
          <button
            type="button"
            onClick={() => setVisibleCount(filtered.length)}
            className="px-5 py-3 rounded-full border border-[#D7E4EC] bg-white hover:border-[#0093DD] text-[#12232E] font-semibold text-sm transition-colors"
          >
            Mostrar los {filtered.length} artículos
          </button>
        </div>
      )}
    </div>
  );
}
