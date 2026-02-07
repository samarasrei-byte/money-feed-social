import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { 
  Users, 
  Plus, 
  Search, 
  TrendingUp, 
  Crown, 
  Loader2,
  UserPlus,
  UserMinus,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Community {
  id: string;
  name: string;
  description: string | null;
  cover_url: string | null;
  members_count: number;
  creator_id: string;
  created_at: string;
  isMember?: boolean;
  creator?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

const COMMUNITY_THEMES = [
  { id: "affiliates", label: "Afiliados", icon: "💰", color: "bg-success/10 text-success" },
  { id: "hot-products", label: "Produtos Quentes", icon: "🔥", color: "bg-accent/10 text-accent" },
  { id: "live-commerce", label: "Live Commerce", icon: "📺", color: "bg-primary/10 text-primary" },
  { id: "scale", label: "Escala", icon: "📈", color: "bg-warning/10 text-warning" },
  { id: "b2b", label: "B2B", icon: "🏢", color: "bg-secondary text-secondary-foreground" },
];

export default function Communities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", description: "" });

  useEffect(() => {
    fetchCommunities();
  }, [user]);

  const fetchCommunities = async () => {
    try {
      const { data: communitiesData, error } = await supabase
        .from("communities")
        .select("*")
        .order("members_count", { ascending: false });

      if (error) throw error;

      if (!communitiesData) {
        setCommunities([]);
        return;
      }

      // Get creator profiles
      const creatorIds = [...new Set(communitiesData.map(c => c.creator_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", creatorIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Check membership for current user
      let membershipSet = new Set<string>();
      if (user) {
        const { data: memberships } = await supabase
          .from("community_members")
          .select("community_id")
          .eq("user_id", user.id);

        membershipSet = new Set(memberships?.map(m => m.community_id) || []);
      }

      const enrichedCommunities: Community[] = communitiesData.map(c => ({
        ...c,
        isMember: membershipSet.has(c.id),
        creator: profilesMap.get(c.creator_id) || undefined,
      }));

      setCommunities(enrichedCommunities);
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as comunidades",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async (communityId: string, isMember: boolean) => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para participar",
      });
      return;
    }

    try {
      if (isMember) {
        await supabase
          .from("community_members")
          .delete()
          .eq("community_id", communityId)
          .eq("user_id", user.id);

        // Update local count
        setCommunities(prev => prev.map(c => 
          c.id === communityId 
            ? { ...c, isMember: false, members_count: c.members_count - 1 }
            : c
        ));

        toast({ title: "Você saiu da comunidade" });
      } else {
        await supabase.from("community_members").insert({
          community_id: communityId,
          user_id: user.id,
        });

        setCommunities(prev => prev.map(c => 
          c.id === communityId 
            ? { ...c, isMember: true, members_count: c.members_count + 1 }
            : c
        ));

        toast({ title: "Você entrou na comunidade!" });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  };

  const handleCreateCommunity = async () => {
    if (!newCommunity.name.trim() || !user) return;

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from("communities")
        .insert({
          name: newCommunity.name.trim(),
          description: newCommunity.description.trim() || null,
          creator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join as member
      await supabase.from("community_members").insert({
        community_id: data.id,
        user_id: user.id,
      });

      toast({ title: "Comunidade criada!" });
      setNewCommunity({ name: "", description: "" });
      fetchCommunities();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredCommunities = communities.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comunidades</h1>
          <p className="text-sm text-muted-foreground">
            Encontre sua tribo e cresça junto
          </p>
        </div>
        
        {user && (
          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-2 bg-gradient-primary">
                <Plus className="h-4 w-4" />
                Criar
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Criar Comunidade</SheetTitle>
                <SheetDescription>
                  Crie um espaço para reunir pessoas com interesses em comum
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-6">
                <div className="space-y-2">
                  <Label>Nome da comunidade</Label>
                  <Input
                    placeholder="Ex: Afiliados de Tecnologia"
                    value={newCommunity.name}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição (opcional)</Label>
                  <Textarea
                    placeholder="Sobre o que é essa comunidade?"
                    value={newCommunity.description}
                    onChange={(e) => setNewCommunity(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </SheetClose>
                <Button
                  onClick={handleCreateCommunity}
                  disabled={!newCommunity.name.trim() || isCreating}
                  className="bg-gradient-primary"
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar comunidades..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Theme Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {COMMUNITY_THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(selectedTheme === theme.id ? null : theme.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedTheme === theme.id
                ? "bg-primary text-primary-foreground"
                : theme.color
            )}
          >
            <span>{theme.icon}</span>
            <span>{theme.label}</span>
          </button>
        ))}
      </div>

      {/* Communities Grid */}
      {filteredCommunities.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Nenhuma comunidade encontrada"
                : "Nenhuma comunidade ainda. Seja o primeiro a criar!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCommunities.map((community) => (
            <Card key={community.id} className="overflow-hidden">
              {community.cover_url && (
                <div 
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url(${community.cover_url})` }}
                />
              )}
              <CardContent className={cn("p-4", !community.cover_url && "pt-4")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{community.name}</h3>
                      {community.members_count >= 100 && (
                        <Badge variant="secondary" className="shrink-0">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    {community.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {community.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {community.members_count} membros
                      </span>
                      {community.creator && (
                        <span className="flex items-center gap-1">
                          <Crown className="h-3 w-3" />
                          @{community.creator.username}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant={community.isMember ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      "shrink-0",
                      !community.isMember && "bg-gradient-primary hover:opacity-90"
                    )}
                    onClick={() => handleJoinLeave(community.id, !!community.isMember)}
                  >
                    {community.isMember ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-1" />
                        Sair
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-1" />
                        Entrar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
