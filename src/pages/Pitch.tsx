import { useState, useEffect } from "react";
import { 
  ChevronRight, ChevronLeft, Rocket, Users, Target, BarChart3, 
  DollarSign, Shield, Zap, TrendingUp, Sparkles, Star, 
  ArrowRight, Globe, MessageCircle, Heart, Smartphone,
  Award, Search, Filter, ShoppingCart, MousePointer, Eye,
  Trophy, Network, Briefcase, Handshake, Landmark, Percent, PieChart, Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: "intro",
    title: "A Revolução do Social Commerce",
    subtitle: "A maior Startup de 2026 está prestes a ser lançada.",
    content: "Only Shop: Onde conteúdo encontra monetização real em um ecossistema inteligente.",
    gradient: "from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)]",
    icon: Rocket,
    badge: "Lançamento: Maio 2026"
  },
  {
    id: "vision",
    title: "Oportunidade Pré-Seed",
    subtitle: "Seja um dos primeiros parceiros da próxima unicórnio.",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Aporte Necessário</p>
            <p className="text-2xl font-bold text-white">R$ 1.5M</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Post-Money Val.</p>
            <p className="text-2xl font-bold text-white">R$ 10.5M</p>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
          <p className="text-sm text-white/70 leading-relaxed italic">
            "Baseado no histórico de faturamento dos fundadores e no volume de creators já pré-cadastrados, a Only Shop entra no mercado com tração validada e tecnologia superior."
          </p>
        </div>
      </div>
    ),
    gradient: "from-[hsl(25,95%,53%)] to-[hsl(330,81%,60%)]",
    icon: Landmark
  },
  {
    id: "use-of-funds",
    title: "Destinação do Capital",
    subtitle: "Eficiência operacional e escala agressiva.",
    content: (
      <div className="space-y-4">
        {[
          { label: "Desenvolvimento & IA", value: 40, icon: Zap },
          { label: "Aquisição de Creators", value: 35, icon: Users },
          { label: "Operações & Legal", value: 15, icon: Shield },
          { label: "Reserva Estratégica", value: 10, icon: Landmark },
        ].map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-2"><item.icon className="h-3 w-3 text-white/40" /> {item.label}</span>
              <span className="font-bold">{item.value}%</span>
            </div>
            <Progress value={item.value} className="h-1.5 bg-white/5" />
          </div>
        ))}
      </div>
    ),
    gradient: "from-[hsl(270,91%,65%)] to-[hsl(240,12%,10%)]",
    icon: PieChart
  },
  {
    id: "projections",
    title: "Projeções Financeiras",
    subtitle: "Caminho claro para lucratividade (Break-even: Mês 18).",
    content: (
      <div className="space-y-5">
        <div className="relative h-32 w-full bg-white/5 rounded-xl border border-white/5 flex items-end p-2 gap-1">
          {[20, 35, 55, 80, 100, 140, 200, 280, 380, 520, 700, 950].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)] rounded-t-sm" 
              style={{ height: `${(h/950)*100}%`, opacity: i > 8 ? 1 : 0.4 }} 
            />
          ))}
          <div className="absolute top-2 left-3 text-[9px] text-white/30 uppercase font-bold tracking-widest">Revenue Growth (24 Months)</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[9px] text-white/40 uppercase font-bold">Ticket Médio (SaaS)</p>
            <p className="text-lg font-bold">R$ 699,00</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-[9px] text-white/40 uppercase font-bold">Margem Operacional</p>
            <p className="text-lg font-bold text-emerald-400">72%</p>
          </div>
        </div>
      </div>
    ),
    gradient: "from-[hsl(174,100%,47%)] to-[hsl(200,100%,55%)]",
    icon: BarChart3
  },
  {
    id: "ecosystem",
    title: "Ecossistema Completo",
    subtitle: "Três pilares de escala imbatível.",
    content: (
      <div className="grid grid-cols-1 gap-3">
        {[
          { title: "Social", desc: "Feed, comunidades e engajamento orgânico.", icon: Heart, badge: "Match IA" },
          { title: "Monetização", desc: "Links, checkout 1-clique e comissões.", icon: DollarSign, badge: "Automático" },
          { title: "Escala", desc: "CRM B2B, Analytics e gestão de afiliados.", icon: TrendingUp, badge: "B2B" },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <item.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm">{item.title}</h4>
                <Badge className="bg-white/10 text-[8px] h-4">{item.badge}</Badge>
              </div>
              <p className="text-xs text-white/40">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
    gradient: "from-[hsl(330,81%,60%)] to-[hsl(25,95%,53%)]",
    icon: Network
  },
  {
    id: "smart-match",
    title: "Diferencial Competitivo",
    subtitle: 'O "Tinder" do Social Commerce.',
    content: (
      <div className="space-y-4">
        <div className="relative aspect-square max-w-[200px] mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10 animate-[spin_20s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)] flex items-center justify-center shadow-[0_0_40px_hsl(330,81%,60%,0.4)]">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <Users className="h-4 w-4" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <ShoppingCart className="h-4 w-4" />
          </div>
        </div>
        <p className="text-center text-xs text-white/50 leading-relaxed">
          Nossa IA proprietária conecta influenciadores a marcas globais através de geolocalização, nicho e performance real de vendas.
        </p>
      </div>
    ),
    gradient: "from-[hsl(270,91%,65%)] to-[hsl(330,81%,60%)]",
    icon: Sparkles
  },
  {
    id: "cta",
    title: "Faça parte da história",
    subtitle: "Lançamento confirmado para este mês.",
    content: (
      <div className="space-y-8 text-center">
        <div className="flex justify-center -space-x-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-12 w-12 rounded-full border-4 border-[hsl(240,12%,5%)] bg-white/10 flex items-center justify-center overflow-hidden">
              <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="" />
            </div>
          ))}
          <div className="h-12 w-12 rounded-full border-4 border-[hsl(240,12%,5%)] bg-[hsl(330,81%,60%)] flex items-center justify-center text-xs font-bold text-white">
            +10k
          </div>
        </div>
        <div className="space-y-4">
          <Button asChild size="lg" className="w-full h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-bold text-base shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
            <Link to="/auth">Solicitar Acesso Antecipado</Link>
          </Button>
          <Button variant="ghost" className="w-full text-white/40 hover:text-white hover:bg-white/5">
            Download Pitch Deck (PDF)
          </Button>
        </div>
        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Only Shop © 2026 · Built to Scale</p>
      </div>
    ),
    gradient: "from-[hsl(240,12%,5%)] to-[hsl(240,12%,15%)]",
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
