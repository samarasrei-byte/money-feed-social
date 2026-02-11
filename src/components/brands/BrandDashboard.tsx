import { Brand, Product, Campaign } from "@/hooks/useBrand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./ProductCard";
import { CreateProductSheet } from "./CreateProductSheet";
import { CreateCampaignSheet } from "./CreateCampaignSheet";
import { Package, Megaphone, Users, TrendingUp, Building2, Globe, CheckCircle2, Clock } from "lucide-react";

interface Props {
  brand: Brand;
  products: Product[];
  campaigns: Campaign[];
  onCreateProduct: (data: any) => Promise<any>;
  onCreateCampaign: (data: any) => Promise<any>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export function BrandDashboard({ brand, products, campaigns, onCreateProduct, onCreateCampaign, onDeleteProduct }: Props) {
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const activeProducts = products.filter((p) => p.active);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Brand Header */}
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
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
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <Package className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{activeProducts.length}</p>
            <p className="text-[10px] text-muted-foreground">Produtos</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <Megaphone className="h-5 w-5 mx-auto text-accent mb-1" />
            <p className="text-2xl font-bold">{activeCampaigns.length}</p>
            <p className="text-[10px] text-muted-foreground">Campanhas</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-success mb-1" />
            <p className="text-2xl font-bold">0</p>
            <p className="text-[10px] text-muted-foreground">Vendas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="products">
        <TabsList className="w-full">
          <TabsTrigger value="products" className="flex-1">Produtos ({products.length})</TabsTrigger>
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
                <ProductCard key={p.id} product={p} onDelete={onDeleteProduct} />
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
                      <Badge variant={c.status === "active" ? "default" : "secondary"} className={c.status === "active" ? "bg-success text-success-foreground border-0" : ""}>
                        {c.status === "active" ? "Ativa" : "Encerrada"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {c.description && <p className="text-xs text-muted-foreground mb-2">{c.description}</p>}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {c.bonus_percentage > 0 && <span className="text-success font-medium">+{Number(c.bonus_percentage)}% bônus</span>}
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
    </div>
  );
}
