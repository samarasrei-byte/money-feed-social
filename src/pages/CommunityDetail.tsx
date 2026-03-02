import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowLeft,
  Users,
  Crown,
  Send,
  Loader2,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Lock,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

const PAGE_SIZE = 15;

interface CommunityPost {
  id: string;
  content: string;
  media_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  isLiked: boolean;
  profile?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [community, setCommunity] = useState<any>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const cursorRef = useRef<string | null>(null);

  // Fetch community info and check access for course-linked communities
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("communities")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;

        const { data: profile } = await supabase
          .from("profiles")
          .select("user_id, username, display_name, avatar_url")
          .eq("user_id", data.creator_id)
          .single();

        const communityData = { ...data, creator: profile } as any;
        setCommunity(communityData);

        // If course-linked and private, check enrollment
        if (communityData.course_id && communityData.is_private && user) {
          const { data: enrollment } = await supabase
            .from("course_enrollments")
            .select("id")
            .eq("course_id", communityData.course_id)
            .eq("user_id", user.id)
            .maybeSingle();

          if (!enrollment && communityData.creator_id !== user.id) {
            setAccessDenied(true);
          } else {
            // Auto-join member if enrolled but not a member
            const { data: membership } = await supabase
              .from("community_members")
              .select("id")
              .eq("community_id", id)
              .eq("user_id", user.id)
              .maybeSingle();
            if (!membership) {
              await supabase.from("community_members").insert({
                community_id: id,
                user_id: user.id,
              });
            }
          }
        } else if (communityData.course_id && communityData.is_private && !user) {
          setAccessDenied(true);
        }
      } catch {
        toast({ variant: "destructive", title: "Comunidade não encontrada" });
        navigate("/communities");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate, toast, user]);

  const enrichPosts = useCallback(
    async (postsData: any[]) => {
      const userIds = [...new Set(postsData.map((p) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", userIds);
      const profilesMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      let likedIds = new Set<string>();
      if (user) {
        const postIds = postsData.map((p) => p.id);
        const { data: likes } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", postIds);
        likedIds = new Set(likes?.map((l) => l.post_id) || []);
      }

      return postsData.map((p) => ({
        id: p.id,
        content: p.content,
        media_url: p.media_url,
        likes_count: p.likes_count,
        comments_count: p.comments_count,
        created_at: p.created_at,
        user_id: p.user_id,
        isLiked: likedIds.has(p.id),
        profile: profilesMap.get(p.user_id) || undefined,
      }));
    },
    [user]
  );

  const fetchPosts = useCallback(async () => {
    if (!id) return;
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("community_id", id)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);
      if (error) throw error;
      if (!data || data.length === 0) { setPosts([]); setHasMore(false); return; }
      const enriched = await enrichPosts(data);
      setPosts(enriched);
      setHasMore(data.length === PAGE_SIZE);
      cursorRef.current = data[data.length - 1].created_at;
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  }, [id, enrichPosts]);

  useEffect(() => { if (!loading) fetchPosts(); }, [loading, fetchPosts]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursorRef.current || !id) return;
    setLoadingMore(true);
    try {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("community_id", id)
        .order("created_at", { ascending: false })
        .lt("created_at", cursorRef.current)
        .limit(PAGE_SIZE);
      if (!data || data.length === 0) { setHasMore(false); return; }
      const enriched = await enrichPosts(data);
      setPosts((prev) => [...prev, ...enriched]);
      setHasMore(data.length === PAGE_SIZE);
      cursorRef.current = data[data.length - 1].created_at;
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, id, enrichPosts]);

  const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore && !loadingMore });

  // Pull to refresh
  const { containerRef, pullDistance, refreshing } = usePullToRefresh({
    onRefresh: async () => { await fetchPosts(); },
  });

  const handlePost = async () => {
    if (!newPost.trim() || !user || !id) return;
    setPosting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        content: newPost.trim(),
        user_id: user.id,
        community_id: id,
      } as any);
      if (error) throw error;
      setNewPost("");
      await fetchPosts();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !isLiked, likes_count: isLiked ? p.likes_count - 1 : p.likes_count + 1 }
          : p
      )
    );
    try {
      if (isLiked) {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, isLiked, likes_count: isLiked ? p.likes_count + 1 : p.likes_count - 1 }
            : p
        )
      );
    }
  };

  const getInitials = (name?: string) =>
    (name || "U").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto space-y-4 px-4 pt-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="font-bold text-lg">Comunidade Exclusiva</h2>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
          Esta comunidade é exclusiva para alunos matriculados no curso. Matricule-se para ter acesso.
        </p>
        {community?.course_id && (
          <Button
            className="mt-6 bg-gradient-primary border-0 text-primary-foreground rounded-full px-6"
            onClick={() => navigate(`/courses/${community.course_id}`)}
          >
            <GraduationCap className="h-4 w-4 mr-2" /> Ver Curso
          </Button>
        )}
        <Button variant="ghost" className="mt-2 text-xs" onClick={() => navigate("/communities")}>
          Voltar para comunidades
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-lg mx-auto pb-20 overflow-auto">
      {/* Pull to refresh */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <Loader2
          className={`h-5 w-5 text-primary transition-transform ${refreshing ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${pullDistance * 3}deg)` }}
        />
      </div>

      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => {
          if (community?.course_id) navigate(`/courses/${community.course_id}`);
          else navigate("/communities");
        }}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-[15px] truncate">{community?.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-muted-foreground">{community?.members_count} membros</p>
            {community?.course_id && (
              <span className="text-[10px] text-primary flex items-center gap-0.5">
                <GraduationCap className="h-3 w-3" /> Curso
              </span>
            )}
          </div>
        </div>
        {(community as any)?.rules && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setShowRules(true)}>
            <BookOpen className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Community Header */}
      <div className="px-4 py-4 border-b border-border">
        {community?.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{community.description}</p>
        )}
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {community?.members_count} membros
          </span>
          {community?.creator && (
            <span className="flex items-center gap-1">
              <Crown className="h-3.5 w-3.5" />
              @{community.creator.username}
            </span>
          )}
        </div>
      </div>

      {/* Post Composer */}
      {user && (
        <div className="px-4 py-3 border-b border-border flex items-center gap-2">
          <Input
            placeholder="Compartilhe algo com a comunidade..."
            className="flex-1 h-10 rounded-xl bg-muted border-0 text-sm"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handlePost()}
            maxLength={500}
          />
          <Button
            size="icon"
            className="h-10 w-10 rounded-xl bg-gradient-primary border-0 shrink-0"
            disabled={!newPost.trim() || posting}
            onClick={handlePost}
          >
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Posts Feed */}
      {loadingPosts ? (
        <div className="space-y-3 px-4 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Nenhuma publicação</p>
          <p className="text-xs text-muted-foreground mt-1">Seja o primeiro a postar nesta comunidade!</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="px-4 py-4 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={post.profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-muted">
                    {getInitials(post.profile?.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {post.profile?.display_name || "Usuário"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    @{post.profile?.username || "user"} ·{" "}
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{post.content}</p>
              {post.media_url && (
                <img src={post.media_url} alt="" className="rounded-xl w-full max-h-80 object-cover" loading="lazy" />
              )}
              <div className="flex items-center gap-5">
                <button
                  onClick={() => handleLike(post.id, post.isLiked)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors active:scale-95"
                >
                  <Heart className={cn("h-4 w-4 transition-colors", post.isLiked && "fill-primary text-primary")} />
                  <span className={cn(post.isLiked && "text-primary font-medium")}>{post.likes_count}</span>
                </button>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  {post.comments_count}
                </span>
                <button
                  className="flex items-center gap-1.5 text-xs text-muted-foreground active:scale-95"
                  onClick={async () => {
                    try { await navigator.clipboard.writeText(window.location.href); toast({ title: "Link copiado!" }); } catch {}
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="py-4 flex justify-center">
        {loadingMore && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
        {!hasMore && posts.length > 0 && <p className="text-[11px] text-muted-foreground">Você viu tudo 🎉</p>}
      </div>

      <Sheet open={showRules} onOpenChange={setShowRules}>
        <SheetContent side="bottom" className="h-[50vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle>Regras da Comunidade</SheetTitle>
          </SheetHeader>
          <div className="py-4 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {(community as any)?.rules || "Nenhuma regra definida ainda."}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
