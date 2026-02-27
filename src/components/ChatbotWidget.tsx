import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "apiculteurs-chat-history";
const QUICK_ACTIONS = [
  { label: "🐝 Conseils débutant", text: "Quels sont tes meilleurs conseils pour un apiculteur débutant ?" },
  { label: "🦟 Varroa", text: "Comment lutter efficacement contre le varroa ?" },
  { label: "🍯 Récolte", text: "Quand et comment récolter le miel ?" },
  { label: "💪 Santé du miel", text: "Quels sont les bienfaits du miel pour la santé ?" },
];

function loadHistory(): Msg[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(loadHistory);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages.slice(-12) }),
        }
      );

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erreur réseau" }));
        throw new Error(err.error || `Erreur ${resp.status}`);
      }

      if (!resp.body) throw new Error("Pas de réponse");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const updateAssistant = (content: string) => {
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content } : m);
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              updateAssistant(assistantContent);
            }
          } catch { /* partial */ }
        }
      }

      if (!assistantContent) {
        updateAssistant("Désolé, je n'ai pas pu générer de réponse. Réessayez ! 🐝");
      }
    } catch (e: any) {
      setError(e.message || "Erreur de connexion");
      if (!assistantContent) {
        setMessages(prev => [...prev, { role: "assistant", content: "Désolé, une erreur est survenue. Réessayez ! 🐝" }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-20 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-xl honey-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
            aria-label="Ouvrir l'assistant"
          >
            <span className="text-lg">💬</span>
            Aide
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[32rem] max-h-[calc(100vh-2rem)] flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
              role="dialog"
              aria-label="Assistant Coin des Apiculteurs"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 honey-gradient text-primary-foreground">
                <h2 className="font-heading font-bold text-sm">Assistant Coin des Apiculteurs 🐝</h2>
                <div className="flex items-center gap-1">
                  <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors" aria-label="Effacer la conversation" title="Effacer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-primary-foreground/20 transition-colors" aria-label="Fermer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center">
                    <p className="text-3xl mb-2">🐝</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Bonjour ! Comment puis-je vous aider aujourd'hui ?
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {QUICK_ACTIONS.map((qa) => (
                        <button
                          key={qa.label}
                          onClick={() => sendMessage(qa.text)}
                          className="px-3 py-1.5 text-xs rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "honey-gradient text-primary-foreground rounded-br-md"
                          : "bg-secondary text-secondary-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm max-w-none [&>p]:mb-1 [&>p:last-child]:mb-0 [&>ul]:mb-1 [&>ol]:mb-1">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

                {error && (
                  <p className="text-xs text-destructive text-center">{error}</p>
                )}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="flex items-center gap-2 px-3 py-3 border-t border-border bg-card"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question…"
                  className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-full honey-gradient text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity hover:opacity-90"
                  aria-label="Envoyer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
