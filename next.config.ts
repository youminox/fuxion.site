import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fuxionstorage.blob.core.windows.net",
      },
      {
        protocol: "https",
        hostname: "shop.site.fuxion.com",
      },
    ],
  },
  async redirects() {
    const landings = [
      "beauty-in",
      "biopro-fit",
      "biopro-sport",
      "biopro-tect",
      "nocarb-t",
      "thermo-t3",
      "vita-xtra-t",
      "youth-elixir",
      "prunex1",
      "no-stress",
    ];
    const landingRedirects = landings.flatMap((slug) => [
      {
        source: `/${slug}`,
        destination: `/productos/${slug}/`,
        permanent: true,
      },
      {
        source: `/${slug}/`,
        destination: `/productos/${slug}/`,
        permanent: true,
      },
    ]);

    const mergedArticles = [
      {
        from: "como-quitar-la-ansiedad-por-comer-dulces-en-la-tarde-o-noche-con-biopro-fit-fuxion-peru",
        to: "ansiedad-por-comer-dulces-tarde-frenar-antojos-proteina",
      },
      {
        from: "cafe-verde-clorogenico-para-bajar-de-peso-en-peru-como-funciona-cafe-cafe-fit-fuxion-peru",
        to: "cafe-verde-para-adelgazar-acido-clorogenico-cafe-fit-fuxion",
      },
    ].flatMap(({ from, to }) => [
      {
        source: `/blog/${from}`,
        destination: `/blog/${to}/`,
        permanent: true,
      },
      {
        source: `/blog/${from}/`,
        destination: `/blog/${to}/`,
        permanent: true,
      },
    ]);

    return [...landingRedirects, ...mergedArticles];
  },
};

export default nextConfig;
