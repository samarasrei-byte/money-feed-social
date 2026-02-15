import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Shield, 
  Zap,
  Star,
  Check,
  Sparkles,
  ChevronRight,
  Play,
  BarChart3,
  Globe,
  MessageCircle,
  Heart,
  Award,
  Clock,
  Target,
  Rocket
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import logoImg from "@/assets/color-palette-ref.png";

const stats = [
  { value: "10K+", label: "Membros ativos" },
  { value: "R$1M+", label: "Em comissões pagas" },
  { value: "4.9★", label: "Avaliação média" },
  { value: "500+", label: "Marcas parceiras" },
];

const features = [
  {
    icon: Globe,
    title: "Rede Social Completa",
    description: "Perfil, feed, stories, comunidades e chat. Tudo integrado para você crescer organicamente.",
  },
  {
    icon: TrendingUp,
    title: "Sistema de Afiliados",
    description: "Links rastreáveis, comissões automáticas e dashboard completo de performance.",
  },
  {
    icon: DollarSign,
    title: "Monetização Nativa",
    description: "Cada post pode gerar receita. Métricas públicas de ganhos inspiram e convertem.",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description: "Pagamentos protegidos, dados criptografados e suporte dedicado 24/7.",
  },
  {
    icon: BarChart3,
    title: "Analytics Avançado",
    description: "Saiba exatamente o que funciona. CTR, conversões e ROI em tempo real.",
  },
  {
    icon: MessageCircle,
    title: "Comunidade Ativa",
    description: "Grupos temáticos, mentoria e networking com os maiores nomes do mercado.",
  },
];

const testimonials = [
  {
    name: "Marina Sales",
    role: "Top Afiliada",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    text: "Em 3 meses fui de zero a R$12.400/mês em comissões. A plataforma é incrível!",
    earnings: "R$ 87.500",
  },
  {
    name: "Pedro Henrique",
    role: "Creator & Afiliado",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    text: "O tracking transparente mudou tudo. Sei exatamente quanto cada conteúdo gera.",
    earnings: "R$ 45.200",
  },
  {
    name: "Rafa Digital",
    role: "Influencer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    text: "A prova social verificada no feed faz os seguidores confiarem. Conversão explodiu.",
    earnings: "R$ 120.000",
  },
  {
    name: "Beatriz Nova",
    role: "Iniciante",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    text: "Primeiro mês e já fiz R$2.100! O suporte da comunidade é sensacional.",
    earnings: "R$ 2.100",
  },
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    description: "Explore a plataforma sem compromisso",
    features: ["Perfil público", "Feed social", "Comunidades", "Ranking"],
    highlight: false,
    cta: "Começar grátis",
  },
  {
    name: "Starter",
    price: "R$ 65,90",
    period: "/mês",
    description: "Treinamento completo para iniciar",
    features: ["Tudo do Free", "Treinamento gamificado", "Missões e badges", "Onboarding vendas"],
    highlight: false,
    cta: "Começar agora",
  },
  {
    name: "Partner",
    price: "R$ 699",
    period: "/mês",
    description: "Para quem quer monetizar de verdade",
    features: ["Tudo do Starter", "Links de afiliado", "Painel de vendas", "Comissão maior", "Kit físico"],
    highlight: true,
    cta: "Quero monetizar",
  },
  {
    name: "Business",
    price: "R$ 998,10",
    period: "/mês",
    description: "Monte sua agência",
    features: ["Tudo do Partner", "Business Mode", "Criar afiliados", "B2B e relatórios"],
    highlight: false,
    cta: "Escalar negócio",
  },
];

const steps = [
  { step: "01", title: "Crie sua conta", description: "Cadastro rápido em menos de 1 minuto. Sem cartão de crédito.", icon: Rocket },
  { step: "02", title: "Monte seu perfil", description: "Adicione bio, foto e conecte suas redes sociais.", icon: Users },
  { step: "03", title: "Poste conteúdo", description: "Compartilhe no feed, participe de comunidades e cresça.", icon: Heart },
  { step: "04", title: "Monetize", description: "Ative seus links de afiliado e comece a ganhar comissões.", icon: DollarSign },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ─── HERO ─── */}
      <section className="relative min-h-[100dvh] flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-b from-foreground via-foreground/95 to-foreground/90" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-20 bg-primary" />
          <div className="absolute bottom-20 -right-20 w-[400px] h-[400px] rounded-full blur-[120px] opacity-10 bg-accent" />
        </div>

        {/* Nav */}
        <nav className="relative z-20 w-full border-b border-white/5">
          <div className="container flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt={APP_NAME} className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-semibold text-white text-sm hidden sm:block">{APP_NAME}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 text-xs">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-xs h-8 px-4 rounded-lg">
                <Link to="/auth">Criar conta</Link>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="container px-4 py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-6 bg-white/5 text-white/70 border-white/10 text-xs font-medium px-3 py-1">
                <Sparkles className="h-3 w-3 mr-1.5 text-primary" />
                Plataforma #1 de Social Commerce no Brasil
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.08] tracking-tight">
                Transforme seu
                <br />
                <span className="text-primary">conteúdo em renda</span>
              </h1>
              
              <p className="text-base sm:text-lg text-white/40 mb-8 max-w-xl mx-auto leading-relaxed">
                A rede social onde cada post pode gerar receita. Junte-se a 10.000+ criadores que já monetizam seu conteúdo.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto text-sm h-12 px-8 rounded-xl">
                  <Link to="/auth">
                    Criar conta grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/10 text-white/70 hover:bg-white/5 hover:text-white h-12 px-8 rounded-xl text-sm"
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Como funciona
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-[11px] sm:text-xs text-white/30 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <section className="py-4 bg-muted/50 border-y border-border/50">
        <div className="container px-4">
          <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="font-medium">4.9/5</span> de avaliação
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">10K+</span> criadores
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium">R$1M+</span> pagos em comissões
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span className="font-medium">&lt;1min</span> para começar
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-16 sm:py-24">
        <div className="container px-4">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Simples e rápido</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Como funciona
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Em 4 passos simples você já está monetizando seu conteúdo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div key={s.step} className="text-center group">
                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-1">Passo {s.step}</div>
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Recursos</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Tudo que você precisa para <span className="text-primary">crescer</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Rede social, afiliados e monetização em um só lugar.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="p-5 rounded-xl bg-background border border-border/50 hover:border-border transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 sm:py-24">
        <div className="container px-4">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Depoimentos</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Quem usa, <span className="text-primary">recomenda</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Veja o que nossos membros estão dizendo sobre a plataforma.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div key={t.name} className="p-5 rounded-xl bg-background border border-border/50 flex flex-col">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-border/50">
                  <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground">{t.role}</div>
                  </div>
                  <div className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {t.earnings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESULTS BANNER ─── */}
      <section className="py-12 sm:py-16 bg-foreground text-background">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">R$ 12.400</div>
              <p className="text-xs text-background/40">Maior ganho mensal de um afiliado</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">8.2%</div>
              <p className="text-xs text-background/40">CTR médio dos top creators</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">145K</div>
              <p className="text-xs text-background/40">Visualizações em um único post</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="plans" className="py-16 sm:py-24">
        <div className="container px-4">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Planos</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Escolha seu <span className="text-primary">plano</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Comece grátis e evolua conforme seus resultados crescem.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl p-5 flex flex-col ${
                  plan.highlight
                    ? "bg-primary/5 border-2 border-primary ring-1 ring-primary/20"
                    : "bg-background border border-border/50"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground border-0 text-[10px] px-3">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm">{plan.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{plan.description}</p>
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  size="sm"
                  className={`w-full rounded-lg h-9 text-xs ${
                    plan.highlight ? "bg-primary hover:bg-primary/90" : ""
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  <Link to="/auth">
                    {plan.cta}
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-10 max-w-2xl mx-auto">
            <div className="rounded-xl bg-foreground text-background p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5" />
              <div className="relative z-10">
                <Badge className="bg-white/10 text-background/70 border-white/10 text-[10px] mb-3">Enterprise</Badge>
                <h3 className="text-lg font-bold mb-1">Plano PRO para Marcas</h3>
                <p className="text-xs text-background/40 mb-5">
                  USD $9.999 + 3% · Setup completo, destaque no app e acesso aos top afiliados.
                </p>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 rounded-lg text-xs h-9 px-6">
                  <Link to="/auth">Falar com time comercial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ QUICK ─── */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="container px-4 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Dúvidas</p>
            <h2 className="text-2xl sm:text-3xl font-bold">Perguntas frequentes</h2>
          </div>
          {[
            { q: "Preciso pagar para começar?", a: "Não! O plano Free é gratuito para sempre. Você pode explorar a rede social, comunidades e ranking sem pagar nada." },
            { q: "Como funciona o sistema de afiliados?", a: "Ao fazer upgrade para o plano Partner, você recebe links de afiliado rastreáveis. Cada venda gerada pelo seu link gera comissão automática." },
            { q: "Quanto tempo leva para começar a ganhar?", a: "Depende do seu esforço e nicho. Alguns membros reportam ganhos já na primeira semana, outros no primeiro mês." },
            { q: "Posso usar em qualquer dispositivo?", a: "Sim! A plataforma funciona no navegador do celular, tablet e computador. Também pode ser instalada como app (PWA)." },
          ].map((faq) => (
            <details key={faq.q} className="group border-b border-border/50 py-4 cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-medium list-none">
                {faq.q}
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed pr-8">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-16 sm:py-24 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[100px]" />
        </div>
        <div className="container px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar seu
            <br className="hidden sm:block" />
            conteúdo em renda?
          </h2>
          <p className="text-sm text-background/40 mb-8 max-w-md mx-auto">
            Junte-se a milhares de criadores que já monetizam na {APP_NAME}. É grátis para começar.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 rounded-xl h-12 px-8 text-sm">
              <Link to="/auth">
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-[10px] text-background/20 mt-4">Sem cartão de crédito · Cancele a qualquer momento</p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-8 border-t border-border/50 bg-background">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt={APP_NAME} className="h-6 w-6 rounded-md object-cover" />
              <span className="font-semibold text-sm">{APP_NAME}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground transition-colors">Termos</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link>
            </div>
            <p className="text-[11px] text-muted-foreground">
              © 2026 {APP_NAME}. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
