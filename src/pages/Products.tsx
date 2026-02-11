import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, Percent, DollarSign, Building2, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductWithBrand {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  currency: string;
  commission_type: string;
  commission_value: number;
  category: string | null;
  active: boolean;
  brands: { name: string; slug: string; logo_url: string | null; verified: boolean } | null;
}

const CATEGORIES = ["Todos", "Saúde", "Beleza", "Educação", "Tecnologia", "Finanças", "Fitness", "Alimentação", "Moda", "Outro"];

export default function Products() {
  const [products, setProducts] = useState<ProductWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("*, brands(name, slug, logo_url, verified)")
        .eq("active", true)
        .order("created_at", { ascending: false });
      setProducts((data as ProductWithBrand[]) || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "Todos" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container max-w-5xl mx-auto px-4 py-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">Produtos</h1>
        <p className="text-sm text-muted-foreground">Encontre produtos para promover e ganhar comissões</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl bg-muted/50 border-0 focus-visible:ring-primary/50"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0",
              category === cat
                ? "bg-gradient-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <SlidersHorizontal className="h-3 w-3" />
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[4/3] rounded-xl" />
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-14 w-14 mx-auto mb-3 text-muted-foreground/25" />
          <p className="font-semibold text-foreground">Nenhum produto encontrado</p>
          <p className="text-sm text-muted-foreground mt-1">Tente outra busca ou categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((product) => (
            <Card key={product.id} className="overflow-hidden card-hover border-border/50 group">
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                {product.commission_value > 0 && (
                  <Badge className="absolute top-2 right-2 bg-success text-success-foreground border-0 text-[10px] shadow-md">
                    {product.commission_type === "percentage" ? <Percent className="h-2.5 w-2.5 mr-0.5" /> : <DollarSign className="h-2.5 w-2.5 mr-0.5" />}
                    {Number(product.commission_value)}{product.commission_type === "percentage" ? "%" : ""}
                  </Badge>
                )}
                {product.category && (
                  <Badge variant="secondary" className="absolute top-2 left-2 text-[10px] bg-background/80 backdrop-blur-sm">
                    {product.category}
                  </Badge>
                )}
              </div>
              <CardContent className="p-3 space-y-1.5">
                <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                {product.description && (
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{product.description}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-foreground text-sm">
                    {product.currency === "BRL" ? "R$" : "$"} {Number(product.price).toFixed(2)}
                  </span>
                </div>
                {product.brands && (
                  <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                    <div className="h-5 w-5 rounded-md bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {product.brands.logo_url ? (
                        <img src={product.brands.logo_url} alt={product.brands.name} className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate">{product.brands.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
