import { Product } from "@/hooks/useBrand";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Trash2, Percent, DollarSign, Pencil } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  product: Product;
  onDelete?: (id: string) => void;
  onEdit?: (product: Product) => void;
  readonly?: boolean;
}

export function ProductCard({ product, onDelete, onEdit, readonly }: Props) {
  return (
    <Card className="overflow-hidden card-hover border-border/50">
      <div className="aspect-[4/3] bg-muted relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1.5">
          {product.active ? (
            <Badge className="bg-success text-success-foreground border-0 text-[10px]">Ativo</Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px]">Inativo</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-3 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">
            {product.currency === "BRL" ? "R$" : "$"} {Number(product.price).toFixed(2)}
          </span>
          <span className="flex items-center gap-1 text-xs text-success font-medium">
            {product.commission_type === "percentage" ? <Percent className="h-3 w-3" /> : <DollarSign className="h-3 w-3" />}
            {Number(product.commission_value)}{product.commission_type === "percentage" ? "%" : ""}
          </span>
        </div>
        {!readonly && (
          <div className="flex gap-1.5">
            {onEdit && (
              <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground" onClick={() => onEdit(product)}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex-1 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remover
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover produto?</AlertDialogTitle>
                    <AlertDialogDescription>
                      "{product.name}" será removido permanentemente. Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Remover
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
