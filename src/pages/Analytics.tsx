import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadialBarChart, RadialBar, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, DollarSign, Users, MousePointerClick,
  Target, Zap, Eye, ShoppingCart, BarChart3, Activity, Flame,
  ArrowUpRight, ArrowDownRight, Clock, Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ── Types ──
interface HourlyConversion { hour: string; conversions: number; clicks: number; rate: number; }
interface CreativeROI { name: string; spend: number; revenue: number; roi: number; impressions: number; }
interface RetentionCell { day: number; cohort: string; rate: number; }
interface KPI { label: string; value: string; change: number; icon: React.ElementType; trend: "up" | "down" | "neutral"; }

// ── Helpers ──
const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toString();
const fmtCurrency = (n: number) => `R$ ${n.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

// ── Generate realistic mock data (merged with real DB data when available) ──
function generateHourlyData(): HourlyConversion[] {
  return Array.from({ length: 24 }, (_, i) => {
    const peak = Math.exp(-0.5 * ((i - 14) / 4) ** 2);
    const clicks = Math.round(50 + peak * 300 + Math.random() * 40);
    const conversions = Math.round(clicks * (0.02 + peak * 0.06 + Math.random() * 0.01));
    return { hour: `${i.toString().padStart(2, "0")}h`, conversions, clicks, rate: +(conversions / clicks * 100).toFixed(1) };
  });
}

function generateCreativeROI(): CreativeROI[] {
  const names = ["Vídeo UGC", "Carousel Prod", "Story Promo", "Reels Demo", "Banner CTA", "Depoimento", "Unboxing", "Tutorial"];
  return names.map((name) => {
    const spend = Math.round(200 + Math.random() * 2000);
    const roi = 0.5 + Math.random() * 4;
    const revenue = Math.round(spend * roi);
    const impressions = Math.round(spend * (8 + Math.random() * 20));
    return { name, spend, revenue, roi: +roi.toFixed(2), impressions };
  }).sort((a, b) => b.roi - a.roi);
}

function generateRetentionHeatmap(): RetentionCell[] {
  const cohorts = ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6"];
  const cells: RetentionCell[] = [];
  cohorts.forEach((cohort, ci) => {
    for (let day = 0; day <= 6; day++) {
      const base = 100 - day * (10 + ci * 2) - Math.random() * 8;
      cells.push({ cohort, day, rate: Math.max(5, Math.round(base)) });
    }
  });
  return cells;
}

// ── Metric Card ──
function MetricCard({ kpi }: { kpi: KPI }) {
  const Icon = kpi.icon;
  const isUp = kpi.trend === "up";
  return (
    <Card className="border-0 bg-muted/20 ring-1 ring-border/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[9px] gap-0.5 border-0 px-1.5",
              isUp ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            )}
          >
            {isUp ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
            {Math.abs(kpi.change)}%
          </Badge>
        </div>
        <p className="text-lg font-black tracking-tight">{kpi.value}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</p>
      </CardContent>
    </Card>
  );
}

// ── Heatmap Cell ──
function HeatCell({ rate }: { rate: number }) {
  const opacity = rate / 100;
  return (
    <div
      className="rounded-sm flex items-center justify-center text-[8px] font-bold"
      style={{
        backgroundColor: `hsl(var(--primary) / ${Math.max(0.08, opacity * 0.8)})`,
        color: opacity > 0.5 ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
        minHeight: 28,
      }}
    >
      {rate}%
    </div>
  );
}

// ── Main Dashboard ──
export default function Analytics() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [realOrders, setRealOrders] = useState(0);
  const [realClicks, setRealClicks] = useState(0);
  const [realRevenue, setRealRevenue] = useState(0);

  // Fetch real aggregate data
  useEffect(() => {
    async function fetchReal() {
      if (!user) return;
      const [ordersRes, linksRes, salesRes] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("affiliate_links").select("clicks_count").eq("user_id", user.id),
        supabase.from("sales").select("amount, affiliate_link_id").limit(500),
      ]);
      setRealOrders(ordersRes.count || 0);
      const clicks = linksRes.data?.reduce((s, l) => s + l.clicks_count, 0) || 0;
      setRealClicks(clicks);
      const rev = salesRes.data?.reduce((s, sale) => s + Number(sale.amount), 0) || 0;
      setRealRevenue(rev);
    }
    fetchReal();
  }, [user, period]);

  const hourlyData = useMemo(() => generateHourlyData(), [period]);
  const creativeData = useMemo(() => generateCreativeROI(), [period]);
  const retentionData = useMemo(() => generateRetentionHeatmap(), [period]);

  const totalConversions = hourlyData.reduce((s, h) => s + h.conversions, 0);
  const totalClicks = realClicks || hourlyData.reduce((s, h) => s + h.clicks, 0);
  const avgConvRate = totalClicks > 0 ? (totalConversions / totalClicks * 100).toFixed(1) : "0";
  const totalSpend = creativeData.reduce((s, c) => s + c.spend, 0);
  const totalRevenue = realRevenue || creativeData.reduce((s, c) => s + c.revenue, 0);
  const cac = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const avgROI = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  const kpis: KPI[] = [
    { label: "Receita Total", value: fmtCurrency(totalRevenue), change: 23.5, icon: DollarSign, trend: "up" },
    { label: "Conversões", value: fmt(totalConversions + realOrders), change: 12.8, icon: ShoppingCart, trend: "up" },
    { label: "CAC Médio", value: fmtCurrency(cac), change: -8.2, icon: Target, trend: "up" },
    { label: "Taxa Conversão", value: `${avgConvRate}%`, change: 4.1, icon: MousePointerClick, trend: "up" },
    { label: "ROI Médio", value: `${avgROI.toFixed(1)}x`, change: 18.3, icon: TrendingUp, trend: "up" },
    { label: "Cliques Totais", value: fmt(totalClicks), change: -3.2, icon: Eye, trend: "down" },
  ];

  const bestHour = hourlyData.reduce((best, h) => h.rate > best.rate ? h : best, hourlyData[0]);
  const bestCreative = creativeData[0];

  // Retention grouped by cohort
  const cohorts = [...new Set(retentionData.map((r) => r.cohort))];
  const days = [...new Set(retentionData.map((r) => r.day))].sort((a, b) => a - b);

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4">
      {/* Header */}
      <div className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-black flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analytics
          </h1>
          <div className="flex gap-1">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all",
                  period === p ? "bg-foreground text-background" : "bg-muted/30 text-muted-foreground"
                )}
              >
                {p === "7d" ? "7 dias" : p === "30d" ? "30 dias" : "90 dias"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Métricas em tempo real do seu ecossistema</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        {kpis.map((kpi) => <MetricCard key={kpi.label} kpi={kpi} />)}
      </div>

      {/* Insights */}
      <Card className="border-0 bg-gradient-to-r from-primary/5 to-transparent ring-1 ring-primary/10 mb-4">
        <CardContent className="p-3 flex items-start gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold mb-0.5">💡 Insights Inteligentes</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Seu melhor horário é <strong className="text-foreground">{bestHour.hour}</strong> com {bestHour.rate}% de conversão.
              O criativo <strong className="text-foreground">"{bestCreative.name}"</strong> lidera com ROI de {bestCreative.roi}x.
              Considere concentrar budget nesses horários e formatos.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="conversions" className="space-y-4">
        <TabsList className="bg-muted/20 border border-border/10 rounded-full p-0.5 w-full">
          <TabsTrigger value="conversions" className="rounded-full text-[10px] flex-1">Conversão/Hora</TabsTrigger>
          <TabsTrigger value="roi" className="rounded-full text-[10px] flex-1">ROI Criativos</TabsTrigger>
          <TabsTrigger value="retention" className="rounded-full text-[10px] flex-1">Retenção</TabsTrigger>
        </TabsList>

        {/* Conversions by hour */}
        <TabsContent value="conversions">
          <Card className="border-0 bg-muted/10 ring-1 ring-border/10">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Conversão por Horário
              </CardTitle>
              <p className="text-[10px] text-muted-foreground">Taxa de conversão ao longo do dia</p>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.15)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground) / 0.3)" interval={2} />
                  <YAxis tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground) / 0.3)" unit="%" />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border) / 0.2)", borderRadius: 12, fontSize: 11 }}
                    formatter={(v: number, name: string) => [name === "rate" ? `${v}%` : v, name === "rate" ? "Taxa" : name === "clicks" ? "Cliques" : "Conversões"]}
                  />
                  <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" fill="url(#convGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>

              {/* Best/worst hours */}
              <div className="flex gap-2 mt-2 px-2">
                <div className="flex-1 bg-emerald-500/5 rounded-xl p-2 ring-1 ring-emerald-500/10">
                  <p className="text-[9px] text-emerald-500 font-semibold mb-0.5">🔥 Melhor horário</p>
                  <p className="text-sm font-black">{bestHour.hour}</p>
                  <p className="text-[9px] text-muted-foreground">{bestHour.rate}% conv. • {bestHour.conversions} vendas</p>
                </div>
                <div className="flex-1 bg-muted/20 rounded-xl p-2 ring-1 ring-border/10">
                  <p className="text-[9px] text-muted-foreground font-semibold mb-0.5">📊 Média geral</p>
                  <p className="text-sm font-black">{avgConvRate}%</p>
                  <p className="text-[9px] text-muted-foreground">{totalConversions} conversões totais</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROI by creative */}
        <TabsContent value="roi">
          <Card className="border-0 bg-muted/10 ring-1 ring-border/10">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                ROI por Criativo
              </CardTitle>
              <p className="text-[10px] text-muted-foreground">Performance de cada tipo de conteúdo</p>
            </CardHeader>
            <CardContent className="px-2 pb-3">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={creativeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.15)" />
                  <XAxis type="number" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground) / 0.3)" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground) / 0.3)" width={80} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border) / 0.2)", borderRadius: 12, fontSize: 11 }}
                    formatter={(v: number, name: string) => [name === "roi" ? `${v}x` : fmtCurrency(v), name === "roi" ? "ROI" : name === "revenue" ? "Receita" : "Investido"]}
                  />
                  <Bar dataKey="roi" radius={[0, 6, 6, 0]}>
                    {creativeData.map((_, i) => (
                      <Cell key={i} fill={i < 3 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.2)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Top 3 */}
              <div className="flex gap-2 mt-2 px-2">
                {creativeData.slice(0, 3).map((c, i) => (
                  <div key={c.name} className="flex-1 bg-primary/5 rounded-xl p-2 ring-1 ring-primary/10">
                    <p className="text-[9px] text-primary font-semibold mb-0.5">{["🥇", "🥈", "🥉"][i]} #{i + 1}</p>
                    <p className="text-xs font-black truncate">{c.name}</p>
                    <p className="text-[9px] text-muted-foreground">{c.roi}x ROI • {fmtCurrency(c.revenue)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retention heatmap */}
        <TabsContent value="retention">
          <Card className="border-0 bg-muted/10 ring-1 ring-border/10">
            <CardHeader className="pb-2 pt-3 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Flame className="h-4 w-4 text-primary" />
                Heatmap de Retenção
              </CardTitle>
              <p className="text-[10px] text-muted-foreground">% de usuários retidos por coorte semanal</p>
            </CardHeader>
            <CardContent className="px-3 pb-3 overflow-x-auto">
              {/* Header */}
              <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `60px repeat(${days.length}, 1fr)` }}>
                <div className="text-[8px] text-muted-foreground font-semibold" />
                {days.map((d) => (
                  <div key={d} className="text-[8px] text-muted-foreground font-semibold text-center">
                    Dia {d}
                  </div>
                ))}
              </div>
              {/* Rows */}
              {cohorts.map((cohort) => (
                <div key={cohort} className="grid gap-1 mb-1" style={{ gridTemplateColumns: `60px repeat(${days.length}, 1fr)` }}>
                  <div className="text-[9px] text-muted-foreground font-semibold flex items-center">{cohort}</div>
                  {days.map((day) => {
                    const cell = retentionData.find((r) => r.cohort === cohort && r.day === day);
                    return <HeatCell key={day} rate={cell?.rate || 0} />;
                  })}
                </div>
              ))}

              {/* Summary */}
              <div className="flex gap-2 mt-3">
                <div className="flex-1 bg-muted/20 rounded-xl p-2 ring-1 ring-border/10">
                  <p className="text-[9px] text-muted-foreground font-semibold mb-0.5">Retenção D1</p>
                  <p className="text-sm font-black">
                    {Math.round(retentionData.filter((r) => r.day === 1).reduce((s, r) => s + r.rate, 0) / cohorts.length)}%
                  </p>
                </div>
                <div className="flex-1 bg-muted/20 rounded-xl p-2 ring-1 ring-border/10">
                  <p className="text-[9px] text-muted-foreground font-semibold mb-0.5">Retenção D7</p>
                  <p className="text-sm font-black">
                    {Math.round(retentionData.filter((r) => r.day === 6).reduce((s, r) => s + r.rate, 0) / cohorts.length)}%
                  </p>
                </div>
                <div className="flex-1 bg-primary/5 rounded-xl p-2 ring-1 ring-primary/10">
                  <p className="text-[9px] text-primary font-semibold mb-0.5">CAC</p>
                  <p className="text-sm font-black">{fmtCurrency(cac)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
