import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { CATALOG_MAP, CATALOG_PROMPT, type ProductInfo } from "./catalog.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function calculateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  if (model.includes("mini")) {
    return Number(((promptTokens * 0.00000015) + (completionTokens * 0.0000006)).toFixed(6));
  }
  // gpt-4o pricing: $2.50 / 1M input, $10.00 / 1M output
  return Number(((promptTokens * 0.0000025) + (completionTokens * 0.00001)).toFixed(6));
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const mode = body.mode || "chat";

    // 1. Load live config
    const { data: configRow } = await supabase
      .from("fuxion_chat_config")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const config = configRow || {
      is_enabled: true,
      ai_model: "gpt-4o",
      temperature: 0.5,
      max_messages_per_session: 25,
      daily_budget_usd: 10.0,
      welcome_message:
        "¡Hola! 👋 Soy tu Asesor Nutracéutico IA de FuXion Perú. Cuéntame qué objetivo de salud o bienestar buscas hoy (o elige una opción abajo) y te recomendaré el producto ideal con su enlace directo de compra.",
      custom_instructions: "",
    };

    if (mode === "config" || req.method === "GET") {
      return new Response(
        JSON.stringify({
          is_enabled: config.is_enabled,
          welcome_message: config.welcome_message,
          ai_model: config.ai_model,
          max_messages_per_session: config.max_messages_per_session,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Track click on carlos-lingan.site.fuxion.com link
    if (mode === "track_click") {
      const { session_id, visitor_id, product_slug, product_name, shop_url, price_pen, page_url } = body;
      if (shop_url) {
        await supabase.from("fuxion_chat_clicks").insert({
          session_id: session_id || null,
          visitor_id: visitor_id || "anon",
          product_slug: product_slug || null,
          product_name: product_name || null,
          shop_url,
          price_pen: price_pen || null,
          page_url: page_url || null,
        });

        if (session_id) {
          const { data: sess } = await supabase
            .from("fuxion_chat_sessions")
            .select("clicks_count, clicked_urls")
            .eq("id", session_id)
            .maybeSingle();
          if (sess) {
            const urls = Array.isArray(sess.clicked_urls) ? sess.clicked_urls : [];
            if (!urls.includes(shop_url)) urls.push(shop_url);
            await supabase
              .from("fuxion_chat_sessions")
              .update({
                clicks_count: (sess.clicks_count || 0) + 1,
                clicked_urls: urls,
              })
              .eq("id", session_id);
          }
        }
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Chat Completion Mode
    if (!config.is_enabled) {
      return new Response(
        JSON.stringify({
          reply:
            "En este momento el asistente automático se encuentra en mantenimiento breve. Puedes ver y comprar todos los productos directamente en la [Tienda Oficial FuXion Perú](https://carlos-lingan.site.fuxion.com/tienda/).",
          recommended_products: [],
          suggested_options: ["Ir a la Tienda Oficial"],
          disabled: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userMessage = (body.message || "").trim();
    const visitorId = body.visitor_id || "visitor-" + crypto.randomUUID().slice(0, 8);
    const pageUrl = body.page_url || "https://fuxion.site/";
    const userAgent = body.user_agent || req.headers.get("user-agent") || "";
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
    let sessionId: string | null = body.session_id || null;

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "Mensaje vacío" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check daily budget
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const { data: todaySessions } = await supabase
      .from("fuxion_chat_sessions")
      .select("estimated_cost_usd")
      .gte("last_message_at", startOfDay.toISOString());

    const spentToday = (todaySessions || []).reduce(
      (acc: number, r: any) => acc + Number(r.estimated_cost_usd || 0),
      0
    );

    if (spentToday >= Number(config.daily_budget_usd || 10)) {
      return new Response(
        JSON.stringify({
          reply:
            "Has alcanzado el límite de consultas automáticas del día. Explora todos nuestros productos con envío a todo el Perú en la [Tienda Oficial FuXion](https://carlos-lingan.site.fuxion.com/tienda/).",
          recommended_products: [CATALOG_MAP["prunex1"], CATALOG_MAP["thermo-t3"], CATALOG_MAP["vita-xtra-t"]].filter(Boolean),
          suggested_options: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Load or create session
    let existingSession: any = null;
    if (sessionId) {
      const { data: s } = await supabase
        .from("fuxion_chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .maybeSingle();
      existingSession = s;
    }

    if (existingSession && existingSession.messages_count >= (config.max_messages_per_session || 25) * 2) {
      return new Response(
        JSON.stringify({
          session_id: existingSession.id,
          reply:
            "Hemos llegado al máximo de mensajes por sesión. ¡Ya tienes las mejores recomendaciones listas! Haz clic en cualquiera de los productos recomendados o ingresa directo a [carlos-lingan.site.fuxion.com/tienda](https://carlos-lingan.site.fuxion.com/tienda/) para finalizar tu pedido.",
          recommended_products: [CATALOG_MAP["prunex1"], CATALOG_MAP["thermo-t3"], CATALOG_MAP["beauty-in"]].filter(Boolean),
          suggested_options: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!existingSession) {
      const { data: created, error: createErr } = await supabase
        .from("fuxion_chat_sessions")
        .insert({
          visitor_id: visitorId,
          page_url: pageUrl,
          user_agent: userAgent,
          first_user_message: userMessage.slice(0, 250),
          last_user_message: userMessage.slice(0, 250),
          messages_count: 1,
          model_used: config.ai_model || "gpt-4o",
        })
        .select("*")
        .single();

      if (!createErr && created) {
        existingSession = created;
        sessionId = created.id;
      }
    }

    if (sessionId) {
      await supabase.from("fuxion_chat_messages").insert({
        session_id: sessionId,
        role: "user",
        content: userMessage,
      });
    }

    const activeModel = config.ai_model || "gpt-4o";
    const systemPrompt = `Eres el Asesor Nutracéutico IA Oficial de FuXion Perú en la web https://fuxion.site/.
Tu objetivo principal es asesorar con empatía, calidez y precisión científica al visitante en Perú para que descubra qué bebidas funcionales FuXion necesita y REALICE SU COMPRA haciendo clic en los enlaces oficiales de https://carlos-lingan.site.fuxion.com/.

REGLAS OBLIGATORIAS E INQUEBRANTABLES:
1. TODOS los enlaces que escribas en tu respuesta ("reply") DEBEN apuntar EXCLUSIVAMENTE a https://carlos-lingan.site.fuxion.com/... usando las URLs exactas del catálogo oficial listado abajo. Si mencionas el catálogo general usa https://carlos-lingan.site.fuxion.com/tienda/. NUNCA inventes enlaces ni uses otro dominio.
2. Si el usuario hace una consulta general o recién saluda, pregúntale amablemente qué objetivo prioriza hoy (ej. limpiar el colon/estreñimiento, quemar grasa abdominal, subir energía, colágeno para piel/articulaciones, calmar estrés/dormir mejor, ganar masa muscular o defensas) y sugiérele desde ya 1 o 2 productos estrella.
3. Cuando el usuario indique su necesidad o síntoma, recomiéndale de 1 a 3 productos ideales combinando el Sistema Base (ej. Prunex1 para limpiar primero + el producto específico para su meta).
4. Menciona siempre el precio en Soles (S/), cómo se prepara y en qué horario se toma, e incluye en el texto el enlace directo de compra en formato Markdown: [Comprar Nombre en Tienda Oficial](https://carlos-lingan.site.fuxion.com/...).
5. Recuerda que son alimentos nutracéuticos 100% naturales (Clean Label, endulzados con stevia, sin azúcar), no medicamentos.
6. Contexto actual del visitante: está navegando en la página ${pageUrl}.
${config.custom_instructions ? "7. INSTRUCCIÓN ADICIONAL DEL ADMINISTRADOR: " + config.custom_instructions : ""}

CATÁLOGO OFICIAL FUXION PERÚ (60 PRODUCTOS EN SOLES CON SUS URLS DE COMPRA EN CARLOS-LINGAN.SITE.FUXION.COM):
${CATALOG_PROMPT}

FORMATO DE RESPUESTA (JSON ESTRICTO):
Responde ÚNICAMENTE con un objeto JSON válido con estas 3 llaves exactas:
{
  "reply": "Tu respuesta en español (máximo 3 párrafos cortos, cálida, persuasiva, usando viñetas claras y enlaces Markdown [Comprar Producto](https://carlos-lingan.site.fuxion.com/...))",
  "recommended_slugs": ["slug-exacto-1", "slug-exacto-2"],
  "suggested_options": [
    "Pregunta corta u opción 1 para que el usuario haga clic",
    "Pregunta corta u opción 2 para que el usuario haga clic",
    "Pregunta corta u opción 3 para que el usuario haga clic"
  ]
}`;

    const chatMessages: any[] = [{ role: "system", content: systemPrompt }];
    for (const h of history) {
      if (h && (h.role === "user" || h.role === "assistant") && typeof h.content === "string") {
        chatMessages.push({ role: h.role, content: h.content.slice(0, 1200) });
      }
    }
    chatMessages.push({ role: "user", content: userMessage });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: activeModel,
        messages: chatMessages,
        temperature: Number(config.temperature) || 0.5,
        max_tokens: 900,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      throw new Error("OpenAI status " + openaiRes.status);
    }

    const openaiData = await openaiRes.json();
    const rawContent = openaiData.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      parsed = {
        reply: rawContent,
        recommended_slugs: ["prunex1", "thermo-t3"],
        suggested_options: ["Ver catálogo completo", "¿Cómo comprar en Perú?"],
      };
    }

    const slugs: string[] = Array.isArray(parsed.recommended_slugs)
      ? parsed.recommended_slugs.slice(0, 3)
      : [];
    const recommendedProducts: ProductInfo[] = slugs
      .map((s) => CATALOG_MAP[s])
      .filter(Boolean);

    const suggestedOptions: string[] = Array.isArray(parsed.suggested_options)
      ? parsed.suggested_options.slice(0, 3)
      : [];

    const replyText: string =
      parsed.reply ||
      "Te recomiendo explorar estas opciones ideales en nuestra [Tienda Oficial FuXion Perú](https://carlos-lingan.site.fuxion.com/tienda/).";

    const promptTokens = openaiData.usage?.prompt_tokens || 0;
    const completionTokens = openaiData.usage?.completion_tokens || 0;
    const totalTokens = openaiData.usage?.total_tokens || promptTokens + completionTokens;
    const costUsd = calculateCostUsd(activeModel, promptTokens, completionTokens);

    // Save assistant message & update session metrics
    if (sessionId && existingSession) {
      await supabase.from("fuxion_chat_messages").insert({
        session_id: sessionId,
        role: "assistant",
        content: replyText,
        recommended_products: recommendedProducts,
        suggested_options: suggestedOptions,
        model: activeModel,
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
        cost_usd: costUsd,
      });

      const prevRecs: string[] = Array.isArray(existingSession.recommended_products)
        ? existingSession.recommended_products
        : [];
      for (const rp of recommendedProducts) {
        if (!prevRecs.includes(rp.name)) prevRecs.push(rp.name);
      }

      await supabase
        .from("fuxion_chat_sessions")
        .update({
          last_user_message: userMessage.slice(0, 250),
          messages_count: (existingSession.messages_count || 1) + 2,
          recommended_products: prevRecs,
          prompt_tokens: (existingSession.prompt_tokens || 0) + promptTokens,
          completion_tokens: (existingSession.completion_tokens || 0) + completionTokens,
          total_tokens: (existingSession.total_tokens || 0) + totalTokens,
          estimated_cost_usd: Number(
            (Number(existingSession.estimated_cost_usd || 0) + costUsd).toFixed(6)
          ),
          model_used: activeModel,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", sessionId);
    }

    // Also record in global token_usage table
    await supabase.from("token_usage").insert({
      source: "fuxion.site",
      content_type: "ai_chat",
      model: activeModel,
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: totalTokens,
      images_generated: 0,
      estimated_cost_usd: costUsd,
      slug: sessionId || visitorId,
    });

    return new Response(
      JSON.stringify({
        session_id: sessionId,
        reply: replyText,
        recommended_products: recommendedProducts,
        suggested_options: suggestedOptions,
        model: activeModel,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("fuxion-chat error:", err);
    return new Response(
      JSON.stringify({
        error: err.message || "Error interno",
        reply:
          "Tuvimos un inconveniente momentáneo al procesar tu consulta. Puedes ver todos los productos en la [Tienda Oficial FuXion Perú](https://carlos-lingan.site.fuxion.com/tienda/).",
        recommended_products: [],
        suggested_options: ["Intentar de nuevo"],
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
