#!/usr/bin/env python3
"""
Builds the unified 6-country catalog for fuxion.site:
- src/data/countries.json (metadata for PE, CO, US, MX, EC, GT)
- src/data/products.json (canonical products enriched with countryOffers for all 6 countries + new products/combos)
- src/data/country_catalog.json (complete 283-SKU directory across all 6 countries)
- supabase/functions/fuxion-chat/catalog.ts (multi-country catalog & prompts for the AI Advisor)
"""

import json
import os
import re

BASE_DIR = "/Users/charlie/Documents/Google Antigravity/fuxion.site"
OUT_DIR = "/Users/charlie/.gemini/antigravity/brain/b807e317-3a87-4409-a43e-979c6a3d7ae6/browser_sandbox/outputs"

COUNTRIES = [
    {
        "code": "pe",
        "iso": "PE",
        "locale": "es-PE",
        "name": "Perú",
        "shortName": "Perú",
        "flag": "🇵🇪",
        "currencyCode": "PEN",
        "currencySymbol": "S/",
        "currencyName": "Soles",
        "currencyLabel": "Soles (PEN)",
        "taxLabel": "IGV Incluido",
        "shopHomeUrl": "https://carlos-lingan.site.fuxion.com/pe/",
        "shopTiendaUrl": "https://carlos-lingan.site.fuxion.com/pe/tienda/",
        "checkoutUrl": "https://carlos-lingan.site.fuxion.com/pe/checkout/",
        "shippingRegions": "Lima y todas las provincias del Perú",
        "shippingBadge": "Envíos a Lima y todo el Perú",
        "deliveryEstimate": "24 a 48h en Lima y 2 a 4 días hábiles en provincias",
        "entityName": "FuXion Biotech SAC — Perú"
    },
    {
        "code": "co",
        "iso": "CO",
        "locale": "es-CO",
        "name": "Colombia",
        "shortName": "Colombia",
        "flag": "🇨🇴",
        "currencyCode": "COP",
        "currencySymbol": "$",
        "currencyName": "Pesos Colombianos",
        "currencyLabel": "Pesos Colombianos (COP)",
        "taxLabel": "IVA Incluido",
        "shopHomeUrl": "https://carlos-lingan.site.fuxion.com/co/",
        "shopTiendaUrl": "https://carlos-lingan.site.fuxion.com/co/tienda/",
        "checkoutUrl": "https://carlos-lingan.site.fuxion.com/co/checkout/",
        "shippingRegions": "Bogotá, Medellín, Cali, Barranquilla y toda Colombia",
        "shippingBadge": "Envíos a Bogotá y toda Colombia",
        "deliveryEstimate": "2 a 5 días hábiles en toda Colombia",
        "entityName": "FuXion Biotech — Colombia"
    },
    {
        "code": "us",
        "iso": "US",
        "locale": "es-US",
        "name": "Estados Unidos",
        "shortName": "EE. UU.",
        "flag": "🇺🇸",
        "currencyCode": "USD",
        "currencySymbol": "$",
        "currencyName": "Dólares",
        "currencyLabel": "Dólares (USD)",
        "taxLabel": "Precio Oficial USD",
        "shopHomeUrl": "https://carlos-lingan.site.fuxion.com/us/",
        "shopTiendaUrl": "https://carlos-lingan.site.fuxion.com/us/tienda/",
        "checkoutUrl": "https://carlos-lingan.site.fuxion.com/us/checkout/",
        "shippingRegions": "los 50 estados de EE. UU. y Puerto Rico",
        "shippingBadge": "Envíos a todo Estados Unidos y PR",
        "deliveryEstimate": "3 a 5 días hábiles en EE. UU.",
        "entityName": "FuXion Biotech — USA"
    },
    {
        "code": "mx",
        "iso": "MX",
        "locale": "es-MX",
        "name": "México",
        "shortName": "México",
        "flag": "🇲🇽",
        "currencyCode": "MXN",
        "currencySymbol": "$",
        "currencyName": "Pesos Mexicanos",
        "currencyLabel": "Pesos Mexicanos (MXN)",
        "taxLabel": "IVA Incluido",
        "shopHomeUrl": "https://carlos-lingan.site.fuxion.com/mx/",
        "shopTiendaUrl": "https://carlos-lingan.site.fuxion.com/mx/tienda/",
        "checkoutUrl": "https://carlos-lingan.site.fuxion.com/mx/checkout/",
        "shippingRegions": "CDMX, Guadalajara, Monterrey y toda la República Mexicana",
        "shippingBadge": "Envíos a CDMX y todo México",
        "deliveryEstimate": "2 a 5 días hábiles en todo México",
        "entityName": "FuXion Biotech — México"
    },
    {
        "code": "ec",
        "iso": "EC",
        "locale": "es-EC",
        "name": "Ecuador",
        "shortName": "Ecuador",
        "flag": "🇪🇨",
        "currencyCode": "USD",
        "currencySymbol": "$",
        "currencyName": "Dólares",
        "currencyLabel": "Dólares (USD)",
        "taxLabel": "IVA Incluido",
        "shopHomeUrl": "https://carlos-lingan.site.fuxion.com/ec/",
        "shopTiendaUrl": "https://carlos-lingan.site.fuxion.com/ec/tienda/",
        "checkoutUrl": "https://carlos-lingan.site.fuxion.com/ec/checkout/",
        "shippingRegions": "Quito, Guayaquil, Cuenca y todo el Ecuador",
        "shippingBadge": "Envíos a Quito, Guayaquil y todo Ecuador",
        "deliveryEstimate": "24 a 72 horas hábiles en Ecuador",
        "entityName": "FuXion Biotech — Ecuador"
    },
    {
        "code": "gt",
        "iso": "GT",
        "locale": "es-GT",
        "name": "Guatemala",
        "shortName": "Guatemala",
        "flag": "🇬🇹",
        "currencyCode": "GTQ",
        "currencySymbol": "Q",
        "currencyName": "Quetzales",
        "currencyLabel": "Quetzales (GTQ)",
        "taxLabel": "Impuestos Incluidos",
        "shopHomeUrl": "https://carlos-lingan.site.fuxion.com/gt/",
        "shopTiendaUrl": "https://carlos-lingan.site.fuxion.com/gt/tienda/",
        "checkoutUrl": "https://carlos-lingan.site.fuxion.com/gt/checkout/",
        "shippingRegions": "Ciudad de Guatemala y todos los departamentos",
        "shippingBadge": "Envíos a toda Guatemala",
        "deliveryEstimate": "2 a 4 días hábiles en Guatemala",
        "entityName": "FuXion Biotech — Guatemala"
    }
]

COUNTRY_MAP = {c["code"]: c for c in COUNTRIES}

def format_price(country_code: str, val: float) -> str:
    if country_code == "pe":
        return f"S/ {val:,.2f}"
    elif country_code == "co":
        # Colombian format: $ 138.100
        rounded = int(round(val))
        s = f"{rounded:,}".replace(",", ".")
        return f"$ {s}"
    elif country_code in ("us", "ec"):
        return f"$ {val:,.2f}"
    elif country_code == "mx":
        return f"$ {val:,.2f}"
    elif country_code == "gt":
        return f"Q {val:,.2f}"
    return f"{val:.2f}"

def parse_sticks(pack_str: str) -> int:
    if not pack_str:
        return 0
    m = re.search(r"\b(28|30|20|14|7)\b", pack_str)
    if m:
        return int(m.group(1))
    return 0

def load_raw_country_items():
    with open(f"{OUT_DIR}/step_12.json") as f: s12 = json.load(f)["value"]["items"]
    with open(f"{OUT_DIR}/step_17.json") as f: s17 = json.load(f)["value"]["visibleCards"]
    with open(f"{OUT_DIR}/step_19.json") as f: s19 = json.load(f)["value"]["collected"]
    with open(f"{OUT_DIR}/step_27.json") as f: co_raw = json.load(f)["value"]["collected"]
    with open(f"{OUT_DIR}/step_31.json") as f: us_raw = json.load(f)["value"]["collected"]
    with open(f"{OUT_DIR}/step_35.json") as f: mx_raw = json.load(f)["value"]["collected"]
    with open(f"{OUT_DIR}/step_39.json") as f: ec_raw = json.load(f)["value"]["collected"]
    with open(f"{OUT_DIR}/step_50.json") as f: gt_raw = json.load(f)["value"]["collected"]

    pe = []
    for x in s12[:9]:
        pe.append({
            "name": x["name"].strip(),
            "url": x["href"].strip(),
            "price": round(float(x["price"]), 2),
            "formattedPrice": format_price("pe", float(x["price"])),
            "pack": (x["pack"] or "").strip(),
            "sku": x["sku"].strip(),
            "inStock": True
        })
    for x in s17:
        pe.append({
            "name": x["name"].strip(),
            "url": x["href"].strip(),
            "price": round(float(x["price"]), 2),
            "formattedPrice": format_price("pe", float(x["price"])),
            "pack": (x["pack"] or "").strip(),
            "sku": x["sku"].strip(),
            "inStock": True
        })
    for x in s19:
        pe.append({
            "name": x["n"].strip(),
            "url": "https://carlos-lingan.site.fuxion.com" + x["u"].strip(),
            "price": round(float(x["pr"]), 2),
            "formattedPrice": x["pd"].strip() if x.get("pd") else format_price("pe", float(x["pr"])),
            "pack": (x["pk"] or "").strip(),
            "sku": x["sku"].strip(),
            "inStock": True
        })

    def norm_list(cc, arr, is_gt=False):
        out = []
        for x in arr:
            u = x["u"].strip()
            if not u.startswith("http"):
                u = "https://carlos-lingan.site.fuxion.com" + u
            pr = float(x["pr"])
            if cc == "co":
                pr = float(int(round(pr)))
            else:
                pr = round(pr, 2)
            pk = (x.get("pk") or "").strip()
            in_stock = True
            if is_gt:
                txt = x.get("txt", "")
                in_stock = "Sin stock" not in txt
                # parse pack from txt in GT
                lines = [ln.strip() for ln in txt.splitlines() if ln.strip() and ln.strip() != "Sin stock"]
                # find line with Q price
                for ln in lines:
                    if ln.startswith("Q"):
                        # e.g. "Q 375.00CAJA 28 x 5 gr"
                        m = re.match(r"^Q\s*[\d,]+\.\d{2}(.*)$", ln)
                        if m:
                            pk = m.group(1).strip()
            pd = (x.get("pd") or "").strip() or format_price(cc, pr)
            out.append({
                "name": x["n"].strip(),
                "url": u,
                "price": pr,
                "formattedPrice": pd,
                "pack": pk,
                "sku": x["sku"].strip(),
                "inStock": in_stock
            })
        return out

    return {
        "pe": pe,
        "co": norm_list("co", co_raw),
        "us": norm_list("us", us_raw),
        "mx": norm_list("mx", mx_raw),
        "ec": norm_list("ec", ec_raw),
        "gt": norm_list("gt", gt_raw, is_gt=True)
    }

# Map raw URL slug or item name to canonical fuxion.site product slug
SLUG_ALIASES = {
    # Flagships & localized equivalents
    "prunex1": "prunex1",
    "prunex1-144137": "prunex1",
    "prunex1-149138": "prunex1",
    "prunex1-149137": "prunex1",
    "guindon-x": "prunex1",
    "prunex": "prunex1",

    "vita-xtra-t": "vita-xtra-t",
    "vita-xtra-t-144133": "vita-xtra-t",
    "vita-xtr-t": "vita-xtra-t",

    "thermo-t3": "thermo-t3",
    "thermo-t3-144136": "thermo-t3",
    "t-t3": "thermo-t3",
    "t-t3-149135": "thermo-t3",
    "t3": "thermo-t3",

    "no-stress": "no-stress",
    "no-stress-144135": "no-stress",
    "off": "no-stress",

    "youth-elixir": "youth-elixir",
    "hgh": "youth-elixir",
    "nectar-h": "youth-elixir",

    "beauty-in": "beauty-in",
    "cool-age": "beauty-in",
    "bell-in": "beauty-in",

    "nocarb-t": "nocarb-t",
    "nocarb-t-149134": "nocarb-t",

    "biopro-sport": "biopro-sport",
    "biopro-sport-141502": "biopro-sport",
    "biopro-sport-pro-edition": "biopro-sport",

    "biopro-tect": "biopro-tect",
    "biopro-tect-141503": "biopro-tect",
    "biopro": "biopro-tect",

    "biopro-fit": "biopro-fit",

    # Cleanse & Detox
    "flora-liv": "flora-liv",
    "flora-liv-149132": "flora-liv",
    "liquid-fiber": "liquid-fiber",
    "alpha-balance": "alpha-balance",
    "alpha-bal": "alpha-balance",
    "berry-balance": "berry-balance",
    "cran-bal": "berry-balance",
    "rexet": "rexet",
    "rexet-145993": "rexet",
    "programa-detox-5-dias": "programa-detox-5-dias",
    "probix": "probix",
    "probix-postbiotic-supplement": "probix",

    # Regeneration & Nutrition
    "protein-active-chocolate-con-avellanas": "protein-active-chocolate-avellanas",
    "protein-active-chocolate-hazelnut": "protein-active-chocolate-avellanas",
    "protein-active-vainilla-y-canela": "protein-active-vainilla-canela",
    "protein-active-vanilla-canela": "protein-active-vainilla-canela",
    "nutraday": "nutraday",

    # Energy & Vitality
    "vitaenergia": "vitaenergia",
    "vita-xtra-t-peruvian-mojito": "vita-xtra-t-mojito",
    "vita-xtra-t-tinto-verano": "vita-xtra-t-verano",
    "xpeed": "xpeed",
    "xpeed-citrus-power": "xpeed-citrus-power",
    "matcha-pep-t": "matcha-pep-t",

    # Immune
    "vera": "vera-plus",
    "vera-149136": "vera-plus",
    "gano-t": "gano-plus-t",
    "gano-t-146264": "gano-plus-t",
    "gano-cappuccino": "gano-plus-cappuccino",
    "ganomas-cappuccino": "gano-plus-cappuccino",
    "cafe-ganomax": "cafe-ganomax",

    # Weight Control
    "protein-active-fit-chocolate-con-avellanas": "protein-active-fit-chocolate-avellanas",
    "protein-active-fit-chocolate-hazelnut": "protein-active-fit-chocolate-avellanas",
    "protein-active-fit-vainilla-y-canela": "protein-active-fit-vainilla-canela",
    "protein-active-fit-vanilla-canela": "protein-active-fit-vainilla-canela",
    "cafe-cafe-fit": "cafe-y-cafe-fit",
    "cafe-cafe-fit-151503": "cafe-y-cafe-fit",
    "cafe-cafe-fit-cappuccino": "cafe-y-cafe-fit-cappuccino",
    "chocolate-fit": "chocolate-fit",
    "protein-xoup-crema-criolla": "protein-xoup-crema-criolla",
    "protein-xoup-crema-de-brocoli-parmesano": "protein-xoup-brocoli-parmesano",
    "protein-xoup-crema-de-esparragos-y-alcachofa": "protein-xoup-esparragos-alcachofa",
    "pack-5-14-active-mito": "pack-5-14-active-mito",
    "pack-5-14-keto": "pack-5-14-keto",
    "combo-ponte-en-forma": "combo-ponte-en-forma",
    "smart": "limitlex-snack-recharge",

    # Anti-Age & Beauty
    "golden-flx": "golden-flx",
    "gol-flx": "golden-flx",
    "probal": "probal",
    "probal-143068": "probal",
    "passion": "passion",
    "passion-143067": "passion",
    "zoom-in": "zoom-in",

    # Mental Vigor
    "on": "on",
    "on-144134": "on",
    "on-149133": "on",
    "iq": "iq-plus",
    "rezzt": "rezzt-plus",

    # Sport
    "protein-active-sport-chocolate-con-avellanas": "protein-active-sport-chocolate-avellanas",
    "protein-active-sport-chocolate-hazelnut": "protein-active-sport-chocolate-avellanas",
    "protein-active-sport-vainilla-y-canela": "protein-active-sport-vainilla-canela",
    "protein-active-sport-vainilla-canela": "protein-active-sport-vainilla-canela",
    "protein-active-sport-vanilla-canela": "protein-active-sport-vainilla-canela",
    "pre-sport": "pre-sport",
    "presprt": "pre-sport",
    "pre-sport-pro-edition": "pre-sport",
    "post-sport": "post-sport",
    "post-sport-pro-edition": "post-sport",
    "xtra-mile": "xtra-mile",
    "xtra-mile-pro-edition": "xtra-mile",
    "xtra-milla-pro-edition": "xtra-mile",

    # Gastronomy & Shakers
    "base-madre-verde": "base-madre-verde",
    "base-culinaria-verde": "base-madre-verde",
    "base-madre-amarilla": "base-madre-amarilla",
    "base-culinaria-amarilla": "base-madre-amarilla",
    "base-madre-roja": "base-madre-roja",
    "base-culinaria-roja": "base-madre-roja",
    "tomatodo-azul": "tomatodo-azul",
    "shaker-22-oz": "tomatodo-azul",
    "tomatodo-fuxion-shaker-mx": "tomatodo-azul",
    "tomatodo-beauty-in-c-shaker": "tomatodo-beauty-in-shaker",
    "tomatodo-sport-pro-edition": "tomatodo-sport-pro-edition",

    # New shared & multi-country packs / promos / combos
    "3-bases-culinarias": "3-bases-culinarias",
    "3-bases-culinarias-1-nocarbt": "3-bases-culinarias-1-nocarbt",
    "3-bases-culinarias-1-thermot3": "3-bases-culinarias-1-thermot3",
    "3-bases-culinarias-1-tt3": "3-bases-culinarias-1-thermot3",
    "1-presport-1-post-sport-1-bolsa-de-regalo": "pack-presport-postsport",
    "zoom-in-spray": "zoom-in-spray",
    "pack-5-14": "pack-5-14-cl",
    "pack-5-14-cl": "pack-5-14-cl",
    "10-14-pack": "pack-10-14",
    "promo-hoy-quiero-engreirte": "promo-hoy-quiero-engreirte",
    "promo-quiero-verte-brillar": "promo-quiero-verte-brillar",
    "promo-quiero-verte-en-tu-mejor-version": "promo-quiero-verte-en-tu-mejor-version",
    "promo-quiero-verte-saludable-y-en-forma": "promo-quiero-verte-saludable-y-en-forma",
    "mx-fv-1-flora-1-golden": "promo-flora-liv-golden-flx",
    "combo-defensa-natural": "combo-defensa-natural",
    "combo-detox": "combo-detox",
    "combo-full-power": "combo-full-power",
    "combo-nutricion-celular": "combo-nutricion-celular",
    "combo-siempre-joven": "combo-siempre-joven",
    "como-siempre-joven": "combo-siempre-joven",
    "combo-sport": "combo-sport",
    "combo-vigor": "combo-vigor",
    "combo-antiedad-1": "combo-antiedad-1",
    "combo-antiedad-2": "combo-antiedad-2",
    "combo-antiedad-3": "combo-antiedad-3",
    "combo-antiedad-4": "combo-antiedad-4",
    "combo-control-de-peso-1": "combo-control-de-peso-1",
    "combo-control-de-peso-2": "combo-control-de-peso-2",
    "combo-control-de-peso-4": "combo-control-de-peso-4",
    "combo-estilo-de-vida-1": "combo-estilo-de-vida-1",
    "combo-estilo-de-vida-2": "combo-estilo-de-vida-2",
    "combo-estilo-de-vida-3": "combo-estilo-de-vida-3",
}

# Metadata for the newly added canonical products (packs, promos, combos, new releases)
NEW_CANONICAL_PRODUCTS = {
    "3-bases-culinarias": {
        "cleanName": "Pack 3 Bases Culinarias (Verde, Amarilla y Roja)",
        "categorySlug": "gastronomia-y-accesorios",
        "badge": "Pack Gastronómico",
        "imageFrom": "base-madre-verde",
        "shortDescription": "Trío oficial de Bases Madre Culinarias 100% naturales (Verde, Amarilla y Roja) enriquecidas con nutrientes y libres de conservantes para cocinar saludable todos los días.",
        "description": "El Pack 3 Bases Culinarias de FuXion reúne las tres Bases Madre desarrolladas junto a chefs expertos (Verde, Amarilla y Roja) elaboradas con ingredientes 100% naturales deshidratados y micronutrientes bioactivos para preparar tus platos favoritos con sabor auténtico, etiqueta limpia (Clean Label) y sin glutamato ni químicos.",
        "benefits": [
            "Incluye las 3 Bases Madre: Verde, Amarilla y Roja.",
            "Sabor casero auténtico listo en minutos sin conservantes artificiales.",
            "Enriquecidas con hierro bioactivo, fibra prebiótica y antioxidantes naturales."
        ],
        "ingredients": ["Base Madre Verde", "Base Madre Amarilla", "Base Madre Roja", "Fibra Prebiótica", "Antioxidantes Naturales"],
        "preparation": "Agrega directamente durante la cocción de tus guisos, sopas, aderezos y salsas saludables.",
        "idealTime": "Usar en la preparación del almuerzo o cena familiar para elevar el valor nutricional de tus comidas.",
        "recommendedCombinations": ["base-madre-verde", "base-madre-amarilla", "base-madre-roja", "nocarb-t"]
    },
    "3-bases-culinarias-1-nocarbt": {
        "cleanName": "Pack 3 Bases Culinarias + 1 NoCarb-T",
        "categorySlug": "control-de-peso",
        "badge": "Pack Cocina + Glucosa",
        "imageFrom": "nocarb-t",
        "shortDescription": "Combinación inteligente de las 3 Bases Culinarias saludables + 1 NoCarb-T para cocinar limpio y modular la absorción de carbohidratos en tus comidas.",
        "description": "Pack promocional oficial que combina las 3 Bases Culinarias FuXion (Verde, Amarilla y Roja) con 1 caja/doypack de NoCarb-T, permitiéndote disfrutar tus platos tradicionales con ingredientes Clean Label mientras reduces la asimilación de carbohidratos y picos de glucosa después de comer.",
        "benefits": [
            "Cocina saludable con las 3 Bases Madre 100% naturales.",
            "Controla la absorción de azúcares y almidones con NoCarb-T.",
            "Ahorro especial frente a la compra individual."
        ],
        "ingredients": ["3 Bases Culinarias FuXion", "NoCarb-T (Fibras Solubles, Yacón, Canela, Cromo)"],
        "preparation": "Usa las Bases Culinarias al cocinar y toma 1 stick de NoCarb-T en agua tibia junto con el almuerzo o cena.",
        "idealTime": "Durante o inmediatamente después de tus comidas principales con carbohidratos.",
        "recommendedCombinations": ["nocarb-t", "thermo-t3", "3-bases-culinarias", "prunex1"]
    },
    "3-bases-culinarias-1-thermot3": {
        "cleanName": "Pack 3 Bases Culinarias + 1 Thermo T3",
        "categorySlug": "control-de-peso",
        "badge": "Pack Cocina + Termogénico",
        "imageFrom": "thermo-t3",
        "shortDescription": "Pack especial que une las 3 Bases Culinarias FuXion + 1 Thermo T3 (T T3) para disfrutar comidas deliciosas mientras activas la oxidación de grasas.",
        "description": "Este pack oficial integra el trío de Bases Culinarias FuXion con el té termogénico Thermo T3 (T T3), brindándote una solución completa para cocinar rico sin aditivos artificiales y potenciar tu metabolismo energético después de cada comida.",
        "benefits": [
            "Gastronomía limpia y nutritiva en casa.",
            "Activa la termogénesis y oxidación de grasas con Thermo T3.",
            "Precio promocional de temporada en tienda oficial."
        ],
        "ingredients": ["3 Bases Culinarias FuXion", "Thermo T3 (Té Rojo, Té Verde, Té Negro, L-Carnitina, Cetonas de Frambuesa)"],
        "preparation": "Cocina tus platos con las Bases Madre y toma 1 stick de Thermo T3 en agua caliente después de comer o antes de entrenar.",
        "idealTime": "Después del almuerzo o cena como digestivo termogénico, o 20 minutos antes del ejercicio.",
        "recommendedCombinations": ["thermo-t3", "nocarb-t", "3-bases-culinarias", "biopro-fit"]
    },
    "pack-presport-postsport": {
        "cleanName": "Pack 1 Pre Sport + 1 Post Sport + Bolsa de Regalo",
        "categorySlug": "linea-sport",
        "badge": "Pack Sport Oficial",
        "imageFrom": "pre-sport",
        "shortDescription": "Dúo deportivo oficial Pre Sport + Post Sport con bolsa de regalo para máxima energía antes de entrenar y recuperación muscular acelerada.",
        "description": "Pack deportivo integral que incluye 1 Pre Sport (energía explosiva, óxido nítrico y electrolitos antes del ejercicio) + 1 Post Sport (L-glutamina, BCAA y recuperación de fibras musculares después de entrenar) junto con una bolsa oficial FuXion de regalo.",
        "benefits": [
            "Máximo rendimiento e hidratación antes del entrenamiento.",
            "Recuperación muscular rápida y menor fatiga post-entreno.",
            "Incluye bolsa oficial FuXion de regalo."
        ],
        "ingredients": ["Pre Sport (Citrulina, Beta-Alanina, Electrolitos)", "Post Sport (L-Glutamina, BCAA, Acerola, Granada)"],
        "preparation": "Disuelve Pre Sport 15 min antes de entrenar y Post Sport inmediatamente al terminar tu rutina.",
        "idealTime": "Antes y después de cada sesión de entrenamiento o competencia deportiva.",
        "recommendedCombinations": ["pre-sport", "post-sport", "biopro-sport", "xtra-mile"]
    },
    "zoom-in-spray": {
        "cleanName": "Zoom-In Spray (Absorción Sublingual)",
        "categorySlug": "antiedad-y-belleza",
        "badge": "Salud Visual Spray",
        "imageFrom": "zoom-in",
        "shortDescription": "Fórmula oftalmológica nutracéutica en práctico frasco spray de 19.6 ml con luteína, zeaxantina y astaxantina para proteger tu visión frente a pantallas.",
        "description": "Zoom-In Spray de FuXion ofrece carotenoides maculares concentrados (luteína, zeaxantina y astaxantina) y antioxidantes en formato spray oral de rápida absorción para filtrar la luz azul de celulares y computadoras, reduciendo la fatiga ocular y cuidando tu salud visual.",
        "benefits": [
            "Protege la retina y la mácula frente a la luz azul de pantallas.",
            "Disminuye el cansancio y la sequedad visual tras largas jornadas.",
            "Práctico formato en spray de bolsillo de rápida asimilación."
        ],
        "ingredients": ["Luteína", "Zeaxantina", "Astaxantina", "Antioxidantes Naturales"],
        "preparation": "Aplicar las atomizaciones recomendadas directamente en la cavidad oral.",
        "idealTime": "Por la mañana o antes de jornadas prolongadas frente a pantallas y dispositivos digitales.",
        "recommendedCombinations": ["zoom-in", "iq-plus", "on", "beauty-in"]
    },
    "pack-5-14-cl": {
        "cleanName": "Pack 5/14 Clean Label (Programa 14 Días)",
        "categorySlug": "control-de-peso",
        "badge": "Programa 14 Días",
        "imageFrom": "pack-5-14-active-mito",
        "shortDescription": "Programa nutricional integral de 14 días con 5 tomas diarias de bebidas nutracéuticas FuXion y plan de alimentación paso a paso para reducir peso y medidas.",
        "description": "El Pack 5/14 Clean Label de FuXion es el sistema científicamente estructurado para bajar hasta 5 kilos en 14 días comiendo 5 veces al día, combinando limpieza de colon, proteínas saciantes, termogénicos, bloqueadores de carbohidratos y revitalizantes.",
        "benefits": [
            "Incluye todas las bebidas FuXion para los 14 días del programa.",
            "Acelera el metabolismo, limpia el sistema digestivo y tonifica.",
            "Incluye guía nutricional detallada día por día."
        ],
        "ingredients": ["Prunex1", "BioPro+ Fit", "Thermo T3", "NoCarb-T", "Vita Xtra T+"],
        "preparation": "Seguir el cronograma diario de 5 tomas incluido dentro de la caja oficial.",
        "idealTime": "Durante 14 días consecutivos en desayuno, media mañana, almuerzo, media tarde y cena.",
        "recommendedCombinations": ["thermo-t3", "nocarb-t", "biopro-fit", "prunex1"]
    },
    "pack-10-14": {
        "cleanName": "FuXion 10/14 Pack",
        "categorySlug": "control-de-peso",
        "badge": "Pack Control de Peso",
        "imageFrom": "pack-5-14-active-mito",
        "shortDescription": "Programa intensivo FuXion 10/14 de control de peso y nutrición celular para transformar tu composición corporal en 14 días.",
        "description": "El FuXion 10/14 Pack reúne las fórmulas clave de limpieza, saciedad proteica y aceleración metabólica para ayudarte a alcanzar tus metas de peso y bienestar en un ciclo práctico de 14 días.",
        "benefits": [
            "Programa estructurado de 14 días para control de peso.",
            "Combina proteínas bioactivas, fibras y extractos termogénicos.",
            "100% Clean Label y endulzado con stevia."
        ],
        "ingredients": ["Proteínas Bioactivas FuXion", "Tés Termogénicos", "Fibras Prebióticas", "Vitaminas y Minerales"],
        "preparation": "Tomar cada sobre en el horario indicado por el plan de 14 días.",
        "idealTime": "En las 5 comidas diarias durante el ciclo de 14 días.",
        "recommendedCombinations": ["thermo-t3", "nocarb-t", "biopro-fit", "prunex1"]
    },
    "promo-hoy-quiero-engreirte": {
        "cleanName": "Promo Hoy Quiero Engreírte",
        "categorySlug": "antiedad-y-belleza",
        "badge": "Promoción Especial",
        "imageFrom": "beauty-in",
        "shortDescription": "Pack promocional oficial FuXion diseñado para consentir tu bienestar, piel y vitalidad diaria con precio especial de temporada.",
        "description": "La Promo Hoy Quiero Engreírte combina bebidas nutracéuticas seleccionadas del catálogo oficial FuXion para regalar o disfrutar una rutina de belleza, antioxidantes y bienestar integral a un precio preferencial.",
        "benefits": [
            "Combinación especial de bienestar y cuidado personal.",
            "Precio promocional exclusivo en tienda oficial.",
            "Ideal para regalo o rutina personal de renovación."
        ],
        "ingredients": ["Péptidos de Colágeno Bioactivo", "Antioxidantes Frutales", "Vitaminas y Minerales"],
        "preparation": "Disolver 1 stick en 180 ml de agua según las indicaciones de cada bebida incluida.",
        "idealTime": "A media mañana o por la noche para potenciar la nutrición celular.",
        "recommendedCombinations": ["beauty-in", "youth-elixir", "probal", "flora-liv"]
    },
    "promo-quiero-verte-brillar": {
        "cleanName": "Promo Quiero Verte Brillar",
        "categorySlug": "antiedad-y-belleza",
        "badge": "Promoción Belleza",
        "imageFrom": "beauty-in",
        "shortDescription": "Combinación promocional de colágeno bioactivo, antioxidantes y juventud celular para iluminar tu piel, cabello, uñas y vitalidad.",
        "description": "La Promo Quiero Verte Brillar reúne las mejores fórmulas de la línea Anti-Edad y Belleza de FuXion para nutrir la dermis desde adentro, combatir el estrés oxidativo y devolverle luminosidad y firmeza a tu piel.",
        "benefits": [
            "Nutrición profunda para piel radiante, cabello y uñas fuertes.",
            "Alta concentración de colágeno bioactivo y antioxidantes.",
            "Descuento especial por pack promocional."
        ],
        "ingredients": ["Colágeno Bioactivo", "Resveratrol", "Coenzima Q10", "Biotina", "Vitamina C y E"],
        "preparation": "Disolver en agua fría según la guía de cada producto del pack.",
        "idealTime": "Por la mañana y antes de dormir para aprovechar la regeneración nocturna.",
        "recommendedCombinations": ["beauty-in", "youth-elixir", "golden-flx", "berry-balance"]
    },
    "promo-quiero-verte-en-tu-mejor-version": {
        "cleanName": "Promo Quiero Verte en Tu Mejor Versión",
        "categorySlug": "control-de-peso",
        "badge": "Promoción Integral",
        "imageFrom": "thermo-t3",
        "shortDescription": "Pack promocional multi-país que combina metabolismo activo, energía limpia y bienestar digestivo para impulsar tu mejor versión.",
        "description": "Disponible en Colombia, Estados Unidos, Ecuador y Guatemala, la Promo Quiero Verte en Tu Mejor Versión une bebidas funcionales sinérgicas de FuXion para ayudarte a mejorar tu composición corporal, energía diaria y digestión con descuento oficial.",
        "benefits": [
            "Sinergia completa para energía, metabolismo y figura.",
            "Disponible con precio preferencial en la tienda oficial.",
            "Fórmulas 100% naturales Clean Label sin azúcar añadida."
        ],
        "ingredients": ["Extractos Termogénicos", "Fibras Prebióticas", "Antioxidantes y Aminoácidos"],
        "preparation": "Disolver cada bebida en 180-200 ml de agua fría o caliente según corresponda.",
        "idealTime": "En tu rutina diaria de mañana, almuerzo y noche.",
        "recommendedCombinations": ["thermo-t3", "nocarb-t", "vita-xtra-t", "prunex1"]
    },
    "promo-quiero-verte-saludable-y-en-forma": {
        "cleanName": "Promo Quiero Verte Saludable y en Forma",
        "categorySlug": "control-de-peso",
        "badge": "Promoción Fitness",
        "imageFrom": "biopro-fit",
        "shortDescription": "Pack promocional oficial de control de peso y bienestar metabólico para mantenerte saludable, ligero y en forma.",
        "description": "La Promo Quiero Verte Saludable y en Forma combina bebidas funcionales de la línea de control de peso y nutrición celular para apoyar la quema de grasa, controlar antojos y mantener tu energía alta todos los días.",
        "benefits": [
            "Apoya el control de peso y la reducción de medidas.",
            "Controla la ansiedad por comer entre horas.",
            "Ahorro exclusivo en tienda oficial."
        ],
        "ingredients": ["Tés Termogénicos", "Proteínas y Fibras Solubles", "Cromo y L-Carnitina"],
        "preparation": "Disolver en agua fría o caliente según la bebida correspondiente del pack.",
        "idealTime": "A media mañana, después del almuerzo o antes de tu actividad física.",
        "recommendedCombinations": ["thermo-t3", "nocarb-t", "biopro-fit", "cafe-y-cafe-fit"]
    },
    "promo-flora-liv-golden-flx": {
        "cleanName": "Promo 1 Flora Liv + 1 Golden FLX (Gol-FLX)",
        "categorySlug": "limpieza-y-detox",
        "badge": "Dúo Digestión + Articulaciones",
        "imageFrom": "flora-liv",
        "shortDescription": "Promoción oficial México que combina 1 Flora Liv (probióticos y regeneración intestinal) + 1 Gol-FLX (cúrcuma orgánica antiinflamatoria).",
        "description": "El dúo promocional MX FV (1 Flora Liv + 1 Golden FLX / Gol-FLX) une 10 mil millones de bacterias probióticas vivas con cúrcuma orgánica certificada TurmiPure®, jengibre y cardamomo para desinflamar el sistema digestivo y cuidar tus articulaciones.",
        "benefits": [
            "Regenera la microbiota intestinal y mejora las defensas con Flora Liv.",
            "Modula la inflamación articular y digestiva con Golden FLX.",
            "Precio promocional exclusivo en Tienda Oficial FuXion México."
        ],
        "ingredients": ["Cultivos Probióticos (10 mil millones UFC)", "Fibra Prebiótica", "Granadilla", "Cúrcuma Orgánica TurmiPure®", "Jengibre y Cardamomo"],
        "preparation": "Toma Flora Liv en agua fría y Golden FLX en agua tibia o caliente.",
        "idealTime": "Flora Liv en ayunas por la mañana y Golden FLX por la tarde o noche.",
        "recommendedCombinations": ["flora-liv", "golden-flx", "prunex1", "alpha-balance"]
    },
    "combo-defensa-natural": {
        "cleanName": "Combo Defensa Natural",
        "categorySlug": "inmunologica",
        "badge": "Combo Inmunidad",
        "imageFrom": "vera-plus",
        "shortDescription": "Combo integral de potenciadores inmunológicos, probióticos y proteínas con calostro para blindar las defensas naturales de tu organismo.",
        "description": "El Combo Defensa Natural reúne las fórmulas inmunológicas más potentes de FuXion (con Wellmune WGP®, Aloe Vera, Ganoderma lucidum, probióticos y Bioferrín®) para fortalecer el sistema respiratorio e inmune durante todo el mes.",
        "benefits": [
            "Multiplica la capacidad de respuesta de tus defensas naturales.",
            "Protege las vías respiratorias y la barrera intestinal.",
            "Pack mensual completo disponible en EE. UU. y Ecuador."
        ],
        "ingredients": ["Wellmune WGP® (Beta-Glucanos)", "Aloe Vera", "Ganoderma Lucidum", "Probióticos", "BioProtein+ con Colostrum®"],
        "preparation": "Preparar cada bebida del combo en agua fría o caliente según su indicación.",
        "idealTime": "Mañana, tarde y noche según el plan de inmunidad mensual.",
        "recommendedCombinations": ["vera-plus", "biopro-tect", "flora-liv", "gano-plus-cappuccino"]
    },
    "combo-detox": {
        "cleanName": "Combo Detox Integral",
        "categorySlug": "limpieza-y-detox",
        "badge": "Combo Limpieza",
        "imageFrom": "prunex1",
        "shortDescription": "Combo completo de depuración digestiva, hepática, renal y alcalinización celular para renovar tu organismo desde adentro.",
        "description": "El Combo Detox reúne las bebidas depurativas esenciales de la Línea Limpieza y Detox de FuXion (Prunex1, Flora Liv, Alpha Balance, Berry Balance y Rexet) para limpiar el colon, regenerar la flora intestinal, alcalinizar el pH y proteger el hígado.",
        "benefits": [
            "Limpieza profunda de colon, hígado y vías urinarias.",
            "Equilibra el pH interno y regenera la microbiota.",
            "Mejora la absorción de nutrientes y la sensación de ligereza."
        ],
        "ingredients": ["Fibras Prebióticas y Guindón", "Probióticos Vivos", "Clorofila y Espirulina", "Cranberry", "Alcachofa"],
        "preparation": "Disolver cada bebida en agua fría o caliente según el horario del programa detox.",
        "idealTime": "En ayunas, media mañana, tarde y antes de dormir.",
        "recommendedCombinations": ["prunex1", "flora-liv", "alpha-balance", "berry-balance"]
    },
    "combo-full-power": {
        "cleanName": "Combo Full Power",
        "categorySlug": "energia-y-vitalidad",
        "badge": "Combo Energía Total",
        "imageFrom": "vita-xtra-t",
        "shortDescription": "Combo mensual de máxima energía física, enfoque mental y nutrición celular para rendir al 100% todos los días sin fatiga.",
        "description": "El Combo Full Power combina los mejores energizantes naturales, nootrópicos y multivitamínicos de FuXion (con Guayusa, Maca, Cordyceps, Té Verde, Taurina natural y GABA) para mantener tu cuerpo y mente al máximo nivel.",
        "benefits": [
            "Energía física sostenida desde la mañana hasta la noche.",
            "Mayor concentración, memoria y agilidad mental.",
            "Sin azúcares añadidos ni caída brusca de energía."
        ],
        "ingredients": ["Guayusa", "Maca", "Cordyceps", "Té Verde", "Acai Berry", "Aminoácidos Nootrópicos", "Vitaminas del Complejo B"],
        "preparation": "Disolver 1 stick en 180-200 ml de agua fría.",
        "idealTime": "Por la mañana en el desayuno y antes de tus actividades de mayor exigencia.",
        "recommendedCombinations": ["vita-xtra-t", "on", "nutraday", "passion"]
    },
    "combo-nutricion-celular": {
        "cleanName": "Combo Nutrición Celular",
        "categorySlug": "regeneracion-y-nutricion",
        "badge": "Combo Regeneración",
        "imageFrom": "biopro-tect",
        "shortDescription": "Combo familiar de proteínas de alto valor biológico, probióticos y micronutrientes para nutrir y regenerar tus células a diario.",
        "description": "El Combo Nutrición Celular integra los pasos fundamentales del Sistema Base FuXion (Limpieza + Regeneración + Vitalidad) con proteínas patentadas, vitaminas orgánicas y probióticos para el bienestar de toda la familia.",
        "benefits": [
            "Cubre los requerimientos diarios de proteínas, vitaminas y minerales.",
            "Fortalece el sistema inmunológico y digestivo.",
            "Ideal para adultos, jóvenes y adultos mayores."
        ],
        "ingredients": ["BioProtein+ con Colostrum®", "12 Vitaminas y 5 Minerales", "Cultivos Probióticos", "Fibras Prebióticas"],
        "preparation": "Preparar los batidos y bebidas en agua fría con shaker o vaso.",
        "idealTime": "En el desayuno, media mañana y cena.",
        "recommendedCombinations": ["biopro-tect", "nutraday", "flora-liv", "vita-xtra-t"]
    },
    "combo-siempre-joven": {
        "cleanName": "Combo Siempre Joven",
        "categorySlug": "antiedad-y-belleza",
        "badge": "Combo Juventud",
        "imageFrom": "youth-elixir",
        "shortDescription": "Combo antiedad premium con colágeno bioactivo, resveratrol, cúrcuma orgánica y antioxidantes para rejuvenecer piel, articulaciones y vitalidad.",
        "description": "El Combo Siempre Joven reúne las fórmulas estrella de longevidad saludable de FuXion (Beauty-In, Youth Elixir y Golden FLX) para estimular la producción natural de colágeno, mejorar la elasticidad de la piel, proteger las articulaciones y favorecer el sueño reparador.",
        "benefits": [
            "Piel más firme, hidratada y luminosa.",
            "Articulaciones flexibles y protegidas con cúrcuma orgánica.",
            "Promueve el descanso nocturno y la vitalidad juvenil."
        ],
        "ingredients": ["Péptidos de Colágeno Bioactivo", "Resveratrol", "OptiBerry®", "Cúrcuma Orgánica TurmiPure®", "Aminoácidos GABA"],
        "preparation": "Disolver cada bebida en agua fría o tibia según corresponda.",
        "idealTime": "Media mañana, tarde y 30 minutos antes de dormir.",
        "recommendedCombinations": ["beauty-in", "youth-elixir", "golden-flx", "probal"]
    },
    "combo-sport": {
        "cleanName": "Combo Sport Alto Rendimiento",
        "categorySlug": "linea-sport",
        "badge": "Combo Deportivo",
        "imageFrom": "biopro-sport",
        "shortDescription": "Combo deportivo completo para antes, durante y después del entrenamiento: energía explosiva, hidratación isotónica y ganancia muscular.",
        "description": "El Combo Sport de FuXion reúne Pre Sport, Xtra Mile, Post Sport y proteína deportiva BioPro+ Sport / Protein Active Sport para cubrir las 3 fases del entrenamiento con nutrición limpia certificada Clean Label.",
        "benefits": [
            "Mayor potencia, vasodilatación y resistencia al entrenar.",
            "Recuperación rápida de electrolitos y fibras musculares.",
            "Incremento de masa muscular magra con Actinos® y BCAA."
        ],
        "ingredients": ["BioProtein+ Sport con Actinos®", "L-Glutamina", "BCAA", "Citrulina", "Beta-Alanina", "Electrolitos"],
        "preparation": "Tomar Pre Sport antes, Xtra Mile durante y Post Sport + BioPro+ Sport después de entrenar.",
        "idealTime": "Alrededor de tu rutina diaria de gimnasio, running o deporte.",
        "recommendedCombinations": ["biopro-sport", "pre-sport", "post-sport", "xtra-mile"]
    },
    "combo-vigor": {
        "cleanName": "Combo Vigor y Rendimiento",
        "categorySlug": "antiedad-y-belleza",
        "badge": "Combo Vitalidad",
        "imageFrom": "passion",
        "shortDescription": "Combo revitalizante con L-arginina, jalea real, maca, guayusa y antioxidantes para potenciar el vigor físico, circulación y energía.",
        "description": "El Combo Vigor une Passion, Vita Xtra T+ y Youth Elixir para impulsar la oxigenación celular, el flujo sanguíneo, la energía diaria y el vigor físico y hormonal de forma 100% natural.",
        "benefits": [
            "Potencia la circulación y el vigor gracias a la L-arginina y Jalea Real.",
            "Brinda energía física y mental sostenida.",
            "Mejora la calidad del descanso y la vitalidad general."
        ],
        "ingredients": ["L-Arginina", "Jalea Real", "Maca", "Guayusa", "Ginseng", "Resveratrol"],
        "preparation": "Disolver 1 stick en 180 ml de agua fría.",
        "idealTime": "Por la mañana y por la noche.",
        "recommendedCombinations": ["passion", "vita-xtra-t", "youth-elixir", "probal"]
    }
}

# Generate the numbered US combos dynamically as well so all 15 US combos have clean entries
for idx in range(1, 5):
    NEW_CANONICAL_PRODUCTS[f"combo-antiedad-{idx}"] = {
        "cleanName": f"Combo Antiedad {idx}",
        "categorySlug": "antiedad-y-belleza",
        "badge": f"Combo Antiedad #{idx}",
        "imageFrom": "beauty-in" if idx % 2 == 1 else "youth-elixir",
        "shortDescription": f"Combo oficial FuXion Antiedad {idx} con colágeno bioactivo, antioxidantes, resveratrol y nutrición celular para rejuvenecer piel y articulaciones.",
        "description": f"El Combo Antiedad {idx} de FuXion combina las bebidas líderes de longevidad saludable (Beauty-In, Youth Elixir, Golden FLX y Probal/Flora Liv) en un programa mensual diseñado para nutrir la piel desde adentro, proteger las articulaciones y combatir el envejecimiento celular.",
        "benefits": [
            "Estimula la síntesis de colágeno y mejora la elasticidad de la dermis.",
            "Combate los radicales libres con resveratrol y superfrutas antioxidantes.",
            "Cuidado articular y equilibrio hormonal natural."
        ],
        "ingredients": ["Péptidos de Colágeno Bioactivo", "Resveratrol", "Cúrcuma Orgánica TurmiPure®", "Biotina y Coenzima Q10"],
        "preparation": "Disolver 1 sobre de cada bebida en 180 ml de agua fría o tibia según indicación.",
        "idealTime": "Mañana, tarde y noche antes de dormir.",
        "recommendedCombinations": ["beauty-in", "youth-elixir", "golden-flx", "probal"]
    }

for idx in [1, 2, 4]:
    NEW_CANONICAL_PRODUCTS[f"combo-control-de-peso-{idx}"] = {
        "cleanName": f"Combo Control de Peso {idx}",
        "categorySlug": "control-de-peso",
        "badge": f"Combo Peso #{idx}",
        "imageFrom": "thermo-t3" if idx != 2 else "biopro-fit",
        "shortDescription": f"Combo mensual Control de Peso {idx} de FuXion: sinergia termogénica, control de carbohidratos, saciedad proteica y limpieza digestiva.",
        "description": f"El Combo Control de Peso {idx} reúne las bebidas metabólicas más efectivas de FuXion (Thermo T3, NoCarb-T, BioPro+ Fit / Protein Active Fit y limpieza digestiva) para acelerar la oxidación de grasas, controlar la ansiedad y reducir medidas de forma saludable.",
        "benefits": [
            "Acelera el metabolismo de las grasas con extractos termogénicos.",
            "Modula la absorción de carbohidratos y azúcares de la dieta.",
            "Aporta saciedad proteica para evitar antojos y tonificar."
        ],
        "ingredients": ["Té Rojo, Verde y Negro", "L-Carnitina", "Fibras Solubles y Cromo", "Proteína Bioactiva con Prolibra®"],
        "preparation": "Tomar cada bebida del combo en su horario correspondiente (mañana, almuerzo, tarde y noche).",
        "idealTime": "A media mañana, después de las comidas principales y antes de entrenar.",
        "recommendedCombinations": ["thermo-t3", "nocarb-t", "biopro-fit", "prunex1"]
    }

for idx in range(1, 4):
    NEW_CANONICAL_PRODUCTS[f"combo-estilo-de-vida-{idx}"] = {
        "cleanName": f"Combo Estilo de Vida {idx}",
        "categorySlug": "energia-y-vitalidad",
        "badge": f"Combo Bienestar #{idx}",
        "imageFrom": "vita-xtra-t" if idx != 2 else "no-stress",
        "shortDescription": f"Combo mensual Estilo de Vida {idx} de FuXion para equilibrar energía diaria, manejo del estrés, digestión limpia y bienestar integral.",
        "description": f"El Combo Estilo de Vida {idx} está diseñado para personas con rutinas exigentes que buscan mantener energía limpia durante el día, enfoque mental, digestión ligera y descanso reparador por la noche con bebidas 100% naturales Clean Label.",
        "benefits": [
            "Energía natural sostenida sin azúcares añadidos.",
            "Equilibrio del sistema nervioso frente al estrés cotidiano.",
            "Digestión saludable y microbiota fortalecida."
        ],
        "ingredients": ["Guayusa y Té Verde", "Aminoácidos GABA y L-Teanina", "Cultivos Probióticos", "Vitaminas y Minerales Orgánicos"],
        "preparation": "Disolver 1 stick en 180-200 ml de agua fría.",
        "idealTime": "Al iniciar el día, a media tarde y antes de descansar.",
        "recommendedCombinations": ["vita-xtra-t", "no-stress", "on", "flora-liv"]
    }

def build_all():
    raw_by_country = load_raw_country_items()

    with open(os.path.join(BASE_DIR, "src", "data", "products.json")) as f:
        products = json.load(f)
    with open(os.path.join(BASE_DIR, "src", "data", "categories.json")) as f:
        categories = json.load(f)

    cat_map = {c["slug"]: c for c in categories}
    prod_map = {p["slug"]: p for p in products}

    # Ensure all NEW_CANONICAL_PRODUCTS exist in products list
    for new_slug, meta in NEW_CANONICAL_PRODUCTS.items():
        if new_slug not in prod_map:
            ref_prod = prod_map.get(meta["imageFrom"], products[0])
            cat_obj = cat_map[meta["categorySlug"]]
            new_p = {
                "slug": new_slug,
                "sku": "000000",
                "allSkus": [],
                "name": meta["cleanName"].upper(),
                "cleanName": meta["cleanName"],
                "categorySlug": meta["categorySlug"],
                "categoryName": cat_obj["name"],
                "categoryShortName": cat_obj["shortName"],
                "badge": meta["badge"],
                "isFlagship": False,
                "price": 0,
                "formattedPrice": "",
                "pack": "Presentación Oficial",
                "points": 20,
                "sticks": 28,
                "perStickFormatted": "",
                "inStock": True,
                "shopUrl": "https://carlos-lingan.site.fuxion.com/pe/tienda/",
                "directProductUrl": "https://carlos-lingan.site.fuxion.com/pe/tienda/",
                "mainImage": ref_prod["mainImage"],
                "bodegonImage": ref_prod["bodegonImage"],
                "heroImage": ref_prod["heroImage"],
                "gallery": list(ref_prod["gallery"]),
                "nutritionalImage": "",
                "videoUrl": "",
                "shortDescription": meta["shortDescription"],
                "description": meta["description"],
                "benefits": meta["benefits"],
                "ingredientsRaw": " + ".join([x.upper() for x in meta["ingredients"]]),
                "ingredients": meta["ingredients"],
                "preparation": meta["preparation"],
                "idealTime": meta["idealTime"],
                "recommendedCombinations": meta["recommendedCombinations"],
                "presentations": [],
                "seoTitle": f"{meta['cleanName']} FuXion: Para qué sirve, Beneficios y Precio Oficial",
                "seoDescription": f"Compra {meta['cleanName']} original de FuXion en la Tienda Oficial. Conoce qué incluye, beneficios, cómo tomarlo y pide con envío directo a domicilio.",
                "faqs": [
                    {
                        "question": f"¿Qué incluye y para qué sirve {meta['cleanName']} de FuXion?",
                        "answer": f"{meta['description']} Formulado bajo el concepto de Fusión Nutracéutica® con certificación Clean Label (100% natural y endulzado con stevia)."
                    },
                    {
                        "question": f"¿Cómo se toma {meta['cleanName']}?",
                        "answer": f"{meta['preparation']} {meta['idealTime']}"
                    },
                    {
                        "question": f"¿Dónde comprar {meta['cleanName']} original con envío a domicilio?",
                        "answer": "Haz clic en el botón «Comprar en Tienda Oficial» para ir directamente a la plataforma oficial de FuXion de tu país (carlos-lingan.site.fuxion.com), donde verás el precio en tu moneda local y recibirás tu pedido con garantía oficial."
                    }
                ]
            }
            products.append(new_p)
            prod_map[new_slug] = new_p

    # Now group raw items by (country, canonical_slug)
    grouped = {c["code"]: {} for c in COUNTRIES}
    directory_by_country = {c["code"]: [] for c in COUNTRIES}

    for cc, items in raw_by_country.items():
        for it in items:
            url_slug = it["url"].rstrip("/").split("/")[-1]
            canon_slug = SLUG_ALIASES.get(url_slug)
            if not canon_slug:
                raise ValueError(f"Unmapped URL slug in {cc}: {url_slug} ({it['name']} - {it['url']})")
            p_obj = prod_map[canon_slug]

            sticks = parse_sticks(it["pack"])
            per_stick = ""
            if sticks > 0 and it["price"] > 0:
                per_stick = format_price(cc, it["price"] / sticks)

            is_landing = "/producto/" not in it["url"]
            pres_entry = {
                "sku": it["sku"],
                "name": it["name"],
                "pack": it["pack"] or p_obj["pack"] or "Presentación Oficial",
                "price": it["price"],
                "formattedPrice": it["formattedPrice"],
                "points": 20 if it["price"] >= 30 else 5,
                "sticks": sticks,
                "perStickFormatted": per_stick,
                "inStock": it["inStock"],
                "shopUrl": it["url"],
                "directProductUrl": it["url"],
                "isLanding": is_landing,
                "gallery": p_obj["gallery"][:2] if p_obj.get("gallery") else []
            }

            grouped[cc].setdefault(canon_slug, []).append(pres_entry)

            # Build human-friendly local display name
            raw_clean = it["name"].replace("FUXION ", "").strip()
            directory_by_country[cc].append({
                "sku": it["sku"],
                "name": it["name"],
                "cleanName": p_obj["cleanName"] if raw_clean.upper() == p_obj["name"].upper() else f"{it['name']} ({p_obj['cleanName']})",
                "productSlug": canon_slug,
                "categorySlug": p_obj["categorySlug"],
                "categoryName": p_obj["categoryShortName"],
                "badge": p_obj["badge"],
                "pack": pres_entry["pack"],
                "price": it["price"],
                "formattedPrice": it["formattedPrice"],
                "perStickFormatted": per_stick,
                "points": pres_entry["points"],
                "inStock": it["inStock"],
                "shopUrl": it["url"]
            })

    # Attach countryOffers and availableCountries to each canonical product
    for p in products:
        slug = p["slug"]
        country_offers = {}
        avail_countries = []

        for c in COUNTRIES:
            cc = c["code"]
            pres_list = grouped[cc].get(slug, [])
            if not pres_list:
                continue
            avail_countries.append(cc)

            # Sort presentations so landing page or main 28/14/30-stick presentation comes first
            def pres_sort_key(pr):
                return (
                    0 if pr["isLanding"] else 1,
                    0 if pr["sticks"] >= 14 else 1,
                    -pr["price"]
                )
            pres_list_sorted = sorted(pres_list, key=pres_sort_key)
            primary = pres_list_sorted[0]

            # Determine localized product title
            raw_name = primary["name"]
            raw_without_fx = re.sub(r"^FUXION\s+", "", raw_name, flags=re.I).strip()
            # If local name differs significantly from canonical cleanName (e.g. GUINDON X, COOL AGE, BELL IN, HGH, NÉCTAR H+, OFF, T T3, T3, CRAN BAL)
            canon_upper = p["cleanName"].upper()
            if raw_without_fx.upper() not in canon_upper and canon_upper not in raw_without_fx.upper():
                local_clean_name = f"{raw_without_fx.title()} ({p['cleanName']})"
                # Preserve uppercase acronyms like HGH, T3, T T3, OFF
                if raw_without_fx.upper() in ("HGH", "T3", "T T3", "OFF", "NÉCTAR H+", "VITA XTR T+", "GOL-FLX", "CRAN BAL", "ALPHA-BAL", "BELL IN", "COOL AGE", "GUINDON X", "PRUNEX"):
                    local_clean_name = f"{raw_without_fx} ({p['cleanName']})"
            else:
                local_clean_name = p["cleanName"]

            country_offers[cc] = {
                "countryCode": cc,
                "available": True,
                "localName": local_clean_name,
                "rawName": raw_name,
                "sku": primary["sku"],
                "allSkus": [x["sku"] for x in pres_list_sorted],
                "price": primary["price"],
                "formattedPrice": primary["formattedPrice"],
                "currencyCode": c["currencyCode"],
                "currencySymbol": c["currencySymbol"],
                "pack": primary["pack"],
                "points": primary["points"],
                "sticks": primary["sticks"],
                "perStickFormatted": primary["perStickFormatted"],
                "inStock": any(x["inStock"] for x in pres_list_sorted),
                "shopUrl": primary["shopUrl"],
                "directProductUrl": primary["directProductUrl"],
                "presentations": pres_list_sorted
            }

        p["availableCountries"] = avail_countries
        p["countryOffers"] = country_offers

        # Update top-level fields from PE if available, otherwise from the first available country
        default_cc = "pe" if "pe" in country_offers else (avail_countries[0] if avail_countries else None)
        if default_cc:
            off = country_offers[default_cc]
            p["sku"] = off["sku"]
            p["allSkus"] = off["allSkus"]
            p["price"] = off["price"]
            p["formattedPrice"] = off["formattedPrice"]
            p["pack"] = off["pack"]
            p["points"] = off["points"]
            p["sticks"] = off["sticks"]
            p["perStickFormatted"] = off["perStickFormatted"]
            p["inStock"] = off["inStock"]
            p["shopUrl"] = off["shopUrl"]
            p["directProductUrl"] = off["directProductUrl"]
            p["presentations"] = off["presentations"]
        else:
            # For any legacy product not currently in store grid (e.g. old SKU), point its PE shopUrl to /pe/tienda/
            if "carlos-lingan.site.fuxion.com/pe/" not in p["shopUrl"]:
                p["shopUrl"] = p["shopUrl"].replace("carlos-lingan.site.fuxion.com/", "carlos-lingan.site.fuxion.com/pe/")
                p["directProductUrl"] = p["shopUrl"]
            p["availableCountries"] = ["pe"]
            p["countryOffers"] = {
                "pe": {
                    "countryCode": "pe",
                    "available": True,
                    "localName": p["cleanName"],
                    "rawName": p["name"],
                    "sku": p["sku"],
                    "allSkus": p["allSkus"],
                    "price": p["price"],
                    "formattedPrice": p["formattedPrice"],
                    "currencyCode": "PEN",
                    "currencySymbol": "S/",
                    "pack": p["pack"],
                    "points": p["points"],
                    "sticks": p["sticks"],
                    "perStickFormatted": p["perStickFormatted"],
                    "inStock": p["inStock"],
                    "shopUrl": p["shopUrl"],
                    "directProductUrl": p["directProductUrl"],
                    "presentations": p["presentations"]
                }
            }

    # Save countries.json
    with open(os.path.join(BASE_DIR, "src", "data", "countries.json"), "w", encoding="utf-8") as f:
        json.dump(COUNTRIES, f, ensure_ascii=False, indent=2)

    # Save updated products.json
    with open(os.path.join(BASE_DIR, "src", "data", "products.json"), "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    # Save country_catalog.json
    with open(os.path.join(BASE_DIR, "src", "data", "country_catalog.json"), "w", encoding="utf-8") as f:
        json.dump({
            "countries": COUNTRIES,
            "directoryByCountry": directory_by_country
        }, f, ensure_ascii=False, indent=2)

    # Generate supabase/functions/fuxion-chat/catalog.ts for all 6 countries
    catalog_by_country = {}
    prompt_by_country = {}

    for c in COUNTRIES:
        cc = c["code"]
        c_map = {}
        c_lines = []
        for p in products:
            if cc not in p.get("countryOffers", {}):
                continue
            off = p["countryOffers"][cc]
            img = p.get("bodegonImage") or p.get("mainImage") or "/img/prunex1-bodegon.webp"
            short_desc = (p["benefits"][0] if p.get("benefits") else p.get("shortDescription", ""))[:95]
            ideal_time = (p.get("idealTime") or "")[:95]
            info = {
                "slug": p["slug"],
                "sku": off["sku"],
                "name": off["localName"],
                "category": p["categoryShortName"],
                "price": off["price"],
                "formattedPrice": off["formattedPrice"],
                "pack": off["pack"],
                "shopUrl": off["shopUrl"],
                "image": img,
                "shortDesc": short_desc,
                "idealTime": ideal_time,
                "inStock": off["inStock"]
            }
            c_map[p["slug"]] = info
            stock_note = "" if off["inStock"] else " [SIN STOCK TEMPORAL]"
            c_lines.append(
                f"- {p['slug']} | {off['localName']} [{p['categoryShortName']}] | {off['formattedPrice']} ({off['pack']}){stock_note} | URL: {off['shopUrl']} | {short_desc}"
            )
        catalog_by_country[cc] = c_map
        prompt_by_country[cc] = "\n".join(c_lines)

    ts_content = f"""export interface ProductInfo {{
  slug: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  formattedPrice: string;
  pack: string;
  shopUrl: string;
  image: string;
  shortDesc: string;
  idealTime: string;
  inStock?: boolean;
}}

export interface CountryMeta {{
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  currencyLabel: string;
  shopTiendaUrl: string;
}}

export const COUNTRY_META: Record<string, CountryMeta> = {json.dumps({
    c["code"]: {
        "code": c["code"],
        "name": c["name"],
        "flag": c["flag"],
        "currencyCode": c["currencyCode"],
        "currencySymbol": c["currencySymbol"],
        "currencyLabel": c["currencyLabel"],
        "shopTiendaUrl": c["shopTiendaUrl"]
    } for c in COUNTRIES
}, ensure_ascii=False)};

export const CATALOG_BY_COUNTRY: Record<string, Record<string, ProductInfo>> = {json.dumps(catalog_by_country, ensure_ascii=False)};

export const CATALOG_PROMPT_BY_COUNTRY: Record<string, string> = {json.dumps(prompt_by_country, ensure_ascii=False)};

// Default backwards-compatible exports (Peru)
export const CATALOG_MAP: Record<string, ProductInfo> = CATALOG_BY_COUNTRY["pe"];
export const CATALOG_PROMPT: string = CATALOG_PROMPT_BY_COUNTRY["pe"];
"""
    with open(os.path.join(BASE_DIR, "supabase", "functions", "fuxion-chat", "catalog.ts"), "w", encoding="utf-8") as f:
        f.write(ts_content)

    print("Successfully built multi-country catalog!")
    print("Total canonical products:", len(products))
    for c in COUNTRIES:
        cc = c["code"]
        avail_count = sum(1 for p in products if cc in p.get("countryOffers", {}))
        dir_count = len(directory_by_country[cc])
        print(f"  {cc.upper()} ({c['name']} - {c['currencyCode']}): {avail_count} canonical products | {dir_count} official store SKUs")

if __name__ == "__main__":
    build_all()
