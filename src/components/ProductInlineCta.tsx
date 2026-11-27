"use client";

import type { Product } from "@/lib/data";
import { useCountry } from "@/context/CountryContext";

interface ProductInlineCtaProps {
  product?: Product;
  variant?: "buy" | "lime" | "text";
  labelPrefix?: string;
  className?: string;
}

export default function ProductInlineCta({
  product,
  variant = "buy",
  labelPrefix = "Comprar",
  className = "",
}: ProductInlineCtaProps) {
  const { country, localize } = useCountry();

  if (!product) {
    return (
      <a
        href={country.shopTiendaUrl}
        className={
          className ||
          `btn-fx ${
            variant === "lime" ? "btn-fx--lime" : "btn-fx--buy"
          } text-sm font-bold`
        }
      >
        Ir a Tienda Oficial FuXion {country.name} ({country.flag}{" "}
        {country.currencyCode}) →
      </a>
    );
  }

  const loc = localize(product);

  if (variant === "text") {
    return (
      <a
        href={loc.shopUrl}
        className={className || "text-[#4E7A16] hover:underline font-bold"}
      >
        {loc.availableInCountry
          ? `Comprar en ${country.shortName} (${loc.formattedPrice}) →`
          : `Ver en tienda ${country.shortName} →`}
      </a>
    );
  }

  return (
    <a
      href={loc.shopUrl}
      className={
        className ||
        `btn-fx ${
          variant === "lime" ? "btn-fx--lime" : "btn-fx--buy"
        } text-sm font-bold`
      }
    >
      {loc.availableInCountry
        ? `${labelPrefix} ${loc.localName} (${loc.formattedPrice} ${country.currencyCode}) →`
        : `Ver Tienda Oficial FuXion ${country.name} →`}
    </a>
  );
}
