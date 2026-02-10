import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  profile?: {
    username: string;
    displayName: string;
    avatarUrl?: string;
  };
}

interface CommentsSheetProps {
  postId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentAdded?: (postId: string) => void;
}

export function CommentsSheet({ postId, open, onOpenChange, onCommentAdded }: CommentsSheetProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        setComments([]);
        return;
      }

      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url")
        .in("user_id", userIds);

      const profilesMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

      setComments(
        data.map((c) => {
          const p = profilesMap.get(c.user_id);
          return {
            id: c.id,
            content: c.content,
            createdAt: c.created_at,
            userId: c.user_id,
            profile: p
              ? {
                  username: p.username || "user",
                  displayName: p.display_name || "Usuário",
                  avatarUrl: p.avatar_url || undefined,
                }
              : undefined,
          };
        })
      );
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (open && postId) {
      fetchComments();
    } else {
      setComments([]);
      setNewComment("");
    }
  }, [open, postId, fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user || !postId) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      await fetchComments();
      onCommentAdded?.(postId);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Não foi possível comentar",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name?: string) =>
    (name || "U")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl flex flex-col p-0">
        <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
          <SheetTitle className="text-base">Comentários</SheetTitle>
        </SheetHeader>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-10">
              Nenhum comentário ainda. Seja o primeiro!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={comment.profile?.avatarUrl} />
                  <AvatarFallback className="text-xs bg-muted">
                    {getInitials(comment.profile?.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold mr-1.5">
                      {comment.profile?.username || "user"}
                    </span>
                    {comment.content}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        {user ? (
          <div className="border-t border-border px-4 py-3 flex items-center gap-2">
            <Input
              placeholder="Adicione um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
              className="flex-1"
              maxLength={300}
            />
            <Button
              size="icon"
              className="shrink-0"
              disabled={!newComment.trim() || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        ) : (
          <div className="border-t border-border px-4 py-3">
            <p className="text-center text-sm text-muted-foreground">
              Faça login para comentar
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
