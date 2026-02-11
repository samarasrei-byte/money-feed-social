import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "./VerifiedBadge";
import { AffiliateButton } from "./AffiliateButton";
import { PostActions } from "./PostActions";
import { PostLabel, type PostLabelType } from "./PostLabel";
import { PublicMetrics } from "./PublicMetrics";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement>(null);

  const initials = (post.profile?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
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
  };

  const shouldTruncate = post.content.length > 100;

  return (
    <article className="bg-card border-b border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div
          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
          onClick={onProfileClick}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/20 shrink-0">
            <AvatarImage src={post.profile?.avatarUrl} alt={post.profile?.displayName} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-sm truncate">
              {post.profile?.username || "user"}
            </span>
            {(post.profile?.isVerified || post.profile?.totalEarnings) && (
              <VerifiedBadge
                earnings={post.profile.totalEarnings}
                size="sm"
              />
            )}
            <span className="text-muted-foreground text-xs shrink-0">• {timeAgo}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary font-semibold text-xs shrink-0"
          onClick={onFollow}
        >
          Seguir
        </Button>
      </div>

      {/* Post Label */}
      {post.label && (
        <PostLabel
          label={post.label}
          metadata={post.labelMetadata || undefined}
        />
      )}

      {/* Media */}
      {post.postType === "image" && post.mediaUrl && !imageError && (
        <div
          className="relative w-full bg-muted aspect-square cursor-pointer"
          onDoubleClick={handleDoubleTapLike}
        >
          <img
            src={post.mediaUrl}
            alt="Post"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      {post.postType === "video" && post.mediaUrl && (
        <div
          className="relative w-full bg-muted aspect-square cursor-pointer"
          onClick={togglePlay}
          onDoubleClick={handleDoubleTapLike}
        >
          <video
            ref={videoRef}
            src={post.mediaUrl}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Play/Pause overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </div>
          )}
          {/* Mute button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Text-only post visual */}
      {post.postType === "text" && (
        <div
          className="w-full px-4 py-8 bg-gradient-to-br from-primary/5 to-accent/5 min-h-[200px] flex items-center justify-center"
          onDoubleClick={handleDoubleTapLike}
        >
          <p className="text-center text-lg font-medium leading-relaxed max-w-sm">
            {post.content}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-3 pt-2">
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
        <p className="px-3 pt-1 text-sm font-semibold">
          {post.likesCount.toLocaleString("pt-BR")} curtida{post.likesCount !== 1 && "s"}
        </p>
      )}

      {/* Caption (for image/video posts) */}
      {post.postType !== "text" && post.content && (
        <div className="px-3 pt-1 pb-1">
          <p className="text-sm">
            <span className="font-semibold mr-1">{post.profile?.username}</span>
            {shouldTruncate && !expanded ? (
              <>
                {post.content.slice(0, 100)}...{" "}
                <button
                  className="text-muted-foreground"
                  onClick={() => setExpanded(true)}
                >
                  mais
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
        <div className="px-3 py-1.5">
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
          className="px-3 pb-2 text-sm text-muted-foreground"
          onClick={onComment}
        >
          Ver todos os {post.commentsCount} comentários
        </button>
      )}

      <div className="h-1" />
    </article>
  );
}
