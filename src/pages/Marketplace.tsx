import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Search, Star, Users, TrendingUp, Crown, Sparkles, Filter,
  Instagram, Play, Radio, MessageCircle, Heart, Zap,
  Eye, ShoppingBag, ArrowRight, Bot, Verified
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

// --- Types ---
interface Influencer {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  bio: string;
  followers: number;
  engagement: number;
  avgViews: number;
  categories: string[];
  platforms: string[];
  priceRange: string;
  rating: number;
  isVerified: boolean;
  isVirtual: boolean;
  livesCount: number;
  salesCount: number;
  conversionRate: number;
}

// --- Mock Data ---
const MOCK_INFLUENCERS: Influencer[] = [
  {
    id: "1", name: "Camila Beauty", username: "@camilabeauty", bio: "Especialista em skincare e maquiagem. +5 anos criando conteúdo.",
    followers: 458000, engagement: 4.8, avgViews: 125000, categories: ["Beleza", "Skincare"],
    platforms: ["instagram", "tiktok"], priceRange: "R$ 2K-5K", rating: 4.9, isVerified: true,
    isVirtual: false, livesCount: 87, salesCount: 12400, conversionRate: 8.2,
  },
  {
    id: "2", name: "Tech Rafael", username: "@techrafael", bio: "Reviews honestos de tecnologia e gadgets.",
    followers: 312000, engagement: 5.1, avgViews: 89000, categories: ["Tech", "Gadgets"],
    platforms: ["tiktok", "youtube"], priceRange: "R$ 1.5K-4K", rating: 4.7, isVerified: true,
    isVirtual: false, livesCount: 54, salesCount: 8900, conversionRate: 6.5,
  },
  {
    id: "3", name: "Luna AI", username: "@luna.virtual", bio: "Influenciadora virtual criada com IA. Especialista em moda.",
    followers: 189000, engagement: 7.2, avgViews: 210000, categories: ["Moda", "Lifestyle"],
    platforms: ["instagram", "tiktok"], priceRange: "R$ 500-2K", rating: 4.5, isVerified: false,
    isVirtual: true, livesCount: 120, salesCount: 15600, conversionRate: 11.3,
  },
  {
    id: "4", name: "Fitness Maria", username: "@fitnessmaria", bio: "Personal trainer e nutricionista. Transformando vidas.",
    followers: 890000, engagement: 3.9, avgViews: 200000, categories: ["Saúde", "Fitness"],
    platforms: ["instagram", "youtube"], priceRange: "R$ 5K-15K", rating: 4.8, isVerified: true,
    isVirtual: false, livesCount: 42, salesCount: 23000, conversionRate: 5.8,
  },
  {
    id: "5", name: "Chef João", username: "@chefjao", bio: "Receitas fáceis e deliciosas. Foco em utensílios de cozinha.",
    followers: 245000, engagement: 6.3, avgViews: 95000, categories: ["Gastronomia", "Casa"],
    platforms: ["tiktok", "instagram"], priceRange: "R$ 1K-3K", rating: 4.6, isVerified: true,
    isVirtual: false, livesCount: 65, salesCount: 7800, conversionRate: 7.1,
  },
  {
    id: "6", name: "Nova Digital", username: "@novadigital", bio: "Avatar IA especializado em eletrônicos e smart home.",
    followers: 95000, engagement: 8.5, avgViews: 180000, categories: ["Tech", "Smart Home"],
    platforms: ["tiktok"], priceRange: "R$ 300-1K", rating: 4.3, isVerified: false,
    isVirtual: true, livesCount: 200, salesCount: 9200, conversionRate: 14.7,
  },
];

const CATEGORIES = ["Todos", "Beleza", "Tech", "Moda", "Saúde", "Gastronomia", "Casa", "Fitness"];

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// --- Influencer Card ---
function InfluencerCard({ influencer, onInvite }: { influencer: Influencer; onInvite: () => void }) {
  return (
    <Card className="overflow-hidden border-0 bg-card/50 ring-1 ring-border/20 hover:ring-primary/30 transition-all">
      <CardContent className="p-0">
        {/* Header gradient */}
        <div className={cn(
          "h-16 relative",
          influencer.isVirtual
            ? "bg-gradient-to-r from-violet-500/20 via-primary/10 to-cyan-500/20"
            : "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5"
        )}>
          {influencer.isVirtual && (
            <Badge className="absolute top-2 right-2 bg-violet-500/80 text-white border-0 text-[8px] gap-0.5">
              <Bot className="h-2.5 w-2.5" /> IA Virtual
            </Badge>
          )}
          {influencer.isVerified && !influencer.isVirtual && (
            <Badge className="absolute top-2 right-2 bg-primary/80 text-white border-0 text-[8px] gap-0.5">
              <Verified className="h-2.5 w-2.5" /> Verificado
            </Badge>
          )}
        </div>

        {/* Avatar */}
        <div className="px-3 -mt-8 relative z-10">
          <Avatar className={cn(
            "h-14 w-14 ring-3 ring-background",
            influencer.isVirtual && "ring-violet-500/30"
          )}>
            <AvatarImage src={influencer.avatar} />
            <AvatarFallback className={cn(
              "text-sm font-bold",
              influencer.isVirtual ? "bg-violet-500/20 text-violet-400" : "bg-primary/10 text-primary"
            )}>
              {influencer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info */}
        <div className="px-3 pt-2 pb-3">
          <div className="flex items-center gap-1 mb-0.5">
            <h3 className="text-sm font-bold truncate">{influencer.name}</h3>
            {influencer.rating >= 4.8 && <Crown className="h-3 w-3 text-yellow-500 shrink-0" />}
          </div>
          <p className="text-[10px] text-muted-foreground">{influencer.username}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1 line-clamp-2">{influencer.bio}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
            <div className="text-center">
              <p className="text-xs font-black">{formatFollowers(influencer.followers)}</p>
              <p className="text-[8px] text-muted-foreground">Seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-primary">{influencer.engagement}%</p>
              <p className="text-[8px] text-muted-foreground">Engajamento</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-black text-accent">{influencer.conversionRate}%</p>
              <p className="text-[8px] text-muted-foreground">Conversão</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-3">
            {influencer.categories.map((cat) => (
              <Badge key={cat} variant="outline" className="text-[8px] px-1.5 py-0 border-border/30">{cat}</Badge>
            ))}
          </div>

          {/* Platforms */}
          <div className="flex items-center gap-3 mb-3 text-muted-foreground/40">
            {influencer.platforms.includes("instagram") && <Instagram className="h-3.5 w-3.5" />}
            {influencer.platforms.includes("tiktok") && <Play className="h-3.5 w-3.5" />}
            {influencer.platforms.includes("youtube") && <Eye className="h-3.5 w-3.5" />}
            <span className="text-[9px] ml-auto">{influencer.priceRange}</span>
          </div>

          {/* Bottom stats */}
          <div className="flex items-center justify-between text-[9px] text-muted-foreground/50 mb-3">
            <span className="flex items-center gap-0.5"><Radio className="h-2.5 w-2.5" /> {influencer.livesCount} lives</span>
            <span className="flex items-center gap-0.5"><ShoppingBag className="h-2.5 w-2.5" /> {formatFollowers(influencer.salesCount)} vendas</span>
            <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 text-yellow-500" /> {influencer.rating}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 h-8 text-[10px] rounded-xl bg-foreground text-background" onClick={onInvite}>
              Convidar
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3 text-[10px] rounded-xl border-border/30">
              <MessageCircle className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Marketplace Page ---
export default function Marketplace() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [showVirtual, setShowVirtual] = useState<"all" | "human" | "virtual">("all");

  const filtered = MOCK_INFLUENCERS.filter((inf) => {
    if (search && !inf.name.toLowerCase().includes(search.toLowerCase()) && !inf.username.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "Todos" && !inf.categories.includes(category)) return false;
    if (showVirtual === "human" && inf.isVirtual) return false;
    if (showVirtual === "virtual" && !inf.isVirtual) return false;
    return true;
  });

  const topCreators = MOCK_INFLUENCERS.sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-b-3xl mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-violet-500/10" />
        <div className="relative px-4 pt-4 pb-5">
          <h1 className="text-xl font-black flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Marketplace
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Encontre criadores perfeitos para sua marca</p>

          {/* Search */}
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar criadores..."
              className="pl-9 h-10 rounded-xl bg-muted/30 border-border/20 text-sm"
            />
          </div>

          {/* Stats */}
          <div className="flex gap-3 mt-3">
            <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-3 py-1">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-bold text-primary">{MOCK_INFLUENCERS.filter(i => !i.isVirtual).length} Criadores</span>
            </div>
            <div className="flex items-center gap-1.5 bg-violet-500/10 rounded-full px-3 py-1">
              <Bot className="h-3 w-3 text-violet-500" />
              <span className="text-[10px] font-bold text-violet-500">{MOCK_INFLUENCERS.filter(i => i.isVirtual).length} Virtuais</span>
            </div>
          </div>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 px-4 mb-3">
        {([["all", "Todos"], ["human", "👤 Humanos"], ["virtual", "🤖 Virtuais"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setShowVirtual(key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all",
              showVirtual === key ? "bg-foreground text-background" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all shrink-0",
              category === cat ? "bg-primary text-primary-foreground" : "bg-muted/20 text-muted-foreground/60 hover:bg-muted/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Top Performers */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-bold">Top Conversão</span>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {topCreators.map((inf, i) => (
            <div key={inf.id} className="flex items-center gap-2 bg-muted/20 rounded-2xl px-3 py-2 shrink-0 min-w-[180px]">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={cn(
                    "text-xs font-bold",
                    inf.isVirtual ? "bg-violet-500/20 text-violet-400" : "bg-primary/10 text-primary"
                  )}>
                    {inf.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -top-1 -left-1 h-4 w-4 rounded-full bg-accent text-[8px] font-black text-white flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div>
                <p className="text-[11px] font-bold truncate">{inf.name}</p>
                <p className="text-[9px] text-accent font-bold">{inf.conversionRate}% conversão</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold">{filtered.length} criadores encontrados</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((inf) => (
            <InfluencerCard
              key={inf.id}
              influencer={inf}
              onInvite={() => toast({ title: "Convite enviado! 🎉", description: `${inf.name} receberá seu convite.` })}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum criador encontrado</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-4 mt-6">
        <Card className="border-0 bg-gradient-to-r from-primary/10 via-violet-500/10 to-accent/10 ring-1 ring-primary/20">
          <CardContent className="p-4 text-center">
            <Bot className="h-8 w-8 mx-auto mb-2 text-violet-500" />
            <h3 className="text-sm font-bold mb-1">Crie seu Influenciador Virtual</h3>
            <p className="text-[10px] text-muted-foreground mb-3">Use IA para criar um avatar que apresenta seus produtos 24/7</p>
            <Button size="sm" className="rounded-full text-[11px] bg-violet-500 hover:bg-violet-600 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              Criar Avatar IA
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
