import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import articlesData from "@/data/articles.json";
import blogCategoriesData from "@/data/blogCategories.json";
import countriesData from "@/data/countries.json";
import countryCatalogData from "@/data/country_catalog.json";

export const SITE_URL = "https://fuxion.site";
export const SITE_NAME = "FuXion Oficial";
export const SHOP_BASE_URL = "https://carlos-lingan.site.fuxion.com";
export const SHOP_TIENDA_URL = "https://carlos-lingan.site.fuxion.com/pe/tienda/";
export const LEGAL_OWNER = "CARLOS EDEN LINGAN BORJA";
export const LEGAL_LOCATION = "Lima, Perú";

export type CountryCode = "pe" | "co" | "us" | "mx" | "ec" | "gt";

export const VALID_COUNTRY_CODES: CountryCode[] = ["pe", "co", "us", "mx", "ec", "gt"];
export const DEFAULT_COUNTRY_CODE: CountryCode = "pe";

export interface CountryConfig {
  code: CountryCode;
  iso: string;
  locale: string;
  name: string;
  shortName: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  currencyLabel: string;
  taxLabel: string;
  shopHomeUrl: string;
  shopTiendaUrl: string;
  checkoutUrl: string;
  shippingRegions: string;
  shippingBadge: string;
  deliveryEstimate: string;
  entityName: string;
}

export interface ProductPresentation {
  sku: string;
  name: string;
  pack: string;
  price: number;
  formattedPrice: string;
  points: number;
  sticks: number;
  perStickFormatted: string;
  inStock: boolean;
  shopUrl: string;
  directProductUrl: string;
  isLanding: boolean;
  gallery: string[];
}

export interface CountryProductOffer {
  countryCode: CountryCode;
  available: boolean;
  localName: string;
  rawName: string;
  sku: string;
  allSkus: string[];
  price: number;
  formattedPrice: string;
  currencyCode: string;
  currencySymbol: string;
  pack: string;
  points: number;
  sticks: number;
  perStickFormatted: string;
  inStock: boolean;
  shopUrl: string;
  directProductUrl: string;
  presentations: ProductPresentation[];
}

export interface CountryDirectoryItem {
  sku: string;
  name: string;
  cleanName: string;
  productSlug: string;
  categorySlug: string;
  categoryName: string;
  badge: string;
  pack: string;
  price: number;
  formattedPrice: string;
  perStickFormatted: string;
  points: number;
  inStock: boolean;
  shopUrl: string;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface Product {
  slug: string;
  sku: string;
  allSkus: string[];
  name: string;
  cleanName: string;
  categorySlug: string;
  categoryName: string;
  categoryShortName: string;
  badge: string;
  isFlagship: boolean;
  price: number;
  formattedPrice: string;
  pack: string;
  points: number;
  sticks: number;
  perStickFormatted: string;
  inStock: boolean;
  shopUrl: string;
  directProductUrl: string;
  mainImage: string;
  bodegonImage: string;
  heroImage: string;
  gallery: string[];
  nutritionalImage: string;
  videoUrl: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  ingredientsRaw: string;
  ingredients: string[];
  preparation: string;
  idealTime: string;
  recommendedCombinations: string[];
  presentations: ProductPresentation[];
  seoTitle: string;
  seoDescription: string;
  faqs: ProductFaq[];
  availableCountries?: CountryCode[];
  countryOffers?: Partial<Record<CountryCode, CountryProductOffer>>;
}

export interface LocalizedProduct extends Product {
  activeCountry: CountryConfig;
  availableInCountry: boolean;
  localName: string;
  rawLocalName: string;
  currencyCode: string;
  currencySymbol: string;
  currencyLabel: string;
  taxLabel: string;
}

export interface Category {
  slug: string;
  name: string;
  shortName: string;
  step: string;
  badge: string;
  icon: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export type ArticleBlock =
  | {
      type: "quick_answer";
      label?: string;
      summary: string;
      keyTakeaway?: string;
    }
  | {
      type: "prose";
      id?: string;
      heading: string;
      paragraphs: string[];
      highlight?: string;
    }
  | {
      type: "steps";
      id?: string;
      heading: string;
      intro?: string;
      steps: { title: string; detail: string }[];
    }
  | {
      type: "checklist";
      id?: string;
      heading: string;
      intro?: string;
      items: { label: string; detail?: string }[];
    }
  | {
      type: "myths";
      id?: string;
      heading: string;
      pairs: { myth: string; reality: string }[];
    }
  | {
      type: "comparison";
      id?: string;
      heading: string;
      intro?: string;
      headers: string[];
      rows: string[][];
    }
  | {
      type: "menu_or_recipe";
      id?: string;
      heading: string;
      intro?: string;
      entries: { label: string; description: string }[];
    }
  | {
      type: "timeline";
      id?: string;
      heading: string;
      intro?: string;
      phases: { phase: string; focus: string }[];
    }
  | {
      type: "callout";
      tone?: "info" | "tip" | "caution";
      title: string;
      body: string;
    }
  | {
      type: "medical_notice";
      id?: string;
      heading?: string;
      intro?: string;
      warningSigns: string[];
      disclaimer?: string;
    };

export interface BlogCategoryHub {
  slug: string;
  name: string;
  clusterSlug: string;
  clusterName: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string;
}

export interface ArticleSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  clusterSlug: string;
  clusterName: string;
  categorySlug?: string;
  readingTime: string;
  focusTopic: string;
  primaryProductSlug: string;
  primaryProductSku: string;
  primaryProductShopUrl: string;
  heroImage?: string;
  heroAlt?: string;
}

export interface Article {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  clusterSlug: string;
  clusterName: string;
  categorySlug?: string;
  primaryKeyword?: string;
  heroImage?: string;
  heroAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  primaryProductSlug: string;
  primaryProductSku: string;
  primaryProductShopUrl: string;
  primaryProductDirectUrl: string;
  secondaryProductSlugs: string[];
  focusTopic: string;
  layoutVariant?: "guide" | "editorial" | "checklist" | "comparison";
  cardPosition?: number;
  cardContextNote?: string;
  blocks?: ArticleBlock[];
  introHtml?: string;
  beforeCardHtml?: string;
  afterCardHtml?: string;
  comparisonRows?: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

const countries: CountryConfig[] = countriesData as CountryConfig[];
const products: Product[] = productsData as unknown as Product[];
const categories: Category[] = categoriesData as Category[];
const articles: Article[] = articlesData as Article[];
const blogCategories: BlogCategoryHub[] = blogCategoriesData as BlogCategoryHub[];
const directoryByCountry = (
  countryCatalogData as unknown as {
    directoryByCountry: Record<CountryCode, CountryDirectoryItem[]>;
  }
).directoryByCountry;

export function isValidCountryCode(code?: string | null): code is CountryCode {
  if (!code) return false;
  return VALID_COUNTRY_CODES.includes(code.toLowerCase() as CountryCode);
}

export function getAllCountries(): CountryConfig[] {
  return countries;
}

export function getCountryConfig(code?: string | null): CountryConfig {
  const norm = (code || DEFAULT_COUNTRY_CODE).toLowerCase();
  return (
    countries.find((c) => c.code === norm) ||
    countries.find((c) => c.code === DEFAULT_COUNTRY_CODE)!
  );
}

export function localizeProduct(
  product: Product,
  countryCode: CountryCode = DEFAULT_COUNTRY_CODE
): LocalizedProduct {
  const country = getCountryConfig(countryCode);
  const offer = product.countryOffers?.[country.code];

  if (offer && offer.available) {
    return {
      ...product,
      activeCountry: country,
      availableInCountry: true,
      localName: offer.localName || product.cleanName,
      rawLocalName: offer.rawName || product.name,
      sku: offer.sku,
      allSkus: offer.allSkus,
      price: offer.price,
      formattedPrice: offer.formattedPrice,
      currencyCode: offer.currencyCode,
      currencySymbol: offer.currencySymbol,
      currencyLabel: country.currencyLabel,
      taxLabel: country.taxLabel,
      pack: offer.pack,
      points: offer.points,
      sticks: offer.sticks,
      perStickFormatted: offer.perStickFormatted,
      inStock: offer.inStock,
      shopUrl: offer.shopUrl,
      directProductUrl: offer.directProductUrl,
      presentations: offer.presentations,
    };
  }

  // Fallback when product is not sold in the selected country
  return {
    ...product,
    activeCountry: country,
    availableInCountry: false,
    localName: product.cleanName,
    rawLocalName: product.name,
    currencyCode: country.currencyCode,
    currencySymbol: country.currencySymbol,
    currencyLabel: country.currencyLabel,
    taxLabel: country.taxLabel,
    inStock: false,
    shopUrl: country.shopTiendaUrl,
    directProductUrl: country.shopTiendaUrl,
  };
}

export function getProductsForCountry(
  countryCode: CountryCode = DEFAULT_COUNTRY_CODE
): LocalizedProduct[] {
  const country = getCountryConfig(countryCode);
  return products
    .filter((p) => Boolean(p.countryOffers?.[country.code]?.available))
    .map((p) => localizeProduct(p, country.code));
}

export function getCountryDirectory(
  countryCode: CountryCode = DEFAULT_COUNTRY_CODE
): CountryDirectoryItem[] {
  const country = getCountryConfig(countryCode);
  return directoryByCountry[country.code] || directoryByCountry.pe || [];
}

export function getAllProducts(): Product[] {
  return products;
}

export function getFlagshipProducts(
  countryCode: CountryCode = DEFAULT_COUNTRY_CODE
): LocalizedProduct[] {
  const countryProds = getProductsForCountry(countryCode);
  const flags = countryProds.filter((p) => p.isFlagship);
  return flags.length > 0 ? flags : countryProds.slice(0, 10);
}

export function getProductBySlug(slug: string): Product | undefined {
  return (
    products.find((p) => p.slug === slug) ||
    products.find((p) => p.allSkus.includes(slug))
  );
}

export function getProductsByCategory(
  categorySlug: string,
  countryCode?: CountryCode
): Product[] {
  if (countryCode) {
    return getProductsForCountry(countryCode).filter(
      (p) => p.categorySlug === categorySlug
    );
  }
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedProducts(
  product: Product,
  countryCode?: CountryCode
): Product[] {
  const pool = countryCode ? getProductsForCountry(countryCode) : products;
  const combos = product.recommendedCombinations
    .map((slug) => pool.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
  if (combos.length >= 4) return combos.slice(0, 4);

  const sameCat = pool.filter(
    (p) =>
      p.categorySlug === product.categorySlug &&
      p.slug !== product.slug &&
      !combos.some((c) => c.slug === p.slug)
  );
  if (combos.length + sameCat.length >= 4) {
    return [...combos, ...sameCat].slice(0, 4);
  }
  const others = pool.filter(
    (p) =>
      p.slug !== product.slug &&
      !combos.some((c) => c.slug === p.slug) &&
      !sameCat.some((c) => c.slug === p.slug)
  );
  return [...combos, ...sameCat, ...others].slice(0, 4);
}

export function getAllCategories(): Category[] {
  return categories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByProduct(productSlug: string, limit = 12): Article[] {
  const primary = articles.filter((a) => a.primaryProductSlug === productSlug);
  const secondary = articles.filter(
    (a) =>
      a.primaryProductSlug !== productSlug &&
      a.secondaryProductSlugs.includes(productSlug)
  );
  const combined = [...primary, ...secondary];
  if (combined.length >= limit) return combined.slice(0, limit);
  const rest = articles.filter((a) => !combined.some((d) => d.slug === a.slug));
  return [...combined, ...rest].slice(0, limit);
}

export function getArticlesByCategory(categorySlug: string, limit = 9): Article[] {
  const catProducts = new Set(
    products.filter((p) => p.categorySlug === categorySlug).map((p) => p.slug)
  );
  const matched = articles.filter((a) => catProducts.has(a.primaryProductSlug));
  return matched.slice(0, limit);
}

export function getAllBlogCategories(): BlogCategoryHub[] {
  return blogCategories;
}

export function getBlogCategoryBySlug(slug: string): BlogCategoryHub | undefined {
  return blogCategories.find((c) => c.slug === slug);
}

export function getArticlesByBlogCategory(categorySlug: string): Article[] {
  return articles.filter((a) => a.categorySlug === categorySlug);
}

export function toArticleSummary(a: Article): ArticleSummary {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    clusterSlug: a.clusterSlug,
    clusterName: a.clusterName,
    categorySlug: a.categorySlug,
    readingTime: a.readingTime,
    focusTopic: a.focusTopic,
    primaryProductSlug: a.primaryProductSlug,
    primaryProductSku: a.primaryProductSku,
    primaryProductShopUrl: a.primaryProductShopUrl,
    heroImage: a.heroImage,
    heroAlt: a.heroAlt,
  };
}

export function getArticleSummaries(): ArticleSummary[] {
  return articles.map(toArticleSummary);
}

export function getRelatedArticlesForArticle(article: Article, limit = 6): Article[] {
  const sameBlogCategory = article.categorySlug
    ? articles.filter(
        (a) => a.slug !== article.slug && a.categorySlug === article.categorySlug
      )
    : [];
  const rotatedCategory: Article[] = [];
  if (sameBlogCategory.length > 0) {
    const startCat = (article.id * 3) % sameBlogCategory.length;
    for (let i = 0; i < sameBlogCategory.length; i++) {
      rotatedCategory.push(sameBlogCategory[(startCat + i) % sameBlogCategory.length]);
    }
  }

  const sameProduct = articles.filter(
    (a) =>
      a.slug !== article.slug &&
      a.primaryProductSlug === article.primaryProductSlug &&
      !rotatedCategory.some((c) => c.slug === a.slug)
  );
  const sameCluster = articles.filter(
    (a) =>
      a.slug !== article.slug &&
      a.primaryProductSlug !== article.primaryProductSlug &&
      a.clusterSlug === article.clusterSlug &&
      !rotatedCategory.some((c) => c.slug === a.slug)
  );

  const rotatedCluster: Article[] = [];
  if (sameCluster.length > 0) {
    const startIdx = (article.id * 5) % sameCluster.length;
    for (let i = 0; i < sameCluster.length; i++) {
      rotatedCluster.push(sameCluster[(startIdx + i) % sameCluster.length]);
    }
  }

  return [...rotatedCategory.slice(0, 3), ...sameProduct, ...rotatedCluster].slice(0, limit);
}

export function cleanSeoTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*\|\s*FuXion\s+Per[uú]\s*$/i, "")
    .replace(/\s*—\s*FuXion\s+Per[uú]\s*$/i, "")
    .trim();
}

export function getMerchantOfferExtras(countryCode: CountryCode = "pe") {
  const country = getCountryConfig(countryCode);
  return {
    priceValidUntil: "2027-12-31",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0.00",
        currency: country.currencyCode,
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: country.iso,
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 1,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 4,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: country.iso,
      returnPolicyCategory:
        "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
  };
}

export function getArticleClusters(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const a of articles) {
    const existing = map.get(a.clusterSlug);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(a.clusterSlug, {
        slug: a.clusterSlug,
        name: a.clusterName,
        count: 1,
      });
    }
  }
  return Array.from(map.values());
}
