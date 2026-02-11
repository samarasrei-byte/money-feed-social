import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { InstagramPost, PostData } from "@/components/feed/InstagramPost";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { CommentsSheet } from "@/components/feed/CommentsSheet";
import { StoriesBar } from "@/components/feed/StoriesBar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 15;

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const cursorRef = useRef<string | null>(null);

  const mapPosts = useCallback(
    (postsData: any[], profilesMap: Map<string, any>, likedPostIds: Set<string>): PostData[] =>
      postsData.map((post) => {
        const p = profilesMap.get(post.user_id);
        return {
          id: post.id,
          content: post.content,
          postType: post.post_type as "text" | "image" | "video",
          mediaUrl: post.media_url || undefined,
          likesCount: post.likes_count,
          commentsCount: post.comments_count,
          createdAt: post.created_at,
          userId: post.user_id,
          isLiked: likedPostIds.has(post.id),
          isSaved: false,
          label: (post as any).label || null,
          labelMetadata: (post as any).label_metadata || null,
          profile: p
            ? { username: p.username || "user", displayName: p.display_name || "Usuário", avatarUrl: p.avatar_url || undefined, isVerified: false }
            : undefined,
        };
      }),
    []
  );

  const enrichPosts = useCallback(
    async (postsData: any[]) => {
      const userIds = [...new Set(postsData.map((p) => p.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", userIds);
      const profilesMap = new Map(profilesData?.map((p) => [p.user_id, p]) || []);

      let likedPostIds = new Set<string>();
      if (user) {
        const postIds = postsData.map((p) => p.id);
        const { data: likes } = await supabase.from("likes").select("post_id").eq("user_id", user.id).in("post_id", postIds);
        likedPostIds = new Set(likes?.map((l) => l.post_id) || []);
      }
      return mapPosts(postsData, profilesMap, likedPostIds);
    },
    [user, mapPosts]
  );

  const fetchPosts = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      try {
        const { data: postsData, error } = await supabase
          .from("posts").select("*").order("created_at", { ascending: false }).limit(PAGE_SIZE);
        if (error) throw error;
        if (!postsData || postsData.length === 0) { setPosts([]); setHasMore(false); return; }
        const enriched = await enrichPosts(postsData);
        setPosts(enriched);
        setHasMore(postsData.length === PAGE_SIZE);
        cursorRef.current = postsData[postsData.length - 1].created_at;
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível carregar o feed" });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [enrichPosts, toast]
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !cursorRef.current) return;
    setLoadingMore(true);
    try {
      const { data: postsData, error } = await supabase
        .from("posts").select("*").order("created_at", { ascending: false }).lt("created_at", cursorRef.current).limit(PAGE_SIZE);
      if (error) throw error;
      if (!postsData || postsData.length === 0) { setHasMore(false); return; }
      const enriched = await enrichPosts(postsData);
      setPosts((prev) => [...prev, ...enriched]);
      setHasMore(postsData.length === PAGE_SIZE);
      cursorRef.current = postsData[postsData.length - 1].created_at;
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, enrichPosts]);

  const sentinelRef = useInfiniteScroll(loadMore, { enabled: hasMore && !loadingMore });

  // Pull to refresh
  const { containerRef, pullDistance, refreshing: pullRefreshing } = usePullToRefresh({
    onRefresh: async () => { await fetchPosts(true); },
  });

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Create notification helper
  const createNotification = useCallback(async (targetUserId: string, type: string, postId: string) => {
    if (!user || user.id === targetUserId) return;
    try {
      await supabase.from("notifications").insert({
        user_id: targetUserId,
        actor_id: user.id,
        type,
        post_id: postId,
      });
    } catch {}
  }, [user]);

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast({ title: "Faça login", description: "Você precisa estar logado para curtir" });
      return;
    }
    const post = posts.find((p) => p.id === postId);
    setPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, isLiked: !isLiked, likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1 } : p)
    );
    try {
      if (isLiked) {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
        if (post) createNotification(post.userId, "like", postId);
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) => p.id === postId ? { ...p, isLiked, likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1 } : p)
      );
    }
  };

  const handleSave = (postId: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p)));
  };

  const handleShare = async (post: PostData) => {
    const shareData = { title: `Post de @${post.profile?.username || "user"}`, text: post.content.slice(0, 100), url: window.location.origin + `/post/${post.id}` };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(shareData.url); toast({ title: "Link copiado!" }); }
    } catch {}
  };

  const handleComment = (postId: string) => setCommentsPostId(postId);

  const handleCommentAdded = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
    if (post) createNotification(post.userId, "comment", postId);
  };

  const handleFollow = () => {
    toast({ title: "Seguindo!", description: "Você começou a seguir este usuário" });
  };

  const handleProfileClick = () => {};

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-lg mx-auto pb-4 overflow-auto">
      {/* Pull to refresh indicator */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <Loader2
          className={`h-6 w-6 text-primary transition-transform ${pullRefreshing ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${pullDistance * 3}deg)` }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-3 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gradient-primary">Feed</h1>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => fetchPosts(true)} disabled={refreshing}>
          <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Stories */}
      <StoriesBar />

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground text-center">Nenhuma publicação ainda.<br />Seja o primeiro a postar!</p>
          {user && <CreatePostDialog onPostCreated={() => fetchPosts()} />}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <InstagramPost
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id, !!post.isLiked)}
              onComment={() => handleComment(post.id)}
              onShare={() => handleShare(post)}
              onSave={() => handleSave(post.id)}
              onFollow={handleFollow}
              onProfileClick={handleProfileClick}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-4 flex justify-center">
        {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        {!hasMore && posts.length > 0 && <p className="text-xs text-muted-foreground">Você viu tudo 🎉</p>}
      </div>

      {/* FAB */}
      {user && (
        <div className="fixed bottom-20 right-4 z-30 md:bottom-6">
          <CreatePostDialog onPostCreated={() => fetchPosts()} />
        </div>
      )}
      <CommentsSheet
        postId={commentsPostId}
        open={!!commentsPostId}
        onOpenChange={(open) => !open && setCommentsPostId(null)}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}
