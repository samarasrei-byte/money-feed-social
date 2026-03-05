import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Radio, X, ShoppingBag, MessageCircle, Heart, Share2,
  Send, ChevronDown, ChevronUp, Eye, Users, Clock,
  Flame, Star, Zap, Gift, ArrowLeft, Volume2, VolumeX,
  Timer, Pin, Sparkles, Crown
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Types ---
interface LiveProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  isPinned?: boolean;
  stock: number;
  sold: number;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  type: "message" | "join" | "purchase" | "reaction";
  timestamp: Date;
}

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  timestamp: number;
}

// --- Mock Data ---
const MOCK_PRODUCTS: LiveProduct[] = [
  { id: "1", name: "Sérum Vitamina C Premium", price: 89.90, originalPrice: 149.90, stock: 50, sold: 234, isPinned: true },
  { id: "2", name: "Kit Skincare Coreano 7 Steps", price: 199.90, originalPrice: 349.90, stock: 15, sold: 89 },
  { id: "3", name: "Máscara Facial LED", price: 299.90, stock: 30, sold: 156 },
  { id: "4", name: "Óleo de Rosa Mosqueta Bio", price: 49.90, originalPrice: 79.90, stock: 100, sold: 412 },
  { id: "5", name: "Protetor Solar FPS 99", price: 59.90, stock: 200, sold: 678 },
];

const EMOJIS = ["❤️", "🔥", "😍", "👏", "💰", "🤩"];

const MOCK_CHAT: ChatMessage[] = [
  { id: "1", user: "Maria Silva", content: "Amei esse sérum! 😍", type: "message", timestamp: new Date() },
  { id: "2", user: "João Pedro", content: "Comprou Sérum Vitamina C!", type: "purchase", timestamp: new Date() },
  { id: "3", user: "Ana Clara", content: "entrou na live", type: "join", timestamp: new Date() },
  { id: "4", user: "Lucas", content: "Qual o frete pro RJ?", type: "message", timestamp: new Date() },
  { id: "5", user: "Fernanda", content: "🔥🔥🔥", type: "reaction", timestamp: new Date() },
];

// --- Floating Reaction Component ---
function FloatingReaction({ emoji, x }: { emoji: string; x: number }) {
  return (
    <div
      className="absolute bottom-20 text-2xl animate-bounce pointer-events-none z-30"
      style={{ left: `${x}%`, animation: "floatUp 2s ease-out forwards" }}
    >
      {emoji}
    </div>
  );
}

// --- Product Card (Floating) ---
function LiveProductCard({ product, onBuy }: { product: LiveProduct; onBuy: (p: LiveProduct) => void }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl rounded-2xl p-2 border border-white/10 min-w-[240px]">
      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0">
        <ShoppingBag className="h-5 w-5 text-white/70" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          {product.isPinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
          <p className="text-[11px] font-semibold text-white truncate">{product.name}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-black text-primary">R$ {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-[9px] text-white/40 line-through">R$ {product.originalPrice.toFixed(2)}</span>
          )}
          {discount > 0 && (
            <Badge className="text-[8px] bg-destructive/80 text-white border-0 px-1 py-0">-{discount}%</Badge>
          )}
        </div>
        <p className="text-[9px] text-white/40">{product.sold} vendidos • {product.stock} restantes</p>
      </div>
      <Button
        size="sm"
        className="h-8 px-3 rounded-xl bg-primary text-primary-foreground text-[10px] font-bold shrink-0"
        onClick={() => onBuy(product)}
      >
        Comprar
      </Button>
    </div>
  );
}

// --- Countdown Timer ---
function CountdownTimer({ seconds: initialSeconds }: { seconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (seconds <= 0) return null;

  return (
    <div className="flex items-center gap-1.5 bg-destructive/90 backdrop-blur-sm rounded-full px-3 py-1.5 animate-pulse">
      <Timer className="h-3.5 w-3.5 text-white" />
      <span className="text-xs font-black text-white tracking-wider">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-white/80">OFERTA RELÂMPAGO</span>
    </div>
  );
}

// --- Main LiveShop Page ---
export default function LiveShop() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT);
  const [newMessage, setNewMessage] = useState("");
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [muted, setMuted] = useState(false);
  const [viewers, setViewers] = useState(2847);
  const [followed, setFollowed] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((v) => v + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate incoming chat messages
  useEffect(() => {
    const names = ["Camila", "Rafael", "Bruna", "Gustavo", "Letícia", "Felipe", "Isabela"];
    const msgs = ["Incrível! 🔥", "Quero esse!", "Frete grátis?", "Amoooo 😍", "Comprei!", "Qual tamanho?", "Melhor live!"];
    const interval = setInterval(() => {
      const msg: ChatMessage = {
        id: Date.now().toString(),
        user: names[Math.floor(Math.random() * names.length)],
        content: msgs[Math.floor(Math.random() * msgs.length)],
        type: Math.random() > 0.8 ? "purchase" : "message",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev.slice(-50), msg]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!user) {
      toast({ title: "Faça login para interagir" });
      return;
    }
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      user: "Você",
      content: newMessage,
      type: "message",
      timestamp: new Date(),
    }]);
    setNewMessage("");
  };

  const addReaction = (emoji: string) => {
    const reaction: Reaction = {
      id: Date.now().toString(),
      emoji,
      x: 70 + Math.random() * 25,
      timestamp: Date.now(),
    };
    setReactions((prev) => [...prev, reaction]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== reaction.id));
    }, 2000);
  };

  const handleBuy = (product: LiveProduct) => {
    toast({
      title: "🛒 Adicionado ao carrinho!",
      description: `${product.name} — R$ ${product.price.toFixed(2)}`,
    });
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      user: user?.email?.split("@")[0] || "Você",
      content: `Comprou ${product.name}!`,
      type: "purchase",
      timestamp: new Date(),
    }]);
  };

  const pinnedProduct = MOCK_PRODUCTS.find((p) => p.isPinned);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* CSS for float animation */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-200px) scale(1.5); }
        }
      `}</style>

      {/* Video Area (Mock) */}
      <div className="relative flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
        {/* Simulated video gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(330,81%,60%,0.1)_0%,_transparent_70%)]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mx-auto mb-3">
              <Radio className="h-8 w-8 text-white/50 animate-pulse" />
            </div>
            <p className="text-white/30 text-xs">Transmissão ao vivo</p>
          </div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 z-20 safe-area-inset-top">
          <div className="flex items-center justify-between p-3">
            {/* Host info */}
            <div className="flex items-center gap-2">
              <button onClick={() => navigate(-1)} className="p-1">
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl rounded-full pl-1 pr-3 py-1">
                <Avatar className="h-8 w-8 ring-2 ring-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">BL</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-white">Beauty Lab</span>
                    <Crown className="h-3 w-3 text-yellow-400" />
                  </div>
                  <p className="text-[9px] text-white/50">152K seguidores</p>
                </div>
              </div>
              {!followed ? (
                <Button
                  size="sm"
                  className="h-7 px-3 rounded-full bg-primary text-primary-foreground text-[10px]"
                  onClick={() => setFollowed(true)}
                >
                  Seguir
                </Button>
              ) : (
                <Badge className="bg-white/10 text-white/60 border-0 text-[10px]">Seguindo</Badge>
              )}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xl rounded-full px-2.5 py-1">
                <Eye className="h-3 w-3 text-white/60" />
                <span className="text-[10px] font-bold text-white">{viewers.toLocaleString()}</span>
              </div>
              <Badge className="bg-red-500 text-white border-0 gap-1 text-[9px]">
                <Radio className="h-2.5 w-2.5 animate-pulse" /> LIVE
              </Badge>
              <button onClick={() => setMuted(!muted)} className="p-1.5 bg-black/50 rounded-full">
                {muted ? <VolumeX className="h-4 w-4 text-white/60" /> : <Volume2 className="h-4 w-4 text-white/60" />}
              </button>
              <button onClick={() => navigate(-1)} className="p-1.5 bg-black/50 rounded-full">
                <X className="h-4 w-4 text-white/60" />
              </button>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex justify-center">
            <CountdownTimer seconds={547} />
          </div>
        </div>

        {/* Floating Reactions */}
        {reactions.map((r) => (
          <FloatingReaction key={r.id} emoji={r.emoji} x={r.x} />
        ))}

        {/* Chat Overlay */}
        {showChat && (
          <div className="absolute bottom-0 left-0 right-0 z-10 pb-2">
            <div className="px-3 max-h-[200px]" ref={chatRef}>
              <ScrollArea className="h-[180px]">
                <div className="space-y-1.5 pb-2">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-1.5">
                      <Avatar className="h-5 w-5 shrink-0">
                        <AvatarFallback className="text-[7px] bg-white/10 text-white">{msg.user[0]}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "rounded-xl px-2 py-1 max-w-[80%]",
                        msg.type === "purchase" ? "bg-primary/30" :
                        msg.type === "join" ? "bg-white/5" : "bg-black/40 backdrop-blur-sm"
                      )}>
                        <span className="text-[10px] font-bold text-white/80">{msg.user} </span>
                        {msg.type === "purchase" && <ShoppingBag className="h-2.5 w-2.5 text-primary inline" />}
                        <span className={cn(
                          "text-[10px]",
                          msg.type === "purchase" ? "text-primary font-semibold" :
                          msg.type === "join" ? "text-white/40 italic" : "text-white/70"
                        )}>
                          {msg.content}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Side Action Buttons */}
        <div className="absolute right-3 bottom-[220px] z-20 flex flex-col items-center gap-3">
          {EMOJIS.slice(0, 3).map((emoji) => (
            <button key={emoji} onClick={() => addReaction(emoji)} className="text-xl active:scale-125 transition-transform">
              {emoji}
            </button>
          ))}
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="h-10 w-10 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center"
          >
            <ShoppingBag className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className={cn("h-10 w-10 rounded-full backdrop-blur-sm flex items-center justify-center", showChat ? "bg-white/20" : "bg-white/10")}
          >
            <MessageCircle className="h-5 w-5 text-white" />
          </button>
          <button
            onClick={() => {
              navigator.share?.({ title: "Live Shopping", url: window.location.href })
                .catch(() => toast({ title: "Link copiado!", description: window.location.href }));
            }}
            className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
          >
            <Share2 className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Pinned Product Bar */}
      {pinnedProduct && !showProducts && (
        <div className="bg-black/90 border-t border-white/5 px-3 py-2">
          <LiveProductCard product={pinnedProduct} onBuy={handleBuy} />
        </div>
      )}

      {/* Products Drawer */}
      {showProducts && (
        <div className="bg-black/95 border-t border-white/10 max-h-[50vh] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-white">Produtos da Live</span>
              <Badge className="bg-white/10 text-white/60 border-0 text-[9px]">{MOCK_PRODUCTS.length}</Badge>
            </div>
            <button onClick={() => setShowProducts(false)}>
              <ChevronDown className="h-5 w-5 text-white/40" />
            </button>
          </div>
          <ScrollArea className="max-h-[40vh]">
            <div className="p-3 space-y-2">
              {MOCK_PRODUCTS.map((product) => (
                <LiveProductCard key={product.id} product={product} onBuy={handleBuy} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Input */}
      <div className="bg-black/90 border-t border-white/5 px-3 py-2 safe-area-inset-bottom">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {EMOJIS.slice(3).map((emoji) => (
              <button key={emoji} onClick={() => addReaction(emoji)} className="text-lg active:scale-110 transition-transform">
                {emoji}
              </button>
            ))}
          </div>
          <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Diga algo..."
              className="border-0 bg-transparent text-white text-xs placeholder:text-white/30 p-0 h-auto focus-visible:ring-0"
            />
            <button onClick={sendMessage}>
              <Send className="h-4 w-4 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
