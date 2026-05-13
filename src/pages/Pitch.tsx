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

      <div className="relative z-10 w-full max-w-md h-[85vh] bg-zinc-950 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
          {slides.map((_, i) => (
            <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              {i === currentSlide && (
                <motion.div 
                  className="h-full bg-white" 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              )}
              {i < currentSlide && <div className="h-full bg-white w-full" />}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="flex-1 p-8 pt-12 flex flex-col"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-6 shadow-xl`}>
                <Icon className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-2">{slide.subtitle}</h2>
              <h1 className="text-4xl font-black mb-6 leading-none tracking-tight">{slide.title}</h1>
              
              <p className="text-lg text-white/70 mb-8 leading-relaxed">
                {slide.content}
              </p>

              {slide.points && (
                <div className="space-y-3">
                  {slide.points.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{p}</span>
                    </div>
                  ))}
                </div>
              )}

              {slide.stats && (
                <div className="grid grid-cols-2 gap-3">
                  {slide.stats.map((s, i) => (
                    <div key={i} className="bg-white/5 p-5 rounded-3xl border border-white/5 text-center">
                      <p className="text-2xl font-black text-primary">{s.value}</p>
                      <p className="text-[10px] uppercase tracking-wider text-white/30 font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {slide.founders && (
                <div className="space-y-4">
                  {slide.founders.map((f, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
                      <Avatar className="h-16 w-16 border-2 border-primary/20">
                        <AvatarImage src={f.avatar} />
                        <AvatarFallback>{f.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold">{f.name}</p>
                        <p className="text-xs text-primary font-bold mb-1">{f.role}</p>
                        <p className="text-[10px] text-white/40 leading-snug">{f.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Overlay (Invisible areas for touch) */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 cursor-pointer" onClick={prevSlide} />
            <div className="flex-1 cursor-pointer" onClick={nextSlide} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 pt-0 flex items-center justify-between z-20">
          <Link to="/">
            <Button variant="ghost" className="text-white/40 hover:text-white h-12 px-0">
              Sair
            </Button>
          </Link>
          {currentSlide === slides.length - 1 ? (
            <Button asChild size="lg" className="bg-gradient-primary border-0 rounded-full px-8 h-12 font-black shadow-lg">
              <Link to="/auth">Investir Agora <Zap className="ml-2 h-4 w-4" /></Link>
            </Button>
          ) : (
            <Button onClick={nextSlide} className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 font-black">
              Próximo <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-white/20 text-[10px] uppercase tracking-widest font-black">Only Shop — Pitch Deck 2026</p>
    </div>
  );
}
