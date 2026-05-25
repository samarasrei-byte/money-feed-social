import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { InstagramPost, PostData } from "@/components/feed/InstagramPost";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { CommentsSheet } from "@/components/feed/CommentsSheet";
import { StoriesBar } from "@/components/feed/StoriesBar";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGamification } from "@/hooks/useGamification";
import { usePosts } from "@/hooks/usePosts";
import { useQueryClient } from "@tanstack/react-query";

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addPoints } = useGamification();
  const queryClient = useQueryClient();
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = usePosts(user?.id);

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts) || [];
  }, [data]);

  const sentinelRef = useInfiniteScroll(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, { enabled: hasNextPage && !isFetchingNextPage });

  const { containerRef, pullDistance, refreshing: pullRefreshing } = usePullToRefresh({
    onRefresh: async () => { 
      await refetch();
    },
  });

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
    if (!user) {
      toast({ title: "Faça login", description: "Você precisa estar logado para curtir" });
      return;
    }

    // Optimistic update could be done here with React Query's setQueryData
    // For now, keeping simple logic but triggering refetch or manual cache update
    try {
      if (isLiked) {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
        const post = posts.find(p => p.id === postId);
        if (post) createNotification(post.userId, "like", postId);
        addPoints("like", { post_id: postId });
      }
      
      // Update cache manually for speed
      queryClient.setQueryData(["posts", user?.id], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: any) => 
              p.id === postId 
                ? { ...p, isLiked: !isLiked, likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1 }
                : p
            )
          }))
        };
      });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleSave = (postId: string) => {
    queryClient.setQueryData(["posts", user?.id], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((p: any) => 
            p.id === postId ? { ...p, isSaved: !p.isSaved } : p
          )
        }))
      };
    });
  };

  const handleShare = async (post: PostData) => {
    const shareData = { 
      title: `Post de @${post.profile?.username || "user"}`, 
      text: post.content.slice(0, 100), 
      url: window.location.origin + `/post/${post.id}` 
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { 
        await navigator.clipboard.writeText(shareData.url); 
        toast({ title: "Link copiado!" }); 
      }
    } catch { }
  };

  const handleComment = (postId: string) => setCommentsPostId(postId);

  const handleCommentAdded = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (post) createNotification(post.userId, "comment", postId);
    addPoints("comment", { post_id: postId });
    
    queryClient.setQueryData(["posts", user?.id], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((p: any) => 
            p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
          )
        }))
      };
    });
  };

  const handleFollow = () => {
    toast({ title: "Seguindo!", description: "Você começou a seguir este usuário" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-primary/20" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-xl mx-auto overflow-auto hide-scrollbar w-full pt-2">
      {/* Pull to refresh */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <Loader2
          className={`h-4 w-4 text-primary/40 transition-transform ${pullRefreshing ? "animate-spin" : ""}`}
          style={{ transform: `rotate(${pullDistance * 3}deg)` }}
        />
      </div>

      <StoriesBar />
      <div className="h-px bg-border/30" />

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center px-6">
          <div className="h-20 w-20 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-2 shadow-premium">
            <Sparkles className="h-8 w-8 text-primary/40 animate-pulse" />
          </div>
          <h2 className="text-base font-black italic uppercase tracking-tighter">O Feed está Vazio</h2>
          <p className="text-xs text-muted-foreground/40 max-w-[200px] font-medium leading-relaxed">
            Seja o primeiro a publicar! Crie conteúdo e compartilhe com a comunidade.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {posts.map((post, index) => (
            <div key={post.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 20, 200)}ms` }}>
              <InstagramPost
                post={post}
                onLike={() => handleLike(post.id, !!post.isLiked)}
                onComment={() => handleComment(post.id)}
                onShare={() => handleShare(post)}
                onSave={() => handleSave(post.id)}
                onFollow={handleFollow}
                onProfileClick={() => {}}
              />
            </div>
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-12 flex justify-center">
        {isFetchingNextPage ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary/20" />
        ) : !hasNextPage && posts.length > 0 ? (
          <p className="text-[11px] text-muted-foreground/40 font-bold uppercase tracking-widest">Você viu tudo ✨</p>
        ) : null}
      </div>

      {user && (
        <div className="fixed bottom-20 right-4 z-30 md:bottom-6">
          <CreatePostDialog onPostCreated={() => { refetch(); addPoints("post"); }} />
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
