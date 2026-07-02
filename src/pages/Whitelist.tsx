import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles, Users, MapPin, Brain, Loader2, CheckCircle2, Rocket,
  Zap, TrendingUp, ShieldCheck, ArrowRight,
} from "lucide-react";
import logo from "@/assets/onlyshop-logo.png";

const LAUNCH = new Date("2026-07-18T00:00:00-03:00");
const ADMIN_WHATSAPP = "5511999999999";

export default function Waitlist() {
  const { toast } = useToast();
  const [role, setRole] = useState<"creator" | "brand">("creator");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [city, setCity] = useState("");
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, LAUNCH.getTime() - Date.now());
      setCountdown({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const signups = useMemo(() => 4127 + Math.floor((Date.now() / 60000) % 213), []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ variant: "destructive", title: "Informe seu e-mail" });
      return;
    }
    setLoading(true);
    try {
      const cleanWa = whatsapp.replace(/\D/g, "");
      const { error } = await supabase.from("waitlist").insert({
        email: email.trim().toLowerCase(),
        whatsapp: cleanWa || null,
        role,
        city: city.trim() || null,
        niche: niche.trim() || null,
      });
      if (error && !error.message.includes("duplicate")) throw error;

      setDone(true);
      toast({ title: "Você está na waitlist! 🎉" });

      if (cleanWa) {
        const msg = encodeURIComponent(
          `Novo cadastro Only Shop Waitlist\n\nPerfil: ${role === "creator" ? "Criador/Vendedor" : "Marca/Empresa"}\nE-mail: ${email}\nWhatsApp: ${cleanWa}${city ? `\nCidade: ${city}` : ""}${niche ? `\nNicho: ${niche}` : ""}`
        );
        setTimeout(() => window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, "_blank"), 800);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Ambient neon glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/25 rounded-full blur-[160px]" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 -right-40 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_75%)]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Only Shop" className="h-8 w-8 object-contain" width={32} height={32} />
            <span className="font-black text-lg tracking-tight">
              Only <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Shop</span>
            </span>
          </Link>
          <a href="#signup" className="hidden sm:inline-flex">
            <Button size="sm" className="font-semibold">
              Entrar na Waitlist <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-16 md:space-y-24">
        {/* HERO */}
        <section className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Acesso antecipado · Lançamento 18 de julho
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[0.95]">
            Onde <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-accent bg-clip-text text-transparent">criadores</span>
            <br className="hidden sm:block" /> encontram <span className="bg-gradient-to-r from-accent via-cyan-400 to-primary bg-clip-text text-transparent">marcas</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-xl leading-relaxed">
            IA que conecta você às oportunidades certas por nicho, cidade e performance.
            <span className="hidden sm:inline"> Entre na waitlist antes que as vagas acabem.</span>
          </p>

          {/* countdown */}
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 pt-2">
            {[
              { l: "dias", v: countdown.d },
              { l: "horas", v: countdown.h },
              { l: "min", v: countdown.m },
              { l: "seg", v: countdown.s },
            ].map((x) => (
              <div
                key={x.l}
                className="min-w-[70px] sm:min-w-[84px] md:min-w-[100px] rounded-2xl bg-card/80 backdrop-blur border border-border/60 px-3 py-3 md:px-5 md:py-4 shadow-lg shadow-primary/5"
              >
                <div className="text-3xl md:text-5xl font-black tabular-nums bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {String(x.v).padStart(2, "0")}
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{x.l}</div>
              </div>
            ))}
          </div>

          {/* social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent shadow-lg"
                />
              ))}
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              <span className="font-black text-foreground text-lg">{signups.toLocaleString("pt-BR")}</span> pessoas já se cadastraram —{" "}
              <span className="text-primary font-semibold">só falta você</span>
            </p>
          </div>

          <div className="pt-2">
            <a href="#signup">
              <Button size="lg" className="font-bold text-base h-12 px-8 shadow-2xl shadow-primary/30">
                <Rocket className="h-4 w-4 mr-2" /> Garantir minha vaga
              </Button>
            </a>
          </div>
        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "IA de Match", desc: "Algoritmo que sugere marcas e criadores compatíveis por nicho e performance." },
            { icon: MapPin, title: "Busca por Proximidade", desc: "Encontre parceiros na sua cidade e região para colabs locais." },
            { icon: Users, title: "Conexão Direta", desc: "Marcas contratam criadores em poucos cliques. Sem intermediários." },
            { icon: Zap, title: "Live Shop", desc: "Venda ao vivo com checkout embutido — comissão instantânea." },
            { icon: TrendingUp, title: "Ranking & XP", desc: "Suba de nível vendendo. Bronze → Elite com recompensas reais." },
            { icon: ShieldCheck, title: "Pagamento via PIX", desc: "Saque suas comissões direto na Wallet interna, sem burocracia." },
          ].map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border/50 bg-card/40 backdrop-blur p-5 md:p-6 hover:border-primary/50 hover:bg-card/70 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* FORM */}
        <section
          id="signup"
          className="max-w-xl mx-auto rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 md:p-10 shadow-2xl shadow-primary/20 scroll-mt-20"
        >
          {done ? (
            <div className="text-center py-10 space-y-4 animate-scale-in">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl shadow-primary/40">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-black">Você está dentro! 🚀</h2>
              <p className="text-muted-foreground text-base">
                Enviamos seus dados para nossa equipe. Você receberá acesso antecipado no dia{" "}
                <b className="text-foreground">18 de julho</b>.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setDone(false); setEmail(""); setWhatsapp(""); setCity(""); setNiche("");
                }}
              >
                Cadastrar outro
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-3xl font-black">Garanta sua vaga</h2>
                <p className="text-sm text-muted-foreground mt-1">Preencha em 30 segundos</p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl">
                {(["creator", "brand"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-lg text-sm font-semibold transition-all ${
                      role === r
                        ? "bg-background shadow-md text-foreground scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "creator" ? "🎥 Sou Criador" : "🏢 Sou Marca"}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">E-mail *</Label>
                <Input id="email" type="email" required placeholder="voce@email.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="wa">
                  WhatsApp <span className="text-muted-foreground text-xs">(contato direto do time)</span>
                </Label>
                <Input id="wa" type="tel" placeholder="(11) 99999-9999"
                  value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="h-11" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" placeholder="São Paulo"
                    value={city} onChange={(e) => setCity(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="niche">{role === "creator" ? "Seu nicho" : "Nicho buscado"}</Label>
                  <Input id="niche" placeholder="moda, tech, beleza..."
                    value={niche} onChange={(e) => setNiche(e.target.value)} className="h-11" />
                </div>
              </div>

              <Button type="submit" size="lg"
                className="w-full font-bold text-base h-12 shadow-xl shadow-primary/30"
                disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <><Rocket className="h-4 w-4 mr-2" /> Entrar na Waitlist</>
                )}
              </Button>

              <p className="text-[11px] text-center text-muted-foreground">
                Ao entrar, você concorda em receber comunicações da Only Shop.
              </p>
            </form>
          )}
        </section>

        <footer className="text-center text-xs text-muted-foreground pt-4 pb-8 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <img src={logo} alt="" className="h-5 w-5 object-contain opacity-70" />
            <span>© Only Shop · Lançamento oficial em 18 de julho</span>
          </div>
          <div className="flex justify-center gap-4">
            <Link to="/terms" className="hover:text-foreground">Termos</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacidade</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
