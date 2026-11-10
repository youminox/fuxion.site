#!/usr/bin/env python3
"""
Generates 105 high-value SEO articles for fuxion.site (Peru market, PEN / S/)
in src/data/articles.json. Every article embeds a Transactional Product Card
linking directly to the official product URL on https://shop.site.fuxion.com/.
"""
import json
import os
import re
import unicodedata

BASE_DIR = "/Users/charlie/Documents/Google Antigravity/fuxion.site"
PRODUCTS_PATH = os.path.join(BASE_DIR, "src", "data", "products.json")
ARTICLES_OUT = os.path.join(BASE_DIR, "src", "data", "articles.json")

def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text

# 105 curated SEO articles across 6 strategic clusters
ARTICLE_SPECS = [
    # CLUSTER 1: Guías Definitivas de Productos (30 artículos)
    ("prunex1-fuxion-para-que-sirve-como-tomar-precio-peru",
     "Prunex1 FuXion: Para qué sirve, cómo tomarlo de noche y precio en Perú",
     "guias-de-productos", "Guías de Productos FuXion", "prunex1",
     "limpieza de colon, alivio del estreñimiento y tránsito intestinal nocturno"),
    ("thermo-t3-fuxion-como-tomar-quemar-grasa-precio-peru",
     "Thermo T3 FuXion: Cómo tomarlo para quemar grasa, beneficios y precio en Perú",
     "guias-de-productos", "Guías de Productos FuXion", "thermo-t3",
     "termogénesis natural, oxidación de grasas y aceleración del metabolismo"),
    ("vita-xtra-t-fuxion-beneficios-energizante-natural-peru",
     "Vita Xtra T+ FuXion: Beneficios del energizante natural con acai y guayusa",
     "guias-de-productos", "Guías de Productos FuXion", "vita-xtra-t",
     "energía física sostenida, poder antioxidante y vitalidad diaria sin azúcar"),
    ("beauty-in-fuxion-colageno-bioactivo-beneficios-precio-peru",
     "Beauty-In FuXion: Todo sobre el colágeno bioactivo optimizado para la piel",
     "guias-de-productos", "Guías de Productos FuXion", "beauty-in",
     "elasticidad de la dermis, nutrición celular de la piel, cabello y uñas"),
    ("flora-liv-fuxion-para-que-sirve-probioticos-como-tomar",
     "Flora Liv FuXion: Para qué sirve, cuántos probióticos tiene y cómo tomarlo",
     "guias-de-productos", "Guías de Productos FuXion", "flora-liv",
     "regeneración de la flora intestinal, alivio de la gastritis y defensas digestivas"),
    ("alpha-balance-fuxion-beneficios-bebida-alcalinizante-clorofila",
     "Alpha Balance FuXion: Beneficios de la bebida alcalinizante con clorofila y espirulina",
     "guias-de-productos", "Guías de Productos FuXion", "alpha-balance",
     "equilibrio del pH corporal, depuración de metales pesados y oxigenación celular"),
    ("berry-balance-fuxion-vias-urinarias-retencion-liquidos-peru",
     "Berry Balance FuXion: Cómo cuidar las vías urinarias y prevenir la retención de líquidos",
     "guias-de-productos", "Guías de Productos FuXion", "berry-balance",
     "bienestar del tracto urinario, diuresis saludable con cranberry y equilibrio hídrico"),
    ("liquid-fiber-fuxion-fibra-prebiotica-digestion-diaria",
     "Liquid Fiber FuXion: Fibra prebiótica diaria para regular la digestión sin efecto laxante",
     "guias-de-productos", "Guías de Productos FuXion", "liquid-fiber",
     "regularidad digestiva diaria, nutrición prebiótica y control de saciedad"),
    ("nocarb-t-fuxion-como-funciona-controlar-carbohidratos-glucosa",
     "NoCarb-T FuXion: Cómo funciona para controlar los carbohidratos y el azúcar",
     "guias-de-productos", "Guías de Productos FuXion", "nocarb-t",
     "inhibición parcial de carbohidratos, estabilidad de glucosa postprandial y control de medidas"),
    ("no-stress-off-fuxion-reducir-estres-ansiedad-naturalmente",
     "No Stress (Off) FuXion: Cómo reducir el estrés y la ansiedad de forma natural",
     "guias-de-productos", "Guías de Productos FuXion", "no-stress",
     "relajación neuromuscular, enfoque sereno con L-teanina y manejo del cortisol"),
    ("youth-elixir-hgh-fuxion-como-tomar-rejuvenecer-dormir",
     "Youth Elixir (HGH) FuXion: Cómo tomarlo antes de dormir para rejuvenecer y descansar",
     "guias-de-productos", "Guías de Productos FuXion", "youth-elixir",
     "nutrición antiedad con resveratrol, sueño profundo y vitalidad celular"),
    ("vera-plus-fuxion-beneficios-aloe-vera-alergias-defensas",
     "Vera+ FuXion: Beneficios del aloe vera y Wellmune WGP para alergias y defensas",
     "guias-de-productos", "Guías de Productos FuXion", "vera-plus",
     "fortalecimiento del sistema inmunológico y protección de las vías respiratorias"),
    ("golden-flx-fuxion-leche-dorada-curcuma-articulaciones",
     "Golden FLX FuXion: Leche dorada con cúrcuma orgánica TurmiPure para articulaciones",
     "guias-de-productos", "Guías de Productos FuXion", "golden-flx",
     "movilidad articular, acción antiinflamatoria natural y bienestar osteomuscular"),
    ("probal-fuxion-equilibrio-hormonal-femenino-menopausia",
     "Probal FuXion: Equilibrio hormonal femenino, menopausia y bienestar menstrual",
     "guias-de-productos", "Guías de Productos FuXion", "probal",
     "regulación hormonal con isoflavonas de soya, aguaje, dong quai y confort femenino"),
    ("passion-fuxion-vigor-circulacion-energia-intima-peru",
     "Passion FuXion: Vigor, circulación y energía íntima con jalea real y L-arginina",
     "guias-de-productos", "Guías de Productos FuXion", "passion",
     "vasodilatación saludable, vitalidad en pareja y rendimiento circulatorio"),
    ("on-fuxion-activar-concentracion-memoria-enfoque-mental",
     "On FuXion: Cómo activar la concentración, memoria y enfoque mental sin taquicardia",
     "guias-de-productos", "Guías de Productos FuXion", "on",
     "rendimiento cognitivo, alerta mental con yerba mate y aminoácidos cerebrales"),
    ("rexet-fuxion-proteger-higado-recuperacion-digestiva",
     "Rexet FuXion: Bebida efervescente para proteger el hígado y recuperarse tras excesos",
     "guias-de-productos", "Guías de Productos FuXion", "rexet",
     "depuración hepática con alcachofa, tuna roja y rehidratación metabólica"),
    ("biopro-fit-fuxion-batido-proteico-saciedad-bajar-peso",
     "BioPro+ Fit FuXion: Batido proteico con Prolibra para saciedad y pérdida de grasa",
     "guias-de-productos", "Guías de Productos FuXion", "biopro-fit",
     "control del apetito, tonificación muscular y aceleración metabólica"),
    ("biopro-sport-fuxion-proteina-ganar-masa-muscular-peru",
     "BioPro+ Sport FuXion: Proteína con Actinos para ganar masa muscular y recuperación",
     "guias-de-productos", "Guías de Productos FuXion", "biopro-sport",
     "hipertrofia muscular limpia, flujo sanguíneo con Actinos y recuperación post-entreno"),
    ("biopro-tect-fuxion-nutricion-celular-inmunidad-familiar",
     "BioPro+ Tect FuXion: Nutrición celular e inmunidad para toda la familia con Bioferrín",
     "guias-de-productos", "Guías de Productos FuXion", "biopro-tect",
     "regeneración celular, defensas con calostro bovino y proteína de alta biodisponibilidad"),
    ("nutraday-fuxion-multivitaminico-moringa-hierro-ninos-adultos",
     "Nutraday FuXion: El multivitamínico natural con moringa y hierro para niños y adultos",
     "guias-de-productos", "Guías de Productos FuXion", "nutraday",
     "aporte de 12 vitaminas y 5 minerales, prevención de anemia y desarrollo infantil"),
    ("vitaenergia-fuxion-vitaminas-minerales-cansancio-diario",
     "Vitaenergía FuXion: Vitaminas, minerales y aminoácidos para combatir el cansancio diario",
     "guias-de-productos", "Guías de Productos FuXion", "vitaenergia",
     "revitalización diaria, micronutrición con maíz morado y bienestar integral"),
    ("pre-sport-post-sport-fuxion-guia-suplementacion-deportiva",
     "Pre Sport y Post Sport FuXion: Guía completa de suplementación antes y después de entrenar",
     "guias-de-productos", "Guías de Productos FuXion", "pre-sport",
     "energía explosiva pre-entreno, reposición de electrolitos y L-glutamina"),
    ("xtra-mile-fuxion-hidratacion-isotonica-deportes-resistencia",
     "Xtra Mile FuXion: Hidratación isotónica avanzada con Palatinose para deportes de fondo",
     "guias-de-productos", "Guías de Productos FuXion", "xtra-mile",
     "energía de liberación prolongada, hidratación intra-entreno y resistencia"),
    ("gano-cappuccino-cafe-ganomax-fuxion-beneficios-ganoderma",
     "Gano+ Cappuccino y Café Ganomax FuXion: Beneficios del café con Ganoderma lucidum",
     "guias-de-productos", "Guías de Productos FuXion", "cafe-ganomax",
     "café funcional antioxidante, modulación inmunológica con hongo Reishi y bienestar"),
    ("cafe-y-cafe-fit-fuxion-cafe-verde-controlar-apetito",
     "Café & Café Fit FuXion: Cómo funciona el café verde tostado para controlar el apetito",
     "guias-de-productos", "Guías de Productos FuXion", "cafe-y-cafe-fit",
     "ácido clorogénico del café verde, lipólisis natural y saciedad entre comidas"),
    ("chocolate-fit-fuxion-chocolate-negro-sin-azucar-bajar-peso",
     "Chocolate Fit FuXion: El placer del chocolate negro sin azúcar que apoya tu figura",
     "guias-de-productos", "Guías de Productos FuXion", "chocolate-fit",
     "cacao amazónico 100% puro, extracto de café verde y control de antojos"),
    ("probix-fuxion-probioticos-sticks-microbiota-defensas",
     "Probix FuXion: Probióticos en sticks para fortalecer la microbiota y las defensas",
     "guias-de-productos", "Guías de Productos FuXion", "probix",
     "cepas probióticas clínicamente estudiadas, equilibrio intestinal y fácil mezcla"),
    ("iq-plus-zoom-in-rezzt-fuxion-nootropicos-vision-sueno",
     "IQ+, Zoom-In y Rezzt+ FuXion: La nueva generación de nootrópicos, visión y sueño reparador",
     "guias-de-productos", "Guías de Productos FuXion", "iq-plus",
     "neuroprotección avanzada, cuidado macular frente a pantallas y arquitectura del sueño"),
    ("matcha-pep-t-fuxion-energia-limpia-antioxidantes-peptidos",
     "Matcha Pep-T FuXion: Energía limpia, antioxidantes y péptidos en té matcha japonés",
     "guias-de-productos", "Guías de Productos FuXion", "matcha-pep-t",
     "catequinas EGCG del té matcha, péptidos bioactivos y concentración serena"),

    # CLUSTER 2: Digestión, Limpieza de Colon y Detox (15 artículos)
    ("como-hacer-limpieza-de-colon-natural-en-casa-5-dias",
     "Cómo hacer una limpieza de colon natural en casa en 5 días (Guía paso a paso)",
     "digestion-y-detox", "Digestión y Limpieza Detox", "prunex1",
     "desintoxicación intestinal segura, eliminación de materia retenida y ligereza abdominal"),
    ("estrenimiento-cronico-hinchazon-abdominal-que-tomar-noche",
     "Estreñimiento crónico e hinchazón abdominal: Qué tomar antes de dormir para ir al baño",
     "digestion-y-detox", "Digestión y Limpieza Detox", "prunex1",
     "estímulo suave del peristaltismo nocturno con psyllium, inulina y extracto de guindón"),
    ("diferencia-prunex1-liquid-fiber-flora-liv-cual-elegir",
     "Diferencia entre Prunex1, Liquid Fiber y Flora Liv: ¿Cuál elegir según tu digestión?",
     "digestion-y-detox", "Digestión y Limpieza Detox", "flora-liv",
     "comparativa completa del sistema digestivo FuXion para limpieza, fibra diaria y flora"),
    ("como-recuperar-flora-intestinal-despues-antibioticos-gastritis",
     "Cómo recuperar la flora intestinal después de tomar antibióticos o sufrir gastritis",
     "digestion-y-detox", "Digestión y Limpieza Detox", "flora-liv",
     "repoblación de bacterias benéficas con 10 mil millones de probióticos y pulpa de granadilla"),
    ("programa-detox-5-dias-fuxion-que-incluye-cronograma-resultados",
     "Programa Detox 5 Días de FuXion: Qué incluye, cronograma diario y resultados reales",
     "digestion-y-detox", "Digestión y Limpieza Detox", "programa-detox-5-dias",
     "reseteo metabólico de 5 días para colon, hígado, riñones, sangre y microbiota"),
    ("higado-graso-digestion-pesada-bebidas-depurativas-higado",
     "Hígado graso y digestión pesada: Bebidas depurativas para limpiar el hígado naturalmente",
     "digestion-y-detox", "Digestión y Limpieza Detox", "rexet",
     "hepatoprotección con alcachofa, clorofila, complejo B y glutatión precursor"),
    ("beneficios-jugos-verdes-alcalinizantes-en-ayunas-alpha-balance",
     "Beneficios de tomar jugos verdes alcalinizantes en ayunas (y cómo hacerlo en 1 minuto)",
     "digestion-y-detox", "Digestión y Limpieza Detox", "alpha-balance",
     "aporte concentrado de espirulina, chlorella, alfalfa, pasto de trigo y magnesio"),
    ("infecciones-urinarias-cistitis-proteger-vias-urinarias-arandano",
     "Infecciones urinarias recurrentes y cistitis: Cómo proteger las vías urinarias con arándano y piña",
     "digestion-y-detox", "Digestión y Limpieza Detox", "berry-balance",
     "proantocianidinas del cranberry, cáscara de piña y probióticos para el tracto urinario"),
    ("retencion-de-liquidos-piernas-hinchadas-diureticos-naturales",
     "Retención de líquidos y piernas hinchadas: Diuréticos naturales que no deshidratan",
     "digestion-y-detox", "Digestión y Limpieza Detox", "berry-balance",
     "eliminación del exceso de líquidos subcutáneos conservando electrolitos esenciales"),
    ("prunex1-28-sobres-vs-prunex1-mini-7-sobres-cuantos-dias-tomar",
     "Prunex1 de 28 sobres vs Prunex1 Mini de 7 sobres: ¿Cuántos días seguidos se debe tomar?",
     "digestion-y-detox", "Digestión y Limpieza Detox", "prunex1",
     "guía de dosificación inteligente entre el Doypack de 28 sticks y el formato de 7 sticks"),
    ("probioticos-ninos-adultos-peru-flora-liv-vs-probix",
     "Probióticos para niños y adultos en Perú: Flora Liv vs Probix, ¿cuál te conviene?",
     "digestion-y-detox", "Digestión y Limpieza Detox", "probix",
     "elección entre probióticos con sabor a granadilla (Flora Liv) y sticks neutros (Probix)"),
    ("acidez-estomacal-reflujo-equilibrar-ph-digestivo-fibra",
     "Acidez estomacal y reflujo: Cómo equilibrar el pH digestivo con fibra prebiótica y probióticos",
     "digestion-y-detox", "Digestión y Limpieza Detox", "liquid-fiber",
     "protección de la mucosa gástrica y regulación del tránsito con inulina de achicoria"),
    ("desintoxicar-cuerpo-metales-pesados-chlorella-espirulina",
     "Cómo desintoxicar el cuerpo de metales pesados y radicales libres con Chlorella y Espirulina",
     "digestion-y-detox", "Digestión y Limpieza Detox", "alpha-balance",
     "quelación natural con microalgas verdes, clorofila y minerales quelados"),
    ("colon-irritable-gases-suplementos-naturales-desinflamar-abdomen",
     "Síndrome de colon irritable y gases: Hábitos y suplementos naturales que desinflaman el abdomen",
     "digestion-y-detox", "Digestión y Limpieza Detox", "flora-liv",
     "reducción de la fermentación intestinal, distensión abdominal y sensibilidad digestiva"),
    ("que-comer-semana-limpieza-digestiva-peru-menu-bebidas",
     "Qué comer durante una semana de limpieza digestiva en Perú (Menú + Bebidas Funcionales)",
     "digestion-y-detox", "Digestión y Limpieza Detox", "programa-detox-5-dias",
     "plan práctico con ingredientes peruanos y soporte nutracéutico paso a paso"),

    # CLUSTER 3: Control de Peso, Metabolismo y Glucosa (20 artículos)
    ("mejores-quemadores-de-grasa-naturales-peru-sin-efecto-rebote",
     "Los mejores quemadores de grasa naturales en Perú sin efecto rebote ni nerviosismo",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "thermo-t3",
     "oxidación lipídica saludable con tres tés ancestrales, L-carnitina y cetonas de frambuesa"),
    ("como-combinar-thermo-t3-y-nocarb-t-bajar-peso-medidas",
     "Cómo combinar Thermo T3 y NoCarb-T para acelerar el metabolismo y bajar medidas",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "thermo-t3",
     "la dupla reductora número 1 de FuXion para oxidar grasa acumulada y frenar carbohidratos"),
    ("pack-5-14-fuxion-bajar-5-kilos-14-dias-como-funciona",
     "Pack 5/14 de FuXion (Bajar 5 kilos en 14 días): Cómo funciona el plan y qué incluye",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "pack-5-14-active-mito",
     "estructura completa del programa de 14 días, productos incluidos y plan de 5 comidas"),
    ("pack-5-14-keto-vs-pack-5-14-active-diferencias-precios-peru",
     "Pack 5/14 Keto vs Pack 5/14 Active (Vegano): Diferencias, precios y cuál elegir",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "pack-5-14-keto",
     "comparativa detallada entre el protocolo cetogénico y el protocolo vegano mitocondrial"),
    ("como-controlar-picos-de-glucosa-insulina-despues-de-comer",
     "Cómo controlar los picos de glucosa e insulina después de comer arroz, pan o pastas",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "nocarb-t",
     "modulación glucémica con fibra de acacia, yacón, pectina de manzana, canela y cromo"),
    ("ansiedad-por-comer-dulces-tarde-frenar-antojos-proteina",
     "Ansiedad por comer dulces por la tarde: Cómo frenar los antojos con proteína y cromo",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "biopro-fit",
     "control de la hormona grelina y saciedad prolongada con Prolibra y Garcinia cambogia"),
    ("thermo-t3-antes-de-entrenar-o-despues-de-comer-guia",
     "¿Thermo T3 se toma antes de hacer ejercicio o después de las comidas? Guía definitiva",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "thermo-t3",
     "horarios estratégicos según hagas deporte o busques apoyo digestivo y metabólico"),
    ("cenas-saludables-bajar-de-peso-batidos-sopas-proteicas",
     "Cenas saludables para bajar de peso sin pasar hambre: Batidos proteicos y sopas funcionales",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "protein-xoup-crema-criolla",
     "alternativas calientes y frías altas en proteína para evitar cenar carbohidratos pesados"),
    ("protein-active-fit-vs-biopro-fit-que-proteina-elegir",
     "Protein Active Fit vs BioPro+ Fit: ¿Qué proteína elegir para definir y perder grasa?",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "protein-active-fit-chocolate-avellanas",
     "diferencias entre la fórmula láctea bioactiva y la fórmula 100% vegetal germinada"),
    ("beneficios-te-rojo-te-verde-te-negro-l-carnitina-grasa-abdominal",
     "Beneficios del té rojo, té verde y té negro con L-carnitina para oxidar grasa abdominal",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "thermo-t3",
     "sinergia bioquímica de polifenoles, catequinas y aminoácidos transportadores de ácidos grasos"),
    ("cafe-verde-para-adelgazar-acido-clorogenico-cafe-fit-fuxion",
     "Café verde para adelgazar: Cómo el ácido clorogénico de Café & Café Fit ayuda a tu metabolismo",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "cafe-y-cafe-fit",
     "regulación de la glucosa hepática y movilización de reservas grasas con café gourmet"),
    ("cafe-fit-clasico-vs-cappuccino-sabor-calorias-precio-peru",
     "Café & Café Fit Clásico vs Cappuccino: Sabor, calorías, preparación y precio en Perú",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "cafe-y-cafe-fit-cappuccino",
     "comparativa entre el café negro tostado/verde y la versión cremosa cappuccino"),
    ("combo-ponte-en-forma-fuxion-programa-transformacion-corporal",
     "Combo Ponte en Forma FuXion: El programa integral para transformar tu composición corporal",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "combo-ponte-en-forma",
     "solución completa de 30 días para reducir porcentaje de grasa y tonificar masa magra"),
    ("por-que-no-logras-bajar-de-peso-colon-estres-glucosa",
     "Por qué no logras bajar de peso aunque hagas dieta (El papel del colon, el estrés y la glucosa)",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "nocarb-t",
     "los 3 bloqueos metabólicos más frecuentes en Perú y cómo destrabarlos paso a paso"),
    ("sopas-proteicas-invierno-lima-protein-xoup-criolla-brocoli",
     "Sopas proteicas rápidas para el invierno en Lima: Crema Criolla y Brócoli Parmesano FuXion",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "protein-xoup-brocoli-parmesano",
     "nutrición reconfortante en 1 minuto con péptidos proteicos e ingredientes gourmet"),
    ("snacks-saludables-media-manana-tarde-metabolismo-activo",
     "Snacks saludables a media mañana y media tarde para mantener el metabolismo activo",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "limitlex-snack-recharge",
     "cómo evitar llegar con hambre voraz al almuerzo o la cena mediante colaciones inteligentes"),
    ("como-evitar-flacidez-al-bajar-de-peso-proteina-colageno",
     "Cómo evitar la flacidez al bajar de peso: La combinación de proteína bioactiva y colágeno",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "biopro-fit",
     "protección del tono muscular y la firmeza dérmica durante la pérdida de medidas"),
    ("resistencia-a-la-insulina-prediabetes-fibras-solubles-yacón",
     "Resistencia a la insulina y prediabetes: Hábitos nutricionales y fibras solubles recomendadas",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "nocarb-t",
     "beneficios de la inulina de yacón, cromo y canela para mejorar la sensibilidad insulínica"),
    ("rutina-30-dias-reducir-cintura-grasa-visceral-fuxion",
     "Rutina de 30 días para reducir cintura y grasa visceral (Limpia + Quema + Tonifica)",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "thermo-t3",
     "protocolo práctico combinando Prunex1, Thermo T3, NoCarb-T y BioPro+ Fit"),
    ("que-es-prolibra-y-garcinia-cambogia-saciedad-control-peso",
     "¿Qué es Prolibra y el Tamarindo Malabar (Garcinia cambogia) y cómo ayudan a saciar el apetito?",
     "control-de-peso-y-metabolismo", "Control de Peso y Metabolismo", "biopro-fit",
     "respaldo científico de las patentes nutracéuticas presentes en BioPro+ Fit"),

    # CLUSTER 4: Colágeno, Piel, Articulaciones y Equilibrio Hormonal (15 artículos)
    ("cual-es-el-mejor-colageno-hidrolizado-peru-piel-cabello-unas",
     "Cuál es el mejor colágeno hidrolizado en Perú para la piel, cabello y uñas",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "beauty-in",
     "criterios para elegir un colágeno con péptidos bioactivos, coenzima Q10, biotina y zinc"),
    ("peptidos-colageno-bioactivo-vs-colageno-convencional-beauty-in",
     "Péptidos de colágeno bioactivo vs colágeno convencional: Por qué Beauty-In es 4 veces más potente",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "beauty-in",
     "absorción enzimática optimizada que estimula a los fibroblastos a producir colágeno propio"),
    ("dolor-de-rodillas-articulaciones-inflamacion-curcuma-golden-flx",
     "Dolor de rodillas, articulaciones e inflamación: Cómo actúa la cúrcuma orgánica de Golden FLX",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "golden-flx",
     "biodisponibilidad superior de los curcuminoides TurmiPure con jengibre, cardamomo y leche de coco"),
    ("resveratrol-antioxidantes-antiedad-youth-elixir-sueno-piel",
     "Resveratrol y antioxidantes antiedad: Cómo funciona Youth Elixir para mejorar el sueño y la piel",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "youth-elixir",
     "sinergia de uvas de vino tinto, súper berries, aminoácidos y GABA durante el descanso"),
    ("sofocos-menopausia-desbalance-hormonal-femenino-probal-fuxion",
     "Sofocos de la menopausia y desbalance hormonal femenino: Beneficios de la soya y aguaje en Probal",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "probal",
     "fitoestrógenos naturales, extracto de orégano y luteína para cada etapa de la mujer"),
    ("fortalecer-cabello-quebradizo-unas-debiles-biotina-coenzima-q10",
     "Cómo fortalecer el cabello quebradizo y las uñas débiles desde adentro con biotina natural y coenzima Q10",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "beauty-in",
     "nutrición de la matriz capilar y ungueal con Sesbania (biotina orgánica), vitamina E y zinc"),
    ("artritis-rigidez-articular-dolor-muscular-golden-flx-proteina",
     "Artritis, rigidez articular y dolor muscular: Beneficios de combinar Golden FLX con proteína",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "golden-flx",
     "protección del cartílago, desinflamación natural y fortalecimiento del soporte muscular"),
    ("aumentar-libido-circulacion-vitalidad-hombres-mujeres-passion",
     "Cómo aumentar la libido, circulación y vitalidad en hombres y mujeres de forma natural",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "passion",
     "producción de óxido nítrico a partir de L-arginina, jalea real, ginseng y maca"),
    ("sindrome-premenstrual-colicos-infusiones-nutraceuticas-probal",
     "Síndrome premenstrual (SPM) y cólicos: Qué infusiones nutracéuticas ayudan a regular el ciclo",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "probal",
     "alivio de cambios de humor, retención e incomodidades mensuales con extractos botánicos"),
    ("a-partir-de-que-edad-tomar-colageno-mejor-hora-del-dia",
     "A partir de qué edad se debe tomar colágeno y a qué hora del día se absorbe mejor",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "beauty-in",
     "guía por décadas (25+, 35+, 45+, 60+) para preservar el colágeno dérmico y articular"),
    ("beauty-in-vs-youth-elixir-cual-elegir-rejuvenecer-firmeza",
     "Beauty-In vs Youth Elixir: ¿Cuál elegir para rejuvenecer y cuál para firmeza de la piel?",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "youth-elixir",
     "cómo actúan juntos o por separado los péptidos de colágeno y el complejo HGH con resveratrol"),
    ("estimular-hormona-juventud-hgh-aminoacidos-sueno-profundo",
     "Cómo estimular la hormona de la juventud (HGH) de forma natural con aminoácidos y sueño profundo",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "youth-elixir",
     "importancia de la L-arginina, L-ornitina, L-lisina y L-glutamina antes de dormir"),
    ("cuidado-de-la-vista-pantallas-luteina-zeaxantina-zoom-in",
     "Cuidado de la vista frente a pantallas: Luteína, zeaxantina y antioxidantes en Zoom-In FuXion",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "zoom-in",
     "filtro natural contra la luz azul de celulares y monitores para reducir la fatiga ocular"),
    ("piel-seca-manchas-perdida-elasticidad-despues-de-los-30",
     "Piel seca, manchas y pérdida de elasticidad después de los 30: Rutina de nutrición celular",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "beauty-in",
     "hidratación profunda desde el interior con superfrutas exóticas, vitamina C y colágeno"),
    ("por-que-curcuma-con-leche-de-coco-y-pimienta-negra-se-absorbe-mejor",
     "Por qué la cúrcuma con leche de coco y pimienta negra (piperina) multiplica su absorción",
     "colageno-belleza-y-articulaciones", "Colágeno, Belleza y Articulaciones", "golden-flx",
     "la ciencia detrás de la formulación de Golden FLX frente a la cúrcuma común de cocina"),

    # CLUSTER 5: Energía, Concentración, Estrés y Sueño (12 artículos)
    ("cansancio-cronico-sueno-durante-el-dia-recuperar-energia",
     "Cansancio crónico y sueño durante el día: Cómo recuperar la energía sin exceso de cafeína sintética",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "vita-xtra-t",
     "transición de estimulantes artificiales hacia adaptógenos y antioxidantes naturales"),
    ("vita-xtra-t-clasico-vs-mojito-y-verano-comparativa-precios",
     "Vita Xtra T+ Clásico (Maíz Morado) vs Sabores Mojito y Verano: Comparativa y precios",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "vita-xtra-t-mojito",
     "descubre las tres versiones Clean Label de la bebida energizante favorita de FuXion Perú"),
    ("vita-xtra-t-vs-vitaenergia-cual-es-mejor-segun-tu-rutina",
     "Vita Xtra T+ vs Vitaenergía: ¿Cuál es mejor para el día a día y cuál para el desgaste físico?",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "vitaenergia",
     "cuándo elegir el energizante intensivo con guayusa y cuándo el multivitamínico revitalizante"),
    ("insomnio-estres-laboral-mente-acelerada-descansar-no-stress-rezzt",
     "Insomnio, estrés laboral y mente acelerada de noche: Cómo descansar mejor con No Stress y Rezzt+",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "no-stress",
     "protocolo nocturno para apagar el estrés mental y alcanzar las fases de sueño REM y profundo"),
    ("suplementos-naturales-estudiar-concentrarse-trabajar-on-vs-iq",
     "Suplementos naturales para estudiar, concentrarse y rendir en el trabajo (On vs IQ+)",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "on",
     "cómo potenciar el enfoque inmediato con On y la memoria de largo plazo con IQ+"),
    ("como-bajar-cortisol-alto-tension-nerviosa-l-teanina-magnesio",
     "Cómo bajar el cortisol alto y la tensión nerviosa con L-teanina, ashwagandha y magnesio",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "no-stress",
     "impacto de los aminoácidos relajantes de No Stress sin producir somnolencia diurna"),
    ("bebidas-energizantes-saludables-lata-xpeed-fuxion-peru",
     "Bebidas energizantes saludables en lata: Xpeed y Xpeed Citrus Power frente a energizantes comerciales",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "xpeed-citrus-power",
     "por qué Xpeed de FuXion brinda energía inmediata sin jarabe de maíz ni taquicardia"),
    ("fatiga-mental-niebla-cerebral-nootropicos-naturales-iq-plus",
     "Fatiga mental y niebla cerebral ('brain fog'): Nootrópicos naturales que activan las neuronas",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "iq-plus",
     "nutrientes clave para la sinapsis neuronal, claridad mental y productividad ejecutiva"),
    ("combinar-vita-xtra-t-manana-y-no-stress-noche-ciclo-energia",
     "Cómo combinar Vita Xtra T+ por la mañana y No Stress por la noche para un ciclo perfecto de energía y descanso",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "vita-xtra-t",
     "regulación del ritmo circadiano para despertar con vitalidad y dormir profundamente"),
    ("vitaminas-para-ninos-edad-escolar-peru-defensas-atencion-nutraday",
     "Vitaminas para niños en edad escolar en Perú: Cómo mejorar sus defensas, crecimiento y atención",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "nutraday",
     "beneficios de la moringa, guayaba, hierro, zinc y complejo B en la lonchera diaria"),
    ("rezzt-plus-fuxion-lograr-sueno-reparador-despertar-con-energia",
     "Rezzt+ FuXion: Cómo lograr un sueño reparador y despertar con energía renovada",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "rezzt-plus",
     "formulación bioactiva para conciliar el sueño rápidamente y mejorar la calidad del descanso"),
    ("guayusa-maca-goji-te-verde-secreto-energia-sostenida-fuxion",
     "Guayusa, Maca, Goji y Té Verde: El secreto amazónico y andino detrás de la energía sostenida",
     "energia-mente-y-descanso", "Energía, Mente y Descanso", "vita-xtra-t",
     "cómo la Fusión Nutracéutica une superalimentos milenarios con biotecnología moderna"),

    # CLUSTER 6: Inmunidad, Deporte y Guías de Compra en Perú (13 artículos)
    ("como-subir-defensas-sistema-inmunologico-cambio-clima-lima-vera",
     "Cómo subir las defensas del sistema inmunológico y prevenir gripes y alergias por cambio de clima en Lima",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "vera-plus",
     "acción de los beta-glucanos Wellmune WGP, aloe vera, hoja de olivo y vitamina C"),
    ("asma-rinitis-alergica-vias-respiratorias-vera-plus-invierno",
     "Asma, rinitis alérgica y vías respiratorias: Por qué Vera+ es el producto más recomendado en invierno",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "vera-plus",
     "alivio y fortalecimiento bronquial con acetilcisteína, aloe vera y extractos herbales"),
    ("ganoderma-lucidum-reishi-peru-beneficios-gano-t-cappuccino",
     "Ganoderma lucidum (Reishi) en Perú: Beneficios inmunológicos de Gano+ T y Gano+ Cappuccino",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "gano-plus-cappuccino",
     "propiedades inmunomoduladoras y antioxidantes de los triterpenos y polisacáridos del Reishi"),
    ("proteinas-fuxion-comparativa-biopro-tect-fit-sport-sobres-pote",
     "Proteínas FuXion: Comparativa entre BioPro+ Tect, BioPro+ Fit y BioPro+ Sport (En sobres y en pote)",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "biopro-sport",
     "guía para elegir entre cajas de 14 sobres y potes de 500 g o 2 lb según tu objetivo"),
    ("proteinas-veganas-peru-protein-active-sport-chocolate-vainilla",
     "Proteínas veganas en Perú: Todo sobre Protein Active y Protein Active Sport (Chocolate y Vainilla)",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "protein-active-sport-chocolate-avellanas",
     "proteína vegetal de quinua germinada, arveja, arroz integral y algas con 100% de biodisponibilidad"),
    ("como-ganar-masa-muscular-limpia-pre-sport-xtra-mile-post-sport",
     "Cómo ganar masa muscular limpia: Qué tomar antes (Pre Sport), durante (Xtra Mile) y después (Post Sport + BioPro+ Sport)",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "post-sport",
     "el protocolo completo de nutrición deportiva FuXion para fuerza, hipertrofia y resistencia"),
    ("calostro-bovino-bioferrin-lactoferrina-biopro-tect-familia",
     "Calostro bovino (Bioferrín) y lactoferrina: Cómo BioPro+ Tect protege a niños, adultos y adultos mayores",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "biopro-tect",
     "factores de transferencia inmunológica y aminoácidos esenciales para toda la familia"),
    ("bases-madre-fuxion-verde-amarilla-roja-cocina-peruana",
     "Bases Madre FuXion (Verde, Amarilla y Roja): Qué son, para qué sirven en la cocina peruana y cómo usarlas",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "base-madre-verde",
     "aderezos peruanos 100% naturales enriquecidos con hierro, antioxidantes y fibras prebióticas"),
    ("catalogo-fuxion-peru-2026-precios-en-soles-lista-oficial",
     "Catálogo FuXion Perú 2026: Lista Oficial de Productos y Precios",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "prunex1",
     "tabla completa de precios oficiales, presentaciones y puntos del catálogo FuXion Perú"),
    ("donde-comprar-productos-fuxion-originales-lima-provincias-envio",
     "¿Dónde comprar productos FuXion originales en Lima y provincias con envío a domicilio?",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "beauty-in",
     "paso a paso para realizar tu pedido online seguro en la tienda oficial de FuXion Perú"),
    ("como-saber-si-productos-fuxion-son-originales-clean-label",
     "Cómo saber si tus productos FuXion son originales, qué significa el sello Clean Label y registro sanitario",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "thermo-t3",
     "garantía de fábrica, código de barras, empaque sellado y compra directa sin intermediarios"),
    ("horarios-recomendados-tomar-productos-fuxion-guia-diaria",
     "Horarios recomendados para tomar tus productos FuXion (Guía desde que despiertas hasta antes de dormir)",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "vita-xtra-t",
     "cronograma práctico para combinar hasta 3 o 4 bebidas funcionales al día con máxima absorción"),
    ("mejores-combinaciones-packs-productos-fuxion-segun-objetivo",
     "Las 7 mejores combinaciones (Packs personalizados) de productos FuXion según tu objetivo de salud",
     "inmunidad-deporte-y-compras-peru", "Inmunidad, Deporte y Compra en Perú", "alpha-balance",
     "sinergias recomendadas para detox, pérdida de peso, piel radiante, energía, enfoque y defensas"),
]

def build_article_record(idx: int, spec: tuple, prod_map: dict) -> dict:
    slug, title, cluster_slug, cluster_name, prod_slug, focus_topic = spec
    prod = prod_map[prod_slug]
    clean_name = prod["cleanName"]
    price_fmt = prod["formattedPrice"]
    pack_str = prod["pack"]
    shop_url = prod["shopUrl"]
    direct_url = prod["directProductUrl"]
    ingredients_str = ", ".join(prod["ingredients"][:5]) if prod["ingredients"] else "extractos naturales"
    combo_slugs = prod.get("recommendedCombinations", [])[:3]
    combo_names = [prod_map[cs]["cleanName"] for cs in combo_slugs if cs in prod_map]

    # Dates spread nicely across 2026
    month = ((idx % 10) + 1)
    day = ((idx * 3) % 27) + 1
    pub_date = f"2026-{month:02d}-{day:02d}"

    excerpt = (
        f"Guía completa sobre {focus_topic} con {clean_name} de FuXion en Perú. "
        f"Descubre para qué sirve, ingredientes, cómo tomarlo y su precio oficial ({price_fmt})."
    )
    if len(excerpt) > 165:
        excerpt = excerpt[:162].rsplit(" ", 1)[0] + "..."

    intro_html = f"""
<p>En el Perú, cada vez más personas buscan alternativas naturales, efectivas y respaldadas por la ciencia para mejorar su bienestar diario a través de la <strong>{focus_topic}</strong>. Dentro del catálogo de <strong>Fusión Nutracéutica®</strong> de FuXion Biotech SAC, <strong><a href="/productos/{prod['slug']}/">{clean_name}</a></strong> se ha consolidado como una de las fórmulas más solicitadas tanto en Lima como en todas las provincias del país.</p>
<p>En esta guía especializada analizaremos en profundidad cómo actúa en tu organismo, cuáles son sus principios activos, en qué horario conviene tomarlo para obtener resultados reales, cuál es su precio oficial en Soles (<strong>{price_fmt}</strong> en presentación <em>{pack_str}</em>) y cómo adquirirlo directamente en la <strong>Tienda Oficial de FuXion Perú</strong> con garantía de fábrica.</p>
""".strip()

    benefits_lis = "".join(f"<li><strong>{b}</strong></li>" for b in prod["benefits"])
    ingredients_badges = ", ".join(f"<strong>{ing}</strong>" for ing in prod["ingredients"])

    before_card_html = f"""
<h2 id="que-es-y-como-actua">1. ¿Cómo funciona {clean_name} para apoyar tu {focus_topic}?</h2>
<p>{prod['description']}</p>
<p>A diferencia de los productos convencionales del mercado que suelen contener azúcares refinados, octógonos o estimulantes sintéticos, <strong>{clean_name}</strong> cuenta con la certificación <strong>Clean Label (Etiqueta Limpia)</strong>. Esto significa que utiliza ingredientes 100% de origen natural, endulzados únicamente con glucósidos de esteviol (stevia) y colores extraídos de frutas y vegetales reales.</p>

<h2 id="beneficios-principales">2. Beneficios comprobados en el organismo</h2>
<p>El consumo constante de <strong>{clean_name}</strong> dentro de un estilo de vida saludable en Perú aporta las siguientes ventajas funcionales:</p>
<ul>
  {benefits_lis}
</ul>

<h2 id="formulacion-nutraceutica">3. Ingredientes activos y sinergia bioquímica</h2>
<p>El secreto de la efectividad de <strong>{clean_name}</strong> reside en su matriz de principios activos concentrados: {ingredients_badges}. Gracias al proceso de biotecnología aplicada por FuXion, cada nutriente conserva su máxima biodisponibilidad y los minerales se encuentran <em>aminoácido-quelados</em>, lo que multiplica su absorción celular frente a las sales minerales comunes.</p>
""".strip()

    combos_html = ""
    if combo_names:
        links_str = ", ".join(
            f'<a href="/productos/{cs}/"><strong>{prod_map[cs]["cleanName"]}</strong></a> ({prod_map[cs]["formattedPrice"]})'
            for cs in combo_slugs if cs in prod_map
        )
        combos_html = f"<p>Para potenciar los resultados en <strong>{focus_topic}</strong>, los especialistas en nutrición funcional de FuXion recomiendan combinar <strong>{clean_name}</strong> con {links_str}, creando una sinergia completa según el horario del día.</p>"

    after_card_html = f"""
<h2 id="como-preparar-y-tomar">4. ¿Cómo se prepara y a qué hora es mejor tomar {clean_name}?</h2>
<p>Una de las grandes ventajas de los productos FuXion es su practicidad en sticks individuales que puedes llevar en el bolsillo, cartera o mochila:</p>
<ul>
  <li><strong>Modo de preparación oficial:</strong> {prod['preparation']}</li>
  <li><strong>Horario ideal recomendado:</strong> {prod['idealTime']}</li>
  <li><strong>Presentación y rendimiento:</strong> {pack_str} ({f"{prod['sticks']} unidades · {prod['perStickFormatted']} por porción" if prod['sticks'] else "Formato oficial sellado"}).</li>
</ul>

<h2 id="combinaciones-y-sinergia">5. ¿Con qué otros productos FuXion se puede combinar?</h2>
{combos_html}
<p>Recuerda que al tratarse de alimentos nutracéuticos sin químicos ni interacciones medicamentosas agresivas, puedes integrar hasta 3 o 4 bebidas funcionales distintas a lo largo de tu rutina diaria (por ejemplo: energía o limpieza por la mañana, control metabólico al mediodía y regeneración o descanso por la noche).</p>

<h2 id="precio-y-donde-comprar-peru">6. Precio oficial y cómo comprar {clean_name} original en Perú</h2>
<p>El precio oficial vigente en el catálogo de <strong>FuXion Perú</strong> para <strong>{clean_name}</strong> ({pack_str}) es de <strong>{price_fmt}</strong> (impuestos incluidos). Evita comprar en plataformas informales o revendedores sin código donde el producto pueda estar adulterado, próximo a vencer o sin cadena de custodia.</p>
<p>Al hacer tu pedido desde las tarjetas transaccionales de esta página, ingresas directamente al entorno oficial de compra de FuXion Biotech SAC (<code>shop.site.fuxion.com</code>), donde tu pago se procesa con encriptación bancaria (Visa, Mastercard, American Express, Diners Club) y el despacho sale directamente desde el almacén central de FuXion hacia tu domicilio en Lima Metropolitana, Callao o cualquier departamento del Perú.</p>
""".strip()

    comparison_rows = [
        {"label": "Producto Oficial", "value": clean_name},
        {"label": "Línea del Sistema FuXion", "value": prod["categoryName"]},
        {"label": "Código SKU Oficial Perú", "value": f"#{prod['sku']}"},
        {"label": "Presentación", "value": pack_str},
        {"label": "Precio Oficial en Perú", "value": f"{price_fmt} (Soles - PEN)"},
        {"label": "Costo por Sobre / Porción", "value": prod["perStickFormatted"] if prod["perStickFormatted"] else price_fmt},
        {"label": "Puntos FuXion (QV)", "value": f"{prod['points']} puntos"},
        {"label": "Certificación", "value": "Clean Label · HACCP · BPM · 100% Origen Natural"},
    ]

    faqs = [
        {
            "question": f"¿Cuánto cuesta {clean_name} en Perú y cuántos sobres trae?",
            "answer": f"Su precio oficial en Perú es de {price_fmt} y viene en presentación {pack_str}. Puedes adquirirlo directamente en la Tienda Oficial haciendo clic en la tarjeta de compra de este artículo."
        },
        {
            "question": f"¿En cuánto tiempo se notan los beneficios de {clean_name}?",
            "answer": f"La mayoría de usuarios en Perú reportan una sensación positiva desde la primera semana de consumo constante, especialmente al acompañarlo con buena hidratación y el horario sugerido ({prod['idealTime']})."
        },
        {
            "question": f"¿Cómo llega mi pedido de {clean_name} en Lima y provincias?",
            "answer": f"Al finalizar tu compra en la pasarela oficial de FuXion (shop.site.fuxion.com), el sistema coordina el envío directo a la dirección que indiques en Lima o provincias con entrega rápida garantizada."
        }
    ]

    return {
        "id": idx + 1,
        "slug": slug,
        "title": title,
        "seoTitle": f"{title} | FuXion Perú (2026)",
        "seoDescription": excerpt,
        "excerpt": excerpt,
        "clusterSlug": cluster_slug,
        "clusterName": cluster_name,
        "publishedAt": pub_date,
        "readingTime": "6 min de lectura",
        "primaryProductSlug": prod_slug,
        "primaryProductSku": prod["sku"],
        "primaryProductShopUrl": shop_url,
        "primaryProductDirectUrl": direct_url,
        "secondaryProductSlugs": combo_slugs,
        "focusTopic": focus_topic,
        "introHtml": intro_html,
        "beforeCardHtml": before_card_html,
        "afterCardHtml": after_card_html,
        "comparisonRows": comparison_rows,
        "faqs": faqs
    }

def main():
    products = json.load(open(PRODUCTS_PATH, encoding="utf-8"))
    prod_map = {p["slug"]: p for p in products}

    articles = []
    seen_slugs = set()
    for idx, spec in enumerate(ARTICLE_SPECS):
        slug = spec[0]
        assert slug not in seen_slugs, f"Duplicate slug: {slug}"
        seen_slugs.add(slug)
        assert spec[4] in prod_map, f"Missing product slug: {spec[4]}"
        articles.append(build_article_record(idx, spec, prod_map))

    with open(ARTICLES_OUT, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)
    print(f"Successfully generated {len(articles)} SEO articles in {ARTICLES_OUT}")

if __name__ == "__main__":
    main()
