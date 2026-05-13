import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, TrendingUp, Users, Target, Shield, DollarSign, 
  ChevronRight, ArrowRight, Play, Star, Sparkles, MessageCircle,
  BarChart3, Globe, Zap, Award, Crown, Flame, Laptop, Smartphone,
  ZapOff, Heart, Share2, Layers, Cpu, LineChart, PieChart, Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: "vision",
    title: "Only Shop",
    subtitle: "A Nova Era do Social Commerce",
    content: "Onde a influência encontra a conversão real. Não somos apenas uma plataforma, somos o sistema operacional dos novos criadores.",
    icon: Sparkles,
    color: "from-magenta-500 to-cyan-500",
    visual: "hero"
  },
  {
    id: "problem",
    title: "O Gap de R$ 100 Bi",
    subtitle: "Creators sem Monetização",
    content: "Criadores geram atenção massiva, mas as plataformas atuais ficam com 99% do valor. O creator é o novo varejo, mas não tem as ferramentas certas.",
    points: [
      "Dependência de algoritmos opacos",
      "Falta de infraestrutura de checkout",
      "Dificuldade em gerir parcerias",
      "Tracking de vendas inexistente"
    ],
    icon: Target,
    color: "from-red-500 to-orange-500",
    visual: "problem-chart"
  },
  {
    id: "solution",
    title: "A Solução",
    subtitle: "Ecossistema Completo",
    content: "Integramos Social, Checkout e Matchmaking em uma única experiência fluida e focada em dados.",
    points: [
      "Social: Comunidade e Identidade",
      "Monetização: Checkout & Afiliados",
      "Escala: IA Matchmaking & Analytics"
    ],
    icon: Rocket,
    color: "from-blue-600 to-indigo-600",
    visual: "ecosystem"
  },
  {
    id: "product-social",
    title: "Experiência Social",
    subtitle: "Retenção e Comunidade",
    content: "Perfis públicos de alta conversão, feeds inteligentes e microinterações que mantêm o usuário engajado.",
    features: ["Perfil Profissional", "Feed de Conteúdo", "Comunidades Vips", "Engagement Real-time"],
    icon: Users,
    color: "from-pink-500 to-rose-500",
    visual: "mockup-social"
  },
  {
    id: "product-monetization",
    title: "Monetização Ativa",
    subtitle: "Vendas em 1 Clique",
    content: "Nossa tecnologia de One Shop Checkout permite que qualquer seguidor vire cliente sem sair da plataforma.",
    features: ["Checkout Integrado", "VSL de Alta Conversão", "Gestão de Comissões", "Campanhas Whitelabel"],
    icon: Coins,
    color: "from-emerald-500 to-green-600",
    visual: "mockup-sales"
  },
  {
    id: "match",
    title: "Smart Match IA",
    subtitle: "Matching Perfeito",
    content: "Nossa inteligência artificial conecta a marca certa ao criador certo baseado em audiência, nicho e performance real.",
    icon: Cpu,
    color: "from-purple-500 to-violet-600",
    visual: "mockup-match"
  },
  {
    id: "market",
    title: "Tração & Números",
    subtitle: "Validação de Mercado",
    content: "Crescimento sustentável com métricas que provam a dor que estamos resolvendo.",
    stats: [
      { label: "Creators", value: "10K+" },
      { label: "GMV Projetado", value: "R$ 50M" },
      { label: "LTV/CAC", value: "4.2x" },
      { label: "Retention", value: "68%" }
    ],
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600"
  },
  {
    id: "projections",
    title: "Projeção Financeira",
    subtitle: "Roadmap de Receita",
    content: "Modelo de negócio escalável baseado em take-rate e assinaturas SaaS para marcas.",
    financials: [
      { year: "Ano 1", rev: "R$ 1.5M", margin: "15%", status: "Seed" },
      { year: "Ano 2", rev: "R$ 7.8M", margin: "22%", status: "Break-even" }
    ],
    breakEven: "Estimativa: 18 meses",
    icon: LineChart,
    color: "from-cyan-500 to-blue-600"
  },
  {
    id: "investment",
    title: "Rodada Pre-Seed",
    subtitle: "Oportunidade de Entrada",
    content: "Buscamos parceiros estratégicos que queiram dominar o Social Commerce na América Latina.",
    investment: {
      ticket: "R$ 100k - R$ 500k",
      valuation: "R$ 15M - 20M (Post)",
      useOfFunds: [
        { label: "Product/Tech", value: "50%" },
        { label: "Growth/CAC", value: "30%" },
        { label: "Ops/Team", value: "20%" }
      ]
    },
    icon: DollarSign,
    color: "from-indigo-600 to-purple-600"
  },
  {
    id: "founders",
    title: "The Team",
    subtitle: "Execução de Elite",
    founders: [
      {
        name: "Gabriel Biel",
        role: "CEO & Growth",
        bio: "+1B views. Especialista em viralização.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
      },
      {
        name: "Guilherme Monteiro",
        role: "CTO & Ops",
        bio: "Gerou R$ 360M em startups prévias.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
      }
    ],
    icon: Shield,
    color: "from-zinc-700 to-zinc-900"
  }
];


const VisualRenderer = ({ type, slide }: { type: string, slide: any }) => {
  switch (type) {
    case "hero":
      return (
        <div className="relative h-48 w-full flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-64 h-64 rounded-full border border-primary/20 flex items-center justify-center"
          >
            <div className="w-4 h-4 rounded-full bg-primary absolute -top-2" />
          </motion.div>
          <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-magenta-500 to-cyan-500">
            ONLY
          </div>
        </div>
      );
    case "mockup-social":
      return (
        <div className="relative h-48 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-2 w-24 bg-zinc-800 rounded" />
              <div className="h-1.5 w-16 bg-zinc-800/50 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="aspect-square bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent flex items-center justify-around px-4">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <div className="h-1 w-8 bg-zinc-800 rounded-full" />
            <div className="h-1 w-8 bg-zinc-800 rounded-full" />
          </div>
        </div>
      );
    case "mockup-match":
      return (
        <div className="relative h-48 flex items-center justify-center">
          <div className="relative w-full max-w-[200px]">
            <motion.div 
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -left-4 top-0 h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md"
            >
              <Avatar className="h-12 w-12"><AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" /></Avatar>
            </motion.div>
            <motion.div 
              animate={{ x: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-4 bottom-0 h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md"
            >
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">NIKE</div>
            </motion.div>
            <div className="h-24 w-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
              <Zap className="h-10 w-10 text-primary fill-current" />
            </div>
          </div>
        </div>
      );
    case "mockup-sales":
      return (
        <div className="relative h-48 bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden p-6 flex flex-col justify-center">
          <div className="text-center space-y-2 mb-4">
            <div className="text-xs text-white/40">Checkout Only Shop</div>
            <div className="text-2xl font-black">R$ 297,00</div>
          </div>
          <div className="space-y-2">
            <div className="h-10 w-full bg-primary rounded-xl flex items-center justify-center font-bold text-sm">Pagar agora</div>
            <div className="h-10 w-full border border-white/10 rounded-xl flex items-center justify-center text-xs text-white/40">Pix ou Cartão</div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

export default function Pitch() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Mesh Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[100vw] h-[100vw] rounded-full bg-[hsl(330,81%,60%)] blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-[hsl(174,100%,47%)] blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md h-[88vh] bg-zinc-950 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Progress Bars */}
        <div className="absolute top-5 left-6 right-6 flex gap-1.5 z-20">
          {slides.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
              {i === currentSlide && (
                <motion.div 
                  className="h-full bg-white" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              )}
              {i < currentSlide && <div className="h-full bg-white/40 w-full" />}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="flex-1 p-8 pt-16 flex flex-col overflow-y-auto hide-scrollbar"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${slide.color} flex items-center justify-center shadow-lg shadow-black/40`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{slide.subtitle}</h2>
                  <h1 className="text-3xl font-black leading-tight tracking-tight">{slide.title}</h1>
                </div>
              </div>

              {slide.visual && (
                <div className="mb-8">
                  <VisualRenderer type={slide.visual} slide={slide} />
                </div>
              )}

              <p className="text-base text-white/60 mb-8 leading-relaxed font-medium">
                {slide.content}
              </p>

              {slide.points && (
                <div className="space-y-2.5 mb-8">
                  {slide.points.map((p, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-[1.25rem] border border-white/[0.05]"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                      <span className="text-sm font-bold text-white/80">{p}</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {slide.features && (
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {slide.features.map((f, i) => (
                    <div key={i} className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.05] flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-bold uppercase text-white/60">{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {slide.stats && (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {slide.stats.map((s, i) => (
                    <div key={i} className="bg-gradient-to-br from-white/[0.08] to-transparent p-5 rounded-[2rem] border border-white/[0.05] text-center">
                      <p className="text-2xl font-black text-white">{s.value}</p>
                      <p className="text-[9px] uppercase tracking-wider text-white/30 font-black">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {slide.financials && (
                <div className="space-y-3 mb-8">
                  {slide.financials.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                      <div>
                        <p className="text-xs font-black text-white/40">{f.year}</p>
                        <p className="text-lg font-black">{f.rev}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">{f.status}</Badge>
                        <p className="text-[10px] font-bold text-white/40 mt-1">Margem: {f.margin}</p>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                    <p className="text-xs font-bold text-primary italic">{slide.breakEven}</p>
                  </div>
                </div>
              )}

              {slide.investment && (
                <div className="space-y-6 mb-8">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                      <p className="text-[9px] font-black text-white/40 uppercase mb-1">Entry Ticket</p>
                      <p className="text-sm font-black">{slide.investment.ticket}</p>
                    </div>
                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05]">
                      <p className="text-[9px] font-black text-white/40 uppercase mb-1">Valuation</p>
                      <p className="text-sm font-black">{slide.investment.valuation}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-white/40 uppercase px-1">Uso do Capital</p>
                    {slide.investment.useOfFunds.map((u, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span>{u.label}</span>
                          <span className="text-primary">{u.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: u.value }}
                            className="h-full bg-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {slide.founders && (
                <div className="space-y-4 mb-8">
                  {slide.founders.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-[2rem] border border-white/[0.05]">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={f.avatar} />
                        <AvatarFallback className="bg-zinc-800">{f.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold">{f.name}</p>
                        <p className="text-xs text-primary font-bold mb-1">{f.role}</p>
                        <p className="text-[10px] text-white/40 leading-tight">{f.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Overlay (Invisible areas for touch) */}
          <div className="absolute inset-0 flex z-30">
            <div className="flex-1 cursor-pointer" onClick={prevSlide} />
            <div className="flex-1 cursor-pointer" onClick={nextSlide} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex items-center justify-between z-40">
          <Link to="/">
            <Button variant="ghost" className="text-white/30 hover:text-white h-12 px-0 font-bold text-xs uppercase tracking-widest">
              Fechar
            </Button>
          </Link>
          {currentSlide === slides.length - 1 ? (
            <Button asChild size="lg" className="bg-gradient-to-r from-magenta-500 to-cyan-500 border-0 rounded-full px-8 h-12 font-black shadow-xl shadow-primary/20">
              <Link to="/auth">Investir Agora <Zap className="ml-2 h-4 w-4 fill-current" /></Link>
            </Button>
          ) : (
            <Button onClick={nextSlide} className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 font-black transition-transform active:scale-95">
              Próximo <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-black">Only Shop Confidential — 2026</p>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 w-1 rounded-full transition-all duration-300 ${i === currentSlide ? "bg-primary w-4" : "bg-white/10"}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
