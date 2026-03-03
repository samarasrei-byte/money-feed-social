import { useState, useRef, useEffect, memo } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/hooks/useAuth";
import {
  Brain, Send, Sparkles, PenLine, TrendingDown, Clock,
  Loader2, Bot, User, Zap, RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "general" | "copy" | "performance" | "schedule";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-copilot`;

const QUICK_ACTIONS: { label: string; icon: React.ElementType; mode: Mode; prompt: string }[] = [
  {
    label: "Gerar Copy",
    icon: PenLine,
    mode: "copy",
    prompt: "Crie 3 variações de copy de alta conversão para um post de venda de um produto digital no Instagram. Use gatilhos mentais de urgência e prova social.",
  },
  {
    label: "Analisar Performance",
    icon: TrendingDown,
    mode: "performance",
    prompt: "Meu CTR caiu de 3.2% para 1.8% nos últimos 7 dias. As impressões subiram 40% mas conversões caíram. O que pode estar acontecendo e o que devo fazer?",
  },
  {
    label: "Melhor Horário",
    icon: Clock,
    mode: "schedule",
    prompt: "Qual o melhor horário para postar conteúdo de vendas no Instagram e TikTok considerando o público brasileiro? Me dê uma estratégia semanal.",
  },
  {
    label: "Otimizar Criativo",
    icon: Sparkles,
    mode: "general",
    prompt: "Analise esta copy e sugira melhorias: 'Compre agora nosso produto incrível com 50% de desconto! Não perca essa oportunidade única!'",
  },
];

async function streamChat({
  messages,
  mode,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  mode: Mode;
  onDelta: (t: string) => void;
  onDone: () => void;
  onError: (e: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, mode }),
  });

  if (!resp.ok) {
    const body = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
    onError(body.error || `Erro ${resp.status}`);
    return;
  }

  if (!resp.body) { onError("Sem resposta do servidor"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        const c = parsed.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}

export default function AICopilot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<Mode>("general");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string, mode: Mode = activeMode) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setIsLoading(true);
    setActiveMode(mode);

    let soFar = "";
    const upsert = (chunk: string) => {
      soFar += chunk;
      setMessages((p) => {
        const last = p[p.length - 1];
        if (last?.role === "assistant") {
          return p.map((m, i) => (i === p.length - 1 ? { ...m, content: soFar } : m));
        }
        return [...p, { role: "assistant", content: soFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        mode,
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (e) => {
          toast.error(e);
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Erro ao conectar com a IA");
      setIsLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setInput("");
    setActiveMode("general");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="pt-4 pb-3 px-4 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-black flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            IA Copilot
          </h1>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={reset} className="text-xs gap-1">
              <RotateCcw className="h-3 w-3" /> Nova conversa
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Seu copiloto de performance com IA — copies, análises e recomendações em tempo real
        </p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-3 pb-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold mb-1">O que posso fazer por você?</h2>
              <p className="text-xs text-muted-foreground max-w-xs">
                Analiso criativos, detecto quedas de performance, gero copies e recomendo horários
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {QUICK_ACTIONS.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => send(a.prompt, a.mode)}
                    className="flex flex-col items-start gap-1.5 p-3 rounded-xl bg-muted/20 ring-1 ring-border/10 hover:ring-primary/30 transition-all text-left"
                  >
                    <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-semibold">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-2",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {m.role === "assistant" && (
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted/30 ring-1 ring-border/10 rounded-bl-sm"
                )}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none [&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-xs [&_li]:text-sm [&_table]:text-xs [&_th]:px-2 [&_td]:px-2 [&_th]:py-1 [&_td]:py-1">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{m.content}</p>
                )}
              </div>
              {m.role === "user" && (
                <div className="h-7 w-7 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0 mt-1">
                  <User className="h-3.5 w-3.5 text-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <div className="bg-muted/30 ring-1 ring-border/10 rounded-2xl rounded-bl-sm px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Mode pills */}
      {messages.length > 0 && (
        <div className="flex gap-1.5 px-4 py-1.5 shrink-0 overflow-x-auto">
          {(["general", "copy", "performance", "schedule"] as Mode[]).map((m) => (
            <Badge
              key={m}
              variant={activeMode === m ? "default" : "outline"}
              className={cn(
                "cursor-pointer text-[9px] px-2 py-0.5 whitespace-nowrap",
                activeMode === m ? "" : "bg-muted/20"
              )}
              onClick={() => setActiveMode(m)}
            >
              {m === "general" ? "Geral" : m === "copy" ? "Copy" : m === "performance" ? "Performance" : "Horários"}
            </Badge>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte algo à IA..."
            className="min-h-[44px] max-h-[120px] resize-none rounded-xl bg-muted/20 ring-1 ring-border/10 border-0 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
          />
          <Button
            size="icon"
            onClick={() => send(input)}
            disabled={!input.trim() || isLoading}
            className="h-[44px] w-[44px] rounded-xl shrink-0"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
