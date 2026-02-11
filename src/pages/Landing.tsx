import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Download,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import logoImg from "@/assets/color-palette-ref.png";

const features = [
  {
    icon: Users,
    title: "Rede Social Gratuita",
    description: "Perfil público, feed, comunidades e ranking. Tudo grátis para começar.",
    gradient: "from-pink-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Sistema de Afiliados",
    description: "Ganhe comissões indicando produtos. Tracking completo e transparente.",
    gradient: "from-orange-500 to-pink-500",
  },
  {
    icon: DollarSign,
    title: "Monetização Nativa",
    description: "Transforme seu conteúdo em renda. O feed gera dinheiro.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Plataforma Segura",
    description: "Dados protegidos, pagamentos seguros e suporte dedicado.",
    gradient: "from-purple-500 to-indigo-500",
  },
];

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "para sempre",
    description: "Comece agora e explore a plataforma",
    features: ["Perfil público", "Feed social", "Comunidades", "Ranking"],
    highlight: false,
  },
  {
    name: "Starter",
    price: "R$ 65,90",
    period: "/mês",
    description: "Treinamento completo para começar",
    features: [
      "Tudo do Free",
      "Treinamento gamificado",
      "Missões e badges",
      "Onboarding para vendas",
    ],
    highlight: false,
  },
  {
    name: "Partner",
    price: "R$ 699",
    period: "/mês",
    description: "Para quem quer monetizar de verdade",
    features: [
      "Tudo do Starter",
      "Links de afiliado",
      "Painel de vendas",
      "Comissão maior",
      "Kit físico",
    ],
    highlight: true,
  },
  {
    name: "Business",
    price: "R$ 998,10",
    period: "/mês",
    description: "Crie sua própria agência",
    features: [
      "Tudo do Partner",
      "Business Mode",
      "Criar afiliados",
      "B2B e relatórios",
    ],
    highlight: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full blur-[120px] opacity-30 bg-gradient-primary" />
          <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20" style={{ background: "hsl(25 95% 53%)" }} />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full blur-[100px] opacity-15" style={{ background: "hsl(270 91% 65%)" }} />
        </div>

        {/* Nav */}
        <nav className="relative z-20 container flex items-center justify-between px-4 py-5">
          <div className="flex items-center">
            <img src={logoImg} alt="OnlyShop" className="h-12 w-12 rounded-xl object-cover" />
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
              <Link to="/install">
                <Download className="h-4 w-4 mr-2" />
                Instalar
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-primary border-0 glow-primary">
              <Link to="/auth">Entrar</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="container px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="mb-8 bg-white/10 text-white/90 border-white/20 backdrop-blur-sm px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Plataforma #1 de Social Commerce
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 leading-[1.1] tracking-tight">
                {APP_TAGLINE.split(" ").slice(0, 4).join(" ")}{" "}
                <span className="text-gradient-primary">
                  {APP_TAGLINE.split(" ").slice(4).join(" ")}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                Junte-se à rede social onde seu conteúdo gera dinheiro e o dinheiro 
                gera mais conteúdo. Comece grátis hoje.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-primary w-full sm:w-auto glow-primary text-base h-13 px-8 rounded-2xl">
                  <Link to="/auth">
                    Criar conta grátis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-13 px-8 rounded-2xl">
                  <Link to="#plans">Ver planos</Link>
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-16 flex items-center justify-center gap-8 text-sm text-white/50">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  <span>4.9/5 avaliação</span>
                </div>
                <div className="h-4 w-px bg-white/20" />
                <div>10k+ membros</div>
                <div className="h-4 w-px bg-white/20" />
                <div>R$ 1M+ em comissões</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2.5 bg-white/40 rounded-full animate-float" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" /> Recursos
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              Tudo que você precisa para{" "}
              <span className="text-gradient-primary">crescer</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Uma plataforma completa que combina rede social, afiliados e 
              monetização em um só lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg card-hover group bg-card">
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <DollarSign className="h-3 w-3 mr-1" /> Planos
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
              Escolha seu{" "}
              <span className="text-gradient-primary">plano</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comece grátis e evolua conforme seus resultados crescem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative card-hover ${
                  plan.highlight
                    ? "border-primary shadow-xl ring-2 ring-primary/20 scale-[1.03] z-10"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-primary border-0 shadow-lg px-4">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-success" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full rounded-xl h-11 ${
                      plan.highlight ? "bg-gradient-primary border-0 glow-primary" : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <Link to="/auth" className="gap-2">
                      {plan.price === "R$ 0" ? "Começar grátis" : "Escolher plano"}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PRO Plan CTA */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-dark text-white border-0 overflow-hidden relative">
              <div className="absolute inset-0 opacity-20 bg-gradient-primary" />
              <CardContent className="py-10 relative z-10">
                <Badge className="bg-white/10 text-white border-white/20 mb-4">Enterprise</Badge>
                <h3 className="text-2xl font-bold mb-3">Plano PRO para Marcas</h3>
                <p className="text-white/70 mb-6">
                  USD $9.999 + 3% | Setup completo, destaque no app e acesso aos 
                  top afiliados.
                </p>
                <Button variant="secondary" asChild size="lg" className="rounded-xl">
                  <Link to="/auth">Falar com time comercial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            Pronto para transformar seu<br />conteúdo em renda?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão monetizando na Only Shop.
          </p>
          <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-2xl h-13 px-10 shadow-xl">
            <Link to="/auth">
              Criar conta grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t bg-background">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="OnlyShop" className="h-8 w-8 rounded-lg object-cover" />
              <span className="font-display font-bold text-lg">{APP_NAME}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Only Shop. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
