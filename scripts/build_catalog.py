#!/usr/bin/env python3
"""
Builds src/data/categories.json and src/data/products.json from src/data/raw_skus.json,
mapping all 72 SKUs into 60 canonical SEO product pages (with presentation selectors for multi-SKU products)
and also indexing all 72 SKUs so every single SKU and product has full Peruvian SEO content and direct links to shop.site.fuxion.com.
"""
import json
import os
import re

BASE_DIR = "/Users/charlie/Documents/Google Antigravity/fuxion.site"
RAW_PATH = os.path.join(BASE_DIR, "src", "data", "raw_skus.json")
PRODUCTS_OUT = os.path.join(BASE_DIR, "src", "data", "products.json")
CATEGORIES_OUT = os.path.join(BASE_DIR, "src", "data", "categories.json")

CATEGORIES = [
    {
        "slug": "limpieza-y-detox",
        "name": "Línea Limpieza y Detox",
        "shortName": "Limpieza y Detox",
        "step": "Paso 1 · Limpia y Equilibra",
        "badge": "Limpieza",
        "icon": "🌿",
        "description": "Fórmulas herbales, fibras prebióticas, probióticos y extractos depurativos diseñados para limpiar el colon, regenerar la microbiota intestinal, proteger el hígado, depurar las vías urinarias y alcalinizar el organismo.",
        "seoTitle": "Línea Limpieza y Detox FuXion Perú: Prunex1, Flora Liv, Alpha Balance y más",
        "seoDescription": "Catálogo oficial de la Línea Limpieza Digestiva y Detox de FuXion en Perú con precios en Soles (S/). Prunex1, Flora Liv, Liquid Fiber, Alpha Balance, Berry Balance y Rexet."
    },
    {
        "slug": "regeneracion-y-nutricion",
        "name": "Línea Regeneración y Nutrición Celular",
        "shortName": "Regeneración",
        "step": "Paso 2 · Regenera y Nutre",
        "badge": "Nutrición",
        "icon": "🧬",
        "description": "Proteínas patentadas de alto valor biológico (Bioprotein+ con Colostrum® y Biooprotein Active® 100% vegetal) y micronutrientes esenciales para regenerar tejidos, nutrir las células y fortalecer a toda la familia.",
        "seoTitle": "Línea Regeneración y Proteínas FuXion Perú: BioPro+ Tect, Protein Active y Nutraday",
        "seoDescription": "Conoce la línea de nutrición celular y proteínas de FuXion Perú: BioPro+ Tect con Bioferrín, Protein Active vegana y Nutraday multivitamínico. Precios oficiales en Soles."
    },
    {
        "slug": "energia-y-vitalidad",
        "name": "Línea Energía y Vitalidad",
        "shortName": "Energía",
        "step": "Paso 3 · Revitaliza",
        "badge": "Vitalidad",
        "icon": "⚡",
        "description": "Bebidas energizantes naturales y multivitamínicos con guayusa, maca, acai berry, goji, té verde y matcha que brindan energía sostenida durante todo el día sin azúcares añadidos ni taquicardia.",
        "seoTitle": "Línea Energía y Vitalidad FuXion Perú: Vita Xtra T+, Vitaenergía, Xpeed y Matcha",
        "seoDescription": "Recarga tu energía física y vitalidad con Vita Xtra T+, Vitaenergía, Xpeed y Matcha Pep-T de FuXion Perú. Bebidas funcionales sin azúcar con precios en Soles."
    },
    {
        "slug": "inmunologica",
        "name": "Línea Inmunológica y Defensas",
        "shortName": "Inmunidad",
        "step": "Potenciador · Defensas",
        "badge": "Inmunidad",
        "icon": "🛡️",
        "description": "Potenciadores inmunológicos con Aloe Vera, Wellmune WGP®, Ganoderma lucidum (Reishi), hoja de olivo y antioxidantes que multiplican la respuesta natural de tus defensas y protegen las vías respiratorias.",
        "seoTitle": "Línea Inmunológica FuXion Perú: Vera+, Gano+ Cappuccino, Gano+ T y Café Ganomax",
        "seoDescription": "Fortalece tus defensas y cuida tus vías respiratorias en Lima y todo el Perú con Vera+, Gano+ T, Gano+ Cappuccino y Café Ganomax de FuXion."
    },
    {
        "slug": "control-de-peso",
        "name": "Línea Control de Peso y Medidas",
        "shortName": "Control de Peso",
        "step": "Potenciador · Peso y Figura",
        "badge": "Metabolismo",
        "icon": "🔥",
        "description": "Tés termogénicos, inhibidores de absorción de carbohidratos, batidos proteicos saciantes con Prolibra®, cafés verdes fit, sopas proteicas y programas integrales 5/14 para oxidar grasa y reducir medidas saludablemente.",
        "seoTitle": "Línea Control de Peso FuXion Perú: Thermo T3, NoCarb-T, BioPro+ Fit y Pack 5/14",
        "seoDescription": "Baja de peso y reduce medidas con la línea oficial FuXion Perú: Thermo T3, NoCarb-T, BioPro+ Fit, Café & Café Fit, Protein Xoup y Packs 5/14 en Soles."
    },
    {
        "slug": "antiedad-y-belleza",
        "name": "Línea Anti-Edad, Belleza y Equilibrio",
        "shortName": "Anti-Edad y Belleza",
        "step": "Potenciador · Juventud y Bienestar",
        "badge": "Belleza",
        "icon": "✨",
        "description": "Péptidos de colágeno bioactivo optimizado, resveratrol, cúrcuma orgánica certificada TurmiPure®, fitoestrógenos naturales, jalea real y luteína para cuidar piel, articulaciones, equilibrio hormonal, vigor y visión.",
        "seoTitle": "Línea Anti-Edad y Colágeno FuXion Perú: Beauty-In, Youth Elixir, Golden FLX y Probal",
        "seoDescription": "Nutre tu piel, articulaciones y equilibrio hormonal con Beauty-In (colágeno bioactivo), Youth Elixir, Golden FLX, Probal, Passion y Zoom-In en Perú."
    },
    {
        "slug": "vigor-mental",
        "name": "Línea Vigor Mental, Enfoque y Descanso",
        "shortName": "Vigor Mental",
        "step": "Potenciador · Mente y Calma",
        "badge": "Calma y Enfoque",
        "icon": "🧠",
        "description": "Nootrópicos naturales, aminoácidos, adaptógenos, GABA y L-teanina formulados para activar la concentración y memoria durante el día (On, IQ+) y reducir el estrés promoviendo un sueño reparador por la noche (No Stress, Rezzt+).",
        "seoTitle": "Línea Vigor Mental y Anti-Estrés FuXion Perú: No Stress, On, IQ+ y Rezzt+",
        "seoDescription": "Mejora tu concentración, reduce el estrés diario y duerme mejor con No Stress, On, IQ+ y Rezzt+ de FuXion Perú. Compra online en Soles."
    },
    {
        "slug": "linea-sport",
        "name": "Línea Sport y Rendimiento Físico",
        "shortName": "Deporte y Fitness",
        "step": "Potenciador · Alto Rendimiento",
        "badge": "Deporte",
        "icon": "🏋️",
        "description": "Nutrición deportiva científicamente diseñada para antes, durante y después del entrenamiento: Pre Sport, Xtra Mile, Post Sport, BioPro+ Sport con Actinos® y Protein Active Sport vegana.",
        "seoTitle": "Línea Sport FuXion Perú: BioPro+ Sport, Pre Sport, Post Sport y Xtra Mile",
        "seoDescription": "Maximiza tu rendimiento deportivo y masa muscular con BioPro+ Sport, Protein Active Sport, Pre Sport, Post Sport y Xtra Mile de FuXion Perú."
    },
    {
        "slug": "gastronomia-y-accesorios",
        "name": "Bases Madre y Accesorios Oficiales",
        "shortName": "Gastronomía y Shakers",
        "step": "Complementos · Estilo de Vida",
        "badge": "Complementos",
        "icon": "🥤",
        "description": "Bases culinarias saludables 100% naturales enriquecidas con nutrientes para preparar tus platos peruanos favoritos (Verde, Amarilla y Roja) y tomatodos/shakers oficiales FuXion.",
        "seoTitle": "Bases Madre Culinarias y Tomatodos Shakers Oficiales FuXion Perú",
        "seoDescription": "Descubre las Bases Madre Verde, Amarilla y Roja de FuXion para cocinar saludable en Perú, además de los tomatodos y shakers oficiales."
    }
]

# Explicit mapping of the 60 product definitions
# Format: slug -> { primary_sku, variant_skus, clean_name, category, badge, ideal_time, combos, local_bodegon, local_hero }
PRODUCT_CONFIG = [
    # 10 Flagship products first
    {
        "slug": "prunex1",
        "skus": ["142626", "149138", "144137"],
        "cleanName": "Prunex1",
        "category": "limpieza-y-detox",
        "badge": "Limpieza",
        "isFlagship": True,
        "localBodegon": "/img/prunex1-bodegon.webp",
        "localHero": "/img/prunex1-hero.webp",
        "idealTime": "Tomar 1 stick disuelto en una taza de agua caliente (180 ml) por la noche, media hora antes de dormir, durante 5 a 7 días seguidos o cuando sientas tránsito lento.",
        "combos": ["flora-liv", "liquid-fiber", "alpha-balance", "thermo-t3"]
    },
    {
        "slug": "vita-xtra-t",
        "skus": ["142625", "144133"],
        "cleanName": "Vita Xtra T+",
        "category": "energia-y-vitalidad",
        "badge": "Vitalidad",
        "isFlagship": True,
        "localBodegon": "/img/vita-xtra-t-bodegon.webp",
        "localHero": "/img/vita-xtra-t-hero.webp",
        "idealTime": "Tomar 1 stick en un vaso de agua fría (180 - 200 ml) por la mañana en el desayuno o antes de iniciar tu jornada laboral o entrenamiento.",
        "combos": ["on", "no-stress", "nutraday", "prunex1"]
    },
    {
        "slug": "thermo-t3",
        "skus": ["142623", "144136"],
        "cleanName": "Thermo T3",
        "category": "control-de-peso",
        "badge": "Metabolismo",
        "isFlagship": True,
        "localBodegon": "/img/thermo-t3-bodegon.webp",
        "localHero": "/img/thermo-t3-hero.webp",
        "idealTime": "Tomar en agua caliente después del almuerzo o cena como digestivo termogénico, o en agua fría/tibio 20 minutos antes de realizar actividad física.",
        "combos": ["nocarb-t", "biopro-fit", "prunex1", "pack-5-14-active-mito"]
    },
    {
        "slug": "no-stress",
        "skus": ["143070", "144135"],
        "cleanName": "NO STRESS (Off)",
        "category": "vigor-mental",
        "badge": "Calma",
        "isFlagship": True,
        "localBodegon": "/img/no-stress-bodegon.webp",
        "localHero": "/img/no-stress-bodegon.webp",
        "idealTime": "Disolver 1 stick en agua fría o tibia por la tarde después del trabajo o 1 hora antes de acostarte para relajar la mente y favorecer el descanso.",
        "combos": ["rezzt-plus", "youth-elixir", "vita-xtra-t", "on"]
    },
    {
        "slug": "youth-elixir",
        "skus": ["145082"],
        "cleanName": "Youth Elixir (HGH)",
        "category": "antiedad-y-belleza",
        "badge": "Vitalidad",
        "isFlagship": True,
        "localBodegon": "/img/youth-elixir-bodegon.webp",
        "localHero": "/img/youth-elixir-hero.webp",
        "idealTime": "Tomar 1 stick en un vaso de agua fría por la noche, aproximadamente 30 a 45 minutos antes de dormir, para aprovechar el ciclo nocturno de regeneración celular.",
        "combos": ["beauty-in", "golden-flx", "no-stress", "probal"]
    },
    {
        "slug": "beauty-in",
        "skus": ["143065"],
        "cleanName": "Beauty-In",
        "category": "antiedad-y-belleza",
        "badge": "Belleza",
        "isFlagship": True,
        "localBodegon": "/img/beauty-in-bodegon.webp",
        "localHero": "/img/beauty-in-hero.webp",
        "idealTime": "Tomar 1 stick diario en un vaso con 180 ml de agua fría a media mañana o antes de dormir, preferiblemente alejado de comidas pesadas para máxima absorción de los péptidos de colágeno.",
        "combos": ["youth-elixir", "golden-flx", "probal", "flora-liv"]
    },
    {
        "slug": "nocarb-t",
        "skus": ["142624"],
        "cleanName": "NoCarb-T",
        "category": "control-de-peso",
        "badge": "Glucosa",
        "isFlagship": True,
        "localBodegon": "/img/nocarb-t-bodegon.webp",
        "localHero": "/img/nocarb-t-hero.webp",
        "idealTime": "Tomar 1 stick en una taza de agua caliente o tibia inmediatamente durante o justo después del almuerzo o cena (especialmente en comidas con carbohidratos).",
        "combos": ["thermo-t3", "biopro-fit", "cafe-y-cafe-fit", "liquid-fiber"]
    },
    {
        "slug": "biopro-sport",
        "skus": ["143288", "141502"],
        "cleanName": "BioPro+ Sport",
        "category": "linea-sport",
        "badge": "Deporte",
        "isFlagship": True,
        "localBodegon": "/img/biopro-sport-bodegon.webp",
        "localHero": "/img/biopro-sport-hero.webp",
        "idealTime": "Batir 1 sobre (25 g) o 1 medida en 250 ml de agua fría dentro de los 30 minutos posteriores a terminar tu entrenamiento de fuerza o resistencia.",
        "combos": ["pre-sport", "post-sport", "xtra-mile", "protein-active-sport-chocolate-avellanas"]
    },
    {
        "slug": "biopro-tect",
        "skus": ["142169", "141503"],
        "cleanName": "BioPro+ Tect",
        "category": "regeneracion-y-nutricion",
        "badge": "Inmunidad",
        "isFlagship": True,
        "localBodegon": "/img/biopro-tect-bodegon.webp",
        "localHero": "/img/biopro-tect-hero.webp",
        "idealTime": "Disolver en 250 ml de agua fría con shaker en el desayuno, a media mañana o como merienda nutritiva para niños, adultos y adultos mayores.",
        "combos": ["nutraday", "vera-plus", "flora-liv", "probix"]
    },
    {
        "slug": "biopro-fit",
        "skus": ["142167"],
        "cleanName": "BioPro+ Fit",
        "category": "control-de-peso",
        "badge": "Figura",
        "isFlagship": True,
        "localBodegon": "/img/biopro-fit-bodegon.webp",
        "localHero": "/img/biopro-fit-hero.webp",
        "idealTime": "Tomar 1 batido a media mañana (11:00 a.m.) y/o a media tarde (5:00 p.m.) o como parte de una cena ligera para acelerar el metabolismo y evitar antojos.",
        "combos": ["thermo-t3", "nocarb-t", "chocolate-fit", "protein-xoup-crema-criolla"]
    },
    # Rest of Limpieza y Detox
    {
        "slug": "flora-liv",
        "skus": ["142953"],
        "cleanName": "Flora Liv",
        "category": "limpieza-y-detox",
        "badge": "Flora Intestinal",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick en un vaso de agua fría (siempre fría o al tiempo para cuidar los 10 mil millones de cultivos probióticos vivos) en ayunas o antes de dormir.",
        "combos": ["prunex1", "liquid-fiber", "probix", "alpha-balance"]
    },
    {
        "slug": "liquid-fiber",
        "skus": ["144289"],
        "cleanName": "Liquid Fiber",
        "category": "limpieza-y-detox",
        "badge": "Fibra Prebiótica",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick disuelto en 180 ml de agua fría junto con el desayuno o antes del almuerzo para regular el ritmo intestinal diario.",
        "combos": ["flora-liv", "prunex1", "nocarb-t", "probix"]
    },
    {
        "slug": "alpha-balance",
        "skus": ["145879"],
        "cleanName": "Alpha Balance",
        "category": "limpieza-y-detox",
        "badge": "Alcalinizante",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick en un vaso de agua fría en ayunas por la mañana para alcalinizar el pH del organismo y depurar toxinas desde la primera hora del día.",
        "combos": ["berry-balance", "flora-liv", "prunex1", "rexet"]
    },
    {
        "slug": "berry-balance",
        "skus": ["146065"],
        "cleanName": "Berry Balance",
        "category": "limpieza-y-detox",
        "badge": "Vías Urinarias",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en un vaso de agua fría o en tu tomatodo de 500 ml para beber a media mañana o durante la tarde, manteniendo las vías urinarias limpias.",
        "combos": ["alpha-balance", "flora-liv", "probal", "beauty-in"]
    },
    {
        "slug": "rexet",
        "skus": ["145993", "144175"],
        "cleanName": "Rexet",
        "category": "limpieza-y-detox",
        "badge": "Cuidado Hepático",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick efervescente en agua fría en ayunas, después de una comida copiosa o antes/después de una celebración para proteger e hidratar el hígado.",
        "combos": ["alpha-balance", "prunex1", "flora-liv", "programa-detox-5-dias"]
    },
    {
        "slug": "programa-detox-5-dias",
        "skus": ["144404"],
        "cleanName": "Programa Detox 5-Días",
        "category": "limpieza-y-detox",
        "badge": "Pack Detox Integral",
        "isFlagship": False,
        "idealTime": "Seguir el cronograma incluido de 5 días continuos que combina limpieza de colon, depuración hepática, alcalinización, vías urinarias, microbiota y proteínas.",
        "combos": ["flora-liv", "alpha-balance", "prunex1", "thermo-t3"]
    },
    {
        "slug": "probix",
        "skus": ["147232"],
        "cleanName": "Probix",
        "category": "limpieza-y-detox",
        "badge": "Probióticos",
        "isFlagship": False,
        "idealTime": "Añadir 1 stick (sabor neutro) a cualquier bebida fría o tibia, jugo o batido una vez al día para reforzar la microbiota intestinal y el sistema inmune.",
        "combos": ["flora-liv", "liquid-fiber", "nutraday", "biopro-tect"]
    },
    # Regeneración y Nutrición
    {
        "slug": "protein-active-chocolate-avellanas",
        "skus": ["143206"],
        "cleanName": "Protein Active — Chocolate con Avellanas",
        "category": "regeneracion-y-nutricion",
        "badge": "Proteína Vegana",
        "isFlagship": False,
        "idealTime": "Disolver 1 sobre (25 g) en 250 ml de agua fría en el desayuno o entre comidas como fuente de proteína 100% vegetal germinada de alta absorción.",
        "combos": ["protein-active-vainilla-canela", "flora-liv", "nutraday", "alpha-balance"]
    },
    {
        "slug": "protein-active-vainilla-canela",
        "skus": ["143205"],
        "cleanName": "Protein Active — Vainilla y Canela",
        "category": "regeneracion-y-nutricion",
        "badge": "Proteína Vegana",
        "isFlagship": False,
        "idealTime": "Disolver 1 sobre (25 g) en 250 ml de agua fría en el desayuno o como merienda saludable libre de alérgenos y lactosa.",
        "combos": ["protein-active-chocolate-avellanas", "flora-liv", "nutraday", "biopro-tect"]
    },
    {
        "slug": "nutraday",
        "skus": ["145716"],
        "cleanName": "Nutraday",
        "category": "regeneracion-y-nutricion",
        "badge": "Multivitamínico Familiar",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick en un vaso de agua fría (sabor fresa natural) en el desayuno o enviarlo en la lonchera escolar para aportar 12 vitaminas y 5 minerales.",
        "combos": ["biopro-tect", "flora-liv", "probix", "vitaenergia"]
    },
    # Energía y Vitalidad
    {
        "slug": "vitaenergia",
        "skus": ["10105"],
        "cleanName": "Vitaenergía",
        "category": "energia-y-vitalidad",
        "badge": "Multivitamínico Energético",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en agua fría por la mañana junto con el desayuno o al mediodía para mantener la vitalidad física y el bienestar general.",
        "combos": ["vita-xtra-t", "nutraday", "biopro-tect", "on"]
    },
    {
        "slug": "vita-xtra-t-mojito",
        "skus": ["151199"],
        "cleanName": "Vita Xtra T+ Sabor Mojito",
        "category": "energia-y-vitalidad",
        "badge": "Edición Especial",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en 200 ml de agua bien fría con hielo por la mañana o antes de entrenar para disfrutar energía antioxidante con refrescante sabor mojito.",
        "combos": ["vita-xtra-t", "vita-xtra-t-verano", "on", "thermo-t3"]
    },
    {
        "slug": "vita-xtra-t-verano",
        "skus": ["151200"],
        "cleanName": "Vita Xtra T+ Edición Verano",
        "category": "energia-y-vitalidad",
        "badge": "Edición Especial",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en 200 ml de agua fría por la mañana o a media tarde para recargar energía limpia con antioxidantes naturales.",
        "combos": ["vita-xtra-t", "vita-xtra-t-mojito", "xpeed", "pre-sport"]
    },
    {
        "slug": "xpeed",
        "skus": ["146291"],
        "cleanName": "Xpeed (Pack x 4 Latas)",
        "category": "energia-y-vitalidad",
        "badge": "Ready to Drink",
        "isFlagship": False,
        "idealTime": "Consumir bien fría directamente de la lata cuando necesites un impulso inmediato de energía natural y enfoque, libre de octógonos y azúcares artificiales.",
        "combos": ["xpeed-citrus-power", "vita-xtra-t", "on", "pre-sport"]
    },
    {
        "slug": "xpeed-citrus-power",
        "skus": ["146996"],
        "cleanName": "Xpeed Citrus Power (Pack x 4 Latas)",
        "category": "energia-y-vitalidad",
        "badge": "Ready to Drink",
        "isFlagship": False,
        "idealTime": "Consumir bien fría antes de conducir, estudiar, trabajar o entrenar para una recarga instantánea con extractos cítricos y cafeína natural.",
        "combos": ["xpeed", "vita-xtra-t", "on", "iq-plus"]
    },
    {
        "slug": "matcha-pep-t",
        "skus": ["151023"],
        "cleanName": "Matcha Pep-T",
        "category": "energia-y-vitalidad",
        "badge": "Té Matcha + Péptidos",
        "isFlagship": False,
        "idealTime": "Preparar en agua caliente o fría con hielo a media mañana o media tarde para obtener energía serena, antioxidantes EGCG y nutrición peptídica.",
        "combos": ["beauty-in", "vita-xtra-t", "no-stress", "golden-flx"]
    },
    # Inmunológica
    {
        "slug": "vera-plus",
        "skus": ["143069"],
        "cleanName": "Vera+",
        "category": "inmunologica",
        "badge": "Defensas y Pulmones",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick disuelto en una taza de agua caliente o tibia por la noche o por la mañana para fortalecer las defensas y despejar las vías respiratorias.",
        "combos": ["gano-plus-t", "gano-plus-cappuccino", "biopro-tect", "flora-liv"]
    },
    {
        "slug": "gano-plus-t",
        "skus": ["146264", "144291"],
        "cleanName": "Gano+ T",
        "category": "inmunologica",
        "badge": "Ganoderma Lucidum",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en una taza de agua caliente a media mañana o después del almuerzo para potenciar las defensas con extracto de hongo Reishi (Ganoderma).",
        "combos": ["vera-plus", "gano-plus-cappuccino", "cafe-ganomax", "golden-flx"]
    },
    {
        "slug": "gano-plus-cappuccino",
        "skus": ["142627"],
        "cleanName": "Gano+ Cappuccino",
        "category": "inmunologica",
        "badge": "Cappuccino Inmunológico",
        "isFlagship": False,
        "idealTime": "Preparar con 180 ml de agua caliente en el desayuno o a media tarde como un delicioso cappuccino cremoso enriquecido con Ganoderma lucidum.",
        "combos": ["cafe-ganomax", "gano-plus-t", "vera-plus", "chocolate-fit"]
    },
    {
        "slug": "cafe-ganomax",
        "skus": ["141293"],
        "cleanName": "Café Ganomax",
        "category": "inmunologica",
        "badge": "Café Gourmet + Reishi",
        "isFlagship": False,
        "idealTime": "Tomar 1 taza en agua caliente por la mañana o después de comer para disfrutar café colombiano gourmet potenciado con Ganoderma y uña de gato.",
        "combos": ["gano-plus-cappuccino", "vera-plus", "gano-plus-t", "cafe-y-cafe-fit"]
    },
    # Control de Peso
    {
        "slug": "protein-active-fit-chocolate-avellanas",
        "skus": ["143208"],
        "cleanName": "Protein Active Fit — Chocolate con Avellanas",
        "category": "control-de-peso",
        "badge": "Proteína Vegana Fit",
        "isFlagship": False,
        "idealTime": "Batir en 250 ml de agua fría a media mañana y/o media tarde para controlar el apetito y tonificar con proteína 100% vegetal.",
        "combos": ["thermo-t3", "nocarb-t", "pack-5-14-active-mito", "protein-active-fit-vainilla-canela"]
    },
    {
        "slug": "protein-active-fit-vainilla-canela",
        "skus": ["143207"],
        "cleanName": "Protein Active Fit — Vainilla y Canela",
        "category": "control-de-peso",
        "badge": "Proteína Vegana Fit",
        "isFlagship": False,
        "idealTime": "Batir en 250 ml de agua fría entre comidas o como cena ligera para reducir medidas cuidando la masa muscular sin lácteos.",
        "combos": ["thermo-t3", "nocarb-t", "pack-5-14-active-mito", "protein-active-fit-chocolate-avellanas"]
    },
    {
        "slug": "cafe-y-cafe-fit",
        "skus": ["144293"],
        "cleanName": "Café & Café Fit",
        "category": "control-de-peso",
        "badge": "Café Verde Termogénico",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en una taza de agua caliente en el desayuno o a media tarde para controlar la ansiedad por comer y apoyar la oxidación de grasas.",
        "combos": ["cafe-y-cafe-fit-cappuccino", "thermo-t3", "nocarb-t", "chocolate-fit"]
    },
    {
        "slug": "cafe-y-cafe-fit-cappuccino",
        "skus": ["141448"],
        "cleanName": "Café & Café Fit Cappuccino",
        "category": "control-de-peso",
        "badge": "Cappuccino Fit",
        "isFlagship": False,
        "idealTime": "Preparar en una taza con agua caliente a media mañana o media tarde para calmar los antojos dulces mientras el café verde trabaja en tu metabolismo.",
        "combos": ["cafe-y-cafe-fit", "chocolate-fit", "biopro-fit", "nocarb-t"]
    },
    {
        "slug": "chocolate-fit",
        "skus": ["142478"],
        "cleanName": "Chocolate Fit",
        "category": "control-de-peso",
        "badge": "Cacao Fit sin Culpa",
        "isFlagship": False,
        "idealTime": "Preparar en una taza de agua caliente por la tarde o noche cuando tengas antojo de chocolate caliente, aportando saciedad y antioxidantes con café verde.",
        "combos": ["cafe-y-cafe-fit-cappuccino", "biopro-fit", "thermo-t3", "nocarb-t"]
    },
    {
        "slug": "protein-xoup-crema-criolla",
        "skus": ["142456"],
        "cleanName": "Protein Xoup — Crema Criolla",
        "category": "control-de-peso",
        "badge": "Sopa Proteica",
        "isFlagship": False,
        "idealTime": "Disolver en una taza de agua recién hervida como almuerzo ligero o cena reconfortante alta en proteína y fibra con auténtico toque criollo peruano.",
        "combos": ["protein-xoup-brocoli-parmesano", "biopro-fit", "thermo-t3", "nocarb-t"]
    },
    {
        "slug": "protein-xoup-brocoli-parmesano",
        "skus": ["142455"],
        "cleanName": "Protein Xoup — Crema de Brócoli Parmesano",
        "category": "control-de-peso",
        "badge": "Sopa Proteica",
        "isFlagship": False,
        "idealTime": "Disolver en agua caliente para disfrutar una cena caliente, saciante y baja en calorías que nutre tus músculos.",
        "combos": ["protein-xoup-crema-criolla", "protein-xoup-esparragos-alcachofa", "biopro-fit", "nocarb-t"]
    },
    {
        "slug": "protein-xoup-esparragos-alcachofa",
        "skus": ["142457"],
        "cleanName": "Protein Xoup — Crema de Espárragos y Alcachofa",
        "category": "control-de-peso",
        "badge": "Sopa Proteica",
        "isFlagship": False,
        "idealTime": "Preparar con agua caliente como entrada nutritiva o cena ligera rica en proteína bioactiva y fibra prebiótica.",
        "combos": ["protein-xoup-crema-criolla", "protein-xoup-brocoli-parmesano", "biopro-fit", "thermo-t3"]
    },
    {
        "slug": "pack-5-14-active-mito",
        "skus": ["144915"],
        "cleanName": "Pack 5/14 Active Mito",
        "category": "control-de-peso",
        "badge": "Programa 14 Días Vegano",
        "isFlagship": False,
        "idealTime": "Seguir el plan de alimentación de 14 días incluido en la caja, tomando los productos asignados en desayuno, media mañana, almuerzo, media tarde y noche.",
        "combos": ["pack-5-14-keto", "thermo-t3", "nocarb-t", "protein-active-fit-chocolate-avellanas"]
    },
    {
        "slug": "pack-5-14-keto",
        "skus": ["145259"],
        "cleanName": "Pack 5/14 Keto",
        "category": "control-de-peso",
        "badge": "Programa 14 Días Cetogénico",
        "isFlagship": False,
        "idealTime": "Seguir la guía nutricional cetogénica de 14 días incluida en el pack para activar la cetosis nutricional y reducir grasa corporal de forma acelerada.",
        "combos": ["pack-5-14-active-mito", "thermo-t3", "cafe-y-cafe-fit", "biopro-fit"]
    },
    {
        "slug": "combo-ponte-en-forma",
        "skus": ["146772"],
        "cleanName": "Combo Ponte en Forma",
        "category": "control-de-peso",
        "badge": "Combo Integral",
        "isFlagship": False,
        "idealTime": "Combinación sinérgica mensual de los productos clave de control de peso, limpieza y tonificación para resultados integrales en 30 días.",
        "combos": ["thermo-t3", "nocarb-t", "biopro-fit", "prunex1"]
    },
    {
        "slug": "limitlex-snack-recharge",
        "skus": ["151472"],
        "cleanName": "Limitlex Snack Recharge+",
        "category": "control-de-peso",
        "badge": "Snack Funcional",
        "isFlagship": False,
        "idealTime": "Consumir a media mañana o media tarde como snack funcional saludable para recargar energía y calmar el apetito sin azúcares refinados.",
        "combos": ["biopro-fit", "cafe-y-cafe-fit", "vita-xtra-t", "thermo-t3"]
    },
    # Anti-Edad y Belleza
    {
        "slug": "golden-flx",
        "skus": ["143142"],
        "cleanName": "Golden FLX",
        "category": "antiedad-y-belleza",
        "badge": "Articulaciones y Cúrcuma",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en una taza de agua caliente o tibia en cualquier momento del día (excelente después de entrenar o por la noche) como una deliciosa leche dorada.",
        "combos": ["beauty-in", "youth-elixir", "biopro-sport", "post-sport"]
    },
    {
        "slug": "probal",
        "skus": ["143068", "142472"],
        "cleanName": "Probal",
        "category": "antiedad-y-belleza",
        "badge": "Equilibrio Hormonal",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick disuelto en una taza de agua caliente por la noche o a media tarde para promover la armonía hormonal femenina y el confort mensual.",
        "combos": ["beauty-in", "youth-elixir", "no-stress", "berry-balance"]
    },
    {
        "slug": "passion",
        "skus": ["143067", "142477"],
        "cleanName": "Passion",
        "category": "antiedad-y-belleza",
        "badge": "Vigor y Circulación",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en un vaso de agua fría por la mañana o por la noche para potenciar la energía, oxigenación, circulación sanguínea y vigor.",
        "combos": ["vita-xtra-t", "youth-elixir", "probal", "pre-sport"]
    },
    {
        "slug": "zoom-in",
        "skus": ["151242"],
        "cleanName": "Zoom-In",
        "category": "antiedad-y-belleza",
        "badge": "Salud Visual",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick diario en agua fría por la mañana, especialmente si trabajas muchas horas frente a computadoras, celulares o pantallas.",
        "combos": ["iq-plus", "on", "youth-elixir", "beauty-in"]
    },
    # Vigor Mental
    {
        "slug": "on",
        "skus": ["143066", "144134"],
        "cleanName": "ON",
        "category": "vigor-mental",
        "badge": "Enfoque y Memoria",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick en un vaso de agua fría por la mañana o antes de sesiones intensas de estudio, reuniones o trabajo intelectual.",
        "combos": ["iq-plus", "vita-xtra-t", "no-stress", "zoom-in"]
    },
    {
        "slug": "iq-plus",
        "skus": ["151245"],
        "cleanName": "IQ+",
        "category": "vigor-mental",
        "badge": "Nootrópico Avanzado",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en agua fría por la mañana para potenciar la agilidad mental, el aprendizaje, la neuroprotección y el enfoque sostenido.",
        "combos": ["on", "zoom-in", "no-stress", "rezzt-plus"]
    },
    {
        "slug": "rezzt-plus",
        "skus": ["151248"],
        "cleanName": "Rezzt+",
        "category": "vigor-mental",
        "badge": "Sueño Reparador",
        "isFlagship": False,
        "idealTime": "Tomar 1 stick en agua fría o tibia 30 minutos antes de acostarte para conciliar un sueño profundo y despertar renovado sin somnolencia residual.",
        "combos": ["no-stress", "youth-elixir", "probal", "prunex1"]
    },
    # Línea Sport
    {
        "slug": "protein-active-sport-chocolate-avellanas",
        "skus": ["143287"],
        "cleanName": "Protein Active Sport — Chocolate con Avellanas",
        "category": "linea-sport",
        "badge": "Proteína Sport Vegana",
        "isFlagship": False,
        "idealTime": "Tomar 1 sobre en 250 ml de agua fría inmediatamente después de entrenar para acelerar la síntesis proteica muscular con aminoácidos vegetales y BCAA.",
        "combos": ["pre-sport", "post-sport", "xtra-mile", "protein-active-sport-vainilla-canela"]
    },
    {
        "slug": "protein-active-sport-vainilla-canela",
        "skus": ["143286"],
        "cleanName": "Protein Active Sport — Vainilla y Canela",
        "category": "linea-sport",
        "badge": "Proteína Sport Vegana",
        "isFlagship": False,
        "idealTime": "Tomar 1 sobre en 250 ml de agua fría después del ejercicio físico para promover masa muscular magra 100% libre de lácteos.",
        "combos": ["pre-sport", "post-sport", "xtra-mile", "protein-active-sport-chocolate-avellanas"]
    },
    {
        "slug": "pre-sport",
        "skus": ["143284"],
        "cleanName": "Pre Sport",
        "category": "linea-sport",
        "badge": "Pre-Entreno",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en 200 ml de agua fría entre 15 y 20 minutos antes de iniciar tu entrenamiento o competencia deportiva.",
        "combos": ["post-sport", "biopro-sport", "xtra-mile", "golden-flx"]
    },
    {
        "slug": "post-sport",
        "skus": ["143285"],
        "cleanName": "Post Sport",
        "category": "linea-sport",
        "badge": "Post-Entreno y Glutamina",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en 200 ml de agua fría justo al finalizar tu rutina física para reponer electrolitos, L-glutamina y evitar el catabolismo y dolor muscular.",
        "combos": ["pre-sport", "biopro-sport", "xtra-mile", "golden-flx"]
    },
    {
        "slug": "xtra-mile",
        "skus": ["143283"],
        "cleanName": "Xtra Mile",
        "category": "linea-sport",
        "badge": "Intra-Entreno Isotónico",
        "isFlagship": False,
        "idealTime": "Disolver 1 stick en tu tomatodo de 500 ml de agua fría y beber por sorbos durante entrenamientos prolongados (running, ciclismo, fútbol, gimnasio).",
        "combos": ["pre-sport", "post-sport", "biopro-sport", "golden-flx"]
    },
    # Gastronomía y Accesorios
    {
        "slug": "base-madre-verde",
        "skus": ["147146"],
        "cleanName": "Base Madre Verde (Culantro y Espinaca)",
        "category": "gastronomia-y-accesorios",
        "badge": "Gastronomía Saludable",
        "isFlagship": False,
        "idealTime": "Agregar directamente a tus guisos peruanos (arroz con pollo, seco de carne, aguadito, sopas) durante la cocción para dar sabor auténtico con hierro y fibra.",
        "combos": ["base-madre-amarilla", "base-madre-roja", "protein-xoup-crema-criolla", "liquid-fiber"]
    },
    {
        "slug": "base-madre-amarilla",
        "skus": ["147147"],
        "cleanName": "Base Madre Amarilla (Ají Amarillo)",
        "category": "gastronomia-y-accesorios",
        "badge": "Gastronomía Saludable",
        "isFlagship": False,
        "idealTime": "Ideal para preparar ají de gallina, causa limeña, cremas y aderezos peruanos sin conservantes artificiales y enriquecidos con nutrientes.",
        "combos": ["base-madre-verde", "base-madre-roja", "protein-xoup-crema-criolla", "golden-flx"]
    },
    {
        "slug": "base-madre-roja",
        "skus": ["147148"],
        "cleanName": "Base Madre Roja (Ají Panca y Tomate)",
        "category": "gastronomia-y-accesorios",
        "badge": "Gastronomía Saludable",
        "isFlagship": False,
        "idealTime": "Perfecta para aderezos de carapulcra, estofados, adobos y salsas rojas tradicionales con ingredientes 100% limpios y antioxidantes naturales.",
        "combos": ["base-madre-verde", "base-madre-amarilla", "protein-xoup-crema-criolla", "alpha-balance"]
    },
    {
        "slug": "tomatodo-azul",
        "skus": ["141146"],
        "cleanName": "Tomatodo Oficial FuXion Azul",
        "category": "gastronomia-y-accesorios",
        "badge": "Accesorio Oficial",
        "isFlagship": False,
        "idealTime": "Ideal para llevar y mezclar tus bebidas frías FuXion (Vita Xtra T+, Flora Liv, Alpha Balance, Berry Balance) al trabajo, universidad o gimnasio.",
        "combos": ["tomatodo-beauty-in-shaker", "tomatodo-sport-pro-edition", "vita-xtra-t", "alpha-balance"]
    },
    {
        "slug": "tomatodo-beauty-in-shaker",
        "skus": ["149027"],
        "cleanName": "Tomatodo Beauty-In con Shaker",
        "category": "gastronomia-y-accesorios",
        "badge": "Accesorio Oficial",
        "isFlagship": False,
        "idealTime": "Diseñado con mezclador interno para disolver a la perfección tu Beauty-In, Youth Elixir o batidos proteicos sin dejar grumos.",
        "combos": ["beauty-in", "youth-elixir", "probal", "biopro-fit"]
    },
    {
        "slug": "tomatodo-sport-pro-edition",
        "skus": ["149028"],
        "cleanName": "Tomatodo Sport Pro Edition",
        "category": "gastronomia-y-accesorios",
        "badge": "Accesorio Oficial",
        "isFlagship": False,
        "idealTime": "Shaker de alta resistencia para preparar tus batidos BioPro+ Sport, Protein Active Sport, Pre Sport, Post Sport y Xtra Mile en el gimnasio.",
        "combos": ["biopro-sport", "pre-sport", "post-sport", "xtra-mile"]
    }
]

CUSTOM_FALLBACKS = {
    "151200": {
        "descripcion": "Edición especial de verano de Vita Xtra T+, la bebida funcional antioxidante y energizante más querida de FuXion Perú. Combina extractos herbales amazónicos y andinos como guayusa, té verde, acai berry, goji berry, maca y micelios de cordyceps para brindarte energía limpia y duradera sin azúcar.",
        "beneficios": "- Te ayuda a mantenerte alerta, activo y de buen ánimo durante todo el día.\n- Mejora el rendimiento físico y el desempeño diario sin causar nerviosismo.\n- Reduce la oxidación celular y el efecto de los radicales libres gracias a sus antocianinas y antioxidantes.\n- Endulzado con glucósidos de esteviol (stevia) y libre de octógonos.",
        "ingredientes": "GUAYUSA + TÉ VERDE + ACAI BERRY + GOJI BERRY + MACA + MICELIOS DE CORDYCEPS + GINSENG + ANTOCIANINAS + VITAMINA C + COMPLEJO B + CROMO + ZINC",
        "preparacion": "Disuelve el contenido de un stick (5 g) en un vaso con 180 ml de agua fría y mezcla bien."
    },
    "151199": {
        "ingredientes": "GUAYUSA + TÉ VERDE + ACAI BERRY + GOJI BERRY + MACA + MICELIOS DE CORDYCEPS + EXTRACTO DE HIERBABUENA Y LIMÓN (SABOR MOJITO) + VITAMINA C + MAGNESIO + ZINC"
    },
    "151472": {
        "descripcion": "Limitlex Snack Recharge+ es el snack funcional inteligente de FuXion diseñado para recargar tu energía entre comidas, aportar nutrientes limpios y calmar el apetito de forma práctica y deliciosa sin azúcares refinados.",
        "beneficios": "- Aporta saciedad saludable a media mañana o media tarde.\n- Brinda energía limpia para continuar tus actividades diarias sin picos de glucosa.\n- Formulado bajo estándares Clean Label (Etiqueta Limpia), sin conservantes artificiales.",
        "ingredientes": "PROTEÍNAS VEGETALES + FIBRAS PREBIÓTICAS + EXTRACTOS FRUTALES Y SEMILLAS NATURALES + VITAMINAS Y MINERALES",
        "preparacion": "Listo para consumir como snack saludable a media mañana o media tarde."
    },
    "146772": {
        "descripcion": "El Combo Ponte en Forma de FuXion Perú reúne la sinergia completa de productos termogénicos, reductores de carbohidratos, proteínas saciantes y limpieza digestiva para acelerar la pérdida de grasa corporal, tonificar músculos y mejorar tu composición física.",
        "beneficios": "- Acelera el metabolismo energético para promover la oxidación de grasas acumuladas.\n- Ayuda a reducir la asimilación de carbohidratos y azúcares de las comidas.\n- Controla la ansiedad por comer y nutre la masa muscular magra.\n- Promueve un tránsito intestinal saludable para una mejor absorción de nutrientes.",
        "ingredientes": "COMBINACIÓN SINÉRGICA DE PROTEÍNAS BIOACTIVAS + TÉS TERMOGÉNICOS + FIBRAS PREBIÓTICAS + EXTRACTOS BOTÁNICOS + CROMO + L-CARNITINA",
        "preparacion": "Sigue la rutina diaria tomando cada producto del combo en su horario recomendado (mañana, almuerzo, media tarde y noche)."
    },
    "151245": {
        "beneficios": "- Potencia el enfoque mental, la concentración y la capacidad de aprendizaje.\n- Apoya la memoria a corto y largo plazo y la velocidad de procesamiento cognitivo.\n- Protege las neuronas frente al estrés oxidativo y combate la fatiga mental.\n- Ideal para profesionales, estudiantes, emprendedores y gamers.",
        "preparacion": "Disuelve el contenido de 1 stick (2 g) en un vaso con 180 ml de agua fría y consúmelo por la mañana."
    },
    "151023": {
        "beneficios": "- Brinda energía limpia y enfoque sereno gracias a la sinergia natural del té matcha japonés y la L-teanina.\n- Aporta péptidos bioactivos que nutren los tejidos y favorecen la regeneración celular.\n- Altísima concentración de catequinas antioxidantes (EGCG) que protegen tus células.\n- Apoya el metabolismo saludable y la vitalidad diaria.",
        "ingredientes": "TÉ MATCHA JAPONÉS CEREMONIAL + PÉPTIDOS DE COLÁGENO BIOACTIVO + L-TEANINA + ANTIOXIDANTES NATURALES + VITAMINAS",
        "preparacion": "Disuelve 1 sobre (15 g) en 180 ml de agua caliente o fría con hielo y agita hasta obtener una textura cremosa."
    },
    "141146": {
        "beneficios": "- Material libre de BPA, seguro para uso alimentario diario.\n- Tapa hermética antiderrames ideal para llevar en la mochila, cartera o al gimnasio.\n- Medidor de mililitros grabado para preparar tus sticks FuXion con la proporción exacta de agua.",
        "ingredientes": "POLIPROPILENO DE GRADO ALIMENTARIO 100% LIBRE DE BPA",
        "preparacion": "Agrega 180 ml a 250 ml de agua, vierte tu stick FuXion favorito, cierra bien la tapa y agita durante 10 segundos."
    },
    "149027": {
        "beneficios": "- Incluye rejilla/shaker mezclador para disolver colágeno y proteínas sin grumos.\n- Diseño ergonómico edición especial Beauty-In libre de BPA.\n- Cierre seguro antiderrames para llevar tu rutina de belleza y bienestar a cualquier lugar.",
        "ingredientes": "POLIPROPILENO DE GRADO ALIMENTARIO 100% LIBRE DE BPA CON MEZCLADOR INTERNO",
        "preparacion": "Vierte primero el agua fría, añade tu sobre de Beauty-In o batido FuXion, coloca el shaker y agita enérgicamente."
    },
    "149028": {
        "beneficios": "- Edición deportiva de alta capacidad y resistencia con mezclador interno.\n- Mezcla batidos proteicos (BioPro+ Sport, Protein Active) en segundos con textura suave.\n- Libre de BPA, fácil de lavar y con boquilla deportiva antiderrames.",
        "ingredientes": "POLIPROPILENO DE GRADO ALIMENTARIO DE ALTA RESISTENCIA 100% LIBRE DE BPA",
        "preparacion": "Agrega 250 ml de agua fría, incorpora tu proteína o bebida deportiva FuXion y agita vigorosamente."
    }
}

def clean_benefits(raw_ben: str, clean_name: str) -> list[str]:
    if not raw_ben:
        return [
            f"Fórmula nutracéutica 100% natural con sello Clean Label (Etiqueta Limpia).",
            f"Elaborado por FuXion Biotech SAC en Perú bajo certificaciones HACCP y BPM.",
            f"Libre de azúcares añadidos, colorantes y conservantes artificiales."
        ]
    lines = [l.strip() for l in raw_ben.replace("\r", "\n").split("\n") if l.strip()]
    bullets = []
    for line in lines:
        # Skip intro lines ending with ":"
        if line.endswith(":"):
            continue
        cleaned = re.sub(r"^[\-\.\•\*]+\s*", "", line).strip()
        if cleaned and len(cleaned) > 6:
            if not cleaned[0].isupper():
                cleaned = cleaned[0].upper() + cleaned[1:]
            bullets.append(cleaned)
    return bullets if bullets else [raw_ben.strip()]

def parse_ingredients(raw_ing: str) -> list[str]:
    if not raw_ing:
        return ["Extractos botánicos amazónicos y andinos", "Vitaminas y minerales aminoácido-quelados", "Stevia natural (Glucósidos de esteviol)"]
    parts = [p.strip() for p in raw_ing.split("+") if p.strip()]
    return [p.title() for p in parts]

def build_faqs(clean_name: str, price_fmt: str, pack: str, ideal_time: str, ingredients_str: str, category_name: str) -> list[dict]:
    return [
        {
            "question": f"¿Para qué sirve {clean_name} de FuXion y qué beneficios tiene?",
            "answer": f"{clean_name} pertenece a la {category_name} de FuXion® y está formulado bajo el concepto de Fusión Nutracéutica® con ingredientes activos concentrados ({ingredients_str.lower() if ingredients_str else 'extractos naturales, vitaminas y minerales'}). Ayuda a potenciar el funcionamiento específico de tu organismo de forma 100% natural, sin químicos ni azúcares añadidos."
        },
        {
            "question": f"¿Cuál es el precio oficial de {clean_name} en Perú?",
            "answer": f"El precio oficial de catálogo de {clean_name} en su presentación principal ({pack}) es de {price_fmt} (Soles peruanos, IGV incluido). Al comprar a través del enlace directo hacia la Tienda Oficial FuXion Perú (shop.site.fuxion.com), accedes al precio oficial sin intermediarios y con garantía de autenticidad."
        },
        {
            "question": f"¿Cómo se prepara y a qué hora es mejor tomar {clean_name}?",
            "answer": f"{ideal_time} Recuerda revolver o agitar bien hasta que el contenido del sobre se disuelva por completo y consumirlo recién preparado para aprovechar todos sus principios activos."
        },
        {
            "question": f"¿{clean_name} tiene contraindicaciones o contiene azúcar?",
            "answer": f"No contiene azúcar añadida ni conservantes artificiales; cuenta con certificación Clean Label (Etiqueta Limpia) y está endulzado naturalmente con stevia. Es un alimento nutracéutico (no es un medicamento). Si estás embarazada, dando de lactar o bajo tratamiento médico específico, se recomienda consultar previamente con tu médico."
        },
        {
            "question": f"¿Cómo comprar {clean_name} original en Lima y provincias del Perú?",
            "answer": f"Solo debes hacer clic en el botón «Comprar en Tienda Oficial» de esta página. Serás dirigido directamente a la ficha oficial de {clean_name} en shop.site.fuxion.com, donde podrás pagar de forma 100% segura con tarjeta Visa, Mastercard, Amex, Diners o medios locales y recibir tu pedido en la puerta de tu casa en Lima o cualquier provincia del Perú."
        }
    ]

def main():
    raw_skus = json.load(open(RAW_PATH, encoding="utf-8"))
    sku_map = {str(item["sku"]): item for item in raw_skus}
    cat_map = {c["slug"]: c for c in CATEGORIES}

    used_skus = set()
    products = []

    for cfg in PRODUCT_CONFIG:
        slug = cfg["slug"]
        skus = cfg["skus"]
        used_skus.update(skus)
        primary_raw = sku_map[skus[0]]
        sku_id = primary_raw["sku"]

        # Apply custom fallbacks if needed
        tabs = dict(primary_raw.get("tabs") or {})
        fb = CUSTOM_FALLBACKS.get(sku_id, {})
        for k, v in fb.items():
            if not tabs.get(k):
                tabs[k] = v

        desc = (tabs.get("descripcion") or primary_raw.get("short") or "").strip()
        raw_ben = (tabs.get("beneficios") or "").strip()
        raw_ing = (tabs.get("ingredientes") or "").strip()
        prep = (tabs.get("preparacion") or "Disolver el contenido de un sobre en 180 ml de agua.").strip()
        nutri_img = (tabs.get("infNutricional") or "").strip()
        video_url = (primary_raw.get("video") or tabs.get("video") or "").strip()

        benefits_list = clean_benefits(raw_ben, cfg["cleanName"])
        ingredients_list = parse_ingredients(raw_ing)

        # Build presentations list for all SKUs of this product
        presentations = []
        for s_code in skus:
            s_raw = sku_map[s_code]
            presentations.append({
                "sku": s_code,
                "name": s_raw["name"],
                "pack": s_raw["pack"] or "Unidad Oficial",
                "price": s_raw["price"],
                "formattedPrice": f"S/ {s_raw['price']:.2f}",
                "points": s_raw["points"],
                "sticks": s_raw.get("sticks") or 0,
                "perStickFormatted": (s_raw.get("per_stick_formatted") or "").replace("S/", "S/ "),
                "inStock": s_raw.get("in_stock", True),
                "shopUrl": s_raw["shop_url"],
                "directProductUrl": s_raw["direct_product_url"],
                "isLanding": s_raw["is_landing"],
                "gallery": s_raw.get("gallery") or []
            })

        cat_obj = cat_map[cfg["category"]]
        formatted_price = f"S/ {primary_raw['price']:.2f}"
        pack_str = primary_raw["pack"] or "Presentación Oficial"
        gallery_imgs = list(primary_raw.get("gallery") or [])
        main_img = cfg.get("localBodegon") or (gallery_imgs[0] if gallery_imgs else "/img/prunex1-bodegon.webp")
        hero_img = cfg.get("localHero") or main_img

        short_desc = desc if len(desc) <= 185 else desc[:182].rsplit(" ", 1)[0] + "..."

        product_entry = {
            "slug": slug,
            "sku": sku_id,
            "allSkus": skus,
            "name": primary_raw["name"],
            "cleanName": cfg["cleanName"],
            "categorySlug": cfg["category"],
            "categoryName": cat_obj["name"],
            "categoryShortName": cat_obj["shortName"],
            "badge": cfg["badge"],
            "isFlagship": cfg.get("isFlagship", False),
            "price": primary_raw["price"],
            "formattedPrice": formatted_price,
            "pack": pack_str,
            "points": primary_raw["points"],
            "sticks": primary_raw.get("sticks") or 0,
            "perStickFormatted": (primary_raw.get("per_stick_formatted") or "").replace("S/", "S/ "),
            "inStock": any(p["inStock"] for p in presentations),
            "shopUrl": primary_raw["shop_url"],
            "directProductUrl": primary_raw["direct_product_url"],
            "mainImage": main_img,
            "bodegonImage": cfg.get("localBodegon") or (gallery_imgs[0] if gallery_imgs else main_img),
            "heroImage": hero_img,
            "gallery": gallery_imgs,
            "nutritionalImage": nutri_img,
            "videoUrl": video_url,
            "shortDescription": short_desc,
            "description": desc,
            "benefits": benefits_list,
            "ingredientsRaw": raw_ing,
            "ingredients": ingredients_list,
            "preparation": prep,
            "idealTime": cfg["idealTime"],
            "recommendedCombinations": cfg["combos"],
            "presentations": presentations,
            "seoTitle": f"{cfg['cleanName']} FuXion Perú: Para qué sirve, Beneficios y Precio ({formatted_price})",
            "seoDescription": f"Compra {cfg['cleanName']} original de FuXion en Perú a {formatted_price} ({pack_str}). Conoce para qué sirve, beneficios, ingredientes, cómo tomarlo y pide con envío a Lima y provincias.",
            "faqs": build_faqs(cfg["cleanName"], formatted_price, pack_str, cfg["idealTime"], raw_ing, cat_obj["name"])
        }
        products.append(product_entry)

    # Verify we didn't miss any of the 72 SKUs
    missing = set(sku_map.keys()) - used_skus
    if missing:
        print(f"[ERROR] Missing SKUs: {missing}")
    else:
        print(f"All {len(sku_map)} SKUs mapped into {len(products)} canonical SEO products!")

    with open(CATEGORIES_OUT, "w", encoding="utf-8") as f:
        json.dump(CATEGORIES, f, ensure_ascii=False, indent=2)
    with open(PRODUCTS_OUT, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(CATEGORIES)} categories to {CATEGORIES_OUT}")
    print(f"Saved {len(products)} products (covering {len(used_skus)} SKUs) to {PRODUCTS_OUT}")

if __name__ == "__main__":
    main()
