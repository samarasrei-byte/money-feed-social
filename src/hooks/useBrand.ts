import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  verified: boolean;
  status: string;
  created_at: string;
}

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  price: number;
  currency: string;
  commission_type: string;
  commission_value: number;
  category: string | null;
  active: boolean;
  promo_materials: any;
  created_at: string;
}

export interface Campaign {
  id: string;
  brand_id: string;
  product_id: string | null;
  name: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  bonus_percentage: number;
  max_affiliates: number | null;
  status: string;
  created_at: string;
}

export function useBrand() {
  const { user } = useAuth();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrand = async () => {
    if (!user) { setLoading(false); return; }
    try {
      const { data } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      setBrand(data as Brand | null);
      if (data) {
        await Promise.all([fetchProducts(data.id), fetchCampaigns(data.id)]);
      }
    } catch (e) {
      console.error("Error fetching brand:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (brandId: string) => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
  };

  const fetchCampaigns = async (brandId: string) => {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("brand_id", brandId)
      .order("created_at", { ascending: false });
    setCampaigns((data as Campaign[]) || []);
  };

  const createBrand = async (input: { name: string; slug: string; description?: string; logo_url?: string; website?: string }) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("brands")
      .insert({ ...input, user_id: user.id })
      .select()
      .single();
    if (error) throw error;
    setBrand(data as Brand);
    return data;
  };

  const createProduct = async (input: Omit<Product, "id" | "created_at" | "brand_id"> & { brand_id?: string }) => {
    if (!brand) return null;
    const { data, error } = await supabase
      .from("products")
      .insert({ ...input, brand_id: brand.id })
      .select()
      .single();
    if (error) throw error;
    setProducts((prev) => [data as Product, ...prev]);
    return data;
  };

  const createCampaign = async (input: Partial<Campaign>) => {
    if (!brand) return null;
    const { data, error } = await supabase
      .from("campaigns")
      .insert({ ...input, brand_id: brand.id } as any)
      .select()
      .single();
    if (error) throw error;
    setCampaigns((prev) => [data as Campaign, ...prev]);
    return data;
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = async (id: string, input: Partial<Product>) => {
    const { data, error } = await supabase
      .from("products")
      .update(input as any)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    setProducts((prev) => prev.map((p) => (p.id === id ? (data as Product) : p)));
    return data;
  };

  useEffect(() => { fetchBrand(); }, [user]);

  return {
    brand, products, campaigns, loading,
    createBrand, createProduct, createCampaign, deleteProduct, updateProduct,
    refetch: fetchBrand,
  };
}
