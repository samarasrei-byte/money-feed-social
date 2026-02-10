import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { InstagramPost, PostData } from "@/components/feed/InstagramPost";
import { CreatePostDialog } from "@/components/feed/CreatePostDialog";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Feed() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      const userIds = [...new Set(postsData.map((p) => p.user_id))];

      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", userIds);

      const profilesMap = new Map(
        profilesData?.map((p) => [p.user_id, p]) || []
      );

      let likedPostIds = new Set<string>();
      if (user) {
        const { data: likes } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", user.id);
        likedPostIds = new Set(likes?.map((l) => l.post_id) || []);
      }

      const postsWithProfiles: PostData[] = postsData.map((post) => {
        const postProfile = profilesMap.get(post.user_id);
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
          profile: postProfile
            ? {
                username: postProfile.username || "user",
                displayName: postProfile.display_name || "Usuário",
                avatarUrl: postProfile.avatar_url || undefined,
                isVerified: false,
              }
            : undefined,
        };
      });

      setPosts(postsWithProfiles);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar o feed",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast({ title: "Faça login", description: "Você precisa estar logado para curtir" });
      return;
    }

    // Optimistic update
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !isLiked,
              likesCount: isLiked ? post.likesCount - 1 : post.likesCount + 1,
            }
          : post
      )
    );

    try {
      if (isLiked) {
        await supabase.from("likes").delete().eq("post_id", postId).eq("user_id", user.id);
      } else {
        await supabase.from("likes").insert({ post_id: postId, user_id: user.id });
      }
    } catch (error) {
      // Revert on error
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: isLiked,
                likesCount: isLiked ? post.likesCount + 1 : post.likesCount - 1,
              }
            : post
        )
      );
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, isSaved: !post.isSaved } : post
      )
    );
  };

  const handleShare = async (post: PostData) => {
    const shareData = {
      title: `Post de @${post.profile?.username || "user"}`,
      text: post.content.slice(0, 100),
      url: window.location.origin + `/post/${post.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link copiado!" });
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleComment = () => {
    toast({ title: "Em breve", description: "Comentários em desenvolvimento" });
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
    <div className="max-w-lg mx-auto pb-4">
      {/* Stories-like header / Refresh */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-3 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gradient-primary">Feed</h1>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => fetchPosts(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`h-5 w-5 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="text-muted-foreground text-center">
            Nenhuma publicação ainda.
            <br />
            Seja o primeiro a postar!
          </p>
          {user && <CreatePostDialog onPostCreated={() => fetchPosts()} />}
        </div>
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <InstagramPost
              key={post.id}
              post={post}
              onLike={() => handleLike(post.id, !!post.isLiked)}
              onComment={handleComment}
              onShare={() => handleShare(post)}
              onSave={() => handleSave(post.id)}
              onFollow={handleFollow}
              onProfileClick={handleProfileClick}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      {user && (
        <div className="fixed bottom-20 right-4 z-30 md:bottom-6">
          <CreatePostDialog onPostCreated={() => fetchPosts()} />
        </div>
      )}
    </div>
  );
}
