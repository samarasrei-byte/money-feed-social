import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Trophy, 
  TrendingUp, 
  Users,
  DollarSign,
  Flame,
  Crown,
  Medal,
  Loader2,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RankingUser {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  score: number;
  change?: number;
  rank: number;
}

type RankingPeriod = "daily" | "weekly" | "monthly";
type RankingType = "earnings" | "growth" | "engagement";

export default function Ranking() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<RankingPeriod>("weekly");
  const [type, setType] = useState<RankingType>("earnings");

  useEffect(() => {
    fetchRankings();
  }, [period, type]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      // For now, we'll simulate rankings with profile data
      // In production, this would be a proper leaderboard query
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, user_id, username, display_name, avatar_url")
        .not("username", "is", null)
        .limit(20);

      if (error) throw error;

      // Simulate ranking scores
      const rankedProfiles: RankingUser[] = (profiles || []).map((profile, index) => ({
        ...profile,
        score: Math.floor(Math.random() * 50000) + 1000,
        change: Math.floor(Math.random() * 10) - 3,
        rank: index + 1,
      })).sort((a, b) => b.score - a.score).map((p, i) => ({ ...p, rank: i + 1 }));

      setRankings(rankedProfiles);
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatScore = (score: number, rankingType: RankingType) => {
    if (rankingType === "earnings") {
      if (score >= 1000000) return `R$ ${(score / 1000000).toFixed(1)}M`;
      if (score >= 1000) return `R$ ${(score / 1000).toFixed(1)}K`;
      return `R$ ${score}`;
    }
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toString();
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankBg = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30";
    return "";
  };

  const periods = [
    { id: "daily" as const, label: "Hoje" },
    { id: "weekly" as const, label: "Semana" },
    { id: "monthly" as const, label: "Mês" },
  ];

  const types = [
    { id: "earnings" as const, label: "Comissões", icon: DollarSign },
    { id: "growth" as const, label: "Crescimento", icon: TrendingUp },
    { id: "engagement" as const, label: "Engajamento", icon: Flame },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-primary mb-4">
          <Trophy className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Ranking</h1>
        <p className="text-sm text-muted-foreground">
          Os melhores da plataforma
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center gap-2">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              period === p.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Type Tabs */}
      <Tabs value={type} onValueChange={(v) => setType(v as RankingType)}>
        <TabsList className="w-full">
          {types.map((t) => (
            <TabsTrigger key={t.id} value={t.id} className="flex-1 gap-2">
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={type} className="mt-4">
          {/* Top 3 Podium */}
          {rankings.length >= 3 && (
            <div className="flex items-end justify-center gap-2 mb-6">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 ring-2 ring-gray-400">
                  <AvatarImage src={rankings[1]?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gray-400 text-white font-bold">
                    {rankings[1]?.display_name?.[0] || "2"}
                  </AvatarFallback>
                </Avatar>
                <div className="h-20 w-20 bg-gray-400/20 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-500">2</span>
                </div>
                <p className="text-xs font-medium mt-2 truncate max-w-[80px]">
                  @{rankings[1]?.username}
                </p>
                <p className="text-xs text-success font-bold">
                  {formatScore(rankings[1]?.score || 0, type)}
                </p>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center -mt-6">
                <Crown className="h-8 w-8 text-yellow-500 mb-1" />
                <Avatar className="h-20 w-20 ring-4 ring-yellow-500">
                  <AvatarImage src={rankings[0]?.avatar_url || undefined} />
                  <AvatarFallback className="bg-yellow-500 text-white font-bold text-xl">
                    {rankings[0]?.display_name?.[0] || "1"}
                  </AvatarFallback>
                </Avatar>
                <div className="h-28 w-24 bg-yellow-500/20 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-3xl font-bold text-yellow-600">1</span>
                </div>
                <p className="text-sm font-semibold mt-2 truncate max-w-[90px]">
                  @{rankings[0]?.username}
                </p>
                <p className="text-sm text-success font-bold">
                  {formatScore(rankings[0]?.score || 0, type)}
                </p>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 ring-2 ring-amber-600">
                  <AvatarImage src={rankings[2]?.avatar_url || undefined} />
                  <AvatarFallback className="bg-amber-600 text-white font-bold">
                    {rankings[2]?.display_name?.[0] || "3"}
                  </AvatarFallback>
                </Avatar>
                <div className="h-16 w-20 bg-amber-600/20 rounded-t-lg mt-2 flex items-center justify-center">
                  <span className="text-2xl font-bold text-amber-700">3</span>
                </div>
                <p className="text-xs font-medium mt-2 truncate max-w-[80px]">
                  @{rankings[2]?.username}
                </p>
                <p className="text-xs text-success font-bold">
                  {formatScore(rankings[2]?.score || 0, type)}
                </p>
              </div>
            </div>
          )}

          {/* Rest of Rankings */}
          <div className="space-y-2">
            {rankings.slice(3).map((rankUser) => (
              <Card 
                key={rankUser.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  getRankBg(rankUser.rank)
                )}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getRankIcon(rankUser.rank)}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={rankUser.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {rankUser.display_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {rankUser.display_name || rankUser.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{rankUser.username}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-success">
                        {formatScore(rankUser.score, type)}
                      </p>
                      {rankUser.change !== undefined && rankUser.change !== 0 && (
                        <p className={cn(
                          "text-xs flex items-center justify-end gap-0.5",
                          rankUser.change > 0 ? "text-success" : "text-destructive"
                        )}>
                          <TrendingUp className={cn(
                            "h-3 w-3",
                            rankUser.change < 0 && "rotate-180"
                          )} />
                          {Math.abs(rankUser.change)}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {rankings.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum ranking disponível ainda
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
