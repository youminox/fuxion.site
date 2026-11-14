#!/usr/bin/env python3
"""
Resumable blog image pipeline for fuxion.site.
Supports:
  1. Importing pre-generated PNG/JPG files from --raw-dir (/tmp/blog_images_raw/{slug}.{png,jpg,jpeg,webp})
  2. Calling OpenAI gpt-image-1 when OPENAI_API_KEY is exported (--provider openai)
  3. Converting to 1200x675 landscape WebP (~60-110 KB) in public/img/blog/{slug}.webp
  4. Syncing heroImage + heroAlt onto matching entries in src/data/articles.json
"""
import argparse
import base64
import json
import os
import urllib.request
from pathlib import Path
from PIL import Image, ImageOps

BASE_DIR = Path("/Users/charlie/Documents/Google Antigravity/fuxion.site")
KEYWORD_MAP_PATH = BASE_DIR / "src" / "data" / "keyword_map.json"
ARTICLES_PATH = BASE_DIR / "src" / "data" / "articles.json"
OUT_IMG_DIR = BASE_DIR / "public" / "img" / "blog"
RAW_DEFAULT_DIR = Path("/tmp/blog_images_raw")


def save_as_webp(src_path: Path, dst_path: Path, quality: int = 82) -> int:
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src_path) as im:
        rgb = ImageOps.exif_transpose(im).convert("RGB")
        fitted = ImageOps.fit(rgb, (1200, 675), method=Image.Resampling.LANCZOS)
        fitted.save(dst_path, format="WEBP", quality=quality, method=6)
    return dst_path.stat().st_size


def generate_with_openai(prompt: str, out_png: Path, api_key: str) -> None:
    payload = json.dumps({
        "model": "gpt-image-1",
        "prompt": prompt,
        "size": "1536x1024",
        "quality": "medium",
        "n": 1,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    b64 = data["data"][0]["b64_json"]
    out_png.parent.mkdir(parents=True, exist_ok=True)
    out_png.write_bytes(base64.b64decode(b64))


def sync_articles_images(kw_by_slug: dict) -> int:
    articles = json.loads(ARTICLES_PATH.read_text(encoding="utf-8"))
    updated = 0
    for art in articles:
        slug = art["slug"]
        webp_file = OUT_IMG_DIR / f"{slug}.webp"
        if webp_file.exists():
            expected_url = f"/img/blog/{slug}.webp"
            expected_alt = (kw_by_slug.get(slug, {}).get("heroAlt") or art.get("heroAlt") or art["title"])
            if art.get("heroImage") != expected_url or art.get("heroAlt") != expected_alt:
                art["heroImage"] = expected_url
                art["heroAlt"] = expected_alt
                updated += 1
    if updated > 0:
        ARTICLES_PATH.write_text(json.dumps(articles, ensure_ascii=False, indent=2), encoding="utf-8")
    return updated


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--provider", choices=["raw", "openai", "sync-only"], default="raw")
    parser.add_argument("--raw-dir", default=str(RAW_DEFAULT_DIR))
    parser.add_argument("--limit", type=int, default=500)
    parser.add_argument("--offset", type=int, default=0)
    args = parser.parse_args()

    kw_map = json.loads(KEYWORD_MAP_PATH.read_text(encoding="utf-8"))
    kw_by_slug = {item["slug"]: item for item in kw_map}
    OUT_IMG_DIR.mkdir(parents=True, exist_ok=True)

    if args.provider == "sync-only":
        synced = sync_articles_images(kw_by_slug)
        print(f"Synced heroImage onto {synced} articles.")
        return

    raw_dir = Path(args.raw_dir)
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if args.provider == "openai" and not api_key:
        raise SystemExit("OPENAI_API_KEY env var is required for --provider openai")

    slice_items = kw_map[args.offset : args.offset + args.limit]
    processed = 0
    skipped = 0

    for idx, item in enumerate(slice_items, 1):
        slug = item["slug"]
        dst_webp = OUT_IMG_DIR / f"{slug}.webp"
        if dst_webp.exists():
            skipped += 1
            continue

        if args.provider == "raw":
            found = None
            for ext in (".png", ".jpg", ".jpeg", ".webp"):
                cand = raw_dir / f"{slug}{ext}"
                if cand.exists():
                    found = cand
                    break
            if not found:
                continue
            size = save_as_webp(found, dst_webp)
            processed += 1
            print(f"[{idx}/{len(slice_items)}] Converted {slug}.webp ({size // 1024} KB)")
        elif args.provider == "openai":
            tmp_png = raw_dir / f"{slug}.png"
            if not tmp_png.exists():
                generate_with_openai(item["imagePrompt"], tmp_png, api_key)
            size = save_as_webp(tmp_png, dst_webp)
            processed += 1
            print(f"[{idx}/{len(slice_items)}] Generated & converted {slug}.webp ({size // 1024} KB)")

    synced = sync_articles_images(kw_by_slug)
    print(f"Done. Processed={processed}, SkippedExisting={skipped}, SyncedArticles={synced}")


if __name__ == "__main__":
    main()
