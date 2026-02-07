import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "./VerifiedBadge";
import { PerformanceBar } from "./PerformanceBar";
import { AffiliateButton } from "./AffiliateButton";
import { PostActions } from "./PostActions";
import { Heart, MessageCircle, Share2, Bookmark, UserPlus, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface PostData {
  id: string;
  content: string;
  postType: "text" | "image" | "video" | "result";
  mediaUrl?: string;
  thumbnailUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  userId: string;
  isLiked?: boolean;
  isSaved?: boolean;
  profile?: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    isVerified?: boolean;
    totalEarnings?: number;
  };
  performance?: number[]; // 7 days data
  affiliateLink?: {
    url: string;
    productName?: string;
    commission?: number;
  };
  resultData?: {
    amount: number;
    period: string;
    growth?: number;
  };
}

interface FullscreenPostProps {
  post: PostData;
  isActive: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
  onFollow: () => void;
  onProfileClick: () => void;
  className?: string;
}

export function FullscreenPost({
  post,
  isActive,
  onLike,
  onComment,
  onShare,
  onSave,
  onFollow,
  onProfileClick,
  className,
}: FullscreenPostProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive) {
      setShowContent(true);
      if (post.postType === "video" && videoRef.current) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, post.postType]);

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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

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

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `R$ ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `R$ ${(amount / 1000).toFixed(1)}K`;
    return `R$ ${amount.toFixed(2)}`;
  };

  return (
    <div
      className={cn(
        "relative h-full w-full flex flex-col",
        "bg-gradient-to-b from-background via-background to-muted/30",
        className
      )}
    >
      {/* Background Media */}
      {post.postType === "video" && post.mediaUrl && (
        <video
          ref={videoRef}
          src={post.mediaUrl}
          poster={post.thumbnailUrl}
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onClick={togglePlay}
        />
      )}

      {post.postType === "image" && post.mediaUrl && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${post.mediaUrl})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Video Controls */}
      {post.postType === "video" && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-black/30 text-white hover:bg-black/50"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Verified Result Banner */}
      {post.postType === "result" && post.resultData && (
        <div className="absolute top-1/4 left-0 right-0 flex justify-center z-10">
          <div className="bg-gradient-success text-success-foreground px-6 py-4 rounded-2xl shadow-lg animate-fade-in">
            <p className="text-center text-sm font-medium opacity-90 mb-1">
              Resultado verificado
            </p>
            <p className="text-center text-3xl font-bold">
              {formatAmount(post.resultData.amount)}
            </p>
            <p className="text-center text-sm opacity-80">
              em {post.resultData.period}
            </p>
            {post.resultData.growth && (
              <p className="text-center text-xs mt-2 font-medium">
                +{post.resultData.growth}% de crescimento
              </p>
            )}
          </div>
        </div>
      )}

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-4 z-10">
        {/* Profile Avatar with Follow */}
        <div className="relative" onClick={onProfileClick}>
          <Avatar className="h-12 w-12 ring-2 ring-white/50">
            <AvatarImage src={post.profile?.avatarUrl} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="default"
            size="icon"
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={(e) => {
              e.stopPropagation();
              onFollow();
            }}
          >
            <UserPlus className="h-3 w-3" />
          </Button>
        </div>

        {/* Like */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={onLike}
        >
          <div className={cn(
            "h-11 w-11 rounded-full flex items-center justify-center transition-all",
            post.isLiked 
              ? "bg-accent text-accent-foreground" 
              : "bg-white/20 text-white hover:bg-white/30"
          )}>
            <Heart className={cn("h-6 w-6", post.isLiked && "fill-current")} />
          </div>
          <span className="text-white text-xs font-medium">{post.likesCount}</span>
        </button>

        {/* Comment */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={onComment}
        >
          <div className="h-11 w-11 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-all">
            <MessageCircle className="h-6 w-6" />
          </div>
          <span className="text-white text-xs font-medium">{post.commentsCount}</span>
        </button>

        {/* Save */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={onSave}
        >
          <div className={cn(
            "h-11 w-11 rounded-full flex items-center justify-center transition-all",
            post.isSaved 
              ? "bg-primary text-primary-foreground" 
              : "bg-white/20 text-white hover:bg-white/30"
          )}>
            <Bookmark className={cn("h-6 w-6", post.isSaved && "fill-current")} />
          </div>
        </button>

        {/* Share */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={onShare}
        >
          <div className="h-11 w-11 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center transition-all">
            <Share2 className="h-6 w-6" />
          </div>
        </button>
      </div>

      {/* Bottom Content */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-16 p-4 z-10",
          "transform transition-all duration-500",
          showContent ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        )}
      >
        {/* Profile Info */}
        <div className="flex items-center gap-3 mb-3" onClick={onProfileClick}>
          <span className="text-white font-bold text-base">
            @{post.profile?.username || "user"}
          </span>
          {(post.profile?.isVerified || post.profile?.totalEarnings) && (
            <VerifiedBadge 
              earnings={post.profile.totalEarnings} 
              size="sm" 
            />
          )}
        </div>

        {/* Content */}
        <p className="text-white text-sm leading-relaxed mb-3 line-clamp-3">
          {post.content}
        </p>

        {/* Performance Bar */}
        {post.performance && post.performance.length > 0 && (
          <div className="mb-3">
            <PerformanceBar 
              data={post.performance} 
              className="text-white" 
            />
          </div>
        )}

        {/* Affiliate CTA */}
        {post.affiliateLink && (
          <AffiliateButton
            affiliateUrl={post.affiliateLink.url}
            productName={post.affiliateLink.productName}
            commission={post.affiliateLink.commission}
            className="mt-3"
          />
        )}

        {/* Timestamp */}
        <p className="text-white/60 text-xs mt-3">{timeAgo}</p>
      </div>
    </div>
  );
}
