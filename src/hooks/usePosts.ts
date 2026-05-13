import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostData } from "@/components/feed/InstagramPost";

const PAGE_SIZE = 10;

export function usePosts(currentUserId: string | undefined) {
  return useInfiniteQuery({
    queryKey: ["posts", currentUserId],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profile:profiles(user_id, username, display_name, avatar_url),
          likes(user_id)
        `)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      if (pageParam) {
        query = query.lt("created_at", pageParam);
      }

      const { data, error } = await query;

      if (error) throw error;

      const mappedPosts: PostData[] = (data || []).map((post: any) => ({
        id: post.id,
        content: post.content,
        postType: post.post_type as "text" | "image" | "video",
        mediaUrl: post.media_url || undefined,
        likesCount: post.likes_count,
        commentsCount: post.comments_count,
        createdAt: post.created_at,
        userId: post.user_id,
        isLiked: currentUserId ? post.likes?.some((l: any) => l.user_id === currentUserId) : false,
        isSaved: false,
        label: post.label || null,
        labelMetadata: post.label_metadata || null,
        profile: post.profile ? {
          username: post.profile.username || "user",
          displayName: post.profile.display_name || "Usuário",
          avatarUrl: post.profile.avatar_url || undefined,
          isVerified: false
        } : undefined,
      }));

      return {
        posts: mappedPosts,
        nextCursor: data?.length === PAGE_SIZE ? data[data.length - 1].created_at : null,
      };
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}