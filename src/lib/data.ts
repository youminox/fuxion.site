import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import articlesData from "@/data/articles.json";
import blogCategoriesData from "@/data/blogCategories.json";

export const SITE_URL = "https://fuxion.site";
export const SITE_NAME = "FuXion Perú";
export const SHOP_BASE_URL = "https://shop.site.fuxion.com";
export const SHOP_TIENDA_URL = "https://shop.site.fuxion.com/tienda/";
export const LEGAL_OWNER = "CARLOS EDEN LINGAN BORJA";
export const LEGAL_LOCATION = "Lima, Perú";

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

const products: Product[] = productsData as Product[];
const categories: Category[] = categoriesData as Category[];
const articles: Article[] = articlesData as Article[];
const blogCategories: BlogCategoryHub[] = blogCategoriesData as BlogCategoryHub[];

export function getAllProducts(): Product[] {
  return products;
}

export function getFlagshipProducts(): Product[] {
  return products.filter((p) => p.isFlagship);
}

export function getProductBySlug(slug: string): Product | undefined {
  return (
    products.find((p) => p.slug === slug) ||
    products.find((p) => p.allSkus.includes(slug))
  );
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedProducts(product: Product): Product[] {
  const combos = product.recommendedCombinations
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
  if (combos.length >= 4) return combos.slice(0, 4);

  const sameCat = products.filter(
    (p) =>
      p.categorySlug === product.categorySlug &&
      p.slug !== product.slug &&
      !combos.some((c) => c.slug === p.slug)
  );
  return [...combos, ...sameCat].slice(0, 4);
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

  // Rotate cluster articles deterministically based on article.id so all articles get linked
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

export function getMerchantOfferExtras() {
  return {
    priceValidUntil: "2027-12-31",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0.00",
        currency: "PEN",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "PE",
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
      applicableCountry: "PE",
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
