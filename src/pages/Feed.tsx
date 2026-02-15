import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { InstagramPost, PostData } from "@/components/feed/InstagramPost";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { CommentsSheet } from "@/components/feed/CommentsSheet";
import { StoriesBar } from "@/components/feed/StoriesBar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_FEED_POSTS } from "@/lib/mockData";

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
        if (!postsData || postsData.length === 0) {
          setPosts(MOCK_FEED_POSTS);
          setHasMore(false);
          return;
        }
        const enriched = await enrichPosts(postsData);
        // Merge real posts with mock affiliate posts for demo
        const combined = [...enriched, ...MOCK_FEED_POSTS];
        setPosts(combined);
        setHasMore(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to mock data on error
        setPosts(MOCK_FEED_POSTS);
        setHasMore(false);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [enrichPosts]
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

  const { containerRef, pullDistance, refreshing: pullRefreshing } = usePullToRefresh({
    onRefresh: async () => { await fetchPosts(true); },
  });

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createNotification = useCallback(async (targetUserId: string, type: string, postId: string) => {
    if (!user || user.id === targetUserId) return;
    try {
      await supabase.from("notifications").insert({
        user_id: targetUserId,
        actor_id: user.id,
        type,
        post_id: postId,
      });
    } catch { }
  }, [user]);

  const handleLike = async (postId: string, isLiked: boolean) => {
    // Allow mock likes without auth
    if (postId.startsWith("mock-")) {
      setPosts((prev) =>
        prev.map((p) => p.id === postId ? { ...p, isLiked: !isLiked, likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1 } : p)
      );
      return;
    }
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
    } catch { }
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

  const handleProfileClick = () => { };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-lg mx-auto overflow-auto hide-scrollbar">
      {/* Pull to refresh */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <Loader2
          className={`h-5 w-5 text-primary transition-transform ${pullRefreshing ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${pullDistance * 3}deg)` }}
        />
      </div>

      {/* Stories */}
      <StoriesBar />

      {/* Posts */}
      <div className="space-y-0">
        {posts.map((post, index) => (
          <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <InstagramPost
              post={post}
              onLike={() => handleLike(post.id, !!post.isLiked)}
              onComment={() => handleComment(post.id)}
              onShare={() => handleShare(post)}
              onSave={() => handleSave(post.id)}
              onFollow={handleFollow}
              onProfileClick={handleProfileClick}
            />
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-6 flex justify-center">
        {loadingMore && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
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
