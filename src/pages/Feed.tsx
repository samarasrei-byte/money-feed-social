import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostProfile {
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

interface Post {
  id: string;
  content: string;
  post_type: string;
  media_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profile?: PostProfile | null;
  isLiked?: boolean;
}

export default function Feed() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // First fetch posts
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

      // Get unique user IDs
      const userIds = [...new Set(postsData.map((p) => p.user_id))];

      // Fetch profiles for those users
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", userIds);

      // Create a map for quick lookup
      const profilesMap = new Map(
        profilesData?.map((p) => [p.user_id, p]) || []
      );

      // Check which posts user has liked
      let likedPostIds = new Set<string>();
      if (user) {
        const { data: likes } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", user.id);

        likedPostIds = new Set(likes?.map((l) => l.post_id) || []);
      }

      // Combine data
      const postsWithProfiles: Post[] = postsData.map((post) => ({
        ...post,
        profile: profilesMap.get(post.user_id) || null,
        isLiked: likedPostIds.has(post.id),
      }));

      setPosts(postsWithProfiles);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !user) return;

    setIsPosting(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content: newPostContent.trim(),
          post_type: "text",
        })
        .select("*")
        .single();

      if (error) throw error;

      const newPost: Post = {
        ...data,
        profile: profile ? {
          username: profile.username,
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        } : null,
        isLiked: false,
      };

      setPosts([newPost, ...posts]);
      setNewPostContent("");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    if (!user) return;

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
                likes_count: isLiked
                  ? post.likes_count - 1
                  : post.likes_count + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const getInitials = (post: Post) => {
    const name = post.profile?.display_name || post.profile?.username;
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Create Post */}
      {user && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {profile?.display_name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <Textarea
                  placeholder="O que está acontecendo?"
                  className="min-h-[80px] resize-none border-0 bg-muted/50 focus-visible:ring-1"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" className="text-primary">
                    <Image className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || isPosting}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    {isPosting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Publicar"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhuma publicação ainda. Seja o primeiro a postar!
            </p>
          </CardContent>
        </Card>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="overflow-hidden animate-fade-in">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(post)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">
                      {post.profile?.display_name || post.profile?.username || "Usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{post.profile?.username || "user"} •{" "}
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pb-2">
              <p className="text-sm whitespace-pre-wrap">{post.content}</p>
              {post.media_url && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img
                    src={post.media_url}
                    alt="Post media"
                    className="w-full object-cover"
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-2 border-t">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2",
                    post.isLiked && "text-accent"
                  )}
                  onClick={() => handleLike(post.id, !!post.isLiked)}
                >
                  <Heart
                    className={cn("h-4 w-4", post.isLiked && "fill-current")}
                  />
                  <span className="text-xs">{post.likes_count}</span>
                </Button>

                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.comments_count}</span>
                </Button>

                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
