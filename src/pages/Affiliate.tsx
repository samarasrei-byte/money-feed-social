import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link2, Plus, Copy, TrendingUp, MousePointer, ShoppingCart, DollarSign,
  Loader2, Trash2, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { validateAffiliateUrl } from "@/lib/urlValidation";

interface AffiliateLink {
  id: string; name: string; short_code: string; destination_url: string;
  clicks_count: number; conversions_count: number; created_at: string;
}

interface Commission {
  id: string; amount: number; percentage: number; status: string;
  created_at: string; paid_at: string | null;
}

interface DashboardStats {
  totalClicks: number; totalConversions: number; totalEarnings: number;
  pendingEarnings: number; conversionRate: number;
}

export default function Affiliate() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalClicks: 0, totalConversions: 0, totalEarnings: 0, pendingEarnings: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState({ name: "", destinationUrl: "" });

  const isAffiliate = userRole?.role && ["affiliate", "agency", "brand", "admin"].includes(userRole.role);

  useEffect(() => { if (user && isAffiliate) fetchData(); else setLoading(false); }, [user, isAffiliate]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: linksData } = await supabase.from("affiliate_links").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setLinks(linksData || []);
      const { data: commissionsData } = await supabase.from("commissions").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setCommissions(commissionsData || []);
      const totalClicks = linksData?.reduce((s, l) => s + l.clicks_count, 0) || 0;
      const totalConversions = linksData?.reduce((s, l) => s + l.conversions_count, 0) || 0;
      const totalEarnings = commissionsData?.filter(c => c.status === "paid").reduce((s, c) => s + Number(c.amount), 0) || 0;
      const pendingEarnings = commissionsData?.filter(c => c.status === "pending").reduce((s, c) => s + Number(c.amount), 0) || 0;
      setStats({ totalClicks, totalConversions, totalEarnings, pendingEarnings, conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0 });
    } catch (error) { console.error("Error:", error); } finally { setLoading(false); }
  };

  const handleCreateLink = async () => {
    if (!newLink.name.trim() || !newLink.destinationUrl.trim() || !user) return;
    const urlValidation = validateAffiliateUrl(newLink.destinationUrl);
    if (!urlValidation.isValid) { toast({ variant: "destructive", title: "URL inválida", description: urlValidation.error }); return; }
    setIsCreating(true);
    try {
      await supabase.from("affiliate_links").insert({ user_id: user.id, name: newLink.name.trim(), destination_url: newLink.destinationUrl.trim(), short_code: Math.random().toString(36).substring(2, 8).toUpperCase() });
      toast({ title: "Link criado!" }); setNewLink({ name: "", destinationUrl: "" }); fetchData();
    } catch (error: any) { toast({ variant: "destructive", title: "Erro", description: error.message }); } finally { setIsCreating(false); }
  };

  const handleCopyLink = async (shortCode: string) => { await navigator.clipboard.writeText(`${window.location.origin}/r/${shortCode}`); toast({ title: "Link copiado!" }); };
  const handleDeleteLink = async (id: string) => { await supabase.from("affiliate_links").delete().eq("id", id); toast({ title: "Link removido" }); setLinks(prev => prev.filter(l => l.id !== id)); };
  const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground/30" /></div>;

  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 p-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center"><Link2 className="h-5 w-5 text-muted-foreground/30" /></div>
      <h2 className="text-base font-bold">Faça login</h2>
      <p className="text-xs text-muted-foreground/40 max-w-xs">Acesse para ver seu painel de afiliados</p>
      <Button asChild size="sm" className="mt-2 rounded-full"><a href="/auth">Entrar</a></Button>
    </div>
  );

  if (!isAffiliate) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 p-6 text-center">
      <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-primary/50" /></div>
      <h2 className="text-base font-bold">Torne-se Afiliado</h2>
      <p className="text-xs text-muted-foreground/40 max-w-xs">Upgrade para Partner ou superior</p>
      <Button asChild size="sm" className="mt-2 rounded-full"><a href="/#plans">Ver Planos</a></Button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-lg font-bold tracking-tight">Afiliados</h1>
        <p className="text-[11px] text-muted-foreground/40">Links e comissões</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: MousePointer, label: "Cliques", value: stats.totalClicks.toString(), color: "text-primary" },
          { icon: ShoppingCart, label: "Conversões", value: stats.totalConversions.toString(), color: "text-success" },
          { icon: DollarSign, label: "Recebido", value: fmt(stats.totalEarnings), color: "text-success" },
          { icon: Clock, label: "Pendente", value: fmt(stats.pendingEarnings), color: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-2xl bg-muted/20 border border-border/15">
            <div className="flex items-center gap-1.5 mb-2">
              <s.icon className={cn("h-3.5 w-3.5", s.color)} />
              <span className="text-[9px] text-muted-foreground/30 uppercase tracking-widest font-semibold">{s.label}</span>
            </div>
            <p className="text-lg font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Conversion */}
      <div className="p-4 rounded-2xl bg-muted/20 border border-border/15">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Conversão</span>
          <span className="text-xs font-bold">{stats.conversionRate.toFixed(1)}%</span>
        </div>
        <Progress value={stats.conversionRate} className="h-1" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="links" className="w-full">
        <TabsList className="w-full h-9 p-0.5 bg-muted/30 rounded-full border-0">
          <TabsTrigger value="links" className="flex-1 text-[11px] h-8 rounded-full">Links</TabsTrigger>
          <TabsTrigger value="commissions" className="flex-1 text-[11px] h-8 rounded-full">Comissões</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-4 space-y-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full gap-2 h-10 text-xs rounded-full bg-foreground text-background hover:bg-foreground/90">
                <Plus className="h-3.5 w-3.5" />Criar novo link
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-3xl border-border/20">
              <SheetHeader>
                <SheetTitle className="text-base">Criar Link</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground/40">Link rastreável para afiliado</SheetDescription>
              </SheetHeader>
              <div className="space-y-3 py-4">
                <div><Label className="text-[11px] text-muted-foreground/50">Nome</Label><Input placeholder="Ex: Curso de Marketing" className="h-10 text-sm rounded-xl mt-1 border-border/20" value={newLink.name} onChange={(e) => setNewLink(p => ({ ...p, name: e.target.value }))} /></div>
                <div><Label className="text-[11px] text-muted-foreground/50">URL destino</Label><Input placeholder="https://..." type="url" className="h-10 text-sm rounded-xl mt-1 border-border/20" value={newLink.destinationUrl} onChange={(e) => setNewLink(p => ({ ...p, destinationUrl: e.target.value }))} /></div>
              </div>
              <SheetFooter className="gap-2">
                <SheetClose asChild><Button variant="ghost" size="sm" className="rounded-full">Cancelar</Button></SheetClose>
                <Button size="sm" onClick={handleCreateLink} disabled={!newLink.name.trim() || !newLink.destinationUrl.trim() || isCreating} className="rounded-full bg-foreground text-background">
                  {isCreating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Criar"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {links.length === 0 ? (
            <div className="py-16 text-center"><Link2 className="h-8 w-8 mx-auto text-muted-foreground/10 mb-3" /><p className="text-xs text-muted-foreground/30">Nenhum link criado</p></div>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div key={link.id} className="p-4 rounded-2xl border border-border/15 bg-background">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{link.name}</p>
                      <p className="text-[10px] text-muted-foreground/30 truncate mt-0.5">{link.destination_url}</p>
                      <div className="flex items-center gap-3 mt-2 text-[11px]">
                        <span className="flex items-center gap-1 text-muted-foreground/40"><MousePointer className="h-3 w-3" />{link.clicks_count}</span>
                        <span className="flex items-center gap-1 text-success"><ShoppingCart className="h-3 w-3" />{link.conversions_count}</span>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground/30" onClick={() => handleCopyLink(link.short_code)}><Copy className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-destructive/30 hover:text-destructive" onClick={() => handleDeleteLink(link.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="commissions" className="mt-4 space-y-2">
          {commissions.length === 0 ? (
            <div className="py-16 text-center"><DollarSign className="h-8 w-8 mx-auto text-muted-foreground/10 mb-3" /><p className="text-xs text-muted-foreground/30">Nenhuma comissão</p></div>
          ) : (
            commissions.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl border border-border/15 bg-background flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm text-success">{fmt(Number(c.amount))}</p>
                  <p className="text-[10px] text-muted-foreground/30 mt-0.5">{c.percentage}% · {formatDistanceToNow(new Date(c.created_at), { addSuffix: true, locale: ptBR })}</p>
                </div>
                <Badge variant="secondary" className={cn("text-[9px] rounded-full border-0", c.status === "paid" ? "bg-success/10 text-success" : "bg-muted/30 text-muted-foreground/40")}>
                  {c.status === "paid" ? "Pago" : "Pendente"}
                </Badge>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
