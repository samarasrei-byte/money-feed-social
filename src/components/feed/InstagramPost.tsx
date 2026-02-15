import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "./VerifiedBadge";
import { AffiliateButton } from "./AffiliateButton";
import { PostActions } from "./PostActions";
import { PostLabel, type PostLabelType } from "./PostLabel";
import { PublicMetrics } from "./PublicMetrics";
import { Play, Pause, Volume2, VolumeX, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface PostData {
  id: string;
  content: string;
  postType: "text" | "image" | "video";
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  userId: string;
  isLiked?: boolean;
  isSaved?: boolean;
  label?: PostLabelType | null;
  labelMetadata?: Record<string, any> | null;
  profile?: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
    totalEarnings?: number;
  };
  affiliateLink?: {
    url: string;
    productName?: string;
    commission?: number;
  };
}

interface InstagramPostProps {
  post: PostData;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  onFollow: () => void;
  onProfileClick: () => void;
}

export function InstagramPost({
  post,
  onLike,
  onComment,
  onShare,
  onSave,
  onFollow,
  onProfileClick,
}: InstagramPostProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const initials = (post.profile?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: false,
    locale: ptBR,
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDoubleTapLike = () => {
    if (!post.isLiked) {
      onLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const shouldTruncate = post.content.length > 120;

  return (
    <article className="bg-background border-b border-border/30">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div
          className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
          onClick={onProfileClick}
        >
          <div className="relative shrink-0">
            <div className="rounded-full p-[1.5px] bg-gradient-primary">
              <Avatar className="h-9 w-9 border-[2px] border-background">
                <AvatarImage src={post.profile?.avatarUrl} alt={post.profile?.displayName} />
                <AvatarFallback className="bg-muted text-foreground text-[10px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-[13px] truncate leading-tight">
                {post.profile?.username || "user"}
              </span>
              {(post.profile?.isVerified || post.profile?.totalEarnings) && (
                <VerifiedBadge
                  earnings={post.profile.totalEarnings}
                  size="sm"
                />
              )}
            </div>
            {post.label && (
              <span className="text-[10px] text-muted-foreground leading-tight">
                {post.label === "verified_result" && "Resultado Verificado"}
                {post.label === "active_offer" && "Oferta Ativa"}
                {post.label === "sponsored" && "Patrocinado"}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-muted-foreground">{timeAgo}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground"
            onClick={onFollow}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Post Label - inline pill */}
      {post.label && (
        <PostLabel
          label={post.label}
          metadata={post.labelMetadata || undefined}
        />
      )}

      {/* Media */}
      {post.postType === "image" && post.mediaUrl && !imageError && (
        <div
          className="relative w-full bg-muted/30 cursor-pointer"
          onDoubleClick={handleDoubleTapLike}
        >
          <img
            src={post.mediaUrl}
            alt="Post"
            className="w-full object-cover max-h-[560px]"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-ping" style={{ animationDuration: "0.6s", animationIterationCount: 1 }}>
                <svg viewBox="0 0 24 24" className="h-24 w-24 text-white drop-shadow-2xl fill-current">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {post.postType === "video" && post.mediaUrl && (
        <div
          className="relative w-full bg-foreground/5 cursor-pointer"
          onClick={togglePlay}
          onDoubleClick={handleDoubleTapLike}
        >
          <video
            ref={videoRef}
            src={post.mediaUrl}
            loop
            muted={isMuted}
            playsInline
            className="w-full object-cover max-h-[560px]"
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-foreground/20 backdrop-blur-md flex items-center justify-center">
                <Play className="h-6 w-6 text-background ml-0.5" />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-foreground/30 backdrop-blur-md text-background hover:bg-foreground/50"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </Button>
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="animate-ping" style={{ animationDuration: "0.6s", animationIterationCount: 1 }}>
                <svg viewBox="0 0 24 24" className="h-24 w-24 text-white drop-shadow-2xl fill-current">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text-only post */}
      {post.postType === "text" && (
        <div
          className="w-full px-5 py-8 min-h-[160px] flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5"
          onDoubleClick={handleDoubleTapLike}
        >
          <p className="text-center text-base font-medium leading-relaxed max-w-[280px] text-foreground">
            {post.content}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 pt-2.5">
        <PostActions
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
          isLiked={!!post.isLiked}
          isSaved={post.isSaved}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onSave={onSave}
        />
      </div>

      {/* Likes */}
      {post.likesCount > 0 && (
        <p className="px-4 pt-1 text-[13px] font-semibold">
          {post.likesCount.toLocaleString("pt-BR")} curtida{post.likesCount !== 1 && "s"}
        </p>
      )}

      {/* Caption */}
      {post.postType !== "text" && post.content && (
        <div className="px-4 pt-0.5 pb-0.5">
          <p className="text-[13px] leading-[18px]">
            <span className="font-semibold mr-1">{post.profile?.username}</span>
            {shouldTruncate && !expanded ? (
              <>
                {post.content.slice(0, 120)}
                <button
                  className="text-muted-foreground ml-1 text-[13px]"
                  onClick={() => setExpanded(true)}
                >
                  ...mais
                </button>
              </>
            ) : (
              post.content
            )}
          </p>
        </div>
      )}

      {/* Public Metrics */}
      {post.label && post.labelMetadata && (
        <PublicMetrics
          earnings={post.labelMetadata.amount}
          clicks={post.labelMetadata.clicks}
          views={post.labelMetadata.views}
        />
      )}

      {/* Affiliate CTA */}
      {post.affiliateLink && (
        <div className="px-4 py-1.5">
          <AffiliateButton
            affiliateUrl={post.affiliateLink.url}
            productName={post.affiliateLink.productName}
            commission={post.affiliateLink.commission}
          />
        </div>
      )}

      {/* Comments */}
      {post.commentsCount > 0 && (
        <button
          className="px-4 pb-1 text-[13px] text-muted-foreground"
          onClick={onComment}
        >
          Ver {post.commentsCount > 1 ? `todos os ${post.commentsCount} comentários` : `${post.commentsCount} comentário`}
        </button>
      )}

      <div className="h-1" />
    </article>
  );
}
