import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, TrendingUp, Flame, Crown, Loader2, Zap, Calendar,
  CalendarDays, Star, Shield, Award
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVELS, getLevelInfo } from "@/hooks/useGamification";

interface RankedUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  total_xp: number;
  weekly_xp: number;
  monthly_xp: number;
  level: string;
  streak_days: number;
  rank: number;
}

type Period = "weekly" | "monthly" | "alltime";

const LEVEL_ICONS: Record<string, typeof Shield> = {
  bronze: Shield,
  prata: Award,
  ouro: Star,
  diamante: Zap,
  elite: Crown,
};

export default function Ranking() {
  const { user } = useAuth();
  const [rankings, setRankings] = useState<RankedUser[]>([]);
  const [myLevel, setMyLevel] = useState<ReturnType<typeof getLevelInfo> | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("weekly");

  useEffect(() => {
    fetchRankings();
  }, [period, user]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const orderCol = period === "weekly" ? "weekly_xp" : period === "monthly" ? "monthly_xp" : "total_xp";

      const { data: levels } = await supabase
        .from("user_levels")
        .select("user_id, total_xp, weekly_xp, monthly_xp, level, streak_days")
        .order(orderCol, { ascending: false })
        .limit(50);

      if (!levels || levels.length === 0) {
        setRankings([]);
        setLoading(false);
        return;
      }

      const userIds = levels.map(l => l.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const ranked: RankedUser[] = levels.map((l, i) => {
        const p = profileMap.get(l.user_id);
        return {
          user_id: l.user_id,
          username: p?.username || "user",
          display_name: p?.display_name || "Usuário",
          avatar_url: p?.avatar_url || null,
          total_xp: l.total_xp,
          weekly_xp: l.weekly_xp,
          monthly_xp: l.monthly_xp,
          level: l.level,
          streak_days: l.streak_days,
          rank: i + 1,
        };
      });

      setRankings(ranked);

      // Get my level
      if (user) {
        const myData = levels.find(l => l.user_id === user.id);
        if (myData) {
          setMyLevel(getLevelInfo(myData.total_xp));
        } else {
          setMyLevel(getLevelInfo(0));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getScore = (r: RankedUser) => {
    if (period === "weekly") return r.weekly_xp;
    if (period === "monthly") return r.monthly_xp;
    return r.total_xp;
  };

  const getLevelMeta = (level: string) => LEVELS.find(l => l.key === level) || LEVELS[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-primary flex items-center justify-center">
            <Trophy className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">Ranking</h1>
        </div>
        <p className="text-[11px] text-muted-foreground/40">Compita, suba de nível, desbloqueie recompensas</p>
      </div>

      {/* My Level Card */}
      {myLevel && user && (
        <div className={cn(
          "rounded-2xl border border-border/15 p-4 bg-gradient-to-br",
          myLevel.bg,
          "relative overflow-hidden"
        )}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br opacity-10 blur-2xl" 
               style={{ background: `linear-gradient(135deg, var(--primary), var(--accent))` }} />
          <div className="flex items-center gap-3 relative z-10">
            <div className={cn("h-12 w-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl", myLevel.color)}>
              {myLevel.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold", myLevel.textColor)}>{myLevel.label}</span>
                <Badge variant="outline" className="text-[8px] px-1.5 h-4 border-border/20">
                  {myLevel.xp} XP
                </Badge>
              </div>
              {myLevel.nextLevel && (
                <div className="mt-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[9px] text-muted-foreground/40">
                      Próximo: {myLevel.nextLevel.label}
                    </span>
                    <span className="text-[9px] text-muted-foreground/40">
                      {myLevel.nextLevel.minXp - myLevel.xp} XP restantes
                    </span>
                  </div>
                  <Progress value={myLevel.progress} className="h-1.5" />
                </div>
              )}
              {myLevel.progress >= 100 && (
                <span className="text-[9px] text-muted-foreground/40 mt-1 block">Nível máximo alcançado! 🎉</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Levels Overview */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
        {LEVELS.map(lvl => {
          const Icon = LEVEL_ICONS[lvl.key] || Shield;
          const isMyLevel = myLevel?.key === lvl.key;
          return (
            <div
              key={lvl.key}
              className={cn(
                "shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all",
                isMyLevel ? "border-primary/30 bg-primary/5" : "border-border/10 bg-card/40"
              )}
            >
              <div className={cn("h-7 w-7 rounded-lg bg-gradient-to-br flex items-center justify-center", lvl.color)}>
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-[9px] font-medium">{lvl.label}</span>
              <span className="text-[8px] text-muted-foreground/30">{lvl.minXp}+</span>
            </div>
          );
        })}
      </div>

      {/* XP Actions Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { action: "Post", pts: 10, icon: "📝" },
          { action: "Comentar", pts: 5, icon: "💬" },
          { action: "Curtir", pts: 2, icon: "❤️" },
          { action: "Aula", pts: 20, icon: "📚" },
          { action: "Streak", pts: 25, icon: "🔥" },
          { action: "Curso 100%", pts: 100, icon: "🎓" },
        ].map(a => (
          <div key={a.action} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/20 border border-border/10">
            <span className="text-xs">{a.icon}</span>
            <div>
              <span className="text-[9px] font-medium block">{a.action}</span>
              <span className="text-[8px] text-success font-bold">+{a.pts} XP</span>
            </div>
          </div>
        ))}
      </div>

      {/* Period Tabs */}
      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList className="w-full h-9 p-0.5 bg-muted/30 rounded-full border-0">
          <TabsTrigger value="weekly" className="flex-1 gap-1.5 text-[11px] h-8 rounded-full data-[state=active]:shadow-none">
            <Calendar className="h-3.5 w-3.5" /> Semanal
          </TabsTrigger>
          <TabsTrigger value="monthly" className="flex-1 gap-1.5 text-[11px] h-8 rounded-full data-[state=active]:shadow-none">
            <CalendarDays className="h-3.5 w-3.5" /> Mensal
          </TabsTrigger>
          <TabsTrigger value="alltime" className="flex-1 gap-1.5 text-[11px] h-8 rounded-full data-[state=active]:shadow-none">
            <Trophy className="h-3.5 w-3.5" /> Geral
          </TabsTrigger>
        </TabsList>

        <TabsContent value={period} className="mt-5">
          {/* Podium */}
          {rankings.length >= 3 && (
            <div className="flex items-end justify-center gap-4 mb-8">
              {/* 2nd */}
              <PodiumSpot user={rankings[1]} rank={2} score={getScore(rankings[1])} levelMeta={getLevelMeta(rankings[1].level)} height="h-16" />
              {/* 1st */}
              <PodiumSpot user={rankings[0]} rank={1} score={getScore(rankings[0])} levelMeta={getLevelMeta(rankings[0].level)} height="h-24" isFirst />
              {/* 3rd */}
              <PodiumSpot user={rankings[2]} rank={3} score={getScore(rankings[2])} levelMeta={getLevelMeta(rankings[2].level)} height="h-12" />
            </div>
          )}

          {/* List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0.5">
            {rankings.slice(3).map((r) => {
              const lvlMeta = getLevelMeta(r.level);
              const score = getScore(r);
              return (
                <div
                  key={r.user_id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl hover:bg-muted/20 transition-colors",
                    user?.id === r.user_id && "bg-primary/5 border border-primary/10"
                  )}
                >
                  <span className="text-[11px] font-bold text-muted-foreground/20 w-5 text-center">{r.rank}</span>
                  <div className="relative">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={r.avatar_url || undefined} />
                      <AvatarFallback className="bg-muted text-[9px] font-bold">{r.display_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className={cn("absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-gradient-to-br flex items-center justify-center text-[7px]", lvlMeta.color)}>
                      {lvlMeta.emoji}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.display_name || r.username}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground/30">@{r.username}</span>
                      {r.streak_days > 0 && (
                        <span className="text-[9px] text-accent flex items-center gap-0.5">
                          <Flame className="h-2.5 w-2.5" /> {r.streak_days}d
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-success">{score.toLocaleString()} XP</p>
                    <Badge variant="outline" className={cn("text-[8px] px-1.5 h-3.5 border-0", lvlMeta.bg, lvlMeta.textColor)}>
                      {lvlMeta.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {rankings.length === 0 && (
            <div className="py-20 text-center">
              <Trophy className="h-8 w-8 mx-auto text-muted-foreground/10 mb-3" />
              <p className="text-xs text-muted-foreground/30">Nenhum ranking disponível ainda</p>
              <p className="text-[10px] text-muted-foreground/20 mt-1">Publique, comente e interaja para ganhar XP!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PodiumSpot({
  user: r, rank, score, levelMeta, height, isFirst = false,
}: {
  user: RankedUser; rank: number; score: number; levelMeta: (typeof LEVELS)[number]; height: string; isFirst?: boolean;
}) {
  const podiumColors = { 1: "bg-amber-500/10", 2: "bg-muted/30", 3: "bg-muted/30" };
  const textColors = { 1: "text-amber-500/40", 2: "text-muted-foreground/30", 3: "text-muted-foreground/30" };

  return (
    <div className={cn("flex flex-col items-center", isFirst ? "w-24 -mt-6" : "w-20")}>
      {isFirst && <Crown className="h-5 w-5 text-amber-500 mb-1" />}
      <div className={cn("rounded-full p-[2px]", isFirst ? "bg-gradient-to-br from-amber-400 to-amber-600" : "")}>
        <Avatar className={cn(isFirst ? "h-16 w-16 border-2 border-background" : "h-12 w-12 ring-2 ring-border/30")}>
          <AvatarImage src={r.avatar_url || undefined} />
          <AvatarFallback className={cn("bg-muted font-bold", isFirst ? "text-sm" : "text-[10px]")}>{r.display_name?.[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className={cn(height, "w-full rounded-t-xl mt-2 flex flex-col items-center justify-center", podiumColors[rank as 1 | 2 | 3])}>
        <span className={cn("font-bold", isFirst ? "text-3xl" : "text-xl", textColors[rank as 1 | 2 | 3])}>{rank}</span>
        <span className="text-[8px]">{levelMeta.emoji}</span>
      </div>
      <p className={cn("font-semibold mt-1.5 truncate w-full text-center", isFirst ? "text-xs" : "text-[10px]")}>@{r.username}</p>
      <p className={cn("font-bold text-success", isFirst ? "text-xs" : "text-[10px]")}>{score.toLocaleString()} XP</p>
    </div>
  );
}
