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
  { value: "4.9★", label: "Nota dos usuários", icon: Star },
  { value: "500+", label: "Marcas parceiras", icon: Target },
];

const features = [
  { icon: Globe, title: "Rede Social Integrada", desc: "Feed, stories, comunidades e chat em um só lugar. Engaje sua audiência sem sair da plataforma." },
  { icon: TrendingUp, title: "Sistema de Afiliados", desc: "Links rastreáveis com dashboard em tempo real. Cada clique e conversão monitorados automaticamente." },
  { icon: DollarSign, title: "Monetização Real", desc: "Transforme cada post em receita. Comissões automáticas depositadas direto na sua conta." },
  { icon: Shield, title: "Segurança Total", desc: "Dados criptografados, pagamentos protegidos e tracking 100% transparente." },
  { icon: BarChart3, title: "Analytics Avançado", desc: "CTR, conversões, ROI e métricas de engajamento. Tome decisões baseadas em dados reais." },
  { icon: MessageCircle, title: "Comunidade Ativa", desc: "Grupos temáticos, mentoria entre pares e networking com os top criadores do Brasil." },
];

const testimonials = [
  { name: "Marina Sales", role: "Top Afiliada · 3 meses", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", text: "Em 3 meses fui de zero a R$12.400/mês em comissões. O tracking transparente faz toda diferença.", earnings: "R$87.5K total" },
  { name: "Pedro Henrique", role: "Creator · 6 meses", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", text: "O tracking transparente e as métricas em tempo real mudaram completamente meu jogo.", earnings: "R$45.2K total" },
  { name: "Rafa Digital", role: "Influencer · 1 ano", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", text: "A prova social verificada explodiu minhas conversões. Meu CTR subiu de 2% pra 8%.", earnings: "R$120K total" },
  { name: "Beatriz Nova", role: "Iniciante · 1 mês", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", text: "Primeiro mês e já fiz R$2.100! A comunidade ajuda demais, não me senti perdida nenhuma vez.", earnings: "R$2.1K total" },
];

const plans = [
  { name: "Free", price: "R$0", period: "para sempre", desc: "Explore a plataforma", features: ["Perfil público", "Feed social completo", "Comunidades ilimitadas", "Ranking de criadores"], highlight: false, cta: "Começar grátis" },
  { name: "Starter", price: "R$65,90", period: "/mês", desc: "Aprenda a monetizar", features: ["Tudo do Free", "Treinamento gamificado", "Missões com recompensas", "Onboarding de vendas", "Suporte prioritário"], highlight: false, cta: "Começar agora" },
  { name: "Partner", price: "R$699", period: "/mês", desc: "Monetize de verdade", features: ["Tudo do Starter", "Links de afiliado ilimitados", "Painel de vendas completo", "Comissão turbinada", "Kit físico exclusivo", "Acesso VIP"], highlight: true, cta: "Quero monetizar" },
  { name: "Business", price: "R$998", period: "/mês", desc: "Escale seu negócio", features: ["Tudo do Partner", "Business Mode ativo", "Criar rede de afiliados", "Relatórios B2B", "API de integração"], highlight: false, cta: "Escalar negócio" },
];

const steps = [
  { n: "01", title: "Crie sua conta", desc: "Cadastro em menos de 1 minuto. Sem cartão de crédito.", icon: Rocket },
  { n: "02", title: "Monte seu perfil", desc: "Conecte suas redes e personalize sua marca pessoal.", icon: Users },
  { n: "03", title: "Poste e engaje", desc: "Crie conteúdo, entre em comunidades e construa audiência.", icon: Heart },
  { n: "04", title: "Monetize", desc: "Ative links de afiliado e comece a gerar receita por post.", icon: DollarSign },
];

const faqs = [
  { q: "Preciso pagar para começar?", a: "Não! O plano Free é gratuito para sempre. Você pode explorar o feed, comunidades e ranking sem pagar nada." },
  { q: "Como funciona o sistema de afiliados?", a: "Faça upgrade para o plano Partner e receba links rastreáveis exclusivos. Cada venda feita pelo seu link gera comissão automática depositada na sua conta." },
  { q: "Quanto tempo leva para ter resultado?", a: "Depende do seu engajamento! Alguns membros reportam ganhos já na primeira semana. A maioria atinge resultados consistentes em 30-60 dias." },
  { q: "Funciona em qualquer dispositivo?", a: "Sim! Navegador, celular, tablet. Também instala como aplicativo nativo (PWA) direto no seu celular." },
  { q: "Posso cancelar a qualquer momento?", a: "Sim, sem burocracia. Cancele pelo próprio painel. Seu acesso continua até o final do período pago." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[hsl(240,10%,4%)] text-white overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[100dvh] flex flex-col">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[180px] opacity-20 bg-gradient-primary" />
          <div className="absolute bottom-20 -right-20 w-[350px] h-[350px] rounded-full blur-[140px] opacity-10 bg-[hsl(270,91%,65%)]" />
          <div className="absolute top-1/2 -left-20 w-[200px] h-[200px] rounded-full blur-[100px] opacity-10 bg-[hsl(25,95%,53%)]" />
        </div>

        {/* Nav */}
        <nav className="relative z-20 w-full">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt={APP_NAME} className="h-9 w-9 rounded-xl object-cover" />
              <span className="font-bold text-base tracking-tight">{APP_NAME}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/5 text-xs h-9 rounded-full px-4">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-primary hover:opacity-90 text-white text-xs h-9 px-5 rounded-full font-semibold border-0">
                <Link to="/auth">Criar conta</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-5 py-12 w-full">
            <div className="max-w-2xl">
              <Badge className="mb-6 bg-white/[0.06] text-white/70 border-white/[0.08] text-[10px] font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-[0.15em]">
                <Sparkles className="h-3 w-3 mr-1.5 text-[hsl(25,95%,53%)]" />
                Social Commerce #1 do Brasil
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-5 leading-[1] tracking-tight">
                Transforme{" "}
                <span className="text-gradient-primary">conteúdo</span>
                <br />
                em{" "}
                <span className="text-gradient-primary">renda real</span>
              </h1>

              <p className="text-sm sm:text-base text-white/40 mb-8 max-w-md leading-relaxed">
                A rede social onde cada post pode gerar receita. Junte-se a mais de 10.000 criadores que já monetizam seu conteúdo.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-12">
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white w-full sm:w-auto text-sm h-12 px-8 rounded-full font-bold border-0 shadow-[0_0_30px_hsl(330,81%,60%,0.3)]">
                  <Link to="/auth">
                    Começar grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/[0.04] border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white h-12 px-8 rounded-full text-sm"
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Play className="mr-2 h-3.5 w-3.5" />
                  Como funciona
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3.5 text-center">
                    <stat.icon className="h-4 w-4 mx-auto mb-2 text-white/30" />
                    <div className="text-lg sm:text-xl font-bold">{stat.value}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <div className="w-5 h-8 rounded-full border-2 border-white/10 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/30 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF BAR ═══ */}
      <section className="py-5 border-y border-white/[0.06] bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap text-[11px] text-white/50">
            <div className="flex items-center gap-1.5"><Star className="h-3 w-3 text-amber-400 fill-amber-400" /><span className="font-bold text-white/80">4.9/5</span> avaliação</div>
            <div className="flex items-center gap-1.5"><Users className="h-3 w-3 text-[hsl(330,81%,60%)]" /><span className="font-bold text-white/80">10K+</span> criadores</div>
            <div className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-emerald-400" /><span className="font-bold text-white/80">R$1M+</span> pagos</div>
            <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-white/40" /><span className="font-bold text-white/80">&lt;1min</span> cadastro</div>
          </div>
        </div>
      </section>

      {/* ═══ PARA QUEM ═══ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Para quem é</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Feito para quem quer <span className="text-gradient-primary">crescer e lucrar</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: Heart, title: "Criadores de Conteúdo", desc: "Monetize seus posts, stories e comunidade com links de afiliado rastreáveis." },
              { icon: Award, title: "Afiliados Profissionais", desc: "Painel completo de vendas, métricas em tempo real e comissões automáticas." },
              { icon: Target, title: "Marcas & Agências", desc: "Acesse os top criadores do Brasil e escale suas vendas com social commerce." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all group">
                <div className="w-11 h-11 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Como funciona</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Quatro passos para <span className="text-gradient-primary">começar a lucrar</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.n} className="relative text-center group">
                {/* Step number */}
                <div className="text-5xl font-black text-white/[0.04] mb-2">{s.n}</div>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto mb-3 group-hover:bg-gradient-primary group-hover:border-transparent transition-all">
                  <s.icon className="h-5 w-5 text-white/50 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{s.desc}</p>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 border-t border-dashed border-white/[0.08]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Recursos</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Tudo para <span className="text-gradient-primary">crescer e monetizar</span>
            </h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">Uma plataforma completa que une rede social, afiliados e analytics em um só lugar.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[hsl(330,81%,60%,0.3)] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center mb-4 group-hover:bg-gradient-primary transition-all">
                  <f.icon className="h-5 w-5 text-white/40 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RESULTS BANNER ═══ */}
      <section className="py-14 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[hsl(240,10%,4%,0.3)]" />
        <div className="max-w-4xl mx-auto px-5 grid grid-cols-3 gap-4 text-center relative z-10">
          {[
            { v: "R$12.400", l: "Maior ganho mensal", icon: DollarSign },
            { v: "8.2%", l: "CTR médio top creators", icon: Eye },
            { v: "145K", l: "Views em um único post", icon: Zap },
          ].map((s) => (
            <div key={s.l}>
              <s.icon className="h-5 w-5 mx-auto mb-2 text-white/60" />
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white mb-0.5">{s.v}</div>
              <p className="text-[10px] sm:text-xs text-white/60">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Depoimentos</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Resultados <span className="text-gradient-primary">reais</span> de quem usa
            </h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">Veja o que criadores reais estão conquistando com a plataforma.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-white/50 leading-relaxed flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                  <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold">{t.name}</div>
                    <div className="text-[10px] text-white/30">{t.role}</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">{t.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="plans" className="py-16 sm:py-24 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-14">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">Planos</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Escolha seu <span className="text-gradient-primary">plano</span>
            </h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">Comece grátis e evolua conforme seus resultados crescem.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-5 flex flex-col transition-all ${
                plan.highlight
                  ? "bg-gradient-primary ring-1 ring-white/20 shadow-[0_0_40px_hsl(330,81%,60%,0.2)]"
                  : "bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]"
              }`}>
                {plan.highlight && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white text-[hsl(240,10%,4%)] border-0 text-[9px] font-bold px-3 rounded-full shadow-lg">
                    🔥 Popular
                  </Badge>
                )}
                <h3 className="font-bold text-sm">{plan.name}</h3>
                <p className={`text-[10px] mt-0.5 ${plan.highlight ? "text-white/60" : "text-white/30"}`}>{plan.desc}</p>
                <div className="my-4">
                  <span className="text-2xl font-extrabold">{plan.price}</span>
                  <span className={`text-xs ml-1 ${plan.highlight ? "text-white/50" : "text-white/30"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 shrink-0 ${plan.highlight ? "text-white" : "text-[hsl(330,81%,60%)]"}`} />
                      <span className={plan.highlight ? "text-white/80" : "text-white/50"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="sm" className={`w-full rounded-full h-10 text-xs font-semibold ${
                  plan.highlight
                    ? "bg-white text-[hsl(240,10%,4%)] hover:bg-white/90"
                    : "bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1]"
                }`}>
                  <Link to="/auth">{plan.cta}<ChevronRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 sm:p-8 text-center">
              <Badge className="bg-white/[0.06] text-white/60 border-white/[0.08] text-[9px] mb-3 rounded-full">Enterprise</Badge>
              <h3 className="text-base font-bold mb-1">Plano PRO para Marcas</h3>
              <p className="text-xs text-white/30 mb-5">USD $9.999 + 3% · Setup completo, acesso exclusivo aos top afiliados e suporte dedicado.</p>
              <Button asChild size="sm" className="rounded-full text-xs h-10 px-6 bg-gradient-primary hover:opacity-90 text-white border-0 font-semibold">
                <Link to="/auth">Falar com time comercial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold text-[hsl(330,81%,60%)] uppercase tracking-[0.2em] mb-3">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Perguntas frequentes</h2>
          </div>
          {faqs.map((faq) => (
            <details key={faq.q} className="group border-b border-white/[0.06] py-4 cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-medium list-none text-white/80 hover:text-white transition-colors">
                {faq.q}
                <ChevronRight className="h-3.5 w-3.5 text-white/20 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-xs text-white/35 leading-relaxed pr-8">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-primary rounded-full blur-[200px] opacity-10" />
        </div>
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Pronto para <span className="text-gradient-primary">começar?</span>
          </h2>
          <p className="text-sm text-white/30 mb-8 max-w-md mx-auto">
            Junte-se a milhares de criadores que já monetizam seu conteúdo na {APP_NAME}. Comece grátis agora.
          </p>
          <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-white rounded-full h-13 px-10 text-sm font-bold border-0 shadow-[0_0_40px_hsl(330,81%,60%,0.3)]">
            <Link to="/auth">Criar conta grátis<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <p className="text-[10px] text-white/15 mt-5">Sem cartão · Cancele quando quiser · Suporte em português</p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt={APP_NAME} className="h-6 w-6 rounded-lg object-cover" />
            <span className="font-bold text-xs">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-white/30">
            <Link to="/terms" className="hover:text-white transition-colors">Termos</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidade</Link>
          </div>
          <p className="text-[10px] text-white/20">© 2026 {APP_NAME}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
