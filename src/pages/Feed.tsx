import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { FullscreenPost, PostData } from "@/components/feed/FullscreenPost";
import { CreatePostSheet } from "@/components/feed/CreatePostSheet";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Feed() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLoading(false);
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

      // Generate mock performance data for demo
      const generatePerformance = () => 
        Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));

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
          profile: postProfile ? {
            username: postProfile.username || "user",
            displayName: postProfile.display_name || "Usuário",
            avatarUrl: postProfile.avatar_url || undefined,
            isVerified: Math.random() > 0.5, // Demo
            totalEarnings: Math.random() > 0.6 ? Math.floor(Math.random() * 50000) : undefined,
          } : undefined,
          performance: Math.random() > 0.5 ? generatePerformance() : undefined,
          affiliateLink: Math.random() > 0.7 ? {
            url: "https://example.com/affiliate",
            productName: "Produto Exemplo",
            commission: Math.floor(Math.random() * 20) + 5,
          } : undefined,
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
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para curtir",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
      } else {
        await supabase.from("likes").insert({
          post_id: postId,
          user_id: user.id,
        });
      }

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                isLiked: !isLiked,
                likesCount: isLiked
                  ? post.likesCount - 1
                  : post.likesCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isSaved: !post.isSaved }
          : post
      )
    );
    toast({
      title: posts.find(p => p.id === postId)?.isSaved ? "Removido dos salvos" : "Salvo!",
    });
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

  const handleProfileClick = () => {
    // Navigate to profile
  };

  // Touch/Swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;

    if (isSwipeUp && currentIndex < posts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
    if (isSwipeDown && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Scroll handling for desktop
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    
    if (delta > 30 && currentIndex < posts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (delta < -30 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, posts.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" && currentIndex < posts.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === "ArrowUp" && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, posts.length]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-center">
          Nenhuma publicação ainda.
          <br />
          Seja o primeiro a postar!
        </p>
        {user && <CreatePostSheet onPostCreated={fetchPosts} />}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-8rem)] overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Posts Container */}
      <div
        className="h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {posts.map((post, index) => (
          <div key={post.id} className="h-full w-full">
            <FullscreenPost
              post={post}
              isActive={index === currentIndex}
              onLike={() => handleLike(post.id, !!post.isLiked)}
              onComment={handleComment}
              onShare={() => handleShare(post)}
              onSave={() => handleSave(post.id)}
              onFollow={handleFollow}
              onProfileClick={handleProfileClick}
            />
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20">
        {posts.slice(0, 10).map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-1 rounded-full transition-all duration-300",
              index === currentIndex
                ? "h-6 bg-primary"
                : "h-2 bg-white/30 hover:bg-white/50"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
        {posts.length > 10 && (
          <span className="text-white/50 text-xs text-center">+{posts.length - 10}</span>
        )}
      </div>

      {/* Create Post FAB */}
      {user && (
        <div className="absolute bottom-4 left-4 z-20">
          <CreatePostSheet onPostCreated={fetchPosts} />
        </div>
      )}
    </div>
  );
}
