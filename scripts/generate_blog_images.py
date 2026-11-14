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
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from PIL import Image, ImageOps

BASE_DIR = Path("/Users/charlie/Documents/Google Antigravity/fuxion.site")
KEYWORD_MAP_PATH = BASE_DIR / "src" / "data" / "keyword_map.json"
ARTICLES_PATH = BASE_DIR / "src" / "data" / "articles.json"
OUT_IMG_DIR = BASE_DIR / "public" / "img" / "blog"
RAW_DEFAULT_DIR = Path("/tmp/blog_images_raw")
MODELS_TO_TRY = ["gpt-image-1.5", "gpt-image-1-mini", "gpt-image-2"]


def save_as_webp(src_path: Path, dst_path: Path, quality: int = 82) -> int:
    dst_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src_path) as im:
        rgb = ImageOps.exif_transpose(im).convert("RGB")
        fitted = ImageOps.fit(rgb, (1200, 675), method=Image.Resampling.LANCZOS)
        fitted.save(dst_path, format="WEBP", quality=quality, method=6)
    return dst_path.stat().st_size


def generate_with_openai(prompt: str, out_raw: Path, api_key: str) -> None:
    last_err = None
    for attempt in range(5):
        for model in MODELS_TO_TRY:
            payload = json.dumps({
                "model": model,
                "prompt": prompt,
                "size": "1536x1024",
                "quality": "medium",
                "output_format": "webp",
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
            try:
                with urllib.request.urlopen(req, timeout=120) as resp:
                    data = json.loads(resp.read().decode("utf-8"))
                item = data["data"][0]
                if item.get("b64_json"):
                    raw_bytes = base64.b64decode(item["b64_json"])
                elif item.get("url"):
                    with urllib.request.urlopen(item["url"], timeout=60) as dl:
                        raw_bytes = dl.read()
                else:
                    raise RuntimeError(f"No b64_json or url from {model}")
                out_raw.parent.mkdir(parents=True, exist_ok=True)
                out_raw.write_bytes(raw_bytes)
                return
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8", errors="ignore")
                last_err = f"{model} HTTP {e.code}: {body[:200]}"
                if e.code == 429:
                    time.sleep(3 * (attempt + 1))
                    break
            except Exception as e:
                last_err = f"{model} error: {e}"
        time.sleep(2 * (attempt + 1))
    raise RuntimeError(f"Failed after retries: {last_err}")


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
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()

    kw_map = json.loads(KEYWORD_MAP_PATH.read_text(encoding="utf-8"))
    kw_by_slug = {item["slug"]: item for item in kw_map}
    OUT_IMG_DIR.mkdir(parents=True, exist_ok=True)

    if args.provider == "sync-only":
        synced = sync_articles_images(kw_by_slug)
        print(f"Synced heroImage onto {synced} articles.", flush=True)
        return

    raw_dir = Path(args.raw_dir)
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        for env_file in (BASE_DIR / ".env.local", BASE_DIR / ".env"):
            if env_file.exists():
                for line in env_file.read_text(encoding="utf-8", errors="ignore").splitlines():
                    line = line.strip()
                    if line.startswith("OPENAI_API_KEY="):
                        api_key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
            if api_key:
                break
    if args.provider == "openai" and not api_key:
        raise SystemExit("OPENAI_API_KEY env var is required for --provider openai")

    slice_items = kw_map[args.offset : args.offset + args.limit]
    processed = 0
    skipped = 0
    failed = 0

    if args.provider == "raw":
        for idx, item in enumerate(slice_items, 1):
            slug = item["slug"]
            dst_webp = OUT_IMG_DIR / f"{slug}.webp"
            if dst_webp.exists():
                skipped += 1
                continue
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
            print(f"[{idx}/{len(slice_items)}] Converted {slug}.webp ({size // 1024} KB)", flush=True)
    elif args.provider == "openai":
        todo = []
        for idx, item in enumerate(slice_items, 1):
            slug = item["slug"]
            dst_webp = OUT_IMG_DIR / f"{slug}.webp"
            if dst_webp.exists():
                skipped += 1
            else:
                todo.append((idx, item, dst_webp))

        print(f"Starting OpenAI generation: {len(todo)} pending, {skipped} already exist (workers={args.workers})", flush=True)

        def worker(task):
            idx, item, dst_webp = task
            slug = item["slug"]
            tmp_raw = raw_dir / f"{slug}.webp"
            if not tmp_raw.exists():
                generate_with_openai(item["imagePrompt"], tmp_raw, api_key)
            size = save_as_webp(tmp_raw, dst_webp)
            return idx, slug, size

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(worker, t): t for t in todo}
            for fut in as_completed(futures):
                idx, item, _ = futures[fut]
                try:
                    _, slug, size = fut.result()
                    processed += 1
                    print(f"[{processed + skipped}/{len(slice_items)}] Generated {slug}.webp ({size // 1024} KB)", flush=True)
                    if processed % 25 == 0:
                        s = sync_articles_images(kw_by_slug)
                        print(f"  -> Checkpoint: synced {s} articles in articles.json", flush=True)
                except Exception as err:
                    failed += 1
                    print(f"[ERROR #{idx} {item['slug']}] {err}", flush=True)

    synced = sync_articles_images(kw_by_slug)
    print(f"Done. Processed={processed}, SkippedExisting={skipped}, Failed={failed}, SyncedArticles={synced}", flush=True)


if __name__ == "__main__":
    main()
