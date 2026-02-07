import { Heart, MessageCircle, Share2, Bookmark, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const ActionButton = ({
    icon: Icon,
    count,
    isActive,
    activeClass,
    onClick,
    label,
  }: {
    icon: React.ElementType;
    count?: number;
    isActive?: boolean;
    activeClass?: string;
    onClick: () => void;
    label: string;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex gap-1.5 transition-all duration-200",
        vertical ? "flex-col h-auto py-2 px-3" : "flex-row h-9",
        isActive && activeClass
      )}
      onClick={onClick}
      aria-label={label}
    >
      <Icon
        className={cn(
          "transition-transform duration-200",
          vertical ? "h-6 w-6" : "h-5 w-5",
          isActive && "scale-110 fill-current"
        )}
      />
      {count !== undefined && (
        <span className={cn("text-xs font-medium", vertical && "text-[10px]")}>
          {formatCount(count)}
        </span>
      )}
    </Button>
  );

  return (
    <div
      className={cn(
        "flex items-center",
        vertical ? "flex-col gap-2" : "gap-1 w-full justify-between",
        className
      )}
    >
      <ActionButton
        icon={Heart}
        count={likesCount}
        isActive={isLiked}
        activeClass="text-accent"
        onClick={onLike}
        label="Curtir"
      />

      <ActionButton
        icon={MessageCircle}
        count={commentsCount}
        onClick={onComment}
        label="Comentar"
      />

      <ActionButton
        icon={Share2}
        onClick={onShare}
        label="Compartilhar"
      />

      {onSave && (
        <ActionButton
          icon={Bookmark}
          isActive={isSaved}
          activeClass="text-primary"
          onClick={onSave}
          label="Salvar"
        />
      )}

      {onFollow && !isFollowing && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full bg-primary text-primary-foreground hover:bg-primary/90",
            vertical ? "h-10 w-10" : "h-8 w-8"
          )}
          onClick={onFollow}
          aria-label="Seguir"
        >
          <UserPlus className={vertical ? "h-5 w-5" : "h-4 w-4"} />
        </Button>
      )}
    </div>
  );
}
