import { Heart, MessageCircle, Send, Bookmark, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isSaved?: boolean;
  isFollowing?: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave?: () => void;
  onFollow?: () => void;
  vertical?: boolean;
  className?: string;
}

export function PostActions({
  likesCount,
  commentsCount,
  isLiked,
  isSaved = false,
  isFollowing = false,
  onLike,
  onComment,
  onShare,
  onSave,
  onFollow,
  vertical = false,
  className,
}: PostActionsProps) {
  if (vertical) {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        <button onClick={onLike} className="flex flex-col items-center gap-1" aria-label="Curtir">
          <Heart className={cn("h-7 w-7 transition-transform active:scale-125", isLiked && "fill-accent text-accent")} />
          {likesCount > 0 && <span className="text-[11px] font-medium">{formatCount(likesCount)}</span>}
        </button>
        <button onClick={onComment} className="flex flex-col items-center gap-1" aria-label="Comentar">
          <MessageCircle className="h-7 w-7" />
          {commentsCount > 0 && <span className="text-[11px] font-medium">{formatCount(commentsCount)}</span>}
        </button>
        <button onClick={onShare} aria-label="Compartilhar">
          <Send className="h-7 w-7" />
        </button>
        {onSave && (
          <button onClick={onSave} aria-label="Salvar">
            <Bookmark className={cn("h-7 w-7", isSaved && "fill-current")} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-3.5">
        <button
          onClick={onLike}
          className="active:scale-110 transition-transform"
          aria-label="Curtir"
        >
          <Heart
            className={cn(
              "h-[22px] w-[22px] transition-all",
              isLiked ? "fill-destructive text-destructive scale-105" : "hover:text-muted-foreground"
            )}
          />
        </button>
        <button onClick={onComment} className="active:scale-110 transition-transform" aria-label="Comentar">
          <MessageCircle className="h-[22px] w-[22px] hover:text-muted-foreground transition-colors" />
        </button>
        <button onClick={onShare} className="active:scale-110 transition-transform" aria-label="Compartilhar">
          <Send className="h-[22px] w-[22px] hover:text-muted-foreground transition-colors" />
        </button>
      </div>
      {onSave && (
        <button onClick={onSave} className="active:scale-110 transition-transform" aria-label="Salvar">
          <Bookmark className={cn("h-[22px] w-[22px] transition-all", isSaved && "fill-foreground")} />
        </button>
      )}
    </div>
  );
}

function formatCount(count: number) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}
