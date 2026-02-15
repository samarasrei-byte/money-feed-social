import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, DollarSign, Flame, Crown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RankingUser {
  id: string; user_id: string; username: string; display_name: string;
  avatar_url: string | null; score: number; change?: number; rank: number;
}

type RankingPeriod = "daily" | "weekly" | "monthly";
type RankingType = "earnings" | "growth" | "engagement";

export default function Ranking() {
  const { user } = useAuth();
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<RankingPeriod>("weekly");
  const [type, setType] = useState<RankingType>("earnings");

  useEffect(() => { fetchRankings(); }, [period, type]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const { data: profiles } = await supabase.from("profiles").select("id, user_id, username, display_name, avatar_url").not("username", "is", null).limit(20);
      const ranked: RankingUser[] = (profiles || []).map((p, i) => ({
        ...p, score: Math.floor(Math.random() * 50000) + 1000, change: Math.floor(Math.random() * 10) - 3, rank: i + 1,
      })).sort((a, b) => b.score - a.score).map((p, i) => ({ ...p, rank: i + 1 }));
      setRankings(ranked);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fmtScore = (s: number, t: RankingType) => {
    if (t === "earnings") { if (s >= 1e6) return `R$${(s/1e6).toFixed(1)}M`; if (s >= 1e3) return `R$${(s/1e3).toFixed(1)}K`; return `R$${s}`; }
    if (s >= 1e3) return `${(s/1e3).toFixed(1)}K`; return s.toString();
  };

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground/30" /></div>;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-lg font-bold tracking-tight">Ranking</h1>
        <p className="text-[11px] text-muted-foreground/40">Os melhores da plataforma</p>
      </div>

      {/* Period pills */}
      <div className="flex justify-center gap-1">
        {([["daily","Hoje"],["weekly","Semana"],["monthly","Mês"]] as const).map(([id,label]) => (
          <button key={id} onClick={() => setPeriod(id)} className={cn("px-4 py-1.5 rounded-full text-[11px] font-medium transition-all", period === id ? "bg-foreground text-background" : "text-muted-foreground/40 hover:text-foreground")}>
            {label}
          </button>
        ))}
      </div>

      {/* Type tabs */}
      <Tabs value={type} onValueChange={(v) => setType(v as RankingType)}>
        <TabsList className="w-full h-9 p-0.5 bg-muted/30 rounded-full border-0">
          {([["earnings","Comissões",DollarSign],["growth","Crescimento",TrendingUp],["engagement","Engajamento",Flame]] as const).map(([id,label,Icon]) => (
            <TabsTrigger key={id} value={id} className="flex-1 gap-1.5 text-[11px] h-8 rounded-full data-[state=active]:shadow-none">
              <Icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={type} className="mt-5">
          {/* Podium */}
          {rankings.length >= 3 && (
            <div className="flex items-end justify-center gap-4 mb-8">
              {/* 2nd */}
              <div className="flex flex-col items-center w-20">
                <Avatar className="h-12 w-12 ring-2 ring-border/30"><AvatarImage src={rankings[1]?.avatar_url || undefined} /><AvatarFallback className="bg-muted text-[10px] font-bold">{rankings[1]?.display_name?.[0]}</AvatarFallback></Avatar>
                <div className="h-16 w-full bg-muted/30 rounded-t-xl mt-2 flex items-center justify-center"><span className="text-xl font-bold text-muted-foreground/30">2</span></div>
                <p className="text-[10px] font-semibold mt-1.5 truncate w-full text-center">@{rankings[1]?.username}</p>
                <p className="text-[10px] font-bold text-success">{fmtScore(rankings[1]?.score || 0, type)}</p>
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center w-24 -mt-6">
                <Crown className="h-5 w-5 text-amber-500 mb-1" />
                <div className="rounded-full p-[2px] bg-gradient-to-br from-amber-400 to-amber-600">
                  <Avatar className="h-16 w-16 border-2 border-background"><AvatarImage src={rankings[0]?.avatar_url || undefined} /><AvatarFallback className="bg-amber-500/10 text-sm font-bold text-amber-600">{rankings[0]?.display_name?.[0]}</AvatarFallback></Avatar>
                </div>
                <div className="h-24 w-full bg-amber-500/10 rounded-t-xl mt-2 flex items-center justify-center"><span className="text-3xl font-bold text-amber-500/40">1</span></div>
                <p className="text-xs font-bold mt-1.5 truncate w-full text-center">@{rankings[0]?.username}</p>
                <p className="text-xs font-bold text-success">{fmtScore(rankings[0]?.score || 0, type)}</p>
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center w-20">
                <Avatar className="h-12 w-12 ring-2 ring-border/30"><AvatarImage src={rankings[2]?.avatar_url || undefined} /><AvatarFallback className="bg-muted text-[10px] font-bold">{rankings[2]?.display_name?.[0]}</AvatarFallback></Avatar>
                <div className="h-12 w-full bg-muted/30 rounded-t-xl mt-2 flex items-center justify-center"><span className="text-xl font-bold text-muted-foreground/30">3</span></div>
                <p className="text-[10px] font-semibold mt-1.5 truncate w-full text-center">@{rankings[2]?.username}</p>
                <p className="text-[10px] font-bold text-success">{fmtScore(rankings[2]?.score || 0, type)}</p>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-0.5">
            {rankings.slice(3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/20 transition-colors">
                <span className="text-[11px] font-bold text-muted-foreground/20 w-5 text-center">{r.rank}</span>
                <Avatar className="h-9 w-9"><AvatarImage src={r.avatar_url || undefined} /><AvatarFallback className="bg-muted text-[9px] font-bold">{r.display_name?.[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.display_name || r.username}</p>
                  <p className="text-[10px] text-muted-foreground/30">@{r.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-success">{fmtScore(r.score, type)}</p>
                  {r.change !== undefined && r.change !== 0 && (
                    <p className={cn("text-[9px] flex items-center justify-end gap-0.5", r.change > 0 ? "text-success" : "text-destructive")}>
                      <TrendingUp className={cn("h-2.5 w-2.5", r.change < 0 && "rotate-180")} />{Math.abs(r.change)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {rankings.length === 0 && (
            <div className="py-20 text-center">
              <Trophy className="h-8 w-8 mx-auto text-muted-foreground/10 mb-3" />
              <p className="text-xs text-muted-foreground/30">Nenhum ranking disponível</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
