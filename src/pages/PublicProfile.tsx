import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, TrendingUp, Users, ShoppingBag, Star, ArrowLeft, Trophy } from "lucide-react";

interface PublicProfileData {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  bio: string;
  city: string;
  state: string;
  niches: string[];
  categories: string[];
  followers_count: number;
  total_sales: number;
  total_revenue: number;
  conversion_rate: number;
  performance_score: number;
}

interface UserLevel {
  total_xp: number;
  level: string;
}

const levelColors: Record<string, string> = {
  bronze: "from-amber-700 to-amber-500",
  prata: "from-gray-400 to-gray-200",
  ouro: "from-yellow-500 to-yellow-300",
  diamante: "from-cyan-400 to-blue-500",
  elite: "from-purple-500 to-pink-500",
};

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) load();
  }, [username]);

  const load = async () => {
    setLoading(true);
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username!)
      .maybeSingle();

    if (!p) {
      setLoading(false);
      return;
    }
    setProfile(p as PublicProfileData);

    const [{ data: lvl }, { data: pst }] = await Promise.all([
      supabase.from("user_levels").select("total_xp, level").eq("user_id", p.user_id).maybeSingle(),
      supabase
        .from("posts")
        .select("id, content, media_url, post_type, likes_count, comments_count, created_at")
        .eq("user_id", p.user_id)
        .order("created_at", { ascending: false })
        .limit(12),
    ]);

    setLevel(lvl as any);
    setPosts(pst || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-muted-foreground">Perfil não encontrado</p>
        <Link to="/feed"><Button variant="outline">Voltar</Button></Link>
      </div>
    );
  }

  const lvlKey = level?.level || "bronze";
  const lvlGrad = levelColors[lvlKey] || levelColors.bronze;

  return (
    <div className="min-h-screen pb-24">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 py-3 flex items-center gap-3">
        <Link to="/discover"><Button size="icon" variant="ghost"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <h1 className="font-bold">@{profile.username}</h1>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card className="p-6 bg-card/40 backdrop-blur-2xl border-white/10">
          <div className="flex items-start gap-5">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-2 ring-primary/40">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.display_name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              {level && (
                <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gradient-to-r ${lvlGrad} text-white shadow-lg`}>
                  {level.level}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold truncate">{profile.display_name || profile.username}</h2>
              <p className="text-sm text-muted-foreground">@{profile.username}</p>
              {profile.bio && <p className="text-sm mt-2">{profile.bio}</p>}
              {(profile.city || profile.state) && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {[profile.city, profile.state].filter(Boolean).join(", ")}
                </div>
              )}
            </div>
          </div>

          {profile.niches?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-4">
              {profile.niches.map((n) => (
                <Badge key={n} variant="secondary" className="text-xs">{n}</Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-card/40 backdrop-blur-2xl border-white/10">
            <Users className="w-5 h-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{profile.followers_count || 0}</p>
            <p className="text-xs text-muted-foreground">Seguidores</p>
          </Card>
          <Card className="p-4 bg-card/40 backdrop-blur-2xl border-white/10">
            <ShoppingBag className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold">{profile.total_sales || 0}</p>
            <p className="text-xs text-muted-foreground">Vendas</p>
          </Card>
          <Card className="p-4 bg-card/40 backdrop-blur-2xl border-white/10">
            <TrendingUp className="w-5 h-5 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">{Number(profile.conversion_rate || 0).toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">Conversão</p>
          </Card>
          <Card className="p-4 bg-card/40 backdrop-blur-2xl border-white/10">
            <Star className="w-5 h-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{Number(profile.performance_score || 0).toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </Card>
        </div>

        {/* XP */}
        {level && (
          <Card className="p-4 bg-card/40 backdrop-blur-2xl border-white/10">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{level.total_xp.toLocaleString()} XP</p>
                <p className="text-xs text-muted-foreground capitalize">Nível {level.level}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Posts */}
        <div>
          <h3 className="font-bold mb-3">Publicações recentes</h3>
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhuma publicação ainda</p>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((p) => (
                <div key={p.id} className="aspect-square bg-muted rounded-md overflow-hidden">
                  {p.media_url ? (
                    <img src={p.media_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2 text-xs text-center">
                      {p.content?.slice(0, 60)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
