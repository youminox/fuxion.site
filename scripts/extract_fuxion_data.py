#!/usr/bin/env python3
"""
Extract all 72 FuXion Peru SKUs from shop.WordPress.2026-11-10.xml and https://shop.site.fuxion.com/,
download official theme assets into public/img/, and build rich structured JSON data in src/data/.
"""
import concurrent.futures
import json
import os
import re
import urllib.request
import xml.etree.ElementTree as ET

BASE_DIR = "/Users/charlie/Documents/Google Antigravity/fuxion.site"
XML_PATH = os.path.join(BASE_DIR, "shop.WordPress.2026-11-10.xml")
DATA_DIR = os.path.join(BASE_DIR, "src", "data")
PUBLIC_IMG_DIR = os.path.join(BASE_DIR, "public", "img")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_IMG_DIR, exist_ok=True)

HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}

def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read().decode("utf-8", errors="ignore")

def download_file(url: str, dest: str) -> bool:
    if os.path.exists(dest) and os.path.getsize(dest) > 100:
        return True
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
            if data:
                with open(dest, "wb") as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f"  [WARN] Could not download {url}: {e}")
    return False

def main():
    print("1. Parsing shop.WordPress.2026-11-10.xml...")
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    ns = {
        "content": "http://purl.org/rss/1.0/modules/content/",
        "wp": "http://wordpress.org/export/1.2/",
        "excerpt": "http://wordpress.org/export/1.2/excerpt/"
    }
    channel = root.find("channel")
    xml_meta_by_sku = {}
    for item in channel.findall("item"):
        if item.findtext("wp:post_type", namespaces=ns) == "product":
            metas = {
                m.findtext("wp:meta_key", namespaces=ns): m.findtext("wp:meta_value", namespaces=ns)
                for m in item.findall("wp:postmeta", namespaces=ns)
            }
            sku = metas.get("_sku") or item.findtext("wp:post_name", namespaces=ns)
            xml_meta_by_sku[sku] = {
                "title": item.findtext("title"),
                "link": item.findtext("link"),
                "price": float(metas.get("_price") or metas.get("_regular_price") or 0),
                "empaque": metas.get("_fu_empaque") or "",
                "puntos": int(metas.get("_fu_puntos") or 0),
                "extra_image_url": metas.get("_fu_extra_image_url") or "",
                "stock_status": metas.get("_stock_status") or "instock",
            }
    print(f"   Found {len(xml_meta_by_sku)} products in XML.")

    print("2. Fetching https://shop.site.fuxion.com/tienda/ ...")
    tienda_html = fetch_text("https://shop.site.fuxion.com/tienda/")
    m_prods = re.search(r"window\.FX_PRODUCTS=(\[.*?\]);", tienda_html, re.S)
    m_store = re.search(r"window\.FX_STORE=(\{.*?\});", tienda_html, re.S)
    fx_products = json.loads(m_prods.group(1)) if m_prods else []
    fx_store = json.loads(m_store.group(1)) if m_store else {}
    print(f"   Found {len(fx_products)} products in FX_PRODUCTS.")

    def fetch_sku_detail(p):
        sku = str(p["sku"])
        # Fetch from /producto/{sku}/ (or p['url'])
        target_url = f"https://shop.site.fuxion.com/producto/{sku}/"
        try:
            html = fetch_text(target_url)
            m = re.search(r"window\.FX_PRODUCT=(\{.*?\});", html, re.S)
            fx_prod = json.loads(m.group(1)) if m else {}
            # Also extract H1/H2/hero if it's a landing page
            h1_match = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.S)
            h1_text = re.sub(r"<[^>]+>", "", h1_match.group(1)).strip() if h1_match else ""
            return sku, fx_prod, h1_text
        except Exception as e:
            print(f"  [ERROR] SKU {sku}: {e}")
            return sku, {}, ""

    print("3. Fetching detailed FX_PRODUCT data for all 72 SKUs in parallel...")
    sku_details = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=12) as ex:
        futures = [ex.submit(fetch_sku_detail, p) for p in fx_products]
        for fut in concurrent.futures.as_completed(futures):
            sku, detail, h1_text = fut.result()
            sku_details[sku] = (detail, h1_text)

    print(f"   Successfully fetched details for {len(sku_details)} SKUs.")

    # Save raw combined data first so we can inspect and enrich it
    raw_combined = []
    for p in fx_products:
        sku = str(p["sku"])
        detail, h1_text = sku_details.get(sku, ({}, ""))
        xml_m = xml_meta_by_sku.get(sku, {})
        combined = {
            "sku": sku,
            "name": p.get("name") or detail.get("name") or xml_m.get("title") or "",
            "price": p.get("price") or detail.get("price") or xml_m.get("price") or 0,
            "formatted": p.get("formatted") or detail.get("formatted") or f"S/ {p.get('price', 0):.2f}",
            "pack": p.get("pack") or detail.get("pack") or xml_m.get("empaque") or "",
            "points": fx_store.get("points", {}).get(sku, xml_m.get("puntos", 0)),
            "in_stock": p.get("in_stock", True),
            "shop_url": p.get("url") or f"https://shop.site.fuxion.com/producto/{sku}/",
            "direct_product_url": f"https://shop.site.fuxion.com/producto/{sku}/",
            "is_landing": not (p.get("url") or "").startswith("https://shop.site.fuxion.com/producto/"),
            "short": detail.get("short") or p.get("desc") or "",
            "tabs": detail.get("tabs") or {},
            "sticks": detail.get("sticks") or 0,
            "per_stick_formatted": detail.get("per_stick_formatted") or "",
            "gallery": detail.get("gallery") or p.get("img") or [],
            "video": detail.get("video") or detail.get("tabs", {}).get("video") or "",
            "h1_landing": h1_text,
        }
        raw_combined.append(combined)

    raw_path = os.path.join(DATA_DIR, "raw_skus.json")
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(raw_combined, f, ensure_ascii=False, indent=2)
    print(f"4. Saved {len(raw_combined)} raw SKUs to {raw_path}")

    # Download theme assets from shop.site.fuxion.com
    theme_assets = [
        "logo-fuxion-azul.webp",
        "logo-fuxion-blanco.webp",
        "somos-fusion-nutraceutica.webp",
        "sello-calidad-garantizada.webp",
        "x-fuxion-contorno.webp",
        "tarjeta-visa.webp",
        "tarjeta-mastercard.webp",
        "tarjeta-amex.webp",
        "tarjeta-diners.webp",
        "sellos/sellos-clean-label.webp",
        # 10 flagship bodegones, heroes, empaques
        "prunex1-bodegon.webp",
        "prunex1-hero.webp",
        "prunex1-empaque.webp",
        "vita-xtra-t-bodegon.webp",
        "vita-xtra-t-hero.webp",
        "vita-xtra-t-empaque.webp",
        "thermo-t3-bodegon.webp",
        "thermo-t3-hero.webp",
        "thermo-t3-empaque.webp",
        "no-stress-bodegon.webp",
        "no-stress-hero.webp",
        "no-stress-empaque.webp",
        "youth-elixir-bodegon.webp",
        "youth-elixir-hero.webp",
        "youth-elixir-empaque.webp",
        "beauty-in-bodegon.webp",
        "beauty-in-hero.webp",
        "beauty-in-empaque.webp",
        "nocarb-t-bodegon.webp",
        "nocarb-t-hero.webp",
        "nocarb-t-empaque.webp",
        "biopro-sport-bodegon.webp",
        "biopro-sport-hero.webp",
        "biopro-sport-empaque.webp",
        "biopro-tect-bodegon.webp",
        "biopro-tect-hero.webp",
        "biopro-tect-empaque.webp",
        "biopro-fit-bodegon.webp",
        "biopro-fit-hero.webp",
        "biopro-fit-empaque.webp",
    ]
    print("5. Downloading official theme images...")
    for asset in theme_assets:
        url = f"https://shop.site.fuxion.com/wp-content/themes/fuxion-theme/assets/img/{asset}"
        dest = os.path.join(PUBLIC_IMG_DIR, asset)
        download_file(url, dest)
    print("Done!")

if __name__ == "__main__":
    main()
