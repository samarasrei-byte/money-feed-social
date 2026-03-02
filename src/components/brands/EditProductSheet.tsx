import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { Product } from "@/hooks/useBrand";

interface Props {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: Partial<Product>) => Promise<any>;
}

const CATEGORIES = ["Saúde", "Beleza", "Educação", "Tecnologia", "Finanças", "Fitness", "Alimentação", "Moda", "Outro"];

export function EditProductSheet({ product, open, onOpenChange, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", commission_type: "percentage", commission_value: "", category: "", image_url: "", active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description || "",
        price: String(product.price),
        commission_type: product.commission_type,
        commission_value: String(product.commission_value),
        category: product.category || "",
        image_url: product.image_url || "",
        active: product.active,
      });
    }
  }, [product]);

  const update = (key: string, value: string | boolean) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !form.name.trim()) return;
    setLoading(true);
    try {
      await onUpdate(product.id, {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price) || 0,
        commission_type: form.commission_type,
        commission_value: parseFloat(form.commission_value) || 0,
        category: form.category || null,
        image_url: form.image_url || null,
        active: form.active,
      } as any);
      toast({ title: "Produto atualizado!" });
      onOpenChange(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Erro", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
        <SheetHeader><SheetTitle>Editar Produto</SheetTitle></SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 pb-6">
          <ImageUpload
            value={form.image_url || null}
            onChange={(url) => update("image_url", url || "")}
            folder="products"
            aspectRatio="aspect-[4/3]"
            placeholder="Foto do produto"
          />
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Preço (R$)</Label>
              <Input type="number" step="0.01" value={form.price} onChange={(e) => update("price", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo Comissão</Label>
              <Select value={form.commission_type} onValueChange={(v) => update("commission_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentual</SelectItem>
                  <SelectItem value="fixed">Fixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor Comissão</Label>
              <Input type="number" step="0.01" value={form.commission_value} onChange={(e) => update("commission_value", e.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
            <Label>Produto ativo</Label>
            <Switch checked={form.active} onCheckedChange={(v) => update("active", v)} />
          </div>
          <Button type="submit" className="w-full bg-gradient-primary border-0 text-primary-foreground" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
