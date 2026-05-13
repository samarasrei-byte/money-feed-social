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
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: "intro",
    title: "A Próxima Fronteira do Social Commerce",
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
          <div className="relative group p-6 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 overflow-hidden">
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
        ].map((item) => (
          <div key={item.title} className="group relative overflow-hidden p-5 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.08]">
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
    <div className="min-h-screen bg-[hsl(240,12%,3%)] text-white overflow-hidden flex flex-col font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} blur-[120px]`}
          />
        </AnimatePresence>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="relative z-50 flex gap-1.5 px-4 pt-4">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
            {i <= current && (
              <motion.div 
                layoutId="progress"
                className="h-full bg-white"
                initial={i === current ? { width: "0%" } : { width: "100%" }}
                animate={i === current ? { width: "100%" } : { width: "100%" }}
                transition={{ duration: i === current ? 5 : 0 }}
              />
            )}
          </div>
        ))}
      </div>

      <header className="relative z-50 px-6 py-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <Rocket className="h-5 w-5 text-black" />
          </div>
          <span className="font-bold tracking-tighter text-xl">Only Shop</span>
        </Link>
        <Badge className="bg-white/10 text-white/60 border-white/5 rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest uppercase">
          Confidencial · Investor Pitch
        </Badge>
      </header>

      <main className="relative z-40 flex-1 flex flex-col justify-center px-6 max-w-xl mx-auto w-full pb-20">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="space-y-10"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${slide.gradient} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                {slide.badge && (
                  <Badge className="bg-[hsl(330,81%,60%)]/20 text-[hsl(330,81%,60%)] border-[hsl(330,81%,60%)]/20 px-3 py-1 text-[10px] font-bold">
                    {slide.badge}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.1]">
                {slide.title}
              </h1>
              <p className="text-xl text-white/60 font-medium">
                {slide.subtitle}
              </p>
            </div>

            <div className="text-lg text-white/90 leading-relaxed">
              {typeof slide.content === "string" ? slide.content : slide.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="absolute inset-y-0 left-0 w-1/4 z-30 cursor-pointer" onClick={prevSlide} />
      <div className="absolute inset-y-0 right-0 w-3/4 z-30 cursor-pointer" onClick={nextSlide} />

      <footer className="relative z-50 p-8 flex justify-between items-center">
        <div className="flex gap-4">
          <button 
            onClick={prevSlide}
            disabled={current === 0}
            className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button 
            onClick={nextSlide}
            disabled={current === slides.length - 1}
            className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Slide</p>
          <p className="text-lg font-bold">{current + 1} <span className="text-white/20">/ {slides.length}</span></p>
        </div>
      </footer>
    </div>
  );
}
