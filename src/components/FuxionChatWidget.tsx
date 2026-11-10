"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";

const CHAT_ENDPOINT =
  "https://ehwjvuhbimqakvzqbvvg.supabase.co/functions/v1/fuxion-chat";

const STORAGE_VISITOR_KEY = "fx_chat_visitor_v1";
const STORAGE_SESSION_KEY = "fx_chat_session_v1";
const STORAGE_MESSAGES_KEY = "fx_chat_messages_v1";

export interface ChatProductCard {
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
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: ChatProductCard[];
  suggestedOptions?: string[];
  createdAt: string;
}

const INITIAL_QUICK_OPTIONS = [
  "🔥 Bajar de peso y quemar grasa",
  "🌿 Limpiar el colon / estreñimiento",
  "⚡ Más energía y vitalidad diaria",
  "✨ Colágeno para piel y articulaciones",
  "😌 Calmar el estrés y dormir mejor",
  "💪 Ganar masa muscular y deporte",
  "🛡️ Subir mis defensas e inmunidad",
];

const DEFAULT_WELCOME =
  "¡Hola! 👋 Soy tu Asesor Nutracéutico IA de FuXion Perú. Cuéntame qué objetivo de salud o bienestar buscas hoy (o elige una opción abajo) y te recomendaré el producto ideal con su enlace directo de compra.";

export default function FuxionChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showTeaser, setShowTeaser] = useState(true);
  const [visitorId, setVisitorId] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(DEFAULT_WELCOME);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize visitor & restore conversation
  useEffect(() => {
    try {
      let vid = localStorage.getItem(STORAGE_VISITOR_KEY);
      if (!vid) {
        vid = "fx-" + Math.random().toString(36).slice(2, 10) + "-" + Date.now().toString(36);
        localStorage.setItem(STORAGE_VISITOR_KEY, vid);
      }
      setVisitorId(vid);

      const savedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedSession) setSessionId(savedSession);

      const savedMessages = localStorage.getItem(STORAGE_MESSAGES_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }

    // Fetch live config
    fetch(CHAT_ENDPOINT, { method: "GET" })
      .then((r) => r.json())
      .then((data) => {
        if (typeof data?.is_enabled === "boolean") {
          setIsEnabled(data.is_enabled);
        }
        if (data?.welcome_message) {
          setWelcomeMessage(data.welcome_message);
        }
      })
      .catch(() => {
        // fallback to default enabled
      });
  }, []);

  // Scroll to bottom when messages change or chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, [messages, isOpen, isLoading]);

  const persistMessages = (nextMessages: ChatMessage[], nextSessionId?: string | null) => {
    setMessages(nextMessages);
    try {
      localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(nextMessages.slice(-24)));
      if (nextSessionId) {
        localStorage.setItem(STORAGE_SESSION_KEY, nextSessionId);
      }
    } catch {
      // ignore
    }
  };

  const trackProductClick = (
    shopUrl: string,
    product?: { slug?: string; name?: string; price?: number }
  ) => {
    try {
      fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "track_click",
          session_id: sessionId,
          visitor_id: visitorId,
          product_slug: product?.slug || null,
          product_name: product?.name || null,
          shop_url: shopUrl,
          price_pen: product?.price || null,
          page_url: typeof window !== "undefined" ? window.location.href : "https://fuxion.site/",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const updatedWithUser = [...messages, userMsg];
    persistMessages(updatedWithUser, sessionId);
    setInput("");
    setIsLoading(true);

    try {
      const historyPayload = updatedWithUser.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          session_id: sessionId,
          visitor_id: visitorId,
          message: trimmed,
          history: historyPayload.slice(0, -1),
          page_url: typeof window !== "undefined" ? window.location.href : "https://fuxion.site/",
          user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "",
        }),
      });

      const data = await res.json();
      const newSessId = data.session_id || sessionId;
      if (newSessId && newSessId !== sessionId) {
        setSessionId(newSessId);
      }

      const assistantMsg: ChatMessage = {
        id: "a-" + Date.now(),
        role: "assistant",
        content:
          data.reply ||
          "Te recomiendo revisar estas opciones en nuestra [Tienda Oficial FuXion Perú](https://shop.site.fuxion.com/tienda/).",
        recommendedProducts: Array.isArray(data.recommended_products)
          ? data.recommended_products
          : [],
        suggestedOptions: Array.isArray(data.suggested_options)
          ? data.suggested_options
          : [],
        createdAt: new Date().toISOString(),
      };

      persistMessages([...updatedWithUser, assistantMsg], newSessId);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: "a-err-" + Date.now(),
        role: "assistant",
        content:
          "En este momento hubo una demora en la conexión. Puedes explorar y comprar directamente en la [Tienda Oficial FuXion Perú](https://shop.site.fuxion.com/tienda/).",
        suggestedOptions: ["Intentar de nuevo"],
        createdAt: new Date().toISOString(),
      };
      persistMessages([...updatedWithUser, fallbackMsg], sessionId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleResetChat = () => {
    setMessages([]);
    setSessionId(null);
    try {
      localStorage.removeItem(STORAGE_MESSAGES_KEY);
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch {
      // ignore
    }
  };

  // Helper to format markdown links [text](url) and bold **text**
  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Parse links and bold inside each line
      const tokenRegex = /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*)/g;
      const parts = line.split(tokenRegex);

      return (
        <p key={lineIdx} className="leading-relaxed mb-1.5 last:mb-0">
          {parts.map((part, i) => {
            const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
            if (linkMatch) {
              const [, label, url] = linkMatch;
              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackProductClick(url, { name: label })}
                  className="inline-flex items-center gap-1 font-bold text-[#007CBC] underline decoration-[#8CC63F] decoration-2 underline-offset-2 hover:text-[#4E7A16] transition-colors"
                >
                  <span>{label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              );
            }

            const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
            if (boldMatch) {
              return (
                <strong key={i} className="font-bold text-[#12232E]">
                  {boldMatch[1]}
                </strong>
              );
            }

            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (!isEnabled) return null;

  const latestAssistantMsg =
    messages.length > 0 && messages[messages.length - 1].role === "assistant"
      ? messages[messages.length - 1]
      : null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[410px] h-[580px] max-h-[82vh] rounded-3xl bg-white border border-[#D7E4EC] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
          role="dialog"
          aria-label="Asesor Nutracéutico IA FuXion Perú"
        >
          {/* Header */}
          <div
            className="px-4 py-3.5 text-white flex items-center justify-between gap-3 shrink-0"
            style={{
              background: "linear-gradient(135deg, #0093DD 0%, #006CA5 100%)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-full bg-white/15 border border-white/30 grid place-items-center shrink-0">
                <span className="text-xl" aria-hidden="true">
                  🧬
                </span>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#8CC63F] border-2 border-[#007CBC]"
                  title="En línea"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3
                    className="font-extrabold text-[15px] leading-tight truncate text-white"
                    style={{ fontFamily: "var(--display)" }}
                  >
                    Asesor IA FuXion Perú
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#EFFBC4] text-[#142600]">
                    En línea
                  </span>
                </div>
                <p className="text-xs text-[#E4F5FE] truncate">
                  Recomendación personalizada y compra directa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-xs text-white transition-colors"
                  title="Reiniciar conversación"
                  aria-label="Reiniciar conversación"
                >
                  ↺
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-sm font-bold text-white transition-colors"
                aria-label="Cerrar chat"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F6FBFE]">
            {/* Welcome Bubble */}
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#0093DD] text-white grid place-items-center text-xs font-bold shrink-0 mt-0.5">
                FX
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-white border border-[#D7E4EC] p-3.5 text-[13.5px] text-[#12232E] shadow-2xs max-w-[88%]">
                <p className="leading-relaxed">{welcomeMessage}</p>
              </div>
            </div>

            {/* Initial Quick Goal Pills (shown when conversation hasn't started) */}
            {messages.length === 0 && !isLoading && (
              <div className="pl-9 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5A6B78]">
                  Selecciona qué buscas mejorar hoy:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {INITIAL_QUICK_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-[#B9D9EB] text-[#007CBC] hover:bg-[#0093DD] hover:text-white hover:border-[#0093DD] transition-all shadow-2xs cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-2.5">
                {msg.role === "user" ? (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-tr-sm bg-[#0093DD] text-white px-3.5 py-2.5 text-[13.5px] max-w-[85%] shadow-2xs">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0093DD] text-white grid place-items-center text-xs font-bold shrink-0 mt-0.5">
                      FX
                    </div>
                    <div className="space-y-2.5 max-w-[88%] min-w-0">
                      <div className="rounded-2xl rounded-tl-sm bg-white border border-[#D7E4EC] p-3.5 text-[13.5px] text-[#2B3D4B] shadow-2xs">
                        {renderFormattedContent(msg.content)}
                      </div>

                      {/* Recommended Product Cards */}
                      {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                        <div className="space-y-2">
                          {msg.recommendedProducts.map((prod) => (
                            <div
                              key={prod.slug}
                              className="rounded-2xl bg-white border border-[#B9D9EB] p-3 shadow-xs hover:border-[#0093DD] transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-14 h-14 rounded-xl object-contain bg-[#EDF7FD] p-1 shrink-0 border border-[#D7E4EC]"
                                  loading="lazy"
                                />
                                <div className="min-w-0 flex-1">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0093DD] block">
                                    {prod.category}
                                  </span>
                                  <h4 className="font-extrabold text-sm text-[#12232E] truncate">
                                    {prod.name}
                                  </h4>
                                  <div className="flex items-baseline gap-2 mt-0.5">
                                    <span className="font-extrabold text-sm text-[#007CBC]">
                                      {prod.formattedPrice}
                                    </span>
                                    <span className="text-[11px] text-[#5A6B78] truncate">
                                      · {prod.pack}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <a
                                href={prod.shopUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  trackProductClick(prod.shopUrl, {
                                    slug: prod.slug,
                                    name: prod.name,
                                    price: prod.price,
                                  })
                                }
                                className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#8CC63F] hover:bg-[#7BB32E] text-[#142600] font-extrabold text-xs py-2 px-3 transition-colors shadow-2xs"
                              >
                                <span>Comprar {prod.name} en Tienda Oficial</span>
                                <span aria-hidden="true">→</span>
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Suggested Follow-up Options */}
            {latestAssistantMsg &&
              latestAssistantMsg.suggestedOptions &&
              latestAssistantMsg.suggestedOptions.length > 0 &&
              !isLoading && (
                <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                  {latestAssistantMsg.suggestedOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => sendMessage(opt)}
                      className="text-left text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-[#0093DD]/40 text-[#007CBC] hover:bg-[#0093DD] hover:text-white transition-colors cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#0093DD] text-white grid place-items-center text-xs font-bold shrink-0">
                  FX
                </div>
                <div className="rounded-2xl bg-white border border-[#D7E4EC] px-4 py-3 text-xs text-[#5A6B78] flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#0093DD] animate-bounce" />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#0093DD] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="inline-block w-2 h-2 rounded-full bg-[#8CC63F] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                  <span className="ml-1 font-medium">
                    Analizando el catálogo FuXion...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-[#D7E4EC] flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe qué necesitas (ej. bajar de peso, energía)..."
              disabled={isLoading}
              className="flex-1 rounded-full border border-[#D7E4EC] bg-[#F6FBFE] px-4 py-2.5 text-[13.5px] text-[#12232E] placeholder:text-[#5A6B78] focus:outline-none focus:border-[#0093DD]"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-[#0093DD] hover:bg-[#007CBC] disabled:opacity-45 text-white grid place-items-center shrink-0 transition-colors cursor-pointer"
              aria-label="Enviar consulta"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Callout Pill + Main Trigger Button */}
      <div className="flex items-center gap-2.5">
        {!isOpen && showTeaser && (
          <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white border border-[#B9D9EB] shadow-lg px-3.5 py-2 text-xs font-semibold text-[#12232E]">
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
                setShowTeaser(false);
              }}
              className="flex items-center gap-2 text-left cursor-pointer"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
              <span>
                ¿No sabes cuál elegir?{" "}
                <strong className="text-[#0093DD]">Pregúntale a la IA →</strong>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setShowTeaser(false)}
              className="text-[#5A6B78] hover:text-[#12232E] ml-1 text-[11px]"
              aria-label="Ocultar aviso"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setShowTeaser(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full px-4 py-3 sm:px-5 sm:py-3.5 text-white font-extrabold text-sm shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #0093DD 0%, #006CA5 100%)",
            boxShadow: "0 12px 28px -6px rgba(0, 147, 221, 0.55)",
          }}
          aria-label={isOpen ? "Cerrar Asesor IA FuXion" : "Abrir Asesor IA FuXion"}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8CC63F] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#8CC63F]" />
          </span>
          <span style={{ fontFamily: "var(--display)" }}>
            {isOpen ? "Cerrar Asesor IA" : "Asesor IA FuXion"}
          </span>
          <span className="text-base" aria-hidden="true">
            💬
          </span>
        </button>
      </div>
    </div>
  );
}
