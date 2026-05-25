import { useState, useRef, memo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "./VerifiedBadge";
import { AffiliateButton } from "./AffiliateButton";
import { PostActions } from "./PostActions";
import { PostLabel, type PostLabelType } from "./PostLabel";
import { PublicMetrics } from "./PublicMetrics";
import { Play, Volume2, VolumeX, MoreHorizontal } from "lucide-react";
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

export const InstagramPost = memo(function InstagramPost({
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

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play().catch(() => {});
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleDoubleTapLike = useCallback(() => {
    if (!post.isLiked) onLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  }, [post.isLiked, onLike]);

  const shouldTruncate = post.content.length > 100;

  return (
    <article className="bg-background border-b border-border/10 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 cursor-pointer flex-1 min-w-0" onClick={onProfileClick}>
          <div className="relative shrink-0">
            <div className="rounded-full p-[1.5px] bg-gradient-to-br from-accent via-primary to-purple-500 shadow-glow">
              <Avatar className="h-9 w-9 border-2 border-background">
                <AvatarImage src={post.profile?.avatarUrl} alt={post.profile?.displayName} />
                <AvatarFallback className="bg-muted text-foreground text-[10px] font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[14px] tracking-tight truncate">
                {post.profile?.username || "user"}
              </span>
              {(post.profile?.isVerified || post.profile?.totalEarnings) && (
                <VerifiedBadge earnings={post.profile.totalEarnings} size="sm" />
              )}
              <span className="text-[10px] text-muted-foreground/30 font-medium">· {timeAgo}</span>
            </div>
            {post.label && (
              <span className="text-[9px] text-primary/60 leading-tight uppercase tracking-widest font-bold">
                {post.label === "verified_result" && "Resultado Verificado"}
                {post.label === "active_offer" && "Oferta Ativa"}
                {post.label === "sponsored" && "Patrocinado"}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-muted-foreground/30 hover:text-foreground hover:bg-muted/50"
          onClick={onFollow}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Label (Sticky or Contextual info) */}
      {post.label && (
        <div className="px-4 pb-2">
          <PostLabel label={post.label} metadata={post.labelMetadata || undefined} />
        </div>
      )}

      {/* Media Content */}
      <div className="relative w-full aspect-square sm:aspect-auto overflow-hidden bg-muted/5">
        {post.postType === "image" && post.mediaUrl && !imageError && (
          <div className="relative w-full h-full cursor-pointer" onDoubleClick={handleDoubleTapLike}>
            <img
              src={post.mediaUrl}
              alt="Post content"
              className="w-full object-contain max-h-[600px] mx-auto transition-opacity duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        )}

        {post.postType === "video" && post.mediaUrl && (
          <div className="relative w-full cursor-pointer aspect-video sm:aspect-auto flex items-center justify-center bg-black/5" onClick={togglePlay} onDoubleClick={handleDoubleTapLike}>
            <video 
              ref={videoRef} 
              src={post.mediaUrl} 
              loop 
              muted={isMuted} 
              playsInline 
              className="w-full object-contain max-h-[600px]" 
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-16 w-16 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="h-7 w-7 text-white fill-current ml-1" />
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 h-9 w-9 rounded-full bg-black/40 backdrop-blur-xl text-white hover:bg-black/60 border border-white/10"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Text-only Content */}
        {post.postType === "text" && (
          <div
            className="w-full px-8 py-14 min-h-[220px] flex items-center justify-center bg-gradient-to-br from-primary/[0.05] via-transparent to-accent/[0.05] relative overflow-hidden"
            onDoubleClick={handleDoubleTapLike}
          >
             <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
            <p className="text-center text-[17px] font-semibold leading-relaxed max-w-[320px] text-foreground/90 tracking-tight z-10">
              {post.content}
            </p>
          </div>
        )}

        {/* Heart animation for double tap */}
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-scale-in">
              <svg viewBox="0 0 24 24" className="h-24 w-24 text-primary drop-shadow-[0_0_30px_rgba(255,46,104,0.5)] fill-current">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Interactions and Info */}
      <div className="px-4">
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

        {/* Likes Count */}
        {post.likesCount > 0 && (
          <p className="pt-3 text-[14px] font-bold tracking-tight">
            {post.likesCount.toLocaleString("pt-BR")} curtida{post.likesCount !== 1 && "s"}
          </p>
        )}

        {/* Caption */}
        {post.postType !== "text" && post.content && (
          <div className="pt-1.5">
            <p className="text-[14px] leading-relaxed">
              <span className="font-bold mr-1.5">{post.profile?.username}</span>
              {shouldTruncate && !expanded ? (
                <>
                  <span className="text-foreground/90">{post.content.slice(0, 100)}</span>
                  <button className="text-muted-foreground/50 ml-1 font-medium hover:text-foreground transition-colors" onClick={() => setExpanded(true)}>
                    ...mais
                  </button>
                </>
              ) : (
                <span className="text-foreground/90">{post.content}</span>
              )}
            </p>
          </div>
        )}

        {/* Metrics Badge */}
        {post.label && post.labelMetadata && (
          <div className="mt-3">
            <PublicMetrics
              earnings={post.labelMetadata.amount}
              clicks={post.labelMetadata.clicks}
              views={post.labelMetadata.views}
            />
          </div>
        )}

        {/* Affiliate Link */}
        {post.affiliateLink && (
          <div className="mt-4">
            <AffiliateButton
              affiliateUrl={post.affiliateLink.url}
              productName={post.affiliateLink.productName}
              commission={post.affiliateLink.commission}
            />
          </div>
        )}

        {/* Comments Link */}
        {post.commentsCount > 0 && (
          <button className="mt-2 text-[12.5px] text-muted-foreground/50 font-medium hover:text-muted-foreground transition-colors" onClick={onComment}>
            Ver {post.commentsCount > 1 ? `todos os ${post.commentsCount} comentários` : `${post.commentsCount} comentário`}
          </button>
        )}
      </div>
    </article>
  );
});

InstagramPost.displayName = "InstagramPost";