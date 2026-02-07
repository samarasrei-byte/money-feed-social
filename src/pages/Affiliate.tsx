import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Link2, 
  Plus, 
  Copy, 
  ExternalLink,
  TrendingUp,
  MousePointer,
  ShoppingCart,
  DollarSign,
  Loader2,
  MoreHorizontal,
  Trash2,
  BarChart3,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AffiliateLink {
  id: string;
  name: string;
  short_code: string;
  destination_url: string;
  clicks_count: number;
  conversions_count: number;
  created_at: string;
}

interface Commission {
  id: string;
  amount: number;
  percentage: number;
  status: string;
  created_at: string;
  paid_at: string | null;
}

interface DashboardStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
}

export default function Affiliate() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClicks: 0,
    totalConversions: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState({ name: "", destinationUrl: "" });

  const isAffiliate = userRole?.role && ["affiliate", "agency", "brand", "admin"].includes(userRole.role);

  useEffect(() => {
    if (user && isAffiliate) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user, isAffiliate]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from("affiliate_links")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (linksError) throw linksError;
      setLinks(linksData || []);

      // Fetch commissions
      const { data: commissionsData, error: commissionsError } = await supabase
        .from("commissions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (commissionsError) throw commissionsError;
      setCommissions(commissionsData || []);

      // Calculate stats
      const totalClicks = linksData?.reduce((sum, l) => sum + l.clicks_count, 0) || 0;
      const totalConversions = linksData?.reduce((sum, l) => sum + l.conversions_count, 0) || 0;
      const totalEarnings = commissionsData
        ?.filter(c => c.status === "paid")
        .reduce((sum, c) => sum + Number(c.amount), 0) || 0;
      const pendingEarnings = commissionsData
        ?.filter(c => c.status === "pending")
        .reduce((sum, c) => sum + Number(c.amount), 0) || 0;

      setStats({
        totalClicks,
        totalConversions,
        totalEarnings,
        pendingEarnings,
        conversionRate: totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0,
      });
    } catch (error) {
      console.error("Error fetching affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateLink = async () => {
    if (!newLink.name.trim() || !newLink.destinationUrl.trim() || !user) return;

    setIsCreating(true);
    try {
      const { error } = await supabase.from("affiliate_links").insert({
        user_id: user.id,
        name: newLink.name.trim(),
        destination_url: newLink.destinationUrl.trim(),
        short_code: generateShortCode(),
      });

      if (error) throw error;

      toast({ title: "Link criado!" });
      setNewLink({ name: "", destinationUrl: "" });
      fetchData();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async (shortCode: string) => {
    const fullUrl = `${window.location.origin}/r/${shortCode}`;
    await navigator.clipboard.writeText(fullUrl);
    toast({ title: "Link copiado!" });
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await supabase.from("affiliate_links").delete().eq("id", id);
      toast({ title: "Link removido" });
      setLinks(prev => prev.filter(l => l.id !== id));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6 text-center">
        <Link2 className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Faça login para acessar</h2>
        <p className="text-muted-foreground">
          Você precisa estar logado para ver seu painel de afiliados
        </p>
        <Button asChild className="bg-gradient-primary">
          <a href="/auth">Entrar</a>
        </Button>
      </div>
    );
  }

  if (!isAffiliate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6 text-center">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-semibold">Torne-se um Afiliado</h2>
        <p className="text-muted-foreground max-w-sm">
          Upgrade para o plano Partner ou superior para acessar links de afiliado, 
          métricas e comissões
        </p>
        <Button className="bg-gradient-primary">
          Ver Planos
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel de Afiliados</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie seus links e acompanhe suas comissões
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MousePointer className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalClicks}</p>
                <p className="text-xs text-muted-foreground">Cliques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalConversions}</p>
                <p className="text-xs text-muted-foreground">Conversões</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                <p className="text-xs text-muted-foreground">Recebido</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.pendingEarnings)}</p>
                <p className="text-xs text-muted-foreground">Pendente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Taxa de Conversão</p>
            <p className="text-sm font-bold">{stats.conversionRate.toFixed(1)}%</p>
          </div>
          <Progress value={stats.conversionRate} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="links" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="links" className="flex-1">Links</TabsTrigger>
          <TabsTrigger value="commissions" className="flex-1">Comissões</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-4 space-y-4">
          {/* Create Link Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="w-full gap-2 bg-gradient-primary">
                <Plus className="h-4 w-4" />
                Criar novo link
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh] rounded-t-3xl">
              <SheetHeader>
                <SheetTitle>Criar Link de Afiliado</SheetTitle>
                <SheetDescription>
                  Crie um link rastreável para seus produtos
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-6">
                <div className="space-y-2">
                  <Label>Nome do link</Label>
                  <Input
                    placeholder="Ex: Curso de Marketing"
                    value={newLink.name}
                    onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL de destino</Label>
                  <Input
                    placeholder="https://..."
                    type="url"
                    value={newLink.destinationUrl}
                    onChange={(e) => setNewLink(prev => ({ ...prev, destinationUrl: e.target.value }))}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </SheetClose>
                <Button
                  onClick={handleCreateLink}
                  disabled={!newLink.name.trim() || !newLink.destinationUrl.trim() || isCreating}
                  className="bg-gradient-primary"
                >
                  {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar"}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Links List */}
          {links.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum link criado ainda
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <Card key={link.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{link.name}</p>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {link.destination_url}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <span className="flex items-center gap-1">
                            <MousePointer className="h-3 w-3" />
                            {link.clicks_count} cliques
                          </span>
                          <span className="flex items-center gap-1 text-success">
                            <ShoppingCart className="h-3 w-3" />
                            {link.conversions_count} vendas
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => handleCopyLink(link.short_code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="commissions" className="mt-4 space-y-3">
          {commissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma comissão ainda
                </p>
              </CardContent>
            </Card>
          ) : (
            commissions.map((commission) => (
              <Card key={commission.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg text-success">
                        {formatCurrency(Number(commission.amount))}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {commission.percentage}% de comissão •{" "}
                        {formatDistanceToNow(new Date(commission.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={commission.status === "paid" ? "default" : "secondary"}
                      className={cn(
                        commission.status === "paid" && "bg-success text-success-foreground"
                      )}
                    >
                      {commission.status === "paid" ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
