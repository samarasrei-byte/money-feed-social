import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, TrendingUp, Users, Target, Shield, DollarSign, 
  ChevronRight, ArrowRight, Play, Star, Sparkles, MessageCircle,
  BarChart3, Globe, Zap, Award, Crown, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "O Problema",
    subtitle: "Creators sem monetização real",
    content: "Milhares de criadores geram bilhões de visualizações, mas não conseguem transformar isso em renda recorrente e escalável.",
    points: [
      "Dependência de publicidade incerta",
      "Falta de ferramentas de vendas diretas",
      "Dificuldade em encontrar produtos certos",
      "Tracking de vendas pouco transparente"
    ],
    icon: Target,
    color: "from-red-500 to-orange-500"
  },
  {
    title: "A Solução: Only Shop",
    subtitle: "Social Commerce de Nova Geração",
    content: "Uma plataforma que integra rede social com o ecossistema de vendas mais potente do Brasil.",
    points: [
      "Smart Match IA: Marcas x Creators",
      "Checkout integrado em um clique",
      "PWA: Experiência de app nativo",
      "Gamificação que impulsiona vendas"
    ],
    icon: Rocket,
    color: "from-blue-600 to-indigo-600"
  },
  {
    title: "Tração & Números",
    subtitle: "Crescimento Exponencial",
    content: "Validação real com uma comunidade ativa e faturamento real gerado para nossos parceiros.",
    stats: [
      { label: "Creators Ativos", value: "10K+" },
      { label: "Comissões Pagas", value: "R$ 1M+" },
      { label: "Visualizações/mês", value: "1B+" },
      { label: "Marcas Parceiras", value: "500+" }
    ],
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500"
  },
  {
    title: "Oportunidade Preside",
    subtitle: "Investing in the Future of Commerce",
    content: "Estamos abrindo uma rodada estratégica para acelerar nossa tecnologia de Match e expansão LatAm.",
    points: [
      "Ticket Médio: R$ 50k - 200k",
      "Valuation Post-money: R$ 15M",
      "Uso de Capital: 60% Tech, 40% Growth",
      "Burn Rate Controlado: Runway de 18 meses"
    ],
    icon: DollarSign,
    color: "from-purple-600 to-pink-600"
  },
  {
    title: "Fundadores",
    subtitle: "DNA de Creator e Startup",
    founders: [
      {
        name: "Gabriel Biel",
        role: "CEO & Growth",
        bio: "+1 Bilhão de visualizações nas redes sociais. Especialista em viralização e retenção.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
      },
      {
        name: "Guilherme Monteiro",
        role: "CTO & Ops",
        bio: "Eleito Melhores de 2025 Empreendedorismo. Gerou R$ 360M em negócios via Startups.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
      }
    ],
    icon: Users,
    color: "from-amber-500 to-orange-600"
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
