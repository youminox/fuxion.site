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
    return landings.flatMap((slug) => [
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
  },
};

export default nextConfig;
