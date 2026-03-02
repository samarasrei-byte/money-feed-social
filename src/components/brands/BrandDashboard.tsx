import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brand, Product, Campaign } from "@/hooks/useBrand";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./ProductCard";
import { CreateProductSheet } from "./CreateProductSheet";
import { CreateCampaignSheet } from "./CreateCampaignSheet";
import { EditProductSheet } from "./EditProductSheet";
import { CampaignAffiliatesSheet } from "./CampaignAffiliatesSheet";
import { useCreatorCourses } from "@/hooks/useCourses";
import { Package, Megaphone, Users, TrendingUp, Building2, Globe, CheckCircle2, Clock, DollarSign, ShoppingCart, GraduationCap, Plus, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  brand: Brand;
  products: Product[];
  campaigns: Campaign[];
  onCreateProduct: (data: any) => Promise<any>;
  onCreateCampaign: (data: any) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateProduct: (id: string, data: Partial<Product>) => Promise<any>;
}

interface BrandStats {
  totalSales: number;
  totalRevenue: number;
  totalAffiliates: number;
  activeProducts: number;
}

export function BrandDashboard({ brand, products, campaigns, onCreateProduct, onCreateCampaign, onDeleteProduct, onUpdateProduct }: Props) {
  const [stats, setStats] = useState<BrandStats>({ totalSales: 0, totalRevenue: 0, totalAffiliates: 0, activeProducts: 0 });
  const [salesChart, setSalesChart] = useState<{ date: string; vendas: number; receita: number }[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { courses, createCourse } = useCreatorCourses(brand.id);

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const activeProducts = products.filter((p) => p.active);

  useEffect(() => {
    const fetchStats = async () => {
      // Count affiliates across all campaigns
      const campaignIds = campaigns.map((c) => c.id);
      let totalAffiliates = 0;
      if (campaignIds.length > 0) {
        const { count } = await supabase
          .from("campaign_affiliates")
          .select("*", { count: "exact", head: true })
          .in("campaign_id", campaignIds)
          .eq("status", "approved");
        totalAffiliates = count || 0;
      }

      // Count orders for brand products
      const productIds = products.map((p) => p.id);
      let totalSales = 0;
      let totalRevenue = 0;
      const chartMap = new Map<string, { vendas: number; receita: number }>();

      if (productIds.length > 0) {
        const { data: orderItems } = await supabase
          .from("order_items")
          .select("quantity, unit_price, created_at")
          .in("product_id", productIds);

        if (orderItems) {
          totalSales = orderItems.length;
          totalRevenue = orderItems.reduce((s, oi) => s + Number(oi.unit_price) * oi.quantity, 0);

          orderItems.forEach((oi) => {
            const day = new Date(oi.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
            const existing = chartMap.get(day) || { vendas: 0, receita: 0 };
            chartMap.set(day, { vendas: existing.vendas + oi.quantity, receita: existing.receita + Number(oi.unit_price) * oi.quantity });
          });
        }
      }

      setStats({ totalSales, totalRevenue, totalAffiliates, activeProducts: activeProducts.length });

      // Last 14 days chart data
      const chartData: typeof salesChart = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        const existing = chartMap.get(label);
        chartData.push({ date: label, vendas: existing?.vendas || 0, receita: existing?.receita || 0 });
      }
      setSalesChart(chartData);
    };

    fetchStats();
  }, [campaigns, products]);

  const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Brand Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0 overflow-hidden">
          {brand.logo_url ? (
            <img src={brand.logo_url} alt={brand.name} className="h-full w-full rounded-2xl object-cover" />
          ) : (
            <Building2 className="h-8 w-8 text-primary-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-display font-bold truncate">{brand.name}</h1>
            {brand.verified ? (
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            ) : (
              <Badge variant="secondary" className="text-[10px] shrink-0">
                <Clock className="h-3 w-3 mr-0.5" /> Pendente
              </Badge>
            )}
          </div>
          {brand.website && (
            <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
              <Globe className="h-3.5 w-3.5" /> {brand.website.replace(/https?:\/\//, "")}
            </a>
          )}
          {brand.description && <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{brand.description}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon: Package, label: "Produtos", value: activeProducts.length, color: "text-primary" },
          { icon: ShoppingCart, label: "Vendas", value: stats.totalSales, color: "text-accent" },
          { icon: DollarSign, label: "Receita", value: fmt(stats.totalRevenue), color: "text-success" },
          { icon: Users, label: "Afiliados", value: stats.totalAffiliates, color: "text-primary" },
        ].map((s) => (
          <Card key={s.label} className="border-border/50">
            <CardContent className="p-3 text-center">
              <s.icon className={`h-4 w-4 mx-auto ${s.color} mb-1`} />
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-[9px] text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Chart */}
      <Card className="border-border/50">
        <CardHeader className="pb-2 p-4">
          <CardTitle className="text-sm font-semibold">Vendas — Últimos 14 dias</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChart}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area type="monotone" dataKey="vendas" stroke="hsl(var(--primary))" fill="url(#salesGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="products">
        <TabsList className="w-full">
          <TabsTrigger value="products" className="flex-1">Produtos ({products.length})</TabsTrigger>
          <TabsTrigger value="courses" className="flex-1">Cursos ({courses.length})</TabsTrigger>
          <TabsTrigger value="campaigns" className="flex-1">Campanhas ({campaigns.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <CreateProductSheet onCreate={onCreateProduct} />
          </div>
          {products.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum produto cadastrado</p>
              <p className="text-sm">Crie seu primeiro produto para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onDelete={onDeleteProduct} onEdit={setEditProduct} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="courses" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              className="bg-gradient-primary border-0 text-primary-foreground"
              onClick={async () => {
                try {
                  const data = await createCourse({ title: "Novo Curso", published: false });
                  if (data) navigate(`/courses/${(data as any).id}/builder`);
                } catch {}
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Novo Curso
            </Button>
          </div>
          {courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhum curso criado</p>
              <p className="text-sm">Crie seu primeiro curso digital</p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((c) => (
                <Card key={c.id} className="border-border/50 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => navigate(`/courses/${c.id}/builder`)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.students_count} alunos</p>
                    </div>
                    <Badge variant={c.published ? "default" : "secondary"} className={c.published ? "bg-success text-success-foreground border-0" : ""}>
                      {c.published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <CreateCampaignSheet products={products} onCreate={onCreateCampaign} />
          </div>
          {campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Nenhuma campanha criada</p>
              <p className="text-sm">Crie campanhas para atrair afiliados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <Card key={c.id} className="border-border/50">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">{c.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <CampaignAffiliatesSheet campaignId={c.id} campaignName={c.name} />
                        <Badge variant={c.status === "active" ? "default" : "secondary"} className={c.status === "active" ? "bg-success text-success-foreground border-0" : ""}>
                          {c.status === "active" ? "Ativa" : "Encerrada"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {c.description && <p className="text-xs text-muted-foreground mb-2">{c.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {c.bonus_percentage && Number(c.bonus_percentage) > 0 && <span className="text-success font-medium">+{Number(c.bonus_percentage)}% bônus</span>}
                      {c.max_affiliates && <span><Users className="h-3 w-3 inline mr-0.5" /> Máx. {c.max_affiliates}</span>}
                      {c.ends_at && <span>Até {new Date(c.ends_at).toLocaleDateString("pt-BR")}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Product Sheet */}
      <EditProductSheet
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        onUpdate={onUpdateProduct}
      />
    </div>
  );
}
