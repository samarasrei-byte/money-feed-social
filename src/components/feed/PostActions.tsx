import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
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
  onLike,
  onComment,
  onShare,
  onSave,
  vertical = false,
  className,
}: PostActionsProps) {
  if (vertical) {
    return (
      <div className={cn("flex flex-col items-center gap-5", className)}>
        <button onClick={onLike} className="flex flex-col items-center gap-1 group" aria-label="Curtir">
          <Heart className={cn(
            "h-7 w-7 transition-all duration-200 group-active:scale-125",
            isLiked ? "fill-red-500 text-red-500" : "text-foreground"
          )} />
          {likesCount > 0 && <span className="text-[10px] font-semibold">{formatCount(likesCount)}</span>}
        </button>
        <button onClick={onComment} className="flex flex-col items-center gap-1 group" aria-label="Comentar">
          <MessageCircle className="h-7 w-7 group-active:scale-110 transition-transform" />
          {commentsCount > 0 && <span className="text-[10px] font-semibold">{formatCount(commentsCount)}</span>}
        </button>
        <button onClick={onShare} className="group" aria-label="Compartilhar">
          <Send className="h-7 w-7 group-active:scale-110 transition-transform" />
        </button>
        {onSave && (
          <button onClick={onSave} className="group" aria-label="Salvar">
            <Bookmark className={cn("h-7 w-7 group-active:scale-110 transition-transform", isSaved && "fill-foreground")} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        <button onClick={onLike} className="group" aria-label="Curtir">
          <Heart className={cn(
            "h-6 w-6 transition-all duration-200 group-active:scale-125",
            isLiked ? "fill-red-500 text-red-500" : "text-foreground hover:text-foreground/60"
          )} />
        </button>
        <button onClick={onComment} className="group" aria-label="Comentar">
          <MessageCircle className="h-6 w-6 text-foreground hover:text-foreground/60 transition-colors group-active:scale-110" />
        </button>
        <button onClick={onShare} className="group" aria-label="Compartilhar">
          <Send className="h-6 w-6 text-foreground hover:text-foreground/60 transition-colors group-active:scale-110" />
        </button>
      </div>
      {onSave && (
        <button onClick={onSave} className="group" aria-label="Salvar">
          <Bookmark className={cn(
            "h-6 w-6 transition-all duration-200 group-active:scale-110",
            isSaved ? "fill-foreground text-foreground" : "text-foreground hover:text-foreground/60"
          )} />
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
