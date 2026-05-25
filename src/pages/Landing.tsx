import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Users, DollarSign, Star,
  Play, Rocket, Zap, Target, TrendingUp
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import logoImg from "@/assets/color-palette-ref.png";
import { memo, useEffect } from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Criadores Ativos", icon: Users },
  { value: "R$1M+", label: "Pagamentos Realizados", icon: DollarSign },
  { value: "4.9★", label: "Satisfação", icon: Star },
  { value: "500+", label: "Marcas Verificadas", icon: Target },
];

const testimonials = [
  { name: "Marina Sales", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", earnings: "R$87.5K" },
  { name: "Pedro Henrique", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", earnings: "R$45.2K" },
  { name: "Rafa Digital", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", earnings: "R$120K" },
  { name: "Beatriz Nova", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", earnings: "R$2.1K" },
];

const MeshBackground = memo(() => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[hsl(346,100%,58%)] opacity-[0.03] blur-[120px] animate-float" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[hsl(174,100%,47%)] opacity-[0.01] blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
    <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
  </div>
));

MeshBackground.displayName = "MeshBackground";

const AppStaircase = memo(() => (
  <div className="relative h-[600px] w-full max-w-5xl mx-auto overflow-hidden rounded-[4rem] bg-white/[0.01] border border-white/[0.03] p-12 mt-20 group">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
    <div className="flex justify-center items-center h-full -space-x-12 sm:-space-x-24">
      {[
        { color: "from-primary/20", rotate: -15, y: -40 },
        { color: "from-accent/20", rotate: 0, y: 0, active: true },
        { color: "from-purple-500/20", rotate: 15, y: 40 },
      ].map((screen, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: screen.y }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: i * 0.2 }}
          className={cn(
            "relative w-[280px] h-[560px] rounded-[3rem] border border-white/10 bg-[#050505] overflow-hidden shadow-2xl",
            screen.active && "z-10 border-primary/30 ring-4 ring-primary/5 shadow-primary/20"
          )}
          style={{ transform: `rotate(${screen.rotate}deg)` }}
        >
          <div className={`h-full w-full bg-gradient-to-b ${screen.color} to-transparent p-6`}>
             <div className="h-full w-full rounded-[2rem] border border-white/[0.05] bg-black/40 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-center">
                <Rocket className="h-12 w-12 text-white/10" />
                <div className="space-y-2">
                   <div className="h-1 w-20 bg-white/5 mx-auto rounded-full" />
                   <div className="h-1 w-12 bg-white/5 mx-auto rounded-full" />
                </div>
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
));

AppStaircase.displayName = "AppStaircase";

import { cn } from "@/lib/utils";

export default function Landing() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-primary/30 font-sans">
      <MeshBackground />

      {/* NAV */}
      <nav className="relative z-50 w-full border-b border-white/[0.03] backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <img src={logoImg} alt={APP_NAME} className="h-7 w-7 rounded-lg object-cover" />
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-[0.2em] text-white/60">
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Tecnologia</button>
            <button onClick={() => document.getElementById("impact")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Impacto</button>
            <Link to="/pitch" className="hover:text-white transition-colors">Pitch</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="text-white/40 hover:text-white text-[10px] font-black uppercase tracking-widest px-4">
              <Link to="/auth">Entrar</Link>
            </Button>
            <Button asChild size="sm" className="bg-white text-black hover:bg-accent hover:text-black text-[10px] font-black uppercase tracking-widest h-10 px-6 rounded-full transition-all">
              <Link to="/auth">Começar</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-10 bg-white/5 text-primary border-primary/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] inline-flex items-center gap-3 shadow-[0_0_20px_rgba(255,46,104,0.1)]">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              V.2026 ALPHA PROTOCOL
            </Badge>

            <h1 className="text-7xl md:text-[11.5rem] font-black leading-[0.7] tracking-tighter italic uppercase mb-16">
              O <br />
              <span className="text-gradient-primary drop-shadow-[0_0_100px_rgba(255,46,104,0.4)]">ECOSSISTEMA</span>
            </h1>

            <p className="text-xl md:text-[1.75rem] text-white/60 mb-20 font-medium leading-relaxed tracking-tight max-w-2xl mx-auto italic">
              Uma infraestrutura invisível que une influência e ecommerce global através de pura inteligência.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Button asChild size="lg" className="h-16 px-10 rounded-full bg-white text-black hover:bg-accent font-black text-sm uppercase tracking-tighter italic w-full sm:w-auto shadow-2xl shadow-white/5">
                <Link to="/auth" className="flex items-center gap-2">
                  Começar Agora <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-16 px-10 rounded-full text-white/40 hover:text-white transition-all font-bold text-sm uppercase tracking-widest italic">
                <Play className="mr-2 h-4 w-4 fill-current" /> Ver Demo
              </Button>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex -space-x-4">
                {testimonials.map((t) => (
                  <img key={t.name} src={t.avatar} alt="" className="h-12 w-12 rounded-full border-4 border-[#050505] object-cover" />
                ))}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                Junte-se a <span className="text-white/80">+10.000</span> Criadores de Elite
              </div>
            </div>
          </motion.div>

          {/* App Staircase Section */}
          <AppStaircase />
        </div>

        {/* Stats Strip */}
        <div className="mt-32 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center group border-l border-white/[0.03] first:border-l-0">
                  <p className="text-5xl font-black italic tracking-tighter mb-3 group-hover:text-primary transition-all duration-500">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH / FEATURES SECTION */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                Engine Proprietária
              </Badge>
              <h2 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.65] mb-8">
                INTELIGÊNCIA <br /> <span className="text-white/[0.05] text-glow uppercase">PURA</span>
              </h2>
              <p className="text-xl text-white/60 font-medium leading-relaxed max-w-lg italic">
                Nossa engine proprietária processa bilhões de dados para orquestrar conexões de ecommerce de alto rendimento.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { title: "SMART MATCH", desc: "Engine de conexão via deep-learning." },
                  { title: "ROI EM TEMPO REAL", desc: "Monitoramento de lucro ao vivo." },
                  { title: "ESCALA GLOBAL", desc: "Infraestrutura de latência zero." },
                  { title: "SEGURANÇA TOTAL", desc: "Ledger de transações criptografado." },
                ].map((f) => (
                  <div key={f.title} className="space-y-2 border-t border-white/[0.02] pt-6">
                    <h4 className="font-black italic uppercase tracking-tighter text-lg text-white/60">{f.title}</h4>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Teaser */}
            <div className="relative group">
              <div className="absolute -inset-20 bg-gradient-to-tr from-primary/10 to-transparent blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-[4rem] border border-white/[0.01] bg-white/[0.005] p-2 aspect-[4/5] overflow-hidden">
                 <div className="h-full w-full bg-[#030303] rounded-[3.8rem] flex items-center justify-center p-12 text-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent" />
                    <div className="space-y-8 relative z-10">
                       <div className="h-32 w-32 rounded-full border border-white/[0.03] mx-auto flex items-center justify-center">
                          <div className="h-24 w-24 rounded-full bg-gradient-primary blur-3xl opacity-20 absolute" />
                          <Rocket className="h-10 w-10 text-primary opacity-40 animate-float" />
                       </div>
                       <p className="text-[9px] font-black uppercase tracking-[1em] text-white/10">INTERFACE DO SISTEMA</p>
                       <div className="space-y-4">
                          <div className="h-0.5 w-48 bg-white/[0.02] mx-auto" />
                          <div className="h-0.5 w-32 bg-white/[0.02] mx-auto" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-40 border-t border-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-[5rem] bg-white/[0.005] border border-white/[0.02] p-16 md:p-32 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.01] group-hover:opacity-[0.03] transition-opacity">
               <TrendingUp className="h-64 w-64" />
            </div>
            
            <h2 className="text-5xl md:text-[9rem] font-black italic uppercase tracking-tighter mb-16 relative z-10 leading-none">
              PRONTO PARA <br /> <span className="text-gradient-primary uppercase">O TOPO?</span>
            </h2>
            
            <Button asChild size="lg" className="h-24 px-16 rounded-full bg-white text-black hover:bg-accent hover:scale-105 font-black text-2xl uppercase tracking-tighter italic relative z-10 transition-all duration-500">
              <Link to="/auth">INICIAR ACESSO</Link>
            </Button>
            
            <div className="mt-20 flex justify-center gap-16 text-white/10 font-black uppercase tracking-[0.5em] text-[10px] relative z-10">
               <span>FRICÇÃO ZERO</span>
               <span>•</span>
               <span>ALPHA DEPLOY</span>
               <span>•</span>
               <span>V.2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4 opacity-20">
              <span className="font-black italic text-2xl uppercase tracking-tighter">ONLY SHOP</span>
              <span className="text-[8px] font-black text-white/10 uppercase tracking-[0.4em]">Proprietary OS</span>
           </div>
           
           <div className="flex gap-12 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
              <Link to="/terms" className="hover:text-white transition-all">TERMOS</Link>
              <Link to="/privacy" className="hover:text-white transition-all">PRIVACIDADE</Link>
              <a href="#" className="hover:text-white transition-all">REDE</a>
           </div>
           
           <p className="text-[10px] font-bold text-white/10 uppercase tracking-[0.2em]">
              © 2026 ONLY SHOP CORE. TODOS OS DIREITOS RESERVADOS.
           </p>
        </div>
      </footer>
    </div>
  );
}
