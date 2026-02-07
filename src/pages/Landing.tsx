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
  Check
} from "lucide-react";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

const features = [
  {
    icon: Users,
    title: "Rede Social Gratuita",
    description: "Perfil público, feed, comunidades e ranking. Tudo grátis para começar.",
  },
  {
    icon: TrendingUp,
    title: "Sistema de Afiliados",
    description: "Ganhe comissões indicando produtos. Tracking completo e transparente.",
  },
  {
    icon: DollarSign,
    title: "Monetização Nativa",
    description: "Transforme seu conteúdo em renda. O feed gera dinheiro.",
  },
  {
    icon: Shield,
    title: "Plataforma Segura",
    description: "Dados protegidos, pagamentos seguros e suporte dedicado.",
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative container px-4 py-20 md:py-32">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <span className="text-xl font-bold text-primary-foreground">O</span>
              </div>
              <span className="font-display font-bold text-xl text-white">
                {APP_NAME}
              </span>
            </div>
            <Button asChild variant="secondary">
              <Link to="/auth">Entrar</Link>
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="h-3 w-3 mr-1" />
              Plataforma #1 de Social Commerce
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
              {APP_TAGLINE.split(" ").slice(0, 4).join(" ")}{" "}
              <span className="text-gradient-primary">
                {APP_TAGLINE.split(" ").slice(4).join(" ")}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se à rede social onde seu conteúdo gera dinheiro e o dinheiro 
              gera mais conteúdo. Comece grátis hoje.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-gradient-primary w-full sm:w-auto glow-primary">
                <Link to="/auth">
                  Criar conta grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-border text-primary-foreground hover:bg-muted/20">
                <Link to="#plans">Ver planos</Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning fill-warning" />
                <span>4.9/5 avaliação</span>
              </div>
              <div>10k+ membros</div>
              <div>R$ 1M+ em comissões</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Tudo que você precisa para crescer
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa que combina rede social, afiliados e 
              monetização em um só lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="py-20">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Escolha seu plano
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comece grátis e evolua conforme seus resultados crescem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.highlight
                    ? "border-primary shadow-xl scale-105 z-10"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-primary">Mais Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full ${
                      plan.highlight ? "bg-gradient-primary" : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <Link to="/auth">
                      {plan.price === "R$ 0" ? "Começar grátis" : "Escolher plano"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PRO Plan CTA */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-dark text-primary-foreground border-0">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-2">Plano PRO para Marcas</h3>
                <p className="text-primary-foreground/80 mb-4">
                  USD $9.999 + 3% | Setup completo, destaque no app e acesso aos 
                  top afiliados.
                </p>
                <Button variant="secondary" asChild>
                  <Link to="/auth">Falar com time comercial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Pronto para transformar seu conteúdo em renda?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão monetizando na Only Shop.
          </p>
          <Button asChild size="lg" variant="secondary" className="glow-accent">
            <Link to="/auth">
              Criar conta grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-primary p-1.5 rounded-lg">
                <span className="text-sm font-bold text-primary-foreground">O</span>
              </div>
              <span className="font-display font-bold">{APP_NAME}</span>
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
