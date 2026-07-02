import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Users, MapPin, Brain, Loader2, CheckCircle2, Rocket } from "lucide-react";

const LAUNCH = new Date("2026-07-18T00:00:00-03:00");
const ADMIN_WHATSAPP = "5511999999999"; // Super Admin WhatsApp

export default function Whitelist() {
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

  const signups = 4000 + Math.floor((Date.now() / 60000) % 87);

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
      toast({ title: "Você está na whitelist! 🎉" });

      // Encaminha contato para o Super Admin via WhatsApp
      if (cleanWa) {
        const msg = encodeURIComponent(
          `Novo cadastro Only Shop Whitelist\n\nPerfil: ${role === "creator" ? "Criador/Vendedor" : "Marca/Empresa"}\nE-mail: ${email}\nWhatsApp: ${cleanWa}${city ? `\nCidade: ${city}` : ""}${niche ? `\nNicho: ${niche}` : ""}`
        );
        setTimeout(() => {
          window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${msg}`, "_blank");
        }, 800);
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Whitelist Only Shop — Conecte-se antes do lançamento</title>
        <meta name="description" content="Entre na whitelist da Only Shop e conecte criadores e marcas com IA, geolocalização e match inteligente. Lançamento 18 de julho." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* neon glow bg */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16 space-y-12">
          {/* HERO */}
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-xs font-medium">
              <Sparkles className="h-3 w-3 text-primary" />
              Acesso antecipado · Lançamento 18 de julho
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
              Onde <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">criadores</span>
              <br />encontram <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">marcas</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
              IA que conecta você às oportunidades certas por nicho, cidade e performance. Entre na whitelist antes que as vagas acabem.
            </p>

            {/* countdown */}
            <div className="flex justify-center gap-2 md:gap-4 pt-2">
              {[
                { l: "dias", v: countdown.d },
                { l: "horas", v: countdown.h },
                { l: "min", v: countdown.m },
                { l: "seg", v: countdown.s },
              ].map((x) => (
                <div key={x.l} className="min-w-[64px] md:min-w-[84px] rounded-2xl bg-card border border-border/50 px-3 py-2 md:px-4 md:py-3">
                  <div className="text-2xl md:text-4xl font-black tabular-nums">{String(x.v).padStart(2, "0")}</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider">{x.l}</div>
                </div>
              ))}
            </div>

            {/* social proof */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{signups.toLocaleString("pt-BR")}</span> pessoas já se cadastraram — <span className="text-primary font-semibold">só falta você</span>
              </p>
            </div>
          </div>

          {/* FEATURES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Brain, title: "IA de Match", desc: "Algoritmo que sugere marcas e criadores compatíveis por nicho e performance." },
              { icon: MapPin, title: "Busca por Proximidade", desc: "Encontre parceiros na sua cidade e região para colaborações locais." },
              { icon: Users, title: "Conexão Direta", desc: "Marcas contratam criadores em poucos cliques. Sem intermediários." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur p-5 hover:border-primary/40 transition">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* FORM */}
          <div id="signup" className="max-w-xl mx-auto rounded-3xl border border-border/60 bg-card p-6 md:p-8 shadow-2xl shadow-primary/10">
            {done ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
                <h2 className="text-2xl font-black">Você está dentro! 🚀</h2>
                <p className="text-muted-foreground text-sm">
                  Enviamos seus dados para nossa equipe. Você receberá acesso antecipado no dia <b>18 de julho</b>.
                </p>
                <Button variant="outline" onClick={() => { setDone(false); setEmail(""); setWhatsapp(""); setCity(""); setNiche(""); }}>
                  Cadastrar outro
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-black">Garanta sua vaga</h2>
                  <p className="text-sm text-muted-foreground">Preencha em 30 segundos</p>
                </div>

                {/* role selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl">
                  {(["creator", "brand"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2.5 rounded-lg text-sm font-semibold transition ${
                        role === r ? "bg-background shadow text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {r === "creator" ? "Sou Criador" : "Sou Marca"}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" required placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="wa">WhatsApp <span className="text-muted-foreground text-xs">(contato direto do time)</span></Label>
                  <Input id="wa" type="tel" placeholder="(11) 99999-9999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" placeholder="São Paulo" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="niche">{role === "creator" ? "Seu nicho" : "Nicho buscado"}</Label>
                    <Input id="niche" placeholder="moda, tech..." value={niche} onChange={(e) => setNiche(e.target.value)} />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full font-bold text-base h-12" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Rocket className="h-4 w-4 mr-2" /> Entrar na Whitelist</>)}
                </Button>

                <p className="text-[11px] text-center text-muted-foreground">
                  Ao entrar, você concorda em receber comunicações da Only Shop.
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground pt-4">
            © Only Shop · Lançamento oficial em 18 de julho
          </p>
        </div>
      </div>
    </>
  );
}
