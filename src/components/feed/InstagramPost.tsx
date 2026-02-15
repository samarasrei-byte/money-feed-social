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
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
  };

  const shouldTruncate = post.content.length > 120;

  return (
    <article className="bg-background">
      {/* Header — ultra clean */}
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
          onClick={onProfileClick}
        >
          <div className="relative">
            <div className="rounded-full p-[2px] bg-gradient-primary">
              <Avatar className="h-8 w-8 border-2 border-background">
                <AvatarImage src={post.profile?.avatarUrl} alt={post.profile?.displayName} />
                <AvatarFallback className="bg-muted text-foreground text-[11px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-[13px] truncate">
              {post.profile?.username || "user"}
            </span>
            {(post.profile?.isVerified || post.profile?.totalEarnings) && (
              <VerifiedBadge
                earnings={post.profile.totalEarnings}
                size="sm"
              />
            )}
            <span className="text-muted-foreground text-xs">• {timeAgo}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-foreground"
          onClick={onFollow}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post Label */}
      {post.label && (
        <PostLabel
          label={post.label}
          metadata={post.labelMetadata || undefined}
        />
      )}

      {/* Media — edge to edge */}
      {post.postType === "image" && post.mediaUrl && !imageError && (
        <div
          className="relative w-full bg-black/5 cursor-pointer"
          onDoubleClick={handleDoubleTapLike}
        >
          <img
            src={post.mediaUrl}
            alt="Post"
            className="w-full object-cover max-h-[600px]"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {/* Double-tap heart animation */}
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
              <svg viewBox="0 0 24 24" className="h-20 w-20 text-white drop-shadow-lg fill-current animate-ping" style={{ animationDuration: "0.6s", animationIterationCount: 1 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {post.postType === "video" && post.mediaUrl && (
        <div
          className="relative w-full bg-black cursor-pointer"
          onClick={togglePlay}
          onDoubleClick={handleDoubleTapLike}
        >
          <video
            ref={videoRef}
            src={post.mediaUrl}
            loop
            muted={isMuted}
            playsInline
            className="w-full object-cover max-h-[600px]"
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                <Play className="h-6 w-6 text-white ml-0.5" />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-3 right-3 h-7 w-7 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </Button>
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fade-in">
              <svg viewBox="0 0 24 24" className="h-20 w-20 text-white drop-shadow-lg fill-current animate-ping" style={{ animationDuration: "0.6s", animationIterationCount: 1 }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Text-only post */}
      {post.postType === "text" && (
        <div
          className="w-full px-4 py-10 min-h-[180px] flex items-center justify-center"
          onDoubleClick={handleDoubleTapLike}
        >
          <p className="text-center text-lg font-medium leading-relaxed max-w-sm">
            {post.content}
          </p>
        </div>
      )}

      {/* Actions — Instagram style */}
      <div className="px-4 pt-3">
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

      {/* Likes count */}
      {post.likesCount > 0 && (
        <p className="px-4 pt-1.5 text-[13px] font-semibold">
          {post.likesCount.toLocaleString("pt-BR")} curtida{post.likesCount !== 1 && "s"}
        </p>
      )}

      {/* Caption */}
      {post.postType !== "text" && post.content && (
        <div className="px-4 pt-1 pb-0.5">
          <p className="text-[13px] leading-[18px]">
            <span className="font-semibold mr-1.5">{post.profile?.username}</span>
            {shouldTruncate && !expanded ? (
              <>
                {post.content.slice(0, 120)}
                <button
                  className="text-muted-foreground ml-1"
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

      {/* Public Metrics for labeled posts */}
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

      {/* Comments link */}
      {post.commentsCount > 0 && (
        <button
          className="px-4 pb-1 text-[13px] text-muted-foreground"
          onClick={onComment}
        >
          Ver todos os {post.commentsCount} comentários
        </button>
      )}

      <div className="h-2" />
    </article>
  );
}
