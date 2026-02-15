import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight, Users, TrendingUp, DollarSign, Shield, Star, Check,
  Sparkles, ChevronRight, Play, BarChart3, Globe, MessageCircle, Heart,
  Clock, Rocket, Zap, Award, Target, Eye
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import logoImg from "@/assets/color-palette-ref.png";

/* ─── Data ─── */
const stats = [
  { value: "10K+", label: "Criadores ativos", icon: Users },
  { value: "R$1M+", label: "Comissões pagas", icon: DollarSign },
  { value: "4.9★", label: "Avaliação", icon: Star },
  { value: "500+", label: "Marcas parceiras", icon: Target },
];

const features = [
  { icon: Globe, title: "Rede Social Integrada", desc: "Feed, stories, comunidades e chat em um só lugar." },
  { icon: TrendingUp, title: "Sistema de Afiliados", desc: "Links rastreáveis com dashboard em tempo real." },
  { icon: DollarSign, title: "Monetização Real", desc: "Comissões automáticas depositadas na sua conta." },
  { icon: Shield, title: "Segurança Total", desc: "Dados criptografados e tracking transparente." },
  { icon: BarChart3, title: "Analytics Avançado", desc: "CTR, conversões, ROI e métricas completas." },
  { icon: MessageCircle, title: "Comunidade Ativa", desc: "Networking com os top criadores do Brasil." },
];

const testimonials = [
  { name: "Marina Sales", role: "Top Afiliada · 3 meses", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", text: "Em 3 meses fui de zero a R$12.400/mês em comissões.", earnings: "R$87.5K" },
  { name: "Pedro Henrique", role: "Creator · 6 meses", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", text: "O tracking transparente mudou completamente meu jogo.", earnings: "R$45.2K" },
  { name: "Rafa Digital", role: "Influencer · 1 ano", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", text: "Meu CTR subiu de 2% pra 8% com a prova social verificada.", earnings: "R$120K" },
  { name: "Beatriz Nova", role: "Iniciante · 1 mês", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", text: "Primeiro mês e já fiz R$2.100! A comunidade ajuda demais.", earnings: "R$2.1K" },
];

const plans = [
  { name: "Free", price: "R$0", period: "para sempre", desc: "Explore a plataforma", features: ["Perfil público", "Feed social completo", "Comunidades ilimitadas", "Ranking de criadores"], highlight: false, cta: "Começar grátis" },
  { name: "Starter", price: "R$65,90", period: "/mês", desc: "Aprenda a monetizar", features: ["Tudo do Free", "Treinamento gamificado", "Missões com recompensas", "Suporte prioritário"], highlight: false, cta: "Começar agora" },
  { name: "Partner", price: "R$699", period: "/mês", desc: "Monetize de verdade", features: ["Tudo do Starter", "Links de afiliado ilimitados", "Painel de vendas completo", "Comissão turbinada", "Kit físico exclusivo"], highlight: true, cta: "Quero monetizar" },
  { name: "Business", price: "R$998", period: "/mês", desc: "Escale seu negócio", features: ["Tudo do Partner", "Criar rede de afiliados", "Relatórios B2B", "API de integração"], highlight: false, cta: "Escalar negócio" },
];

const steps = [
  { n: "01", title: "Crie sua conta", desc: "Cadastro em menos de 1 minuto.", icon: Rocket },
  { n: "02", title: "Monte seu perfil", desc: "Conecte suas redes sociais.", icon: Users },
  { n: "03", title: "Poste e engaje", desc: "Crie conteúdo e construa audiência.", icon: Heart },
  { n: "04", title: "Monetize", desc: "Ative links e gere receita por post.", icon: DollarSign },
];

const faqs = [
  { q: "Preciso pagar para começar?", a: "Não! O plano Free é gratuito para sempre." },
  { q: "Como funciona o sistema de afiliados?", a: "Faça upgrade para o plano Partner e receba links rastreáveis. Cada venda gera comissão automática." },
  { q: "Quanto tempo leva para ter resultado?", a: "Alguns membros reportam ganhos na primeira semana. A maioria atinge resultados em 30-60 dias." },
  { q: "Funciona em qualquer dispositivo?", a: "Sim! Navegador, celular, tablet. Também instala como app nativo (PWA)." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim, sem burocracia. Cancele pelo painel." },
];

/* ─── Reusable glass card ─── */
const Glass = ({ children, className = "", glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) => (
  <div className={`relative rounded-3xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl ${glow ? "shadow-[0_0_60px_-15px_hsl(330,81%,60%,0.25)]" : ""} ${className}`}>
    {/* Inner shine */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-[hsl(240,12%,3%)] text-white overflow-x-hidden">
      {/* ── Mesh background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[hsl(330,81%,60%)] opacity-[0.07] blur-[150px]" />
        <div className="absolute top-[30%] right-[-15%] w-[50vw] h-[50vw] rounded-full bg-[hsl(270,91%,65%)] opacity-[0.05] blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-[hsl(25,95%,53%)] opacity-[0.05] blur-[130px]" />
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* ═══ NAV ═══ */}
      <nav className="relative z-50 w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logoImg} alt={APP_NAME} className="h-10 w-10 rounded-xl object-cover" />
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/5 text-xs h-9 rounded-full px-4">
              <Link to="/auth">Login</Link>
            </Button>
            <Button asChild size="sm" className="bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] hover:bg-white/[0.14] text-white text-xs h-9 px-5 rounded-full font-semibold shadow-[0_0_20px_hsl(330,81%,60%,0.15)]">
              <Link to="/auth">Criar conta</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 pt-8 sm:pt-16 pb-20">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-2xl mx-auto text-center sm:text-left sm:mx-0">
            <Badge className="mb-6 bg-white/[0.06] backdrop-blur-xl text-white/60 border-white/[0.08] text-[10px] font-semibold px-4 py-1.5 rounded-full uppercase tracking-[0.15em] inline-flex">
              <Sparkles className="h-3 w-3 mr-1.5 text-[hsl(25,95%,53%)]" />
              Social Commerce #1 do Brasil
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-[0.95] tracking-tight">
              Transforme{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(25,95%,53%)] via-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)]">conteúdo</span>
              <br />
              em{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)]">renda real</span>
            </h1>

            <p className="text-sm sm:text-base text-white/35 mb-8 max-w-md leading-relaxed mx-auto sm:mx-0">
              A rede social onde cada post pode gerar receita. Junte-se a mais de 10.000 criadores que já monetizam.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-16">
              <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)] hover:opacity-90 text-white w-full sm:w-auto text-sm h-13 px-8 rounded-full font-bold border-0 shadow-[0_8px_40px_-8px_hsl(330,81%,60%,0.5)]">
                <Link to="/auth">
                  Começar grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="w-full sm:w-auto text-white/40 hover:text-white hover:bg-white/5 h-13 px-8 rounded-full text-sm"
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              >
                <Play className="mr-2 h-3.5 w-3.5" />
                Como funciona
              </Button>
            </div>
          </div>

          {/* Stats - glass cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <Glass key={stat.label} className="p-4 sm:p-5 text-center">
                <stat.icon className="h-4 w-4 mx-auto mb-2 text-[hsl(330,81%,60%)]" />
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-[10px] text-white/30 mt-0.5">{stat.label}</div>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="py-4 border-y border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap text-[11px] text-white/40">
            <div className="flex items-center gap-1.5"><Star className="h-3 w-3 text-amber-400 fill-amber-400" /><span className="font-bold text-white/70">4.9/5</span> avaliação</div>
            <div className="flex items-center gap-1.5"><Users className="h-3 w-3 text-[hsl(330,81%,60%)]" /><span className="font-bold text-white/70">10K+</span> criadores</div>
            <div className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-emerald-400" /><span className="font-bold text-white/70">R$1M+</span> pagos</div>
            <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-white/30" /><span className="font-bold text-white/70">&lt;1min</span> cadastro</div>
          </div>
        </div>
      </section>

      {/* ═══ PARA QUEM ═══ */}
      <section className="py-20 sm:py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Para quem é</p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Feito para quem quer <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(330,81%,60%)]">crescer</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Heart, title: "Criadores de Conteúdo", desc: "Monetize seus posts com links de afiliado rastreáveis." },
              { icon: Award, title: "Afiliados Profissionais", desc: "Painel completo de vendas e comissões automáticas." },
              { icon: Target, title: "Marcas & Agências", desc: "Acesse os top criadores e escale com social commerce." },
            ].map((item) => (
              <Glass key={item.title} className="p-6 group hover:border-white/[0.15] transition-all duration-500">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(330,81%,60%,0.2)] to-[hsl(270,91%,65%,0.1)] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:from-[hsl(330,81%,60%,0.4)] transition-all">
                  <item.icon className="h-5 w-5 text-[hsl(330,81%,60%)]" />
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-20 sm:py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Como funciona</p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Quatro passos para <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)]">começar a lucrar</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.n} className="relative text-center group">
                <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white/[0.06] to-transparent mb-1 select-none">{s.n}</div>
                <Glass className="p-5 mx-auto group-hover:border-[hsl(330,81%,60%,0.3)] transition-all duration-500">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[hsl(330,81%,60%,0.15)] to-transparent border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                    <s.icon className="h-5 w-5 text-[hsl(330,81%,60%)]" />
                  </div>
                  <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                  <p className="text-[11px] text-white/30 leading-relaxed">{s.desc}</p>
                </Glass>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-20 sm:py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Recursos</p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Tudo para <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(25,95%,53%)] via-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)]">crescer e monetizar</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <Glass key={f.title} className="p-5 group hover:border-[hsl(330,81%,60%,0.2)] transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(330,81%,60%,0.15)] to-transparent border border-white/[0.06] flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-[hsl(330,81%,60%)] group-hover:text-[hsl(25,95%,53%)] transition-colors" />
                </div>
                <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{f.desc}</p>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESULTS BANNER ═══ */}
      <section className="py-16 relative z-10">
        <div className="max-w-4xl mx-auto px-5">
          <Glass glow className="p-8 sm:p-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(330,81%,60%,0.08)] via-transparent to-[hsl(270,91%,65%,0.08)] pointer-events-none" />
            <div className="grid grid-cols-3 gap-4 text-center relative z-10">
              {[
                { v: "R$12.400", l: "Maior ganho mensal", icon: DollarSign },
                { v: "8.2%", l: "CTR médio top creators", icon: Eye },
                { v: "145K", l: "Views em um único post", icon: Zap },
              ].map((s) => (
                <div key={s.l}>
                  <s.icon className="h-5 w-5 mx-auto mb-2 text-[hsl(330,81%,60%)]" />
                  <div className="text-xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">{s.v}</div>
                  <p className="text-[10px] sm:text-xs text-white/35 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 sm:py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Depoimentos</p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Resultados <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)]">reais</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <Glass key={t.name} className="p-5 flex flex-col">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-white/45 leading-relaxed flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                  <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-[hsl(330,81%,60%,0.3)]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold">{t.name}</div>
                    <div className="text-[10px] text-white/30">{t.role}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 backdrop-blur px-2.5 py-1 rounded-full">{t.earnings}</span>
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="plans" className="py-20 sm:py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Planos</p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Escolha seu <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(25,95%,53%)] to-[hsl(330,81%,60%)]">plano</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <Glass key={plan.name} glow={plan.highlight} className={`p-5 flex flex-col transition-all duration-500 ${plan.highlight ? "border-[hsl(330,81%,60%,0.3)] scale-[1.02]" : "hover:border-white/[0.12]"}`}>
                {plan.highlight && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)] text-white border-0 text-[9px] font-bold px-3 rounded-full shadow-[0_4px_20px_hsl(330,81%,60%,0.3)]">
                    🔥 Popular
                  </Badge>
                )}
                <h3 className="font-bold text-sm">{plan.name}</h3>
                <p className="text-[10px] text-white/30 mt-0.5">{plan.desc}</p>
                <div className="my-4">
                  <span className="text-2xl font-extrabold">{plan.price}</span>
                  <span className="text-xs ml-1 text-white/25">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <Check className="h-3 w-3 shrink-0 text-[hsl(330,81%,60%)]" />
                      <span className="text-white/45">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="sm" className={`w-full rounded-full h-10 text-xs font-semibold ${
                  plan.highlight
                    ? "bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)] text-white hover:opacity-90 border-0 shadow-[0_4px_20px_hsl(330,81%,60%,0.3)]"
                    : "bg-white/[0.06] backdrop-blur border border-white/[0.08] text-white hover:bg-white/[0.1]"
                }`}>
                  <Link to="/auth">{plan.cta}<ChevronRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </Glass>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-8 max-w-2xl mx-auto">
            <Glass className="p-6 sm:p-8 text-center">
              <Badge className="bg-white/[0.06] backdrop-blur text-white/50 border-white/[0.06] text-[9px] mb-3 rounded-full">Enterprise</Badge>
              <h3 className="text-base font-bold mb-1">Plano PRO para Marcas</h3>
              <p className="text-xs text-white/30 mb-5">USD $9.999 + 3% · Setup completo e suporte dedicado.</p>
              <Button asChild size="sm" className="rounded-full text-xs h-10 px-6 bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)] hover:opacity-90 text-white border-0 font-semibold shadow-[0_4px_20px_hsl(330,81%,60%,0.3)]">
                <Link to="/auth">Falar com time comercial</Link>
              </Button>
            </Glass>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-20 sm:py-28 relative z-10">
        <div className="max-w-2xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Perguntas frequentes</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <Glass key={faq.q} className="overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between text-sm font-medium px-5 py-4 list-none text-white/70 hover:text-white transition-colors cursor-pointer">
                    {faq.q}
                    <ChevronRight className="h-3.5 w-3.5 text-white/20 transition-transform group-open:rotate-90 shrink-0 ml-3" />
                  </summary>
                  <div className="px-5 pb-4">
                    <p className="text-xs text-white/30 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 sm:py-32 relative z-10">
        <div className="max-w-2xl mx-auto px-5 text-center">
          <Glass glow className="p-10 sm:p-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Pronto para{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(25,95%,53%)] via-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)]">começar?</span>
            </h2>
            <p className="text-sm text-white/30 mb-8 max-w-md mx-auto">
              Junte-se a milhares de criadores que já monetizam seu conteúdo.
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-[hsl(330,81%,60%)] to-[hsl(270,91%,65%)] hover:opacity-90 text-white rounded-full h-13 px-10 text-sm font-bold border-0 shadow-[0_8px_40px_-8px_hsl(330,81%,60%,0.5)]">
              <Link to="/auth">Criar conta grátis<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <p className="text-[10px] text-white/15 mt-5">Sem cartão · Cancele quando quiser · Suporte em português</p>
          </Glass>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 border-t border-white/[0.05] relative z-10">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt={APP_NAME} className="h-6 w-6 rounded-lg object-cover" />
            <span className="font-bold text-xs">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/25">
            <Link to="/terms" className="hover:text-white transition-colors">Termos</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
          <p className="text-[10px] text-white/15">© 2026 {APP_NAME}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
