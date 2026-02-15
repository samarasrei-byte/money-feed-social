import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, Percent, DollarSign, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductWithBrand {
  id: string; name: string; description: string | null; image_url: string | null;
  price: number; currency: string; commission_type: string; commission_value: number;
  category: string | null; active: boolean;
  brands: { name: string; slug: string; logo_url: string | null; verified: boolean } | null;
}

const CATEGORIES = ["Todos", "Saúde", "Beleza", "Educação", "Tecnologia", "Finanças", "Fitness", "Alimentação", "Moda", "Outro"];

export default function Products() {
  const [products, setProducts] = useState<ProductWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from("products").select("*, brands(name, slug, logo_url, verified)").eq("active", true).order("created_at", { ascending: false });
      setProducts((data as ProductWithBrand[]) || []); setLoading(false);
    }; fetch();
  }, []);

  const filtered = products.filter(p => {
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const mc = category === "Todos" || p.category === category;
    return ms && mc;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 space-y-4">
      <div>
        <h1 className="text-lg font-bold">Produtos</h1>
        <p className="text-xs text-muted-foreground">Encontre produtos para promover e ganhar comissões</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input placeholder="Buscar produtos..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-xs rounded-lg bg-muted/30 border-border/30" />
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-0.5">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={cn("px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors shrink-0", category === cat ? "bg-foreground text-background" : "bg-muted/40 text-muted-foreground")}>
            {cat}
          </button>
        ))}
      </div>

      {!loading && <p className="text-[10px] text-muted-foreground">{filtered.length} produto{filtered.length !== 1 ? "s" : ""}</p>}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="space-y-1.5"><Skeleton className="aspect-[4/3] rounded-lg" /><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="h-10 w-10 mx-auto text-muted-foreground/15 mb-3" />
          <p className="text-sm font-medium">Nenhum produto encontrado</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Tente outra busca ou categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {filtered.map(product => (
            <div key={product.id} className="rounded-xl border border-border/30 overflow-hidden bg-background group">
              <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground/15" /></div>
                )}
                {product.commission_value > 0 && (
                  <Badge className="absolute top-1.5 right-1.5 bg-emerald-500 text-white border-0 text-[9px] px-1.5 py-0.5">
                    {product.commission_type === "percentage" ? <Percent className="h-2.5 w-2.5 mr-0.5" /> : <DollarSign className="h-2.5 w-2.5 mr-0.5" />}
                    {Number(product.commission_value)}{product.commission_type === "percentage" ? "%" : ""}
                  </Badge>
                )}
              </div>
              <div className="p-2.5 space-y-1">
                <h3 className="font-semibold text-xs line-clamp-1">{product.name}</h3>
                {product.description && <p className="text-[10px] text-muted-foreground line-clamp-2">{product.description}</p>}
                <p className="font-bold text-xs">{product.currency === "BRL" ? "R$" : "$"} {Number(product.price).toFixed(2)}</p>
                {product.brands && (
                  <div className="flex items-center gap-1.5 pt-1 border-t border-border/20">
                    <div className="h-4 w-4 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      {product.brands.logo_url ? <img src={product.brands.logo_url} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-2.5 w-2.5 text-muted-foreground" />}
                    </div>
                    <span className="text-[9px] text-muted-foreground truncate">{product.brands.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
