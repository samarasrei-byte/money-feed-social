import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function CartSheet() {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gradient-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrinho ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Seu carrinho está vazio</p>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => { setOpen(false); navigate("/products"); }}
            >
              Ver Produtos
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-3 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.product.name}</p>
                    {item.product.brandName && (
                      <p className="text-[11px] text-muted-foreground">{item.product.brandName}</p>
                    )}
                    <p className="text-sm font-bold text-primary mt-0.5">
                      {item.product.currency === "BRL" ? "R$" : "$"}{" "}
                      {(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border/30 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-lg font-bold">R$ {total.toFixed(2)}</span>
              </div>
              <Button
                className="w-full bg-gradient-primary border-0 rounded-xl h-12 text-base font-semibold"
                onClick={() => { setOpen(false); navigate("/checkout"); }}
              >
                Finalizar Compra
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
