import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ChevronUp, 
  ChevronDown, 
  Star,
  Zap,
  Flame,
  CheckCircle2,
  ExternalLink,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ProductVideo {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  videoUrl: string;
  description: string;
  brand: {
    name: string;
    avatarUrl?: string;
    isVerified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    rating: number;
  };
}

const MOCK_VIDEOS: ProductVideo[] = [
  {
    id: "1",
    name: "Sérum Facial Vitamina C 30%",
    price: 89.90,
    originalPrice: 149.90,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-skin-care-routine-of-a-woman-44288-large.mp4",
    description: "Pele radiante em 7 dias com a tecnologia Only Lab. Antioxidante potente que clareia manchas e uniformiza o tom da pele.",
    brand: {
      name: "Only Lab Beauty",
      avatarUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
      isVerified: true
    },
    stats: { likes: 12400, comments: 842, shares: 1200, rating: 4.9 }
  },
  {
    id: "2",
    name: "Fone Noise Cancelling Pro",
    price: 499.00,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-listening-to-music-with-headphones-while-exercising-32145-large.mp4",
    description: "Imersão total. 40h de bateria e cancelamento de ruído ativo. O som que você merece, onde estiver.",
    brand: {
      name: "Sonic Tech",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      isVerified: true
    },
    stats: { likes: 8900, comments: 456, shares: 780, rating: 4.8 }
  },
  {
    id: "3",
    name: "Tênis Runner Speed X",
    price: 299.90,
    originalPrice: 450.00,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-running-on-the-street-4330-large.mp4",
    description: "Leveza e propulsão. Desenvolvido para quebrar recordes pessoais. Conforto extremo para maratonas.",
    brand: {
      name: "Active Gear",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      isVerified: false
    },
    stats: { likes: 15600, comments: 1200, shares: 2300, rating: 4.7 }
  }
];

function OnlyShopCard({
  video,
  isActive,
  onLike,
  onShare,
}: {
  video: ProductVideo;
  isActive: boolean;
  onLike: () => void;
  onShare: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showLikeHeart, setShowLikeHeart] = useState(false);
  const lastTapRef = useRef(0);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive && !paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive, paused]);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setShowLikeHeart(true);
      onLike();
      setTimeout(() => setShowLikeHeart(false), 800);
    } else {
      setPaused((p) => !p);
    }
    lastTapRef.current = now;
  };

  const discount = video.originalPrice
    ? Math.round((1 - video.price / video.originalPrice) * 100)
    : 0;

  return (
    <div className="relative h-full w-full snap-start snap-always bg-black overflow-hidden flex items-center justify-center">
      {/* Video */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="absolute inset-0 h-full w-full object-cover sm:rounded-[2.5rem] sm:max-w-md sm:mx-auto"
        loop
        muted={muted}
        playsInline
        onClick={handleTap}
        poster={video.imageUrl}
      />

      {/* Overlays */}
      <div className="absolute inset-0 sm:max-w-md sm:mx-auto sm:rounded-[2.5rem] bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Double tap heart */}
      <AnimatePresence>
        {showLikeHeart && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            className="absolute z-30 pointer-events-none"
          >
            <Heart className="h-24 w-24 text-primary fill-primary drop-shadow-[0_0_20px_rgba(255,46,104,0.5)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar Info (Bottom) */}
      <div className="absolute bottom-6 left-4 right-20 z-20 space-y-4 sm:max-w-[calc(theme(maxWidth.md)-5rem)] sm:ml-[calc(50%-theme(maxWidth.md)/2)]">
        {/* Brand */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-primary p-[1px] bg-background">
              <AvatarImage src={video.brand.avatarUrl} />
              <AvatarFallback className="bg-muted text-[10px]">{video.brand.name[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center border-2 border-black">
              <Plus className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-white drop-shadow-md">{video.brand.name}</span>
              {video.brand.isVerified && <CheckCircle2 className="h-3 w-3 text-[#20D5EC]" />}
            </div>
            <p className="text-[10px] text-white/60 font-medium">Ver perfil oficial</p>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tighter italic drop-shadow-xl">{video.name}</h3>
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed font-medium drop-shadow-sm">
            {video.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 flex flex-col items-center">
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Preço</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white italic">R$ {video.price.toFixed(2)}</span>
              {discount > 0 && (
                <span className="text-[10px] text-primary font-black animate-pulse">-{discount}%</span>
              )}
            </div>
          </div>
          <Button className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 border-0 shadow-lg shadow-primary/20 text-sm font-bold italic uppercase tracking-tighter">
            Comprar Agora
            <ShoppingBag className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6 z-20 sm:mr-[calc(50%-theme(maxWidth.md)/2)]">
        <button onClick={onLike} className="flex flex-col items-center gap-1 tap">
          <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group active:scale-90 transition-all">
            <Heart className="h-6 w-6 text-white group-hover:text-primary transition-colors" />
          </div>
          <span className="text-[10px] text-white font-black tracking-tighter drop-shadow-md">{video.stats.likes >= 1000 ? `${(video.stats.likes / 1000).toFixed(1)}K` : video.stats.likes}</span>
        </button>

        <button className="flex flex-col items-center gap-1 tap">
          <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center active:scale-90 transition-all">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <span className="text-[10px] text-white font-black tracking-tighter drop-shadow-md">{video.stats.comments}</span>
        </button>

        <button onClick={onShare} className="flex flex-col items-center gap-1 tap">
          <div className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center active:scale-90 transition-all">
            <Share2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-[10px] text-white font-black tracking-tighter drop-shadow-md">Enviar</span>
        </button>

        <button onClick={() => setMuted(!muted)} className="tap">
          <div className="h-10 w-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-90 transition-all">
            {muted ? <VolumeX className="h-5 w-5 text-white/50" /> : <Volume2 className="h-5 w-5 text-white" />}
          </div>
        </button>
      </div>

      {/* Badges */}
      <div className="absolute top-6 left-4 z-20 flex gap-2 sm:ml-[calc(50%-theme(maxWidth.md)/2)]">
        <Badge className="bg-primary/90 text-white border-0 text-[10px] font-black uppercase italic tracking-tighter px-3 h-6">
          <Zap className="h-3 w-3 mr-1 fill-white" />
          Oferta Flash
        </Badge>
        <Badge className="bg-black/40 backdrop-blur-md text-white/80 border border-white/10 text-[10px] font-black uppercase italic tracking-tighter px-3 h-6">
          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
          {video.stats.rating}
        </Badge>
      </div>

      {/* Progress Bar (Simulated) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 sm:max-w-md sm:mx-auto">
        <motion.div
          initial={{ width: "0%" }}
          animate={isActive ? { width: "100%" } : { width: "0%" }}
          transition={{ duration: 15, ease: "linear" }}
          className="h-full bg-primary shadow-[0_0_10px_#ff2e68]"
        />
      </div>
    </div>
  );
}

export default function OnlyShop() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      if (index !== activeIndex) setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copiado!", description: "Compartilhe essa oferta com seus amigos." });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* App Staircase Background (Investor Presentation Feel) */}
      <div className="hidden lg:block fixed inset-0 z-0 bg-[#050505]">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30 L60 30 L60 60 L30 60 Z' fill='%23333' fill-opacity='0.4'/%3E%3C/svg%3E\")" }} />
        
        {/* Futuristic Grid */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: `linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)`,
               backgroundSize: '80px 80px' 
             }} 
        />

        {/* Floating Decorative App Screens */}
        {[
          { color: "from-primary/20", rotate: -15, x: "left-24", y: "top-1/2" },
          { color: "from-accent/20", rotate: 15, x: "right-24", y: "top-1/3" },
          { color: "from-purple-500/20", rotate: -5, x: "left-[20%]", y: "bottom-20" },
        ].map((screen, i) => (
          <div key={i} className={`absolute ${screen.y} ${screen.x} -translate-y-1/2 opacity-30 scale-75 blur-[2px] select-none pointer-events-none`} style={{ transform: `translateY(-50%) rotate(${screen.rotate}deg)` }}>
            <div className={`w-[320px] h-[640px] bg-card rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl`}>
              <div className={`h-full w-full bg-gradient-to-b ${screen.color} to-transparent`} />
            </div>
          </div>
        ))}
        
        {/* Marketing Text for Investors */}
        <div className="absolute top-12 left-12 max-w-xs space-y-4">
          <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-[0.3em] font-black text-[10px]">Interface Proprietária</Badge>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/80">O Shopping <br /> Vertical</h2>
          <p className="text-sm text-white/30 font-bold leading-relaxed">
            Experiência imersiva otimizada para conversão instantânea. Onde o entretenimento encontra o lucro.
          </p>
        </div>
      </div>

      {/* Main App Feed */}
      <div 
        ref={containerRef}
        className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {MOCK_VIDEOS.map((video, i) => (
          <div key={video.id} className="h-full w-full">
            <OnlyShopCard
              video={video}
              isActive={i === activeIndex}
              onLike={() => {}}
              onShare={handleShare}
            />
          </div>
        ))}

        {/* Floating Home Link */}
        <button 
          onClick={() => window.history.back()}
          className="fixed top-6 right-6 z-[70] h-10 w-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white tap"
        >
          <Plus className="h-5 w-5 rotate-45" />
        </button>
      </div>
    </div>
  );
}
