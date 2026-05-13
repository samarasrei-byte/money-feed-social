import { useState, useEffect } from "react";
import { 
  ChevronRight, ChevronLeft, Rocket, Users, Target, BarChart3, 
  DollarSign, Shield, Zap, TrendingUp, Sparkles, Star, 
  ArrowRight, Globe, MessageCircle, Heart, Smartphone,
  Award, Search, Filter, ShoppingCart, MousePointer, Eye,
  Trophy, Network, Briefcase, Handshake, Landmark, Percent, PieChart, Coins,
  Code2, Megaphone, Share2, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { APP_NAME } from "@/lib/constants";
import logoImg from "@/assets/color-palette-ref.png";

const slides = [
  {
    id: "intro",
    title: "A Próxima Fronteira do Social ecommerce",
    subtitle: "Plataforma em desenvolvimento final. Lançamento em Maio 2026.",
    content: (
      <div className="space-y-6">
        <p className="text-lg text-white/80 leading-relaxed">
          A Only Shop não é apenas um app, é a infraestrutura definitiva para a economia dos criadores.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20 px-3 py-1">Status: Em Desenvolvimento</Badge>
          <Badge className="bg-white/10 text-white/60 border-white/5 px-3 py-1">Lançamento: 30 de Maio</Badge>
        </div>
      </div>
    ),
    gradient: "from-[#00f2ff] via-[#0066ff] to-[#7000ff]",
    icon: Rocket,
    badge: "O Futuro Chegou"
  },
  {
    id: "investment",
    title: "Oportunidade Pré-Seed",
    subtitle: "A maior Startup de 2026 está aberta para investidores anjo.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div className="relative group p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/[0.03] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex justify-between items-end">
              <div>
                <p className="text-xs text-white/40 uppercase font-black tracking-[0.2em] mb-2">Aporte Inicial</p>
                <p className="text-5xl font-black text-white tracking-tighter shadow-white/10 drop-shadow-2xl">R$ 200k</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40 uppercase font-black tracking-[0.2em] mb-2">Equity</p>
                <p className="text-4xl font-black text-[#00f2ff]">10%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5">
          <p className="text-sm text-white/60 leading-relaxed italic">
            "Validado por players que já faturam milhões no mercado. Estamos construindo a solução que o mercado de influência implora para ter."
          </p>
        </div>
      </div>
    ),
    gradient: "from-[#ff0055] via-[#ff00aa] to-[#7000ff]",
    icon: Coins
  },
  {
    id: "use-of-funds",
    title: "Alocação do Capital",
    subtitle: "Foco total em tecnologia de ponta e tração de mercado.",
    content: (
      <div className="space-y-5">
        {[
          { label: "Melhorias no App (IA/UX)", value: 40, icon: Code2, color: "bg-[#00f2ff]" },
          { label: "Prospecção de Marcas", value: 30, icon: Target, color: "bg-[#7000ff]" },
          { label: "Afiliados & Influenciadores", value: 20, icon: Share2, color: "bg-[#ff0055]" },
          { label: "Operacional & Legal", value: 10, icon: Shield, color: "bg-white/40" },
        ].map((item) => (
          <div key={item.label} className="space-y-2 group">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-white/60 group-hover:text-white transition-colors">
              <span className="flex items-center gap-2">
                <item.icon className={`h-3.5 w-3.5 ${item.color.replace('bg-', 'text-')}`} /> 
                {item.label}
              </span>
              <span>{item.value}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full ${item.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`} 
              />
            </div>
          </div>
        ))}
      </div>
    ),
    gradient: "from-[#0066ff] to-[#00f2ff]",
    icon: PieChart
  },
  {
    id: "functionalities",
    title: "Ecossistema de Elite",
    subtitle: "Social, Monetização e Escala em um único lugar.",
    content: (
      <div className="grid grid-cols-1 gap-3">
        {[
          { title: "Social", desc: "Comunidades, feed interativo e Match IA.", icon: Heart, color: "text-[#ff0055]" },
          { title: "Monetização", desc: "Checkout 1-clique, Wallet e links dinâmicos.", icon: DollarSign, color: "text-emerald-400" },
          { title: "Escala", desc: "CRM B2B, Dashboard de Afiliados e Big Data.", icon: TrendingUp, color: "text-[#00f2ff]" },
        ].map((item, idx) => (
          <div key={item.title} className="group relative overflow-hidden p-6 rounded-[2rem] border border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
               <item.icon className="h-16 w-16" />
            </div>
            <div className="flex items-start gap-4">
              <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-base tracking-tight mb-1">{item.title}</h4>
                <p className="text-xs text-white/40 font-medium">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
    gradient: "from-[#7000ff] to-[#ff00aa]",
    icon: Cpu
  },
  {
    id: "match-preview",
    title: "Smart Match IA",
    subtitle: "O Tinder do B2B: Marcas e Criadores conectados por dados.",
    content: (
      <div className="space-y-6">
        <div className="relative group p-6 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/20 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 ring-4 ring-primary/20">
                <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" />
                <AvatarFallback>CL</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-black italic">Camila Lopes</p>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Nicho: Skincare</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black italic">Glow Beauty</p>
                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">PRO Marca</p>
              </div>
              <Avatar className="h-14 w-14 ring-4 ring-accent/20">
                <AvatarImage src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop" />
                <AvatarFallback>GB</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <div className="relative h-24 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="relative z-10 h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-[0_0_50px_rgba(255,46,104,0.6)]"
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40px] font-black italic text-white/5 tracking-tighter uppercase whitespace-nowrap select-none">
              98% MATCH SCORE
            </div>
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-primary/10 border border-primary/20">
            <p className="text-[11px] text-primary font-bold italic text-center uppercase tracking-widest">
              Conexão automática via Big Data: Localização + Nicho + ROI
            </p>
          </div>
        </div>
      </div>
    ),
    gradient: "from-[#ff2e68] to-[#9d4eff]",
    icon: Sparkles
  },
  {
    id: "projections",
    title: "Visão Financeira",
    subtitle: "Break-even projetado para o Mês 18.",
    content: (
      <div className="space-y-6">
        <div className="relative h-40 w-full bg-black/40 rounded-3xl border border-white/5 flex items-end p-4 gap-1.5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,242,255,0.1),transparent)]" />
          {[15, 25, 40, 60, 85, 120, 160, 210, 280, 380, 520, 750].map((h, i) => (
            <motion.div 
              key={i} 
              initial={{ height: 0 }}
              animate={{ height: `${(h/750)*100}%` }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`flex-1 rounded-t-lg bg-gradient-to-t ${i > 8 ? 'from-[#00f2ff] to-[#0066ff]' : 'from-white/10 to-white/20'}`} 
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Ticket Médio</p>
            <p className="text-xl font-black">R$ 699</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Margem</p>
            <p className="text-xl font-black text-emerald-400">72%</p>
          </div>
        </div>
      </div>
    ),
    gradient: "from-[#00f2ff] to-[#0066ff]",
    icon: BarChart3
  },
  {
    id: "cta",
    title: "O Amanhã Começa Hoje",
    subtitle: "A maior startup da década está nascendo.",
    content: (
      <div className="space-y-8 text-center">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00f2ff] to-[#7000ff] rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="flex justify-center -space-x-4 relative">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-14 w-14 rounded-full border-4 border-[#09090b] bg-white/10 flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${i+20}`} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full h-16 rounded-3xl bg-white text-black hover:bg-[#00f2ff] hover:text-black transition-all font-black text-lg shadow-[0_20px_40px_rgba(255,255,255,0.1)] group">
            <Link to="/auth" className="flex items-center justify-center gap-2">
              RESERVAR MEU ESPAÇO <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.3em]">
            Lançamento Final de Maio/2026
          </p>
        </div>
      </div>
    ),
    gradient: "from-[#09090b] to-[#1a1a1e]",
    icon: Trophy
  }
];

export default function Pitch() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    }
  };

  const prevSlide = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current]);

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-[#020205] text-white overflow-hidden flex flex-col font-sans selection:bg-[#00f2ff] selection:text-black">
      {/* Cinematic Futuristic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} blur-[120px] mix-blend-screen`}
          />
        </AnimatePresence>
        
        {/* Dynamic Grid Overlay */}
        <div className="absolute inset-0 opacity-20" 
             style={{ 
               backgroundImage: `linear-gradient(#ffffff0a 1px, transparent 1px), linear-gradient(90deg, #ffffff0a 1px, transparent 1px)`,
               backgroundSize: '40px 40px' 
             }} 
        />
        
        {/* Moving Scanline */}
        <motion.div 
          animate={{ translateY: ["0%", "100%"] }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-x-0 h-[20vh] bg-gradient-to-b from-transparent via-[#00f2ff05] to-transparent z-10"
        />

        {/* Noise Filter */}
        <div className="absolute inset-0 opacity-[0.05] contrast-150 brightness-150" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} 
        />
      </div>

      {/* Top Status Bar */}
      <div className="relative z-50 flex gap-1 px-2 pt-2 sm:px-4 sm:pt-4">
        {slides.map((_, i) => (
          <div key={i} className="h-0.5 sm:h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
            <AnimatePresence>
              {i <= current && (
                <motion.div 
                  layoutId="progress-bar"
                  className={`h-full bg-gradient-to-r ${i === current ? 'from-[#00f2ff] to-white' : 'from-white/40 to-white/60'}`}
                  initial={i === current ? { width: "0%" } : { width: "100%" }}
                  animate={i === current ? { width: "100%" } : { width: "100%" }}
                  transition={{ duration: i === current ? 5 : 0.3, ease: "linear" }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <header className="relative z-50 px-6 py-6 sm:py-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <img src={logoImg} alt={APP_NAME} className="h-7 w-7 rounded-lg object-cover" />
          </div>
        </Link>
        <Badge className="hidden sm:flex bg-white/5 text-white/40 border-white/10 rounded-full px-5 py-2 text-[9px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00f2ff] animate-pulse mr-2" />
          Protocolo Alfa Confidencial
        </Badge>
      </header>

      <main className="relative z-40 flex-1 flex flex-col justify-center px-6 max-w-xl mx-auto w-full pb-24">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -50, scale: 1.05 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="space-y-8 sm:space-y-12"
          >
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4">
                <motion.div 
                  initial={{ rotate: -20, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className={`p-4 rounded-[1.5rem] bg-gradient-to-br ${slide.gradient} shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
                >
                  <Icon className="h-8 w-8 text-white drop-shadow-md" />
                </motion.div>
                {slide.badge && (
                  <Badge className="bg-white/10 text-white border-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-xl">
                    {slide.badge}
                  </Badge>
                )}
              </div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.9] italic uppercase text-glow">
                {slide.title}
              </h1>
              <p className="text-xl sm:text-2xl text-[#00f2ff] font-black uppercase tracking-tight opacity-80 italic drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">
                {slide.subtitle}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-white/[0.02] blur-2xl rounded-[3rem] -z-10" />
              {typeof slide.content === "string" ? (
                <p className="text-lg sm:text-xl text-white/70 leading-relaxed font-medium">
                  {slide.content}
                </p>
              ) : slide.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Touch Zones */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-30 cursor-pointer" onClick={prevSlide} />
      <div className="absolute inset-y-0 right-0 w-3/4 z-30 cursor-pointer" onClick={nextSlide} />

      <footer className="relative z-50 p-6 sm:p-10 flex justify-between items-center mt-auto">
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            disabled={current === 0}
            className="h-14 w-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-20 transition-all active:scale-90 group backdrop-blur-md"
          >
            <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={current === slides.length - 1}
            className="h-14 w-14 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-20 transition-all active:scale-90 group backdrop-blur-md"
          >
            <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">Status: Live</span>
            <div className="h-1 w-1 rounded-full bg-[#00f2ff]" />
          </div>
          <p className="text-3xl font-black italic tracking-tighter">
            {String(current + 1).padStart(2, '0')} 
            <span className="text-white/10 ml-2">/ {String(slides.length).padStart(2, '0')}</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
