import { useState, useEffect, useCallback, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X, Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

    // Group stories by user
    const grouped = new Map<string, StoryData[]>();
    for (const s of data) {
      const arr = grouped.get(s.user_id) || [];
      arr.push({
        id: s.id,
        mediaUrl: s.media_url,
        mediaType: s.media_type,
        createdAt: s.created_at,
      });
      grouped.set(s.user_id, arr);
    }

    const users: StoryUser[] = [];
    for (const [userId, stories] of grouped) {
      const p = profilesMap.get(userId);
      users.push({
        userId,
        username: p?.username || "user",
        displayName: p?.display_name || "Usuário",
        avatarUrl: p?.avatar_url || undefined,
        stories,
      });
    }

    // Put current user's stories first
    users.sort((a, b) => {
      if (a.userId === user?.id) return -1;
      if (b.userId === user?.id) return 1;
      return 0;
    });

    setStoryUsers(users);
  }, [user?.id]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "Máximo 50MB" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `stories/${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("post-media")
        .upload(path, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("post-media").getPublicUrl(path);
      const mediaType = file.type.startsWith("video") ? "video" : "image";

      const { error: insertError } = await supabase.from("stories").insert({
        user_id: user.id,
        media_url: urlData.publicUrl,
        media_type: mediaType,
      });

      if (insertError) throw insertError;

      toast({ title: "Story publicado!" });
      fetchStories();
    } catch (err) {
      console.error("Upload error:", err);
      toast({ variant: "destructive", title: "Erro ao publicar story" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openStory = (su: StoryUser) => {
    setViewingUser(su);
    setCurrentIndex(0);
    setViewedUserIds((prev) => new Set(prev).add(su.userId));
  };

  const nextStory = () => {
    if (!viewingUser) return;
    if (currentIndex < viewingUser.stories.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Move to next user
      const idx = storyUsers.findIndex((u) => u.userId === viewingUser.userId);
      if (idx < storyUsers.length - 1) {
        const next = storyUsers[idx + 1];
        setViewingUser(next);
        setCurrentIndex(0);
        setViewedUserIds((prev) => new Set(prev).add(next.userId));
      } else {
        setViewingUser(null);
      }
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const currentStory = viewingUser?.stories[currentIndex];
  const hasOwnStories = storyUsers.some((u) => u.userId === user?.id);

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleUpload}
      />

      <div className="border-b border-border bg-background">
        <ScrollArea className="w-full">
          <div className="flex gap-3 px-3 py-3">
            {/* Add story button */}
            {user && (
              <button
                className="flex flex-col items-center gap-1 min-w-[64px]"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <div className="relative rounded-full p-[2px]">
                  <Avatar className="h-14 w-14 border-2 border-background">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                      {(profile?.display_name || "V").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background">
                    {uploading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground">Seu Story</span>
              </button>
            )}

            {/* Story users */}
            {storyUsers
              .filter((su) => su.userId !== user?.id || hasOwnStories)
              .filter((su) => su.userId !== user?.id)
              .map((su) => {
                const hasNew = !viewedUserIds.has(su.userId);
                const initials = su.displayName.slice(0, 2).toUpperCase();

                return (
                  <button
                    key={su.userId}
                    className="flex flex-col items-center gap-1 min-w-[64px]"
                    onClick={() => openStory(su)}
                  >
                    <div
                      className={cn(
                        "relative rounded-full p-[2px]",
                        hasNew ? "bg-gradient-primary" : "bg-muted"
                      )}
                    >
                      <Avatar className="h-14 w-14 border-2 border-background">
                        <AvatarImage src={su.avatarUrl} alt={su.displayName} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-[11px] text-muted-foreground truncate w-16 text-center">
                      {su.username.length > 9 ? su.username.slice(0, 9) + "…" : su.username}
                    </span>
                  </button>
                );
              })}

            {/* Show own stories if they exist */}
            {hasOwnStories && (
              <button
                className="flex flex-col items-center gap-1 min-w-[64px]"
                onClick={() => {
                  const own = storyUsers.find((u) => u.userId === user?.id);
                  if (own) openStory(own);
                }}
              >
                <div className="relative rounded-full p-[2px] bg-gradient-primary">
                  <Avatar className="h-14 w-14 border-2 border-background">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-semibold">
                      {(profile?.display_name || "V").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-[11px] text-muted-foreground">Meu Story</span>
              </button>
            )}
          </div>
          <ScrollBar orientation="horizontal" className="h-0" />
        </ScrollArea>
      </div>

      {/* Story Viewer */}
      <Dialog open={!!viewingUser} onOpenChange={(open) => !open && setViewingUser(null)}>
        <DialogContent className="max-w-sm p-0 border-0 bg-black overflow-hidden rounded-2xl [&>button]:hidden">
          {viewingUser && currentStory && (
            <div className="relative w-full aspect-[9/16] bg-black">
              {/* Progress bars */}
              <div className="absolute top-2 left-2 right-2 z-20 flex gap-1">
                {viewingUser.stories.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full bg-white transition-all duration-300",
                        i < currentIndex ? "w-full" : i === currentIndex ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-white/50">
                    <AvatarImage src={viewingUser.avatarUrl} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {viewingUser.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold drop-shadow">
                      {viewingUser.username}
                    </span>
                    <span className="text-white/60 text-xs">
                      {formatDistanceToNow(new Date(currentStory.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                  </div>
                </div>
                <button onClick={() => setViewingUser(null)}>
                  <X className="h-6 w-6 text-white drop-shadow" />
                </button>
              </div>

              {/* Tap zones */}
              <div className="absolute inset-0 z-10 flex">
                <div className="w-1/3 h-full" onClick={prevStory} />
                <div className="w-1/3 h-full" />
                <div className="w-1/3 h-full" onClick={nextStory} />
              </div>

              {/* Media */}
              {currentStory.mediaType === "video" ? (
                <video
                  src={currentStory.mediaUrl}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  onEnded={nextStory}
                />
              ) : (
                <img
                  src={currentStory.mediaUrl}
                  alt="Story"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
