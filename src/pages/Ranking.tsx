import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, TrendingUp, DollarSign, Flame, Crown, Medal, Loader2, UserPlus } from "lucide-react";
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

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex h-10 w-10 rounded-xl bg-primary/5 items-center justify-center mb-2">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-lg font-bold">Ranking</h1>
        <p className="text-xs text-muted-foreground">Os melhores da plataforma</p>
      </div>

      {/* Period */}
      <div className="flex justify-center gap-1.5">
        {([["daily","Hoje"],["weekly","Semana"],["monthly","Mês"]] as const).map(([id,label]) => (
          <button key={id} onClick={() => setPeriod(id)} className={cn("px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors", period === id ? "bg-foreground text-background" : "bg-muted/50 text-muted-foreground")}>
            {label}
          </button>
        ))}
      </div>

      {/* Type */}
      <Tabs value={type} onValueChange={(v) => setType(v as RankingType)}>
        <TabsList className="w-full h-9 p-0.5 bg-muted/50 rounded-lg">
          {([["earnings","Comissões",DollarSign],["growth","Crescimento",TrendingUp],["engagement","Engajamento",Flame]] as const).map(([id,label,Icon]) => (
            <TabsTrigger key={id} value={id} className="flex-1 gap-1.5 text-xs h-8 rounded-md">
              <Icon className="h-3.5 w-3.5" /><span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={type} className="mt-4">
          {/* Podium */}
          {rankings.length >= 3 && (
            <div className="flex items-end justify-center gap-3 mb-6">
              {/* 2nd */}
              <div className="flex flex-col items-center w-20">
                <Avatar className="h-12 w-12 ring-2 ring-border"><AvatarImage src={rankings[1]?.avatar_url || undefined} /><AvatarFallback className="bg-muted text-xs font-semibold">{rankings[1]?.display_name?.[0]}</AvatarFallback></Avatar>
                <div className="h-14 w-full bg-muted/40 rounded-t-lg mt-1.5 flex items-center justify-center"><span className="text-lg font-bold text-muted-foreground">2</span></div>
                <p className="text-[10px] font-medium mt-1 truncate w-full text-center">@{rankings[1]?.username}</p>
                <p className="text-[10px] font-bold text-emerald-600">{fmtScore(rankings[1]?.score || 0, type)}</p>
              </div>
              {/* 1st */}
              <div className="flex flex-col items-center w-24 -mt-4">
                <Crown className="h-5 w-5 text-amber-500 mb-0.5" />
                <Avatar className="h-16 w-16 ring-2 ring-amber-500/50"><AvatarImage src={rankings[0]?.avatar_url || undefined} /><AvatarFallback className="bg-amber-500/10 text-sm font-bold text-amber-600">{rankings[0]?.display_name?.[0]}</AvatarFallback></Avatar>
                <div className="h-20 w-full bg-amber-500/10 rounded-t-lg mt-1.5 flex items-center justify-center"><span className="text-2xl font-bold text-amber-600">1</span></div>
                <p className="text-xs font-semibold mt-1 truncate w-full text-center">@{rankings[0]?.username}</p>
                <p className="text-xs font-bold text-emerald-600">{fmtScore(rankings[0]?.score || 0, type)}</p>
              </div>
              {/* 3rd */}
              <div className="flex flex-col items-center w-20">
                <Avatar className="h-12 w-12 ring-2 ring-border"><AvatarImage src={rankings[2]?.avatar_url || undefined} /><AvatarFallback className="bg-muted text-xs font-semibold">{rankings[2]?.display_name?.[0]}</AvatarFallback></Avatar>
                <div className="h-10 w-full bg-muted/40 rounded-t-lg mt-1.5 flex items-center justify-center"><span className="text-lg font-bold text-muted-foreground">3</span></div>
                <p className="text-[10px] font-medium mt-1 truncate w-full text-center">@{rankings[2]?.username}</p>
                <p className="text-[10px] font-bold text-emerald-600">{fmtScore(rankings[2]?.score || 0, type)}</p>
              </div>
            </div>
          )}

          {/* List */}
          <div className="space-y-1">
            {rankings.slice(3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors">
                <span className="text-xs font-bold text-muted-foreground w-5 text-center">{r.rank}</span>
                <Avatar className="h-9 w-9"><AvatarImage src={r.avatar_url || undefined} /><AvatarFallback className="bg-muted text-[10px] font-semibold">{r.display_name?.[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.display_name || r.username}</p>
                  <p className="text-[10px] text-muted-foreground">@{r.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-600">{fmtScore(r.score, type)}</p>
                  {r.change !== undefined && r.change !== 0 && (
                    <p className={cn("text-[10px] flex items-center justify-end gap-0.5", r.change > 0 ? "text-emerald-500" : "text-destructive")}>
                      <TrendingUp className={cn("h-2.5 w-2.5", r.change < 0 && "rotate-180")} />{Math.abs(r.change)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {rankings.length === 0 && (
            <div className="py-16 text-center">
              <Trophy className="h-10 w-10 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-xs text-muted-foreground">Nenhum ranking disponível</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
