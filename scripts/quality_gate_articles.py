#!/usr/bin/env python3
"""
Quality gate and merger for rewritten FuXion SEO articles.
Checks:
  - Schema validity for modular blocks[]
  - Minimum word count (850+ words) and >= 4 headed sections
  - Zero >= 12-word verbatim copy from products.json description/benefits
  - Zero banned medical/guarantee claims
  - Valid internal/external links only
  - Pairwise 8-word shingle Jaccard similarity < 0.15 across all rewritten articles
"""
import argparse
import glob
import json
import os
import re
import unicodedata
from typing import Any

BASE_DIR = "/Users/charlie/Documents/Google Antigravity/fuxion.site"
ARTICLES_PATH = os.path.join(BASE_DIR, "src", "data", "articles.json")
PRODUCTS_PATH = os.path.join(BASE_DIR, "src", "data", "products.json")
CATEGORIES_PATH = os.path.join(BASE_DIR, "src", "data", "categories.json")
BATCH_GLOB = "/tmp/rewritten_batches/*.json"

VALID_LAYOUTS = {"guide", "editorial", "checklist", "comparison"}
VALID_BLOCK_TYPES = {
    "quick_answer",
    "prose",
    "steps",
    "checklist",
    "myths",
    "comparison",
    "menu_or_recipe",
    "timeline",
    "callout",
    "medical_notice",
}

BANNED_PHRASES = [
    "milagroso",
    "milagrosa",
    "cura definitiva",
    "cura enfermedades",
    "elimina la enfermedad",
    "sustituye medicamentos",
    "reemplaza tu medicamento",
    "garantizado al 100%",
    "100% garantizado",
    "resultados garantizados",
]


def norm_words(text: str) -> list[str]:
    clean = unicodedata.normalize("NFD", text.lower())
    clean = "".join(c for c in clean if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9]+", clean)


def extract_block_text(block: dict[str, Any]) -> str:
    parts: list[str] = []
    btype = block.get("type")
    if btype == "quick_answer":
        parts.extend([block.get("label", ""), block.get("summary", ""), block.get("keyTakeaway", "")])
    elif btype == "prose":
        parts.append(block.get("heading", ""))
        parts.extend(block.get("paragraphs", []))
        parts.append(block.get("highlight", ""))
    elif btype == "steps":
        parts.extend([block.get("heading", ""), block.get("intro", "")])
        for s in block.get("steps", []):
            parts.extend([s.get("title", ""), s.get("detail", "")])
    elif btype == "checklist":
        parts.extend([block.get("heading", ""), block.get("intro", "")])
        for it in block.get("items", []):
            parts.extend([it.get("label", ""), it.get("detail", "")])
    elif btype == "myths":
        parts.append(block.get("heading", ""))
        for p in block.get("pairs", []):
            parts.extend([p.get("myth", ""), p.get("reality", "")])
    elif btype == "comparison":
        parts.extend([block.get("heading", ""), block.get("intro", "")])
        parts.extend(block.get("headers", []))
        for row in block.get("rows", []):
            parts.extend(row)
    elif btype == "menu_or_recipe":
        parts.extend([block.get("heading", ""), block.get("intro", "")])
        for e in block.get("entries", []):
            parts.extend([e.get("label", ""), e.get("description", "")])
    elif btype == "timeline":
        parts.extend([block.get("heading", ""), block.get("intro", "")])
        for ph in block.get("phases", []):
            parts.extend([ph.get("phase", ""), ph.get("focus", "")])
    elif btype == "callout":
        parts.extend([block.get("title", ""), block.get("body", "")])
    elif btype == "medical_notice":
        parts.extend([block.get("heading", ""), block.get("intro", ""), block.get("disclaimer", "")])
        parts.extend(block.get("warningSigns", []))
    return " ".join(str(x) for x in parts if x)


def extract_article_full_text(art: dict[str, Any]) -> str:
    parts = [
        art.get("title", ""),
        art.get("excerpt", ""),
        art.get("cardContextNote", ""),
    ]
    for b in art.get("blocks", []):
        parts.append(extract_block_text(b))
    for f in art.get("faqs", []):
        parts.extend([f.get("question", ""), f.get("answer", "")])
    return " ".join(parts)


def make_shingles(words: list[str], k: int = 8) -> set[str]:
    if len(words) < k:
        return {" ".join(words)} if words else set()
    return {" ".join(words[i : i + k]) for i in range(len(words) - k + 1)}


def build_product_12grams(products: list[dict[str, Any]]) -> set[str]:
    grams: set[str] = set()
    for p in products:
        texts = [p.get("description", "")] + p.get("benefits", [])
        for t in texts:
            w = norm_words(t)
            for i in range(max(0, len(w) - 11)):
                grams.add(" ".join(w[i : i + 12]))
    return grams


def validate_article(
    art: dict[str, Any],
    valid_product_slugs: set[str],
    valid_category_slugs: set[str],
    valid_article_slugs: set[str],
    prod_12grams: set[str],
) -> list[str]:
    errors: list[str] = []
    slug = art.get("slug", "<missing>")

    for field in ("slug", "title", "seoTitle", "seoDescription", "excerpt", "cardContextNote"):
        if not art.get(field) or not isinstance(art.get(field), str):
            errors.append(f"{slug}: missing or invalid '{field}'")

    if art.get("layoutVariant") not in VALID_LAYOUTS:
        errors.append(f"{slug}: invalid layoutVariant '{art.get('layoutVariant')}'")

    blocks = art.get("blocks")
    if not isinstance(blocks, list) or len(blocks) < 5:
        errors.append(f"{slug}: blocks must have at least 5 items (got {len(blocks) if isinstance(blocks, list) else 0})")
        return errors

    headed_count = 0
    for idx, b in enumerate(blocks):
        if not isinstance(b, dict) or b.get("type") not in VALID_BLOCK_TYPES:
            errors.append(f"{slug}: invalid block at index {idx}: {b.get('type') if isinstance(b, dict) else b}")
        if isinstance(b, dict) and (b.get("heading") or b.get("type") == "medical_notice"):
            headed_count += 1

    if headed_count < 4:
        errors.append(f"{slug}: needs >= 4 headed sections (got {headed_count})")

    faqs = art.get("faqs")
    if not isinstance(faqs, list) or not (3 <= len(faqs) <= 6):
        errors.append(f"{slug}: faqs must have 3-6 entries")

    full_text = extract_article_full_text(art)
    words = norm_words(full_text)
    if len(words) < 850:
        errors.append(f"{slug}: word count too low ({len(words)} < 850)")

    # Check 12-gram copy from product catalog
    art_12grams = {" ".join(words[i : i + 12]) for i in range(max(0, len(words) - 11))}
    copied = art_12grams & prod_12grams
    if copied:
        sample = next(iter(copied))
        errors.append(f"{slug}: verbatim 12-gram copied from product catalog: '{sample}'")

    # Check banned phrases
    lower_plain = re.sub(r"\s+", " ", full_text.lower())
    for phrase in BANNED_PHRASES:
        if phrase in lower_plain:
            errors.append(f"{slug}: banned phrase '{phrase}'")

    # Check links inside markdown [label](url)
    for m in re.finditer(r"\[[^\]]+\]\(([^)]+)\)", full_text):
        url = m.group(1).strip()
        if url.startswith("https://shop.site.fuxion.com/"):
            continue
        elif url.startswith("/productos/"):
            pslug = url.strip("/").split("/")[-1]
            if pslug not in valid_product_slugs:
                errors.append(f"{slug}: invalid product link '{url}'")
        elif url.startswith("/blog/"):
            bslug = url.strip("/").split("/")[-1]
            if bslug not in valid_article_slugs:
                errors.append(f"{slug}: invalid blog link '{url}'")
        elif url.startswith("/linea/"):
            cslug = url.strip("/").split("/")[-1]
            if cslug not in valid_category_slugs:
                errors.append(f"{slug}: invalid category link '{url}'")
        elif url in {"/tienda/", "/sobre-nosotros/", "/envios-y-garantia/", "/"}:
            continue
        else:
            errors.append(f"{slug}: disallowed link '{url}'")

    return errors


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--glob", default=BATCH_GLOB)
    parser.add_argument("--merge", action="store_true")
    parser.add_argument("--strict-all", action="store_true", help="Require all articles in articles.json to be rewritten")
    args = parser.parse_args()

    articles = json.load(open(ARTICLES_PATH, encoding="utf-8"))
    products = json.load(open(PRODUCTS_PATH, encoding="utf-8"))
    categories = json.load(open(CATEGORIES_PATH, encoding="utf-8"))

    valid_product_slugs = {p["slug"] for p in products}
    valid_category_slugs = {c["slug"] for c in categories}
    valid_article_slugs = {a["slug"] for a in articles}
    prod_12grams = build_product_12grams(products)

    rewritten_by_slug: dict[str, dict[str, Any]] = {}
    # Load already-rewritten articles from articles.json first
    for a in articles:
        if a.get("blocks"):
            rewritten_by_slug[a["slug"]] = a

    batch_files = sorted(glob.glob(args.glob))
    for bf in batch_files:
        data = json.load(open(bf, encoding="utf-8"))
        if not isinstance(data, list):
            raise SystemExit(f"Batch {bf} is not a JSON list")
        for item in data:
            if item.get("slug") in valid_article_slugs:
                rewritten_by_slug[item["slug"]] = item

    print(f"Batch files found: {len(batch_files)} | Total rewritten articles loaded: {len(rewritten_by_slug)} / {len(articles)}")

    all_errors: list[str] = []
    shingles_by_slug: dict[str, set[str]] = {}

    for slug, art in rewritten_by_slug.items():
        errs = validate_article(art, valid_product_slugs, valid_category_slugs, valid_article_slugs, prod_12grams)
        all_errors.extend(errs)
        words = norm_words(extract_article_full_text(art))
        shingles_by_slug[slug] = make_shingles(words, 8)

    # Check pairwise 8-word shingle similarity across rewritten articles
    slugs_list = list(shingles_by_slug.keys())
    high_sim: list[tuple[float, str, str]] = []
    for i in range(len(slugs_list)):
        s1 = shingles_by_slug[slugs_list[i]]
        for j in range(i + 1, len(slugs_list)):
            s2 = shingles_by_slug[slugs_list[j]]
            inter = len(s1 & s2)
            if inter == 0:
                continue
            sim = inter / (len(s1) + len(s2) - inter)
            if sim >= 0.15:
                high_sim.append((round(sim, 3), slugs_list[i], slugs_list[j]))

    if high_sim:
        high_sim.sort(reverse=True)
        for sim, s1, s2 in high_sim[:20]:
            all_errors.append(f"HIGH SIMILARITY ({sim}): {s1} <-> {s2}")

    if all_errors:
        print(f"QUALITY GATE FAILED with {len(all_errors)} errors:")
        for e in all_errors[:40]:
            print("  -", e)
        raise SystemExit(1)

    if args.strict_all and len(rewritten_by_slug) != len(articles):
        missing = sorted(valid_article_slugs - set(rewritten_by_slug.keys()))
        print(f"Missing {len(missing)} articles:", missing[:20])
        raise SystemExit(1)

    print("QUALITY GATE PASSED! 0 errors, 0 pairs >= 0.15 similarity.")

    if args.merge:
        merged = []
        for orig in articles:
            slug = orig["slug"]
            if slug in rewritten_by_slug:
                rw = rewritten_by_slug[slug]
                words = norm_words(extract_article_full_text(rw))
                read_mins = max(4, min(12, round(len(words) / 180)))
                updated_art = {
                    "id": orig["id"],
                    "slug": slug,
                    "title": rw["title"],
                    "seoTitle": rw["seoTitle"],
                    "seoDescription": rw["seoDescription"],
                    "excerpt": rw["excerpt"],
                    "clusterSlug": orig["clusterSlug"],
                    "clusterName": orig["clusterName"],
                    "publishedAt": orig["publishedAt"],
                    "updatedAt": "2026-11-13",
                    "readingTime": f"{read_mins} min de lectura",
                    "primaryProductSlug": orig["primaryProductSlug"],
                    "primaryProductSku": orig["primaryProductSku"],
                    "primaryProductShopUrl": orig["primaryProductShopUrl"],
                    "primaryProductDirectUrl": orig["primaryProductDirectUrl"],
                    "secondaryProductSlugs": orig["secondaryProductSlugs"],
                    "focusTopic": orig["focusTopic"],
                    "layoutVariant": rw["layoutVariant"],
                    "cardPosition": rw.get("cardPosition", 2),
                    "cardContextNote": rw["cardContextNote"],
                    "blocks": rw["blocks"],
                    "faqs": rw["faqs"],
                }
                merged.append(updated_art)
            else:
                merged.append(orig)

        with open(ARTICLES_PATH, "w", encoding="utf-8") as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
        print(f"Merged {len(rewritten_by_slug)} rewritten articles into {ARTICLES_PATH}.")


if __name__ == "__main__":
    main()
