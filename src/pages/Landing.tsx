import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Users, TrendingUp, DollarSign, Shield, Zap, Star, Check,
  Sparkles, ChevronRight, Play, BarChart3, Globe, MessageCircle, Heart,
  Clock, Rocket
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import logoImg from "@/assets/color-palette-ref.png";

const stats = [
  { value: "10K+", label: "Criadores" },
  { value: "R$1M+", label: "Comissões pagas" },
  { value: "4.9★", label: "Avaliação" },
  { value: "500+", label: "Marcas" },
];

const features = [
  { icon: Globe, title: "Rede Social", desc: "Feed, stories, comunidades e chat integrados." },
  { icon: TrendingUp, title: "Afiliados", desc: "Links rastreáveis e comissões automáticas." },
  { icon: DollarSign, title: "Monetização", desc: "Cada post pode gerar receita real." },
  { icon: Shield, title: "Segurança", desc: "Dados criptografados e pagamentos protegidos." },
  { icon: BarChart3, title: "Analytics", desc: "CTR, conversões e ROI em tempo real." },
  { icon: MessageCircle, title: "Comunidade", desc: "Grupos, mentoria e networking." },
];

const testimonials = [
  { name: "Marina Sales", role: "Top Afiliada", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face", text: "Em 3 meses fui de zero a R$12.400/mês em comissões.", earnings: "R$87.5K" },
  { name: "Pedro Henrique", role: "Creator", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", text: "O tracking transparente mudou tudo pra mim.", earnings: "R$45.2K" },
  { name: "Rafa Digital", role: "Influencer", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", text: "A prova social verificada explodiu minhas conversões.", earnings: "R$120K" },
  { name: "Beatriz Nova", role: "Iniciante", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", text: "Primeiro mês e já fiz R$2.100!", earnings: "R$2.1K" },
];

const plans = [
  { name: "Free", price: "R$0", period: "para sempre", desc: "Explore sem compromisso", features: ["Perfil público", "Feed social", "Comunidades", "Ranking"], highlight: false, cta: "Começar grátis" },
  { name: "Starter", price: "R$65,90", period: "/mês", desc: "Treinamento completo", features: ["Tudo do Free", "Treinamento gamificado", "Missões e badges", "Onboarding vendas"], highlight: false, cta: "Começar agora" },
  { name: "Partner", price: "R$699", period: "/mês", desc: "Monetize de verdade", features: ["Tudo do Starter", "Links de afiliado", "Painel de vendas", "Comissão maior", "Kit físico"], highlight: true, cta: "Quero monetizar" },
  { name: "Business", price: "R$998", period: "/mês", desc: "Monte sua agência", features: ["Tudo do Partner", "Business Mode", "Criar afiliados", "B2B e relatórios"], highlight: false, cta: "Escalar negócio" },
];

const steps = [
  { n: "01", title: "Crie sua conta", desc: "Cadastro rápido, sem cartão.", icon: Rocket },
  { n: "02", title: "Monte seu perfil", desc: "Bio, foto e redes sociais.", icon: Users },
  { n: "03", title: "Poste conteúdo", desc: "Feed, comunidades e stories.", icon: Heart },
  { n: "04", title: "Monetize", desc: "Links de afiliado e comissões.", icon: DollarSign },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[100dvh] flex flex-col bg-foreground">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.08] bg-primary" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full blur-[120px] opacity-[0.05] bg-accent" />
        </div>

        <nav className="relative z-20 w-full">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt={APP_NAME} className="h-7 w-7 rounded-lg object-cover" />
              <span className="font-bold text-white text-sm tracking-tight">{APP_NAME}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/5 text-xs h-8 rounded-full">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-white text-foreground hover:bg-white/90 text-xs h-8 px-5 rounded-full font-semibold">
                <Link to="/auth">Criar conta</Link>
              </Button>
            </div>
          </div>
        </nav>

        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 w-full">
            <div className="max-w-2xl">
              <Badge className="mb-8 bg-white/[0.04] text-white/50 border-white/[0.06] text-[10px] font-medium px-3 py-1.5 rounded-full uppercase tracking-widest">
                <Sparkles className="h-3 w-3 mr-1.5 text-primary" />
                Social Commerce #1 do Brasil
              </Badge>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] tracking-tight">
                Transforme
                <br />
                conteúdo
                <br />
                <span className="text-gradient-primary">em renda</span>
              </h1>
              
              <p className="text-base sm:text-lg text-white/25 mb-10 max-w-md leading-relaxed">
                A rede social onde cada post gera receita. Junte-se a 10.000+ criadores.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3 mb-16">
                <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 w-full sm:w-auto text-sm h-12 px-8 rounded-full font-semibold">
                  <Link to="/auth">
                    Começar grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white/[0.06] text-white/40 hover:bg-white/5 hover:text-white h-12 px-8 rounded-full text-sm"
                  onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Play className="mr-2 h-3.5 w-3.5" />
                  Como funciona
                </Button>
              </div>

              <div className="flex gap-8 sm:gap-12">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-[10px] text-white/20 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-5 border-b border-border/30">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-center gap-8 flex-wrap text-[11px] text-muted-foreground/60">
            <div className="flex items-center gap-1.5"><Star className="h-3 w-3 text-amber-500 fill-amber-500" /><span className="font-semibold">4.9/5</span></div>
            <div className="flex items-center gap-1.5"><Users className="h-3 w-3 text-primary" /><span className="font-semibold">10K+</span> criadores</div>
            <div className="flex items-center gap-1.5"><TrendingUp className="h-3 w-3 text-success" /><span className="font-semibold">R$1M+</span> pagos</div>
            <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /><span className="font-semibold">&lt;1min</span> para começar</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Como funciona</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Quatro passos simples</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.n} className="text-center group">
                <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/5 transition-colors">
                  <s.icon className="h-6 w-6 text-foreground/60 group-hover:text-primary transition-colors" />
                </div>
                <div className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">{s.n}</div>
                <h3 className="font-semibold text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-muted-foreground/60 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Recursos</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Tudo para <span className="text-primary">crescer</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-background border border-border/30 hover:border-border/60 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                  <f.icon className="h-5 w-5 text-foreground/50 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Depoimentos</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Quem usa, <span className="text-primary">recomenda</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="p-5 rounded-2xl bg-background border border-border/30 flex flex-col">
                <div className="flex items-center gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed flex-1 mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-border/20">
                  <img src={t.avatar} alt={t.name} className="h-8 w-8 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold">{t.name}</div>
                    <div className="text-[10px] text-muted-foreground/40">{t.role}</div>
                  </div>
                  <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">{t.earnings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-16 bg-foreground">
        <div className="max-w-4xl mx-auto px-5 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { v: "R$12.400", l: "Maior ganho mensal" },
            { v: "8.2%", l: "CTR médio top creators" },
            { v: "145K", l: "Views em um post" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.v}</div>
              <p className="text-[11px] text-white/20">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="plans" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-16">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">Planos</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Escolha seu <span className="text-primary">plano</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-5 flex flex-col ${plan.highlight ? "bg-foreground text-white ring-1 ring-white/10" : "bg-background border border-border/30"}`}>
                {plan.highlight && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-white border-0 text-[9px] px-3 rounded-full">Popular</Badge>
                )}
                <h3 className="font-semibold text-sm">{plan.name}</h3>
                <p className={`text-[10px] mt-0.5 ${plan.highlight ? "text-white/30" : "text-muted-foreground/40"}`}>{plan.desc}</p>
                <div className="my-4">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className={`text-xs ml-1 ${plan.highlight ? "text-white/30" : "text-muted-foreground/40"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 shrink-0 ${plan.highlight ? "text-primary" : "text-primary"}`} />
                      <span className={plan.highlight ? "text-white/60" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild size="sm" className={`w-full rounded-full h-9 text-xs ${plan.highlight ? "bg-white text-foreground hover:bg-white/90" : ""}`} variant={plan.highlight ? "default" : "outline"}>
                  <Link to="/auth">{plan.cta}<ChevronRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="rounded-2xl bg-muted/30 border border-border/30 p-6 sm:p-8 text-center">
              <Badge variant="secondary" className="text-[9px] mb-3 rounded-full">Enterprise</Badge>
              <h3 className="text-base font-bold mb-1">Plano PRO para Marcas</h3>
              <p className="text-xs text-muted-foreground/40 mb-5">USD $9.999 + 3% · Setup completo e acesso aos top afiliados.</p>
              <Button asChild size="sm" className="rounded-full text-xs h-9 px-6">
                <Link to="/auth">Falar com time comercial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-2xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] mb-3">FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Perguntas frequentes</h2>
          </div>
          {[
            { q: "Preciso pagar para começar?", a: "Não! O plano Free é gratuito para sempre." },
            { q: "Como funciona o sistema de afiliados?", a: "Upgrade para Partner e receba links rastreáveis com comissão automática." },
            { q: "Quanto tempo leva para ganhar?", a: "Alguns membros reportam ganhos já na primeira semana." },
            { q: "Funciona em qualquer dispositivo?", a: "Sim! Navegador, celular, tablet. Também instala como app (PWA)." },
          ].map((faq) => (
            <details key={faq.q} className="group border-b border-border/20 py-4 cursor-pointer">
              <summary className="flex items-center justify-between text-sm font-medium list-none">{faq.q}<ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30 transition-transform group-open:rotate-90" /></summary>
              <p className="mt-2 text-xs text-muted-foreground/50 leading-relaxed pr-8">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 bg-foreground relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-60 h-60 bg-primary/[0.06] rounded-full blur-[120px]" />
        </div>
        <div className="max-w-2xl mx-auto px-5 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Pronto para começar?
          </h2>
          <p className="text-sm text-white/20 mb-8 max-w-md mx-auto">
            Junte-se a milhares de criadores que já monetizam na {APP_NAME}.
          </p>
          <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-full h-12 px-10 text-sm font-semibold">
            <Link to="/auth">Criar conta grátis<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <p className="text-[10px] text-white/10 mt-4">Sem cartão · Cancele quando quiser</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-border/20">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt={APP_NAME} className="h-5 w-5 rounded object-cover" />
            <span className="font-semibold text-xs">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground/40">
            <Link to="/terms" className="hover:text-foreground transition-colors">Termos</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link>
          </div>
          <p className="text-[10px] text-muted-foreground/30">© 2026 {APP_NAME}</p>
        </div>
      </footer>
    </div>
  );
}
