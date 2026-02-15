import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    currency: string;
    imageUrl?: string;
    commissionValue: number;
    commissionType: string;
    brandName?: string;
  };
}

export function useCart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const { data } = await supabase
        .from("cart_items")
        .select("id, product_id, quantity")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!data || data.length === 0) { setItems([]); setLoading(false); return; }

      const productIds = data.map((d) => d.product_id);
      const { data: products } = await supabase
        .from("products")
        .select("id, name, price, currency, image_url, commission_value, commission_type, brand_id")
        .in("id", productIds);

      const brandIds = [...new Set(products?.map((p) => p.brand_id) || [])];
      const { data: brands } = await supabase
        .from("brands")
        .select("id, name")
        .in("id", brandIds);

      const brandMap = new Map(brands?.map((b) => [b.id, b.name]) || []);
      const productMap = new Map(products?.map((p) => [p.id, p]) || []);

      setItems(
        data.map((item) => {
          const p = productMap.get(item.product_id);
          return {
            id: item.id,
            productId: item.product_id,
            quantity: item.quantity,
            product: {
              name: p?.name || "Produto",
              price: p?.price || 0,
              currency: p?.currency || "BRL",
              imageUrl: p?.image_url || undefined,
              commissionValue: p?.commission_value || 0,
              commissionType: p?.commission_type || "percentage",
              brandName: p ? brandMap.get(p.brand_id) : undefined,
            },
          };
        })
      );
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = useCallback(async (productId: string, quantity = 1) => {
    if (!user) {
      toast({ title: "Faça login", description: "Você precisa estar logado para adicionar ao carrinho" });
      return;
    }
    try {
      const { data: existing } = await supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .limit(1);

      if (existing && existing.length > 0) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing[0].quantity + quantity })
          .eq("id", existing[0].id);
      } else {
        await supabase
          .from("cart_items")
          .insert({ user_id: user.id, product_id: productId, quantity });
      }
      toast({ title: "Adicionado ao carrinho! 🛒" });
      await fetchCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  }, [user, fetchCart, toast]);

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await supabase.from("cart_items").delete().eq("id", cartItemId);
    } else {
      await supabase.from("cart_items").update({ quantity }).eq("id", cartItemId);
    }
    await fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (cartItemId: string) => {
    await supabase.from("cart_items").delete().eq("id", cartItemId);
    await fetchCart();
  }, [fetchCart]);

  const clearCart = useCallback(async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  }, [user]);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, loading, total, itemCount, addToCart, updateQuantity, removeItem, clearCart, fetchCart };
}
