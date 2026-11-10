#!/usr/bin/env python3
"""
Expands scripts/build_articles.py and generates 405 SEO articles (105 original + 300 new)
in src/data/articles.json. Every article references a specific FuXion Peru product and embeds
its TransactionalProductCard pointing directly to https://shop.site.fuxion.com/.
"""
import json
import os
import re
import sys
import unicodedata

BASE_DIR = "/Users/charlie/Documents/Google Antigravity/fuxion.site"
sys.path.insert(0, os.path.join(BASE_DIR, "scripts"))
from build_articles import ARTICLE_SPECS as ORIGINAL_105_SPECS, slugify

PRODUCTS_PATH = os.path.join(BASE_DIR, "src", "data", "products.json")
ARTICLES_OUT = os.path.join(BASE_DIR, "src", "data", "articles.json")

products = json.load(open(PRODUCTS_PATH, encoding="utf-8"))
prod_map = {p["slug"]: p for p in products}

NEW_300_SPECS = []

# ============================================================================
# 1. CLÚSTER: Guías de Productos FuXion (+60 artículos — 1 guía de protocolo/horario por cada uno de los 60 productos)
# ============================================================================
for p in products:
    pslug = p["slug"]
    pname = p["cleanName"]
    cat_short = p["categoryShortName"].lower()
    art_slug = slugify(f"protocolo-uso-horario-dosis-{pslug}-fuxion-peru")
    title = f"Protocolo de Uso de {pname} FuXion: Horario exacto, preparación y resultados por semana"
    focus = f"protocolo diario de consumo, horario ideal de absorción y resultados progresivos con {pname}"
    NEW_300_SPECS.append((
        art_slug,
        title,
        "guias-de-productos",
        "Guías de Productos FuXion",
        pslug,
        focus,
    ))

# ============================================================================
# 2. CLÚSTER: Digestión y Limpieza Detox (+50 artículos)
# ============================================================================
DETOX_TOPICS = [
    ("prunex1", "Cómo aliviar el estreñimiento severo en 8 horas con fibras herbales nocturnas", "alivio rápido del tránsito intestinal lento mediante mucílagos vegetales y psyllium"),
    ("prunex1", "Limpieza de colon antes de empezar una dieta para bajar de peso en Perú", "desintoxicación intestinal previa para mejorar la absorción metabólica de nutrientes"),
    ("prunex1", "¿Se puede tomar Prunex1 en el embarazo o lactancia? Recomendaciones y alternativas", "criterios de seguridad digestiva y alternativas suaves de fibra prebiótica"),
    ("prunex1", "Cómo preparar Prunex1 en agua bien caliente para potenciar su efecto nocturno", "temperatura exacta del agua y tiempos de reposo para activar las fibras solubles"),
    ("prunex1", "Estreñimiento por viajes o cambios de rutina en Perú: protocolo de 3 noches con Prunex1", "regularización del ritmo evacuatorio durante viajes de trabajo o vacaciones"),
    ("prunex1", "Hinchazón abdominal después de cenar: cómo desinflamar el vientre mientras duermes", "evacuación matutina ligera y reducción de gases acumulados en el colon"),
    ("prunex1", "Diferencias entre laxantes químicos irritantes y las fibras funcionales de Prunex1", "cuidado de la mucosa intestinal con ciruela, kelp, anís estrella e inulina"),
    ("flora-liv", "Qué tomar para la gastritis crónica y el ardor estomacal de forma natural en Perú", "protección de la mucosa gástrica con pulpa de granadilla y probióticos vivos"),
    ("flora-liv", "Cómo recuperar tu flora intestinal después de tomar antibióticos fuertes", "repoblación de lactobacilos benéficos con 10 mil millones de cultivos probióticos"),
    ("flora-liv", "Síndrome de intestino irritable y colitis nerviosa: nutrición simbiótica con Flora Liv", "equilibrio del eje intestino-cerebro y disminución de espasmos digestivos"),
    ("flora-liv", "Reflujo gastroesofágico y acidez nocturna: hábitos y bebidas regeneradoras", "alivio del ardor esofágico mediante enzimas y mucílagos naturales de granadilla"),
    ("flora-liv", "Salud digestiva infantil en Perú: cómo reforzar el estómago de los niños con probióticos", "prevención de infecciones gastrointestinales y mejora de la asimilación de alimentos"),
    ("flora-liv", "Intolerancia digestiva y gases constantes: el papel de la inulina de achicoria y uchuva", "fermentación saludable y reducción de la distensión abdominal postprandial"),
    ("flora-liv", "Por qué el 70% de tus defensas dependen de tu microbiota intestinal", "inmunidad digestiva y barrera protectora contra bacterias patógenas"),
    ("liquid-fiber", "Fibra soluble diaria para ir al baño todos los días sin dolor ni urgencias", "regulación suave y progresiva del tránsito intestinal con inulina prebiótica"),
    ("liquid-fiber", "Cómo alcanzar los 25 gramos de fibra al día si comes fuera de casa en Lima", "suplementación práctica de fibra prebiótica con vitaminas y minerales"),
    ("liquid-fiber", "Efecto de la fibra prebiótica sobre el colesterol y los triglicéridos en sangre", "captura parcial de lípidos biliares y mejora del perfil lipídico"),
    ("liquid-fiber", "Estreñimiento en adultos mayores: hidratación y fibra líquida de fácil digestión", "movilidad intestinal segura sin deshidratación ni cólicos en la tercera edad"),
    ("liquid-fiber", "Cómo usar Liquid Fiber antes del almuerzo para aumentar la saciedad natural", "control del apetito mediante geles solubles de oligofructosa de achicoria"),
    ("liquid-fiber", "Diferencia entre fibra soluble prebiótica y salvado de trigo tradicional", "nutrición selectiva de bifidobacterias sin irritar las paredes del colon"),
    ("alpha-balance", "Alimentos y bebidas alcalinizantes para combatir la acidez metabólica en Perú", "oxigenación celular con clorofila, espirulina, chlorella y alfalfa"),
    ("alpha-balance", "Cansancio matutino y piel apagada: señales de que tu cuerpo necesita depuración verde", "eliminación de radicales libres y metales pesados con concentrados verdes"),
    ("alpha-balance", "Beneficios de la espirulina y chlorella en polvo para limpiar la sangre", "quelación natural de toxinas y aporte de magnesio y zinc biodisponibles"),
    ("alpha-balance", "Cómo tomar jugo verde alcalino en 30 segundos sin licuadora con Alpha Balance", "practicidad matutina en ayunas con sabor natural a manzana verde y limón"),
    ("alpha-balance", "Acné adulto y toxinas acumuladas: relación entre el pH interno y la salud de la piel", "depuración linfática y alcalinización sistémica para una tez más limpia"),
    ("alpha-balance", "Mal aliento de origen digestivo y sobrecarga ácida: cómo actúa la clorofila natural", "efecto desodorizante interno y frescura digestiva desde el estómago"),
    ("berry-balance", "Cómo prevenir las infecciones urinarias recurrentes (cistitis) con cranberry concentrado", "inhibición de la adhesión bacteriana en la vejiga con proantocianidinas"),
    ("berry-balance", "Piernas y tobillos hinchados al final del día: cómo eliminar líquidos retenidos", "efecto diurético suave con infusión de cáscara de piña y cola de caballo"),
    ("berry-balance", "Cuidado de los riñones en climas cálidos del Perú: hidratación antioxidante con berries", "limpieza de las vías urinarias y mantenimiento del equilibrio electrolítico"),
    ("berry-balance", "Retención de líquidos premenstrual en mujeres: cómo deshincharse naturalmente", "drenaje hídrico saludable con arándano rojo, camu camu y acerola"),
    ("berry-balance", "Por qué tomar agua sola a veces no basta para limpiar el tracto urinario", "aporte de fitoquímicos antioxidantes y antocianinas protectoras del urotelio"),
    ("berry-balance", "Ardor al orinar y molestias vesicales: protocolo de hidratación con Berry Balance", "alivio y protección antioxidante del sistema renal y urinario"),
    ("rexet", "Hígado graso en Perú: alimentación y depuración hepática con alcachofa y tuna roja", "metabolismo de lípidos hepáticos y protección hepatocelular natural"),
    ("rexet", "Boca amarga al despertar y digestión pesada de grasas: señales de sobrecarga biliar", "estimulación del flujo biliar con extracto de alcachofa, perejil y hierba luisa"),
    ("rexet", "Qué tomar después de una cena copiosa o celebración para despertar sin malestar", "rehidratación efervescente y aceleración del metabolismo hepático de toxinas"),
    ("rexet", "Beneficios del complejo B, glutatión y taurina natural para desintoxicar el hígado", "fase I y fase II de detoxificación hepática respaldada por antioxidantes"),
    ("rexet", "Refresco saludable sin azúcar para acompañar comidas criollas condimentadas", "digestión ligera y alivio de la pesadez estomacal con Rexet efervescente"),
    ("rexet", "Cómo cuidar tu hígado si tomas medicación frecuente o trabajas bajo alto estrés", "protección antioxidante con clorofila de algas, acerola y zinc quelado"),
    ("probix", "Cómo reducir la grasa visceral y el perímetro abdominal desde la microbiota con Probix", "acción de 10 mil millones de probióticos lisados sobre la adiposidad abdominal"),
    ("probix", "Qué son los postbióticos y probióticos lisados y por qué resisten bebidas calientes", "estabilidad térmica de cepas funcionales para mezclar en jugos, sopas o infusiones"),
    ("probix", "Relación entre disbiosis intestinal, inflamación crónica y dificultad para adelgazar", "modulación metabólica intestinal y mejora de la sensibilidad insulínica"),
    ("probix", "Cómo agregar Probix sabor neutro a las comidas de toda la familia sin cambiar el sabor", "suplementación invisible de probióticos y magnesio en niños y adultos"),
    ("probix", "Defensas intestinales en temporada de invierno en Lima: protocolo con Probix", "refuerzo de la inmunidad innata desde las placas de Peyer del intestino"),
    ("probix", "Estreñimiento leve e inflamación post-almuerzo: sinergia de Probix con tus bebidas", "mejora de la motilidad y reducción del perímetro de cintura"),
    ("programa-detox-5-dias", "Cómo hacer el Programa Detox 5 Días de FuXion paso a paso en casa", "cronograma completo de oxigenación, limpieza de colon, hígado y riñones"),
    ("programa-detox-5-dias", "Qué comer durante los 5 días del Plan Detox FuXion en Perú (Menú práctico)", "lista de compras y comidas ligeras peruanas para acompañar el protocolo detox"),
    ("programa-detox-5-dias", "Cuántos kilos de toxinas y líquidos retenidos se eliminan en el Detox de 5 Días", "desinflamación abdominal visible y reinicio metabólico en menos de una semana"),
    ("programa-detox-5-dias", "Señales de que tu cuerpo necesita urgente una limpieza integral de 5 días", "fatiga inexplicable, abdomen abultado, tránsito lento y sueño poco reparador"),
    ("programa-detox-5-dias", "Qué hacer al terminar tu Programa Detox 5 Días para mantener el abdomen plano", "transición inteligente hacia el control de peso o mantenimiento saludable"),
    ("programa-detox-5-dias", "Por qué el Detox 5 Días de FuXion incluye proteína y suplementos en lugar de solo jugos", "protección de la masa muscular mientras se depuran colon, hígado y vías urinarias"),
]

for pslug, title, focus in DETOX_TOPICS:
    NEW_300_SPECS.append((
        slugify(title + "-fuxion-peru"),
        title,
        "digestion-y-limpieza-detox",
        "Digestión y Limpieza Detox",
        pslug,
        focus,
    ))

# ============================================================================
# 3. CLÚSTER: Control de Peso y Metabolismo (+55 artículos)
# ============================================================================
WEIGHT_TOPICS = [
    ("thermo-t3", "Cómo oxidar grasa abdominal haciendo ejercicio o caminando con Thermo T3", "activación de la lipólisis mediante té verde, té rojo, té negro y L-carnitina"),
    ("thermo-t3", "¿Es mejor tomar Thermo T3 antes de entrenar o después del almuerzo?", "comparativa de horarios según tu rutina de actividad física o trabajo de oficina"),
    ("thermo-t3", "Beneficios del tamarindo malabar (Garcinia cambogia) y cetonas de frambuesa en Thermo T3", "inhibición de la lipogénesis y uso de ácidos grasos como fuente de energía"),
    ("thermo-t3", "Metabolismo lento después de los 35 años: cómo reactivar la termogénesis natural", "aumento del gasto calórico basal sin alterar el sistema nervioso"),
    ("thermo-t3", "Hígado graso y sobrepeso abdominal: el efecto de los polifenoles del té y ácido alfa lipoico", "movilización de lípidos acumulados y mejora del perfil metabólico"),
    ("nocarb-t", "Qué tomar cuando comes arroz, papa o pastas para evitar picos de glucosa", "reducción de la velocidad de absorción de carbohidratos con fibra de yacón y acacia"),
    ("nocarb-t", "Resistencia a la insulina y prediabetes en Perú: el apoyo de la canela, cromo y yacón", "estabilidad glucémica postprandial y menor almacenamiento de grasa abdominal"),
    ("nocarb-t", "Sueño pesado después de almorzar (marea alcalina): cómo evitarlo con NoCarb-T", "prevención de la hipoglucemia reactiva tras comidas ricas en harinas"),
    ("nocarb-t", "Cómo disfrutar la gastronomía peruana los fines de semana sin subir de peso", "uso estratégico de inhibidores naturales de carbohidratos en almuerzos sociales"),
    ("nocarb-t", "La dupla perfecta Thermo T3 + NoCarb-T: cómo tomarlos juntos después de comer", "sinergia entre bloqueo parcial de azúcares y oxidación de grasas"),
    ("biopro-fit", "Cómo quitar la ansiedad por comer dulces en la tarde o noche con BioPro+ Fit", "control de la hormona grelina y saciedad prolongada gracias a Prolibra"),
    ("biopro-fit", "Por qué perder músculo al hacer dieta provoca efecto rebote y cómo evitarlo", "preservación de la masa magra metabólicamente activa con Bioprotein+ con Colostrum"),
    ("biopro-fit", "Cena saludable en 1 minuto para bajar de peso: batido BioPro+ Fit", "reemplazo ligero de cenas calóricas por proteína bioactiva de alta saciedad"),
    ("biopro-fit", "Flacidez al adelgazar: cómo tonificar brazos, abdomen y piernas mientras pierdes grasa", "nutrición celular de las fibras musculares con aminoácidos esenciales y tamarindo malabar"),
    ("protein-active-fit-chocolate-avellanas", "Proteína vegana germinada sabor chocolate con avellanas para bajar de peso sin lácteos", "digestibilidad del 100% con quinua germinada, arveja, arroz integral y algas"),
    ("protein-active-fit-chocolate-avellanas", "Cómo calmar el antojo de chocolate a media tarde mientras quemas grasa con CLA", "aporte de ácido linoleico conjugado (CLA), L-carnitina y café verde en batido vegetal"),
    ("protein-active-fit-chocolate-avellanas", "Intolerancia a la lactosa y control de peso: ventajas de Bioprotein Active Fit", "nutrición proteica hipoalergénica libre de suero lácteo, soya y gluten"),
    ("protein-active-fit-vainilla-canela", "Batido vegetal de vainilla y canela para acelerar el metabolismo en el desayuno", "saciedad matutina con proteína de germinados, vitaminas B y quemadores naturales"),
    ("protein-active-fit-vainilla-canela", "Recetas de smoothies saludables para adelgazar usando Protein Active Fit Vainilla", "combinaciones con frutos rojos, chía y agua fría para cenas bajas en calorías"),
    ("protein-active-fit-vainilla-canela", "Dieta plant-based en Perú: cómo cubrir tus proteínas y reducir porcentaje de grasa", "biodisponibilidad de aminoácidos vegetales germinados para definición corporal"),
    ("cafe-y-cafe-fit", "Café verde clorogénico para bajar de peso en Perú: cómo funciona Café & Café Fit", "regulación de la glucosa hepática y uso de reservas grasas con café gourmet colombiano"),
    ("cafe-y-cafe-fit", "Cómo reemplazar tu café de las mañanas por un café termogénico que controla el apetito", "energía matutina antioxidante sin azúcar que apoya la reducción de medidas"),
    ("cafe-y-cafe-fit", "Ayuno intermitente 16/8 en Perú: beneficios de tomar Café & Café Fit en la mañana", "extensión de la ventana de oxidación de grasas y supresión natural del hambre"),
    ("cafe-y-cafe-fit", "Propiedades del ácido clorogénico del café verde sobre la celulitis y grasa localizada", "mejora de la microcirculación y lipólisis subcutánea"),
    ("cafe-y-cafe-fit-cappuccino", "Cappuccino saludable bajo en calorías para reducir medidas sin dejar el placer del café", "cremosidad deliciosa con extracto de café verde y leche descremada funcional"),
    ("cafe-y-cafe-fit-cappuccino", "Media tarde en la oficina: cómo evitar las galletas y snacks con Café Fit Cappuccino", "control de la ansiedad vespertina con solo una taza caliente"),
    ("cafe-y-cafe-fit-cappuccino", "Diferencias entre un cappuccino comercial lleno de azúcar y Café & Café Fit Cappuccino", "ahorro de más de 250 calorías vacías por taza con efecto metabólico activo"),
    ("chocolate-fit", "Chocolate caliente funcional con café verde y CLA para bajar de peso en invierno", "placer sin culpa con cacao oscuro amazónico y crema no láctea de almendras"),
    ("chocolate-fit", "Antojo de dulce después de cenar: cómo Chocolate Fit evita que rompas tu dieta", "satisfacción sensorial del cacao puro mientras estimulas la lipólisis nocturna"),
    ("chocolate-fit", "Beneficios de los flavanoles del cacao oscuro sobre el ánimo y el metabolismo", "producción natural de serotonina y control del comer emocional por estrés"),
    ("protein-xoup-crema-criolla", "Cenas calientes para adelgazar: Crema Criolla proteica lista en 1 minuto", "sabor tradicional peruano con Bioprotein Active germinada e inulina prebiótica"),
    ("protein-xoup-crema-criolla", "Qué cenar en invierno en Lima para bajar de peso sin pasar frío ni hambre", "sopa reconfortante alta en proteínas y libre de harinas refinadas"),
    ("protein-xoup-brocoli-parmesano", "Crema de Brócoli Parmesano rica en proteína para controlar el apetito nocturno", "nutrición salada funcional con antioxidantes crucíferos y aminoácidos esenciales"),
    ("protein-xoup-brocoli-parmesano", "Almuerzo rápido de oficina para mantener tu peso: Protein Xoup + ensalada", "combinación práctica, saciante y económica para días de mucho trabajo"),
    ("protein-xoup-esparragos-alcachofa", "Crema de Espárragos y Alcachofa: cena depurativa y proteica para deshinchar el abdomen", "efecto diurético y hepatoprotector de la alcachofa unido a proteína de alto valor"),
    ("protein-xoup-esparragos-alcachofa", "Por qué cambiar el pan de la noche por una sopa proteica acelera la pérdida de grasa", "reducción nocturna de insulina y estímulo de la hormona de crecimiento"),
    ("pack-5-14-active-mito", "Cómo funciona el Pack 5/14 Active Mito para bajar hasta 10% de peso en 14 días", "plan integral vegano de 5 comidas al día con productos FuXion incluidos"),
    ("pack-5-14-active-mito", "Qué incluye la caja del Pack 5/14 Active Mito y cómo organizar tus horarios", "detalle de sobres de Prunex1, Vita Xtra T+, Thermo T3, NoCarb-T y Protein Active Fit"),
    ("pack-5-14-active-mito", "Activación mitocondrial y pérdida de grasa: la ciencia detrás del Plan 5/14 Active", "eficiencia celular para quemar calorías sin perder vitalidad ni masa muscular"),
    ("pack-5-14-active-mito", "Menú peruano de 14 días para acompañar tu Pack 5/14 Active Mito en casa", "opciones prácticas de desayunos, almuerzos y cenas saludables con ingredientes locales"),
    ("pack-5-14-keto", "Dieta Keto en Perú: cómo entrar en cetosis rápida y segura con el Pack 5/14 Keto", "protocolo cetogénico de 14 días asistido con bebidas nutracéuticas FuXion"),
    ("pack-5-14-keto", "Cómo evitar la gripe keto (cansancio y dolor de cabeza) al reducir los carbohidratos", "aporte de electrolitos, energía vegetal y proteínas limpias del Pack 5/14 Keto"),
    ("pack-5-14-keto", "Pack 5/14 Active Mito vs Pack 5/14 Keto: ¿Cuál elegir según tu metabolismo?", "comparativa completa entre el plan hipocalórico vegano y el protocolo cetogénico"),
    ("pack-5-14-keto", "Resultados reales a los 7 y 14 días con el sistema 5/14 de FuXion en Perú", "evolución de medidas de cintura, porcentaje de grasa y niveles de energía"),
    ("combo-ponte-en-forma", "Combo Ponte en Forma FuXion: el paquete mensual completo para transformar tu figura", "combinación sinérgica de limpieza, proteínas, termogénicos y control de carbohidratos"),
    ("combo-ponte-en-forma", "Cómo distribuir los productos del Combo Ponte en Forma durante 30 días", "calendario diario desde el desayuno hasta la noche para resultados sostenibles"),
    ("combo-ponte-en-forma", "Por qué comprar un combo integral de control de peso da mejores resultados que un solo producto", "abordaje simultáneo de saciedad, oxidación lipídica, microbiota y glucemia"),
    ("combo-ponte-en-forma", "Plan de 90 días para personas con sobrepeso superior a 10 kilos en Perú", "fases de desintoxicación, quema intensiva y consolidación metabólica"),
    ("limitlex-snack-recharge", "Limitlex Snack Recharge+: el snack funcional para cortar el hambre a media mañana", "aporte inteligente de nutrientes saciantes sin azúcares añadidos ni octógonos"),
    ("limitlex-snack-recharge", "Qué llevar en la cartera o mochila para no caer en comida chatarra en el tráfico de Lima", "colación práctica y saludable con Limitlex Snack Recharge+"),
    ("limitlex-snack-recharge", "Importancia de las meriendas de media mañana y media tarde para acelerar el metabolismo", "estabilidad de la glucosa durante la jornada laboral"),
    ("thermo-t3", "Cómo eliminar la grasa de la espalda y cintura combinando Thermo T3 y caminata rápida", "protocolo aeróbico de zona 2 potenciado con catequinas de té verde"),
    ("nocarb-t", "Control de triglicéridos altos en Perú: cómo reducir el impacto de las harinas con NoCarb-T", "disminución de la lipogénesis hepática inducida por exceso de almidones"),
    ("biopro-fit", "Cómo preparar batidos frappé con BioPro+ Fit, hielo y canela para el verano en Perú", "ideas refrescantes de alta proteína para controlar el peso en temporada de calor"),
    ("cafe-y-cafe-fit", "Cuántas tazas de Café & Café Fit se pueden tomar al día para potenciar la quema de grasa", "dosis óptima de polifenoles de café verde en la mañana y media tarde"),
]

for pslug, title, focus in WEIGHT_TOPICS:
    NEW_300_SPECS.append((
        slugify(title + "-fuxion-peru"),
        title,
        "control-de-peso-y-metabolismo",
        "Control de Peso y Metabolismo",
        pslug,
        focus,
    ))

# ============================================================================
# 4. CLÚSTER: Colágeno, Belleza y Articulaciones (+45 artículos)
# ============================================================================
BEAUTY_TOPICS = [
    ("beauty-in", "A qué edad empezar a tomar colágeno en Perú y por qué los péptidos bioactivos son superiores", "prevención de la pérdida del 1.5% anual de colágeno dérmico a partir de los 25 años"),
    ("beauty-in", "Caída de cabello en mujeres y uñas quebradizas: el rol de la biotina natural (Sesbania) en Beauty-In", "fortalecimiento del folículo piloso y queratina ungueal desde la raíz"),
    ("beauty-in", "Colágeno común hidrolizado vs Péptidos de Colágeno Bioactivo Optimizado de Beauty-In", "absorción 5 veces mayor directamente hacia los fibroblastos de la piel"),
    ("beauty-in", "Cómo atenuar líneas de expresión, patas de gallo y flacidez facial desde adentro", "síntesis endógena de colágeno tipo I y III y elastina con Coenzima Q10"),
    ("beauty-in", "Recuperación de la piel después del embarazo o pérdida de peso con Beauty-In", "mejora de la densidad dérmica, elasticidad e hidratación profunda"),
    ("beauty-in", "Beneficios del ácido hialurónico, vitamina C de camu camu y vitamina E para iluminar el rostro", "efecto glow natural y protección contra el fotoenvejecimiento solar"),
    ("beauty-in", "¿Es mejor tomar Beauty-In en la mañana o antes de dormir? Guía de absorción", "aprovechamiento del ciclo circadiano de regeneración epitelial nocturna"),
    ("youth-elixir", "Cómo estimular de forma natural la hormona de la juventud (HGH) mientras duermes", "nutrición hipofisaria con L-arginina, L-ornitina, L-lisina y L-glutamina"),
    ("youth-elixir", "Resveratrol de uvas, optiberry y antioxidantes para frenar el envejecimiento celular", "activación de los genes de longevidad (sirtuinas) y protección del ADN"),
    ("youth-elixir", "Sueño superficial y despertar cansado: cómo Youth Elixir mejora la fase REM profunda", "descanso reparador nocturno que despierta con energía y piel descansada"),
    ("youth-elixir", "La combinación antiedad definitiva: cómo tomar Beauty-In y Youth Elixir juntos", "sinergia de colágeno bioactivo más precursores de regeneración celular nocturna"),
    ("youth-elixir", "Vitalidad, tono muscular y rejuvenecimiento en hombres y mujeres mayores de 45 años", "recuperación de la firmeza corporal y calidad de sueño en la madurez"),
    ("youth-elixir", "Antioxidantes del maíz morado, acai y arándanos contra el estrés oxidativo urbano", "defensa celular frente a la contaminación y el ritmo acelerado de ciudad"),
    ("youth-elixir", "Por qué dormir bien con Youth Elixir también ayuda a adelgazar y bajar el cortisol", "regulación hormonal nocturna de leptina y grelina durante el sueño profundo"),
    ("golden-flx", "Dolor de rodillas al subir o bajar escaleras: cómo desinflamar las articulaciones con Golden FLX", "acción analgésica y antiinflamatoria natural de la cúrcuma orgánica TurmiPure"),
    ("golden-flx", "Por qué la cúrcuma de cocina casi no se absorbe y cómo TurmiPure multiplica su biodisponibilidad", "tecnología patentada de curcuminoides de alta absorción sin irritar el estómago"),
    ("golden-flx", "Rigidez articular al despertar en las manos, cadera o espalda: protocolo con leche dorada", "lubricación y flexibilidad matutina con jengibre, cardamomo y leche de coco"),
    ("golden-flx", "Protección del cartílago en corredores, futbolistas y personas que entrenan fuerza", "prevención del desgaste articular por impacto repetitivo con Golden FLX"),
    ("golden-flx", "Cómo preparar Golden FLX caliente con leche de coco para una noche reconfortante", "bebida funcional antiinflamatoria ideal para el clima húmedo de Lima"),
    ("golden-flx", "Combinación Golden FLX + Beauty-In para regenerar cartílagos, tendones y ligamentos", "freno a la inflamación articular unido a bloques estructurales de colágeno"),
    ("golden-flx", "Sobrepeso y dolor articular en tobillos y rodillas: alivio natural mientras bajas de peso", "reducción del dolor mecánico e inflamatorio para retomar la actividad física"),
    ("probal", "Bochornos, sudoración nocturna y cambios de humor en la menopausia: alivio con Probal", "fitoestrógenos naturales de isoflavonas de soya, aguaje y dong quai"),
    ("probal", "Cólicos menstruales intensos y síndrome premenstrual (SPM): cómo equilibrar tu ciclo", "acción antiespasmódica y reguladora hormonal del extracto de orégano y salvia"),
    ("probal", "Beneficios del aguaje amazónico y el dong quai para la salud hormonal femenina en Perú", "nutrición endocrina natural que protege huesos, piel y bienestar emocional"),
    ("probal", "Caída del ánimo, irritabilidad e insomnio asociados a cambios hormonales en la mujer", "aporte de L-triptófano, magnesio y fitoestrógenos en una infusión nocturna"),
    ("probal", "Salud femenina después de los 40 años: cómo transitar la perimenopausia con plenitud", "mantenimiento del equilibrio hormonal sin terapias sintéticas agresivas"),
    ("probal", "Retención de líquidos y sensibilidad mamaria antes del periodo: protocolo Probal + Berry Balance", "desinflamación y confort integral durante todo el mes"),
    ("passion", "Cómo mejorar la circulación sanguínea, la energía y el deseo en pareja con Passion", "producción de óxido nítrico endotelial gracias a la L-arginina y jalea real"),
    ("passion", "Manos y pies fríos por mala circulación: beneficios vasodilatadores de la L-arginina", "oxigenación periférica y salud vascular con extracto de ginseng y guaraná"),
    ("passion", "Falta de vitalidad y agotamiento al final del día que afecta la vida en pareja", "recuperación del vigor físico y anímico con jalea real, zinc y aminoácidos"),
    ("passion", "Rendimiento físico y resistencia cardiovascular: usos de Passion antes del ejercicio", "mejora del bombeo sanguíneo hacia los músculos y mayor oxigenación"),
    ("passion", "Beneficios del zinc orgánico y la jalea real para el vigor masculino y femenino", "nutrición hormonal y energética 100% natural libre de químicos"),
    ("passion", "Cómo combinar Passion y Vita Xtra T+ para días de máxima exigencia física", "energía sostenida y flujo circulatorio óptimo"),
    ("zoom-in", "Vista cansada, ojo seco y fatiga visual por trabajar todo el día frente a la computadora", "protección macular contra la luz azul de pantallas con luteína y zeaxantina de Zoom-In"),
    ("zoom-in", "Qué son la luteína, zeaxantina y astaxantina y cómo protegen tu retina con los años", "filtro antioxidante ocular de alta potencia en sobres prácticos Zoom-In"),
    ("zoom-in", "Visión borrosa al final de la tarde y dolor de cabeza visual en estudiantes y programadores", "nutrición específica para la acomodación visual y microcirculación de la retina"),
    ("zoom-in", "Prevención del envejecimiento ocular en adultos mayores en Perú con Zoom-In", "cuidado de la mácula y nitidez visual frente a la radiación UV"),
    ("zoom-in", "Cómo cuidar la vista de adolescentes y gamers expuestos a celulares y monitores", "hábito diario de protección antioxidante ocular con un stick de Zoom-In"),
    ("zoom-in", "Sinergia Zoom-In + ON para jornadas intensas de lectura, contabilidad o programación", "enfoque cerebral y nitidez visual sin agotamiento"),
    ("tomatodo-beauty-in-shaker", "Cómo disolver tu colágeno Beauty-In sin grumos usando el Tomatodo Shaker Oficial", "mezclado homogéneo en segundos con rejilla batidora libre de BPA"),
    ("tomatodo-beauty-in-shaker", "Por qué tener tu propio Shaker FuXion en el escritorio te ayuda a no olvidar tu colágeno diario", "constancia en tu hábito de belleza e hidratación diaria"),
    ("beauty-in", "Cuidado de la piel en el verano de Perú: protección antioxidante interna con Beauty-In", "defensa contra los radicales libres del sol desde la dermis profunda"),
    ("golden-flx", "Salud digestiva y desinflamación sistémica: beneficios adicionales de la cúrcuma y el jengibre", "protección hepática, digestiva y articular en una sola taza"),
    ("probal", "Cuidado de la salud ósea y articular en la mujer durante la menopausia: Probal + Golden FLX", "prevención de la descalcificación y alivio de dolores articulares"),
    ("youth-elixir", "Cómo preparar tu rutina nocturna de longevidad a las 9:00 p.m. con Youth Elixir", "hábitos de higiene del sueño y nutrición regeneradora celular"),
]

for pslug, title, focus in BEAUTY_TOPICS:
    NEW_300_SPECS.append((
        slugify(title + "-fuxion-peru"),
        title,
        "colageno-belleza-y-articulaciones",
        "Colágeno, Belleza y Articulaciones",
        pslug,
        focus,
    ))

# ============================================================================
# 5. CLÚSTER: Energía, Mente y Descanso (+45 artículos)
# ============================================================================
ENERGY_MIND_TOPICS = [
    ("vita-xtra-t", "Cansancio extremo al despertar aunque hayas dormido: cómo activar tu energía celular", "revitalización matutina con guayusa amazónica, té verde, acai berry y micelio de cordyceps"),
    ("vita-xtra-t", "Por qué cambiar las bebidas energizantes azucaradas por Vita Xtra T+ protege tu corazón", "energía limpia sin picos de azúcar ni bajones bruscos a media mañana"),
    ("vita-xtra-t", "Beneficios del fruto de Acai Berry, Goji y Camu Camu para combatir el envejecimiento y la fatiga", "aporte masivo de antocianinas y vitamina C natural"),
    ("vita-xtra-t", "Qué tomar para aguantar turnos largos de trabajo, guardias médicas o conducción en carretera", "alerta sostenida y resistencia física durante toda la jornada"),
    ("vita-xtra-t", "Cómo preparar Vita Xtra T+ con hielo y limón como refresco energizante de almuerzo", "hidratación revitalizante sabor chicha morada / frutos amazónicos"),
    ("vitaenergia", "Falta de ánimo y debilidad general: suplementación diaria de vitaminas y minerales con Vitaenergía", "micronutrición completa con aminoácidos, vitaminas A, C, D, E, complejo B y hierro"),
    ("vitaenergia", "El refresco diario ideal para toda la familia en Perú: Vitaenergía sabor maíz morado", "antocianinas del maíz morado y camu camu para niños, jóvenes y adultos mayores"),
    ("vitaenergia", "Recuperación de la energía después de una gripe, infección o convalecencia", "reposición de reservas vitamínicas y minerales esenciales"),
    ("vitaenergia", "Diferencia entre Vitaenergía y Vita Xtra T+: ¿cuál elegir según tu actividad diaria?", "guía comparativa entre multivitamínico familiar y energizante de alto rendimiento"),
    ("vita-xtra-t-mojito", "Vita Xtra T+ Sabor Mojito: energía refrescante con hierbabuena y limón sin alcohol ni azúcar", "mocktail funcional energizante para tardes de calor o reuniones sociales"),
    ("vita-xtra-t-mojito", "Recetas de bebidas funcionales frías con Vita Xtra T+ Mojito, agua con gas y menta fresca", "alternativa saludable a las gaseosas y cócteles calóricos"),
    ("vita-xtra-t-mojito", "Cómo combatir el sueño después de almorzar en verano con Vita Xtra T+ Mojito bien helado", "reactivación inmediata de la energía física y mental"),
    ("vita-xtra-t-verano", "Vita Xtra T+ Edición Verano: hidratación energizante tropical para días de sol y playa", "fórmula antioxidante refrescante con guayusa, té verde y extractos frutales"),
    ("vita-xtra-t-verano", "Cómo mantener tu energía alta al entrenar al aire libre en verano sin deshidratarte", "reposición de vitalidad y antioxidantes bajo temperaturas altas"),
    ("xpeed", "Xpeed en lata de FuXion: bebida energizante natural con maca, guaraná y teína lista para tomar", "energía inmediata en formato lata sin taurina sintética ni exceso de calorías"),
    ("xpeed", "Por qué el Pack x 4 latas de Xpeed es el compañero ideal para viajes y jornadas intensas", "practicidad lista para enfriar y llevar en el auto o mochila"),
    ("xpeed-citrus-power", "Xpeed Citrus Power: explosión cítrica de energía natural con maca andina y complejo B", "rendimiento físico y mental inmediato con sabor cítrico refrescante"),
    ("xpeed-citrus-power", "Comparativa entre energizantes comerciales de grifo y Xpeed Citrus Power de FuXion", "fórmula Clean Label endulzada con stevia frente a jarabes de alta fructosa"),
    ("matcha-pep-t", "Matcha Pep-T FuXion: energía serena y enfoque prolongado con té matcha japonés y péptidos", "liberación gradual de energía gracias a la sinergia natural de L-teanina y catequinas"),
    ("matcha-pep-t", "Cómo preparar un Matcha Latte funcional frío o caliente en 30 segundos con Matcha Pep-T", "textura cremosa, antioxidantes EGCG y nutrición peptídica bioactiva"),
    ("matcha-pep-t", "Por qué el té matcha con péptidos no produce nerviosismo ni ansiedad como el café expreso", "ondas cerebrales alfa de concentración tranquila durante 4 a 6 horas"),
    ("matcha-pep-t", "Beneficios antioxidantes y metabólicos de tomar Matcha Pep-T a media mañana", "protección celular y estímulo suave del metabolismo energético"),
    ("on", "Cómo mejorar la concentración y evitar distracciones en el trabajo o universidad con ON", "nutrición nootrópica natural con yerba mate, taurina natural, GABA y aminoácidos"),
    ("on", "Época de exámenes finales, tesis o cierres contables: protocolo de enfoque mental con ON", "agilidad mental, retención de lectura y reducción de la fatiga cognitiva"),
    ("on", "Niebla mental (brain fog) a media mañana: cómo despejar la mente sin exceso de cafeína", "oxigenación y neurotransmisores cerebrales con vitamina C, complejo B y DHA/ARA"),
    ("on", "ON vs Vita Xtra T+: ¿cuándo necesitas energía para el cuerpo y cuándo enfoque para el cerebro?", "elección inteligente según trabajo intelectual o desgaste físico"),
    ("iq-plus", "IQ+ FuXion: suplemento avanzado para potenciar la memoria, el aprendizaje y la agudeza mental", "neuroprotección y plasticidad sináptica con ingredientes nootrópicos de última generación"),
    ("iq-plus", "Cómo cuidar la memoria y prevenir olvidos frecuentes a partir de los 40 y 50 años con IQ+", "nutrición cognitiva preventiva para mantener la mente rápida y lúcida"),
    ("iq-plus", "Suplementación para ajedrecistas, programadores, ingenieros y opositores en Perú con IQ+", "velocidad de procesamiento mental y enfoque sostenido bajo presión"),
    ("iq-plus", "Cómo combinar IQ+ por la mañana y Rezzt+ por la noche para un ciclo cognitivo perfecto", "rendimiento intelectual diurno y consolidación de la memoria durante el sueño"),
    ("no-stress", "Ansiedad laboral, irritabilidad y tensión en cuello y hombros: cómo relajarte con NO STRESS (Off)", "modulación natural del estrés con L-teanina, ashwagandha, amalaki y triptófano"),
    ("no-stress", "Beneficios de la Ashwagandha y el Magnesio orgánico para bajar el cortisol alto", "equilibrio del sistema nervioso autónomo sin causar somnolencia diurna"),
    ("no-stress", "Cómo mantener la calma antes de una presentación importante, entrevista o tráfico pesado", "enfoque relajado y control de la respuesta de alerta excesiva"),
    ("no-stress", "Comer por ansiedad en la tarde: cómo un vaso de NO STRESS frena el hambre emocional", "aumento natural de serotonina y GABA para calmar los impulsos nerviosos"),
    ("no-stress", "Dolor de cabeza tensional por estrés acumulado: hidratación relajante con Off de FuXion", "alivio de la sobrecarga mental al terminar la jornada de trabajo"),
    ("rezzt-plus", "Insomnio y dificultad para conciliar el sueño: cómo dormir profundo de forma natural con Rezzt+", "inducción suave del descanso reparador sin generar dependencia ni resaca al despertar"),
    ("rezzt-plus", "Despertarse a las 3:00 a.m. y no poder volver a dormir: protocolo nocturno con Rezzt+", "continuidad del ciclo del sueño profundo y regulación del reloj biológico"),
    ("rezzt-plus", "Cómo recuperar tu horario de sueño si trabajas en turnos rotativos o viajas con frecuencia", "sincronización circadiana natural tomando Rezzt+ 30 minutos antes de acostarte"),
    ("rezzt-plus", "Diferencia entre pastillas para dormir y los fitonutrientes relajantes de Rezzt+ FuXion", "descanso fisiológico natural que respeta las fases REM y de sueño profundo"),
    ("rezzt-plus", "La dupla nocturna contra el insomnio por estrés: NO STRESS en la tarde + Rezzt+ antes de dormir", "desaceleración progresiva del sistema nervioso para dormir de corrido"),
    ("vita-xtra-t", "Cómo superar el agotamiento de lunes por la mañana y mantener tu productividad toda la semana", "hábito matutino de energía antioxidante en Perú"),
    ("on", "Productividad para emprendedores y trabajo remoto en casa: rutina matutina con ON", "claridad mental desde la primera hora del día"),
    ("no-stress", "Síndrome de Burnout (agotamiento laboral): nutrición adaptógena con Ashwagandha y L-teanina", "recuperación de la resiliencia emocional y el bienestar diario"),
    ("iq-plus", "Cómo apoyar la atención y concentración en jóvenes universitarios con IQ+ de FuXion", "enfoque académico natural libre de estimulantes artificiales"),
    ("vitaenergia", "Lonchera saludable y energía para escolares y adolescentes en Perú con Vitaenergía", "hidratación rica en vitaminas sin octógonos ni colorantes químicos"),
]

for pslug, title, focus in ENERGY_MIND_TOPICS:
    NEW_300_SPECS.append((
        slugify(title + "-fuxion-peru"),
        title,
        "energia-mente-y-descanso",
        "Energía, Mente y Descanso",
        pslug,
        focus,
    ))

# ============================================================================
# 6. CLÚSTER: Inmunidad, Deporte y Compra en Perú (+45 artículos)
# ============================================================================
IMMUNITY_SPORT_TOPICS = [
    ("vera-plus", "Alergias respiratorias, rinitis y cambio de clima en Lima: cómo reforzar tus bronquios con Vera+", "inmunomodulación con Wellmune WGP (beta-glucanos), aloe vera, hoja de olivo y L-cisteína"),
    ("vera-plus", "Por qué la L-cisteína y el Aloe Vera de Vera+ ayudan a fluidificar y limpiar las vías respiratorias", "precursor directo del glutatión pulmonar y protección de mucosas respiratorias"),
    ("vera-plus", "Resfríos frecuentes cada cambio de estación: protocolo preventivo de 28 días con Vera+", "multiplicación de la respuesta de neutrófilos y macrófagos del sistema inmune"),
    ("vera-plus", "Cómo tomar Vera+ caliente por las noches durante el invierno en Lima, Arequipa, Cusco y Puno", "infusión reconfortante sabor menta para proteger garganta y pulmones"),
    ("gano-plus-t", "Beneficios del hongo Ganoderma Lucidum (Reishi) en Gano+ T para las defensas y longevidad", "aporte de triterpenos y polisacáridos inmunorreguladores con té blanco y vitaminas C y D"),
    ("gano-plus-t", "Propiedades antioxidantes y antiinflamatorias del Ganoderma Lucidum respaldadas por la ciencia", "protección celular integral y modulación de las defensas naturales"),
    ("gano-plus-cappuccino", "Gano+ Cappuccino: cómo disfrutar un cappuccino cremoso mientras subes tus defensas con Ganoderma", "combinación deliciosa de café, extracto de Reishi y calcio lácteo"),
    ("gano-plus-cappuccino", "Desayunos y medias tardes inmunológicas para adultos mayores con Gano+ Cappuccino", "nutrición reconfortante que cuida el sistema inmune y los huesos"),
    ("cafe-ganomax", "Café Ganomax FuXion: la sinergia de Ganoderma Lucidum y Uña de Gato peruana en tu taza de café", "doble escudo inmunológico y antiinflamatorio amazónico-asiático"),
    ("cafe-ganomax", "Beneficios de la Uña de Gato (Uncaria tomentosa) del Perú combinada con café tostado gourmet", "defensa inmunológica diaria y poder antioxidante en cada mañana"),
    ("biopro-tect", "Cómo elevar las defensas de niños, adultos y abuelos en casa con BioPro+ Tect", "proteína patentada con calostro bovino (inmunoglobulinas), Bioferrín y lactoferrina"),
    ("biopro-tect", "Desnutrición, bajo peso o pérdida de apetito en adultos mayores: suplementación con BioPro+ Tect", "regeneración de tejidos, masa muscular y sistema inmune con 100% de valor biológico"),
    ("biopro-tect", "Recuperación post-operatoria o tras una enfermedad: nutrición celular con BioPro+ Tect", "aporte de factores de transferencia inmunológicos, calcio lácteo y DHA/ARA"),
    ("nutraday", "Cómo prevenir la anemia infantil en Perú con Nutraday: moringa, hierro orgánico y 12 vitaminas", "absorción superior de hierro aminoquelado con sabor natural a fresa que encanta a los niños"),
    ("nutraday", "Niños que no quieren comer verduras: cómo asegurar sus micronutrientes diarios con Nutraday", "extracto de moringa, guayaba, limón, albahaca, vitaminas A, C, D, complejo B y zinc"),
    ("nutraday", "Combinación Nutraday + BioPro+ Tect para el crecimiento, talla y defensas en edad escolar", "desayuno potenciado con proteínas de alto valor y multivitamínico natural"),
    ("protein-active-chocolate-avellanas", "Proteína vegetal germinada para veganos y personas con estómago sensible: Protein Active Chocolate", "aminoácidos esenciales de quinua germinada, arveja y arroz integral para regeneración diaria"),
    ("protein-active-vainilla-canela", "Cómo enriquecer la avena o panqueques del desayuno con Protein Active Vainilla y Canela", "recetas nutritivas familiares con proteína 100% vegetal de alta asimilación"),
    ("biopro-sport", "Cómo ganar masa muscular limpia sin grasa abdominal usando BioPro+ Sport después de entrenar", "síntesis proteica miofibrilar potenciada con Actinos (vasodilatador) y aminoácidos ramificados"),
    ("biopro-sport", "Qué es Actinos en BioPro+ Sport y cómo aumenta el flujo sanguíneo y la oxigenación muscular", "entrega acelerada de nutrientes al músculo durante la ventana anabólica"),
    ("biopro-sport", "Cuántos gramos de proteína tomar después del gimnasio según tu peso corporal en Perú", "guía práctica de dosificación deportiva con BioPro+ Sport"),
    ("protein-active-sport-chocolate-avellanas", "Proteína deportiva 100% vegana con BCAA y L-glutamina: Protein Active Sport Chocolate", "hipertrofia y recuperación muscular con proteína germinada libre de suero lácteo"),
    ("protein-active-sport-chocolate-avellanas", "Por qué los deportistas con acné o digestión pesada al whey protein prefieren Protein Active Sport", "ausencia total de lactosa y caseína manteniendo el máximo perfil de aminoácidos"),
    ("protein-active-sport-vainilla-canela", "Batido post-entreno de vainilla y canela para corredores, ciclistas y crossfitters", "reparación de fibras musculares con péptidos vegetales germinados"),
    ("pre-sport", "Qué tomar 20 minutos antes de entrenar para rendir al máximo: Pre Sport de FuXion", "energía explosiva con creatina, beta-alanina, L-arginina (citrulina/remolacha) y yerba mate"),
    ("pre-sport", "Pre-entreno natural sin taquicardia ni caída brusca de energía: ventajas de Pre Sport", "vasodilatación muscular, resistencia a la fatiga láctica e hidratación isotónica"),
    ("post-sport", "Cómo eliminar el dolor muscular tardío (agujetas) y recuperar tus músculos con Post Sport", "reposición inmediata de L-glutamina, BCAA, electrolitos y antioxidantes de granada"),
    ("post-sport", "Por qué tomar Post Sport justo al terminar tu rutina protege tus músculos del catabolismo", "rehidratación celular y regeneración de fibras tras entrenamientos intensos"),
    ("xtra-mile", "Hidratación para maratón, ciclismo, fútbol y vóley en Perú: cómo funciona Xtra Mile", "energía de liberación lenta con Palatinose (isomaltulosa), agua de coco y sal de Maras"),
    ("xtra-mile", "Cómo evitar los calambres musculares y la deshidratación en carreras de 10K, 21K y 42K", "equilibrio de 5 electrolitos con auténtica sal rosada de Maras en Xtra Mile"),
    ("xtra-mile", "Diferencia entre bebidas deportivas comerciales llenas de azúcar y Xtra Mile con Palatinose", "índice glucémico bajo que mantiene la energía estable sin malestar estomacal al correr"),
    ("base-madre-verde", "Cómo preparar arroz con pollo y seco a la norteña saludables con Base Madre Verde de Gastón Acurio", "aderezo 100% natural de culantro, espinaca, ajo y cebolla libre de glutamato monosódico"),
    ("base-madre-verde", "Cocina peruana saludable en 5 minutos: beneficios de cocinar con aderezos naturales FuXion", "sabor criollo auténtico sin conservantes artificiales ni exceso de sodio"),
    ("base-madre-amarilla", "Receta de ají de gallina y cremas peruanas saludables usando Base Madre Amarilla", "pasta natural de ají mirasol y ají amarillo desarrollada por Gastón Acurio y FuXion"),
    ("base-madre-amarilla", "Por qué eliminar los sazonadores químicos de tu cocina mejora tu digestión y presión arterial", "alimentación Clean Label en el almuerzo familiar peruano"),
    ("base-madre-roja", "Cómo hacer estofados, adobos y carapulcra saludables en casa con Base Madre Roja", "sofrito natural de ají panca, tomate y especias listo para usar"),
    ("tomatodo-azul", "Hidratación diaria en el trabajo y gimnasio con el Tomatodo Oficial FuXion Azul", "material libre de BPA con medidas exactas para preparar tus sticks de 180 a 500 ml"),
    ("tomatodo-sport-pro-edition", "Tomatodo Sport Pro Edition FuXion: el shaker de alta resistencia para tus proteínas y pre-entrenos", "cierre hermético antiderrames y rejilla mezcladora para batidos sin grumos"),
    ("prunex1", "Dónde comprar productos FuXion originales en Arequipa, Trujillo y Chiclayo con envío a domicilio", "compra online segura en shop.site.fuxion.com con despacho directo a provincias"),
    ("thermo-t3", "Dónde comprar FuXion en Cusco, Piura, Huancayo e Iquitos a precio oficial de catálogo", "cobertura nacional de envíos y pago seguro con tarjetas en Soles"),
    ("beauty-in", "Guía para comprar FuXion en Lima Metropolitana (Miraflores, Surco, San Isidro, Los Olivos, San Juan)", "entrega rápida a domicilio desde el centro de distribución oficial"),
    ("vita-xtra-t", "Cómo verificar que tus productos FuXion sean 100% originales y con fecha de vencimiento vigente", "importancia de comprar directamente en la plataforma oficial shop.site.fuxion.com"),
    ("biopro-sport", "El Pack Deportivo Completo FuXion: cómo combinar Pre Sport, Xtra Mile, Post Sport y BioPro+ Sport", "protocolo antes, durante y después del entrenamiento para atletas en Perú"),
    ("vera-plus", "Pack Inmunológico FuXion para el invierno en Perú: Vera+ + BioPro+ Tect + Gano+ T", "blindaje respiratorio y celular para niños y adultos"),
    ("flora-liv", "Qué productos FuXion pueden tomar los niños según su edad: Flora Liv, Nutraday, Vitaenergía y BioPro+ Tect", "guía completa de nutrición pediátrica funcional para padres en Perú"),
]

for pslug, title, focus in IMMUNITY_SPORT_TOPICS:
    NEW_300_SPECS.append((
        slugify(title + "-fuxion-peru"),
        title,
        "inmunidad-deporte-y-compras-peru",
        "Inmunidad, Deporte y Compra en Perú",
        pslug,
        focus,
    ))

assert len(NEW_300_SPECS) == 300, f"Expected 300 new specs, got {len(NEW_300_SPECS)}"
ALL_405_SPECS = ORIGINAL_105_SPECS + NEW_300_SPECS
print("Total specs:", len(ALL_405_SPECS))


def build_rich_article(idx: int, spec: tuple, prod_map: dict) -> dict:
    slug, title, cluster_slug, cluster_name, prod_slug, focus_topic = spec
    prod = prod_map[prod_slug]
    clean_name = prod["cleanName"]
    price_fmt = prod["formattedPrice"]
    pack_str = prod["pack"]
    shop_url = prod["shopUrl"]
    direct_url = prod["directProductUrl"]
    combo_slugs = prod.get("recommendedCombinations", [])[:3]
    combo_names = [prod_map[cs]["cleanName"] for cs in combo_slugs if cs in prod_map]

    month = ((idx % 10) + 1)
    day = ((idx * 3) % 27) + 1
    pub_date = f"2026-{month:02d}-{day:02d}"

    excerpt = (
        f"Guía práctica sobre {focus_topic} con {clean_name} de FuXion Perú. "
        f"Conoce sus beneficios, ingredientes, horario ideal y enlace de compra oficial ({price_fmt})."
    )
    if len(excerpt) > 165:
        excerpt = excerpt[:162].rsplit(" ", 1)[0] + "..."

    benefits_lis = "".join(f"<li><strong>{b}</strong></li>" for b in prod["benefits"])
    ingredients_badges = (
        ", ".join(f"<strong>{ing}</strong>" for ing in prod["ingredients"])
        if prod["ingredients"]
        else "extractos nutracéuticos de origen natural"
    )

    combos_html = ""
    if combo_names:
        links_str = ", ".join(
            f'<a href="/productos/{cs}/"><strong>{prod_map[cs]["cleanName"]}</strong></a> ({prod_map[cs]["formattedPrice"]})'
            for cs in combo_slugs
            if cs in prod_map
        )
        combos_html = (
            f"<p>Para multiplicar los resultados en <strong>{focus_topic}</strong>, puedes combinar "
            f'<strong>{clean_name}</strong> con {links_str}, todos disponibles en la <a href="{shop_url}">Tienda Oficial FuXion Perú</a>.</p>'
        )

    # Rotate across 3 distinct editorial structures so articles have varied headings & depth
    variant = idx % 3

    if variant == 0:
        intro_html = f"""
<p>En el Perú, cada vez más personas buscan soluciones efectivas, seguras y respaldadas por la biotecnología para abordar el objetivo de <strong>{focus_topic}</strong>. Dentro del sistema de <strong>Fusión Nutracéutica®</strong> desarrollado por FuXion Biotech SAC, <strong><a href="/productos/{prod['slug']}/">{clean_name}</a></strong> destaca como el producto de referencia por su alta concentración de principios activos naturales.</p>
<p>A continuación encontrarás una guía completa con todo lo que necesitas saber: cómo actúa en tu organismo, por qué su fórmula <em>Clean Label</em> marca la diferencia, en qué horario tomarlo y cómo pedirlo directamente en la <strong><a href="{shop_url}">Tienda Oficial de FuXion Perú</a></strong> ({price_fmt} · <em>{pack_str}</em>).</p>
""".strip()

        before_card_html = f"""
<h2 id="como-actua">1. ¿Cómo ayuda {clean_name} en {focus_topic}?</h2>
<p>{prod['description']}</p>
<p>A diferencia de las alternativas ultraprocesadas que contienen azúcares añadidos, octógonos o químicos sintéticos, <strong>{clean_name}</strong> está certificado como <strong>Clean Label (Etiqueta Limpia)</strong>: 100% libre de azúcar, endulzado con stevia natural y formulado con extractos botánicos andinos, amazónicos y asiáticos.</p>

<h2 id="beneficios-clave">2. Beneficios principales en tu bienestar diario</h2>
<p>Integrar <strong>{clean_name}</strong> en tu rutina diaria aporta beneficios específicos y medibles:</p>
<ul>
  {benefits_lis}
</ul>

<h2 id="principios-activos">3. Ingredientes bioactivos y absorción celular</h2>
<p>La eficacia de <strong>{clean_name}</strong> proviene de la sinergia entre sus componentes clave: {ingredients_badges}. Gracias a los procesos de extracción y minerales aminoquelados de FuXion, tu organismo asimila cada nutriente de forma rápida y sin pesadez digestiva.</p>
""".strip()

        after_card_html = f"""
<h2 id="modo-de-uso">4. Preparación exacta y mejor horario para tomar {clean_name}</h2>
<p>Para aprovechar al máximo cada sobre de <strong>{clean_name}</strong>, sigue estas recomendaciones prácticas:</p>
<ul>
  <li><strong>Preparación recomendada:</strong> {prod['preparation']}</li>
  <li><strong>Horario ideal:</strong> {prod['idealTime']}</li>
  <li><strong>Formato oficial:</strong> {pack_str} ({f"{prod['sticks']} porciones · {prod['perStickFormatted']} por sobre" if prod['sticks'] else "Presentación oficial sellada"}).</li>
</ul>

<h2 id="sinergia-fuxion">5. Combinaciones recomendadas del Sistema FuXion</h2>
{combos_html}
<p>Recuerda que las bebidas funcionales FuXion son alimentos nutracéuticos compatibles entre sí, por lo que puedes organizar un plan de mañana, tarde y noche adaptado a tus metas.</p>

<h2 id="comprar-en-peru">6. Dónde comprar {clean_name} original en Lima y provincias</h2>
<p>El valor oficial de <strong>{clean_name}</strong> en el catálogo vigente de FuXion Perú es de <strong>{price_fmt}</strong>. Puedes adquirirlo ahora mismo haciendo clic en la tarjeta de compra de esta guía o ingresando directamente a <a href="{shop_url}"><strong>{shop_url}</strong></a>, con pago seguro y despacho directo desde el almacén central de FuXion hacia tu domicilio en Lima o cualquier región del Perú.</p>
""".strip()

    elif variant == 1:
        intro_html = f"""
<p>Lograr resultados sostenibles en <strong>{focus_topic}</strong> requiere combinar buenos hábitos diarios con una nutrición funcional específica. En el mercado peruano, <strong><a href="/productos/{prod['slug']}/">{clean_name}</a></strong> (perteneciente a la <em>{prod['categoryName']}</em> de FuXion) fue diseñado científicamente para cubrir esta necesidad de forma práctica y 100% natural.</p>
<p>En este artículo revisaremos paso a paso su mecanismo de acción, su protocolo de consumo recomendado por semanas y el enlace directo para adquirir tu <strong>{clean_name}</strong> original ({price_fmt}) en la plataforma oficial <code>shop.site.fuxion.com</code>.</p>
""".strip()

        before_card_html = f"""
<h2 id="por-que-elegir">1. ¿Por qué los especialistas recomiendan {clean_name} para {focus_topic}?</h2>
<p>{prod['description']}</p>
<p>Cuando el cuerpo enfrenta desgaste diario, estrés o una alimentación desbalanceada, los micronutrientes comunes no siempre logran absorberse. Por ello, <strong>{clean_name}</strong> reúne principios activos biodisponibles ({ingredients_badges}) libres de octógonos, gluten y conservantes artificiales.</p>

<h2 id="efectos-positivos">2. ¿Qué efectos notarás al consumir {clean_name} con constancia?</h2>
<ul>
  {benefits_lis}
</ul>

<h2 id="protocolo-paso-a-paso">3. Protocolo práctico de preparación y horario</h2>
<p>La clave del éxito con los nutracéuticos FuXion es la constancia en el horario adecuado:</p>
<ul>
  <li><strong>Cómo disolverlo:</strong> {prod['preparation']}</li>
  <li><strong>Momento óptimo del día:</strong> {prod['idealTime']}</li>
  <li><strong>Rendimiento por envase:</strong> {pack_str} ({price_fmt}).</li>
</ul>
""".strip()

        after_card_html = f"""
<h2 id="resultados-por-semana">4. Evolución esperada durante las primeras 4 semanas</h2>
<p>Aunque cada organismo en Perú tiene su propio ritmo metabólico, la experiencia de miles de consumidores de <strong>{clean_name}</strong> muestra una progresión clara:</p>
<ul>
  <li><strong>Semana 1:</strong> Adaptación digestiva y primeras sensaciones de bienestar gracias a la hidratación funcional.</li>
  <li><strong>Semanas 2 y 3:</strong> Consolidación de los beneficios en <strong>{focus_topic}</strong> al mantener el consumo diario sin interrupciones.</li>
  <li><strong>Semana 4 en adelante:</strong> Mantenimiento óptimo y sinergia con un estilo de vida activo.</li>
</ul>

<h2 id="potenciadores">5. ¿Cómo potenciar a {clean_name} con otras líneas FuXion?</h2>
{combos_html}

<h2 id="pedido-directo">6. Compra directa y segura en la Tienda Oficial FuXion Perú</h2>
<p>Adquiere tu <strong>{clean_name}</strong> (SKU #{prod['sku']}) al precio oficial de <strong>{price_fmt}</strong> a través de la tarjeta transaccional superior o en el enlace oficial <a href="{shop_url}"><strong>Comprar {clean_name} en FuXion Perú</strong></a>, con envío garantizado a Lima Metropolitana y todo el país.</p>
""".strip()

    else:
        intro_html = f"""
<p>Si estás investigando sobre <strong>{focus_topic}</strong> en el Perú, es fundamental elegir fórmulas naturales con respaldo científico y registro sanitario vigente. <strong><a href="/productos/{prod['slug']}/">{clean_name}</a></strong> de <strong>FuXion®</strong> combina sabiduría ancestral amazónica y andina con biotecnología moderna para ofrecerte una bebida funcional deliciosa y libre de azúcar.</p>
<p>Descubre en esta guía técnica sus ingredientes activos, cómo integrarlo en tu día a día y cómo realizar tu pedido directo en la tienda oficial por <strong>{price_fmt}</strong> ({pack_str}).</p>
""".strip()

        before_card_html = f"""
<h2 id="ciencia-nutraceutica">1. Ciencia Nutracéutica detrás de {clean_name}</h2>
<p>{prod['description']}</p>
<p>Su formulación concentra: {ingredients_badges}. Al estar endulzado únicamente con glucósidos de esteviol (stevia natural), no altera la glucosa sanguínea ni aporta calorías vacías, siendo ideal para el cuidado integral de tu salud.</p>

<h2 id="ventajas-principales">2. Aportes funcionales para tu objetivo</h2>
<p>Al incluir <strong>{clean_name}</strong> en tu alimentación diaria apoyas directamente:</p>
<ul>
  {benefits_lis}
</ul>
""".strip()

        after_card_html = f"""
<h2 id="guia-de-consumo">3. Guía rápida de consumo: agua, temperatura y horario</h2>
<ul>
  <li><strong>Instrucciones de mezcla:</strong> {prod['preparation']}</li>
  <li><strong>Cuándo tomarlo:</strong> {prod['idealTime']}</li>
  <li><strong>Presentación:</strong> {pack_str} · Código oficial SKU #{prod['sku']}.</li>
</ul>

<h2 id="combinaciones-inteligentes">4. Sinergias recomendadas para mejores resultados</h2>
{combos_html}
<p>Si deseas orientación personalizada adicional, también puedes hacer clic en el botón del <strong>Asesor IA FuXion</strong> en la esquina inferior derecha de esta pantalla.</p>

<h2 id="enlace-oficial-compra">5. Precio en Soles y enlace directo a la Tienda Oficial</h2>
<p>Compra <strong>{clean_name}</strong> original en Perú por <strong>{price_fmt}</strong> ingresando directamente desde la tarjeta de producto de este artículo hacia <a href="{shop_url}"><strong>{shop_url}</strong></a>. Tu pedido es procesado por FuXion Biotech SAC con entrega rápida en tu domicilio.</p>
""".strip()

    comparison_rows = [
        {"label": "Producto Referenciado", "value": clean_name},
        {"label": "Línea Nutracéutica", "value": prod["categoryName"]},
        {"label": "Código SKU Oficial", "value": f"#{prod['sku']}"},
        {"label": "Presentación", "value": pack_str},
        {"label": "Precio Oficial Perú", "value": f"{price_fmt} (Soles - PEN)"},
        {"label": "Costo por Porción", "value": prod["perStickFormatted"] if prod["perStickFormatted"] else price_fmt},
        {"label": "Puntos FuXion (QV)", "value": f"{prod['points']} puntos"},
        {"label": "Enlace Oficial de Compra", "value": shop_url},
    ]

    faqs = [
        {
            "question": f"¿Qué producto FuXion se recomienda para {focus_topic[:65]}?",
            "answer": f"El producto específico recomendado es {clean_name} ({pack_str}, {price_fmt}), formulado con {prod['ingredients'][0] if prod['ingredients'] else 'extractos naturales'} para apoyar tu organismo de manera 100% natural."
        },
        {
            "question": f"¿Cómo se toma {clean_name} para obtener mejores resultados?",
            "answer": f"{prod['preparation']} {prod['idealTime']}"
        },
        {
            "question": f"¿Dónde comprar {clean_name} original en Perú?",
            "answer": f"Puedes comprarlo directamente en la Tienda Oficial de FuXion Perú haciendo clic en la tarjeta de compra de este artículo ({shop_url}), con envío a domicilio en Lima y provincias."
        }
    ]

    return {
        "id": idx + 1,
        "slug": slug,
        "title": title,
        "seoTitle": f"{title} | FuXion Perú",
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
        "faqs": faqs,
    }


def main():
    articles = []
    seen_slugs = set()
    for idx, spec in enumerate(ALL_405_SPECS):
        slug = spec[0]
        if slug in seen_slugs:
            slug = f"{slug}-{idx+1}"
            spec = (slug, spec[1], spec[2], spec[3], spec[4], spec[5])
        seen_slugs.add(slug)
        assert spec[4] in prod_map, f"Missing product slug: {spec[4]}"
        articles.append(build_rich_article(idx, spec, prod_map))

    with open(ARTICLES_OUT, "w", encoding="utf-8") as f:
        json.dump(articles, f, ensure_ascii=False, indent=2)

    # Print cluster counts
    from collections import Counter
    c = Counter(a["clusterName"] for a in articles)
    print(f"Generated {len(articles)} total articles in {ARTICLES_OUT}:")
    for k, v in c.items():
        print(f"  - {k}: {v} artículos")


if __name__ == "__main__":
    main()
