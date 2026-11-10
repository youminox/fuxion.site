import productsData from "@/data/products.json";
import categoriesData from "@/data/categories.json";
import articlesData from "@/data/articles.json";

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

export interface Article {
  id: number;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  clusterSlug: string;
  clusterName: string;
  publishedAt: string;
  readingTime: string;
  primaryProductSlug: string;
  primaryProductSku: string;
  primaryProductShopUrl: string;
  primaryProductDirectUrl: string;
  secondaryProductSlugs: string[];
  focusTopic: string;
  introHtml: string;
  beforeCardHtml: string;
  afterCardHtml: string;
  comparisonRows: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
}

const products: Product[] = productsData as Product[];
const categories: Category[] = categoriesData as Category[];
const articles: Article[] = articlesData as Article[];

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

export function getArticlesByProduct(productSlug: string, limit = 4): Article[] {
  const direct = articles.filter(
    (a) =>
      a.primaryProductSlug === productSlug ||
      a.secondaryProductSlugs.includes(productSlug)
  );
  if (direct.length >= limit) return direct.slice(0, limit);
  const rest = articles.filter((a) => !direct.some((d) => d.slug === a.slug));
  return [...direct, ...rest].slice(0, limit);
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
