import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { CommunityThemeTabs } from "@/components/communities/CommunityThemeTabs";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { CommunitySkeleton } from "@/components/communities/CommunitySkeleton";
import { CommunityEmptyState } from "@/components/communities/CommunityEmptyState";
import { CreateCommunitySheet } from "@/components/communities/CreateCommunitySheet";

interface Community {
  id: string; name: string; description: string | null; cover_url: string | null;
  members_count: number; creator_id: string; theme: string | null; created_at: string;
  isMember?: boolean;
  creator?: { username: string; display_name: string; avatar_url: string | null };
}

export default function Communities() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const fetchCommunities = useCallback(async () => {
    try {
      const { data: communitiesData, error } = await supabase.from("communities").select("*").order("members_count", { ascending: false }).is("course_id", null);
      if (error) throw error;
      if (!communitiesData) { setCommunities([]); return; }
      const creatorIds = [...new Set(communitiesData.map((c) => c.creator_id))];
      const { data: profiles } = await supabase.from("profiles").select("user_id, username, display_name, avatar_url").in("user_id", creatorIds);
      const profilesMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
      let membershipSet = new Set<string>();
      if (user) { const { data: memberships } = await supabase.from("community_members").select("community_id").eq("user_id", user.id); membershipSet = new Set(memberships?.map((m) => m.community_id) || []); }
      setCommunities(communitiesData.map((c: any) => ({ ...c, theme: c.theme || null, isMember: membershipSet.has(c.id), creator: profilesMap.get(c.creator_id) || undefined })));
    } catch (error) { console.error("Error:", error); toast({ variant: "destructive", title: "Erro" }); } finally { setLoading(false); }
  }, [user, toast]);

  useEffect(() => { fetchCommunities(); }, [fetchCommunities]);

  const { containerRef, pullDistance, refreshing } = usePullToRefresh({ onRefresh: async () => { await fetchCommunities(); } });

  const handleJoinLeave = async (communityId: string, isMember: boolean) => {
    if (!user) { toast({ title: "Faça login" }); return; }
    try {
      if (isMember) { await supabase.from("community_members").delete().eq("community_id", communityId).eq("user_id", user.id); setCommunities((prev) => prev.map((c) => c.id === communityId ? { ...c, isMember: false, members_count: c.members_count - 1 } : c)); toast({ title: "Saiu da comunidade" }); }
      else { await supabase.from("community_members").insert({ community_id: communityId, user_id: user.id }); setCommunities((prev) => prev.map((c) => c.id === communityId ? { ...c, isMember: true, members_count: c.members_count + 1 } : c)); toast({ title: "Bem-vindo! 🎉" }); }
    } catch (error: any) { toast({ variant: "destructive", title: "Erro", description: error.message }); }
  };

  const filteredCommunities = communities.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedTheme && c.theme !== selectedTheme) return false;
    return true;
  });

  if (loading) return <CommunitySkeleton />;

  return (
    <div ref={containerRef} className="max-w-lg mx-auto pb-20 space-y-5 overflow-auto">
      <div className="flex justify-center items-center overflow-hidden transition-all duration-200" style={{ height: pullDistance > 0 ? pullDistance : 0 }}>
        <Loader2 className={`h-4 w-4 text-muted-foreground/30 transition-transform ${refreshing ? "animate-spin" : ""}`} style={{ transform: `rotate(${pullDistance * 3}deg)` }} />
      </div>

      <div className="flex items-center justify-between px-4 pt-3">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Comunidades</h1>
          <p className="text-[11px] text-muted-foreground/40">Encontre sua tribo</p>
        </div>
        {user && <CreateCommunitySheet onCreated={fetchCommunities} />}
      </div>

      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/30" />
          <Input placeholder="Buscar comunidades..." className="pl-10 h-10 rounded-full bg-muted/20 border-border/15 text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>

      <CommunityThemeTabs selected={selectedTheme} onChange={setSelectedTheme} />

      {filteredCommunities.length === 0 ? (
        <CommunityEmptyState hasSearch={!!searchQuery || !!selectedTheme} />
      ) : (
        <div className="space-y-2.5 px-4">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} onJoinLeave={handleJoinLeave} />
          ))}
        </div>
      )}
    </div>
  );
}
