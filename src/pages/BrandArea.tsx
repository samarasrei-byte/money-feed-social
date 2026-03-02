import { useBrand } from "@/hooks/useBrand";
import { useAuth } from "@/hooks/useAuth";
import { BrandRegistration } from "@/components/brands/BrandRegistration";
import { BrandDashboard } from "@/components/brands/BrandDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function BrandArea() {
  const { user, loading: authLoading } = useAuth();
  const { brand, products, campaigns, loading, createBrand, createProduct, createCampaign, deleteProduct, updateProduct } = useBrand();

  if (authLoading || loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-3 gap-3">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <LogIn className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h2 className="text-xl font-display font-bold mb-2">Faça login para continuar</h2>
        <p className="text-muted-foreground mb-6">Você precisa estar logado para acessar a área de marcas.</p>
        <Button asChild className="bg-gradient-primary border-0 text-primary-foreground">
          <Link to="/auth">Entrar</Link>
        </Button>
      </div>
    );
  }

  if (!brand) {
    return <BrandRegistration onRegister={createBrand} />;
  }

  return (
    <BrandDashboard
      brand={brand}
      products={products}
      campaigns={campaigns}
      onCreateProduct={createProduct}
      onCreateCampaign={createCampaign}
      onDeleteProduct={deleteProduct}
      onUpdateProduct={updateProduct}
    />
  );
}
