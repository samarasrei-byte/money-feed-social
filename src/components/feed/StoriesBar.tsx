import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MOCK_STORIES } from "@/lib/mockData";

interface StoryData {
  id: string;
  mediaUrl: string;
  mediaType: string;
  createdAt: string;
}

interface StoryUser {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  stories: StoryData[];
}

export function StoriesBar() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [storyUsers, setStoryUsers] = useState<StoryUser[]>([]);
  const [viewingUser, setViewingUser] = useState<StoryUser | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedUserIds, setViewedUserIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStories = useCallback(async () => {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      setStoryUsers([]);
      return;
    }

    const userIds = [...new Set(data.map((s) => s.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url")
      .in("user_id", userIds);

    const profilesMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    const grouped = new Map<string, StoryData[]>();
    for (const s of data) {
      const arr = grouped.get(s.user_id) || [];
      arr.push({ id: s.id, mediaUrl: s.media_url, mediaType: s.media_type, createdAt: s.created_at });
      grouped.set(s.user_id, arr);
    }

    const users: StoryUser[] = [];
    for (const [userId, stories] of grouped) {
      const p = profilesMap.get(userId);
      users.push({ userId, username: p?.username || "user", displayName: p?.display_name || "Usuário", avatarUrl: p?.avatar_url || undefined, stories });
    }

    users.sort((a, b) => { if (a.userId === user?.id) return -1; if (b.userId === user?.id) return 1; return 0; });
    setStoryUsers(users);
  }, [user?.id]);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 50 * 1024 * 1024) { toast({ variant: "destructive", title: "Arquivo muito grande", description: "Máximo 50MB" }); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `stories/${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("post-media").upload(path, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("post-media").getPublicUrl(path);
      const mediaType = file.type.startsWith("video") ? "video" : "image";
      const { error: insertError } = await supabase.from("stories").insert({ user_id: user.id, media_url: urlData.publicUrl, media_type: mediaType });
      if (insertError) throw insertError;
      toast({ title: "Story publicado!" });
      fetchStories();
    } catch (err) { console.error("Upload error:", err); toast({ variant: "destructive", title: "Erro ao publicar story" }); } finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const openStory = (su: StoryUser) => { setViewingUser(su); setCurrentIndex(0); setViewedUserIds((prev) => new Set(prev).add(su.userId)); };

  const nextStory = () => {
    if (!viewingUser) return;
    if (currentIndex < viewingUser.stories.length - 1) { setCurrentIndex((i) => i + 1); } else {
      const idx = storyUsers.findIndex((u) => u.userId === viewingUser.userId);
      if (idx < storyUsers.length - 1) { const next = storyUsers[idx + 1]; setViewingUser(next); setCurrentIndex(0); setViewedUserIds((prev) => new Set(prev).add(next.userId)); } else { setViewingUser(null); }
    }
  };

  const prevStory = () => { if (currentIndex > 0) setCurrentIndex((i) => i - 1); };

  const currentStory = viewingUser?.stories[currentIndex];
  const hasOwnStories = storyUsers.some((u) => u.userId === user?.id);
  const displayMockStories = storyUsers.length === 0;

  const StoryAvatar = ({ src, fallback, hasNew, size = "md" }: { src?: string; fallback: string; hasNew?: boolean; size?: "sm" | "md" }) => {
    const dim = size === "md" ? "h-[56px] w-[56px]" : "h-[48px] w-[48px]";
    return (
      <div className={cn("rounded-full p-[2px]", hasNew ? "bg-gradient-to-br from-accent via-primary to-purple-500" : "bg-border/30")}>
        <Avatar className={cn(dim, "border-2 border-background")}>
          <AvatarImage src={src} />
          <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">{fallback}</AvatarFallback>
        </Avatar>
      </div>
    );
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />

      <div className="bg-background py-3">
        <ScrollArea className="w-full">
          <div className="flex gap-3 px-4">
            {/* Add story */}
            {user && (
              <button className="flex flex-col items-center gap-1 min-w-[64px]" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <div className="relative">
                  <Avatar className="h-[56px] w-[56px] border-2 border-border/20">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-bold">
                      {(profile?.display_name || "V").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center border-2 border-background">
                    {uploading ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : <Plus className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground/50 font-medium">Seu story</span>
              </button>
            )}

            {/* Real stories */}
            {storyUsers.filter((su) => su.userId !== user?.id).map((su) => (
              <button key={su.userId} className="flex flex-col items-center gap-1 min-w-[64px]" onClick={() => openStory(su)}>
                <StoryAvatar src={su.avatarUrl} fallback={su.displayName.slice(0, 2).toUpperCase()} hasNew={!viewedUserIds.has(su.userId)} />
                <span className="text-[10px] text-muted-foreground/50 truncate w-14 text-center font-medium">
                  {su.username.length > 8 ? su.username.slice(0, 8) + "…" : su.username}
                </span>
              </button>
            ))}

            {/* Own stories */}
            {hasOwnStories && (
              <button className="flex flex-col items-center gap-1 min-w-[64px]" onClick={() => { const own = storyUsers.find((u) => u.userId === user?.id); if (own) openStory(own); }}>
                <StoryAvatar src={profile?.avatar_url || undefined} fallback={(profile?.display_name || "V").slice(0, 2).toUpperCase()} hasNew />
                <span className="text-[10px] text-muted-foreground/50 font-medium">Meu story</span>
              </button>
            )}

            {/* Mock stories */}
            {displayMockStories && MOCK_STORIES.map((ms) => (
              <button key={ms.userId} className="flex flex-col items-center gap-1 min-w-[64px]" onClick={() => toast({ title: `Story de ${ms.displayName}`, description: "Conteúdo de demonstração" })}>
                <StoryAvatar src={ms.avatarUrl} fallback={ms.displayName.slice(0, 2).toUpperCase()} hasNew={ms.hasNew} />
                <span className="text-[10px] text-muted-foreground/50 truncate w-14 text-center font-medium">
                  {ms.username.length > 8 ? ms.username.slice(0, 8) + "…" : ms.username}
                </span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-0" />
        </ScrollArea>
      </div>

      {/* Story Viewer */}
      <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
        <DialogContent className="max-w-sm p-0 border-0 bg-black overflow-hidden rounded-3xl [&>button]:hidden">
          {viewingUser && currentStory && (
            <div className="relative w-full aspect-[9/16] bg-black">
              <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
                {viewingUser.stories.map((_, i) => (
                  <div key={i} className="flex-1 h-[2px] rounded-full bg-white/20 overflow-hidden">
                    <div className={cn("h-full rounded-full bg-white transition-all duration-300", i <= currentIndex ? "w-full" : "w-0")} />
                  </div>
                ))}
              </div>

              <div className="absolute top-7 left-3 right-3 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-white/30">
                    <AvatarImage src={viewingUser.avatarUrl} />
                    <AvatarFallback className="text-[10px] bg-white/10 text-white font-bold">{viewingUser.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-white text-xs font-semibold drop-shadow">{viewingUser.username}</span>
                  <span className="text-white/40 text-[10px]">
                    {formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <button onClick={() => setViewingUser(null)} className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="absolute inset-0 z-10 flex">
                <div className="w-1/3 h-full" onClick={prevStory} />
                <div className="w-1/3 h-full" />
                <div className="w-1/3 h-full" onClick={nextStory} />
              </div>

              {currentStory.mediaType === "video" ? (
                <video src={currentStory.mediaUrl} autoPlay playsInline muted className="w-full h-full object-cover" onEnded={nextStory} />
              ) : (
                <img src={currentStory.mediaUrl} alt="Story" className="w-full h-full object-cover" />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
