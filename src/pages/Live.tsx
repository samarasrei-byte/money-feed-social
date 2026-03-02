import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Radio, Users, ShoppingBag, Eye, Clock, Play, Crown, Sparkles, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface LiveStream {
  id: string;
  hostName: string;
  hostAvatar?: string;
  title: string;
  viewers: number;
  isLive: boolean;
  productCount: number;
  thumbnail?: string;
  scheduledAt?: string;
  category: string;
}

const MOCK_LIVES: LiveStream[] = [
  { id: "1", hostName: "Maria Store", hostAvatar: "", title: "🔥 Mega Promoção de Inverno - Até 70% OFF", viewers: 1243, isLive: true, productCount: 12, category: "Moda" },
  { id: "2", hostName: "Tech House", hostAvatar: "", title: "Unboxing iPhone 16 Pro + Acessórios", viewers: 856, isLive: true, productCount: 8, category: "Tech" },
  { id: "3", hostName: "Beauty Lab", hostAvatar: "", title: "Rotina de skincare coreana completa", viewers: 2100, isLive: true, productCount: 15, category: "Beleza" },
  { id: "4", hostName: "Fit Store", hostAvatar: "", title: "Suplementos que realmente funcionam", viewers: 0, isLive: false, productCount: 6, scheduledAt: "Hoje às 20h", category: "Saúde" },
  { id: "5", hostName: "Casa & Decor", hostAvatar: "", title: "Tour pela coleção de primavera 2026", viewers: 0, isLive: false, productCount: 20, scheduledAt: "Amanhã 15h", category: "Casa" },
];

function LiveCard({ stream }: { stream: LiveStream }) {
  const { toast } = useToast();

  return (
    <Card
      className={cn(
        "overflow-hidden border-0 cursor-pointer transition-all hover:scale-[1.02]",
        stream.isLive
          ? "bg-gradient-to-br from-red-500/10 via-background to-background ring-1 ring-red-500/20"
          : "bg-muted/30 ring-1 ring-border/20"
      )}
      onClick={() => toast({ title: stream.isLive ? "Entrando na live..." : "Lembrete ativado!", description: stream.isLive ? stream.title : `Você será notificado quando ${stream.hostName} iniciar.` })}
    >
      <CardContent className="p-0">
        {/* Thumbnail area */}
        <div className="relative aspect-video bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
          {stream.isLive ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Play className="h-10 w-10 text-white/80 z-10" />
              <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 gap-1 text-[9px] z-10">
                <Radio className="h-2.5 w-2.5 animate-pulse" />
                AO VIVO
              </Badge>
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5 z-10">
                <Eye className="h-3 w-3 text-white/70" />
                <span className="text-[10px] text-white font-semibold">{stream.viewers.toLocaleString()}</span>
              </div>
            </>
          ) : (
            <>
              <Clock className="h-8 w-8 text-muted-foreground/30" />
              <Badge className="absolute top-2 left-2 bg-muted text-muted-foreground border-0 text-[9px]">
                {stream.scheduledAt}
              </Badge>
            </>
          )}

          {/* Product count */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5 z-10">
            <ShoppingBag className="h-3 w-3 text-primary" />
            <span className="text-[10px] text-white font-semibold">{stream.productCount} produtos</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Avatar className="h-6 w-6">
              <AvatarImage src={stream.hostAvatar} />
              <AvatarFallback className="text-[8px] bg-primary/10 text-primary">{stream.hostName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold truncate">{stream.hostName}</span>
            <Badge variant="outline" className="text-[8px] ml-auto border-border/30 px-1.5">{stream.category}</Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">{stream.title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Live() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "live" | "scheduled">("all");

  const filtered = MOCK_LIVES.filter((s) => {
    if (filter === "live") return s.isLive;
    if (filter === "scheduled") return !s.isLive;
    return true;
  });

  const liveCount = MOCK_LIVES.filter((s) => s.isLive).length;
  const totalViewers = MOCK_LIVES.reduce((sum, s) => sum + s.viewers, 0);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-background to-primary/10" />
        <div className="relative px-4 pt-4 pb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-black flex items-center gap-2">
                <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                Live Shopping
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">Compre ao vivo com os melhores criadores</p>
            </div>
            <Button
              size="sm"
              className="h-8 text-[11px] bg-red-500 hover:bg-red-600 text-white rounded-full gap-1"
              onClick={() => toast({ title: "Em breve!", description: "A funcionalidade de iniciar lives estará disponível em breve." })}
            >
              <Radio className="h-3 w-3" />
              Iniciar Live
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5 bg-red-500/10 rounded-full px-3 py-1">
              <Flame className="h-3 w-3 text-red-500" />
              <span className="text-[10px] font-bold text-red-400">{liveCount} ao vivo</span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/30 rounded-full px-3 py-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-semibold text-muted-foreground">{totalViewers.toLocaleString()} assistindo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 mb-4">
        {(["all", "live", "scheduled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all",
              filter === f
                ? "bg-foreground text-background"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            )}
          >
            {f === "all" ? "Todas" : f === "live" ? "🔴 Ao Vivo" : "⏰ Agendadas"}
          </button>
        ))}
      </div>

      {/* Featured live */}
      {filter !== "scheduled" && MOCK_LIVES.find((s) => s.isLive) && (
        <div className="px-4 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Crown className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs font-bold">Destaque</span>
          </div>
          <Card
            className="overflow-hidden border-0 bg-gradient-to-br from-red-500/10 to-primary/5 ring-1 ring-red-500/20 cursor-pointer"
            onClick={() => toast({ title: "Entrando na live em destaque..." })}
          >
            <CardContent className="p-0">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-red-500/20 via-muted/30 to-primary/10 flex items-center justify-center">
                <Play className="h-14 w-14 text-white/60" />
                <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 gap-1">
                  <Radio className="h-3 w-3 animate-pulse" />
                  AO VIVO
                </Badge>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 rounded-full px-2.5 py-1">
                  <Eye className="h-3.5 w-3.5 text-white/70" />
                  <span className="text-xs text-white font-bold">2.1K</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-8 w-8 ring-2 ring-red-500">
                      <AvatarFallback className="text-xs bg-red-500 text-white">BL</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm font-bold text-white">Beauty Lab</span>
                      <p className="text-[10px] text-white/60">15 produtos • Beleza</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/80">Rotina de skincare coreana completa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grid */}
      <div className="px-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-bold">{filter === "live" ? "Ao Vivo Agora" : filter === "scheduled" ? "Próximas Lives" : "Todas as Lives"}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((stream) => (
            <LiveCard key={stream.id} stream={stream} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Radio className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhuma live {filter === "live" ? "ao vivo" : "agendada"} no momento</p>
          </div>
        )}
      </div>
    </div>
  );
}
