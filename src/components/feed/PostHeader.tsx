import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "./VerifiedBadge";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostHeaderProps {
  username: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string;
  verifiedEarnings?: number;
  isVerified?: boolean;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  compact?: boolean;
  className?: string;
}

export function PostHeader({
  username,
  displayName,
  avatarUrl,
  createdAt,
  verifiedEarnings,
  isVerified = false,
  onProfileClick,
  onMenuClick,
  compact = false,
  className,
}: PostHeaderProps) {
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={onProfileClick}
      >
        <Avatar className={cn(compact ? "h-8 w-8" : "h-11 w-11", "ring-2 ring-primary/20")}>
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold", compact ? "text-sm" : "text-base")}>
              {displayName}
            </span>
            {(isVerified || verifiedEarnings !== undefined) && (
              <VerifiedBadge 
                earnings={verifiedEarnings} 
                size={compact ? "sm" : "md"} 
              />
            )}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className={cn(compact ? "text-xs" : "text-sm")}>@{username}</span>
            <span className="text-xs">•</span>
            <span className={cn(compact ? "text-xs" : "text-sm")}>{timeAgo}</span>
          </div>
        </div>
      </div>

      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onMenuClick}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
